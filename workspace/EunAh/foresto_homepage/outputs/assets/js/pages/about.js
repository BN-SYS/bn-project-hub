/* =============================================
   about.js | 협회소개 페이지 컨트롤러
   - RegionCtrl: 전국지역협회 목록 + 상세
   ============================================= */
'use strict';

/* ══════════════════════════════════════════════
   1. 전국 지역협회 데이터
══════════════════════════════════════════════ */
const REGIONS_DATA = [
    {
        id: 1, name: '서울협회',
        link: 'https://seoul.forestguide.or.kr',
        content: `<img src="https://picsum.photos/seed/seoul/800/400" alt="서울협회" style="width:800px;border-radius:8px;margin-bottom:16px;display:block; margin:50px auto">
                  <p>서울협회는 서울특별시 전역을 활동 권역으로 하며, 320명의 회원이 활동하고 있습니다.</p>
                  <p>서울 소재 공원, 학교, 복지관 등 다양한 기관과 협력하여 숲 해설 활동을 전개하고 있습니다.</p>
                  <ul>
                    <li>설립: 2001년</li>
                    <li>회장: 홍길동</li>
                    <li>연락처: 02-000-1001</li>
                    <li><a href="https://seoul.forestguide.or.kr" target="_blank">홈페이지 바로가기</a></li>
                    <li>주요 활동: 북한산, 관악산, 서울숲 등 연간 200회 이상 숲 해설 진행</li>
                  </ul>`,
    },
    {
        id: 2, name: '경기북부협회',
        link: 'https://gyeonggi-n.forestguide.or.kr',
        content: `<img src="https://picsum.photos/seed/gyeonggi-n/800/400" alt="경기북부협회" style="width:800px;border-radius:8px;margin-bottom:16px;display:block; margin:50px auto">
                  <p>경기북부협회는 의정부, 고양, 파주, 양주, 동두천 등 경기 북부 지역을 활동 권역으로 합니다.</p>
                  <p>185명의 회원이 지역 내 자연환경교육시설 및 학교 연계 프로그램을 운영하고 있습니다.</p>
                  <ul>
                    <li>설립: 2003년</li>
                    <li>회장: 이순신</li>
                    <li>연락처: 031-000-1002</li><br>
                    <li><a href="#" target="_blank" style="color: #007bff; text-decoration: underline;">홈페이지 바로가기</a></li>
                  </ul>`,
    },
    {
        id: 3, name: '경기남부협회',
        link: 'https://gyeonggi-s.forestguide.or.kr',
        content: `<img src="https://picsum.photos/seed/gyeonggi-s/800/400" alt="경기남부협회" style="width:800px;border-radius:8px;margin-bottom:16px;display:block; margin:50px auto">
                  <p>경기남부협회는 수원, 성남, 안양, 화성 등 경기 남부 지역을 활동 권역으로 합니다.</p>
                  <p>210명의 회원이 활동 중이며, 특히 광교산 일원 생태 해설 프로그램이 활발합니다.</p>
                  <ul>
                    <li>설립: 2004년</li>
                    <li>회장: 강감찬</li>
                    <li>연락처: 031-000-1003</li><br>
                    <li><a href="#" target="_blank" style="color: #007bff; text-decoration: underline;">홈페이지 바로가기</a></li>
                  </ul>`,
    },
];


