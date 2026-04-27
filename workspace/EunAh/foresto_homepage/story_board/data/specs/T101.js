/**
 * T1 정적 콘텐츠 페이지 — 대표화면 스펙 + 화면별 차이점 명세
 * 그룹: T1. 정적 콘텐츠 페이지 / 섹션: user
 * 작성일: 2026-04-14
 *
 * ※ 이 파일의 스펙은 T1-01(인사말 대표화면)에 연결된다.
 *    공통 레이아웃 기준 + 화면별 차이점 명세표 포함.
 */

window.SPECS       = window.SPECS       || {};
window.ANNOTATIONS = window.ANNOTATIONS || {};

window.ANNOTATIONS['T1-01'] = [];

window.SPECS['T1-01'] = `

<!-- ── T1 정적 콘텐츠 페이지 개요 ────────────────── -->
<h3>T1. 정적 콘텐츠 페이지</h3>
<p>
  9개 정적 화면의 공통 구조와 개별 차이점을 정의한다.<br>
  <strong>이 대표화면(인사말) 스펙을 기준으로, 아래 차이점 명세표의 항목만 달리 적용하여 구현한다.</strong><br><br>인사말 외 화면은 프로토타입으로 확인.
</p>

<!-- ── 공통 레이아웃 ──────────────────────────────── -->
<h3>공통 레이아웃</h3>
<table>
  <thead><tr><th>영역</th><th>공통 구성</th></tr></thead>
  <tbody>
    <tr><td>헤더</td><td>C01 공통 헤더</td></tr>
    <tr><td>페이지 타이틀 배너</td><td>페이지명(화면별 상이) + 배경이미지</td></tr>
    <tr><td>브레드크럼</td><td>1depth &gt; 2depth &gt; 현재 페이지</td></tr>
    <tr><td>LNB</td><td>해당 2depth 그룹 + 3depth 목록</td></tr>
    <tr><td>콘텐츠 영역</td><td>화면별 상이 (아래 명세표 참조)</td></tr>
    <tr><td>푸터</td><td>C01 공통 푸터</td></tr>
    <tr><td>JS</td><td><strong style="color: #ff0000;">※ 오시는길(U10)은 카카오맵 API로 고유화면 별도 등록</strong></td></tr>
    <tr><td>권한</td><td>모든 권한 등급 접근 가능 (비회원 포함)</td></tr>
  </tbody>
</table>

<!-- ── 화면별 차이점 명세표 ───────────────────────── -->
<h3>화면별 차이점 명세표</h3>
<table>
  <thead>
    <tr>
      <th>화면명</th>
      <th>LNB 위치 (1depth &gt; 2depth)</th>
      <th>콘텐츠 영역 구성</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>인사말 (U02)</td>
      <td>소개 &gt; 협회 소개</td>
      <td>협회장 사진 + 인사말 텍스트</td>
    </tr>
    <tr>
      <td>미션 &amp; 비전 (U03)</td>
      <td>소개 &gt; 협회 소개</td>
      <td>미션·비전·핵심가치 (아이콘 + 텍스트).</td>
    </tr>
    <tr>
      <td>주요 사업 (U04)</td>
      <td>소개 &gt; 협회 소개</td>
      <td>사업 카드 그리드 (사업명 + 설명).</td>
    </tr>
    <tr>
      <td>회원 규정 (U09)</td>
      <td>소개 &gt; 회원 안내</td>
      <td>규정 전문 텍스트 (스크롤 가능).</td>
    </tr>
    <tr>
      <td>숲해설가 알아보기 (U11)</td>
      <td>교육과정 &gt; 숲해설가란</td>
      <td>직무 소개: 역할·자격요건·활동분야 등 텍스트.</td>
    </tr>
    <tr>
      <td>기초과정 개요 (U13)</td>
      <td>교육과정 &gt; 기초 과정</td>
      <td>과정 소개 텍스트.</td>
    </tr>
    <tr>
      <td>자격취득 과정소개 (U15)</td>
      <td>교육과정 &gt; 자격취득 과정</td>
      <td>과정 소개 텍스트.</td>
    </tr>
    <tr>
      <td>역량강화 과정 (U18)</td>
      <td>교육과정 &gt; 역량강화 과정</td>
      <td>과정 소개 텍스트.</td>
    </tr>
    <tr>
      <td>정회원 가입 안내 (U48)</td>
      <td>소개 &gt; 회원 안내</td>
      <td>정회원 소개 및 가입 절차 안내.</td>
    </tr>
    <tr>
      <td>후원 안내 (U50)</td>
      <td>소개 &gt; 회원 안내</td>
      <td>후원 방법·혜택 안내 텍스트.</td>
    </tr>
  </tbody>
</table>

<!-- ── 공통 주의사항 ──────────────────────────────── -->
<h3>공통 주의사항</h3>
<table>
  <thead><tr><th>#</th><th>항목</th><th>내용</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>오시는길 분리</td><td>U10(오시는길)은 카카오맵 API 연동으로 고유화면 별도 등록. T1에 포함하지 않는다.</td></tr>
  </tbody>
</table>

<!-- ── 연관 화면 ─────────────────────────────────── -->
<h3>연관 화면</h3>
<table>
  <thead><tr><th>관계</th><th>ID</th><th>화면명</th></tr></thead>
  <tbody>
    <tr><td>오시는길 (카카오API 고유화면)</td><td>U10</td><td>오시는 길</td></tr>
  </tbody>
</table>

`;
