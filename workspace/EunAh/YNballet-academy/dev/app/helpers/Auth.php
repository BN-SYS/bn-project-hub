<?php

class Auth {
    public static function startSession(): void {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    public static function requireAdmin(): void {
        self::startSession();
        if (empty($_SESSION['admin'])) {
            header('Location: ' . BASE_PATH . '/admin/login');
            exit;
        }
    }

    public static function isAdmin(): bool {
        return !empty($_SESSION['admin']);
    }

    public static function login(string $id, string $pass): bool {
        self::startSession();
        $profile = self::getProfile();
        if ($id === $profile['id'] && password_verify($pass, $profile['pass_hash'])) {
            session_regenerate_id(true);
            $_SESSION['admin'] = true;
            return true;
        }
        return false;
    }

    public static function getProfile(): array {
        $file = APP_ROOT . '/config/admin_profile.json';
        if (file_exists($file)) {
            $data = json_decode(file_get_contents($file), true);
            if (is_array($data) && isset($data['id'], $data['pass_hash'])) {
                return $data;
            }
        }
        return [
            'id'        => ADMIN_ID,
            'pass_hash' => ADMIN_PASS_HASH,
            'name'      => '관리자',
            'contact'   => '',
        ];
    }

    public static function saveProfile(array $data): void {
        $file = APP_ROOT . '/config/admin_profile.json';
        file_put_contents($file, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    }

    public static function logout(): void {
        self::startSession();
        $_SESSION = [];
        session_destroy();
    }

    // ─── 사용자 세션 ──────────────────────────────────────

    public static function loginUser(array $user): void {
        self::startSession();
        session_regenerate_id(true);
        $_SESSION['user'] = [
            'id'       => (int)$user['id'],
            'username' => $user['username'],
            'name'     => $user['name'],
            'phone'    => $user['phone'],
            'email'    => $user['email'],
        ];
    }

    public static function logoutUser(): void {
        self::startSession();
        unset($_SESSION['user'], $_SESSION['email_verify']);
    }

    public static function getUser(): ?array {
        self::startSession();
        return $_SESSION['user'] ?? null;
    }

    public static function isLoggedIn(): bool {
        self::startSession();
        return !empty($_SESSION['user']);
    }

    public static function requireUser(): void {
        self::startSession();
        if (empty($_SESSION['user'])) {
            header('Location: ' . BASE_PATH . '/login?redirect=' . urlencode($_SERVER['REQUEST_URI']));
            exit;
        }
    }

    // ─── CSRF ─────────────────────────────────────────────

    public static function csrfToken(): string {
        self::startSession();
        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }

    public static function csrfField(): string {
        return '<input type="hidden" name="_token" value="' . e(self::csrfToken()) . '">';
    }

    public static function csrfVerify(): void {
        self::startSession();
        $submitted = $_POST['_token'] ?? '';
        $expected  = $_SESSION['csrf_token'] ?? '';
        if (!hash_equals($expected, $submitted)) {
            http_response_code(403);
            exit('요청이 유효하지 않습니다. 다시 시도해 주세요.');
        }
    }
}
