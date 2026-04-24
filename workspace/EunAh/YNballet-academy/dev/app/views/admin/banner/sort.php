<!-- SCREEN: 배너 순서 정렬 | PATH: /admin/banner/sort -->

<div class="p-4">
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h1 class="h4 fw-bold mb-0">배너 순서 정렬</h1>
    <a href="<?= BASE_PATH ?>/admin/banner" class="btn btn-outline-secondary btn-sm">목록으로</a>
  </div>
  <p class="text-muted small mb-3">드래그하여 순서를 변경하고 저장 버튼을 누르세요.</p>

  <ul id="sort-list" class="list-group mb-4" style="max-width:560px;">
    <?php foreach ($banners as $b): ?>
    <li class="list-group-item d-flex align-items-center gap-3" data-id="<?= (int)$b['id'] ?>" style="cursor:grab;">
      <span class="text-muted fs-5" style="user-select:none;">⠿</span>
      <?php if ($b['image']): ?>
      <img src="<?= e($b['image']) ?>" style="width:56px; height:34px; object-fit:cover; border-radius:3px; flex-shrink:0;">
      <?php endif; ?>
      <span class="fw-medium flex-grow-1"><?= $b['title'] ? e($b['title']) : '<span class="text-muted">(제목 없음)</span>' ?></span>
      <?php if (!$b['is_active']): ?>
      <span class="badge bg-secondary">비활성</span>
      <?php endif; ?>
    </li>
    <?php endforeach; ?>
  </ul>

  <button id="save-sort" class="btn btn-dark">순서 저장</button>
  <span id="sort-msg" class="ms-2 small text-success" style="display:none;">저장되었습니다.</span>
</div>

<script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>
<script>
(function () {
  const list = document.getElementById('sort-list');
  Sortable.create(list, { animation: 150 });

  document.getElementById('save-sort').addEventListener('click', function () {
    const ids  = [...list.querySelectorAll('[data-id]')].map(el => el.dataset.id);
    const body = '_token=<?= e(Auth::csrfToken()) ?>&' + ids.map(id => 'ids[]=' + encodeURIComponent(id)).join('&');

    fetch('<?= BASE_PATH ?>/admin/banner/sort', {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    body,
    }).then(r => r.json()).then(d => {
      if (d.ok) {
        const msg = document.getElementById('sort-msg');
        msg.style.display = 'inline';
        setTimeout(() => { msg.style.display = 'none'; }, 2000);
      }
    });
  });
})();
</script>
