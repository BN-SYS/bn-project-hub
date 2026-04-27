/**
 * sb.js — 스토리보드 뷰어
 * 수정 금지. 프로젝트별 커스텀은 data/ 폴더에서.
 */

const C           = window.SB_CONFIG   || {};
const PAGES       = window.PAGES       || [];
const SPECS       = window.SPECS       || {};
const ANNOTATIONS = window.ANNOTATIONS || {};
const TAG_LABELS  = window.TAG_LABELS  || {};

document.title = [C.projectName, 'SB', C.version].filter(Boolean).join(' — ');

// ── 상태 ──
let currentFilter = 'all', searchKw = '', currentDetailId = null, lastDetailId = null;
let viewMode = 'image'; // 'proto' | 'image'
let annoDebug = false;  // 좌표 확인 모드

// ── 섹션 헬퍼 ──
const SEC = {
  label:  s => ({ doc:'프로젝트 문서', user:'사용자', admin:'관리자' }[s] || s),
  badge:  s => s === 'admin' ? ' admin' : s === 'doc' ? ' doc' : '',
  cls:    s => s === 'admin' ? 'admin' : s === 'doc' ? 'doc' : '',
  group:  s => s === 'admin' ? ' admin-group' : s === 'doc' ? ' doc-group' : '',
  labels: { doc:'프로젝트 문서', user:'사용자 페이지', admin:'관리자 페이지' },
  colors: { doc:'#c0975c', user:'#4a9e5c', admin:'#4a6fa5' },
  order:  ['doc','user','admin'],
};

// ── 필터 ──
function getFiltered() {
  return PAGES.filter(p => {
    if (currentFilter !== 'all' && p.section !== currentFilter) return false;
    if (!searchKw) return true;
    const kw = searchKw.toLowerCase();
    return [p.name, p.id, p.group, p.desc, p.path||''].some(v => v.toLowerCase().includes(kw));
  });
}

function getNavList() {
  if (!currentDetailId) return getFiltered();
  const cur = PAGES.find(p => p.id === currentDetailId);
  if (!cur) return getFiltered();
  const sec = currentFilter === 'all' ? cur.section : currentFilter;
  return PAGES.filter(p => {
    if (p.section !== sec) return false;
    if (!searchKw) return true;
    const kw = searchKw.toLowerCase();
    return [p.name, p.id, p.group, p.desc, p.path||''].some(v => v.toLowerCase().includes(kw));
  });
}

// ── 사이드바 ──
function buildSidebar() {
  const sbTitle = document.getElementById('sbTitle');
  const sbSub = document.getElementById('sbSubtitle');
  if (sbTitle) sbTitle.textContent = (C.projectName||'') + ' SB';
  if (sbSub) sbSub.innerHTML = [C.version, C.subtitle, C.author].filter(Boolean).join(' | ');

  const nav = document.getElementById('sbNav');
  SEC.order.forEach((sec, i) => {
    const secPages = PAGES.filter(p => p.section === sec);
    if (!secPages.length) return;
    if (i > 0) {
      const d = document.createElement('div');
      d.style.cssText = 'height:1px;background:rgba(255,255,255,.08);margin:8px 14px';
      nav.appendChild(d);
    }
    const title = document.createElement('div');
    title.className = 'sb-section-title';
    title.style.color = SEC.colors[sec];
    title.textContent = SEC.labels[sec];
    nav.appendChild(title);

    [...new Set(secPages.map(p => p.group))].forEach(g => {
      const items = secPages.filter(p => p.group === g);
      const isDoc = sec === 'doc';
      const group = document.createElement('div');
      group.className = 'sb-group';
      const label = document.createElement('div');
      label.className = 'sb-group-label' + (isDoc ? ' open' : '');
      label.innerHTML = `<span>${g} <small style="color:#5a6a7a">(${items.length})</small></span><span class="arrow">▶</span>`;
      const itemsEl = document.createElement('div');
      itemsEl.className = 'sb-group-items' + (isDoc ? ' visible' : '');
      label.onclick = () => { label.classList.toggle('open'); itemsEl.classList.toggle('visible'); };
      items.forEach(p => {
        const item = document.createElement('div');
        item.className = 'sb-item';
        item.dataset.id = p.id;
        if (isDoc) item.dataset.type = 'doc';
        item.innerHTML = `<span>${p.name}</span>`;
        item.onclick = () => showDetail(p.id);
        itemsEl.appendChild(item);
      });
      group.appendChild(label);
      group.appendChild(itemsEl);
      nav.appendChild(group);
    });
  });
  updateStats();
}