/* ══════════════════════════════════════════════
   2. 전국 지역협회 컨트롤러
══════════════════════════════════════════════ */
const RegionCtrl = {

    DATA: REGIONS_DATA,

    /* ── 본문 첫 번째 <img src> 추출 유틸 */
    _extractThumb(htmlStr) {
        if (!htmlStr) return null;
        const m = htmlStr.match(/<img[^>]+src=["']([^"']+)["']/i);
        return m ? m[1] : null;
    },

    /* ── 목록 렌더 */
    init() {
        const grid = document.getElementById('regionGrid');
        if (!grid) return;

        grid.innerHTML = this.DATA.map(r => {
            const thumbSrc = this._extractThumb(r.content);
            const thumb = thumbSrc
                ? `<div class="gallery-thumb" style="background-image:url('${thumbSrc}')"></div>`
                : `<div class="gallery-thumb-placeholder"></div>`;
            return `
            <div class="gallery-card"
                 onclick="location.href='region-detail.html?id=${r.id}'"
                 style="cursor:pointer">
              ${thumb}
              <div class="gallery-info">
                <div class="gallery-title">${r.name}</div>
              </div>
            </div>`;
        }).join('');
    },

    /* ── 상세 페이지 렌더 */
    renderDetail() {
        const id = App.getParam('id');
        const item = this.DATA.find(d => String(d.id) === String(id));
        const el = document.getElementById('regionDetail');
        if (!el) return;

        if (!item) {
            el.innerHTML = `
                <div style="text-align:center;padding:48px;color:var(--gray-mid)">
                  해당 지역협회를 찾을 수 없습니다.
                </div>`;
            return;
        }

        const idx = this.DATA.findIndex(d => d.id === item.id);
        const prev = this.DATA[idx - 1];
        const next = this.DATA[idx + 1];
       

        const navHtml = (next || prev) ? `
          <div class="cd-nav">
            ${next ? `<div class="cd-nav-item" onclick="location.href='region-detail.html?id=${next.id}'">
              <span class="cd-nav-label">다음</span>
              <span class="cd-nav-title">${next.name}</span>
            </div>` : ''}
            ${prev ? `<div class="cd-nav-item" onclick="location.href='region-detail.html?id=${prev.id}'">
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
            <div class="cd-body">
              <div class="cd-content">${item.content || ''}</div>
            </div>
            ${navHtml}
            <div class="cd-actions">
              <button class="btn btn-primary btn-sm cd-btn-list"
                      onclick="location.href='regions.html'">목록</button>
            </div>
          </div>`;
    },
};


/* ══════════════════════════════════════════════
   2. 후원하기 컨트롤러
   - 일시후원 / 정기후원 탭 전환
   - 금액 프리셋 버튼 + 직접입력
   - 폼 제출 시 완료 화면 + 계좌 안내 표시
   - 계좌 정보: DONATE_CONFIG (하드코딩 금지 원칙)
══════════════════════════════════════════════ */

/* ── 후원 계좌 설정 (실제 운영 시 환경변수 또는 CMS 연동으로 교체) */
const DONATE_CONFIG = {
    bank: '국민은행',
    account: '000-00-0000-0000',
    holder: '(사)한국숲해설가협회',
};

const DonateCtrl = {

    _tab: 'once',   /* 'once' | 'regular' */

    init() {
        this._tab = 'once';
        this._showTab('once');
    },

    /* ── 탭 전환 */
    setTab(tab) {
        this._tab = tab;
        this._showTab(tab);
    },

    _showTab(tab) {
        ['once', 'regular'].forEach(t => {
            const form = document.getElementById(`donateForm_${t}`);
            const btn = document.getElementById(`donateTab_${t}`);
            if (form) form.style.display = t === tab ? '' : 'none';
            if (btn) btn.classList.toggle('active', t === tab);
        });
        /* 탭 전환 시 완료 화면 숨김 */
        const complete = document.getElementById('donateComplete');
        if (complete) complete.style.display = 'none';
    },

    /* ── 금액 프리셋 선택 */
    selectAmount(tab, amount) {
        const input = document.getElementById(`donateAmount_${tab}`);
        if (!input) return;
        /* 직접입력 선택 시 빈값으로 포커스 */
        if (amount === 'custom') {
            input.value = '';
            input.focus();
        } else {
            input.value = amount.toLocaleString();
        }
        /* 프리셋 버튼 active 처리 */
        document.querySelectorAll(`#donateForm_${tab} .amount-btn`).forEach(btn => {
            btn.classList.toggle('active', btn.dataset.amount === String(amount));
        });
    },

    /* ── 폼 제출 */
    submit(tab) {
        const name = document.getElementById(`donateName_${tab}`)?.value.trim();
        const amount = document.getElementById(`donateAmount_${tab}`)?.value.replace(/,/g, '').trim();
        const phone = document.getElementById(`donatePhone_${tab}`)?.value.trim();

        if (!name) { App.toast('성함을 입력해주세요.', 'warning'); return; }
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            App.toast('후원 금액을 입력해주세요.', 'warning'); return;
        }
        if (!phone) { App.toast('연락처를 입력해주세요.', 'warning'); return; }

        /* 폼 숨기고 완료 화면 표시 */
        const form = document.getElementById(`donateForm_${tab}`);
        if (form) form.style.display = 'none';

        this._renderComplete(tab, name, amount);
    },

    /* ── 완료 화면 렌더 */
    _renderComplete(tab, name, amount) {
        const el = document.getElementById('donateComplete');
        if (!el) return;

        const typeLabel = tab === 'once' ? '일시후원' : '정기후원';
        const amountFmt = Number(amount).toLocaleString();

        el.innerHTML = `
            <div class="donate-complete">
              <div class="donate-complete-icon">✓</div>
              <h3>${typeLabel} 신청이 완료되었습니다</h3>
              <p>${name}님, 소중한 후원 신청 감사합니다.<br>
                 아래 계좌로 후원금을 입금해 주시면 처리됩니다.</p>
              <div class="donate-account">
                <dl>
                  <dt>은행</dt><dd>${DONATE_CONFIG.bank}</dd>
                  <dt>계좌번호</dt><dd>${DONATE_CONFIG.account}</dd>
                  <dt>예금주</dt><dd>${DONATE_CONFIG.holder}</dd>
                  <dt>후원 금액</dt><dd>${amountFmt}원 (${typeLabel})</dd>
                </dl>
              </div>
              <p class="donate-complete-note">입금자명을 <strong>${name}</strong>으로 입력해 주세요.<br>
                 문의: <a href="contact.html">협회 연락처</a></p>
              <div style="margin-top:28px;display:flex;gap:12px;justify-content:center">
                <button class="btn btn-primary" onclick="DonateCtrl.reset()">다시 신청하기</button>
                <button class="btn btn-gray" onclick="location.href='../index.html'">홈으로</button>
              </div>
            </div>`;
        el.style.display = '';
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },

    /* ── 초기화 (다시 신청하기) */
    reset() {
        /* 모든 입력값 초기화 */
        ['once', 'regular'].forEach(t => {
            ['Name', 'Amount', 'Phone', 'Email'].forEach(field => {
                const el = document.getElementById(`donate${field}_${t}`);
                if (el) el.value = '';
            });
            document.querySelectorAll(`#donateForm_${t} .amount-btn`).forEach(btn => {
                btn.classList.remove('active');
            });
        });
        const complete = document.getElementById('donateComplete');
        if (complete) { complete.style.display = 'none'; complete.innerHTML = ''; }
        this.init();
    },
};


