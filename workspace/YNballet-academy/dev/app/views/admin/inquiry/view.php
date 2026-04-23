<!-- SCREEN: 문의 상세 (관리자) | PATH: /admin/inquiry/:id -->

<div class="p-4">
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="h4 fw-bold mb-0">문의 상세</h1>
    <a href="<?= BASE_PATH ?>/admin/inquiry" class="btn btn-outline-secondary btn-sm">목록으로</a>
  </div>

  <!-- 문의 기본 정보 -->
  <table class="table table-bordered mb-4">
    <tr>
      <th class="table-light" style="width:120px;">이름</th>
      <td><?= e($inquiry['name']) ?></td>
    </tr>
    <tr>
      <th class="table-light">연락처</th>
      <td><?= e($inquiry['contact']) ?></td>
    </tr>
    <tr>
      <th class="table-light">관심 과정</th>
      <td><?= e($inquiry['course_interest'] ?: '—') ?></td>
    </tr>
    <tr>
      <th class="table-light">작성일</th>
      <td><?= fmtDate($inquiry['created_at']) ?></td>
    </tr>
    <tr>
      <th class="table-light">내용</th>
      <td class="py-3" style="white-space:pre-line;"><?= e($inquiry['content']) ?></td>
    </tr>
    <tr>
      <th class="table-light">상태</th>
      <td>
        <div class="d-flex align-items-center gap-3 flex-wrap">
          <span id="status-badge"><?= inquiryBadge((int)$inquiry['status']) ?></span>
          <div class="d-flex gap-1" id="status-actions">
            <?php
            $statuses = [0 => '미답변', 1 => '답변완료', 2 => '보류'];
            foreach ($statuses as $val => $label):
              if ($val === (int)$inquiry['status']) continue;
            ?>
            <button class="btn btn-sm btn-outline-secondary status-btn"
              data-status="<?= $val ?>"
              data-url="<?= BASE_PATH ?>/admin/inquiry/<?= (int)$inquiry['id'] ?>/status"
              data-token="<?= e(Auth::csrfToken()) ?>">
              → <?= $label ?>
            </button>
            <?php endforeach; ?>
          </div>
        </div>
      </td>
    </tr>
  </table>

  <!-- 관리자 답변 (사용자에게 공개) -->
  <div class="card mb-4">
    <div class="card-header fw-semibold">답변 메시지 <small class="text-muted fw-normal">(사용자에게 공개)</small></div>
    <div class="card-body">
      <textarea id="answer-text" class="form-control mb-2" rows="4"
        placeholder="답변 내용을 입력하세요."><?= e($inquiry['answer'] ?? '') ?></textarea>
      <button id="save-answer" class="btn btn-dark btn-sm"
        data-url="<?= BASE_PATH ?>/admin/inquiry/<?= (int)$inquiry['id'] ?>/answer"
        data-token="<?= e(Auth::csrfToken()) ?>">답변 저장</button>
      <span id="answer-msg" class="ms-2 small" style="display:none;"></span>
    </div>
  </div>

  <!-- 관리자 메모 (내부용, 비공개) -->
  <div class="card mb-2">
    <div class="card-header fw-semibold">관리자 메모 <small class="text-muted fw-normal">(내부용 · 비공개)</small></div>
    <div class="card-body">
      <textarea id="memo-text" class="form-control mb-2" rows="3"
        placeholder="내부 메모를 입력하세요."><?= e($inquiry['admin_memo'] ?? '') ?></textarea>
      <button id="save-memo" class="btn btn-outline-secondary btn-sm"
        data-url="<?= BASE_PATH ?>/admin/inquiry/<?= (int)$inquiry['id'] ?>/memo"
        data-token="<?= e(Auth::csrfToken()) ?>">메모 저장</button>
      <span id="memo-msg" class="ms-2 small" style="display:none;"></span>
    </div>
  </div>
</div>

<script>
(function () {
  // 상태 변경
  document.querySelectorAll('.status-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      fetch(this.dataset.url, {
        method:  'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body:    '_token=' + encodeURIComponent(this.dataset.token) + '&status=' + this.dataset.status
      })
      .then(r => r.json())
      .then(data => { if (data.ok) location.reload(); });
    });
  });

  // 답변 저장
  document.getElementById('save-answer').addEventListener('click', function () {
    const btn = this;
    const msg = document.getElementById('answer-msg');
    fetch(btn.dataset.url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    '_token=' + encodeURIComponent(btn.dataset.token)
             + '&answer=' + encodeURIComponent(document.getElementById('answer-text').value)
    })
    .then(r => r.json())
    .then(data => {
      msg.style.display = 'inline';
      if (data.ok) {
        msg.className = 'ms-2 small text-success';
        msg.textContent = '저장되었습니다.';
        // 답변 등록 시 상태 자동 갱신
        setTimeout(() => location.reload(), 800);
      } else {
        msg.className = 'ms-2 small text-danger';
        msg.textContent = data.msg || '저장 실패';
      }
    });
  });

  // 메모 저장
  document.getElementById('save-memo').addEventListener('click', function () {
    const btn = this;
    const msg = document.getElementById('memo-msg');
    fetch(btn.dataset.url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    '_token=' + encodeURIComponent(btn.dataset.token)
             + '&admin_memo=' + encodeURIComponent(document.getElementById('memo-text').value)
    })
    .then(r => r.json())
    .then(data => {
      msg.style.display = 'inline';
      msg.className = data.ok ? 'ms-2 small text-success' : 'ms-2 small text-danger';
      msg.textContent = data.ok ? '저장되었습니다.' : '저장 실패';
      if (data.ok) setTimeout(() => { msg.style.display = 'none'; }, 2000);
    });
  });
})();
</script>
