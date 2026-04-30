/**
 * convert_foresto_scenario.js
 * 기존 테스트시나리오_한국숲해설가협회.xlsx → 표준 17컬럼 포맷으로 재생성
 *
 * Usage:
 *   cd _shared/scripts
 *   node convert_foresto_scenario.js
 *
 * 소스 컬럼: No. | 화면 ID | 화면명 | 테스트 케이스명 | 사전 조건 | 테스트 절차 | 예상 결과 | 우선순위 | 결과 | 결함 ID | 비고
 * 출력 컬럼: No | 구분 | Screen ID | 세부기능제목 | 세부 기능 구현 설명 | 유형 | 테스트케이스ID |
 *            사전조건 | 상세테스트항목 | 테스트데이터 및 절차 | 예상결과 |
 *            검수결과 | 검수자 | 검수일 | 비고(요청 및 오류 사항) | 담당자 | 예정처리일
 */

const path    = require('path');
const fs      = require('fs');
const ExcelJS = require('exceljs');

const SRC_XLSX = path.resolve(__dirname, '../../workspace/EunAh/foresto_homepage/테스트시나리오_한국숲해설가협회.xlsx');
const OUT_XLSX = SRC_XLSX;

// ─── 표준 헤더 ───────────────────────────────────────────────────────────────
const HEADERS = [
  'No', '구분', 'Screen ID', '세부기능제목', '세부 기능 구현 설명',
  '유형', '테스트케이스\nID', '사전조건', '상세테스트항목',
  '테스트데이터 및 절차', '예상결과',
  '검수결과', '검수자', '검수일',
  '비고(요청 및 오류 사항)', '담당자', '예정처리일'
];

const COL_TYPE     = 6;   // F  유형
const COL_RESULT   = 12;  // L  검수결과
const COL_QA_START = 12;  // L~ 배경색 구분 시작

// ─── 색상 팔레트 ──────────────────────────────────────────────────────────────
const C = {
  titleBg:     '2D3047',
  headerGenBg: '455A64',
  headerQaBg:  '1B5E20',
  dataQaBg:    'F1F8E9',
  white:       'FFFFFFFF',
  border:      'BDBDBD',
};

// ─── 헬퍼 ─────────────────────────────────────────────────────────────────────
function cellStr(cell) {
  const v = cell.value;
  if (v === null || v === undefined) return '';
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === 'object' && v.richText) return v.richText.map(r => r.text).join('');
  if (typeof v === 'object' && v.text !== undefined) return String(v.text);
  return String(v).trim();
}

// 기존 결과값 → 표준 검수결과
function mapResult(val) {
  const v = (val || '').trim().toLowerCase();
  if (v === 'pass' || v === '합격') return '합격';
  if (v === 'fail' || v === '불합격') return '불합격';
  if (v === 'check' || v === '보류') return '보류';
  if (v === '미검수') return '미검수';
  return '';
}

// 유형 추정 (기능 / 비기능)
function inferType(title, procedure, expected) {
  const text = [title, procedure, expected].join(' ');
  const funcKw    = /등록|수정|삭제|조회|검색|업로드|로그인|로그아웃|신청|저장|전송|필터|정렬|페이징|다운로드|회원가입|비밀번호.*변경|입력.*제출|폼 제출|form|crud|api 호출/i;
  const nonfuncKw = /페이지 접근|화면 표시|화면.*이동|렌더링|인증|권한|반응형|레이아웃|메뉴.*클릭|내비게이션|브레드크럼|팝업.*노출|정책|UI 구조|배치|색상/i;
  if (funcKw.test(text))    return '기능';
  if (nonfuncKw.test(text)) return '비기능';
  return '기능';
}

// 테스트케이스ID 생성 (화면ID 기준 순번)
function buildTcId(screenId, seqMap) {
  const key = (screenId || 'xx').toLowerCase().replace(/\s+/g, '');
  seqMap[key] = (seqMap[key] || 0) + 1;
  return `${key}-t${String(seqMap[key]).padStart(2, '0')}`;
}