/* ══════════════════════════════════════════════
   3. 연혁 데이터
   - items[].img: null | '이미지 경로' (관리자 등록용)
══════════════════════════════════════════════ */
const HISTORY_DATA = [
    {
        year: 2026,
        img: 'https://picsum.photos/seed/hist2026/760/280',
        items: [
            { month: '03', text: '03.30 제55기 숲해설가 전문가과정 모집 시작', img: null },
            { month: '01', text: '03.30 2026년도 정기 이사회 개최, 사업계획 확정', img: null },
        ],
    },
    {
        year: 2025,
        img: 'https://picsum.photos/seed/hist2025/760/280',
        items: [
            { month: '11', text: '03.30 제54기 전문가과정 수료식, 수료생 42명 배출', img: null },
            { month: '09', text: '03.30 전국 지역 숲해설가 연합 워크숍 개최 (전주)', img: null },
            { month: '07', text: '03.30 산림복지진흥원 업무협약(MOU) 갱신', img: null },
            { month: '04', text: '03.30 제53기 전문가과정 수료, 온라인 교육 병행 첫 시행', img: null },
            { month: '03', text: '03.30 협회 홈페이지 전면 개편 오픈', img: null },
        ],
    },
    {
        year: 1998,
        items: [
            { month: '10', text: '\'자연환경 안내자 협회\' 창립, 제1회 숲해설가 양성과정 개설', img: null },
        ],
    },
];


