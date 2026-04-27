# 사용자 페이지 PHP 연동 핸드오프 가이드

> 문서버전: v1.1 | 작성일: 2026-04-13 | 대상: 백엔드·프론트 개발자

---

## 1. 파일 구조 개요

```
outputs/
│
├── 00_DEV_HANDOFF.md          ← 이 문서
│
├── [메인]
│   └── index.html             # 홈 (배너·공지·일정·카운터)
│
├── about/                     # 협회소개
│   ├── greeting.html          # 인사말
│   ├── vision.html            # 미션·비전·핵심가치
│   ├── history.html           # 연혁 (SVG 타임라인)
│   ├── members.html           # 조직도·임원진
│   ├── regions.html           # 전국지역협회 목록
│   ├── region-detail.html     # 지역협회 상세
│   ├── project.html           # 주요사업
│   └── contact.html           # 오시는 길
│
├── education/                 # 숲해설가 교육
│   ├── courses.html           # 강좌 목록 (탭: 전문/기초/직무/아카데미)
│   ├── course-detail.html     # 강좌 상세 + 신청
│   ├── course-intro.html      # 교육과정 소개
│   ├── faq.html               # 자주 묻는 질문
│   ├── reviews.html           # 수료생 후기 목록
│   ├── review-detail.html     # 수료생 후기 상세
│   ├── review-write.html      # 수료생 후기 작성/수정
│   └── forester.html          # 숲해설가란?
│
├── community/                 # 커뮤니티
│   ├── notice.html            # 공지사항 목록
│   ├── notice-detail.html     # 공지사항 상세
│   ├── gallery.html           # 갤러리 목록
│   ├── gallery-detail.html    # 갤러리 상세
│   ├── newsletter.html        # 뉴스레터 목록
│   ├── newsletter-detail.html # 뉴스레터 상세
│   ├── archive.html           # 자료실 목록
│   ├── archive-detail.html    # 자료실 상세
│   ├── press.html             # 언론보도 목록
│   ├── press-detail.html      # 언론보도 상세
│   ├── qna.html               # QnA 목록
│   ├── qna-detail.html        # QnA 상세
│   └── qna-write.html         # QnA 작성
│
├── member/                    # 회원활동
│   ├── clubs.html             # 동아리
│   ├── sagongdan.html         # 숲사공단
│   ├── instructor-apply.html  # 강사활동 신청
│   ├── forest-work.html       # 숲해설 활동 신청
│   ├── mentoring.html         # 멘토링
│   └── competency.html        # 역량강화
│
├── participate/               # 참여
│   ├── donate-info.html       # 후원 안내
│   ├── donate.html            # 후원하기
│   └── membership.html        # 정회원 가입 안내
│
├── mypage/
│   └── index.html             # 마이페이지 (내정보·신청내역·증명서)
│
├── mypage/certificate-preview.html   # 수료증·활동확인서 출력 미리보기
│
├── auth/
│   ├── login.html             # 로그인
│   ├── register.html          # 회원가입
│   └── find.html              # 아이디·비밀번호 찾기
│
└── assets/
    ├── css/
    │   ├── common.css         ← 헤더·푸터·공통 레이아웃
    │   ├── components.css     ← 버튼·폼·테이블·모달 등 공통 컴포넌트
    │   ├── responsive.css     ← 반응형 브레이크포인트
    │   ├── list-common.css    ← 목록형 필터·테이블 공통
    │   ├── variables.css      ← CSS 커스텀 프로퍼티 (색상·타이포·레이아웃)
    │   └── pages/
    │       ├── main.css       ← 홈 전용
    │       ├── about.css      ← 협회소개 전용
    │       ├── education.css  ← 교육 전용
    │       ├── auth.css       ← 로그인·회원가입 전용
    │       ├── mypage.css     ← 마이페이지 전용
    │       ├── participate.css← 참여 전용
    │       └── write.css      ← 글쓰기 폼 공통
    └── js/
        ├── app.js             ← ★ 공통 유틸 + USER_API + UserHttp (전 페이지 공통)
        ├── components/header.js ← 헤더·푸터·LNB 렌더러
        └── pages/
            ├── education.js   ← 강좌 목록·상태 로직 (courses.html 전용)
            ├── about.js       ← 지역협회·연혁 데이터 (regions·history 페이지 전용)
            ├── mypage.js      ← 마이페이지 신청내역·증명서 (mypage 전용)
            └── community-media.js ← 뉴스레터 데이터 (newsletter 전용)
```

