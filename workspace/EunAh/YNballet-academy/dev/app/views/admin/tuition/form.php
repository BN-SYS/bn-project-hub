<!-- SCREEN: 원비 수정 | PATH: /admin/tuition/:id/edit -->

<div class="p-4">
  <div class="d-flex align-items-center gap-3 mb-4">
    <a href="<?= BASE_PATH ?>/admin/tuition?year=<?= (int)$tuition['year'] ?>&month=<?= (int)$tuition['month'] ?>"
      class="text-muted text-decoration-none">원비 관리</a>
    <span class="text-muted">/</span>
    <h1 class="h4 fw-bold mb-0">원비 수정</h1>
  </div>

  <?php if (!empty($error)): ?>
  <div class="alert alert-danger small"><?= e($error) ?></div>
  <?php endif; ?>

  <!-- 회원 정보 (읽기 전용) -->
  <div class="mb-4 p-3 rounded" style="background:#f8f9fa;">
    <div class="row g-2 small">
      <div class="col-auto">
        <span class="text-muted">회원</span>
        <span class="ms-2 fw-medium"><?= e($tuition['member_name']) ?></span>
      </div>
      <div class="col-auto">
        <span class="text-muted ms-3">클래스</span>
        <span class="ms-2"><?= $tuition['class_name'] ? e($tuition['class_name']) : '—' ?></span>
      </div>
      <div class="col-auto">
        <span class="text-muted ms-3">기간</span>
        <span class="ms-2"><?= (int)$tuition['year'] ?>년 <?= (int)$tuition['month'] ?>월</span>
      </div>
      <div class="col-auto">
        <span class="text-muted ms-3">기본 원비</span>
        <span class="ms-2"><?= number_format((int)$tuition['base_fee']) ?>원</span>
      </div>
    </div>
  </div>

  <form method="POST"
    action="<?= BASE_PATH ?>/admin/tuition/<?= (int)$tuition['id'] ?>/edit"
    style="max-width:420px;">
    <?= Auth::csrfField() ?>

    <div class="mb-3">
      <label class="form-label fw-medium">실납부금액 (원)</label>
      <input type="text" name="actual_fee" class="form-control fee-input" inputmode="numeric"
        value="<?= number_format((int)$tuition['actual_fee']) ?>">
    </div>

    <div class="mb-3">
      <label class="form-label fw-medium">납부 상태</label>
      <div class="d-flex gap-3">
        <?php foreach ([0 => '미납', 1 => '납부완료', 2 => '유예'] as $val => $label): ?>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="status"
            id="status-<?= $val ?>" value="<?= $val ?>"
            <?= (int)$tuition['status'] === $val ? 'checked' : '' ?>>
          <label class="form-check-label" for="status-<?= $val ?>"><?= $label ?></label>
        </div>
        <?php endforeach; ?>
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label fw-medium">납부일</label>
      <input type="date" name="paid_at" class="form-control"
        value="<?= e($tuition['paid_at'] ?? '') ?>">
    </div>

    <div class="mb-4">
      <label class="form-label fw-medium">메모</label>
      <input type="text" name="memo" class="form-control" maxlength="200"
        placeholder="예: 카드 납부, 할인 적용 등"
        value="<?= e($tuition['memo'] ?? '') ?>">
    </div>

    <div class="d-flex justify-content-end gap-2">
      <a href="<?= BASE_PATH ?>/admin/tuition?year=<?= (int)$tuition['year'] ?>&month=<?= (int)$tuition['month'] ?>"
        class="btn btn-outline-secondary">취소</a>
      <button type="submit" class="btn btn-dark">저장</button>
    </div>
  </form>
</div>

<script>
document.querySelector('.fee-input').addEventListener('input', function () {
  var raw = this.value.replace(/[^0-9]/g, '');
  this.value = raw ? Number(raw).toLocaleString() : '';
});

// 납부완료 선택 시 오늘 날짜 자동 입력
document.querySelectorAll('input[name="status"]').forEach(function (radio) {
  radio.addEventListener('change', function () {
    var paidAt = document.querySelector('input[name="paid_at"]');
    if (this.value === '1' && !paidAt.value) {
      paidAt.value = new Date().toISOString().slice(0, 10);
    }
  });
});
</script>
