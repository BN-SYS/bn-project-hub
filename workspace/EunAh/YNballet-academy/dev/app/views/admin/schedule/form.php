<!-- SCREEN: 일정 등록/수정 | PATH: /admin/schedule/write OR /admin/schedule/:id/edit -->

<style>
.color-swatches { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
.color-swatch {
  width: 28px; height: 28px; border-radius: 50%; cursor: pointer;
  border: 2px solid transparent; transition: transform .1s;
}
.color-swatch:hover, .color-swatch.selected { transform: scale(1.2); border-color: #333; }
</style>

<div class="p-4">
  <div class="d-flex align-items-center gap-3 mb-4">
    <a href="<?= BASE_PATH ?>/admin/schedule" class="text-muted text-decoration-none">수업 일정</a>
    <span class="text-muted">/</span>
    <h1 class="h4 fw-bold mb-0"><?= $schedule ? '수정' : '등록' ?></h1>
  </div>

  <?php if (!empty($error)): ?>
  <div class="alert alert-danger small"><?= e($error) ?></div>
  <?php endif; ?>

  <form method="POST"
    action="<?= $schedule
      ? BASE_PATH . '/admin/schedule/' . (int)$schedule['id'] . '/edit'
      : BASE_PATH . '/admin/schedule/write' ?>">
    <?= Auth::csrfField() ?>

    <div class="mb-3" style="max-width:220px;">
      <label for="event_date" class="form-label fw-medium">날짜 <span class="text-danger">*</span></label>
      <input type="date" class="form-control" id="event_date" name="event_date" required
        value="<?= e($schedule['event_date'] ?? date('Y-m-d')) ?>">
    </div>

    <div class="mb-3" style="max-width:420px;">
      <label for="title" class="form-label fw-medium">일정명 <span class="text-danger">*</span></label>
      <input type="text" class="form-control" id="title" name="title" required maxlength="50"
        placeholder="예: 레슨 OPEN, 휴강, 공연"
        value="<?= e($schedule['title'] ?? '') ?>">
    </div>

    <div class="mb-3">
      <div class="form-check">
        <input class="form-check-input" type="checkbox" name="is_holiday" id="is_holiday" value="1"
          <?= !empty($schedule['is_holiday']) ? 'checked' : '' ?>>
        <label class="form-check-label fw-medium" for="is_holiday">
          공휴일
          <small class="text-muted fw-normal ms-1">체크 시 달력에서 날짜 숫자가 빨간색으로 표시됩니다.</small>
        </label>
      </div>
    </div>

    <div class="mb-4">
      <label class="form-label fw-medium">색상 <small class="text-muted fw-normal">(일정명 텍스트 색상)</small></label>
      <div class="color-swatches" id="color-swatches">
        <?php
        $presets = [
          '#2c3d50' => '네이비',
          '#e74c3c' => '레드',
          '#e8915b' => '코랄',
          '#27ae60' => '그린',
          '#2c7be5' => '블루',
          '#8e44ad' => '퍼플',
          '#d4a843' => '골드',
          '#95a5a6' => '그레이',
        ];
        $currentColor = $schedule['color'] ?? '#e8915b';
        foreach ($presets as $hex => $label):
        ?>
        <span class="color-swatch<?= $currentColor === $hex ? ' selected' : '' ?>"
          style="background:<?= $hex ?>;"
          data-color="<?= $hex ?>" title="<?= $label ?>"></span>
        <?php endforeach; ?>
      </div>
      <div class="d-flex align-items-center gap-2" style="max-width:240px;">
        <label for="color-hex" class="form-label fw-medium mb-0 small text-muted text-nowrap">직접 입력</label>
        <input type="text" class="form-control form-control-sm" id="color-hex" maxlength="7"
          placeholder="#2c3d50" value="<?= e($currentColor) ?>">
        <input type="hidden" name="color" id="color-hidden" value="<?= e($currentColor) ?>">
        <span id="color-preview" style="width:28px;height:28px;border-radius:50%;background:<?= e($currentColor) ?>;border:1px solid #ccc;flex-shrink:0;"></span>
      </div>
    </div>

    <div class="d-flex justify-content-end gap-2">
      <a href="<?= BASE_PATH ?>/admin/schedule" class="btn btn-outline-secondary">취소</a>
      <button type="submit" class="btn btn-dark">저장</button>
    </div>
  </form>
</div>

<script>
(function () {
  const swatches = document.querySelectorAll('.color-swatch');
  const hexInput = document.getElementById('color-hex');
  const hidden   = document.getElementById('color-hidden');
  const preview  = document.getElementById('color-preview');

  function setColor(hex) {
    hidden.value   = hex;
    hexInput.value = hex;
    preview.style.background = hex;
    swatches.forEach(function (s) {
      s.classList.toggle('selected', s.dataset.color === hex);
    });
  }

  swatches.forEach(function (s) {
    s.addEventListener('click', function () { setColor(s.dataset.color); });
  });

  hexInput.addEventListener('input', function () {
    const val = hexInput.value.trim();
    if (/^#[0-9a-fA-F]{6}$/.test(val)) setColor(val);
  });
})();
</script>