function updateStats() {
  const c = { doc:0, user:0, admin:0 };
  PAGES.forEach(p => c[p.section]++);
  document.getElementById('sbStats').innerHTML =
    `전체 <strong>${PAGES.length}개</strong><br>문서 ${c.doc} / 사용자 ${c.user} / 관리자 ${c.admin}`;
}

// ── 목록 ──
function render() {
  const view = document.getElementById('list-view');
  view.innerHTML = '';
  const filtered = getFiltered();
  const labels = { all:'전체', doc:'프로젝트 문서', user:'사용자', admin:'관리자' };
  const badge = document.getElementById('sectionBadge');
  badge.textContent = labels[currentFilter];
  badge.className = 'tb-badge' + SEC.badge(currentFilter);
  document.getElementById('topbarTitle').textContent = labels[currentFilter] + ' 화면 목록';
  document.getElementById('topbarSub').textContent = `${filtered.length}개 화면`;
  if (!filtered.length) { view.innerHTML = '<div class="empty-msg">검색 결과가 없습니다.</div>'; return; }

  SEC.order.forEach(sec => {
    const sp = filtered.filter(p => p.section === sec);
    if (!sp.length) return;
    [...new Set(sp.map(p => p.group))].forEach(g => {
      const gp = sp.filter(p => p.group === g);
      const section = document.createElement('div');
      section.className = 'group-section' + SEC.group(sec);
      const header = document.createElement('div');
      header.className = 'group-header';
      header.innerHTML = `<span class="group-name">${SEC.label(sec)} — ${g}</span><span class="group-count">${gp.length}개</span>`;
      section.appendChild(header);
      const grid = document.createElement('div');
      grid.className = 'card-grid';
      gp.forEach(p => grid.appendChild(createCard(p)));
      section.appendChild(grid);
      view.appendChild(section);
    });
  });
}

function createCard(p) {
  const card = document.createElement('div');
  card.className = 'page-card';
  card.dataset.id = p.id;
  card.onclick = () => showDetail(p.id);
  const ni = p.section === 'doc' ? '📄' : '🖼';
  const nt = p.section === 'doc' ? '미등록' : '미캡처';
  const tags = (p.tags||[]).map(t => `<span class="tag ${t}">${TAG_LABELS[t]||t}</span>`).join('');
  card.innerHTML = `
    <div class="card-thumb"><img src="images/${p.img}" alt="${p.name}" onerror="this.parentNode.innerHTML='<div class=\\'no-img\\'><span class=\\'icon\\'>${ni}</span><span>${nt}</span></div>'"></div>
    <div class="card-body">
      <div class="card-num">${p.id}</div>
      <div class="card-title">${p.name}</div>
      <div class="card-desc">${p.desc}</div>
      ${tags ? `<div class="card-tags">${tags}</div>` : ''}
    </div>`;
  return card;
}

// ── 상세 ──
function showDetail(id) {
  const p = PAGES.find(pg => pg.id === id);
  if (!p) return;
  lastDetailId = currentDetailId || id;
  currentDetailId = id;
  document.body.classList.add('mode-detail');
  document.body.classList.remove('mode-list');
  const badge = document.getElementById('detailBadge');
  badge.textContent = SEC.label(p.section);
  badge.className = 'tb-badge' + SEC.badge(p.section);
  document.getElementById('detailNum').textContent = p.id;
  document.getElementById('detailTitle').textContent = p.name;
  updateNavButtons();
  updateViewToggleBtn(p);
  renderDetailContent(p);
  document.getElementById('detail-view').scrollTop = 0;
  buildDescPanel(p);
  highlightSidebar(id);
}

