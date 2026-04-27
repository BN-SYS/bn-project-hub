# 관리자 페이지 PHP 연동 핸드오프 가이드

> 문서버전: v1.0 | 작성일: 2026-03-31 | 대상: 백엔드 개발자

---

## 1. 파일 구조 개요

```
admin/                         ← 이 폴더
│
├── DEV_HANDOFF.md             ← 이 문서
│
├── [목록 페이지] — 필터 + 테이블 + 페이지네이션
│   ├── members.html           # 회원 목록
│   ├── members-withdrawn.html # 탈퇴회원 목록
│   ├── courses.html           # 강좌 목록 (탭: 기초/자격/역량/아카데미) + 강사신청도 동일 레이아웃과 프로세스
│   ├── applicants.html        # 신청자 통합 목록 + 강사신청도 동일 레이아웃과 프로세스
│   ├── calendar.html          # 일정 목록
│   ├── board.html             # 게시판 목록 (?type=notice|newsletter|press|gallery|...)
│   ├── apply-regular.html     # 정회원신청 목록
│   ├── apply-instructor.html  # 강사신청 목록
│   ├── apply-forest.html      # 숲해설신청 목록
│   ├── apply-sponsor.html     # 후원신청 목록
│   ├── banner.html            # 배너 관리
│   ├── popup.html             # 팝업 관리
│   └── history.html           # 연혁 목록
│
├── [등록/수정 페이지] — 폼 입력
│   ├── member-edit.html       # 회원 등록/수정 (?id=xxx 시 수정)
│   ├── course-edit.html       # 강좌 등록/수정
│   ├── calendar-edit.html     # 일정 등록/수정
│   ├── board-edit.html        # 게시글 등록/수정 (?type=notice|...)
│   ├── banner-edit.html       # 배너 등록/수정
│   ├── popup-edit.html        # 팝업 등록/수정
│   └── history-edit.html      # 연혁 등록/수정
│
├── [상세/처리 페이지]
│   ├── member-detail.html     # 회원 상세 (열람 + 상태변경)
│   ├── applicant-detail.html  # 강좌 신청자 상세 /  + 강사신청자 상세도 동일 레이아웃과 프로세스
│   ├── apply-regular-detail.html
│   ├── apply-forest-detail.html
│   ├── apply-sponsor-detail.html
│   ├── course-detail.html
│   ├── calendar-detail.html
│   └── board-detail.html
│
└── [기타]
    ├── content.html           # 조직도·임원진 관리
    └── organization.html      # 조직도
```

---

## 2. 공유 에셋 구조

```
outputs/assets/
│
├── css/
│   ├── common.css
│   ├── components.css
│   ├── responsive.css
│   ├── list-common.css
│   └── pages/admin.css          ← ★ 관리자 전용 스타일 전체 (필터 컴포넌트 포함)
│
└── js/
    ├── app.js                   ← toast(), renderPagination() 등 공통 유틸
    ├── components/header.js
    └── pages/
        ├── admin.js             ← ★ 사이드바, 상단바, ADMIN_API 엔드포인트 상수 (전 페이지 공통)
        ├── admin-calendar.js    ← 일정관리 페이지 전용 로직 (calendar.html 단독 로드)
        └── admin-content.js     ← 콘텐츠관리 페이지 전용 로직 (organization.html 단독 로드)
```

### admin.js에서 제공하는 것

| 상수/객체 | 설명 |
|---|---|
| `ADMIN_API` | PHP API 엔드포인트 URL 상수 모음 → `admin.js` 하단 참조 |
| `AdminSidebar.mount(key)` | 페이지 진입 시 사이드바 렌더링. `key`는 각 HTML 하단 `AdminSidebar.mount('...')` 참조 |
| `AdminTopbar` | 상단바 자동 주입 (DOMContentLoaded 시 실행) |
| `AdminLayout` | 사이드바 토글 |

---

## 3. PHP 연동 전환 방법

### Step 1 — ADMIN_API 엔드포인트 URL 확정

`assets/js/pages/admin.js` 하단의 `ADMIN_API` 객체에서 `base`와 각 엔드포인트 URL을 실제 서버 경로에 맞게 수정한다.

```javascript
// admin.js
const ADMIN_API = {
  base: '/admin/api',   // ← 이 줄만 수정하면 대부분 자동 반영
  members: '/admin/api/members',
  ...
};
```

### Step 2 — 목록 페이지 AJAX 전환

