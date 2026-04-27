/* YN발레아카데미 — 관리자 공통 JS v2 */

(function () {
  'use strict';

  /* ─── 테이블 반응형: data-label 자동 주입 ──────── */
  // thead th 텍스트를 읽어 각 tbody td[data-label]에 주입.
  // 모바일 CSS가 이 attribute를 ::before로 렌더링해 가로스크롤 없는 카드 레이아웃 구현.
  function initTableLabels() {
    document.querySelectorAll('.table-responsive table').forEach(function (table) {
      var headers = Array.from(table.querySelectorAll('thead th')).map(function (th) {
        var text = th.textContent.trim();
        return text === '' ? '관리' : text;   // 빈 헤더(버튼 컬럼) → "관리"
      });
      table.querySelectorAll('tbody tr').forEach(function (tr) {
        Array.from(tr.querySelectorAll('td')).forEach(function (td, i) {
          td.setAttribute('data-label', headers[i] !== undefined ? headers[i] : '관리');
        });
      });
    });
  }

  initTableLabels();

  /* ─── 모바일 사이드바 토글 ─────────────────────── */
  var sidebar  = document.getElementById('adminSidebar');
  var toggle   = document.getElementById('adminMenuToggle');
  var overlay  = document.getElementById('adminOverlay');

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (toggle)  toggle.addEventListener('click', openSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);

  /* 화면이 넓어지면 사이드바 자동 닫기 */
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) closeSidebar();
  });

  /* ─── 활성화/비활성화 토글 버튼 ─────────────────── */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.toggle-btn');
    if (!btn) return;

    var url    = btn.dataset.url;
    var active = btn.dataset.active;
    var token  = btn.dataset.token;

    btn.disabled = true;

    fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    '_token=' + encodeURIComponent(token) + '&is_active=' + active
    })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      if (d.ok) location.reload();
      else btn.disabled = false;
    })
    .catch(function () { btn.disabled = false; });
  });

})();
