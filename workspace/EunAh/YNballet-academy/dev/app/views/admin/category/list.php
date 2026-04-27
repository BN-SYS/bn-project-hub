<!-- SCREEN: 카테고리 관리 | PATH: /admin/category -->

<div class="p-4">
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="h4 fw-bold mb-0">카테고리 관리</h1>
    <a href="<?= BASE_PATH ?>/admin/category/write" class="btn btn-dark btn-sm">+ 카테고리 추가</a>
  </div>

  <?php if (empty($categories)): ?>
  <p class="text-muted">등록된 카테고리가 없습니다.</p>
  <?php else: ?>
  <div class="table-responsive">
    <table class="table align-middle">
      <thead class="table-light">
        <tr>
          <th class="text-center" style="width:56px;">No.</th>
          <th>카테고리명</th>
          <th class="text-center" style="width:110px;">사용 과정 수</th>
          <th class="text-center" style="width:90px;">정렬 순서</th>
          <th style="width:140px;">관리</th>
        </tr>
      </thead>
      <tbody>
        <?php $total = count($categories); ?>
        <?php foreach ($categories as $i => $cat): ?>
        <tr>
          <td class="text-center text-muted small"><?= $total - $i ?></td>
          <td class="col-title fw-medium"><?= e($cat['name']) ?></td>
          <td class="text-center small text-muted"><?= (int)$cat['course_count'] ?>개</td>
          <td class="text-center small text-muted"><?= (int)$cat['sort_order'] ?></td>
          <td>
            <div class="d-flex gap-2">
              <a href="<?= BASE_PATH ?>/admin/category/<?= (int)$cat['id'] ?>/edit"
                class="btn btn-outline-secondary btn-sm">수정</a>
              <button type="button" class="btn btn-outline-danger btn-sm del-btn"
                data-id="<?= (int)$cat['id'] ?>"
                data-name="<?= e($cat['name']) ?>"
                data-url="<?= BASE_PATH ?>/admin/category/<?= (int)$cat['id'] ?>/delete"
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
document.querySelectorAll('.del-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const name = btn.dataset.name;
    if (!confirm(`"${name}" 카테고리를 삭제하시겠습니까?`)) return;

    const res = await fetch(btn.dataset.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: '_token=' + encodeURIComponent(btn.dataset.token)
    }).then(r => r.json()).catch(() => null);

    if (!res) { alert('오류가 발생했습니다.'); return; }
    if (!res.ok) { alert(res.msg); return; }
    btn.closest('tr').remove();
  });
});
</script>
