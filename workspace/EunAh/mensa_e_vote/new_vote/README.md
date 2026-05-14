# 멘사코리아 NEW 전자투표 시스템 구축 기획서 (v.1.0)

# 1. 프로젝트 개요

멘사코리아 정회원을 대상으로 온라인 전자투표 시스템을 구축한다.

본 시스템은 다음 목적을 지원한다.

- 임원 선출 투표
- 헌장 개정 투표
- 총회 의결 투표
- 기타 사용자 정의 투표
- 총회 참석 및 위임 관리
- 전자 인증 기반 본인확인
- 결과 집계 및 공지용 데이터 출력

시스템은 운영 안정성과 투표 신뢰성을 최우선으로 하며,  
예외 상황은 별도 승인 프로세스를 통해 제한적으로 처리한다.

---

# 2. 시스템 목표

## 핵심 목표

- 정회원 기준의 정확한 투표권 관리
- 온라인 기반 안전한 본인 인증
- 투표 유형별 유연한 운영
- 위임 및 총회 정족수 관리
- 투표 결과의 신뢰성 확보
- 관리자 운영 효율 향상

---

# 3. 회원(유권자) 데이터 관리

## 3-1. 회원 기준 데이터

회원 기준 명단은 구글 스프레드시트를 기반으로 관리한다.

### 관리 항목

| 항목 | 설명 |
|---|---|
| 이름 | 회원명 |
| 회원번호 | 회원 고유번호 |
| 휴대폰번호 | 본인인증용 |
| 이메일 | 보조 인증용 |
| 생년월일 | 추가 검증용 |

---

## 3-2. 회원 명단 관리 방식

구글 스프레드시트는 원본 데이터로 사용하며,  
시스템은 투표 시작 전 회원명단을 동기화하여 별도 DB 스냅샷으로 관리한다.

### 목적

- 투표 도중 데이터 변경 방지
- 운영 실수 최소화
- 유권자 기준 고정
- 집계 정합성 유지

---

# 4. 투표 시스템 구조

## 4-1. 기본 개념

시스템은 “투표 템플릿 + 안건 유형” 구조로 운영한다.

### 기본 제공 템플릿

| 템플릿 | 설명 |
|---|---|
| 임원 선출 투표 | 후보/팀 기반 선출 |
| 헌장 개정 투표 | 찬반 의결 |
| 총회 의결 투표 | 다중 안건 처리 |
| 기타 사용자 정의 투표 | 운영자 구성형 |

---

## 4-2. 안건 유형

운영자는 허용된 안건 유형 내에서 투표를 구성할 수 있다.

| 유형 | 설명 |
|---|---|
| 찬반형 | 찬성/반대/기권 |
| 단일선택형 | 1개 선택 |
| 복수선택형 | 여러 개 선택 |
| 후보선택형 | 후보 또는 팀 선택 |
| 서술형 | 자유 텍스트 입력 |
| 참석형 | 참석 여부 |
| 위임형 | 위임 처리 |

---

# 5. 투표 유형별 구성

## 5-1. 임원 선출 투표

임원 선출을 위한 전자투표.

### 지원 형태

#### 단독 후보형

예:
- 감사 보궐선거
- 특정 직책 공석 선거

선택지 예시:
- 찬성
- 반대
- 기권

또는:
- 후보 선택
- 기권

---

#### 팀 출마형

예:
- 회장/부회장 러닝메이트

후보 등록 항목:
- 팀명
- 후보자명
- 사진
- 소개
- 공약
- 팀 설명

---

## 5-2. 헌장 개정 투표

안건별 찬반 의결 방식.

### 기본 선택지

- 찬성
- 반대
- 기권

### 추가 요소

- 안건 설명
- 개정 전/후 비교
- 첨부파일

---

## 5-3. 총회 의결 투표

총회 안건 처리를 위한 투표.

### 특징

- 다중 안건 구성 가능
- 안건별 유형 설정 가능
- 위임 기반 정족수 반영 가능

---

## 5-4. 기타 사용자 정의 투표

운영자가 허용된 안건 유형을 조합하여 자유롭게 구성 가능한 투표.

예:
- 설문조사
- 지역투표
- 위원회 의결
- 긴급안건
- 참석조사
- 의견수렴

---

