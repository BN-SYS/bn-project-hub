/* =============================================
   community.js | 커뮤니티 페이지 공통 로직
   v2.1 - NewsletterCtrl / ArchiveCtrl 완전 교체
   ============================================= */
'use strict';

/* ══════════════════════════════════════════════
   0. 공통 유틸: 게시판 팩토리
══════════════════════════════════════════════ */
function createCommunityBoard(opts) {
    const {
        data,
        tableBodyId,
        paginationId,
        countId,
        pageSize = 10,
        rowRenderer,
        notices = [],
    } = opts;

    let filtered = [...data];
    let currentPage = 1;
    let curPageSize = pageSize;

    function render() {
        const total = filtered.length;
        const slice = filtered.slice(
            (currentPage - 1) * curPageSize,
            currentPage * curPageSize
        );

        const countEl = document.getElementById(countId);
        if (countEl) countEl.textContent = total.toLocaleString();

        const tbody = document.getElementById(tableBodyId);
        if (!tbody) return;

        const noticeRows = notices
            .map(p => rowRenderer(p, null, true))
            .join('');

        const normalRows = slice.length
            ? slice.map((row, i) =>
                rowRenderer(row, total - (currentPage - 1) * curPageSize - i, false)
            ).join('')
            : `<tr>
           <td colspan="10"
               style="text-align:center;padding:32px;color:var(--gray-mid)">
             등록된 게시물이 없습니다.
           </td>
         </tr>`;

        tbody.innerHTML = noticeRows + normalRows;

        App.renderPagination(
            paginationId,
            currentPage,
            Math.ceil(total / curPageSize) || 1,
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
        search(keyword) {
            const kw = (keyword || '').trim().toLowerCase();
            filtered = kw
                ? data.filter(r => r.title.toLowerCase().includes(kw))
                : [...data];
            currentPage = 1;
            render();
        },
        filterFn(fn) {
            filtered = fn ? data.filter(fn) : [...data];
            currentPage = 1;
            render();
        },
        changePageSize(size) {
            curPageSize = size;
            currentPage = 1;
            render();
        },
        init() { render(); },
    };
}


/* ══════════════════════════════════════════════
   1. 샘플 데이터
══════════════════════════════════════════════ */

function commMakeDate(idx, year = 2026) {
    const m = String((idx % 9) + 1).padStart(2, '0');
    const d = String((idx % 28) + 1).padStart(2, '0');
    return `${year}-${m}-${d}`;
}

/* ── 1-1. 공지사항 */
const NOTICE_DATA = {
    pinned: [
        {
            id: 9999,
            title: '[필독] 2026년 협회 운영 방침 안내',
            author: '관리자', date: '2026-01-02',
            content: `<p>2026년 협회 운영 방침에 대해 안내드립니다.</p>
                <p>주요 변경 사항은 다음과 같습니다.</p>`,
            attachments: [{ name: '2026_운영방침_안내문.pdf', size: '128K' }],
        },
        {
            id: 9998,
            title: '[공지] 개인정보처리방침 개정 안내',
            author: '관리자', date: '2026-01-10',
            content: `<p>개인정보처리방침 개정 내용을 안내드립니다.</p>`,
        },
    ],
    normals: Array.from({ length: 3 }, (_, i) => ({
        id: 3 - i,
        title: [
            '55기 전문가과정 모집 안내', '[긴급] 3월 이사회 일정 변경',
            '2026년 협회비 납부 안내', '홈페이지 개편 작업 예고',
            '2025년 우수회원 표창 결과', '봄철 숲해설 프로그램 안내',
            '하반기 교육 일정 공지', '협회 사무실 이전 안내',
            '정기총회 결과 보고', '자원봉사 모집 공고',
        ][i % 10],
        author: '관리자',
        date: commMakeDate(i),
        content: `<p>공지사항 ${25 - i}번 게시물 내용입니다.</p>
              <p>자세한 사항은 사무국(02-747-6518)으로 문의 바랍니다.</p>`,
    })),
};

/* ── 1-2. 자유게시판 */
const FREE_DATA = {
    pinned: [],
    normals: Array.from({ length: 3 }, (_, i) => ({
        id: 3 - i,
        title: [
            '봄 숲 탐방 다녀왔어요 🌸', '초보 숲해설가의 첫 현장 후기',
            '식물 이름이 헷갈려요 - 도움 요청', '숲해설 관련 좋은 책 추천',
            '겨울 나무 관찰 사진 공유', '해설 연습할 곳 추천해주세요',
        ][i % 6],
        author: `회원${(i % 15) + 1}`,
        date: commMakeDate(i),
        likes: Math.floor(Math.random() * 30),
        content: `<p>자유게시판 ${30 - i}번 게시물입니다.</p>
              <p>여러분과 소통하고 싶어 글을 남깁니다.</p>`,
    })),
};

/* ── 1-3. 언론보도 */
const PRESS_DATA = {
    pinned: [
        {
            id: 9801, title: '[고정] 한국숲해설가협회 미디어 보도 자료 모음 (2026년)',
            author: '사무국', date: '2026-01-10', views: 445, link: '#',
            content: `<p>2026년 협회 관련 주요 언론 보도 자료를 모아 제공합니다.</p>`,
        },
    ],
    normals: Array.from({ length: 3 }, (_, i) => ({
        id: 3 - i,
        title: [
            '한국숲해설가협회, 산림 생태 교육 확대 나서',
            '숲해설가 자격증 취득자 3만 명 돌파',
            '도심 속 숲 교육, 어린이 정서 발달에 효과',
            '한국숲해설가협회, 사회공헌 우수기관 선정',
            '전문 숲해설가 양성 프로그램 인기몰이',
            '자연과 함께하는 치유 숲 프로그램 주목',
        ][i % 6],
        author: ['사무국', '김회원', '이회원', '박회원', '최회원', '정회원'][i % 6],
        date: commMakeDate(i),
        link: '#',
        content: `<p>언론보도 ${18 - i}번 게시물입니다.</p>`,
    })),
};

/* ── 1-4. 일자리 및 교육정보 (TASK 8: deadline·category 필드 제거, 핀 기능 추가) */
const JOB_DATA = {
    pinned: [
        {
            id: 9901, title: '[필독] 일자리·교육정보 게시판 이용 안내',
            author: '관리자', date: '2026-01-05',
            content: `<p>일자리·교육정보 게시판 이용 방법을 안내합니다.</p>
                      <p>채용, 교육, 자격, 공모 관련 정보를 공유하는 공간입니다.</p>`,
        },
        {
            id: 9900, title: '[고정] 2026년 산림 관련 자격시험 일정 총정리',
            author: '사무국', date: '2026-01-15',
            content: `<p>2026년 산림 관련 국가자격시험 일정을 정리하였습니다.</p>
                      <p>산림교육전문가, 숲해설가 등 주요 자격 시험 일정을 확인하세요.</p>`,
        },
    ],
    normals: Array.from({ length: 3 }, (_, i) => ({
        id: 3 - i,
        title: [
            '국립수목원 숲해설가 채용 공고',
            '생태관광 전문가 양성 과정 모집',
            '산림교육전문가 자격시험 안내',
            '2026 녹색생활 실천 공모전',
            '지자체 산림복지 해설사 모집',
            '숲치유지도사 심화 과정 안내',
        ][i % 6],
        author: '사무국',
        date: commMakeDate(i),
        content: `<p>일자리/교육정보 ${22 - i}번 게시물입니다.</p>
                  <p>세부 내용은 원문 공고를 확인하시기 바랍니다.</p>`,
    })),
};

/* ── 1-5. 갤러리 */
const GALLERY_TITLES = [
    '2026 봄 숲 탐방 행사', '55기 전문가과정 수료식',
    '사공단 봉사활동 현장', '동아리 정기모임 사진',
    '이사회 회의 모습', '시민아카데미 현장',
    '숲 치유 프로그램', '어린이 생태교육',
];
const GALLERY_CONTENTS = [
    `<p>2026년 봄을 맞아 협회 회원들과 함께한 숲 탐방 행사 현장입니다.</p>
     <p>북한산 둘레길을 따라 봄꽃과 나무를 관찰하며 소중한 시간을 보냈습니다.</p>`,
    `<p>2026년 55기 전문가과정 수료식 현장입니다.</p>
     <p>총 42명의 수료생이 교육을 마치고 새로운 숲해설가로 탄생했습니다.</p>`,
    `<p>사회공헌사업단의 지역 초등학교 숲 체험 교육 봉사활동 현장입니다.</p>
     <p>학생들과 함께 숲 속 생물 관찰 및 자연 놀이 활동을 진행했습니다.</p>`,
    `<p>동아리 3월 정기모임 사진입니다.</p>
     <p>봄철 탐방 일정을 논의하고 새로운 회원을 환영하는 시간을 가졌습니다.</p>`,
    `<p>2026년 1분기 정기 이사회 모습입니다.</p>
     <p>2026년 주요 사업 방향과 예산 운영 계획을 심의했습니다.</p>`,
    `<p>시민아카데미 봄 특강 현장 사진입니다.</p>
     <p>지역 도서관에서 시민 50여 명을 대상으로 봄 숲 이야기 강연을 진행했습니다.</p>`,
    `<p>숲 치유 프로그램 운영 사진입니다.</p>
     <p>스트레스 해소와 심신 회복을 위한 치유 숲 체험 프로그램을 진행했습니다.</p>`,
    `<p>어린이 생태교육 현장 사진입니다.</p>
     <p>유치원 어린이들과 함께 숲 속 곤충과 식물을 관찰하는 체험 교육을 진행했습니다.</p>`,
];
/* 갤러리 샘플 이미지 — Picsum Photos (숲/자연 테마 시드) */
const GALLERY_IMG_IDS = [15, 28, 56, 74, 82, 110, 133, 148, 175, 190, 213, 237];
const GALLERY_DATA = Array.from({ length: 4 }, (_, i) => {
    const seed = GALLERY_IMG_IDS[i % GALLERY_IMG_IDS.length];
    const imgUrl = `https://picsum.photos/seed/${seed + i}/600/400`;
    return {
        id: 4 - i,
        title: GALLERY_TITLES[i % 8],
        author: '관리자',
        date: commMakeDate(i),
        imgUrl,
        content: `<img src="${imgUrl}" alt="${GALLERY_TITLES[i % 8]}" style="width:100%;border-radius:6px;margin-bottom:16px">
${GALLERY_CONTENTS[i % 8]}`,
        link: i % 3 === 0 ? '#' : null,
    };
});

/* ── 1-5-b. 숲일터 */
const FOREST_WORK_DATA = {
    pinned: [],
    normals: Array.from({ length: 3 }, (_, i) => ({
        id: 3 - i,
        title: [
            '2026 상반기 숲일터 활동 모집 공고',
            '전국 국립공원 숲해설 파견 안내',
            '서울 도시숲 해설 활동 참가자 모집',
            '경기도 생태환경 해설 인력 모집',
            '어린이 숲체험 해설 봉사 모집',
        ][i % 5],
        author: '관리자',
        date: commMakeDate(i),
        content: `<p>숲일터 공고 ${15 - i}번 게시물입니다.</p>
                  <p>자세한 사항은 사무국(02-747-6518)으로 문의 바랍니다.</p>`,
    })),
};

/* ── 1-6. 협회 일정 이벤트 */
const CALENDAR_EVENTS = [
    {
        id: 1, date: '2026-03-05',
        title: '이사회 회의', cat: 'meeting', link: true,
        desc: '2026년 1분기 정기 이사회\n📍 장소: 협회 사무실\n⏰ 시간: 14:00~16:00',
    },
    {
        id: 2, date: '2026-03-10',
        title: '전문가과정 OT', cat: 'edu', link: true,
        desc: '2026년 55기 전문가과정 오리엔테이션\n📍 장소: OO교육센터\n⏰ 시간: 10:00~12:00',
    },
    {
        id: 3, date: '2026-03-15',
        title: '전문가과정 접수마감', cat: 'edu', link: true,
        desc: '55기 전문가과정 신청 마감일\n마감 전 신청 완료 바랍니다.',
    },
    {
        id: 4, date: '2026-03-18',
        title: '봉사활동 - 도봉구', cat: 'activity', link: false,
        desc: '도봉구 초등학교 숲 체험 교육 봉사\n📍 장소: 도봉산 일원\n⏰ 시간: 09:00~13:00',
    },
    {
        id: 5, date: '2026-03-20',
        title: '숲사랑단 정기모임', cat: 'club', link: true,
        desc: '3월 정기모임 및 봄철 탐방 계획 수립\n📍 장소: OO공원\n⏰ 시간: 10:00~12:00',
    },
    {
        id: 6, date: '2026-03-22',
        title: '시민아카데미 강좌', cat: 'edu', link: true,
        desc: '봄 숲 이야기 시민 특강\n📍 장소: OO도서관\n⏰ 시간: 14:00~16:00',
    },
    {
        id: 7, date: '2026-03-25',
        title: '산들바람 모임', cat: 'club', link: true,
        desc: '산들바람 동아리 3월 정기모임\n📍 장소: 북한산 둘레길\n⏰ 시간: 09:00~12:00',
    },
    {
        id: 8, date: '2026-03-28',
        title: '봉사활동 - 노원구', cat: 'activity', link: false,
        desc: '노원구 복지관 자연치유 프로그램\n📍 장소: OO복지관\n⏰ 시간: 10:00~12:00',
    },
    {
        id: 9, date: '2026-04-05',
        title: '55기 전문가과정 1회차', cat: 'edu', link: true,
        desc: '55기 전문가과정 첫 번째 교육일\n📍 장소: OO교육센터\n⏰ 시간: 09:00~18:00',
    },
    {
        id: 10, date: '2026-04-15',
        title: '정기 이사회', cat: 'meeting', link: true,
        desc: '2026년 2분기 정기 이사회',
    },
];


/* ══════════════════════════════════════════════
   2. 캘린더 컨트롤러
══════════════════════════════════════════════ */
const CalendarCtrl = {

    CAT_META: {
        edu: { label: '교육/강좌', cls: 'evt-edu', dotColor: 'var(--green-main)' },
        activity: { label: '봉사활동', cls: 'evt-activity', dotColor: 'var(--accent)' },
        meeting: { label: '협회회의', cls: 'evt-meeting', dotColor: 'var(--info)' },
        club: { label: '동아리', cls: 'evt-club', dotColor: '#9c27b0' },
    },

    _year: 2026,
    _month: 2,
    _view: 'month',
    _filter: { edu: true, activity: true, meeting: true, club: true },

    init() {
        this._renderFilterPanel();
        this.render();
    },

    _renderFilterPanel() {
        const el = document.getElementById('calFilterPanel');
        if (!el) return;
        el.innerHTML = Object.entries(this.CAT_META).map(([k, v]) => `
      <div class="filter-item">
        <input type="checkbox" id="calCat_${k}" checked
               onchange="CalendarCtrl.toggleCat('${k}', this.checked)">
        <div class="filter-dot" style="background:${v.dotColor}"></div>
        <label for="calCat_${k}"
               style="cursor:pointer;font-size:14px">${v.label}</label>
      </div>`).join('');
    },

    toggleCat(cat, checked) {
        this._filter[cat] = checked;
        this.render();
    },

    setView(v) {
        this._view = v;
        const mView = document.getElementById('monthView');
        const lView = document.getElementById('listView');
        if (mView) mView.style.display = v === 'month' ? 'block' : 'none';
        if (lView) lView.style.display = v === 'list' ? 'block' : 'none';
        ['btnMonth', 'btnList'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.classList.toggle(
                'active',
                (id === 'btnMonth' && v === 'month') || (id === 'btnList' && v === 'list')
            );
        });
        this.render();
    },

    changeMonth(delta) {
        this._month += delta;
        if (this._month > 11) { this._month = 0; this._year++; }
        if (this._month < 0) { this._month = 11; this._year--; }
        this.render();
    },

    _getEvents(y, m, d) {
        const ds = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        return CALENDAR_EVENTS.filter(e => e.date === ds && this._filter[e.cat]);
    },


    render() {
        const titleEl = document.getElementById('calMonthTitle');
        if (titleEl) titleEl.textContent = `${this._year}년 ${this._month + 1}월`;
        if (this._view === 'month') {
            this._renderMonthGrid();
        } else {
            this._renderList();
        }
        this._renderUpcoming();
    },

    _renderMonthGrid() {
        const { _year: y, _month: m } = this;
        const first = new Date(y, m, 1).getDay();
        const lastDay = new Date(y, m + 1, 0).getDate();
        const today = new Date();
        const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

        let html = DAYS.map((d, i) =>
            `<div class="full-day-header ${i === 0 ? 'sun' : i === 6 ? 'sat' : ''}">${d}</div>`
        ).join('');

        for (let i = 0; i < first; i++) {
            html += `<div class="full-cell other-month"></div>`;
        }

        for (let d = 1; d <= lastDay; d++) {
            const dow = (first + d - 1) % 7;
            const isToday = (
                y === today.getFullYear() &&
                m === today.getMonth() &&
                d === today.getDate()
            );
            const evts = this._getEvents(y, m, d);
            const dateNumCls = [
                'cell-date',
                isToday ? 'today-num' : '',
                dow === 0 ? 'sun' : dow === 6 ? 'sat' : '',
            ].filter(Boolean).join(' ');

            const evtTags = [
                ...evts.slice(0, 2).map(e => {
                    const linkStyle = e.link ? 'cursor:pointer;text-decoration:underline;' : 'cursor:default;';
                    const clickAttr = e.link ? `onclick="event.stopPropagation();location.href='${e.link}'"` : '';
                    return `<span class="event-tag ${this.CAT_META[e.cat]?.cls || ''}"
                        style="${linkStyle}" ${clickAttr}>${e.title}</span>`;
                }),
                evts.length > 2
                    ? `<span style="font-size:10px;color:var(--gray-mid)">
               +${evts.length - 2}건 더
             </span>`
                    : '',
            ].join('');

            html += `
        <div class="full-cell${isToday ? ' today' : ''}" style="cursor:pointer"
             onclick="CalendarCtrl.selectDay(${y}, ${m}, ${d})">
          <div class="${dateNumCls}">${d}</div>
          <div class="evt-container">${evtTags}</div>
        </div>`;
        }

        const grid = document.getElementById('fullCalGrid');
        if (!grid) return;
        grid.innerHTML = html;
    },

    selectDay(y, m, d) {
        const pad = n => String(n).padStart(2, '0');
        const dateStr = `${y}-${pad(m + 1)}-${pad(d)}`;
        const label = `${m + 1}월 ${d}일 일정`;
        if (typeof renderDaySchedule === 'function') renderDaySchedule(dateStr, label);
    },

    _renderList() {
        const { _year: y, _month: m } = this;
        const lvTitle = document.getElementById('listViewTitle');
        if (lvTitle) lvTitle.textContent = `${y}년 ${m + 1}월 일정 목록`;

        const monthEvts = CALENDAR_EVENTS
            .filter(e => {
                const ed = new Date(e.date);
                return ed.getFullYear() === y && ed.getMonth() === m && this._filter[e.cat];
            })
            .sort((a, b) => a.date.localeCompare(b.date));

        const countEl = document.getElementById('eventCount');
        if (countEl) countEl.textContent = `${monthEvts.length}건`;

        const listEl = document.getElementById('eventListWrap');
        if (!listEl) return;

        if (!monthEvts.length) {
            listEl.innerHTML = `
        <div style="text-align:center;padding:40px;color:var(--gray-mid)">
          이번 달 등록된 일정이 없습니다.
        </div>`;
            return;
        }

        listEl.innerHTML = monthEvts.map(e => {
            const d = new Date(e.date);
            const meta = this.CAT_META[e.cat] || { label: e.cat };
            const cursor = e.link ? 'cursor:pointer' : '';
            const clickAttr = e.link ? `onclick="location.href='${e.link}'"` : '';
            return `
        <div style="display:flex;gap:16px;align-items:flex-start;
                    padding:14px 0;border-bottom:1px solid var(--gray-light);${cursor}" ${clickAttr}>
          <div style="background:var(--green-dark);color:#fff;border-radius:8px;
                      padding:8px 12px;text-align:center;min-width:52px;flex-shrink:0">
            <div style="font-size:11px;opacity:.8">${d.getMonth() + 1}월</div>
            <div style="font-size:22px;font-weight:700;line-height:1">${d.getDate()}</div>
          </div>
          <div>
            <h4 style="font-size:14px;font-weight:700;margin-bottom:4px">
              ${e.title}
              <span class="badge badge-green" style="font-size:11px">${meta.label}</span>
            </h4>
            <p style="font-size:13px;color:var(--gray-mid)">${e.desc.split('\n')[0]}</p>
          </div>
        </div>`;
        }).join('');
    },

    _renderUpcoming() {
        const today = new Date();
        const upEl = document.getElementById('upcomingList');
        if (!upEl) return;

        const upcoming = CALENDAR_EVENTS
            .filter(e => new Date(e.date) >= today && this._filter[e.cat])
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(0, 5);

        if (!upcoming.length) {
            upEl.innerHTML = `
        <p style="font-size:13px;color:var(--gray-mid);
                  text-align:center;padding:12px 0">
          예정된 일정이 없습니다.
        </p>`;
            return;
        }

        upEl.innerHTML = upcoming.map(e => {
            const meta = this.CAT_META[e.cat] || { label: e.cat };
            const cursor = e.link ? 'cursor:pointer' : '';
            const clickAttr = e.link ? `onclick="location.href='${e.link}'"` : '';
            return `
        <div style="padding:8px 0;border-bottom:1px solid var(--gray-light);${cursor}" ${clickAttr}>
          <div style="font-size:12px;color:var(--gray-mid)">
            ${e.date} · ${meta.label}
          </div>
          <div style="font-size:14px;font-weight:600;color:var(--gray-dark);margin-top:2px">
            ${e.title}
          </div>
        </div>`;
        }).join('');
    },

};


