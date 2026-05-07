let quill = null;
let article = null;

document.addEventListener('DOMContentLoaded', () => {
  const id = new URLSearchParams(location.search).get('id');
  if (!id) { location.href = 'index.html'; return; }

  article = getArticle(id);
  if (!article) { alert('원고를 찾을 수 없습니다.'); location.href = 'index.html'; return; }

  initQuill();
  loadData();
  renderImages();
  initImageDrop();
});

// ─── Quill 초기화 ─────────────────────────────────────────
function initQuill() {
  // 스타일 태그 버튼 생성
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
}

// ─── 데이터 로드 ─────────────────────────────────────────
function loadData() {
  document.getElementById('field-title').value = article.title || '';
  document.getElementById('field-author').value = article.author || '';
  updateHeaderTitle(article.title);

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
  quill.insertText(range.index, symbol, 'user');
  quill.setSelection(range.index + symbol.length, 0);
}

// ─── 저장 ─────────────────────────────────────────────────
function saveArticle() {
  const title = document.getElementById('field-title').value.trim();
  if (!title) { alert('제목을 입력해주세요.'); document.getElementById('field-title').focus(); return; }

  const updated = {
    ...article,
    title,
    author: document.getElementById('field-author').value.trim(),
    content: quill.root.innerHTML,
    updatedAt: new Date().toISOString(),
  };

  upsertArticle(updated);
  article = updated;
  showToast('저장되었습니다.');
}

// ─── 이미지 업로드 ───────────────────────────────────────
async function handleImageUpload(files) {
  if (!article.images) article.images = [];

  for (const file of Array.from(files)) {
    if (!file.type.startsWith('image/')) continue;
    const dataUrl = await readAsDataUrl(file);
    const compressed = await compressImage(dataUrl);
    article.images.push({
      id: newId(),
      name: file.name,
      dataUrl: compressed,
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
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── 이미지 렌더링 ───────────────────────────────────────
function renderImages() {
  const imgs = article.images || [];
  const grid = document.getElementById('image-grid');

  if (imgs.length === 0) {
    grid.innerHTML = '<p class="text-muted" style="font-size:13px">이미지가 없습니다.</p>';
    return;
  }

  grid.innerHTML = imgs.map(img => `
    <div class="img-item" data-img-id="${img.id}">
      <img src="${img.dataUrl}" alt="${esc(img.name)}">
      <button class="img-del" onclick="deleteImage('${img.id}')" title="삭제">×</button>
      <div class="img-info">
        ${img.photoLabel ? `<div class="img-label">${img.photoLabel}</div>` : ''}
        <div class="img-name" title="${esc(img.name)}">${esc(img.name)}</div>
        <input class="caption-inp" type="text" placeholder="캡션 입력"
          value="${esc(img.caption || '')}"
          onchange="updateCaption('${img.id}', this.value)">
      </div>
    </div>`).join('');
}

function deleteImage(imgId) {
  if (!confirm('이미지를 삭제하시겠습니까?')) return;
  article.images = (article.images || []).filter(i => i.id !== imgId);
  upsertArticle(article);
  renderImages();
}

function updateCaption(imgId, caption) {
  const img = (article.images || []).find(i => i.id === imgId);
  if (img) { img.caption = caption; upsertArticle(article); }
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
    toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1e293b;color:#fff;padding:10px 22px;border-radius:8px;font-size:14px;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,.25);pointer-events:none;';
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
