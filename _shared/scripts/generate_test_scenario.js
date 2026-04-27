/**
 * generate_test_scenario.js
 * 프로토타입 HTML 개발자 주석 → 단위테스트 시나리오 Excel 자동 생성
 *
 * Usage:
 *   node generate_test_scenario.js <project_root>
 *
 * Input:
 *   <project_root>/04_storyboard/data/pages.json
 *   <project_root>/outputs/*.html
 *
 * Output:
 *   <project_root>/06_qa/단위테스트_시나리오.xlsx
 *   (기존 파일 존재 시 검수결과·검수자·검수일·비고·담당자 보존 후 병합)
 */

const path    = require('path');
const fs      = require('fs');
const ExcelJS = require('exceljs');

// ─── CLI ──────────────────────────────────────────────────────────────────────
const projectRoot = process.argv[2];
if (!projectRoot) { console.error('Usage: node generate_test_scenario.js <project_root>'); process.exit(1); }

const PAGES_JSON  = path.join(projectRoot, '04_storyboard', 'data', 'pages.json');
const HTML_DIR    = path.join(projectRoot, 'outputs');
const OUTPUT_DIR  = path.join(projectRoot, '06_qa');
const OUTPUT_XLSX = path.join(OUTPUT_DIR, '단위테스트_시나리오.xlsx');

if (!fs.existsSync(PAGES_JSON)) { console.error('pages.json 없음:', PAGES_JSON); process.exit(1); }
if (!fs.existsSync(HTML_DIR))   { console.error('outputs 폴더 없음:', HTML_DIR); process.exit(1); }
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// ─── 컬럼 정의 ────────────────────────────────────────────────────────────────
const HEADERS = [
  'No', '구분', 'Screen ID', '세부기능제목', '세부 기능 구현 설명',
  '유형', '테스트케이스\nID', '사전조건', '상세테스트항목',
  '테스트데이터 및 절차', '예상결과',
  '검수결과', '검수자', '검수일',
  '비고(요청 및 오류 사항)', '담당자', '예정처리일'
];
// col 인덱스 (1-based, exceljs 기준)
const COL_TYPE   = 6;   // 유형
const COL_RESULT = 12;  // 검수결과
const COL_QA_START = 12; // 검수결과 이후 열 시작

// ─── 색상 팔레트 ──────────────────────────────────────────────────────────────
const C = {
  titleBg:    '2D3047',  // 타이틀행 배경 (진한 네이비)
  headerGenBg: '455A64', // 헤더 A–K 배경 (블루그레이)
  headerQaBg:  '1B5E20', // 헤더 L–Q 배경 (진한 그린)
  dataQaBg:    'F1F8E9', // 데이터 L–Q 배경 (연한 민트)
  white:       'FFFFFFFF',
  border:      'BDBDBD',
};

