# 멘사코리아 회지 제작 자동화 시스템 — PM 자동화 설정

## 에이전트 버전
- system-version: pm-automation-v2.1

## 프로젝트 정보
- 프로젝트명: 멘사코리아 회지 제작 자동화 시스템
- 클라이언트: 멘사코리아
- PM: eunahp86@gmail.com
- 작성일: 2026-04-30

## 기술 스택
- 백엔드: PHP (MVC 패턴, 회사 표준 구조)
- DB: MySQL
- 관리자 UI: Velzon 4.4.1 (`_shared/Velzon_4.4.1/`)
- 에디터: Quill.js (WYSIWYG, 스타일 태그 버튼 커스텀)
- Diff 엔진: diff-match-patch (변경 추적)
- Export: PHPWord (워드 .docx 생성)

## 프로젝트 루트
`workspace/EunAh/mensa-korea-journal/`

## API 규칙
- 사용자(작성자): /api/
- 관리자(담당자): /admin/api/
- 인증: 세션 기반 (관리자 단일 계정)

## 핵심 도메인 개념
- **원고(Article)**: 제목·작성자·본문·이미지·캡션 단위 데이터
- **스타일 태그**: ♣(사진) ♥(소제목강조) ★(질문) ●(진하게) ■(강조A) ◈(강조B)
- **사진 채번**: 전체 원고 순서 기준 ♣01, ♣02... 자동 부여·재정렬
- **Export**: 태그 포함 취합본 → .docx 다운로드 (Phase 1 필수)

## Phase 1 범위 (우선 구축)
1. 웹 기반 원고 입력 폼 (REQ-01)
2. hwp/docx/txt 파일 파싱 및 텍스트 추출 (REQ-02)
3. 서식 자동 정제 (REQ-03)
4. 스타일 태그 삽입 UI — Quill.js 커스텀 버튼 (REQ-08)
5. 사진 자동 번호 채번 및 이미지 업로드 (REQ-10, REQ-11)
6. 원고 순서 드래그 관리 (REQ-14)
7. 워드(.docx) Export (REQ-12)

## Phase 2 범위 (안정화 후)
- 변경 추적(Track Changes) 시각화 (REQ-05)
- 코멘트 기능 (REQ-06)
- 맞춤법 검사 API 연동
- 버전 관리 (REQ-07)

## Phase 3 범위 (장기)
- XML/JSON Export + InDesign 연동 (REQ-13)
- 관리자 페이지 고도화
- 사용 통계 및 이력 조회

## Velzon 사용 지침
- `_shared/Velzon_4.4.1/` 레이아웃·CSS·JS 패턴 참조
- 관리자(담당자) 화면: Velzon admin 레이아웃 적용
- 작성자 원고 입력 폼: 별도 심플 레이아웃 (Velzon 스타일만 참조)

## 환경
- 스토리보드 캡처: Windows PowerShell 5.1+
- Chrome: 자동 탐색
