<#
  capture.ps1 — 스토리보드 스크린샷 자동 캡처
  
  ★ 기획자가 수정할 곳: 바로 아래 배열 2개만.
  ★ pages.js의 img 파일명과 name 값을 일치시키면 됨.
  ★ 나머지는 건드리지 않는다.
#>

# ══════════════════════════════════════════════════════
# ★ 수정 영역 — pages.js와 동일하게 유지
# ══════════════════════════════════════════════════════

$userPages = @(
  @{name="U01_홈_메인"; path="index.html"},
  @{name="U02_소개_인사말"; path="about/index.html"},
  @{name="U03_소개_미션비전"; path="about/vision.html"},
  @{name="U04_소개_주요사업"; path="about/project.html"},
  @{name="U05_소개_연혁"; path="about/history.html"},
  @{name="U06_소개_조직도임원진"; path="about/members.html"},
  @{name="U07_소개_전국지역협회"; path="about/regions.html"},
  @{name="U08_소개_지역협회_상세"; path="about/region-detail.html"},
  @{name="U09_소개_회원규정"; path="about/regulation.html"},
  @{name="U10_소개_오시는길"; path="about/contact.html"},
  @{name="U11_교육_숲해설가란"; path="education/forester.html"},
  @{name="U12_교육_FAQ"; path="education/faq.html"},
  @{name="U13_교육_기초과정_개요"; path="education/academy.html"},
  @{name="U14_교육_기초과정_신청"; path="education/academy-apply.html"},
  @{name="U15_교육_자격취득_과정소개"; path="education/course-intro.html"},
  @{name="U16_교육_자격취득_목록"; path="education/course-list.html"},
  @{name="U17_교육_자격취득_상세"; path="education/course-detail.html"},
  @{name="U18_교육_역량강화_과정"; path="education/job-training.html"},
  @{name="U19_교육_역량강화_신청"; path="education/job-training-apply.html"},
  @{name="U20_교육_수료생_후기목록"; path="education/reviews.html"},
  @{name="U21_교육_수료생_후기상세"; path="education/review-detail.html"},
  @{name="U22_회원_특강_목록"; path="member/competency.html"},
  @{name="U23_회원_특강_상세"; path="member/competency-detail.html"},
  @{name="U24_회원_아카데미강좌_목록"; path="member/academy-course.html"},
  @{name="U25_회원_아카데미강좌_상세"; path="member/academy-course-detail.html"},
  @{name="U26_회원_멘토링_목록"; path="member/mentoring.html"},
  @{name="U27_회원_멘토링_상세"; path="member/mentoring-detail.html"},
  @{name="U28_회원_사공단_소개"; path="member/sagongdan.html"},
  @{name="U29_회원_사공단_소식목록"; path="member/sagongdan-news.html"},
  @{name="U30_회원_사공단_일지목록"; path="member/sagongdan-log.html"},
  @{name="U31_회원_동아리_목록"; path="member/club.html"},
  @{name="U32_회원_강사신청_일정목록"; path="member/instructor.html"},
  @{name="U33_회원_강사신청_일정상세"; path="member/instructor-detail.html"},
  @{name="U34_회원_숲일터_목록"; path="member/forest-work.html"},
  @{name="U35_회원_숲일터_상세"; path="member/forest-work-detail.html"},
  @{name="U36_커뮤니티_공지사항_목록"; path="community/notice-list.html"},
  @{name="U37_커뮤니티_공지사항_상세"; path="community/notice-detail.html"},
  @{name="U38_커뮤니티_협회캘린더"; path="community/calendar.html"},
  @{name="U39_커뮤니티_협회지_목록"; path="community/newsletter.html"},
  @{name="U40_커뮤니티_협회지_상세"; path="community/newsletter-detail.html"},
  @{name="U41_커뮤니티_언론보도_목록"; path="community/press.html"},
  @{name="U42_커뮤니티_언론보도_상세"; path="community/press-detail.html"},
  @{name="U43_커뮤니티_갤러리_목록"; path="community/gallery.html"},
  @{name="U44_커뮤니티_갤러리_상세"; path="community/gallery-detail.html"},
  @{name="U45_커뮤니티_갤러리_글쓰기"; path="community/gallery-write.html"},
  @{name="U46_커뮤니티_자료실_목록"; path="community/archive.html"},
  @{name="U47_커뮤니티_자료실_상세"; path="community/archive-detail.html"},
  @{name="U48_참여_정회원_가입안내"; path="participate/membership.html"},
  @{name="U49_참여_정회원_신청"; path="participate/regular-apply.html"},
  @{name="U50_참여_후원_안내"; path="participate/donate-info.html"},
  @{name="U51_참여_후원하기"; path="participate/donate.html"},
  @{name="U52_참여_숲해설신청"; path="forest/index.html"},
  @{name="U53_인증_로그인"; path="auth/login.html"},
  @{name="U54_인증_아이디비밀번호찾기"; path="auth/find.html"},
  @{name="U55_인증_회원가입"; path="auth/register.html"},
  @{name="U56_마이페이지_홈"; path="mypage/index.html"},
  @{name="U57_마이페이지_증명서미리보기"; path="mypage/certificate-preview.html"},
  @{name="U58_사이트맵"; path="sitemap.html"},
  @{name="U59_이용약관"; path="terms.html"},
  @{name="U60_개인정보처리방침"; path="privacy.html"},
  @{name="U61_이메일무단수집거부"; path="email.html"}
)

