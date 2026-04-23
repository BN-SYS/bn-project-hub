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
        if ($id === ADMIN_ID && password_verify($pass, ADMIN_PASS_HASH)) {
            session_regenerate_id(true);
            $_SESSION['admin'] = true;
            return true;
        }
        return false;
    }

    public static function logout(): void {
        self::startSession();
        $_SESSION = [];
        session_destroy();
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
