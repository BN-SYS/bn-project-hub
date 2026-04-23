// =========================================================
// agent-files-2-sb.js — v2.0.1 SB 공통 세트
// 변경: pipeline.ps1 qa_precheck 제거, validate WBS phase 갱신
// =========================================================

function toB64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

var FILE_DEFS = window.FILE_DEFS || [];
var RAW_B64 = window.RAW_B64 || {};

// ═══════════════════════════════════════════════════════════
//  pipeline.ps1 — [개선] qa_precheck 제거 (스펙 생성 후 별도 실행)
// ═══════════════════════════════════════════════════════════

RAW_B64['pipeline_ps1'] = toB64(
'# pipeline.ps1 — 스토리보드 파이프라인 (v2.0.1)\n\
# capture → anno → extract 3단계만 실행.\n\
# qa_precheck는 포함하지 않음 — storyboard-agent가 스펙 생성 완료 후 별도 실행.\n\
# 사용법: powershell -ExecutionPolicy Bypass -File pipeline.ps1 [-pageId U03] [-skipCapture] [-fullRebuild]\n\
\n\
param(\n\
  [string]$pageId      = "",\n\
  [switch]$skipCapture = $false,\n\
  [switch]$fullRebuild = $false\n\
)\n\
$ErrorActionPreference = "Stop"\n\
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition\n\
$bsFile    = Join-Path $scriptDir "data\\.build_state.json"\n\
$logFile   = Join-Path $scriptDir "pipeline_run.log"\n\
\n\
function Log($msg) {\n\
  $ts = Get-Date -Format "HH:mm:ss"\n\
  $line = "[$ts] $msg"\n\
  Write-Host $line\n\
  Add-Content -Path $logFile -Value $line -Encoding UTF8\n\
}\n\
\n\
function Run-Step($name, $script, [hashtable]$params = @{}) {\n\
  Log "▶ $name 시작..."\n\
  $sw = [System.Diagnostics.Stopwatch]::StartNew()\n\
  try {\n\
    # 파라미터를 명시적 argument 문자열로 변환\n\
    $argList = @("-ExecutionPolicy", "Bypass", "-File", (Join-Path $scriptDir $script))\n\
    foreach ($kv in $params.GetEnumerator()) {\n\
      if ($kv.Value -is [switch] -or $kv.Value -eq $true) {\n\
        $argList += "-$($kv.Key)"\n\
      } else {\n\
        $argList += "-$($kv.Key)"\n\
        $argList += "$($kv.Value)"\n\
      }\n\
    }\n\
    $result = & powershell @argList 2>&1\n\
    $result | ForEach-Object { Log "  $_" }\n\
    if ($LASTEXITCODE -ne 0) {\n\
      Log "✗ $name FAIL (exit=$LASTEXITCODE)"\n\
      return $false\n\
    }\n\
    Log "✓ $name 완료 ($([math]::Round($sw.Elapsed.TotalSeconds,1))초)"\n\
    return $true\n\
  } catch {\n\
    Log "✗ $name 오류: $_"\n\
    return $false\n\
  }\n\
}\n\
\n\
# ── 메인 실행 ──────────────────────────────────────────────\n\
"pipeline.ps1: $(Get-Date -Format \'yyyy-MM-dd HH:mm\')" | Set-Content $logFile -Encoding UTF8\n\
Log "=== 파이프라인 시작 (pageId=$pageId, skipCapture=$skipCapture, fullRebuild=$fullRebuild) ==="\n\
\n\
$captureParams = @{}\n\
$annoParams    = @{}\n\
if ($pageId -ne "")      { $captureParams["pageId"] = $pageId }\n\
if ($fullRebuild)        { $captureParams["fullRebuild"] = $true; $annoParams["fullRebuild"] = $true }\n\
\n\
$allOk = $true\n\
\n\
# Step 1: 캡처\n\
if (-not $skipCapture) {\n\
  $ok = Run-Step "capture" "capture.ps1" $captureParams\n\
  if (-not $ok) { $allOk = $false; Log "⚠ 캡처 실패 — 이후 단계 계속 시도" }\n\
}\n\
\n\
# Step 2: 어노테이션 추출\n\
$ok = Run-Step "anno_gen_all" "anno_gen_all.ps1" $annoParams\n\
if (-not $ok) { $allOk = $false }\n\
\n\
# Step 3: anno elements 추출\n\
$ok = Run-Step "extract_anno" "extract_anno_elements.ps1" @{}\n\
if (-not $ok) { $allOk = $false }\n\
\n\
# ※ qa_precheck는 여기서 실행하지 않음.\n\
#   storyboard-agent가 스펙 생성 완료 후 별도 Bash로 실행한다.\n\
#   이유: qa_precheck는 specs 파일 존재를 검증하는데,\n\
#         이 시점에서는 아직 스펙이 생성되지 않았기 때문.\n\
\n\
# ── 최종 상태 기록 ─────────────────────────────────────────\n\
if (Test-Path $bsFile) {\n\
  $bs = Get-Content $bsFile -Encoding UTF8 | Out-String | ConvertFrom-Json\n\
  $failPages = 0; $okPages = 0; $blockedPages = 0\n\
  if ($bs.pages) {\n\
    foreach ($p in $bs.pages.PSObject.Properties) {\n\
      $stages = $p.Value\n\
      if ($stages.capture -eq "FAIL" -or $stages.anno -eq "FAIL") { $failPages++ }\n\
      elseif ($stages.capture -eq "BLOCKED" -or $stages.anno -eq "BLOCKED") { $blockedPages++ }\n\
      else { $okPages++ }\n\
    }\n\
  }\n\
  # step을 "extracted"로 기록 (아직 스펙+QA 미완료이므로 "done" 아님)\n\
  $bs | Add-Member -NotePropertyName "step" -NotePropertyValue $(if ($allOk) {"extracted"} else {"partial"}) -Force\n\
  $bs | Add-Member -NotePropertyName "failCount" -NotePropertyValue $failPages -Force\n\
  $bs | Add-Member -NotePropertyName "pipelineAt" -NotePropertyValue (Get-Date -Format "yyyy-MM-dd HH:mm") -Force\n\
  $bs | ConvertTo-Json -Depth 10 | Set-Content $bsFile -Encoding UTF8\n\
  Log "=== 파이프라인 종료: OK=$okPages FAIL=$failPages BLOCKED=$blockedPages ==="\n\
  Log "※ qa_precheck는 스펙 생성 후 별도 실행 필요"\n\
} else {\n\
  Log "=== 파이프라인 종료: build_state 없음 ==="\n\
}\n\
\n\
if ($allOk) { exit 0 } else { exit 1 }\n\
'
);

