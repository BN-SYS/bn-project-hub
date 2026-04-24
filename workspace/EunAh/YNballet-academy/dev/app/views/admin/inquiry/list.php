<!-- SCREEN: 문의 목록 (관리자) | PATH: /admin/inquiry -->
<?php
$statusParam = $statusFilter !== null ? '&status=' . $statusFilter : '';
$baseUrl     = BASE_PATH . '/admin/inquiry?per_page=' . $perPage . $statusParam;
$filterBase  = BASE_PATH . '/admin/inquiry?per_page=' . $perPage . '&page=1';
$filterTabs  = [
    null => '전체',
    0    => '미답변',
    1    => '답변완료',
    2    => '보류',
];
?>

<div class="p-4">
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h1 class="h4 fw-bold mb-0">문의 목록</h1>
    <div class="d-flex align-items-center gap-2">
      <label class="text-muted small mb-0 text-nowrap">페이지당</label>
      <select class="form-select form-select-sm" style="width:auto;"
        onchange="location.href='<?= BASE_PATH ?>/admin/inquiry?per_page='+this.value+'&page=1<?= $statusParam ?>'">
        <?php foreach ($validPerPages as $n): ?>
        <option value="<?= $n ?>" <?= $perPage === $n ? 'selected' : '' ?>><?= $n ?>개</option>
        <?php endforeach; ?>
      </select>
    </div>
  </div>

  <!-- 답변 상태 필터 -->
  <div class="d-flex gap-2 mb-4">
    <?php foreach ($filterTabs as $val => $label): ?>
    <?php
    $isActive = $statusFilter === $val;
    $href = $val === null ? $filterBase : $filterBase . '&status=' . $val;
    $cls  = $isActive ? 'btn btn-sm btn-dark' : 'btn btn-sm btn-outline-secondary';
    ?>
    <a href="<?= $href ?>" class="<?= $cls ?>"><?= $label ?></a>
    <?php endforeach; ?>
  </div>

  <?php if (empty($items)): ?>
  <p class="text-muted">등록된 문의가 없습니다.</p>
  <?php else: ?>
  <div class="table-responsive">
    <table class="table align-middle table-hover">
      <thead class="table-light">
        <tr>
          <th class="text-center" style="width:56px;">No.</th>
          <th style="width:100px;">이름</th>
          <th style="width:130px;">연락처</th>
          <th style="width:110px;">관심 과정</th>
          <th>관리자메모</th>
          <th class="text-center" style="width:100px;">상태</th>
          <th class="text-center" style="width:110px;">작성일</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($items as $i => $item): ?>
        <tr style="cursor:pointer;<?= (int)$item['status'] === 0 ? 'background:#FFF2F4;' : '' ?>"
          onclick="location.href='<?= BASE_PATH ?>/admin/inquiry/<?= (int)$item['id'] ?>'">
          <td class="text-center text-muted small"><?= $total - ($page - 1) * $perPage - $i ?></td>
          <td class="fw-medium"><?= e($item['name']) ?></td>
          <td class="small text-muted" style="max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"><?= e($item['contact'] ?: '—') ?></td>
          <td class="small text-muted" style="max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"><?= e($item['course_interest'] ?: '—') ?></td>
          <td class="small text-muted" style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"><?= e($item['admin_memo'] ?: '—') ?></td>
          <td class="text-center"><?= inquiryBadge((int)$item['status']) ?></td>
          <td class="text-center small text-muted"><?= fmtDate($item['created_at']) ?></td>
        </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
  <?= pagination($total, $page, $perPage, $baseUrl) ?>
  <?php endif; ?>
</div>
