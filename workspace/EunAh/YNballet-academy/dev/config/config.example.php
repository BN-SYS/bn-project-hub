<?php

/*
 * ====================================================
 *  이 파일을 복사해서 config.php 로 저장한 뒤 값을 채우세요.
 *  config.php 는 .gitignore 에 포함되어 있습니다 (절대 커밋 금지).
 *
 *  [로컬 XAMPP]
 *    DB_USER   = 'root'
 *    DB_PASS   = ''
 *    DB_NAME   = 'yn_ballet'
 *    SITE_URL  = 'http://localhost/YNballet-academy'
 *    BASE_PATH = '/YNballet-academy'
 *
 *  [카페24 배포]
 *    DB_USER   = '카페24_아이디'
 *    DB_PASS   = '카페24_MySQL_비밀번호'
 *    DB_NAME   = '카페24_아이디'
 *    SITE_URL  = 'https://도메인.com'   (끝에 / 없이)
 *    BASE_PATH = ''
 *
 *  FTP 업로드: dev/ 전체를 /www/ 에 그대로 올리세요.
 *  .htaccess → RewriteBase /  (카페24)
 * ====================================================
 */

// ─── DB ──────────────────────────────────────────────
define('DB_HOST',    'localhost');
define('DB_USER',    'DB_USERNAME');
define('DB_PASS',    'DB_PASSWORD');
define('DB_NAME',    'DB_NAME');
define('DB_CHARSET', 'utf8mb4');

// ─── 관리자 계정 ──────────────────────────────────────
// password_hash('원하는비밀번호', PASSWORD_DEFAULT) 로 생성
define('ADMIN_ID',        'admin');
define('ADMIN_PASS_HASH', 'BCRYPT_HASH_HERE');

// ─── 사이트 설정 ──────────────────────────────────────
define('SITE_NAME',  'YN발레아카데미');
define('SITE_URL',   'http://localhost/YNballet-academy'); // 끝에 / 없이
define('BASE_PATH',  '/YNballet-academy');                 // 카페24: ''

// ─── 업로드 경로 ──────────────────────────────────────
define('UPLOAD_DIR',    APP_ROOT . '/uploads/');
define('UPLOAD_URL',    BASE_PATH . '/uploads/');          // BASE_PATH 기반 (도메인 불필요)
define('UPLOAD_MAX_MB', 5);

// ─── 세션 보안 ────────────────────────────────────────
ini_set('session.cookie_httponly', 1);
ini_set('session.use_strict_mode', 1);
