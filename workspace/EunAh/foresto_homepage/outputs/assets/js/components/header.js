/* =============================================
   header.js | 헤더 / 푸터 렌더링
   ============================================= */
'use strict';

const NAV_DATA = [
  /* ──────────────────────────────────────────
     1depth: 소개
     2depth: 협회 소개 / 조직 안내 / 회원 안내
  ────────────────────────────────────────── */
  {
    label: '소개', href: 'about/index.html',
    children: [
      {
        label: '협회 소개', href: 'about/index.html',
        children: [
          { label: '인사말', href: 'about/index.html' },
          { label: '미션 & 비전', href: 'about/vision.html' },
          { label: '주요 사업', href: 'about/project.html' },
          { label: '연혁', href: 'about/history.html' },
          { label: '오시는 길', href: 'about/contact.html' },
        ],
      },
      {
        label: '조직 안내', href: 'about/members.html',
        children: [
          { label: '조직도·임원진', href: 'about/members.html' },
          { label: '전국 지역협회', href: 'about/regions.html' },
          { label: '지역협회 상세', href: 'about/region-detail.html', parent: 'about/regions.html', hideLnb: true },
        ],
      },
      {
        label: '회원 안내', href: 'about/regulation.html',
        children: [
          { label: '회원 규정', href: 'about/regulation.html' },
          { label: '정회원 가입 안내', href: 'participate/membership.html' },
          { label: '정회원 신청', href: 'participate/regular-apply.html', parent: 'participate/membership.html', hideLnb: true },
          { label: '후원 안내', href: 'participate/donate-info.html' },
          { label: '후원하기', href: 'participate/donate.html', parent: 'participate/donate-info.html', hideLnb: true },
        ],
      },
    ],
  },

  /* ──────────────────────────────────────────
     1depth: 교육과정
     2depth: 숲해설가란 / 기초 과정 / 자격취득 과정 / 역량강화 과정
  ────────────────────────────────────────── */
  {
    label: '교육과정', href: 'education/forester.html',
    children: [
      {
        label: '숲해설가란', href: 'education/forester.html',
        children: [
          { label: '숲해설가 알아보기', href: 'education/forester.html' },
          { label: '자주 묻는 질문', href: 'education/faq.html' },
        ],
      },
      {
        label: '기초 과정', href: 'education/academy.html',
        children: [
          { label: '과정 개요', href: 'education/academy.html' },
          { label: '과정 신청', href: 'education/academy-apply.html' },
        ],
      },
      {
        label: '자격취득 과정', href: 'education/course-intro.html',
        children: [
          { label: '과정 개요', href: 'education/course-intro.html' },
          { label: '과정 신청', href: 'education/course-list.html' },
          { label: '수료생 후기', href: 'education/reviews.html' },
        ],
      },
      {
        label: '역량강화 과정', href: 'education/job-training.html',
        children: [
          { label: '과정 개요', href: 'education/job-training.html' },
          { label: '과정 신청', href: 'education/job-training-apply.html' },
        ],
      },
    ],
  },

  /* ──────────────────────────────────────────
     1depth: 회원활동
     2depth: 회원아카데미 / 사회공헌사업단 / 숲동아리단 / 숲일터 / 자료실 / 강사 신청
  ────────────────────────────────────────── */
  {
    label: '회원활동', href: 'member/competency.html',
    children: [
      {
        label: '회원아카데미', href: 'member/competency.html',
        children: [
          { label: '특강', href: 'member/competency.html' },
          { label: '강좌', href: 'member/academy-course.html' },
          { label: '멘토링 숲학교', href: 'member/mentoring.html' },
        ],
      },
      {
        label: '사회공헌사업단', href: 'member/sagongdan.html',
        children: [
          { label: '사공단 소개', href: 'member/sagongdan.html' },
          { label: '사공단 소식', href: 'member/sagongdan.html?tab=news' },
          { label: '사공단 일지', href: 'member/sagongdan.html?tab=log' },
        ],
      },
      {
        label: '숲동아리단', href: 'member/club.html',
        children: [
          { label: '동아리 소개', href: 'member/club.html' },
          { label: '동아리 소식', href: 'member/club.html?tab=news' },
        ],
      },
      { label: '자료실', href: 'community/archive.html' },
      { label: '숲일터', href: 'member/forest-work.html' },
      { label: '강사 신청', href: 'member/instructor.html' },
    ],
  },

  /* ──────────────────────────────────────────
     1depth: 커뮤니티
     2depth: 소식 / 갤러리(flat)
  ────────────────────────────────────────── */
  {
    label: '커뮤니티', href: 'community/notice-list.html',
    children: [
      {
        label: '소식', href: 'community/notice-list.html',
        children: [
          { label: '공지사항', href: 'community/notice-list.html' },
          { label: '협회 캘린더', href: 'community/calendar.html' },
          { label: '협회지', href: 'community/newsletter.html' },
          { label: '협회지 상세', href: 'community/newsletter-detail.html', parent: 'community/newsletter.html', hideLnb: true },
          { label: '언론 보도', href: 'community/press.html' },
          { label: '언론보도 상세', href: 'community/press-detail.html', parent: 'community/press.html', hideLnb: true },
        ],
      },
      { label: '갤러리', href: 'community/gallery.html' },
    ],
  },

  /* ──────────────────────────────────────────
     1depth: 숲해설 신청 (단독 페이지)
  ────────────────────────────────────────── */
  { label: '숲해설 신청', href: 'forest/index.html' },
];