// ─── HTML 파서 ────────────────────────────────────────────────────────────────
function parseHTML(html) {
  const result = { path: '', apis: [], forms: [], apiDataList: [], hasAdminAuth: false, sections: [] };

  const pathM = html.match(/PATH\s*:\s*(.+)/);
  if (pathM) result.path = pathM[1].trim();

  if (/admin\].*session|session.*admin|admin.*login.*redirect/is.test(html) ||
      /\$_SESSION\[.admin.\]/i.test(html) ||
      /미로그인.*관리자|관리자.*redirect/i.test(html)) {
    result.hasAdminAuth = true;
  }

  // FORM 파싱
  const formBlocks = [...html.matchAll(/<!--\s*\[FORM:\s*(\S+)\]([\s\S]*?)-->/g)];
  for (const m of formBlocks) {
    const formId = m[1];
    const body   = m[2];
    let fields = [];
    const fieldLines = [...body.matchAll(/^\s{2,}(\w+)\s*[—–-]+\s*(.+)/gm)];
    for (const fl of fieldLines) {
      const fname = fl[1].trim();
      const fdesc = fl[2].trim();
      if (/\bhidden\b/i.test(fdesc)) continue;
      const isRequired = /required/i.test(fdesc);
      const isPassword = /password/i.test(fname) || /password/i.test(fdesc);
      const isConfirm  = /confirm|확인/i.test(fname);
      fields.push({ name: fname, desc: fdesc, required: isRequired, isPassword, isConfirm });
    }
    const hasUsableFields = fields.some(f => f.required || f.isPassword);
    if (fields.length === 0 || !hasUsableFields) {
      const formHtmlStart = html.indexOf(`id="${formId}"`);
      if (formHtmlStart !== -1) {
        const formSlice = html.slice(formHtmlStart, formHtmlStart + 5000);
        const inputMatches = [...formSlice.matchAll(/<(?:input|select|textarea)[^>]+name="(\w+)"([^>]*)/g)];
        for (const im of inputMatches) {
          const fname = im[1];
          const attrs = im[2];
          if (/type=.hidden/i.test(attrs)) continue;
          const isRequired = /\brequired\b/i.test(attrs);
          const isPassword = /type=.password/i.test(attrs) || /password/i.test(fname);
          const isConfirm  = /confirm|확인/i.test(fname);
          const maxlenM    = attrs.match(/maxlength="(\d+)"/);
          const desc = isPassword ? 'password, required' :
                       maxlenM   ? `text, ${isRequired ? 'required, ' : ''}${maxlenM[1]}자 이내` :
                                   (isRequired ? 'required' : 'optional');
          fields.push({ name: fname, desc, required: isRequired, isPassword, isConfirm });
        }
      }
    }
    const actionM = body.match(/action\s*:\s*(\S+)/i);
    const methodM = body.match(/method\s*:\s*(\S+)/i);
    result.forms.push({
      id: formId,
      action: actionM ? actionM[1] : '',
      method: methodM ? methodM[1].toUpperCase() : 'POST',
      fields
    });
  }

  // API-DATA 파싱
  const apiDataBlocks = [...html.matchAll(/API-DATA\s*(?:\([^)]+\))?\s*:\s*([^\n>]+)/g)];
  const seen = new Set();
  for (const m of apiDataBlocks) {
    const endpoint = m[1].trim().replace(/\s*-->.*/, '').trim();
    if (!endpoint || endpoint.startsWith(']') || endpoint.includes('-->')) continue;
    if (!seen.has(endpoint)) { seen.add(endpoint); result.apiDataList.push(endpoint); }
  }

  const sectionNames = [...html.matchAll(/\[SECTION:\s*(\w+)\]/g)].map(m => m[1]);
  result.sections = [...new Set(sectionNames)];

  return result;
}