function renderDetailContent(p) {
  const wrap = document.getElementById('detail-img-wrap');
  const hasProto = p.path && p.path !== '#';
  const useProto = hasProto && viewMode === 'proto';

  if (useProto) {
    const iframeW = 1920;
    wrap.innerHTML = `<iframe id="detail-iframe" src="${p.path}" style="width:${iframeW}px;border:none;display:block;transform-origin:top left;position:absolute;top:0;left:0;"></iframe>`;
    const applyScale = () => {
      const iframe = document.getElementById('detail-iframe');
      if (!iframe) return;
      const availW = wrap.clientWidth;
      const availH = wrap.clientHeight;
      const scale = availW / iframeW;
      iframe.style.transform = `scale(${scale})`;
      iframe.style.width = `${iframeW}px`;
      iframe.style.height = `${availH / scale}px`;
    };
    applyScale();
    if (window._iframeResizeObs) window._iframeResizeObs.disconnect();
    window._iframeResizeObs = new ResizeObserver(applyScale);
    window._iframeResizeObs.observe(wrap);
  } else {
    wrap.innerHTML = `
      <div class="anno-wrap" id="anno-wrap">
        <img id="detail-img" src="" alt="" onclick="openModal()">
        <div class="anno-layer" id="anno-layer"></div>
        <div class="anno-coord-tip" id="anno-coord-tip"></div>
      </div>`;
    const img = document.getElementById('detail-img');
    img.alt = p.name;
    img.onerror = function () {
      const icon = p.section === 'doc' ? '📄' : '🖼';
      const text = p.section === 'doc' ? '문서 이미지 미등록' : '스크린샷 미캡처';
      wrap.innerHTML = `<div class="detail-no-img"><div class="icon">${icon}</div><p>${text}</p><p class="sub">${p.img}</p></div>`;
    };
    img.onload = () => renderAnnotations(p.id);
    img.src = `images/${p.img}`;
    if (img.complete && img.src) renderAnnotations(p.id);
    initAnnoDebug();
  }
}

// ── 어노테이션 ──
function renderAnnotations(pageId) {
  const layer = document.getElementById('anno-layer');
  if (!layer) return;
  layer.innerHTML = '';
  const list = ANNOTATIONS[pageId];
  if (!list || !list.length) return;
  list.forEach(a => {
    const dot = document.createElement('div');
    dot.className = 'anno-dot';
    dot.textContent = a.n;
    dot.style.left = a.x + '%';
    dot.style.top  = a.y + '%';
    layer.appendChild(dot);
  });
}

function initAnnoDebug() {
  const annoWrap = document.getElementById('anno-wrap');
  if (!annoWrap) return;
  // capture:true → img의 onclick보다 먼저 잡아서 openModal() 차단
  annoWrap.addEventListener('click', function (e) {
    if (!annoDebug) return;
    e.stopPropagation();
    e.preventDefault();
    const rect = annoWrap.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left) / rect.width  * 100);
    const y = Math.round((e.clientY - rect.top)  / rect.height * 100);
    const text = `{ n: ?, x: ${x}, y: ${y} }`;
    const tip = document.getElementById('anno-coord-tip');
    if (tip) {
      tip.textContent = text;
      tip.style.left = (e.clientX - rect.left + 12) + 'px';
      tip.style.top  = (e.clientY - rect.top  - 10) + 'px';
      tip.classList.add('visible');
      clearTimeout(tip._t);
      tip._t = setTimeout(() => tip.classList.remove('visible'), 3000);
    }
    navigator.clipboard && navigator.clipboard.writeText(text);
  }, true);
}

function toggleAnnoDebug() {
  annoDebug = !annoDebug;
  const btn = document.getElementById('btnAnnoDebug');
  if (btn) {
    btn.classList.toggle('active', annoDebug);
    btn.title = annoDebug ? '좌표 확인 모드 ON — 이미지 클릭 시 좌표 복사' : '좌표 확인 모드';
  }
  const wrap = document.getElementById('anno-wrap');
  if (wrap) wrap.classList.toggle('anno-debug', annoDebug);
}

function updateViewToggleBtn(p) {
  const btn = document.getElementById('btnViewToggle');
  if (!btn) return;
  const hasProto = p && p.path && p.path !== '#';
  btn.style.display = hasProto ? '' : 'none';
  btn.textContent = viewMode === 'proto' ? '🖼 스크린샷' : '▶ 프로토타입';
  btn.title = viewMode === 'proto' ? '스크린샷으로 보기' : '프로토타입으로 보기';
}

