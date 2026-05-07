const STATE_KEY = 'mensa_journal_v1';

function loadState() {
  try {
    const s = localStorage.getItem(STATE_KEY);
    return s ? JSON.parse(s) : { articles: [] };
  } catch {
    return { articles: [] };
  }
}

function saveState(state) {
  state.lastUpdated = new Date().toISOString();
  // dataUrl은 IndexedDB 전용 — localStorage 저장 전 반드시 제거
  const clean = {
    ...state,
    articles: (state.articles || []).map(art => ({
      ...art,
      images: (art.images || []).map(({ dataUrl, ...meta }) => meta),
    })),
  };
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(clean));
  } catch (e) {
    alert('저장 공간이 부족합니다.\n페이지를 새로고침하면 자동 정리됩니다.');
  }
}

function getArticles() {
  return loadState().articles || [];
}

function getArticle(id) {
  return getArticles().find(a => a.id === id) || null;
}

function upsertArticle(article) {
  const state = loadState();
  if (!state.articles) state.articles = [];
  const idx = state.articles.findIndex(a => a.id === article.id);
  if (idx >= 0) {
    state.articles[idx] = article;
  } else {
    state.articles.push(article);
  }
  saveState(state);
}

function removeArticle(id) {
  const state = loadState();
  state.articles = (state.articles || []).filter(a => a.id !== id);
  saveState(state);
}

function reorderArticles(ids) {
  const state = loadState();
  const map = {};
  (state.articles || []).forEach(a => { map[a.id] = a; });
  state.articles = ids.filter(id => map[id]).map((id, i) => ({ ...map[id], order: i + 1 }));
  saveState(state);
}

function newId() {
  return 'a' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// 구버전 데이터 마이그레이션:
// localStorage에 남아있는 이미지 dataUrl → IndexedDB로 이동 후 제거
async function migrateImageData() {
  const state = loadState();
  let changed = false;

  for (const art of (state.articles || [])) {
    for (const img of (art.images || [])) {
      if (img.dataUrl) {
        try {
          await idbSave(img.id, img.dataUrl);
        } catch {}
        delete img.dataUrl;
        changed = true;
      }
    }
  }

  if (changed) {
    // dataUrl 제거 후 강제 저장 (saveState가 strip하더라도 명시적으로)
    try {
      state.lastUpdated = new Date().toISOString();
      localStorage.setItem(STATE_KEY, JSON.stringify(state));
    } catch {
      // 여전히 공간 부족이면 그냥 넘김 — 다음 saveState에서 strip됨
    }
  }
}
