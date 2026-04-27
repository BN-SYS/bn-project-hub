/* =============================================
   mypage.js | 마이페이지 공통 로직
   ============================================= */
'use strict';

const MyPage = {

  /* ─────────────────────────────────────────
     통합 신청 데이터 (교육 + 강사활동)
  ───────────────────────────────────────── */
  ALL_APPLY: [
    /* 교육 — 상태 다양성 유지 (완료·수강중·신청) */
    { id:1, category:'edu', title:'숲해설가 전문과정 55기',    type:'전문과정',    date:'2026-03-01', hours:40, status:'done',     cert:true,  reviewed:true  },
    { id:2, category:'edu', title:'2026 숲해설 직무역량 강화', type:'직무교육',    date:'2026-04-10', hours:16, status:'progress', cert:false, reviewed:false },
    { id:3, category:'edu', title:'봄꽃 산책 — 시민아카데미',  type:'시민아카데미', date:'2026-05-15', hours:6,  status:'applied',  cert:false, reviewed:false },

    /* 강사활동 — 상태 다양성 유지 (완료·신청·미선정) */
    { id:101, category:'instructor', title:'도봉구 초등학교 숲 체험 교육',   type:'강사활동', date:'2026-03-18', hours:4, status:'done',       cert:true,  reviewed:false },
    { id:102, category:'instructor', title:'노원구 복지관 자연치유 프로그램', type:'강사활동', date:'2026-04-28', hours:3, status:'applied',    cert:false, reviewed:false },
    { id:103, category:'instructor', title:'은평구 초등학교 숲 생태 교육',   type:'강사활동', date:'2026-05-10', hours:4, status:'unselected', cert:false, reviewed:false },
  ],

  /* 상태 배지 */
  STATUS_MAP: {
    done:       { label:'완료',   cls:'edu-badge done'       },
    progress:   { label:'수강중', cls:'edu-badge progress'   },
    applied:    { label:'신청',   cls:'edu-badge applied'    },
    cancel:     { label:'취소',   cls:'edu-badge cancel'     },
    unselected: { label:'미선정', cls:'edu-badge unselected' },
  },

  /* 필터값 → 매칭 status 배열 (null = 전체) */
  FILTER_MAP: {
    all:        null,
    applied:    ['applied', 'progress'],
    unselected: ['unselected'],
    done:       ['done'],
    cancel:     ['cancel'],
  },

  _filter: 'all',
  _page:   1,
  PAGE_SZ: 8,

  _reviewTargetId: null,
  _reviewIsEdit:   false,

  /* ─────────────────────────────────────────
     초기화 / 패널 전환
  ───────────────────────────────────────── */
  init() {
    this.showPanel('info');
  },

  showPanel(name) {
    document.querySelectorAll('.my-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.side-nav a').forEach(a => a.classList.remove('active'));
    document.getElementById('panel-' + name)?.classList.add('active');
    document.getElementById('nav-' + name)?.classList.add('active');
    if (name === 'cert') this.renderApply();
  },

  /* ─────────────────────────────────────────
     비밀번호 변경 모달
  ───────────────────────────────────────── */
  openPwModal() {
    ['pwCurrent', 'pwNew', 'pwConfirm'].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = '';
    });
    const msg = document.getElementById('pwMsg');
    if (msg) msg.textContent = '';
    App.openModal('pwModal');
  },

  closePwModal() { App.closeModal('pwModal'); },

  changePw() {
    const cur = document.getElementById('pwCurrent')?.value.trim();
    const nw  = document.getElementById('pwNew')?.value.trim();
    const cf  = document.getElementById('pwConfirm')?.value.trim();
    const msg = document.getElementById('pwMsg');
    if (!cur || !nw || !cf) { if (msg) { msg.style.color = 'var(--danger)'; msg.textContent = '모든 항목을 입력해주세요.'; }           return; }
    if (nw !== cf)           { if (msg) { msg.style.color = 'var(--danger)'; msg.textContent = '새 비밀번호가 일치하지 않습니다.'; }   return; }
    if (nw.length < 8)       { if (msg) { msg.style.color = 'var(--danger)'; msg.textContent = '비밀번호는 8자 이상이어야 합니다.'; }  return; }
    App.closeModal('pwModal');
    App.toast('비밀번호가 변경되었습니다.');
  },

  /* ─────────────────────────────────────────
     탈퇴 모달
  ───────────────────────────────────────── */
  openWithdrawModal() {
    const ta = document.getElementById('withdrawReason');
    const cb = document.getElementById('withdrawAgree');
    if (ta) ta.value = '';
    if (cb) cb.checked = false;
    App.openModal('withdrawModal');
  },

  doWithdraw() {
    if (!document.getElementById('withdrawAgree')?.checked) {
      App.toast('탈퇴 동의 체크박스를 선택해주세요.', 'warning'); return;
    }
    App.closeModal('withdrawModal');
    App.toast('탈퇴 처리가 완료되었습니다.');
    setTimeout(() => { location.href = '../index.html'; }, 1500);
  },

  /* ─────────────────────────────────────────
     신청내역 필터 / 렌더
  ───────────────────────────────────────── */
  filterApply(type) {
    this._filter = type;
    this._page   = 1;
    const sel = document.getElementById('applyFilterSelect');
    if (sel) sel.value = type;
    this.renderApplyTable();
  },

  renderApply() { this.renderApplyTable(); },

  renderApplyTable() {
    const statuses = this.FILTER_MAP[this._filter];
    const filtered = statuses
      ? this.ALL_APPLY.filter(e => statuses.includes(e.status))
      : this.ALL_APPLY;
    const total = filtered.length;
    const slice = filtered.slice((this._page - 1) * this.PAGE_SZ, this._page * this.PAGE_SZ);

    const tbody = document.getElementById('applyTableBody');
    if (!tbody) return;

    if (!slice.length) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:32px;color:var(--gray-mid)">해당 내역이 없습니다.</td></tr>`;
    } else {
      tbody.innerHTML = slice.map((e, i) => {
        const s = this.STATUS_MAP[e.status] || { label: e.status, cls: '' };

        /* 증명서 버튼 */
        let certBtn = '-';
        if (e.cert) {
          const label = e.category === 'instructor' ? '활동확인서' : '수료증';
          certBtn = `<button class="btn btn-outline btn-xs" onclick="MyPage.openCert(${e.id})">${label}</button>`;
        }

        /* 후기 버튼 — 교육 전문과정 + 완료만 */
        let reviewBtn = '-';
        if (e.category === 'edu' && e.type === '전문과정' && e.status === 'done') {
          reviewBtn = e.reviewed
            ? `<button class="btn btn-outline btn-xs" onclick="location.href='../education/review-write.html?eduId=${e.id}&edit=1'">수정하기</button>`
            : `<button class="btn btn-primary btn-xs" onclick="location.href='../education/review-write.html?eduId=${e.id}'">후기 등록</button>`;
        }

        return `<tr>
          <td class="col-num center">${(this._page - 1) * this.PAGE_SZ + i + 1}</td>
          <td class="td-title">${e.title}</td>
          <td class="col-extra center">${e.type}</td>
          <td class="col-date center">${e.date}</td>
          <td class="col-extra center">${e.hours}시간</td>
          <td class="col-status center"><span class="${s.cls}">${s.label}</span></td>
          <td class="col-cert center">${certBtn}</td>
          <td class="col-cert center">${reviewBtn}</td>
        </tr>`;
      }).join('');
    }

    App.renderPagination('applyPagination', this._page, Math.ceil(total / this.PAGE_SZ) || 1, p => {
      this._page = p;
      this.renderApplyTable();
    });
  },

  /* ─────────────────────────────────────────
     증명서 열기 (수료증 / 활동확인서 공통)
     type param: 'cert' | 'activity'
  ───────────────────────────────────────── */
  openCert(id) {
    const e = this.ALL_APPLY.find(x => x.id === id);
    if (!e) return;
    const [y]    = e.date.split('-');
    const prefix = e.category === 'instructor' ? 'ACT' : 'CRT';
    const certNo = `${prefix}-${y}-${String(e.id).padStart(3, '0')}`;
    const type   = e.category === 'instructor' ? 'activity' : 'cert';
    const params = new URLSearchParams({
      type, certNo,
      name:   App.user?.name || '홍길동',
      course: e.title,
      date:   e.date,
      hours:  e.hours,
    });
    window.open(`certificate-preview.html?${params.toString()}`, '_blank');
  },

};