function toggleViewMode() {
  viewMode = viewMode === 'proto' ? 'image' : 'proto';
  const p = PAGES.find(pg => pg.id === currentDetailId);
  if (!p) return;
  updateViewToggleBtn(p);
  renderDetailContent(p);
}

function buildDescPanel(p) {
  const panel = document.getElementById('desc-panel');
  const sec = p.section;
  const list = getNavList();
  const idx = list.findIndex(pg => pg.id === p.id);
  const tags = (p.tags||[]).length
    ? p.tags.map(t => `<span class="tag ${t}">${TAG_LABELS[t]||t}</span>`).join('')
    : '<span class="dp-tags-empty">태그 없음</span>';
  const spec = SPECS[p.id] || null;
  const descSec = spec
    ? `<div class="dp-label">화면 스펙 <span class="spec-badge">전체 스펙</span></div><div class="spec-content">${spec}</div>`
    : `<div class="dp-label">${sec === 'doc' ? '문서 설명' : '화면 설명'}</div><div class="dp-desc">${p.desc}</div>`;
  const pathRow = p.path && p.path !== '#'
    ? `<div class="dp-row"><span class="dp-key">경로</span><span class="dp-val">${p.path.replace('../outputs/','')}</span></div>` : '';
  const protoBtn = p.path && p.path !== '#'
    ? `<a href="${p.path}" target="_blank" class="btn-dp-primary ${SEC.cls(sec)}">프로토타입 열기 →</a>` : '';

  panel.innerHTML = `
    <div class="resize-handle" id="panel-resize"></div>
    <div class="dp-sec"><div class="dp-header"><span class="dp-id ${SEC.cls(sec)}">${p.id}</span><span class="dp-title">${p.name}</span></div></div>
    <div class="dp-sec"><div class="dp-label">페이지 정보</div><div class="dp-rows">
      <div class="dp-row"><span class="dp-key">섹션</span><span class="dp-val t">${SEC.label(sec)} — ${p.group}</span></div>
      ${pathRow}
      <div class="dp-row"><span class="dp-key">순서</span><span class="dp-val t">${idx >= 0 ? (idx+1)+' / '+list.length : '—'}</span></div>
    </div></div>
    <div class="dp-sec"><div class="dp-label">태그</div><div class="dp-tags">${tags}</div></div>
    <div class="dp-sec">${descSec}</div>
    ${protoBtn ? `<div class="dp-sec">${protoBtn}</div>` : ''}
    <div class="dp-sec"><div class="dp-label">이동</div>
      <div class="dp-nav-row">
        <button class="btn-dp-sec" onclick="navigateDetail(-1)" ${idx<=0?'disabled':''}>◀ 이전</button>
        <button class="btn-dp-sec" onclick="navigateDetail(1)" ${idx>=list.length-1?'disabled':''}>다음 ▶</button>
      </div>
      <div class="dp-pos">${idx >= 0 ? SEC.label(sec)+' '+(idx+1)+' / '+list.length : ''}</div>
    </div>`;
  initPanelResize();
}

function updateNavButtons() {
  const list = getNavList();
  const idx = list.findIndex(p => p.id === currentDetailId);
  const prev = document.getElementById('btnPrev');
  const next = document.getElementById('btnNext');
  if (prev) prev.disabled = idx <= 0;
  if (next) next.disabled = idx >= list.length - 1;
}

function navigateDetail(dir) {
  const list = getNavList();
  const i = list.findIndex(p => p.id === currentDetailId) + dir;
  if (i < 0 || i >= list.length) return;
  showDetail(list[i].id);
}

function backToList() {
  currentDetailId = null;
  document.body.classList.remove('mode-detail');
  document.body.classList.add('mode-list');
  document.querySelectorAll('.sb-item').forEach(el => el.classList.remove('active'));
  render();
  if (lastDetailId) {
    setTimeout(() => {
      const card = document.querySelector(`.page-card[data-id="${lastDetailId}"]`);
      if (card) card.scrollIntoView({ behavior:'smooth', block:'center' });
    }, 60);
  }
}

function highlightSidebar(id) {
  document.querySelectorAll('.sb-item').forEach(el => el.classList.remove('active'));
  const item = document.querySelector(`.sb-item[data-id="${id}"]`);
  if (!item) return;
  item.classList.add('active');
  const gi = item.closest('.sb-group-items');
  if (gi && !gi.classList.contains('visible')) {
    gi.classList.add('visible');
    const lbl = gi.previousElementSibling;
    if (lbl) lbl.classList.add('open');
  }
  item.scrollIntoView({ behavior:'smooth', block:'nearest' });
}