# 6. 사용자 인증 및 투표 흐름

## 6-1. 이니시스 간편인증 기반 사용자 인증 플로우

본 시스템은 **이니시스 간편인증**을 통해 안전한 본인인증을 수행합니다.

### STEP 1. 투표 링크 접속

문자, 알림톡, 이메일 등으로 전달된 링크 접속.

---

### STEP 2. 이니시스 간편인증 진행

사용자는 이니시스 간편인증 창으로 자동 진행되며, 다음 정보를 제공합니다.

**이니시스에서 수집되는 정보:**
- 이름 (사용자 입력 또는 휴대폰 정보로부터 수집)
- 휴대폰번호
- 생년월일

> **주의사항**  
> 이니시스 간편인증 통과 = 휴대폰 소유 증명  
> 다만, 회원 맞음 확인은 다음 단계에서 수행합니다.

---

### STEP 3. 회원번호 입력 (사용자 입력)

이니시스 인증 후 사용자가 직접 입력:
- **회원번호** (텍스트 입력)

> **설명**  
> 이니시스에서 제공할 수 없는 정보이므로 사용자가 직접 입력하도록 합니다.

---

### STEP 4. 회원 정보 검증 (1차 매칭)

**기준:** 이름 + 전화번호 + 회원번호

구글 스프레드시트의 회원명단과 비교하여 다음 조건을 모두 만족하는 행을 찾습니다:

| 조건 | 기준 | 비고 |
|---|---|---|
| 이름 일치 | 이니시스에서 수집한 이름 = 스프레드시트 이름 | 정확히 일치 |
| 전화번호 일치 | 이니시스에서 수집한 전화번호 = 스프레드시트 휴대폰번호 | 정확히 일치 (하이픈 등 공백 정규화) |
| 회원번호 일치 | 사용자가 입력한 회원번호 = 스프레드시트 회원번호 | 정확히 일치 |

**결과:**
- ✅ **1차 매칭 성공:** 투표 입장 (STEP 6로 진행)
- ❌ **1차 매칭 실패:** 2차 매칭으로 진행 (STEP 5로 진행)

---

### STEP 5. 회원 정보 검증 (2차 매칭 — 생년월일 활용)

1차 매칭이 실패한 경우, **전화번호 변경 시나리오**를 대비하여 생년월일로 재검증합니다.

**기준:** 이름 + 생년월일 + 회원번호

구글 스프레드시트의 회원명단과 비교하여 다음 조건을 모두 만족하는 행을 찾습니다:

| 조건 | 기준 | 비고 |
|---|---|---|
| 이름 일치 | 이니시스에서 수집한 이름 = 스프레드시트 이름 | 정확히 일치 |
| 생년월일 일치 | 이니시스에서 수집한 생년월일 = 스프레드시트 생년월일 | 정확히 일치 (YYMMDD 또는 YYYYMMDD) |
| 회원번호 일치 | 사용자가 입력한 회원번호 = 스프레드시트 회원번호 | 정확히 일치 |

**결과:**
- ✅ **2차 매칭 성공:** 투표 입장 (STEP 6로 진행)
- ❌ **2차 매칭 실패:** 예외 요청 (STEP 5-1로 진행)

---

### STEP 5-1. 검증 실패 — 사용자 안내 및 예외 요청 접수

1차, 2차 매칭 모두 실패한 경우:

**사용자 화면:**
```
본인인증 정보가 회원 데이터와 일치하지 않습니다.
다음 중 하나의 경우일 수 있습니다:

1. 전화번호가 변경된 경우
2. 이메일이 변경된 경우
3. 등록된 정보와 다르게 입력한 경우
4. 회원번호를 잘못 기입한 경우

[ 다시 시도 ]   [ 관리자에 문의 ]
```

**사용자가 "관리자에 문의"를 클릭하면:**

예외 요청 접수 폼이 표시됩니다 (섹션 7 참조).

---

### STEP 6. 투표 입장

검증 성공 시 (1차 또는 2차 매칭 통과):

사용자는 투표 화면으로 진입하여 투표를 진행할 수 있습니다.

---

## 6-2. 검증 데이터 흐름도

