<!-- SCREEN: 비밀번호 확인 | PATH: /inquiry/:id (비밀번호 미인증) -->

<div class="page-banner">
  <span class="en-label">Contact</span>
  <h1>비밀번호 확인</h1>
  <div class="gold-divider"></div>
</div>

<div class="container py-5" style="max-width:420px;">

  <p class="mb-4 reveal" style="font-size:.875rem;color:var(--text-muted);">
    문의 작성 시 입력한 비밀번호를 입력해 주세요.
  </p>

  <?php if (!empty($error)): ?>
  <div class="alert alert-danger reveal" style="font-size:.875rem;"><?= e($error) ?></div>
  <?php endif; ?>

  <form method="POST" action="<?= BASE_PATH ?>/inquiry/check" class="reveal">
    <?= Auth::csrfField() ?>
    <input type="hidden" name="id" value="<?= (int)$id ?>">
    <div class="mb-3">
      <label for="password" class="form-label">비밀번호</label>
      <input type="password" class="form-control" id="password" name="password" required autofocus>
    </div>
    <div class="d-flex justify-content-between align-items-center">
      <button type="submit" class="btn btn-yn-gold">확인</button>
      <a href="<?= BASE_PATH ?>/inquiry" class="btn btn-yn-outline-navy">목록으로</a>
    </div>
  </form>

</div>
