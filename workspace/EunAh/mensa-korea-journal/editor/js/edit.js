let quill = null;
let article = null;

document.addEventListener('DOMContentLoaded', () => {
  const id = new URLSearchParams(location.search).get('id');
  if (!id) { location.href = 'index.html'; return; }

  article = getArticle(id);
  if (!article) { alert('원고를 찾을 수 없습니다.'); location.href = 'index.html'; return; }

  initQuill();
  loadData();
  renderImages();   // async — IndexedDB에서 이미지 로드
  initImageDrop();
});

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
}

// ─── 데이터 로드 ──────────────────────────────────────────
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

// ─── 이미지 렌더링 (IndexedDB에서 로드) ──────────────────
async function renderImages() {
  const imgs = article.images || [];
  const grid = document.getElementById('image-grid');

  if (imgs.length === 0) {
    grid.innerHTML = '<p class="text-muted" style="font-size:13px">이미지가 없습니다.</p>';
    return;
  }

  // 로딩 표시
  grid.innerHTML = '<p class="text-muted" style="font-size:13px">이미지 로딩 중...</p>';

  // IndexedDB에서 dataUrl 일괄 조회
  const dataMap = await idbGetAll(imgs.map(i => i.id));

  grid.innerHTML = imgs.map(img => {
    const src = dataMap[img.id] || '';
    return `
      <div class="img-item" data-img-id="${img.id}">
        ${src
          ? `<img src="${src}" alt="${esc(img.name)}">`
          : `<div style="height:110px;background:#f1f5f9;display:flex;align-items:center;justify-content:center;font-size:12px;color:#94a3b8">미리보기 없음</div>`
        }
        <button class="img-del" onclick="deleteImage('${img.id}')" title="삭제">×</button>
        <div class="img-info">
          ${img.photoLabel ? `<div class="img-label">${img.photoLabel}</div>` : ''}
          <div class="img-name" title="${esc(img.name)}">${esc(img.name)}</div>
          <input class="caption-inp" type="text" placeholder="캡션 입력"
            value="${esc(img.caption || '')}"
            onchange="updateCaption('${img.id}', this.value)">
        </div>
      </div>`;
  }).join('');
}

async function deleteImage(imgId) {
  if (!confirm('이미지를 삭제하시겠습니까?')) return;
  await idbDelete(imgId);
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
