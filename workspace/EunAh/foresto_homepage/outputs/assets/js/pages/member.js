/* =============================================
   member.js | 회원활동 페이지 공통 로직
   v2.0 - 리팩토링 (공통 모듈 기반)
   ============================================= */
'use strict';

/* ── 강좌 접수상태 동적 계산 (오늘 날짜 기준) */
function _calcCourseStatus(c) {
  const today = new Date().toISOString().slice(0, 10);
  if (today < c.from) return 'ready';
  if (today > c.to)   return 'closed';
  return 'open';
}

/* ══════════════════════════════════════════════
   0. 공통 유틸: 게시판 팩토리
   - data, tableBodyId, paginationId, countId,
     pageSize, rowRenderer 를 받아
     search / filterFn / render / init 을 반환
══════════════════════════════════════════════ */
function createBoard(opts) {
  const {
    data,
    tableBodyId,
    paginationId,
    countId,
    pageSize         = 10,
    rowRenderer,
    pinnedData       = [],   /* 고정글 배열 — 항상 상단 고정, 비페이지네이션 */
    pinnedRowRenderer,       /* 고정글 전용 렌더러 (없으면 rowRenderer 공용) */
  } = opts;

  let filtered    = [...data];
  let currentPage = 1;

  /* ── 렌더 */
  function render() {
    const total = filtered.length;
    const slice = filtered.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );

    const countEl = document.getElementById(countId);
    if (countEl) countEl.textContent = total.toLocaleString();

    const tbody = document.getElementById(tableBodyId);
    if (!tbody) return;

    /* 고정글: 항상 맨 위, 비페이지네이션 */
    const _pinnedRenderer = pinnedRowRenderer || rowRenderer;
    const pinnedHtml = pinnedData.map(row => _pinnedRenderer(row, '고정')).join('');

    tbody.innerHTML = pinnedHtml + (slice.length
      ? slice.map((row, i) =>
          rowRenderer(row, total - (currentPage - 1) * pageSize - i)
        ).join('')
      : `<tr>
           <td colspan="10"
               style="text-align:center;padding:32px;color:var(--gray-mid)">
             데이터가 없습니다.
           </td>
         </tr>`);

    App.renderPagination(
      paginationId,
      currentPage,
      Math.ceil(total / pageSize) || 1,
      (p) => {
        currentPage = p;
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    );
  }

  return {
    DATA: data,
    render,

    /* 키워드 검색 (title 기준) */
    search(keyword) {
      const kw = (keyword || '').trim().toLowerCase();
      filtered    = kw
        ? data.filter(r => r.title.toLowerCase().includes(kw))
        : [...data];
      currentPage = 1;
      render();
    },

    /* 커스텀 필터 함수 */
    filterFn(fn) {
      filtered    = fn ? data.filter(fn) : [...data];
      currentPage = 1;
      render();
    },

    /* 초기화 */
    init() { render(); },
  };
}

/* ══════════════════════════════════════════════
   0-1. 게시물 상세 공통 렌더러
══════════════════════════════════════════════ */
const BoardDetail = {
  /**
   * @param {string}        containerId  - 렌더링 대상 요소 id
   * @param {Array}         dataArr      - 게시판 데이터 배열
   * @param {string|number} id           - 대상 게시물 id
   * @param {string}        [listUrl=''] - 삭제 후 이동할 목록 URL (history.back() 대신)
   */
  _ctx: null,   /* 현재 상세 삭제 컨텍스트 {id, array, listUrl} */

  deleteCurrent() {
    if (!BoardDetail._ctx) return;
    const { id, array, listUrl } = BoardDetail._ctx;
    App.deletePost(id, array, listUrl || '');
  },

  render(containerId, dataArr, id, listUrl = '') {
    const el = document.getElementById(containerId);
    if (!el) return;

    const item = dataArr.find(d => String(d.id) === String(id));
    if (!item) {
      el.innerHTML = `
        <div style="text-align:center;padding:48px;color:var(--gray-mid)">
          게시물을 찾을 수 없습니다.
        </div>`;
      return;
    }

    /* 이전글 / 다음글 */
    const prevItem = dataArr.find(d => d.id === item.id + 1);
    const nextItem = dataArr.find(d => d.id === item.id - 1);

    const attachHtml = item.file ? `
      <hr class="cd-divider">
      <div class="cd-attach">
        <a href="#" class="cd-attach-item"
           onclick="App.toast('${item.file} 다운로드 — 실제 구현 시 서버 연동 예정', 'info');return false;">
          <svg class="cd-attach-icon" viewBox="0 0 24 24" fill="none" width="15" height="15">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.41 17.41a2 2 0 0 1-2.83-2.83l8.49-8.48"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>${item.file}</span>
        </a>
      </div>` : '';

    const navHtml = (nextItem || prevItem) ? `
      <div class="cd-nav">
        ${nextItem ? `<div class="cd-nav-item" onclick="location.href='?id=${nextItem.id}'">
          <span class="cd-nav-label">다음글</span>
          <span class="cd-nav-title">${nextItem.title}</span>
        </div>` : ''}
        ${prevItem ? `<div class="cd-nav-item" onclick="location.href='?id=${prevItem.id}'">
          <span class="cd-nav-label">이전글</span>
          <span class="cd-nav-title">${prevItem.title}</span>
        </div>` : ''}
      </div>` : '';

    const canMod = App.canModify(item);
    /* 삭제 컨텍스트 저장 — onclick 인라인에서 클로저 변수 직접 참조 불가 */
    BoardDetail._ctx = { id: item.id, array: dataArr, listUrl };

    el.innerHTML = `
      <div class="cd-wrap">
        <div class="cd-head">
          <div class="cd-head-left">
            <h2 class="cd-title">${item.title}</h2>
          </div>
          <span class="cd-date">${item.date || ''}</span>
        </div>
        <div class="cd-meta">
          <span>작성자 <strong>${item.author}</strong></span>
        </div>
        <hr class="cd-divider">
        ${attachHtml}
        <div class="cd-body">
          <div class="cd-content">${item.content || '<p>내용이 없습니다.</p>'}</div>
        </div>
        ${navHtml}
        <div class="cd-actions">
          <button class="btn btn-primary btn-sm cd-btn-list"
                  onclick="history.back()">목록</button>
          ${canMod ? `<div class="cd-actions-right">
            <button class="btn btn-danger btn-sm"
                    onclick="BoardDetail.deleteCurrent()">삭제</button>
          </div>` : ''}
        </div>
      </div>`;
  },
};


/* ══════════════════════════════════════════════
   1. 샘플 데이터 팩토리 (DRY 원칙 적용)
══════════════════════════════════════════════ */

/* ─ 공통: 날짜 문자열 생성 */
function makeDate(idx, offsetMonth = 0) {
  const m = String(((idx + offsetMonth) % 9) + 1).padStart(2, '0');
  const d = String((idx % 28) + 1).padStart(2, '0');
  return `2026-${m}-${d}`;
}

/* ─ 공통: 저자명 풀 */
const AUTHORS = {
  mentor:  ['김멘토', '이선생', '박지도', '최강사'],
  member:  ['김동아리', '이회원', '박숲사', '최초록'],
  staff:   ['사무국', '김사공', '이봉사', '박나눔'],
  general: ['김회원', '이자연', '박숲속', '최초록'],
};

function pickAuthor(pool, idx) {
  return AUTHORS[pool][idx % AUTHORS[pool].length];
}

