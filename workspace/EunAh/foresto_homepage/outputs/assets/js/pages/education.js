/* =============================================
   education.js | 강좌 목록 / 신청 모달 공통
   ============================================= */
'use strict';

/* ── 강좌 데이터 */
const ALL_COURSES_RAW = [
  ...Array.from({ length: 3 }, (_, i) => ({
    id: 1000 + i, type: '전문과정',
    title: `[전문과정] ${44 + i}기 숲해설가 전문가과정`,
    date:  `2026-${String(i + 1).padStart(2, '0')}-10 10:00:00`,
    from:  `2026-${String(i + 1).padStart(2, '0')}-01`,
    to:    `2026-${String(i + 1).padStart(2, '0')}-20`,
    status: ['open','open','ready','closed','closed'][i % 5],
    attachments: i % 3 === 0 ? [
      { name: '신청서_01.hwp', size: '34.5K' },
      { name: '신청서_02.hwp', size: '34.5K' },
    ] : i % 3 === 1 ? [
      { name: '교육안내_공문.pdf', size: '128K' },
    ] : [],
    guide: `■신청기간 : ${(i%9)+1}월 ${(i%20)+1}일 오전 10시 - ${(i%9)+1}월 ${(i%20)+5}일 오후 3시\n■모집인원 : 선착순 30명\n■현장강의로 원활한 강의 진행을 위해 선착순 30명으로 참여인원을 제한합니다.\n■준비물 : 1000ml 유백/1개, 가위\n(해당 물품은 개인 준비 사항으로, 협회에서 별도 제공되지 않으니 꼭 준비해 오시기 바랍니다.)`,
  })),
  ...Array.from({ length: 3 }, (_, i) => ({
    id: 2000 + i, type: '시민아카데미',
    title: `[시민아카데미] ${['겨울나무의 이해','봄꽃 산책','여름 숲 탐방','가을 단풍 해설','야생화 특강','버섯 생태','새소리 탐조','나무 이름표 달기','숲 치유 체험','곤충 관찰'][i]}`,
    date: `2026-0${(i%9)+1}-${String((i%20)+1).padStart(2,'0')} 10:00:00`,
    from: `2026-0${(i%9)+1}-${String((i%20)+1).padStart(2,'0')}`,
    to:   `2026-0${(i%9)+1}-${String((i%20)+5).padStart(2,'0')}`,
    status: ['open','ready','closed','open','closed'][i % 5],
    attachments: i % 2 === 0 ? [{ name: '시민아카데미_신청서.hwp', size: '28K' }] : [],
    guide: `■강좌: 시민아카데미\n■대상: 일반 시민 누구나\n■교육 장소: 협회 지정 숲 현장\n■준비물: 편한 운동화, 긴 바지 권장\n■문의: 협회 사무국 02-747-6518`,
  })),
  ...Array.from({ length: 3 }, (_, i) => ({
    id: 3000 + i, type: '직무교육',
    title: `[직무교육] ${['직무 기본과정','현장 안전 교육','해설 역량 향상','디지털 자료 제작','생태 모니터링','환경 법령 이해','고객 응대 실습','보고서 작성'][i]}`,
    date: `2026-0${(i%9)+1}-${String((i%20)+1).padStart(2,'0')} 09:00:00`,
    from: `2026-0${(i%9)+1}-${String((i%20)+1).padStart(2,'0')}`,
    to:   `2026-0${(i%9)+1}-${String((i%20)+5).padStart(2,'0')}`,
    status: ['open','ready','closed','closed'][i % 4],
    attachments: i % 2 === 0 ? [{ name: '직무교육_신청서.hwp', size: '32K' }] : [],
    guide: `■강좌: 직무교육\n■대상: 현직 숲해설가\n■이수 시 직무교육 이수증 발급\n■문의: 협회 사무국 02-747-6518`,
  })),
  ...Array.from({ length: 3 }, (_, i) => ({
    id: 4000 + i, type: '역량강화',
    title: `[역량강화] ${['리더십 워크숍','커뮤니케이션 역량','팀빌딩 프로그램','멘토링 과정','자기계발 세미나','전문가 특강','해외 사례 공유','네트워킹 데이'][i]}`,
    date: `2026-0${(i%9)+1}-${String((i%20)+1).padStart(2,'0')} 10:00:00`,
    from: `2026-0${(i%9)+1}-${String((i%20)+1).padStart(2,'0')}`,
    to:   `2026-0${(i%9)+1}-${String((i%20)+5).padStart(2,'0')}`,
    status: ['open','ready','closed','closed'][i % 4],
    attachments: i % 2 === 0 ? [{ name: '역량강화_신청서.hwp', size: '26K' }] : [],
    guide: `■강좌: 역량강화\n■대상: 회원 숲해설가 (정회원 우선)\n■수료 시 이수증 발급\n■문의: 협회 사무국 02-747-6518`,
  })),

  /* ── 회원강좌 (5000+) — 회원아카데미 > 강좌 */
  ...Array.from({ length: 3 }, (_, i) => ({
    id: 5000 + i, type: '회원강좌',
    title: `[회원강좌] ${['숲 생태 기초','해설 화법 연습','생태 사진 촬영','숲 치유 이론','야생조류 관찰','식물 분류 실습','토양 생태계 이해','숲 놀이 프로그램 개발','계절별 해설 전략','지역 생태 자원 조사'][i]}`,
    date: `2026-0${(i%9)+1}-${String((i%20)+2).padStart(2,'0')} 10:00:00`,
    from: `2026-0${(i%9)+1}-${String((i%20)+2).padStart(2,'0')}`,
    to:   `2026-0${(i%9)+1}-${String((i%20)+6).padStart(2,'0')}`,
    status: ['open','open','ready','closed','closed'][i % 5],
    attachments: i % 2 === 0 ? [{ name: '회원강좌_신청서.hwp', size: '24K' }] : [],
    guide: `■강좌: 회원강좌\n■대상: 협회 정회원\n■교육 장소: 협회 강의실 및 숲 현장\n■수료 시 이수증 발급\n■문의: 협회 사무국 02-747-6518`,
  })),

  /* ── 멘토링 숲학교 (6000+) — 회원아카데미 > 멘토링 숲학교 */
  ...Array.from({ length: 3 }, (_, i) => ({
    id: 6000 + i, type: '멘토링',
    title: `[멘토링 숲학교] ${['선배와 함께하는 현장 해설','1:1 해설 코칭','그룹 멘토링 — 봄 숲','그룹 멘토링 — 여름 숲','해설 피드백 워크숍','신규 해설가 입문 멘토링','베테랑 해설 노하우 공유','현장 적용 실습 멘토링'][i]}`,
    date: `2026-0${(i%9)+1}-${String((i%20)+3).padStart(2,'0')} 09:00:00`,
    from: `2026-0${(i%9)+1}-${String((i%20)+3).padStart(2,'0')}`,
    to:   `2026-0${(i%9)+1}-${String((i%20)+4).padStart(2,'0')}`,
    status: ['open','ready','closed','open'][i % 4],
    attachments: i % 2 === 0 ? [{ name: '멘토링_참가신청서.hwp', size: '20K' }] : [],
    guide: `■강좌: 멘토링 숲학교\n■대상: 협회 정회원 (경력 1년 이상 우선)\n■선배 해설가와 1:1 또는 소그룹 현장 멘토링\n■수료 시 멘토링 이수증 발급\n■문의: 협회 사무국 02-747-6518`,
  })),

  /* ── 강사활동 (7000+) — 회원 > 강사 신청 */
  ...Array.from({ length: 3 }, (_, i) => ({
    id: 7000 + i, type: '강사활동',
    title: `[강사활동] ${['학교 연계 숲 생태교육 강사','도심 공원 숲해설 강사','유아숲체험원 해설 강사','시민 대상 숲치유 프로그램 강사','여름방학 생태캠프 해설 강사','가을 단풍 숲해설 강사','지역사회 생태교육 강사','초등학교 숲 탐방 해설 강사'][i]}`,
    date:  `2026-${String((i % 6) + 1).padStart(2,'0')}-${String((i % 20) + 5).padStart(2,'0')} 10:00:00`,
    from:  `2026-${String((i % 6) + 1).padStart(2,'0')}-${String((i % 20) + 1).padStart(2,'0')}`,
    to:    `2026-${String((i % 6) + 1).padStart(2,'0')}-${String((i % 20) + 10).padStart(2,'0')}`,
    quota: [20, 15, 25, 10, 20, 15, 20, 12][i],
    status: ['open','open','ready','closed','open','ready','closed','open'][i],
    attachments: i % 2 === 0 ? [{ name: '강사활동_신청서.hwp', size: '30K' }] : [],
    guide: `■활동구분: ${['학교 연계','공원 프로그램','유아숲체험원','시민강좌','생태캠프','숲해설','지역사회','초등탐방'][i]}\n■모집인원: ${[20, 15, 25, 10, 20, 15, 20, 12][i]}명 (선착순)\n■대상: 협회 정회원 (숲해설가 자격 소지자)\n■활동 일자: 2026년 ${(i % 6) + 1}월 중\n■활동 장소: 협회 지정 숲·공원 현장\n■준비물: 명찰, 협회 조끼, 개인 물병\n■문의: 협회 사무국 02-747-6518`,
  })),
];