// ═══════════════════════════════════════════════════════════
//  validate_phase.ps1 — [개선] WBS phase 검증 v2.0 구조에 맞게 갱신
// ═══════════════════════════════════════════════════════════

RAW_B64['validate_ps1'] = toB64(
'# validate_phase.ps1 — v2.0.1 단계 전환 유효성 검사\n\
# 사용법: powershell -File validate_phase.ps1 -phase 02_planning\n\
# 출력:   { "pass": true/false, "phase": "...", "errors": [...], "warnings": [...] }\n\
#\n\
# case 이름 규칙: "XX_phase"는 "XX 단계로 진입하기 위한 게이트"를 의미.\n\
# 예: "03_requirements" = 모듈 3에 진입하기 위해 모듈 2 산출물을 검증.\n\
\n\
param(\n\
  [Parameter(Mandatory=$true)][string]$phase,\n\
  [string]$projectRoot = (Get-Location).Path\n\
)\n\
$ErrorActionPreference = "Continue"\n\
$errors = @(); $warnings = @()\n\
\n\
function Assert-File($path, $label) {\n\
  if (-not (Test-Path $path)) { $script:errors += "파일 없음: $label"; return $false }\n\
  return $true\n\
}\n\
function Read-Json($path) {\n\
  try { return (Get-Content $path -Encoding UTF8 -Raw | ConvertFrom-Json) }\n\
  catch { $script:errors += "JSON 오류: $path — $_"; return $null }\n\
}\n\
\n\
switch ($phase) {\n\
\n\
  # 모듈 2 진입 게이트: 모듈 1 산출물 검증\n\
  "02_planning" {\n\
    Assert-File "$projectRoot/01_rfp/rfp_분석서.md" "rfp_분석서.md" | Out-Null\n\
    if (Assert-File "$projectRoot/01_rfp/기능목록_초안.json" "기능목록_초안.json") {\n\
      $f = Read-Json "$projectRoot/01_rfp/기능목록_초안.json"\n\
      if ($f -and $f.Count -eq 0) { $errors += "기능목록_초안.json 비어있음" }\n\
    }\n\
  }\n\
\n\
  # 모듈 3 진입 게이트: 모듈 2 산출물 검증\n\
  "03_requirements" {\n\
    Assert-File "$projectRoot/02_planning/기획서.md" "기획서.md" | Out-Null\n\
    if (Assert-File "$projectRoot/02_planning/wbs.json" "wbs.json") {\n\
      $wbs = Read-Json "$projectRoot/02_planning/wbs.json"\n\
      if ($wbs) {\n\
        $phases = $wbs | ForEach-Object { $_.phase }\n\
        # v2.0 필수 phase: 프로토타입 우선 프로세스 반영\n\
        $required = @("기획", "프로토타입", "디자인조정", "퍼블리싱", "백엔드개발", "QA", "납품")\n\
        foreach ($r in $required) {\n\
          if ($phases -notcontains $r) { $errors += "wbs.json phase 누락: \'$r\'" }\n\
        }\n\
        $total = ($wbs | ForEach-Object { $_.tasks.Count } | Measure-Object -Sum).Sum\n\
        if ($total -lt 5) { $warnings += "태스크 수($total)가 너무 적음" }\n\
      }\n\
    }\n\
  }\n\
\n\
  # 모듈 4 진입 게이트: 모듈 3 산출물 검증\n\
  "04_storyboard" {\n\
    Assert-File "$projectRoot/03_requirements/요구사항_정의서.md" "요구사항_정의서.md" | Out-Null\n\
    if (Assert-File "$projectRoot/03_requirements/pages_draft.json" "pages_draft.json") {\n\
      $draft = Read-Json "$projectRoot/03_requirements/pages_draft.json"\n\
      if ($draft) {\n\
        if (($draft | Where-Object { $_.section -eq "user" }).Count -eq 0) {\n\
          $errors += "pages_draft.json에 user 섹션 없음"\n\
        }\n\
        if (($draft | Where-Object { $_.section -eq "admin" }).Count -eq 0) {\n\
          $warnings += "pages_draft.json에 admin 섹션 없음 (관리자 없는 프로젝트면 무시)"\n\
        }\n\
        $ids = $draft | ForEach-Object { $_.id }\n\
        $dups = $ids | Group-Object | Where-Object { $_.Count -gt 1 } | ForEach-Object { $_.Name }\n\
        if ($dups.Count -gt 0) { $errors += "중복 ID: $($dups -join \', \')" }\n\
        $missing = $draft | Where-Object { -not $_.id -or -not $_.section -or -not $_.name -or -not $_.path }\n\
        if ($missing.Count -gt 0) { $errors += "필수 필드 누락 $($missing.Count)개" }\n\
      }\n\
    }\n\
  }\n\
\n\
  # 모듈 5 진입 게이트: 모듈 4 산출물 검증\n\
  "05_dev_handoff" {\n\
    $pagesPath = "$projectRoot/04_storyboard/story_board/data/pages.json"\n\
    $specsDir  = "$projectRoot/04_storyboard/story_board/data/specs"\n\
    $bsPath    = "$projectRoot/04_storyboard/story_board/data/.build_state.json"\n\
    if (Assert-File $pagesPath "pages.json") {\n\
      $p = Read-Json $pagesPath\n\
      if ($p -and $p.Count -eq 0) { $errors += "pages.json 비어있음" }\n\
    }\n\
    if (Test-Path $specsDir) {\n\
      $specs = Get-ChildItem $specsDir -Filter "*.js" | Where-Object { $_.Name -ne "_common.js" }\n\
      if ($specs.Count -eq 0) { $errors += "specs/ 화면 스펙 없음" }\n\
      # meta.json 존재 확인\n\
      $metas = Get-ChildItem $specsDir -Filter "*.meta.json"\n\
      if ($metas.Count -eq 0) { $warnings += "specs/*.meta.json 없음 — dev-qa-agent가 폴백(.js Read) 사용" }\n\
      elseif ($metas.Count -lt $specs.Count) { $warnings += "meta.json($($metas.Count))이 specs($($specs.Count))보다 적음" }\n\
    } else { $errors += "specs/ 폴더 없음" }\n\
    if (Assert-File $bsPath ".build_state.json") {\n\
      $bs = Read-Json $bsPath\n\
      if ($bs) {\n\
        if ($bs.step -ne "done") { $errors += "build_state.step=\'$($bs.step)\' (done 아님)" }\n\
        if ($bs.failCount -gt 0) { $errors += "build_state.failCount=$($bs.failCount)" }\n\
      }\n\
    }\n\
  }\n\
\n\
  # 모듈 6 진입 게이트: 모듈 5 산출물 검증\n\
  "06_qa" {\n\
    Assert-File "$projectRoot/05_dev_handoff/개발전달서.md" "개발전달서.md" | Out-Null\n\
    if (Assert-File "$projectRoot/05_dev_handoff/api_spec.md" "api_spec.md") {\n\
      $lines = (Get-Content "$projectRoot/05_dev_handoff/api_spec.md" -Encoding UTF8).Count\n\
      if ($lines -le 5) { $errors += "api_spec.md 너무 짧음 ($lines줄)" }\n\
    }\n\
  }\n\
\n\
  # 모듈 7 진입 게이트: 모듈 6 산출물 검증\n\
  "07_delivery" {\n\
    if (Assert-File "$projectRoot/06_qa/qa_checklist.json" "qa_checklist.json") {\n\
      $qa = Read-Json "$projectRoot/06_qa/qa_checklist.json"\n\
      if ($qa) {\n\
        $total = ($qa | ForEach-Object { $_.tests.Count } | Measure-Object -Sum).Sum\n\
        if ($total -eq 0) { $errors += "qa_checklist.json 테스트 없음" }\n\
      }\n\
    }\n\
  }\n\
\n\
  default {\n\
    $errors += "알 수 없는 phase: $phase. 유효값: 02_planning 03_requirements 04_storyboard 05_dev_handoff 06_qa 07_delivery"\n\
  }\n\
}\n\
\n\
@{ pass=($errors.Count -eq 0); phase=$phase; errors=$errors; warnings=$warnings } | ConvertTo-Json -Compress\n\
'
);

