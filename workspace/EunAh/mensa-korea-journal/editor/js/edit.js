let quill = null;
let article = null;

document.addEventListener('DOMContentLoaded', () => {
  const id = new URLSearchParams(location.search).get('id');
  if (!id) { location.href = 'index.html'; return; }

  if (id === '__toc__') {
    initTocMode();
    return;
  }

  article = getArticle(id);
  if (!article) { alert('원고를 찾을 수 없습니다.'); location.href = 'index.html'; return; }

  initQuill();
  loadData();
  renderImages();
  initImageDrop();
});

// ─── 목차 편집 모드 ───────────────────────────────────────
function initTocMode() {
  document.getElementById('header-title').textContent = '목차 편집';
  ['card-info', 'card-contributors', 'card-images'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  initQuill();
  document.getElementById('tag-toolbar').style.display = 'none';
  document.getElementById('spell-btn').style.display = 'none';

  const toc = getToc();
  if (toc.content) quill.clipboard.dangerouslyPasteHTML(0, toc.content);
}

// ─── Quill 초기화 ─────────────────────────────────────────
function initQuill() {
  const toolbar = document.getElementById('tag-toolbar');
  STYLE_TAGS.forEach(tag => {
    const btn = document.createElement('button');
    btn.className = 'tag-btn';
    btn.title = tag.desc;
    btn.innerHTML = `<span class="tag-sym">${tag.symbol}</span><span class="tag-lbl">${tag.label}</span>`;
    btn.addEventListener('click', e => { e.preventDefault(); insertTag(tag.symbol); });
    toolbar.appendChild(btn);
  });

  quill = new Quill('#quill-editor', {
    theme: 'snow',
    placeholder: '원고 내용을 입력하세요...',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['clean'],
      ],
    },
  });
  quill.root.setAttribute('spellcheck', 'true');
}

// ─── 데이터 로드 ──────────────────────────────────────────
function loadData() {
  document.getElementById('field-category').value = article.category || '';
  document.getElementById('field-title').value = article.title || '';
  updateHeaderTitle(article.title);

  // 구버전 author 필드 마이그레이션
  const contributors = article.contributors && article.contributors.length > 0
    ? article.contributors
    : (article.author ? [{ type: '글', name: article.author, info: '' }] : []);
  contributors.forEach(c => addContributorRow('field-contributors', c));
  const empty = document.getElementById('contributors-empty');
  if (empty) empty.style.display = contributors.length > 0 ? 'none' : '';

  if (article.content) {
    quill.clipboard.dangerouslyPasteHTML(0, article.content);
  }

  document.getElementById('field-title').addEventListener('input', function () {
    updateHeaderTitle(this.value);
  });
}

function updateHeaderTitle(t) {
  document.getElementById('header-title').textContent = t || '원고 편집';
}

// ─── 스타일 태그 삽입 ─────────────────────────────────────
function insertTag(symbol) {
  quill.focus();
  const range = quill.getSelection(true);
  if (range.length > 0) {
    quill.insertText(range.index + range.length, symbol, 'user');
    quill.insertText(range.index, symbol, 'user');
    quill.setSelection(range.index, range.length + symbol.length * 2);
  } else {
    quill.insertText(range.index, symbol, 'user');
    quill.setSelection(range.index + symbol.length, 0);
  }
}

// ─── 저장 ─────────────────────────────────────────────────
function saveArticle() {
  if (new URLSearchParams(location.search).get('id') === '__toc__') {
    saveToc({ content: quill.root.innerHTML });
    showToast('목차가 저장됐습니다.');
    return;
  }

  const title = document.getElementById('field-title').value.trim();
  if (!title) { alert('제목을 입력해주세요.'); document.getElementById('field-title').focus(); return; }

  const updated = {
    ...article,
    category: document.getElementById('field-category').value.trim(),
    title,
    contributors: readContributors('field-contributors'),
    content: quill.root.innerHTML,
    updatedAt: new Date().toISOString(),
  };
  delete updated.author;

  upsertArticle(updated);
  article = updated;
  showToast('저장되었습니다.');
}

// ─── 작성자 행 유틸 ──────────────────────────────────────
const CONTRIB_PRESET = ['', '글', '글·사진', '사진'];

function addContributorRow(containerId, data = {}) {
  const container = document.getElementById(containerId);
  const empty = document.getElementById('contributors-empty');
  if (empty) empty.style.display = 'none';
  const isCustom = data.type && !CONTRIB_PRESET.includes(data.type);
  const row = document.createElement('div');
  row.className = 'contributor-row';
  row.innerHTML = `
    <select class="contributor-type" onchange="toggleCustomType(this)">
      <option value="">—</option>
      <option value="글"${data.type === '글' ? ' selected' : ''}>글</option>
      <option value="글·사진"${data.type === '글·사진' ? ' selected' : ''}>글·사진</option>
      <option value="사진"${data.type === '사진' ? ' selected' : ''}>사진</option>
      <option value="__custom__"${isCustom ? ' selected' : ''}>직접 입력</option>
    </select>
    <input type="text" class="contributor-type-custom${isCustom ? '' : ' hidden'}" placeholder="유형 입력" value="${esc(isCustom ? data.type : '')}">
    <input type="text" class="contributor-name" placeholder="이름" value="${esc(data.name || '')}">
    <input type="text" class="contributor-info" placeholder="이메일, 소속 등" value="${esc(data.info || '')}">
    <button type="button" class="contributor-del" onclick="removeContributorRow(this)">×</button>`;
  container.appendChild(row);
}

