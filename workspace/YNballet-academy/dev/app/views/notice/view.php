<!-- SCREEN: 공지사항 상세 | PATH: /notice/:id -->

<div class="page-banner">
  <span class="en-label">Notice</span>
  <h1>공지사항</h1>
  <div class="gold-divider"></div>
</div>

<div class="container py-5" style="max-width:760px;">

  <div class="reveal mb-4">
    <h2 style="font-family:'Noto Serif KR',serif;font-size:1.4rem;color:var(--navy);margin-bottom:.5rem;">
      <?= e($notice['title']) ?>
    </h2>
    <p style="font-size:.82rem;color:var(--text-muted);letter-spacing:.04em;">
      <?= fmtDate($notice['created_at']) ?>
    </p>
    <div style="height:1px;background:var(--ivory-dark);margin-top:1rem;"></div>
  </div>

  <div class="notice-content py-4 reveal">
    <?= $notice['content'] ?>
  </div>

  <div style="height:1px;background:var(--ivory-dark);margin-bottom:1.5rem;"></div>

  <div class="reveal text-end">
    <a href="<?= BASE_PATH ?>/notice" class="btn btn-yn-outline-navy btn-sm">목록으로</a>
  </div>

</div>
