/**
 * pages.js — 한국숲해설가협회 스토리보드 화면 목록
 *
 * ▸ 이 파일을 수정해서 화면 메타데이터를 관리한다.
 * ▸ 새 화면 추가 시: PAGES 배열에 항목 추가 (포맷은 기존 항목 참고)
 * ▸ id 규칙
 *     프로젝트 문서   : DOC-##
 *     공통 정의       : C##
 *     템플릿 대표     : T{n}-L / T{n}-D / T{n}-M / T{n}-F …
 *     템플릿 차이표   : T{n}-DIFF
 *     고유 화면       : U## (기존 번호 유지)
 *     관리자          : A##
 *
 * ▸ section 값:  'doc' | 'user' | 'admin'
 *   (sb.js가 이 3개만 렌더링하므로 변경 금지)
 *
 * ─────────────────────────────────────────────────────
 * [목차]
 *   DOC  : 프로젝트 문서 (DOC-01 ~ DOC-06)
 *   0    : 공통 정의 (C01 ~ C03)          ← section:'doc'
 *   T1   : 정적 콘텐츠 페이지             ← section:'user'
 *   T2   : 과정/활동 목록→상세→신청모달  ← section:'user'
 *   T3   : 일반 게시판 목록→상세          ← section:'user'
 *   T4   : 탭 기반 소개+소식              ← section:'user'
 *   T5   : 갤러리                         ← section:'user'
 *   U    : 고유 화면                      ← section:'user'
 *   A    : 관리자 페이지                  ← section:'admin'
 * ─────────────────────────────────────────────────────
 */

