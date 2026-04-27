// ============================================================
//  A15 — 후원신청 목록
//  그룹 : 기타 신청관리
//  섹션 : admin
//  작성일 : 2026-04-06
// ============================================================

window.SPECS       = window.SPECS       || {};
window.ANNOTATIONS = window.ANNOTATIONS || {};

window.ANNOTATIONS['A15'] = [
  { n: 1, x: 13.8, y: 9.9 },   // 검색·필터 영역
  { n: 2, x: 13.8, y: 29.9 },   // 목록 상단
  { n: 3, x: 13.8, y: 33 },   // 목록 테이블
  { n: 4, x: 13.8, y: 49.1 },   // 페이지네이션
];

window.SPECS['A15'] = `

<!-- ── 목적 ──────────────────────────────────────── -->
<h3>목적</h3>
<p>후원 신청 목록을 조회하고, 신청기간·후원유형·후원목적·회원구분·검색어로 필터링하여 특정 신청을 찾아 상세로 진입하는 화면. 엑셀 다운로드 지원.</p>

<!-- ── 구조 및 상세 ──────────────────────────────── -->
<h3>구조 및 상세</h3>

<h4>① 검색·필터 영역</h4>
<p>
  - 신청기간: 날짜 범위 선택. <strong>DOC06: C01 날짜 범위 검색 공통 규칙 적용</strong><br>
  - 날짜 프리셋: 오늘/7일/30일/3개월/6개월<br>
  - 후원유형 필터 (좌)/후원목적 필터 (우): 2열 나란히 배치<br>
    - 후원유형: 라디오 칩 (전체/정기 후원/일시 후원)<br>
    - 후원목적: 라디오 칩 (전체/교육/사회공헌/교육자료/자유사용)<br>
  - 회원구분 필터: 라디오 칩 (전체/회원/비회원)<br>
  - 검색어 조건: 셀렉트박스(전체/성명/연락처/이메일) + 텍스트 입력. <strong>DOC06: C04 적용</strong><br>
  - [엑셀 다운로드]: <strong>DOC06: C06 적용</strong><br>
  - [초기화]/[검색] 버튼
</p>

<h4>② 목록 상단</h4>
<p>
  - 총 건수 표시. <strong>DOC06: C02 적용</strong><br>
  - 행 노출 개수 셀렉트: 10/30/50/100개씩 보기
</p>

<h4>③ 목록 테이블</h4>
<p>행 클릭: 후원신청 상세(A16)로 이동</p>

<h4>④ 페이지네이션</h4>
<strong>DOC06: C03 페이지네이션 공통 규칙 적용</strong>

<!-- ── 테이블 컬럼 ───────────────────────────────── -->
<h3>테이블 컬럼</h3>
<table>
  <thead><tr><th>#</th><th>컬럼명</th><th>타입</th><th>정렬</th><th>비고</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>No</td><td>number</td><td>C</td><td>역순 자동 넘버링</td></tr>
    <tr><td>2</td><td>접수번호</td><td>text</td><td>C</td><td>DON-2026-NNNNN 형식</td></tr>
    <tr><td>3</td><td>성명</td><td>text</td><td>C</td><td>클릭 시 A16 이동</td></tr>
    <tr><td>4</td><td>회원구분</td><td>badge</td><td>C</td><td>회원(green)/비회원(gray)</td></tr>
    <tr><td>5</td><td>후원유형</td><td>badge</td><td>C</td><td>정기(green)/일시(blue)</td></tr>
    <tr><td>6</td><td>후원금액</td><td>number</td><td>C</td><td>N원. 정기 후원 시 "/월" 표시</td></tr>
    <tr><td>7</td><td>후원목적</td><td>text</td><td>C</td><td>교육 프로그램 지원/사회공헌 활동 지원/교육 자료 개발 지원/자유 사용 (지정 없음)</td></tr>
    <tr><td>8</td><td>연락처</td><td>text</td><td>C</td><td>010-XXXX-XXXX</td></tr>
    <tr><td>9</td><td>신청일</td><td>datetime</td><td>C</td><td>YYYY-MM-DD HH:MM:SS. 기본 정렬: 최신순</td></tr>
    <tr><td>10</td><td>관리자 메모</td><td>text</td><td>L</td><td>메모 일부 표시</td></tr>
  </tbody>
</table>

<!-- ── Alert 메시지 ──────────────────────────────── -->
<h3>Alert 메시지</h3>
<p><strong>DOC06: C07 공통 Alert 적용 (날짜 범위 오류, 엑셀 건수 초과) --></strong></p>

<!-- ── Validation ────────────────────────────────── -->
<h3>Validation</h3>
<p><strong>DOC06: C04 검색어 2자 이상, C01-2 날짜 범위 유효성 공통 적용 --></strong></p>

<!-- ── 연관 화면 ─────────────────────────────────── -->
<h3>연관 화면</h3>
<table>
  <thead><tr><th>화면 ID</th><th>화면명</th><th>관계</th></tr></thead>
  <tbody>
    <tr><td>A16</td><td>후원신청 상세</td><td>목록 행 클릭 시 이동</td></tr>
  </tbody>
</table>

`;
