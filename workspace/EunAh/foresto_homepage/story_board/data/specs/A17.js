// ============================================================
//  A17 — 일정 목록
//  그룹 : 일정관리
//  섹션 : admin
//  작성일 : 2026-04-06
// ============================================================

window.SPECS       = window.SPECS       || {};
window.ANNOTATIONS = window.ANNOTATIONS || {};

window.ANNOTATIONS['A17'] = [
  { n: 1, x: 13.8, y: 9.9 },   // 검색·필터 영역
  { n: 2, x: 13.8, y: 26.2 },   // 목록 상단
  { n: 3, x: 13.8, y: 29.3 },   // 목록 테이블
  { n: 4, x: 13.8, y: 44.8 },   // 페이지네이션
];

window.SPECS['A17'] = `

<!-- ── 목적 ──────────────────────────────────────── -->
<h3>목적</h3>
<p>협회 캘린더 일정 전체를 목록으로 관리하는 화면. 기간·카테고리·키워드 필터, 전체 선택·삭제, 일정 등록 기능을 제공한다. 사용자 협회 캘린더(U38)와 동기화된다.</p>

<!-- ── 구조 및 상세 ──────────────────────────────── -->
<h3>구조 및 상세</h3>

<h4>① 검색·필터 영역</h4>
<p>
  - 기간: 날짜 범위 선택. <strong>DOC06: C01 날짜 범위 검색 공통 규칙 적용</strong><br>
  - 날짜 프리셋: 오늘/7일/30일/3개월/6개월<br>
  - 카테고리 필터: 라디오 칩 (전체/교육·강좌/협회행사/동아리/사공단/기타). 기본값 "전체"<br>
  - 키워드: 일정명 검색. <strong>DOC06: C04 적용</strong><br>
  - [초기화]/[검색] 버튼
</p>

<h4>② 목록 상단</h4>
<p>
  - 총 건수 표시. <strong>DOC06: C02 목록 테이블 공통 규칙 적용</strong><br>
  - 행 노출 개수 셀렉트: 10/30/50개씩 보기
</p>

<h4>③ 목록 테이블</h4>
<p>
  - 행 클릭: 일정 상세(A18)로 이동<br>
  - 카테고리 배지 색상: 교육·강좌(green)/협회행사(blue)/동아리(orange)/사공단(purple)/기타(gray)<br>
  - 전체 선택 체크박스: <strong>DOC06: C02-4 전체 선택 체크박스 적용</strong>
</p>

<h4>④ [선택 삭제] 버튼</h4>
<p><strong>DOC06: C05 삭제 공통 패턴 적용</strong></p>

<h4>⑤ [+ 일정 등록] 버튼</h4>
<p>일정 등록/수정(A19)으로 이동 (등록 모드)</p>

<h4>⑥ 페이지네이션</h4>
<strong>DOC06: C03 페이지네이션 공통 규칙 적용</strong>

<!-- ── 테이블 컬럼 ───────────────────────────────── -->
<h3>테이블 컬럼</h3>
<table>
  <thead><tr><th>#</th><th>컬럼명</th><th>타입</th><th>정렬</th><th>비고</th></tr></thead>
  <tbody>
    <tr><td>0</td><td>체크박스</td><td>checkbox</td><td>C</td><td>헤더 체크박스: 현재 페이지 전체 선택/해제</td></tr>
    <tr><td>1</td><td>No</td><td>number</td><td>C</td><td>역순 자동 넘버링</td></tr>
    <tr><td>2</td><td>카테고리</td><td>badge</td><td>C</td><td>edu/event/club/public/etc</td></tr>
    <tr><td>3</td><td>일정명</td><td>text</td><td>C</td><td>클릭 시 A18 이동</td></tr>
    <tr><td>4</td><td>일정일</td><td>date</td><td>C</td><td>YYYY-MM-DD</td></tr>
    <tr><td>5</td><td>링크</td><td>link</td><td>C</td><td>관련 링크 있을 때만 표시. 클릭 시 신규 탭으로 이동</td></tr>
    <tr><td>6</td><td>작성자</td><td>text</td><td>C</td><td>등록 관리자 이름</td></tr>
    <tr><td>7</td><td>등록일시</td><td>datetime</td><td>C</td><td>YYYY-MM-DD HH:MM:SS</td></tr>
  </tbody>
</table>

<!-- ── Alert 메시지 ──────────────────────────────── -->
<h3>Alert 메시지</h3>
<p><strong>DOC06: C07 공통 Alert 적용 (삭제 패턴, 날짜 범위 오류) --></strong></p>
<table>
  <thead><tr><th>트리거</th><th>유형</th><th>메시지</th></tr></thead>
  <tbody>
    <tr><td>삭제 미선택</td><td>Alert</td><td>삭제할 항목을 선택해주세요.</td></tr>
    <tr><td>날짜 범위 오류</td><td>Alert</td><td>시작일이 종료일보다 클 수 없습니다.</td></tr>
  </tbody>
</table>

<!-- ── Validation ────────────────────────────────── -->
<h3>Validation</h3>
<p><strong>DOC06: C04 검색어 2자 이상, C01-2 날짜 범위 유효성, C02-4 전체 선택 공통 적용 --></strong></p>

<!-- ── 연관 화면 ─────────────────────────────────── -->
<h3>연관 화면</h3>
<table>
  <thead><tr><th>화면 ID</th><th>화면명</th><th>관계</th></tr></thead>
  <tbody>
    <tr><td>A18</td><td>일정 상세</td><td>목록 행 클릭 시 이동</td></tr>
    <tr><td>A19</td><td>일정 등록/수정</td><td>[+ 일정 등록] 버튼 클릭 시 이동</td></tr>
  </tbody>
</table>

`;