// ─── 테스트케이스 생성기 ──────────────────────────────────────────────────────
function generateCases(page, parsed, category) {
  const cases = [];
  const id    = page.id.toLowerCase();
  let seq = 1;

  const mk = (title, desc, type, pre, item, procedure, expected) => ({
    tcId: `${id}-t${String(seq).padStart(2, '0')}`,
    title, desc, type, pre, item, procedure, expected
  });
  const mksub = (baseSeq, sub, title, desc, type, pre, item, procedure, expected) => ({
    tcId: `${id}-t${String(baseSeq).padStart(2, '0')}-${String(sub).padStart(2, '0')}`,
    title, desc, type, pre, item, procedure, expected
  });

  // 1. 페이지 접근
  cases.push(mk(
    '페이지 접근',
    `${page.name} 페이지 URL로 직접 접근 시 정상 로드된다`,
    '비기능', '',
    'UI 렌더링',
    `브라우저에서 ${parsed.path || '/' + page.path} 로 접근`,
    `${page.name} 페이지 정상 표시`
  )); seq++;

  // 2. 관리자 인증 체크
  if (page.section === 'admin') {
    const authSeq = seq++;
    cases.push(mksub(authSeq-1, 1,
      '관리자 인증 - 미로그인',
      '관리자 세션 없이 접근 시 로그인 페이지로 redirect된다',
      '비기능', '미로그인',
      '페이지 접근',
      `로그아웃 상태에서 ${parsed.path || '/' + page.path} 로 직접 접근`,
      '관리자 로그인 페이지로 redirect'
    ));
    cases.push(mksub(authSeq-1, 2,
      '관리자 인증 - 로그인',
      '관리자 세션 있을 때 페이지 정상 접근된다',
      '비기능', '관리자 로그인',
      '페이지 접근',
      `관리자 로그인 후 ${parsed.path || '/' + page.path} 로 접근`,
      `${page.name} 페이지 정상 표시`
    ));
  }

  // 3. GNB / 사이드바 네비게이션
  const hasGNB     = parsed.sections.includes('GNB');
  const hasSidebar = parsed.sections.some(s => /SIDEBAR/i.test(s));
  if (hasGNB || hasSidebar) {
    cases.push(mk(
      hasSidebar ? '사이드바 메뉴 동작' : 'GNB 메뉴 동작',
      hasSidebar ? '사이드바 각 메뉴 클릭 시 해당 페이지로 이동한다'
                 : 'GNB 각 메뉴 클릭 시 해당 페이지로 이동한다',
      '비기능', '',
      '버튼 동작',
      hasSidebar ? '사이드바 각 메뉴 링크 클릭' : 'GNB 각 메뉴 링크 클릭',
      '해당 페이지로 이동'
    )); seq++;
  }

  // 4. API-DATA 조회
  for (const apiEndpoint of parsed.apiDataList) {
    const apiSeq = seq++;
    cases.push(mksub(apiSeq-1, 1,
      '목록 데이터 조회 - 데이터 있음',
      `${apiEndpoint} 호출 결과가 있을 때 목록 정상 표시된다`,
      '기능', '',
      '데이터 조회',
      `DB에 데이터 1건 이상 존재하는 상태에서 페이지 접근`,
      '데이터 목록 정상 표시'
    ));
    cases.push(mksub(apiSeq-1, 2,
      '목록 데이터 조회 - 데이터 없음',
      `${apiEndpoint} 호출 결과가 없을 때 빈 상태 메시지 표시된다`,
      '기능', '',
      '데이터 조회',
      `DB에 데이터 0건인 상태에서 페이지 접근`,
      '"등록된 내용이 없습니다." 등 빈 상태 메시지 표시'
    ));
  }

  // 5. 폼 테스트
  for (const form of parsed.forms) {
    const formSeq = seq++;

    cases.push(mk(
      '폼 정상 제출',
      `${form.id} 폼의 모든 필수 항목 입력 후 제출 시 성공 처리된다`,
      '기능', '',
      '데이터 등록',
      `모든 필수 항목에 유효한 값 입력 후 제출 버튼 클릭`,
      form.method === 'POST' ? '성공 처리 후 지정 페이지로 이동 또는 완료 메시지 표시'
                             : '정상 처리됨'
    )); seq++;

    const requiredFields = form.fields.filter(f => f.required && !f.isConfirm);
    if (requiredFields.length > 0) {
      const reqSeq = seq++;
      requiredFields.forEach((f, i) => {
        cases.push(mksub(reqSeq-1, i+1,
          `필수 입력 누락 - ${f.name}`,
          `${f.name} 항목을 비운 채 제출 시 유효성 오류 메시지가 표시된다`,
          '기능', '',
          '폼 유효성',
          `${f.name}만 비운 채 다른 항목 정상 입력 후 제출`,
          `"${f.name.replace(/_/g,' ')} 항목은 필수입니다." 오류 메시지 표시`
        ));
      });
    }

    const formatFields = form.fields.filter(f => {
      const d = f.desc;
      return /\d+[~–-]\d+자|자 이상|형식|숫자|하이픈|이메일|영문|특수문자/i.test(d);
    });
    if (formatFields.length > 0) {
      const fmtSeq = seq++;
      formatFields.forEach((f, i) => {
        const ruleM = f.desc.match(/(\d+[~–-]\d+자|\d+자 이상|[가-힣·\w]+만|[가-힣\w]+ 형식)/);
        const rule  = ruleM ? ruleM[1] : '형식 오류';
        cases.push(mksub(fmtSeq-1, i+1,
          `입력 형식 오류 - ${f.name}`,
          `${f.name} 항목에 ${rule}을 벗어나는 값 입력 시 유효성 오류 메시지가 표시된다`,
          '기능', '',
          '폼 유효성',
          `${f.name}에 ${rule}을 벗어나는 값 입력 후 제출`,
          `${f.name} 형식 오류 메시지 표시`
        ));
      });
    }

    const confirmField = form.fields.find(f => f.isConfirm);
    if (confirmField) {
      cases.push(mk(
        '비밀번호 확인 불일치',
        '비밀번호 확인 항목이 비밀번호와 다를 때 오류 메시지가 표시된다',
        '기능', '',
        '폼 유효성',
        '비밀번호 항목과 다른 값을 비밀번호 확인에 입력 후 제출',
        '"비밀번호가 일치하지 않습니다." 오류 메시지 표시'
      )); seq++;
    }
  }

  // 6. 버튼 동작
  if (page.section === 'admin') {
    if (/list|목록/i.test(page.name)) {
      cases.push(mk(
        '등록 버튼 이동',
        '등록 버튼 클릭 시 등록 페이지로 이동한다',
        '비기능', '관리자 로그인',
        '버튼 동작',
        '등록 버튼 클릭',
        '등록 페이지로 이동'
      )); seq++;
    }
    if (/write|edit|수정|등록/i.test(page.name)) {
      cases.push(mk(
        '취소 버튼 이동',
        '취소 버튼 클릭 시 목록 페이지로 이동한다',
        '비기능', '관리자 로그인',
        '버튼 동작',
        '취소 버튼 클릭',
        '목록 페이지로 이동'
      )); seq++;
    }
  }

  return cases.map((c, i) => ({
    no: i + 1,
    category,
    screenId: page.id.toLowerCase(),
    title: c.title,
    desc: c.desc,
    type: c.type,
    tcId: c.tcId,
    pre: c.pre,
    item: c.item,
    procedure: c.procedure,
    expected: c.expected,
    result: '', reviewer: '', reviewDate: '',
    note: '', assignee: '', dueDate: ''
  }));
}

