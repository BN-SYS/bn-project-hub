<!-- SCREEN: 회원 관리 | PATH: /admin/member -->
<?php
$qs = ($search ? '&search=' . urlencode($search) : '') . ($classId !== null ? '&class_id=' . $classId : '');
$baseUrl = BASE_PATH . '/admin/member?per_page=' . $perPage . $qs;
?>

<div class="p-4">
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h1 class="h4 fw-bold mb-0">회원 관리</h1>
    <a href="<?= BASE_PATH ?>/admin/member/write" class="btn btn-dark btn-sm">+ 회원 등록</a>
  </div>

  <!-- 검색/필터 -->
  <form method="GET" action="<?= BASE_PATH ?>/admin/member" class="row g-2 align-items-center mb-4">
    <input type="hidden" name="per_page" value="<?= $perPage ?>">
    <div class="col-auto">
      <input type="text" name="search" class="form-control form-control-sm"
        placeholder="이름 또는 연락처" value="<?= e($search) ?>" style="width:180px;">
    </div>
    <div class="col-auto">
      <select name="class_id" class="form-select form-select-sm" style="width:auto;">
        <option value="">전체 클래스</option>
        <?php foreach ($classes as $c): ?>
        <option value="<?= (int)$c['id'] ?>" <?= $classId === (int)$c['id'] ? 'selected' : '' ?>><?= e($c['name']) ?></option>
        <?php endforeach; ?>
      </select>
    </div>
    <div class="col-auto">
      <button type="submit" class="btn btn-outline-secondary btn-sm">검색</button>
      <a href="<?= BASE_PATH ?>/admin/member" class="btn btn-link btn-sm text-muted p-0 ms-1">초기화</a>
    </div>
    <div class="col-auto ms-auto d-flex align-items-center gap-2">
      <span class="text-muted small">페이지당</span>
      <select class="form-select form-select-sm" style="width:auto;"
        onchange="location.href='<?= BASE_PATH ?>/admin/member?per_page='+this.value+'&page=1<?= rawurlencode($qs) ?>'">
        <?php foreach ($validPerPages as $n): ?>
        <option value="<?= $n ?>" <?= $perPage === $n ? 'selected' : '' ?>><?= $n ?>개</option>
        <?php endforeach; ?>
      </select>
    </div>
  </form>

  <?php if (empty($items)): ?>
  <p class="text-muted">조건에 맞는 회원이 없습니다.</p>
  <?php else: ?>
  <div class="table-responsive">
    <table class="table align-middle table-hover">
      <thead class="table-light">
        <tr>
          <th>이름</th>
          <th class="text-center">성별</th>
          <th>연락처</th>
          <th>클래스</th>
          <th class="text-end">월 원비</th>
          <th class="text-center">상태</th>
          <th class="text-center">등록일</th>
          <th style="width:90px;"></th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($items as $item): ?>
        <tr>
          <td class="fw-medium">
            <?= e($item['name']) ?>
            <?php if (!$item['is_active'] && $item['suspended_at']): ?>
            <div class="text-muted" style="font-size:.72rem;">휴원 <?= fmtDate($item['suspended_at']) ?></div>
            <?php endif; ?>
          </td>
          <td class="text-center small text-muted">
            <?= $item['gender'] === 'M' ? '남' : ($item['gender'] === 'F' ? '여' : '—') ?>
          </td>
          <td class="small text-muted"><?= e($item['phone'] ?: '—') ?></td>
          <td class="small"><?= $item['class_name'] ? e($item['class_name']) : '<span class="text-muted">—</span>' ?></td>
          <td class="text-end small"><?= $item['class_fee'] ? number_format((int)$item['class_fee']) . '원' : '<span class="text-muted">—</span>' ?></td>
          <td class="text-center">
            <?php if ($item['is_active']): ?>
            <span class="badge bg-success bg-opacity-75 small">활성</span>
            <?php else: ?>
            <span class="badge bg-secondary bg-opacity-50 small">비활성</span>
            <?php endif; ?>
          </td>
          <td class="text-center small text-muted"><?= $item['joined_at'] ? fmtDate($item['joined_at']) : '—' ?></td>
          <td>
            <div class="d-flex gap-1 justify-content-end">
              <a href="<?= BASE_PATH ?>/admin/member/<?= (int)$item['id'] ?>/edit" class="btn btn-outline-secondary btn-sm">수정</a>
              <button class="btn btn-outline-danger btn-sm del-btn"
                data-url="<?= BASE_PATH ?>/admin/member/<?= (int)$item['id'] ?>/delete"
                data-token="<?= e(Auth::csrfToken()) ?>">삭제</button>
            </div>
          </td>
        </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
  <?= pagination($total, $page, $perPage, $baseUrl) ?>
  <?php endif; ?>
</div>

<script>
document.querySelectorAll('.del-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    if (!confirm('이 회원을 삭제하시겠습니까?\n삭제 시 원비 납부 기록도 함께 삭제됩니다.')) return;
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