/* ── 1-1. 멘토링 데이터 (18건) */
const MENTORING_TITLES = [
  '봄철 식물 해설 멘토링', '야생화 현장 실습', '숲 치유 기법 멘토링',
  '새소리 식별 교육', '곤충 생태 해설 실습', '나무 이름표 달기',
  '버섯 관찰 멘토링', '계절별 숲 변화', '숲 해설 실전 교육',
  '생태 관찰 기록법', '숲속 작은 생물들', '물가 생태 탐방',
  '도심 속 가로수', '식용식물 현장 교육', '멘토와 함께 숲길',
  '가을 단풍 해설', '겨울 나무 관찰', '숲 해설 Q&A',
];

const MENTORING_DATA = Array.from({ length: 3 }, (_, i) => ({
  id:      3 - i,
  title:   `[멘토링] ${MENTORING_TITLES[i % MENTORING_TITLES.length]}`,
  author:  pickAuthor('mentor', i),
  date:    makeDate(i),
  content: `<p>멘토링 내용 ${18 - i}번 게시물입니다.</p>
            <p>현장에서 함께 배우는 숲 해설 멘토링 활동을 안내드립니다.</p>`,
  file:    i % 3 === 0 ? `멘토링자료_${18 - i}.pdf` : null,
}));

/* ── 1-2. 수시숲해설 모집 데이터 (15건) */
const RECRUIT_LOCATIONS = [
  '도봉구 초등학교 숲 체험', '노원구 복지관 자연치유', '강북구 생태공원 해설',
  '성북구 어린이 숲 탐방', '중랑구 하천변 생태교육', '동대문구 도시숲 해설',
  '마포구 월드컵공원 탐방', '은평구 북한산 해설', '서대문구 안산 생태',
  '양천구 자연공원 교육', '구로구 도시농업 해설', '영등포구 여의도 탐방',
  '관악구 낙성대 숲길', '동작구 국립현충원', '금천구 자연체험 교육',
];

const RECRUIT_DATA = Array.from({ length: 3 }, (_, i) => ({
  id:        3 - i,
  title:     `[모집] ${RECRUIT_LOCATIONS[i]}`,
  author:    '사무국',
  date:      makeDate(i),
  content:   `<p>수시숲해설 모집 ${15 - i}번 게시물입니다.</p>
              <p>현장 활동에 관심 있는 회원분들의 많은 참여 바랍니다.</p>
              <p>활동 내용, 일정, 대상 기관 등 세부 안내는 첨부 파일을 참조하세요.</p>`,
}));

/* ── 1-3. 사공단 소개 텍스트 (관리자 등록) */
const SAGONGDAN_INTRO_TEXT = `한국숲해설가협회 사회공헌사업단은 숲해설가의 전문성을 활용하여 장애인, 어르신, 취약계층 아동 등 사회적 배려 대상자를 위한 자연 체험 봉사 활동을 펼치고 있습니다.<br>각 공헌단은 담당 지역과 기관을 중심으로 정기 활동을 운영하며, 자연과 사람을 이어주는 가교 역할을 합니다.`;

/* ── 1-3. 사공단 마스터 데이터 (관리자 등록 기준) */
const SAGONGDAN_DATA = [
  { id: 1, name: '1공헌단', imgUrl: null,
    desc: '안양·수리 지역 장애인 복지관을 중심으로 숲 생태 교육 봉사 활동을 진행합니다.' },
  { id: 3, name: '3공헌단', imgUrl: null,
    desc: '용인수지 지역 장애인 복지관을 대상으로 산림치유 및 자연 체험 프로그램을 운영합니다.' },
  { id: 4, name: '4공헌단', imgUrl: null,
    desc: '서울시립발달장애인센터와 협력하여 정기 숲 체험 봉사 활동을 진행합니다.' },
  { id: 7, name: '7공헌단', imgUrl: null,
    desc: '부천 지역 장애인 복지관과 여의도공원 일대에서 숲해설 봉사 활동을 운영합니다.' },
  { id: 8, name: '8공헌단', imgUrl: null,
    desc: '월드컵공원 및 마포 지역에서 생태 교육과 봉사 활동을 정기적으로 진행합니다.' },
  { id: 13, name: '13공헌단', imgUrl: null,
    desc: '서울시립발달장애인복지관을 중심으로 월 정기 봉사 및 계절 특별 프로그램을 운영합니다.' },
];

/* ── 1-4. 사공단 소식 데이터 (20건) */
const NEWS_SUBTITLES = [
  '도봉구 초등 숲 체험 후기', '노인복지관 자연치유 활동',
  '다문화가족 숲 힐링', '장애인 시설 나들이',
  '3월 봉사활동 결과 보고', '성북구 어린이집 생태교육',
  '지역아동센터 숲 체험', '주말 생태환경 교육',
  '사공단 정기회의 결과', '2월 활동 정리',
];

const SAGONGDAN_TEAM_NAMES = SAGONGDAN_DATA.map(t => t.name);

const SAGONGDAN_NEWS_DATA = Array.from({ length: 3 }, (_, i) => ({
  id:      3 - i,
  team:    SAGONGDAN_TEAM_NAMES[i % 3],
  title:   `${NEWS_SUBTITLES[i % NEWS_SUBTITLES.length]} ${Math.floor(i / NEWS_SUBTITLES.length) + 1}호`,
  author:  pickAuthor('staff', i),
  date:    makeDate(i),
  content: `<p>사공단 소식 ${20 - i}번 게시물입니다.</p>
            <p>협회 사회공헌사업단의 활동 내용을 공유드립니다.</p>`,
  file:    null,
}));

/* ── 1-4. 사공단 일지 데이터 (15건) */
const LOG_SUBTITLES = [
  '안양수리장애인복지관 활동일지',
  '용인수지복지관 활동일지',
  '서울시립발달장애인센터 활동일지',
  '서울시립발달장애인복지관 활동일지',
  '월드컵공원 활동일지',
  '부천장애인복지관 활동일지',
  '창경궁 활동일지',
  '서울숲 활동일지',
  '하남장애인 주간보호시설 활동일지',
  '용인수지장애인복지관 활동일지',
];

const SAGONGDAN_LOG_DATA = Array.from({ length: 3 }, (_, i) => ({
  id:      3 - i,
  team:    SAGONGDAN_TEAM_NAMES[i % SAGONGDAN_TEAM_NAMES.length],
  title:   `[활동일지] ${LOG_SUBTITLES[i % LOG_SUBTITLES.length]}`,
  author:  pickAuthor('staff', i),
  date:    makeDate(i),
  content: `<p>사공단 일지 ${15 - i}번 게시물입니다.</p>
            <p>현장 활동 기록을 정리하여 공유드립니다.</p>`,
}));

/* ── 1-5. 동아리 소개 텍스트 (관리자 등록) */
const CLUB_INTRO_TEXT = `한국숲해설가협회 숲동아리단은 회원들이 자발적으로 구성한 소모임으로, 숲에 대한 관심과 열정을 함께 나눕니다.<br>각 동아리는 고유한 주제와 활동 방식으로 운영되며, 회원이라면 누구나 가입 신청이 가능합니다.`;

