/* =============================================
   app.js | 전역 App 객체 / 공통 유틸
   ============================================= */
'use strict';

const App = {

  /* ── 사용자 상태 (실제 구현 시 서버 세션으로 교체) */
  user: {
    isLoggedIn: false,
    name: '',
    role: 'guest',   // guest | member | fullMember | admin
    grade: '',
  },

  /* ── 로그인 처리 */
  login(userData) {
    this.user = {
      isLoggedIn: true,
      name: userData.name || '',
      role: userData.role || 'member',
      grade: userData.grade || '준회원',
    };
    /* 로컬스토리지에 세션 저장 */
    localStorage.setItem('appUser', JSON.stringify(this.user));
  },

  /* ── 로그아웃 처리 */
  logout() {
    localStorage.removeItem('appUser');
    this.user = {
      isLoggedIn: false,
      name: '',
      role: 'guest',
      grade: '',
    };
    this.toast('로그아웃 되었습니다.');
    setTimeout(() => {
      location.href = '/pm-workspace/projects/foresto_homepage/outputs/index.html';  // ← 여기로 무조건 고정
    }, 800);
  },


  /* ── 세션 복원 (모든 페이지 진입 시 자동 호출) */
  restoreSession() {
    try {
      const saved = localStorage.getItem('appUser');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.isLoggedIn) this.user = parsed;
      }
    } catch (e) { /* 파싱 오류 무시 */ }
  },

  /* ── 날짜 포맷 */
  fmtDate(str) {
    if (!str) return '';
    const d = new Date(str);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  },

  /* ── 상대 경로 계산 (depth 기준) */
  getRoot(depth = 1) {
    return '../'.repeat(depth);
  },

  /* ── 알림 */
  toast(msg, type = 'success') {
    alert(msg);
  },

  /* ── 토스트 UI (글자크기 조정 전용) */
  toastUI(msg, type = 'info') {
    let el = document.getElementById('toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.className = `toast-${type}`;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 3000);
  },

  /* ── 모달 열기/닫기
       모달 요소에 role="dialog" aria-modal="true" aria-labelledby="..." 권장 */
  openModal(id) {
    const m = document.getElementById(id);
    if (m) {
      m.classList.add('open');
      m.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      /* 포커스 트랩: 모달 내 첫 번째 포커서블 요소로 이동 */
      const focusable = m.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable) focusable.focus();
    }
  },
  closeModal(id) {
    const m = document.getElementById(id);
    if (m) {
      m.classList.remove('open');
      m.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  },

  /* ── 탭 초기화 */
  initTabs(wrap) {
    const btns = wrap.querySelectorAll('.tab-btn');
    const panels = wrap.querySelectorAll('.tab-panel');
    const activate = i => {
      btns.forEach((b, j) => b.classList.toggle('active', i === j));
      panels.forEach((p, j) => p.style.display = i === j ? 'block' : 'none');
    };
    btns.forEach((b, i) => b.addEventListener('click', () => activate(i)));
    activate(0);
  },

  /* ── 페이지네이션 렌더 */
  renderPagination(containerId, current, total, onPage) {
    const el = document.getElementById(containerId);
    if (!el || total <= 1) {
      if (el) el.innerHTML = '';
      return;
    }
    const G = 10;
    const gs = Math.floor((current - 1) / G) * G + 1;
    const ge = Math.min(gs + G - 1, total);

    let h = `<button class="page-btn arrow"
                     ${current === 1 ? 'disabled' : ''}
                     data-p="${current - 1}">&#8249;</button>`;

    for (let i = gs; i <= ge; i++) {
      h += `<button class="page-btn ${i === current ? 'active' : ''}"
                    data-p="${i}">${i}</button>`;
    }

    h += `<button class="page-btn arrow"
                  ${current === total ? 'disabled' : ''}
                  data-p="${current + 1}">&#8250;</button>`;

    el.innerHTML = h;
    el.querySelectorAll('.page-btn:not([disabled])').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = parseInt(btn.dataset.p);
        if (p >= 1 && p <= total) onPage(p);
      });
    });
  },

  /* ── URL 파라미터 파싱 */
  getParam(key) {
    return new URLSearchParams(location.search).get(key);
  },

  /* ── 게시물 수정·삭제 권한 체크 (CLAUDE.md 2026-03-19 정책)
   *    관리자: 전체 게시판 모든 글
   *    작성자 본인: 자신이 작성한 글만
   *    실제 서버 환경에서는 item.authorId === App.user.id 로 비교
   */
  canModify(item) {
    if (!App.user?.isLoggedIn) return false;
    if (App.user.role === 'admin') return true;
    return App.user.name === (item.author || '');
  },

  /* ── 게시물 소프트 삭제
   *    @param {string|number} id       - 삭제할 게시물 id
   *    @param {Array|Array[]} arrays   - 탐색할 데이터 배열 (단일 또는 배열의 배열)
   *    @param {string}        listUrl  - 삭제 후 이동할 목록 URL
   */
  deletePost(id, arrays, listUrl) {
    if (!confirm('게시물을 삭제하시겠습니까?\n삭제된 게시물은 복구되지 않습니다.')) return;
    const targets = (Array.isArray(arrays[0]) ? arrays : [arrays]);
    for (const arr of targets) {
      const idx = arr.findIndex(d => String(d.id) === String(id));
      if (idx !== -1) {
        arr[idx].deleted_at = new Date().toISOString(); /* 소프트 삭제 */
        break;
      }
    }
    App.toast('게시물이 삭제되었습니다.', 'success');
    setTimeout(() => { location.href = listUrl; }, 700);
  },

  /* ── 글자 크기 조절 */
  fontSize: {
    _step: 0,          // 현재 단계 (-2 ~ +3)
    _min: -2,
    _max: 3,
    _key: 'fontSizeStep',
    _sizes: [12, 14, 16, 18, 20, 22],   // step -2 ~ +3 기준 px
    _base: 16,                          // 기본 root font-size

    init() {
      const saved = parseInt(localStorage.getItem(this._key) || '0');
      this._step = Math.max(this._min, Math.min(this._max, saved));
      this._apply();
    },

    up() {
      if (this._step >= this._max) {
        App.toastUI('최대 글자 크기입니다.', 'info');
        return;
      }
      this._step++;
      this._apply();
      this._save();
    },

    down() {
      if (this._step <= this._min) {
        App.toastUI('최소 글자 크기입니다.', 'info');
        return;
      }
      this._step--;
      this._apply();
      this._save();
    },

    reset() {
      this._step = 0;
      this._apply();
      this._save();
      App.toastUI('글자 크기를 기본으로 되돌렸습니다.', 'info');
    },

    _apply() {
      const size = this._base + this._step * 2;
      const scale = size / this._base;

      /* 1. html font-size → rem 단위 전체 반영 */
      document.documentElement.style.fontSize = size + 'px';

      /* 2. body font-size 직접 적용 */
      document.body.style.fontSize = size + 'px';

      /* 3. CSS 변수 px 값도 scale에 맞게 덮어쓰기
            기준(step=0): md=18px(목록/본문), lg=22px(타이틀 = md+4px) */
      const r = document.documentElement;
      r.style.setProperty('--text-xs', Math.round(13 * scale) + 'px'); /* 13px */
      r.style.setProperty('--text-sm', Math.round(15 * scale) + 'px'); /* 15px */
      r.style.setProperty('--text-md', Math.round(18 * scale) + 'px'); /* 18px — 목록·본문 기준 */
      r.style.setProperty('--text-base', Math.round(20 * scale) + 'px'); /* 20px */
      r.style.setProperty('--text-lg', Math.round(22 * scale) + 'px'); /* 22px — 타이틀 */
      r.style.setProperty('--text-xl', Math.round(24 * scale) + 'px'); /* 24px */
      r.style.setProperty('--text-2xl', Math.round(30 * scale) + 'px'); /* 30px */
      r.style.setProperty('--text-3xl', Math.round(36 * scale) + 'px'); /* 36px */
      r.style.setProperty('--text-4xl', Math.round(44 * scale) + 'px'); /* 44px */

      /* 4. 헤더 글자크기 버튼 active 상태 동기화 */
      document.querySelectorAll('.font-btn').forEach(btn => {
        btn.classList.remove('active');
        const sz = btn.dataset.size;
        if ((sz === 'sm' && this._step < 0) ||
          (sz === 'md' && this._step === 0) ||
          (sz === 'lg' && this._step > 0)) {
          btn.classList.add('active');
        }
      });
    },


    _save() {
      localStorage.setItem(this._key, String(this._step));
    },
  },

};


