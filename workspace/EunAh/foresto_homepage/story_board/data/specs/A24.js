// ============================================================
//  A24 — 연혁 목록
//  그룹 : 콘텐츠관리
//  섹션 : admin
//  작성일 : 2026-04-06
// ============================================================

window.SPECS       = window.SPECS       || {};
window.ANNOTATIONS = window.ANNOTATIONS || {};

window.ANNOTATIONS['A24'] = [
  { n: 1, x: 13.8, y: 9.9 },   // 연혁 목록 테이블
  { n: 2, x: 13.8, y: 31.3 },   // 페이지네이션
];

window.SPECS['A24'] = `

<!-- ── 목적 ──────────────────────────────────────── -->
<h3>목적</h3>
<p>연도별 연혁 데이터를 목록으로 관리하는 화면. 연도 단위 CRUD. 사용자 연혁 페이지(U05)와 연동된다.</p>

<!-- ── 구조 및 상세 ──────────────────────────────── -->
<h3>구조 및 상세</h3>

<h4>① 상단 버튼</h4>
<p>
  - [새로고침]: location.reload()<br>
  - [+ 연도 추가]: 연혁 등록/수정(A25) 화면으로 이동 (등록 모드)
</p>

<h4>② 목록 테이블</h4>
<p>
  - 검색/필터 없음. 전체 목록 표시<br>
  - 기본 정렬: 연도 내림차순 (최신 연도 최상단)<br>
  - 행 클릭: 해당 연도 수정 (연혁 등록/수정, A25, ?year= 전달)<br>
  - 내용 컬럼: 항목별 줄바꿈 표시 (text 말줄임 없이 전체 표시)
</p>

<h4>③ 행 내 관리 버튼</h4>
<p>
  - [수정]: A25로 이동 (?year= 전달)<br>
  - [삭제]: 해당 연도 전체 삭제. <strong>DOC06: C05 삭제 공통 패턴 적용</strong>
</p>

<!-- ── 테이블 컬럼 ───────────────────────────────── -->
<h3>테이블 컬럼</h3>
<table>
  <thead><tr><th>#</th><th>컬럼명</th><th>타입</th><th>정렬</th><th>비고</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>NO</td><td>number</td><td>C</td><td>역순 자동 넘버링</td></tr>
    <tr><td>2</td><td>등록일시</td><td>datetime</td><td>C</td><td>YYYY-MM-DD HH:MM:SS</td></tr>
    <tr><td>3</td><td>연도</td><td>number</td><td>C</td><td>굵게 표시. 클릭 시 A25(수정) 이동</td></tr>
    <tr><td>4</td><td>이미지</td><td>image</td><td>C</td><td>54×38px 썸네일. 없으면 "-" 표시</td></tr>
    <tr><td>5</td><td>내용</td><td>text</td><td>L</td><td>항목 목록. 줄바꿈 표시. 말줄임 없음</td></tr>
    <tr><td>6</td><td>관리</td><td>button</td><td>C</td><td>[수정] [삭제] 버튼</td></tr>
  </tbody>
</table>

<!-- ── Alert 메시지 ──────────────────────────────── -->
<h3>Alert 메시지</h3>
<p><strong>DOC06: C07 공통 Alert 적용 --></strong></p>
<table>
  <thead><tr><th>트리거</th><th>유형</th><th>메시지</th></tr></thead>
  <tbody>
    <tr><td>[삭제] 클릭</td><td>Confirm (DOC06: C05)</td><td>이 연도의 연혁을 모두 삭제하시겠습니까?</td></tr>
    <tr><td>삭제 성공</td><td>Alert (error 스타일)</td><td>삭제되었습니다.</td></tr>
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
    <tr><td>A25</td><td>연혁 등록/수정</td><td>[+ 연도 추가] 클릭 (등록)/행 클릭 또는 [수정] 클릭 (수정, ?year= 전달)</td></tr>
    <tr><td>U05</td><td>소개 - 연혁</td><td>이 화면에서 관리한 데이터가 사용자 화면에 노출</td></tr>
  </tbody>
</table>

`;