window.PAGES = [

  // ══════════════════════════════════════════
  // 프로젝트 문서
  // ══════════════════════════════════════════
  {
    id: 'DOC-01', section: 'doc', group: 'Documents', name: 'Document History',
    path: '#', img: 'doc-history.png', tags: [],
    desc: '문서 버전 이력 및 변경 사항 기록'
  },
  // {
  //   id: 'DOC-02', section: 'doc', group: 'Documents', name: '문서 정의',
  //   path: '#', img: 'doc-definition.png', tags: [],
  //   desc: '본 스토리보드 문서의 목적, 범위, 용어 정의'
  // },
  {
    id: 'DOC-03', section: 'doc', group: 'Documents', name: 'IA',
    path: '#', img: 'ia.png', tags: [],
    desc: '전체 사이트맵 및 정보 구조도'
  },
  // {
  //   id: 'DOC-04', section: 'doc', group: 'Documents', name: '사용자 Flow Chart',
  //   path: 'flowchart.html', img: 'flowchart.png', tags: [],
  //   desc: '사용자 주요 태스크별 화면 흐름도'
  // },
  {
    id: 'DOC-06', section: 'doc', group: 'Documents', name: '공통 레이아웃_관리자',
    path: '#', img: 'DOC06_관리자_공통레이아웃.png', tags: [],
    desc: 'Header, Footer, GNB 등 관리자 공통 레이아웃 구성 및 규칙'
  },


  // ══════════════════════════════════════════
  // 0. 공통 정의
  //    section:'doc' 유지 (sb.js 렌더링 규칙 준수)
  //    모든 화면에 공통 적용되는 규칙·권한·컴포넌트 정의
  // ══════════════════════════════════════════
  {
    id: 'C01', section: 'doc', group: '0. 사용자 공통 정의', name: '공통 컴포넌트 + NAV 매핑',
    path: '#', img: 'DOC05_사용자_공통레이아웃.png', tags: [],
    desc: '공통 컴포넌트(헤더·푸터·LNB·브레드크럼·토스트·페이지타이틀배너) 정의.<br>NAV_DATA(header.js) 1depth → 2depth → 3depth 구조와 SB 화면 ID 매핑표 포함.'
  },
  {
    id: 'C02', section: 'doc', group: '0. 공통 정의', name: '권한 정책표',
    path: '#', img: 'C02_권한정책표.png', tags: [],
    desc: '4단계 권한(비회원·일반회원·정회원·관리자)별 기능 접근 매트릭스.<br>T1~T5 및 고유 화면 전체에 적용.'
  },
  {
    id: 'C03', section: 'doc', group: '0. 공통 정의', name: '상태별 처리',
    path: '#', img: 'C03_상태별처리.png', tags: [],
    desc: '비로그인 접근·권한 부족·빈 상태·에러 상태·로딩 상태별 공통 처리 정책.'
  },


  // ══════════════════════════════════════════
  // T1. 정적 콘텐츠 페이지
  //
  // 공유 화면 (T1-DIFF 명세표에서 차이 관리):
  //   미션/비전(U03) · 주요사업(U04) · 회원규정(U09) ·
  //   숲해설가알아보기(U11) · 기초과정 개요(U13) · 자격취득 과정소개(U15) ·
  //   역량강화 과정(U18) · 정회원 가입안내(U48) · 후원 안내(U50)
  //
  // ※ 오시는길(U10)은 카카오지도 API 연동으로 고유화면 별도 등록
  //
  // 공통 레이아웃:
  //   헤더 > 페이지타이틀배너 > LNB > 콘텐츠영역(화면별 상이) > 푸터
  //   JS 없음 (정적 하드코딩, desc는 pages.js 항목 설명으로 대체)
  // ══════════════════════════════════════════
  {
    id: 'T1-01', section: 'user', group: 'T1. 정적 콘텐츠 페이지', name: '대표화면: 인사말 + T1 차이점 명세',
    path: '../outputs/about/index.html', img: 'U02_소개_인사말.png', tags: ['static'],
    desc: '소개 > 협회 소개 > 인사말.<br>① 협회장 사진 + 인사말 텍스트 (board_type=greeting 연동)<br>▶ 스펙 패널에 T1 공유 화면 9개(미션비전·주요사업·회원규정·숲해설가알아보기·기초과정개요·자격취득소개·역량강화·정회원안내·후원안내) 차이점 명세표 포함.'
  },


  // ══════════════════════════════════════════
  // T2. 과정/활동 목록 → 상세 → 신청모달
  //
  // 공유 화면 (T2-DIFF 명세표에서 차이 관리):
  //   기초과정 신청(구U14) · 역량강화 목록·신청(구U18·19) ·
  //   특강 목록·상세(구U22·23) · 아카데미강좌 목록·상세(구U24·25) ·
  //   멘토링숲학교 목록·상세(구U26·27) · 강사신청 목록·상세(구U32·33)
  //
  // 공통 레이아웃:
  //   목록: 헤더 > 타이틀배너 > LNB > 필터바 > 카드그리드 > 페이지네이션 > 푸터
  //   상세: 헤더 > 타이틀배너 > LNB > 상세정보 > [신청하기] > 목록버튼 > 푸터
  //   신청모달: 상세 페이지 위 레이어 오버레이
  // ══════════════════════════════════════════
  {
    id: 'T2-L', section: 'user', group: 'T2. 과정/활동 목록→상세→신청', name: '대표화면: 목록 [풀 스펙 + T2 차이점 명세]',
    path: '../outputs/education/course-list.html', img: 'U14_교육_기초과정_목록.png', tags: ['list'],
    desc: '기초과정 목록 기준.<br>① 필터바: 모집상태·기간·검색어<br>② 강좌 목록 테이블: NO·강좌명·일자·접수 기간·접수상태 배지<br>③ 페이지네이션 10건'
  },
  {
    id: 'T2-D', section: 'user', group: 'T2. 과정/활동 목록→상세→신청', name: '대표화면: 상세 [풀 스펙]',
    path: '../outputs/education/course-detail.html', img: 'U141_교육_기초과정_상세.png', tags: ['detail', 'auth'],
    desc: '과정 상세.<br>① 강좌명 + [접수상태 배지]<br>② 첨부파일 영역: 관리자가 파일 등록 시 상세 내용 상단에 노출 및 다운로드 제공, 미등록 시 영역 미노출<br>③ 에디터로 등록한 상세 내용 렌더링 (이미지·링크 포함)<br>④ 이전글/다음글 네비게이터<br>⑤ 버튼 영역: 좌측 [목록] → 목록으로 이동 / 우측 접수상태별 버튼 (접수중: 활성화 → 클릭 시 신청 모달 / 준비중·마감: 비활성화)'
  },
  {
    id: 'T2-M', section: 'user', group: 'T2. 과정/활동 목록→상세→신청', name: '대표화면: 신청모달 [풀 스펙]',
    path: '../outputs/education/course-detail.html', img: 'U142_교육_기초과정_신청모달.png', tags: ['modal', 'form', 'auth'],
    desc: '강좌별 [접수하기] 클릭 시 레이어 오버레이로 표시. 3단계 위저드 구조.<br><br><strong>▶ 1단계 (안내·동의):</strong><br>신청 안내문 노출 + 안내사항 확인 + [신청 동의] 체크박스(필수) → [동의하고 다음] (미체크 시 alert)<br><br><strong>▶ 2단계 (신청 작성):</strong><br>신청 강좌 정보 노출 / 이름·연락처·이메일 (필수, 로그인 시 회원정보 자동 불러오기) / 거주지역 드롭다운 (선택) / 신청서류 첨부 (관리자가 강좌 등록 시 파일첨부 활성화한 경우 필수) / 특이사항 (선택) → 필수 항목 충족 시 [신청 완료] 활성화, [이전] 클릭 시 1단계로 복귀<br><br><strong>▶ 2단계 마감 처리:</strong><br>[신청 완료] 클릭 시점에 서버에서 접수 상태 재검증. 모달 진입 이후 마감된 경우 "해당 강좌는 마감되었습니다." 경고창 노출 후 신청 처리 불가. 모달 닫힘 및 상세 페이지 접수 상태 갱신.<br><br><strong>▶ 3단계 (완료):</strong><br>신청 정보 요약 노출 + [완료] 클릭 시 모달 닫힘. 신청 내역은 마이페이지 > 신청내역에서 확인 가능.'
  },


  // ══════════════════════════════════════════
  // T3. 일반 게시판 목록 → 상세
  //
  // 공유 화면 (T3-DIFF 명세표에서 차이 관리):
  //   자료실(구U46·47) · 숲일터(구U34·35) · 언론보도(구U41·42) ·
  //   협회지(구U39·40) · 갤러리상세(구U44) — 갤러리목록은 T5에서 별도 정의
  //
  // 공통 레이아웃:
  //   목록: 헤더 > 타이틀배너 > LNB > [글쓰기] > 테이블 > 검색 > 페이지네이션 > 푸터
  //   상세: 헤더 > 타이틀배너 > LNB > 제목·메타 > 본문 > 첨부파일 > 이전/다음글 > 하단버튼 > 푸터
  // ══════════════════════════════════════════
  {
    id: 'T3-L', section: 'user', group: 'T3. 일반 게시판', name: '대표화면: 목록 [풀 스펙 + T3 차이점 명세]',
    path: '../outputs/community/notice-list.html', img: 'U36_커뮤니티_공지사항_목록.png', tags: ['list'],
    desc: '공지사항 목록 기준 (관리자 등록·수정·삭제).<br>① 건수 표기 (Total N건) + 우측 검색어 입력 및 검색 버튼<br>② 테이블: 번호·제목·작성자·작성일 / 관리자가 상단 고정 설정 시 최상단 노출 및 [공지] 배지 표시 / 행 클릭 → 상세 이동<br>③ 페이지네이션 10건'
  },
  {
    id: 'T3-D', section: 'user', group: 'T3. 일반 게시판', name: '대표화면: 상세 [풀 스펙]',
    path: '../outputs/community/notice-detail.html', img: 'U37_커뮤니티_공지사항_상세.png', tags: ['detail'],
    desc: '공지사항 상세 기준.<br>① 제목·작성자명·등록일<br>② 첨부파일 영역: 파일 있으면 노출 및 다운로드 제공, 없으면 영역 미노출 / 에디터로 작성한 내용 렌더링<br>③ 상세내용(에디터 등록내용)<br>④ 이전글/다음글 네비게이터 (클릭 → 해당 글 상세 이동)<br>⑤ 하단 [목록] 버튼<br>※ T4 사공단 및 동아리 소식·일지 상세, T5 갤러리 상세도 이 스펙 공유. T4·T5는 작성자에 한해 [수정][삭제], 관리자는 전체 글 [삭제] 추가 노출.'
  },


  // ══════════════════════════════════════════
  // T4. 탭 기반 소개 + 소식 페이지 (등록/수정 포함)
  //
  // 공유 화면 (T4-DIFF 명세표에서 차이 관리):
  //   숲동아리단 소개·소식 (일지 탭 없음, 동아리별 개별 URL)
  //
  // 공통 레이아웃:
  //   헤더 > 타이틀배너 > LNB > 탭바([소개][소식][일지]) > 탭별 콘텐츠 > 푸터
  //   소식탭 상세: T3-D 스펙 참조
  //
  // 권한: 정회원 이상만 접근·열람·등록 가능
  // ══════════════════════════════════════════
  {
    id: 'T4-TAB1', section: 'user', group: 'T4. 탭 기반 소개+소식', name: '대표화면: 소개탭 [풀 스펙 + T4 차이점 명세]',
    path: '../outputs/member/sagongdan.html', img: 'U28_회원_사공단_소개.png', tags: ['membership-only'],
    desc: '사공단 소개탭 기준.<br>① 탭바: [소개][소식][일지]<br>② 소개 텍스트 + 관리자가 등록한 단체 이미지·제목 (갤러리형, 페이지네이션 없이 전체 노출)<br>※ 비회원·일반회원: 페이지 접근 차단'
  },
  {
    id: 'T4-TAB2', section: 'user', group: 'T4. 탭 기반 소개+소식', name: '대표화면: 소식목록탭 [풀 스펙]',
    path: '../outputs/member/sagongdan-news.html', img: 'U29_회원_사공단_소식목록.png', tags: ['membership-only', 'list'],
    desc: '사공단 소식·일지탭 기준 (사용자 등록 게시판, 정회원 이상).<br>① 검색 필터: 소개탭에 등록된 제목 목록 드롭다운 + 키워드 검색 (제목)<br>② 목록: 건수 표기 (Total N건) / 테이블 (번호·팀·제목·작성자·작성일) / 행 클릭 → 상세 이동<br>③ [소식 등록] 버튼 클릭 → 등록 페이지 이동<br>※ 상세: T3-D 스펙 + 작성자에 한해 [수정][삭제] / 관리자는 전체 글 [삭제] 추가 노출'
  },
  {
    id: 'T4-FORM', section: 'user', group: 'T4. 탭 기반 소개+소식', name: '대표화면: 소식 등록/수정 [풀 스펙]',
    path: '#', img: 'T4-FORM_소식등록수정.png', tags: ['membership-only', 'form'],
    desc: '사공단·동아리 소식/일지 등록·수정 (정회원 이상).<br>① 팀 또는 동아리 드롭다운 (<strong>소개탭 등록글 제목 목록 동적 연동</strong>, 필수)<br>② 제목 (필수)<br>③ 내용 에디터 (필수)<br>④ 파일 첨부 (최대 3개, 선택)<br>⑤ [취소] → 작성 취소 / [등록하기] → 등록 완료<br>※ 수정으로 진입한 경우 기존 데이터 자동 불러오기 및 수정 가능'
  },


  // ══════════════════════════════════════════
  // T5. 갤러리 (썸네일형 목록 + 등록)
  //    갤러리 상세 → T3-D 스펙 참조 (중복 작성 없음)
  // ══════════════════════════════════════════
  {
    id: 'T5-L', section: 'user', group: 'T5. 갤러리', name: '대표화면: 갤러리 목록 [풀 스펙]',
    path: '../outputs/community/gallery.html', img: 'U43_커뮤니티_갤러리_목록.png', tags: ['list'],
    desc: '커뮤니티 > 갤러리 (사용자 등록, 일반회원 이상).<br>① 건수 표기 (Total N건) + [글쓰기] 버튼 (일반회원 이상 로그인 시 표시) + 검색바<br>② 썸네일 4열 그리드: 에디터 첫 번째 이미지를 썸네일로 사용, 이미지 없을 시 기본 이미지로 대체 / 제목·작성자·등록일 표시<br>③ 일반회원 이상인 경우 [글쓰기] 버튼 제공 → 클릭 시 이동<br>* 한페이지 12건씩 페이지네이션<br><br>갤러리 상세 → T3-D 스펙 (작성자에 한해 [수정][삭제] 추가)'
  },
  {
    id: 'T5-FORM', section: 'user', group: 'T5. 갤러리', name: '대표화면: 갤러리 등록 [풀 스펙]',
    path: '../outputs/community/gallery-write.html', img: 'U45_커뮤니티_갤러리_글쓰기.png', tags: ['member-only', 'form'],
    desc: '갤러리 등록·수정.<br>① 제목 (필수)<br>② 내용 (에디터, 필수 / 첫 번째 이미지가 썸네일로 자동 지정되며 안내 문구 표시)<br>③ [취소] / [등록하기] → 등록 완료 시 상세 화면(T3-D)으로 이동<br>※ 수정으로 진입한 경우 기존 데이터 자동 불러오기 및 수정 가능'
  },


  // ══════════════════════════════════════════
  // 6. 고유 화면 (각각 풀 스펙 SB 작성)
  //    위 T1~T5 템플릿에 해당하지 않는 화면
  // ══════════════════════════════════════════

  // ── 6-1. 홈 메인 ──────────────────────────
  {
    id: 'U01', section: 'user', group: '고유 | 메인', name: '홈 메인',
    path: '../outputs/index.html', img: 'U01_홈_메인.png', tags: [],
    desc: '사이트 진입점.<br>① 메인 슬라이더 배너<br>② 최근 교육일정 미리보기<br>③ 공지사항 미리보기<br>④ 협회 캘린더 미니뷰<br>⑤ 갤러리 썸네일 섹션<br>배너 데이터: 관리자 배너관리(A26·A27) 연동'
  },

  // ── 6-2. 소개 고유 화면 ────────────────────
  {
    id: 'U10', section: 'user', group: '고유 | 소개', name: '오시는 길',
    path: '../outputs/about/contact.html', img: 'U10_소개_오시는길.png', tags: ['static'],
    desc: '소개 > 오시는 길.<br>① 카카오지도 API 연동 (백엔드 처리 필요)<br>② 협회 주소 및 지도 표시<br>③ 대중교통·자가용 안내 텍스트<br>LNB: 소개 > 오시는길 활성'
  },
  {
    id: 'U05', section: 'user', group: '고유 | 소개', name: '연혁',
    path: '../outputs/about/history.html', img: 'U05_소개_연혁.png', tags: [],
    desc: '타임라인형 연혁.<br>① 연도별 이미지 + 내용 표시<br>관리자 연혁관리(A24·A25) CRUD 연동'
  },
  {
    id: 'U06', section: 'user', group: '고유 | 소개', name: '조직도/임원진',
    path: '../outputs/about/members.html', img: 'U06_소개_조직도임원진.png', tags: [],
    desc: '조직도 이미지 + 임원진 카드 그리드 (2열).<br>① 임원진 카드 hover 시 인물 상세 노출<br>관리자 조직도 관리(A23) 연동'
  },
  {
    id: 'U07', section: 'user', group: '고유 | 소개', name: '전국 지역협회 (지도/목록)',
    path: '../outputs/about/regions.html', img: 'U07_소개_전국지역협회.png', tags: [],
    desc: '지역 협회 목록.<br>① 지역 필터 탭<br>② 협회 카드 목록 / 카드 클릭 → 지역협회 상세(U08)로 이동'
  },
  {
    id: 'U08', section: 'user', group: '고유 | 소개', name: '전국 지역협회 상세',
    path: '../outputs/about/region-detail.html', img: 'U08_소개_지역협회_상세.png', tags: ['detail'],
    desc: '특정 지역협회 상세 (URL ?id= 로 협회 조회).<br>① 연락처·활동 소개 표시'
  },
  {
    id: 'U49', section: 'user', group: '고유 | 소개', name: '정회원 가입 신청 폼',
    path: '../outputs/participate/regular-apply.html', img: 'U49_참여_정회원_신청.png', tags: ['form'],
    desc: '정회원 신청 폼.<br>① 신청 안내 텍스트<br>② 개인정보: 이름·생년월일·주소·전화번호·이메일 (로그인 시 회원정보 자동 불러오기)<br>③ 월 회비 자동이체 계좌 정보: 은행명·예금주·계좌번호<br>④ 활동 정보: 현재 활동여부 (활동 중·활동 예정·미활동), 소속기관 (선택 입력)<br>⑤ 가입 정보: 가입경로 (홈페이지·지인 추천·교육 과정·기타), 가입 동기 (선택 입력)<br>⑥ 개인정보 약관 동의 (체크 필수)<br>⑦ [취소] / [신청하기] 버튼<br><br>신청 데이터 → 관리자 정회원신청(A11·A12) 연동'
  },
  {
    id: 'U51', section: 'user', group: '고유 | 소개', name: '후원 신청 폼',
    path: '../outputs/participate/donate.html', img: 'U51_참여_후원하기.png', tags: ['form'],
    desc: '후원 신청 폼.<br>① 신청 안내 텍스트<br>② 후원 유형 선택: 정기·일시<br>③ 후원 금액 선택 또는 직접 입력<br>④ 매월 자동이체 계좌 정보: 은행명·예금주·계좌번호<br>⑤ 후원 목적: 교육프로그램 지원·사회공헌사업단 지원·교육자료 개발 지원·자유 사용(지정 없음)<br>⑥ 신청자 정보: 이름·연락처·이메일 (로그인 시 회원정보 자동 불러오기)<br>⑦ [취소] / [후원 신청하기] 버튼<br>⑧ 개인정보 약관동의(필수 체크)<br><br>신청 데이터 → 관리자 후원신청(A15·A16) 연동'
  },

  // ── 6-3. 교육 고유 화면 ────────────────────
  {
    id: 'U12', section: 'user', group: '고유 | 교육', name: 'FAQ (자주 묻는 질문)',
    path: '../outputs/education/faq.html', img: 'U12_교육_FAQ.png', tags: ['static'],
    desc: '자주 묻는 질문.<br>① 아코디언형 Q&A 구성<br>콘텐츠 하드코딩'
  },
  {
    id: 'U20', section: 'user', group: '고유 | 교육', name: '수료생 후기 목록',
    path: '../outputs/education/reviews.html', img: 'U20_교육_수료생_후기목록.png', tags: ['list'],
    desc: '교육과정 > 자격취득 과정 > 수료생 후기.<br>① 검색 필터: 자격취득 과정으로 등록된 제목 드롭다운 + 검색어 (제목 또는 내용)<br>② 목록: 건수 표기 (목록 N건) / 3열 3행 카드 + 페이지네이션 / 에디터 첫 번째 이미지를 썸네일로 사용, 없을 시 기본 이미지 대체 / 과정명 배지·제목·내용 3줄 후 말줄임 처리·작성자·등록일 / 카드 클릭 → 상세 이동<br>③ 상세: T3-D 스펙 + 작성자에 한해 [수정][삭제]<br>▶ 등록 경로: 마이페이지 > 신청내역에서 수료 완료된 자격취득 과정에 한해 [후기 등록] 버튼 활성화 → 클릭 시 진입'
  },
  {
    id: 'U21', section: 'user', group: '고유 | 교육', name: '수료생 후기 상세',
    path: '../outputs/education/review-detail.html', img: 'U21_교육_수료생_후기상세.png', tags: ['detail'],
    desc: '후기 상세 (URL ?id= 로 조회).<br>① 이전글/다음글 이동 링크 포함'
  },

  // ── 6-4. 커뮤니티 고유 화면 ───────────────
  {
    id: 'U38', section: 'user', group: '고유 | 커뮤니티', name: '협회 캘린더',
    path: '../outputs/community/calendar.html', img: 'U38_커뮤니티_협회캘린더.png', tags: [],
    desc: '월별 일정 달력 (관리자 일정관리(A17~A19) 연동).<br>① 일정 노출: 기본값 오늘 일정 / 특정 날짜 클릭 시 해당일 일정 노출<br>② 관리자가 일정에 URL 입력 시 일정 클릭 → 해당 URL로 이동 (목록·캘린더 동일 적용)<br>③ 캘린더 UI: 월간 달력 + 월 이동 버튼'
  },

  // ── 6-5. 참여 고유 화면 ────────────────────
  {
    id: 'U52', section: 'user', group: '고유 | 참여', name: '숲해설 신청',
    path: '../outputs/forest/index.html', img: 'U52_참여_숲해설신청.png', tags: ['form'],
    desc: '숲해설 프로그램 안내 및 신청 폼.<br>① 안내 문구 및 CTA 버튼 (하단 신청 폼으로 이동)<br>② 신청 안내 텍스트<br>③ 신청 폼:<br>- 개인정보 수집 동의 (체크 필수)<br>- 신청자 정보: 기관명·담당자명·연락처·이메일<br>- 프로그램 정보: 희망 프로그램 (숲해설·체험형 프로그램·진로체험·산림치유·기타) / 대상 (유아·초등학생·청소년·성인·기타) / 예상 인원 (직접 입력) / 희망 날짜 / 희망 시간대 (오전·오후·협의 가능) / 진행 장소 (학교·공원·숲·자연휴양림·기관 내·기타) / 프로그램 목적 (교육·체험·힐링·진로탐색·기타)<br>- 추가 요청사항·<br>④ [신청하기] 버튼<br><br>신청 데이터 → 관리자 숲해설신청(A13·A14) 연동'
  },

  // ── 6-6. 인증 ──────────────────────────────
  {
    id: 'U53', section: 'user', group: '고유 | 인증', name: '로그인',
    path: '../outputs/auth/login.html', img: 'U53_인증_로그인.png', tags: ['auth', 'form'],
    desc: '아이디/비밀번호 로그인.<br>① 아이디 저장 체크박스<br>② [아이디/비밀번호 찾기] → U54 이동<br>③ [회원가입] → U55 이동.'
  },
  {
    id: 'U54', section: 'user', group: '고유 | 인증', name: '아이디/비밀번호 찾기',
    path: '../outputs/auth/find.html', img: 'U54_인증_아이디찾기.png', tags: ['auth', 'form'],
    desc: '탭 전환: [아이디 찾기] / [비밀번호 찾기].<br>① 아이디 찾기: 이름 + 이메일 인증 방식 / 인증 성공 시 해당 이메일로 아이디 발송<br>② 비밀번호 찾기: 이름 + 아이디 + 이메일 인증 방식 / 이메일 인증번호 검증 시 새 비밀번호 설정 폼 노출 → 비밀번호 재설정 완료'
  },
  {
    id: 'U55', section: 'user', group: '고유 | 인증', name: '회원가입',
    path: '../outputs/auth/register.html', img: 'U55_인증_회원가입.png', tags: ['auth', 'form'],
    desc: '회원가입 폼.<br>① 약관 동의 (필수 항목 체크 시 [다음] 버튼 활성화)<br>② 본인 인증: 휴대폰 인증 (인증 완료 후 인증 정보 노출 및 [다음] 버튼 활성화)<br>③ 회원정보 입력 (아이디 (중복 확인 필수) · 비밀번호 (8~20자, 영문+숫자+특수문자 조합) · 비밀번호 확인 · 본인인증 정보 (이름·생년월일·성별·전화번호 자동 불러오기, 수정 불가) · 이메일 · 주소 (해외 거주 선택 가능) · 직업 (드롭다운 선택) · 가입 경로 (드롭다운 선택))<br>④ 가입 완료 → 가입 완료 및 정회원 안내 텍스트 노출, [로그인] 및 [교육 신청하기] 버튼 제공'
  },

  // ── 6-7. 마이페이지 ────────────────────────
  {
    id: 'U56-1', section: 'user', group: '고유 | 마이페이지', name: '회원정보 수정',
    path: '../outputs/mypage/index.html', img: 'U56_마이페이지_홈.png', tags: ['auth', 'member-only'],
    desc: '마이페이지 기본탭 - 회원정보 수정.<br>① 이름·이메일·전화번호·주소 등 정보 수정 가능 (본인인증 정보는 연락처의 [본인 인증] 버튼을 통해 재인증 후 수정 가능)<br>② 협회정보(소속지역협회·소속동아리(여러개 노출가능))<br>③ [비밀번호 변경] → 비밀번호 변경 모달(U56-PW) 노출<br>④ [탈퇴하기] → 탈퇴 모달(U56-WD) 노출<br>⑤ [저장] → 회원정보 수정 완료 시 페이지 새로고침하여 변경된 정보 반영<br>⑥ 이름 + 가입일 및 회원등급 노출'
  },
  {
    id: 'U56-2', section: 'user', group: '고유 | 마이페이지', name: '신청내역',
    path: '../outputs/mypage/index.html', img: 'U56_마이페이지_신청내역.png', tags: ['auth', 'member-only'],
    desc: '마이페이지 신청내역탭.<br>① 교육과정 + 강사활동 신청 통합 목록<br>② 신청 상태: 신청·수강중·취소·미선정·완료<br>③ 관리자가 수료증 발급 대상으로 등록한 건에 한해 수료 완료 시 [수료증] 또는 [활동확인서] 버튼 제공 → 클릭 시 증명서 발급 및 PDF 다운로드<br>④ 자격취득 과정 수료 완료에 한해 [후기 작성] 버튼 제공 → 클릭 시 후기 작성 화면으로 이동'
  },
  {
    id: 'U56-PW', section: 'user', group: '고유 | 마이페이지', name: '비밀번호 변경 모달',
    path: '../outputs/mypage/index.html', img: 'U56-PW_비밀번호변경모달.png', tags: ['auth', 'modal', 'form'],
    desc: '회원정보 수정탭 [비밀번호 변경] 클릭 시 노출.<br>① 현재 비밀번호<br>② 새 비밀번호<br>③ 새 비밀번호 확인<br>[취소] / [변경하기]'
  },
  {
    id: 'U56-WD', section: 'user', group: '고유 | 마이페이지', name: '탈퇴하기 모달',
    path: '../outputs/mypage/index.html', img: 'U56-WD_탈퇴하기모달.png', tags: ['auth', 'modal'],
    desc: '회원정보 수정탭 [탈퇴하기] 클릭 시 노출.<br>① 탈퇴 안내 문구<br>② 탈퇴 사유 입력 (필수)<br>③ 내용 확인 체크박스 (필수)<br>[취소] / [탈퇴하기] → 탈퇴 완료 시 로그아웃 처리 후 홈으로 이동'
  },
  {
    id: 'U57', section: 'user', group: '고유 | 마이페이지', name: '증명서 미리보기',
    path: '../outputs/mypage/certificate-preview.html', img: 'U57_마이페이지_증명서미리보기.png', tags: ['auth'],
    desc: '수료증 또는 활동확인서 미리보기.<br>① 종류에 따라 수료증 번호·성명·과정명·교육기간 (기간·총강좌수·총교육시간)·수료일자·발급일 (교육 종료일) 변수 처리<br>② [닫기] / [PDF 저장/인쇄] 버튼 제공'
  },
  {
    id: 'U62', section: 'user', group: '고유 | 마이페이지', name: '후기 작성/수정',
    path: '#', img: 'U62_마이페이지_후기작성수정.png', tags: ['auth', 'form'],
    desc: '마이페이지 > 신청내역(U56-2)에서 자격취득 과정 수료 완료 상태에 한해 [후기 작성] 버튼 활성화 → 클릭 시 진입.<br>① 수료 과정명 자동 불러오기 (수정 불가)<br>② 제목 (필수)<br>③ 내용 에디터 (필수)<br>④ 파일 첨부 (최대 3개, 선택)<br>⑤ [취소] / [등록하기] → 등록 완료 시 교육과정 > 자격취득 과정 > 수료생 후기(U20)에서 확인 가능<br>※ 수정으로 진입한 경우 기존 데이터 자동 불러오기 및 수정 가능'
  },

  // ── 6-8. 기타 ──────────────────────────────
  {
    id: 'U58', section: 'user', group: '고유 | 기타', name: '사이트맵',
    path: '../outputs/sitemap.html', img: 'U58_사이트맵.png', tags: ['static'],
    desc: '정적 페이지.<br>① 전체 메뉴 구조 목록 표시<br>② 우측 최상단 사이트맵 아이콘 클릭 시 진입<br>③ 각 메뉴 클릭 → 해당 페이지로 이동'
  },
  {
    id: 'U59', section: 'user', group: '고유 | 기타', name: '이용약관',
    path: '../outputs/terms.html', img: 'U59_이용약관.png', tags: ['static'],
    desc: '정적 페이지.<br>① 서비스 이용약관 전문 표시<br>② 푸터 링크 클릭 시 진입<br>U60·U61과 동일 레이아웃'
  },
  {
    id: 'U60', section: 'user', group: '고유 | 기타', name: '개인정보 처리방침',
    path: '../outputs/privacy.html', img: 'U60_개인정보처리방침.png', tags: ['static'],
    desc: '정적 페이지.<br>① 개인정보처리방침 전문 표시<br>U59와 동일 레이아웃'
  },
  {
    id: 'U61', section: 'user', group: '고유 | 기타', name: '이메일 무단수집 거부',
    path: '../outputs/email.html', img: 'U61_이메일무단수집거부.png', tags: ['static'],
    desc: '정적 페이지.<br>① 이메일 무단수집거부 고지 내용 표시<br>U59와 동일 레이아웃'
  },


  // ══════════════════════════════════════════
  // 관리자 페이지 (A01~A29 — 변경 없음)
  // ══════════════════════════════════════════

  // ── 회원관리 ──────────────────────────────
  {
    id: 'A01', section: 'admin', group: '회원관리', name: '회원 목록', path: '../outputs/admin/members.html', img: 'A01_회원_목록.png',
    tags: ['admin-only', 'list'], desc: '전체 회원 목록. 필터: 가입일/등급/상태/검색어. 엑셀 다운로드. No 역순 정렬. 회원 클릭 → 회원상세(A02). API: GET /admin/api/members'
  },
  {
    id: 'A02', section: 'admin', group: '회원관리', name: '회원 상세', path: '../outputs/admin/member-detail.html', img: 'A02_회원_상세.png',
    tags: ['admin-only', 'detail'], desc: '회원 상세 정보 열람. 상태 변경(정상/차단) 버튼. 신청 이력 요약. 수정 → A03. API: GET /admin/api/members/{id}'
  },
  {
    id: 'A02-1', section: 'admin', group: '회원관리', name: '회원 상세—탈퇴 처리', path: '../outputs/admin/member-detail.html', img: 'A02_회원_상세_탈퇴.png',
    tags: ['admin-only', 'modal'], desc: 'A02에서 [탈퇴 처리] 클릭 시 노출되는 확인 모달. 탈퇴 사유 직접 입력(필수). [탈퇴 처리] 확인 → 처리 완료 후 회원 목록(A01) 이동.'
  },
  {
    id: 'A03', section: 'admin', group: '회원관리', name: '회원 등록/수정', path: '../outputs/admin/member-edit.html', img: 'A03_회원_등록수정.png',
    tags: ['admin-only', 'form'], desc: '회원 정보 등록·수정 폼. URL ?id= 없으면 등록, 있으면 수정. 우편번호 검색(카카오 API). API: POST/PUT /admin/api/members'
  },
  {
    id: 'A04', section: 'admin', group: '회원관리', name: '탈퇴회원 목록', path: '../outputs/admin/members-withdrawn.html', img: 'A04_탈퇴회원_목록.png',
    tags: ['admin-only', 'list'], desc: '탈퇴 처리된 회원 목록. 탈퇴일 기준 필터. 복구 기능 필요 여부 협의. API: GET /admin/api/members/withdrawn'
  },

  // ── 강좌관리 ──────────────────────────────
  {
    id: 'A05', section: 'admin', group: '강좌관리', name: '강좌 목록', path: '../outputs/admin/courses.html', img: 'A05_강좌_목록.png',
    tags: ['admin-only', 'list'], desc: '강좌 목록 탭(기초/자격/역량/아카데미). 필터: 기간/모집상태/검색. 강좌 등록/수정/삭제. API: GET /admin/api/courses'
  },
  {
    id: 'A06', section: 'admin', group: '강좌관리', name: '강좌 상세', path: '../outputs/admin/course-detail.html', img: 'A06_강좌_상세.png',
    tags: ['admin-only', 'detail'], desc: '강좌 상세 정보. 신청자 현황 요약. 수정 → A07. API: GET /admin/api/courses/{id}'
  },
  {
    id: 'A07', section: 'admin', group: '강좌관리', name: '강좌 등록/수정', path: '../outputs/admin/course-edit.html', img: 'A07_강좌_등록수정.png',
    tags: ['admin-only', 'form'], desc: '강좌 등록·수정 폼. 에디터 에디터, 파일첨부(3슬롯), 썸네일 이미지. multipart/form-data. API: POST/PUT /admin/api/courses'
  },
  {
    id: 'A08', section: 'admin', group: '강좌관리', name: '강좌 신청자 목록', path: '../outputs/admin/applicants.html', img: 'A08_강좌신청자_목록.png',
    tags: ['admin-only', 'list'], desc: '강좌별 신청자 통합 목록. 필터: 날짜/강좌유형/신청상태/검색. 상태 일괄 변경. 수료증 발급 처리. 엑셀. API: GET /admin/api/applicants'
  },
  {
    id: 'A09', section: 'admin', group: '강좌관리', name: '강좌 신청 등록', path: '../outputs/admin/apply-register.html', img: 'A09_강좌신청_등록.png',
    tags: ['admin-only', 'form'], desc: '관리자가 회원 검색 후 강좌를 선택하여 수동으로 강좌 신청을 등록하는 화면. 회원 검색(이름/아이디/휴대폰), 과정유형→강좌명→일정 순 연계 선택, 신청 상태 지정, 관리자 메모 입력. API: POST /admin/api/applicants'
  },
  {
    id: 'A10', section: 'admin', group: '강좌관리', name: '강좌 신청자 상세', path: '../outputs/admin/applicant-detail.html', img: 'A10_강좌신청자_상세.png',
    tags: ['admin-only', 'detail'], desc: '신청자 상세. 상태 변경(선정/미선정/완료). 수료증 발급 버튼. API: PUT /admin/api/applicants/{id}/status'
  },

  // ── 기타 신청관리 ─────────────────────────
  {
    id: 'A11', section: 'admin', group: '기타 신청관리', name: '정회원신청 목록', path: '../outputs/admin/apply-regular.html', img: 'A11_정회원신청_목록.png',
    tags: ['admin-only', 'list'], desc: '정회원 신청 목록. 필터: 날짜/상태/지역/검색. 상태: 검토중→승인/반려. 접수번호 APP-YYYY-XXXXX 형식. API: GET /admin/api/apply/regular'
  },
  {
    id: 'A12', section: 'admin', group: '기타 신청관리', name: '정회원신청 상세', path: '../outputs/admin/apply-regular-detail.html', img: 'A12_정회원신청_상세.png',
    tags: ['admin-only', 'detail'], desc: '정회원 신청 상세. 첨부파일 다운로드. 상태 변경 + 메모 저장. 승인 시 회원 자동 생성 여부 협의 필요.'
  },
  {
    id: 'A13', section: 'admin', group: '기타 신청관리', name: '숲해설신청 목록', path: '../outputs/admin/apply-forest.html', img: 'A13_숲해설신청_목록.png',
    tags: ['admin-only', 'list'], desc: '숲해설 프로그램 신청 목록. 기관/단체 신청. 상태: 접수/완료/취소. API: GET /admin/api/apply/forest'
  },
  {
    id: 'A14', section: 'admin', group: '기타 신청관리', name: '숲해설신청 상세', path: '../outputs/admin/apply-forest-detail.html', img: 'A14_숲해설신청_상세.png',
    tags: ['admin-only', 'detail'], desc: '숲해설 신청 상세. 신청 기관 정보, 희망 일시, 참가 인원. 첨부파일 다운로드.'
  },
  {
    id: 'A15', section: 'admin', group: '기타 신청관리', name: '후원신청 목록', path: '../outputs/admin/apply-sponsor.html', img: 'A15_후원신청_목록.png',
    tags: ['admin-only', 'list'], desc: '후원 신청 목록. 후원 유형·금액 정보. API: GET /admin/api/apply/sponsor'
  },
  {
    id: 'A16', section: 'admin', group: '기타 신청관리', name: '후원신청 상세', path: '../outputs/admin/apply-sponsor-detail.html', img: 'A16_후원신청_상세.png',
    tags: ['admin-only', 'detail'], desc: '후원 신청 상세. 후원자 정보, 금액, 납부 방법. 영수증 발급 처리 필요 여부 협의.'
  },

  // ── 일정관리 ──────────────────────────────
  {
    id: 'A17', section: 'admin', group: '일정관리', name: '일정 목록', path: '../outputs/admin/calendar.html', img: 'A17_일정_목록.png',
    tags: ['admin-only', 'list'], desc: '협회 일정 목록. 필터: 연월/카테고리(edu/event/notice)/검색. 사용자 캘린더(U38) 연동. API: GET /admin/api/calendar'
  },
  {
    id: 'A18', section: 'admin', group: '일정관리', name: '일정 상세', path: '../outputs/admin/calendar-detail.html', img: 'A18_일정_상세.png',
    tags: ['admin-only', 'detail'], desc: '일정 상세. 수정/삭제 버튼.'
  },
  {
    id: 'A19', section: 'admin', group: '일정관리', name: '일정 등록/수정', path: '../outputs/admin/calendar-edit.html', img: 'A19_일정_등록수정.png',
    tags: ['admin-only', 'form'], desc: '일정 등록·수정 폼. 날짜/카테고리/제목/링크. API: POST/PUT /admin/api/calendar'
  },

  // ── 게시판관리 ────────────────────────────
  {
    id: 'A20', section: 'admin', group: '게시판관리', name: '게시판 목록', path: '../outputs/admin/board.html', img: 'A20_게시판_목록.png',
    tags: ['admin-only', 'list'], desc: '게시판 목록. URL ?type= 으로 게시판 유형 전환(notice/newsletter/press/gallery/forest-work/region/club 등). 상단고정 토글. API: GET /admin/api/board'
  },
  {
    id: 'A21', section: 'admin', group: '게시판관리', name: '게시글 상세', path: '../outputs/admin/board-detail.html', img: 'A21_게시판_글상세.png',
    tags: ['admin-only', 'detail'], desc: '게시글 상세. 수정/삭제/고정 처리.'
  },
  {
    id: 'A22', section: 'admin', group: '게시판관리', name: '게시글 등록/수정', path: '../outputs/admin/board-edit.html', img: 'A22_게시판_글등록수정.png',
    tags: ['admin-only', 'form'], desc: '게시글 등록·수정. 에디터 에디터. 파일첨부(3슬롯). 상단고정 체크박스. multipart. API: POST/PUT /admin/api/board'
  },

  // ── 콘텐츠관리 ───────────────────────────
  {
    id: 'A23', section: 'admin', group: '콘텐츠관리', name: '조직도/임원진 관리', path: '../outputs/admin/organization.html', img: 'A23_조직도임원진_관리.png',
    tags: ['admin-only'], desc: '조직도 이미지 교체 + 임원진 카드 CRUD. 임원진 사진 업로드, 직책/이름/소개 편집. API: /admin/api/organization'
  },
  {
    id: 'A24', section: 'admin', group: '콘텐츠관리', name: '연혁 목록', path: '../outputs/admin/history.html', img: 'A24_연혁_목록.png',
    tags: ['admin-only', 'list'], desc: '연혁 목록. 연도별 그룹. 등록/수정/삭제. 사용자 연혁 페이지(U05) 연동. API: GET /admin/api/history'
  },
  {
    id: 'A25', section: 'admin', group: '콘텐츠관리', name: '연혁 등록/수정', path: '../outputs/admin/history-edit.html', img: 'A25_연혁_등록수정.png',
    tags: ['admin-only', 'form'], desc: '연혁 등록·수정. 연도/월/내용/원형이미지. multipart. API: POST/PUT /admin/api/history/{id}'
  },
  {
    id: 'A26', section: 'admin', group: '콘텐츠관리', name: '배너 목록', path: '../outputs/admin/banner.html', img: 'A26_배너_목록.png',
    tags: ['admin-only', 'list'], desc: '메인 슬라이더 배너 목록. 순서 변경(위/아래 버튼). 최대 3개. 활성화 토글. API: GET /admin/api/banners'
  },
  {
    id: 'A27', section: 'admin', group: '콘텐츠관리', name: '배너 등록/수정', path: '../outputs/admin/banner-edit.html', img: 'A27_배너_등록수정.png',
    tags: ['admin-only', 'form'], desc: '배너 등록·수정. 이미지 업로드, 상단/메인/하단 텍스트, 링크URL. multipart. API: POST/PUT /admin/api/banners'
  },
  {
    id: 'A28', section: 'admin', group: '콘텐츠관리', name: '팝업 목록', path: '../outputs/admin/popup.html', img: 'A28_팝업_목록.png',
    tags: ['admin-only', 'list'], desc: '팝업 목록. 노출기간/활성화 여부. 현재 팝업 HTML은 주석 처리 상태 — PHP 연동 후 세션쿠키(오늘하루닫기)와 함께 복구 필요. API: GET /admin/api/popups'
  },
  {
    id: 'A29', section: 'admin', group: '콘텐츠관리', name: '팝업 등록/수정', path: '../outputs/admin/popup-edit.html', img: 'A29_팝업_등록수정.png',
    tags: ['admin-only', 'form'], desc: '팝업 등록·수정. 노출기간/크기/PC위치/이미지/SE2에디터/링크. 모바일은 항상 center 고정. API: POST/PUT /admin/api/popups'
  }

];

// ── 태그 레이블 ────────────────────────────────────────────
window.TAG_LABELS = {
  'auth'        : '로그인 필요',
  'member-only' : '회원 전용',
  'membership-only' : '정회원 전용',
  'admin-only'  : '관리자 전용',
  'write'       : '글쓰기',
  'modal'       : '모달',
  'list'        : '목록',
  'form'        : '폼',
  'detail'      : '상세',
  'static'      : '정적 페이지',
};
