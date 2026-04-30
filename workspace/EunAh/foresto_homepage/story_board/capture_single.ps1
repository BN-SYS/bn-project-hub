<#
  capture_single.ps1 — 단일 페이지 캡처
  사용법: powershell -ExecutionPolicy Bypass -File "capture_single.ps1" -name "A11_강사일정_목록" -path "admin/instructor-schedule.html"
#>
param(
  [Parameter(Mandatory)][string]$name,
  [Parameter(Mandatory)][string]$path
)

$chrome  = $null
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
$imgDir  = Join-Path $baseDir "images"
$width   = 1920
$waitMs  = 2500

if (!(Test-Path $imgDir)) { New-Item -ItemType Directory -Path $imgDir -Force | Out-Null }

function Send-WS {
  param([System.Net.WebSockets.ClientWebSocket]$ws,[int]$id,[string]$method,[hashtable]$params=@{})
  $json  = @{id=$id;method=$method;params=$params} | ConvertTo-Json -Depth 10 -Compress
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
  $seg   = New-Object System.ArraySegment[byte] -ArgumentList @(,$bytes)
  $ws.SendAsync($seg,[System.Net.WebSockets.WebSocketMessageType]::Text,$true,[System.Threading.CancellationToken]::None).Wait()
  $buf   = New-Object byte[] 2097152
  $result = ""
  do {
    $s    = New-Object System.ArraySegment[byte] -ArgumentList @(,$buf)
    $recv = $ws.ReceiveAsync($s,[System.Threading.CancellationToken]::None).Result
    $result += [System.Text.Encoding]::UTF8.GetString($buf,0,$recv.Count)
  } while (!$recv.EndOfMessage)
  return $result | ConvertFrom-Json
}

$filePath = Join-Path $outDir $path
if (!(Test-Path $filePath)) { Write-Host "파일 없음: $filePath" -ForegroundColor Red; exit 1 }

$fileUri = "file:///" + ((Resolve-Path $filePath).Path -replace '\\','/' -replace '^/','')
$imgPath = Join-Path $imgDir "$name.png"

$port = Get-Random -Minimum 9300 -Maximum 9399
$tmpProfile = Join-Path ([System.IO.Path]::GetTempPath()) "chrome_cap_$port"
$proc = Start-Process $chrome -ArgumentList @(
  "--headless=new","--disable-gpu","--no-sandbox","--disable-dev-shm-usage",
  "--disable-web-security","--allow-file-access-from-files",
  "--user-data-dir=$tmpProfile","--remote-debugging-port=$port",
  "--window-size=${width},900",$fileUri
) -PassThru

Start-Sleep -Milliseconds 2500

try {
  $json    = Invoke-RestMethod "http://localhost:$port/json" -TimeoutSec 5
  $pageTab = $json | Where-Object { $_.type -eq 'page' } | Select-Object -First 1
  if (-not $pageTab) { $pageTab = $json[0] }
  $ws  = New-Object System.Net.WebSockets.ClientWebSocket
  $cts = New-Object System.Threading.CancellationTokenSource
  $ws.ConnectAsync([Uri]$pageTab.webSocketDebuggerUrl,$cts.Token).Wait()
  $cmdId = 1

  for ($i=0;$i -lt 20;$i++) {
    $r = Send-WS $ws $cmdId "Runtime.evaluate" @{expression="document.readyState";returnByValue=$true}
    $cmdId++
    if ($r.result.result.value -eq "complete") { break }
    Start-Sleep -Milliseconds 300
  }
  Start-Sleep -Milliseconds $waitMs

  $jsHeight = @"
(() => {
  document.querySelectorAll('*').forEach(el => {
    const cs = getComputedStyle(el);
    if (cs.position==='fixed'||cs.position==='sticky') el.style.position='relative';
    if (parseFloat(cs.minHeight)>300) el.style.minHeight='auto';
    if (el!==document.body&&el!==document.documentElement) {
      const ov=cs.overflow,ovy=cs.overflowY;
      if (ov==='hidden'||ovy==='hidden'||ov==='auto'||ovy==='auto'||ov==='scroll'||ovy==='scroll') {
        el.style.overflow='visible';el.style.height='auto';el.style.maxHeight='none';
      }
    }
  });
  const b=document.body,h=document.documentElement;
  const measured=Math.max(b.scrollHeight,b.offsetHeight,h.scrollHeight,h.offsetHeight);
  document.documentElement.style.overflow='hidden';
  document.body.style.overflow='hidden';
  return measured+60;
})()
"@
  $r = Send-WS $ws $cmdId "Runtime.evaluate" @{expression=$jsHeight;returnByValue=$true}
  $cmdId++
  $height = [int]$r.result.result.value
  if ($height -lt 100) { $height = 3000 }

  Send-WS $ws $cmdId "Emulation.setDeviceMetricsOverride" @{
    width=$width;height=$height;deviceScaleFactor=1;mobile=$false
  } | Out-Null
  $cmdId++
  Start-Sleep -Milliseconds 500

  $r = Send-WS $ws $cmdId "Page.captureScreenshot" @{
    format="png"
    clip=@{x=0;y=0;width=$width;height=$height;scale=1}
    captureBeyondViewport=$true
  }
  $cmdId++

  if ($r.result.data) {
    [IO.File]::WriteAllBytes($imgPath,[Convert]::FromBase64String($r.result.data))
    Write-Host "OK  $name  (${width}x${height})" -ForegroundColor Green
    Write-Host "저장: $imgPath" -ForegroundColor DarkGray
  } else {
    Write-Host "FAIL  $name (캡처 데이터 없음)" -ForegroundColor Red
  }
  $ws.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure,"",$cts.Token).Wait()
} catch {
  Write-Host "FAIL  $($_.Exception.Message)" -ForegroundColor Red
} finally {
  if ($proc -and !$proc.HasExited) { $proc.Kill() }
}
