<#
  capture_admin_only.ps1 — 관리자 화면만 캡처
#>

$adminPages = @(
  @{name="A01_회원_목록"; path="admin/members.html"},
  @{name="A02_회원_상세"; path="admin/member-detail.html"},
  @{name="A03_회원_등록수정"; path="admin/member-edit.html"},
  @{name="A04_탈퇴회원_목록"; path="admin/members-withdrawn.html"},
  @{name="A05_강좌_목록"; path="admin/courses.html"},
  @{name="A06_강좌_상세"; path="admin/course-detail.html"},
  @{name="A07_강좌_등록수정"; path="admin/course-edit.html"},
  @{name="A08_강좌신청자_목록"; path="admin/applicants.html"},
  @{name="A09_강좌신청_등록"; path="admin/apply-register.html"},
  @{name="A10_강좌신청자_상세"; path="admin/applicant-detail.html"},
  @{name="A11_강사일정_목록"; path="admin/instructor-schedule.html"},
  @{name="A12_강사일정_등록수정"; path="admin/instructor-schedule-edit.html"},
  @{name="A13_정회원신청_목록"; path="admin/apply-regular.html"},
  @{name="A14_정회원신청_상세"; path="admin/apply-regular-detail.html"},
  @{name="A15_강사신청_목록"; path="admin/apply-instructor.html"},
  @{name="A16_강사신청_상세"; path="admin/apply-instructor-detail.html"},
  @{name="A17_숲해설신청_목록"; path="admin/apply-forest.html"},
  @{name="A18_숲해설신청_상세"; path="admin/apply-forest-detail.html"},
  @{name="A19_후원신청_목록"; path="admin/apply-sponsor.html"},
  @{name="A20_후원신청_상세"; path="admin/apply-sponsor-detail.html"},
  @{name="A21_일정_목록"; path="admin/calendar.html"},
  @{name="A22_일정_상세"; path="admin/calendar-detail.html"},
  @{name="A23_일정_등록수정"; path="admin/calendar-edit.html"},
  @{name="A24_게시판_목록"; path="admin/board.html"},
  @{name="A25_게시판_글상세"; path="admin/board-detail.html"},
  @{name="A26_게시판_글등록수정"; path="admin/board-edit.html"},
  @{name="A27_조직도임원진_관리"; path="admin/organization.html"},
  @{name="A28_연혁_목록"; path="admin/history.html"},
  @{name="A29_연혁_등록수정"; path="admin/history-edit.html"},
  @{name="A30_배너_목록"; path="admin/banner.html"},
  @{name="A31_배너_등록수정"; path="admin/banner-edit.html"},
  @{name="A32_팝업_목록"; path="admin/popup.html"},
  @{name="A33_팝업_등록수정"; path="admin/popup-edit.html"}
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
  param(
    [System.Net.WebSockets.ClientWebSocket]$ws,
    [int]$id,
    [string]$method,
    [hashtable]$params = @{}
  )
  $json = @{ id = $id; method = $method; params = $params } | ConvertTo-Json -Depth 10 -Compress
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
  $segment = New-Object System.ArraySegment[byte] -ArgumentList @(,$bytes)
  $ws.SendAsync($segment, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, [System.Threading.CancellationToken]::None).Wait()

  $buf = New-Object byte[] 2097152
  $result = ""
  do {
    $seg = New-Object System.ArraySegment[byte] -ArgumentList @(,$buf)
    $recv = $ws.ReceiveAsync($seg, [System.Threading.CancellationToken]::None).Result
    $result += [System.Text.Encoding]::UTF8.GetString($buf, 0, $recv.Count)
  } while (!$recv.EndOfMessage)

  return $result | ConvertFrom-Json
}

