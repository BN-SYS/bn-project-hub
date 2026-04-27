// ============================================================
//  DOC-05 — 공통 레이아웃 설명
//  그룹 : Documents
//  섹션 : 프로젝트 문서
//  작성일 : 2026-04-02
// ============================================================

window.SPECS = window.SPECS || {};
window.SPECS['DOC-05'] = `

<!-- ── 목적 ──────────────────────────────────────── -->
<h3>목적</h3>
<p>모든 사용자 페이지에 공통 적용되는 레이아웃 구조와 UI 동작 규칙을 정의한다. 각 서브 페이지는 ⑥ 콘텐츠 영역만 교체된다.</p>

<!-- ── 구조 및 상세 ──────────────────────────────── -->
<h3>구조 및 상세</h3>

<h4>① 유틸리티 바</h4>
<p>최상단 고정. 사이트맵 링크 및 글자 크기 조절 기능 제공.</p>
<table>
  <thead><tr><th>항목</th><th>유형</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td>사이트맵</td><td>텍스트 링크</td><td>클릭 시 전체 사이트맵 페이지로 이동</td></tr>
    <tr><td>글자 크기 조절</td><td>버튼 3개 (소/중/대)</td><td>기본값 '중'. 선택 시 본문 font-size 변경. 세션 유지 여부 ⚠️ 협의 필요</td></tr>
  </tbody>
</table>

<h4>② 헤더 (로고 + GNB)</h4>
<p>기관 로고 + 글로벌 네비게이션 + 로그인 상태 표시. 상단 고정.</p>
<table>
  <thead><tr><th>항목</th><th>유형</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td>로고</td><td>이미지 링크</td><td>클릭 → U01 홈 메인으로 이동</td></tr>
    <tr><td>GNB 1뎁스</td><td>텍스트 메뉴</td><td>소개 · 교육과정 · 회원활동 · 커뮤니티 · 숲해설 신청</td></tr>
    <tr><td>로그인 영역 (비로그인)</td><td>텍스트 링크</td><td>[로그인] [회원가입] 노출</td></tr>
    <tr><td>로그인 영역 (회원)</td><td>텍스트</td><td>이름(등급) · [마이페이지] · [로그아웃]</td></tr>
    <tr><td>로그인 영역 (관리자)</td><td>텍스트</td><td>이름(등급) · [마이페이지] · [관리자] · [로그아웃]</td></tr>
  </tbody>
</table>

<h4>③ GNB 서브메뉴</h4>
<p>1뎁스 메뉴의 하위 2뎁스 드롭다운.</p>
<table>
  <thead><tr><th>항목</th><th>유형</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td>2뎁스 메뉴</td><td>드롭다운</td><td>PC : 1뎁스 hover 시 펼침. Tablet/Mobile : 1뎁스 클릭 토글. 하나만 열린 상태 유지</td></tr>
    <tr><td>메뉴 닫힘</td><td>인터랙션</td><td>다른 1뎁스 hover/클릭 시 이전 메뉴 자동 닫힘. 메뉴 외 영역 클릭 시 닫힘</td></tr>
  </tbody>
</table>

<h4>④ 브레드크럼</h4>
<p>현재 위치 경로 표시.</p>
<table>
  <thead><tr><th>항목</th><th>유형</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td>경로 표시</td><td>텍스트 링크</td><td>홈 &gt; 1뎁스 &gt; 2뎁스 &gt; 현재 페이지</td></tr>
    <tr><td>현재 페이지</td><td>텍스트 (강조)</td><td>볼드 + 색상 강조. 링크 아님</td></tr>
    <tr><td>상위 항목</td><td>텍스트 링크</td><td>클릭 시 해당 뎁스 대표 페이지로 이동</td></tr>
  </tbody>
</table>

<h4>⑤ 서브 탭 네비게이션</h4>
<p>같은 2뎁스 그룹 내 페이지 전환 탭.</p>
<table>
  <thead><tr><th>항목</th><th>유형</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td>탭 목록</td><td>탭 버튼</td><td>같은 2뎁스 그룹 내 페이지가 2개 이상일 때만 노출</td></tr>
    <tr><td>활성 탭</td><td>스타일</td><td>현재 페이지에 해당하는 탭 활성 상태(색상·하단 바)</td></tr>
    <tr><td>Mobile 스크롤</td><td>가로 스크롤</td><td>탭이 화면 폭 초과 시 좌우 스크롤 가능</td></tr>
  </tbody>
</table>

<h4>⑥ 콘텐츠 영역</h4>
<p>각 페이지 고유 콘텐츠가 렌더링되는 영역. 서브 페이지 진입 시 이 영역만 교체.</p>
<table>
  <thead><tr><th>항목</th><th>유형</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td>최대 너비</td><td>레이아웃</td><td>max-width: 1200px, 중앙 정렬</td></tr>
    <tr><td>최소 높이</td><td>레이아웃</td><td>min-height: calc(100vh - header - footer)</td></tr>
    <tr><td>좌우 패딩</td><td>레이아웃</td><td>PC 40px/Tablet 24px/Mobile 16px</td></tr>
  </tbody>
</table>

<h4>⑦ 유관기관 바로가기 슬라이드</h4>
<p>콘텐츠 영역 하단, 전체 너비(100%) 사용. 기관 로고 가로 슬라이드 배너.</p>
<table>
  <thead><tr><th>항목</th><th>유형</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td>기관 로고</td><td>이미지 링크</td><td>클릭 → 해당 기관 홈페이지 새 탭(_blank) 이동</td></tr>
    <tr><td>노출 기관</td><td>이미지</td><td>국립수목원 · 산림복지진흥원 · 숲해설가 자격 · 녹색연합 · 산림청 등 ⚠️ 전체 목록·순서·URL 확인 필요</td></tr>
    <tr><td>자동 롤링</td><td>인터랙션</td><td>일정 간격 자동 좌측 이동 ⚠️ 롤링 간격(초) 협의 필요</td></tr>
    <tr><td>수동 이동</td><td>인터랙션</td><td>좌우 화살표 클릭 시 1칸 이동 ⚠️ 무한 루프/끝 비활성 방식 협의 필요</td></tr>
    <tr><td>hover 시</td><td>인터랙션</td><td>자동 롤링 일시 정지, mouse leave 시 재개</td></tr>
  </tbody>
</table>

<h4>⑧ 푸터</h4>
<p>기관 정보 · 정책 링크 · SNS · 외부 링크 · 저작권.</p>
<table>
  <thead><tr><th>항목</th><th>유형</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td>기관 로고</td><td>이미지 링크</td><td>클릭 → U01 홈 (내부 이동)</td></tr>
    <tr><td>기관 정보</td><td>텍스트</td><td>주소, 전화·FAX, 이메일</td></tr>
    <tr><td>정책 링크</td><td>텍스트 링크</td><td>이용약관(U59) · 개인정보처리방침(U60) · 이메일무단수집거부(U61) → 새 탭</td></tr>
    <tr><td>SNS 링크</td><td>아이콘 링크</td><td>네이버블로그 · 유튜브 · 인스타그램 → 새 탭</td></tr>
    <tr><td>구 홈페이지 바로가기</td><td>드롭다운 + 버튼</td><td>산림청 · 국립수목원 · 산림복지진흥원 · 녹색연합 → 새 탭</td></tr>
    <tr><td>Family Site</td><td>드롭다운</td><td>외부 링크 모음 → 새 탭</td></tr>
    <tr><td>저작권</td><td>텍스트</td><td>Copyright © 2026 www.foresto.org All rights reserved.</td></tr>
  </tbody>
</table>

<!-- ── Alert 메시지 ──────────────────────────────── -->
<h3>Alert 메시지</h3>
<table>
  <thead><tr><th>트리거</th><th>유형</th><th>메시지</th></tr></thead>
  <tbody>
    <tr><td>로그아웃 클릭</td><td>Confirm</td><td>로그아웃 하시겠습니까?</td></tr>
    <tr><td>로그아웃 완료</td><td>Toast</td><td>로그아웃 되었습니다.</td></tr>
    <tr><td>세션 만료</td><td>Alert</td><td>로그인 세션이 만료되었습니다. 다시 로그인해주세요.</td></tr>
    <tr><td>비회원 접근</td><td>Alert</td><td>로그인이 필요한 서비스입니다.</td></tr>
  </tbody>
</table>

<!-- ── Validation ────────────────────────────────── -->
<h3>Validation</h3>
<p>공통 레이아웃에는 입력 필드가 없으므로 해당 없음</p>

<!-- ── 반응형 ────────────────────────────────────── -->
<h3>반응형</h3>
<table>
  <thead><tr><th>구간</th><th>Breakpoint</th><th>변경 사항</th></tr></thead>
  <tbody>
    <tr><td>PC</td><td>≥ 1201px</td><td>GNB 가로 배치 · 1뎁스 hover → 2뎁스 드롭다운 · 브레드크럼 전체 경로 노출 · 푸터 가로 배치</td></tr>
    <tr><td>Tablet</td><td>768 ~ 1200px</td><td>⚠️ GNB 방식 확정 필요 (가로 유지 or 햄버거) · 서브메뉴 클릭 토글 · 푸터 2단 배치 · 콘텐츠 padding 24px</td></tr>
    <tr><td>Mobile</td><td>≤ 767px</td><td>햄버거 메뉴 → 아코디언 서브메뉴 · 서브 탭 가로 스크롤 · 푸터 세로 1단 배치 · 콘텐츠 padding 16px</td></tr>
  </tbody>
</table>
<p class="spec-note">공통 : 터치 영역 최소 44×44 px · 이미지/슬라이드 width 100%</p>

<!-- ── 연관 화면 ─────────────────────────────────── -->
<h3>연관 화면</h3>
<table>
  <thead><tr><th>화면 ID</th><th>화면명</th><th>관계</th></tr></thead>
  <tbody>
    <tr><td>U01</td><td>홈 메인</td><td>로고 클릭 시 이동 대상</td></tr>
    <tr><td>U53</td><td>로그인</td><td>비로그인 시 이동 · 세션 만료 시 리다이렉트</td></tr>
    <tr><td>U55</td><td>회원가입</td><td>비로그인 상태 헤더에서 진입</td></tr>
    <tr><td>U56</td><td>마이페이지</td><td>로그인 상태 헤더에서 진입</td></tr>
    <tr><td>A01</td><td>관리자 회원 목록</td><td>관리자 로그인 시 [관리자] 링크로 진입</td></tr>
    <tr><td>U59</td><td>이용약관</td><td>푸터 정책 링크</td></tr>
    <tr><td>U60</td><td>개인정보처리방침</td><td>푸터 정책 링크</td></tr>
    <tr><td>U61</td><td>이메일 무단수집 거부</td><td>푸터 정책 링크</td></tr>
  </tbody>
</table>

`;