---

## 2. 공유 에셋 핵심 구조

### app.js에서 제공하는 것

| 상수/객체 | 설명 |
|---|---|
| `USER_API` | PHP API 엔드포인트 URL 상수 모음 (하단 §4 참조) |
| `UserHttp.get/post/put/delete/upload` | fetch 래퍼. 현재 stub — 실제 요청으로 교체 필요 |
| `App.user` | 세션 사용자 정보 (`{ id, name, role, grade }`) |
| `App.isLoggedIn()` | 로그인 여부 확인 |
| `App.toast(msg, type)` | 토스트 알림 (`'success'` \| `'error'` \| `'warning'` \| `'info'`) |
| `App.openModal(id)` / `App.closeModal(id)` | 모달 열기·닫기 |
| `App.renderPagination(id, page, total, cb)` | 페이지네이션 렌더 |
| `App.fontSize` | 글자크기 조절 버튼 제어 (localStorage 저장) |
| `App.getParam(key)` | URLSearchParams 헬퍼 |

---

## 3. PHP 연동 전환 방법

### Step 1 — USER_API base URL 확정

`assets/js/app.js` 상단의 `USER_API.base`를 실제 서버 경로로 수정한다.

```javascript
// app.js
const USER_API = {
  base: '/api',   // ← 이 값만 수정하면 대부분 자동 반영
  ...
};
```

---

### Step 2 — 샘플 데이터 제거 및 API 호출 전환

아래 파일별로 더미 데이터를 제거하고 `UserHttp` 호출로 교체한다.

#### ① 분리된 JS 파일에 있는 데이터

| JS 파일 | 제거할 변수 | 교체 방법 |
|---|---|---|
| `assets/js/pages/education.js` | `ALL_COURSES_RAW` 배열 전체 | `UserHttp.get(USER_API.courses, {type, status, ...})` 결과로 교체 |
| `assets/js/pages/education.js` | `_setDemoDates()` 함수 전체 | ★ **반드시 제거** — 실제 DB 날짜 사용 시 불필요 |
| `assets/js/pages/about.js` | `REGIONS_DATA` 배열 전체 | `UserHttp.get(USER_API.regions)` 결과로 교체 |
| `assets/js/pages/about.js` | `HISTORY_DATA` 배열 전체 | `UserHttp.get(USER_API.history)` 결과로 교체 |
| `assets/js/pages/mypage.js` | `ALL_APPLY` 배열 전체 | `UserHttp.get(USER_API.myApply)` 결과로 교체 |
| `assets/js/pages/community-media.js` | `NewsletterCtrl.DATA` 배열 | `UserHttp.get(USER_API.newsletter)` 결과로 교체 |

#### ② HTML 파일 내 인라인 `<script>`에 있는 데이터

| HTML 파일 | 제거할 변수 | 교체 방법 |
|---|---|---|
| `index.html` | `NOTICES` 배열 | `UserHttp.get(USER_API.notices, {size:5})` |
| `education/reviews.html` | `REVIEWS_DATA` 배열 | `UserHttp.get(USER_API.reviews)` |
| `about/members.html` | `OFFICER_DATA` 배열 | PHP 템플릿으로 직접 렌더링 또는 `UserHttp.get(USER_API.officers)` |

---

### Step 3 — UserHttp 실제 fetch 활성화

`app.js`의 `UserHttp` 각 메서드 안 `// TODO` 주석 위치에서 교체한다.

**현재 구조 (stub)**
```javascript
get(url, params = {}) {
  // TODO: 실제 fetch 요청으로 교체
  console.log('[UserHttp.get]', url, params);
  return Promise.resolve({ success: true, total: 0, items: [] });
},
```

**전환 후 구조**
```javascript
get(url, params = {}) {
  return fetch(`${url}?${new URLSearchParams(params)}`, {
    headers: this._headers(false),
    credentials: 'same-origin'
  }).then(r => this._handle(r));
},

// _handle 메서드도 주석 해제
_handle(res) {
  if (!res.ok) return res.json().then(e => Promise.reject(e));
  return res.json();
},
```

---

### Step 4 — 세션 확인 활성화

`app.js`의 `App.restoreSession()` 은 현재 `localStorage` 기반 목업 세션을 복원한다.  
실제 연동 시 서버 세션을 기반으로 `App.user` 값을 채우는 로직으로 교체한다.