/* ══════════════════════════════════════════════
   USER_API — 사용자 페이지 엔드포인트 상수
   [개발자 연동 가이드]
   1. base URL을 실제 서버 경로로 수정
   2. UserHttp 메서드의 TODO 위치에서 fetch() 호출
   3. 샘플 데이터(SAMPLE_*)는 실제 API 응답으로 교체
══════════════════════════════════════════════ */
const USER_API = {
  base: '/api',

  /* 강좌·교육 */
  courses:           '/api/courses',
  courseDetail:      '/api/courses/:id',
  courseApply:       '/api/courses/:id/apply',

  /* 커뮤니티 */
  notices:           '/api/board/notice',
  gallery:           '/api/board/gallery',
  newsletter:        '/api/board/newsletter',
  archive:           '/api/board/archive',
  press:             '/api/board/press',
  calendar:          '/api/calendar',

  /* 회원 인증 */
  login:             '/api/auth/login',
  logout:            '/api/auth/logout',
  register:          '/api/auth/register',
  findId:            '/api/auth/find-id',
  findPw:            '/api/auth/find-pw',

  /* 회원활동 */
  clubs:             '/api/member/clubs',
  sagongdan:         '/api/member/sagongdan',
  instructors:       '/api/member/instructors',
  mentoring:         '/api/member/mentoring',
  forestWork:        '/api/member/forest-work',
  competency:        '/api/member/competency',

  /* 신청 */
  applyRegular:      '/api/apply/regular',
  applyInstructor:   '/api/apply/instructor',
  applyForest:       '/api/apply/forest',
  applyDonate:       '/api/apply/donate',

  /* 마이페이지 */
  myProfile:         '/api/my/profile',
  myApply:           '/api/my/apply',
  myCert:            '/api/my/certificates',
  myPwChange:        '/api/my/password',

  /**
   * :id 치환 헬퍼
   * 사용 예: USER_API.url('courseDetail', 5) → '/api/courses/5'
   */
  url(key, id, suffix = '') {
    return `${this[key].replace(':id', id)}${suffix ? '/' + suffix : ''}`;
  },
};


