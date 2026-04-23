<!-- SCREEN: 관리자 로그인 | PATH: /admin/login -->
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?= e($pageTitle ?? '관리자 로그인') ?> — <?= e(SITE_NAME) ?></title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
</head>
<body class="bg-light d-flex align-items-center" style="min-height:100vh;">

<div class="container" style="max-width:400px;">
  <div class="card shadow-sm">
    <div class="card-body p-4">
      <h1 class="h5 fw-bold text-center mb-4"><?= e(SITE_NAME) ?> 관리자</h1>

      <?php if ($error): ?>
      <div class="alert alert-danger small"><?= e($error) ?></div>
      <?php endif; ?>

      <!-- [FORM: admin-login] POST /admin/login | Fields: admin_id(text/required), admin_pass(password/required) -->
      <form method="POST" action="<?= BASE_PATH ?>/admin/login">
        <?= Auth::csrfField() ?>
        <div class="mb-3">
          <label for="admin_id" class="form-label fw-medium">아이디</label>
          <input type="text" class="form-control" id="admin_id" name="admin_id"
            required autofocus autocomplete="username">
        </div>
        <div class="mb-4">
          <label for="admin_pass" class="form-label fw-medium">비밀번호</label>
          <input type="password" class="form-control" id="admin_pass" name="admin_pass"
            required autocomplete="current-password">
        </div>
        <button type="submit" class="btn btn-dark w-100">로그인</button>
      </form>
    </div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