```
[이니시스 간편인증]
  ↓ (이름, 휴대폰번호, 생년월일 수집)
[사용자 회원번호 입력]
  ↓
[1차 매칭: 이름 + 전화번호 + 회원번호]
  ├─ ✅ 일치 → [투표 입장]
  └─ ❌ 불일치 ↓
[2차 매칭: 이름 + 생년월일 + 회원번호]
  ├─ ✅ 일치 → [투표 입장]
  └─ ❌ 불일치 ↓
[검증 실패 안내]
  ↓
[사용자 예외 요청 선택]
  ├─ [다시 시도] → [이니시스 간편인증 재진행]
  └─ [관리자에 문의] → [예외 요청 접수폼 표시]
```

---

## 6-3. 주요 검증 규칙

### 데이터 정규화

검증 시 데이터를 정규화하여 비교합니다:

| 항목 | 정규화 규칙 |
|---|---|
| 전화번호 | 공백, 하이픈 제거 (01012345678 형태) |
| 이름 | 양쪽 공백 제거, 내부 공백은 유지 |
| 생년월일 | YYYYMMDD 형태로 통일 |
| 회원번호 | 공백 제거, 선행 0 유지 |

### 대소문자 처리

- 영문 이름: 대소문자 구분 없음 (소문자로 통일 후 비교)
- 한글 이름: 정확히 일치

### 부분 일치 불허

모든 항목은 **정확히 일치** 해야 합니다. 부분 일치는 인정하지 않습니다.

---

# 7. 예외 처리 프로세스

## 7-1. 예외 상황 정의

본인인증 검증이 실패하는 경우를 예외 상황으로 분류합니다.

### 예외 상황 유형

| 유형 | 원인 | 빈도 |
|---|---|---|
| **전화번호 변경** | 회원이 휴대폰 번호를 변경한 경우 | 중 |
| **회원번호 오입력** | 사용자가 회원번호를 잘못 입력한 경우 | 중 |
| **개명** | 회원이 개명한 경우 | 낮음 |
| **생년월일 오류** | 스프레드시트에 잘못된 생년월일이 등록된 경우 | 낮음 |
| **중복 등록** | 회원이 중복 등록된 경우 | 낮음 |
| **데이터 오류** | 구글 스프레드시트의 데이터 오류 | 극히 낮음 |

---

## 7-2. 예외 요청 접수 프로세스

### STEP 1. 사용자 예외 요청 폼 제출

**검증 실패 시 사용자에게 표시되는 예외 요청 폼:**

```
본인인증 정보가 일치하지 않습니다.
관리자에 문의하려면 아래 정보를 입력해주세요.

[ 필수 항목 ]
- 이름: __________________ (확인됨: [이니시스에서 수집한 이름])
- 회원번호: __________________ (사용자 입력값)
- 현재 휴대폰번호: __________________ (이니시스에서 수집한 번호)
- 생년월일: __________________ (이니시스에서 수집한 날짜)

[ 선택 항목 ]
- 이전 휴대폰번호: __________________
- 문제 설명:
  [ ] 전화번호가 변경됨
  [ ] 회원번호를 잘못 기입한 것 같음
  [ ] 개명했음
  [ ] 기타: ___________________
- 추가 연락처 (이메일/전화): __________________

[ 제출 ]   [ 취소 ]
```

**제출 시 저장되는 정보:**
- 요청 시간
- 이니시스 인증 결과 (이름, 휴대폰번호, 생년월일)
- 사용자 입력 정보 (회원번호, 선택 항목)
- 추가 설명
- 알림 전용 연락처
- 요청 상태: `접수`

---

### STEP 2. 관리자 검토

관리자는 예외 요청을 검토합니다.

**관리자 검토 항목:**

| 항목 | 확인 내용 |
|---|---|
| 회원 확인 | 제시된 정보로 회원 조회 가능 여부 |
| 이름 매칭 | 이니시스 이름과 회원명이 실제 동일 여부 |
| 휴대폰번호 | 회원이 변경했을 가능성, 또는 초기 등록 오류 여부 |
| 생년월일 | 스프레드시트 등록 오류 여부 |
| 회원번호 | 사용자가 입력한 번호가 실제 회원번호인지 확인 |

---

### STEP 3. 관리자 승인 처리

검토 후 관리자는 다음 중 하나의 조치를 선택합니다.

