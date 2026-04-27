/* =============================================
   admin.js | 관리자 공통 로직
   ─────────────────────────────────────────────
   [개발자 연동 가이드]
   1. ADMIN_API 객체의 base URL을 실제 서버 경로로 수정
   2. AdminHttp 메서드의 TODO 주석 위치에서 fetch() 호출
   3. 샘플 데이터(SAMPLE_*)는 실제 API 응답으로 교체
   ============================================= */
'use strict';

/* ──────────────────────────────────────────────
   ADMIN_API — 엔드포인트 상수 모음
   base만 바꾸면 전체 경로 일괄 반영됨
────────────────────────────────────────────── */
const ADMIN_API = {
  base: '/admin/api',

  members:               '/admin/api/members',
  memberWithdrawn:       '/admin/api/members/withdrawn',
  memberExcel:           '/admin/api/members/export',

  courses:               '/admin/api/courses',
  courseExcel:           '/admin/api/courses/export',

  applicants:            '/admin/api/applicants',
  applicantExcel:        '/admin/api/applicants/export',
  applicantRegister:     '/admin/api/applicants/register',

  calendar:              '/admin/api/calendar',

  board:                 '/admin/api/board',

  applyRegular:          '/admin/api/apply/regular',
  applyInstructor:       '/admin/api/apply/instructor',
  applyForest:           '/admin/api/apply/forest',
  applySponsor:          '/admin/api/apply/sponsor',

  instrSchedules:        '/admin/api/instructor-schedules',

  banners:               '/admin/api/site/banners',
  bannerOrder:           '/admin/api/site/banners/order',

  popups:                '/admin/api/site/popups',

  history:               '/admin/api/content/history',
  organization:          '/admin/api/content/organization',

  /* 일괄 처리·중복확인 엔드포인트 */
  memberDelete:          '/admin/api/members/bulk-delete',
  memberCheckId:         '/admin/api/members/check-id',
  courseDelete:          '/admin/api/courses/bulk-delete',
  boardBulkDelete:       '/admin/api/board/bulk-delete',
  applicantBulkDelete:   '/admin/api/applicants/bulk-delete',
  applicantBulkStatus:   '/admin/api/applicants/bulk-status',

  /**
   * :id 치환 헬퍼
   * 사용 예: ADMIN_API.url('members', 5) → '/admin/api/members/5'
   */
  url(key, id, suffix = '') {
    return `${this[key]}/${id}${suffix ? '/' + suffix : ''}`;
  },
};


/* ──────────────────────────────────────────────
   AdminHttp — fetch 공통 래퍼
   [개발자] 아래 메서드들이 실제 API 호출 진입점
   현재는 프로토타입이므로 Promise.resolve()로 반환
────────────────────────────────────────────── */
const AdminHttp = {

  /* CSRF 토큰 (Laravel 기준 — 프레임워크에 따라 교체) */
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
    console.log('[AdminHttp.get]', url, params);
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
    console.log('[AdminHttp.post]', url, body);
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
    console.log('[AdminHttp.upload]', url, formData);
    return Promise.resolve({ success: true });
  },

  /**
   * PUT 요청
   * [개발자 연동]
   *   return fetch(url, {
   *     method: 'PUT', headers: this._headers(),
   *     credentials: 'same-origin',
   *     body: JSON.stringify(body)
   *   }).then(r => this._handle(r));
   */
  put(url, body = {}) {
    // TODO: 실제 fetch 요청으로 교체
    console.log('[AdminHttp.put]', url, body);
    return Promise.resolve({ success: true });
  },

  /**
   * DELETE 요청
   * [개발자 연동]
   *   return fetch(url, {
   *     method: 'DELETE', headers: this._headers(false),
   *     credentials: 'same-origin'
   *   }).then(r => this._handle(r));
   */
  del(url) {
    // TODO: 실제 fetch 요청으로 교체
    console.log('[AdminHttp.del]', url);
    return Promise.resolve({ success: true });
  },

  /**
   * 엑셀 다운로드 (파일 스트리밍)
   * [개발자] 이 방식 그대로 유지 — 브라우저가 직접 파일 수신
   */
  downloadExcel(url, params = {}) {
    const qs = new URLSearchParams(params).toString();
    window.location.href = qs ? `${url}?${qs}` : url;
  },

  /* 응답 공통 처리 — 실제 fetch 연동 시 사용 */
  async _handle(res) {
    if (res.status === 401) {
      alert('세션이 만료되었습니다. 다시 로그인해주세요.');
      location.href = '../auth/login.html';
      return;
    }
    if (res.status === 403) {
      alert('접근 권한이 없습니다.');
      return;
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.message || `서버 오류 (${res.status})`);
    }
    return data;
  },
};


