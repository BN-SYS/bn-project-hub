<!-- SCREEN: 수업 일정 관리 | PATH: /admin/schedule -->

<div class="p-4">
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h1 class="h4 fw-bold mb-0">수업 일정</h1>
    <div class="d-flex align-items-center gap-2">
      <a href="<?= BASE_PATH ?>/admin/schedule/preview<?= $filterYear && $filterMonth ? '?year='.$filterYear.'&month='.$filterMonth : '' ?>" class="btn btn-outline-dark btn-sm">↓ 카드 추출</a>
      <a href="<?= BASE_PATH ?>/admin/schedule/write" class="btn btn-dark btn-sm">+ 일정 추가</a>
    </div>
  </div>

  <!-- 월별 필터 -->
  <form class="d-flex align-items-center gap-2 mb-4" method="GET" action="<?= BASE_PATH ?>/admin/schedule">
    <select name="year" class="form-select form-select-sm" style="width:auto;">
      <?php for ($y = (int)date('Y') - 1; $y <= (int)date('Y') + 2; $y++): ?>
      <option value="<?= $y ?>" <?= $filterYear === $y ? 'selected' : '' ?>><?= $y ?>년</option>
      <?php endfor; ?>
    </select>
    <select name="month" class="form-select form-select-sm" style="width:auto;">
      <?php for ($m = 1; $m <= 12; $m++): ?>
      <option value="<?= $m ?>" <?= $filterMonth === $m ? 'selected' : '' ?>><?= $m ?>월</option>
      <?php endfor; ?>
    </select>
    <input type="hidden" name="per_page" value="<?= $perPage ?>">
    <button type="submit" class="btn btn-outline-secondary btn-sm">조회</button>
    <span class="text-muted small ms-2"><?= $filterYear ?>년 <?= $filterMonth ?>월 · <?= $total ?>건</span>
  </form>

  <?php if (empty($schedules)): ?>
  <p class="text-muted">등록된 일정이 없습니다.</p>
  <?php else: ?>
  <div class="table-responsive">
    <table class="table align-middle">
      <thead class="table-light">
        <tr>
          <th class="text-center" style="width:56px;">No.</th>
          <th style="width:130px;">날짜</th>
          <th>일정명</th>
          <th class="text-center" style="width:72px;">색상</th>
          <th class="text-center" style="width:72px;">공휴일</th>
          <th style="width:120px;"></th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($schedules as $i => $s): ?>
        <tr>
          <td class="text-center text-muted small"><?= $total - ($page - 1) * $perPage - $i ?></td>
          <td class="small"><?= e($s['event_date']) ?></td>
          <td>
            <a href="<?= BASE_PATH ?>/admin/schedule/<?= (int)$s['id'] ?>/edit" class="text-dark text-decoration-none">
              <?= e($s['title']) ?>
            </a>
          </td>
          <td class="text-center">
            <span style="display:inline-block;width:18px;height:18px;border-radius:50%;background:<?= e($s['color']) ?>;border:1px solid rgba(0,0,0,.1);" title="<?= e($s['color']) ?>"></span>
          </td>
          <td class="text-center">
            <?php if ($s['is_holiday']): ?>
            <span class="badge" style="background:#fee2e2;color:#c0392b;font-size:.72rem;">공휴일</span>
            <?php endif; ?>
          </td>
          <td class="d-flex gap-2">
            <a href="<?= BASE_PATH ?>/admin/schedule/<?= (int)$s['id'] ?>/edit" class="btn btn-outline-secondary btn-sm">수정</a>
            <button class="btn btn-outline-danger btn-sm delete-btn"
              data-id="<?= (int)$s['id'] ?>"
              data-title="<?= e($s['title']) ?>"
              data-url="<?= BASE_PATH ?>/admin/schedule/<?= (int)$s['id'] ?>/delete"
              data-token="<?= e(Auth::csrfToken()) ?>">삭제</button>
          </td>
        </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
  <?= pagination($total, $page, $perPage, BASE_PATH . '/admin/schedule?per_page=' . $perPage) ?>
  <?php endif; ?>
</div>

<script>
document.querySelectorAll('.delete-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    if (!confirm('"' + btn.dataset.title + '" 일정을 삭제하시겠습니까?')) return;
    fetch(btn.dataset.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: '_token=' + encodeURIComponent(btn.dataset.token),
    }).then(function (r) { return r.json(); }).then(function (d) {
      if (d.ok) btn.closest('tr').remove();
      else alert('삭제 실패');
    }).catch(function () { alert('오류가 발생했습니다.'); });
  });
});
</script>
