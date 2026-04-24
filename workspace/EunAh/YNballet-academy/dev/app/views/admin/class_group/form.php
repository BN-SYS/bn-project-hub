<!-- SCREEN: 클래스 등록/수정 | PATH: /admin/class-group/write OR /admin/class-group/:id/edit -->

<div class="p-4">
  <div class="d-flex align-items-center gap-3 mb-4">
    <a href="<?= BASE_PATH ?>/admin/class-group" class="text-muted text-decoration-none">클래스 관리</a>
    <span class="text-muted">/</span>
    <h1 class="h4 fw-bold mb-0"><?= $cls ? '수정' : '등록' ?></h1>
  </div>

  <?php if (!empty($error)): ?>
  <div class="alert alert-danger small"><?= e($error) ?></div>
  <?php endif; ?>

  <form method="POST"
    action="<?= $cls
      ? BASE_PATH . '/admin/class-group/' . (int)$cls['id'] . '/edit'
      : BASE_PATH . '/admin/class-group/write' ?>"
    style="max-width:480px;">
    <?= Auth::csrfField() ?>

    <div class="mb-3">
      <label class="form-label fw-medium">클래스명 <span class="text-danger">*</span></label>
      <input type="text" name="name" class="form-control" maxlength="50" required
        placeholder="예: 성인반, 주니어반 화목"
        value="<?= e($cls['name'] ?? '') ?>">
    </div>

    <div class="mb-3">
      <label class="form-label fw-medium">월 원비 (원)</label>
      <input type="text" name="fee" class="form-control fee-input" inputmode="numeric"
        placeholder="예: 150,000"
        value="<?= $cls ? number_format((int)$cls['fee']) : '' ?>">
      <p class="text-muted small mt-1">원비 관리에서 회원별 실납부금액을 다르게 설정할 수 있습니다.</p>
    </div>

    <div class="mb-3">
      <label class="form-label fw-medium">설명</label>
      <input type="text" name="description" class="form-control" maxlength="200"
        placeholder="예: 매주 월·수·금 19:00-20:00"
        value="<?= e($cls['description'] ?? '') ?>">
    </div>

    <div class="mb-4">
      <div class="form-check">
        <input class="form-check-input" type="checkbox" name="is_active" id="is_active" value="1"
          <?= ($cls['is_active'] ?? 1) ? 'checked' : '' ?>>
        <label class="form-check-label" for="is_active">활성 (원비 생성 대상에 포함)</label>
      </div>
    </div>

    <div class="d-flex justify-content-end gap-2">
      <a href="<?= BASE_PATH ?>/admin/class-group" class="btn btn-outline-secondary">취소</a>
      <button type="submit" class="btn btn-dark">저장</button>
    </div>
  </form>
</div>

<script>
document.querySelector('.fee-input').addEventListener('input', function () {
  var raw = this.value.replace(/[^0-9]/g, '');
  this.value = raw ? Number(raw).toLocaleString() : '';
});
</script>