$adminPages = @(
  @{name="A01_회원_목록"; path="admin/members.html"},
  @{name="A02_회원_상세"; path="admin/member-detail.html"},
  @{name="A02_회원_상세_탈퇴"; path="admin/member-detail.html"},
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


# ══════════════════════════════════════════════════════
# ▼ 아래는 수정하지 않는다 (필요 시 $chrome 경로만 확인)
# ══════════════════════════════════════════════════════

# ── 설정 ──────────────────────────────────────────────
$chrome   = $null
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
$baseDir  = $PSScriptRoot
$outDir   = Join-Path $baseDir "..\outputs"
$imgDir   = Join-Path $baseDir "images"
$width    = 1920
$waitMs   = 2500

if (!(Test-Path $imgDir)) { New-Item -ItemType Directory -Path $imgDir -Force | Out-Null }

# ── WebSocket 통신 ────────────────────────────────────
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

  $buf = New-Object byte[] 2097152  # 2MB
  $result = ""
  do {
    $seg = New-Object System.ArraySegment[byte] -ArgumentList @(,$buf)
    $recv = $ws.ReceiveAsync($seg, [System.Threading.CancellationToken]::None).Result
    $result += [System.Text.Encoding]::UTF8.GetString($buf, 0, $recv.Count)
  } while (!$recv.EndOfMessage)

  return $result | ConvertFrom-Json
}

