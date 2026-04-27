/**
 * C01 — 공통 컴포넌트 + NAV 매핑
 * 그룹: 0. 공통 정의 / 섹션: doc
 * 작성일: 2026-04-14
 */

window.SPECS       = window.SPECS       || {};
window.ANNOTATIONS = window.ANNOTATIONS || {};

window.ANNOTATIONS['C01'] = [];

window.SPECS['C01'] = `

<!-- ── 목적 ──────────────────────────────────────── -->
<h3>목적</h3>
<p>
  모든 사용자 화면에 공통 적용되는 컴포넌트의 구조·동작·규칙을 정의한다.
  개발팀은 이 문서를 기준으로 공통 컴포넌트를 1회 구현하고, 개별 화면에 포함시킨다.
  NAV_DATA(header.js) 구조와 SB 화면 ID의 매핑 관계도 이 문서에서 관리한다.
</p>

<!-- ── 공통 컴포넌트 목록 ─────────────────────────── -->
<h3>공통 컴포넌트 목록</h3>
<table>
  <thead><tr><th>컴포넌트</th><th>위치</th><th>포함 파일</th><th>비고</th></tr></thead>
  <tbody>
    <tr><td>헤더</td><td>모든 페이지 최상단</td><td>components/header.js</td><td>GNB·로고·유틸리티 버튼 포함</td></tr>
    <tr><td>푸터</td><td>모든 페이지 최하단</td><td>components/header.js</td><td>협회정보·약관링크·SNS 포함</td></tr>
    <tr><td>LNB</td><td>2depth 이하 페이지 좌측</td><td>header.js 렌더링</td><td>hideLnb:true인 화면 제외</td></tr>
    <tr><td>브레드크럼</td><td>LNB 상단</td><td>header.js 렌더링</td><td>1depth > 2depth > 현재페이지</td></tr>
    <tr><td>페이지 타이틀 배너</td><td>LNB 있는 페이지 콘텐츠 상단</td><td>각 페이지 하드코딩</td><td>페이지명 + 배경이미지</td></tr>
    <tr><td>토스트</td><td>우측 상단 고정</td><td>app.js App.toastUI()</td><td>3초 노출 후 자동 소멸. success/error/info 3종</td></tr>
    <tr><td>글자크기 조절</td><td>헤더 우측</td><td>header.js FontSize</td><td>sm/md(기본)/lg. html[data-font] 속성 제어</td></tr>
  </tbody>
</table>

<!-- ── 헤더 상세 ──────────────────────────────────── -->
<h3>헤더 상세</h3>

<h4>① 로고 영역</h4>
<p>좌측 상단. 클릭 시 홈 메인(U01)으로 이동.</p>

<h4>② GNB (Global Navigation Bar)</h4>
<p>1depth 메뉴 항목이 가로 나열. hover 시 2depth 드롭다운 노출. 2depth 클릭 시 3depth LNB 활성화.</p>
<table>
  <thead><tr><th>동작</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td>1depth hover</td><td>해당 1depth의 2depth 서브메뉴 드롭다운 노출</td></tr>
    <tr><td>2depth 클릭</td><td>해당 2depth의 첫 번째 3depth 페이지로 이동 + LNB 활성화</td></tr>
    <tr><td>현재 페이지 활성</td><td>현재 URL에 해당하는 1depth·2depth·3depth 항목 강조 표시</td></tr>
    <tr><td>hideLnb:true 항목</td><td>GNB에는 표시되지 않음. 상위 메뉴 LNB에서 활성 처리.</td></tr>
  </tbody>
</table>

<h4>③ 유틸리티 버튼 (우측)</h4>
<table>
  <thead><tr><th>버튼</th><th>비로그인</th><th>로그인</th></tr></thead>
  <tbody>
    <tr><td>로그인/마이페이지</td><td>[로그인] 클릭 → U53</td><td>[마이페이지] 클릭 → U56-1</td></tr>
    <tr><td>글자크기 (가/가/가)</td><td colspan="2">sm/md/lg 토글. 현재 단계 강조.</td></tr>
    <tr><td>사이트맵 아이콘</td><td colspan="2">클릭 → U58 사이트맵 페이지</td></tr>
  </tbody>
</table>

<!-- ── LNB 상세 ───────────────────────────────────── -->
<h3>LNB 상세</h3>
<p>2depth 그룹 제목 + 하위 3depth 항목 세로 목록. 현재 페이지 항목 강조(볼드+색상).
LNB가 있는 모든 페이지에 브레드크럼(1depth > 2depth > 현재 3depth) 함께 표시.</p>
<table>
  <thead><tr><th>항목</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td>2depth 그룹명</td><td>LNB 상단 제목. 해당 2depth의 label 값.</td></tr>
    <tr><td>3depth 목록</td><td>현재 2depth에 속한 3depth 항목 전부 노출.</td></tr>
    <tr><td>활성 항목</td><td>현재 URL과 일치하는 3depth 항목. 폰트 굵게 + 좌측 컬러 바.</td></tr>
    <tr><td>hideLnb:true</td><td>이 속성이 있는 화면은 상위 parent href 기준으로 LNB 렌더링.</td></tr>
  </tbody>
</table>

<!-- ── NAV_DATA ↔ SB 화면 ID 매핑표 ──────────────── -->
<h3>NAV_DATA ↔ SB 화면 ID 매핑표</h3>
<p>header.js의 NAV_DATA 구조(1depth → 2depth → 3depth)와 SB 화면 ID의 대응 관계.</p>
<table>
  <thead><tr><th>1depth</th><th>2depth</th><th>3depth (label)</th><th>SB 화면 ID</th><th>비고</th></tr></thead>
  <tbody>
    <tr><td rowspan="14">소개</td><td rowspan="5">협회 소개</td><td>인사말</td><td>T1-01</td><td>T1 대표화면</td></tr>
    <tr><td>미션 &amp; 비전</td><td>T1-DIFF</td><td>T1 변형 (구 U03)</td></tr>
    <tr><td>주요 사업</td><td>T1-DIFF</td><td>T1 변형 (구 U04)</td></tr>
    <tr><td>연혁</td><td>U05</td><td>고유 화면</td></tr>
    <tr><td>오시는 길</td><td>T1-DIFF</td><td>T1 변형 (구 U10)</td></tr>
    <tr><td rowspan="3">조직 안내</td><td>조직도·임원진</td><td>U06</td><td>고유 화면</td></tr>
    <tr><td>전국 지역협회</td><td>U07</td><td>고유 화면</td></tr>
    <tr><td>지역협회 상세</td><td>U08</td><td>hideLnb:true</td></tr>
    <tr><td rowspan="6">회원 안내</td><td>회원 규정</td><td>T1-DIFF</td><td>T1 변형 (구 U09)</td></tr>
    <tr><td>정회원 가입 안내</td><td>T1-DIFF</td><td>T1 변형 (구 U48)</td></tr>
    <tr><td>정회원 신청</td><td>U49</td><td>hideLnb:true</td></tr>
    <tr><td>후원 안내</td><td>T1-DIFF</td><td>T1 변형 (구 U50)</td></tr>
    <tr><td>후원하기</td><td>U51</td><td>hideLnb:true</td></tr>
    <tr><td></td><td></td><td></td><td></td></tr>
    <tr><td rowspan="10">교육과정</td><td rowspan="2">숲해설가란</td><td>숲해설가 알아보기</td><td>T1-DIFF</td><td>T1 변형 (구 U11)</td></tr>
    <tr><td>자주 묻는 질문</td><td>U12</td><td>고유 화면</td></tr>
    <tr><td rowspan="2">기초 과정</td><td>과정 개요</td><td>T1-DIFF</td><td>T1 변형 (구 U13)</td></tr>
    <tr><td>과정 신청</td><td>T2-M</td><td>기초과정 신청 (구 U14)</td></tr>
    <tr><td rowspan="4">자격취득 과정</td><td>과정 개요</td><td>T1-DIFF</td><td>T1 변형 (구 U15)</td></tr>
    <tr><td>목록</td><td>T2-L</td><td>T2 대표화면</td></tr>
    <tr><td>상세</td><td>T2-D</td><td>T2 대표화면</td></tr>
    <tr><td>수료생 후기</td><td>U20·U21</td><td>고유 화면</td></tr>
    <tr><td rowspan="2">역량강화 과정</td><td>과정 개요</td><td>T1-DIFF</td><td>T1 변형 (구 U18)</td></tr>
    <tr><td>과정 신청</td><td>T2-DIFF</td><td>T2 변형 (구 U19)</td></tr>
    <tr><td rowspan="12">회원활동</td><td rowspan="3">회원아카데미</td><td>특강</td><td>T2-DIFF</td><td>T2 변형 (구 U22·23)</td></tr>
    <tr><td>강좌</td><td>T2-DIFF</td><td>T2 변형 (구 U24·25)</td></tr>
    <tr><td>멘토링 숲학교</td><td>T2-DIFF</td><td>T2 변형 (구 U26·27)</td></tr>
    <tr><td rowspan="3">사회공헌사업단</td><td>사공단 소개</td><td>T4-TAB1</td><td>T4 대표화면</td></tr>
    <tr><td>사공단 소식</td><td>T4-TAB2</td><td>T4 대표화면</td></tr>
    <tr><td>사공단 일지</td><td>T4-DIFF</td><td>T4 변형</td></tr>
    <tr><td rowspan="2">숲동아리단</td><td>동아리 소개</td><td>T4-DIFF</td><td>T4 변형 (구 U31)</td></tr>
    <tr><td>동아리 소식</td><td>T4-DIFF</td><td>T4 변형</td></tr>
    <tr><td>자료실</td><td colspan="2">— (flat)</td><td>T3-DIFF</td><td>T3 변형 (구 U46·47)</td></tr>
    <tr><td>숲일터</td><td colspan="2">— (flat)</td><td>T3-DIFF</td><td>T3 변형 (구 U34·35)</td></tr>
    <tr><td>강사 신청</td><td colspan="2">— (flat)</td><td>T2-DIFF</td><td>T2 변형 (구 U32·33)</td></tr>
    <tr><td></td><td></td><td></td><td></td></tr>
    <tr><td rowspan="6">커뮤니티</td><td rowspan="5">소식</td><td>공지사항</td><td>T3-L · T3-D</td><td>T3 대표화면</td></tr>
    <tr><td>협회 캘린더</td><td>U38</td><td>고유 화면</td></tr>
    <tr><td>협회지</td><td>T3-DIFF</td><td>T3 변형 (구 U39·40)</td></tr>
    <tr><td>언론 보도</td><td>T3-DIFF</td><td>T3 변형 (구 U41·42)</td></tr>
    <tr><td>(협회지·언론보도 상세)</td><td>T3-D 참조</td><td>hideLnb:true</td></tr>
    <tr><td>갤러리</td><td colspan="2">— (flat)</td><td>T5-L · T5-FORM · T3-D</td><td>T5 목록·등록, 상세는 T3-D</td></tr>
    <tr><td>숲해설 신청</td><td colspan="3">— (단독 1depth)</td><td>U52</td><td>고유 화면</td></tr>
  </tbody>
</table>

<!-- ── 연관 화면 ─────────────────────────────────── -->
<h3>연관 화면</h3>
<table>
  <thead><tr><th>관계</th><th>ID</th><th>화면명</th></tr></thead>
  <tbody>
    <tr><td>권한 정책</td><td>C02</td><td>권한 정책표</td></tr>
    <tr><td>상태 처리</td><td>C03</td><td>상태별 처리</td></tr>
    <tr><td>레이아웃 기준</td><td>DOC-05</td><td>공통 레이아웃_사용자</td></tr>
  </tbody>
</table>

`;
