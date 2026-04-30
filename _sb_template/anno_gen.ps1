<#
  anno_gen.ps1 — data-sb-anno 속성 기반 어노테이션 좌표 자동 생성 (v2.1)

  사용법:
    pwsh -File "anno_gen.ps1" -pageId "A20" -path "admin/apply-sponsor-detail.html"  (Mac)
    powershell -ExecutionPolicy Bypass -File "anno_gen.ps1" -pageId "A20" -path "..."  (Windows)

  HTML에 추가할 속성 예시:
    <div class="filter-card" data-sb-anno="1:검색·필터 영역">
    <div class="list-top"   data-sb-anno="2:목록 상단">
    <div class="table-wrap" data-sb-anno="3:목록 테이블">
    <div class="pagination" data-sb-anno="4:페이지네이션">
#>
param(
  [Parameter(Mandatory)][string]$pageId,
  [Parameter(Mandatory)][string]$path
)

# ── Chrome 자동 탐색 (Windows / Mac 공통) ───────────────
$chrome = $null
foreach ($c in @(
  "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe",
  "C:\Program Files\Google\Chrome\Application\chrome.exe",
  "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/opt/homebrew/bin/google-chrome"
)) { if ($c -and (Test-Path $c)) { $chrome = $c; break } }
if (-not $chrome) {
  foreach ($n in @("chrome","google-chrome","chromium")) {
    $f = Get-Command $n -ErrorAction SilentlyContinue
    if ($f) { $chrome = $f.Source; break }
  }
}
if (-not $chrome) { Write-Host "FAIL: Chrome 없음" -ForegroundColor Red; exit 1 }

$baseDir = $PSScriptRoot
$outDir  = Join-Path $baseDir "..\outputs"
$specDir = Join-Path $baseDir "data\specs"
$width   = 1920

# ── JS 문자열은 try 밖에서 미리 정의 ───────────────────
$jsReadyState = "document.readyState"

$jsExpandPage = @"
(() => {
  document.querySelectorAll('*').forEach(function(el) {
    var cs = getComputedStyle(el);
    if (cs.position === 'fixed' || cs.position === 'sticky') el.style.position = 'relative';
    if (parseFloat(cs.minHeight) > 300) el.style.minHeight = 'auto';
    if (el !== document.body && el !== document.documentElement) {
      var ov = cs.overflow, ovy = cs.overflowY;
      if (ov==='hidden'||ovy==='hidden'||ov==='auto'||ovy==='auto'||ov==='scroll'||ovy==='scroll') {
        el.style.overflow = 'visible';
        el.style.height = 'auto';
        el.style.maxHeight = 'none';
      }
    }
  });
  var b = document.body, h = document.documentElement;
  return Math.max(b.scrollHeight, b.offsetHeight, h.scrollHeight, h.offsetHeight) + 60;
})()
"@

$jsAnnoTpl = @"
(() => {
  var els = document.querySelectorAll('[data-sb-anno]');
  var result = [];
  var pw = PW_PLACEHOLDER;
  var ph = PH_PLACEHOLDER;
  els.forEach(function(el) {
    var attr = el.getAttribute('data-sb-anno');
    var parts = attr.split(':');
    var n = parseInt(parts[0]);
    var label = parts.slice(1).join(':').trim();
    var rect = el.getBoundingClientRect();
    var x = Math.round(rect.left / pw * 1000) / 10;
    var y = Math.round(rect.top  / ph * 1000) / 10;
    result.push({ n: n, x: x, y: y, label: label });
  });
  result.sort(function(a,b){ return a.n - b.n; });
  return JSON.stringify(result);
})()
"@

# ── Send-WS 함수 ────────────────────────────────────────
function Send-WS {
  param(
    [System.Net.WebSockets.ClientWebSocket]$ws,
    [int]$id,
    [string]$method,
    [hashtable]$params = @{}
  )
  $json  = @{ id = $id; method = $method; params = $params } | ConvertTo-Json -Depth 10 -Compress
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
  $seg   = New-Object System.ArraySegment[byte] -ArgumentList @(,$bytes)
  $ws.SendAsync($seg, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, [System.Threading.CancellationToken]::None).Wait()
  $buf    = New-Object byte[] 2097152
  $result = ""
  do {
    $s    = New-Object System.ArraySegment[byte] -ArgumentList @(,$buf)
    $recv = $ws.ReceiveAsync($s, [System.Threading.CancellationToken]::None).Result
    $result += [System.Text.Encoding]::UTF8.GetString($buf, 0, $recv.Count)
  } while (!$recv.EndOfMessage)
  return $result | ConvertFrom-Json
}

# ── 파일 확인 ───────────────────────────────────────────
$filePath = Join-Path $outDir $path
if (!(Test-Path $filePath)) {
  Write-Host "HTML 파일 없음: $filePath" -ForegroundColor Red
  exit 1
}
$specFile = Join-Path $specDir "$pageId.js"
if (!(Test-Path $specFile)) {
  Write-Host "spec 파일 없음: $specFile" -ForegroundColor Red
  exit 1
}