// ═══════════════════════════════════════════════════════════
//  capture.ps1 — 변경 없음
// ═══════════════════════════════════════════════════════════

RAW_B64['sb_capture'] = toB64(
'# capture.ps1 — 스토리보드 캡처 (v2.0)\n\
# PS 7+ 병렬 처리 / PS 5.1 직렬 폴백\n\
# 실행: powershell -ExecutionPolicy Bypass -File capture.ps1 [-pageId U03] [-fullRebuild]\n\
\n\
param(\n\
  [string]$pageId      = "",\n\
  [switch]$fullRebuild = $false\n\
)\n\
$ErrorActionPreference = "Stop"\n\
\n\
$scriptDir  = Split-Path -Parent $MyInvocation.MyCommand.Definition\n\
$pagesJson  = Join-Path $scriptDir "data\\pages.json"\n\
$outputsDir = Join-Path $scriptDir "..\\outputs"\n\
$imagesDir  = Join-Path $scriptDir "images"\n\
$logFile    = Join-Path $scriptDir "capture_run.log"\n\
$stateFile  = Join-Path $scriptDir "data\\.capture_state.json"\n\
$bsFile     = Join-Path $scriptDir "data\\.build_state.json"\n\
\n\
function Save-BuildState($filePath, $data) {\n\
  $lockFile = "$filePath.lock"; $maxWait = 10; $waited = 0\n\
  while ((Test-Path $lockFile) -and $waited -lt $maxWait) { Start-Sleep -Milliseconds 500; $waited += 0.5 }\n\
  New-Item $lockFile -ItemType File -Force | Out-Null\n\
  try { $data | ConvertTo-Json -Depth 10 | Set-Content $filePath -Encoding UTF8 }\n\
  finally { Remove-Item $lockFile -Force -ErrorAction SilentlyContinue }\n\
}\n\
function Load-BuildState($filePath) {\n\
  $lockFile = "$filePath.lock"; $maxWait = 10; $waited = 0\n\
  while ((Test-Path $lockFile) -and $waited -lt $maxWait) { Start-Sleep -Milliseconds 500; $waited += 0.5 }\n\
  if (Test-Path $filePath) { try { return (Get-Content $filePath -Encoding UTF8 | Out-String | ConvertFrom-Json -AsHashtable) } catch { return @{ pages = @{} } } }\n\
  return @{ buildId = (Get-Date -Format "yyyy-MM-dd_HH:mm"); mode = "incremental"; pages = @{}; summary = @{} }\n\
}\n\
\n\
$chromePath = $null\n\
$candidates = @(\n\
  (Get-Command "chrome.exe" -ErrorAction SilentlyContinue)?.Source,\n\
  (Get-Command "chrome" -ErrorAction SilentlyContinue)?.Source,\n\
  "$env:LOCALAPPDATA\\Google\\Chrome\\Application\\chrome.exe",\n\
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",\n\
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"\n\
)\n\
foreach ($c in $candidates) { if ($c -and (Test-Path $c)) { $chromePath = $c; break } }\n\
if (-not $chromePath) { Write-Host "FAIL: Chrome 없음"; exit 1 }\n\
if (-not (Test-Path $pagesJson)) { Write-Host "FAIL: pages.json 없음"; exit 1 }\n\
if (-not (Test-Path $imagesDir)) { New-Item -ItemType Directory -Path $imagesDir | Out-Null }\n\
\n\
$pages = Get-Content $pagesJson -Encoding UTF8 | Out-String | ConvertFrom-Json\n\
$state = @{}\n\
if ((Test-Path $stateFile) -and -not $fullRebuild) {\n\
  $state = Get-Content $stateFile -Encoding UTF8 | Out-String | ConvertFrom-Json -AsHashtable\n\
}\n\
\n\
if ($pageId -ne "") { $pages = $pages | Where-Object { $_.id -eq $pageId } }\n\
elseif (-not $fullRebuild) {\n\
  $pages = $pages | Where-Object {\n\
    $_.path -ne "#" -and $_.section -ne "doc" -and\n\
    (($_.tags -contains "changed") -or (-not (Test-Path (Join-Path $imagesDir $_.img))) -or (-not $state.ContainsKey($_.id)))\n\
  }\n\
} else {\n\
  $pages = $pages | Where-Object { $_.path -ne "#" -and $_.section -ne "doc" }\n\
}\n\
\n\
$viewport = 1920; $global:wsId = 0\n\
"capture.ps1: $(Get-Date -Format \'yyyy-MM-dd HH:mm\') | fullRebuild=$fullRebuild" | Set-Content $logFile -Encoding UTF8\n\
function Log($msg) { Add-Content -Path $logFile -Value $msg -Encoding UTF8 }\n\
function Get-WaitMs($p) {\n\
  if (-not (Test-Path $p)) { return 2000 }\n\
  $s = (Get-Item $p).Length\n\
  if ($s -lt 40000) { return 1500 } elseif ($s -lt 80000) { return 2500 } else { return 3500 }\n\
}\n\
\n\
function Start-CDPCapture($fileUri, $imgPath, $pageName, $waitMs) {\n\
  $port = Get-Random -Minimum 9300 -Maximum 9400\n\
  $proc = Start-Process -FilePath $chromePath -ArgumentList @(\n\
    "--headless=new","--remote-debugging-port=$port",\n\
    "--window-size=$viewport,900","--no-sandbox","--disable-gpu",$fileUri\n\
  ) -PassThru\n\
  Start-Sleep -Milliseconds $waitMs\n\
  try {\n\
    $wsUrl = (Invoke-RestMethod "http://localhost:$port/json").webSocketDebuggerUrl | Select-Object -First 1\n\
    $ws = New-Object System.Net.WebSockets.ClientWebSocket\n\
    $ws.ConnectAsync([Uri]$wsUrl, [System.Threading.CancellationToken]::None).Wait()\n\
    $buf = [System.Text.Encoding]::UTF8.GetBytes(\'{"id":1,"method":"Page.captureScreenshot","params":{"format":"png","captureBeyondViewport":true}}\')\n\
    $ws.SendAsync([ArraySegment[byte]]$buf, 1, $true, [System.Threading.CancellationToken]::None).Wait()\n\
    Start-Sleep -Milliseconds 500\n\
    $ms = New-Object System.IO.MemoryStream; $ch = [byte[]]::new(65536)\n\
    $cs = New-Object System.Threading.CancellationTokenSource; $cs.CancelAfter(30000)\n\
    do { $r = $ws.ReceiveAsync([ArraySegment[byte]]$ch, $cs.Token).GetAwaiter().GetResult(); $ms.Write($ch,0,$r.Count) } while (-not $r.EndOfMessage)\n\
    $resp = [System.Text.Encoding]::UTF8.GetString($ms.ToArray()) | ConvertFrom-Json\n\
    if ($resp.result.data) {\n\
      [System.IO.File]::WriteAllBytes($imgPath, [Convert]::FromBase64String($resp.result.data))\n\
      Log "  OK $pageName"; return "OK"\n\
    } else { Log "  FAIL $pageName (data없음)"; return "FAIL" }\n\
  } catch { Log "  FAIL $pageName - $_"; return "FAIL" }\n\
  finally { Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue }\n\
}\n\
\n\
if ($pages.Count -eq 0) { Write-Host "캡처 완료: 변경 없음"; exit 0 }\n\
\n\
$captureResults = [System.Collections.Concurrent.ConcurrentDictionary[string,string]]::new()\n\
$syncState = [System.Collections.Concurrent.ConcurrentDictionary[string,string]]::new()\n\
$throttle = 5\n\
$psMajor = $PSVersionTable.PSVersion.Major\n\
\n\
if ($psMajor -ge 7) {\n\
  $pages | ForEach-Object -Parallel {\n\
    $page = $_; $outputsDir = $using:outputsDir; $imagesDir = $using:imagesDir\n\
    $chromePath = $using:chromePath; $viewport = $using:viewport\n\
    $captureResults = $using:captureResults; $syncState = $using:syncState; $logFile = $using:logFile\n\
    $htmlPath = Join-Path $outputsDir $page.path.TrimStart("../")\n\
    if (-not (Test-Path $htmlPath)) { $captureResults[$page.id] = "SKIP"; return }\n\
    $port = 9300 + ([System.Threading.Thread]::CurrentThread.ManagedThreadId % 100)\n\
    $fileUri = "file:///" + $htmlPath.Replace("\\","/")\n\
    $imgPath = Join-Path $imagesDir $page.img\n\
    $proc = Start-Process -FilePath $chromePath -ArgumentList @(\n\
      "--headless=new","--remote-debugging-port=$port","--window-size=$viewport,900","--no-sandbox","--disable-gpu",$fileUri\n\
    ) -PassThru\n\
    Start-Sleep -Milliseconds 2000\n\
    try {\n\
      $wsUrl = (Invoke-RestMethod "http://localhost:$port/json").webSocketDebuggerUrl | Select-Object -First 1\n\
      $ws = New-Object System.Net.WebSockets.ClientWebSocket\n\
      $ws.ConnectAsync([Uri]$wsUrl, [System.Threading.CancellationToken]::None).Wait()\n\
      $buf = [System.Text.Encoding]::UTF8.GetBytes(\'{"id":1,"method":"Page.captureScreenshot","params":{"format":"png","captureBeyondViewport":true}}\')\n\
      $ws.SendAsync([ArraySegment[byte]]$buf,1,$true,[System.Threading.CancellationToken]::None).Wait()\n\
      $ms2 = New-Object System.IO.MemoryStream; $ch2 = [byte[]]::new(65536)\n\
      $cs2 = New-Object System.Threading.CancellationTokenSource; $cs2.CancelAfter(30000)\n\
      do { $r2 = $ws.ReceiveAsync([ArraySegment[byte]]$ch2,$cs2.Token).GetAwaiter().GetResult(); $ms2.Write($ch2,0,$r2.Count) } while (-not $r2.EndOfMessage)\n\
      $resp = [System.Text.Encoding]::UTF8.GetString($ms2.ToArray()) | ConvertFrom-Json\n\
      if ($resp.result.data) {\n\
        [System.IO.File]::WriteAllBytes($imgPath, [Convert]::FromBase64String($resp.result.data))\n\
        $captureResults[$page.id] = "OK"; $syncState[$page.id] = (Get-Date -Format "yyyy-MM-dd HH:mm")\n\
      } else { $captureResults[$page.id] = "FAIL" }\n\
    } catch { $captureResults[$page.id] = "FAIL" }\n\
    finally { Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue }\n\
  } -ThrottleLimit $throttle\n\
} else {\n\
  Write-Host "INFO: PS 5.1 — 직렬 모드"\n\
  foreach ($page in $pages) {\n\
    $htmlPath = Join-Path $outputsDir $page.path.TrimStart("../")\n\
    if (-not (Test-Path $htmlPath)) { $captureResults[$page.id] = "SKIP"; continue }\n\
    $result = Start-CDPCapture ("file:///" + $htmlPath.Replace("\\","/")) (Join-Path $imagesDir $page.img) $page.name (Get-WaitMs $htmlPath)\n\
    $captureResults[$page.id] = $result\n\
    if ($result -eq "OK") { $syncState[$page.id] = (Get-Date -Format "yyyy-MM-dd HH:mm") }\n\
  }\n\
}\n\
\n\
$okCount   = ($captureResults.Values | Where-Object { $_ -eq "OK"   }).Count\n\
$failCount = ($captureResults.Values | Where-Object { $_ -eq "FAIL" }).Count\n\
$skipCount = ($captureResults.Values | Where-Object { $_ -eq "SKIP" }).Count\n\
\n\
$stateObj = @{}; foreach ($kv in $syncState.GetEnumerator()) { $stateObj[$kv.Key] = $kv.Value }\n\
$stateObj | ConvertTo-Json | Set-Content $stateFile -Encoding UTF8\n\
\n\
$bs = Load-BuildState $bsFile\n\
if (-not $bs.buildId) { $bs.buildId = (Get-Date -Format "yyyy-MM-dd_HH:mm") }\n\
$bs.mode = if ($fullRebuild) {"full"} else {"incremental"}\n\
foreach ($id in $captureResults.Keys) {\n\
  if (-not $bs.pages.ContainsKey($id)) { $bs.pages[$id] = @{} }\n\
  $bs.pages[$id]["capture"] = $captureResults[$id]\n\
  if ($captureResults[$id] -eq "FAIL") {\n\
    foreach ($step in @("anno","publisher","extract","planner","qa")) { $bs.pages[$id][$step] = "BLOCKED" }\n\
  }\n\
}\n\
$bs.summary = @{ total=$pages.Count; ok=$okCount; fail=$failCount; skip=$skipCount }\n\
Save-BuildState $bsFile $bs\n\
Write-Host "캡처 완료: OK=$okCount SKIP=$skipCount FAIL=$failCount"\n\
'
);

