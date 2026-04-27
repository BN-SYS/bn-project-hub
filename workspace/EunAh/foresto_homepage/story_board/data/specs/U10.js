// ============================================================
//  U10 — 오시는 길
//  그룹 : 소개
//  섹션 : user
//  작성일 : 2026-04-14
// ============================================================

window.SPECS       = window.SPECS       || {};
window.ANNOTATIONS = window.ANNOTATIONS || {};

// 좌표 기준: 이미지 전체 크기 대비 % (x: 좌→우, y: 상→하)
// 위치 규칙: 설명 대상 요소의 좌측 앞에 붙임
// SB 뷰어 우측 상단 [📍 좌표] 버튼으로 클릭 위치 확인 가능
window.ANNOTATIONS['U10'] = [
  { n: 1, x: 9,  y: 29 },   // 지도
  { n: 2, x: 70, y: 29 },   // 협회 정보 영역
];

window.SPECS['U10'] = `

<!-- ── 목적 ──────────────────────────────────────── -->
<h3>목적</h3>
<p>협회 위치와 연락처 정보를 제공하는 화면. 지도 API로 위치를 시각화하고, 우측에 협회 기본 정보를 함께 노출한다.</p>

<!-- ── 구조 및 상세 ──────────────────────────────── -->
<h3>구조 및 상세</h3>

<h4>① 지도</h4>
<p>카카오 지도 API를 사용하여 협회 위치를 지도로 표시. 백엔드 개발자 연동 필요.</p>
<table>
  <thead><tr><th>항목</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td>지도 API</td><td>카카오 지도 API 사용. API 키 발급 및 연동은 백엔드 개발자 담당.</td></tr>
    <tr><td>마커</td><td>협회 위치에 마커 표시.</td></tr>
  </tbody>
</table>

<h4>② 협회 정보 영역</h4>
<p>지도 우측에 협회 기본 정보를 항목별로 노출.</p>
<table>
  <thead><tr><th>항목</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td>협회명</td><td>국문·영문 협회명 노출.</td></tr>
    <tr><td>주소</td><td>주소 및 우편번호 노출.</td></tr>
    <tr><td>대표전화</td><td>전화번호 노출.</td></tr>
    <tr><td>팩스</td><td>팩스번호 노출.</td></tr>
    <tr><td>이메일</td><td>이메일 주소 노출.</td></tr>
    <tr><td>영업시간</td><td>운영 시간 노출.</td></tr>
  </tbody>
</table>

<!-- ── 반응형 ────────────────────────────────────── -->
<h3>반응형</h3>
<p class="spec-note"><strong>Breakpoint:</strong> PC ≥ 1201px / Tablet 768 ~ 1200px / Mobile ≤ 767px</p>
<table>
  <thead><tr><th>구간</th><th>Breakpoint</th><th>변경 사항</th></tr></thead>
  <tbody>
    <tr><td>PC</td><td>≥ 1201px</td><td>지도(좌)·협회 정보(우) 2단 가로 배치.</td></tr>
    <tr><td>Tablet</td><td>768 ~ 1200px</td><td>지도·협회 정보 세로 적층.</td></tr>
    <tr><td>Mobile</td><td>≤ 767px</td><td>지도 height 축소. 협회 정보 지도 하단 배치.</td></tr>
  </tbody>
</table>


`;