// ── 필터 ──
function setFilter(f) {
  currentFilter = f;
  ['all','doc','user','admin'].forEach(k => {
    const btn = document.getElementById('btn' + k.charAt(0).toUpperCase() + k.slice(1));
    if (btn) btn.classList.toggle('active', k === f);
  });
  if (document.body.classList.contains('mode-detail')) {
    updateNavButtons();
    const p = PAGES.find(pg => pg.id === currentDetailId);
    if (p) buildDescPanel(p);
  } else render();
}

function filterSearch(kw) {
  searchKw = kw.trim();
  document.body.classList.contains('mode-detail') ? updateNavButtons() : render();
}

// ── 이미지 모달 (줌 / 패닝) ──
(function () {
  let scale = 1, ox = 0, oy = 0;
  let baseW = 0, baseH = 0;           // scale=1 일 때 이미지 렌더 크기
  let dragging = false, startX = 0, startY = 0, baseOx = 0, baseOy = 0;
  const MIN = 0.25, MAX = 8, STEP = 0.25;

  function getViewport() {
    const vp = document.getElementById('modal-viewport');
    return vp ? { w: vp.clientWidth, h: vp.clientHeight } : { w: window.innerWidth, h: window.innerHeight };
  }

  // scale=1 기준 fit-contain 크기 계산
  function calcBase(img) {
    const { w: vw, h: vh } = getViewport();
    const nw = img.naturalWidth  || img.clientWidth  || vw;
    const nh = img.naturalHeight || img.clientHeight || vh;
    const r  = Math.min(vw / nw, vh / nh, 1);   // 원본보다 크게 늘리지 않음(1 cap)
    baseW = nw * r;
    baseH = nh * r;
  }

  // 실제 픽셀 width/height 로 렌더 → scale() 대신 사용 → 원본 해상도 활용
  function applyTransform() {
    const img = document.getElementById('modalImg');
    if (!img || !baseW) return;

    const w = baseW * scale;
    const h = baseH * scale;
    img.style.width  = w + 'px';
    img.style.height = h + 'px';
    img.style.transform = `translate(${ox}px, ${oy}px)`;

    const pct = Math.round(scale * 100);
    const zl = document.getElementById('modalZoomLevel');
    if (zl) zl.textContent = pct + '%';
    const btnReset = document.getElementById('modalBtnReset');
    if (btnReset) btnReset.style.opacity = (scale === 1 && ox === 0 && oy === 0) ? '0.4' : '1';

    // 커서
    img.style.cursor = scale > 1 ? 'grab' : 'zoom-in';
  }

  function resetView(img) {
    scale = 1; ox = 0; oy = 0;
    if (img) calcBase(img);
    applyTransform();
  }

  function clampOffset() {
    const { w: vw, h: vh } = getViewport();
    const w = baseW * scale;
    const h = baseH * scale;
    const maxOx = Math.max(0, (w - vw) / 2);
    const maxOy = Math.max(0, (h - vh) / 2);
    ox = Math.max(-maxOx, Math.min(maxOx, ox));
    oy = Math.max(-maxOy, Math.min(maxOy, oy));
  }

  window.openModal = function () {
    if (!currentDetailId) return;
    const p = PAGES.find(pg => pg.id === currentDetailId);
    if (!p) return;
    const img = document.getElementById('modalImg');

    // 이미지 초기화 후 로드 완료 시 base 계산
    img.style.width  = '';
    img.style.height = '';
    img.style.transform = '';
    baseW = 0;

    img.onload = function () {
      calcBase(img);
      scale = 1; ox = 0; oy = 0;
      applyTransform();
    };
    img.src = `images/${p.img}`;
    // 이미 캐시된 경우 onload 안 불릴 수 있으므로 대비
    if (img.complete && img.naturalWidth) {
      calcBase(img);
      scale = 1; ox = 0; oy = 0;
      applyTransform();
    }

    document.getElementById('modalInfo').textContent = `${p.id} — ${p.name}`;
    document.getElementById('imgModal').classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = function (e) {
    if (e && e.target !== e.currentTarget && !e.target.classList.contains('modal-close')) return;
    document.getElementById('imgModal').classList.remove('open');
    document.body.style.overflow = '';
    const img = document.getElementById('modalImg');
    if (img) { img.style.width = ''; img.style.height = ''; img.style.transform = ''; }
    baseW = 0; scale = 1; ox = 0; oy = 0;
  };

  window.modalZoom = function (dir) {
    if (!baseW) return;
    scale = Math.min(MAX, Math.max(MIN, scale + dir * STEP));
    clampOffset();
    applyTransform();
  };

  window.modalReset = function () {
    const img = document.getElementById('modalImg');
    resetView(img);
  };

  // 휠 줌
  document.addEventListener('wheel', function (e) {
    const modal = document.getElementById('imgModal');
    if (!modal || !modal.classList.contains('open')) return;
    e.preventDefault();
    if (!baseW) return;
    const delta = e.deltaY < 0 ? 1 : -1;
    scale = Math.min(MAX, Math.max(MIN, scale + delta * STEP));
    clampOffset();
    applyTransform();
  }, { passive: false });

  // 드래그 (마우스)
  document.addEventListener('mousedown', function (e) {
    const img = document.getElementById('modalImg');
    const modal = document.getElementById('imgModal');
    if (!modal || !modal.classList.contains('open')) return;
    if (!img || !img.contains(e.target)) return;
    dragging = true;
    startX = e.clientX; startY = e.clientY;
    baseOx = ox; baseOy = oy;
    img.style.cursor = 'grabbing';
    e.preventDefault();
  });

  document.addEventListener('mousemove', function (e) {
    if (!dragging) return;
    ox = baseOx + (e.clientX - startX);
    oy = baseOy + (e.clientY - startY);
    clampOffset();
    applyTransform();
  });

  document.addEventListener('mouseup', function () {
    if (!dragging) return;
    dragging = false;
    applyTransform();
  });

  // 터치 (핀치줌 + 드래그)
  let touches = [], lastDist = 0;
  document.addEventListener('touchstart', function (e) {
    const modal = document.getElementById('imgModal');
    if (!modal || !modal.classList.contains('open')) return;
    touches = Array.from(e.touches);
    if (touches.length === 1) {
      dragging = true;
      startX = touches[0].clientX; startY = touches[0].clientY;
      baseOx = ox; baseOy = oy;
    } else if (touches.length === 2) {
      dragging = false;
      lastDist = Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
    }
  }, { passive: true });

  document.addEventListener('touchmove', function (e) {
    const modal = document.getElementById('imgModal');
    if (!modal || !modal.classList.contains('open')) return;
    touches = Array.from(e.touches);
    if (touches.length === 1 && dragging) {
      ox = baseOx + (touches[0].clientX - startX);
      oy = baseOy + (touches[0].clientY - startY);
      clampOffset();
      applyTransform();
    } else if (touches.length === 2) {
      const dist = Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
      if (lastDist > 0) {
        scale = Math.min(MAX, Math.max(MIN, scale * (dist / lastDist)));
        clampOffset();
        applyTransform();
      }
      lastDist = dist;
      e.preventDefault();
    }
  }, { passive: false });

  document.addEventListener('touchend', function () { dragging = false; lastDist = 0; });

  // 창 크기 바뀔 때 재계산
  window.addEventListener('resize', function () {
    const modal = document.getElementById('imgModal');
    if (!modal || !modal.classList.contains('open')) return;
    const img = document.getElementById('modalImg');
    if (!img || !img.naturalWidth) return;
    const prevScale = scale;
    calcBase(img);
    scale = prevScale;
    clampOffset();
    applyTransform();
  });
})();

// ── 키보드 ──
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (document.getElementById('imgModal').classList.contains('open')) { closeModal(); return; }
    if (document.body.classList.contains('mode-detail')) backToList();
  }
  if (document.body.classList.contains('mode-detail') && !document.getElementById('imgModal').classList.contains('open')) {
    if (e.key === 'ArrowLeft') navigateDetail(-1);
    if (e.key === 'ArrowRight') navigateDetail(1);
  }
});

