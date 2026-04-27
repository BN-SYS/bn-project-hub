<!-- SCREEN: 배너 관리 | PATH: /admin/banner -->

<div class="p-4">
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="h4 fw-bold mb-0">배너 관리</h1>
    <div class="d-flex gap-2">
      <a href="<?= BASE_PATH ?>/admin/banner/sort" class="btn btn-outline-secondary btn-sm">⠿ 순서 정렬</a>
      <a href="<?= BASE_PATH ?>/admin/banner/write" class="btn btn-dark btn-sm">+ 배너 추가</a>
    </div>
  </div>

  <p class="text-muted small mb-3">활성화된 배너가 2개 이상이면 메인 화면에서 자동으로 슬라이드됩니다.</p>

  <?php if (empty($banners)): ?>
  <p class="text-muted">등록된 배너가 없습니다.</p>
  <?php else: ?>
  <div class="table-responsive">
    <table class="table align-middle">
      <thead class="table-light">
        <tr>
          <th style="width:56px;">순서</th>
          <th style="width:100px;">미리보기</th>
          <th>제목 / 부제목</th>
          <th class="text-center" style="width:100px;">상태</th>
          <th style="width:80px;">관리</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($banners as $b): ?>
        <tr>
          <td class="text-muted small text-center"><?= (int)$b['sort_order'] ?></td>
          <td>
            <?php if ($b['image']): ?>
            <img src="<?= e($b['image']) ?>" alt="" style="width:80px; height:48px; object-fit:cover; border-radius:4px; border:1px solid #eee;">
            <?php else: ?>
            <div style="width:80px; height:48px; background:#f0f0f0; border-radius:4px; display:flex; align-items:center; justify-content:center;">
              <span class="text-muted small">없음</span>
            </div>
            <?php endif; ?>
          </td>
          <td>
            <div>
              <a href="<?= BASE_PATH ?>/admin/banner/<?= (int)$b['id'] ?>/edit" class="text-dark text-decoration-none fw-medium">
                <?= $b['title'] ? e($b['title']) : '<span class="text-muted">(제목 없음)</span>' ?>
              </a>
              <?php if ($b['subtitle']): ?>
              <p class="text-muted small mb-0 mt-1"><?= e(mb_strimwidth($b['subtitle'], 0, 40, '…')) ?></p>
              <?php endif; ?>
            </div>
          </td>
          <td class="text-center">
            <button class="btn btn-sm toggle-btn <?= $b['is_active'] ? 'btn-success' : 'btn-outline-secondary' ?>"
              data-id="<?= (int)$b['id'] ?>"
              data-url="<?= BASE_PATH ?>/admin/banner/<?= (int)$b['id'] ?>/toggle"
              data-token="<?= e(Auth::csrfToken()) ?>">
              <?= $b['is_active'] ? '활성' : '비활성' ?>
            </button>
          </td>
          <td>
            <div class="d-flex gap-2">
              <a href="<?= BASE_PATH ?>/admin/banner/<?= (int)$b['id'] ?>/edit" class="btn btn-outline-secondary btn-sm">수정</a>
              <button class="btn btn-outline-danger btn-sm delete-btn"
                data-id="<?= (int)$b['id'] ?>"
                data-url="<?= BASE_PATH ?>/admin/banner/<?= (int)$b['id'] ?>/delete"
                data-token="<?= e(Auth::csrfToken()) ?>">삭제</button>
            </div>
          </td>
        </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
  <?php endif; ?>
</div>

<script>
// 삭제 — admin.js 전역 핸들러가 없으므로 별도 처리
document.querySelectorAll('.delete-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    if (!confirm('이 배너를 삭제하시겠습니까?')) return;
    btn.disabled = true;
    fetch(btn.dataset.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: '_token=' + encodeURIComponent(btn.dataset.token),
    })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d.ok) btn.closest('tr').remove();
        else { alert('삭제 실패'); btn.disabled = false; }
      })
      .catch(function () { alert('요청 오류'); btn.disabled = false; });
  });
});
</script>
