// ============================================================
//  U14 — 기초과정 신청 (공통 레이아웃 기준 스펙)
//  그룹 : 교육
//  섹션 : user
//  작성일 : 2026-04-14
//
//  ※ 동일 레이아웃·프로세스 적용 화면
//     U14 기초과정 신청 / U16 자격취득 목록 / U19 역량강화 신청
//     U22 특강 목록 / U24 아카데미강좌 목록 / U26 멘토링 목록 / U32 강사신청 일정목록
// ============================================================

window.SPECS       = window.SPECS       || {};
window.ANNOTATIONS = window.ANNOTATIONS || {};

// 좌표 기준: 이미지 전체 크기 대비 % (x: 좌→우, y: 상→하)
// 위치 규칙: 설명 대상 요소의 좌측 앞에 붙임
// SB 뷰어 우측 상단 [📍 좌표] 버튼으로 클릭 위치 확인 가능
window.ANNOTATIONS['U14'] = [
  { n: 1, x: 9, y: 37 },   // 검색 필터
  { n: 2, x: 9, y: 45 },   // 목록 테이블
];

window.SPECS['U14'] = `

<!-- ── 목적 ──────────────────────────────────────── -->
<h3>목적</h3>
<p>교육 과정 및 강좌 목록을 조회하고, 원하는 과정의 상세 페이지로 진입하는 화면.<br>
아래 화면이 동일한 레이아웃과 프로세스를 공유한다.</p>
<p class="spec-note">
  적용 화면: U14 기초과정 신청 · U16 자격취득 목록 · U19 역량강화 신청 ·
  U22 특강 목록 · U24 아카데미강좌 목록 · U26 멘토링 목록 · U32 강사신청 일정목록
</p>

<!-- ── 구조 및 상세 ──────────────────────────────── -->
<h3>구조 및 상세</h3>

<h4>① 검색 필터</h4>
<p>접수상태와 진행일자 조건으로 목록을 필터링.</p>
<table>
  <thead><tr><th>항목</th><th>유형</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td>접수상태</td><td>드롭다운</td><td>전체 / 준비중 / 접수중 / 마감. 기본값 "전체".</td></tr>
    <tr><td>일자 — 시작일</td><td>날짜 선택</td><td>진행일자 기준. 시작일만 선택 시 해당일 이후 전체 조회.</td></tr>
    <tr><td>일자 — 종료일</td><td>날짜 선택</td><td>종료일만 선택 시 해당일 이전 전체 조회.</td></tr>
    <tr><td>시작일 + 종료일</td><td>—</td><td>두 값 모두 입력 시 해당 기간 내 조회.</td></tr>
    <tr><td>[검색하기]</td><td>Primary</td><td>조건 적용 후 목록 갱신.</td></tr>
  </tbody>
</table>

<h4>② 목록 테이블</h4>
<p>필터 조건에 해당하는 강좌 목록 노출. 기본 정렬: 일자 내림차순(최신순).</p>
<table>
  <thead><tr><th>#</th><th>컬럼</th><th>정렬</th><th>비고</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>NO.</td><td>중앙</td><td>역순 넘버링.</td></tr>
    <tr><td>2</td><td>강좌명</td><td>좌측</td><td>과정·강좌 제목.</td></tr>
    <tr><td>3</td><td>일자</td><td>중앙</td><td>진행일자. YYYY-MM-DD.</td></tr>
    <tr><td>4</td><td>접수 기간</td><td>중앙</td><td>YYYY-MM-DD ~ YYYY-MM-DD.</td></tr>
    <tr><td>5</td><td>접수상태</td><td>중앙</td><td>정원 및 접수기간에 따라 자동 산출. 배지 형태로 표시.<br>준비중: 접수기간 시작 전 / 접수중: 접수기간 내·정원 미달 / 마감: 접수기간 종료 또는 정원 초과.</td></tr>
  </tbody>
</table>
<p class="spec-note"><strong>건수 표시:</strong> 목록 상단 좌측에 "목록 N건" 노출.</p>
<p class="spec-note"><strong>행 동작:</strong> 클릭 시 해당 과정 상세 페이지로 이동.</p>
<p class="spec-note"><strong>0건 처리:</strong> "조회된 강좌가 없습니다." 표시.</p>

<!-- ── Alert 메시지 ──────────────────────────────── -->
<h3>Alert 메시지</h3>
<table>
  <thead><tr><th>트리거</th><th>유형</th><th>메시지</th></tr></thead>
  <tbody>
    <tr><td>일자 범위 오류 (시작일 > 종료일)</td><td>Alert</td><td>시작일이 종료일보다 클 수 없습니다.</td></tr>
  </tbody>
</table>

<!-- ── Validation ────────────────────────────────── -->
<h3>Validation</h3>
<table>
  <thead><tr><th>필드</th><th>조건</th><th>에러 메시지</th></tr></thead>
  <tbody>
    <tr><td>일자 범위</td><td>시작일 ≤ 종료일</td><td>시작일이 종료일보다 클 수 없습니다.</td></tr>
  </tbody>
</table>

<!-- ── 반응형 ────────────────────────────────────── -->
<h3>반응형</h3>
<p class="spec-note"><strong>Breakpoint:</strong> PC ≥ 1201px / Tablet 768 ~ 1200px / Mobile ≤ 767px</p>
<table>
  <thead><tr><th>구간</th><th>Breakpoint</th><th>변경 사항</th></tr></thead>
  <tbody>
    <tr><td>PC</td><td>≥ 1201px</td><td>필터 1행 가로 배치. 테이블 전체 컬럼 노출.</td></tr>
    <tr><td>Tablet</td><td>768 ~ 1200px</td><td>필터 2행. 테이블 가로 스크롤.</td></tr>
    <tr><td>Mobile</td><td>≤ 767px</td><td>필터 세로 적층. 테이블 가로 스크롤 또는 카드형 전환.</td></tr>
  </tbody>
</table>

<!-- ── 연관 화면 ─────────────────────────────────── -->
<h3>연관 화면</h3>
<table>
  <thead><tr><th>화면 ID</th><th>화면명</th><th>관계</th></tr></thead>
  <tbody>
    <tr><td>U14</td><td>기초과정 신청</td><td>행 클릭 → 해당 상세 페이지 이동</td></tr>
    <tr><td>U16</td><td>자격취득 목록</td><td>행 클릭 → U17 과정 상세</td></tr>
    <tr><td>U19</td><td>역량강화 신청</td><td>행 클릭 → 해당 상세 페이지 이동</td></tr>
    <tr><td>U22</td><td>특강 목록</td><td>행 클릭 → U23 특강 상세</td></tr>
    <tr><td>U24</td><td>아카데미강좌 목록</td><td>행 클릭 → U25 아카데미강좌 상세</td></tr>
    <tr><td>U26</td><td>멘토링 목록</td><td>행 클릭 → U27 멘토링 상세</td></tr>
    <tr><td>U32</td><td>강사신청 일정목록</td><td>행 클릭 → U33 강사신청 일정상세</td></tr>
  </tbody>
</table>

`;
