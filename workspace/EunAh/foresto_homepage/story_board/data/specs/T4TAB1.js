/**
 * T4 탭 기반 소개+소식 — 대표화면 스펙 + 화면별 차이점 명세
 * 그룹: T4. 탭 기반 소개+소식 / 섹션: user
 * 작성일: 2026-04-14
 *
 * ※ 이 파일의 스펙은 T4-TAB1(소개탭 대표화면)에 연결된다.
 *    소식·일지 상세는 T3-D 스펙 공유.
 */

window.SPECS       = window.SPECS       || {};
window.ANNOTATIONS = window.ANNOTATIONS || {};

window.ANNOTATIONS['T4-TAB1'] = [];

window.SPECS['T4-TAB1'] = `

<!-- ── T4 탭 기반 소개+소식 개요 ──────────────────── -->
<h3>T4. 탭 기반 소개+소식 (사용자 등록 게시판)</h3>
<p>
  T4 템플릿을 공유하는 화면들의 공통 구조와 차이점을 정의한다.<br>
  <strong>대표화면(T4-TAB1·TAB2·FORM) 스펙을 기준으로, 아래 차이점 명세표의 항목만 달리 적용하여 구현한다.</strong><br>
  소식·일지 상세 스펙: T3-D 참조 (T3-DIFF 명세).
</p>

<!-- ── 화면별 차이점 명세표 ───────────────────────── -->
<h3>화면별 차이점 명세표</h3>
<table>
  <thead>
    <tr>
      <th>화면명</th>
      <th>LNB 위치 (1depth &gt; 2depth)</th>
      <th>탭 구성</th>
      <th>비고</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>사공단 소개·소식·일지</strong><br>(U28·29·30 = T4 대표)</td>
      <td>회원활동 &gt; 사공단</td>
      <td>[소개] [소식] [일지] 3탭</td>
      <td><strong>이 화면이 대표 기준.</strong> T4-TAB1·TAB2·FORM 스펙 참조. 소식·일지 드롭다운 필터: 사공단 소개 목록 연동.</td>
    </tr>
    <tr>
      <td>숲동아리단 (U31)</td>
      <td>회원활동 &gt; 숲동아리단</td>
      <td>[소개] [소식] 2탭 (일지탭 없음)</td>
      <td>동아리별 개별 소개 페이지. URL에 ?id={clubId} 추가. 소식 드롭다운 필터: 동아리 소개 목록 연동. 동아리 목록 페이지(아래 명세) 별도 있음.</td>
    </tr>
  </tbody>
</table>

<!-- ── 동아리 목록 페이지 추가 명세 ─────────────────── -->
<h3>숲동아리단 목록 페이지 (T4-TAB1 진입 전 단계)</h3>
<p>동아리 목록 진입점. 클릭하면 해당 동아리의 T4-TAB1 소개탭으로 이동.</p>
<table>
  <thead><tr><th>항목</th><th>내용</th></tr></thead>
  <tbody>
    <tr><td>URL</td><td>/member/club.html (id 파라미터 없을 때)</td></tr>
    <tr><td>레이아웃</td><td>갤러리형 그리드(4열, PC 기준 / 모바일 1열). 카드: 동아리명·지역·소개글·상단고정 배지·활동지역.</td></tr>
    <tr><td>카드 클릭</td><td>상세화면 이동/td></tr>
    <tr><td>권한</td><td>정회원 이상만 열람. 비회원·일반회원 접근 시 차단: C02 참조.</td></tr>
    <tr><td>데이터</td><td>API: GET /api/clubs</td></tr>
  </tbody>
</table>

<!-- ── 사공단 vs 동아리 소개탭·소식탭 비교 ───────────── -->
<h3>사공단 vs 동아리: 탭별 스펙 비교</h3>
<table>
  <thead><tr><th>항목</th><th>사공단 (대표)</th><th>숲동아리단 (차이)</th></tr></thead>
  <tbody>
    <tr><td>탭 구성</td><td>[소개] [소식] [일지]</td><td>[소개] [소식] (일지 없음)</td></tr>
    <tr><td>소식 드롭다운 필터</td><td>사공단 소개에 등록된 제목 목록</td><td>해당 clubId의 동아리 소개 제목 목록</td></tr>
    <tr><td>소식 등록 필드</td><td>팀 선택 드롭다운(사공단 목록)</td><td>동아리 선택 드롭다운(해당 clubId, 고정)</td></tr>
    <tr><td>뒤로가기</td><td>LNB 클릭으로 이동</td><td>소개탭 상단에 [동아리 목록으로] 링크 추가</td></tr>
  </tbody>
</table>

<!-- ── 사공단 일지탭 추가 스펙 ───────────────────────── -->
<h3>사공단 일지탭 (대표화면에만 있는 탭)</h3>
<table>
  <thead><tr><th>항목</th><th>내용</th></tr></thead>
  <tbody>
    <tr><td>URL</td><td>/member/sagongdan.html?tab=log</td></tr>
    <tr><td>목록 레이아웃</td><td>T4-TAB2 소식탭과 동일. [등록하기] 버튼 + 게시판 목록.</td></tr>
    <tr><td>상세</td><td>T3-D 스펙 참조. 하단 [목록] 클릭 시 일지탭(?tab=log)으로 이동.</td></tr>
    <tr><td>권한</td><td>정회원 이상 열람·등록 가능.</td></tr>
    <tr><td>등록 폼</td><td>T4-FORM 스펙 적용. board_type=sagongdan-log.</td></tr>
  </tbody>
</table>

<!-- ── 미확정 항목 ─────────────────────────────────── -->
<h3>미확정 항목</h3>
<table>
  <thead><tr><th>#</th><th>화면</th><th>항목</th><th>Claude 판단안</th><th>PM 결정</th></tr></thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>숲동아리단</td>
      <td>동아리별 개별 URL 구조 (id 숫자 기반 vs. slug 기반)</td>
      <td>?id={clubId} 숫자 기반 권장 (구현 간단)</td>
      <td><span class="warn">확인 필요</span></td>
    </tr>
    <tr>
      <td>2</td>
      <td>T4 소식 등록 폼</td>
      <td>사공단/동아리 등록 폼 통합 여부 (팀 드롭다운 없이 단일 폼)</td>
      <td>팀 있는 현재 구조 유지 권장 (UX 명확)</td>
      <td><span class="warn">확인 필요</span></td>
    </tr>
  </tbody>
</table>

<!-- ── 연관 화면 ─────────────────────────────────── -->
<h3>연관 화면</h3>
<table>
  <thead><tr><th>관계</th><th>ID</th><th>화면명</th></tr></thead>
  <tbody>
    <tr><td>T4 대표 소개탭</td><td>T4-TAB1</td><td>대표화면: 소개탭 [풀 스펙 + T4 차이점 명세]</td></tr>
    <tr><td>T4 대표 소식목록탭</td><td>T4-TAB2</td><td>대표화면: 소식목록탭 [풀 스펙]</td></tr>
    <tr><td>T4 대표 등록/수정</td><td>T4-FORM</td><td>대표화면: 소식 등록/수정 [풀 스펙]</td></tr>
    <tr><td>소식·일지 상세 (공유)</td><td>T3-D</td><td>대표화면: 상세 [풀 스펙]</td></tr>
    <tr><td>권한 정책</td><td>C02</td><td>권한 정책표</td></tr>
  </tbody>
</table>

`;