#### 옵션 A. 회원 정보 정정 (권장)

**상황:** 회원 정보가 잘못 등록되었거나 변경된 경우

**조치:**
1. 구글 스프레드시트의 해당 회원 정보 수정
2. 시스템 DB 동기화 (투표 시작 전 수행)
3. 사용자에게 "정정 완료 후 재시도" 안내

**처리 상태:** `정정 완료`

> **주의:**  
> **투표 진행 중에는 회원 정보 수정 불가**  
> 투표 시작 전에만 가능합니다.

---

#### 옵션 B. 1회용 예외 인증 링크 발급 (임시 조치)

**상황:** 회원 정보 정정이 불가능하거나 긴급 처리 필요한 경우

**조치:**
1. 관리자가 사용자 정보 검증 완료 (추가 대면/전화 확인 등)
2. 시스템이 1회용 임시 투표 링크 생성
3. 사용자에게 임시 링크 발송 (이메일/SMS)
4. 사용자는 임시 링크로 직접 인증 없이 투표 입장 가능
5. 투표 후 임시 링크는 자동 만료

**1회용 링크 특징:**
- 유효기간: 24시간
- 사용 횟수: 1회 (투표 1회만 가능)
- 로그 기록: "관리자 예외 승인"으로 표시

**처리 상태:** `임시 링크 발급`

---

#### 옵션 C. 재확인 요청

**상황:** 제공된 정보만으로는 판단 불가능한 경우

**조치:**
1. 사용자에게 추가 정보 요청 (이메일 또는 전화)
2. 추가 정보 확인 후 A 또는 B 옵션으로 재검토
3. 사용자에게 결과 안내

**처리 상태:** `재확인 요청 중`

---

#### 옵션 D. 거부 (예외 불인정)

**상황:** 제공된 정보가 일치하지 않아 인증 불가능한 경우

**조치:**
1. 사용자에게 거부 사유 안내
2. 재확인 또는 추가 문의 안내

**처리 상태:** `거부`

---

### STEP 4. 사용자 알림

관리자 처리 결과를 사용자에게 알립니다.

**알림 방식:**
- 기본: 예외 요청 폼에서 제공한 이메일/휴대폰번호
- 선택: 추가 연락처 (사용자가 제공한 경우)

**알림 내용:**

**옵션 A. 정정 완료**
```
안녕하세요.
본인인증 정보 불일치 문제가 해결되었습니다.
다시 시도해주시기 바랍니다.

[투표 링크]
```

**옵션 B. 임시 링크 발급**
```
안녕하세요.
관리자 검증을 통해 임시 투표 링크를 발급했습니다.
아래 링크로 바로 투표하시기 바랍니다.

[임시 투표 링크] (유효기간: 24시간)
```

**옵션 C/D. 거부 또는 재확인**
```
안녕하세요.
문의하신 사항에 대해 다음과 같이 처리되었습니다.

[처리 결과 상세]
[추가 문의 연락처]
```

---

## 7-3. 예외 요청 관리

### 예외 요청 대시보드 (관리자용)

관리자는 예외 요청 목록을 조회할 수 있습니다.

**조회 항목:**
- 요청 시간
- 사용자 이름 (이니시스 정보)
- 회원번호 (입력값)
- 요청 상태 (접수 / 검토 중 / 처리됨)
- 처리 방식 (정정 / 임시 링크 / 재확인 요청 / 거부)
- 관리자명
- 처리 시간

---

## 7-4. 제한 사항 및 원칙

### 관리자 권한 범위

✅ **가능:**
- 회원 정보 정정 (투표 시작 전)
- 임시 인증 링크 발급
- 예외 요청 검토 및 승인/거부

❌ **불가능:**
- 대리 투표 행사
- 투표 결과 직접 수정
- 투표 중 회원 정보 수정
- 무단 일괄 승인

---

### 투표 진행 중 예외 처리 제한

**투표 진행 중 (투표 시작 ~ 투표 종료) 상황:**

1. 회원 정보 수정 불가
2. 임시 링크 발급만 가능
3. 긴급한 경우 관리자 상단 협의 후 처리

---

## 7-5. 로그 및 감사

### 예외 처리 로그 저장

모든 예외 요청 및 처리는 다음 항목을 기록합니다:

| 항목 | 내용 |
|---|---|
| 요청 시간 | 예외 요청 접수 시간 |
| 요청자 이름 | 이니시스에서 수집한 이름 |
| 요청 사유 | 사용자 선택 사항 |
| 검토 시간 | 관리자 검토 시간 |
| 검토자 | 담당 관리자명 |
| 처리 결과 | 정정 / 임시 링크 / 거부 등 |
| 처리 상세 | 구체적인 조치 내용 |
| 사용자 피드백 | 처리 후 사용자 반응 (선택) |

---

# 8. 총회 참석 및 위임 기능

## 8-1. 총회 참석 신청

총회 참석자는 사전 참석 신청 가능.

### 목적

- 참석 인원 파악
- 장소 운영
- 정족수 계산

---

## 8-2. 위임 기능

회원은 다음 중 하나만 선택 가능.

| 상태 | 설명 |
|---|---|
| 직접 참석 | 본인 행사 |
| 타 회원 위임 | 특정 회원에게 위임 |
| 의장 위임 | 의장에게 위임 |

---

## 8-3. 위임 제한

- 중복 위임 불가
- 위임 후 본인 투표 불가
- 위임 철회 기한 설정 가능
- 위임 이력 저장

---

# 9. 정족수 및 미투표 관리

## 9-1. 임원 선출 / 헌장 개정

모수:
- 전체 유권자

### 상태 구분

- 찬성
- 반대
- 기권
- 미투표

---

## 9-2. 총회 의결

모수:
- 현장 참석자
- 위임받은 회원 수
- 의장 위임 수

---

## 9-3. 미투표 처리

투표 종료 시까지 응답하지 않은 회원은 “미투표” 상태로 자동 처리한다.

### 구분

| 상태 | 의미 |
|---|---|
| 기권 | 의사 표시 |
| 미투표 | 응답 없음 |

---

# 10. 관리자 기능

## 10-1. 투표 관리

기능:
- 생성
- 수정
- 삭제
- 복제
- 공개예약

---

## 10-2. 상태 관리

| 상태 | 설명 |
|---|---|
| 준비중 | 작성 중 |
| 공개예정 | 예약 상태 |
| 진행중 | 투표 가능 |
| 종료 | 마감 |
| 제외 | 비활성 |

---

## 10-3. 안건 관리

기능:
- 안건 등록
- 순서 변경
- 공개/비공개
- 첨부파일 등록

---

## 10-4. 진행중 수정 제한

진행중 상태에서는:
- 제목/설명 수정 가능
- 선택지 수정 제한
- 투표유형 변경 제한

---

## 10-5. 회원 및 결과 관리

### 회원 리스트 기능

- 검색
- 컬럼 정렬
- 필터
- CSV 업로드
- CSV 다운로드

---

### 결과 출력

지원 형식:
- Excel
- CSV

추가 가능:
- PDF 출력
- 통계 요약

---

# 11. 로그 및 감사 기능

분쟁 대응 및 운영 이력 관리를 위해 로그를 저장한다.

## 저장 항목

- 인증 시도
- 인증 성공/실패
- 투표 시간
- IP 정보
- 브라우저 정보
- 위임 이력
- 예외 승인 이력
- 관리자 수정 이력

---

# 12. 운영 정책

## 핵심 원칙

전자투표 시스템은 자유로운 CMS 형태가 아닌 절차 기반 업무 시스템으로 운영한다.

따라서:
- 예외 상황은 제한적으로 처리
- 진행중 구조 변경 최소화
- 유권자 기준 사전 확정
- 관리자 권한 최소화

를 운영 원칙으로 한다.

---

# 13. 권장 운영 프로세스

## 회원정보 사전 검증 기간 운영

투표 시작 전 회원정보 확인 기간 운영 권장.

### 검증 항목

- 회원번호
- 휴대폰번호
- 이메일
- 생년월일

### 목적

- 인증 실패 감소
- 예외 처리 최소화
- 운영 안정성 확보

---

# 14. 최종 시스템 흐름

```text
구글 스프레드시트
→ 회원명단 동기화
→ 유권자 그룹 확정
→ 투표 생성
→ 링크 발송
→ 사용자 인증
→ 회원 매칭
→ 투표 진행
→ 결과 집계
→ Excel/CSV 출력
→ 홈페이지 공지
```