각 목록 HTML 파일 하단 `<script>` 블록에서 더미 데이터 배열을 제거하고 `fetch()` 로 교체한다.

**현재 구조 (더미 데이터)**
```javascript
const ALL_MEMBERS = Array.from({ length: 50 }, ...) // ← 이 부분 제거
const MemberAdmin = {
  search() {
    this.filtered = ALL_MEMBERS.filter(...); // ← 서버 요청으로 교체
    this.render();
  },
  render() { /* tbody innerHTML */ }
};
```

**전환 후 구조**
```javascript
const MemberAdmin = {
  search() {
    const params = new URLSearchParams({ page: this.currentPage, size: this.pageSize, ...필터값 });
    fetch(ADMIN_API.members + '?' + params)
      .then(r => r.json())
      .then(data => {
        this.filtered = data.items;
        this.totalCount = data.total;
        this.render();
      });
  },
  render() { /* 동일 — tbody innerHTML */ }
};
```

**기대 응답 JSON 구조 (회원 목록 예시)**
```json
{
  "total": 150,
  "items": [
    {
      "id": 1,
      "userId": "forest001",
      "name": "김숲해",
      "gender": "남",
      "birth": "1985-03-15",
      "phone": "010-1234-5678",
      "email": "user1@foresto.or.kr",
      "grade": "fullMember",
      "gradeLabel": "정회원",
      "joinDate": "2026-01-15",
      "joinDatetime": "2026-01-15 09:23:45",
      "status": "active"
    }
  ]
}
```

### Step 3 — 저장 폼 전환

각 edit 페이지에 `// TODO: AJAX —` 주석이 표시된 위치에서 fetch로 교체한다.

**현재 구조 (프로토타입)**
```javascript
// TODO: AJAX
// fetch(ADMIN_API.memberSave, { method: 'POST', body: JSON.stringify(payload) })
App.toast('저장되었습니다.', 'success');  // ← 아직 실제 저장 없음
setTimeout(() => location.href = 'members.html', 1500);
```

**전환 후 구조**
```javascript
fetch(ADMIN_API.memberSave, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content
  },
  body: JSON.stringify(payload)
})
.then(r => r.json())
.then(data => {
  if (data.success) {
    App.toast('저장되었습니다.', 'success');
    setTimeout(() => location.href = 'members.html', 1500);
  } else {
    App.toast(data.message || '저장에 실패했습니다.', 'error');
  }
});
```

### Step 4 — 세션/권한 체크 활성화

`admin.js` 하단의 권한 체크 블록 주석을 해제한다.
단, **서버사이드(PHP)에서도 반드시 세션 검증**을 수행해야 한다.

```javascript
// admin.js — 주석 해제
(function checkAdminAuth() {
  if (typeof App !== 'undefined' && App.user.role !== 'admin') {
    alert('관리자만 접근 가능합니다.');
    location.href = '../index.html';
  }
})();
```

---

## 4. API 엔드포인트 전체 명세

### 공통 규칙

**Base URL**: `ADMIN_API.base` (`admin.js`에서 관리)

**공통 응답 포맷**
```json
// 목록
{ "success": true, "total": 150, "items": [...] }

// 단건
{ "success": true, "data": { ... } }

// 처리 성공 (저장/삭제/상태변경)
{ "success": true, "message": "처리되었습니다." }

// 실패
{ "success": false, "message": "오류 내용", "errors": { "field": "메시지" } }
```

**공통 목록 파라미터** (전 목록 API 공통)
| 파라미터 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `page` | int | `1` | 페이지 번호 |
| `size` | int | `10` | 페이지당 건수 |

---

### 회원관리

#### `GET /admin/api/members` — 목록 조회
| 파라미터 | 타입 | 값 | 설명 |
|---|---|---|---|
| `date_from` / `date_to` | string | `2026-01-01` | 가입일 범위 |
| `grade` | string | `member` \| `fullMember` \| `admin` | 회원 등급 |
| `status` | string | `active` \| `blocked` | 계정 상태 |
| `kw_type` | string | `userId` \| `name` \| `phone` \| `email` | 검색 기준 필드 |
| `kw` | string | | 검색어 |

```json
// 응답 items 항목
{
  "id": 1,
  "userId": "forest001",
  "name": "김숲해",
  "gender": "남",          // "남" | "여"
  "birth": "1985-03-15",
  "phone": "010-1234-5678",
  "email": "user@foresto.or.kr",
  "grade": "fullMember",   // "member" | "fullMember" | "admin"
  "gradeLabel": "정회원",
  "region": "서울",
  "joinDate": "2026-01-15",
  "joinDatetime": "2026-01-15 09:23:45",
  "status": "active"       // "active" | "blocked"
}
```

