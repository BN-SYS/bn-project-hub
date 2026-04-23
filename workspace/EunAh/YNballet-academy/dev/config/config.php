<?php

// ─── DB ──────────────────────────────────────────────────
define('DB_HOST',    'localhost');
define('DB_USER',    'root');
define('DB_PASS',    '');
define('DB_NAME',    'yn_ballet');
define('DB_CHARSET', 'utf8mb4');

// ─── 관리자 계정 (하드코딩 단일 계정) ──────────────────────
define('ADMIN_ID',        'ynadmin');
// setup.php 실행 후 출력된 해시로 교체
define('ADMIN_PASS_HASH', '$2y$10$lXh.ztPyg1HldIzdgI.wd.mYAsPAbeDof.UT1fhNljXbXUq0mvZGe');

// ─── 사이트 설정 ─────────────────────────────────────────
define('SITE_NAME',   'YN발레아카데미');
define('SITE_URL',    'http://localhost/YNballet-academy');
define('BASE_PATH',   '/YNballet-academy'); // XAMPP 서브디렉토리 (루트 운영 시 '')

// ─── 업로드 ──────────────────────────────────────────────
define('UPLOAD_DIR', APP_ROOT . '/public/uploads/');
define('UPLOAD_URL', SITE_URL . '/uploads/');
define('UPLOAD_MAX_MB', 5);

// ─── 세션 보안 ───────────────────────────────────────────
ini_set('session.cookie_httponly', 1);
ini_set('session.use_strict_mode', 1);
