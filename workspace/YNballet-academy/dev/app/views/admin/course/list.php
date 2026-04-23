<!-- SCREEN: 과정 관리 | PATH: /admin/course -->

<div class="p-4">
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="h4 fw-bold mb-0">과정 관리</h1>
    <div class="d-flex align-items-center gap-3">
      <div class="d-flex align-items-center gap-2">
        <label class="text-muted small mb-0 text-nowrap">페이지당</label>
        <select class="form-select form-select-sm" style="width:auto;"
          onchange="location.href='<?= BASE_PATH ?>/admin/course?per_page='+this.value+'&page=1'">
          <?php foreach ($validPerPages as $n): ?>
          <option value="<?= $n ?>" <?= $perPage === $n ? 'selected' : '' ?>><?= $n ?>개</option>
          <?php endforeach; ?>
        </select>
      </div>
      <a href="<?= BASE_PATH ?>/admin/course/sort" class="btn btn-outline-secondary btn-sm">순서 정렬</a>
      <a href="<?= BASE_PATH ?>/admin/course/write" class="btn btn-dark btn-sm">+ 과정 등록</a>
    </div>
  </div>

  <?php if (empty($courses)): ?>
  <p class="text-muted">등록된 과정이 없습니다.</p>
  <?php else: ?>
  <div class="table-responsive">
    <table class="table align-middle">
      <thead class="table-light">
        <tr>
          <th class="text-center" style="width:56px;">No.</th>
          <th>과정명</th>
          <th style="width:120px;">카테고리</th>
          <th style="width:100px;">레벨</th>
          <th class="text-center" style="width:60px;">순서</th>
          <th class="text-center" style="width:100px;">상태</th>
          <th style="width:80px;"></th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($courses as $i => $c): ?>
        <tr>
          <td class="text-center text-muted small"><?= $total - ($page - 1) * $perPage - $i ?></td>
          <td class="col-title">
            <a href="<?= BASE_PATH ?>/admin/course/<?= (int)$c['id'] ?>/edit" class="text-dark text-decoration-none fw-medium">
              <?= e($c['title']) ?>
            </a>
          </td>
          <td class="small text-muted"><?= e($c['category'] ?: '—') ?></td>
          <td>
            <?php if ($c['level_badge']): ?>
            <span class="badge bg-secondary"><?= e($c['level_badge']) ?></span>
            <?php else: ?>
            <span class="text-muted small">—</span>
            <?php endif; ?>
          </td>
          <td class="text-center small text-muted"><?= (int)$c['sort_order'] ?></td>
          <td class="text-center">
            <button class="btn btn-sm toggle-btn <?= $c['is_active'] ? 'btn-success' : 'btn-outline-secondary' ?>"
              data-id="<?= (int)$c['id'] ?>"
              data-active="<?= (int)$c['is_active'] ?>"
              data-url="<?= BASE_PATH ?>/admin/course/<?= (int)$c['id'] ?>/toggle"
              data-token="<?= e(Auth::csrfToken()) ?>">
              <?= $c['is_active'] ? '활성' : '비활성' ?>
            </button>
          </td>
          <td>
            <a href="<?= BASE_PATH ?>/admin/course/<?= (int)$c['id'] ?>/edit" class="btn btn-outline-secondary btn-sm">수정</a>
          </td>
        </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
  <?= pagination($total, $page, $perPage, BASE_PATH . '/admin/course?per_page=' . $perPage) ?>
  <?php endif; ?>
</div>