```javascript
// app.js — restoreSession() 수정
restoreSession() {
  // 실제 연동 시: 세션 API 호출 결과로 App.user 채우기
  // fetch('/api/auth/me').then(r => r.json()).then(d => {
  //   this.user = d.user || null;
  //   this._updateAuthUI();
  // });
},
```

---

## 4. API 엔드포인트 전체 명세

### 공통 규칙

**공통 응답 포맷**
```json
// 목록
{ "success": true, "total": 150, "items": [...] }

// 단건
{ "success": true, "data": { ... } }

// 처리 성공
{ "success": true, "message": "처리되었습니다." }

// 실패
{ "success": false, "message": "오류 내용" }
```

**공통 목록 파라미터**
| 파라미터 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `page` | int | `1` | 페이지 번호 |
| `size` | int | `9` (카드형) / `10` (테이블형) | 페이지당 건수 |

---

### 강좌·교육 — `GET /api/courses`

| 파라미터 | 타입 | 값 | 설명 |
|---|---|---|---|
| `type` | string | `professional` \| `basic` \| `job` \| `academy` | 강좌 유형 (없으면 전체) |
| `status` | string | `open` \| `closed` \| `pending` | 모집 상태 |
| `kw` | string | | 강좌명 검색 |

```json
// 응답 items
{
  "id": 1001,
  "type": "professional",
  "typeLabel": "전문과정",
  "name": "55기 숲해설가 전문가과정",
  "from": "2026-04-01",
  "to": "2026-04-30",
  "date": "2026-04",
  "hours": 170,
  "capacity": 30,
  "enrolled": 12,
  "fee": 1400000,
  "thumbnailUrl": "/uploads/courses/1001_thumb.jpg",
  "status": "open",
  "statusLabel": "접수중"
}
```

> ⚠️ `status` 값은 `from`/`to` 날짜 기준으로 서버가 자동 계산하거나, 관리자가 직접 설정.  
> 프로토타입의 `_setDemoDates()` 함수는 **연동 후 제거** 필요.

---

### 강좌 상세 — `GET /api/courses/:id`

```json
// 응답 data — 목록 항목 + 추가 필드
{
  "id": 1001,
  "type": "professional",
  "typeLabel": "전문과정",
  "name": "55기 숲해설가 전문가과정",
  "from": "2026-04-01",
  "to": "2026-07-31",
  "applyFrom": "2026-03-01",
  "applyTo": "2026-03-31",
  "hours": 170,
  "capacity": 30,
  "enrolled": 12,
  "fee": 1400000,
  "feeNote": "교재비 포함",
  "thumbnailUrl": "/uploads/courses/1001_thumb.jpg",
  "content": "<p>강좌 상세 HTML</p>",
  "attachFiles": [
    { "name": "모집요강.pdf", "url": "/uploads/courses/1001/guide.pdf", "size": "0.8MB" }
  ],
  "status": "open",
  "statusLabel": "접수중",
  "canApply": true
}
```

---

### 강좌 신청 — `POST /api/courses/:id/apply`

```json
// 요청 body
{
  "name": "홍길동",
  "phone": "010-1234-5678",
  "email": "user@foresto.or.kr",
  "birth": "1990-01-01",
  "addr": "서울특별시 종로구 삼청로 00",
  "motivation": "지원 동기"
}
```

---

### 공지사항 — `GET /api/board/notice`

| 파라미터 | 타입 | 설명 |
|---|---|---|
| `kw` | string | 제목 검색 |

```json
// 응답 items
{
  "id": 1,
  "title": "2026년 숲해설가 교육 일정 안내",
  "isPinned": true,
  "viewCount": 245,
  "createdAt": "2026-01-10",
  "attachCount": 2,
  "content": "<p>공지 내용 HTML</p>"
}
```

---

### 갤러리 — `GET /api/board/gallery`

```json
// 응답 items
{
  "id": 1,
  "title": "2025 하반기 수료식 현장",
  "thumbnailUrl": "/uploads/gallery/1_thumb.jpg",
  "imageUrls": ["/uploads/gallery/1_1.jpg", "/uploads/gallery/1_2.jpg"],
  "createdAt": "2025-11-20",
  "content": "<p>갤러리 내용 HTML</p>"
}
```

---

### 뉴스레터 — `GET /api/board/newsletter`

