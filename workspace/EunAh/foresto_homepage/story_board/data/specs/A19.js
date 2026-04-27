// ============================================================
//  A19 — 일정 등록/수정
//  그룹 : 일정관리
//  섹션 : admin
//  작성일 : 2026-04-06
// ============================================================

window.SPECS       = window.SPECS       || {};
window.ANNOTATIONS = window.ANNOTATIONS || {};

window.ANNOTATIONS['A19'] = [
  { n: 1, x: 13.8, y: 9.9 },   // 일정 등록/수정 콘텐츠 영역
  { n: 2, x: 13.8, y: 9.9 },   // 일정 정보 카드 (카테고리·일정일·일정명·링크)
  { n: 3, x: 13.8, y: 36.8 },   // 하단 액션 바 (취소·저장)
];

window.SPECS['A19'] = `

<!-- ── 목적 ──────────────────────────────────────── -->
<h3>목적</h3>
<p>협회 일정을 신규 등록하거나 기존 일정을 수정하는 폼 화면. URL ?id= 파라미터 유무로 등록/수정 모드를 구분하며, 수정 모드 시 기존 데이터를 자동 바인딩한다.</p>

<!-- ── 구조 및 상세 ──────────────────────────────── -->
<h3>구조 및 상세</h3>

<h4>① 모드 구분</h4>
<p>
  - ?id= 없음 → 등록 모드. 페이지 타이틀 "일정 수정" (calendar-edit.html은 수정 전용 URL로도 사용)<br>
  - ?id={id} → 수정 모드. 기존 일정 데이터 바인딩
</p>

<h4>② 입력 폼</h4>
<p>
  - 날짜: date input. 필수<br>
  - 카테고리: 셀렉트박스 (edu·교육/강좌/activity·사회공헌 활동/meeting·협회 회의/club·동아리 모임/event·행사). 필수<br>
  - 제목: text input. 필수<br>
  - 관련 링크: URL input. 선택. 안내: "관련 게시물 또는 외부 페이지 URL을 입력하면 캘린더 클릭 시 이동합니다."
</p>

<h4>③ 버튼</h4>
<p>
  - [취소]: history.back(). <strong>DOC06: C08 적용</strong><br>
  - [저장]: 유효성 검사 후 API 호출. 성공 시 Alert → history.back()
</p>

<!-- ── Alert 메시지 ──────────────────────────────── -->
<h3>Alert 메시지</h3>
<p><strong>DOC06: C07 공통 Alert 적용 --></strong></p>
<table>
  <thead><tr><th>트리거</th><th>유형</th><th>메시지</th></tr></thead>
  <tbody>
    <tr><td>날짜 미입력</td><td>Alert</td><td>날짜를 선택해주세요.</td></tr>
    <tr><td>카테고리 미선택</td><td>Alert</td><td>카테고리를 선택해주세요.</td></tr>
    <tr><td>제목 미입력</td><td>Alert</td><td>제목을 입력해주세요.</td></tr>
    <tr><td>저장 성공</td><td>Alert</td><td>일정이 저장되었습니다.</td></tr>
  </tbody>
</table>

<!-- ── Validation ────────────────────────────────── -->
<h3>Validation</h3>
<table>
  <thead><tr><th>필드</th><th>필수</th><th>규칙</th><th>에러 메시지</th></tr></thead>
  <tbody>
    <tr><td>날짜</td><td>Y</td><td>date 선택</td><td>날짜를 선택해주세요.</td></tr>
    <tr><td>카테고리</td><td>Y</td><td>셀렉트 선택</td><td>카테고리를 선택해주세요.</td></tr>
    <tr><td>제목</td><td>Y</td><td>1자 이상</td><td>제목을 입력해주세요.</td></tr>
    <tr><td>관련 링크</td><td>N</td><td>URL 형식 (https:// 시작 권장)</td><td>—</td></tr>
  </tbody>
</table>

<!-- ── 연관 화면 ─────────────────────────────────── -->
<h3>연관 화면</h3>
<table>
  <thead><tr><th>화면 ID</th><th>화면명</th><th>관계</th></tr></thead>
  <tbody>
    <tr><td>A17</td><td>일정 목록</td><td>[취소] 또는 저장 후 이동 (history.back())</td></tr>
    <tr><td>A18</td><td>일정 상세</td><td>수정 모드 진입 경로</td></tr>
  </tbody>
</table>

`;