// ─── 셀 스타일 헬퍼 ──────────────────────────────────────────────────────────
function applyBorder(cell) {
  const thin = { style: 'thin', color: { argb: C.border } };
  cell.border = { top: thin, left: thin, bottom: thin, right: thin };
}

function styleHeader(cell, bgArgb) {
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgArgb } };
  cell.font = { bold: true, color: { argb: C.white }, size: 10 };
  cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  applyBorder(cell);
}

function styleData(cell, isQaCol, wrapText) {
  if (isQaCol) {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.dataQaBg } };
  }
  cell.font = { size: 10 };
  cell.alignment = { vertical: 'top', wrapText: !!wrapText };
  applyBorder(cell);
}

// ─── 워크시트 생성 ────────────────────────────────────────────────────────────
async function buildWorksheet(wb, cases, sheetName, sheetTitle, tabArgb) {
  const ws = wb.addWorksheet(sheetName, {
    views: [{ state: 'frozen', ySplit: 2, xSplit: 0, topLeftCell: 'A3', activeCell: 'A3' }],
    properties: { tabColor: { argb: tabArgb } }
  });

  ws.columns = [
    { width: 6  }, // A  No
    { width: 18 }, // B  구분
    { width: 10 }, // C  Screen ID
    { width: 24 }, // D  세부기능제목
    { width: 36 }, // E  세부 기능 구현 설명
    { width: 8  }, // F  유형
    { width: 16 }, // G  테스트케이스ID
    { width: 16 }, // H  사전조건
    { width: 16 }, // I  상세테스트항목
    { width: 38 }, // J  테스트데이터 및 절차
    { width: 32 }, // K  예상결과
    { width: 10 }, // L  검수결과
    { width: 10 }, // M  검수자
    { width: 12 }, // N  검수일
    { width: 28 }, // O  비고
    { width: 10 }, // P  담당자
    { width: 12 }, // Q  예정처리일
  ];

  // Row 1: 타이틀 (A1:Q1 병합)
  const titleRow = ws.getRow(1);
  titleRow.height = 28;
  for (let c = 1; c <= 17; c++) {
    const cell = titleRow.getCell(c);
    cell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.titleBg } };
    cell.font  = { bold: true, color: { argb: C.white }, size: 13 };
    cell.alignment = { vertical: 'middle', horizontal: 'left' };
    applyBorder(cell);
  }
  titleRow.getCell(1).value = sheetTitle;
  ws.mergeCells('A1:Q1');

  // Row 2: 헤더
  const headerRow = ws.getRow(2);
  headerRow.height = 36;
  HEADERS.forEach((h, i) => {
    const colIdx = i + 1;
    const isQa   = colIdx >= COL_QA_START;
    styleHeader(headerRow.getCell(colIdx), isQa ? C.headerQaBg : C.headerGenBg);
    headerRow.getCell(colIdx).value = h;
  });

  // 데이터 행
  const wrapCols = new Set([5, 10, 11, 15]);
  for (let i = 0; i < cases.length; i++) {
    const c      = cases[i];
    const rowNum = i + 3;
    const values = [
      c.no, c.category, c.screenId, c.title, c.desc,
      c.type, c.tcId, c.pre, c.item, c.procedure, c.expected,
      c.result, c.reviewer, c.reviewDate,
      c.note, c.assignee, c.dueDate
    ];

    const dataRow  = ws.getRow(rowNum);
    dataRow.height = 18;

    values.forEach((v, ci) => {
      const colIdx  = ci + 1;
      const isQaCol = colIdx >= COL_QA_START;
      const cell    = dataRow.getCell(colIdx);
      cell.value    = v;
      styleData(cell, isQaCol, wrapCols.has(colIdx));
    });

    ws.getCell(rowNum, COL_TYPE).dataValidation = {
      type: 'list', allowBlank: true,
      formulae: ['"기능,비기능"'], showErrorMessage: false,
    };
    ws.getCell(rowNum, COL_RESULT).dataValidation = {
      type: 'list', allowBlank: true,
      formulae: ['"합격,불합격,보류,미검수"'], showErrorMessage: false,
    };
  }

  return ws;
}

