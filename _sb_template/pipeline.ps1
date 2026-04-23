# pipeline.ps1 — 스토리보드 파이프라인 (v2.0.1)
# capture → anno → extract 3단계만 실행.
# qa_precheck는 포함하지 않음 — storyboard-agent가 스펙 생성 완료 후 별도 실행.
# 사용법: powershell -ExecutionPolicy Bypass -File pipeline.ps1 [-pageId U03] [-skipCapture] [-fullRebuild]

param(
  [string]$pageId      = "",
  [switch]$skipCapture = $false,
  [switch]$fullRebuild = $false
)
$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$bsFile    = Join-Path $scriptDir "data\.build_state.json"
$logFile   = Join-Path $scriptDir "pipeline_run.log"

function Log($msg) {
  $ts = Get-Date -Format "HH:mm:ss"
  $line = "[$ts] $msg"
  Write-Host $line
  Add-Content -Path $logFile -Value $line -Encoding UTF8
}

function Run-Step($name, $script, [hashtable]$params = @{}) {
  Log "▶ $name 시작..."
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  try {
    # 파라미터를 명시적 argument 문자열로 변환
    $argList = @("-ExecutionPolicy", "Bypass", "-File", (Join-Path $scriptDir $script))
    foreach ($kv in $params.GetEnumerator()) {
      if ($kv.Value -is [switch] -or $kv.Value -eq $true) {
        $argList += "-$($kv.Key)"
      } else {
        $argList += "-$($kv.Key)"
        $argList += "$($kv.Value)"
      }
    }
    $result = & powershell @argList 2>&1
    $result | ForEach-Object { Log "  $_" }
    if ($LASTEXITCODE -ne 0) {
      Log "✗ $name FAIL (exit=$LASTEXITCODE)"
      return $false
    }
    Log "✓ $name 완료 ($([math]::Round($sw.Elapsed.TotalSeconds,1))초)"
    return $true
  } catch {
    Log "✗ $name 오류: $_"
    return $false
  }
}

# ── 메인 실행 ──────────────────────────────────────────────
"pipeline.ps1: $(Get-Date -Format 'yyyy-MM-dd HH:mm')" | Set-Content $logFile -Encoding UTF8
Log "=== 파이프라인 시작 (pageId=$pageId, skipCapture=$skipCapture, fullRebuild=$fullRebuild) ==="

$captureParams = @{}
$annoParams    = @{}
if ($pageId -ne "")      { $captureParams["pageId"] = $pageId }
if ($fullRebuild)        { $captureParams["fullRebuild"] = $true; $annoParams["fullRebuild"] = $true }

$allOk = $true

# Step 1: 캡처
if (-not $skipCapture) {
  $ok = Run-Step "capture" "capture.ps1" $captureParams
  if (-not $ok) { $allOk = $false; Log "⚠ 캡처 실패 — 이후 단계 계속 시도" }
}

# Step 2: 어노테이션 추출
$ok = Run-Step "anno_gen_all" "anno_gen_all.ps1" $annoParams
if (-not $ok) { $allOk = $false }

# Step 3: anno elements 추출
$ok = Run-Step "extract_anno" "extract_anno_elements.ps1" @{}
if (-not $ok) { $allOk = $false }

# ※ qa_precheck는 여기서 실행하지 않음.
#   storyboard-agent가 스펙 생성 완료 후 별도 Bash로 실행한다.
#   이유: qa_precheck는 specs 파일 존재를 검증하는데,
#         이 시점에서는 아직 스펙이 생성되지 않았기 때문.

# ── 최종 상태 기록 ─────────────────────────────────────────
if (Test-Path $bsFile) {
  $bs = Get-Content $bsFile -Encoding UTF8 | Out-String | ConvertFrom-Json
  $failPages = 0; $okPages = 0; $blockedPages = 0
  if ($bs.pages) {
    foreach ($p in $bs.pages.PSObject.Properties) {
      $stages = $p.Value
      if ($stages.capture -eq "FAIL" -or $stages.anno -eq "FAIL") { $failPages++ }
      elseif ($stages.capture -eq "BLOCKED" -or $stages.anno -eq "BLOCKED") { $blockedPages++ }
      else { $okPages++ }
    }
  }
  # step을 "extracted"로 기록 (아직 스펙+QA 미완료이므로 "done" 아님)
  $bs | Add-Member -NotePropertyName "step" -NotePropertyValue $(if ($allOk) {"extracted"} else {"partial"}) -Force
  $bs | Add-Member -NotePropertyName "failCount" -NotePropertyValue $failPages -Force
  $bs | Add-Member -NotePropertyName "pipelineAt" -NotePropertyValue (Get-Date -Format "yyyy-MM-dd HH:mm") -Force
  $bs | ConvertTo-Json -Depth 10 | Set-Content $bsFile -Encoding UTF8
  Log "=== 파이프라인 종료: OK=$okPages FAIL=$failPages BLOCKED=$blockedPages ==="
  Log "※ qa_precheck는 스펙 생성 후 별도 실행 필요"
} else {
  Log "=== 파이프라인 종료: build_state 없음 ==="
}

if ($allOk) { exit 0 } else { exit 1 }