function toggleCustomType(sel) {
  const customInp = sel.closest('.contributor-row').querySelector('.contributor-type-custom');
  if (sel.value === '__custom__') {
    customInp.classList.remove('hidden');
    customInp.focus();
  } else {
    customInp.classList.add('hidden');
    customInp.value = '';
  }
}

function removeContributorRow(btn) {
  btn.closest('.contributor-row').remove();
  const container = document.getElementById('field-contributors');
  const empty = document.getElementById('contributors-empty');
  if (empty && container.querySelectorAll('.contributor-row').length === 0) {
    empty.style.display = '';
  }
}

function readContributors(containerId) {
  return [...document.getElementById(containerId).querySelectorAll('.contributor-row')]
    .map(row => {
      const sel = row.querySelector('.contributor-type');
      const customInp = row.querySelector('.contributor-type-custom');
      const type = sel.value === '__custom__' ? customInp.value.trim() : sel.value;
      return {
        type,
        name: row.querySelector('.contributor-name').value.trim(),
        info: row.querySelector('.contributor-info').value.trim(),
      };
    })
    .filter(c => c.name);
}

// ─── 이미지 업로드 (원본 품질 그대로) ──────────────────────
async function handleImageUpload(files) {
  if (!article.images) article.images = [];

  for (const file of Array.from(files)) {
    if (!file.type.startsWith('image/')) continue;

    const id = newId();
    const dataUrl = await readAsDataUrl(file);

    // IndexedDB에 원본 데이터 저장 (압축 없음)
    await idbSave(id, dataUrl);

    // 아티클에는 메타데이터만 저장 (dataUrl 제외 → localStorage 부담 없음)
    article.images.push({
      id,
      name: file.name,
      type: file.type,
      photoLabel: '',
      caption: '',
      createdAt: new Date().toISOString(),
    });
  }

  upsertArticle(article);
  renderImages();
}

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── 이미지 렌더링 (IndexedDB에서 로드, 드래그 정렬) ─────
let imgSortable = null;

async function renderImages() {
  const imgs = article.images || [];
  const grid = document.getElementById('image-grid');

  if (imgs.length === 0) {
    grid.innerHTML = '<p class="text-muted" style="font-size:13px">이미지가 없습니다.</p>';
    if (imgSortable) { imgSortable.destroy(); imgSortable = null; }
    return;
  }

  grid.innerHTML = '<p class="text-muted" style="font-size:13px">이미지 로딩 중...</p>';

  const dataMap = await idbGetAll(imgs.map(i => i.id));

  grid.innerHTML = imgs.map(img => {
    const src = dataMap[img.id] || '';
    return `
      <div class="img-item" data-img-id="${img.id}">
        <div class="img-drag-handle" title="드래그로 순서 변경">⠿</div>
        ${src
          ? `<img src="${src}" alt="${esc(img.name)}">`
          : `<div style="height:110px;background:#f1f5f9;display:flex;align-items:center;justify-content:center;font-size:12px;color:#94a3b8">미리보기 없음</div>`
        }
        <button class="img-del" onclick="deleteImage('${img.id}')" title="삭제">×</button>
        <div class="img-info">
          ${img.photoLabel ? `<div class="img-label">${img.photoLabel}</div>` : ''}
          <div class="img-name" title="${esc(img.name)}">${esc(img.name)}</div>
        </div>
      </div>`;
  }).join('');

  if (imgSortable) imgSortable.destroy();
  imgSortable = new Sortable(grid, {
    handle: '.img-drag-handle',
    animation: 150,
    ghostClass: 'img-ghost',
    onEnd() {
      const newOrder = [...grid.querySelectorAll('.img-item')].map(el => el.dataset.imgId);
      const imgMap = {};
      (article.images || []).forEach(img => { imgMap[img.id] = img; });
      article.images = newOrder.filter(id => imgMap[id]).map(id => imgMap[id]);
      upsertArticle(article);
    }
  });
}

async function deleteImage(imgId) {
  if (!confirm('이미지를 삭제하시겠습니까?')) return;
  await idbDelete(imgId);
  article.images = (article.images || []).filter(i => i.id !== imgId);
  upsertArticle(article);
  renderImages();
}


function initImageDrop() {
  const area = document.getElementById('img-drop');
  area.addEventListener('dragover', e => { e.preventDefault(); area.classList.add('drag-over'); });
  area.addEventListener('dragleave', () => area.classList.remove('drag-over'));
  area.addEventListener('drop', e => {
    e.preventDefault();
    area.classList.remove('drag-over');
    handleImageUpload(e.dataTransfer.files);
  });
}

// ─── 유틸 ────────────────────────────────────────────────
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1e293b;color:#fff;padding:10px 22px;border-radius:8px;font-size:14px;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,.25);pointer-events:none;transition:opacity .3s';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { toast.style.opacity = '0'; }, 2000);
}

function esc(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