```json
// 응답 items
{
  "id": 1,
  "title": "2026 상반기 뉴스레터",
  "period": "2026 상반기",
  "pdfUrl": "/uploads/newsletter/2026_1.pdf",
  "thumbnailUrl": "/uploads/newsletter/2026_1_thumb.jpg",
  "publishedAt": "2026-03-01"
}
```

---

### 자료실 — `GET /api/board/archive`

| 파라미터 | 타입 | 값 | 설명 |
|---|---|---|---|
| `cat` | string | `edu` \| `form` \| `law` \| `report` | 자료 분류 |
| `kw` | string | | 제목 검색 |

```json
// 응답 items
{
  "id": 1,
  "cat": "edu",
  "catLabel": "교육자료",
  "title": "2026 숲해설 표준 교안",
  "attachFiles": [
    { "name": "교안.pdf", "url": "/uploads/archive/1/guide.pdf", "size": "2.3MB" }
  ],
  "downloadCount": 128,
  "createdAt": "2026-02-15"
}
```

---

### 언론보도 — `GET /api/board/press`

```json
// 응답 items
{
  "id": 1,
  "title": "한국숲해설가협회, 2026 산림교육 대상 수상",
  "media": "조선일보",
  "publishedAt": "2026-03-05",
  "linkUrl": "https://example.com/news/1",
  "thumbnailUrl": "/uploads/press/1_thumb.jpg"
}
```

---

### 캘린더 — `GET /api/calendar`

| 파라미터 | 타입 | 설명 |
|---|---|---|
| `year` | int | 연도 (기본: 현재 연도) |
| `month` | int | 월 (기본: 현재 월) |

```json
// 응답 items
{
  "id": 1,
  "date": "2026-04-15",
  "cat": "edu",
  "catLabel": "교육",
  "title": "55기 전문과정 개강",
  "link": "/education/course-detail.html?id=1001"
}
```

---

### 회원 인증

#### `POST /api/auth/login`
```json
// 요청 body
{ "userId": "forest001", "password": "...", "remember": true }

// 응답 data
{
  "user": {
    "id": 1, "userId": "forest001", "name": "김숲해",
    "role": "member", "grade": "fullMember", "gradeLabel": "정회원"
  }
}
```

#### `POST /api/auth/register`
```json
// 요청 body (multipart/form-data, 첨부파일 포함 가능)
{
  "userId": "forest001", "password": "...",
  "name": "김숲해", "phone": "010-1234-5678",
  "email": "user@foresto.or.kr", "birth": "1990-01-01",
  "gender": "남", "addr": "서울 종로구 삼청로 00",
  "agreeTerms": true, "agreePrivacy": true, "agreeMarketing": false
}
```

#### `POST /api/auth/find-id`
```json
// 요청 body
{ "name": "김숲해", "phone": "010-1234-5678" }

// 응답 data
{ "userId": "fores***1", "registeredAt": "2024-03-15" }
```

#### `POST /api/auth/find-pw`
```json
// 요청 body
{ "userId": "forest001", "email": "user@foresto.or.kr" }

// 응답: 임시 비밀번호 이메일 발송 → { "success": true }
```

---

### 마이페이지

#### `GET /api/my/profile` — 내 정보 조회
```json
// 응답 data
{
  "userId": "forest001", "name": "김숲해",
  "phone": "010-1234-5678", "email": "user@foresto.or.kr",
  "birth": "1990-01-01", "gender": "남",
  "grade": "fullMember", "gradeLabel": "정회원",
  "region": "서울", "club": "나무반지",
  "cohort": "15기", "joinDate": "2024-03-15",
  "affiliation": [
    { "name": "경기남부지회", "joinedAt": "2024-04-01" }
  ]
}
```

#### `PUT /api/my/profile` — 내 정보 수정
```json
// 요청 body (변경 항목만)
{ "phone": "010-9999-0000", "email": "new@foresto.or.kr", "addr": "..." }
```

#### `PUT /api/my/password` — 비밀번호 변경
```json
// 요청 body
{ "current": "현재비밀번호", "new": "새비밀번호" }
```

#### `GET /api/my/apply` — 신청 내역 (교육 + 강사활동 통합)

| 파라미터 | 타입 | 값 | 설명 |
|---|---|---|---|
| `status` | string | `applied` \| `progress` \| `done` \| `cancel` \| `unselected` | 상태 필터 |
| `category` | string | `edu` \| `instructor` | 구분 필터 |