/* ══════════════════════════════════════════════
   UserHttp — fetch 공통 래퍼 (AdminHttp 대응)
   [개발자] 아래 메서드들이 실제 API 호출 진입점
   현재는 프로토타입이므로 Promise.resolve()로 반환
══════════════════════════════════════════════ */
const UserHttp = {

  _csrf() {
    return document.querySelector('meta[name="csrf-token"]')?.content || '';
  },

  _headers(isJson = true) {
    const h = { 'X-CSRF-TOKEN': this._csrf() };
    if (isJson) h['Content-Type'] = 'application/json';
    return h;
  },

  /**
   * GET 요청
   * [개발자 연동]
   *   return fetch(`${url}?${new URLSearchParams(params)}`, {
   *     headers: this._headers(false), credentials: 'same-origin'
   *   }).then(r => this._handle(r));
   */
  get(url, params = {}) {
    // TODO: 실제 fetch 요청으로 교체
    console.log('[UserHttp.get]', url, params);
    return Promise.resolve({ success: true, total: 0, items: [] });
  },

  /**
   * POST 요청 (JSON body)
   * [개발자 연동]
   *   return fetch(url, {
   *     method: 'POST', headers: this._headers(),
   *     credentials: 'same-origin',
   *     body: JSON.stringify(body)
   *   }).then(r => this._handle(r));
   */
  post(url, body = {}) {
    // TODO: 실제 fetch 요청으로 교체
    console.log('[UserHttp.post]', url, body);
    return Promise.resolve({ success: true });
  },

  /**
   * PUT 요청 (수정)
   * [개발자 연동]
   *   return fetch(url, {
   *     method: 'PUT', headers: this._headers(),
   *     credentials: 'same-origin',
   *     body: JSON.stringify(body)
   *   }).then(r => this._handle(r));
   */
  put(url, body = {}) {
    // TODO: 실제 fetch 요청으로 교체
    console.log('[UserHttp.put]', url, body);
    return Promise.resolve({ success: true });
  },

  /**
   * DELETE 요청
   * [개발자 연동]
   *   return fetch(url, {
   *     method: 'DELETE', headers: this._headers(),
   *     credentials: 'same-origin'
   *   }).then(r => this._handle(r));
   */
  delete(url) {
    // TODO: 실제 fetch 요청으로 교체
    console.log('[UserHttp.delete]', url);
    return Promise.resolve({ success: true });
  },

  /**
   * POST 요청 (FormData — 파일 업로드)
   * [개발자 연동]
   *   return fetch(url, {
   *     method: 'POST', headers: { 'X-CSRF-TOKEN': this._csrf() },
   *     credentials: 'same-origin', body: formData
   *   }).then(r => this._handle(r));
   */
  upload(url, formData) {
    // TODO: 실제 fetch 요청으로 교체
    console.log('[UserHttp.upload]', url);
    return Promise.resolve({ success: true });
  },

  /* 응답 처리 헬퍼 — 개발자 연동 후 사용
   * _handle(res) {
   *   if (!res.ok) return res.json().then(e => Promise.reject(e));
   *   return res.json();
   * },
   */
};


/* ── 페이지 진입 시 세션 자동 복원 */
App.restoreSession();
App.fontSize.init();   // ← 추가




/* ── 모달 외부 클릭 닫기 */
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    App.closeModal(e.target.id);
  }
});

/* ── ESC 닫기 */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open')
      .forEach(m => App.closeModal(m.id));
  }
});


/* ══════════════════════════════════════════════
   DOM 준비 후 공통 초기화
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── 글자크기 버튼 active 상태 초기화 */
  App.fontSize._apply();

  /* ── 모바일 가로 스크롤 탭: active 탭이 뷰포트 안에 들어오도록 스크롤 조정 */
  const pageTabs = document.querySelector('.page-tabs');
  if (pageTabs) {
    const activeTab = pageTabs.querySelector('.page-tab.active');
    if (activeTab) {
      /* active 탭을 컨테이너 중앙에 배치 (페이지 전체 스크롤 방지) */
      const tabLeft = activeTab.offsetLeft;
      const tabWidth = activeTab.offsetWidth;
      const containerW = pageTabs.offsetWidth;
      pageTabs.scrollLeft = tabLeft - (containerW / 2) + (tabWidth / 2);
    }
  }
});
