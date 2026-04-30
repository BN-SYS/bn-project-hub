# YNballet-academy — PM 자동화 설정

## 에이전트 버전
- system-version: pm-automation-v2.1

## 프로젝트 정보
- 프로젝트명: 발레아카데미 웹사이트 구축
- 클라이언트: YN발레아카데미
- PM: eunahp86@gmail.com
- 작성일: 2026-04-22

## 기술 스택
- 백엔드: PHP
- DB: MySQL
- 프레임워크: Bootstrap (반응형), Quill.js (에디터)
- 서버: Apache (XAMPP 로컬 개발)

## API 규칙
- 사용자: /api/
- 관리자: /admin/api/
- 인증: 세션 기반 (단일 하드코딩 계정)

## 이미지 업로드
- 엔드포인트: /admin/upload_image.php
- 저장 경로: /uploads/
- 허용 확장자: jpg, jpeg, png, gif, webp (MIME 타입 병행 검증)
- 파일명: uniqid() 랜덤화

## 주요 기술 결정
- 관리자 계정: 하드코딩 단일 계정 (password_hash 적용)
- 공지 삭제: 물리 삭제 X, is_active=0 숨김 처리
- 썸네일: Quill 본문 첫 번째 img src 자동 추출
- 문의 비밀번호: password_hash()/password_verify()
- SQL: mysqli prepared statement 전면 적용

## 개발 구조
- 기준: PHP MVC 패턴 (.claude/CLAUDE.md PHP 개발 구조 기준 참조)
- 진입점: dev/public/index.php (Front Controller)
- 라우팅: dev/routes/web.php
- XAMPP DocumentRoot: dev/public/
- URL 베이스: http://localhost/yn_ballet (dev/public/ 기준)

## 환경
- 스토리보드 캡처: PowerShell 7+ (Windows: `powershell` / Mac: `pwsh`)
- Chrome: 자동 탐색 (Windows 경로 + Mac /Applications/ + PATH)
