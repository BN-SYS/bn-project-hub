<!-- SCREEN: 팝업 관리 | PATH: /admin/popup -->

<div class="p-4">
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="h4 fw-bold mb-0">팝업 관리</h1>
    <div class="d-flex align-items-center gap-3">
      <div class="d-flex align-items-center gap-2">
        <label class="text-muted small mb-0 text-nowrap">페이지당</label>
        <select class="form-select form-select-sm" style="width:auto;"
          onchange="location.href='<?= BASE_PATH ?>/admin/popup?per_page='+this.value+'&page=1'">
          <?php foreach ($validPerPages as $n): ?>
          <option value="<?= $n ?>" <?= $perPage === $n ? 'selected' : '' ?>><?= $n ?>개</option>
          <?php endforeach; ?>
        </select>
      </div>
      <a href="<?= BASE_PATH ?>/admin/popup/write" class="btn btn-dark btn-sm">+ 팝업 등록</a>
    </div>
  </div>

  <?php if (empty($popups)): ?>
  <p class="text-muted">등록된 팝업이 없습니다.</p>
  <?php else: ?>
  <div class="table-responsive">
    <table class="table align-middle">
      <thead class="table-light">
        <tr>
          <th class="text-center" style="width:56px;">No.</th>
          <th>제목</th>
          <th class="text-center" style="width:100px;">노출 상태</th>
          <th style="width:220px;">노출 기간</th>
          <th class="text-center" style="width:90px;">사용</th>
          <th class="text-center" style="width:120px;">등록일</th>
          <th style="width:140px;">관리</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($popups as $i => $p):
          $today     = date('Y-m-d');
          $inRange   = $p['display_start'] <= $today && $today <= $p['display_end'];
          if (!$p['is_active']) {
            $badge = '<span class="badge bg-secondary">비활성</span>';
          } elseif ($p['display_start'] > $today) {
            $badge = '<span class="badge bg-info text-dark">예정</span>';
          } elseif ($today > $p['display_end']) {
            $badge = '<span class="badge bg-danger">종료</span>';
          } else {
            $badge = '<span class="badge bg-success">노출중</span>';
          }
        ?>
        <tr>
          <td class="text-center text-muted small"><?= $total - ($page - 1) * $perPage - $i ?></td>
          <td class="col-title fw-medium">
            <a href="<?= BASE_PATH ?>/admin/popup/<?= (int)$p['id'] ?>/edit" class="text-dark text-decoration-none">
              <?= e($p['title']) ?>
            </a>
          </td>
          <td class="text-center"><?= $badge ?></td>
          <td class="small text-muted">
            <?= e($p['display_start']) ?> ~ <?= e($p['display_end']) ?>
          </td>
          <td class="text-center">
            <button class="btn btn-sm toggle-btn <?= $p['is_active'] ? 'btn-success' : 'btn-outline-secondary' ?>"
              data-id="<?= (int)$p['id'] ?>"
              data-active="<?= (int)$p['is_active'] ?>"
              data-url="<?= BASE_PATH ?>/admin/popup/<?= (int)$p['id'] ?>/toggle"
              data-token="<?= e(Auth::csrfToken()) ?>">
              <?= $p['is_active'] ? '사용' : '미사용' ?>
            </button>
          </td>
          <td class="text-center small text-muted"><?= fmtDate($p['created_at']) ?></td>
          <td>
            <div class="d-flex gap-2">
              <a href="<?= BASE_PATH ?>/admin/popup/<?= (int)$p['id'] ?>/edit"
                class="btn btn-outline-secondary btn-sm">수정</a>
              <button type="button" class="btn btn-outline-danger btn-sm del-btn"
                data-id="<?= (int)$p['id'] ?>"
                data-url="<?= BASE_PATH ?>/admin/popup/<?= (int)$p['id'] ?>/delete"
                data-token="<?= e(Auth::csrfToken()) ?>">삭제</button>
            </div>
          </td>
        </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
  <?= pagination($total, $page, $perPage, BASE_PATH . '/admin/popup?per_page=' . $perPage) ?>
  <?php endif; ?>
</div>

<script>
document.querySelectorAll('.del-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    if (!confirm('이 팝업을 삭제하시겠습니까?')) return;
    const res = await fetch(btn.dataset.url, {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: '_token=' + encodeURIComponent(btn.dataset.token)
    }).then(r => r.json()).catch(() => null);
    if (!res?.ok) { alert('삭제 중 오류가 발생했습니다.'); return; }
    btn.closest('tr').remove();
  });
});
</script>
