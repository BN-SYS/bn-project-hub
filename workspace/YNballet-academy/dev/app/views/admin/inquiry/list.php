<!-- SCREEN: 문의 목록 (관리자) | PATH: /admin/inquiry -->

<div class="p-4">
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="h4 fw-bold mb-0">문의 목록</h1>
    <div class="d-flex align-items-center gap-2">
      <label class="text-muted small mb-0 text-nowrap">페이지당</label>
      <select class="form-select form-select-sm" style="width:auto;"
        onchange="location.href='<?= BASE_PATH ?>/admin/inquiry?per_page='+this.value+'&page=1'">
        <?php foreach ($validPerPages as $n): ?>
        <option value="<?= $n ?>" <?= $perPage === $n ? 'selected' : '' ?>><?= $n ?>개</option>
        <?php endforeach; ?>
      </select>
    </div>
  </div>

  <?php if (empty($items)): ?>
  <p class="text-muted">등록된 문의가 없습니다.</p>
  <?php else: ?>
  <div class="table-responsive">
    <table class="table align-middle table-hover">
      <thead class="table-light">
        <tr>
          <th class="text-center" style="width:56px;">No.</th>
          <th style="width:120px;">이름</th>
          <th>관심 과정</th>
          <th class="text-center" style="width:100px;">상태</th>
          <th class="text-center" style="width:120px;">작성일</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($items as $i => $item): ?>
        <tr style="cursor:pointer;"
          onclick="location.href='<?= BASE_PATH ?>/admin/inquiry/<?= (int)$item['id'] ?>'">
          <td class="text-center text-muted small"><?= $total - ($page - 1) * $perPage - $i ?></td>
          <td class="col-name fw-medium"><?= e($item['name']) ?></td>
          <td class="col-content small text-muted"><?= e($item['course_interest'] ?: '—') ?></td>
          <td class="text-center"><?= inquiryBadge((int)$item['status']) ?></td>
          <td class="text-center small text-muted"><?= fmtDate($item['created_at']) ?></td>
        </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
  <?= pagination($total, $page, $perPage, BASE_PATH . '/admin/inquiry?per_page=' . $perPage) ?>
  <?php endif; ?>
</div>
