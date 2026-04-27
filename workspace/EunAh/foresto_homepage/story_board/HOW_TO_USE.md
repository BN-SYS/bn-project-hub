# 스토리보드 뷰어 — 사용 가이드

> 수정 파일: `data/` 폴더 + `capture.ps1` 상단 배열만.
> `css/`, `js/`, `index.html` 은 건드리지 않는다.

---

## 파일 구조

```
story_board/
├── index.html              ← 뷰어. 수정 금지.
├── capture.ps1             ★ 스크린샷 자동 캡처
├── HOW_TO_USE.html         ← 이 문서
├── css/sb.css              ← 스타일. 수정 금지.
├── js/sb.js                ← 앱 로직. 수정 금지.
├── data/
│   ├── config.js           ★ 프로젝트명·버전·작성자
│   ├── pages.js            ★ 화면 목록
│   └── specs/
│       ├── _template.js       스펙 파일 템플릿
│       └── A01.js 등          화면별 스펙
└── images/                 ★ 스크린샷 PNG (자동 생성)
```

---

## 새 프로젝트 세팅

### 1. 폴더 복사
`story_board/` 통째 복사. `images/` 안 PNG와 `data/specs/`의 기존 파일(`_template.js` 제외) 삭제.

### 2. config.js 수정
```js
window.SB_CONFIG = {
  projectName : '프로젝트명',
  version     : 'v1.0',
  subtitle    : '개발 전달용',
  author      : '작성자',
};
```

### 3. pages.js 작성
```js
window.PAGES = [
  {
    id      : 'U01',
    section : 'user',           // 'doc' | 'user' | 'admin'
    group   : '메인',
    name    : '홈 메인',
    path    : '../outputs/index.html',
    img     : 'U01_홈_메인.png',
    tags    : [],
    desc    : '이 화면의 설명',
  },
];
```

### 4. capture.ps1 배열 업데이트
pages.js에 화면 추가할 때마다 capture.ps1 최상단의 `$userPages` / `$adminPages` 배열도 동일하게 맞춘다.

---

## 캡처 실행

```powershell
cd "C:\...\story_board"
.\capture.ps1
```

### 캡처 동작
| 항목 | 동작 |
|---|---|
| 해상도 | 1920px 폭, 높이 자동 |
| 모달 | 트리거 자동 탐지 → 추가 캡처 (`_modal1.png`) |
| 여백 | min-height 자동 제거 |
| fixed 헤더 | relative 전환 |

### 문제 해결
| 증상 | 해결 |
|---|---|
| FAIL | `$chrome` 경로 확인 |
| SKIP | HTML 파일 존재 여부 확인 |
| 이미지 안 나옴 | capture name과 pages.js img 일치 확인 |
| 하단 여백 | `$waitMs` 조정 후 재캡처 |

---

## ID 규칙

| 섹션 | 형식 | 예시 |
|---|---|---|
| 프로젝트 문서 | `DOC-##` | DOC-01 |
| 사용자 | `U##` | U01 |
| 관리자 | `A##` | A01 |

---

## 태그 목록

| 태그 | 의미 |
|---|---|
| `list` | 목록형 |
| `detail` | 상세 |
| `form` | 입력 폼 |
| `write` | 등록/수정 |
| `modal` | 모달 포함 |
| `auth` | 로그인 필요 |
| `member-only` | 회원 전용 |
| `admin-only` | 관리자 전용 |
| `static` | 정적 페이지 |

---

## 스펙 파일 작성

1. `_template.js` 복사
2. 파일명: ID에서 하이픈 제거 (DOC-05 → DOC05.js)
3. 최상단 키를 실제 ID로 변경
4. 저장하면 자동 연결

---

## 뷰어 조작

| 동작 | 방법 |
|---|---|
| 화면 열기 | 카드 또는 사이드바 클릭 |
| 목록 복귀 | ← 목록 또는 Esc |
| 이전/다음 | 상단 버튼 또는 ← → |
| 이미지 확대 | 상세 이미지 클릭 |
| 섹션 필터 | 전체/문서/사용자/관리자 |
| 검색 | 상단 검색창 |
| PDF | 상단 PDF 버튼 |

---

## 수정 가능 / 금지

| 파일 | 수정 |
|---|---|
| `data/config.js` | ✅ |
| `data/pages.js` | ✅ |
| `data/specs/*.js` | ✅ |
| `images/*.png` | ✅ |
| `capture.ps1` | ✅ (배열만) |
| `index.html` | ❌ |
| `css/sb.css` | ❌ |
| `js/sb.js` | ❌ |