/* ──────────────────────────────────────────────
   AdminUI — 공통 UI 유틸
────────────────────────────────────────────── */
const AdminUI = {

  /**
   * tbody에 로딩 상태 표시
   * @param {string} tbodyId
   * @param {number} colSpan
   */
  showLoading(tbodyId, colSpan = 8) {
    const el = document.getElementById(tbodyId);
    if (!el) return;
    el.innerHTML = `<tr><td colspan="${colSpan}" class="td-empty">
      <span style="opacity:.5">불러오는 중…</span></td></tr>`;
  },

  /**
   * tbody에 빈 상태 표시
   */
  showEmpty(tbodyId, msg = '데이터가 없습니다.', colSpan = 8) {
    const el = document.getElementById(tbodyId);
    if (!el) return;
    el.innerHTML = `<tr><td colspan="${colSpan}" class="td-empty">${msg}</td></tr>`;
  },

  /**
   * tbody에 에러 상태 표시
   */
  showError(tbodyId, msg = '데이터를 불러오지 못했습니다.', colSpan = 8) {
    const el = document.getElementById(tbodyId);
    if (!el) return;
    el.innerHTML = `<tr><td colspan="${colSpan}" class="td-empty"
      style="color:#c0392b">${msg}</td></tr>`;
  },

  /**
   * 페이지네이션 렌더링
   * @param {string}   containerId - pagination div id
   * @param {number}   current     - 현재 페이지 (1-based)
   * @param {number}   totalPages  - 전체 페이지 수
   * @param {Function} onPage      - 페이지 클릭 콜백 fn(pageNum)
   */
  renderPagination(containerId, current, totalPages, onPage) {
    const el = document.getElementById(containerId);
    if (!el) return;
    if (totalPages <= 1) {
      el.innerHTML = `
        <button disabled aria-label="이전">&laquo;</button>
        <button class="active" aria-current="page">1</button>
        <button disabled aria-label="다음">&raquo;</button>`;
      return;
    }

    const G  = 10;
    const gs = Math.floor((current - 1) / G) * G + 1;
    const ge = Math.min(gs + G - 1, totalPages);

    let h = `<button ${current === 1 ? 'disabled' : ''}
               aria-label="이전">&laquo;</button>`;

    for (let i = gs; i <= ge; i++) {
      h += `<button class="${i === current ? 'active' : ''}"
              ${i === current ? 'aria-current="page"' : ''}
              data-p="${i}">${i}</button>`;
    }

    h += `<button ${current === totalPages ? 'disabled' : ''}
               aria-label="다음">&raquo;</button>`;

    el.innerHTML = h;

    const allBtns = el.querySelectorAll('button');
    /* 이전 */
    allBtns[0].addEventListener('click', () => {
      if (current > 1) onPage(current - 1);
    });
    /* 페이지 번호 */
    el.querySelectorAll('button[data-p]').forEach(btn => {
      btn.addEventListener('click', () => onPage(parseInt(btn.dataset.p)));
    });
    /* 다음 */
    allBtns[allBtns.length - 1].addEventListener('click', () => {
      if (current < totalPages) onPage(current + 1);
    });
  },

  /**
   * 목록 건수 텍스트 업데이트
   * @param {string} containerId - list-count 엘리먼트 id
   * @param {number} total
   */
  updateCount(containerId, total) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = `총 <strong>${total.toLocaleString()}</strong>건`;
  },
};


/* ──────────────────────────────────────────────
   관리자 사이드바 네비게이션 데이터
────────────────────────────────────────────── */
const _ICO = name => `../assets/icons/${name}.png`;

