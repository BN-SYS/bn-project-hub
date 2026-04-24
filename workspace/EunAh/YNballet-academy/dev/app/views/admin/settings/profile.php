<div class="admin-body">

  <div class="admin-page-header">
    <h1>계정 설정</h1>
  </div>

  <?php if (!empty($flash)): ?>
    <div class="alert alert-<?= e($flash['type']) ?> mb-4"><?= e($flash['msg']) ?></div>
  <?php endif; ?>

  <div class="row g-4">

    <!-- 기본 정보 -->
    <div class="col-lg-6">
      <form method="post" action="<?= BASE_PATH ?>/admin/settings/profile">
        <?= Auth::csrfField() ?>

        <div class="admin-form-wrap">
          <div class="admin-card-title">기본 정보</div>

          <div class="mb-3">
            <label class="form-label">이름</label>
            <input type="text" name="name" class="form-control"
                   value="<?= e($profile['name'] ?? '관리자') ?>" placeholder="관리자 이름">
          </div>

          <div class="mb-3">
            <label class="form-label">연락처</label>
            <input type="text" name="contact" class="form-control"
                   value="<?= e($profile['contact'] ?? '') ?>" placeholder="010-0000-0000">
          </div>

          <div class="mb-3">
            <label class="form-label">아이디</label>
            <input type="text" name="admin_id" class="form-control"
                   value="<?= e($profile['id']) ?>" autocomplete="username">
          </div>

          <hr class="my-4">

          <div class="admin-card-title">비밀번호 변경 <span style="font-size:.75rem;font-weight:400;color:var(--admin-text-muted)">(변경 시에만 입력)</span></div>

          <div class="mb-3">
            <label class="form-label">새 비밀번호</label>
            <input type="password" name="new_pass" class="form-control"
                   autocomplete="new-password" placeholder="6자 이상 (변경 시에만)">
          </div>

          <div class="mb-3">
            <label class="form-label">새 비밀번호 확인</label>
            <input type="password" name="confirm_pass" class="form-control"
                   autocomplete="new-password">
          </div>

          <hr class="my-4">

          <div class="mb-4">
            <label class="form-label">현재 비밀번호 <span class="text-danger">*</span></label>
            <input type="password" name="current_pass" class="form-control"
                   autocomplete="current-password" required placeholder="변경 내용 저장 시 필수">
          </div>

          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-dark">저장</button>
          </div>
        </div>

      </form>
    </div>

    <!-- 안내 -->
    <div class="col-lg-6">
      <div class="admin-card" style="background:#f8f9fa;border-style:dashed;">
        <div class="admin-card-title">안내</div>
        <ul class="mb-0" style="font-size:.85rem;line-height:1.8;color:var(--admin-text-muted);padding-left:1.25rem;">
          <li>이름·연락처는 내부 관리용으로만 사용됩니다.</li>
          <li>비밀번호를 변경하지 않으려면 새 비밀번호 칸을 <strong>비워두세요</strong>.</li>
          <li>아이디를 변경하면 다음 로그인 시 새 아이디로 접속하세요.</li>
          <li>현재 비밀번호는 모든 변경 저장 시 필수입니다.</li>
        </ul>
      </div>
    </div>

  </div>
</div>
