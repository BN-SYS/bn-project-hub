<!-- SCREEN: 과정소개 | PATH: /course | APIs: GET /course (grouped) -->

<div class="page-banner">
  <span class="en-label">Our Classes</span>
  <h1>과정 소개</h1>
  <div class="gold-divider"></div>
</div>

<div class="container py-5">

  <?php if (empty($grouped)): ?>
  <p class="text-center py-5" style="color:var(--text-muted);">등록된 과정이 없습니다.</p>
  <?php else: ?>
    <?php foreach ($grouped as $category => $items): ?>
    <!-- [SECTION: COURSE-<?= e(strtoupper($category)) ?>] -->
    <section class="mb-5 pb-3">
      <div class="reveal mb-4">
        <span style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:.9rem;color:var(--gold);letter-spacing:.12em;display:block;margin-bottom:.3rem;">Class</span>
        <h2 style="font-size:1.3rem;color:var(--navy);padding-bottom:.75rem;border-bottom:1px solid var(--ivory-dark);"><?= e($category) ?></h2>
      </div>
      <div class="row g-4">
        <?php foreach ($items as $i => $c): ?>
        <div class="col-md-4 reveal reveal-delay-<?= min($i + 1, 3) ?>">
          <div class="yn-card">
            <?php if ($c['level_badge']): ?>
            <span class="badge-level"><?= e($c['level_badge']) ?></span>
            <?php endif; ?>
            <h5><?= e($c['title']) ?></h5>
            <?php if ($c['target']): ?>
            <p style="font-size:.8rem;color:var(--gold);letter-spacing:.04em;margin-bottom:.6rem;">
              대상: <?= e($c['target']) ?>
            </p>
            <?php endif; ?>
            <p><?= e($c['description'] ?? '') ?></p>
            <?php if ($c['fee']): ?>
            <p class="card-fee">수강료: <?= e($c['fee']) ?></p>
            <?php endif; ?>
          </div>
        </div>
        <?php endforeach; ?>
      </div>
    </section>
    <!-- [/SECTION: COURSE-<?= e(strtoupper($category)) ?>] -->
    <?php endforeach; ?>
  <?php endif; ?>

  <div class="text-center mt-4 reveal" style="padding-bottom:3rem;">
    <a href="<?= BASE_PATH ?>/inquiry/write" class="btn btn-yn-gold btn-lg">수강 문의하기</a>
  </div>
</div>
