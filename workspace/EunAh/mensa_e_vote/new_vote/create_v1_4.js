const fs = require('fs');

const pathV1_3 = 'c:\\Users\\BN659\\Desktop\\BN_SYS\\workspace\\EunAh\\mensa_e_vote\\new_vote\\기획서_전자투표시스템_v1.3.md';
const pathV1_4 = 'c:\\Users\\BN659\\Desktop\\BN_SYS\\workspace\\EunAh\\mensa_e_vote\\new_vote\\기획서_전자투표시스템_v1.4.md';

let content = fs.readFileSync(pathV1_3, 'utf8');
content = content.replace(/\r\n/g, '\n');

// 1. Update Version
content = content.replace('**버전:** v1.3', '**버전:** v1.4');
content = content.replace('기획서_전자투표시스템_v1.3.md', '기획서_전자투표시스템_v1.4.md');
content = content.replace('기획서 v1.3', '기획서 v1.4');
content = content.replace(/v1\.3/g, 'v1.4');

// 2. Refactor Section 1
const section1Orig = `# 1. 프로젝트 개요

## 1-1. 프로젝트 목적

멘사코리아 정회원을 대상으로 운영 가능한 전자투표 시스템을 신규 구축한다.  
기존 시스템이 쇼핑몰 기반으로 제한적으로 운영되어 왔던 구조를 탈피하여,  
**멘사코리아 정회원이라면 누구나 참여할 수 있는 독립형 전자투표 플랫폼**을 목표로 한다.

## 1-2. 기존 시스템 한계

| 한계 항목 | 내용 |
|---|---|
| 투표 자격 제한 | 쇼핑몰 회원가입 + 티켓 구매자만 직접 투표 가능 |
| 인증 방식 종속 | 주문번호(끝 5자리) 기반 인증 → 쇼핑몰 의존 |
| 투표 유형 단일화 | 총회 의결 중심의 단일 유형만 운영 가능 |
| 위임 처리 복잡 | 비구매자는 직접 접근 불가, 수임인이 대신 행사 |
| 안건 상태 단순 | 열림/닫힘 2단계만 존재, 준비중·제외 없음 |
| 모수 산정 불명확 | 안건별 실제 투표 참여자 수를 모수로 계산하여 득표율이 항상 100%로 표시됨 |
| 확장성 부재 | 총회 외 임원 선출, 헌장 개정 등 다양한 투표 운영 불가 |

## 1-3. 신규 구축 목적

- 쇼핑몰 의존 없이 **정회원 자격 기준**으로 투표권 부여
- **이니시스 간편인증** 기반의 강력한 본인확인 체계 도입
- **다양한 투표 유형**(임원 선출, 헌장 개정, 총회 의결, 커스텀)을 하나의 플랫폼에서 운영
- **구글 스프레드시트** 연동을 통한 회원 명단 관리 효율화
- **위임 관리**, **예외 처리 프로세스**, **감사 로그** 등 운영 신뢰성 확보`;

const section1New = `# 1. 프로젝트 개요

본 프로젝트는 기존 총회 전자투표 시스템을 완전히 대체하는 것이 아니라, 우선적으로 **쇼핑몰 회원 연동의 한계를 극복하기 위해 독립적으로 구축되는 신규 투표 시스템**이다. 기존 소스는 그대로 유지하며, 향후 하나의 시스템으로 통합하는 방향으로 고도화해 나간다.

## 1-1. 기존 투표 시스템 내용 (As-Is)

기존 전자투표 시스템은 다음과 같은 구조로 운영되었으며, 이로 인한 한계가 존재했다.

| 항목 | 내용 | 한계점 |
|---|---|---|
| 투표 자격 및 인증 | 쇼핑몰 회원가입 후 티켓 구매자 대상으로만 직접 투표 권한 부여, 주문번호(끝 5자리) 기반 인증 | 쇼핑몰에 완전 종속, 비회원/비구매자는 직접 접근 불가 |
| 투표 유형 및 상태 | 총회 의결 중심 단일 유형, 안건은 열림/닫힘 2단계만 존재 | 임원 선출 등 타 성격 투표 불가, 준비중/제외 등 유연한 상태 관리 불가 |
| 모수 산정 | 안건별 실제 투표 참여자 수를 모수로 계산 | 득표율이 항상 100%로 산정되는 오류 발생 |

## 1-2. 신규 시스템 내용 (Phase 1 목표)

이번 프로젝트(v1.4 기준)는 복잡도를 낮추고 가장 시급하고 핵심적인 **'독립형 온라인 투표' 기능 구현**에 집중한다.

| 핵심 구현 목표 | 내용 |
|---|---|
| **독립형 온라인 투표** | 기존 시스템을 대체하지 않고 별도 신규 시스템 구축 |
| **참여 기준 변경** | 쇼핑몰 회원이 아닌 **구글 스프레드시트** 기반 명단을 통해 참여 권한 부여 |
| **강력한 본인 확인** | **이니시스 간편인증**을 통해 실명 기반 투표 참여 검증 |
| **핵심 투표 유형 우선** | 임원 선출, 정관 개정, 찬반 의결 등 핵심 목적의 투표 템플릿 우선 제공 |

## 1-3. 차후 확장 범위 (Phase 2 이후)

시스템은 확장 가능하도록 설계하되, 아래의 기능들은 당장 구현하지 않고 점진적으로 고도화한다.

- **기존 시스템과의 통합:** 기존 총회 전자투표 시스템과 신규 시스템을 단일 플랫폼으로 통합
- **커스텀 투표 및 설문:** 관리자가 직접 항목을 자유롭게 구성하는 커스텀 양식과 일반 설문조사 기능
- **정기총회 전용 기능:** 위임 관리(수임인 인증), 현장 투표 및 참석 체크인, 의장 귀속 투표 등
- **증빙 서류 발급:** 투표 확인증 및 당선증 시스템 내 자동 발급`;

content = content.replace(section1Orig, section1New);

// 3. Mark custom / survey as deferred in Section 7
// Search for '커스텀' and add '(추후 확장)' if not there
content = content.replace(/④ 커스텀 투표 \(custom\)/g, '④ 커스텀 투표 (custom) *(이번 구축 범위 제외 — 추후 확장)*');
// Under 7-1:
const customRow = `| 커스텀 | 자유롭게 안건과 선택지 구성 | 위원회 투표, 설문조사 등 |`;
const newCustomRow = `| 커스텀 | 자유롭게 안건과 선택지 구성 *(이번 구축 범위 제외)* | 위원회 투표, 설문조사 등 |`;
content = content.replace(customRow, newCustomRow);

// In 7-2, mark survey/custom
const textAgenda = `### ⑤ 서술형 (text)`;
const newTextAgenda = `### ⑤ 서술형 (text) *(이번 구축 범위 제외 — 추후 확장)*

> ⚠️ **자유 텍스트 입력 및 설문 형태의 안건은 이번 구축 범위에서 제외됩니다.**`;
content = content.replace(textAgenda, newTextAgenda);

// Make sure we mark Phase 3 correctly (서술형 안건, 복수선택형 안건)
// They are already in Phase 3 or Phase 2 in section 15.
const customAgendaMatch = /\| 커스텀 투표 생성 \|/;
if(content.match(customAgendaMatch)) {
    // handled implicitly
}


// Replace the Table of Contents item for section 16-6
content = content.replace(/v1\.4 신규/g, 'v1.1 신규'); // revert if I accidentally changed it

fs.writeFileSync(pathV1_4, content.replace(/\n/g, '\r\n'), 'utf8');
console.log("Successfully created v1.4");
