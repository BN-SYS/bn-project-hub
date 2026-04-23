/* YN발레아카데미 — 관리자 공통 JS */

(function () {
  'use strict';

  // Toggle active status — notice list / course list
  // Buttons: .toggle-btn[data-url][data-active][data-token]
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
    .then(function (data) {
      if (data.ok) location.reload();
    })
    .catch(function () { btn.disabled = false; });
  });
})();