```json
// 응답 items
{
  "id": 1,
  "category": "edu",
  "title": "숲해설가 전문과정 55기",
  "type": "전문과정",
  "date": "2026-03-01",
  "hours": 40,
  "status": "done",
  "statusLabel": "완료",
  "cert": true,
  "reviewed": false
}
```

#### `GET /api/my/certificates/:id` — 수료증·활동확인서 데이터
```json
// 응답 data (certificate-preview.html에 URLSearchParams로 전달)
{
  "type": "cert",
  "certNo": "CRT-2026-001",
  "name": "김숲해",
  "course": "55기 숲해설가 전문과정",
  "date": "2026-07-31",
  "hours": 170
}
```

---

### 신청관리

#### `POST /api/apply/regular` — 정회원 가입신청
#### `POST /api/apply/instructor` — 강사활동 신청
#### `POST /api/apply/forest` — 숲해설 활동 신청
#### `POST /api/apply/donate` — 후원 신청

모두 공통 응답 포맷 (`{ "success": true }`) 사용.

---

### 수료생 후기

#### `GET /api/education/reviews`
```json
// 응답 items
{
  "id": 1,
  "courseTitle": "55기 숲해설가 전문가과정",
  "title": "숲과 함께한 소중한 시간들",
  "content": "<p>후기 내용 HTML</p>",
  "author": "홍길동",
  "date": "2026-03-15",
  "thumbnailUrl": null
}
```

#### `POST /api/education/reviews` — 후기 등록
#### `PUT /api/education/reviews/:id` — 후기 수정
```json
// 요청 body (multipart/form-data, 이미지 포함 가능)
{ "title": "제목", "content": "<p>HTML 내용</p>" }
```

---

## 5. 글자크기 조절 시스템 주의사항

`App.fontSize._apply()` 가 `html`/`body`의 `font-size`와 `--text-*` CSS 변수를 함께 덮어쓴다.

- **`var(--text-*)` 또는 `rem`/`em` 단위** → 글자크기 버튼에 반응함 ✅
- **하드코딩 `px` 단위** → 반응하지 않음 ❌

PHP 템플릿에서 추가하는 스타일은 반드시 `var(--text-*)` 단위를 사용해야 한다.

| CSS 변수 | 기본값 | 용도 |
|---|---|---|
| `--text-xs` | 13px | 보조 텍스트, 날짜, 배지 |
| `--text-sm` | 15px | 레이블, 입력값 |
| `--text-md` | 18px | 본문, 목록 항목 |
| `--text-base` | 20px | 중간 본문 |
| `--text-lg` | 22px | 섹션 타이틀 |
| `--text-xl` | 24px | 페이지 서브 타이틀 |
| `--text-2xl` | 30px | 페이지 타이틀 |
| `--text-3xl` | 36px | 대형 숫자 |

> ⚠️ 헤더 유틸바(`.header-util`) 안의 글자크기 버튼·사이트맵 링크는 **의도적으로 px 고정** — 건드리지 않는다.

---

## 6. 주의사항

### CSRF 토큰
모든 POST·PUT·DELETE 요청에 `X-CSRF-TOKEN` 헤더 자동 포함 (`UserHttp._csrf()` 처리).  
HTML `<head>`에 meta 태그 추가 필요:
```html
<meta name="csrf-token" content="{{ csrf_token() }}">
```

### education.js — `_setDemoDates()` 제거
현재 코드에서 강좌 상태(`접수중`/`준비중`/`마감`)를 현재 날짜 기준으로 **임시 계산**하는 함수다.  
서버에서 실제 날짜 데이터를 내려주면 이 함수는 반드시 제거해야 한다.
```javascript
// education.js 연동 후 이 블록 전체 삭제
(function _setDemoDates() {
  ...
})();
```

### 파일 업로드
- `review-write.html` : SmartEditor2 에디터 내 이미지 → `/api/upload/image` 별도 처리
- `register.html` : 첨부파일 → `FormData`, `UserHttp.upload()` 사용
- `archive` 게시글 첨부파일 다운로드 → 서버 파일 스트리밍

### SmartEditor2
`review-write.html`, `community/qna-write.html`의 에디터는 현재 **목업 상태**.  
실제 연동 시 SmartEditor2 SDK 로드 후 인스턴스 생성 필요.

### 수료증·활동확인서 출력
`certificate-preview.html`은 URLSearchParams를 파싱해서 출력물을 렌더한다.  
실제 연동 시 `certNo` 기반으로 서버에서 데이터를 조회하는 방식으로 전환 권장.

