<!-- SCREEN: 과정 등록/수정 | PATH: /admin/course/write OR /admin/course/:id/edit -->

<div class="p-4">
  <div class="d-flex align-items-center gap-3 mb-4">
    <a href="<?= BASE_PATH ?>/admin/course" class="text-muted text-decoration-none">과정 관리</a>
    <span class="text-muted">/</span>
    <h1 class="h4 fw-bold mb-0"><?= $course ? '과정 수정' : '과정 등록' ?></h1>
  </div>

  <?php if (!empty($error)): ?>
  <div class="alert alert-danger small"><?= e($error) ?></div>
  <?php endif; ?>

  <!-- [FORM: course-form] POST /admin/course/write (create) OR /admin/course/:id/edit (update) -->
  <!-- Fields: title(text/100자/required), category, level_badge, target, description(500자), fee, sort_order(int) -->
  <form method="POST"
    action="<?= $course ? BASE_PATH . '/admin/course/' . (int)$course['id'] . '/edit' : BASE_PATH . '/admin/course/write' ?>">
    <?= Auth::csrfField() ?>

    <div class="row g-3 mb-3">
      <div class="col-sm-8">
        <label class="form-label fw-medium">과정명 <span class="text-danger">*</span></label>
        <input type="text" class="form-control" name="title" required maxlength="100"
          value="<?= e($course['title'] ?? '') ?>">
      </div>
      <div class="col-sm-4">
        <label class="form-label fw-medium">카테고리</label>
        <select class="form-select" name="category">
          <option value="">선택 안 함</option>
          <?php
          $currentCat  = $course['category'] ?? '';
          $catNames    = array_column($categories ?? [], 'name');
          foreach ($categories ?? [] as $cat):
          ?>
          <option value="<?= e($cat['name']) ?>" <?= $currentCat === $cat['name'] ? 'selected' : '' ?>>
            <?= e($cat['name']) ?>
          </option>
          <?php endforeach; ?>
          <?php if ($currentCat !== '' && !in_array($currentCat, $catNames, true)): ?>
          <option value="<?= e($currentCat) ?>" selected style="color:#999;">
            <?= e($currentCat) ?> (미등록)
          </option>
          <?php endif; ?>
        </select>
        <?php if (empty($categories)): ?>
        <div class="form-text text-warning">
          <a href="<?= BASE_PATH ?>/admin/category/write" target="_blank">카테고리를 먼저 등록해 주세요.</a>
        </div>
        <?php endif; ?>
      </div>
    </div>

    <div class="row g-3 mb-3">
      <div class="col-sm-4">
        <label class="form-label fw-medium">레벨 뱃지</label>
        <input type="text" class="form-control" name="level_badge" maxlength="20"
          placeholder="입문, 기초, 심화"
          value="<?= e($course['level_badge'] ?? '') ?>">
      </div>
      <div class="col-sm-4">
        <label class="form-label fw-medium">수강 대상</label>
        <input type="text" class="form-control" name="target" maxlength="100"
          value="<?= e($course['target'] ?? '') ?>">
      </div>
      <div class="col-sm-4">
        <label class="form-label fw-medium">수강료</label>
        <input type="text" class="form-control" name="fee" maxlength="50"
          placeholder="월 120,000원"
          value="<?= e($course['fee'] ?? '') ?>">
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label fw-medium">과정 설명</label>
      <textarea class="form-control" name="description" rows="4" maxlength="500"><?= e($course['description'] ?? '') ?></textarea>
    </div>

    <div class="mb-4" style="max-width:140px;">
      <label class="form-label fw-medium">정렬 순서</label>
      <input type="number" class="form-control" name="sort_order" min="0" max="999"
        value="<?= (int)($course['sort_order'] ?? 0) ?>">
    </div>

    <div class="d-flex justify-content-end gap-2">
      <a href="<?= BASE_PATH ?>/admin/course" class="btn btn-outline-secondary">취소</a>
      <button type="submit" class="btn btn-dark">저장</button>
    </div>
  </form>
</div>