---

# 15. 개발 기술 명세

본 섹션은 개발팀 향 기술 구현 가이드입니다.

## 15-1. 이니시스 간편인증 API 연동

### 통합 방식

**SDK 사용** (권장):
- 이니시스 제공 JavaScript SDK 사용
- 팝업 형태 또는 embedded form

### 수집 데이터

```javascript
{
  "authName": "김멘사",           // 인증된 이름
  "phoneNumber": "01012345678",   // 인증된 휴대폰번호 (하이픈 제거)
  "birthDate": "19900101",         // 생년월일 (YYYYMMDD)
  "uniqueId": "XXXX",              // 이니시스 고유 인증 ID (재인증 방지용)
  "authTime": "2026-05-13T10:30:00Z" // 인증 시간
}
```

### 오류 처리

| 오류 | 처리 |
|---|---|
| 인증 취소 | 사용자 화면으로 복귀, 재시도 옵션 |
| 인증 실패 | 오류 메시지 표시, 재시도 옵션 |
| 통신 오류 | 재시도 또는 예외 요청으로 유도 |
| 타임아웃 | 30초 초과 시 실패 처리 |

---

## 15-2. 구글 스프레드시트 연동

### 회원명단 조회

**시기:**
- 투표 생성 시 (초기 동기화)
- 관리자 수동 동기화
- 매 사용자 인증 시 (또는 캐시 사용)

**조회 정보:**
```
Sheet: "회원명단"
Column: [이름, 회원번호, 휴대폰번호, 이메일, 생년월일]
```

### API 구현 옵션

#### 옵션 A. Google Sheets API v4 (권장)

```javascript
// 필요 권한: spreadsheets.readonly

const getMembers = async (spreadsheetId, range) => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `회원명단!A2:E`, // 헤더 제외, 모든 행
  });
  return response.data.values;
};
```

**장점:**
- 공식 Google API
- 신뢰성 높음
- 버전 관리 용이

**단점:**
- 인증 설정 필수
- API 쿼터 관리 필요

#### 옵션 B. 정기 CSV 다운로드 (대안)

```javascript
// 방법: 
// 1. 관리자가 스프레드시트에서 CSV 다운로드
// 2. 시스템에 업로드
// 3. 파일 파싱
```

**장점:**
- 설정 간단
- API 쿼터 무관

**단점:**
- 수동 동기화
- 실시간성 낮음

### 캐싱 전략

**투표별 스냅샷 생성:**
```
투표 생성 시 구글 스프레드시트 데이터를 DB 또는 로컬 JSON으로 저장
→ 투표 진행 중 이 스냅샷을 검증 기준으로 사용
→ 데이터 변경 방지
```

---

## 15-3. 회원 검증 로직

### 1차 매칭 함수

```javascript
function validateMember_Primary(
  name,           // 이니시스 수집 이름
  phoneNumber,    // 이니시스 수집 번호
  memberNumber,   // 사용자 입력
  memberList      // DB 또는 캐시
) {
  // 데이터 정규화
  const normalizedPhone = phoneNumber.replace(/[^\d]/g, '');
  const normalizedName = name.trim();
  const normalizedMemberNum = memberNumber.trim();

  // 일치 확인
  const match = memberList.find(
    member =>
      member.이름.trim() === normalizedName &&
      member.휴대폰번호.replace(/[^\d]/g, '') === normalizedPhone &&
      member.회원번호.trim() === normalizedMemberNum
  );

  return match ? { success: true, member: match } : { success: false };
}
```

### 2차 매칭 함수

```javascript
function validateMember_Secondary(
  name,           // 이니시스 수집 이름
  birthDate,      // 이니시스 수집 생년월일 (YYYYMMDD)
  memberNumber,   // 사용자 입력
  memberList      // DB 또는 캐시
) {
  // 데이터 정규화
  const normalizedName = name.trim();
  const normalizedBirth = birthDate.replace(/[^\d]/g, ''); // YYYYMMDD
  const normalizedMemberNum = memberNumber.trim();

  // 생년월일 형식 통일
  const normalizedBirthDB = birth => {
    let b = birth.replace(/[^\d]/g, '');
    if (b.length === 6) b = '19' + b; // 2자리 → 4자리
    return b;
  };

  // 일치 확인
  const match = memberList.find(
    member =>
      member.이름.trim() === normalizedName &&
      normalizedBirthDB(member.생년월일) === normalizedBirth &&
      member.회원번호.trim() === normalizedMemberNum
  );

  return match ? { success: true, member: match } : { success: false };
}
```