#### `GET /admin/api/members/{id}` — 상세 조회
```json
// 응답 data — 목록 항목 + 추가 필드
{
  "id": 1,
  "userId": "forest001",
  "name": "김숲해",
  "gender": "남",
  "birth": "1985-03-15",
  "phone": "010-1234-5678",
  "email": "user@foresto.or.kr",
  "grade": "fullMember",
  "region": "서울",
  "club": "나무반지",       // 동아리명 (없으면 null)
  "cohort": "15기",
  "postcode": "03152",
  "addr1": "서울특별시 종로구 삼청로 00",
  "addr2": "101호",
  "joinDate": "2026-01-15",
  "status": "active",
  "memo": "관리자 메모"
}
```

#### `POST /admin/api/members` — 등록
#### `PUT /admin/api/members/{id}` — 수정
```json
// 요청 body (등록/수정 공통)
{
  "userId": "forest001",
  "password": "...",       // 등록 시 필수, 수정 시 선택 (빈 값이면 변경 안 함)
  "name": "김숲해",
  "gender": "남",
  "birth": "1985-03-15",
  "phone": "010-1234-5678",
  "email": "user@foresto.or.kr",
  "grade": "fullMember",
  "region": "서울",
  "club": "나무반지",
  "cohort": "15기",
  "postcode": "03152",
  "addr1": "서울특별시 종로구 삼청로 00",
  "addr2": "101호",
  "status": "active",
  "memo": "관리자 메모"
}
```

#### `DELETE /admin/api/members/{id}` — 삭제 (탈퇴 처리)
#### `GET /admin/api/members/excel` — 엑셀 다운로드 (필터 파라미터 동일, 파일 스트리밍)

---

### 탈퇴회원

#### `GET /admin/api/members/withdrawn` — 목록 조회
> 파라미터: `date_from`, `date_to` (탈퇴일), `grade`, `kw_type`, `kw`, `page`, `size`

```json
// 응답 items — 회원 항목 + 추가 필드
{
  "id": 1,
  "userId": "forest001",
  "name": "김숲해",
  "grade": "fullMember",
  "gradeLabel": "정회원",
  "joinDate": "2022-01-01",
  "withdrawDate": "2026-03-15",
  "withdrawReason": "개인사정"
}
```

---

### 강좌관리

#### `GET /admin/api/courses` — 목록 조회
| 파라미터 | 타입 | 값 | 설명 |
|---|---|---|---|
| `type` | string | `basic` \| `qualify` \| `enhance` \| `academy` | 강좌 유형 |
| `status` | string | `open` \| `closed` \| `pending` | 모집 상태 |
| `date_from` / `date_to` | string | | 교육 기간 |
| `kw` | string | | 강좌명 검색 |

```json
// 응답 items
{
  "id": 1,
  "type": "basic",
  "typeLabel": "기초과정",
  "name": "숲해설가 양성 기초과정",
  "eduStart": "2026-03-01",
  "eduEnd": "2026-05-31",
  "applyStart": "2026-01-15",
  "applyEnd": "2026-02-28",
  "capacity": 30,
  "enrolled": 12,
  "hours": 40,
  "status": "open",        // "open" | "closed" | "pending"
  "statusLabel": "접수중",
  "thumbnailUrl": "/uploads/courses/thumb_1.jpg"
}
```

#### `GET /admin/api/courses/{id}` — 상세 조회
#### `POST /admin/api/courses` — 등록 (`multipart/form-data`, 썸네일 포함)
#### `PUT /admin/api/courses/{id}` — 수정
#### `DELETE /admin/api/courses/{id}` — 삭제

---

### 강좌 신청자 (applicants.html)

#### `GET /admin/api/applicants` — 목록 조회
| 파라미터 | 타입 | 값 | 설명 |
|---|---|---|---|
| `date_from` / `date_to` | string | | 신청일 범위 |
| `course_type` | string | `basic` \| `qualify` \| `enhance` \| `academy` | 강좌 유형 |
| `status` | string | `applied` \| `selected` \| `unselected` \| `done` \| `cancel` | 신청 상태 |
| `kw_type` | string | `name` \| `phone` \| `email` | 검색 기준 |
| `kw` | string | | 검색어 |

