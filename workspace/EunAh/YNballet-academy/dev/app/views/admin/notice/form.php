<!-- SCREEN: 공지 작성/수정 | PATH: /admin/notice/write OR /admin/notice/:id/edit -->
<link href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css" rel="stylesheet">
<link rel="stylesheet" href="<?= BASE_PATH ?>/assets/libs/qeditor/qeditor.css">

<div class="p-4">
  <div class="d-flex align-items-center gap-3 mb-4">
    <a href="<?= BASE_PATH ?>/admin/notice" class="text-muted text-decoration-none">공지사항</a>
    <span class="text-muted">/</span>
    <h1 class="h4 fw-bold mb-0"><?= $notice ? '수정' : '작성' ?></h1>
  </div>

  <?php if (!empty($error)): ?>
  <div class="alert alert-danger small"><?= e($error) ?></div>
  <?php endif; ?>

  <!-- [FORM: notice-form] POST /admin/notice/write (create) OR /admin/notice/:id/edit (update) -->
  <!-- Fields: title(text/200자/required), content(html-qeditor/required), is_pinned(checkbox) -->
  <form id="notice-form" method="POST"
    action="<?= $notice ? BASE_PATH . '/admin/notice/' . (int)$notice['id'] . '/edit' : BASE_PATH . '/admin/notice/write' ?>">
    <?= Auth::csrfField() ?>

    <div class="mb-3">
      <label for="title" class="form-label fw-medium">제목 <span class="text-danger">*</span></label>
      <input type="text" class="form-control" id="title" name="title" required maxlength="200"
        value="<?= e($notice['title'] ?? '') ?>">
    </div>

    <div class="mb-4">
      <label class="form-label fw-medium">내용 <span class="text-danger">*</span></label>
      <!-- QEditor 마운트 포인트 -->
      <div id="qeditor"></div>
      <input type="hidden" name="content" id="content-hidden">
    </div>

    <div class="mb-4">
      <div class="form-check">
        <input class="form-check-input" type="checkbox" name="is_pinned" id="is_pinned" value="1"
          <?= !empty($notice['is_pinned']) ? 'checked' : '' ?>>
        <label class="form-check-label fw-medium" for="is_pinned">
          상단 고정
          <small class="text-muted fw-normal ms-1">체크 시 사용자 공지 목록 최상단 노출 + 공지 배지 표시</small>
        </label>
      </div>
    </div>

    <div class="d-flex justify-content-end gap-2">
      <a href="<?= BASE_PATH ?>/admin/notice" class="btn btn-outline-secondary">취소</a>
      <button type="submit" class="btn btn-dark">저장</button>
    </div>
  </form>
</div>

<script src="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js"></script>
<script src="<?= BASE_PATH ?>/assets/libs/qeditor/qeditor.js"></script>
<script>
(function () {
  QEditor.init('qeditor', {
    uploadUrl : '<?= BASE_PATH ?>/admin/upload-image',
    mockUpload: false,
    minHeight : '420px',
  });

  <?php if (!empty($notice['content'])): ?>
  QEditor.setValue('qeditor', <?= json_encode($notice['content']) ?>);
  <?php endif; ?>

  document.getElementById('notice-form').addEventListener('submit', function (e) {
    if (QEditor.isEmpty('qeditor')) {
      e.preventDefault();
      alert('내용을 입력해 주세요.');
      return;
    }
    document.getElementById('content-hidden').value = QEditor.getValue('qeditor');
  });
})();
</script>
