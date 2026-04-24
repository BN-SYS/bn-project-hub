<!-- SCREEN: 회원 등록/수정 | PATH: /admin/member/write OR /admin/member/:id/edit -->

<div class="p-4">
  <div class="d-flex align-items-center gap-3 mb-4">
    <a href="<?= BASE_PATH ?>/admin/member" class="text-muted text-decoration-none">회원 관리</a>
    <span class="text-muted">/</span>
    <h1 class="h4 fw-bold mb-0"><?= $member ? '수정' : '등록' ?></h1>
  </div>

  <?php if (!empty($error)): ?>
  <div class="alert alert-danger small"><?= e($error) ?></div>
  <?php endif; ?>

  <form method="POST"
    action="<?= $member
      ? BASE_PATH . '/admin/member/' . (int)$member['id'] . '/edit'
      : BASE_PATH . '/admin/member/write' ?>"
    style="max-width:520px;">
    <?= Auth::csrfField() ?>

    <!-- 이름 -->
    <div class="mb-3">
      <label class="form-label fw-medium">이름 <span class="text-danger">*</span></label>
      <input type="text" name="name" class="form-control" maxlength="50" required
        value="<?= e($member['name'] ?? '') ?>">
    </div>

    <!-- 연락처 / 이메일 -->
    <div class="row g-3 mb-3">
      <div class="col">
        <label class="form-label fw-medium">연락처</label>
        <input type="text" name="phone" class="form-control" maxlength="20"
          placeholder="010-0000-0000"
          value="<?= e($member['phone'] ?? '') ?>">
      </div>
      <div class="col">
        <label class="form-label fw-medium">이메일</label>
        <input type="email" name="email" class="form-control" maxlength="100"
          value="<?= e($member['email'] ?? '') ?>">
      </div>
    </div>

    <!-- 생년월일 / 성별 -->
    <div class="row g-3 mb-3">
      <div class="col">
        <label class="form-label fw-medium">생년월일</label>
        <input type="date" name="birth_date" class="form-control"
          value="<?= e($member['birth_date'] ?? '') ?>">
      </div>
      <div class="col">
        <label class="form-label fw-medium">성별</label>
        <div class="d-flex gap-3 mt-1">
          <div class="form-check">
            <input class="form-check-input" type="radio" name="gender" id="gender-m" value="M"
              <?= ($member['gender'] ?? '') === 'M' ? 'checked' : '' ?>>
            <label class="form-check-label" for="gender-m">남</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="gender" id="gender-f" value="F"
              <?= ($member['gender'] ?? '') === 'F' ? 'checked' : '' ?>>
            <label class="form-check-label" for="gender-f">여</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="gender" id="gender-n" value=""
              <?= !in_array($member['gender'] ?? '', ['M', 'F'], true) ? 'checked' : '' ?>>
            <label class="form-check-label text-muted" for="gender-n">미입력</label>
          </div>
        </div>
      </div>
    </div>

    <!-- 클래스 / 등록일 -->
    <div class="row g-3 mb-3">
      <div class="col">
        <label class="form-label fw-medium">클래스</label>
        <select name="class_id" class="form-select">
          <option value="">— 미배정 —</option>
          <?php foreach ($classes as $c): ?>
          <option value="<?= (int)$c['id'] ?>"
            <?= (int)($member['class_id'] ?? 0) === (int)$c['id'] ? 'selected' : '' ?>>
            <?= e($c['name']) ?> (<?= number_format((int)$c['fee']) ?>원)
          </option>
          <?php endforeach; ?>
        </select>
      </div>
      <div class="col">
        <label class="form-label fw-medium">등록일</label>
        <input type="date" name="joined_at" class="form-control"
          value="<?= e($member['joined_at'] ?? '') ?>">
      </div>
    </div>

    <!-- 메모 -->
    <div class="mb-3">
      <label class="form-label fw-medium">메모</label>
      <textarea name="memo" class="form-control" rows="2"
        placeholder="관리자 메모 (내부용)"><?= e($member['memo'] ?? '') ?></textarea>
    </div>

    <!-- 활성 / 휴원일 -->
    <div class="mb-4 p-3 rounded" style="background:#f8f9fa;">
      <div class="form-check mb-2">
        <input class="form-check-input" type="checkbox" name="is_active" id="is_active" value="1"
          <?= ($member['is_active'] ?? 1) ? 'checked' : '' ?>>
        <label class="form-check-label fw-medium" for="is_active">활성 회원 (원비 자동 생성 대상)</label>
      </div>
      <div id="suspended-wrap" <?= ($member['is_active'] ?? 1) ? 'style="display:none;"' : '' ?>>
        <label class="form-label small fw-medium text-muted mb-1">휴원일</label>
        <input type="date" name="suspended_at" id="suspended_at" class="form-control form-control-sm"
          style="max-width:180px;"
          value="<?= e($member['suspended_at'] ?? '') ?>">
        <p class="text-muted small mt-1 mb-0">입력하지 않으면 오늘 날짜로 자동 저장됩니다.</p>
      </div>
    </div>

    <div class="d-flex justify-content-end gap-2">
      <a href="<?= BASE_PATH ?>/admin/member" class="btn btn-outline-secondary">취소</a>
      <button type="submit" class="btn btn-dark">저장</button>
    </div>
  </form>
</div>

<script>
(function () {
  var chk  = document.getElementById('is_active');
  var wrap = document.getElementById('suspended-wrap');
  var dateInput = document.getElementById('suspended_at');

  chk.addEventListener('change', function () {
    if (this.checked) {
      wrap.style.display = 'none';
      dateInput.value = '';
    } else {
      wrap.style.display = '';
      if (!dateInput.value) {
        dateInput.value = new Date().toISOString().slice(0, 10);
      }
    }
  });
})();
</script>