/* ── 1-5. 동아리 마스터 데이터 (관리자 등록 기준) */
const CLUB_DATA = [
  { id: 1, name: '숲사랑단', imgUrl: null, recruiting: true,
    desc: '도심 속 숲을 찾아 자연의 소중함을 나누는 동아리입니다. 매월 정기 탐방과 해설 활동을 진행합니다.' },
  { id: 2, name: '초록나무', imgUrl: null, recruiting: false,
    desc: '식물 생태 탐구와 해설에 특화된 동아리로, 계절별 식물 관찰 활동을 진행합니다.' },
  { id: 3, name: '산들바람', imgUrl: null, recruiting: true,
    desc: '산림치유와 숲 힐링 프로그램 개발에 집중하는 동아리입니다.' },
];
const CLUB_NAMES = CLUB_DATA.map(c => c.name);   /* 소식·자료방 데이터에서 참조 */

/* ── 1-6. 동아리 소식 데이터 (24건, 공지기능 미사용) */
const CLUB_NEWS_SUBTITLES = [
  '3월 정기모임 후기', '봄 탐방 활동 결과', '신입 회원 환영',
  '동아리 사진 공유', '활동 일정 안내', '월간 소식',
];

const CLUB_NEWS_DATA = Array.from({ length: 3 }, (_, i) => ({
  id:      3 - i,
  title:   `[${CLUB_NAMES[i % 3]}] ${CLUB_NEWS_SUBTITLES[i % CLUB_NEWS_SUBTITLES.length]}`,
  club:    CLUB_NAMES[i % 3],
  author:  pickAuthor('member', i),
  date:    makeDate(i),
  content: `<p>동아리 소식 ${24 - i}번 게시물입니다.</p>
            <p>동아리 활동 내용을 공유드립니다.</p>`,
}));

/* ── 1-7. 동아리 자료방 데이터 (12건) */
const ARCHIVE_TITLES = [
  '동아리 규정집', '활동 매뉴얼', '해설 자료 모음',
  '식물 도감 자료', '사진 모음집', '활동 보고 양식',
];
const ARCHIVE_FILES = [
  '동아리규정.pdf', '활동매뉴얼.hwp', '해설자료.pdf',
  '식물도감.pdf', '사진모음.zip', '활동양식.docx',
];

const CLUB_ARCHIVE_DATA = Array.from({ length: 3 }, (_, i) => ({
  id:      3 - i,
  club:    CLUB_NAMES[i % 3],
  title:   `${ARCHIVE_TITLES[i % ARCHIVE_TITLES.length]} v${i + 1}`,
  author:  pickAuthor('member', i),
  date:    makeDate(i),
  file:    ARCHIVE_FILES[i % ARCHIVE_FILES.length],
  content: `<p>동아리 자료방 ${12 - i}번 파일입니다.</p>`,
}));

/* ── 1-7. QnA 데이터 */
const QNA_QUESTIONS = [
  '숲해설가 자격증 취득 후 활동 방법이 궁금합니다.',
  '동아리 신규 가입은 어떻게 하나요?',
  '협회비 납부 방법이 궁금합니다.',
  '수료증 재발급 신청은 어떻게 하나요?',
  '사회공헌단 활동 참여 방법을 알고 싶어요.',
  '정회원과 준회원의 차이가 뭔가요?',
  '교육 신청 후 취소할 수 있나요?',
  '멘토링 프로그램은 어떻게 신청하나요?',
];

const QNA_DATA = Array.from({ length: QNA_QUESTIONS.length }, (_, i) => ({
  id:       QNA_QUESTIONS.length - i,
  title:    QNA_QUESTIONS[i],
  author:   `회원${i + 1}`,
  date:     makeDate(i),
  status:   i % 3 === 0 ? 'waiting' : 'answered',
  answer:   i % 3 === 0
    ? null
    : `<p>문의해 주셔서 감사합니다.</p>
       <p>${QNA_QUESTIONS[i]}에 대한 답변입니다. 자세한 사항은 사무국(02-747-6518)으로 문의 부탁드립니다.</p>`,
  content:  `<p>${QNA_QUESTIONS[i]}</p>
             <p>자세한 안내 부탁드립니다.</p>`,
}));

/* ── 1-8. 역량강화 교육 강좌 데이터 */
const COMPETENCY_TITLES = [
  '리더십 워크숍', '커뮤니케이션 역량 강화',
  '팀빌딩 프로그램', '멘토링 심화 과정',
  '자기계발 세미나', '전문가 특강',
  '해외 사례 공유', '네트워킹 데이',
];

const COMPETENCY_DATA = Array.from({ length: COMPETENCY_TITLES.length }, (_, i) => ({
  id:       COMPETENCY_TITLES.length - i,
  type:     '역량강화',
  title:    `[역량강화] ${COMPETENCY_TITLES[i]}`,
  date:     makeDate(i) + ' 10:00:00',
  from:     makeDate(i),
  to:       makeDate(i, 1),
  status:   ['open', 'ready', 'closed', 'done'][i % 4],
  capacity: 20,
  attachments: i % 2 === 0 ? [{ name: '역량강화_신청서.hwp', size: '26K' }] : [],
  guide:    `■강좌: ${COMPETENCY_TITLES[i]}\n■대상: 정회원 (회원 우선 접수)\n■정원: 20명\n■교육 장소: 협회 강의실\n■문의: 협회 사무국 02-747-6518`,
  content:  `<p>[역량강화] ${COMPETENCY_TITLES[i]} 강좌 안내입니다.</p>`,
}));


