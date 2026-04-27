// ============================================================
//  A20 — 게시판 목록
//  그룹 : 게시판관리
//  섹션 : admin
//  작성일 : 2026-04-06
// ============================================================

window.SPECS       = window.SPECS       || {};
window.ANNOTATIONS = window.ANNOTATIONS || {};

window.ANNOTATIONS['A20'] = [
  { n: 1, x: 13.8, y: 9.9 },   // 검색·필터 영역
  { n: 2, x: 13.8, y: 18.9 },   // 목록 상단
  { n: 3, x: 13.8, y: 22 },   // 목록 테이블
  { n: 4, x: 13.8, y: 40.7 },   // 페이지네이션
];

window.SPECS['A20'] = `

<!-- ── 목적 ──────────────────────────────────────── -->
<h3>목적</h3>
<p>URL ?type= 파라미터로 게시판 유형을 전환하며 해당 유형의 게시글 목록을 관리하는 화면. 키워드 검색, 전체 선택 삭제, 새 글 등록 기능을 제공한다.</p>

<!-- ── 구조 및 상세 ──────────────────────────────── -->
<h3>구조 및 상세</h3>

<h4>① 게시판 유형 전환</h4>
<p>
  URL ?type= 값에 따라 페이지 타이틀과 navKey가 변경됨.<br>
  지원 유형: notice(공지사항)/newsletter(협회지)/press(언론보도)/gallery(갤러리)/forest-work(숲일터)/region(전국지역협회)/intro(사공단소개)/club(동아리소개)<br>
  썸네일 표시 여부: gallery·region·intro·club 유형은 hasThumb=true (썸네일 이미지 컬럼 존재)
</p>

<h4>② 검색·필터 영역</h4>
<p>
  - 키워드: 제목 검색. <strong>DOC06: C04 검색어 입력 공통 규칙 적용</strong><br>
  - [초기화]/[검색] 버튼
</p>

<h4>③ 목록 상단</h4>
<p>
  - 총 건수 표시. <strong>DOC06: C02 목록 테이블 공통 규칙 적용</strong><br>
  - 행 노출 개수 셀렉트: 10/30/50개씩 보기
</p>

<h4>④ 목록 테이블</h4>
<p>
  - 행 클릭: 게시글 상세(A21)로 이동<br>
  - 상단 고정 행: 배경색 #fffbeb 처리, [고정] 배지 표시<br>
  - 전체 선택 체크박스: <strong>DOC06: C02-4 적용</strong>
</p>

<h4>⑤ [선택 삭제] 버튼/[+ 등록] 버튼</h4>
<p>
  - [선택 삭제]: <strong>DOC06: C05 삭제 공통 패턴 적용</strong><br>
  - [+ 등록]: 게시글 등록/수정(A22)으로 이동 (등록 모드, ?type= 전달)
</p>

<h4>⑥ 페이지네이션</h4>
<strong>DOC06: C03 페이지네이션 공통 규칙 적용</strong>

<!-- ── 테이블 컬럼 ───────────────────────────────── -->
<h3>테이블 컬럼</h3>
<table>
  <thead><tr><th>#</th><th>컬럼명</th><th>타입</th><th>정렬</th><th>비고</th></tr></thead>
  <tbody>
    <tr><td>0</td><td>체크박스</td><td>checkbox</td><td>C</td><td>헤더 체크박스: 현재 페이지 전체 선택/해제</td></tr>
    <tr><td>1</td><td>No</td><td>number</td><td>C</td><td>역순 자동 넘버링. 상단 고정 행은 번호 대신 [고정] 배지</td></tr>
    <tr><td>2</td><td>제목</td><td>text</td><td>C</td><td>클릭 시 A21 이동. 상단 고정 행은 [고정] 배지 함께 표시</td></tr>
    <tr><td>3</td><td>작성자</td><td>text</td><td>C</td><td>관리자 이름</td></tr>
    <tr><td>4</td><td>등록일</td><td>date</td><td>C</td><td>YYYY-MM-DD</td></tr>
    <tr><td>5</td><td>조회수</td><td>number</td><td>C</td><td></td></tr>
  </tbody>
</table>

<!-- ── Alert 메시지 ──────────────────────────────── -->
<h3>Alert 메시지</h3>
<p><strong>DOC06: C07 공통 Alert 적용 (삭제 패턴) --></strong></p>
<table>
  <thead><tr><th>트리거</th><th>유형</th><th>메시지</th></tr></thead>
  <tbody>
    <tr><td>삭제 미선택</td><td>Alert</td><td>삭제할 항목을 선택해주세요.</td></tr>
  </tbody>
</table>

<!-- ── Validation ────────────────────────────────── -->
<h3>Validation</h3>
<p><strong>DOC06: C04 검색어 2자 이상 공통 적용 --></strong></p>

<!-- ── 연관 화면 ─────────────────────────────────── -->
<h3>연관 화면</h3>
<table>
  <thead><tr><th>화면 ID</th><th>화면명</th><th>관계</th></tr></thead>
  <tbody>
    <tr><td>A21</td><td>게시글 상세</td><td>목록 행 클릭 시 이동 (?type=&id= 전달)</td></tr>
    <tr><td>A22</td><td>게시글 등록/수정</td><td>[+ 등록] 클릭 시 이동 (?type= 전달)</td></tr>
  </tbody>
</table>

`;
