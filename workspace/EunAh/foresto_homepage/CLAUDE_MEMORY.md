# CLAUDE_MEMORY — foresto_homepage
> 작업 시작 전 반드시 읽고, 새로운 실수 발생 시 즉시 업데이트

---

## 핵심 규칙

- **outputs/ 외부 파일 수정 금지.** 클라이언트 전달 파일은 `outputs/` 안에만 있다.
- **관리자 목록 No 역순:** 전 목록 `total - start - i` 패턴 사용. `start + i + 1` (오름차순) 절대 금지.
- **게시판 고정글:** 별도 영역 없음. 단일 tbody에 pinnedPosts 상단 고정(비페이지네이션) + byDate 전체 목록(페이지네이션). `_rowHtml(p, noCell, pinStyle=true)` 헬퍼, 번호 목록은 `pinStyle=false`.
- **배너 관리:** `banner.html`(목록), `banner-edit.html`(등록/수정). 최대 3개. 더보기 버튼명 "더보기" 통일 (linkLabel 필드 없음). 필수: 이미지+메인텍스트. 선택: 상단텍스트/하단텍스트/링크URL.
- **팝업 관리:** `popup.html`(목록), `popup-edit.html`(등록/수정). 필드: 팝업제목(관리자용,미노출)/노출기간/크기W×H/PC위치L·T/이미지(선택)/내용SE2/링크URL(선택). 사용자 팝업 하단: 오늘하루닫기+닫기. 모바일 위치 고정(center).
- **신청자 접수번호:** `APP-2026-XXXXX` 형식. 데이터 필드 `applyNo`. No 다음 컬럼.
- **preview mode 유지.** `index.html`에 서브페이지 링크 차단 스크립트가 있다. 삭제하지 마.
- **팝업 HTML 주석 처리 상태.** 관련 JS는 null-check 처리되어 있다. 팝업 HTML 복구 시 JS 확인 필요.
- **글자 크기 조절 버튼은 달력 영역에 영향 안 줘야 한다.** 달력 관련 CSS는 px 고정값 사용.
- **관리자 반응형 기준: 1100px.** 1100px 이하에서 사이드바 overlay(`.mobile-open`), backdrop(`#sidebarBackdrop`), 햄버거(`.adm-mobile-menu-btn`). `AdminLayout.closeSidebar()`로 닫기. PC 아이콘 모드(sidebar-collapsed)는 1101px 이상에서만 작동. CSS·JS 둘 다 `<= 1100` 기준으로 통일.
- **admin filter-card CSS는 admin.css(Section 17)에 있다.** 각 HTML 파일에 인라인 중복 작성 금지. 페이지 고유 CSS만 `<style>` 블록에 남긴다.
- **ADMIN_API 상수는 admin.js에 있다.** 각 HTML에서 별도 URL 하드코딩 금지. 엔드포인트 변경 시 admin.js 한 곳만 수정.
- **PHP 연동 전환 가이드는 admin/DEV_HANDOFF.md 참조.** 개발자 인수인계 문서. 수정 시 동기화 유지.

---

## 디자인 가이드

### 색상
```
--green-dark:  #20281A   (헤더, 달력 nav 배경, 강조 텍스트)
--green-main:  #05803e   (포인트)
--green-light: #508829   (hover, 링크)
--green-pale:  #F1F5EE   (배경, 패널)
--gray-dark:   #2d3436
--gray-mid:    #636e72
--gray-light:  #dfe6e9
```

### 폰트 크기 (JS 글자 크기 조절 대상 — rem 사용)
```
--text-xs:   0.8125rem  (13px 기준)
--text-sm:   0.875rem   (14px)
--text-md:   1rem       (16px)
--text-base: 1.125rem   (18px)
--text-lg:   1.25rem    (20px)
--text-xl:   1.375rem   (22px)
```

### 폰트 크기 (글자 크기 조절 영향 없는 고정 영역 — px 사용)
```
달력 nav:          16px
달력 요일 헤더:    16px
달력 날짜 셀:      18px
달력 일정 항목:    18px
```