### 비회원 접근 제한
현재 마이페이지(`mypage/index.html`)는 `App.isLoggedIn()` 체크를 프론트에서만 한다.  
서버사이드(PHP)에서도 세션 검증 필수.

---

## 7. 관리자 → 사용자 데이터 흐름

관리자 페이지(`admin/`)에서 등록·수정한 콘텐츠가 사용자 페이지에 노출되는 관계 매핑.  
관리자 API 스펙은 `admin/00_DEV_HANDOFF.md §4` 참조.

| 관리자 페이지 | 관리자 API | 사용자 페이지 | 사용자 API |
|---|---|---|---|
| banner.html | `GET /admin/api/banners` | index.html — 메인 슬라이더 | `GET /api/main/banners` |
| popup.html | `GET /admin/api/popups` | index.html — 팝업 | `GET /api/main/popups` |
| calendar.html | `GET /admin/api/calendar` | index.html — 캘린더 이벤트 dot | `GET /api/calendar` |
| board.html `type=notice` | `GET /admin/api/board?type=notice` | community/notice.html | `GET /api/board/notice` |
| board.html `type=gallery` | `GET /admin/api/board?type=gallery` | community/gallery.html | `GET /api/board/gallery` |
| board.html `type=newsletter` | `GET /admin/api/board?type=newsletter` | community/newsletter.html | `GET /api/board/newsletter` |
| board.html `type=archive` | `GET /admin/api/board?type=archive` | community/archive.html | `GET /api/board/archive` |
| board.html `type=press` | `GET /admin/api/board?type=press` | community/press.html | `GET /api/board/press` |
| course-edit.html | `POST/PUT /admin/api/courses` | education/courses.html, course-detail.html | `GET /api/courses`, `GET /api/courses/:id` |
| applicants.html | `PUT /admin/api/applicants/:id/status` | mypage — 신청내역 상태 변경 반영 | `GET /api/my/apply` |
| content.html | 조직도 이미지 등록 | about/members.html — 조직도 이미지 | `GET /api/officers` |
| content.html | 임원진 등록/수정 | about/members.html — 임원진 목록 | `GET /api/officers` |
| history-edit.html | `POST/PUT /admin/api/history` | about/history.html — 연혁 타임라인 | `GET /api/history` |
| apply-regular.html | 정회원신청 처리 | mypage — 소속·등급 변경 반영 | `GET /api/my/profile` |
| apply-sponsor.html | 후원신청 처리 | (별도 사용자 화면 없음 — 관리자 전용) | — |

### 추가 필요한 사용자 API 엔드포인트

위 매핑에서 §4에 미기재된 엔드포인트는 다음과 같다.

#### `GET /api/main/banners` — 메인 슬라이더 배너
```json
// 응답 items (isActive=true, 순서 기준 정렬)
{
  "id": 1,
  "order": 1,
  "topText": "2026 숲해설가",
  "mainText": "자연과 함께하는 삶",
  "bottomText": "교육 신청 바로가기",
  "linkUrl": "/education/courses.html",
  "imageUrl": "/uploads/banners/1.jpg"
}
```

#### `GET /api/main/popups` — 메인 팝업
```json
// 응답 items (현재 날짜가 startAt ~ endAt 범위 내, isActive=true)
{
  "id": 1,
  "content": "<p>팝업 내용 HTML</p>",
  "width": 400,
  "height": 500,
  "posX": 50,
  "posY": 80,
  "linkUrl": "/education/courses.html",
  "imageUrl": "/uploads/popups/1.jpg"
}
```

#### `GET /api/officers` — 조직도·임원진
```json
// 응답 data
{
  "orgChartImageUrl": "/uploads/org/org_chart.jpg",  // null 이면 '등록 예정' 안내 표시
  "groups": [
    {
      "gid": 1,
      "name": "함께하는 사람들",
      "officers": [
        {
          "oid": 1,
          "title": "상임 대표",
          "name": "김국희",
          "detail": "",
          "img": "/uploads/officers/1.jpg"  // null 가능
        }
      ]
    }
  ]
}
```

#### `GET /api/history` — 연혁
```json
// 응답 items (year 내림차순 정렬)
{
  "year": 2026,
  "img": "/uploads/history/2026.jpg",  // null 가능
  "items": [
    { "month": "03", "text": "제55기 숲해설가 전문가과정 모집 시작" }
  ]
}
```