// ── 리사이즈 ──
(function () {
  const sidebar = document.getElementById('sidebar');
  const handle = document.getElementById('sidebar-resize');
  if (!handle) return;
  let d = false, sx = 0, sw = 0;
  handle.addEventListener('mousedown', e => { e.preventDefault(); d = true; sx = e.clientX; sw = sidebar.offsetWidth; handle.classList.add('active'); document.body.classList.add('resizing'); });
  document.addEventListener('mousemove', e => {
    if (!d) return;
    const cs = getComputedStyle(document.documentElement);
    const min = parseInt(cs.getPropertyValue('--sidebar-min-w')) || 60;
    const max = parseInt(cs.getPropertyValue('--sidebar-max-w')) || 320;
    sidebar.style.width = Math.min(max, Math.max(min, sw + e.clientX - sx)) + 'px';
  });
  document.addEventListener('mouseup', () => { if (!d) return; d = false; handle.classList.remove('active'); document.body.classList.remove('resizing'); });
})();

function initPanelResize() {
  const panel = document.getElementById('desc-panel');
  const handle = document.getElementById('panel-resize');
  if (!handle || !panel) return;
  let d = false, sx = 0, sw = 0;
  handle.onmousedown = e => { e.preventDefault(); d = true; sx = e.clientX; sw = panel.offsetWidth; handle.classList.add('active'); document.body.classList.add('resizing'); };
  document.addEventListener('mousemove', e => {
    if (!d) return;
    const cs = getComputedStyle(document.documentElement);
    const min = parseInt(cs.getPropertyValue('--panel-min-w')) || 250;
    const max = Math.min(parseInt(cs.getPropertyValue('--panel-max-w')) || 700, window.innerWidth * 0.5);
    panel.style.width = Math.min(max, Math.max(min, sw + sx - e.clientX)) + 'px';
  });
  document.addEventListener('mouseup', () => { if (!d) return; d = false; handle.classList.remove('active'); document.body.classList.remove('resizing'); });
}
initPanelResize();

