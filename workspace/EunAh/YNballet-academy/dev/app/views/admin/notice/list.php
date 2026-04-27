<!-- SCREEN: 공지사항 관리 | PATH: /admin/notice -->

<div class="p-4">
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="h4 fw-bold mb-0">공지사항</h1>
    <div class="d-flex align-items-center gap-3">
      <div class="d-flex align-items-center gap-2">
        <label class="text-muted small mb-0 text-nowrap">페이지당</label>
        <select class="form-select form-select-sm" style="width:auto;"
          onchange="location.href='<?= BASE_PATH ?>/admin/notice?per_page='+this.value+'&page=1'">
          <?php foreach ($validPerPages as $n): ?>
          <option value="<?= $n ?>" <?= $perPage === $n ? 'selected' : '' ?>><?= $n ?>개</option>
          <?php endforeach; ?>
        </select>
      </div>
      <a href="<?= BASE_PATH ?>/admin/notice/write" class="btn btn-dark btn-sm">+ 작성</a>
    </div>
  </div>

  <?php if (empty($notices)): ?>
  <p class="text-muted">등록된 공지가 없습니다.</p>
  <?php else: ?>
  <div class="table-responsive">
    <table class="table align-middle">
      <thead class="table-light">
        <tr>
          <th class="text-center" style="width:56px;">No.</th>
          <th>제목</th>
          <th class="text-center" style="width:100px;">상태</th>
          <th class="text-center" style="width:120px;">작성일</th>
          <th style="width:80px;">관리</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($notices as $i => $n): ?>
        <tr>
          <td class="text-center text-muted small"><?= $total - ($page - 1) * $perPage - $i ?></td>
          <td class="col-title">
            <?php if ($n['is_pinned']): ?>
            <span class="badge bg-dark me-1" style="font-size:.7rem;">고정</span>
            <?php endif; ?>
            <a href="<?= BASE_PATH ?>/admin/notice/<?= (int)$n['id'] ?>/edit" class="text-dark text-decoration-none">
              <?= e($n['title']) ?>
            </a>
          </td>
          <td class="text-center">
            <button class="btn btn-sm toggle-btn <?= $n['is_active'] ? 'btn-success' : 'btn-outline-secondary' ?>"
              data-id="<?= (int)$n['id'] ?>"
              data-active="<?= (int)$n['is_active'] ?>"
              data-url="<?= BASE_PATH ?>/admin/notice/<?= (int)$n['id'] ?>/toggle"
              data-token="<?= e(Auth::csrfToken()) ?>">
              <?= $n['is_active'] ? '게시중' : '숨김' ?>
            </button>
          </td>
          <td class="text-center small text-muted"><?= fmtDate($n['created_at']) ?></td>
          <td>
            <a href="<?= BASE_PATH ?>/admin/notice/<?= (int)$n['id'] ?>/edit" class="btn btn-outline-secondary btn-sm">수정</a>
          </td>
        </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
  <?= pagination($total, $page, $perPage, BASE_PATH . '/admin/notice?per_page=' . $perPage) ?>
  <?php endif; ?>
</div>
