<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?= e($pageTitle ?? SITE_NAME) ?></title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css">
<link rel="stylesheet" href="<?= BASE_PATH ?>/assets/css/main.css">
<?php if (!empty($extraCss)) echo $extraCss; ?>
</head>
<body>

<nav class="navbar navbar-expand-lg fixed-top">
  <div class="container">
    <a class="navbar-brand" href="<?= BASE_PATH ?>/">
      YN<span>발레아카데미</span>
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-label="메뉴">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="mainNav">
      <ul class="navbar-nav ms-auto gap-1">
        <li class="nav-item">
          <a class="nav-link<?= ($activePage ?? '') === 'home'    ? ' active' : '' ?>" href="<?= BASE_PATH ?>/">홈</a>
        </li>
        <li class="nav-item">
          <a class="nav-link<?= ($activePage ?? '') === 'about'   ? ' active' : '' ?>" href="<?= BASE_PATH ?>/about">아카데미 소개</a>
        </li>
        <li class="nav-item">
          <a class="nav-link<?= ($activePage ?? '') === 'course'  ? ' active' : '' ?>" href="<?= BASE_PATH ?>/course">과정소개</a>
        </li>
        <li class="nav-item">
          <a class="nav-link<?= ($activePage ?? '') === 'schedule' ? ' active' : '' ?>" href="<?= BASE_PATH ?>/schedule">수업 일정</a>
        </li>
        <li class="nav-item">
          <a class="nav-link<?= ($activePage ?? '') === 'notice'  ? ' active' : '' ?>" href="<?= BASE_PATH ?>/notice">공지사항</a>
        </li>
        <li class="nav-item">
          <a class="nav-link<?= ($activePage ?? '') === 'inquiry' ? ' active' : '' ?>" href="<?= BASE_PATH ?>/inquiry/write">수강 문의</a>
        </li>
      </ul>

      <!-- 구분선 + 소셜/연락처 -->
      <div class="navbar-contact">
        <a href="https://blog.naver.com/ynballet2025" target="_blank" class="navbar-contact-btn" title="네이버 블로그">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/></svg>
        </a>
        <a href="https://www.instagram.com/ynballet2025" target="_blank" class="navbar-contact-btn" title="인스타그램">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
        </a>
        <a href="tel:0507-1379-2176" class="navbar-contact-btn navbar-contact-tel" title="전화 문의">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style="margin-right:.3rem;flex-shrink:0;"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
          0507-1379-2176
        </a>
      </div>
    </div>
  </div>
</nav>

<main>
  <?php require APP_ROOT . '/app/views/' . $content . '.php'; ?>
</main>

<footer>
  <div class="container">
    <div class="row g-4">
      <div class="col-md-4">
        <p class="footer-brand"><?= e(SITE_NAME) ?></p>
        <p class="footer-tagline">몸이 기억하는 아름다움</p>
        <address>
          <p>서울 강서구 허준로 121<br>대림경동아파트 상가 3층</p>
        </address>
      </div>
      <div class="col-md-4">
        <address>
          <p>Tel. <a href="tel:0507-1379-2176">0507-1379-2176</a></p>
          <p>원장: 최유나</p>
          <p>운영 시간: 평일 10:00 – 20:00</p>
        </address>
      </div>
      <div class="col-md-4 text-md-end d-flex flex-column justify-content-end">
        <nav class="d-flex gap-3 justify-content-md-end mb-3" aria-label="하단 메뉴">
          <a href="<?= BASE_PATH ?>/about">소개</a>
          <a href="<?= BASE_PATH ?>/course">과정</a>
          <a href="<?= BASE_PATH ?>/notice">공지</a>
          <a href="<?= BASE_PATH ?>/inquiry/write">문의</a>
        </nav>
      </div>
    </div>
    <hr class="footer-divider">
    <p class="footer-copy">&copy; <?= date('Y') ?> <?= e(SITE_NAME) ?>. All rights reserved.</p>
  </div>
</footer>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="<?= BASE_PATH ?>/assets/js/main.js"></script>
<?php if (!empty($extraJs)) echo $extraJs; ?>

<?php
// ─── 팝업 노출 (메인 홈 전용) ───────────────────────────
if (($activePage ?? '') === 'home') {
    require_once APP_ROOT . '/app/models/PopupModel.php';
    $__popups = (new PopupModel())->getActivePopups();
    if (!empty($__popups)) {
        require APP_ROOT . '/app/views/partials/popups.php';
    }
}
?>
</body>
</html>