# ── CDP 기반 캡처 ────────────────────────────────────
function Start-CDPCapture {
  param(
    [string]$Name,
    [string]$FileUri,
    [string]$ImgPath
  )

  $port = Get-Random -Minimum 9300 -Maximum 9399
  
  $tmpProfile = Join-Path ([System.IO.Path]::GetTempPath()) "chrome_cap_$port"
  $proc = Start-Process $chrome -ArgumentList @(
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--disable-web-security",
    "--allow-file-access-from-files",
    "--user-data-dir=$tmpProfile",
    "--remote-debugging-port=$port",
    "--window-size=${width},900",
    $FileUri
  ) -PassThru

  Start-Sleep -Milliseconds 2500

  try {
    $json = Invoke-RestMethod "http://localhost:$port/json" -TimeoutSec 5
    $pageTab = $json | Where-Object { $_.type -eq 'page' } | Select-Object -First 1
    if (-not $pageTab) { $pageTab = $json[0] }
    $wsUrl = $pageTab.webSocketDebuggerUrl

    $ws = New-Object System.Net.WebSockets.ClientWebSocket
    $cts = New-Object System.Threading.CancellationTokenSource
    $ws.ConnectAsync([Uri]$wsUrl, $cts.Token).Wait()

    $cmdId = 1

    # 페이지 로드 대기
    for ($i = 0; $i -lt 20; $i++) {
      $r = Send-WS $ws $cmdId "Runtime.evaluate" @{ expression = "document.readyState"; returnByValue = $true }
      $cmdId++
      if ($r.result.result.value -eq "complete") { break }
      Start-Sleep -Milliseconds 300
    }
    Start-Sleep -Milliseconds $waitMs

    # 전체 페이지 높이 측정 (내부 스크롤 컨테이너 overflow 해제 후 측정)
    $jsHeight = @"
(() => {
  document.querySelectorAll('*').forEach(el => {
    const cs = getComputedStyle(el);
    if (cs.position === 'fixed' || cs.position === 'sticky') el.style.position = 'relative';
    if (parseFloat(cs.minHeight) > 300) el.style.minHeight = 'auto';
    if (el !== document.body && el !== document.documentElement) {
      const ov = cs.overflow, ovy = cs.overflowY;
      if (ov === 'hidden' || ovy === 'hidden' || ov === 'auto' || ovy === 'auto' || ov === 'scroll' || ovy === 'scroll') {
        el.style.overflow = 'visible';
        el.style.height = 'auto';
        el.style.maxHeight = 'none';
      }
    }
  });
  const b = document.body, h = document.documentElement;
  const measured = Math.max(b.scrollHeight, b.offsetHeight, h.scrollHeight, h.offsetHeight);
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  return measured + 60;
})()
"@
    $r = Send-WS $ws $cmdId "Runtime.evaluate" @{ expression = $jsHeight; returnByValue = $true }
    $cmdId++
    $height = [int]$r.result.result.value
    if ($height -lt 100) { $height = 3000 }

    # 뷰포트 설정
    Send-WS $ws $cmdId "Emulation.setDeviceMetricsOverride" @{
      width = $width; height = $height; deviceScaleFactor = 1; mobile = $false
    } | Out-Null
    $cmdId++

    Start-Sleep -Milliseconds 500

    # 캡처
    $r = Send-WS $ws $cmdId "Page.captureScreenshot" @{
      format = "png"
      clip = @{ x = 0; y = 0; width = $width; height = $height; scale = 1 }
      captureBeyondViewport = $true
    }
    $cmdId++

    if ($r.result.data) {
      [IO.File]::WriteAllBytes($ImgPath, [Convert]::FromBase64String($r.result.data))
      Write-Host "  OK    $Name (${width}x${height})" -ForegroundColor Green

      # ── 모달 탐지 + 캡처 ──
      $jsModals = @"
(() => {
  const triggers = document.querySelectorAll(
    '[data-bs-toggle="modal"],[data-toggle="modal"],[onclick*="modal"],[onclick*="Modal"],button[class*="modal"],a[class*="modal"],[data-modal],[data-popup]'
  );
  const result = [];
  triggers.forEach((el, i) => {
    result.push({ index: i, text: (el.textContent || '').trim().substring(0, 30) });
  });
  return JSON.stringify(result);
})()
"@
      $r = Send-WS $ws $cmdId "Runtime.evaluate" @{ expression = $jsModals; returnByValue = $true }
      $cmdId++

      try {
        $modals = $r.result.result.value | ConvertFrom-Json
      } catch {
        $modals = @()
      }

      for ($mi = 0; $mi -lt $modals.Count; $mi++) {
        $modal = $modals[$mi]
        $modalImgPath = $ImgPath -replace '\.png$', "_modal$($mi+1).png"

        # 모달 캡처 전 뷰포트를 화면 크기로 복원 (fixed 모달 정상 렌더링)
        Send-WS $ws $cmdId "Emulation.setDeviceMetricsOverride" @{
          width = $width; height = 900; deviceScaleFactor = 1; mobile = $false
        } | Out-Null
        $cmdId++
        Start-Sleep -Milliseconds 300

        # 모달 열기
        $jsOpen = "document.querySelectorAll('[data-bs-toggle=""modal""],[data-toggle=""modal""],[onclick*=""modal""],[onclick*=""Modal""],button[class*=""modal""],a[class*=""modal""],[data-modal],[data-popup]')[$($modal.index)].click()"
        Send-WS $ws $cmdId "Runtime.evaluate" @{ expression = $jsOpen; returnByValue = $true } | Out-Null
        $cmdId++
        Start-Sleep -Milliseconds 1500

        $r = Send-WS $ws $cmdId "Page.captureScreenshot" @{
          format = "png"
          clip = @{ x = 0; y = 0; width = $width; height = 900; scale = 1 }
          captureBeyondViewport = $false
        }
        $cmdId++

        if ($r.result.data) {
          [IO.File]::WriteAllBytes($modalImgPath, [Convert]::FromBase64String($r.result.data))
          $modalLabel = if ($modal.text) { $modal.text } else { "modal" }
          Write-Host "    +   $($Name)_modal$($mi+1) ($modalLabel)" -ForegroundColor Cyan
        }

        # 모달 닫기
        $jsClose = @"
document.querySelectorAll('.modal.show,.modal.in,.modal[style*="block"]').forEach(m=>{m.style.display='none';m.classList.remove('show','in')});
document.querySelectorAll('.modal-backdrop').forEach(b=>b.remove());
document.body.classList.remove('modal-open');document.body.style.overflow='';document.body.style.paddingRight='';
document.querySelectorAll('[class*="modal"][class*="open"],[class*="popup"][class*="open"]').forEach(m=>{m.classList.remove('open','active','show');m.style.display='none'});
"@
        Send-WS $ws $cmdId "Runtime.evaluate" @{ expression = $jsClose; returnByValue = $true } | Out-Null
        $cmdId++
        Start-Sleep -Milliseconds 500
      }

      $ws.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure, "", $cts.Token).Wait()
      return $true
    } else {
      Write-Host "  FAIL  $Name (캡처 데이터 없음)" -ForegroundColor Red
      return $false
    }

  } catch {
    Write-Host "  FAIL  $Name ($($_.Exception.Message))" -ForegroundColor Red
    return $false
  } finally {
    if ($proc -and !$proc.HasExited) { $proc.Kill() }
    Start-Sleep -Milliseconds 500
  }
}

# ── 메인 실행 ────────────────────────────────────────
function Start-CaptureAll {
  param([array]$pages)

  foreach ($pg in $pages) {
    $name = $pg.name
    $filePath = Join-Path $outDir $pg.path

    if (!(Test-Path $filePath)) {
      Write-Host "  SKIP  $name (파일 없음)" -ForegroundColor DarkYellow
      continue
    }

    $fileUri = "file:///" + ((Resolve-Path $filePath).Path -replace '\\','/' -replace '^/','')
    $imgPath = Join-Path $imgDir "$name.png"

    Start-CDPCapture -Name $name -FileUri $fileUri -ImgPath $imgPath
  }
}

Write-Host ""
Write-Host "=== 스토리보드 캡처 시작 ===" -ForegroundColor White
Write-Host "  출력: $imgDir" -ForegroundColor DarkGray
Write-Host ""

Write-Host "-- 사용자 ($($userPages.Count)개) --" -ForegroundColor Green
Start-CaptureAll $userPages

Write-Host ""
Write-Host "-- 관리자 ($($adminPages.Count)개) --" -ForegroundColor Blue
Start-CaptureAll $adminPages

Write-Host ""
Write-Host "=== 완료 ===" -ForegroundColor White