---

## 8. 외부 API 의존성

사용자 페이지에서 서버 API 외에 **외부 서비스**와의 연동이 필요한 항목.

| 기능 | 적용 페이지 | 외부 서비스 | 현황 |
|---|---|---|---|
| 지도 | about/contact.html | 카카오맵 또는 네이버 지도 | ⚠️ **미확정 — 연동 전 결정 필요** |
| 주소 검색 | auth/register.html, mypage/index.html | 카카오 우편번호 서비스 (다음) | ⚠️ **미확정** |
| 본인인증 | auth/register.html (스텝1) | PASS·KCB·나이스 등 | ⚠️ **미확정** |
| 에디터 | education/review-write.html, community/qna-write.html | SmartEditor2 또는 대체 에디터 | ⚠️ **미확정** |
| 이미지 업로드 | 에디터 내 이미지 삽입 | 자체 서버 업로드 API 필요 | `POST /api/upload/image` |
| 이메일 발송 | auth/find.html — 임시 비밀번호 | SMTP 또는 AWS SES 등 | 서버 내부 처리 |

### 각 항목 연동 시 주의사항

#### 지도 — about/contact.html
현재 HTML에 `<div class="map-wrap">` 영역이 `map-placeholder` 상태로 비어있다.  
API 결정 후 아래 위치에 스크립트 삽입:
```html
<!-- contact.html -->
<div class="map-wrap" id="map"></div>
<script>
  // 카카오맵 예시
  kakao.maps.load(function() {
    var map = new kakao.maps.Map(document.getElementById('map'), {
      center: new kakao.maps.LatLng(37.5665, 126.9780),
      level: 3
    });
  });
</script>
```
협회 주소 좌표값(위도·경도)은 DB 또는 환경설정에서 관리 권장.

#### 주소 검색 — register.html / mypage
현재 `App.toast('주소 검색 서비스 연동 예정')` 상태.  
카카오 주소 API 확정 시 아래로 교체:
```javascript
new daum.Postcode({
  oncomplete: function(data) {
    document.getElementById('postcode').value = data.zonecode;
    document.getElementById('addr1').value = data.roadAddress;
    document.getElementById('addr2').focus();
  }
}).open();
```

#### 본인인증 — register.html
현재 스텝1의 "인증하기" 버튼은 `App.toast('본인인증 서비스 연동 예정')` 상태.  
PASS·KCB·나이스 등 CP사 결정 후 팝업 연동 방식으로 교체.  
인증 완료 시 `name`, `birth`, `gender`, `phone` 값을 폼에 자동 채워야 한다.

#### SmartEditor2 — review-write.html / qna-write.html
현재 `.se2-wrap` 영역이 **목업(mock) 텍스트에어리어** 상태.  
실제 연동 시 SmartEditor2 SDK 로드 후 인스턴스 생성:
```javascript
nhn.husky.EZCreator.createInIFrame({
  oAppRef: oEditors,
  elPlaceHolder: "ir1",
  sSkinURI: "/static/smarteditor2/SmartEditor2Skin.html",
  fCreator: "createSEditor2"
});
```
에디터 내 이미지 삽입은 별도 업로드 API (`POST /api/upload/image`) 필요.

---

## 9. 테스트 체크리스트 (PHP 연동 후)

- [ ] 로그인 → 헤더 사용자명 표시 → 마이페이지 이동
- [ ] 비로그인 → 마이페이지 직접 접근 → 로그인 페이지 리다이렉트
- [ ] 강좌 목록 → 탭 전환 → 각 유형별 필터 동작
- [ ] 강좌 상태(접수중/준비중/마감) 날짜 기준 정상 표시
- [ ] 강좌 신청 → 완료 메시지 → 마이페이지 신청내역 반영
- [ ] 마이페이지 신청내역 → 수료증 버튼 → 출력 미리보기 정상 렌더
- [ ] 마이페이지 신청내역 → 후기 등록 버튼 → 작성 페이지 이동 → 등록 완료
- [ ] 공지사항 목록 → 상세 → 이전/다음 네비게이션
- [ ] 글자크기 조절 버튼 → 전 페이지 텍스트 동시 확대/축소
- [ ] 회원가입 → 이메일 인증(또는 SMS) → 로그인 → 정회원신청
- [ ] 비밀번호 찾기 → 이메일 수신 → 임시 비밀번호로 로그인