/* ── 이번달 기준 시연용 날짜 자동 설정
 *  타입별 3개 항목을 [마감(-1개월), 접수중(이번달), 준비중(+1개월)] 으로 배치
 *  → 언제 열어도 준비중·접수중·마감이 한 번에 보임
 */
(function _setDemoDates() {
  const now = new Date();
  const y   = now.getFullYear();
  const m   = now.getMonth(); // 0-indexed

  /* offset 기준 월의 from·to·date 반환 */
  function monthBounds(offset) {
    const d    = new Date(y, m + offset, 1);
    const fy   = d.getFullYear();
    const fm   = d.getMonth();
    const mm   = String(fm + 1).padStart(2, '0');
    const last = new Date(fy, fm + 1, 0).getDate();
    return {
      from: `${fy}-${mm}-01`,
      to:   `${fy}-${mm}-${String(last).padStart(2, '0')}`,
      date: `${fy}-${mm}-10 10:00:00`,
    };
  }

  /* 타입별 base id → 항목 index 0·1·2 를 [전월·이번달·다음달] 로 설정 */
  const TYPE_BASE = [1000, 2000, 3000, 4000, 5000, 6000, 7000];
  const OFFSETS   = [-1, 0, 1]; // [마감, 접수중, 준비중]

  ALL_COURSES_RAW.forEach(c => {
    const base = TYPE_BASE.find(b => c.id >= b && c.id < b + 100);
    if (base == null) return;
    const idx = c.id - base;            // 0·1·2
    const off = OFFSETS[idx] ?? 0;
    const { from, to, date } = monthBounds(off);
    c.from = from;
    c.to   = to;
    c.date = date;
  });
})();

