// ── 맞춤법 검사 (부산대 API + 프록시 다중 재시도) ─────────
let spellErrors = [];

const SPELL_URL = 'https://speller.cs.pusan.ac.kr/results';
const PROXIES = [
  url => url,                                                          // 직접
  url => 'https://corsproxy.io/?' + encodeURIComponent(url),          // corsproxy.io
  url => 'https://thingproxy.freeboard.io/fetch/' + url,              // thingproxy
  url => 'https://api.codetabs.com/v1/proxy?quest=' + url,            // codetabs (GET only — skip POST)
];

async function checkSpelling() {
  const text = quill.getText().replace(/\n$/, '').trim();
  if (!text) { showToast('내용이 없습니다.'); return; }

  const btn = document.getElementById('spell-btn');
  btn.disabled = true;
  btn.textContent = '검사 중…';
  clearSpellPanel();

  try {
    const chunks = chunkText(text, 490);
    let all = [];
    for (const chunk of chunks) {
      const data = await callSpellAPI(chunk);
      if (data === null) {
        showFallback();
        return;
      }
      if (data.errInfo) all = all.concat(data.errInfo);
    }
    spellErrors = all;
    renderSpellPanel(all);
  } catch {
    showFallback();
  } finally {
    btn.disabled = false;
    btn.textContent = '맞춤법 검사';
  }
}

async function callSpellAPI(text) {
  const body = 'text1=' + encodeURIComponent(text);
  const baseOpts = {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  };

  for (const makeUrl of PROXIES) {
    const url = makeUrl(SPELL_URL);
    // codetabs는 POST 미지원 — 건너뜀
    if (url.includes('codetabs')) continue;

    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 7000);
    try {
      const r = await fetch(url, { ...baseOpts, signal: ctrl.signal });
      clearTimeout(tid);
      if (r.ok) {
        const data = await r.json();
        if (data && 'errInfo' in data) return data;
      }
    } catch { clearTimeout(tid); }
  }
  return null;
}

function chunkText(text, size) {
  const chunks = [];
  for (let i = 0; i < text.length; i += size) chunks.push(text.slice(i, i + size));
  return chunks;
}

// ── 결과 렌더링 ───────────────────────────────────────────
function renderSpellPanel(errors) {
  const panel = document.getElementById('spell-panel');
  panel.classList.remove('hidden');

  if (!errors.length) {
    panel.innerHTML = `
      <div class="spell-header">
        <strong style="color:var(--c-success)">✓ 맞춤법 오류 없음</strong>
        <button class="btn btn-sm btn-outline" onclick="closeSpellPanel()">닫기</button>
      </div>`;
    return;
  }

  const items = errors.map((e, i) => {
    const cands = (e.candWord || '').split('|').filter(Boolean);
    const first = esc(cands[0] || '');
    const orig  = esc(e.errorInput || e.token || '');
    const drop  = cands.length > 1
      ? `<select class="spell-cands" onchange="document.getElementById('sfix-${i}').textContent=this.value">
           ${cands.map(c => `<option>${esc(c)}</option>`).join('')}
         </select>` : '';
    return `
      <div class="spell-item" id="sitem-${i}">
        <div class="spell-tokens">
          <span class="spell-orig">${orig}</span>
          <span class="spell-arrow">→</span>
          <span class="spell-fix" id="sfix-${i}">${first}</span>
          ${drop}
        </div>
        ${e.help ? `<div class="spell-help">${esc(e.help)}</div>` : ''}
        <div class="spell-btns">
          <button class="btn btn-sm btn-primary" onclick="applyFix(${i})">수락</button>
          <button class="btn btn-sm btn-outline" onclick="skipFix(${i})">건너뛰기</button>
        </div>
      </div>`;
  }).join('');

  panel.innerHTML = `
    <div class="spell-header">
      <strong>오류 ${errors.length}건</strong>
      <button class="btn btn-sm btn-outline" onclick="closeSpellPanel()">닫기</button>
    </div>
    <div class="spell-list">${items}</div>`;
}

function showFallback() {
  const panel = document.getElementById('spell-panel');
  panel.classList.remove('hidden');
  panel.innerHTML = `
    <div class="spell-header">
      <strong style="color:var(--c-warning)">자동 연결 실패</strong>
      <button class="btn btn-sm btn-outline" onclick="closeSpellPanel()">닫기</button>
    </div>
    <div style="padding:14px 20px">
      <p style="font-size:13px;color:var(--c-muted);margin-bottom:12px">
        맞춤법 검사 서버에 연결할 수 없습니다.<br>
        아래 버튼을 누르면 텍스트가 복사되고 검사 사이트가 열립니다.
      </p>
      <button class="btn btn-primary btn-sm" onclick="openSpellSite()">텍스트 복사 후 검사 사이트 열기</button>
    </div>`;
}

function openSpellSite() {
  const text = quill.getText().replace(/\n$/, '').trim();
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => showToast('복사됐습니다. 사이트에 붙여넣기 하세요.'));
  }
  window.open('https://speller.cs.pusan.ac.kr/', '_blank');
}

// ── 수락 / 건너뛰기 ──────────────────────────────────────
function applyFix(idx) {
  const error = spellErrors[idx];
  if (!error) return;
  const orig = error.errorInput || error.token || '';
  const fix  = document.getElementById('sfix-' + idx)?.textContent || '';
  if (!fix) return;

  const text = quill.getText();
  const pos  = text.indexOf(orig);
  if (pos >= 0) {
    quill.deleteText(pos, orig.length);
    quill.insertText(pos, fix);
  }

  const item = document.getElementById('sitem-' + idx);
  if (item) item.innerHTML = `<span class="spell-done-msg">✓ "${esc(orig)}" → "${esc(fix)}"</span>`;
}

function skipFix(idx) {
  const item = document.getElementById('sitem-' + idx);
  if (item) item.style.opacity = '0.4';
}

function clearSpellPanel() {
  const panel = document.getElementById('spell-panel');
  if (panel) { panel.innerHTML = ''; panel.classList.add('hidden'); }
}

function closeSpellPanel() { clearSpellPanel(); spellErrors = []; }
