# PM 업무 자동화 시스템 v2.1 — 회사 공통 원칙

## 시스템 개요
웹에이전시 PM 업무 전체를 6개 에이전트로 자동화.
프로토타입 우선 제작 → 고객 피드백 기반 디자인/레이아웃 반복 조정.
**client-comms는 항상 background 실행** — 메인 체인을 블로킹하지 않는다.

## 에이전트 구성 (6개)
| 에이전트 | 담당 모듈 | 역할 |
|---|---|---|
| pm-assistant | 전체 | 오케스트레이터 — 초기화·상태·병렬 진행·자율 의사결정 |
| planning-agent | 1~3 | RFP 분석 → 기획서·WBS → 요구사항 정의서 |
| storyboard-agent | 4 | 프로토타입 HTML(개발자 주석 포함)·스펙·검수·피드백 반영 |
| dev-qa-agent | 5~6 | 개발 전달 문서·API 명세(코드 예시 포함)·QA 체크리스트 |
| delivery-agent | 7~8 | 납품 패키징·피드백 이력 관리 |
| client-comms | 9 | 클라이언트 이메일·회의록·커뮤니케이션 이력 (background) |

## 프로젝트 시작 방법
"[담당자] / [프로젝트명] 프로젝트 시작해줘" → pm-assistant 자동 실행:
1. workspace/<담당자>/<프로젝트명>/ 폴더 구조 생성
2. 에이전트 6개 + SB 템플릿 + QEditor 파일 복사
3. project_state.json + CLAUDE.md 생성 (담당자명 자동 기입)
4. **RFP 즉시 투입 유도** — cd 없이 루트에서 바로 이어서 기획 시작 가능

## 병렬 실행 아키텍처
```
[메인 체인 — 순차 필수]          [background — 병렬]
planning 모듈1                   ←
planning 모듈2          ──────→  client-comms (01 완료 보고)
planning 모듈3          ──────→  client-comms (02 완료 보고)
[STOP: PM WBS 검토]
[STOP: PM pages_draft 검토]
storyboard 모듈4        ──────→  client-comms (03 완료 보고)
[STOP: PM 피드백/컨펌]
dev-qa 모듈5+6          ──────→  client-comms (04 완료 보고)
delivery 모듈7          ──────→  client-comms (05+06 완료 보고)
[STOP: PM 실제 납품]
```

## 자율 의사결정 임계값 (PM 개입 없이 자동 승인)
| 체크포인트 | 조건 |
|------------|------|
| 04 → 05 전환 | build_state.step=="done" AND failCount==0 |
| 05 완료 확인 | api_spec.md 줄수 > 5 |
| 06 완료 확인 | qa_checklist.json tests > 0 |

## PM 필수 개입 지점 (자동 불가)
- RFP 원문 투입 | WBS 공수 검토 | pages_draft 승격 | 고객 피드백 전달 | 최종 컨펌 | 실제 납품

