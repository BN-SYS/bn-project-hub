// =========================================================
// agent-files-3-proj.js — v2.0 프로젝트 템플릿
// =========================================================

function toB64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

var FILE_DEFS = window.FILE_DEFS || [];
var RAW_B64 = window.RAW_B64 || {};

// ═══════════════════════════════════════════════════════════
//  루트 CLAUDE.md
// ═══════════════════════════════════════════════════════════

RAW_B64['root_claude'] = toB64(
'# BN_SYSTEM — PM 업무 자동화 워크스페이스 v2.0\n\
\n\
## 구조\n\
```\n\
BN_SYSTEM/\n\
├── .claude/              ← 전역 설정\n\
├── _agents/              ← 에이전트 원본 6개\n\
├── _sb_template/         ← 스토리보드 공통 세트\n\
├── workspace/            ← 프로젝트별 폴더\n\
│   └── <프로젝트명>/\n\
│       ├── .claude/agents/  ← _agents/ 자동 복사\n\
│       ├── CLAUDE.md\n\
│       ├── project_state.json\n\
│       └── 01~09 폴더\n\
└── CLAUDE.md             ← 이 파일\n\
```\n\
\n\
## 사용법\n\
1. 루트에서 `claude` 실행\n\
2. "[프로젝트명] 프로젝트 폴더 생성해줘"\n\
3. 생성된 폴더로 이동: `cd workspace/<프로젝트명>`\n\
4. `claude` 실행 후 작업 시작\n\
\n\
## 에이전트 구성 (6개)\n\
| 에이전트 | 담당 | 역할 |\n\
|---|---|---|\n\
| pm-assistant | 전체 | 초기화·상태·자동진행 |\n\
| planning-agent | 1~3 | RFP→기획→요구사항 |\n\
| storyboard-agent | 4 | 프로토타입·스펙·검수·피드백 |\n\
| dev-qa-agent | 5~6 | 개발전달·QA |\n\
| delivery-agent | 7~8 | 납품·피드백관리 |\n\
| client-comms | 9 | 커뮤니케이션 |\n\
\n\
## 프로세스\n\
프로토타입 우선 제작 → 고객과 함께 보며 디자인/레이아웃 반복 조정\n\
\n\
## 버전: PM 자동화 v2.0\n\
'
);

// ═══════════════════════════════════════════════════════════
//  프로젝트 CLAUDE.md (참고용 — pm-assistant가 자동 생성)
// ═══════════════════════════════════════════════════════════

RAW_B64['proj_claude'] = toB64(
'# 프로젝트명 — PM 자동화 설정\n\
\n\
## 에이전트 버전\n\
- system-version: pm-automation-v2.0\n\
\n\
## 프로젝트 정보\n\
- 프로젝트명:\n\
- 클라이언트:\n\
- PM:\n\
- 작성일:\n\
\n\
## 기술 스택\n\
- 백엔드:\n\
- DB:\n\
- 프레임워크:\n\
\n\
## API 규칙\n\
- 사용자: /api/\n\
- 관리자: /admin/api/\n\
- 인증:\n\
\n\
## 공수 산정 오버라이드 (필요 시)\n\
# 기본값은 planning-agent 내장 기준\n\
\n\
## 환경\n\
- 스토리보드 캡처: Windows PowerShell 필수\n\
- Chrome: 자동 탐색\n\
'
);

// ═══════════════════════════════════════════════════════════
//  pages.json 샘플
// ═══════════════════════════════════════════════════════════

RAW_B64['proj_pagesjson'] = toB64(
'[\n\
  {\n\
    "id": "DOC-01",\n\
    "section": "doc",\n\
    "group": "Documents",\n\
    "name": "Document History",\n\
    "path": "#",\n\
    "img": "doc-history.png",\n\
    "tags": [],\n\
    "desc": "문서 버전 이력"\n\
  },\n\
  {\n\
    "id": "U01",\n\
    "section": "user",\n\
    "group": "메인",\n\
    "name": "홈 메인",\n\
    "path": "../outputs/index.html",\n\
    "img": "U01_홈_메인.png",\n\
    "tags": [],\n\
    "desc": "사이트 진입점"\n\
  },\n\
  {\n\
    "id": "A01",\n\
    "section": "admin",\n\
    "group": "회원관리",\n\
    "name": "회원 목록",\n\
    "path": "../outputs/admin/members.html",\n\
    "img": "A01_회원_목록.png",\n\
    "tags": [],\n\
    "desc": "전체 회원 목록"\n\
  }\n\
]\n\
'
);

// ─────────────────────────────────────────
// FILE_DEFS 등록 — 프로젝트 템플릿
// ─────────────────────────────────────────

FILE_DEFS.push(
  { group:'proj', key:'root_claude',    filename:'CLAUDE.md (루트)',        icon:'🏠', path:'BN_SYSTEM/CLAUDE.md',                          tags:['루트안내'],           desc:'루트 진입점. 사용법 + 6개 에이전트 구성.',              b64: RAW_B64['root_claude'] },
  { group:'proj', key:'proj_claude',    filename:'CLAUDE.md (프로젝트)',    icon:'📌', path:'workspace/<프로젝트명>/CLAUDE.md',              tags:['프로젝트설정'],       desc:'프로젝트 고유 설정. pm-assistant가 자동 생성.',         b64: RAW_B64['proj_claude'] },
  { group:'proj', key:'proj_pagesjson', filename:'pages.json (샘플)',       icon:'📋', path:'04_storyboard/story_board/data/pages.json',    tags:['단일소스','샘플'],    desc:'pages.json 샘플. 실제로는 planning-agent가 생성.',     b64: RAW_B64['proj_pagesjson'] }
);

window.FILE_DEFS = FILE_DEFS;
