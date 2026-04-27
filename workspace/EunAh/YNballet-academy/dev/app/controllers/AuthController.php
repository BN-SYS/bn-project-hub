<?php

require_once APP_ROOT . '/app/models/UserModel.php';

class AuthController extends Controller {

    // ─── 회원가입 ─────────────────────────────────────────

    public function showRegister(): void {
        if (Auth::isLoggedIn()) {
            $this->redirect(BASE_PATH . '/');
        }
        $this->render('layouts/main', [
            'pageTitle'  => '회원가입 — ' . SITE_NAME,
            'activePage' => 'register',
            'content'    => 'auth/register',
            'errors'     => [],
            'old'        => [],
            'extraJs'    => '<script>const BASE_PATH="' . BASE_PATH . '",CSRF_TOKEN="' . Auth::csrfToken() . '";</script>'
                          . '<script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>'
                          . '<script src="' . BASE_PATH . '/assets/js/register.js"></script>',
        ]);
    }

    public function register(): void {
        Auth::csrfVerify();

        $data = [
            'username'         => trim($this->post('username')),
            'password'         => $this->post('password'),
            'password_confirm' => $this->post('password_confirm'),
            'name'             => trim($this->post('name')),
            'birth_date'       => trim($this->post('birth_date')),
            'gender'           => $this->post('gender') ?: '',
            'address_zip'      => trim($this->post('address_zip')),
            'address1'         => trim($this->post('address1')),
            'address2'         => trim($this->post('address2')),
            'phone'            => trim($this->post('phone')),
            'email'            => trim($this->post('email')),
            'note'             => trim($this->post('note')),
            'agree_privacy'    => (bool)$this->post('agree_privacy'),
            'agree_marketing'  => (bool)$this->post('agree_marketing'),
        ];

        $errors = $this->validateRegister($data);

        if ($errors) {
            $this->render('layouts/main', [
                'pageTitle'  => '회원가입 — ' . SITE_NAME,
                'activePage' => 'register',
                'content'    => 'auth/register',
                'errors'     => $errors,
                'old'        => $_POST,
                'extraJs'    => '<script>const BASE_PATH="' . BASE_PATH . '",CSRF_TOKEN="' . Auth::csrfToken() . '";</script>'
                              . '<script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>'
                              . '<script src="' . BASE_PATH . '/assets/js/register.js"></script>',
            ]);
            return;
        }

        $model  = new UserModel();
        $userId = $model->create($data);

        $user = $model->findById($userId);
        Auth::loginUser($user);

        $this->redirect(BASE_PATH . '/?registered=1');
    }

    private function validateRegister(array $data): array {
        $errors = [];
        $model  = new UserModel();

        // 아이디
        if (!preg_match('/^[a-zA-Z0-9_]{4,20}$/', $data['username'])) {
            $errors[] = '아이디는 영문·숫자·밑줄(_)로 4~20자 입력해 주세요.';
        } elseif ($model->usernameExists($data['username'])) {
            $errors[] = '이미 사용 중인 아이디입니다.';
        }

        // 비밀번호
        if (strlen($data['password']) < 8 || strlen($data['password']) > 30) {
            $errors[] = '비밀번호는 8~30자로 입력해 주세요.';
        } elseif ($data['password'] !== $data['password_confirm']) {
            $errors[] = '비밀번호가 일치하지 않습니다.';
        }

        // 이름
        $nameLen = mb_strlen($data['name'], 'UTF-8');
        if ($nameLen < 2 || $nameLen > 20) {
            $errors[] = '이름은 2~20자로 입력해 주세요.';
        }

        // 생년월일 (선택)
        if ($data['birth_date'] && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $data['birth_date'])) {
            $errors[] = '생년월일 형식이 올바르지 않습니다.';
        }

        // 주소
        if (empty($data['address_zip'])) $errors[] = '주소를 검색해 주세요.';
        if (empty($data['address1']))    $errors[] = '기본 주소가 입력되지 않았습니다.';

        // 핸드폰
        if (!validContact($data['phone'])) {
            $errors[] = '핸드폰 번호를 올바르게 입력해 주세요. (예: 010-1234-5678)';
        }

