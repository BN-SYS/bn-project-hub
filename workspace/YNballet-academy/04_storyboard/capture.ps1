# capture.ps1 — 스토리보드 캡처 (v2.0)
# PS 7+ 병렬 처리 / PS 5.1 직렬 폴백
# 실행: powershell -ExecutionPolicy Bypass -File capture.ps1 [-pageId U03] [-fullRebuild]

param(
  [string]$pageId      = "",
  [switch]$fullRebuild = $false
)
$ErrorActionPreference = "Stop"

$scriptDir  = Split-Path -Parent $MyInvocation.MyCommand.Definition
$pagesJson  = Join-Path $scriptDir "data\pages.json"
$outputsDir = Join-Path $scriptDir "..\outputs"
$imagesDir  = Join-Path $scriptDir "images"
$logFile    = Join-Path $scriptDir "capture_run.log"
$stateFile  = Join-Path $scriptDir "data\.capture_state.json"
$bsFile     = Join-Path $scriptDir "data\.build_state.json"

function Save-BuildState($filePath, $data) {
  $lockFile = "$filePath.lock"; $maxWait = 10; $waited = 0
  while ((Test-Path $lockFile) -and $waited -lt $maxWait) { Start-Sleep -Milliseconds 500; $waited += 0.5 }
  New-Item $lockFile -ItemType File -Force | Out-Null
  try { $data | ConvertTo-Json -Depth 10 | Set-Content $filePath -Encoding UTF8 }
  finally { Remove-Item $lockFile -Force -ErrorAction SilentlyContinue }
}
function Load-BuildState($filePath) {
  $lockFile = "$filePath.lock"; $maxWait = 10; $waited = 0
  while ((Test-Path $lockFile) -and $waited -lt $maxWait) { Start-Sleep -Milliseconds 500; $waited += 0.5 }
  if (Test-Path $filePath) { try { return (Get-Content $filePath -Encoding UTF8 | Out-String | ConvertFrom-Json -AsHashtable) } catch { return @{ pages = @{} } } }
  return @{ buildId = (Get-Date -Format "yyyy-MM-dd_HH:mm"); mode = "incremental"; pages = @{}; summary = @{} }
}

$chromePath = $null
$candidates = @(
  (Get-Command "chrome.exe" -ErrorAction SilentlyContinue)?.Source,
  (Get-Command "chrome" -ErrorAction SilentlyContinue)?.Source,
  "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe",
  "C:\Program Files\Google\Chrome\Application\chrome.exe",
  "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
)
foreach ($c in $candidates) { if ($c -and (Test-Path $c)) { $chromePath = $c; break } }
if (-not $chromePath) { Write-Host "FAIL: Chrome 없음"; exit 1 }
if (-not (Test-Path $pagesJson)) { Write-Host "FAIL: pages.json 없음"; exit 1 }
if (-not (Test-Path $imagesDir)) { New-Item -ItemType Directory -Path $imagesDir | Out-Null }

$pages = Get-Content $pagesJson -Encoding UTF8 | Out-String | ConvertFrom-Json
$state = @{}
if ((Test-Path $stateFile) -and -not $fullRebuild) {
  $state = Get-Content $stateFile -Encoding UTF8 | Out-String | ConvertFrom-Json -AsHashtable
}

if ($pageId -ne "") { $pages = $pages | Where-Object { $_.id -eq $pageId } }
elseif (-not $fullRebuild) {
  $pages = $pages | Where-Object {
    $_.path -ne "#" -and $_.section -ne "doc" -and
    (($_.tags -contains "changed") -or (-not (Test-Path (Join-Path $imagesDir $_.img))) -or (-not $state.ContainsKey($_.id)))
  }
} else {
  $pages = $pages | Where-Object { $_.path -ne "#" -and $_.section -ne "doc" }
}