const ADMIN_NAV = [
  {
    key: 'member-group', ico: _ICO('users'), label: '회원관리',
    children: [
      { key: 'members',   href: 'members.html',          label: '회원관리' },
      { key: 'withdrawn', href: 'members-withdrawn.html', label: '탈퇴회원' },
    ],
  },
  {
    key: 'course-group', ico: _ICO('academic-cap'), label: '강좌관리',
    children: [
      { key: 'course-basic',      href: 'courses.html',              label: '기초과정 관리' },
      { key: 'course-qualify',    href: 'courses.html?type=qualify', label: '자격취득과정 관리' },
      { key: 'course-enhance',    href: 'courses.html?type=enhance', label: '역량강화 관리' },
      { key: 'course-academy',    href: 'courses.html?type=academy', label: '회원아카데미 관리' },
      { key: 'course-applicants', href: 'applicants.html',           label: '신청자 통합 관리' },
    ],
  },
  { key: 'calendar', href: 'calendar.html', ico: _ICO('calendar'), label: '일정관리' },
  {
    key: 'board-group', ico: _ICO('collection'), label: '게시판관리',
    children: [
      { key: 'board-notice',      href: 'board.html?type=notice',      label: '공지사항 관리' },
      { key: 'board-newsletter',  href: 'board.html?type=newsletter',  label: '협회지 관리' },
      { key: 'board-press',       href: 'board.html?type=press',       label: '언론보도 관리' },
      { key: 'board-forest-work', href: 'board.html?type=forest-work', label: '숲일터 관리' },
      { key: 'board-region',      href: 'board.html?type=region',      label: '전국지역협회 관리' },
      { key: 'board-intro',       href: 'board.html?type=intro',       label: '사공단소개 관리' },
      { key: 'board-club',        href: 'board.html?type=club',        label: '동아리소개 관리' },
    ],
  },
  {
    key: 'site-group', ico: _ICO('cog'), label: '사이트관리',
    children: [
      { key: 'site-banner', href: 'banner.html', label: '배너 관리' },
      { key: 'site-popup',  href: 'popup.html',  label: '팝업 관리' },
    ],
  },
  {
    key: 'content-group', ico: _ICO('pencil-alt'), label: '콘텐츠관리',
    children: [
      { key: 'history',      href: 'history.html',      label: '연혁 관리' },
      { key: 'organization', href: 'organization.html', label: '조직도·임원진 관리' },
    ],
  },
  {
    key: 'instructor-group', ico: _ICO('academic-cap'), label: '강사신청 관리',
    children: [
      { key: 'instructor-schedule', href: 'courses.html?type=instructor', label: '강사신청 일정 관리' },
      { key: 'apply-instructor',    href: 'applicants.html?type=instructor', label: '강사신청자 관리' },
    ],
  },
  {
    key: 'apply-group', ico: _ICO('inbox'), label: '기타신청관리',
    children: [
      { key: 'apply-regular',  href: 'apply-regular.html',  label: '정회원신청자 관리' },
      { key: 'apply-forest',   href: 'apply-forest.html',   label: '숲해설신청자 관리' },
      { key: 'apply-sponsor',  href: 'apply-sponsor.html',  label: '후원신청자 관리' },
    ],
  },
];


/* ──────────────────────────────────────────────
   AdminSidebar — 2단 아코디언 사이드바
────────────────────────────────────────────── */
const AdminSidebar = {

  mount(activeKey) {
    const mountEl = document.getElementById('adminNavMount');
    if (!mountEl) return;

    const activeGroupKey = (() => {
      for (const item of ADMIN_NAV) {
        if (item.children?.some(c => c.key === activeKey)) return item.key;
      }
      return null;
    })();

    mountEl.innerHTML = ADMIN_NAV.map(item => {
      if (!item.children) {
        return `<a href="${item.href}"
                   class="admin-nav-item ${item.key === activeKey ? 'active' : ''}"
                   aria-current="${item.key === activeKey ? 'page' : 'false'}">
                  <img class="nav-ico" src="${item.ico}" alt="" aria-hidden="true">
                  <span class="nav-txt">${item.label}</span>
                </a>`;
      }

      const isOpen    = item.key === activeGroupKey;
      const firstHref = item.children[0].href;

      return `<div class="nav-group ${isOpen ? 'open' : ''}">
        <button class="admin-nav-item nav-group-header"
                onclick="AdminSidebar.toggleGroup(this, '${firstHref}')">
          <img class="nav-ico" src="${item.ico}" alt="" aria-hidden="true">
          <span class="nav-txt">${item.label}</span>
          <img class="nav-arrow" src="${_ICO('chevron-right')}" alt="" aria-hidden="true">
        </button>
        <div class="nav-submenu">
          ${item.children.map(child => `
            <a href="${child.href}"
               class="nav-sub-item ${child.key === activeKey ? 'active' : ''}">
              ${child.label}
            </a>`).join('')}
        </div>
      </div>`;
    }).join('');
  },

  toggleGroup(btn, firstHref) {
    const group  = btn.closest('.nav-group');
    const isOpen = group.classList.contains('open');
    document.querySelectorAll('.nav-group.open').forEach(g => g.classList.remove('open'));
    if (!isOpen) {
      group.classList.add('open');
      if (firstHref && firstHref !== '#') location.href = firstHref;
    }
  },
};