        // 이메일
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = '이메일 형식이 올바르지 않습니다.';
        } elseif ($model->emailExists($data['email'])) {
            $errors[] = '이미 사용 중인 이메일입니다.';
        }

        // 개인정보 동의
        if (!$data['agree_privacy']) {
            $errors[] = '개인정보 처리방침에 동의해 주세요.';
        }

        return $errors;
    }

    // ─── 로그인 ───────────────────────────────────────────

    public function showLogin(): void {
        if (Auth::isLoggedIn()) {
            $this->redirect(BASE_PATH . '/');
        }
        $this->render('layouts/main', [
            'pageTitle'  => '로그인 — ' . SITE_NAME,
            'activePage' => 'login',
            'content'    => 'auth/login',
            'error'      => null,
            'old'        => [],
        ]);
    }

    public function login(): void {
        Auth::csrfVerify();

        $username = trim($this->post('username'));
        $password = $this->post('password');
        $redirect = $this->get('redirect', '');

        $user = (new UserModel())->findByUsername($username);
        if ($user && password_verify($password, $user['password_hash'])) {
            Auth::loginUser($user);
            // 외부 URL 리디렉션 방지
            if (!$redirect || !str_starts_with($redirect, BASE_PATH)) {
                $redirect = BASE_PATH . '/';
            }
            $this->redirect($redirect);
        }

        $this->render('layouts/main', [
            'pageTitle'  => '로그인 — ' . SITE_NAME,
            'activePage' => 'login',
            'content'    => 'auth/login',
            'error'      => '아이디 또는 비밀번호가 올바르지 않습니다.',
            'old'        => ['username' => $username],
        ]);
    }

    public function logout(): void {
        Auth::logoutUser();
        $this->redirect(BASE_PATH . '/');
    }

    // ─── API ──────────────────────────────────────────────

    public function apiCheckUsername(): void {
        $username = trim($this->post('username'));
        if (!preg_match('/^[a-zA-Z0-9_]{4,20}$/', $username)) {
            $this->json(['available' => false, 'message' => '아이디 형식이 올바르지 않습니다.']);
            return;
        }
        $exists = (new UserModel())->usernameExists($username);
        $this->json([
            'available' => !$exists,
            'message'   => $exists ? '이미 사용 중인 아이디입니다.' : '사용 가능한 아이디입니다.',
        ]);
    }

    public function apiCheckEmail(): void {
        $email = trim($this->post('email'));
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->json(['available' => false, 'message' => '이메일 형식이 올바르지 않습니다.']);
            return;
        }
        $exists = (new UserModel())->emailExists($email);
        $this->json([
            'available' => !$exists,
            'message'   => $exists ? '이미 사용 중인 이메일입니다.' : '사용 가능한 이메일입니다.',
        ]);
    }

    public function apiSendEmailCode(): void {
        Auth::startSession();
        $email = trim($this->post('email'));

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->json(['ok' => false, 'message' => '이메일 형식이 올바르지 않습니다.']);
            return;
        }
        if ((new UserModel())->emailExists($email)) {
            $this->json(['ok' => false, 'message' => '이미 사용 중인 이메일입니다.']);
            return;
        }

        // 60초 쿨다운
        $prev = $_SESSION['email_verify'] ?? null;
        if ($prev && $prev['email'] === $email && isset($prev['sent_at']) && (time() - $prev['sent_at']) < 60) {
            $this->json(['ok' => false, 'message' => '1분 후 다시 시도해 주세요.']);
            return;
        }

        $code = str_pad((string)random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $_SESSION['email_verify'] = [
            'email'    => $email,
            'code'     => $code,
            'sent_at'  => time(),
            'verified' => false,
        ];

        $subject = '[' . SITE_NAME . '] 이메일 인증번호';
        $message = SITE_NAME . " 이메일 인증번호입니다.\n\n인증번호: {$code}\n\n5분 이내에 입력해 주세요.";
        $headers = 'From: noreply@ynballet.com' . "\r\nContent-Type: text/plain; charset=UTF-8";

        @mail($email, '=?UTF-8?B?' . base64_encode($subject) . '?=', $message, $headers);

        $this->json(['ok' => true, 'message' => '인증번호를 발송했습니다. (5분 유효)']);
    }

    public function apiVerifyEmailCode(): void {
        Auth::startSession();
        $email = trim($this->post('email'));
        $code  = trim($this->post('code'));

        $ev = $_SESSION['email_verify'] ?? null;
        if (!$ev || $ev['email'] !== $email) {
            $this->json(['ok' => false, 'message' => '인증 정보가 없습니다. 인증번호를 다시 발송해 주세요.']);
            return;
        }
        if ((time() - $ev['sent_at']) > 300) {
            $this->json(['ok' => false, 'message' => '인증번호가 만료되었습니다. 다시 발송해 주세요.']);
            return;
        }
        if ($ev['code'] !== $code) {
            $this->json(['ok' => false, 'message' => '인증번호가 올바르지 않습니다.']);
            return;
        }

        $_SESSION['email_verify']['verified'] = true;
        $this->json(['ok' => true, 'message' => '이메일 인증이 완료되었습니다.']);
    }
}
