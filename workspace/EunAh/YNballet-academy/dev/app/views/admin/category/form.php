<!-- SCREEN: 카테고리 등록/수정 | PATH: /admin/category/write OR /admin/category/:id/edit -->

<div class="p-4">
  <div class="d-flex align-items-center gap-3 mb-4">
    <a href="<?= BASE_PATH ?>/admin/category" class="text-muted text-decoration-none">카테고리 관리</a>
    <span class="text-muted">/</span>
    <h1 class="h4 fw-bold mb-0"><?= $category ? '카테고리 수정' : '카테고리 등록' ?></h1>
  </div>

  <?php if (!empty($error)): ?>
  <div class="alert alert-danger small"><?= e($error) ?></div>
  <?php endif; ?>

  <div class="admin-form-wrap" style="max-width:480px;">
    <!-- [FORM: category-form] POST /admin/category/write OR /admin/category/:id/edit -->
    <form method="POST"
      action="<?= $category ? BASE_PATH . '/admin/category/' . (int)$category['id'] . '/edit' : BASE_PATH . '/admin/category/write' ?>">
      <?= Auth::csrfField() ?>

      <div class="mb-3">
        <label class="form-label">카테고리명 <span class="text-danger">*</span></label>
        <input type="text" class="form-control" name="name" required maxlength="50"
          placeholder="예: 성인반, 주니어반"
          value="<?= e($category['name'] ?? '') ?>">
        <?php if ($category): ?>
        <div class="form-text">이름을 변경하면 해당 카테고리를 사용 중인 과정에도 자동 반영됩니다.</div>
        <?php endif; ?>
      </div>

      <div class="mb-4" style="max-width:160px;">
        <label class="form-label">정렬 순서</label>
        <input type="number" class="form-control" name="sort_order" min="0" max="999"
          value="<?= (int)($category['sort_order'] ?? 0) ?>">
        <div class="form-text">숫자가 작을수록 앞에 표시됩니다.</div>
      </div>

      <div class="d-flex justify-content-end gap-2">
        <a href="<?= BASE_PATH ?>/admin/category" class="btn btn-outline-secondary">취소</a>
        <button type="submit" class="btn btn-dark">저장</button>
      </div>
    </form>
  </div>
</div>