/* member.js 에서 window.ALL_COURSES_RAW 로 접근 가능하도록 노출 */
window.ALL_COURSES_RAW = ALL_COURSES_RAW;

/* ── 접수 상태 4단계
 *  ready   : 준비중 (접수기간 이전)
 *  open    : 접수중 (접수기간 이내 + 정원 남음)
 *  closed  : 접수마감 (기간 초과 또는 정원 없음)
 *  applied : 신청완료 (로그인 회원이 신청한 강좌 — UI 전용, 데이터에 없음)
 */
const STATUS_META = {
  ready:   { label: '준비중',   cls: 'status-ready',   canApply: false },
  open:    { label: '접수중',   cls: 'status-open',    canApply: true  },
  closed:  { label: '마감', cls: 'status-closed',  canApply: false },
  applied: { label: '신청완료', cls: 'status-applied', canApply: false },
};

/* ── 강좌 목록 공통 컨트롤러 */
class CourseListController {
  constructor(pageType, containerId, paginationId, detailBasePath, detailPage) {
    this.pageType      = pageType;
    this.containerId   = containerId;
    this.paginationId  = paginationId;
    this.detailBase    = detailBasePath || '';   // '' = 같은 폴더
    this.detailPage    = detailPage    || 'course-detail.html';  // 상세 페이지 파일명 (기본: course-detail.html)
    this.courses       = ALL_COURSES_RAW.filter(c => c.type === pageType).sort((a, b) => b.date.localeCompare(a.date));
    this.filtered      = [...this.courses];
    this.currentPage   = 1;
    this.pageSize      = 10;
    this._injectModal();
  }

  /* 오늘 날짜 기준 접수 상태 계산 */
  _calcStatus(c) {
    const today = new Date().toISOString().slice(0, 10);
    if (today < c.from) return 'ready';
    if (today > c.to)   return 'closed';
    return 'open';
  }

