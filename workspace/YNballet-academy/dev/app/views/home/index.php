<!-- SCREEN: 홈 메인 | PATH: / | APIs: GET /notice (active 3개), GET /course (active 전체) -->

<!-- [SECTION: HERO] 히어로 배너 -->
<section class="hero-section">
  <div class="hero-bg" style="background-image:url('<?= BASE_PATH ?>/assets/images/studio1.jpeg');"></div>
  <div class="hero-content">
    <span class="hero-en">YN Ballet Academy</span>
    <div class="hero-divider"></div>
    <h1>몸이 기억하는<br>아름다움</h1>
    <p class="hero-sub">발레의 우아함을 일상 속으로</p>
    <a href="<?= BASE_PATH ?>/inquiry/write" class="btn btn-yn-outline me-2">수강 문의하기</a>
    <a href="<?= BASE_PATH ?>/course" class="btn btn-yn-gold">과정 보기</a>
  </div>
</section>
<!-- [/SECTION: HERO] -->

<!-- [SECTION: COURSE-PREVIEW] 과정 소개 미리보기 -->
<section class="py-5" style="background: var(--ivory);">
  <div class="container">
    <div class="section-header reveal">
      <span class="en-label">Our Classes</span>
      <h2>과정 소개</h2>
      <div class="gold-divider"></div>
    </div>
    <?php if ($courses): ?>
    <div class="row g-4">
      <?php foreach (array_slice($courses, 0, 3) as $i => $c): ?>
      <div class="col-md-4 reveal reveal-delay-<?= $i + 1 ?>">
        <div class="yn-card">
          <?php if ($c['level_badge']): ?>
          <span class="badge-level"><?= e($c['level_badge']) ?></span>
          <?php endif; ?>
          <h5><?= e($c['title']) ?></h5>
          <?php if (!empty($c['target'])): ?>
          <p class="mb-1" style="font-size:.8rem;color:var(--gold);letter-spacing:.05em;">
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
    <div class="text-center mt-5 reveal">
      <a href="<?= BASE_PATH ?>/course" class="btn btn-yn-outline-navy">전체 과정 보기</a>
    </div>
    <?php endif; ?>
  </div>
</section>
<!-- [/SECTION: COURSE-PREVIEW] -->

<!-- [SECTION: INSTRUCTOR] 강사 소개 -->
<section class="py-5" style="background: var(--white);">
  <div class="container">
    <div class="section-header reveal">
      <span class="en-label">Instructor</span>
      <h2>원장 · 강사 소개</h2>
      <div class="gold-divider"></div>
    </div>
    <div class="row justify-content-center text-center reveal">
      <div class="col-md-5">
        <div class="instructor-photo">
          <img src="<?= BASE_PATH ?>/assets/images/director.jpeg" alt="최유나 원장">
        </div>
        <h5 style="font-family:'Noto Serif KR',serif;color:var(--navy);margin-bottom:.25rem;">최유나 원장</h5>
        <p style="font-size:.8rem;color:var(--gold);letter-spacing:.08em;margin-bottom:1rem;">YN Ballet Director &amp; Principal Instructor</p>
        <a href="<?= BASE_PATH ?>/about" class="btn btn-yn-outline-navy mt-1">자세히 보기</a>
      </div>
    </div>
  </div>
</section>
<!-- [/SECTION: INSTRUCTOR] -->

<!-- [SECTION: NOTICE] 최신 공지 -->
<?php if ($notices): ?>
<section class="py-5" style="background: var(--ivory);">
  <div class="container" style="max-width:760px;">
    <div class="d-flex justify-content-between align-items-center mb-4 reveal">
      <div>
        <span style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:.9rem;color:var(--gold);letter-spacing:.12em;display:block;margin-bottom:.25rem;">Notice</span>
        <h2 style="font-size:1.4rem;color:var(--navy);margin:0;">공지사항</h2>
      </div>
      <a href="<?= BASE_PATH ?>/notice" class="btn btn-yn-outline-navy btn-sm">더보기</a>
    </div>
    <div class="reveal">
      <?php foreach ($notices as $n): ?>
      <a href="<?= BASE_PATH ?>/notice/<?= (int)$n['id'] ?>" class="notice-list-item d-flex justify-content-between align-items-center">
        <span class="notice-title"><?= e($n['title']) ?></span>
        <span class="notice-date"><?= fmtDate($n['created_at']) ?></span>
      </a>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php endif; ?>
<!-- [/SECTION: NOTICE] -->

<!-- [SECTION: CTA] 수강 문의 CTA -->
<section class="cta-section">
  <div class="container reveal">
    <span class="en-label">Contact Us</span>
    <h2>수강 문의</h2>
    <p>수업에 대해 궁금한 점이 있으시면 편하게 문의해 주세요.</p>
    <a href="<?= BASE_PATH ?>/inquiry/write" class="btn btn-yn-gold btn-lg">문의하기</a>
  </div>
</section>
<!-- [/SECTION: CTA] -->