### 레이아웃
```
컨테이너 최대폭:  1700px
헤더 높이:        120px (유틸바 40px + 내비 80px)
메인 콘텐츠 높이: min-height 560px (고정 height 아님 — 폰트 커지면 늘어남)
```

---

## 반복 실수 목록

| # | 상황 | 실수 | 결과 | 정답 |
|---|---|---|---|---|
| 1 | cal-schedule-box 내용 잘릴 때 | `overflow: hidden` 제거 | 박스가 옆 패널보다 커짐 | `overflow-y: auto`로 교체 |
| 2 | 폰트 커질 때 패널 내용 잘릴 때 | `height: 560px` 고정 유지 | 글자 크기 3단계 + 6줄 달 → 일정 박스 짤림 | `min-height: 560px`로 변경, 부모 컨테이너도 동일하게 |
| 3 | HTML 요소 주석 처리 후 | JS null-check 없이 `.addEventListener()` 호출 | TypeError → 이후 스크립트 전체 멈춤(슬라이더 사라짐) | `const el = getElementById('x'); if (el) { ... }` |
| 4 | 모바일 가운데 정렬 | `text-align: center` 부모에 적용 | 블록 자식 요소 여전히 왼쪽 치우침 | 부모에 `display:flex; flex-direction:column; align-items:center` + 자식 `width:100%` |
| 5 | 버튼 너비 일치시킬 때 | `min-width: 168px` (px 고정) | 글자 크기 변경 시 인접 버튼과 너비 달라짐 | `min-width: 10.5rem` (rem 기반 스케일) |
| 6 | 한국어 텍스트 길이 제한 | `white-space: nowrap; text-overflow: ellipsis` | 폰트 커지면 텍스트 가로로 잘림 | `word-break: keep-all`로 교체, 줄바꿈 허용 |
| 7 | CSS 파일 편집 전 | Read 없이 바로 Edit 시도 | 린터가 파일 수정 후 old_string 불일치 → Edit 실패 | 편집 직전 항상 Read로 최신 내용 확인 후 Edit |
| 8 | 달마다 달력 높이 다를 때 | cal-cell에 min-height 미적용 | 5줄/6줄 달마다 캘린더 높이 달라져 일정 박스 출렁임 | `cal-cell { min-height: 40px }` 고정 |

---

## 작업 전 체크리스트

git push 전 반드시 확인:

- [ ] preview mode 스크립트 살아있는지 (`index.html` 내 `App.toast` 포함 클릭 차단 블록)
- [ ] 글자 크기 3단계에서 달력 일정 박스 잘리지 않는지
- [ ] 5월, 10월 등 6줄짜리 달에서 레이아웃 무너지지 않는지
- [ ] 글자 크기 3단계에서 패밀리사이트 버튼 너비 "구 홈페이지" 버튼과 일치하는지
- [ ] 모바일(600px 이하) 레이아웃 깨지지 않는지
- [ ] HTML 요소 주석 처리 시 관련 JS null-check 처리됐는지

---

## 최근 작업 이력