// ─── 표지 시트 생성 ──────────────────────────────────────────────────────────
function buildCoverSheet(wb, counts) {
  const ws = wb.addWorksheet('표지', {
    properties: { tabColor: { argb: 'FF2D3047' } }
  });

  ws.columns = [{ width: 22 }, { width: 44 }];

  const titleCell = ws.getRow(1).getCell(1);
  titleCell.value = '한국숲해설가협회 홈페이지 테스트 시나리오';
  titleCell.font  = { bold: true, size: 16, color: { argb: C.white } };
  titleCell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.titleBg } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  ws.getRow(1).height = 44;
  ws.mergeCells('A1:B1');

  const addRow = (label, value) => {
    const r = ws.addRow([label, value]);
    r.getCell(1).font      = { bold: true, size: 11 };
    r.getCell(1).fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8EAF6' } };
    r.getCell(1).alignment = { vertical: 'middle' };
    r.getCell(2).font      = { size: 11 };
    r.getCell(2).alignment = { vertical: 'middle' };
    r.height = 22;
    const thin = { style: 'thin', color: { argb: C.border } };
    [1, 2].forEach(c => {
      r.getCell(c).border = { top: thin, left: thin, bottom: thin, right: thin };
    });
  };

  ws.addRow([]).height = 10;
  addRow('프로젝트명', '한국숲해설가협회 홈페이지 구축');
  addRow('작성일', new Date().toISOString().slice(0, 10));
  addRow('작성자', '');
  addRow('버전', 'v2.0');
  ws.addRow([]).height = 10;
  addRow('공통 TC 수', `${counts.common}개`);
  addRow('사용자 TC 수', `${counts.user}개`);
  addRow('관리자 TC 수', `${counts.admin}개`);
  addRow('총 TC 수', `${counts.common + counts.user + counts.admin}개`);
}

// ─── 소스 시트 파싱 ──────────────────────────────────────────────────────────
function parseSheet(ws, sheetLabel) {
  const cases  = [];
  const seqMap = {};

  // 헤더 행 위치 탐색 (첫 5행 내에서 컬럼명 패턴 검출)
  let headerRowNum = 1;
  let colScreenId  = 2, colCategory = 3, colTitle = 4;
  let colPre = 5, colProc = 6, colExpected = 7;
  let colResult = 9, colNote = 11;

  ws.eachRow((row, rowNum) => {
    if (rowNum > 5 || headerRowNum > 1) return;
    let foundHeader = false;
    row.eachCell((cell, colNum) => {
      const val = cellStr(cell).replace(/\s+/g, '').toLowerCase();
      if (/^no\.?$/.test(val) || /화면.?id/.test(val) || /테스트케이스명/.test(val)) {
        foundHeader = true;
      }
    });
    if (foundHeader) {
      headerRowNum = rowNum;
      row.eachCell((cell, colNum) => {
        const val = cellStr(cell).replace(/\s+/g, '').toLowerCase();
        if (/화면.?id|screenid/.test(val))           colScreenId  = colNum;
        else if (/화면명/.test(val))                  colCategory  = colNum;
        else if (/테스트케이스명|케이스명/.test(val)) colTitle     = colNum;
        else if (/사전.?조건/.test(val))              colPre       = colNum;
        else if (/테스트.?절차/.test(val))            colProc      = colNum;
        else if (/예상.?결과/.test(val))              colExpected  = colNum;
        else if (/결과/.test(val) && !/예상/.test(val)) colResult  = colNum;
        else if (/비고/.test(val))                    colNote      = colNum;
      });
    }
  });

  console.log(`  [${sheetLabel}] 헤더 행: ${headerRowNum}행, 컬럼 위치: ID=${colScreenId} 구분=${colCategory} 제목=${colTitle} 절차=${colProc} 결과=${colResult}`);

  let currentScreenId = '';
  let currentCategory = '';

  ws.eachRow((row, rowNum) => {
    if (rowNum <= headerRowNum) return;

    const rawScreenId  = cellStr(row.getCell(colScreenId));
    const rawCategory  = cellStr(row.getCell(colCategory));
    const title        = cellStr(row.getCell(colTitle));
    const pre          = cellStr(row.getCell(colPre));
    const procedure    = cellStr(row.getCell(colProc));
    const expected     = cellStr(row.getCell(colExpected));
    const result       = cellStr(row.getCell(colResult));
    const note         = cellStr(row.getCell(colNote));

    // 병합 셀 대응: 빈 값이면 이전 값 유지
    if (rawScreenId)  currentScreenId = rawScreenId;
    if (rawCategory)  currentCategory = rawCategory;

    const screenId = currentScreenId;
    const category = currentCategory || screenId;

    // 구분자 행 건너뜀 (테스트 케이스명 없거나, 화면명·ID와 동일한 경우)
    if (!title) return;
    if (title === category || title === screenId) return;
    // 모든 주요 셀 비어있는 행 건너뜀
    if (!title && !procedure && !expected) return;

    cases.push({
      no:         cases.length + 1,
      category,
      screenId,
      title,
      desc:       '',
      type:       inferType(title, procedure, expected),
      tcId:       buildTcId(screenId, seqMap),
      pre,
      item:       '',
      procedure,
      expected,
      result:     mapResult(result),
      reviewer:   '',
      reviewDate: '',
      note,
      assignee:   '',
      dueDate:    ''
    });
  });

  return cases;
}