// ═══════════════════════════════════════════════════════════
//  anno_gen_all.ps1 — 변경 없음
// ═══════════════════════════════════════════════════════════

RAW_B64['sb_annogenall'] = toB64(
'# anno_gen_all.ps1 — 어노테이션 일괄 추출 (v2.0)\n\
\n\
param([string]$section = "all", [switch]$fullRebuild = $false)\n\
$ErrorActionPreference = "Continue"\n\
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition\n\
$pagesJson = Join-Path $scriptDir "data\\pages.json"\n\
$specsDir = Join-Path $scriptDir "data\\specs"\n\
$outputsDir = Join-Path $scriptDir "..\\outputs"\n\
$annoScript = Join-Path $scriptDir "anno_gen.ps1"\n\
$logFile = Join-Path $scriptDir "anno_run.log"\n\
$stateFile = Join-Path $scriptDir "data\\.anno_state.json"\n\
$bsFile = Join-Path $scriptDir "data\\.build_state.json"\n\
\n\
function Save-BuildState($f,$d){$l="$f.lock";$w=0;while((Test-Path $l)-and $w -lt 10){Start-Sleep -Milliseconds 500;$w+=0.5};New-Item $l -ItemType File -Force|Out-Null;try{$d|ConvertTo-Json -Depth 10|Set-Content $f -Encoding UTF8}finally{Remove-Item $l -Force -ErrorAction SilentlyContinue}}\n\
function Load-BuildState($f){$l="$f.lock";$w=0;while((Test-Path $l)-and $w -lt 10){Start-Sleep -Milliseconds 500;$w+=0.5};if(Test-Path $f){try{return(Get-Content $f -Encoding UTF8|Out-String|ConvertFrom-Json -AsHashtable)}catch{return @{pages=@{}}}};return @{pages=@{}}}\n\
\n\
if(-not(Test-Path $pagesJson)){Write-Host "FAIL: pages.json 없음";exit 1}\n\
if(-not(Test-Path $specsDir)){New-Item -ItemType Directory -Path $specsDir|Out-Null}\n\
\n\
$state=@{};if((Test-Path $stateFile)-and -not $fullRebuild){$state=Get-Content $stateFile -Encoding UTF8|Out-String|ConvertFrom-Json -AsHashtable}\n\
$bs=Load-BuildState $bsFile\n\
"anno_gen_all.ps1: $(Get-Date -Format \'yyyy-MM-dd HH:mm\')"|Set-Content $logFile -Encoding UTF8\n\
function Log($msg){Add-Content -Path $logFile -Value $msg -Encoding UTF8}\n\
\n\
$allPages=Get-Content $pagesJson -Encoding UTF8|Out-String|ConvertFrom-Json\n\
if($section -ne "all"){$allPages=$allPages|Where-Object{$_.section -eq $section}}\n\
$targets=$allPages|Where-Object{$_.path -ne "#" -and $_.section -ne "doc"}\n\
if(-not $fullRebuild){$targets=$targets|Where-Object{($_.tags -contains "changed")-or(-not $state.ContainsKey($_.id))}}\n\
\n\
$okCount=0;$skipCount=0;$failCount=0;$blockedCount=0\n\
if($targets.Count -eq 0){Write-Host "어노테이션 완료: 변경 없음";exit 0}\n\
\n\
foreach($page in $targets){\n\
  $id=$page.id\n\
  if($bs.pages.ContainsKey($id)-and $bs.pages[$id].ContainsKey("capture")){if($bs.pages[$id]["capture"] -ne "OK"){Log "[$id] BLOCKED";$blockedCount++;if(-not $bs.pages.ContainsKey($id)){$bs.pages[$id]=@{}};$bs.pages[$id]["anno"]="BLOCKED";continue}}\n\
  $specId=$id -replace "-","";$specFile=Join-Path $specsDir "$specId.js";$htmlPath=Join-Path $outputsDir $page.path.TrimStart("../")\n\
  if(-not(Test-Path $specFile)){Log "[$id] SKIP spec없음";$skipCount++;continue}\n\
  if(-not(Test-Path $htmlPath)){Log "[$id] SKIP HTML없음";$skipCount++;continue}\n\
  $html=Get-Content $htmlPath -Encoding UTF8 -Raw;if($html -notmatch "data-sb-anno"){Log "[$id] SKIP anno없음";$skipCount++;continue}\n\
  try{\n\
    if(Test-Path $annoScript){& powershell -ExecutionPolicy Bypass -File $annoScript -pageId $id -path $page.path 2>&1|Out-Null}\n\
    if($LASTEXITCODE -eq 0){Log "[$id] OK";$okCount++;$state[$id]=(Get-Date -Format "yyyy-MM-dd HH:mm");if(-not $bs.pages.ContainsKey($id)){$bs.pages[$id]=@{}};$bs.pages[$id]["anno"]="OK"}\n\
    else{Log "[$id] FAIL";$failCount++;if(-not $bs.pages.ContainsKey($id)){$bs.pages[$id]=@{}};$bs.pages[$id]["anno"]="FAIL"}\n\
  }catch{Log "[$id] FAIL: $_";$failCount++;if(-not $bs.pages.ContainsKey($id)){$bs.pages[$id]=@{}};$bs.pages[$id]["anno"]="FAIL"}\n\
}\n\
$state|ConvertTo-Json|Set-Content $stateFile -Encoding UTF8\n\
Save-BuildState $bsFile $bs\n\
Write-Host "어노테이션 완료: OK=$okCount SKIP=$skipCount FAIL=$failCount BLOCKED=$blockedCount"\n\
'
);

