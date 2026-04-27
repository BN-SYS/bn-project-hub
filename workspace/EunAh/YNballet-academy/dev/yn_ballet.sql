-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- 생성 시간: 26-04-24 05:12
-- 서버 버전: 10.4.32-MariaDB
-- PHP 버전: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 데이터베이스: `yn_ballet`
--

-- --------------------------------------------------------

--
-- 테이블 구조 `banner`
--

CREATE TABLE `banner` (
  `id` int(11) NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `subtitle` varchar(300) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `overlay` enum('dark','light') NOT NULL DEFAULT 'dark',
  `btn1_text` varchar(30) DEFAULT NULL,
  `btn1_url` varchar(500) DEFAULT NULL,
  `btn1_style` varchar(20) NOT NULL DEFAULT 'outline',
  `btn2_text` varchar(30) DEFAULT NULL,
  `btn2_url` varchar(500) DEFAULT NULL,
  `btn2_style` varchar(20) NOT NULL DEFAULT 'gold',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 테이블의 덤프 데이터 `banner`
--

INSERT INTO `banner` (`id`, `title`, `subtitle`, `image`, `overlay`, `btn1_text`, `btn1_url`, `btn1_style`, `btn2_text`, `btn2_url`, `btn2_style`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, '배너관리\r\n테스트입니다', '부제목 테스트', 'http://localhost/YNballet-academy/uploads/img_69eabe4b0f5cb1.80688774.jpg', 'light', '수강 문의하기', 'http://localhost/YNballet-academy/inquiry/write', 'outline', '과정 안내', 'http://localhost/YNballet-academy/course', 'white', 1, 2, '2026-04-24 09:50:40', '2026-04-24 10:18:20'),
(2, '배너 슬라이드 테스트', '슬라이드 되나요?', 'http://localhost/YNballet-academy/uploads/img_69eabe7b8c6d55.96287304.jpg', 'dark', NULL, NULL, 'outline', NULL, NULL, 'white', 1, 1, '2026-04-24 09:51:18', '2026-04-24 10:30:43');

-- --------------------------------------------------------

--
-- 테이블 구조 `class_group`
--

CREATE TABLE `class_group` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `fee` int(11) NOT NULL DEFAULT 0,
  `description` varchar(200) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 테이블의 덤프 데이터 `class_group`
--

INSERT INTO `class_group` (`id`, `name`, `fee`, `description`, `is_active`, `sort_order`, `created_at`) VALUES
(1, '[성인] Lv.0.5', 150000, '월/수 19:00', 1, 1, '2026-04-24 10:53:34'),
(2, '[미취학] Lv.입문', 120000, '화/목 16:00', 1, 2, '2026-04-24 10:54:33');

-- --------------------------------------------------------

--
-- 테이블 구조 `course`
--

CREATE TABLE `course` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `category` varchar(20) NOT NULL COMMENT 'somatic | adult_ballet | etc',
  `level_badge` varchar(20) DEFAULT NULL,
  `target` varchar(100) DEFAULT NULL COMMENT '수강 조건',
  `class_structure` varchar(200) DEFAULT NULL COMMENT '수업 구성',
  `fee` varchar(100) DEFAULT NULL COMMENT '수강료 (개인레슨: 문의 후 안내)',
  `description` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL DEFAULT 0 COMMENT '카테고리 내 순서',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 테이블의 덤프 데이터 `course`
--

INSERT INTO `course` (`id`, `title`, `category`, `level_badge`, `target`, `class_structure`, `fee`, `description`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, '소매틱+발레 스트레칭', 'somatic', '전 연령 성인', '운동 경험 무관', '소매틱 호흡 · 척추 이완 · 발레 스트레칭', '[임시] 금액', '소매틱 원리와 발레 스트레칭을 결합한 몸 이완 수업입니다. 운동 경험에 관계없이 누구나 참여 가능합니다.', 1, 1, '2026-04-22 16:50:36', '2026-04-22 16:50:36'),
(2, '입문반', 'adult_ballet', '입문', '발레 첫 시작', '매트 · 손 허리바 · 기초 센터', '[임시] 금액', '발레를 처음 시작하는 분들을 위한 과정입니다. 기본 자세와 용어를 익히며 발레의 아름다움을 경험합니다.', 1, 1, '2026-04-22 16:50:36', '2026-04-22 16:50:36'),
(3, '기초반', 'adult_ballet', '기초', '배운 경험 6개월 이상', '바 워크 · 기초 센터 · 간단한 포인트', '[임시] 금액', '기본기를 다지는 과정으로, 바 동작과 센터 워크를 체계적으로 학습합니다.', 1, 2, '2026-04-22 16:50:36', '2026-04-22 16:50:36'),
(4, 'Lv.1반', 'adult_ballet', 'Lv.1', '기초반 수료 또는 동급 실력', '바 워크 심화 · 센터 · 소규모 조합', '[임시] 금액', '바 동작의 심화 학습과 센터 조합 동작을 통해 발레 표현력을 키우는 과정입니다.', 1, 3, '2026-04-22 16:50:36', '2026-04-22 16:50:36'),
(5, 'Lv.1.5반', 'adult_ballet', 'Lv.1.5', 'Lv.1반 수료 또는 동급 실력', '바 전 과정 · 센터 조합 · 포인트슈즈 입문', '[임시] 금액', 'Lv.1 이후 단계로, 다양한 조합 동작과 포인트슈즈를 시작하는 분들을 위한 과정입니다.', 1, 4, '2026-04-22 16:50:36', '2026-04-22 16:50:36'),
(6, '개인레슨', 'etc', NULL, '전 연령 성인', '1:1 맞춤 커리큘럼', '문의 후 안내', '수강생의 목적과 수준에 맞춘 1:1 개인 레슨입니다. 일정 및 요금은 문의 후 안내드립니다.', 1, 1, '2026-04-22 16:50:36', '2026-04-22 16:50:36'),
(7, '유아반', 'etc', '[임시] 미정', '[임시] 연령 기준 미정', '[임시] 수업 구성 미정', '[임시] 미정', '[임시] 유아반 과정 설명이 들어갑니다. 연령 기준·수업 구성·수강료 미정.', 1, 2, '2026-04-22 16:50:36', '2026-04-22 16:50:36'),
(8, '청소년반', 'etc', '[임시] 미정', '[임시] 연령 기준 미정', '[임시] 수업 구성 미정', '[임시] 미정', '[임시] 청소년반 과정 설명이 들어갑니다. 연령 기준·수업 구성·수강료 미정.', 1, 3, '2026-04-22 16:50:36', '2026-04-22 16:50:36');

-- --------------------------------------------------------

--
-- 테이블 구조 `course_category`
--

CREATE TABLE `course_category` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 테이블의 덤프 데이터 `course_category`
--

INSERT INTO `course_category` (`id`, `name`, `sort_order`, `created_at`) VALUES
(1, 'adult_ballet', 1, '2026-04-23 10:32:03'),
(2, 'somatic', 2, '2026-04-23 10:32:24'),
(3, 'etc', 3, '2026-04-23 10:32:38');

-- --------------------------------------------------------

--
-- 테이블 구조 `inquiry`
--

CREATE TABLE `inquiry` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `contact` varchar(20) NOT NULL,
  `course_interest` varchar(100) DEFAULT NULL COMMENT '관심 과정명 (텍스트)',
  `content` text NOT NULL,
  `password` varchar(255) NOT NULL COMMENT 'password_hash()',
  `answer` text DEFAULT NULL,
  `admin_memo` text DEFAULT NULL COMMENT '관리자 내부 메모 (비공개)',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0=미답변 1=답변완료 2=보류',
  `answered_at` datetime DEFAULT NULL COMMENT '최초 답변 시각만 기록',
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 테이블의 덤프 데이터 `inquiry`
--

INSERT INTO `inquiry` (`id`, `name`, `contact`, `course_interest`, `content`, `password`, `answer`, `admin_memo`, `status`, `answered_at`, `created_at`) VALUES
(1, '배은아', '01091933200', '입문반', '입문하고싶어요~!\r\n발레배우고싶어요~!', '$2y$10$oqsca0jdP9ftQAIY6JX0ZeibGHjXq2P6bjV/LGlRhISP0I2AC1yju', '유선 연락 드렸습니다. \n감사합니다.', NULL, 1, '2026-04-23 09:31:23', '2026-04-23 09:14:43');

-- --------------------------------------------------------

--
-- 테이블 구조 `member`
--

CREATE TABLE `member` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `gender` char(1) DEFAULT NULL,
  `class_id` int(11) DEFAULT NULL,
  `joined_at` date DEFAULT NULL,
  `suspended_at` date DEFAULT NULL,
  `memo` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 테이블의 덤프 데이터 `member`
--

INSERT INTO `member` (`id`, `name`, `phone`, `email`, `birth_date`, `gender`, `class_id`, `joined_at`, `suspended_at`, `memo`, `is_active`, `created_at`) VALUES
(1, '배은아', '01091933200', 'eunahp86@gmail.com', '1986-12-15', 'F', 1, '2026-05-02', NULL, NULL, 1, '2026-04-24 10:49:42');

-- --------------------------------------------------------

--
-- 테이블 구조 `notice`
--

CREATE TABLE `notice` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `content` longtext NOT NULL,
  `thumbnail` varchar(500) DEFAULT NULL COMMENT '본문 첫 img src 자동 추출',
  `is_pinned` tinyint(1) NOT NULL DEFAULT 0 COMMENT '상단고정 여부',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 테이블의 덤프 데이터 `notice`
--

INSERT INTO `notice` (`id`, `title`, `content`, `thumbnail`, `is_pinned`, `is_active`, `created_at`, `updated_at`) VALUES
(1, '공지사항 1번 테스트', '<p>되는겁니까?</p>', NULL, 1, 1, '2026-04-22 17:07:27', '2026-04-24 10:31:03'),
(2, '공지사항 2번', '<p class=\"ql-align-center\">이미지 테스트.0.</p><p class=\"ql-align-center\"><br></p><p class=\"ql-align-center\"><img src=\"http://localhost/YNballet-academy/uploads/img_69e9702e3693c0.01629792.jpg\"></p>', 'http://localhost/YNballet-academy/uploads/img_69e9702e3693c0.01629792.jpg', 0, 1, '2026-04-22 17:07:51', '2026-04-23 11:52:49');

-- --------------------------------------------------------

--
-- 테이블 구조 `popup`
--

CREATE TABLE `popup` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `content` longtext NOT NULL,
  `display_start` date NOT NULL,
  `display_end` date NOT NULL,
  `pos_top` int(11) NOT NULL DEFAULT 100,
  `pos_left` int(11) NOT NULL DEFAULT 100,
  `width` int(11) NOT NULL DEFAULT 400,
  `height` int(11) NOT NULL DEFAULT 300,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 테이블의 덤프 데이터 `popup`
--

INSERT INTO `popup` (`id`, `title`, `content`, `display_start`, `display_end`, `pos_top`, `pos_left`, `width`, `height`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, '팝업테스트01', '<p>팝업입니다.</p><p><br></p><p><img src=\"http://localhost/YNballet-academy/uploads/img_69e97b7190be50.89047953.jpg\"></p>', '2026-04-23', '2026-04-30', 100, 100, 400, 500, 1, 1, '2026-04-23 10:53:02', '2026-04-23 11:01:37');

-- --------------------------------------------------------

--
-- 테이블 구조 `schedule`
--

CREATE TABLE `schedule` (
  `id` int(11) NOT NULL,
  `event_date` date NOT NULL,
  `title` varchar(50) NOT NULL,
  `color` varchar(7) NOT NULL DEFAULT '#e8915b',
  `is_holiday` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 테이블의 덤프 데이터 `schedule`
--

INSERT INTO `schedule` (`id`, `event_date`, `title`, `color`, `is_holiday`, `created_at`) VALUES
(1, '2026-05-02', '레슨 OPEN', '#2c7be5', 0, '2026-04-24 09:12:24'),
(2, '2026-05-30', '레슨 CLOSE', '#8e44ad', 0, '2026-04-24 09:12:41'),
(3, '2026-05-05', '어린이날', '#e74c3c', 1, '2026-04-24 09:24:45'),
(4, '2026-05-05', '수업진행', '#27ae60', 0, '2026-04-24 09:29:40'),
(5, '2026-05-01', '노동절', '#e74c3c', 1, '2026-04-24 09:31:08'),
(6, '2026-05-24', '부처님오신날', '#e74c3c', 1, '2026-04-24 09:32:13'),
(7, '2026-05-25', '대체공휴일', '#e74c3c', 1, '2026-04-24 09:33:45'),
(8, '2026-04-30', '레슨 CLOSE', '#8e44ad', 0, '2026-04-24 09:48:35');

-- --------------------------------------------------------

--
-- 테이블 구조 `tuition`
--

CREATE TABLE `tuition` (
  `id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `class_id` int(11) DEFAULT NULL,
  `year` smallint(6) NOT NULL,
  `month` tinyint(4) NOT NULL,
  `base_fee` int(11) NOT NULL DEFAULT 0,
  `actual_fee` int(11) NOT NULL DEFAULT 0,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `paid_at` date DEFAULT NULL,
  `memo` varchar(200) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 테이블의 덤프 데이터 `tuition`
--

INSERT INTO `tuition` (`id`, `member_id`, `class_id`, `year`, `month`, `base_fee`, `actual_fee`, `status`, `paid_at`, `memo`, `created_at`) VALUES
(1, 1, 1, 2026, 4, 150000, 150000, 0, NULL, NULL, '2026-04-24 10:59:06'),
(2, 1, 1, 2026, 5, 150000, 120000, 1, '2026-04-24', '지인할인 20%', '2026-04-24 10:59:17');

--
-- 덤프된 테이블의 인덱스
--

--
-- 테이블의 인덱스 `banner`
--
ALTER TABLE `banner`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_active_sort` (`is_active`,`sort_order`);

--
-- 테이블의 인덱스 `class_group`
--
ALTER TABLE `class_group`
  ADD PRIMARY KEY (`id`);

--
-- 테이블의 인덱스 `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_category_sort` (`category`,`sort_order`),
  ADD KEY `idx_active` (`is_active`);

--
-- 테이블의 인덱스 `course_category`
--
ALTER TABLE `course_category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_name` (`name`),
  ADD KEY `idx_sort` (`sort_order`);

--
-- 테이블의 인덱스 `inquiry`
--
ALTER TABLE `inquiry`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_status_created` (`status`,`created_at`);

--
-- 테이블의 인덱스 `member`
--
ALTER TABLE `member`
  ADD PRIMARY KEY (`id`);

--
-- 테이블의 인덱스 `notice`
--
ALTER TABLE `notice`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_active_created` (`is_active`,`created_at`);

--
-- 테이블의 인덱스 `popup`
--
ALTER TABLE `popup`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_active_date` (`is_active`,`display_start`,`display_end`);

--
-- 테이블의 인덱스 `schedule`
--
ALTER TABLE `schedule`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_date` (`event_date`);

--
-- 테이블의 인덱스 `tuition`
--
ALTER TABLE `tuition`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_member_ym` (`member_id`,`year`,`month`);

--
-- 덤프된 테이블의 AUTO_INCREMENT
--

--
-- 테이블의 AUTO_INCREMENT `banner`
--
ALTER TABLE `banner`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- 테이블의 AUTO_INCREMENT `class_group`
--
ALTER TABLE `class_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- 테이블의 AUTO_INCREMENT `course`
--
ALTER TABLE `course`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- 테이블의 AUTO_INCREMENT `course_category`
--
ALTER TABLE `course_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- 테이블의 AUTO_INCREMENT `inquiry`
--
ALTER TABLE `inquiry`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- 테이블의 AUTO_INCREMENT `member`
--
ALTER TABLE `member`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- 테이블의 AUTO_INCREMENT `notice`
--
ALTER TABLE `notice`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- 테이블의 AUTO_INCREMENT `popup`
--
ALTER TABLE `popup`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- 테이블의 AUTO_INCREMENT `schedule`
--
ALTER TABLE `schedule`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- 테이블의 AUTO_INCREMENT `tuition`
--
ALTER TABLE `tuition`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

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