/* ══════════════════════════════════════════════
   3. 공지사항 컨트롤러
══════════════════════════════════════════════ */
const NoticeCtrl = {
    _board: null,

    init() {
        this._board = createCommunityBoard({
            data: NOTICE_DATA.normals,
            tableBodyId: 'noticeTableBody',
            paginationId: 'noticePagination',
            countId: 'noticeCount',
            notices: NOTICE_DATA.pinned,
            rowRenderer: (row, seq, isPinned) => `
  <tr class="${isPinned ? 'pinned' : ''}">
    <td class="col-num">
      ${isPinned ? '<span class="badge-notice">공지</span>' : seq}
    </td>
    <td class="td-title">
      <a href="notice-detail.html?id=${row.id}">
        ${row.title}
      </a>
    </td>
    <td class="col-author">${row.author}</td>
    <td class="col-date">${row.date}</td>
  </tr>`,

        });
        this._board.init();
    },

    search() {
        const keyword = document.getElementById('noticeKeyword')?.value || '';
        this._board?.search(keyword);
    },

    reset() {
        ['noticeSearchType', 'noticeKeyword'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        this._board?.search('');
    },

    changePageSize(size) {
        this._board?.changePageSize(Number(size));
    },

    renderDetail() {
        const id  = App.getParam('id');
        const all = [...NOTICE_DATA.pinned, ...NOTICE_DATA.normals];
        const item = all.find(d => String(d.id) === String(id));
        const el   = document.getElementById('noticeDetail');
        if (!el) return;
        if (!item) {
            el.innerHTML = `<div style="text-align:center;padding:48px;color:var(--gray-mid)">게시물을 찾을 수 없습니다.</div>`;
            return;
        }
        const idx  = all.findIndex(d => d.id === item.id);
        const next = all[idx - 1];
        const prev = all[idx + 1];
        const isPinned = NOTICE_DATA.pinned.some(d => d.id === item.id);
        const badge = isPinned
            ? `<span class="cd-status-badge" style="background:var(--accent);border-color:var(--accent);color:#fff">공지</span>`
            : '';
        const attachHtml = (item.attachments || []).length
            ? `<div class="cd-attach">
                 ${item.attachments.map(a => `
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
        const navHtml = (next || prev) ? `
          <div class="cd-nav">
            ${next ? `<div class="cd-nav-item" onclick="location.href='notice-detail.html?id=${next.id}'">
              <span class="cd-nav-label">다음글</span>
              <span class="cd-nav-title">${next.title}</span>
            </div>` : ''}
            ${prev ? `<div class="cd-nav-item" onclick="location.href='notice-detail.html?id=${prev.id}'">
              <span class="cd-nav-label">이전글</span>
              <span class="cd-nav-title">${prev.title}</span>
            </div>` : ''}
          </div>` : '';
        el.innerHTML = `
          <div class="cd-wrap">
            <div class="cd-head">
              <div class="cd-head-left">
                <h2 class="cd-title">${item.title}</h2>
                ${badge}
              </div>
              <span class="cd-date">${item.date}</span>
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
                      onclick="location.href='notice-list.html'">목록</button>
              ${App.user?.role === 'admin' ? `<div class="cd-actions-right">
                <button class="btn btn-danger btn-sm"
                        onclick="App.deletePost(${item.id},[NOTICE_DATA.pinned,NOTICE_DATA.normals],'notice-list.html')">삭제</button>
              </div>` : ''}
            </div>
          </div>`;
    },
};


/* ══════════════════════════════════════════════
   4. 자유게시판 컨트롤러
══════════════════════════════════════════════ */
const FreeCtrl = {
    _board: null,

    init() {
        this._board = createCommunityBoard({
            data: FREE_DATA.normals,
            tableBodyId: 'freeTableBody',
            paginationId: 'freePagination',
            countId: 'freeCount',
            notices: FREE_DATA.pinned,
            rowRenderer: (row, seq) => `
  <tr>
    <td class="col-num">${seq}</td>
    <td class="td-title">
      <a href="free-detail.html?id=${row.id}">${row.title}</a>
    </td>
    <td class="col-author">${row.author}</td>
    <td class="col-date">${row.date}</td>
  </tr>`,
        });
        this._board.init();
    },

    renderDetail() {
        const id  = App.getParam('id');
        const all = [...(FREE_DATA.pinned || []), ...FREE_DATA.normals];
        const item = all.find(d => String(d.id) === String(id));
        const el   = document.getElementById('freeDetail');
        if (!el) return;
        if (!item) {
            el.innerHTML = `<div style="text-align:center;padding:48px;color:var(--gray-mid)">게시물을 찾을 수 없습니다.</div>`;
            return;
        }
        const idx  = all.findIndex(d => d.id === item.id);
        const next = all[idx - 1];
        const prev = all[idx + 1];
        const navHtml = (next || prev) ? `
          <div class="cd-nav">
            ${next ? `<div class="cd-nav-item" onclick="location.href='free-detail.html?id=${next.id}'">
              <span class="cd-nav-label">다음글</span>
              <span class="cd-nav-title">${next.title}</span>
            </div>` : ''}
            ${prev ? `<div class="cd-nav-item" onclick="location.href='free-detail.html?id=${prev.id}'">
              <span class="cd-nav-label">이전글</span>
              <span class="cd-nav-title">${prev.title}</span>
            </div>` : ''}
          </div>` : '';
        const canMod = App.canModify(item);
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
              <div class="cd-content">${item.content || '<p>내용이 없습니다.</p>'}</div>
            </div>
            ${navHtml}
            <div class="cd-actions">
              <button class="btn btn-primary btn-sm cd-btn-list"
                      onclick="location.href='free.html'">목록</button>
              ${canMod ? `<div class="cd-actions-right">
                <button class="btn btn-gray btn-sm"
                        onclick="location.href='free-write.html?edit=${item.id}'">수정</button>
                <button class="btn btn-danger btn-sm"
                        onclick="App.deletePost(${item.id},[FREE_DATA.pinned,FREE_DATA.normals],'free.html')">삭제</button>
              </div>` : ''}
            </div>
          </div>`;
    },

    search() {
        this._board?.search(document.getElementById('freeKeyword')?.value || '');
    },

    reset() {
        const el = document.getElementById('freeKeyword');
        if (el) el.value = '';
        this._board?.search('');
    },

};


/* ══════════════════════════════════════════════
   5. 언론보도 컨트롤러
══════════════════════════════════════════════ */
const PressCtrl = {
    _board: null,
    _allData() { return [...PRESS_DATA.pinned, ...PRESS_DATA.normals]; },

    init() {
        this._board = createCommunityBoard({
            data: PRESS_DATA.normals,
            tableBodyId: 'pressTableBody',
            paginationId: 'pressPagination',
            countId: 'pressCount',
            notices: PRESS_DATA.pinned,
            rowRenderer: (row, seq, isPinned) => `
  <tr class="${isPinned ? 'pinned' : ''}">
    <td class="col-num">
      ${isPinned ? '<span class="badge-notice">공지</span>' : seq}
    </td>
    <td class="td-title">
      <a href="press-detail.html?id=${row.id}">
        ${row.title}
      </a>
    </td>
    <td class="col-author">${row.author}</td>
    <td class="col-date">${row.date}</td>
  </tr>`,
        });
        this._board.init();
    },

    renderDetail() {
        const all  = this._allData();
        const id   = Number(App.getParam('id'));
        const el   = document.getElementById('pressDetail');
        if (!el) return;
        const item = all.find(d => d.id === id);
        if (!item) { el.innerHTML = '<p style="padding:40px;text-align:center;color:var(--gray-mid)">게시물을 찾을 수 없습니다.</p>'; return; }
        const idx  = all.findIndex(d => d.id === id);
        const next = all[idx - 1];
        const prev = all[idx + 1];
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
              <div class="cd-content">${item.content}</div>
            </div>
            ${(next || prev) ? `<div class="cd-nav">
              ${next ? `<div class="cd-nav-item" onclick="location.href='press-detail.html?id=${next.id}'">
                <span class="cd-nav-label">다음글</span>
                <span class="cd-nav-title">${next.title}</span>
              </div>` : ''}
              ${prev ? `<div class="cd-nav-item" onclick="location.href='press-detail.html?id=${prev.id}'">
                <span class="cd-nav-label">이전글</span>
                <span class="cd-nav-title">${prev.title}</span>
              </div>` : ''}
            </div>` : ''}
            <div class="cd-actions">
              <button class="btn btn-primary btn-sm" onclick="location.href='press.html'">목록</button>
              <div class="cd-actions-right">
                ${item.link && item.link !== '#' ? `<a href="${item.link}" target="_blank" rel="noopener noreferrer" class="btn btn-gray btn-sm">원문 보기</a>` : ''}
              </div>
            </div>
          </div>`;
    },

    search() {
        this._board?.search(document.getElementById('pressKeyword')?.value || '');
    },

    reset() {
        const el = document.getElementById('pressKeyword');
        if (el) el.value = '';
        this._board?.search('');
    },
};


/* ══════════════════════════════════════════════
   6. 일자리 및 교육정보 컨트롤러
══════════════════════════════════════════════ */
const JobCtrl = {
    _board: null,

    init() {
        this._board = createCommunityBoard({
            data: JOB_DATA.normals,
            tableBodyId: 'jobTableBody',
            paginationId: 'jobPagination',
            countId: 'jobCount',
            notices: JOB_DATA.pinned,
            rowRenderer: (row, seq, isPinned) => `
  <tr class="${isPinned ? 'pinned' : ''}">
    <td class="col-num center">${isPinned ? '<span class="badge-notice">공지</span>' : seq}</td>
    <td class="td-title">
      <a href="job-detail.html?id=${row.id}">${row.title}</a>
    </td>
    <td class="col-author">${row.author}</td>
    <td class="col-date">${row.date}</td>
  </tr>`,
        });
        this._board.init();
    },

    renderDetail() {
        const id  = App.getParam('id');
        const all = [...(JOB_DATA.pinned || []), ...JOB_DATA.normals];
        const item = all.find(d => String(d.id) === String(id));
        const el   = document.getElementById('jobDetail');
        if (!el) return;
        if (!item) {
            el.innerHTML = `<div style="text-align:center;padding:48px;color:var(--gray-mid)">게시물을 찾을 수 없습니다.</div>`;
            return;
        }
        const idx  = all.findIndex(d => d.id === item.id);
        const next = all[idx - 1];
        const prev = all[idx + 1];
        const isPinned = (JOB_DATA.pinned || []).some(d => d.id === item.id);
        const badge = isPinned
            ? `<span class="cd-status-badge" style="background:var(--accent);border-color:var(--accent);color:#fff">공지</span>`
            : '';
        const navHtml = (next || prev) ? `
          <div class="cd-nav">
            ${next ? `<div class="cd-nav-item" onclick="location.href='job-detail.html?id=${next.id}'">
              <span class="cd-nav-label">다음글</span>
              <span class="cd-nav-title">${next.title}</span>
            </div>` : ''}
            ${prev ? `<div class="cd-nav-item" onclick="location.href='job-detail.html?id=${prev.id}'">
              <span class="cd-nav-label">이전글</span>
              <span class="cd-nav-title">${prev.title}</span>
            </div>` : ''}
          </div>` : '';
        const canMod = App.canModify(item);
        el.innerHTML = `
          <div class="cd-wrap">
            <div class="cd-head">
              <div class="cd-head-left">
                <h2 class="cd-title">${item.title}</h2>
                ${badge}
              </div>
              <span class="cd-date">${item.date}</span>
            </div>
            <div class="cd-meta">
              <span>작성자 <strong>${item.author}</strong></span>
            </div>
            <hr class="cd-divider">
            <div class="cd-body">
              <div class="cd-content">${item.content || '<p>내용이 없습니다.</p>'}</div>
            </div>
            ${navHtml}
            <div class="cd-actions">
              <button class="btn btn-primary btn-sm cd-btn-list"
                      onclick="location.href='job.html'">목록</button>
              ${canMod ? `<div class="cd-actions-right">
                <button class="btn btn-gray btn-sm"
                        onclick="location.href='job-write.html?edit=${item.id}'">수정</button>
                <button class="btn btn-danger btn-sm"
                        onclick="App.deletePost(${item.id},[JOB_DATA.pinned,JOB_DATA.normals],'job.html')">삭제</button>
              </div>` : ''}
            </div>
          </div>`;
    },

    search() {
        const keyword = document.getElementById('jobKeyword')?.value || '';
        this._board?.filterFn(r => {
            if (keyword && !r.title.toLowerCase().includes(keyword.toLowerCase())) return false;
            return true;
        });
    },

    reset() {
        const el = document.getElementById('jobKeyword');
        if (el) el.value = '';
        this._board?.filterFn(null);
    },
};


/* ══════════════════════════════════════════════
   7. 갤러리 컨트롤러
   - 썸네일 카드형 목록
   - 카드 클릭 → gallery-detail.html 이동
   - renderDetail(): 본문 + 외부 링크
══════════════════════════════════════════════ */
const GalleryCtrl = {
    _data: GALLERY_DATA,
    _filtered: [...GALLERY_DATA],
    _page: 1,
    _pageSize: 12,

    init() { this.render(); },

    /* ── 본문 첫 번째 <img src> 추출 유틸 (실제 에디터 이미지 대응) */
    _extractThumb(htmlStr) {
        if (!htmlStr) return null;
        const m = htmlStr.match(/<img[^>]+src=["']([^"']+)["']/i);
        return m ? m[1] : null;
    },

    render() {
        const total = this._filtered.length;
        const slice = this._filtered.slice(
            (this._page - 1) * this._pageSize,
            this._page * this._pageSize
        );
        const countEl = document.getElementById('galleryCount');
        if (countEl) countEl.textContent = total.toLocaleString();
        const grid = document.getElementById('galleryGrid');
        if (!grid) return;
        grid.innerHTML = slice.length
            ? slice.map(item => {
                const thumbSrc = item.imgUrl || this._extractThumb(item.content);
                const thumb = thumbSrc
                    ? `<div class="gallery-thumb" style="background-image:url('${thumbSrc}')"></div>`
                    : `<div class="gallery-thumb-placeholder"></div>`;
                return `
                <div class="gallery-card"
                     onclick="location.href='gallery-detail.html?id=${item.id}'"
                     style="cursor:pointer">
                  ${thumb}
                  <div class="gallery-info">
                    <div class="gallery-title">${item.title}</div>
                    <div class="gallery-meta">
                      <span>${item.author}</span>
                      <span>${item.date}</span>
                    </div>
                  </div>
                </div>`;
              }).join('')
            : `<div style="grid-column:1/-1;text-align:center;
                     padding:40px;color:var(--gray-mid)">
           등록된 사진이 없습니다.
         </div>`;
        App.renderPagination(
            'galleryPagination',
            this._page,
            Math.ceil(total / this._pageSize) || 1,
            (p) => { this._page = p; this.render(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
        );
    },

    /* ── 상세 페이지 렌더 */
    renderDetail() {
        const id   = App.getParam('id');
        const item = this._data.find(d => String(d.id) === String(id));
        const el   = document.getElementById('galleryDetail');
        if (!el) return;
        if (!item) {
            el.innerHTML = `<div style="text-align:center;padding:48px;color:var(--gray-mid)">게시물을 찾을 수 없습니다.</div>`;
            return;
        }
        const idx  = this._data.findIndex(d => d.id === item.id);
        const next = this._data[idx - 1];
        const prev = this._data[idx + 1];
        const linkBtn = item.link
            ? `<a href="${item.link}" target="_blank" rel="noopener noreferrer"
                  class="btn btn-outline btn-sm">관련 페이지 바로가기</a>`
            : '';
        const navHtml = (next || prev) ? `
          <div class="cd-nav">
            ${next ? `<div class="cd-nav-item" onclick="location.href='gallery-detail.html?id=${next.id}'">
              <span class="cd-nav-label">다음글</span>
              <span class="cd-nav-title">${next.title}</span>
            </div>` : ''}
            ${prev ? `<div class="cd-nav-item" onclick="location.href='gallery-detail.html?id=${prev.id}'">
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
                      onclick="location.href='gallery.html'">목록</button>
              <div class="cd-actions-right">
                ${linkBtn}
              </div>
            </div>
          </div>`;
    },

    search() {
        const kw = document.getElementById('galleryKeyword')?.value.trim().toLowerCase() || '';
        this._filtered = kw
            ? this._data.filter(r => r.title.toLowerCase().includes(kw))
            : [...this._data];
        this._page = 1;
        this.render();
    },

    reset() {
        const el = document.getElementById('galleryKeyword');
        if (el) el.value = '';
        this._filtered = [...this._data];
        this._page = 1;
        this.render();
    },
};



/* ══════════════════════════════════════════════
   8. 숲일터 컨트롤러 (관리자 등록 전용)
══════════════════════════════════════════════ */
const ForestWorkCtrl = {
    _board: null,

    init() {
        this._board = createCommunityBoard({
            data: FOREST_WORK_DATA.normals,
            tableBodyId: 'forestWorkTableBody',
            paginationId: 'forestWorkPagination',
            countId: 'forestWorkCount',
            rowRenderer: (row, seq) => `
  <tr>
    <td class="col-num">${seq}</td>
    <td class="td-title">
      <a href="forest-work-detail.html?id=${row.id}">${row.title}</a>
    </td>
    <td class="col-author">${row.author}</td>
    <td class="col-date">${row.date}</td>
  </tr>`,
        });
        this._board.init();
    },

    search() {
        const keyword = document.getElementById('forestWorkKeyword')?.value || '';
        this._board?.search(keyword);
    },

    renderDetail() {
        const id   = App.getParam('id');
        const all  = [...FOREST_WORK_DATA.normals];
        const item = all.find(d => String(d.id) === String(id));
        const el   = document.getElementById('forestWorkDetail');
        if (!el) return;
        if (!item) {
            el.innerHTML = `<div style="text-align:center;padding:48px;color:var(--gray-mid)">게시물을 찾을 수 없습니다.</div>`;
            return;
        }
        const idx  = all.findIndex(d => d.id === item.id);
        const next = all[idx - 1];
        const prev = all[idx + 1];
        const navHtml = (next || prev) ? `
          <div class="cd-nav">
            ${next ? `<div class="cd-nav-item" onclick="location.href='forest-work-detail.html?id=${next.id}'">
              <span class="cd-nav-label">다음글</span>
              <span class="cd-nav-title">${next.title}</span>
            </div>` : ''}
            ${prev ? `<div class="cd-nav-item" onclick="location.href='forest-work-detail.html?id=${prev.id}'">
              <span class="cd-nav-label">이전글</span>
              <span class="cd-nav-title">${prev.title}</span>
            </div>` : ''}
          </div>` : '';
        el.innerHTML = `
          <div class="cd-wrap">
            <div class="cd-head">
              <div class="cd-head-left"><h2 class="cd-title">${item.title}</h2></div>
              <span class="cd-date">${item.date}</span>
            </div>
            <div class="cd-meta"><span>작성자 <strong>${item.author}</strong></span></div>
            <hr class="cd-divider">
            <div class="cd-body"><div class="cd-content">${item.content || ''}</div></div>
            ${navHtml}
            <div class="cd-actions">
              <button class="btn btn-primary btn-sm cd-btn-list"
                      onclick="location.href='forest-work.html'">목록</button>
            </div>
          </div>`;
    },
};


/* ══════════════════════════════════════════════
   10. 페이지 자동 초기화 (소식지·자료실 제외 → community-media.js 참조)
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;

    const initMap = {
        'calendar':        () => CalendarCtrl.init(),
        'notice':          () => NoticeCtrl.init(),
        'notice-detail':   () => NoticeCtrl.renderDetail(),
        'free':            () => FreeCtrl.init(),
        'free-detail':     () => FreeCtrl.renderDetail(),
        'press':           () => PressCtrl.init(),
        'press-detail':    () => PressCtrl.renderDetail(),
        'job':             () => JobCtrl.init(),
        'job-detail':      () => JobCtrl.renderDetail(),
        'gallery':           () => GalleryCtrl.init(),
        'gallery-detail':    () => GalleryCtrl.renderDetail(),
        'forest-work':       () => ForestWorkCtrl.init(),
        'forest-work-detail':() => ForestWorkCtrl.renderDetail(),
        /* 'newsletter' / 'archive' → community-media.js 에서 처리 */
    };

    if (page && initMap[page]) {
        initMap[page]();
    }
});