/* ── 글자 크기 제어 (REQ-003) ──────────────────
   CSS data-font 속성 기반: sm / md(기본) / lg
   html[data-font="lg"] { font-size: 112.5% } 등 variables.css 에서 관리
────────────────────────────────────────── */
const FontSize = {
  SIZES: ['sm', 'md', 'lg'],
  current: 'md',

  increase() {
    const idx = this.SIZES.indexOf(this.current);
    if (idx < this.SIZES.length - 1) {
      this.current = this.SIZES[idx + 1];
      this._apply();
    }
  },

  decrease() {
    const idx = this.SIZES.indexOf(this.current);
    if (idx > 0) {
      this.current = this.SIZES[idx - 1];
      this._apply();
    }
  },

  reset() {
    this.current = 'md';
    this._apply();
  },

  _apply() {
    document.documentElement.setAttribute('data-font', this.current);
    /* 버튼 활성 상태 업데이트 */
    document.querySelectorAll('.font-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.size === this.current) btn.classList.add('active');
    });
  },
};

const Header = {

  render(activePage = '', root = '../') {
    const navHtml = NAV_DATA.map(n => {
      /* isActive: 레이블 일치 or 직접 children href 일치 or 중첩 3뎁스 href 일치 */
      const isActive = n.label === activePage
        || n.children?.some(c =>
          c.href === activePage
          || c.children?.some(gc => gc.href === activePage)
        );

      if (!n.children) {
        return `<div class="nav-item ${isActive ? 'active' : ''}">
          <a href="${root}${n.href}">${n.label}</a>
        </div>`;
      }

      /* 2depth 전체를 세로 목록으로 */
      const subHtml = n.children.map(c =>
        `<a href="${root}${c.href}" class="sub-item">${c.label}</a>`
      ).join('');

      return `<div class="nav-item has-dropdown ${isActive ? 'active' : ''}">
        <a href="${root}${n.href}">${n.label}<span class="arrow"></span></a>
        <div class="dropdown">${subHtml}</div>
      </div>`;
    }).join('');

    /* ── 로그인 여부에 따른 우측 버튼 분기 */
    const authHtml = App.user.isLoggedIn
      ? `<span class="header-username">
           ${App.user.name} (${App.user.grade})
         </span>
         <a href="${root}mypage/index.html"
            class="btn btn-primary btn-sm">마이페이지</a>
         ${App.user.role === 'admin'
        ? `<a href="${root}admin/members.html"
                 class="btn btn-gray btn-sm">관리자</a>`
        : ''}
         <button class="btn btn-gray btn-sm"
                 onclick="App.logout()">로그아웃</button>`
      : `<a href="${root}auth/login.html"
            class="btn btn-outline btn-sm">로그인</a>
         <a href="${root}auth/register.html"
            class="btn btn-primary btn-sm">회원가입</a>`;

    /* ── 모바일 내비 */
    const mobileNavHtml = NAV_DATA.map((n, ni) => {
      if (!n.children) {
        return `<a href="${root}${n.href}" class="mnav-1item-flat">${n.label}</a>`;
      }
      const l2Html = n.children.map((c, ci) => {
        if (!c.children) {
          return `<a href="${root}${c.href}" class="mnav-2item">${c.label}</a>`;
        }
        const id = `m3_${ni}_${ci}`;
        const visibleL3 = c.children.filter(gc => !gc.hideLnb);
        const l3Html = visibleL3.map(gc =>
          `<a href="${root}${gc.href}" class="mnav-3item">${gc.label}</a>`
        ).join('');
        return `<div class="mnav-2item has-sub" onclick="Header.toggle3depth('${id}', this)">
            ${c.label}<span class="arrow"></span>
          </div>
          <div class="mnav-3wrap" id="${id}">${l3Html}</div>`;
      }).join('');
      return `<div class="mnav-1item" onclick="Header.toggle2depth('m2_${ni}', this)">
          ${n.label}<span class="arrow"></span>
        </div>
        <div class="mnav-2wrap" id="m2_${ni}">${l2Html}</div>`;
    }).join('');

    /* ── 모바일 하단 인증 영역 */
    const mobileAuthHtml = App.user.isLoggedIn
      ? `<a href="${root}mypage/index.html"
            class="btn btn-outline btn-sm"
            style="width:100%;margin-bottom:8px;justify-content:center">
           마이페이지
         </a>
         <button class="btn btn-gray btn-sm"
                 style="width:100%;justify-content:center"
                 onclick="App.logout()">로그아웃</button>`
      : `<a href="${root}auth/login.html"
            class="btn btn-outline btn-sm"
            style="width:100%;margin-bottom:8px;justify-content:center">
           로그인
         </a>
         <a href="${root}auth/register.html"
            class="btn btn-primary btn-sm"
            style="width:100%;justify-content:center">
           회원가입
         </a>`;

    return `
    <header class="site-header">

      <!-- ── row 1: 사이트맵 + 글자크기 (고정 row → 폰트 크기 변경 시 버튼 위치 불변) -->
      <div class="header-util">
        <div class="header-util-inner">
          <a href="${root}sitemap.html" class="sitemap-link" title="사이트맵">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
            <span class="sitemap-label">사이트맵</span>
          </a>
          <div class="font-ctrl" aria-label="글자 크기 조절">
            <button class="font-btn" data-size="sm"
                    onclick="App.fontSize.down()" title="글자 축소"
                    aria-label="글자 축소">가-</button>
            <button class="font-btn active" data-size="md"
                    onclick="App.fontSize.reset()" title="기본 크기"
                    aria-label="기본 글자 크기">가</button>
            <button class="font-btn" data-size="lg"
                    onclick="App.fontSize.up()" title="글자 확대"
                    aria-label="글자 확대">가+</button>
          </div>
        </div>
      </div>

      <!-- ── row 2: 로고 + 내비 + 인증 -->
      <div class="header-inner">
        <a href="${root}index.html" class="logo">
          <div class="logo-img">
            <img src="${root}assets/image/logo.png" alt="한국숲해설가협회">
          </div>
        </a>

        <nav class="main-nav" id="mainNav">${navHtml}</nav>

        <div class="header-actions">
          <div id="authArea">${authHtml}</div>
          <a href="${root}sitemap.html" class="mobile-sitemap-btn" title="사이트맵" aria-label="사이트맵">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
          </a>
          <button class="hamburger" id="hamburger"
                  onclick="Header.toggleMobileMenu()"
                  aria-label="메뉴 열기/닫기"
                  aria-expanded="false"
                  aria-controls="mobileNav">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

    </header>

    <div class="mobile-nav" id="mobileNav">
      ${mobileNavHtml}
      <div style="padding:16px 24px;display:flex;
                  flex-direction:column;gap:8px">
        ${mobileAuthHtml}
      </div>
    </div>`;
  },

  _lockScrollY: 0,

  toggleMobileMenu() {
    const nav = document.getElementById('mobileNav');
    const btn = document.getElementById('hamburger');
    const open = nav.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');

    if (open) {
      Header._lockScrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${Header._lockScrollY}px`;
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, Header._lockScrollY);
    }
  },

  toggleMobileSub(id, el) {
    const sub = document.getElementById(id);
    if (!sub) return;
    const open = sub.classList.toggle('open');
    const arrow = el.querySelector('.arrow');
    if (arrow) arrow.style.transform = open ? 'rotate(180deg)' : '';
  },

  toggle2depth(id, el) {
    const wrap = document.getElementById(id);
    if (!wrap) return;
    const open = wrap.classList.toggle('open');
    el.classList.toggle('open', open);
    const arrow = el.querySelector('.arrow');
    if (arrow) arrow.style.transform = open ? 'rotate(180deg)' : 'rotate(0deg)';
  },

  toggle3depth(id, el) {
    const wrap = document.getElementById(id);
    if (!wrap) return;
    const open = wrap.classList.toggle('open');
    el.classList.toggle('open', open);
    const arrow = el.querySelector('.arrow');
    if (arrow) arrow.style.transform = open ? 'rotate(180deg)' : 'rotate(0deg)';
  },
};

/* ═══════════════════════════════════════════════
   LNB (서브페이지 사이드바) 컴포넌트
   req.md 4-3. 서브페이지 공통 레이아웃 기준
   ═══════════════════════════════════════════════ */
const LNB = {

  /**
   * LNB HTML 렌더링
   * @param {string} root      - 루트 상대경로 (예: '../')
   * @param {string} currentPath - 현재 페이지의 NAV_DATA href (예: 'about/index.html')
   * @returns {string} LNB aside HTML
   */
  render(root, currentPath) {
    let groupLabel = '';
    let groupHref = '';
    let items = [];

    /* NAV_DATA에서 currentPath가 속한 2depth 그룹 탐색 */
    for (const n1 of NAV_DATA) {
      if (!n1.children) continue;
      for (const n2 of n1.children) {
        /* flat 2depth (children 없는 케이스) */
        if (!n2.children) {
          if (n2.href === currentPath) {
            groupLabel = n1.label;
            groupHref = n1.href;
            items = [{ label: n2.label, href: n2.href }];
          }
          continue;
        }
        const match = n2.children.some(n3 => n3.href === currentPath)
          || n2.href === currentPath;
        if (match) {
          groupLabel = n2.label;
          groupHref = n2.href;
          items = n2.children;
          break;
        }
      }
      if (items.length) break;
    }

    if (items.length <= 1) return '';

    const currentItem = items.find(n3 => n3.href === currentPath);
    const activeHref = (currentItem && currentItem.hideLnb && currentItem.parent)
      ? currentItem.parent
      : currentPath;

    const itemsHtml = items.filter(n3 => !n3.hideLnb).map(n3 =>
      `<a href="${root}${n3.href}"
          class="lnb-item ${n3.href === activeHref ? 'active' : ''}"
        >${n3.label}</a>`
    ).join('');

    /* 렌더 후 탭 너비 균등화 */
    setTimeout(() => LNB.equalizeTabWidths(), 0);

    return `
      <nav class="sub-lnb" aria-label="서브 메뉴">
        <span class="lnb-group-title">${groupLabel}</span>
        <div class="lnb-items">${itemsHtml}</div>
      </nav>`;
  },

  /* 탭 너비를 가장 넓은 아이템 기준으로 통일 + 활성 탭 스크롤 */
  equalizeTabWidths() {
    const items = document.querySelectorAll('.lnb-item');
    if (items.length < 2) return;
    /* 너비 초기화 후 자연 너비 측정 */
    items.forEach(el => { el.style.width = ''; });
    const maxW = Math.max(...Array.from(items).map(el => el.offsetWidth));
    items.forEach(el => { el.style.width = maxW + 'px'; });

    /* 활성 탭이 잘리지 않도록 스크롤 */
    const active = document.querySelector('.lnb-item.active');
    if (active) active.scrollIntoView({ block: 'nearest', inline: 'center' });

    /* overflow 있을 때만 페이드 표시 */
    const lnbItems = document.querySelector('.lnb-items');
    const subLnb   = document.querySelector('.sub-lnb');
    if (lnbItems && subLnb) {
      const checkOverflow = () => {
        const scrollable = lnbItems.scrollWidth > lnbItems.clientWidth;
        const atEnd  = lnbItems.scrollLeft + lnbItems.clientWidth >= lnbItems.scrollWidth - 4;
        const atStart = lnbItems.scrollLeft <= 4;
        subLnb.classList.toggle('has-overflow',   scrollable && !atEnd);
        subLnb.classList.toggle('scrolled-right', scrollable && !atStart);
      };
      checkOverflow();
      lnbItems.addEventListener('scroll', checkOverflow, { passive: true });
    }
  },

  /**
   * 브레드크럼 HTML 렌더링
   * @param {string} root       - 루트 상대경로
   * @param {string} currentPath - 현재 페이지 NAV href
   * @returns {string} breadcrumb div HTML
   */
  breadcrumb(root, currentPath) {
    let crumbs = [{ label: '홈', href: `${root}index.html` }];
    let currentLabel = '';

    for (const n1 of NAV_DATA) {
      if (!n1.children) {
        if (n1.href === currentPath) {
          crumbs.push({ label: n1.label, href: null });
          currentLabel = n1.label;
          break;
        }
        continue;
      }
      for (const n2 of n1.children) {
        if (!n2.children) {
          if (n2.href === currentPath) {
            crumbs.push({ label: n1.label, href: `${root}${n1.href}` });
            crumbs.push({ label: n2.label, href: null });
            currentLabel = n2.label;
            break;
          }
          continue;
        }
        const n3match = n2.children.find(n3 => n3.href === currentPath);
        if (n3match) {
          crumbs.push({ label: n1.label, href: `${root}${n1.href}` });
          crumbs.push({ label: n2.label, href: `${root}${n2.href}` });
          if (n3match.parent) {
            const parentItem = n2.children.find(c => c.href === n3match.parent);
            if (parentItem) crumbs.push({ label: parentItem.label, href: `${root}${parentItem.href}` });
          }
          crumbs.push({ label: n3match.label, href: null });
          currentLabel = n3match.label;
          break;
        }
      }
      if (currentLabel) break;
    }

    const crumbHtml = crumbs.map((c, i) =>
      i < crumbs.length - 1
        ? `<a href="${c.href}">${c.label}</a><span class="breadcrumb-sep">›</span>`
        : `<span class="current">${c.label}</span>`
    ).join('');

    return `
      <div class="breadcrumb">
        <div class="breadcrumb-inner container">${crumbHtml}</div>
      </div>`;
  },
};

/* ── 유관기관 목록 ────────────────────────────── */
const RELATED_ORGS = [
  { label: '산림청', href: 'https://www.forest.go.kr' },
  { label: '국립수목원', href: 'https://www.kna.go.kr' },
  { label: '산림복지진흥원', href: 'https://www.fowi.or.kr' },
  { label: '숲해설가 자격', href: '#' },
  { label: '녹색연합', href: 'https://www.greenkorea.org' },
  { label: '숲교육포탈', href: 'https://edu.forest.go.kr/' },
];

const Footer = {

  /* 슬라이더 상태 */
  _relIdx: 0,
  _relVisible: 3,   /* 한 번에 보이는 항목 수 (PC 기준) */

  render(root = '../') {
    const relItems = RELATED_ORGS.map(o =>
      `<a href="${o.href}" class="related-item"
          target="_blank" rel="noopener noreferrer">${o.label}</a>`
    ).join('');

    /* 유관기관 자동슬라이드 밴드 카드 */
    const orgBandCards = RELATED_ORGS.map(o =>
      `<a href="${o.href}" class="org-band-card"
          target="_blank" rel="noopener noreferrer">${o.label}</a>`
    ).join('');

    /* 렌더 완료 후 자동슬라이드 초기화 (innerHTML 할당 후 다음 tick에 실행) */
    setTimeout(() => Footer.initOrgBand(), 0);

    return `
    <footer class="site-footer">
      <div class="footer-inner container">

        <!-- ── 좌측: 로고 + (오른쪽) 협회 정보 + 정책 링크 -->
        <div class="footer-info">
          <a href="${root}index.html" class="footer-logo-img-wrap">
            <img src="${root}assets/image/logo.png" alt="한국숲해설가협회"
                 class="footer-logo-img">
          </a>
          <div class="footer-info-text">
            <div class="footer-links">
              <a href="${root}terms.html">이용약관</a>
              <a href="${root}privacy.html">개인정보처리방침</a>
              <a href="${root}email.html">이메일 무단수집 거부</a>
            </div>
            <p>주소: 06753 서울시 서초구 바우뫼로 158 (양재동 유향빌딩 4층)</p>
            <p>대표전화: 02-747-6518 &nbsp;|&nbsp; FAX: 02-747-6519</p>
            <p>이메일: <a href="mailto:foresto123@hanmail.net">foresto123@hanmail.net</a></p>
          </div>
        </div>

        <!-- ── 우측: SNS + 구홈페이지 (한 줄) + 패밀리사이트 드롭다운 (아래) -->
        <div class="footer-right">
          <div class="footer-right-top">
            <!-- SNS 아이콘 -->
            <div class="footer-sns">
              <a href="#" class="footer-sns-btn footer-sns-naver" title="네이버 블로그"
                 aria-label="네이버 블로그 (새 창)"
                 onclick="App.toast('블로그로 이동합니다.');return false;">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/>
                </svg>
              </a>
              <a href="#" class="footer-sns-btn footer-sns-yt" title="유튜브"
                 aria-label="유튜브 (새 창)"
                 onclick="App.toast('유튜브로 이동합니다.');return false;">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="#" class="footer-sns-btn footer-sns-insta" title="인스타그램"
                 aria-label="인스타그램 (새 창)"
                 onclick="App.toast('인스타그램으로 이동합니다.');return false;">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </a>
            </div>
            <!-- 구 홈페이지 링크 -->
            <a href="http://www.foresto.org/?r=home" target="_blank" rel="noopener noreferrer"
               class="footer-old-site">
              구 홈페이지 바로가기
            </a>
          </div>

          <!-- 패밀리사이트 드롭다운 -->
          <div class="footer-family" id="footerFamily">
            <button class="footer-family-btn"
                    onclick="Footer.toggleFamilySite()"
                    aria-haspopup="listbox"
                    aria-expanded="false">
              Family Site
              <span class="family-arrow">▼</span>
            </button>
            <div class="footer-family-list" role="listbox">
              <a href="https://www.forest.go.kr" target="_blank" rel="noopener noreferrer">산림청</a>
              <a href="https://www.kna.go.kr" target="_blank" rel="noopener noreferrer">국립수목원</a>
              <a href="https://www.fowi.or.kr" target="_blank" rel="noopener noreferrer">산림복지진흥원</a>
              <a href="https://www.greenkorea.org" target="_blank" rel="noopener noreferrer">녹색연합</a>
            </div>
          </div>
        </div>
      </div>

      <!-- 유관기관 바로가기 자동슬라이드 밴드 -->
    <div class="org-band">
      <div class="org-band-label">유관기관 바로가기</div>
      <div class="org-band-viewport">
        <div class="org-band-track" id="orgBandTrack">
          ${orgBandCards}
        </div>
      </div>
    </div>

      <div class="footer-copy">
        <div class="container">
          Copyrights &copy; 2026 www.foresto.org All rights reserved.
        </div>
      </div>
    </footer>`;
  },

  /* 유관기관 슬라이드 이동 */
  slideRelated(dir) {
    const track = document.getElementById('relatedTrack');
    if (!track) return;
    const items = track.querySelectorAll('.related-item');
    const total = items.length;
    const viewport = document.getElementById('relatedViewport');
    /* 현재 viewport 너비 기준 visible 수 결정 */
    const vpW = viewport ? viewport.offsetWidth : 300;
    const itemW = vpW / this._getVisible();
    const maxIdx = total - this._getVisible();

    this._relIdx = Math.max(0, Math.min(this._relIdx + dir, maxIdx));
    track.style.transform = `translateX(-${this._relIdx * itemW}px)`;
  },

  _getVisible() {
    if (window.innerWidth <= 480) return 2;
    if (window.innerWidth <= 768) return 2;
    return 3;
  },

  /* 유관기관 자동슬라이드 밴드 초기화 */
  initOrgBand() {
    const track = document.getElementById('orgBandTrack');
    if (!track) return;

    /* 원본 1세트 HTML·너비 저장 */
    const originalHTML  = track.innerHTML;
    const originalWidth = track.scrollWidth;   /* 복제 전 측정 */

    /* 뷰포트 3배 이상 채울 때까지 복제 → 어떤 화면 크기에서도 끊김 없이 채움 */
    const vw = window.innerWidth || document.documentElement.clientWidth;
    while (track.scrollWidth < vw * 3) {
      track.innerHTML += originalHTML;
    }

    let pos = 0;
    const speed = 0.5;
    let paused = false;
    const viewport = track.parentElement;
    viewport.addEventListener('mouseenter', () => { paused = true; });
    viewport.addEventListener('mouseleave', () => { paused = false; });

    (function animate() {
      if (!paused) {
        pos += speed;
        /* 원본 1세트 너비만큼 이동하면 리셋 → seamless loop */
        if (pos >= originalWidth) pos -= originalWidth;
        track.style.transform = `translateX(-${pos}px)`;
      }
      requestAnimationFrame(animate);
    })();
  },

  /* 패밀리사이트 드롭다운 토글 */
  toggleFamilySite() {
    const wrap = document.getElementById('footerFamily');
    if (!wrap) return;
    const btn = wrap.querySelector('.footer-family-btn');
    const open = wrap.classList.toggle('open');
    if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  },

  initFamilyOutsideClick() {
    document.addEventListener('click', (e) => {
      const wrap = document.getElementById('footerFamily');
      if (wrap && !wrap.contains(e.target)) {
        wrap.classList.remove('open');
        const btn = wrap.querySelector('.footer-family-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
    });
  },
};