function Start-CDPCapture {
  param(
    [string]$Name,
    [string]$FileUri,
    [string]$ImgPath
  )

  $port = Get-Random -Minimum 9300 -Maximum 9399

  $proc = Start-Process $chrome -ArgumentList @(
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--disable-web-security",
    "--allow-file-access-from-files",
    "--remote-debugging-port=$port",
    "--window-size=${width},900",
    $FileUri
  ) -PassThru

  Start-Sleep -Milliseconds 2500

  try {
    $json = Invoke-RestMethod "http://localhost:$port/json" -TimeoutSec 5
    $wsUrl = $json[0].webSocketDebuggerUrl

    $ws = New-Object System.Net.WebSockets.ClientWebSocket
    $cts = New-Object System.Threading.CancellationTokenSource
    $ws.ConnectAsync([Uri]$wsUrl, $cts.Token).Wait()

    $cmdId = 1

    for ($i = 0; $i -lt 20; $i++) {
      $r = Send-WS $ws $cmdId "Runtime.evaluate" @{ expression = "document.readyState"; returnByValue = $true }
      $cmdId++
      if ($r.result.result.value -eq "complete") { break }
      Start-Sleep -Milliseconds 300
    }
    Start-Sleep -Milliseconds $waitMs

    $jsHeight = @"
(() => {
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  document.querySelectorAll('*').forEach(el => {
    const cs = getComputedStyle(el);
    if (cs.position === 'fixed' || cs.position === 'sticky') el.style.position = 'relative';
    if (parseFloat(cs.minHeight) > 300) el.style.minHeight = 'auto';
  });
  const b = document.body, h = document.documentElement;
  return Math.max(b.scrollHeight, b.offsetHeight, b.clientHeight, h.scrollHeight, h.offsetHeight, h.clientHeight);
})()
"@
    $r = Send-WS $ws $cmdId "Runtime.evaluate" @{ expression = $jsHeight; returnByValue = $true }
    $cmdId++
    $height = [int]$r.result.result.value
    if ($height -lt 100) { $height = 3000 }

    Send-WS $ws $cmdId "Emulation.setDeviceMetricsOverride" @{
      width = $width; height = $height; deviceScaleFactor = 1; mobile = $false
    } | Out-Null
    $cmdId++

    Start-Sleep -Milliseconds 500

    $r = Send-WS $ws $cmdId "Page.captureScreenshot" @{
      format = "png"
      clip = @{ x = 0; y = 0; width = $width; height = $height; scale = 1 }
      captureBeyondViewport = $true
    }
    $cmdId++

    if ($r.result.data) {
      [IO.File]::WriteAllBytes($ImgPath, [Convert]::FromBase64String($r.result.data))
      Write-Host "  OK    $Name (${width}x${height})" -ForegroundColor Green
    } else {
      Write-Host "  FAIL  $Name (캡처 데이터 없음)" -ForegroundColor Red
    }

    $ws.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure, "", $cts.Token).Wait()

  } catch {
    Write-Host "  FAIL  $Name ($($_.Exception.Message))" -ForegroundColor Red
  } finally {
    if ($proc -and !$proc.HasExited) { $proc.Kill() }
    Start-Sleep -Milliseconds 500
  }
}

Write-Host ""
Write-Host "=== 관리자 화면 캡처 시작 ($($adminPages.Count)개) ===" -ForegroundColor Blue
Write-Host "  출력: $imgDir" -ForegroundColor DarkGray
Write-Host ""

foreach ($pg in $adminPages) {
  $fp = Join-Path $outDir $pg.path
  if (!(Test-Path $fp)) {
    Write-Host "  SKIP  $($pg.name) (파일 없음)" -ForegroundColor DarkYellow
    continue
  }
  $uri = "file:///" + ((Resolve-Path $fp).Path -replace '\\','/' -replace '^/','')
  $img = Join-Path $imgDir "$($pg.name).png"
  Start-CDPCapture -Name $pg.name -FileUri $uri -ImgPath $img
}

Write-Host ""
Write-Host "=== 완료 ===" -ForegroundColor White
