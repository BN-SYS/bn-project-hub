// ============================================================
//  A08 — 강좌신청자 목록
//  그룹 : 강좌 관리
//  섹션 : admin
//  작성일 : 2026-04-06
// ============================================================

window.SPECS       = window.SPECS       || {};
window.ANNOTATIONS = window.ANNOTATIONS || {};

window.ANNOTATIONS['A08'] = [
  { n: 1, x: 13.8, y: 10 },   // 검색·필터 영역
  { n: 2, x: 13.8, y: 33.7 },   // 목록 상단
  { n: 3, x: 13.8, y: 36.8 },   // 목록 테이블
  { n: 4, x: 13.8, y: 52.8 },   // 페이지네이션
];

window.SPECS['A08'] = `

<!-- ── 목적 ──────────────────────────────────────── -->
<h3>목적</h3>
<p>관리자가 전체 강좌의 신청자를 통합 조회하고, 과정유형·상태(신청/취소/수료/미수료) 등 조건으로 검색·필터링하여 신청 현황을 관리하는 화면.<br>
<strong style="color: #a20f01;">강사신청 건은 따로 메뉴는 분리되지만, 동일한 레이아웃 적용.</strong>
</p>

<!-- ── 구조 및 상세 ──────────────────────────────── -->
<h3>구조 및 상세</h3>

<h4>① 검색·필터 영역</h4>
<p>
  - 신청일: 날짜 범위 선택. <strong>DOC06: C01 날짜 범위 검색 공통 규칙 적용</strong><br>
  - 과정유형 필터: 버튼 그룹 토글(전체/기초과정/자격취득과정/역량강화/회원아카데미). 기본값 "전체".<br>
    "회원아카데미" 선택 시 아카데미 구분 하위 필터 행 추가 노출: 전체/특강/강좌/멘토링숲학교. 다른 유형 선택 시 하위 필터 숨김·초기화.<br>
  - 상태 필터: 버튼 그룹 토글(전체/신청/취소/수료/미수료). 기본값 "전체".<br>
  - 검색어 조건: 셀렉트박스(과정명/신청자명).<br>
  - 검색어 입력·[검색]·[초기화]: <strong>DOC06: C04 검색어 입력 공통 규칙 적용</strong><br>
  - [엑셀 다운로드]: <strong>DOC06: C06 엑셀 다운로드 공통 규칙 적용</strong>
</p>

<h4>② 목록 테이블</h4>
<p>
  - 총 건수·행 노출 개수·정렬: <strong>DOC06: C02 목록 테이블 공통 규칙 적용</strong><br>
  - 행 클릭: 신청 상세(A09)로 이동.<br>
  - 데이터 없음: "검색 결과가 없습니다."<br>
  - 페이지네이션: <strong>DOC06: C03 페이지네이션 공통 규칙 적용</strong>
</p>

<h4>③ 하단 버튼 영역</h4>
<p>
  - [선택 삭제]: 미선택 클릭 시 Alert: "삭제할 항목을 선택해주세요."<br>
  - 삭제 Confirm·완료·실패 동작: <strong>DOC06: C05 삭제 공통 패턴 적용 --><br>
  - 전체 선택 체크박스 동작: <strong>DOC06: C02-4 전체 선택 체크박스 적용 --><br>
  - [신청 상태변경]: 우측 배치. 선택된 신청자 상태(신청/취소/수료/미수료) 일괄 변경.
</p>

<!-- ── 테이블 컬럼 ───────────────────────────────── -->
<h3>테이블 컬럼</h3>
<table>
  <thead><tr><th>#</th><th>컬럼명</th><th>타입</th><th>정렬</th><th>비고</th></tr></thead>
  <tbody>
    <tr><td>0</td><td>체크박스</td><td>checkbox</td><td>C</td><td>헤더 체크박스: 현재 페이지 전체 선택/해제</td></tr>
    <tr><td>1</td><td>No</td><td>number</td><td>C</td><td>자동 번호 (역순). 검색 결과 기준 넘버링.</td></tr>
    <tr><td>2</td><td>접수번호</td><td>text</td><td>L</td><td>신청 고유 번호 (예: APP-2026-02000)</td></tr>
    <tr><td>3</td><td>과정유형</td><td>badge</td><td>C</td><td>기초과정/자격취득과정/역량강화/회원아카데미.</td></tr>
    <tr><td>4</td><td>과정명</td><td>text</td><td>L</td><td>강좌 제목</td></tr>
    <tr><td>5</td><td>신청자</td><td>text</td><td>C</td><td>회원 실명</td></tr>
    <tr><td>6</td><td>성별</td><td>text</td><td>C</td><td>남/여</td></tr>
    <tr><td>7</td><td>생년월일</td><td>date</td><td>C</td><td>YYYY-MM-DD</td></tr>
    <tr><td>8</td><td>핸드폰</td><td>text</td><td>C</td><td>010-0000-0000.</td></tr>
    <tr><td>9</td><td>신청일시</td><td>datetime</td><td>C</td><td>YYYY-MM-DD HH:MM. 기본 정렬: 신청일시 내림차순(최신순).</td></tr>
    <tr><td>10</td><td>취소일시</td><td>datetime</td><td>C</td><td>YYYY-MM-DD HH:MM. 미취소 건은 "—" 표시.</td></tr>
    <tr><td>11</td><td>상태</td><td>badge</td><td>C</td><td>신청/취소/수료/미수료</td></tr>
  </tbody>
</table>

<!-- ── Alert 메시지 ──────────────────────────────── -->
<h3>Alert 메시지</h3>
<p><strong>DOC06: C07 공통 Alert 적용 (데이터 로딩 실패, 삭제 패턴, 엑셀 건수 초과) --></p>
<table>
  <thead><tr><th>트리거</th><th>유형</th><th>메시지</th></tr></thead>
  <tbody>
    <tr><td>신청일 범위 오류</td><td>Alert</td><td>시작일이 종료일보다 클 수 없습니다.</td></tr>
    <tr><td>삭제 미선택</td><td>Alert</td><td>삭제할 항목을 선택해주세요.</td></tr>
    <tr><td>상태변경 미선택</td><td>Alert</td><td>상태를 변경할 신청자를 선택해주세요.</td></tr>
    <tr><td>상태변경 완료</td><td>Alert</td><td>상태가 변경되었습니다.</td></tr>
    <tr><td>상태변경 실패</td><td>Alert</td><td>상태 변경 중 오류가 발생했습니다. 다시 시도해주세요.</td></tr>
  </tbody>
</table>

<!-- ── Validation ────────────────────────────────── -->
<h3>Validation</h3>
<p><strong>DOC06: C04 검색어 2자 이상, C01-2 날짜 범위 유효성 공통 적용 --></p>
<table>
  <thead><tr><th>필드</th><th>필수</th><th>규칙</th><th>에러 메시지</th></tr></thead>
  <tbody>
    <tr><td>선택 삭제</td><td>Y</td><td>체크박스 1건 이상 선택</td><td>삭제할 항목을 선택해주세요.</td></tr>
  </tbody>
</table>

<!-- ── 연관 화면 ─────────────────────────────────── -->
<h3>연관 화면</h3>
<table>
  <thead><tr><th>화면 ID</th><th>화면명</th><th>관계</th></tr></thead>
  <tbody>
    <tr><td>A05</td><td>강좌 목록</td><td>좌측 메뉴 강좌관리 하위 네비게이션</td></tr>
    <tr><td>A09</td><td>강좌신청자 상세</td><td>행 클릭 시 이동</td></tr>
  </tbody>
</table>

`;