---

## 15-4. 예외 요청 저장소

### 저장 방식 선택

#### 옵션 A. 전용 Google Sheet (권장)

구글 스프레드시트에 별도 시트 추가:

```
Sheet: "예외요청"
Columns: [
  요청시간,
  이름(이니시스),
  휴대폰번호(이니시스),
  생년월일(이니시스),
  회원번호(입력),
  요청사유,
  추가연락처,
  요청상태,
  처리방식,
  처리관리자,
  처리시간,
  비고
]
```

**장점:**
- 관리자가 직관적으로 관리 가능
- 데이터 공유 용이
- 히스토리 자동 보존

#### 옵션 B. 전용 DB 테이블

```sql
CREATE TABLE exception_requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  vote_id INT,
  request_time TIMESTAMP,
  user_name VARCHAR(50),
  phone_number VARCHAR(20),
  birth_date VARCHAR(8),
  member_number VARCHAR(20),
  request_reason TEXT,
  contact_email VARCHAR(100),
  contact_phone VARCHAR(20),
  status VARCHAR(20), -- 'pending', 'approved', 'rejected'
  processing_type VARCHAR(20), -- 'correction', 'temp_link', 'recheck', 'rejected'
  processed_by VARCHAR(50),
  processed_time TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## 15-5. 1회용 예외 인증 링크 생성

### 링크 생성 로직

```javascript
async function generateExceptionLink(exceptionRequestId, vote) {
  // 토큰 생성
  const token = crypto.randomBytes(32).toString('hex');
  
  // 만료 시간 설정 (24시간)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  // DB에 저장
  await db.insert('exception_tokens', {
    token,
    exceptionRequestId,
    voteId: vote.id,
    expiresAt,
    used: false,
    createdAt: new Date(),
  });

  // 링크 생성
  const baseUrl = process.env.SITE_URL;
  const link = `${baseUrl}/vote/${vote.id}/exception-login?token=${token}`;

  return {
    link,
    expiresAt,
  };
}
```

### 링크 검증 로직

```javascript
async function validateExceptionLink(token) {
  const tokenRecord = await db.findOne('exception_tokens', { token });

  if (!tokenRecord) {
    return { valid: false, reason: 'TOKEN_NOT_FOUND' };
  }

  if (tokenRecord.used) {
    return { valid: false, reason: 'TOKEN_ALREADY_USED' };
  }

  if (new Date() > tokenRecord.expiresAt) {
    return { valid: false, reason: 'TOKEN_EXPIRED' };
  }

  return {
    valid: true,
    exceptionRequestId: tokenRecord.exceptionRequestId,
    voteId: tokenRecord.voteId,
  };
}
```

### 링크 사용 처리

```javascript
async function useExceptionLink(token) {
  // 토큰 검증
  const validation = await validateExceptionLink(token);
  if (!validation.valid) {
    throw new Error(validation.reason);
  }

  // 사용 표시
  await db.update('exception_tokens', { token }, { used: true });

  // 세션 생성
  const session = await createVotingSession({
    exceptionRequestId: validation.exceptionRequestId,
    voteId: validation.voteId,
    authType: 'admin_exception',
  });

  return session;
}
```

---

## 15-6. 로그 기록

### 인증 로그

```javascript
async function logAuthentication(event) {
  await db.insert('auth_logs', {
    voteId: event.voteId,
    timestamp: new Date(),
    authType: event.authType, // 'iniis' | 'exception'
    iniisAuthId: event.iniisAuthId,
    userName: event.userName,
    phoneNumber: event.phoneNumber,
    birthDate: event.birthDate,
    memberNumber: event.memberNumber,
    primaryMatch: event.primaryMatch,
    secondaryMatch: event.secondaryMatch,
    result: event.result, // 'success' | 'failure'
    failureReason: event.failureReason,
    exceptionRequested: event.exceptionRequested,
    userIpAddress: event.ipAddress,
    userAgent: event.userAgent,
  });
}
```

### 관리자 조치 로그

```javascript
async function logAdminAction(action) {
  await db.insert('admin_action_logs', {
    voteId: action.voteId,
    exceptionRequestId: action.exceptionRequestId,
    timestamp: new Date(),
    adminName: action.adminName,
    actionType: action.actionType, // 'correction' | 'temp_link' | 'reject'
    details: action.details,
    resultingStatus: action.resultingStatus,
  });
}
```

---

## 15-7. API 엔드포인트 명세

### 1. 이니시스 인증 콜백

```
POST /api/vote/{voteId}/auth/iniis-callback
Request: {
  authName: string,
  phoneNumber: string,
  birthDate: string (YYYYMMDD),
  uniqueId: string
}
Response: {
  step: "member_number_input",
  iniisData: { ...인증 정보 },
  message: "회원번호를 입력해주세요"
}
```

### 2. 회원 검증

```
POST /api/vote/{voteId}/auth/validate-member
Request: {
  iniisAuthId: string,
  memberNumber: string
}
Response: {
  success: boolean,
  step: "voting" | "exception_form",
  sessionId?: string,
  errorReason?: string
}
```

### 3. 예외 요청 제출

```
POST /api/vote/{voteId}/auth/submit-exception
Request: {
  name: string,
  phoneNumber: string,
  birthDate: string,
  memberNumber: string,
  previousPhone?: string,
  reason: string,
  additionalContact: string
}
Response: {
  success: boolean,
  exceptionRequestId: string,
  message: "요청이 접수되었습니다. 관리자 검토 후 연락드리겠습니다."
}
```

### 4. 관리자: 예외 요청 목록 조회

```
GET /api/vote/{voteId}/admin/exception-requests?status=pending
Response: {
  requests: [
    {
      id: string,
      requestTime: string,
      userName: string,
      phoneNumber: string,
      memberNumber: string,
      reason: string,
      status: string,
      contact: string
    }
  ]
}
```

### 5. 관리자: 예외 요청 처리

```
POST /api/vote/{voteId}/admin/exception-requests/{requestId}/process
Request: {
  action: "correct_info" | "issue_temp_link" | "request_recheck" | "reject",
  details: { ... },
  adminName: string
}
Response: {
  success: boolean,
  tempLink?: string, // action이 'issue_temp_link'인 경우
  message: string
}
```

### 6. 임시 링크 투표 진입

```
GET /api/vote/{voteId}/exception-login?token=xxxx
Response:
  - Redirect to voting page with session
  - Or error page if token invalid/expired