// ─── 메인 ────────────────────────────────────────────────────────────────────
async function main() {
  if (!fs.existsSync(SRC_XLSX)) {
    console.error('소스 파일 없음:', SRC_XLSX);
    process.exit(1);
  }

  console.log('소스 파일 읽는 중...\n');
  const srcWb = new ExcelJS.Workbook();
  await srcWb.xlsx.readFile(SRC_XLSX);

  console.log(`시트 목록: ${srcWb.worksheets.map(w => w.name).join(', ')}\n`);

  const sheetData = { common: [], user: [], admin: [] };

  srcWb.worksheets.forEach(ws => {
    const name = ws.name;
    if (/공통/i.test(name)) {
      sheetData.common = parseSheet(ws, '공통');
      console.log(`  → 공통 ${sheetData.common.length}개 TC 추출\n`);
    } else if (/사용자|user/i.test(name)) {
      sheetData.user = parseSheet(ws, '사용자');
      console.log(`  → 사용자 ${sheetData.user.length}개 TC 추출\n`);
    } else if (/관리자|admin/i.test(name)) {
      sheetData.admin = parseSheet(ws, '관리자');
      console.log(`  → 관리자 ${sheetData.admin.length}개 TC 추출\n`);
    } else {
      console.log(`  [건너뜀] ${name}`);
    }
  });

  // 새 워크북 생성
  const wb     = new ExcelJS.Workbook();
  wb.creator   = 'BN_SYS PM Automation';
  wb.created   = new Date();
  wb.modified  = new Date();

  const counts = {
    common: sheetData.common.length,
    user:   sheetData.user.length,
    admin:  sheetData.admin.length,
  };

  buildCoverSheet(wb, counts);

  if (counts.common > 0)
    await buildWorksheet(wb, sheetData.common, '공통', '공통 테스트 시나리오', 'FF607D8B');
  if (counts.user > 0)
    await buildWorksheet(wb, sheetData.user,   '사용자', '사용자 테스트 시나리오', 'FF1976D2');
  if (counts.admin > 0)
    await buildWorksheet(wb, sheetData.admin,  '관리자', '관리자 테스트 시나리오', 'FF388E3C');

  await wb.xlsx.writeFile(OUT_XLSX);

  console.log(`\n✅ 완료: ${OUT_XLSX}`);
  console.log(`   공통 ${counts.common}개 / 사용자 ${counts.user}개 / 관리자 ${counts.admin}개 (총 ${counts.common + counts.user + counts.admin}개)`);
}

main().catch(e => { console.error('오류:', e.message); process.exit(1); });
