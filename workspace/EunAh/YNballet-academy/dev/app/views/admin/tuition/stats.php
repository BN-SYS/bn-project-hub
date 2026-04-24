<!-- SCREEN: 매출 통계 | PATH: /admin/tuition/stats -->
<?php
$monthNames = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
$byMonth = [];
foreach ($monthly as $row) $byMonth[(int)$row['month']] = $row;

$totalExpected = array_sum(array_column($monthly, 'expected_revenue'));
$totalRevenue  = array_sum(array_column($monthly, 'actual_revenue'));
$totalPaid     = array_sum(array_column($monthly, 'paid_count'));
$totalUnpaid   = array_sum(array_column($monthly, 'unpaid_count'));
?>

<div class="p-4">
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="h4 fw-bold mb-0">매출 통계</h1>
    <a href="<?= BASE_PATH ?>/admin/tuition" class="btn btn-outline-secondary btn-sm">← 원비 관리</a>
  </div>

  <!-- 연도 선택 -->
  <form method="GET" action="<?= BASE_PATH ?>/admin/tuition/stats" class="d-flex align-items-center gap-2 mb-4">
    <select name="year" class="form-select form-select-sm" style="width:100px;">
      <?php for ($y = (int)date('Y') + 1; $y >= 2020; $y--): ?>
      <option value="<?= $y ?>" <?= $year === $y ? 'selected' : '' ?>><?= $y ?>년</option>
      <?php endfor; ?>
    </select>
    <button type="submit" class="btn btn-outline-secondary btn-sm">조회</button>
  </form>

  <!-- 이번달 요약 -->
  <?php if (!empty($summary) && (int)$summary['total'] > 0): ?>
  <div class="mb-4 p-3 rounded" style="background:#f8f9fa;">
    <p class="fw-medium small text-muted mb-2"><?= date('n') ?>월 현재 현황</p>
    <div class="d-flex gap-4 flex-wrap">
      <div><span class="text-muted small">납부완료</span> <strong class="text-success ms-1"><?= (int)$summary['paid'] ?>명</strong></div>
      <div><span class="text-muted small">미납</span> <strong class="text-danger ms-1"><?= (int)$summary['unpaid'] ?>명</strong></div>
      <div><span class="text-muted small">유예</span> <strong class="text-warning ms-1"><?= (int)$summary['deferred'] ?>명</strong></div>
      <div><span class="text-muted small">이달 매출</span> <strong class="ms-1"><?= number_format((int)$summary['actual_revenue']) ?>원</strong></div>
    </div>
  </div>
  <?php endif; ?>

  <!-- 연간 합계 -->
  <?php if (!empty($monthly)): ?>
  <div class="row g-3 mb-4">
    <div class="col-6 col-md-3">
      <div class="border rounded p-3 text-center">
        <div class="text-muted small mb-1"><?= $year ?>년 총 매출</div>
        <div class="fw-bold"><?= number_format($totalRevenue) ?>원</div>
      </div>
    </div>
    <div class="col-6 col-md-3">
      <div class="border rounded p-3 text-center">
        <div class="text-muted small mb-1">예상 총 매출</div>
        <div class="fw-bold"><?= number_format($totalExpected) ?>원</div>
      </div>
    </div>
    <div class="col-6 col-md-3">
      <div class="border rounded p-3 text-center">
        <div class="text-muted small mb-1">누적 납부건</div>
        <div class="fw-bold text-success"><?= number_format($totalPaid) ?>건</div>
      </div>
    </div>
    <div class="col-6 col-md-3">
      <div class="border rounded p-3 text-center">
        <div class="text-muted small mb-1">누적 미납건</div>
        <div class="fw-bold text-danger"><?= number_format($totalUnpaid) ?>건</div>
      </div>
    </div>
  </div>
  <?php endif; ?>

  <!-- 월별 테이블 -->
  <div class="table-responsive">
    <table class="table align-middle">
      <thead class="table-light">
        <tr>
          <th>월</th>
          <th class="text-center">전체</th>
          <th class="text-center">납부</th>
          <th class="text-center">미납</th>
          <th class="text-center">유예</th>
          <th class="text-end">예상 매출</th>
          <th class="text-end">실 매출</th>
          <th class="text-end text-muted small">달성률</th>
        </tr>
      </thead>
      <tbody>
        <?php for ($m = 1; $m <= 12; $m++): ?>
        <?php $row = $byMonth[$m] ?? null; ?>
        <tr <?= $m === (int)date('n') && $year === (int)date('Y') ? 'class="table-active"' : '' ?>>
          <td>
            <a href="<?= BASE_PATH ?>/admin/tuition?year=<?= $year ?>&month=<?= $m ?>"
              class="text-decoration-none fw-medium"><?= $monthNames[$m - 1] ?></a>
          </td>
          <?php if ($row): ?>
          <td class="text-center"><?= (int)$row['total_count'] ?>명</td>
          <td class="text-center text-success fw-medium"><?= (int)$row['paid_count'] ?></td>
          <td class="text-center text-danger"><?= (int)$row['unpaid_count'] ?></td>
          <td class="text-center text-warning"><?= (int)$row['deferred_count'] ?></td>
          <td class="text-end text-muted small"><?= number_format((int)$row['expected_revenue']) ?>원</td>
          <td class="text-end fw-medium"><?= number_format((int)$row['actual_revenue']) ?>원</td>
          <td class="text-end text-muted small">
            <?php
            $rate = $row['expected_revenue'] > 0
              ? round($row['actual_revenue'] / $row['expected_revenue'] * 100)
              : 0;
            ?>
            <span class="<?= $rate >= 100 ? 'text-success' : ($rate >= 50 ? 'text-warning' : 'text-danger') ?>">
              <?= $rate ?>%
            </span>
          </td>
          <?php else: ?>
          <td class="text-center text-muted small" colspan="7">데이터 없음</td>
          <?php endif; ?>
        </tr>
        <?php endfor; ?>
      </tbody>
    </table>
  </div>
</div>
