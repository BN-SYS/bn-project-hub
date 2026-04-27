// ============================================================
//  A05 — 강좌 목록
//  그룹 : 강좌 관리
//  섹션 : admin
//  작성일 : 2026-04-06
// ============================================================

window.SPECS       = window.SPECS       || {};
window.ANNOTATIONS = window.ANNOTATIONS || {};

window.ANNOTATIONS['A05'] = [
  { n: 1, x: 13.8, y: 9.9 },   // 검색·필터 영역
  { n: 2, x: 13.8, y: 29.9 },   // 목록 상단
  { n: 3, x: 13.8, y: 33 },   // 목록 테이블
  { n: 4, x: 13.8, y: 49.1 },   // 페이지네이션
];

window.SPECS['A05'] = `

<!-- ── 목적 ──────────────────────────────────────── -->
<h3>목적</h3>
<p>관리자가 강좌 목록을 조회하고, 검색·필터를 통해 특정 강좌를 찾아 상세 정보로 진입하거나, 선택 삭제·엑셀 다운로드 등 일괄 처리를 수행하는 화면.<br>
<strong style="color: #a20f01;">기초과정/자격취득과정/역량강화/회원아카데미(특강·강좌·멘토링숲학교)/강사신청 전체 동일 UI 기준 적용.</strong></p>

<!-- ── 구조 및 상세 ──────────────────────────────── -->
<h3>구조 및 상세</h3>

<h4>① 검색·필터 영역</h4>
<p>
  - 교육시작일: 날짜 범위 선택. <strong>DOC06: C01 날짜 범위 검색 공통 규칙 적용</strong><br>
  - 상태 필터: 버튼 그룹 토글(전체/준비중/접수중/접수마감). 기본값 "전체"<br>
  - 과정명: 텍스트 입력. placeholder "과정명을 입력하세요"<br>
  - [검색]·[초기화]: <strong>DOC06: C04 검색어 입력 공통 규칙 적용</strong><br>
  - [엑셀 다운로드]: <strong>DOC06: C06 엑셀 다운로드 공통 규칙 적용</strong>
</p>

<h4>② 목록 테이블</h4>
<p>
  - 총 건수·행 노출 개수·정렬: <strong>DOC06: C02 목록 테이블 공통 규칙 적용</strong><br>
  - 행 클릭: 강좌 상세(A06)로 이동<br>
  - 데이터 없음: "검색 결과가 없습니다."<br>
  - 페이지네이션: <strong>DOC06: C03 페이지네이션 공통 규칙 적용</strong>
</p>

<h4>③ [선택 삭제] 버튼</h4>
<p>
  - 미선택 클릭 시 Alert: "삭제할 항목을 선택해주세요."<br>
  - 삭제 Confirm·완료·실패 동작: <strong>DOC06: C05 삭제 공통 패턴 적용 --><br>
  - 전체 선택 체크박스 동작: <strong>DOC06: C02-4 전체 선택 체크박스 적용 -->
</p>

<h4>④ [새로고침] · [+ 강좌 등록] 버튼</h4>
<p>
  - 위치: 화면 우측 상단(타이틀 옆)<br>
  - [새로고침]: 현재 검색 조건 유지한 채 목록 데이터 재조회<br>
  - [+ 강좌 등록]: 강좌 등록 화면(A07)으로 이동
</p>

<!-- ── 테이블 컬럼 ───────────────────────────────── -->
<h3>테이블 컬럼</h3>
<table>
  <thead><tr><th>#</th><th>컬럼명</th><th>타입</th><th>정렬</th><th>비고</th></tr></thead>
  <tbody>
    <tr><td>0</td><td>체크박스</td><td>checkbox</td><td>C</td><td>헤더 체크박스: 현재 페이지 전체 선택/해제</td></tr>
    <tr><td>1</td><td>No</td><td>number</td><td>C</td><td>자동 번호 (역순). 검색 결과 기준 넘버링.</td></tr>
    <tr><td>2</td><td>과정명</td><td>text</td><td>L</td><td>강좌 제목. 클릭 시 상세(A06) 이동.</td></tr>
    <tr><td>3</td><td>시작일</td><td>date</td><td>C</td><td>YYYY-MM-DD. 교육 시작일.</td></tr>
    <tr><td>4</td><td>접수기간</td><td>text</td><td>C</td><td>YYYY-MM-DD HH:MM ~ YYYY-MM-DD HH:MM</td></tr>
    <tr><td>5</td><td>상태</td><td>badge</td><td>C</td><td>준비중/접수중/접수마감.</td></tr>
    <tr><td>6</td><td>등록일</td><td>datetime</td><td>C</td><td>YYYY-MM-DD HH:MM. 기본 정렬: 등록일 내림차순(최신순).</td></tr>
  </tbody>
</table>

<!-- ── Alert 메시지 ──────────────────────────────── -->
<h3>Alert 메시지</h3>
<p><strong>DOC06: C07 공통 Alert 적용 (데이터 로딩 실패, 삭제 패턴, 엑셀 건수 초과) --></p>
<table>
  <thead><tr><th>트리거</th><th>유형</th><th>메시지</th></tr></thead>
  <tbody>
    <tr><td>교육시작일 범위 오류</td><td>Alert</td><td>시작일이 종료일보다 클 수 없습니다.</td></tr>
    <tr><td>삭제 미선택</td><td>Alert</td><td>삭제할 항목을 선택해주세요.</td></tr>
  </tbody>
</table>

<!-- ── Validation ────────────────────────────────── -->
<h3>Validation</h3>
<p><strong>DOC06: C04 검색어 2자 이상, C01-2 날짜 범위 유효성 공통 적용 --></p>
<table>
  <thead><tr><th>필드</th><th>필수</th><th>규칙</th><th>에러 메시지</th></tr></thead>
  <tbody>
    <tr><td>과정명</td><td>N</td><td>입력 시 최소 2자 이상</td><td>과정명은 2자 이상 입력해주세요.</td></tr>
    <tr><td>선택 삭제</td><td>Y</td><td>체크박스 1건 이상 선택</td><td>삭제할 항목을 선택해주세요.</td></tr>
  </tbody>
</table>

<!-- ── 연관 화면 ─────────────────────────────────── -->
<h3>연관 화면</h3>
<table>
  <thead><tr><th>화면 ID</th><th>화면명</th><th>관계</th></tr></thead>
  <tbody>
    <tr><td>A06</td><td>강좌 상세</td><td>목록 행 클릭 시 이동</td></tr>
    <tr><td>A07</td><td>강좌 등록/수정</td><td>[+ 강좌 등록] 버튼 클릭 시 이동</td></tr>
    <tr><td>A08</td><td>강좌신청자 목록</td><td>좌측 메뉴 강좌관리 하위 네비게이션</td></tr>
  </tbody>
</table>

`;