$viewport = 1920; $global:wsId = 0
"capture.ps1: $(Get-Date -Format 'yyyy-MM-dd HH:mm') | fullRebuild=$fullRebuild" | Set-Content $logFile -Encoding UTF8
function Log($msg) { Add-Content -Path $logFile -Value $msg -Encoding UTF8 }
function Get-WaitMs($p) {
  if (-not (Test-Path $p)) { return 2000 }
  $s = (Get-Item $p).Length
  if ($s -lt 40000) { return 1500 } elseif ($s -lt 80000) { return 2500 } else { return 3500 }
}

function Start-CDPCapture($fileUri, $imgPath, $pageName, $waitMs) {
  $port = Get-Random -Minimum 9300 -Maximum 9400
  $proc = Start-Process -FilePath $chromePath -ArgumentList @(
    "--headless=new","--remote-debugging-port=$port",
    "--window-size=$viewport,900","--no-sandbox","--disable-gpu",$fileUri
  ) -PassThru
  Start-Sleep -Milliseconds $waitMs
  try {
    $wsUrl = (Invoke-RestMethod "http://localhost:$port/json").webSocketDebuggerUrl | Select-Object -First 1
    $ws = New-Object System.Net.WebSockets.ClientWebSocket
    $ws.ConnectAsync([Uri]$wsUrl, [System.Threading.CancellationToken]::None).Wait()
    $buf = [System.Text.Encoding]::UTF8.GetBytes('{"id":1,"method":"Page.captureScreenshot","params":{"format":"png","captureBeyondViewport":true}}')
    $ws.SendAsync([ArraySegment[byte]]$buf, 1, $true, [System.Threading.CancellationToken]::None).Wait()
    Start-Sleep -Milliseconds 500
    $ms = New-Object System.IO.MemoryStream; $ch = [byte[]]::new(65536)
    $cs = New-Object System.Threading.CancellationTokenSource; $cs.CancelAfter(30000)
    do { $r = $ws.ReceiveAsync([ArraySegment[byte]]$ch, $cs.Token).GetAwaiter().GetResult(); $ms.Write($ch,0,$r.Count) } while (-not $r.EndOfMessage)
    $resp = [System.Text.Encoding]::UTF8.GetString($ms.ToArray()) | ConvertFrom-Json
    if ($resp.result.data) {
      [System.IO.File]::WriteAllBytes($imgPath, [Convert]::FromBase64String($resp.result.data))
      Log "  OK $pageName"; return "OK"
    } else { Log "  FAIL $pageName (data없음)"; return "FAIL" }
  } catch { Log "  FAIL $pageName - $_"; return "FAIL" }
  finally { Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue }
}

if ($pages.Count -eq 0) { Write-Host "캡처 완료: 변경 없음"; exit 0 }

$captureResults = [System.Collections.Concurrent.ConcurrentDictionary[string,string]]::new()
$syncState = [System.Collections.Concurrent.ConcurrentDictionary[string,string]]::new()
$throttle = 5
$psMajor = $PSVersionTable.PSVersion.Major

