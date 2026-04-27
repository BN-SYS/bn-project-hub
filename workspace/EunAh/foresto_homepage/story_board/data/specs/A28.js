// ============================================================
//  A28 — 팝업 관리
//  그룹 : 콘텐츠관리
//  섹션 : admin
//  작성일 : 2026-04-06
// ============================================================

window.SPECS       = window.SPECS       || {};
window.ANNOTATIONS = window.ANNOTATIONS || {};

window.ANNOTATIONS['A28'] = [
  { n: 1, x: 13.5, y: 9 },   // 상태 필터 탭
  { n: 2, x: 13.8, y: 12.5 },   // 팝업 목록 테이블
  { n: 3, x: 13.8, y: 28.4 },   // 페이지네이션
];

window.SPECS['A28'] = `

<!-- ── 목적 ──────────────────────────────────────── -->
<h3>목적</h3>
<p>사이트 팝업을 목록으로 관리하는 화면. 상태 필터, 노출 순서 변경, 미리보기, 수정·삭제를 수행한다.</p>

<!-- ── 구조 및 상세 ──────────────────────────────── -->
<h3>구조 및 상세</h3>

<h4>① 상단 영역</h4>
<p>
  - [새로고침]: location.reload()<br>
  - [+ 등록]: A29(팝업 등록/수정, 등록 모드)으로 이동
</p>

<h4>② 상태 필터 탭</h4>
<p>
  - 탭 목록: 전체/노출중+예약/노출중/예약/종료<br>
  - 탭 클릭 시 목록 즉시 필터링 (페이지 이동 없음)<br>
  - 상태 자동 산출: 현재 시각 기준으로 startAt·endAt을 비교하여 산출<br>
    · now &lt; startAt → 예약 (scheduled)<br>
    · startAt ≤ now ≤ endAt → 노출중 (active)<br>
    · now &gt; endAt → 종료 (ended)
</p>

<h4>③ 목록 테이블</h4>
<p>
  - 순서 변경: 노출중·예약 항목에만 [▲][▼] 버튼 표시. 종료 항목은 "—" 표시<br>
  - 순서 변경 대상: 노출중 + 예약 항목끼리만 순서 이동 가능. 종료 항목 건너뜀<br>
  - 상태 배지: 노출중(green), 예약(blue), 종료(gray)<br>
  - [미리보기]: 해당 팝업을 실제 크기(W×H px)로 오버레이 모달에 표시<br>
  - [수정]: A29으로 이동 (?id= 전달)<br>
  - [삭제]: <strong>DOC06: C05 삭제 공통 패턴 적용</strong>
</p>

<h4>④ 미리보기 오버레이 모달</h4>
<p>
  - 배경 오버레이(rgba 50%) + 팝업 mock 표시<br>
  - mock 구성: 이미지(있는 경우 최상단) + SE2 본문 + 하단 "오늘 하루 닫기" 체크박스 + [닫기] 버튼<br>
  - 팝업에 링크 URL 있을 경우: 본문 클릭 가능 표시 (cursor:pointer, hover 배경 변경)<br>
  - 오버레이 배경 클릭 또는 [닫기] 버튼 클릭 시 모달 닫힘<br>
  - ⚠️ 미리보기의 "오늘 하루 닫기"는 실제 동작 없음 (UI mock 전용)
</p>

<h4>⑤ 페이지네이션</h4>
<strong>DOC06: C03 페이지네이션 공통 규칙 적용</strong>

<!-- ── 테이블 컬럼 ───────────────────────────────── -->
<h3>테이블 컬럼</h3>
<table>
  <thead><tr><th>#</th><th>컬럼명</th><th>타입</th><th>정렬</th><th>비고</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>순서</td><td>button</td><td>C</td><td>[▲][▼] 버튼. 노출중·예약만 표시. 종료는 "—"</td></tr>
    <tr><td>2</td><td>No</td><td>number</td><td>C</td><td>역순 자동 넘버링 (필터 적용 후 기준)</td></tr>
    <tr><td>3</td><td>팝업 제목</td><td>text</td><td>L</td><td>관리자용 제목 (사용자 화면 미노출)</td></tr>
    <tr><td>4</td><td>노출 기간</td><td>datetime</td><td>C</td><td>YYYY-MM-DD HH:MM ~ YYYY-MM-DD HH:MM</td></tr>
    <tr><td>5</td><td>크기 (W×H)</td><td>text</td><td>C</td><td>예: 400 × 360 px</td></tr>
    <tr><td>6</td><td>PC 위치</td><td>text</td><td>C</td><td>예: L:80/T:120</td></tr>
    <tr><td>7</td><td>상태</td><td>badge</td><td>C</td><td>노출중(green)/예약(blue)/종료(gray)</td></tr>
    <tr><td>8</td><td>관리</td><td>button</td><td>C</td><td>[미리보기] [수정] [삭제] 버튼</td></tr>
  </tbody>
</table>

<!-- ── Alert 메시지 ──────────────────────────────── -->
<h3>Alert 메시지</h3>
<p><strong>DOC06: C07 공통 Alert 적용 --></strong></p>
<table>
  <thead><tr><th>트리거</th><th>유형</th><th>메시지</th></tr></thead>
  <tbody>
    <tr><td>[삭제] 클릭</td><td>Confirm (DOC06: C05)</td><td>이 팝업을 삭제하시겠습니까?</td></tr>
    <tr><td>삭제 성공</td><td>Alert (error 스타일)</td><td>팝업이 삭제되었습니다.</td></tr>
  </tbody>
</table>

<!-- ── Validation ────────────────────────────────── -->
<h3>Validation</h3>
<p>목록 화면. 별도 유효성 검사 없음.</p>

<!-- ── 연관 화면 ─────────────────────────────────── -->
<h3>연관 화면</h3>
<table>
  <thead><tr><th>화면 ID</th><th>화면명</th><th>관계</th></tr></thead>
  <tbody>
    <tr><td>A29</td><td>팝업 등록/수정</td><td>[+ 등록] 클릭(등록)/[수정] 클릭(수정, ?id= 전달)</td></tr>
  </tbody>
</table>

`;
