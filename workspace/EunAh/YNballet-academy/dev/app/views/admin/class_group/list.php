<!-- SCREEN: 클래스 관리 | PATH: /admin/class-group -->

<div class="p-4">
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="h4 fw-bold mb-0">클래스 관리</h1>
    <a href="<?= BASE_PATH ?>/admin/class-group/write" class="btn btn-dark btn-sm">+ 클래스 추가</a>
  </div>

  <p class="text-muted small mb-3">클래스별 월 원비를 설정합니다. 원비 관리에서 회원별 실납부금액을 조정할 수 있습니다.</p>

  <?php if (empty($classes)): ?>
  <p class="text-muted">등록된 클래스가 없습니다.</p>
  <?php else: ?>
  <div class="table-responsive">
    <table class="table align-middle">
      <thead class="table-light">
        <tr>
          <th>클래스명</th>
          <th>설명</th>
          <th class="text-end">월 원비</th>
          <th class="text-center">활성 회원수</th>
          <th class="text-center">상태</th>
          <th style="width:90px;">관리</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($classes as $c): ?>
        <tr>
          <td class="fw-medium"><?= e($c['name']) ?></td>
          <td class="small text-muted"><?= e($c['description'] ?: '—') ?></td>
          <td class="text-end fw-medium"><?= number_format((int)$c['fee']) ?>원</td>
          <td class="text-center"><?= (int)$c['member_count'] ?>명</td>
          <td class="text-center">
            <?php if ($c['is_active']): ?>
            <span class="badge bg-success bg-opacity-75">활성</span>
            <?php else: ?>
            <span class="badge bg-secondary bg-opacity-50">비활성</span>
            <?php endif; ?>
          </td>
          <td>
            <div class="d-flex gap-1 justify-content-end">
              <a href="<?= BASE_PATH ?>/admin/class-group/<?= (int)$c['id'] ?>/edit" class="btn btn-outline-secondary btn-sm">수정</a>
              <button class="btn btn-outline-danger btn-sm del-btn"
                data-url="<?= BASE_PATH ?>/admin/class-group/<?= (int)$c['id'] ?>/delete"
                data-token="<?= e(Auth::csrfToken()) ?>"
                data-count="<?= (int)$c['member_count'] ?>">삭제</button>
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
document.querySelectorAll('.del-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var count = parseInt(btn.dataset.count);
    var msg = '이 클래스를 삭제하시겠습니까?';
    if (count > 0) msg += '\n\n소속 회원 ' + count + '명의 클래스 정보가 초기화됩니다.';
    if (!confirm(msg)) return;
    btn.disabled = true;
    fetch(btn.dataset.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: '_token=' + encodeURIComponent(btn.dataset.token),
    }).then(r => r.json()).then(d => {
      if (d.ok) btn.closest('tr').remove();
      else { alert('삭제 실패'); btn.disabled = false; }
    }).catch(() => { alert('오류'); btn.disabled = false; });
  });
});
</script>
