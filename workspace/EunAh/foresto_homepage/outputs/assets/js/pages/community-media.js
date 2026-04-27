/* =============================================
   community-media.js | 소식지·자료실 컨트롤러
   community.js에서 분리됨 (H-3 리팩토링)
   ============================================= */
'use strict';

/* ══════════════════════════════════════════════
   8. 협회소식지 컨트롤러
══════════════════════════════════════════════ */
const NewsletterCtrl = {

    DATA: [
        {
            id: 10, year: 2026, half: '상반기', isPin: true,
            title: '한국숲해설가협회 소식지 2026년 상반기호',
            author: '사무국', date: '2026-06-30',
            content: `<p>55기 전문가과정 수료, 사공단 봉사활동 성과, 동아리 정기총회 결과 등 2026년 상반기 주요 활동을 담았습니다.</p>
                      <p>이번 호에는 신규 정회원 소개와 협회 창립 25주년 기념 특집 기사를 수록했습니다.</p>`,
            attachments: [
                { name: '소식지_2026_상반기.pdf', ext: 'pdf', size: '8.2MB' },
            ],
        },
        {
            id: 9, year: 2025, half: '하반기',
            title: '한국숲해설가협회 소식지 2025년 하반기호',
            author: '사무국', date: '2025-12-31',
            content: `<p>2025년 하반기 협회 주요 활동 및 회원 소식을 담았습니다.</p>
                      <p>수료식, 정기총회, 봉사활동 성과를 정리했습니다.</p>`,
            attachments: [
                { name: '소식지_2025_하반기.pdf', ext: 'pdf', size: '7.8MB' },
            ],
        },
        {
            id: 8, year: 2025, half: '상반기',
            title: '한국숲해설가협회 소식지 2025년 상반기호',
            author: '사무국', date: '2025-06-30',
            content: `<p>2025년 상반기 협회 주요 활동 및 회원 소식을 담았습니다.</p>
                      <p>전문가과정 운영 현황, 역량강화 교육, 신입회원 활동 소식을 담았습니다.</p>`,
            attachments: [
                { name: '소식지_2025_상반기.pdf', ext: 'pdf', size: '7.5MB' },
            ],
        },
    ],

    _filtered: [],
    _page: 1,
    _pageSize: 12,

    init() {
        this._filtered = [...this.DATA];
        this.render();
    },

    search() {
        const kw = (document.getElementById('nlSearchInput')?.value || '').trim().toLowerCase();
        this._filtered = kw
            ? this.DATA.filter(d => d.title.toLowerCase().includes(kw) ||
                                    d.content.toLowerCase().includes(kw))
            : [...this.DATA];
        this._page = 1;
        this.render();
    },

    reset() {
        const el = document.getElementById('nlSearchInput');
        if (el) el.value = '';
        this._filtered = [...this.DATA];
        this._page = 1;
        this.render();
    },

    render() {
        const total = this._filtered.length;
        const slice = this._filtered.slice(
            (this._page - 1) * this._pageSize,
            this._page * this._pageSize
        );

        const countEl = document.getElementById('nlCount');
        if (countEl) countEl.textContent = total.toLocaleString();

        const grid = document.getElementById('nlGrid');
        if (!grid) return;
        if (!grid.classList.contains('newsletter-grid')) {
            grid.classList.add('newsletter-grid');
        }

        if (!slice.length) {
            grid.innerHTML = `
                <div style="grid-column:1/-1;text-align:center;
                            padding:60px;color:var(--gray-mid)">
                  검색 결과가 없습니다.
                </div>`;
            App.renderPagination('nlPagination', 1, 1, () => {});
            return;
        }

        grid.innerHTML = slice.map(item => {
            const pinBadge = item.isPin
                ? `<span class="nl-cover-badge">공지</span>`
                : '';
            return `
            <div class="nl-card"
                 onclick="location.href='newsletter-detail.html?id=${item.id}'">
              <div class="nl-cover">
                ${pinBadge}
                <div class="nl-cover-title">소식지 썸네일</div>
              </div>
              <div class="nl-info">
                <div class="nl-info-title">${item.title}</div>
                <div class="nl-info-meta">
                  <span>${item.date}</span>
                </div>
              </div>
            </div>`;
        }).join('');

        App.renderPagination(
            'nlPagination',
            this._page,
            Math.ceil(total / this._pageSize) || 1,
            (p) => { this._page = p; this.render(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
        );
    },

    renderDetail() {
        const id   = App.getParam('id');
        const item = this.DATA.find(d => String(d.id) === String(id));
        const el   = document.getElementById('newsletterDetail');
        if (!el) return;

        if (!item) {
            el.innerHTML = `
                <div style="text-align:center;padding:48px;color:var(--gray-mid)">
                  게시물을 찾을 수 없습니다.
                </div>`;
            return;
        }

        const idx  = this.DATA.findIndex(d => d.id === item.id);
        const prev = this.DATA[idx + 1];
        const next = this.DATA[idx - 1];

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
            ${next ? `<div class="cd-nav-item" onclick="location.href='newsletter-detail.html?id=${next.id}'">
              <span class="cd-nav-label">다음글</span>
              <span class="cd-nav-title">${next.title}</span>
            </div>` : ''}
            ${prev ? `<div class="cd-nav-item" onclick="location.href='newsletter-detail.html?id=${prev.id}'">
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
            ${attachHtml}
            <div class="cd-body">
              <div class="cd-content">${item.content || ''}</div>
            </div>
            ${navHtml}
            <div class="cd-actions">
              <button class="btn btn-primary btn-sm cd-btn-list"
                      onclick="location.href='newsletter.html'">목록</button>
            </div>
          </div>`;
    },

    download(file, name) {
        App.toast(`"${name}" 다운로드를 시작합니다.`);
    },
};


/* ══════════════════════════════════════════════
   9. 자료실 컨트롤러
══════════════════════════════════════════════ */
const ArchiveCtrl = {

    DATA: [
        {
            id: 20, isPin: true,
            title: '숲해설가 교육 매뉴얼 2026',
            content: `<p>본 매뉴얼은 2026년 개정된 숲해설가 교육 과정 전체를 담고 있습니다.</p>
                      <p>1장 숲해설가의 역할과 자세, 2장 생태 해설 기법, 3장 현장 실습 가이드, 4장 안전 관리 수칙 등으로 구성되어 있습니다.</p>
                      <p>교육 매뉴얼은 정회원 대상으로 배포되며, 외부 공유를 금합니다.</p>`,
            author: '사무국', date: '2026-03-01',
            attachments: [
                { name: '교육매뉴얼_2026.pdf', ext: 'pdf', size: '4.2MB' },
            ],
        },
        {
            id: 19, isPin: true,
            title: '봄철 식물 해설 참고자료',
            content: `<p>봄철 주요 식물 해설에 활용할 수 있는 사진·설명 자료집입니다.</p>
                      <p>진달래, 개나리, 목련 등 봄철 개화 식물 40여 종의 생태 특성과 해설 포인트를 정리했습니다.</p>`,
            author: '사무국', date: '2026-02-20',
            attachments: [
                { name: '봄철식물자료.pdf', ext: 'pdf', size: '8.1MB' },
            ],
        },
        {
            id: 18,
            title: '숲 생태 해설 자료집 v3',
            content: `<p>숲 생태 관련 해설 자료 최신 버전(v3)입니다.</p>
                      <p>v2 대비 수목 도감 이미지 전면 교체, 해설 스크립트 보완, 계절별 포인트 정리가 추가되었습니다.</p>`,
            author: '교육팀', date: '2025-11-15',
            attachments: [
                { name: '생태해설자료_v3.pdf', ext: 'pdf', size: '6.7MB' },
                { name: '생태해설자료_v3_요약본.pdf', ext: 'pdf', size: '1.2MB' },
            ],
        },
        {
            id: 17,
            title: '조류 생태 관찰 가이드',
            content: `<p>숲 해설 시 자주 만나는 조류 30종의 사진 및 설명 가이드입니다.</p>
                      <p>각 조류의 특징, 서식지, 계절별 관찰 포인트, 울음소리 특성을 담았습니다.</p>`,
            author: '생태팀', date: '2025-09-10',
            attachments: [
                { name: '조류가이드.pdf', ext: 'pdf', size: '5.3MB' },
            ],
        },
        {
            id: 16,
            title: '협회 회원 가입 신청서',
            content: `<p>협회 신규 회원 가입 시 제출하는 신청서 양식입니다.</p>
                      <p>작성 완료 후 사무국 이메일(foresto@example.com)로 제출하거나 직접 방문 제출해 주세요.</p>`,
            author: '사무국', date: '2026-01-05',
            attachments: [
                { name: '회원가입신청서.hwp', ext: 'hwp', size: '0.3MB' },
                { name: '회원가입신청서.docx', ext: 'docx', size: '0.3MB' },
            ],
        },
        {
            id: 15,
            title: '강사 활동 일지 양식',
            content: `<p>숲 해설 강사 활동 일지 작성 양식입니다.</p>
                      <p>매월 말일 사무국에 제출해 주시기 바랍니다. HWP 또는 DOCX 중 편한 형식으로 작성하세요.</p>`,
            author: '사무국', date: '2026-01-05',
            attachments: [
                { name: '강사활동일지.hwp', ext: 'hwp', size: '0.2MB' },
                { name: '강사활동일지.docx', ext: 'docx', size: '0.2MB' },
            ],
        },
        {
            id: 14,
            title: '사공단 활동 보고 양식',
            content: `<p>사회공헌사업단 활동 보고서 작성 양식입니다.</p>
                      <p>봉사 활동 완료 후 7일 이내 사무국에 제출해 주세요.</p>`,
            author: '사무국', date: '2026-01-05',
            attachments: [
                { name: '사공단활동보고.hwp', ext: 'hwp', size: '0.2MB' },
            ],
        },
        {
            id: 13,
            title: '동아리 활동 계획서 양식',
            content: `<p>동아리 연간 활동 계획서 작성 양식입니다.</p>
                      <p>매년 1월 31일까지 작성하여 사무국에 제출해 주시기 바랍니다.</p>`,
            author: '사무국', date: '2025-12-20',
            attachments: [
                { name: '동아리활동계획서.docx', ext: 'docx', size: '0.2MB' },
            ],
        },
        {
            id: 12,
            title: '2025년 사업 결과 보고서',
            content: `<p>2025년 협회 전체 사업 추진 결과 종합 보고서입니다.</p>
                      <p>전문가과정 운영, 사공단 봉사활동, 시민아카데미 강좌, 동아리 활동 현황 등을 포함합니다.</p>`,
            author: '사무국', date: '2026-02-10',
            attachments: [
                { name: '2025사업결과보고서.pdf', ext: 'pdf', size: '3.5MB' },
            ],
        },
        {
            id: 11,
            title: '2025년 사공단 연간 활동 보고서',
            content: `<p>2025년 사회공헌사업단 연간 봉사 활동 실적 보고서입니다.</p>
                      <p>총 봉사 횟수, 참여 인원, 활동 지역 등 통계와 주요 활동 사진이 포함되어 있습니다.</p>`,
            author: '사공단', date: '2026-02-05',
            attachments: [
                { name: '사공단_2025연간보고.pdf', ext: 'pdf', size: '2.1MB' },
            ],
        },
        {
            id: 10,
            title: '회원 현황 통계 보고서 2025',
            content: `<p>2025년 회원 현황 및 활동 통계 보고서입니다.</p>
                      <p>회원 등급별 현황, 지역별 분포, 신규 가입/탈퇴 추이 등을 엑셀 형식으로 정리했습니다.</p>`,
            author: '사무국', date: '2026-01-20',
            attachments: [
                { name: '회원통계_2025.xlsx', ext: 'xlsx', size: '1.2MB' },
            ],
        },
        {
            id: 9,
            title: '협회 정관 (2026년 개정)',
            content: `<p>2026년 정기총회에서 개정된 최신 협회 정관입니다.</p>
                      <p>이번 개정에서는 정회원 자격 기준 명확화, 총회 의결 정족수 조정, 임원 임기 규정 보완 등이 반영되었습니다.</p>`,
            author: '사무국', date: '2026-03-01',
            attachments: [
                { name: '협회정관_2026.pdf', ext: 'pdf', size: '0.8MB' },
            ],
        },
        {
            id: 8,
            title: '회원 규정집 (2025년 개정)',
            content: `<p>회원 등급, 권리/의무, 징계 등 회원 규정 전체를 담은 문서입니다.</p>
                      <p>회원 활동 시 반드시 숙지하시기 바랍니다.</p>`,
            author: '사무국', date: '2025-08-15',
            attachments: [
                { name: '회원규정_2025.pdf', ext: 'pdf', size: '0.6MB' },
            ],
        },
        {
            id: 7,
            title: '윤리강령 및 행동지침',
            content: `<p>협회 임원 및 회원의 윤리강령과 행동지침을 담은 문서입니다.</p>
                      <p>모든 회원은 협회 활동 시 본 윤리강령을 준수하여야 합니다.</p>`,
            author: '사무국', date: '2025-03-10',
            attachments: [
                { name: '윤리강령.pdf', ext: 'pdf', size: '0.4MB' },
            ],
        },
        {
            id: 6,
            title: '회원 혜택 안내문 2026',
            content: `<p>2026년 협회 회원 혜택 및 지원 사항 안내 문서입니다.</p>
                      <p>교육 수강 할인, 자격증 취득 지원, 도서 구입 지원 등 다양한 혜택이 포함되어 있습니다.</p>`,
            author: '사무국', date: '2026-01-10',
            attachments: [
                { name: '회원혜택안내_2026.pdf', ext: 'pdf', size: '0.5MB' },
            ],
        },
        {
            id: 5,
            title: '숲해설가 자격 취득 안내',
            content: `<p>국가 공인 숲해설가 자격 취득 절차 및 준비 사항 안내입니다.</p>
                      <p>응시 자격, 시험 일정, 준비 서류, 교육 이수 요건 등을 상세히 안내합니다.</p>`,
            author: '사무국', date: '2025-10-05',
            attachments: [
                { name: '자격취득안내.pdf', ext: 'pdf', size: '0.7MB' },
            ],
        },
        {
            id: 4,
            title: '협회 홍보 브로슈어 2025',
            content: `<p>협회 소개 및 주요 사업을 담은 홍보용 브로슈어 파일입니다.</p>
                      <p>협회 소개, 교육 사업, 사회공헌 활동 등을 한눈에 볼 수 있습니다.</p>`,
            author: '홍보팀', date: '2025-06-01',
            attachments: [
                { name: '홍보브로슈어_2025.pdf', ext: 'pdf', size: '12.3MB' },
            ],
        },
        {
            id: 3,
            title: '2025 정기총회 자료집',
            content: `<p>2025년 정기총회 발표 자료 및 결의 사항을 담은 문서입니다.</p>
                      <p>사업 결과 보고, 결산 보고, 2026년 사업 계획, 임원 선출 결과가 포함되어 있습니다.</p>`,
            author: '사무국', date: '2025-02-20',
            attachments: [
                { name: '정기총회_2025.pdf', ext: 'pdf', size: '2.8MB' },
            ],
        },
        {
            id: 2,
            title: '숲해설 프로그램 운영 가이드',
            content: `<p>숲해설 프로그램 기획부터 운영까지 전반적인 가이드입니다.</p>
                      <p>대상별 프로그램 설계, 현장 안전 관리, 사후 평가 방법 등을 단계별로 안내합니다.</p>`,
            author: '교육팀', date: '2024-11-30',
            attachments: [
                { name: '프로그램운영가이드.pdf', ext: 'pdf', size: '3.1MB' },
            ],
        },
        {
            id: 1,
            title: '협회 연혁 자료 모음',
            content: `<p>협회 설립부터 현재까지 주요 연혁을 정리한 자료입니다.</p>
                      <p>창립 총회 자료, 주요 사업 이력, 역대 임원 명단 등이 포함되어 있습니다.</p>`,
            author: '사무국', date: '2024-06-15',
            attachments: [
                { name: '연혁자료.pdf', ext: 'pdf', size: '1.4MB' },
            ],
        },
    ],

    _filtered: [],
    _page: 1,
    _pageSize: 10,
    _currentSort: 'latest',

    _isFullMember() {
        return (
            typeof App !== 'undefined' &&
            (App.user.role === 'fullMember' || App.user.role === 'admin')
        );
    },

    init() {
        this._filtered = [...this.DATA];
        this.render();
    },

    changeSort(sort) {
        this._currentSort = sort;
        this._page = 1;
        this._applyFilter();
    },

    search() {
        this._page = 1;
        this._applyFilter();
    },

    reset() {
        this._currentSort = 'latest';
        this._page = 1;
        ['archiveKeyword'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        const sortEl = document.getElementById('archiveSortSelect');
        if (sortEl) sortEl.value = 'latest';
        this._applyFilter();
    },

    _applyFilter() {
        const keyword = (document.getElementById('archiveKeyword')?.value || '').trim().toLowerCase();

        this._filtered = this.DATA.filter(d => {
            if (keyword && !d.title.toLowerCase().includes(keyword) &&
                !d.content.toLowerCase().includes(keyword)) return false;
            return true;
        });

        const sortMap = {
            latest: (a, b) => b.date.localeCompare(a.date),
            views:  (a, b) => b.views - a.views,
        };
        this._filtered.sort(sortMap[this._currentSort] || sortMap.latest);
        this.render();
    },

    _extClass(ext) {
        const map = {
            pdf: 'file-type-pdf', hwp: 'file-type-hwp',
            docx: 'file-type-docx', doc: 'file-type-docx',
            xlsx: 'file-type-xlsx', jpg: 'file-type-img', png: 'file-type-img',
        };
        return map[(ext || '').toLowerCase()] || 'file-type-etc';
    },

    render() {
        const pinned   = this.DATA.filter(d => d.isPin);
        const unpinned = this._filtered.filter(d => !d.isPin);
        const total    = unpinned.length;
        const slice    = unpinned.slice(
            (this._page - 1) * this._pageSize,
            this._page * this._pageSize
        );

        const countEl = document.getElementById('archiveCount');
        if (countEl) countEl.textContent = total.toLocaleString();

        const tbody = document.getElementById('archiveTableBody');
        if (!tbody) return;

        if (!slice.length) {
            tbody.innerHTML = `
                <tr>
                  <td colspan="5" style="text-align:center;padding:40px;color:var(--gray-mid)">
                    등록된 자료가 없습니다.
                  </td>
                </tr>`;
            App.renderPagination('archivePagination', 1, 1, () => {});
            return;
        }

        const renderRow = (item, seqLabel) => {
            return `
                <tr class="${item.isPin ? 'pinned' : ''}">
                  <td class="col-num" style="text-align:center">
                    ${item.isPin ? '<span class="badge-notice">공지</span>' : seqLabel}
                  </td>
                  <td class="td-title">
                    <a href="archive-detail.html?id=${item.id}">
                      ${item.title}
                    </a>
                  </td>
                  <td class="col-author">${item.author}</td>
                  <td class="col-date">${item.date}</td>
                </tr>`;
        };

        const pinnedRows = pinned.map(item => renderRow(item, ''));
        const normalRows = slice.map((item, i) => renderRow(item, total - (this._page - 1) * this._pageSize - i));
        tbody.innerHTML = [...pinnedRows, ...normalRows].join('');

        App.renderPagination(
            'archivePagination',
            this._page,
            Math.ceil(total / this._pageSize) || 1,
            (p) => {
                this._page = p;
                this.render();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        );
    },

    renderDetail() {
        const id   = App.getParam('id');
        const item = this.DATA.find(d => String(d.id) === String(id));
        const el   = document.getElementById('archiveDetail');
        if (!el) return;

        if (!item) {
            el.innerHTML = `
                <div style="text-align:center;padding:48px;color:var(--gray-mid)">
                  게시물을 찾을 수 없습니다.
                </div>`;
            return;
        }

        const isFullMember = this._isFullMember();

        const idx  = this.DATA.findIndex(d => d.id === item.id);
        const prev = this.DATA[idx + 1];
        const next = this.DATA[idx - 1];

        const attachHtml = (item.attachments || []).length
            ? `<div class="cd-attach">
                 ${item.attachments.map(a => {
                     const onclick = isFullMember
                         ? `App.toast('첨부파일 다운로드 — 실제 구현 시 서버 연동 예정', 'info');return false;`
                         : `App.toast('정회원만 다운로드할 수 있습니다.', 'warning');return false;`;
                     return `
                   <a href="#" class="cd-attach-item"${!isFullMember ? ' style="opacity:0.5"' : ''}
                      onclick="${onclick}">
                     <svg class="cd-attach-icon" viewBox="0 0 24 24" fill="none" width="15" height="15">
                       <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.41 17.41a2 2 0 0 1-2.83-2.83l8.49-8.48"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                     </svg>
                     <span>${a.name}</span>
                     <span class="cd-attach-size">(${a.size})</span>
                   </a>`;
                 }).join('')}
                 ${!isFullMember
                     ? `<p style="font-size:12px;color:var(--gray-mid);margin-top:6px">정회원만 파일을 다운로드할 수 있습니다. <a href="../about/members.html">정회원 안내 →</a></p>`
                     : ''}
               </div>`
            : '';

        const navHtml = (next || prev) ? `
          <div class="cd-nav">
            ${next ? `<div class="cd-nav-item" onclick="location.href='archive-detail.html?id=${next.id}'">
              <span class="cd-nav-label">다음글</span>
              <span class="cd-nav-title">${next.title}</span>
            </div>` : ''}
            ${prev ? `<div class="cd-nav-item" onclick="location.href='archive-detail.html?id=${prev.id}'">
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
            ${attachHtml}
            <div class="cd-body">
              <div class="cd-content">${item.content || ''}</div>
            </div>
            ${navHtml}
            <div class="cd-actions">
              <button class="btn btn-primary btn-sm cd-btn-list"
                      onclick="location.href='archive.html'">목록</button>
            </div>
          </div>`;
    },

    download(file, name) {
        if (!this._isFullMember()) {
            App.toast('정회원만 다운로드할 수 있습니다.', 'warning');
            return;
        }
        App.toast(`"${name}" 다운로드를 시작합니다.`);
    },
};


/* ── 소식지·자료실 페이지 자동 초기화 */
document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;
    const initMap = {
        'newsletter':        () => NewsletterCtrl.init(),
        'newsletter-detail': () => NewsletterCtrl.renderDetail(),
        'archive':           () => ArchiveCtrl.init(),
        'archive-detail':    () => ArchiveCtrl.renderDetail(),
    };
    if (page && initMap[page]) initMap[page]();
});