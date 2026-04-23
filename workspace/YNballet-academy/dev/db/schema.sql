-- YN발레아카데미 데이터베이스 스키마
-- DB: yn_ballet | Charset: utf8mb4

CREATE DATABASE IF NOT EXISTS yn_ballet
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE yn_ballet;

-- ─────────────────────────────────────
-- 공지사항
-- ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS notice (
  id          INT          NOT NULL AUTO_INCREMENT,
  title       VARCHAR(200) NOT NULL,
  content     LONGTEXT     NOT NULL,
  thumbnail   VARCHAR(500) NULL COMMENT '본문 첫 img src 자동 추출',
  is_pinned   TINYINT(1)   NOT NULL DEFAULT 0 COMMENT '상단고정 여부',
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_active_created (is_active, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────
-- 과정
-- ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS course (
  id              INT          NOT NULL AUTO_INCREMENT,
  title           VARCHAR(100) NOT NULL,
  category        VARCHAR(20)  NOT NULL COMMENT 'somatic | adult_ballet | etc',
  level_badge     VARCHAR(20)  NULL,
  target          VARCHAR(100) NULL COMMENT '수강 조건',
  class_structure VARCHAR(200) NULL COMMENT '수업 구성',
  fee             VARCHAR(100) NULL COMMENT '수강료 (개인레슨: 문의 후 안내)',
  description     VARCHAR(500) NULL,
  is_active       TINYINT(1)   NOT NULL DEFAULT 1,
  sort_order      INT          NOT NULL DEFAULT 0 COMMENT '카테고리 내 순서',
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_category_sort (category, sort_order),
  KEY idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────
-- 문의
-- ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS inquiry (
  id              INT          NOT NULL AUTO_INCREMENT,
  name            VARCHAR(20)  NOT NULL,
  contact         VARCHAR(20)  NOT NULL,
  course_interest VARCHAR(100) NULL COMMENT '관심 과정명 (텍스트)',
  content         TEXT         NOT NULL,
  password        VARCHAR(255) NOT NULL COMMENT 'password_hash()',
  answer          TEXT         NULL COMMENT '사용자에게 공개되는 답변',
  admin_memo      TEXT         NULL COMMENT '관리자 내부 메모 (비공개)',
  status          TINYINT(1)   NOT NULL DEFAULT 0 COMMENT '0=미답변 1=답변완료 2=보류',
  answered_at     DATETIME     NULL COMMENT '최초 답변 시각만 기록',
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_status_created (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────
-- 과정 카테고리
-- ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS course_category (
  id         INT         NOT NULL AUTO_INCREMENT,
  name       VARCHAR(50) NOT NULL COMMENT '카테고리명 (course.category 텍스트와 동일)',
  sort_order INT         NOT NULL DEFAULT 0,
  created_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_name (name),
  KEY idx_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────
-- 초기 과정 데이터 (8개)
-- ─────────────────────────────────────
INSERT INTO course (title, category, level_badge, target, class_structure, fee, description, is_active, sort_order) VALUES
-- 소매틱+발레 스트레칭
('소매틱+발레 스트레칭', 'somatic', '전 연령 성인', '운동 경험 무관', '소매틱 호흡 · 척추 이완 · 발레 스트레칭', '[임시] 금액', '소매틱 원리와 발레 스트레칭을 결합한 몸 이완 수업입니다. 운동 경험에 관계없이 누구나 참여 가능합니다.', 1, 1),
-- 성인 발레
('입문반', 'adult_ballet', '입문', '발레 첫 시작', '매트 · 손 허리바 · 기초 센터', '[임시] 금액', '발레를 처음 시작하는 분들을 위한 과정입니다. 기본 자세와 용어를 익히며 발레의 아름다움을 경험합니다.', 1, 1),
('기초반', 'adult_ballet', '기초', '배운 경험 6개월 이상', '바 워크 · 기초 센터 · 간단한 포인트', '[임시] 금액', '기본기를 다지는 과정으로, 바 동작과 센터 워크를 체계적으로 학습합니다.', 1, 2),
('Lv.1반', 'adult_ballet', 'Lv.1', '기초반 수료 또는 동급 실력', '바 워크 심화 · 센터 · 소규모 조합', '[임시] 금액', '바 동작의 심화 학습과 센터 조합 동작을 통해 발레 표현력을 키우는 과정입니다.', 1, 3),
('Lv.1.5반', 'adult_ballet', 'Lv.1.5', 'Lv.1반 수료 또는 동급 실력', '바 전 과정 · 센터 조합 · 포인트슈즈 입문', '[임시] 금액', 'Lv.1 이후 단계로, 다양한 조합 동작과 포인트슈즈를 시작하는 분들을 위한 과정입니다.', 1, 4),
-- 기타 과정
('개인레슨', 'etc', NULL, '전 연령 성인', '1:1 맞춤 커리큘럼', '문의 후 안내', '수강생의 목적과 수준에 맞춘 1:1 개인 레슨입니다. 일정 및 요금은 문의 후 안내드립니다.', 1, 1),
('유아반', 'etc', '[임시] 미정', '[임시] 연령 기준 미정', '[임시] 수업 구성 미정', '[임시] 미정', '[임시] 유아반 과정 설명이 들어갑니다. 연령 기준·수업 구성·수강료 미정.', 1, 2),
('청소년반', 'etc', '[임시] 미정', '[임시] 연령 기준 미정', '[임시] 수업 구성 미정', '[임시] 미정', '[임시] 청소년반 과정 설명이 들어갑니다. 연령 기준·수업 구성·수강료 미정.', 1, 3);

-- ─────────────────────────────────────
-- 기존 DB 마이그레이션 (이미 테이블이 있는 경우 실행)
-- ─────────────────────────────────────
ALTER TABLE inquiry
  ADD COLUMN IF NOT EXISTS admin_memo TEXT NULL COMMENT '관리자 내부 메모 (비공개)'
  AFTER answer;

ALTER TABLE notice
  ADD COLUMN IF NOT EXISTS is_pinned TINYINT(1) NOT NULL DEFAULT 0 COMMENT '상단고정 여부'
  AFTER thumbnail;

-- 팝업 테이블이 없는 경우 생성
CREATE TABLE IF NOT EXISTS popup (
  id            INT          NOT NULL AUTO_INCREMENT,
  title         VARCHAR(100) NOT NULL COMMENT '관리자 식별용 제목',
  content       LONGTEXT     NOT NULL COMMENT 'Quill HTML 내용',
  display_start DATE         NOT NULL COMMENT '노출 시작일',
  display_end   DATE         NOT NULL COMMENT '노출 종료일',
  pos_top       INT          NOT NULL DEFAULT 100  COMMENT '세로 위치 (px, 데스크탑)',
  pos_left      INT          NOT NULL DEFAULT 100  COMMENT '가로 위치 (px, 데스크탑)',
  width         INT          NOT NULL DEFAULT 400  COMMENT '너비 (px, 데스크탑)',
  height        INT          NOT NULL DEFAULT 300  COMMENT '높이 (px, 데스크탑)',
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  sort_order    INT          NOT NULL DEFAULT 0,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_active_date (is_active, display_start, display_end)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- course_category 테이블이 없는 경우 생성
CREATE TABLE IF NOT EXISTS course_category (
  id         INT         NOT NULL AUTO_INCREMENT,
  name       VARCHAR(50) NOT NULL,
  sort_order INT         NOT NULL DEFAULT 0,
  created_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_name (name),
  KEY idx_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
