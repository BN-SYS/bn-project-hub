/**
 * C02 — 권한 정책표
 * 그룹: 0. 공통 정의 / 섹션: doc
 * 작성일: 2026-04-14
 */

window.SPECS       = window.SPECS       || {};
window.ANNOTATIONS = window.ANNOTATIONS || {};

window.ANNOTATIONS['C02'] = [];

window.SPECS['C02'] = `

<!-- ── 목적 ──────────────────────────────────────── -->
<h3>목적</h3>
<p>
  사이트 내 모든 기능에 대한 4단계 권한별 접근 정책을 정의한다.
  개발팀은 이 표를 기준으로 미들웨어·컨트롤러·프론트엔드 조건부 렌더링을 구현한다.
</p>

<!-- ── 권한 등급 정의 ─────────────────────────────── -->
<h3>권한 등급 정의</h3>
<table>
  <thead><tr><th>등급</th><th>코드값 (role)</th><th>조건</th><th>비고</th></tr></thead>
  <tbody>
    <tr><td>비회원</td><td>guest</td><td>미로그인 상태</td><td>세션 없음</td></tr>
    <tr><td>일반회원</td><td>member</td><td>로그인 완료, 정회원 미승인</td><td>가입 즉시 부여</td></tr>
    <tr><td>정회원</td><td>fullMember</td><td>관리자가 정회원 신청 승인 완료</td><td>A11·A12에서 승인 처리</td></tr>
    <tr><td>관리자</td><td>admin</td><td>관리자 페이지 접근 가능 계정</td><td>DB에서 role=admin 직접 설정</td></tr>
  </tbody>
</table>


<!-- ── 권한 차단 공통 규칙 ────────────────────────── -->
<h3>권한 차단 공통 규칙</h3>
<table>
  <thead><tr><th>상황</th><th>처리</th></tr></thead>
  <tbody>
    <tr>
      <td>비로그인 → 로그인 필요 페이지 직접 접근 (URL 입력)</td>
      <td>로그인 페이지(U53)로 리다이렉트. 로그인 완료 후 원래 URL 복귀.</td>
    </tr>
    <tr>
      <td>비로그인 → 로그인 필요 버튼 클릭</td>
      <td>"로그인 후 이용 가능합니다." 토스트 → U53으로 이동.</td>
    </tr>
    <tr>
      <td>일반회원 → 정회원 전용 페이지 접근</td>
      <td>"정회원만 이용 가능한 서비스입니다." 토스트 → 정회원 가입 안내(T1-DIFF) 이동.</td>
    </tr>
    <tr>
      <td>비관리자 → 관리자 페이지 URL 직접 접근</td>
      <td>Laravel 미들웨어에서 차단 → 로그인 페이지 리다이렉트.</td>
    </tr>
  </tbody>
</table>

<!-- ── 연관 화면 ─────────────────────────────────── -->
<h3>연관 화면</h3>
<table>
  <thead><tr><th>관계</th><th>ID</th><th>화면명</th></tr></thead>
  <tbody>
    <tr><td>공통 컴포넌트</td><td>C01</td><td>공통 컴포넌트 + NAV 매핑</td></tr>
    <tr><td>상태 처리</td><td>C03</td><td>상태별 처리</td></tr>
    <tr><td>정회원 가입 안내</td><td>T1-DIFF</td><td>T1 차이점 명세표 (정회원가입안내 행)</td></tr>
    <tr><td>정회원 신청 폼</td><td>U49</td><td>정회원 가입 신청 폼</td></tr>
    <tr><td>로그인</td><td>U53</td><td>로그인</td></tr>
  </tbody>
</table>

`;
