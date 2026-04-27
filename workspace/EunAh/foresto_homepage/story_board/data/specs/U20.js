// ============================================================
//  U20 — 수료생 후기 목록
//  그룹 : 교육
//  섹션 : user
//  작성일 : 2026-04-14
// ============================================================

window.SPECS       = window.SPECS       || {};
window.ANNOTATIONS = window.ANNOTATIONS || {};

// 좌표 기준: 이미지 전체 크기 대비 % (x: 좌→우, y: 상→하)
// 위치 규칙: 설명 대상 요소의 좌측 앞에 붙임
// SB 뷰어 우측 상단 [📍 좌표] 버튼으로 클릭 위치 확인 가능
window.ANNOTATIONS['U20'] = [
  { n: 1, x: 9, y: 28 },   // 검색 필터
  { n: 2, x: 9, y: 35 },   // 목록
];

window.SPECS['U20'] = `

<!-- ── 목적 ──────────────────────────────────────── -->
<h3>목적</h3>
<p>수료생이 작성한 교육 후기를 카드형으로 목록 제공. 과정 필터와 검색어로 원하는 후기를 찾고, 카드 클릭 시 상세 페이지로 진입한다.</p>

<!-- ── 구조 및 상세 ──────────────────────────────── -->
<h3>구조 및 상세</h3>

<h4>① 검색 필터</h4>
<table>
  <thead><tr><th>항목</th><th>유형</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td>과정</td><td>드롭다운</td><td>자격취득 과정으로 등록된 과정명 목록 노출. 기본값 "전체".</td></tr>
    <tr><td>검색어</td><td>텍스트 입력</td><td>제목 또는 내용 기준 검색.</td></tr>
    <tr><td>[검색하기]</td><td>Primary</td><td>조건 적용 후 목록 갱신.</td></tr>
  </tbody>
</table>

<h4>② 목록</h4>
<p>조건에 해당하는 후기를 카드형 그리드로 노출. 기본 정렬: 등록일 내림차순(최신순).</p>
<table>
  <thead><tr><th>항목</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td>건수 표시</td><td>목록 상단 좌측에 "목록 N건" 노출.</td></tr>
    <tr><td>썸네일</td><td>에디터에 등록된 첫 번째 이미지가 자동으로 썸네일 저장. 이미지 없는 경우 기본 이미지 노출.</td></tr>
    <tr><td>과정명 배지</td><td>해당 후기가 속한 과정명 배지 형태로 노출.</td></tr>
    <tr><td>제목</td><td>후기 제목 노출.</td></tr>
    <tr><td>내용 일부</td><td>본문 3줄까지 텍스트 노출 (말줄임 처리).</td></tr>
    <tr><td>작성자명</td><td>후기 작성자 이름 노출.</td></tr>
    <tr><td>등록일</td><td>YYYY.MM.DD 형식 노출.</td></tr>
    <tr><td>카드 클릭</td><td>수료생 후기 상세(U21)로 이동.</td></tr>
    <tr><td>0건 처리</td><td>"등록된 후기가 없습니다." 안내 문구 노출.</td></tr>
  </tbody>
</table>

<!-- ── 반응형 ────────────────────────────────────── -->
<h3>반응형</h3>
<p class="spec-note"><strong>Breakpoint:</strong> PC ≥ 1201px / Tablet 768 ~ 1200px / Mobile ≤ 767px</p>
<table>
  <thead><tr><th>구간</th><th>Breakpoint</th><th>변경 사항</th></tr></thead>
  <tbody>
    <tr><td>PC</td><td>≥ 1201px</td><td>카드 3열 그리드.</td></tr>
    <tr><td>Tablet</td><td>768 ~ 1200px</td><td>카드 2열 그리드.</td></tr>
    <tr><td>Mobile</td><td>≤ 767px</td><td>카드 1열. 썸네일 width 100%.</td></tr>
  </tbody>
</table>

<!-- ── 연관 화면 ─────────────────────────────────── -->
<h3>연관 화면</h3>
<table>
  <thead><tr><th>화면 ID</th><th>화면명</th><th>관계</th></tr></thead>
  <tbody>
    <tr><td>U21</td><td>수료생 후기 상세</td><td>카드 클릭 시 이동</td></tr>
  </tbody>
</table>

`;
