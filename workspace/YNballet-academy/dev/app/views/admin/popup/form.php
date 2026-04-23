<!-- SCREEN: 팝업 등록/수정 | PATH: /admin/popup/write OR /admin/popup/:id/edit -->
<?php
$isEdit  = !empty($popup['id']);
$formUrl = $isEdit
    ? BASE_PATH . '/admin/popup/' . (int)$popup['id'] . '/edit'
    : BASE_PATH . '/admin/popup/write';
?>

<link href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css" rel="stylesheet">
<link rel="stylesheet" href="<?= BASE_PATH ?>/assets/libs/qeditor/qeditor.css">

<div class="p-4">
  <div class="d-flex align-items-center gap-3 mb-4">
    <a href="<?= BASE_PATH ?>/admin/popup" class="text-muted text-decoration-none">팝업 관리</a>
    <span class="text-muted">/</span>
    <h1 class="h4 fw-bold mb-0"><?= $isEdit ? '팝업 수정' : '팝업 등록' ?></h1>
  </div>

  <?php if (!empty($error)): ?>
  <div class="alert alert-danger small"><?= e($error) ?></div>
  <?php endif; ?>

  <form method="POST" action="<?= $formUrl ?>" id="popup-form">
    <?= Auth::csrfField() ?>
    <input type="hidden" name="content" id="content-hidden" value="<?= e($popup['content'] ?? '') ?>">

    <!-- ① 기본 설정 -->
    <div class="admin-card mb-4">
      <div class="admin-card-title">기본 설정</div>
      <div class="row g-3 align-items-center">
        <div class="col-sm-8">
          <label class="form-label">팝업 제목 <span class="text-danger">*</span>
            <small class="fw-normal text-muted">(관리용, 사용자에게 비공개)</small>
          </label>
          <input type="text" class="form-control" name="title" required maxlength="100"
            placeholder="예: 봄학기 모집 팝업"
            value="<?= e($popup['title'] ?? '') ?>">
        </div>
        <div class="col-sm-4 d-flex align-items-end pb-1">
          <div class="form-check form-switch ms-2 mt-4">
            <input class="form-check-input" type="checkbox" id="is_active" name="is_active" value="1"
              <?= ($popup['is_active'] ?? 1) ? 'checked' : '' ?>>
            <label class="form-check-label fw-medium" for="is_active">팝업 사용</label>
          </div>
        </div>
      </div>
    </div>

    <!-- ② 노출 기간 -->
    <div class="admin-card mb-4">
      <div class="admin-card-title">노출 기간</div>
      <div class="row g-3">
        <div class="col-sm-4">
          <label class="form-label">시작일 <span class="text-danger">*</span></label>
          <input type="date" class="form-control" name="display_start" required
            value="<?= e($popup['display_start'] ?? date('Y-m-d')) ?>">
        </div>
        <div class="col-sm-4">
          <label class="form-label">종료일 <span class="text-danger">*</span></label>
          <input type="date" class="form-control" name="display_end" required
            value="<?= e($popup['display_end'] ?? date('Y-m-d', strtotime('+7 days'))) ?>">
        </div>
        <div class="col-sm-4 d-flex align-items-end">
          <p class="text-muted small mb-2">기간 내에서 사용 여부로 즉시 제어할 수 있습니다.</p>
        </div>
      </div>
    </div>

    <!-- ③ 팝업 내용 (에디터) -->
    <div class="admin-card mb-4">
      <div class="admin-card-title">팝업 내용 <span class="text-danger">*</span></div>
      <div id="qeditor-popup"></div>
    </div>

    <!-- ④ 위치 & 크기 (데스크탑 기준) -->
    <div class="admin-card mb-4">
      <div class="admin-card-title">위치 &amp; 크기
        <small class="fw-normal text-muted ms-2">데스크탑 기준 — 모바일은 화면 중앙 자동 배치</small>
      </div>
      <div class="row g-3">
        <div class="col-6 col-sm-3">
          <label class="form-label">가로 위치 (px)
            <span class="text-muted small fw-normal">좌측 기준</span>
          </label>
          <input type="number" class="form-control" name="pos_left" min="0" max="3000"
            value="<?= (int)($popup['pos_left'] ?? 100) ?>">
        </div>
        <div class="col-6 col-sm-3">
          <label class="form-label">세로 위치 (px)
            <span class="text-muted small fw-normal">상단 기준</span>
          </label>
          <input type="number" class="form-control" name="pos_top" min="0" max="3000"
            value="<?= (int)($popup['pos_top'] ?? 100) ?>">
        </div>
        <div class="col-6 col-sm-3">
          <label class="form-label">너비 (px)</label>
          <input type="number" class="form-control" name="width" min="200" max="1200"
            value="<?= (int)($popup['width'] ?? 400) ?>">
        </div>
        <div class="col-6 col-sm-3">
          <label class="form-label">높이 (px)</label>
          <input type="number" class="form-control" name="height" min="100" max="900"
            value="<?= (int)($popup['height'] ?? 300) ?>">
        </div>
      </div>
      <!-- 미리보기 힌트 -->
      <div class="mt-3 p-3 rounded" style="background:#f8f9fa;border:1px dashed #dee2e6;">
        <p class="small text-muted mb-1">📐 예시: 가로 100px / 세로 100px / 너비 400px / 높이 300px</p>
        <p class="small text-muted mb-0">→ 화면 왼쪽에서 100px, 위에서 100px 위치에 400×300 크기로 표시됩니다.</p>
      </div>
    </div>

    <!-- ⑤ 정렬 순서 -->
    <div class="admin-card mb-4 ms-auto" style="max-width:380px;">
      <div class="admin-card-title">정렬 순서</div>
      <div class="d-flex align-items-center gap-3">
        <input type="number" class="form-control" name="sort_order" min="0" max="999"
          style="max-width:120px;"
          value="<?= (int)($popup['sort_order'] ?? 0) ?>">
        <span class="text-muted small text-nowrap">숫자가 작을수록 앞에 표시됩니다.</span>
      </div>
    </div>

    <div class="d-flex gap-2 mt-2">
      <?php if ($isEdit): ?>
      <button type="button" class="btn btn-outline-danger del-popup-btn"
        data-url="<?= BASE_PATH ?>/admin/popup/<?= (int)$popup['id'] ?>/delete"
        data-token="<?= e(Auth::csrfToken()) ?>">
        삭제
      </button>
      <?php endif; ?>
      <div class="ms-auto d-flex gap-2">
        <a href="<?= BASE_PATH ?>/admin/popup" class="btn btn-outline-secondary">취소</a>
        <button type="submit" class="btn btn-dark px-4">저장</button>
      </div>
    </div>
  </form>