// ─── 기존 Excel 보존 데이터 로드 ────────────────────────────────────────────
function cellStr(cell) {
  const v = cell.value;
  if (v === null || v === undefined) return '';
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === 'object' && v.text) return v.text;
  return String(v);
}

async function loadExistingResults(xlsxPath) {
  if (!fs.existsSync(xlsxPath)) return {};
  const wb  = new ExcelJS.Workbook();
  await wb.xlsx.readFile(xlsxPath);
  const map = {};
  wb.worksheets.forEach(ws => {
    ws.eachRow((row, rowNumber) => {
      if (rowNumber <= 2) return;
      const tcId = cellStr(row.getCell(7));
      if (tcId) {
        map[tcId] = {
          result:     cellStr(row.getCell(12)),
          reviewer:   cellStr(row.getCell(13)),
          reviewDate: cellStr(row.getCell(14)),
          note:       cellStr(row.getCell(15)),
          assignee:   cellStr(row.getCell(16)),
          dueDate:    cellStr(row.getCell(17)),
        };
      }
    });
  });
  return map;
}

// ─── 셀 공통 스타일 헬퍼 ──────────────────────────────────────────────────────
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
async function buildWorksheet(wb, cases, existingMap, sheetName, sheetTitle, tabArgb) {
  const ws = wb.addWorksheet(sheetName, {
    views: [{ state: 'frozen', ySplit: 2, xSplit: 0, topLeftCell: 'A3', activeCell: 'A3' }],
    properties: { tabColor: { argb: tabArgb } }
  });

  // 컬럼 너비
  ws.columns = [
    { width: 6  }, // A  No
    { width: 16 }, // B  구분
    { width: 10 }, // C  Screen ID
    { width: 22 }, // D  세부기능제목
    { width: 38 }, // E  세부 기능 구현 설명
    { width: 8  }, // F  유형
    { width: 18 }, // G  테스트케이스ID
    { width: 14 }, // H  사전조건
    { width: 16 }, // I  상세테스트항목
    { width: 38 }, // J  테스트데이터 및 절차
    { width: 30 }, // K  예상결과
    { width: 10 }, // L  검수결과
    { width: 10 }, // M  검수자
    { width: 12 }, // N  검수일
    { width: 28 }, // O  비고
    { width: 10 }, // P  담당자
    { width: 12 }, // Q  예정처리일
  ];

  // ── Row 1: 타이틀 (A1:Q1 병합) ──
  const titleRow = ws.getRow(1);
  titleRow.height = 28;
  titleRow.getCell(1).value = sheetTitle;
  for (let c = 1; c <= 17; c++) {
    const cell = titleRow.getCell(c);
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.titleBg } };
    cell.font = { bold: true, color: { argb: C.white }, size: 13 };
    cell.alignment = { vertical: 'middle', horizontal: 'left' };
    applyBorder(cell);
  }
  ws.mergeCells('A1:Q1');

  // ── Row 2: 컬럼 헤더 ──
  const headerRow = ws.getRow(2);
  headerRow.height = 36;
  HEADERS.forEach((h, i) => {
    const colIdx = i + 1;
    const isQa   = colIdx >= COL_QA_START;
    styleHeader(headerRow.getCell(colIdx), isQa ? C.headerQaBg : C.headerGenBg);
    headerRow.getCell(colIdx).value = h;
  });

  // ── 데이터 행 ──
  for (let i = 0; i < cases.length; i++) {
    const c      = cases[i];
    const saved  = existingMap[c.tcId] || {};
    const rowNum = i + 3;
    const values = [
      c.no, c.category, c.screenId, c.title, c.desc,
      c.type, c.tcId, c.pre, c.item, c.procedure, c.expected,
      saved.result || '', saved.reviewer || '', saved.reviewDate || '',
      saved.note || '', saved.assignee || '', saved.dueDate || ''
    ];

    const dataRow = ws.getRow(rowNum);
    dataRow.height = 18;

    values.forEach((v, ci) => {
      const colIdx   = ci + 1;
      const isQaCol  = colIdx >= COL_QA_START;
      const wrapCols = new Set([5, 10, 11, 15]); // 긴 텍스트 자동 줄바꿈
      const cell     = dataRow.getCell(colIdx);
      cell.value     = v;
      styleData(cell, isQaCol, wrapCols.has(colIdx));
    });

    // 드롭다운: 유형 (F열)
    ws.getCell(rowNum, COL_TYPE).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['"기능,비기능"'],
      showErrorMessage: false,
    };

    // 드롭다운: 검수결과 (L열)
    ws.getCell(rowNum, COL_RESULT).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['"합격,불합격,보류,미검수"'],
      showErrorMessage: false,
    };
  }

  return ws;
}

