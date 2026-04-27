<!-- SCREEN: 원비 관리 | PATH: /admin/tuition -->
<?php
$prevMonth = $month === 1 ? ['y' => $year - 1, 'm' => 12] : ['y' => $year, 'm' => $month - 1];
$nextMonth = $month === 12 ? ['y' => $year + 1, 'm' => 1]  : ['y' => $year, 'm' => $month + 1];
$monthUrl  = fn($y, $m) => BASE_PATH . '/admin/tuition?year=' . $y . '&month=' . $m;

$statusLabels = [0 => '미납', 1 => '납부완료', 2 => '유예'];
$statusBadge  = [
    0 => '<span class="badge bg-danger bg-opacity-75">미납</span>',
    1 => '<span class="badge bg-success bg-opacity-75">납부완료</span>',
    2 => '<span class="badge bg-warning text-dark bg-opacity-75">유예</span>',
];
?>

<div class="p-4">
  <!-- 헤더 -->
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="h4 fw-bold mb-0">원비 관리</h1>
    <div class="d-flex gap-2">
      <a href="<?= BASE_PATH ?>/admin/tuition/export?year=<?= $year ?>&month=<?= $month ?>"
         class="btn btn-outline-secondary btn-sm">↓ 엑셀 저장</a>
      <a href="<?= BASE_PATH ?>/admin/tuition/stats" class="btn btn-outline-secondary btn-sm">매출 통계</a>
    </div>
  </div>

  <!-- 월 네비게이션 -->
  <div class="d-flex align-items-center gap-2 mb-4 flex-wrap">
    <a href="<?= $monthUrl($prevMonth['y'], $prevMonth['m']) ?>" class="btn btn-outline-secondary btn-sm text-nowrap">← 이전달</a>
    <h2 class="h5 fw-bold mb-0 text-nowrap"><?= $year ?>년 <?= $month ?>월</h2>
    <a href="<?= $monthUrl($nextMonth['y'], $nextMonth['m']) ?>" class="btn btn-outline-secondary btn-sm text-nowrap">다음달 →</a>
    <form method="GET" action="<?= BASE_PATH ?>/admin/tuition" class="d-flex gap-2">
      <select name="year" class="form-select form-select-sm" style="width:90px;">
        <?php for ($y = (int)date('Y') + 1; $y >= 2020; $y--): ?>
        <option value="<?= $y ?>" <?= $year === $y ? 'selected' : '' ?>><?= $y ?>년</option>
        <?php endfor; ?>
      </select>
      <select name="month" class="form-select form-select-sm" style="width:80px;">
        <?php for ($m = 1; $m <= 12; $m++): ?>
        <option value="<?= $m ?>" <?= $month === $m ? 'selected' : '' ?>><?= $m ?>월</option>
        <?php endfor; ?>
      </select>
      <button type="submit" class="btn btn-outline-secondary btn-sm">이동</button>
    </form>
  </div>

  <!-- 요약 카드 -->
  <?php if (!empty($summary) && (int)$summary['total'] > 0): ?>
  <div class="row g-3 mb-4">
    <div class="col-6 col-md-3">
      <div class="border rounded p-3 text-center">
        <div class="text-muted small mb-1">전체 인원</div>
        <div class="fw-bold fs-5"><?= (int)$summary['total'] ?>명</div>
      </div>
    </div>
    <div class="col-6 col-md-3">
      <div class="border rounded p-3 text-center" style="background:#f0fdf4;">
        <div class="text-muted small mb-1">납부완료</div>
        <div class="fw-bold fs-5 text-success"><?= (int)$summary['paid'] ?>명</div>
      </div>
    </div>
    <div class="col-6 col-md-3">
      <div class="border rounded p-3 text-center" style="background:#fff5f5;">
        <div class="text-muted small mb-1">미납</div>
        <div class="fw-bold fs-5 text-danger"><?= (int)$summary['unpaid'] ?>명</div>
      </div>
    </div>
    <div class="col-6 col-md-3">
      <div class="border rounded p-3 text-center" style="background:#fffbeb;">
        <div class="text-muted small mb-1">이번달 매출</div>
        <div class="fw-bold fs-5"><?= number_format((int)$summary['actual_revenue']) ?>원</div>
        <div class="text-muted" style="font-size:.72rem;">/ 예상 <?= number_format((int)$summary['expected_revenue']) ?>원</div>
      </div>
    </div>
  </div>
  <?php endif; ?>

  <!-- 일괄 생성 버튼 -->
  <div class="d-flex justify-content-end mb-3">
    <button class="btn btn-outline-primary btn-sm" id="gen-btn"
      data-url="<?= BASE_PATH ?>/admin/tuition/generate"
      data-token="<?= e(Auth::csrfToken()) ?>"
      data-year="<?= $year ?>" data-month="<?= $month ?>">
      ✦ <?= $year ?>년 <?= $month ?>월 원비 일괄 생성
    </button>
  </div>

  <!-- 원비 목록 -->
  <?php if (empty($items)): ?>
  <div class="text-muted text-center py-5">
    <p>이 달 원비 데이터가 없습니다.</p>
    <p class="small">위 "원비 일괄 생성" 버튼으로 활성 회원의 원비 항목을 생성하세요.</p>
  </div>
  <?php else: ?>
  <div class="table-responsive">
    <table class="table align-middle table-hover">
      <thead class="table-light">
        <tr>
          <th>회원명</th>
          <th>클래스</th>
          <th class="text-end">기본 원비</th>
          <th class="text-end">실납부금액</th>
          <th class="text-center">납부 상태</th>
          <th class="text-center">납부일</th>
          <th class="text-muted small">메모</th>
          <th style="width:120px;">관리</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($items as $t): ?>
        <tr>
          <td class="fw-medium"><?= e($t['member_name']) ?></td>
          <td class="small text-muted"><?= $t['class_name'] ? e($t['class_name']) : '—' ?></td>
          <td class="text-end small text-muted"><?= number_format((int)$t['base_fee']) ?>원</td>
          <td class="text-end fw-medium"><?= number_format((int)$t['actual_fee']) ?>원</td>
          <td class="text-center"><?= $statusBadge[(int)$t['status']] ?? '' ?></td>
          <td class="text-center small text-muted"><?= $t['paid_at'] ? fmtDate($t['paid_at']) : '—' ?></td>
          <td class="small text-muted" style="max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"><?= e($t['memo'] ?: '—') ?></td>
          <td>
            <div class="d-flex gap-1 justify-content-end">
              <?php if ((int)$t['status'] !== 1): ?>
              <button class="btn btn-success btn-sm paid-btn"
                data-url="<?= BASE_PATH ?>/admin/tuition/<?= (int)$t['id'] ?>/paid"
                data-token="<?= e(Auth::csrfToken()) ?>">납부</button>
              <?php endif; ?>
              <a href="<?= BASE_PATH ?>/admin/tuition/<?= (int)$t['id'] ?>/edit" class="btn btn-outline-secondary btn-sm">수정</a>
              <button class="btn btn-outline-danger btn-sm del-tuition-btn"
                data-url="<?= BASE_PATH ?>/admin/tuition/<?= (int)$t['id'] ?>/delete"
                data-token="<?= e(Auth::csrfToken()) ?>"
                data-name="<?= e($t['member_name']) ?>">삭제</button>
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
// 일괄 생성
document.getElementById('gen-btn').addEventListener('click', function () {
  var btn = this;
  if (!confirm(btn.dataset.year + '년 ' + btn.dataset.month + '월 원비를 일괄 생성하시겠습니까?\n(이미 존재하는 항목은 건너뜁니다)')) return;
  btn.disabled = true;
  fetch(btn.dataset.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: '_token=' + encodeURIComponent(btn.dataset.token)
        + '&year=' + btn.dataset.year
        + '&month=' + btn.dataset.month,
  }).then(r => r.json()).then(d => {
    if (d.ok) {
      alert(d.created + '건 생성되었습니다.');
      location.reload();
    } else {
      alert('생성 실패'); btn.disabled = false;
    }
  }).catch(() => { alert('오류'); btn.disabled = false; });
});

// 원비 삭제
document.querySelectorAll('.del-tuition-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    if (!confirm(btn.dataset.name + ' 회원의 이 달 원비를 삭제하시겠습니까?')) return;
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

// 납부 완료 처리
document.querySelectorAll('.paid-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    if (!confirm('납부 완료로 처리하시겠습니까?')) return;
    btn.disabled = true;
    fetch(btn.dataset.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: '_token=' + encodeURIComponent(btn.dataset.token),
    }).then(r => r.json()).then(d => {
      if (d.ok) location.reload();
      else { alert('처리 실패'); btn.disabled = false; }
    }).catch(() => { alert('오류'); btn.disabled = false; });
  });
});
</script>
