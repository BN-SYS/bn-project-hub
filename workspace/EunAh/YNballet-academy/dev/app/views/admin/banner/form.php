<!-- SCREEN: 배너 등록/수정 | PATH: /admin/banner/write OR /admin/banner/:id/edit -->

<div class="p-4">
  <div class="d-flex align-items-center gap-3 mb-4">
    <a href="<?= BASE_PATH ?>/admin/banner" class="text-muted text-decoration-none">배너 관리</a>
    <span class="text-muted">/</span>
    <h1 class="h4 fw-bold mb-0"><?= $banner ? '수정' : '등록' ?></h1>
  </div>

  <?php if (!empty($error)): ?>
  <div class="alert alert-danger small"><?= e($error) ?></div>
  <?php endif; ?>

  <form method="POST"
    action="<?= $banner
      ? BASE_PATH . '/admin/banner/' . (int)$banner['id'] . '/edit'
      : BASE_PATH . '/admin/banner/write' ?>"
    style="max-width:640px;">
    <?= Auth::csrfField() ?>

    <!-- 이미지 업로드 -->
    <div class="mb-4">
      <label class="form-label fw-medium">배너 이미지</label>

      <!-- 미리보기 -->
      <div id="img-preview-wrap" style="margin-bottom:10px; <?= empty($banner['image']) ? 'display:none;' : '' ?>">
        <img id="img-preview" src="<?= e($banner['image'] ?? '') ?>"
          style="max-width:100%; max-height:240px; border-radius:6px; border:1px solid #ddd; display:block;">
      </div>

      <div class="d-flex gap-2 align-items-center">
        <label class="btn btn-outline-secondary btn-sm mb-0" style="cursor:pointer;">
          이미지 선택
          <input type="file" id="img-file" accept="image/*" style="display:none;">
        </label>
        <span id="upload-status" class="small text-muted"></span>
      </div>
      <input type="hidden" name="image" id="image-hidden" value="<?= e($banner['image'] ?? '') ?>">
      <p class="text-muted small mt-1">권장 크기: 1920×900px 이상 / JPG·PNG·WEBP</p>
    </div>

    <!-- 제목 -->
    <div class="mb-3">
      <label for="title" class="form-label fw-medium">제목</label>
      <textarea class="form-control" id="title" name="title" rows="2"
        placeholder="예: 몸이 기억하는&#10;아름다움"><?= e($banner['title'] ?? '') ?></textarea>
      <p class="text-muted small mt-1">줄바꿈 입력 시 화면에도 그대로 반영됩니다.</p>
    </div>

    <!-- 오버레이 -->
    <div class="mb-3">
      <label class="form-label fw-medium">이미지 오버레이</label>
      <div class="d-flex gap-4">
        <div class="form-check">
          <input class="form-check-input" type="radio" name="overlay" id="overlay-dark" value="dark"
            <?= ($banner['overlay'] ?? 'dark') === 'dark' ? 'checked' : '' ?>>
          <label class="form-check-label" for="overlay-dark">
            어둡게 <small class="text-muted">(남색 오버레이 — 기본)</small>
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="overlay" id="overlay-light" value="light"
            <?= ($banner['overlay'] ?? '') === 'light' ? 'checked' : '' ?>>
          <label class="form-check-label" for="overlay-light">
            살짝 어둡게 <small class="text-muted">(이미지 선명하게)</small>
          </label>
        </div>
      </div>
    </div>

    <!-- 부제목 -->
    <div class="mb-4">
      <label for="subtitle" class="form-label fw-medium">부제목</label>
      <input type="text" class="form-control" id="subtitle" name="subtitle" maxlength="100"
        placeholder="예: 발레의 우아함을 일상 속으로"
        value="<?= e($banner['subtitle'] ?? '') ?>">
    </div>

    <!-- 버튼 설정 -->
    <?php
    $btnStyles = [
        'outline' => '흰 테두리',
        'gold'    => '골드 채움',
        'white'   => '흰색 채움',
    ];
    foreach ([1, 2] as $n):
      $tKey = "btn{$n}_text"; $uKey = "btn{$n}_url"; $sKey = "btn{$n}_style";
    ?>
    <div class="mb-3 p-3" style="border:1px solid #e8e8e8; border-radius:6px;">
      <p class="fw-medium mb-2 small text-muted">버튼 <?= $n ?> <span class="text-muted fw-normal">(URL 미입력 시 미노출)</span></p>
      <div class="row g-2">
        <div class="col-auto">
          <input type="text" class="form-control form-control-sm" name="<?= $tKey ?>" maxlength="10"
            placeholder="버튼명 (최대 10자)"
            value="<?= e($banner[$tKey] ?? '') ?>" style="width:160px;">
        </div>
        <div class="col">
          <input type="url" class="form-control form-control-sm" name="<?= $uKey ?>"
            placeholder="https://..."
            value="<?= e($banner[$uKey] ?? '') ?>">
        </div>
      </div>
      <div class="d-flex gap-3 mt-2">
        <?php foreach ($btnStyles as $val => $label): ?>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio"
            name="<?= $sKey ?>" id="<?= $sKey ?>-<?= $val ?>" value="<?= $val ?>"
            <?= ($banner[$sKey] ?? ($n === 1 ? 'outline' : 'gold')) === $val ? 'checked' : '' ?>>
          <label class="form-check-label small" for="<?= $sKey ?>-<?= $val ?>"><?= $label ?></label>
        </div>
        <?php endforeach; ?>
      </div>
    </div>
    <?php endforeach; ?>

    <div class="d-flex justify-content-end gap-2">
      <a href="<?= BASE_PATH ?>/admin/banner" class="btn btn-outline-secondary">취소</a>
      <button type="submit" class="btn btn-dark">저장</button>
    </div>
  </form>
</div>

<script>
(function () {
  const fileInput   = document.getElementById('img-file');
  const hidden      = document.getElementById('image-hidden');
  const preview     = document.getElementById('img-preview');
  const previewWrap = document.getElementById('img-preview-wrap');
  const status      = document.getElementById('upload-status');

  fileInput.addEventListener('change', function () {
    const file = fileInput.files[0];
    if (!file) return;

    status.textContent = '업로드 중…';
    status.style.color = '#666';

    const fd = new FormData();
    fd.append('file', file);
    fd.append('_token', '<?= e(Auth::csrfToken()) ?>');

    fetch('<?= BASE_PATH ?>/admin/upload-image', { method: 'POST', body: fd })
      .then(r => r.json())
      .then(d => {
        if (d.url) {
          hidden.value          = d.url;
          preview.src           = d.url;
          previewWrap.style.display = '';
          status.textContent    = '업로드 완료';
          status.style.color    = '#27ae60';
        } else {
          status.textContent = d.error || '업로드 실패';
          status.style.color = '#e74c3c';
        }
      })
      .catch(() => {
        status.textContent = '오류가 발생했습니다.';
        status.style.color = '#e74c3c';
      });
  });
})();
</script>