// ─── 메인 ─────────────────────────────────────────────────────────────────────
async function main() {
  const pages       = JSON.parse(fs.readFileSync(PAGES_JSON, 'utf-8'));
  const existingMap = await loadExistingResults(OUTPUT_XLSX);

  const userCases  = [];
  const adminCases = [];

  for (const page of pages) {
    let htmlPath = path.join(HTML_DIR, page.path);
    if (!fs.existsSync(htmlPath)) {
      const alt = path.join(HTML_DIR, 'index.html');
      if (fs.existsSync(alt) && page.id === 'P01') htmlPath = alt;
      else { console.warn(`⚠️  HTML 없음 (건너뜀): ${page.path}`); continue; }
    }

    const html   = fs.readFileSync(htmlPath, 'utf-8');
    const parsed = parseHTML(html);

    const sectionLabel = page.section === 'admin' ? '관리자' : '사용자';
    const nameIncludesLabel = new RegExp(sectionLabel).test(page.name);
    const category = nameIncludesLabel ? page.name : `${sectionLabel} ${page.name}`;

    const cases = generateCases(page, parsed, category);

    if (page.section === 'admin') adminCases.push(...cases);
    else                          userCases.push(...cases);

    console.log(`  ✓ ${page.id} ${page.name}: ${cases.length}개 테스트케이스`);
  }

  userCases.forEach((c, i)  => { c.no = i + 1; });
  adminCases.forEach((c, i) => { c.no = i + 1; });

  const wb = new ExcelJS.Workbook();
  wb.creator  = 'BN_SYS PM Automation';
  wb.created  = new Date();

  await buildWorksheet(wb, userCases,  existingMap, '사용자', '사용자 테스트 시나리오', 'FF1976D2');
  await buildWorksheet(wb, adminCases, existingMap, '관리자', '관리자 테스트 시나리오', 'FF388E3C');

  await wb.xlsx.writeFile(OUTPUT_XLSX);

  console.log(`\n✅ 완료: ${OUTPUT_XLSX}`);
  console.log(`   사용자 ${userCases.length}개 / 관리자 ${adminCases.length}개`);
  if (Object.keys(existingMap).length > 0) {
    console.log(`   기존 검수결과 보존: ${Object.keys(existingMap).length}개 TC`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