```json
// 응답 items
{
  "id": 1,
  "applyNo": "APP-2026-00001",
  "courseType": "basic",
  "courseTypeLabel": "기초과정",
  "courseName": "숲해설가 양성 기초과정",
  "applicantName": "홍길동",
  "userId": "forest001",
  "phone": "010-1234-5678",
  "email": "user@foresto.or.kr",
  "appliedAt": "2026-01-20 14:32:00",
  "status": "applied",
  "statusLabel": "신청",
  "certIssued": false      // 수료증 발급 여부
}
```

#### `PUT /admin/api/applicants/{id}/status` — 상태 변경
```json
// 요청 body
{ "status": "selected" }  // "applied" | "selected" | "unselected" | "done" | "cancel"
```

#### `PUT /admin/api/applicants/{id}/cert` — 수료증 발급 처리
```json
// 요청 body
{ "certIssued": true }
```

---

### 기타 신청관리

#### `GET /admin/api/apply/regular` — 정회원신청 목록
| 파라미터 | 타입 | 값 | 설명 |
|---|---|---|---|
| `date_from` / `date_to` | string | | 신청일 범위 |
| `act_status` | string | `활동 중` \| `활동 예정` \| `미활동` | 활동 여부 |
| `member_type` | string | `member` \| `guest` | 회원 구분 |
| `kw_type` | string | `name` \| `phone` \| `email` | 검색 기준 |
| `kw` | string | | 검색어 |

```json
// 응답 items
{
  "id": 1,
  "applyNo": "REG-2026-00001",
  "name": "홍길동",
  "phone": "010-1234-5678",
  "email": "user@foresto.or.kr",
  "memberType": "member",
  "memberTypeLabel": "회원",
  "actStatus": "활동 중",
  "appliedAt": "2026-01-20 14:32:00",
  "memo": "관리자 메모",
  "attachFiles": [
    { "name": "자격증.pdf", "url": "/uploads/apply/regular/1/cert.pdf", "size": "1.2MB" }
  ]
}
```

#### `GET /admin/api/apply/instructor` — 강사신청 목록
| 파라미터 | 타입 | 값 | 설명 |
|---|---|---|---|
| `date_from` / `date_to` | string | | 신청일 범위 |
| `schedule_id` | int | | 특정 일정 필터 |
| `status` | string | `applied` \| `selected` \| `unselected` \| `cancel` | 상태 |
| `region` | string | | 거주 지역 |
| `kw_type` | string | `name` \| `phone` | 검색 기준 |
| `kw` | string | | 검색어 |

```json
// 응답 items
{
  "id": 1,
  "applyNo": "APP-2026-00001",
  "scheduleName": "도봉구 초등학교 숲 체험",
  "scheduleDate": "2026-03-18",
  "name": "홍길동",
  "phone": "010-1234-5678",
  "region": "서울",
  "appliedAt": "2026-01-20 14:32:00",
  "status": "applied",
  "statusLabel": "신청",
  "activityCertIssued": false
}
```

#### `GET /admin/api/apply/forest` — 숲해설신청 목록
> 파라미터: `date_from`, `date_to`, `status`, `kw_type`, `kw`, `page`, `size`

#### `GET /admin/api/apply/sponsor` — 후원신청 목록
> 파라미터: `date_from`, `date_to`, `status`, `kw_type`, `kw`, `page`, `size`

#### `PUT /admin/api/apply/{type}/{id}/status` — 신청 상태 변경 (공통)
```json
// {type}: regular | instructor | forest | sponsor
// 요청 body
{ "status": "approved", "memo": "담당자 메모 (선택)" }
```

---

### 강사 일정관리 (instructor-schedule.html)

#### `GET /admin/api/instructor-schedules` — 목록 조회
| 파라미터 | 타입 | 값 | 설명 |
|---|---|---|---|
| `date_from` / `date_to` | string | | 활동 기간 |
| `status` | string | `open` \| `closed` \| `pending` | 일정 상태 |
| `kw` | string | | 활동명 검색 |

```json
// 응답 items
{
  "id": 1,
  "title": "도봉구 초등학교 숲 체험",
  "dateStart": "2026-03-18",
  "dateEnd": "2026-03-18",
  "timeFrom": "09:00",
  "timeTo": "13:00",
  "quota": 5,
  "appliedCount": 3,
  "activityCount": 1,
  "activityHours": 4,
  "confirmIssue": true,    // 활동확인서 발급 여부
  "status": "open",
  "statusLabel": "접수중"
}
```

