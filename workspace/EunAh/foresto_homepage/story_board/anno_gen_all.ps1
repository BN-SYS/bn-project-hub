<#
  anno_gen_all.ps1 — 전체 화면 어노테이션 좌표 일괄 자동 생성
  사용법: powershell -ExecutionPolicy Bypass -File "anno_gen_all.ps1"
  옵션:   -section user   (사용자 페이지만)
          -section admin  (관리자 페이지만)
          -section all    (전체, 기본값)
#>
param([string]$section = "all")

$baseDir = $PSScriptRoot
$script  = Join-Path $baseDir "anno_gen.ps1"
$psCli   = if ($env:OS -eq "Windows_NT") { "powershell" } else { "pwsh" }

# ── 페이지 목록 (capture.ps1과 동일하게 유지) ──────────────
$userPages = @(
  @{id="U01"; path="index.html"},
  @{id="U02"; path="about/index.html"},
  @{id="U03"; path="about/vision.html"},
  @{id="U04"; path="about/project.html"},
  @{id="U05"; path="about/history.html"},
  @{id="U06"; path="about/members.html"},
  @{id="U07"; path="about/regions.html"},
  @{id="U08"; path="about/region-detail.html"},
  @{id="U09"; path="about/regulation.html"},
  @{id="U10"; path="about/contact.html"},
  @{id="U11"; path="education/forester.html"},
  @{id="U12"; path="education/faq.html"},
  @{id="U13"; path="education/academy.html"},
  @{id="U14"; path="education/academy-apply.html"},
  @{id="U15"; path="education/course-intro.html"},
  @{id="U16"; path="education/course-list.html"},
  @{id="U17"; path="education/course-detail.html"},
  @{id="U18"; path="education/job-training.html"},
  @{id="U19"; path="education/job-training-apply.html"},
  @{id="U20"; path="education/reviews.html"},
  @{id="U21"; path="education/review-detail.html"},
  @{id="U22"; path="member/competency.html"},
  @{id="U23"; path="member/competency-detail.html"},
  @{id="U24"; path="member/academy-course.html"},
  @{id="U25"; path="member/academy-course-detail.html"},
  @{id="U26"; path="member/mentoring.html"},
  @{id="U27"; path="member/mentoring-detail.html"},
  @{id="U28"; path="member/sagongdan.html"},
  @{id="U29"; path="member/sagongdan-news.html"},
  @{id="U30"; path="member/sagongdan-log.html"},
  @{id="U31"; path="member/club.html"},
  @{id="U32"; path="member/instructor.html"},
  @{id="U33"; path="member/instructor-detail.html"},
  @{id="U34"; path="member/forest-work.html"},
  @{id="U35"; path="member/forest-work-detail.html"},
  @{id="U36"; path="community/notice-list.html"},
  @{id="U37"; path="community/notice-detail.html"},
  @{id="U38"; path="community/calendar.html"},
  @{id="U39"; path="community/newsletter.html"},
  @{id="U40"; path="community/newsletter-detail.html"},
  @{id="U41"; path="community/press.html"},
  @{id="U42"; path="community/press-detail.html"},
  @{id="U43"; path="community/gallery.html"},
  @{id="U44"; path="community/gallery-detail.html"},
  @{id="U45"; path="community/gallery-write.html"},
  @{id="U46"; path="community/archive.html"},
  @{id="U47"; path="community/archive-detail.html"},
  @{id="U48"; path="participate/membership.html"},
  @{id="U49"; path="participate/regular-apply.html"},
  @{id="U50"; path="participate/donate-info.html"},
  @{id="U51"; path="participate/donate.html"},
  @{id="U52"; path="forest/index.html"},
  @{id="U53"; path="auth/login.html"},
  @{id="U54"; path="auth/find.html"},
  @{id="U55"; path="auth/register.html"},
  @{id="U56"; path="mypage/index.html"},
  @{id="U57"; path="mypage/certificate-preview.html"},
  @{id="U58"; path="sitemap.html"},
  @{id="U59"; path="terms.html"},
  @{id="U60"; path="privacy.html"},
  @{id="U61"; path="email.html"}
)