if ($psMajor -ge 7) {
  $pages | ForEach-Object -Parallel {
    $page = $_; $outputsDir = $using:outputsDir; $imagesDir = $using:imagesDir
    $chromePath = $using:chromePath; $viewport = $using:viewport
    $captureResults = $using:captureResults; $syncState = $using:syncState; $logFile = $using:logFile
    $htmlPath = Join-Path $outputsDir $page.path.TrimStart("../")
    if (-not (Test-Path $htmlPath)) { $captureResults[$page.id] = "SKIP"; return }
    $port = 9300 + ([System.Threading.Thread]::CurrentThread.ManagedThreadId % 100)
    $fileUri = "file:///" + $htmlPath.Replace("\","/")
    $imgPath = Join-Path $imagesDir $page.img
    $proc = Start-Process -FilePath $chromePath -ArgumentList @(
      "--headless=new","--remote-debugging-port=$port","--window-size=$viewport,900","--no-sandbox","--disable-gpu",$fileUri
    ) -PassThru
    Start-Sleep -Milliseconds 2000
    try {
      $wsUrl = (Invoke-RestMethod "http://localhost:$port/json").webSocketDebuggerUrl | Select-Object -First 1
      $ws = New-Object System.Net.WebSockets.ClientWebSocket
      $ws.ConnectAsync([Uri]$wsUrl, [System.Threading.CancellationToken]::None).Wait()
      $buf = [System.Text.Encoding]::UTF8.GetBytes('{"id":1,"method":"Page.captureScreenshot","params":{"format":"png","captureBeyondViewport":true}}')
      $ws.SendAsync([ArraySegment[byte]]$buf,1,$true,[System.Threading.CancellationToken]::None).Wait()
      $ms2 = New-Object System.IO.MemoryStream; $ch2 = [byte[]]::new(65536)
      $cs2 = New-Object System.Threading.CancellationTokenSource; $cs2.CancelAfter(30000)
      do { $r2 = $ws.ReceiveAsync([ArraySegment[byte]]$ch2,$cs2.Token).GetAwaiter().GetResult(); $ms2.Write($ch2,0,$r2.Count) } while (-not $r2.EndOfMessage)
      $resp = [System.Text.Encoding]::UTF8.GetString($ms2.ToArray()) | ConvertFrom-Json
      if ($resp.result.data) {
        [System.IO.File]::WriteAllBytes($imgPath, [Convert]::FromBase64String($resp.result.data))
        $captureResults[$page.id] = "OK"; $syncState[$page.id] = (Get-Date -Format "yyyy-MM-dd HH:mm")
      } else { $captureResults[$page.id] = "FAIL" }
    } catch { $captureResults[$page.id] = "FAIL" }
    finally { Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue }
  } -ThrottleLimit $throttle
} else {
  Write-Host "INFO: PS 5.1 — 직렬 모드"
  foreach ($page in $pages) {
    $htmlPath = Join-Path $outputsDir $page.path.TrimStart("../")
    if (-not (Test-Path $htmlPath)) { $captureResults[$page.id] = "SKIP"; continue }
    $result = Start-CDPCapture ("file:///" + $htmlPath.Replace("\","/")) (Join-Path $imagesDir $page.img) $page.name (Get-WaitMs $htmlPath)
    $captureResults[$page.id] = $result
    if ($result -eq "OK") { $syncState[$page.id] = (Get-Date -Format "yyyy-MM-dd HH:mm") }
  }
}

$okCount   = ($captureResults.Values | Where-Object { $_ -eq "OK"   }).Count
$failCount = ($captureResults.Values | Where-Object { $_ -eq "FAIL" }).Count
$skipCount = ($captureResults.Values | Where-Object { $_ -eq "SKIP" }).Count

$stateObj = @{}; foreach ($kv in $syncState.GetEnumerator()) { $stateObj[$kv.Key] = $kv.Value }
$stateObj | ConvertTo-Json | Set-Content $stateFile -Encoding UTF8

$bs = Load-BuildState $bsFile
if (-not $bs.buildId) { $bs.buildId = (Get-Date -Format "yyyy-MM-dd_HH:mm") }
$bs.mode = if ($fullRebuild) {"full"} else {"incremental"}
foreach ($id in $captureResults.Keys) {
  if (-not $bs.pages.ContainsKey($id)) { $bs.pages[$id] = @{} }
  $bs.pages[$id]["capture"] = $captureResults[$id]
  if ($captureResults[$id] -eq "FAIL") {
    foreach ($step in @("anno","publisher","extract","planner","qa")) { $bs.pages[$id][$step] = "BLOCKED" }
  }
}
$bs.summary = @{ total=$pages.Count; ok=$okCount; fail=$failCount; skip=$skipCount }
Save-BuildState $bsFile $bs
Write-Host "캡처 완료: OK=$okCount SKIP=$skipCount FAIL=$failCount"
