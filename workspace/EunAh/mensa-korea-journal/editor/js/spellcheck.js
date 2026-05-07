// ── 맞춤법 검사 (부산대 맞춤법 검사기) ────────────────────
let spellErrors = [];

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
      if (data && data.errInfo) all = all.concat(data.errInfo);
    }
    spellErrors = all;
    renderSpellPanel(all);
  } catch (e) {
    renderSpellMsg('error', e.message);
  } finally {
    btn.disabled = false;
    btn.textContent = '맞춤법 검사';
  }
}

async function callSpellAPI(text) {
  const url = 'https://speller.cs.pusan.ac.kr/results';
  const body = 'text1=' + encodeURIComponent(text);
  const opts = {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  };

  // 직접 호출
  try {
    const r = await fetch(url, opts);
    if (r.ok) return r.json();
  } catch {}

  // CORS 프록시 재시도
  try {
    const r = await fetch('https://corsproxy.io/?' + encodeURIComponent(url), opts);
    if (r.ok) return r.json();
  } catch {}

  throw new Error('서버에 연결할 수 없습니다.\n인터넷 연결을 확인해주세요.');
}

function chunkText(text, size) {
  const chunks = [];
  for (let i = 0; i < text.length; i += size) chunks.push(text.slice(i, i + size));
  return chunks;
}

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
    const dropOpts = cands.length > 1
      ? `<select class="spell-cands" onchange="document.getElementById('sfix-${i}').textContent=this.value">
           ${cands.map(c => `<option>${esc(c)}</option>`).join('')}
         </select>`
      : '';
    return `
      <div class="spell-item" id="sitem-${i}">
        <div class="spell-tokens">
          <span class="spell-orig">${orig}</span>
          <span class="spell-arrow">→</span>
          <span class="spell-fix" id="sfix-${i}">${first}</span>
          ${dropOpts}
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

function renderSpellMsg(type, msg) {
  const panel = document.getElementById('spell-panel');
  panel.classList.remove('hidden');
  const color = type === 'error' ? 'var(--c-danger)' : 'var(--c-muted)';
  panel.innerHTML = `
    <div class="spell-header">
      <strong style="color:${color}">${type === 'error' ? '연결 오류' : '알림'}</strong>
      <button class="btn btn-sm btn-outline" onclick="closeSpellPanel()">닫기</button>
    </div>
    <p style="padding:12px 20px;font-size:13px;color:var(--c-muted)">${esc(msg)}</p>`;
}

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