// ═══════════════════════════════════════════════════════════
//  extract_anno_elements.ps1 — 변경 없음
// ═══════════════════════════════════════════════════════════

RAW_B64['sb_extract_anno'] = toB64(
'# extract_anno_elements.ps1 — anno 요소 JSON 추출 (v2.0)\n\
\n\
param([string]$section = "all")\n\
$ErrorActionPreference = "Continue"\n\
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition\n\
$pagesJson = Join-Path $scriptDir "data\\pages.json"\n\
$outputsDir = Join-Path $scriptDir "..\\outputs"\n\
$logFile = Join-Path $scriptDir "extract_run.log"\n\
$bsFile = Join-Path $scriptDir "data\\.build_state.json"\n\
\n\
function Save-BuildState($f,$d){$l="$f.lock";$w=0;while((Test-Path $l)-and $w -lt 10){Start-Sleep -Milliseconds 500;$w+=0.5};New-Item $l -ItemType File -Force|Out-Null;try{$d|ConvertTo-Json -Depth 10|Set-Content $f -Encoding UTF8}finally{Remove-Item $l -Force -ErrorAction SilentlyContinue}}\n\
function Load-BuildState($f){$l="$f.lock";$w=0;while((Test-Path $l)-and $w -lt 10){Start-Sleep -Milliseconds 500;$w+=0.5};if(Test-Path $f){try{return(Get-Content $f -Encoding UTF8|Out-String|ConvertFrom-Json -AsHashtable)}catch{return @{pages=@{}}}};return @{pages=@{}}}\n\
\n\
if(-not(Test-Path $pagesJson)){Write-Host "FAIL: pages.json 없음";exit 1}\n\
"extract: $(Get-Date -Format \'yyyy-MM-dd HH:mm\')"|Set-Content $logFile -Encoding UTF8\n\
function Log($msg){Add-Content -Path $logFile -Value $msg -Encoding UTF8}\n\
$bs=Load-BuildState $bsFile\n\
$allPages=Get-Content $pagesJson -Encoding UTF8|Out-String|ConvertFrom-Json\n\
if($section -ne "all"){$allPages=$allPages|Where-Object{$_.section -eq $section}}\n\
$targets=$allPages|Where-Object{$_.path -ne "#" -and $_.section -ne "doc"}\n\
$results=@()\n\
foreach($page in $targets){\n\
  if($bs.pages.ContainsKey($page.id)-and $bs.pages[$page.id].ContainsKey("publisher")){if($bs.pages[$page.id]["publisher"] -ne "OK"){Log "[$($page.id)] BLOCKED";if(-not $bs.pages.ContainsKey($page.id)){$bs.pages[$page.id]=@{}};$bs.pages[$page.id]["extract"]="BLOCKED";continue}}\n\
  $htmlPath=Join-Path $outputsDir $page.path.TrimStart("../")\n\
  if(-not(Test-Path $htmlPath)){Log "[$($page.id)] SKIP";continue}\n\
  $html=Get-Content $htmlPath -Encoding UTF8 -Raw\n\
  $tagMatches=[regex]::Matches($html,\'<(\\w+)([^>]*data-sb-anno="[^"]*"[^>]*)>\')\n\
  $annotations=@()\n\
  foreach($tm in $tagMatches){\n\
    $tagName=$tm.Groups[1].Value;$attrs=$tm.Groups[2].Value\n\
    $anno=if($attrs -match \'data-sb-anno="([^"]*)"\'){$Matches[1]}else{""}\n\
    $class=if($attrs -match \'class="([^"]*)"\'){$Matches[1]}else{""}\n\
    if($anno -ne ""){$annotations+=[ordered]@{anno=$anno;tag=$tagName;class=$class}}\n\
  }\n\
  if($annotations.Count -eq 0){Log "[$($page.id)] SKIP anno없음";continue}\n\
  $results+=[ordered]@{id=$page.id;name=$page.name;section=$page.section;group=$page.group;path=$page.path;annotations=$annotations}\n\
  Log "[$($page.id)] OK ($($annotations.Count)개)"\n\
  if(-not $bs.pages.ContainsKey($page.id)){$bs.pages[$page.id]=@{}};$bs.pages[$page.id]["extract"]="OK"\n\
}\n\
$suffix=if($section -eq "all"){"all"}else{$section}\n\
$results|ConvertTo-Json -Depth 10|Set-Content (Join-Path $scriptDir "data\\anno_elements_$suffix.json") -Encoding UTF8\n\
Save-BuildState $bsFile $bs\n\
Write-Host "anno 추출 완료: $($results.Count)개"\n\
'
);

