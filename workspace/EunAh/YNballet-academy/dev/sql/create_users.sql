-- =====================================================
-- users 테이블 (웹사이트 회원)
-- =====================================================
CREATE TABLE IF NOT EXISTS `users` (
  `id`                   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `username`             VARCHAR(30)  NOT NULL,
  `password_hash`        VARCHAR(255) NOT NULL,
  `name`                 VARCHAR(20)  NOT NULL,
  `birth_date`           DATE         NULL,
  `gender`               ENUM('M','F','') NOT NULL DEFAULT '',
  `address_zip`          VARCHAR(10)  NOT NULL DEFAULT '',
  `address1`             VARCHAR(150) NOT NULL DEFAULT '',
  `address2`             VARCHAR(100) NOT NULL DEFAULT '',
  `phone`                VARCHAR(13)  NOT NULL DEFAULT '',
  `email`                VARCHAR(100) NOT NULL,
  `email_verified`       TINYINT(1)   NOT NULL DEFAULT 0,
  `email_verify_code`    VARCHAR(6)   NULL,
  `email_verify_sent_at` DATETIME     NULL,
  `note`                 TEXT         NULL,
  `agree_privacy`        TINYINT(1)   NOT NULL DEFAULT 0,
  `agree_marketing`      TINYINT(1)   NOT NULL DEFAULT 0,
  `is_active`            TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at`           DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`           DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_users_username` (`username`),
  UNIQUE KEY `uq_users_email`    (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- inquiry 테이블: user_id 컬럼 추가 (회원 연동)
-- =====================================================
ALTER TABLE `inquiry`
  ADD COLUMN `user_id` INT UNSIGNED NULL DEFAULT NULL AFTER `id`;