#### `POST /admin/api/instructor-schedules` — 등록
#### `PUT /admin/api/instructor-schedules/{id}` — 수정
```json
// 요청 body
{
  "title": "도봉구 초등학교 숲 체험",
  "dateStart": "2026-03-18",
  "dateEnd": "2026-03-18",
  "timeFrom": "09:00",
  "timeTo": "13:00",
  "quota": 5,
  "activityCount": 1,
  "activityHours": 4,
  "fileRequired": false,   // 신청 파일 첨부 필수 여부
  "confirmIssue": true,
  "status": "open",
  "content": "<p>활동 내용 HTML</p>"
}
```

#### `DELETE /admin/api/instructor-schedules/{id}` — 삭제

---

### 일정관리 (calendar.html)

#### `GET /admin/api/calendar` — 목록 조회
> 파라미터: `year`, `month`, `cat` (`edu` \| `event` \| `notice`), `kw`, `page`, `size`

```json
// 응답 items
{
  "id": 1,
  "date": "2026-03-15",
  "cat": "edu",
  "catLabel": "교육",
  "title": "숲해설가 기초과정 개강",
  "link": "/education/courses.html"
}
```

#### `POST /admin/api/calendar` — 등록
#### `PUT /admin/api/calendar/{id}` — 수정
#### `DELETE /admin/api/calendar/{id}` — 삭제

---

### 게시판 (board.html)

#### `GET /admin/api/board` — 목록 조회
| 파라미터 | 타입 | 값 | 설명 |
|---|---|---|---|
| `type` | string | `notice` \| `newsletter` \| `press` \| `gallery` \| `forest-work` \| `region` \| `intro` \| `club` | 게시판 유형 |
| `kw` | string | | 제목 검색 |

```json
// 응답 items
{
  "id": 1,
  "type": "notice",
  "title": "2026년 숲해설가 교육 일정 안내",
  "isPinned": true,
  "author": "관리자",
  "createdAt": "2026-01-10 09:00:00",
  "viewCount": 245,
  "attachCount": 2
}
```

#### `POST /admin/api/board` — 등록 (`multipart/form-data`)
#### `PUT /admin/api/board/{id}` — 수정
#### `DELETE /admin/api/board/{id}` — 삭제
#### `PUT /admin/api/board/{id}/pin` — 고정 토글
```json
// 요청 body
{ "isPinned": true }
```

---

### 배너관리 (banner.html)

#### `GET /admin/api/banners` — 목록 조회 (순서 기준 정렬)
```json
// 응답 items
{
  "id": 1,
  "order": 1,
  "topText": "2026 숲해설가",
  "mainText": "자연과 함께하는 삶",
  "bottomText": "교육 신청 바로가기",
  "linkUrl": "/education/courses.html",
  "imageUrl": "/uploads/banners/1.jpg",
  "isActive": true
}
```

#### `POST /admin/api/banners` — 등록 (`multipart/form-data`)
#### `PUT /admin/api/banners/{id}` — 수정
#### `DELETE /admin/api/banners/{id}` — 삭제
#### `PUT /admin/api/banners/order` — 순서 변경
```json
// 요청 body
{ "ids": [3, 1, 2] }  // 새 순서대로 id 배열
```

---

### 팝업관리 (popup.html)

#### `GET /admin/api/popups` — 목록 조회
```json
// 응답 items
{
  "id": 1,
  "title": "2026 하반기 교육 안내",  // 관리자용 제목 (미노출)
  "startAt": "2026-06-01 00:00:00",
  "endAt": "2026-06-30 23:59:59",
  "width": 400,
  "height": 500,
  "posX": 50,
  "posY": 80,
  "imageUrl": "/uploads/popups/1.jpg",  // null 가능
  "linkUrl": "/education/courses.html",  // null 가능
  "isActive": true
}
```

#### `POST /admin/api/popups` — 등록 (`multipart/form-data`, 이미지 선택)
```json
// 요청 파라미터
{
  "title": "2026 하반기 교육 안내",
  "content": "<p>팝업 내용 HTML</p>",
  "startAt": "2026-06-01 00:00:00",
  "endAt": "2026-06-30 23:59:59",
  "width": 400,
  "height": 500,
  "posX": 50,
  "posY": 80,
  "linkUrl": "/education/courses.html",
  "isActive": true
  // + image 파일 (선택)
}
```

#### `PUT /admin/api/popups/{id}` — 수정
#### `DELETE /admin/api/popups/{id}` — 삭제