  filter(status, from, to) {
    this.filtered = this.courses.filter(c => {
      const cs = this._calcStatus(c);
      if (status && cs !== status) return false;
      if (from   && c.date < from) return false;
      if (to     && c.date > to)   return false;
      return true;
    }).sort((a, b) => b.date.localeCompare(a.date));
    this.currentPage = 1;
    this.render();
  }

  changePageSize(size) {
    this.pageSize    = size;
    this.currentPage = 1;
    this.render();
  }

  render() {
    const total = this.filtered.length;
    const slice = this.filtered.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    const tc    = document.getElementById('totalCount');
    if (tc) tc.textContent = total.toLocaleString();

    const tbody = document.getElementById(this.containerId);
    if (!tbody) return;
    const startIdx = (this.currentPage - 1) * this.pageSize;
    tbody.innerHTML = slice.map((c, i) => {
      const sm    = STATUS_META[this._calcStatus(c)];
      const rowNo = total - startIdx - i;
      /* 목록에서 타이틀 및 상태 배지 모두 상세 페이지로 이동 */
      const badge = sm.canApply
        ? `<a href="${this.detailBase}${this.detailPage}?id=${c.id}" class="status-badge ${sm.cls}">${sm.label}</a>`
        : `<span class="status-badge ${sm.cls}">${sm.label}</span>`;
      return `<tr>
        <td class="col-num center">${rowNo}</td>
        <td class="td-title">
          <a href="${this.detailBase}${this.detailPage}?id=${c.id}">${c.title}</a>
        </td>
        <td class="col-date center">${String(c.date).slice(0, 10)}</td>
        <td class="col-period center">${c.from} ~ ${c.to}</td>
        <td class="col-status">${badge}</td>
      </tr>`;
    }).join('');

    App.renderPagination(this.paginationId, this.currentPage, Math.ceil(total / this.pageSize) || 1, p => {
      this.currentPage = p;
      this.render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  openApply(courseId) {
    this._currentCourse = this.courses.find(c => c.id === courseId);
    if (!this._currentCourse) return;
    document.getElementById('applyModalTitle').textContent = '강좌 신청';
    document.getElementById('guideTitle').textContent      = this._currentCourse.title;
    document.getElementById('guideContent').innerHTML      = this._currentCourse.guide.replace(/\n/g, '<br>');
    document.getElementById('agreeCheck').checked          = false;
    document.getElementById('summaryType').textContent     = this._currentCourse.type;
    document.getElementById('summaryTitle').textContent    = this._currentCourse.title;
    document.getElementById('summaryDate').textContent     = this._currentCourse.date;
    ['formName','formPhone','formEmail','formNote'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    const fr = document.getElementById('formRegion'); if (fr) fr.value = '';
    this._step = 1;
    this._updateStep();
    App.openModal('applyModal');
  }

  _updateStep() {
    [1,2,3].forEach(s => {
      const panel = document.getElementById(`applyStep${s}`);
      const step  = document.getElementById(`step${s}`);
      if (panel) panel.style.display = s === this._step ? 'block' : 'none';
      if (step)  step.className = 'step ' + (s < this._step ? 'closed' : s === this._step ? 'active' : 'pending');
    });
    const prev = document.getElementById('applyPrevBtn');
    const next = document.getElementById('applyNextBtn');
    const done = document.getElementById('applyDoneBtn');
    if (prev) prev.style.display = this._step > 1 && this._step < 3 ? 'inline-flex' : 'none';
    if (next) { next.style.display = this._step < 3 ? 'inline-flex' : 'none'; next.textContent = this._step === 1 ? '동의하고 다음' : '신청 완료'; }
    if (done) done.style.display = this._step === 3 ? 'inline-flex' : 'none';
  }

  applyNext() {
    if (this._step === 1 && !document.getElementById('agreeCheck').checked) {
      App.toast('안내 사항 동의에 체크해주세요.', 'warning'); return;
    }
    if (this._step === 2) {
            const name  = document.getElementById('formName')?.value.trim();
      const phone = document.getElementById('formPhone')?.value.trim();
      const email = document.getElementById('formEmail')?.value.trim();
      if (!name)  { App.toast('이름을 입력해주세요.', 'warning');  return; }
      if (!phone) { App.toast('연락처를 입력해주세요.', 'warning'); return; }
      if (!email) { App.toast('이메일을 입력해주세요.', 'warning'); return; }
      const detail = document.getElementById('completeDetail');
      if (detail) detail.innerHTML = `<strong style="color:var(--green-dark)">${this._currentCourse.title}</strong><br>구분: ${this._currentCourse.type} &nbsp;|&nbsp; 일자: ${this._currentCourse.date}`;
    }
    this._step++;
    this._updateStep();
  }

  applyPrev() {
    this._step--;
    this._updateStep();
  }

  cancelApply(id) {
    /* 프로토타입: 실제 구현 시 서버 취소 API 연동
     * 취소 후 → 강좌 status 에 따라 접수중/접수마감으로 자동 복귀
     * URL에서 applied 파라미터 제거해 목록 상태로 재렌더링
     */
    const course = this.courses.find(c => c.id === id);
    const reverted = course ? this._calcStatus(course) : 'closed';
    const msg = reverted === 'open'
        ? '신청이 취소되었습니다. 접수기간 내이므로 재신청이 가능합니다.'
        : '신청이 취소되었습니다. 접수마감 상태로 변경됩니다.';
    App.toast(msg, 'info');
    /* applied 파라미터 제거하여 상태 복귀 시뮬레이션 */
    const url = new URL(location.href);
    url.searchParams.delete('applied');
    history.replaceState(null, '', url.toString());
    /* 페이지 재렌더 */
    if (window._ctrl && window._ctrl.init) {
        setTimeout(() => window._ctrl.init(), 400);
    }
  }

  _injectModal() {
    if (document.getElementById('applyModal')) return;
    document.body.insertAdjacentHTML('beforeend', `
      <div class="modal-overlay" id="applyModal">
        <div class="modal" style="max-width:640px">
          <div class="modal-header">
            <h3 id="applyModalTitle">강좌 신청</h3>
            <button class="modal-close" onclick="App.closeModal('applyModal')">×</button>
          </div>
          <div class="modal-body">
            <div class="step-indicator">
              <div class="step active" id="step1"><div class="step-num">1</div><span>신청 안내</span></div>
              <div class="step-divider"></div>
              <div class="step pending" id="step2"><div class="step-num">2</div><span>신청 작성</span></div>
              <div class="step-divider"></div>
              <div class="step pending" id="step3"><div class="step-num">3</div><span>완료</span></div>
            </div>

            <div id="applyStep1">
              <div class="alert alert-warning">본 신청은 취소 시 담당자에게 별도 연락이 필요합니다.</div>
              <div style="background:var(--gray-bg);padding:16px;border-radius:var(--radius);font-size:14px;line-height:1.8;margin-bottom:16px;">
                <strong id="guideTitle" style="color:var(--green-dark);font-size:15px;display:block;margin-bottom:10px;"></strong>
                <div id="guideContent"></div>
              </div>
              <div style="background:#fff;border:1.5px solid var(--gray-light);border-radius:var(--radius);padding:14px;">
                <label style="display:flex;gap:10px;align-items:flex-start;cursor:pointer;font-size:14px;">
                  <input type="checkbox" id="agreeCheck" style="margin-top:3px;">
                  <span>안내 사항을 모두 확인하였으며, 신청에 동의합니다. <span style="color:var(--danger)">(필수)</span></span>
                </label>
              </div>
            </div>

            <div id="applyStep2" style="display:none;">
              <div style="background:var(--green-pale);border-radius:var(--radius);padding:14px 18px;margin-bottom:20px;font-size:14px;line-height:1.8;border-left:3px solid var(--green-main);">
                <div style="display:flex;gap:8px;"><span style="font-weight:700;color:var(--green-dark);min-width:60px;">구분</span><span id="summaryType"></span></div>
                <div style="display:flex;gap:8px;"><span style="font-weight:700;color:var(--green-dark);min-width:60px;">강좌명</span><span id="summaryTitle"></span></div>
                <div style="display:flex;gap:8px;"><span style="font-weight:700;color:var(--green-dark);min-width:60px;">일자</span><span id="summaryDate"></span></div>
              </div>
              <div class="form-group">
                <label class="form-label">이름 <span class="req">*</span></label>
                <input type="text" class="form-control" id="formName" placeholder="이름을 입력하세요">
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                <div class="form-group">
                  <label class="form-label">연락처 <span class="req">*</span></label>
                  <input type="tel" class="form-control" id="formPhone" placeholder="010-0000-0000">
                </div>
                <div class="form-group">
                  <label class="form-label">이메일 <span class="req">*</span></label>
                  <input type="email" class="form-control" id="formEmail" placeholder="example@email.com">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">거주 지역</label>
                <select class="form-control" id="formRegion">
                  <option value="">선택</option>
                  <option>서울</option><option>경기</option><option>인천</option>
                  <option>부산</option><option>대구</option><option>기타</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">신청 서류 첨부 <span class="req">*</span></label>
                <input type="file" class="form-control" id="formFile" accept=".pdf,.hwp,.docx,.jpg,.png">
                <div class="form-hint">파일 크기 최대 10MB / 허용 형식: PDF, HWP, DOCX, JPG, PNG</div>
              </div>
              <div class="form-group">
                <label class="form-label">특이 사항</label>
                <textarea class="form-control" id="formNote" rows="3" placeholder="문의사항이나 특이사항을 입력하세요."></textarea>
              </div>
            </div>

            <div id="applyStep3" style="display:none;text-align:center;padding:32px 0;">
              <div style="width:64px;height:64px;background:var(--green-pale);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">
                <svg viewBox="0 0 24 24" fill="none" width="32" height="32">
                  <circle cx="12" cy="12" r="10" stroke="var(--green-main)" stroke-width="2"/>
                  <path d="M7 12.5l3.5 3.5 6.5-7" stroke="var(--green-main)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h3 style="font-size:20px;font-weight:700;color:var(--green-dark);margin-bottom:10px;">신청이 완료되었습니다!</h3>
              <div id="completeDetail" style="font-size:14px;color:var(--gray-dark);line-height:1.8;margin-bottom:12px;"></div>
              <p style="font-size:13px;color:var(--gray-mid);line-height:1.8;">
                신청 내역은 마이페이지 → 교육이수내역에서 확인 가능합니다.<br>
                문의사항은 협회 사무국(02-747-6518)으로 연락 주세요.
              </p>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-gray" id="applyPrevBtn" style="display:none;" onclick="window._ctrl.applyPrev()">이전</button>
            <button class="btn btn-primary" id="applyNextBtn" onclick="window._ctrl.applyNext()">동의하고 다음</button>
            <button class="btn btn-primary" id="applyDoneBtn" style="display:none;"
                    onclick="App.closeModal('applyModal');App.toast('신청이 완료되었습니다!')">완료</button>
          </div>
        </div>
      </div>`);
  }
}


/* ══════════════════════════════════════════════
   강좌 상세 컨트롤러
   - 4개 강좌 유형 공통 사용 (전문과정 / 시민아카데미 / 역량강화 / 강사신청)
   - URL 파라미터 id로 ALL_COURSES_RAW에서 강좌 조회
   - 신청하기 버튼 → CourseListController 와 동일한 3단계 모달 사용
   - window._ctrl 설정으로 모달 버튼 참조 유지
══════════════════════════════════════════════ */
class CourseDetailController extends CourseListController {
    constructor() {
        /* 부모 생성자: pageType 없이 초기화 (render 미사용, 모달 inject만 활용) */
        super('__detail__', '', '');
        /* 전체 강좌 데이터 접근 */
        this.courses = ALL_COURSES_RAW;
    }

    /* ── 상세 페이지 렌더 */
    init() {
        const id     = Number(App.getParam('id'));
        const course = this.courses.find(c => c.id === id);
        const el     = document.getElementById('courseDetail');
        if (!el) return;

        if (!course) {
            el.innerHTML = `
                <div style="text-align:center;padding:64px 24px;color:var(--gray-mid)">
                  강좌 정보를 찾을 수 없습니다.
                  <br><br>
                  <button class="btn btn-gray" onclick="history.back()">이전 페이지로</button>
                </div>`;
            return;
        }

        /* ── 접수 상태 4단계 판별
         * 프로토타입: URL ?applied=1 → 신청완료 시뮬레이션
         * 신청 취소 후: 오늘 날짜 기준으로 재계산
         */
        const isApplied = App.getParam('applied') === '1';
        const baseStatus = this._calcStatus(course); /* 오늘 날짜 기준 동적 계산 */

        /* 표시할 배지 상태 결정 */
        const displayStatus = isApplied ? 'applied' : baseStatus;
        const sm = STATUS_META[displayStatus] || STATUS_META['closed'];

        /* 목록으로 돌아갈 경로 */
        const backMap = {
            '전문과정':    'course-list.html',
            '시민아카데미': 'academy-apply.html',
            '직무교육':    'job-training-apply.html',
            '역량강화':    'job-training-apply.html',
            '멘토링':      'mentoring.html',
            '강사활동':    'instructor.html',
        };
        const backHref = backMap[course.type] || 'course-list.html';
        /* 이전/다음 네비에서 사용할 상세 페이지 파일명 (교육상세: course-detail.html, 강사활동상세: instructor-detail.html) */
        const detailPage = this.detailPage || (course.type === '강사활동' ? 'instructor-detail.html' : 'course-detail.html');

        /* 첨부파일 렌더 */
        const atts = course.attachments || [];
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

        /* ── 버튼 로직
         * 신청완료(isApplied) + 접수중 → 신청완료(비활성) + 취소하기
         * 신청완료(isApplied) + 그 외  → 신청완료(비활성) (취소 불가 — 접수기간 아님)
         * 접수중(open) + 미신청          → 접수하기
         * 준비중/접수마감                 → 상태 레이블(비활성)
         * 취소하기 클릭 시: 접수중이면 재신청 가능(접수중으로 복귀), 마감이면 마감으로 복귀
         */
        let applyBtn;
        if (isApplied && baseStatus === 'open') {
            applyBtn = `<button class="btn btn-gray btn-sm cd-btn-apply" disabled>신청완료</button>
                        <button class="btn btn-danger btn-sm cd-btn-cancel"
                                onclick="window._ctrl.cancelApply(${course.id})">취소하기</button>`;
        } else if (isApplied) {
            /* 접수기간 지난 신청완료 — 취소 불가 */
            applyBtn = `<button class="btn btn-gray btn-sm cd-btn-apply" disabled>신청완료</button>`;
        } else if (baseStatus === 'open') {
            applyBtn = `<button class="btn btn-dark btn-sm cd-btn-apply"
                                onclick="window._ctrl.openApply(${course.id})">접수하기</button>`;
        } else {
            applyBtn = `<button class="btn btn-gray btn-sm cd-btn-apply" disabled>${sm.label}</button>`;
        }

        el.innerHTML = `
            <div class="cd-wrap">

              <!-- 제목 행 -->
              <div class="cd-head">
                <div class="cd-head-left">
                  <h2 class="cd-title">${course.title}</h2>
                  <span class="cd-status-badge cd-status-${displayStatus}">${sm.label}</span>
                </div>
                <span class="cd-date">${course.date}</span>
              </div>
              <hr class="cd-divider">

              <!-- 첨부파일 -->
              ${attHtml}
              ${attHtml ? '<hr class="cd-divider">' : ''}

              <!-- 본문 -->
              <div class="cd-body">
                <div class="cd-guide">${course.guide}</div>
                <div class="cd-map-placeholder">
                  <span>이미지 영역 (실제 구현 시 삽입)</span>
                </div>
              </div>

              <!-- 이전글/다음글 네비게이션 (같은 강좌 유형 내) -->
              ${(() => {
                const sameType = this.courses.filter(c => c.type === course.type);
                const idx2  = sameType.findIndex(c => c.id === course.id);
                const next2 = sameType[idx2 - 1];
                const prev2 = sameType[idx2 + 1];
                if (!next2 && !prev2) return '';
                return `<div class="cd-nav">
                  ${next2 ? `<div class="cd-nav-item" onclick="location.href='${detailPage}?id=${next2.id}'">
                    <span class="cd-nav-label">다음글</span>
                    <span class="cd-nav-title">${next2.title}</span>
                  </div>` : ''}
                  ${prev2 ? `<div class="cd-nav-item" onclick="location.href='${detailPage}?id=${prev2.id}'">
                    <span class="cd-nav-label">이전글</span>
                    <span class="cd-nav-title">${prev2.title}</span>
                  </div>` : ''}
                </div>`;
              })()}

              <!-- 액션 버튼 -->
              <div class="cd-actions">
                <button class="btn btn-primary btn-sm cd-btn-list"
                        onclick="location.href='${backHref}'">목록</button>
                <div class="cd-actions-right">
                  ${applyBtn}
                </div>
              </div>

            </div>`;
    }
}