## cascade 업데이트 매트릭스
| 변경 파일 | 연동 갱신 대상 |
|----------|--------------|
| pages.json (화면 추가/삭제) | 요구사항_정의서.md, specs/*.js+meta.json |
| specs/{ID}.js | specs/{ID}.meta.json (동시 필수) |
| api_spec.md | qa_checklist.json (API 실패 TC) |
| wbs.json | milestones.md |
| feedback_log.json (open) | qa_checklist.json (re-open) |
| feedback_log.json (resolved) | qa_checklist.json (pending 초기화) |
| project_state.json (phase) | currentPhase, lastUpdated 동시 갱신 |

## 개발자 산출물 품질 기준
프로토타입 HTML — 개발자 주석 필수:
- 화면 헤더: SCREEN/PATH/SPEC/APIs
- 섹션 경계: [SECTION: 이름] ... [/SECTION: 이름]
- 폼: [FORM: id] + 각 필드 검증 규칙
- 동적 영역: [API-DATA] + endpoint + 빈 상태/에러 상태

api_spec.md — 개발자 바로 구현 가능 수준:
- Request 파라미터 표 + Response JSON 예시
- 에러 케이스 표 + 프론트 구현 참고 사항
- 추정 API는 별도 섹션으로 분리 (⚠️ 확인 필요)

## 데이터 체인
RFP원문 → 기능목록.json → 기획서 → 요구사항_정의서 → pages_draft.json
→ pages.json → 프로토타입HTML(개발자주석) → specs + specs.meta.json
→ **단위테스트_시나리오.xlsx** (자동 생성)
→ api_spec(코드예시) → QA체크리스트 → 납품패키지 → 피드백이력
+ 커뮤니케이션이력 (background, 상시)

## 테스트 시나리오 자동 생성
- **스크립트**: `_shared/scripts/generate_test_scenario.js`
- **실행**: `node "_shared/scripts/generate_test_scenario.js" <project_root>`
- **트리거**: storyboard 전체 완료 직후 / 피드백으로 HTML 변경될 때마다
- **출력**: `06_qa/단위테스트_시나리오.xlsx` (사용자·관리자 시트 분리)
- **병합**: 기존 파일의 검수결과·검수자·검수일·비고·담당자 자동 보존
- **생성 근거**: HTML 개발자 주석 (SCREEN·FORM·API-DATA·SECTION) 파싱
- **의존**: Node.js + `_shared/scripts/node_modules/xlsx`

## 토큰 절감 규칙
- overview 필드: 에이전트 간 이전 모듈 파일 전체 Read 대신 overview 참조
- specs.meta.json: specs 전문 대신 경량 메타 사용 (모듈 5~6)
- client-comms: 인라인 단계 정보 → project_state Read 생략, 1톤 기본 출력
- pipeline.ps1: 캡처~추출을 스크립트로 처리
- planning-agent 연속 실행: 이전 모듈에서 방금 갱신한 overview 재Read 생략
- background 에이전트: 메인 체인 블로킹 없이 병렬 처리

## 환경
- 스토리보드 캡처: Windows PowerShell 5.1+ (PS 7+ 권장)
- 기타 모듈: OS 무관
- 버전: PM 자동화 v2.1

---

## PHP 개발 구조 기준 (v1.0)

### 기술 스택
- Backend: PHP / Database: MySQL / Architecture: MVC 패턴

### 디렉토리 구조 (표준)
```
dev/
├── app/
│   ├── controllers/          ← 요청 처리·흐름 제어만
│   │   └── admin/
│   ├── models/               ← DB 접근·데이터 처리 전담
│   ├── helpers/              ← Auth, 공통 유틸 함수
│   └── views/                ← 화면 출력만 (로직 금지)
│       ├── layouts/          ← main.php, admin.php
│       └── admin/
├── core/
│   ├── Router.php
│   ├── Controller.php
│   └── Database.php
├── config/
│   └── config.php
├── routes/
│   └── web.php
└── public/                   ← DocumentRoot (XAMPP 설정)
    ├── index.php             ← Front Controller (단일 진입점)
    ├── .htaccess
    └── assets/
        ├── css/              ← main.css, admin.css + 페이지별
        ├── js/               ← main.js, admin.js + 페이지별
        ├── images/
        └── libs/
```

### MVC 역할 분리 규칙
| 레이어 | 규칙 |
|--------|------|
| Controller | DB 쿼리 금지 — Model 메서드 호출 후 View에 전달 |
| Model | 비즈니스 로직이 많으면 Service 레이어 분리 |
| View | `echo`, 조건 출력만 — DB·비즈니스 로직 금지 |
| Helper | 동일 로직 2회 이상 반복 시 반드시 분리 |

### assets 관리 규칙
- CSS/JS는 반드시 `public/assets/` 하위
- 인라인 스타일·스크립트 최소화 (이벤트 핸들러 수준만 허용)
- 페이지별 CSS/JS는 분리 후 해당 페이지에서만 로드

### 금지 사항
- View 파일 내 DB 쿼리 또는 복잡한 로직 작성
- `public/assets/` 외부에 CSS/JS 파일 생성
- 동일 기능 여러 파일에 중복 작성 (DRY 원칙)
- 단일 파일로 기능 구현 (구조 없는 flat PHP)
- HTML 내부 PHP 로직 과도 혼합
