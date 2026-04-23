<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?= e($pageTitle ?? '관리자') ?> — <?= e(SITE_NAME) ?> 관리자</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="<?= BASE_PATH ?>/assets/css/admin.css">
<?php if (!empty($extraCss)) echo $extraCss; ?>
</head>
<body>
<div class="admin-wrap">

  <!-- 사이드바 -->
  <nav class="admin-sidebar">
    <a class="admin-sidebar-logo" href="<?= BASE_PATH ?>/admin/notice">
      YN 관리자
    </a>

    <div class="admin-nav-group">
      <span class="admin-nav-label">콘텐츠</span>
      <a class="nav-link<?= ($adminActive ?? '') === 'notice'    ? ' active' : '' ?>" href="<?= BASE_PATH ?>/admin/notice">공지사항</a>
      <a class="nav-link<?= ($adminActive ?? '') === 'course'    ? ' active' : '' ?>" href="<?= BASE_PATH ?>/admin/course">과정 관리</a>
      <a class="nav-link<?= ($adminActive ?? '') === 'category'  ? ' active' : '' ?>" href="<?= BASE_PATH ?>/admin/category">카테고리</a>
      <a class="nav-link<?= ($adminActive ?? '') === 'popup'     ? ' active' : '' ?>" href="<?= BASE_PATH ?>/admin/popup">팝업 관리</a>
    </div>

    <div class="admin-nav-group">
      <span class="admin-nav-label">문의</span>
      <a class="nav-link<?= ($adminActive ?? '') === 'inquiry' ? ' active' : '' ?>" href="<?= BASE_PATH ?>/admin/inquiry">문의 목록</a>
    </div>

    <div class="admin-sidebar-bottom">
      <a href="<?= BASE_PATH ?>/" target="_blank" class="nav-link">↗ 사용자 사이트</a>
      <a href="<?= BASE_PATH ?>/admin/logout" class="nav-link">로그아웃</a>
    </div>
  </nav>

  <!-- 메인 -->
  <div class="admin-main">

    <!-- 상단 바 -->
    <header class="admin-topbar">
      <span class="admin-topbar-title"><?= e($pageTitle ?? '') ?></span>
      <span style="font-size:.78rem;color:var(--admin-text-muted);"><?= e(SITE_NAME) ?> 관리</span>
    </header>

    <!-- 콘텐츠 -->
    <?php require APP_ROOT . '/app/views/' . $content . '.php'; ?>

  </div><!-- /.admin-main -->

</div><!-- /.admin-wrap -->

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="<?= BASE_PATH ?>/assets/js/admin.js"></script>
<?php if (!empty($extraJs)) echo $extraJs; ?>
</body>
</html>
