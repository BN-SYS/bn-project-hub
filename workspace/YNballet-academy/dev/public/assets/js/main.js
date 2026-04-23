/* YN발레아카데미 — 사용자 공통 JS */

(function () {
  'use strict';

  /* ─── Reveal 애니메이션 ─────────────────────────── */
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(function (el) {
    observer.observe(el);
  });

  /* ─── Bootstrap 5 custom validation ────────────── */
  document.querySelectorAll('.needs-validation').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      }
      form.classList.add('was-validated');
    });
  });

  /* ─── Character counter (#content / #content-count) */
  var contentEl = document.getElementById('content');
  var countEl   = document.getElementById('content-count');
  if (contentEl && countEl) {
    countEl.textContent = contentEl.value.length;
    contentEl.addEventListener('input', function () {
      countEl.textContent = contentEl.value.length;
    });
  }

  /* ─── Password confirm match ──────────────────── */
  var pw    = document.getElementById('password');
  var pwCfm = document.getElementById('password_confirm');
  if (pw && pwCfm) {
    function checkMatch() {
      if (pwCfm.value && pw.value !== pwCfm.value) {
        pwCfm.setCustomValidity('mismatch');
      } else {
        pwCfm.setCustomValidity('');
      }
    }
    pw.addEventListener('input', checkMatch);
    pwCfm.addEventListener('input', checkMatch);
  }
})();