// ── PDF ──
function exportAllPDF() {
  const overlay = document.getElementById('print-overlay');
  const projectName = C.projectName || 'Storyboard';
  const version = C.version || '';
  let html = '';

  // 컨트롤바
  html += `<div class="print-close-bar">
    <button class="btn-print" onclick="doPrint()">🖨 인쇄 / PDF 저장</button>
    <button class="btn-cancel" onclick="closePrintOverlay()">✕ 닫기</button>
    <span class="print-info">총 ${PAGES.length}개 화면 | A4 가로 권장 | "PDF로 저장" 선택</span>
  </div>`;

  // 표지
  html += `<div class="print-page print-divider-page"><div class="print-divider-inner">
    <div style="font-size:36px;font-weight:900;color:var(--green-dark);margin-bottom:8px">${projectName}</div>
    <div style="font-size:24px;font-weight:700;color:var(--text);margin-bottom:24px">스토리보드 ${version}</div>
    <div style="font-size:14px;color:var(--text-sm)">전체 ${PAGES.length}개 화면 | 문서 ${PAGES.filter(p=>p.section==='doc').length} / 사용자 ${PAGES.filter(p=>p.section==='user').length} / 관리자 ${PAGES.filter(p=>p.section==='admin').length}</div>
    <div style="font-size:13px;color:var(--text-sm);margin-top:8px">생성일: ${new Date().toLocaleDateString('ko-KR')}</div>
  </div></div>`;

  // 목차
  const total = PAGES.length;
  let tocCols = 3, tocFont = 11, tocLH = 1.7;
  if (total > 80) { tocCols = 4; tocFont = 9; tocLH = 1.5; }
  else if (total > 60) { tocCols = 3; tocFont = 10; tocLH = 1.55; }

  html += `<div class="print-page print-toc-page">`;
  html += `<div class="print-section-title" style="margin-bottom:10px;padding-bottom:6px">목차</div>`;
  html += `<div style="columns:${tocCols};column-gap:16px;font-size:${tocFont}px;line-height:${tocLH};column-fill:balance">`;

  SEC.order.forEach(sec => {
    const sp = PAGES.filter(p => p.section === sec);
    if (!sp.length) return;
    const bc = sec === 'admin' ? 'var(--admin-light)' : sec === 'doc' ? 'var(--doc-light)' : 'var(--green-light)';
    html += `<div style="font-size:${tocFont+2}px;font-weight:700;color:var(--text);margin:8px 0 3px;padding-bottom:2px;border-bottom:2px solid ${bc}">${SEC.labels[sec]} (${sp.length})</div>`;
    [...new Set(sp.map(p => p.group))].forEach(g => {
      const items = sp.filter(p => p.group === g);
      html += `<div style="break-inside:avoid-column;margin-bottom:4px">`;
      html += `<div style="font-size:${tocFont}px;font-weight:700;color:var(--text-sm);margin:2px 0 1px">${g}</div>`;
      items.forEach(p => { html += `<div style="padding-left:6px;font-size:${tocFont-1}px;color:var(--gray-mid);line-height:${tocLH}">${p.id} ${p.name}</div>`; });
      html += `</div>`;
    });
  });
  html += `</div></div>`;

  // 화면별 페이지
  let lastSec = '';
  PAGES.forEach(p => {
    const sec = p.section;
    const secClass = SEC.cls(sec);

    if (sec !== lastSec) {
      html += `<div class="print-page print-divider-page"><div class="print-divider-inner"><div class="print-divider-title ${secClass}">${SEC.labels[sec]}</div></div></div>`;
      lastSec = sec;
    }

    const spec = SPECS[p.id] || '';
    const tags = (p.tags||[]).map(t => `<span class="tag ${t}" style="font-size:11px;padding:1px 5px">${TAG_LABELS[t]||t}</span>`).join('');

    let right = `<div class="print-desc-info">
      <div><strong>ID</strong><span>${p.id}</span></div>
      <div><strong>섹션</strong><span>${SEC.label(sec)} — ${p.group}</span></div>
      ${p.path && p.path !== '#' ? `<div><strong>경로</strong><span style="word-break:break-all;font-family:monospace;font-size:10px">${p.path.replace('../outputs/','')}</span></div>` : ''}
    </div>`;
    if (tags) right += `<div style="margin-top:8px"><div class="print-desc-label">태그</div><div class="print-desc-tags">${tags}</div></div>`;
    if (spec) {
      right += `<div style="margin-top:10px"><div class="print-desc-label">화면 스펙</div><div class="print-desc-body spec-content">${spec}</div></div>`;
    } else {
      right += `<div style="margin-top:10px"><div class="print-desc-label">${sec === 'doc' ? '문서 설명' : '화면 설명'}</div><div class="print-desc-body">${p.desc}</div></div>`;
    }

    const noMsg = sec === 'doc' ? '📄 문서 이미지 미등록' : '🖼 스크린샷 미캡처';

    html += `<div class="print-page">
      <div class="print-page-header"><span class="print-page-id ${secClass}">${p.id}</span><span class="print-page-name">${p.name}</span></div>
      <div class="print-page-desc">${p.desc}</div>
      <div class="print-content-row">
        <div class="print-content-left"><img class="print-page-img" src="images/${p.img}" alt="${p.name}" onerror="this.outerHTML='<div class=\\'print-page-noimg\\'>${noMsg}</div>'"></div>
        <div class="print-content-right">${right}</div>
      </div>
    </div>`;
  });

  overlay.innerHTML = html;
  overlay.classList.add('active');
  overlay.scrollTop = 0;
}

function doPrint() {
  const overlay = document.getElementById('print-overlay');
  const app = document.getElementById('app');
  const modal = document.getElementById('imgModal');
  app.style.display = 'none';
  if (modal) modal.style.display = 'none';
  overlay.style.cssText = 'position:static;overflow:visible;height:auto;inset:auto;z-index:auto';
  document.body.style.overflow = 'visible';
  document.body.style.height = 'auto';
  document.documentElement.style.overflow = 'visible';
  document.documentElement.style.height = 'auto';
  setTimeout(() => {
    window.print();
    app.style.display = '';
    if (modal) modal.style.display = '';
    overlay.style.cssText = '';
    document.body.style.overflow = '';
    document.body.style.height = '';
    document.documentElement.style.overflow = '';
    document.documentElement.style.height = '';
  }, 100);
}

function closePrintOverlay() {
  const overlay = document.getElementById('print-overlay');
  overlay.classList.remove('active');
  overlay.innerHTML = '';
}

// ── 초기화 ──
buildSidebar();
render();