/* ══════════════════════════════════════════════
   4. 연혁 컨트롤러 (REQ-018) — 하이브리드 방식
   - 상단: 가로 슬라이드 타임라인 (연도 네비게이션 전용, 고정 높이)
   - 하단: 선택 연도 상세 영역 (항목 수 무관, 세로 자유 확장)
   - 모바일: 세로 타임라인 자동 전환
══════════════════════════════════════════════ */
const HistoryCtrl = {

    DATA: HISTORY_DATA,

    /* ── 레이아웃 상수 */
    _NW:   160,  /* 노드 너비 */
    _CW:   60,   /* 연결 구간 너비 */
    _RC:   36,   /* 대형 원 반지름 */
    _STEM: 30,   /* 원 ↔ dot 줄기 길이 */
    _RD:   5,    /* 연결 dot 반지름 */
    _YT:   130,  /* 상단 dot Y */
    _YB:   210,  /* 하단 dot Y */
    _TH:   300,  /* 스테이지 높이 (콤팩트) */
    _RS:   16,   /* 꺾임 모서리 라운드 */

    _COLORS: ['#1e5c35','#2d7a4f','#3a9660','#52b37f','#6bc49a','#276847','#3d8a58','#4aad6c'],
    _ICONS:  ['🌲','🌿','🍃','🌱','🌳','🍀','🌾','🌵'],

    _LABELS: {
        2026:'2026년 사업',
        2025:'2025년 주요활동',
        1998:'협회 창립',
    },

    _selected: null,

    init() {
        const wrap = document.getElementById('historyTimeline');
        if (!wrap) return;

        this._selected = this.DATA[0].year;

        const {
            _NW:NW, _CW:CW, _RC:RC, _STEM:STEM, _RD:RD,
            _YT:YT, _YB:YB, _TH:TH, _RS:RS,
            _COLORS:COLORS, _ICONS:ICONS, DATA:data,
        } = this;

        const n      = data.length;
        const totalW = n * NW + (n - 1) * CW;
        /* 원 반지름 RC*1.5, dot 외곽에 원 배치 */
        const imgR3  = Math.round(RC * 1.5);             /* 54px */
        const topCY  = YT - STEM - imgR3;                /* 원 하단이 dot 위에 위치 */
        const botCY  = YB + STEM + imgR3;                /* 원 상단이 dot 아래에 위치 */

        /* 원이 스테이지 밖으로 넘치는 경우 패딩 계산 */
        const padTop  = Math.max(0, imgR3 - topCY + 10);
        const padBot  = Math.max(0, botCY + imgR3 - TH + 10);
        const padLeft = Math.max(0, imgR3 - NW / 2 + 10);

        /* ── SVG 경로 (stepped) */
        const pathPts = [`M 0 ${YT}`];
        data.forEach((_, i) => {
            const isTop    = i % 2 === 0;
            const dotY     = isTop ? YT : YB;
            const cx       = i * (NW + CW) + NW / 2;
            if (i === 0) {
                pathPts.push(`L ${cx} ${dotY}`);
            } else {
                const prevIsTop = (i - 1) % 2 === 0;
                const prevDotY  = prevIsTop ? YT : YB;
                const prevCx    = (i - 1) * (NW + CW) + NW / 2;
                const cS        = prevCx + NW / 2;
                pathPts.push(`L ${cS} ${prevDotY}`);
                if (prevDotY < dotY) {
                    pathPts.push(`A ${RS} ${RS} 0 0 1 ${cS+RS} ${prevDotY+RS}`);
                    pathPts.push(`L ${cS+RS} ${dotY-RS}`);
                    pathPts.push(`A ${RS} ${RS} 0 0 1 ${cS+2*RS} ${dotY}`);
                } else {
                    pathPts.push(`A ${RS} ${RS} 0 0 0 ${cS+RS} ${prevDotY-RS}`);
                    pathPts.push(`L ${cS+RS} ${dotY+RS}`);
                    pathPts.push(`A ${RS} ${RS} 0 0 0 ${cS+2*RS} ${dotY}`);
                }
                pathPts.push(`L ${cx} ${dotY}`);
            }
        });
        pathPts.push(`L ${totalW} ${(n-1) % 2 === 0 ? YT : YB}`);

        /* ── SVG 원·dot */
        let svgDefs = '';
        let svgE = '';
        data.forEach((group, i) => {
            const isTop = i % 2 === 0;
            const dotY  = isTop ? YT : YB;
            const cx    = i * (NW + CW) + NW / 2;
            const color = COLORS[i % COLORS.length];
            const cirCY = isTop ? topCY : botCY;
            const imgR  = imgR3;   /* 모든 원 동일 크기 (RC*1.5) */
            const imgSrc = group.img || `https://picsum.photos/seed/forest${group.year}/200/200`;
            const sY1   = isTop ? cirCY + imgR : dotY;
            const sY2   = isTop ? dotY         : cirCY - imgR;
            svgE += `<line x1="${cx}" y1="${sY1}" x2="${cx}" y2="${sY2}" stroke="${color}" stroke-width="2" opacity="0.5"/>`;
            svgE += `<circle cx="${cx}" cy="${cirCY}" r="${imgR}" fill="#fff" stroke="${color}" stroke-width="3" class="ht-circle" data-year="${group.year}"/>`;
            /* 이미지 클립 */
            const clipId = `htClip${group.year}`;
            const ir = imgR - 3;
            svgDefs += `<clipPath id="${clipId}"><circle cx="${cx}" cy="${cirCY}" r="${ir}"/></clipPath>`;
            svgE += `<image href="${imgSrc}" x="${cx - ir}" y="${cirCY - ir}" width="${ir * 2}" height="${ir * 2}" clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice" style="pointer-events:none"/>`;
            svgE += `<circle cx="${cx}" cy="${dotY}" r="${RD+4}" fill="${color}" opacity="0.15"/>`;
            svgE += `<circle cx="${cx}" cy="${dotY}" r="${RD}"   fill="${color}"/>`;
            svgE += `<circle cx="${cx}" cy="${dotY}" r="${RD-2}" fill="#fff"/>`;
        });

        /* ── 노드 HTML (연도 숫자 + 클릭 영역만) */
        const nodesHtml = data.map((group, i) => {
            const isTop   = i % 2 === 0;
            const leftPx  = i * (NW + CW);
            const dotY    = isTop ? YT : YB;
            const cirCY   = isTop ? topCY : botCY;
            const color   = COLORS[i % COLORS.length];
            const imgR    = imgR3;
            /* 연도 텍스트: dot 기준, 원 반대편에 배치 (원과 분리) */
            const yearTop = isTop
                ? `${dotY + RD + 8}px`
                : `${dotY - RD - 44}px`;
            const isActive = group.year === this._selected;
            return `
            <div class="ht-node ${isTop ? 'ht-top' : 'ht-bot'} ${isActive ? 'ht-active' : ''}"
                 style="left:${leftPx}px; width:${NW}px;"
                 onclick="HistoryCtrl.selectYear(${group.year})"
                 data-year="${group.year}">
              <!-- 원 위 클릭 오버레이 -->
              <div class="ht-circle-hit"
                   style="position:absolute;
                          left:${NW/2 - imgR - 10}px;
                          top:${cirCY - imgR - 10}px;
                          width:${(imgR+10)*2}px;
                          height:${(imgR+10)*2}px;
                          border-radius:50%;cursor:pointer;"></div>
              <!-- 연도 숫자 -->
              <div class="ht-year" style="top:${yearTop}; color:${color};">${group.year}</div>
            </div>`;
        }).join('');

        wrap.innerHTML = `
        <div class="ht-scroll-outer" id="htScrollOuter">
          <div style="padding:${padTop}px 20px ${padBot}px ${padLeft}px;display:inline-block;vertical-align:top;">
            <div class="ht-stage" style="width:${totalW}px; height:${TH}px;">
              <svg class="ht-svg" width="${totalW}" height="${TH}" aria-hidden="true">
                ${svgDefs ? `<defs>${svgDefs}</defs>` : ''}
                <path d="${pathPts.join(' ')}"
                      fill="none" stroke="#c5dfc8" stroke-width="2.5"
                      stroke-linecap="round" stroke-linejoin="round"/>
                ${svgE}
              </svg>
              ${nodesHtml}
            </div>
          </div>
        </div>
        <!-- 하단 상세 영역 -->
        <div class="ht-detail" id="htDetail"></div>`;

        this._initDrag(document.getElementById('htScrollOuter'));
        this._renderDetail(this._selected);
    },

    /* ── 연도 선택 */
    selectYear(year) {
        if (this._selected === year) return;
        this._selected = year;

        /* 노드 active 갱신 */
        document.querySelectorAll('.ht-node').forEach(el => {
            el.classList.toggle('ht-active', Number(el.dataset.year) === year);
        });

        /* 선택된 노드가 보이도록 스크롤 */
        const outer = document.getElementById('htScrollOuter');
        const node  = document.querySelector(`.ht-node[data-year="${year}"]`);
        if (outer && node) {
            const nodeCenter = node.offsetLeft + node.offsetWidth / 2;
            const target     = nodeCenter - outer.offsetWidth / 2;
            outer.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
        }

        this._renderDetail(year);
    },

    /* ── 상세 영역 렌더 */
    _renderDetail(year) {
        const detail = document.getElementById('htDetail');
        if (!detail) return;

        const group = this.DATA.find(d => d.year === year);
        if (!group) return;

        const idx   = this.DATA.findIndex(d => d.year === year);
        const color = this._COLORS[idx % this._COLORS.length];
        const label = this._LABELS[year] || `${year}년`;

        const itemsHtml = group.items.map(it => `
            <li class="htd-item">
              <span class="htd-text">${it.text}</span>
            </li>`).join('');

        detail.innerHTML = `
          <div class="htd-inner">
            <div class="htd-head">
              <span class="htd-year" style="color:${color};">${year}</span>
            </div>
            <ul class="htd-list">${itemsHtml}</ul>
          </div>`;

        /* fade-in */
        detail.classList.remove('htd-show');
        requestAnimationFrame(() => detail.classList.add('htd-show'));
    },

    /* ── 드래그 스크롤 */
    _initDrag(el) {
        if (!el) return;
        let isDown = false, startX = 0, scrollLeft = 0, moved = false;
        el.addEventListener('mousedown', e => {
            isDown = true; moved = false;
            startX = e.pageX - el.offsetLeft;
            scrollLeft = el.scrollLeft;
        });
        el.addEventListener('mouseleave', () => { isDown = false; });
        el.addEventListener('mouseup',    () => { isDown = false; });
        el.addEventListener('mousemove',  e => {
            if (!isDown) return;
            e.preventDefault(); moved = true;
            el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX) * 1.2;
        });
        /* 드래그 중 클릭 이벤트 차단 */
        el.addEventListener('click', e => { if (moved) e.stopPropagation(); }, true);
    },
};


/* ── about 페이지 자동 초기화 */
document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;
    const initMap = {
        'regions': () => RegionCtrl.init(),
        'region-detail': () => RegionCtrl.renderDetail(),
        'donate': () => DonateCtrl.init(),
        'history': () => HistoryCtrl.init(),
    };
    if (page && initMap[page]) initMap[page]();
});
