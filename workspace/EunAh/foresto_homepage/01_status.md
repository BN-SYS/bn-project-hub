# 프로젝트 상태 — foresto_homepage

## 현재 단계
- [x] 브리프 분석
- [x] HTML 프로토타입 — 사용자 전 페이지
- [x] HTML 프로토타입 — 관리자 전 페이지 (PHP 연동 준비 완료)
- [x] 관리자 샘플 데이터 JS→HTML 전환 (24개 파일)
- [ ] SB 스토리보드 어노테이션 — 관리자(A) 완료, 사용자(U)·문서(D) 진행 중

## 완료된 산출물
- `outputs/` — 사용자 전 페이지 HTML
- `admin/` — 관리자 24개 페이지 HTML (PHP 연동 준비 완료)
- `admin/DEV_HANDOFF.md` — PHP 연동 인수인계 문서
- `story_board/` — SB 뷰어 (어노테이션 오버레이 시스템 포함)

## 주요 자율 판단 사항
- preview mode: index.html 링크 차단 스크립트 유지
- 관리자 반응형 기준: 1100px (overlay 사이드바)
- 팝업 HTML 주석 처리 상태 — 관련 JS null-check 처리됨
- SB 어노테이션: 번호는 설명 대상 요소의 좌측 앞 배치 (x≈13%)

## 최근 작업 (2026-04-13)
- 사용자 페이지 개발 전달 최적화 완료
  - app.js: USER_API + UserHttp 추가 (JS FETCH 패턴)
  - education.js: 강좌 상태 이번달 기준 자동 계산 (_setDemoDates)
  - 샘플 데이터 최대 3건으로 통일 (index, reviews, members, about, mypage, community-media)
  - CSS 모든 font-size px → CSS 변수 전환 (9개 파일, 글자크기 조절 버튼 대응)
  - outputs/00_DEV_HANDOFF.md 생성 (사용자 페이지 PHP 연동 가이드)

## 다음 액션
SB 어노테이션 사용자(U) + 문서(D) 섹션 완료 → git push