---

### 연혁관리 (history.html)

#### `GET /admin/api/history` — 목록 조회
> 파라미터: `year`, `kw`, `page`, `size`

```json
// 응답 items
{
  "id": 1,
  "year": 2020,
  "month": 3,
  "content": "사단법인 한국숲해설가협회 창립",
  "imageUrl": "/uploads/history/2020.jpg"  // null 가능
}
```

#### `POST /admin/api/history` — 등록 (`multipart/form-data`, 원형 이미지 선택)
#### `PUT /admin/api/history/{id}` — 수정
#### `DELETE /admin/api/history/{id}` — 삭제

---

## 5. 더미 데이터 구조 참고

더미 데이터는 **API 응답 스키마 설계 참고용**으로 남겨뒀다.
각 목록 HTML 파일 하단 `<script>` 블록의 `Array.from(...)` 부분에서 필드 목록 확인 가능.

| 파일 | 더미 데이터 변수명 | 주요 필드 |
|---|---|---|
| members.html | `ALL_MEMBERS` | id, userId, name, gender, birth, phone, email, grade, status, joinDatetime |
| courses.html | `ALL_COURSES` | id, type, name, eduStart, eduEnd, applyStart, applyEnd, capacity, enrolled, status |
| applicants.html | `ALL_APPLICANTS` | id, courseType, courseName, applicantName, phone, email, appliedAt, status |
| apply-regular.html | `ALL_APPLIES` | id, name, phone, email, appliedAt, status, region, career |
| board.html | `POSTS` | id, type, title, isPinned, author, createdAt, viewCount |
| calendar.html | `CALENDAR_EVENTS` | id, date, cat, title, link |
| banner.html | `BANNERS` | id, order, topText, mainText, bottomText, link, imageUrl, isActive |
| popup.html | `POPUPS` | id, title, content, startAt, endAt, width, height, posX, posY, isActive |

---

## 6. 주의 사항

### CSRF 토큰
Laravel 사용 시 모든 POST 요청에 `X-CSRF-TOKEN` 헤더 필요.
HTML `<head>`에 meta 태그 추가 필요:
```html
<meta name="csrf-token" content="{{ csrf_token() }}">
```

### 파일 업로드
- 강좌 편집(`course-edit.html`): 썸네일 이미지, 첨부파일 → `FormData` 사용
- 배너 편집(`banner-edit.html`): 배너 이미지 → `FormData` 사용
- 연혁 편집(`history-edit.html`): 원형 이미지 → `FormData` 사용
- 게시글 편집(`board-edit.html`): SmartEditor2 연동 필요 → 이미지는 별도 API

### SmartEditor2
`board-edit.html`, `course-edit.html`의 에디터 영역은 현재 **모의 구현(mock)** 상태.
실제 연동 시 SmartEditor2 SDK 로드 후 `se2` 인스턴스를 생성해야 함.

### 주소 검색
`member-edit.html`의 우편번호 검색은 **카카오 주소 API** 연동 예정.
현재 toast 메시지만 표시.
```javascript
// 연동 시 아래로 교체
new daum.Postcode({ oncomplete: function(data) { ... } }).open();
```

### 엑셀 다운로드
각 목록 페이지의 `exportExcel()` 함수에 `// TODO: AJAX` 주석 표시됨.
서버에서 파일 스트리밍 방식으로 구현:
```javascript
window.location.href = ADMIN_API.memberExcel + '?' + new URLSearchParams(currentFilter);
```

---

## 7. 테스트 시나리오 체크리스트 (PHP 연동 후)

- [ ] 로그인 → 세션 생성 → 관리자 페이지 진입
- [ ] 미로그인 상태에서 직접 URL 접근 → 로그인 페이지 리다이렉트
- [ ] 회원 목록 조회 (페이지네이션, 필터 각 조건별)
- [ ] 회원 등록 → 목록 반영 확인
- [ ] 회원 수정 → 변경 내용 반영 확인
- [ ] 회원 삭제 (단건/복수) → 목록에서 사라짐 확인
- [ ] 엑셀 다운로드 → 파일 정상 저장 확인
- [ ] 강좌 등록 → 앞단 강좌 목록 페이지에 반영 확인
- [ ] 게시글 고정(pin) → 목록 상단 고정 확인
- [ ] 배너 순서 변경 → 앞단 메인 슬라이더 반영 확인
- [ ] 팝업 기간 설정 → 지정 기간에만 팝업 노출 확인
