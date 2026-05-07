let sortable = null;
let pendingFiles = [];
let pasteMode = false;

document.addEventListener('DOMContentLoaded', () => {
  render();
  initDropZone();
});

// ─── 렌더링 ───────────────────────────────────────────────
function render() {
  const articles = getArticles();
  document.getElementById('stat-count').textContent = articles.length;
  document.getElementById('stat-photos').textContent = getTotalPhotos();

  const list = document.getElementById('article-list');

  if (articles.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>원고가 없습니다</h3>
        <p>파일을 가져오거나 직접 원고를 추가해주세요.</p>
        <div style="display:flex;gap:8px;justify-content:center;margin-top:16px">
          <button class="btn btn-primary" onclick="openImportModal()">파일 가져오기</button>
          <button class="btn btn-outline" onclick="openNewModal()">직접 추가</button>
        </div>
      </div>`;
    if (sortable) { sortable.destroy(); sortable = null; }
    return;
  }

  list.innerHTML = articles.map((a, i) => {
    const pc = countPhotos(a.content);
    const ic = (a.images || []).length;
    return `
      <div class="article-card" data-id="${a.id}">
        <span class="drag-handle" title="드래그로 순서 변경">⠿</span>
        <div class="order-badge">${i + 1}</div>
        <div class="article-info">
          <div class="article-title">${esc(a.title || '(제목 없음)')}</div>
          <div class="article-author">${esc(a.author || '—')}</div>
        </div>
        <div class="article-meta">
          ${pc > 0 ? `<span class="badge badge-blue">♣ ${pc}</span>` : ''}
          ${ic > 0 ? `<span class="badge badge-gray">📷 ${ic}</span>` : ''}
        </div>
        <div class="article-actions">
          <a href="edit.html?id=${a.id}" class="btn btn-outline btn-sm">편집</a>
          <button class="btn btn-sm btn-danger-soft" onclick="handleDelete('${a.id}')">삭제</button>
        </div>
      </div>`;
  }).join('');

  if (sortable) sortable.destroy();
  sortable = new Sortable(list, {
    handle: '.drag-handle',
    animation: 150,
    ghostClass: 'sortable-ghost',
    onEnd() {
      const ids = [...list.querySelectorAll('.article-card')].map(el => el.dataset.id);
      reorderArticles(ids);
      render();
    }
  });
}

// ─── 삭제 ────────────────────────────────────────────────
function handleDelete(id) {
  if (!confirm('이 원고를 삭제하시겠습니까?')) return;
  removeArticle(id);
  render();
}

// ─── 채번 ────────────────────────────────────────────────
function runNumbering() {
  const total = applyPhotoNumbering();
  render();
  showAlert(`채번 완료 — 총 ♣${total}장`, 'success');
  document.getElementById('stat-numbered').textContent = new Date().toLocaleTimeString('ko-KR');
}

// ─── 내보내기 ─────────────────────────────────────────────
async function runExport() {
  try {
    await exportToDocx();
  } catch (e) {
    alert('내보내기 실패: ' + e.message);
    console.error(e);
  }
}

// ─── 새 원고 모달 ─────────────────────────────────────────
function openNewModal() {
  document.getElementById('new-title').value = '';
  document.getElementById('new-author').value = '';
  show('modal-new');
  setTimeout(() => document.getElementById('new-title').focus(), 80);
}

function closeNewModal() { hide('modal-new'); }

function createNew() {
  const title = document.getElementById('new-title').value.trim();
  if (!title) { alert('제목을 입력해주세요.'); return; }
  const art = {
    id: newId(),
    title,
    author: document.getElementById('new-author').value.trim(),
    content: '',
    images: [],
    order: getArticles().length + 1,
    createdAt: new Date().toISOString(),
  };
  upsertArticle(art);
  closeNewModal();
  location.href = 'edit.html?id=' + art.id;
}

// ─── 가져오기 모달 ────────────────────────────────────────
function openImportModal() {
  pendingFiles = [];
  pasteMode = false;
  document.getElementById('file-input').value = '';
  document.getElementById('file-list').innerHTML = '';
  document.getElementById('paste-text').value = '';
  document.getElementById('paste-title').value = '';
  document.getElementById('paste-author').value = '';
  switchTab('tab-file');
  show('modal-import');
}

function closeImportModal() { hide('modal-import'); }

function switchTab(tabId) {
  pasteMode = tabId === 'tab-paste';
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));
  document.getElementById('tab-file').classList.toggle('hidden', pasteMode);
  document.getElementById('tab-paste').classList.toggle('hidden', !pasteMode);
}

async function handleFileSelect(files) {
  pendingFiles = Array.from(files);
  document.getElementById('file-list').innerHTML = pendingFiles.map(f => `
    <div class="file-row">
      <span>📄 ${esc(f.name)}</span>
      <span class="text-muted">${(f.size / 1024).toFixed(0)} KB</span>
    </div>`).join('');
}

async function confirmImport() {
  if (pasteMode) {
    const text = document.getElementById('paste-text').value.trim();
    if (!text) { alert('내용을 붙여넣어주세요.'); return; }
    const title = document.getElementById('paste-title').value.trim() || '붙여넣기 원고';
    const author = document.getElementById('paste-author').value.trim();
    const content = '<p>' + text.split(/\n\n+/).map(p => p.trim().replace(/\n/g, '<br>')).join('</p><p>') + '</p>';
    upsertArticle({ id: newId(), title, author, content, images: [], order: getArticles().length + 1, createdAt: new Date().toISOString() });
    closeImportModal();
    render();
    showAlert('원고 1개를 추가했습니다.', 'success');
    return;
  }

  if (pendingFiles.length === 0) { alert('파일을 선택해주세요.'); return; }

  const btn = document.getElementById('import-btn');
  btn.disabled = true; btn.textContent = '처리 중...';

  let ok = 0, fail = [];
  for (const file of pendingFiles) {
    try {
      const content = await parseFile(file);
      if (content === null) {
        fail.push(file.name + ' (HWP 변환 필요)');
        continue;
      }
      upsertArticle({
        id: newId(),
        title: file.name.replace(/\.(docx?|txt|hwpx?)$/i, ''),
        author: '',
        content,
        images: [],
        order: getArticles().length + 1,
        createdAt: new Date().toISOString(),
      });
      ok++;
    } catch (e) {
      fail.push(file.name);
      console.error(e);
    }
  }

  closeImportModal();
  render();
  if (fail.length > 0) {
    showAlert(`${ok}개 완료. 실패: ${fail.join(', ')}`, 'warning');
  } else {
    showAlert(`${ok}개 원고를 가져왔습니다.`, 'success');
  }

  btn.disabled = false; btn.textContent = '가져오기';
}

// ─── 드롭존 ──────────────────────────────────────────────
function initDropZone() {
  const zone = document.getElementById('drop-zone');
  if (!zone) return;
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    handleFileSelect(e.dataTransfer.files);
  });
}

// ─── 유틸 ────────────────────────────────────────────────
function show(id) { document.getElementById(id).classList.remove('hidden'); }
function hide(id) { document.getElementById(id).classList.add('hidden'); }

function showAlert(msg, type = 'info') {
  const el = document.getElementById('alert-area');
  el.innerHTML = `<div class="alert alert-${type}">${msg}</div>`;
  setTimeout(() => el.innerHTML = '', 3500);
}

function esc(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