# ── Chrome CDP 실행 ──────────────────────────────────────
$port    = Get-Random -Minimum 9300 -Maximum 9399
$tmpProf = Join-Path ([System.IO.Path]::GetTempPath()) "chrome_anno_$port"
$fileUri = "file:///" + ((Resolve-Path $filePath).Path -replace '\\','/' -replace '^/','')

$proc = Start-Process $chrome -ArgumentList @(
  "--headless=new", "--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage",
  "--disable-web-security", "--allow-file-access-from-files",
  "--user-data-dir=$tmpProf", "--remote-debugging-port=$port",
  "--window-size=${width},900", $fileUri
) -PassThru

Start-Sleep -Milliseconds 2500

try {
  $jsonResp = Invoke-RestMethod "http://localhost:$port/json" -TimeoutSec 5
  $pageTab  = $jsonResp | Where-Object { $_.type -eq 'page' } | Select-Object -First 1
  if (-not $pageTab) { $pageTab = $jsonResp[0] }

  $ws  = New-Object System.Net.WebSockets.ClientWebSocket
  $cts = New-Object System.Threading.CancellationTokenSource
  $ws.ConnectAsync([Uri]$pageTab.webSocketDebuggerUrl, $cts.Token).Wait()
  $cmdId = 1

  for ($i = 0; $i -lt 20; $i++) {
    $r = Send-WS $ws $cmdId "Runtime.evaluate" @{ expression = $jsReadyState; returnByValue = $true }
    $cmdId++
    if ($r.result.result.value -eq "complete") { break }
    Start-Sleep -Milliseconds 300
  }
  Start-Sleep -Milliseconds 2000

  $r = Send-WS $ws $cmdId "Runtime.evaluate" @{ expression = $jsExpandPage; returnByValue = $true }
  $cmdId++
  $pageHeight = [int]$r.result.result.value
  if ($pageHeight -lt 100) { $pageHeight = 3000 }

  Send-WS $ws $cmdId "Emulation.setDeviceMetricsOverride" @{
    width = $width; height = $pageHeight; deviceScaleFactor = 1; mobile = $false
  } | Out-Null
  $cmdId++
  Start-Sleep -Milliseconds 500

  $jsAnno = $jsAnnoTpl -replace 'PW_PLACEHOLDER', $width -replace 'PH_PLACEHOLDER', $pageHeight

  $r     = Send-WS $ws $cmdId "Runtime.evaluate" @{ expression = $jsAnno; returnByValue = $true }
  $cmdId++
  $annos = $r.result.result.value | ConvertFrom-Json

  if (!$annos -or $annos.Count -eq 0) {
    Write-Host "data-sb-anno 요소를 찾지 못했습니다." -ForegroundColor Yellow
    Write-Host "HTML 파일에  data-sb-anno=`"N:라벨`"  속성이 있는지 확인하세요." -ForegroundColor Yellow
    $ws.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure, "", $cts.Token).Wait()
    exit 1
  }

  Write-Host ""
  Write-Host "── 추출 결과 ($pageId  ${width}x${pageHeight}px) ──" -ForegroundColor Cyan
  foreach ($a in $annos) {
    Write-Host ("  n:{0}  x:{1}%  y:{2}%  // {3}" -f $a.n, $a.x, $a.y, $a.label) -ForegroundColor White
  }

  $lines = [System.Collections.Generic.List[string]]::new()
  $lines.Add("window.ANNOTATIONS['$pageId'] = [")
  foreach ($a in $annos) {
    $xVal = if ($a.x -eq [math]::Floor([double]$a.x)) { [int]$a.x } else { "{0:F1}" -f [double]$a.x }
    $yVal = if ($a.y -eq [math]::Floor([double]$a.y)) { [int]$a.y } else { "{0:F1}" -f [double]$a.y }
    $lines.Add("  { n: $($a.n), x: $xVal, y: $yVal },   // $($a.label)")
  }
  $lines.Add("];")
  $newAnnoBlock = $lines -join "`n"

  $specContent = [System.IO.File]::ReadAllText($specFile, [System.Text.Encoding]::UTF8)
  $pattern     = "window\.ANNOTATIONS\['" + [regex]::Escape($pageId) + "'\]\s*=\s*\[[\s\S]*?\];"

  if ($specContent -match $pattern) {
    $newContent = [regex]::Replace($specContent, $pattern, $newAnnoBlock)
    [System.IO.File]::WriteAllText($specFile, $newContent, [System.Text.Encoding]::UTF8)
    Write-Host ""
    Write-Host "OK  $specFile  갱신 완료" -ForegroundColor Green
  } else {
    Write-Host ""
    Write-Host "ANNOTATIONS 블록을 찾지 못했습니다. 아래 내용을 수동으로 붙여넣으세요:" -ForegroundColor Yellow
    Write-Host $newAnnoBlock -ForegroundColor Gray
  }

  $ws.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure, "", $cts.Token).Wait()

} catch {
  Write-Host "오류: $($_.Exception.Message)" -ForegroundColor Red
} finally {
  if ($proc -and !$proc.HasExited) { $proc.Kill() }
}
