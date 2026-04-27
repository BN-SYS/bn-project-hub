// ============================================================
//  A27 — 배너 등록/수정
//  그룹 : 콘텐츠관리
//  섹션 : admin
//  작성일 : 2026-04-06
// ============================================================

window.SPECS       = window.SPECS       || {};
window.ANNOTATIONS = window.ANNOTATIONS || {};

window.ANNOTATIONS['A27'] = [
  { n: 1, x: 20, y: 5 },   // 배너 등록 전체 레이아웃 (폼+프리뷰 2열)
  { n: 2, x: 12, y: 8.9 },   // 등록 폼 영역
  { n: 3, x: 13.8, y: 8.9 },   // 기본 설정 카드 (제목·노출기간)
  { n: 4, x: 13.8, y: 28.8 },   // 텍스트 설정 카드 (상단·메인·하단 텍스트)
  { n: 5, x: 13.8, y: 59.5 },   // 더보기 링크 카드 (선택 입력)
  { n: 6, x: 68.1, y: 11.5 },   // 라이브 프리뷰 패널
];

window.SPECS['A27'] = `

<!-- ── 목적 ──────────────────────────────────────── -->
<h3>목적</h3>
<p>메인 배너를 신규 등록하거나 기존 배너를 수정하는 폼 화면. ?id= 유무로 등록/수정 모드를 구분한다. 폼 입력 시 우측 라이브 프리뷰가 실시간으로 갱신된다.</p>

<!-- ── 구조 및 상세 ──────────────────────────────── -->
<h3>구조 및 상세</h3>

<h4>① 모드 구분</h4>
<p>
  - ?id= 없음 → 등록 모드. 타이틀 "배너 등록"<br>
  - ?id={id} → 수정 모드. 타이틀 "배너 수정". 기존 데이터 자동 바인딩 (이미지 미리보기 포함)
</p>

<h4>② 2열 레이아웃</h4>
<p>
  - 좌측: 폼 영역 (flex:1)<br>
  - 우측: 라이브 프리뷰 패널 (width:580px, sticky)
</p>

<h4>③ 배너 이미지 (필수)</h4>
<p>
  - 이미지 업로드 존: 클릭 또는 drag-and-drop. input[type=file] accept="image/*"<br>
  - 권장 크기: 1200×400px (가로:세로 = 3:1 비율)<br>
  - 이미지 선택 시 업로드 존 내부에 미리보기(max-height:160px) 즉시 표시<br>
  - [이미지 제거] 링크: 업로드 취소 및 placeholder 복원<br>
  - drag-over 시 업로드 존 border-color·background 강조 표시
</p>

<h4>④ 텍스트 설정</h4>
<p>
  - 상단 텍스트: 선택. text input. maxlength 60. 배너 상단에 작게 표시되는 보조 텍스트<br>
  - 메인 텍스트: 필수. textarea. maxlength 100. 줄바꿈 사용 가능. 배너 중앙에 크게 표시<br>
  - 하단 텍스트: 선택. text input. maxlength 80. 메인 텍스트 아래 설명 문구
</p>

<h4>⑤ 더보기 버튼 링크 (선택)</h4>
<p>
  - 링크 URL: text input. 미입력 시 배너 내 "더보기" 버튼 미노출<br>
  - 버튼명은 "더보기"로 고정 (변경 불가)
</p>

<h4>⑥ 라이브 프리뷰 패널</h4>
<p>
  - 배너 비율(aspect-ratio: 3/1)로 실제 배너 형태 표시<br>
  - 이미지 없을 때: 회색 placeholder 표시<br>
  - 텍스트 입력 시 오버레이에 상단/메인/하단 텍스트, 더보기 버튼 실시간 반영<br>
  - 이미지·텍스트 입력할 때마다 즉시 갱신 (oninput/onchange 이벤트)
</p>

<h4>⑦ 저장/취소 버튼</h4>
<p>
  - [취소]: A26(배너 관리)으로 이동. <strong>DOC06: C08 적용</strong><br>
  - [저장]: 유효성 검사 후 API 호출. 성공 시 Alert → A26 이동
</p>

<!-- ── Alert 메시지 ──────────────────────────────── -->
<h3>Alert 메시지</h3>
<p><strong>DOC06: C07 공통 Alert 적용 --></strong></p>
<table>
  <thead><tr><th>트리거</th><th>유형</th><th>메시지</th></tr></thead>
  <tbody>
    <tr><td>이미지 미등록</td><td>Alert</td><td>배너 이미지를 등록해주세요.</td></tr>
    <tr><td>메인 텍스트 미입력</td><td>Alert</td><td>메인 텍스트를 입력해주세요.</td></tr>
    <tr><td>저장 성공 (등록)</td><td>Alert</td><td>배너가 등록되었습니다.</td></tr>
    <tr><td>저장 성공 (수정)</td><td>Alert</td><td>배너가 수정되었습니다.</td></tr>
  </tbody>
</table>

<!-- ── Validation ────────────────────────────────── -->
<h3>Validation</h3>
<table>
  <thead><tr><th>필드</th><th>필수</th><th>규칙</th><th>에러 메시지</th></tr></thead>
  <tbody>
    <tr><td>배너 이미지</td><td>Y</td><td>파일 선택 필수 (등록 모드). 수정 모드는 기존 이미지 유지 가능</td><td>배너 이미지를 등록해주세요.</td></tr>
    <tr><td>메인 텍스트</td><td>Y</td><td>1자 이상 (공백 제외). maxlength 100</td><td>메인 텍스트를 입력해주세요.</td></tr>
    <tr><td>상단 텍스트</td><td>N</td><td>선택 입력. maxlength 60</td><td>—</td></tr>
    <tr><td>하단 텍스트</td><td>N</td><td>선택 입력. maxlength 80</td><td>—</td></tr>
    <tr><td>링크 URL</td><td>N</td><td>선택 입력</td><td>—</td></tr>
  </tbody>
</table>

<!-- ── 연관 화면 ─────────────────────────────────── -->
<h3>연관 화면</h3>
<table>
  <thead><tr><th>화면 ID</th><th>화면명</th><th>관계</th></tr></thead>
  <tbody>
    <tr><td>A26</td><td>배너 관리</td><td>[취소] 클릭/저장 성공 후 이동</td></tr>
  </tbody>
</table>

`;
