# Velzon 4.4.1 — admin 화면 패턴 참조

storyboard-agent가 admin HTML 생성 시 이 파일을 참조한다.

---

## 패턴 A — 목록 페이지

```html
<div class="row">
  <div class="col-lg-12">
    <div class="card" id="{screenId}List">
      <!-- 헤더: 제목 + 액션 버튼 -->
      <div class="card-header border-0">
        <div class="row align-items-center gy-3">
          <div class="col-sm"><h5 class="card-title mb-0">목록 제목</h5></div>
          <div class="col-sm-auto">
            <div class="d-flex gap-1 flex-wrap">
              <button type="button" class="btn btn-secondary add-btn" data-bs-toggle="modal" data-bs-target="#addModal">
                <i class="ri-add-line align-bottom me-1"></i> 등록
              </button>
              <button class="btn btn-soft-danger" id="remove-actions">
                <i class="ri-delete-bin-2-line"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- 검색·필터 -->
      <div class="card-body border border-dashed border-end-0 border-start-0">
        <form>
          <div class="row g-3">
            <div class="col-xxl-5 col-sm-6">
              <div class="search-box">
                <input type="text" class="form-control search" placeholder="검색...">
                <i class="ri-search-line search-icon"></i>
              </div>
            </div>
            <!-- 추가 필터: col-xxl-2 col-sm-4 + select.form-control[data-choices] -->
          </div>
        </form>
      </div>
      <!-- 테이블 -->
      <div class="card-body pt-0">
        <div class="table-responsive table-card">
          <!-- [API-DATA] GET /api/{resource} — 더미 3행 -->
          <table class="table table-nowrap align-middle" id="{screenId}Table">
            <thead class="text-muted table-light">
              <tr class="text-uppercase fs-13">
                <th style="width:25px;"><div class="form-check"><input class="form-check-input" type="checkbox" id="checkAll"></div></th>
                <th class="sort" data-sort="col1">컬럼명</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody class="list form-check-all">
              <tr>
                <td><div class="form-check"><input class="form-check-input" type="checkbox"></div></td>
                <td class="col1">데이터</td>
                <td>
                  <ul class="list-inline hstack gap-2 mb-0">
                    <li class="list-inline-item" data-bs-toggle="tooltip" title="수정">
                      <a href="#editModal" data-bs-toggle="modal" class="text-primary d-inline-block edit-item-btn">
                        <i class="ri-pencil-fill fs-16"></i>
                      </a>
                    </li>
                    <li class="list-inline-item" data-bs-toggle="tooltip" title="삭제">
                      <a class="text-danger d-inline-block remove-item-btn" data-bs-toggle="modal" href="#deleteModal">
                        <i class="ri-delete-bin-fill fs-16"></i>
                      </a>
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>
```

---

## 패턴 B — 등록·수정 폼 (2열: 메인 8 + 사이드 4)

```html
<!-- [FORM: {screenId}-form] -->
<form id="{screenId}-form" autocomplete="off" class="needs-validation" novalidate>
  <div class="row">
    <!-- 메인 폼 -->
    <div class="col-lg-8">
      <div class="card">
        <div class="card-header"><h5 class="card-title mb-0">기본 정보</h5></div>
        <div class="card-body">
          <div class="mb-3">
            <label class="form-label" for="fieldId">라벨 <span class="text-danger">*</span></label>
            <input type="text" class="form-control" id="fieldId" required placeholder="입력...">
            <div class="invalid-feedback">필수 입력 항목입니다.</div>
          </div>
          <!-- 필드 반복 -->
        </div>
      </div>
      <!-- 섹션 추가 시 card 반복 -->
      <div class="text-end mb-3">
        <button type="button" class="btn btn-light me-1">취소</button>
        <button type="submit" class="btn btn-primary w-sm">저장</button>
      </div>
    </div>
    <!-- 사이드바 설정 -->
    <div class="col-lg-4">
      <div class="card">
        <div class="card-header"><h5 class="card-title mb-0">상태 설정</h5></div>
        <div class="card-body">
          <div class="mb-3">
            <label class="form-label" for="statusSelect">상태</label>
            <select class="form-select" id="statusSelect">
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</form>
```

---

## 패턴 C — 대시보드 통계 카드 (col-xl-3 × 4)

```html
<div class="row">
  <div class="col-xl-3 col-md-6">
    <div class="card card-animate">
      <div class="card-body">
        <div class="d-flex align-items-center">
          <div class="flex-grow-1 overflow-hidden">
            <p class="text-uppercase fw-medium text-muted text-truncate mb-0">통계 항목</p>
          </div>
          <div class="flex-shrink-0">
            <h5 class="text-success fs-14 mb-0">
              <i class="ri-arrow-right-up-line fs-13 align-middle"></i> +16%
            </h5>
          </div>
        </div>
        <div class="d-flex align-items-end justify-content-between mt-4">
          <div>
            <h4 class="fs-20 fw-semibold ff-secondary mb-4">1,234</h4>
            <a href="#" class="text-decoration-underline">자세히 보기</a>
          </div>
          <div class="avatar-sm flex-shrink-0">
            <span class="avatar-title bg-secondary-subtle rounded fs-3">
              <i class="bx bx-user text-secondary"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- col 반복 (4개 기준) -->
</div>
```

---

## Velzon 컴포넌트 클래스 (Bootstrap 5 확장)

| 요소 | 클래스 |
|------|--------|
| 기본 버튼 | `btn btn-primary` / `btn btn-secondary` / `btn btn-light` |
| 소프트 버튼 | `btn btn-soft-danger` / `btn btn-soft-success` / `btn btn-soft-secondary` |
| 폼 입력 | `form-control` / `form-select` / `form-label` / `invalid-feedback` |
| 테이블 | `table table-nowrap align-middle` + thead: `text-muted table-light text-uppercase fs-13` |
| 카드 | `card` / `card-header` / `card-body` |
| 애니메이션 카드 | `card card-animate` (대시보드) |
| 검색박스 | `search-box` > `form-control search` + `ri-search-line search-icon` |
| 탭 | `nav nav-tabs nav-tabs-custom nav-success` > `nav-item` > `nav-link [active]` |
| 배지 | `badge bg-success` / `badge bg-warning-subtle text-warning` / `badge bg-danger` |
| 아이콘 | Remix Icons `ri-*` (버튼/액션) + Boxicons `bx bx-*` (대시보드 카드) |