```

---

## 15-8. 보안 고려사항

### 민감 정보 암호화

- 생년월일: 저장 시 암호화
- 휴대폰번호: 저장 시 암호화
- 이니시스 인증 ID: 저장 시 암호화

### 세션 보안

- 세션 토큰: 24시간 또는 투표 종료 시 만료
- HTTPS only
- Secure + HttpOnly 쿠키 사용

### 예외 요청 검증

- 중복 요청 방지 (동일 투표 + 이름 + 회원번호)
- Rate limiting (사용자당 1시간에 3회 이상 요청 제한)
- 요청 기간 제한 (투표 시작 후 N일 이내)

---

## 15-9. 테스트 시나리오

### 단위 테스트

| 항목 | 테스트 케이스 |
|---|---|
| 1차 매칭 | 일치 / 이름 불일치 / 번호 불일치 / 회원번호 불일치 |
| 2차 매칭 | 일치 / 생년월일 불일치 / 회원번호 불일치 |
| 데이터 정규화 | 공백 제거 / 하이픈 제거 / 형식 통일 |
| 임시 링크 | 생성 / 검증 / 만료 / 중복 사용 차단 |

### 통합 테스트

| 시나리오 | 기대 결과 |
|---|---|
| 정상 인증 (1차 매칭 성공) | 투표 진입 성공 |
| 전화번호 변경 (2차 매칭 성공) | 투표 진입 성공 |
| 정상 인증 + 회원번호 오입력 | 예외 요청 화면 표시 |
| 예외 요청 + 관리자 승인 | 임시 링크 발급 |
| 임시 링크 24시간 후 | 링크 만료 |

---