| 날짜 | 내용 | 변경 파일 |
|---|---|---|
| 2026-03-25 | CLAUDE_MEMORY.md 생성 및 반복 실수 표 정리 | CLAUDE_MEMORY.md |
| 2026-03-25 | 달력 영역 px 고정 폰트, 빈 셀 min-height 40px, content-main-grid min-height 전환 | main.css |
| 2026-03-25 | footer-family-btn min-width rem 전환 (10.5rem) | common.css |
| 2026-03-24 | preview mode 추가, 팝업 JS null-safety 처리, 슬라이더 복구 | index.html |
| 2026-03-24 | 마이페이지 비밀번호 변경 / 탈퇴하기 → 모달로 이동, 사이드메뉴 정리 | mypage/index.html |
| 2026-03-25 | 관리자 사이드바 PNG 아이콘 교체, nav-arrow img rotate, collapsed 아이콘 가운데 정렬 (gap:0) | admin.css, admin.js |
| 2026-03-25 | 드롭다운 chevron-down.png 교체 (list-filter-select, list-pagesize-select, kw-select, select.form-control) | list-common.css, admin.css, applicants.html |
| 2026-03-25 | 신청자 통합 관리 전면 개편 (컬럼 추가, 13컬럼 노스크롤, 수료상태 변경, 상세페이지 신규) | applicants.html, applicant-detail.html |
| 2026-03-25 | 관리자 전역 테이블/폰트 기준 admin.css 통합, 각 페이지 중복 스타일 제거 | admin.css, members.html, courses.html, members-withdrawn.html, history.html |
| 2026-03-25 | 전 목록 No 역순(total-start-i) 통일, 접수번호 컬럼 추가, board.html 상단고정글 영역 신규 | members.html, members-withdrawn.html, courses.html, applicants.html, calendar.html, board.html |
| 2026-03-25 | 배너관리 목록/등록수정 신규, 더보기 버튼명 통일, 날짜 초(ss) 전체 적용, 사이드 chevron 아이콘 | banner.html, banner-edit.html, admin.js, board.html, applicants.html, applicant-detail.html, members-withdrawn.html, courses.html, calendar.html, member-detail.html |
| 2026-03-25 | 팝업관리 목록/등록수정 신규, admin.js popup href 연결 | popup.html, popup-edit.html, admin.js |
| 2026-03-25 | 관리자 새로고침 버튼(btn-refresh) + 날짜 프리셋(오늘/7일/30일/3개월/6개월) 전 목록 페이지 적용 | admin.css, members.html, members-withdrawn.html, courses.html, applicants.html, board.html, calendar.html, history.html, popup.html, banner.html |
| 2026-03-25 | 회원아카데미 탭 메뉴 admin-topbar 인라인 배치 (has-tabs 클래스), 탭 min-width 통일(96px) | courses.html |
| 2026-03-26 | 기타신청관리 4종 목록+상세 신규 (정회원/강사/숲해설/후원), admin.js nav href 연결 | apply-regular.html, apply-regular-detail.html, apply-instructor.html, apply-instructor-detail.html, apply-forest.html, apply-forest-detail.html, apply-sponsor.html, apply-sponsor-detail.html, admin.js |
| 2026-03-26 | 강사신청 활동요일 체크박스 전환 (무관+개별 상호배제), 정회원신청 사용자 폼 신규, membership.html CTA 버튼 연결 | instructor.html, regular-apply.html, membership.html |
| 2026-03-26 | 조직도·임원진 사용자 페이지 전면 개편 — 조직도 이미지 영역, 임원진 카드 그리드(2열), 사진 hover portrait, 직책 중복 통합, 전체 스크린샷 52장 + members 단독 스크린샷 스크립트 | members.html, about.css, capture_screens.ps1, capture_members.ps1 |
| 2026-03-27 | 후원신청 3단계 마법사 → 단일 통합폼 전환 (정회원신청 패턴 동일), form-section-label 클래스 신규 | donate.html, participate.css |
| 2026-03-27 | 탭메뉴(.sub-lnb) 하단 여백 48px 통일 — sub-lnb margin-bottom 단일 기준, content-wrap padding-top 제거 | layout-lnb.css, components.css |
| 2026-03-27 | 스크린샷 뷰어 PAGES 배열 재넘버링(01~39), 동일 디자인 태깅(design 필드), 미캡처 placeholder, 3개 미포함 페이지 추가 | screenshots/index.html |
| 2026-03-30 | 갤러리 검색 필터, 갤러리·협회지·언론보도·숲일터 관리자 게시판 연결, 동아리자료방 삭제, 자료실→회원활동 이동, 숲일터 신규 페이지 생성 | community/gallery.html, archive.html, archive-detail.html, admin.js, admin/board.html, board-edit.html, board-detail.html, header.js, community.js, member/forest-work.html, member/forest-work-detail.html |
| 2026-03-30 | 헤더 메가 드롭다운 적용 — 2depth 컬럼 헤더 + 3depth 링크, hideLnb 항목 메가패널 미노출, 자료실·숲일터·강사신청 flat 컬럼 처리 | common.css, header.js |
| 2026-03-30 | 메인 달력 일정 링크 아이콘(SVG) 노출 및 클릭 이동, 공지사항 행 클릭 → notice-detail 이동, 연혁 라벨·월 삭제 + 년도 이미지 노출 | index.html, main.css, about.js, about.css |
| 2026-03-30 | 연혁 년도 이미지 원 RC×3(108px) 확대, SVG clipPath 원형 클립, 패딩 래퍼 div로 overflow 잘림 방지 | about.js |
| 2026-03-31 | 관리자 PHP 연동 준비 — filter-card CSS 공통화(admin.css), 목록 HTML 인라인 style 제거, ADMIN_API 엔드포인트 config 추가, AJAX TODO 주석 삽입, DEV_HANDOFF.md 신규 | admin.css, admin.js, members.html, members-withdrawn.html, courses.html, applicants.html, calendar.html, board.html, apply-*.html, admin/DEV_HANDOFF.md |
| 2026-03-31 | 관리자 모바일 반응형 — 768px 이하 사이드바 slide-in overlay(backdrop), 상단바 햄버거 버튼, 필터 세로 스택, 통계 1열, 테이블/리스트 하단바 스택 | admin.css, admin.js |
| 2026-03-31 | 기타신청관리 회원구분 추가 — 정회원/강사/후원 목록 회원구분 필터·컬럼·이름(ID) 노출, 숲해설신청 제외 | apply-regular.html, apply-instructor.html, apply-sponsor.html |
| 2026-03-31 | 게시판 상단고정 — board.html 전 게시판 pinned:true 더미, 목록 토글 제거(표시만), board-edit.html 전 게시판 고정 체크박스 노출 | board.html, board-edit.html |
| 2026-03-31 | 기타신청 상세 첨부파일 다운로드 UI — doc-tag 배지 제거, 파일명 클릭 다운로드, file-list flex:1 전폭 | apply-regular-detail.html, apply-instructor-detail.html, apply-forest-detail.html |
| 2026-03-31 | 동아리 소개 갤러리 회원모집중 제목추가 표시 — CLUB_DATA recruiting 필드, 고정 배지 카드 노출 | member.js |
| 2026-03-31 | 동아리 소식 상단고정 유지, 제목 옆 ★회원모집중★ 텍스트 제거 (pinnedRowRenderer·rowRenderer 양쪽) | member.js |
| 2026-04-01 | 동아리 소식 고정 배지·상단노출 완전 제거 (pinnedData·pinnedRowRenderer 삭제, pinned 필드 제거), 유관기관 바로가기 레이블 16px·슬라이드 카드 16px | member.js, common.css |
| 2026-03-31 | 교육과정·회원아카데미 접수중 1개 보장 — IIFE에 타입별 hasOpen 체크, 없으면 첫 항목 from/to를 오늘 기준 -7~+14일로 동적 조정 | education.js |
| 2026-04-01 | 갤러리 회원 작성 기능 추가 — 로그인 회원 글쓰기 버튼 노출, gallery-write.html 신규 (이미지 최대 10장, 첫 장 대표 이미지, 미리보기 그리드) | community/gallery.html, community/gallery-write.html |
| 2026-04-01 | 강사신청 폼→일정 기반으로 전환 — 사용자: 일정목록(instructor.html)/상세+신청모달(instructor-detail.html 신규), 관리자: 일정관리(instructor-schedule.html 신규)/일정등록수정(instructor-schedule-edit.html 신규)/신청자관리(apply-instructor.html 일정필터+배너 개편), admin.js nav에 강사신청 일정관리 추가, education.js 강사활동 타입(7000+) 추가 | member/instructor.html, member/instructor-detail.html, admin/instructor-schedule.html, admin/instructor-schedule-edit.html, admin/apply-instructor.html, admin.js, education.js |
| 2026-04-01 | FAQ 실제 콘텐츠 4개 교체, 답변 포매터(formatAnswer) 추가 — ▣/숫자/별표 굵게+크게, ※ 회색소형, - 들여쓰기 | education/faq.html |
| 2026-04-01 | 갤러리 글쓰기 단순화 — 에디터 내 첫 이미지=썸네일, 별도 이미지 업로드 영역 제거, 이미지 없으면 기본이미지 | community/gallery-write.html |
| 2026-04-01 | 코드 품질 리팩토링 — reset.css 중복 링크 61개 파일 제거(common.css @import 중복), variables.css 중복 1건, 샘플 데이터 전체 3건으로 축소(education 7타입/community 6종/member 6종) | 전 HTML 61개, education.js, community.js, member.js |
| 2026-04-01 | 아이콘 경로 전체 마이그레이션 — common_assets/icons/ → assets/icons/, 미존재 아이콘 17개 복사, 강사신청 회원전용 제한, apply-instructor.html 회원구분 필터 제거, apply-instructor-detail ID 수정(5000대), instructor-schedule-edit 신규(course-edit 동일 레이아웃) | admin.js, 19개 admin HTML, common.css, list-common.css, about.css, admin.css |
| 2026-04-01 | 마이페이지 신청내역 통합 — 교육+강사활동 단일 탭, 상태 신청/취소/미선정/완료 공통화, 수료증↔활동확인서 type 파라미터 분기, mypage.css .my-wrap 추가(헤더 동일 폭) | mypage/index.html, mypage/certificate-preview.html, assets/js/pages/mypage.js, assets/css/pages/mypage.css |
| 2026-04-07 | 관리자 전 페이지 샘플데이터 JS→HTML 전환 — Array.from mock 데이터·렌더링 함수 전부 제거, 최대 3건 정적 HTML 삽입, 빈 상태 주석 추가, PHP 백엔드 연동 준비 완료 | admin/*.html (24개 전체) |
| 2026-04-14 | SB pages.js 템플릿 기반 재구성 — 61개→42개 항목, 0.공통정의(C01~C03)/T1~T5 템플릿+DIFF표/고유화면 구조화. spec 파일 7개 신규(C01·C02·C03·T1DIFF·T2DIFF·T3DIFF·T4DIFF). U56→U56-1·U56-2·U56-PW·U56-WD 분리, U62(후기작성) 추가 | pages.js, specs/C01.js, C02.js, C03.js, T1DIFF.js, T2DIFF.js, T3DIFF.js, T4DIFF.js |
| 2026-04-14 | T1~T4 DIFF 차이점 명세표를 대표화면에 통합 — T1DIFF/T2DIFF/T3DIFF/T4DIFF SPECS key를 T1-01/T2-L/T3-L/T4-TAB1으로 변경, pages.js DIFF 항목 제거, T1 7컬럼→5컬럼/T2 8컬럼→6컬럼/T3 8컬럼→5컬럼/T4 8컬럼→4컬럼으로 가로 스크롤 제거 | T1DIFF.js, T2DIFF.js, T3DIFF.js, T4DIFF.js, pages.js |
| 2026-04-14 | pages.js 사용자 화면 전면 스펙 업데이트 — T2 신청모달 3단계 위저드/권한 명확화(교육=일반회원/회원활동=정회원), T3 갤러리형 관리자 게시판 포함(사공단소개·동아리소개 전체노출, 협회지 4열3행), T4 사용자 등록 게시판 필터·컬럼·등록폼 상세화, T5 갤러리 썸네일 fallback 명시, U10 오시는길 고유화면 신규(카카오API), T1-DIFF 오시는길 분리, U20 수료생후기 3열카드형 스펙, U62 마이페이지 연동 경로 명확화 | pages.js |