</div>

<script src="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js"></script>
<script src="<?= BASE_PATH ?>/assets/libs/qeditor/qeditor.js"></script>
<script>
QEditor.init('qeditor-popup', {
  uploadUrl: '<?= BASE_PATH ?>/admin/upload-image',
  mockUpload: false,
  minHeight: '320px'
});

<?php if (!empty($popup['content'])): ?>
QEditor.setValue('qeditor-popup', <?= json_encode($popup['content'], JSON_UNESCAPED_UNICODE) ?>);
<?php endif; ?>

document.getElementById('popup-form').addEventListener('submit', function(e) {
  const val = QEditor.getValue('qeditor-popup');
  if (QEditor.isEmpty('qeditor-popup')) {
    e.preventDefault();
    alert('팝업 내용을 입력해 주세요.');
    return;
  }
  document.getElementById('content-hidden').value = val;
});

<?php if ($isEdit): ?>
document.querySelector('.del-popup-btn')?.addEventListener('click', async function() {
  if (!confirm('이 팝업을 삭제하시겠습니까?')) return;
  const res = await fetch(this.dataset.url, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: '_token=' + encodeURIComponent(this.dataset.token)
  }).then(r => r.json()).catch(() => null);
  if (res?.ok) location.href = '<?= BASE_PATH ?>/admin/popup';
  else alert('삭제 중 오류가 발생했습니다.');
});
<?php endif; ?>
</script>