// ═══════════════════════════════════════════════════════════
//  qa_precheck.ps1 — 변경 없음
// ═══════════════════════════════════════════════════════════

RAW_B64['sb_qaprecheck'] = toB64(
'# qa_precheck.ps1 — 파일·좌표·n연속성 검증 (v2.0)\n\
# ※ pipeline.ps1에서는 호출하지 않음. storyboard-agent가 스펙 생성 후 별도 Bash 실행.\n\
\n\
$ErrorActionPreference = "Continue"\n\
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition\n\
$pagesJson = Join-Path $scriptDir "data\\pages.json"\n\
$specsDir = Join-Path $scriptDir "data\\specs"\n\
$imagesDir = Join-Path $scriptDir "images"\n\
$outputsDir = Join-Path $scriptDir "..\\outputs"\n\
$resultFile = Join-Path $scriptDir "data\\qa_precheck_result.json"\n\
$bsFile = Join-Path $scriptDir "data\\.build_state.json"\n\
\n\
function Save-BuildState($f,$d){$l="$f.lock";$w=0;while((Test-Path $l)-and $w -lt 10){Start-Sleep -Milliseconds 500;$w+=0.5};New-Item $l -ItemType File -Force|Out-Null;try{$d|ConvertTo-Json -Depth 10|Set-Content $f -Encoding UTF8}finally{Remove-Item $l -Force -ErrorAction SilentlyContinue}}\n\
function Load-BuildState($f){$l="$f.lock";$w=0;while((Test-Path $l)-and $w -lt 10){Start-Sleep -Milliseconds 500;$w+=0.5};if(Test-Path $f){try{return(Get-Content $f -Encoding UTF8|Out-String|ConvertFrom-Json -AsHashtable)}catch{return @{pages=@{}}}};return @{pages=@{}}}\n\
\n\
if(-not(Test-Path $pagesJson)){Write-Host "FAIL: pages.json 없음";exit 1}\n\
$bs=Load-BuildState $bsFile\n\
$pages=Get-Content $pagesJson -Encoding UTF8|Out-String|ConvertFrom-Json\n\
$targets=$pages|Where-Object{$_.path -ne "#" -and $_.section -ne "doc"}\n\
$results=@();$okCount=0;$failCount=0;$blockedCount=0\n\
\n\
foreach($page in $targets){\n\
  $id=$page.id;$specId=$id -replace "-","";$issues=@()\n\
  $imgPath=Join-Path $imagesDir $page.img;if(-not(Test-Path $imgPath)){$issues+="PNG없음"}\n\
  $specFile=Join-Path $specsDir "$specId.js";if(-not(Test-Path $specFile)){$issues+="spec없음"}\n\
  $htmlPath=Join-Path $outputsDir $page.path.TrimStart("../");if($page.path -ne "#" -and -not(Test-Path $htmlPath)){$issues+="HTML없음"}\n\
  if(Test-Path $specFile){\n\
    $sc=Get-Content $specFile -Encoding UTF8 -Raw\n\
    $cm=[regex]::Matches($sc,\'"x"\\s*:\\s*([\\d.]+)|"y"\\s*:\\s*([\\d.]+)|x\\s*:\\s*([\\d.]+)|y\\s*:\\s*([\\d.]+)\')\n\
    foreach($m in $cm){$raw=($m.Groups[1].Value,$m.Groups[2].Value,$m.Groups[3].Value,$m.Groups[4].Value)|Where-Object{$_ -ne ""}|Select-Object -First 1;if($raw){$val=[double]$raw;if($val -lt 0 -or $val -gt 100){$issues+="좌표범위초과(${val}%)";break}}}\n\
    $nm=[regex]::Matches($sc,\'"n"\\s*:\\s*(\\d+)|n\\s*:\\s*(\\d+)\');$nv=$nm|ForEach-Object{$v=($_.Groups[1].Value,$_.Groups[2].Value)|Where-Object{$_ -ne ""}|Select-Object -First 1;[int]$v}|Sort-Object -Unique\n\
    if($nv.Count -gt 0){$exp=1..$nv[-1];$miss=$exp|Where-Object{$nv -notcontains $_};if($miss.Count -gt 0){$issues+="n번호누락($($miss -join \',\'))"}}\n\
  }\n\
  $status=if($issues.Count -eq 0){"OK";$okCount++}else{"FAIL";$failCount++}\n\
  if(-not $bs.pages.ContainsKey($id)){$bs.pages[$id]=@{}};$bs.pages[$id]["qa"]=$status\n\
  $results+=[ordered]@{id=$id;name=$page.name;status=$status;issues=$issues}\n\
}\n\
\n\
# build_state step을 "done"으로 갱신 (qa_precheck가 최종 단계)\n\
$bs | Add-Member -NotePropertyName "step" -NotePropertyValue $(if ($failCount -eq 0) {"done"} else {"partial"}) -Force\n\
$bs | Add-Member -NotePropertyName "failCount" -NotePropertyValue $failCount -Force\n\
$bs | Add-Member -NotePropertyName "completedAt" -NotePropertyValue (Get-Date -Format "yyyy-MM-dd HH:mm") -Force\n\
\n\
[ordered]@{executedAt=(Get-Date -Format "yyyy-MM-dd HH:mm");total=$targets.Count;ok=$okCount;fail=$failCount;blocked=$blockedCount;items=$results}|ConvertTo-Json -Depth 10|Set-Content $resultFile -Encoding UTF8\n\
Save-BuildState $bsFile $bs\n\
Write-Host "precheck 완료: OK=$okCount FAIL=$failCount BLOCKED=$blockedCount"\n\
'
);