$adminPages = @(
  @{id="A01"; path="admin/members.html"},
  @{id="A02"; path="admin/member-detail.html"},
  @{id="A03"; path="admin/member-edit.html"},
  @{id="A04"; path="admin/members-withdrawn.html"},
  @{id="A05"; path="admin/courses.html"},
  @{id="A06"; path="admin/course-detail.html"},
  @{id="A07"; path="admin/course-edit.html"},
  @{id="A08"; path="admin/applicants.html"},
  @{id="A09"; path="admin/apply-register.html"},
  @{id="A10"; path="admin/applicant-detail.html"},
  @{id="A11"; path="admin/instructor-schedule.html"},
  @{id="A12"; path="admin/instructor-schedule-edit.html"},
  @{id="A13"; path="admin/apply-regular.html"},
  @{id="A14"; path="admin/apply-regular-detail.html"},
  @{id="A15"; path="admin/apply-instructor.html"},
  @{id="A16"; path="admin/apply-instructor-detail.html"},
  @{id="A17"; path="admin/apply-forest.html"},
  @{id="A18"; path="admin/apply-forest-detail.html"},
  @{id="A19"; path="admin/apply-sponsor.html"},
  @{id="A20"; path="admin/apply-sponsor-detail.html"},
  @{id="A21"; path="admin/calendar.html"},
  @{id="A22"; path="admin/calendar-detail.html"},
  @{id="A23"; path="admin/calendar-edit.html"},
  @{id="A24"; path="admin/board.html"},
  @{id="A25"; path="admin/board-detail.html"},
  @{id="A26"; path="admin/board-edit.html"},
  @{id="A27"; path="admin/organization.html"},
  @{id="A28"; path="admin/history.html"},
  @{id="A29"; path="admin/history-edit.html"},
  @{id="A30"; path="admin/banner.html"},
  @{id="A31"; path="admin/banner-edit.html"},
  @{id="A32"; path="admin/popup.html"},
  @{id="A33"; path="admin/popup-edit.html"}
)

# ── 실행 대상 결정 ───────────────────────────────────────
$targets = switch ($section) {
  "user"  { $userPages }
  "admin" { $adminPages }
  default { $userPages + $adminPages }
}

# ── 일괄 실행 ────────────────────────────────────────────
$total = $targets.Count
$ok    = 0
$skip  = 0
$fail  = 0

Write-Host ""
Write-Host "=== anno_gen 일괄 실행 ($section, $total 개) ===" -ForegroundColor White
Write-Host ""

foreach ($pg in $targets) {
  $specPath = Join-Path $baseDir "data\specs\$($pg.id).js"
  $htmlPath = Join-Path $baseDir "..\outputs\$($pg.path)"

  if (!(Test-Path $specPath)) {
    Write-Host "SKIP  $($pg.id)  (spec 없음)" -ForegroundColor DarkYellow
    $skip++
    continue
  }
  if (!(Test-Path $htmlPath)) {
    Write-Host "SKIP  $($pg.id)  (HTML 없음: $($pg.path))" -ForegroundColor DarkYellow
    $skip++
    continue
  }

  # data-sb-anno 속성이 없으면 건너뜀
  $html = [System.IO.File]::ReadAllText($htmlPath, [System.Text.Encoding]::UTF8)
  if ($html -notmatch 'data-sb-anno') {
    Write-Host "SKIP  $($pg.id)  (data-sb-anno 없음 — HTML에 속성 추가 필요)" -ForegroundColor DarkYellow
    $skip++
    continue
  }

  Write-Host "RUN   $($pg.id)  $($pg.path)" -ForegroundColor Cyan
  $result = & $psCli -ExecutionPolicy Bypass -File $script -pageId $pg.id -path $pg.path 2>&1
  if ($LASTEXITCODE -eq 0 -or ($result -match "갱신 완료")) {
    Write-Host "  OK" -ForegroundColor Green
    $ok++
  } else {
    Write-Host "  FAIL" -ForegroundColor Red
    $result | Where-Object { $_ -match "오류|FAIL|error" } | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
    $fail++
  }
}

Write-Host ""
Write-Host "=== 완료: OK=$ok  SKIP=$skip  FAIL=$fail ===" -ForegroundColor White
