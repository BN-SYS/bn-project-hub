# validate_phase.ps1 — v2.0.1 단계 전환 유효성 검사
# 사용법: powershell -File validate_phase.ps1 -phase 02_planning
# 출력:   { "pass": true/false, "phase": "...", "errors": [...], "warnings": [...] }
#
# case 이름 규칙: "XX_phase"는 "XX 단계로 진입하기 위한 게이트"를 의미.
# 예: "03_requirements" = 모듈 3에 진입하기 위해 모듈 2 산출물을 검증.

param(
  [Parameter(Mandatory=$true)][string]$phase,
  [string]$projectRoot = (Get-Location).Path
)
$ErrorActionPreference = "Continue"
$errors = @(); $warnings = @()

function Assert-File($path, $label) {
  if (-not (Test-Path $path)) { $script:errors += "파일 없음: $label"; return $false }
  return $true
}
function Read-Json($path) {
  try { return (Get-Content $path -Encoding UTF8 -Raw | ConvertFrom-Json) }
  catch { $script:errors += "JSON 오류: $path — $_"; return $null }
}

switch ($phase) {

  # 모듈 2 진입 게이트: 모듈 1 산출물 검증
  "02_planning" {
    Assert-File "$projectRoot/01_rfp/rfp_분석서.md" "rfp_분석서.md" | Out-Null
    if (Assert-File "$projectRoot/01_rfp/기능목록_초안.json" "기능목록_초안.json") {
      $f = Read-Json "$projectRoot/01_rfp/기능목록_초안.json"
      if ($f -and $f.Count -eq 0) { $errors += "기능목록_초안.json 비어있음" }
    }
  }

  # 모듈 3 진입 게이트: 모듈 2 산출물 검증
  "03_requirements" {
    Assert-File "$projectRoot/02_planning/기획서.md" "기획서.md" | Out-Null
    if (Assert-File "$projectRoot/02_planning/wbs.json" "wbs.json") {
      $wbs = Read-Json "$projectRoot/02_planning/wbs.json"
      if ($wbs) {
        $phases = $wbs | ForEach-Object { $_.phase }
        # v2.0 필수 phase: 프로토타입 우선 프로세스 반영
        $required = @("기획", "프로토타입", "디자인조정", "퍼블리싱", "백엔드개발", "QA", "납품")
        foreach ($r in $required) {
          if ($phases -notcontains $r) { $errors += "wbs.json phase 누락: '$r'" }
        }
        $total = ($wbs | ForEach-Object { $_.tasks.Count } | Measure-Object -Sum).Sum
        if ($total -lt 5) { $warnings += "태스크 수($total)가 너무 적음" }
      }
    }
  }

  # 모듈 4 진입 게이트: 모듈 3 산출물 검증
  "04_storyboard" {
    Assert-File "$projectRoot/03_requirements/요구사항_정의서.md" "요구사항_정의서.md" | Out-Null
    if (Assert-File "$projectRoot/03_requirements/pages_draft.json" "pages_draft.json") {
      $draft = Read-Json "$projectRoot/03_requirements/pages_draft.json"
      if ($draft) {
        if (($draft | Where-Object { $_.section -eq "user" }).Count -eq 0) {
          $errors += "pages_draft.json에 user 섹션 없음"
        }
        if (($draft | Where-Object { $_.section -eq "admin" }).Count -eq 0) {
          $warnings += "pages_draft.json에 admin 섹션 없음 (관리자 없는 프로젝트면 무시)"
        }
        $ids = $draft | ForEach-Object { $_.id }
        $dups = $ids | Group-Object | Where-Object { $_.Count -gt 1 } | ForEach-Object { $_.Name }
        if ($dups.Count -gt 0) { $errors += "중복 ID: $($dups -join ', ')" }
        $missing = $draft | Where-Object { -not $_.id -or -not $_.section -or -not $_.name -or -not $_.path }
        if ($missing.Count -gt 0) { $errors += "필수 필드 누락 $($missing.Count)개" }
      }
    }
  }

  # 모듈 5 진입 게이트: 모듈 4 산출물 검증
  "05_dev_handoff" {
    $pagesPath = "$projectRoot/04_storyboard/story_board/data/pages.json"
    $specsDir  = "$projectRoot/04_storyboard/story_board/data/specs"
    $bsPath    = "$projectRoot/04_storyboard/story_board/data/.build_state.json"
    if (Assert-File $pagesPath "pages.json") {
      $p = Read-Json $pagesPath
      if ($p -and $p.Count -eq 0) { $errors += "pages.json 비어있음" }
    }
    if (Test-Path $specsDir) {
      $specs = Get-ChildItem $specsDir -Filter "*.js" | Where-Object { $_.Name -ne "_common.js" }
      if ($specs.Count -eq 0) { $errors += "specs/ 화면 스펙 없음" }
      # meta.json 존재 확인
      $metas = Get-ChildItem $specsDir -Filter "*.meta.json"
      if ($metas.Count -eq 0) { $warnings += "specs/*.meta.json 없음 — dev-qa-agent가 폴백(.js Read) 사용" }
      elseif ($metas.Count -lt $specs.Count) { $warnings += "meta.json($($metas.Count))이 specs($($specs.Count))보다 적음" }
    } else { $errors += "specs/ 폴더 없음" }
    if (Assert-File $bsPath ".build_state.json") {
      $bs = Read-Json $bsPath
      if ($bs) {
        if ($bs.step -ne "done") { $errors += "build_state.step='$($bs.step)' (done 아님)" }
        if ($bs.failCount -gt 0) { $errors += "build_state.failCount=$($bs.failCount)" }
      }
    }
  }

  # 모듈 6 진입 게이트: 모듈 5 산출물 검증
  "06_qa" {
    Assert-File "$projectRoot/05_dev_handoff/개발전달서.md" "개발전달서.md" | Out-Null
    if (Assert-File "$projectRoot/05_dev_handoff/api_spec.md" "api_spec.md") {
      $lines = (Get-Content "$projectRoot/05_dev_handoff/api_spec.md" -Encoding UTF8).Count
      if ($lines -le 5) { $errors += "api_spec.md 너무 짧음 ($lines줄)" }
    }
  }

  # 모듈 7 진입 게이트: 모듈 6 산출물 검증
  "07_delivery" {
    if (Assert-File "$projectRoot/06_qa/qa_checklist.json" "qa_checklist.json") {
      $qa = Read-Json "$projectRoot/06_qa/qa_checklist.json"
      if ($qa) {
        $total = ($qa | ForEach-Object { $_.tests.Count } | Measure-Object -Sum).Sum
        if ($total -eq 0) { $errors += "qa_checklist.json 테스트 없음" }
      }
    }
  }

  default {
    $errors += "알 수 없는 phase: $phase. 유효값: 02_planning 03_requirements 04_storyboard 05_dev_handoff 06_qa 07_delivery"
  }
}

@{ pass=($errors.Count -eq 0); phase=$phase; errors=$errors; warnings=$warnings } | ConvertTo-Json -Compress