// ═══════════════════════════════════════════════════════════
//  _common.js — 변경 없음
// ═══════════════════════════════════════════════════════════

RAW_B64['sb_common'] = toB64(
'/**\n\
 * _common.js — 공통 UI 컴포넌트 스펙 규칙\n\
 * storyboard-agent가 배치당 1회만 참조.\n\
 */\n\
window.COMMON_SPECS = window.COMMON_SPECS || {};\n\
\n\
window.COMMON_SPECS["목록테이블"] = {\n\
  columns: "순번·제목·작성자·작성일·조회수 기본. 프로젝트별 override.",\n\
  sorting: "컬럼 헤더 클릭 ASC↔DESC.",\n\
  emptyState: "\'등록된 항목이 없습니다.\' 중앙 표시.",\n\
  hover: "행 hover 배경색 변경."\n\
};\n\
window.COMMON_SPECS["페이지네이션"] = {\n\
  display: "이전·다음 + 숫자 블록(10개). 첫/마지막 비활성.",\n\
  perPage: "기본 10건. 셀렉트 10/20/50.",\n\
  totalCount: "좌측 \'전체 N건\' 표시."\n\
};\n\
window.COMMON_SPECS["검색필터"] = {\n\
  layout: "목록 상단 가로 배치.",\n\
  keyword: "키워드 + 검색 버튼. Enter 지원.",\n\
  dateRange: "시작~종료 달력. 종료<시작 시 alert.",\n\
  reset: "초기화 → 전체 초기화 후 1페이지.",\n\
  selectBox: "\'전체\' 기본 선택."\n\
};\n\
window.COMMON_SPECS["모달"] = {\n\
  overlay: "딤 rgba(0,0,0,0.5). 배경 클릭 닫기.",\n\
  close: "X 버튼 + ESC.",\n\
  confirm: "확인/취소. 확인 시 콜백."\n\
};\n\
window.COMMON_SPECS["폼유효성"] = {\n\
  required: "필수 미입력 시 빨간 안내문구.",\n\
  maxlength: "초과 시 입력 차단 + 안내.",\n\
  submit: "전체 유효성 → 첫 오류 포커스."\n\
};\n\
window.COMMON_SPECS["Alert"] = {\n\
  deleteConfirm: "confirm(\'정말 삭제하시겠습니까?\').",\n\
  success: "\'저장되었습니다.\' alert → 목록 이동.",\n\
  error: "\'처리 중 오류가 발생했습니다.\' alert."\n\
};\n\
window.COMMON_SPECS["엑셀다운로드"] = {\n\
  trigger: "\'엑셀 다운로드\' 버튼.",\n\
  scope: "현재 검색 조건 전체.",\n\
  format: ".xlsx, {메뉴명}_{YYYYMMDD}.xlsx"\n\
};\n\
window.COMMON_SPECS["권한제어"] = {\n\
  unauthorized: "\'접근 권한이 없습니다.\' 또는 메뉴 비노출.",\n\
  roleBasedUI: "권한별 버튼 노출/비노출."\n\
};\n\
'
);

