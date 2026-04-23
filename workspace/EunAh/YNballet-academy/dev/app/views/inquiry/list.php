<!-- SCREEN: 문의 목록 | PATH: /inquiry -->

<div class="page-banner">
  <span class="en-label">Contact</span>
  <h1>문의 목록</h1>
  <div class="gold-divider"></div>
</div>

<div class="container py-5" style="max-width:760px;">

  <div class="d-flex justify-content-end mb-4 reveal">
    <a href="<?= BASE_PATH ?>/inquiry/write" class="btn btn-yn-gold btn-sm">문의하기</a>
  </div>

  <?php if (empty($items)): ?>
  <p class="text-center py-5" style="color:var(--text-muted);">등록된 문의가 없습니다.</p>
  <?php else: ?>
  <div class="table-responsive reveal">
    <table class="yn-table">
      <thead>
        <tr>
          <th class="text-center" style="width:52px;">No.</th>
          <th>이름</th>
          <th>관심 과정</th>
          <th class="text-center">상태</th>
          <th class="text-center">작성일</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($items as $i => $item): ?>
        <tr>
          <td class="text-center" style="color:var(--text-muted);font-size:.8rem;"><?= $total - ($page - 1) * $perPage - $i ?></td>
          <td>
            <a href="<?= BASE_PATH ?>/inquiry/<?= (int)$item['id'] ?>">
              <?= e(maskName($item['name'])) ?>
            </a>
          </td>
          <td style="color:var(--text-muted);font-size:.875rem;"><?= e($item['course_interest'] ?: '—') ?></td>
          <td class="text-center"><?= inquiryBadge((int)$item['status']) ?></td>
          <td class="text-center" style="color:var(--text-muted);font-size:.8rem;"><?= fmtDate($item['created_at']) ?></td>
        </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
  <div class="mt-4 reveal">
    <?= pagination($total, $page, $perPage, BASE_PATH . '/inquiry?') ?>
  </div>
  <?php endif; ?>

</div>
