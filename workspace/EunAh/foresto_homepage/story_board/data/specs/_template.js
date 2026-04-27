/**
 * {ID} — {화면명}
 * 그룹: {그룹명}/섹션: user | admin | doc
 * 작성일: YYYY-MM-DD
 *
 * 사용법: 복사 → {ID}.js 저장 → 키·내용 채우기 → data/specs/ 저장 시 자동 연결
 *
 * 작성 규칙
 * - 미확정: <span class="warn">⚠️ 협의 필요</span>
 * - 정보 없음: <span class="warn">⚠️ 정보 필요</span>
 * - 버튼: [버튼명] + 유형(Primary/Secondary/Danger/Outline/Gray)
 * - 날짜: YYYY-MM-DD
 * - 개인정보 컬럼: 마스킹 규칙 ⚠️ 반드시 명시
 * - h3: 섹션 제목 (번호 없음)
 * - h4: 구조 영역 번호(①②③…)와 매칭
 * - "구조 및 상세" = h4 + <p> 한 줄 요약 + <table>
 */

window.SPECS       = window.SPECS       || {};
window.ANNOTATIONS = window.ANNOTATIONS || {};

// 좌표 기준: 이미지 전체 크기 대비 % (x: 좌→우, y: 상→하)
// 위치 규칙: 번호는 반드시 설명 대상 요소의 좌측 앞에 배치
//   ✅ 맞음: 필터 영역 왼쪽 끝 앞에 ①
//   ❌ 틀림: 필터 영역 중앙에 ①
// Claude Vision으로 이미지 분석 후 자동 생성 → SB 뷰어 [📍 좌표] 버튼으로 미세조정
window.ANNOTATIONS['{ID}'] = [
  { n: 1, x: 0, y: 0 },   // 영역명
  // { n: 2, x: 0, y: 0 },
];

window.SPECS['{ID}'] = `

<!-- ── 목적 ──────────────────────────────────────── -->
<h3>목적</h3>
<p>이 화면이 존재하는 이유와 사용자 목표를 서술한다.</p>

<!-- ── 구조 및 상세 ──────────────────────────────── -->
<h3>구조 및 상세</h3>

<h4>① 영역명</h4>
<p>이 영역의 역할을 한 줄로 요약.</p>
<table>
  <thead><tr><th>항목</th><th>유형</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td>항목명</td><td>유형</td><td>설명. <span class="warn">⚠️ 협의 필요</span></td></tr>
  </tbody>
</table>

<h4>② 영역명</h4>
<p>이 영역의 역할을 한 줄로 요약.</p>
<table>
  <thead><tr><th>항목</th><th>유형</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td>항목명</td><td>유형</td><td>설명</td></tr>
  </tbody>
</table>

<h4>③ 영역명 (목록 테이블인 경우)</h4>
<p>이 영역의 역할을 한 줄로 요약.</p>
<table>
  <thead><tr><th>항목</th><th>유형</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td>항목명</td><td>유형</td><td>설명</td></tr>
  </tbody>
</table>

<!-- ── 테이블 컬럼 (목록 화면인 경우) ────────────── -->
<h3>테이블 컬럼</h3>
<p class="spec-note">⚠️ 목록형이 아닌 경우 이 섹션 삭제</p>
<table>
  <thead><tr><th>#</th><th>컬럼</th><th>정렬</th><th>비고</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>번호(No)</td><td>중앙</td><td>역순 — total - offset - i</td></tr>
    <tr><td>2</td><td>컬럼명</td><td>좌측/중앙</td><td>비고</td></tr>
  </tbody>
</table>
<p class="spec-note"><strong>행 동작:</strong> 클릭 → {다음 화면 ID} (<code>?id={파라미터}</code> 전달)</p>
<p class="spec-note"><strong>0건 처리:</strong> "조회된 데이터가 없습니다." 표시</p>

<!-- ── Alert 메시지 ──────────────────────────────── -->
<h3>Alert 메시지</h3>
<table>
  <thead><tr><th>#</th><th>상황</th><th>메시지</th><th>유형</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>상황</td><td>메시지 내용</td><td>인라인/Alert 팝업/Confirm/Toast</td></tr>
  </tbody>
</table>

<!-- ── Validation ────────────────────────────────── -->
<h3>Validation</h3>
<p class="spec-note">⚠️ 입력 필드가 없는 경우 "해당 없음" 기재 후 테이블 삭제</p>
<table>
  <thead><tr><th>필드</th><th>조건</th><th>메시지</th></tr></thead>
  <tbody>
    <tr><td>필드명</td><td>조건</td><td>인라인 메시지</td></tr>
  </tbody>
</table>

<!-- ── 반응형 ────────────────────────────────────── -->
<h3>반응형</h3>
<p class="spec-note"><strong>Breakpoint:</strong> PC ≥ 1201px/Tablet 768 ~ 1200px/Mobile ≤ 767px</p>
<table>
  <thead><tr><th>구간</th><th>Breakpoint</th><th>변경 사항</th></tr></thead>
  <tbody>
    <tr><td>PC</td><td>≥ 1201px</td><td>기본 레이아웃</td></tr>
    <tr><td>Tablet</td><td>768 ~ 1200px</td><td><span class="warn">⚠️ 정보 필요</span></td></tr>
    <tr><td>Mobile</td><td>≤ 767px</td><td><span class="warn">⚠️ 정보 필요</span></td></tr>
  </tbody>
</table>
<p class="spec-note">공통 : 터치 영역 최소 44×44 px · 이미지/슬라이드 width 100%</p>

<!-- ── 연관 화면 ─────────────────────────────────── -->
<h3>연관 화면</h3>
<table>
  <thead><tr><th>관계</th><th>ID</th><th>화면명</th></tr></thead>
  <tbody>
    <tr><td>이전</td><td>—</td><td>—</td></tr>
    <tr><td>다음</td><td>—</td><td>—</td></tr>
  </tbody>
</table>

`;