/* ──────────────────────────────────────────────
   AdminTopbar — 상단바 자동 주입
────────────────────────────────────────────── */
const AdminTopbar = {

  render() {
    return `
      <button class="adm-mobile-menu-btn"
              onclick="AdminLayout.toggleSidebar()"
              aria-label="메뉴 열기">
        <img src="../assets/icons/menu.png" alt="메뉴"
             onerror="this.style.display='none';this.parentNode.textContent='☰'">
      </button>
      <div class="adm-brand">
        <span class="adm-brand-text">한국숲해설가협회</span>
        <span class="adm-brand-badge">Admin</span>
      </div>
      <div class="adm-topbar-right">
        <div class="adm-user">
          <div class="adm-user-avatar">A</div>
          <span class="adm-user-name">관리자</span>
        </div>
        <div class="adm-divider"></div>
        <a href="../index.html" class="adm-home-btn" target="_blank">HOMEPAGE</a>
        <button class="adm-logout-btn" onclick="AdminTopbar.logout()">로그아웃</button>
      </div>`;
  },

  logout() {
    if (!confirm('로그아웃 하시겠습니까?')) return;
    /* [개발자] 세션/토큰 삭제 API 호출 후 리다이렉트 */
    App.toast('로그아웃 되었습니다.', 'success');
    setTimeout(() => { location.href = '../index.html'; }, 800);
  },

  mount() {
    if (document.querySelector('.adm-topbar')) return;
    const topbar = document.createElement('header');
    topbar.className = 'adm-topbar';
    topbar.id        = 'adminTopbarEl';
    topbar.innerHTML = this.render();
    const layout = document.querySelector('.admin-layout');
    if (layout?.parentNode) layout.parentNode.insertBefore(topbar, layout);
    else document.body.prepend(topbar);

    if (!document.getElementById('sidebarBackdrop')) {
      const bd = document.createElement('div');
      bd.className = 'sidebar-backdrop';
      bd.id        = 'sidebarBackdrop';
      bd.addEventListener('click', () => AdminLayout.closeSidebar());
      document.body.appendChild(bd);
    }
  },
};

document.addEventListener('DOMContentLoaded', () => AdminTopbar.mount());


/* ──────────────────────────────────────────────
   AdminLayout — 사이드바 토글
────────────────────────────────────────────── */
const AdminLayout = {
  toggleSidebar() {
    const sb = document.getElementById('adminSidebar');
    if (!sb) return;
    if (window.innerWidth <= 1100) {
      const isOpen = sb.classList.toggle('mobile-open');
      const bd = document.getElementById('sidebarBackdrop');
      if (bd) bd.classList.toggle('open', isOpen);
    } else {
      document.querySelector('.admin-layout')?.classList.toggle('sidebar-collapsed');
    }
  },
  closeSidebar() {
    document.getElementById('adminSidebar')?.classList.remove('mobile-open');
    document.getElementById('sidebarBackdrop')?.classList.remove('open');
  },
};


/* ──────────────────────────────────────────────
   날짜 프리셋 — 전역 유틸 (각 페이지에서 호출)
   사용법: setDatePreset('today'), setDatePreset(7)
────────────────────────────────────────────── */
function setDatePreset(range, fromId = 'filterDateFrom', toId = 'filterDateTo') {
  const fmt = d => d.toISOString().split('T')[0];
  const to   = new Date();
  const from = new Date();
  if (range !== 'today') from.setDate(from.getDate() - range);
  const fromEl = document.getElementById(fromId);
  const toEl   = document.getElementById(toId);
  if (fromEl) fromEl.value = fmt(from);
  if (toEl)   toEl.value   = fmt(to);
}