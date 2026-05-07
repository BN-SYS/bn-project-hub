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
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch (e) {
    alert('저장 공간이 부족합니다. 이미지 파일 크기를 줄여주세요.');
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
