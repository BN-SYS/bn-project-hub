<!-- SCREEN: 로그인 | PATH: /login | API: POST /login -->

<div class="page-banner">
  <span class="en-label">Login</span>
  <h1>로그인</h1>
  <div class="gold-divider"></div>
</div>

<div class="container py-5" style="max-width:440px;">

  <?php if ($error): ?>
  <div class="alert alert-danger reveal"><?= e($error) ?></div>
  <?php endif; ?>

  <form method="POST" action="<?= BASE_PATH ?>/login" novalidate class="needs-validation reveal">
    <?= Auth::csrfField() ?>

    <?php
    $redirect = $_GET['redirect'] ?? '';
    if ($redirect && str_starts_with($redirect, BASE_PATH)):
    ?>
    <input type="hidden" name="redirect" value="<?= e($redirect) ?>">
    <?php endif; ?>

    <div class="mb-3">
      <label for="username" class="form-label">아이디</label>
      <input type="text" class="form-control" id="username" name="username"
        required autocomplete="username"
        value="<?= e($old['username'] ?? '') ?>" placeholder="아이디 입력">
      <div class="invalid-feedback">아이디를 입력해 주세요.</div>
    </div>

    <div class="mb-4">
      <label for="password" class="form-label">비밀번호</label>
      <input type="password" class="form-control" id="password" name="password"
        required autocomplete="current-password" placeholder="비밀번호 입력">
      <div class="invalid-feedback">비밀번호를 입력해 주세요.</div>
    </div>

    <button type="submit" class="btn btn-yn-gold w-100 mb-3">로그인</button>

    <p class="text-center" style="font-size:.875rem;color:var(--text-muted);">
      아직 회원이 아니신가요?
      <a href="<?= BASE_PATH ?>/register" class="ms-1">회원가입</a>
    </p>
  </form>

</div>
