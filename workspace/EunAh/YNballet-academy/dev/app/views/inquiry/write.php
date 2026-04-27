<!-- SCREEN: 수강 문의 작성 | PATH: /inquiry/write | API: POST /inquiry/write -->

<div class="page-banner">
  <span class="en-label">Contact</span>
  <h1>수강 문의</h1>
  <div class="gold-divider"></div>
</div>

<div class="container py-5" style="max-width:680px;">

  <?php if (!empty($_GET['success'])): ?>
  <div class="alert alert-success reveal">
    문의가 접수되었습니다. 빠른 시일 내에 답변 드리겠습니다.
    <div class="mt-2">
      <a href="<?= BASE_PATH ?>/inquiry" class="btn btn-sm btn-yn-outline-navy">문의 목록 보기</a>
    </div>
  </div>
  <?php else: ?>

  <?php if (!empty($authUser)): ?>
  <div class="alert alert-info reveal py-2" style="font-size:.875rem;">
    <strong><?= e($authUser['name']) ?></strong>님으로 로그인되어 있습니다.
    이름과 연락처가 자동으로 입력되며, 문의 조회 시 비밀번호 없이 확인하실 수 있습니다.
  </div>
  <?php else: ?>
  <p class="reveal mb-4" style="font-size:.875rem;color:var(--text-muted);">
    작성하신 문의는 비밀번호로 조회하실 수 있습니다.
    <a href="<?= BASE_PATH ?>/login?redirect=<?= urlencode(BASE_PATH . '/inquiry/write') ?>" class="ms-1">로그인</a>하시면 더 편리하게 이용하실 수 있습니다.
  </p>
  <?php endif; ?>

  <?php if ($errors): ?>
  <div class="alert alert-danger reveal">
    <ul class="mb-0 ps-3">
      <?php foreach ($errors as $err): ?>
      <li><?= e($err) ?></li>
      <?php endforeach; ?>
    </ul>
  </div>
  <?php endif; ?>

  <!-- [FORM: inquiry-write] POST /inquiry/write | Fields: name/contact/course_interest/content/password -->
  <form id="inquiry_write" method="POST" action="<?= BASE_PATH ?>/inquiry/write" novalidate class="needs-validation reveal">
    <?= Auth::csrfField() ?>

    <div class="row g-3 mb-3">
      <div class="col-sm-6">
        <label for="name" class="form-label">이름 <span class="text-danger">*</span></label>
        <input type="text" class="form-control" id="name" name="name"
          maxlength="20" minlength="2" required
          value="<?= e(!empty($authUser) ? $authUser['name'] : ($old['name'] ?? '')) ?>"
          placeholder="홍길동" <?= !empty($authUser) ? 'readonly' : '' ?>>
        <div class="invalid-feedback">이름을 2자 이상 입력해 주세요.</div>
      </div>
      <div class="col-sm-6">
        <label for="contact" class="form-label">연락처 <span class="text-danger">*</span></label>
        <input type="text" class="form-control" id="contact" name="contact"
          maxlength="13" required
          value="<?= e(!empty($authUser) ? $authUser['phone'] : ($old['contact'] ?? '')) ?>"
          placeholder="010-1234-5678" <?= !empty($authUser) ? 'readonly' : '' ?>>
        <div class="invalid-feedback">숫자와 하이픈으로 입력해 주세요.</div>
      </div>
    </div>

    <div class="mb-3">
      <label for="course_interest" class="form-label">관심 과정</label>
      <select class="form-select" id="course_interest" name="course_interest">
        <option value="">선택 안 함</option>
        <?php foreach ($courses as $c): ?>
        <option value="<?= e($c['title']) ?>"
          <?= (($preselect === $c['title']) || (($old['course_interest'] ?? '') === $c['title'])) ? 'selected' : '' ?>>
          <?= e($c['title']) ?>
        </option>
        <?php endforeach; ?>
      </select>
    </div>

    <div class="mb-3">
      <label for="content" class="form-label">
        문의 내용 <span class="text-danger">*</span>
        <small class="ms-1" style="font-weight:300;color:var(--text-muted);">(<span id="content-count">0</span>/1000자)</small>
      </label>
      <textarea class="form-control" id="content" name="content"
        rows="6" required minlength="10" maxlength="1000"
        placeholder="문의 내용을 입력해 주세요. (10자 이상)"><?= e($old['content'] ?? '') ?></textarea>
      <div class="invalid-feedback">내용을 10자 이상 입력해 주세요.</div>
    </div>

    <?php if (empty($authUser)): ?>
    <div class="row g-3 mb-4">
      <div class="col-sm-6">
        <label for="password" class="form-label">비밀번호 <span class="text-danger">*</span></label>
        <input type="password" class="form-control" id="password" name="password"
          minlength="4" maxlength="20" required placeholder="4~20자">
        <div class="form-text">문의 조회 시 사용됩니다.</div>
        <div class="invalid-feedback">비밀번호를 4~20자로 입력해 주세요.</div>
      </div>
      <div class="col-sm-6">
        <label for="password_confirm" class="form-label">비밀번호 확인 <span class="text-danger">*</span></label>
        <input type="password" class="form-control" id="password_confirm" name="password_confirm"
          required placeholder="비밀번호 재입력">
        <div class="invalid-feedback" id="pw-confirm-msg">비밀번호가 일치하지 않습니다.</div>
      </div>
    </div>
    <?php endif; ?>

    <div class="d-flex justify-content-between align-items-center">
      <a href="<?= BASE_PATH ?>/inquiry" class="btn btn-yn-outline-navy">목록으로</a>
      <button type="submit" class="btn btn-yn-gold">문의 접수</button>
    </div>
  </form>

  <?php endif; ?>
</div>
