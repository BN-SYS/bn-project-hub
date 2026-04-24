<!-- SCREEN: 공지사항 목록 | PATH: /notice | APIs: GET /notice -->

<div class="page-banner">
  <span class="en-label">Notice</span>
  <h1>공지사항</h1>
  <div class="gold-divider"></div>
</div>

<div class="container py-5">

  <?php if (empty($notices)): ?>
  <p class="text-center py-5" style="color:var(--text-muted);">등록된 공지사항이 없습니다.</p>
  <?php else: ?>

  <!-- [API-DATA] GET /notice?page=N
    이 영역은 공지사항 카드 그리드입니다.
    빈 상태: "등록된 공지사항이 없습니다." 메시지 표시
    썸네일: 본문 첫 번째 이미지 자동 추출 (없으면 네이비 플레이스홀더) -->
  <div class="notice-grid reveal">
    <?php foreach ($notices as $n): ?>
    <a href="<?= BASE_PATH ?>/notice/<?= (int)$n['id'] ?>" class="notice-card-link">
      <div class="notice-card">
        <?php if (!empty($n['is_pinned'])): ?>
        <span class="notice-pin-badge">공지</span>
        <?php endif; ?>
        <div class="notice-card-img-wrap">
          <?php if (!empty($n['thumbnail'])): ?>
          <img class="notice-card-img" src="<?= e($n['thumbnail']) ?>" alt="<?= e($n['title']) ?>">
          <?php else: ?>
          <div class="notice-card-placeholder">
            <span class="notice-card-placeholder-text"><?= e(mbTruncate($n['title'], 30)) ?></span>
          </div>
          <?php endif; ?>
        </div>
        <div class="notice-card-info">
          <p class="notice-card-title"><?= e($n['title']) ?></p>
          <p class="notice-card-date"><?= fmtDate($n['created_at']) ?></p>
        </div>
      </div>
    </a>
    <?php endforeach; ?>
  </div>

  <div class="mt-5 reveal">
    <?= pagination($total, $page, $perPage, BASE_PATH . '/notice?') ?>
  </div>

  <?php endif; ?>

</div>