// ─────────────────────────────────────────
// FILE_DEFS 등록 — SB 공통 세트
// ─────────────────────────────────────────

FILE_DEFS.push(
  { group:'sb', key:'pipeline_ps1',    filename:'pipeline.ps1',                icon:'🔄', path:'_sb_template/pipeline.ps1',               tags:['오케스트레이션','v2.0.1'], desc:'[개선] capture→anno→extract 3단계만. qa_precheck는 스펙 후 별도 실행.', b64: RAW_B64['pipeline_ps1'] },
  { group:'sb', key:'validate_ps1',    filename:'validate_phase.ps1',          icon:'✔️', path:'_sb_template/validate_phase.ps1',         tags:['품질게이트','v2.0.1'],     desc:'[개선] WBS 7개 phase 검증 + meta.json 존재 확인 + case 이름 주석.',     b64: RAW_B64['validate_ps1'] },
  { group:'sb', key:'sb_capture',      filename:'capture.ps1',                 icon:'📷', path:'_sb_template/capture.ps1',                tags:['병렬캡처'],                desc:'PS 7+ 병렬 캡처 / PS 5.1 직렬 폴백.',                                  b64: RAW_B64['sb_capture'] },
  { group:'sb', key:'sb_annogenall',   filename:'anno_gen_all.ps1',            icon:'📍', path:'_sb_template/anno_gen_all.ps1',           tags:['BLOCKED처리'],             desc:'어노테이션 일괄 추출. build_state 연동.',                              b64: RAW_B64['sb_annogenall'] },
  { group:'sb', key:'sb_extract_anno', filename:'extract_anno_elements.ps1',   icon:'🔬', path:'_sb_template/extract_anno_elements.ps1',  tags:['정규식'],                  desc:'anno 요소 경량 JSON 추출.',                                            b64: RAW_B64['sb_extract_anno'] },
  { group:'sb', key:'sb_qaprecheck',   filename:'qa_precheck.ps1',             icon:'✅', path:'_sb_template/qa_precheck.ps1',            tags:['좌표검증','스펙후실행'],   desc:'[개선] pipeline에서 분리. 스펙 생성 후 별도 실행. build_state done 갱신.', b64: RAW_B64['sb_qaprecheck'] },
  { group:'sb', key:'sb_common',       filename:'_common.js',                  icon:'📐', path:'_sb_template/data/specs/_common.js',      tags:['공통컴포넌트'],            desc:'공통 UI 컴포넌트 규칙.',                                               b64: RAW_B64['sb_common'] }
);

window.FILE_DEFS = FILE_DEFS;