/* ══════════════════════════════════════════════
   2. 역량강화 교육강좌 컨트롤러
   - education.js 의 CourseListController 재사용
══════════════════════════════════════════════ */
const CompetencyCtrl = {
  _ctrl: null,

  init() {
    /*
     * CourseListController 는 education.js 에서 정의.
     * member 페이지에서는 역량강화 타입만 필터링하여 사용.
     */
    if (typeof CourseListController === 'undefined') {
      console.warn('CourseListController 를 먼저 로드하세요 (education.js).');
      return;
    }

    /* 역량강화 데이터만 주입하여 컨트롤러 생성 */
    window.ALL_COURSES_RAW = [
      ...(window.ALL_COURSES_RAW || []),
      ...COMPETENCY_DATA,
    ];

    this._ctrl = new CourseListController(
      '역량강화',
      'competencyTableBody',
      'competencyPagination'
    );
    window._ctrl = this._ctrl;
    this._ctrl.render();
  },

  /* 필터 버튼 핸들러 */
  filter() {
    const status = document.getElementById('competencyStatus')?.value || '';
    const from   = document.getElementById('competencyFrom')?.value   || '';
    const to     = document.getElementById('competencyTo')?.value     || '';
    this._ctrl?.filter(status, from, to);
  },

  reset() {
    ['competencyStatus', 'competencyFrom', 'competencyTo'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    this._ctrl?.filter('', '', '');
  },

  renderDetail() {
    const id = App.getParam('id');

    /* education.js 의 ALL_COURSES_RAW(역량강화 IDs 4000+, 직무교육 IDs 3000+)를 우선 조회.
       ALL_COURSES_RAW 없을 경우 COMPETENCY_DATA 로 폴백 */
    const _pool = window.ALL_COURSES_RAW
      ? window.ALL_COURSES_RAW.filter(c => c.type === '역량강화' || c.type === '직무교육')
      : COMPETENCY_DATA;
    const item = _pool.find(d => String(d.id) === String(id));

    const el   = document.getElementById('competencyDetail');
    if (!el) return;
    if (!item) {
      el.innerHTML = `<div style="text-align:center;padding:48px;color:var(--gray-mid)">게시물을 찾을 수 없습니다.</div>`;
      return;
    }

    const SM = {
      open:   { label: '접수중',   cls: 'open'   },
      ready:  { label: '준비중',   cls: 'ready'  },
      closed: { label: '접수마감', cls: 'closed' },
      applied:{ label: '신청완료', cls: 'applied'},
    };
    const calcStatus = _calcCourseStatus(item); /* 오늘 날짜 기준 동적 계산 */
    const sm = SM[calcStatus] || { label: calcStatus, cls: 'closed' };

    /* 첨부파일 */
    const atts = item.attachments || [];
    const attHtml = atts.length
      ? `<div class="cd-attach">
           ${atts.map(a => `
             <a href="#" class="cd-attach-item"
                onclick="App.toast('첨부파일 다운로드 — 실제 구현 시 서버 연동 예정', 'info');return false;">
               <svg class="cd-attach-icon" viewBox="0 0 24 24" fill="none" width="15" height="15">
                 <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.41 17.41a2 2 0 0 1-2.83-2.83l8.49-8.48"
                       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
               </svg>
               <span>${a.name}</span>
               <span class="cd-attach-size">(${a.size})</span>
             </a>`).join('')}
         </div>`
      : '';

    /* 접수하기 / 취소하기 버튼 */
    const isApplied     = App.getParam('applied') === '1';
    const inApplyPeriod = calcStatus === 'open';

    let applyBtn;
    if (isApplied && inApplyPeriod) {
      applyBtn = `<button class="btn btn-gray btn-sm cd-btn-apply" disabled>접수완료</button>
                  <button class="btn btn-danger btn-sm cd-btn-cancel"
                          onclick="App.toast('신청이 취소되었습니다. (프로토타입)', 'info')">취소하기</button>`;
    } else if (calcStatus === 'open') {
      applyBtn = `<button class="btn btn-dark btn-sm cd-btn-apply"
                          onclick="window._ctrl && window._ctrl.openApply(${item.id})">접수하기</button>`;
    } else {
      applyBtn = `<button class="btn btn-gray btn-sm cd-btn-apply" disabled>${sm.label}</button>`;
    }

    el.innerHTML = `
      <div class="cd-wrap">

        <div class="cd-head">
          <div class="cd-head-left">
            <h2 class="cd-title">${item.title}</h2>
            <span class="cd-status-badge cd-status-${sm.cls}">${sm.label}</span>
          </div>
          <span class="cd-date">${item.date}</span>
        </div>
        <hr class="cd-divider">

        ${attHtml}
        ${attHtml ? '<hr class="cd-divider">' : ''}

        <div class="cd-body">
          <div class="cd-guide">${item.guide || ''}</div>
          <div class="cd-map-placeholder">
            <span>이미지 영역 (실제 구현 시 삽입)</span>
          </div>
        </div>

        ${(() => {
          const idx2  = _pool.findIndex(d => d.id === item.id);
          const next2 = _pool[idx2 - 1];
          const prev2 = _pool[idx2 + 1];
          return (next2 || prev2) ? `
          <div class="cd-nav">
            ${next2 ? `<div class="cd-nav-item" onclick="location.href='competency-detail.html?id=${next2.id}'">
              <span class="cd-nav-label">다음글</span>
              <span class="cd-nav-title">${next2.title}</span>
            </div>` : ''}
            ${prev2 ? `<div class="cd-nav-item" onclick="location.href='competency-detail.html?id=${prev2.id}'">
              <span class="cd-nav-label">이전글</span>
              <span class="cd-nav-title">${prev2.title}</span>
            </div>` : ''}
          </div>` : '';
        })()}

        <div class="cd-actions">
          <button class="btn btn-primary btn-sm cd-btn-list"
                  onclick="location.href='competency.html'">목록</button>
          <div class="cd-actions-right">
            ${applyBtn}
          </div>
        </div>

      </div>`;
  },
};


/* ══════════════════════════════════════════════
   2-B. 강좌 상세 공통 렌더러 (academy-course-detail / mentoring-course-detail 공유)
══════════════════════════════════════════════ */
function renderCourseDetail(containerId, types, detailPage, listPage) {
  const id    = App.getParam('id');
  const _pool = (window.ALL_COURSES_RAW || []).filter(c => types.includes(c.type));
  const item  = _pool.find(d => String(d.id) === String(id));
  const el    = document.getElementById(containerId);
  if (!el) return;
  if (!item) {
    el.innerHTML = `<div style="text-align:center;padding:48px;color:var(--gray-mid)">게시물을 찾을 수 없습니다.</div>`;
    return;
  }

  const SM = {
    open:   { label: '접수중',   cls: 'open'   },
    ready:  { label: '준비중',   cls: 'ready'  },
    closed: { label: '접수마감', cls: 'closed' },
    applied:{ label: '신청완료', cls: 'applied'},
  };
  const calcStatus = _calcCourseStatus(item); /* 오늘 날짜 기준 동적 계산 */
  const sm = SM[calcStatus] || { label: calcStatus, cls: 'closed' };

  const atts = item.attachments || [];
  const attHtml = atts.length
    ? `<div class="cd-attach">
         ${atts.map(a => `
           <a href="#" class="cd-attach-item"
              onclick="App.toast('첨부파일 다운로드 — 실제 구현 시 서버 연동 예정', 'info');return false;">
             <svg class="cd-attach-icon" viewBox="0 0 24 24" fill="none" width="15" height="15">
               <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.41 17.41a2 2 0 0 1-2.83-2.83l8.49-8.48"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
             </svg>
             <span>${a.name}</span><span class="cd-attach-size">(${a.size})</span>
           </a>`).join('')}
       </div>` : '';

  const isApplied = App.getParam('applied') === '1';
  let applyBtn;
  if (isApplied && calcStatus === 'open') {
    applyBtn = `<button class="btn btn-gray btn-sm cd-btn-apply" disabled>접수완료</button>
                <button class="btn btn-danger btn-sm cd-btn-cancel"
                        onclick="App.toast('신청이 취소되었습니다. (프로토타입)', 'info')">취소하기</button>`;
  } else if (calcStatus === 'open') {
    applyBtn = `<button class="btn btn-dark btn-sm cd-btn-apply"
                        onclick="window._ctrl && window._ctrl.openApply(${item.id})">접수하기</button>`;
  } else {
    applyBtn = `<button class="btn btn-gray btn-sm cd-btn-apply" disabled>${sm.label}</button>`;
  }

  const idx  = _pool.findIndex(d => d.id === item.id);
  const next = _pool[idx - 1];
  const prev = _pool[idx + 1];
  const navHtml = (next || prev) ? `
    <div class="cd-nav">
      ${next ? `<div class="cd-nav-item" onclick="location.href='${detailPage}?id=${next.id}'">
        <span class="cd-nav-label">다음글</span><span class="cd-nav-title">${next.title}</span>
      </div>` : ''}
      ${prev ? `<div class="cd-nav-item" onclick="location.href='${detailPage}?id=${prev.id}'">
        <span class="cd-nav-label">이전글</span><span class="cd-nav-title">${prev.title}</span>
      </div>` : ''}
    </div>` : '';

  el.innerHTML = `
    <div class="cd-wrap">
      <div class="cd-head">
        <div class="cd-head-left">
          <h2 class="cd-title">${item.title}</h2>
          <span class="cd-status-badge cd-status-${sm.cls}">${sm.label}</span>
        </div>
        <span class="cd-date">${item.date}</span>
      </div>
      <hr class="cd-divider">
      ${attHtml}${attHtml ? '<hr class="cd-divider">' : ''}
      <div class="cd-body">
        <div class="cd-guide">${item.guide || ''}</div>
        <div class="cd-map-placeholder">
          <span>이미지 영역 (실제 구현 시 삽입)</span>
        </div>
      </div>
      ${navHtml}
      <div class="cd-actions">
        <button class="btn btn-primary btn-sm cd-btn-list"
                onclick="location.href='${listPage}'">목록</button>
        <div class="cd-actions-right">${applyBtn}</div>
      </div>
    </div>`;
}

/* ── 강좌(academy-course) 컨트롤러 */
const AcademyCourseCtrl = {
  renderDetail() {
    renderCourseDetail('academyCourseDetail', ['회원강좌'], 'academy-course-detail.html', 'academy-course.html');
  },
};

/* ── 멘토링 숲학교 강좌 컨트롤러 */
const MentoringCourseCtrl = {
  renderDetail() {
    renderCourseDetail('mentoringCourseDetail', ['멘토링'], 'mentoring-detail.html', 'mentoring.html');
  },
};


/* ══════════════════════════════════════════════
   3. 멘토링 게시판 컨트롤러
══════════════════════════════════════════════ */
const MentoringCtrl = {
  _board: null,

  init() {
    this._board = createBoard({
      data:         MENTORING_DATA,
      tableBodyId:  'mentoringTableBody',
      paginationId: 'mentoringPagination',
      countId:      'mentoringCount',
      rowRenderer:  (row, seq) => `
        <tr>
          <td class="col-num center">${seq}</td>
          <td class="td-title">
            <a href="mentoring-detail.html?id=${row.id}">${row.title}</a>
          </td>
          <td class="col-author center">${row.author}</td>
          <td class="col-date center">${row.date}</td>
        </tr>`,
    });
    this._board.init();
  },

  search() {
    const kw = document.getElementById('mentoringKeyword')?.value || '';
    this._board?.search(kw);
  },

  reset() {
    const el = document.getElementById('mentoringKeyword');
    if (el) el.value = '';
    this._board?.search('');
  },

  /* 상세 페이지 렌더 */
  renderDetail() {
    const id = App.getParam('id');
    if (!id) return;
    BoardDetail.render('mentoringDetail', MENTORING_DATA, id);
  },
};


/* ══════════════════════════════════════════════
   4. 수시숲해설 모집 컨트롤러
══════════════════════════════════════════════ */
const RecruitCtrl = {
  _board: null,

  init() {
    this._board = createBoard({
      data:         RECRUIT_DATA,
      tableBodyId:  'recruitTableBody',
      paginationId: 'recruitPagination',
      countId:      'recruitCount',
      rowRenderer:  (row, seq) => `
        <tr>
          <td class="col-num center">${seq}</td>
          <td class="td-title">
            <a href="recruit-detail.html?id=${row.id}">${row.title}</a>
          </td>
          <td class="col-author center">${row.author}</td>
          <td class="col-date center">${row.date}</td>
        </tr>`,
    });
    this._board.init();
  },

  search() {
    const keyword = document.getElementById('recruitKeyword')?.value || '';
    this._board?.filterFn(r =>
      !keyword || r.title.toLowerCase().includes(keyword.toLowerCase())
    );
  },

  reset() {
    const el = document.getElementById('recruitKeyword');
    if (el) el.value = '';
    this._board?.filterFn(null);
  },

  /* ── 상세 페이지 렌더 (공지사항과 동일 레이아웃) */
  renderDetail() {
    const id   = App.getParam('id');
    const item = RECRUIT_DATA.find(d => String(d.id) === String(id));
    const el   = document.getElementById('recruitDetail');
    if (!el) return;

    if (!item) {
      el.innerHTML = `
        <div style="text-align:center;padding:48px;color:var(--gray-mid)">
          모집 공고를 찾을 수 없습니다.
        </div>`;
      return;
    }

    const idx  = RECRUIT_DATA.findIndex(d => d.id === item.id);
    const prev = RECRUIT_DATA[idx + 1];
    const next = RECRUIT_DATA[idx - 1];

    const navHtml = (next || prev) ? `
      <div class="cd-nav">
        ${next ? `<div class="cd-nav-item" onclick="location.href='recruit-detail.html?id=${next.id}'">
          <span class="cd-nav-label">다음글</span>
          <span class="cd-nav-title">${next.title}</span>
        </div>` : ''}
        ${prev ? `<div class="cd-nav-item" onclick="location.href='recruit-detail.html?id=${prev.id}'">
          <span class="cd-nav-label">이전글</span>
          <span class="cd-nav-title">${prev.title}</span>
        </div>` : ''}
      </div>` : '';

    el.innerHTML = `
      <div class="cd-wrap">
        <div class="cd-head">
          <div class="cd-head-left">
            <h2 class="cd-title">${item.title}</h2>
          </div>
          <span class="cd-date">${item.date}</span>
        </div>
        <div class="cd-meta">
          <span>작성자 <strong>${item.author}</strong></span>
        </div>
        <hr class="cd-divider">
        <div class="cd-body">
          <div class="cd-content">${item.content || ''}</div>
        </div>
        ${navHtml}
        <div class="cd-actions">
          <button class="btn btn-primary btn-sm cd-btn-list"
                  onclick="location.href='recruit.html'">목록</button>
        </div>
      </div>`;
  },
};


/* ══════════════════════════════════════════════
   5. 숲해설 강사 신청 컨트롤러
══════════════════════════════════════════════ */
const InstructorCtrl = {

  init() {
    /* 폼 초기화 (페이지 진입 시 아무것도 없음) */
  },

  submit() {
    const name   = document.getElementById('instrName')?.value.trim()   || '';
    const phone  = document.getElementById('instrPhone')?.value.trim()  || '';
    const email  = document.getElementById('instrEmail')?.value.trim()  || '';
    const area   = document.getElementById('instrArea')?.value.trim()   || '';
    const career = document.getElementById('instrCareer')?.value.trim() || '';

    if (!name)   { App.toast('이름을 입력해주세요.',   'warning'); return; }
    if (!phone)  { App.toast('연락처를 입력해주세요.', 'warning'); return; }
    if (!email)  { App.toast('이메일을 입력해주세요.', 'warning'); return; }
    if (!area)   { App.toast('활동 지역을 입력해주세요.', 'warning'); return; }
    if (!career) { App.toast('활동 경력을 입력해주세요.', 'warning'); return; }

    /* 제출 후 완료 화면 전환 */
    const formWrap = document.getElementById('instrFormWrap');
    const doneWrap = document.getElementById('instrDoneWrap');
    if (formWrap) formWrap.style.display = 'none';
    if (doneWrap) doneWrap.style.display = 'block';

    App.toast('신청이 완료되었습니다.');
  },
};


/* ══════════════════════════════════════════════
   6. 사회공헌사업단 컨트롤러
   - SAGONGDAN_DATA: 팀 마스터 (소개 탭 갤러리 소스)
   - tabs: intro / news / log (숲동아리단과 동일 구조)
══════════════════════════════════════════════ */
const SagongdanCtrl = {
  _newsBoard: null,
  _logBoard:  null,

  /* ── SAGONGDAN_DATA 기반 드롭다운 일괄 갱신 */
  _syncTeamSelects() {
    ['sagongdanNewsTeamFilter', 'sagongdanLogTeamFilter'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const cur = el.value;
      el.innerHTML = `<option value="">전체 팀</option>` +
        SAGONGDAN_DATA.map(t => `<option value="${t.name}">${t.name}</option>`).join('');
      if (SAGONGDAN_DATA.some(t => t.name === cur)) el.value = cur;
    });
  },

  init() {
    const id  = App.getParam('id');
    const tab = App.getParam('tab') || 'intro';

    /* 상세 분기 */
    if (id) {
      const detailWrap = document.getElementById('sagongdanDetailWrap');
      document.querySelectorAll('[id^="tab-"]').forEach(el => el.style.display = 'none');
      if (detailWrap) detailWrap.style.display = 'block';
      if (tab === 'intro') {
        this.renderTeamDetail(id);
      } else {
        this.renderDetail(tab, id);
      }
      return;
    }

    this._initBoards();
    this._switchTab(tab);
  },

  _initBoards() {
    this._newsBoard = createBoard({
      data:         SAGONGDAN_NEWS_DATA,
      tableBodyId:  'sagongdanNewsTableBody',
      paginationId: 'sagongdanNewsPagination',
      countId:      'sagongdanNewsCount',
      rowRenderer:  (row, seq) => `
        <tr>
          <td class="col-num center">${seq}</td>
          <td class="col-extra center">
            <span class="badge badge-green" style="font-size:11px">${row.team}</span>
          </td>
          <td class="td-title">
            <a href="?tab=news&id=${row.id}">${row.title}</a>
          </td>
          <td class="col-author center">${row.author}</td>
          <td class="col-date center">${row.date}</td>
        </tr>`,
    });

    this._logBoard = createBoard({
      data:         SAGONGDAN_LOG_DATA,
      tableBodyId:  'sagongdanLogTableBody',
      paginationId: 'sagongdanLogPagination',
      countId:      'sagongdanLogCount',
      rowRenderer:  (row, seq) => `
        <tr>
          <td class="col-num center">${seq}</td>
          <td class="col-extra center">
            <span class="badge badge-green" style="font-size:11px">${row.team}</span>
          </td>
          <td class="td-title">
            <a href="?tab=log&id=${row.id}">${row.title}</a>
          </td>
          <td class="col-author center">${row.author}</td>
          <td class="col-date center">${row.date}</td>
        </tr>`,
    });

    this._syncTeamSelects();

    /* ── 등록 버튼 (정회원·관리자) */
    if (App.user.isLoggedIn) {
      const btnHtml = (href, label) =>
        `<a href="${href}" class="btn btn-primary btn-sm">${label}</a>`;
      const nb = document.getElementById('sagongdanNewsWriteBtn');
      const lb = document.getElementById('sagongdanLogWriteBtn');
      if (nb) nb.innerHTML = btnHtml('sagongdan-news-write.html', '소식 등록');
      if (lb) lb.innerHTML = btnHtml('sagongdan-log-write.html',  '일지 등록');
    }
  },

  _switchTab(tab) {
    ['intro', 'news', 'log'].forEach(t => {
      const el = document.getElementById(`tab-${t}`);
      if (el) el.style.display = t === tab ? 'block' : 'none';
    });
    if (tab === 'intro') this._renderIntro();
    if (tab === 'news')  this._newsBoard?.render();
    if (tab === 'log')   this._logBoard?.render();
  },

  /* ── 소개 갤러리 렌더 */
  _renderIntro() {
    const desc = document.getElementById('sagongdanIntroDesc');
    if (desc && SAGONGDAN_INTRO_TEXT) {
      desc.innerHTML = `
        <div class="intro-notice">
          <div class="intro-notice-title">사회공헌사업단이란?</div>
          <div class="intro-notice-body">${SAGONGDAN_INTRO_TEXT}</div>
        </div>`;
    }
    const grid = document.getElementById('sagongdanIntroGrid');
    if (!grid) return;
    if (!SAGONGDAN_DATA.length) {
      grid.innerHTML = '<p style="padding:40px;text-align:center;color:var(--gray-mid)">등록된 팀이 없습니다.</p>';
      return;
    }
    grid.innerHTML = SAGONGDAN_DATA.map(t => {
      const thumb = t.imgUrl
        ? `<div class="gallery-thumb" style="background-image:url('${t.imgUrl}')"></div>`
        : `<div class="gallery-thumb-placeholder"></div>`;
      return `
        <div class="gallery-card" onclick="location.href='?tab=intro&id=${t.id}'"
             style="cursor:pointer">
          ${thumb}
          <div class="gallery-info">
            <div class="gallery-title">${t.name}</div>
          </div>
        </div>`;
    }).join('');
  },

  /* ── 소개 상세 */
  renderTeamDetail(id) {
    const item = SAGONGDAN_DATA.find(t => String(t.id) === String(id));
    const el   = document.getElementById('sagongdanDetail');
    if (!el) return;
    if (!item) {
      el.innerHTML = '<div style="text-align:center;padding:48px;color:var(--gray-mid)">해당 팀을 찾을 수 없습니다.</div>';
      return;
    }
    const idx  = SAGONGDAN_DATA.findIndex(t => t.id === item.id);
    const prev = SAGONGDAN_DATA[idx - 1];
    const next = SAGONGDAN_DATA[idx + 1];
    const thumb = item.imgUrl
      ? `<div class="gallery-thumb" style="background-image:url('${item.imgUrl}');height:200px;border-radius:var(--radius);margin-bottom:20px"></div>`
      : '';
    const navHtml = (next || prev) ? `
      <div class="cd-nav">
        ${next ? `<div class="cd-nav-item" onclick="location.href='?tab=intro&id=${next.id}'">
          <span class="cd-nav-label">다음</span>
          <span class="cd-nav-title">${next.name}</span>
        </div>` : ''}
        ${prev ? `<div class="cd-nav-item" onclick="location.href='?tab=intro&id=${prev.id}'">
          <span class="cd-nav-label">이전</span>
          <span class="cd-nav-title">${prev.name}</span>
        </div>` : ''}
      </div>` : '';
    el.innerHTML = `
      <div class="cd-wrap">
        <div class="cd-head">
          <div class="cd-head-left">
            <h2 class="cd-title">${item.name}</h2>
          </div>
        </div>
        <hr class="cd-divider">
        ${thumb}
        <div class="cd-body">
          <div class="cd-content"><p>${item.desc || ''}</p></div>
        </div>
        ${navHtml}
        <div class="cd-actions">
          <button class="btn btn-primary btn-sm cd-btn-list"
                  onclick="location.href='?tab=intro'">목록</button>
        </div>
      </div>`;
  },

  /* ── 소식 검색 */
  searchNews() {
    const keyword = document.getElementById('sagongdanNewsKeyword')?.value    || '';
    const team    = document.getElementById('sagongdanNewsTeamFilter')?.value || '';
    this._newsBoard?.filterFn(r => {
      if (team    && r.team !== team)                                          return false;
      if (keyword && !r.title.toLowerCase().includes(keyword.toLowerCase()))  return false;
      return true;
    });
  },
  resetNews() {
    ['sagongdanNewsKeyword', 'sagongdanNewsTeamFilter'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    this._newsBoard?.filterFn(null);
  },

  /* ── 일지 검색 */
  searchLog() {
    const keyword = document.getElementById('sagongdanLogKeyword')?.value    || '';
    const team    = document.getElementById('sagongdanLogTeamFilter')?.value || '';
    this._logBoard?.filterFn(r => {
      if (team    && r.team !== team)                                          return false;
      if (keyword && !r.title.toLowerCase().includes(keyword.toLowerCase()))  return false;
      return true;
    });
  },
  resetLog() {
    ['sagongdanLogKeyword', 'sagongdanLogTeamFilter'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    this._logBoard?.filterFn(null);
  },

  /* ── 소식·일지 상세 렌더 */
  renderDetail(tab, id) {
    const data = tab === 'log' ? SAGONGDAN_LOG_DATA : SAGONGDAN_NEWS_DATA;
    BoardDetail.render('sagongdanDetail', data, id);
  },
};


/* ══════════════════════════════════════════════
   7. 숲동아리단 컨트롤러
   - CLUB_DATA: 동아리 마스터 (소개 탭, 드롭다운 공통 소스)
   - intro 탭: 갤러리형 카드 → 동아리 상세
   - news/archive: 필터(동아리 선택 + 키워드), 공지 미사용
══════════════════════════════════════════════ */
const ClubCtrl = {
  _newsBoard:    null,
  _archiveBoard: null,

  /* ── CLUB_DATA 기반 드롭다운 옵션 HTML */
  _clubOptions(allLabel = '전체 동아리') {
    return `<option value="">${allLabel}</option>` +
      CLUB_DATA.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
  },

  /* ── 동아리 선택 드롭다운 일괄 갱신 (CLUB_DATA 변경 시 반영) */
  _syncClubSelects() {
    ['clubNewsClubFilter', 'clubArchiveClubFilter'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const cur = el.value;
      el.innerHTML = this._clubOptions();
      if (CLUB_DATA.some(c => c.name === cur)) el.value = cur;
    });
  },

  init() {
    const id  = App.getParam('id');
    const tab = App.getParam('tab') || 'intro';

    /* 상세 분기 */
    if (id) {
      const detailWrap = document.getElementById('clubDetailWrap');
      document.querySelectorAll('[id^="tab-"]').forEach(el => el.style.display = 'none');
      if (detailWrap) detailWrap.style.display = 'block';
      if (tab === 'intro') {
        this.renderClubDetail(id);
      } else {
        this.renderDetail(tab, id);
      }
      return;
    }

    /* 게시판 초기화 */
    this._initBoards();
    this._switchTab(tab);
  },

  _initBoards() {
    this._newsBoard = createBoard({
      data:             CLUB_NEWS_DATA,
      tableBodyId:      'clubNewsTableBody',
      paginationId:     'clubNewsPagination',
      countId:          'clubNewsCount',
      rowRenderer:  (row, seq) => `
        <tr>
          <td class="col-num center">${seq}</td>
          <td class="col-extra center">
            <span class="badge badge-green" style="font-size:11px">${row.club}</span>
          </td>
          <td class="td-title">
            <a href="?tab=news&id=${row.id}">${row.title}</a>
          </td>
          <td class="col-author center">${row.author}</td>
          <td class="col-date center">${row.date}</td>
        </tr>`,
    });

    this._archiveBoard = createBoard({
      data:         CLUB_ARCHIVE_DATA,
      tableBodyId:  'clubArchiveTableBody',
      paginationId: 'clubArchivePagination',
      countId:      'clubArchiveCount',
      rowRenderer:  (row, seq) => `
        <tr>
          <td class="col-num center">${seq}</td>
          <td class="col-extra center">
            <span class="badge badge-green" style="font-size:11px">${row.club}</span>
          </td>
          <td class="td-title">
            <a href="?tab=archive&id=${row.id}">${row.title}</a>
          </td>
          <td class="col-author center">${row.author}</td>
          <td class="col-date center">${row.date}</td>
        </tr>`,
    });

    /* 동아리 드롭다운 CLUB_DATA 기반으로 초기 세팅 */
    this._syncClubSelects();

    /* ── 등록 버튼 (정회원·관리자) */
    if (App.user.isLoggedIn) {
      const btnHtml = (href, label) =>
        `<a href="${href}" class="btn btn-primary btn-sm">${label}</a>`;
      const nb = document.getElementById('clubNewsWriteBtn');
      const ab = document.getElementById('clubArchiveWriteBtn');
      if (nb) nb.innerHTML = btnHtml('club-news-write.html',    '소식 등록');
      if (ab) ab.innerHTML = btnHtml('club-archive-write.html', '자료 등록');
    }
  },

  _switchTab(tab) {
    ['intro', 'news', 'archive'].forEach(t => {
      const el = document.getElementById(`tab-${t}`);
      if (el) el.style.display = t === tab ? 'block' : 'none';
    });
    if (tab === 'intro')   this._renderIntro();
    if (tab === 'news')    this._newsBoard?.render();
    if (tab === 'archive') this._archiveBoard?.render();
  },

  /* ── 동아리 소개 갤러리 렌더 */
  _renderIntro() {
    const desc = document.getElementById('clubIntroDesc');
    if (desc && CLUB_INTRO_TEXT) {
      desc.innerHTML = `
        <div class="intro-notice">
          <div class="intro-notice-title">숲동아리단이란?</div>
          <div class="intro-notice-body">${CLUB_INTRO_TEXT}</div>
        </div>`;
    }
    const grid = document.getElementById('clubIntroGrid');
    if (!grid) return;
    if (!CLUB_DATA.length) {
      grid.innerHTML = '<p style="padding:40px;text-align:center;color:var(--gray-mid)">등록된 동아리가 없습니다.</p>';
      return;
    }
    const sorted = [...CLUB_DATA].sort((a, b) => (b.recruiting ? 1 : 0) - (a.recruiting ? 1 : 0));
    grid.innerHTML = sorted.map(c => {
      const thumb = c.imgUrl
        ? `<div class="gallery-thumb" style="background-image:url('${c.imgUrl}')"></div>`
        : `<div class="gallery-thumb-placeholder"></div>`;
      const pinMark = c.recruiting
        ? `<div style="position:absolute;top:10px;left:10px;background:#b45309;color:#fff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:4px">고정</div>`
        : '';
      const recruitText = c.recruiting ? ' - ★회원모집중★' : '';
      return `
        <div class="gallery-card" onclick="location.href='?tab=intro&id=${c.id}'"
             style="cursor:pointer;position:relative">
          ${thumb}
          ${pinMark}
          <div class="gallery-info">
            <div class="gallery-title">${c.name}${recruitText}</div>
          </div>
        </div>`;
    }).join('');
  },

  /* ── 동아리 소개 상세 */
  renderClubDetail(id) {
    const item = CLUB_DATA.find(c => String(c.id) === String(id));
    const el   = document.getElementById('clubDetail');
    if (!el) return;
    if (!item) {
      el.innerHTML = '<div style="text-align:center;padding:48px;color:var(--gray-mid)">해당 동아리를 찾을 수 없습니다.</div>';
      return;
    }
    const idx  = CLUB_DATA.findIndex(c => c.id === item.id);
    const prev = CLUB_DATA[idx - 1];
    const next = CLUB_DATA[idx + 1];
    const thumb = item.imgUrl
      ? `<div class="gallery-thumb" style="background-image:url('${item.imgUrl}');height:200px;border-radius:var(--radius);margin-bottom:20px"></div>`
      : '';
    const navHtml = (next || prev) ? `
      <div class="cd-nav">
        ${next ? `<div class="cd-nav-item" onclick="location.href='?tab=intro&id=${next.id}'">
          <span class="cd-nav-label">다음</span>
          <span class="cd-nav-title">${next.name}</span>
        </div>` : ''}
        ${prev ? `<div class="cd-nav-item" onclick="location.href='?tab=intro&id=${prev.id}'">
          <span class="cd-nav-label">이전</span>
          <span class="cd-nav-title">${prev.name}</span>
        </div>` : ''}
      </div>` : '';
    const pinBadge    = item.recruiting ? `<span style="display:inline-block;background:#b45309;color:#fff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:4px;margin-right:8px;vertical-align:middle">고정</span>` : '';
    const recruitText = item.recruiting ? ' - ★회원모집중★' : '';
    el.innerHTML = `
      <div class="cd-wrap">
        <div class="cd-head">
          <div class="cd-head-left">
            <h2 class="cd-title">${pinBadge}${item.name}${recruitText}</h2>
          </div>
        </div>
        <hr class="cd-divider">
        ${thumb}
        <div class="cd-body">
          <div class="cd-content"><p>${item.desc || ''}</p></div>
        </div>
        ${navHtml}
        <div class="cd-actions">
          <button class="btn btn-primary btn-sm cd-btn-list"
                  onclick="location.href='?tab=intro'">목록</button>
        </div>
      </div>`;
  },

  /* ── 소식 검색 */
  searchNews() {
    const keyword = document.getElementById('clubNewsKeyword')?.value    || '';
    const club    = document.getElementById('clubNewsClubFilter')?.value || '';
    this._newsBoard?.filterFn(r => {
      if (club    && r.club !== club)                                         return false;
      if (keyword && !r.title.toLowerCase().includes(keyword.toLowerCase())) return false;
      return true;
    });
  },
  resetNews() {
    ['clubNewsKeyword', 'clubNewsClubFilter'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    this._newsBoard?.filterFn(null);
  },

  /* ── 자료방 검색 */
  searchArchive() {
    const keyword = document.getElementById('clubArchiveKeyword')?.value    || '';
    const club    = document.getElementById('clubArchiveClubFilter')?.value || '';
    this._archiveBoard?.filterFn(r => {
      if (club    && r.club !== club)                                         return false;
      if (keyword && !r.title.toLowerCase().includes(keyword.toLowerCase())) return false;
      return true;
    });
  },
  resetArchive() {
    ['clubArchiveKeyword', 'clubArchiveClubFilter'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    this._archiveBoard?.filterFn(null);
  },

  /* ── 소식·자료방 상세 렌더 */
  renderDetail(tab, id) {
    const data = tab === 'archive' ? CLUB_ARCHIVE_DATA : CLUB_NEWS_DATA;
    BoardDetail.render('clubDetail', data, id);
  },
};


/* ══════════════════════════════════════════════
   8. QnA (이게뭐예요) 컨트롤러
══════════════════════════════════════════════ */
const QnaCtrl = {
  _board:  null,
  _editId: null,

  STATUS_MAP: {
    answered: { label: '답변완료', cls: 'badge-green' },
    waiting:  { label: '답변대기', cls: 'badge-orange' },
  },

  init() {
    this._board = createBoard({
      data:         QNA_DATA,
      tableBodyId:  'qnaTableBody',
      paginationId: 'qnaPagination',
      countId:      'qnaCount',
      rowRenderer:  (row, seq) => {
        const s = this.STATUS_MAP[row.status] || this.STATUS_MAP.waiting;
        return `
          <tr>
            <td class="col-num center">${seq}</td>
            <td class="td-title">
              <a href="qna-detail.html?id=${row.id}">${row.title}</a>
            </td>
            <td class="col-extra center">${row.author}</td>
            <td class="col-status center">
              <span class="badge ${s.cls}">${s.label}</span>
            </td>
            <td class="col-date center">${row.date}</td>
          </tr>`;
      },
    });
    this._board.init();
  },

  /* 상세 렌더 */
  renderDetail() {
    const id   = App.getParam('id');
    const item = QNA_DATA.find(d => String(d.id) === String(id));
    if (!item) return;

    const el = document.getElementById('qnaDetail');
    if (!el) return;

    const s = this.STATUS_MAP[item.status] || this.STATUS_MAP.waiting;
    const statusCls = item.status === 'answered' ? 'cd-status-open' : 'cd-status-ready';

    /* 이전글/다음글 */
    const idx  = QNA_DATA.findIndex(d => d.id === item.id);
    const next = QNA_DATA[idx - 1];
    const prev = QNA_DATA[idx + 1];
    const navHtml = (next || prev) ? `
      <div class="cd-nav">
        ${next ? `<div class="cd-nav-item" onclick="location.href='qna-detail.html?id=${next.id}'">
          <span class="cd-nav-label">다음글</span>
          <span class="cd-nav-title">${next.title}</span>
        </div>` : ''}
        ${prev ? `<div class="cd-nav-item" onclick="location.href='qna-detail.html?id=${prev.id}'">
          <span class="cd-nav-label">이전글</span>
          <span class="cd-nav-title">${prev.title}</span>
        </div>` : ''}
      </div>` : '';

    /* 답변 영역 */
    const answerHtml = item.answer
      ? `<hr class="cd-divider">
         <div style="background:var(--green-pale);border-left:4px solid var(--green-main);
                     padding:20px 24px;">
           <div style="font-size:13px;font-weight:700;color:var(--green-dark);margin-bottom:10px">
             관리자 답변
           </div>
           <div style="font-size:14px;line-height:1.85;color:var(--gray-dark)">${item.answer}</div>
         </div>`
      : `<hr class="cd-divider">
         <div style="padding:20px 24px;text-align:center;color:var(--gray-mid);font-size:14px;">
           답변 준비 중입니다. 조금만 기다려 주세요.
         </div>`;

    const canMod = App.canModify(item);
    el.innerHTML = `
      <div class="cd-wrap">
        <div class="cd-head">
          <div class="cd-head-left">
            <h2 class="cd-title">${item.title}</h2>
            <span class="cd-status-badge ${statusCls}">${s.label}</span>
          </div>
          <span class="cd-date">${item.date}</span>
        </div>
        <div class="cd-meta">
          <span>작성자 <strong>${item.author}</strong></span>
        </div>
        <hr class="cd-divider">
        <div class="cd-body">
          <div class="cd-content">${item.content}</div>
        </div>
        ${answerHtml}
        ${navHtml}
        <div class="cd-actions">
          <button class="btn btn-primary btn-sm cd-btn-list"
                  onclick="history.back()">목록</button>
          ${canMod ? `<div class="cd-actions-right">
            <button class="btn btn-gray btn-sm"
                    onclick="location.href='qna-write.html?edit=${item.id}'">수정</button>
            <button class="btn btn-danger btn-sm"
                    onclick="App.deletePost(${item.id}, QNA_DATA, 'qna.html')">삭제</button>
          </div>` : ''}
        </div>
      </div>`;
  },
};


/* ══════════════════════════════════════════════
   9. 페이지 자동 초기화
   - HTML 의 data-page 속성으로 진입점 판별
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;

  const initMap = {
    'competency':               () => CompetencyCtrl.init(),
    'competency-detail':        () => CompetencyCtrl.renderDetail(),
    'academy-course-detail':    () => AcademyCourseCtrl.renderDetail(),
    'mentoring-course-detail':  () => MentoringCourseCtrl.renderDetail(),
    'mentoring':                () => MentoringCtrl.init(),
    'mentoring-detail':         () => MentoringCtrl.renderDetail(),
    'recruit':                  () => RecruitCtrl.init(),
    'recruit-detail':           () => RecruitCtrl.renderDetail(),
    'instructor':               () => InstructorCtrl.init(),
    'sagongdan':                () => SagongdanCtrl.init(),
    'club':                     () => ClubCtrl.init(),
    'qna':                      () => QnaCtrl.init(),
    'qna-detail':               () => QnaCtrl.renderDetail(),
  };

  if (page && initMap[page]) {
    initMap[page]();
  }
});
