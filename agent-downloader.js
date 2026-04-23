// =========================================================
// agent-downloader.js  v2.0
// Base64 디코딩 · 파일 다운로드 · 카드 렌더링
// 의존: agent-files-*.js (FILE_DEFS 배열) 먼저 로드 필요
// =========================================================

function toB64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}
function fromB64(b64) {
  return decodeURIComponent(escape(atob(b64)));
}

function showToast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._tid);
  t._tid = setTimeout(function () { t.classList.remove('show'); }, 2400);
}

function dlFile(filename, b64content) {
  var text = fromB64(b64content);
  var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  var url  = URL.createObjectURL(blob);
  var a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  showToast('' + filename + ' 다운로드 시작');
}

function downloadAll(group) {
  var list = FILE_DEFS.filter(function (f) { return f.group === group; });
  list.forEach(function (f, i) {
    setTimeout(function () { dlFile(f.filename, f.b64); }, i * 220);
  });
  showToast('⬇️ ' + list.length + '개 파일 다운로드 시작');
}

function renderCards() {
  var maps = { global: 'global-cards', sb: 'sb-cards', proj: 'proj-cards' };
  var themes = {
    global: { p: 'pv', c: 'cv', b: 'dv' },
    sb:     { p: 'pg', c: 'cg', b: 'dg' },
    proj:   { p: 'pt', c: 'ct', b: 'dt' }
  };
  Object.keys(maps).forEach(function (group) {
    var el = document.getElementById(maps[group]);
    if (!el) return;
    FILE_DEFS.filter(function (f) { return f.group === group; }).forEach(function (f) {
      var th   = themes[group];
      var tags = (f.tags || []).map(function (t) {
        return '<span class="tag-badge">' + t + '</span>';
      }).join('');
      el.innerHTML +=
        '<div class="card ' + th.c + '">'
        + '<div class="card-top">'
          + '<span class="card-icon">' + (f.icon || '📄') + '</span>'
          + '<span class="card-path ' + th.p + '">📍 ' + f.path + '</span>'
        + '</div>'
        + '<h3>' + f.filename + '</h3>'
        + '<p>' + f.desc + '</p>'
        + (tags ? '<div class="card-tags">' + tags + '</div>' : '')
        + '<button class="btn-dl ' + th.b + '" onclick="dlFile(\'' + f.filename + '\',\'' + f.b64 + '\')">⬇️ ' + f.filename + ' 다운로드</button>'
        + '</div>';
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  renderCards();
});
