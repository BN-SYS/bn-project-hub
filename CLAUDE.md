# BN_SYSTEM — PM 업무 자동화 워크스페이스 v2.1

## 구조
```
BN_SYSTEM/
├── .claude/              ← 전역 설정·공통 원칙
├── _agents/              ← 에이전트 원본 6개
├── _sb_template/         ← 스토리보드 공통 세트
├── _shared/              ← 프로젝트 공통 에셋 (editor 등)
├── _tools/               ← PM 공통 도구 (견적산정, 견적서생성 등)
├── workspace/            ← 담당자별 폴더
│   └── <담당자명>/
│       └── <프로젝트명>/
│           ├── .claude/agents/  ← _agents/ 자동 복사
│           ├── CLAUDE.md
│           ├── project_state.json
│           └── 01~09 폴더
└── CLAUDE.md             ← 이 파일
```

## 사용법 (v2.1 — 루트에서 전체 진행 가능)
1. 루트에서 `claude` 실행
2. "[담당자] / [프로젝트명] 프로젝트 시작해줘"
3. RFP를 바로 붙여넣으면 → 기획 자동 시작 (cd 불필요)
4. --auto 플래그: PM 필수 개입 지점 외 자동 진행

## 에이전트 구성 (6개)
| 에이전트 | 담당 | 역할 |
|---|---|---|
| pm-assistant | 전체 | 오케스트레이터 — 초기화·상태·병렬 실행·자율 의사결정 |
| planning-agent | 1~3 | RFP→기획→요구사항 |
| storyboard-agent | 4 | 프로토타입(개발자 주석)·스펙·검수·피드백 |
| dev-qa-agent | 5~6 | 개발전달(코드예시)·QA |
| delivery-agent | 7~8 | 납품·피드백관리 |
| client-comms | 9 | 커뮤니케이션 (background 실행) |

## 병렬 실행 원칙
- client-comms는 모든 phase에서 background 실행 — 메인 체인 블로킹 없음
- --auto 모드: PM 필수 개입 지점(WBS 검토, pages_draft 승격, 고객 피드백, 납품) 외 자동 진행
- 자동 승인: build_state failCount==0 이면 04→05 자동 전환

## 역할 경계 · CSS/JS 분리 원칙
상세 규칙: `.claude/CLAUDE.md` — View 작업 경계, CSS/JS 분리, 고객 피드백 반영 규칙 참조.

## 키 파일 관리 원칙
- DB 비밀번호·API 키·관리자 계정 등 민감 정보는 반드시 분리 저장 (절대 커밋 금지)
- PHP: `config/config.php` (gitignore) + `config/config.example.php` (커밋) 쌍으로 관리
- HTML/JS: `.env` (gitignore) + `.env.example` (커밋) 쌍으로 관리
- 유료 라이선스 에셋: `_shared/_licensed/` 저장 (gitignore)
- 상세 규칙: `.claude/CLAUDE.md` — 키 파일 관리 규칙 참조

## 개발자 산출물 기준
- 프로토타입 HTML: 화면헤더·섹션·폼·API 주석 필수 (storyboard-agent 규칙 참조)
- api_spec.md: Request/Response 예시 + 에러 케이스 표 포함 (dev-qa-agent 규칙 참조)
- cascade: 파일 수정 시 연관 문서 자동 최신화 (.claude/CLAUDE.md 매트릭스 참조)

## 프로세스
프로토타입 우선 제작 → 고객과 함께 보며 디자인/레이아웃 반복 조정

## 버전: PM 자동화 v2.1
