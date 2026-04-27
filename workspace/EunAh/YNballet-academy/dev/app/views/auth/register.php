<!-- SCREEN: 회원가입 | PATH: /register | API: POST /register, POST /api/check-username, POST /api/send-email-code, POST /api/verify-email-code -->

<div class="page-banner">
  <span class="en-label">Join Us</span>
  <h1>회원가입</h1>
  <div class="gold-divider"></div>
</div>

<div class="container py-5" style="max-width:720px;">

  <?php if ($errors): ?>
  <div class="alert alert-danger reveal">
    <ul class="mb-0 ps-3">
      <?php foreach ($errors as $err): ?>
      <li><?= e($err) ?></li>
      <?php endforeach; ?>
    </ul>
  </div>
  <?php endif; ?>

  <form id="register_form" method="POST" action="<?= BASE_PATH ?>/register" novalidate class="needs-validation reveal">
    <?= Auth::csrfField() ?>

    <!-- 아이디 -->
    <div class="mb-4">
      <label for="username" class="form-label">아이디 <span class="text-danger">*</span></label>
      <div class="input-group">
        <input type="text" class="form-control" id="username" name="username"
          pattern="[a-zA-Z0-9_]{4,20}" maxlength="20" required autocomplete="username"
          value="<?= e($old['username'] ?? '') ?>" placeholder="영문·숫자·밑줄 4~20자">
        <button type="button" class="btn btn-yn-outline-navy" id="btn_check_username">중복 확인</button>
      </div>
      <div class="form-text" id="username_msg"></div>
      <div class="invalid-feedback">아이디는 영문·숫자·밑줄(_)로 4~20자 입력해 주세요.</div>
    </div>

    <!-- 비밀번호 -->
    <div class="row g-3 mb-4">
      <div class="col-sm-6">
        <label for="password" class="form-label">비밀번호 <span class="text-danger">*</span></label>
        <input type="password" class="form-control" id="password" name="password"
          minlength="8" maxlength="30" required autocomplete="new-password" placeholder="8~30자">
        <div class="invalid-feedback">비밀번호는 8~30자로 입력해 주세요.</div>
      </div>
      <div class="col-sm-6">
        <label for="password_confirm" class="form-label">비밀번호 확인 <span class="text-danger">*</span></label>
        <input type="password" class="form-control" id="password_confirm" name="password_confirm"
          required autocomplete="new-password" placeholder="비밀번호 재입력">
        <div class="invalid-feedback">비밀번호가 일치하지 않습니다.</div>
      </div>
    </div>

    <!-- 이름 + 생년월일 -->
    <div class="row g-3 mb-4">
      <div class="col-sm-6">
        <label for="name" class="form-label">이름 <span class="text-danger">*</span></label>
        <input type="text" class="form-control" id="name" name="name"
          minlength="2" maxlength="20" required autocomplete="name"
          value="<?= e($old['name'] ?? '') ?>" placeholder="홍길동">
        <div class="invalid-feedback">이름을 2~20자로 입력해 주세요.</div>
      </div>
      <div class="col-sm-6">
        <label for="birth_date" class="form-label">생년월일 <span class="text-muted">(선택)</span></label>
        <input type="date" class="form-control" id="birth_date" name="birth_date"
          max="<?= date('Y-m-d') ?>" autocomplete="bday"
          value="<?= e($old['birth_date'] ?? '') ?>">
      </div>
    </div>

    <!-- 성별 -->
    <div class="mb-4">
      <label class="form-label">성별 <span class="text-muted">(선택)</span></label>
      <div class="d-flex gap-4">
        <div class="form-check">
          <input class="form-check-input" type="radio" name="gender" id="gender_m" value="M"
            <?= (($old['gender'] ?? '') === 'M') ? 'checked' : '' ?>>
          <label class="form-check-label" for="gender_m">여성</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="gender" id="gender_f" value="F"
            <?= (($old['gender'] ?? '') === 'F') ? 'checked' : '' ?>>
          <label class="form-check-label" for="gender_f">남성</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="gender" id="gender_n" value="" checked
            <?= (!isset($old['gender']) || $old['gender'] === '') ? 'checked' : '' ?>>
          <label class="form-check-label" for="gender_n">선택 안 함</label>
        </div>
      </div>
    </div>

    <!-- 주소 -->
    <div class="mb-4">
      <label class="form-label">주소 <span class="text-danger">*</span></label>
      <div class="input-group mb-2">
        <input type="text" class="form-control" id="address_zip" name="address_zip"
          readonly required placeholder="우편번호"
          value="<?= e($old['address_zip'] ?? '') ?>">
        <button type="button" class="btn btn-yn-outline-navy" id="btn_addr_search">주소 검색</button>
      </div>
      <input type="text" class="form-control mb-2" id="address1" name="address1"
        readonly required placeholder="기본 주소"
        value="<?= e($old['address1'] ?? '') ?>">
      <input type="text" class="form-control" id="address2" name="address2"
        maxlength="100" placeholder="상세 주소 (동, 호수 등)"
        value="<?= e($old['address2'] ?? '') ?>">
    </div>

    <!-- 핸드폰 -->
    <div class="mb-4">
      <label for="phone" class="form-label">핸드폰 <span class="text-danger">*</span></label>
      <input type="tel" class="form-control" id="phone" name="phone"
        maxlength="13" required autocomplete="tel"
        value="<?= e($old['phone'] ?? '') ?>" placeholder="010-1234-5678">
      <div class="invalid-feedback">핸드폰 번호를 올바르게 입력해 주세요.</div>
    </div>

    <!-- 이메일 -->
    <div class="mb-4">
      <label for="email" class="form-label">이메일 <span class="text-danger">*</span></label>
      <input type="email" class="form-control" id="email" name="email"
        maxlength="100" required autocomplete="email"
        value="<?= e($old['email'] ?? '') ?>" placeholder="example@email.com">
      <div class="invalid-feedback">올바른 이메일 주소를 입력해 주세요.</div>
    </div>

    <!-- 전하고 싶은 말 -->
    <div class="mb-4">
      <label for="note" class="form-label">전하고 싶은 말 <span class="text-muted">(선택)</span></label>
      <textarea class="form-control" id="note" name="note"
        rows="3" maxlength="500"
        placeholder="원하시는 과정, 수강 목적, 기타 문의 사항 등을 자유롭게 작성해 주세요."><?= e($old['note'] ?? '') ?></textarea>
    </div>

    <!-- 약관 동의 -->
    <div class="border rounded p-3 mb-4" style="background:rgba(255,255,255,.03);">
      <div class="form-check mb-2">
        <input class="form-check-input" type="checkbox" id="agree_privacy" name="agree_privacy" value="1"
          required <?= !empty($old['agree_privacy']) ? 'checked' : '' ?>>
        <label class="form-check-label" for="agree_privacy">
          <strong><span class="text-danger">*</span> 개인정보 처리방침에 동의합니다.</strong>
          <a href="#" class="ms-1 small" data-bs-toggle="modal" data-bs-target="#privacyModal">[내용 보기]</a>
        </label>
        <div class="invalid-feedback">개인정보 처리방침에 동의해 주세요.</div>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="agree_marketing" name="agree_marketing" value="1"
          <?= !empty($old['agree_marketing']) ? 'checked' : '' ?>>
        <label class="form-check-label small" for="agree_marketing">
          마케팅 정보 수신에 동의합니다. (선택) — 수업 안내, 이벤트 정보를 받아보실 수 있습니다.
        </label>
      </div>
    </div>

    <div class="d-flex justify-content-between align-items-center">
      <a href="<?= BASE_PATH ?>/login" class="btn btn-yn-outline-navy">로그인으로 돌아가기</a>
      <button type="submit" class="btn btn-yn-gold px-5" id="btn_submit">가입하기</button>
    </div>
  </form>

</div>

<!-- 개인정보 처리방침 모달 -->
<div class="modal fade" id="privacyModal" tabindex="-1" aria-labelledby="privacyModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="privacyModalLabel">개인정보 처리방침</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="닫기"></button>
      </div>
      <div class="modal-body" style="max-height:60vh;overflow-y:auto;font-size:.875rem;line-height:1.8;">
        <p><strong><?= e(SITE_NAME) ?></strong>는 회원가입 및 서비스 제공을 위해 아래와 같이 개인정보를 수집·이용합니다.</p>
        <table class="table table-sm table-bordered">
          <thead class="table-light">
            <tr><th>수집 항목</th><th>수집 목적</th><th>보유 기간</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>아이디, 비밀번호, 이름, 생년월일, 성별, 주소, 핸드폰, 이메일</td>
              <td>회원 식별, 수강 안내, 서비스 제공</td>
              <td>회원 탈퇴 시까지</td>
            </tr>
          </tbody>
        </table>
        <p class="mb-0 text-muted">위 개인정보 수집·이용에 동의하지 않으실 경우 회원가입이 제한될 수 있습니다.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-yn-gold" data-bs-dismiss="modal">확인</button>
      </div>
    </div>
  </div>
</div>
