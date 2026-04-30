/**
 * foresto_add_editor_img_tc.js
 * 공통 에디터 — 이미지 정렬 속성 미적용 결함 TC 추가
 *
 * 추가 위치: [공통] 시트 마지막 행(No.26) 다음
 * Screen ID: C04 / TC: c04-t01 ~ c04-t03
 */
const path    = require('path');
const ExcelJS = require('exceljs');

const XLSX    = path.resolve(__dirname, '../../workspace/EunAh/foresto_homepage/테스트시나리오_한국숲해설가협회.xlsx');
const TODAY   = '2026-04-28';
const REVIEWER = 'PM';

// ─── 추가할 TC 정의 ──────────────────────────────────────────────────────────
const NEW_TCS = [
  {
    no:      27,
    gubn:    '공통 에디터',
    scrId:   'C04',
    title:   '이미지 정렬 — 좌측 정렬 적용',
    desc:    '에디터에서 이미지 첨부 후 툴바의 좌측 정렬 버튼 클릭 시 이미지 정렬 속성이 적용된다',
    type:    '기능',
    tcId:    'c04-t01',
    pre:     '로그인 상태 / 에디터 포함 글쓰기 페이지 접근',
    item:    '이미지 첨부 후 좌측 정렬 버튼 클릭 시 이미지 좌측 정렬 적용 여부',
    proc:    '1. 에디터 글쓰기 페이지 접근\n2. 이미지 첨부 버튼 클릭하여 이미지 업로드\n3. 이미지 삽입 위치(커서)에서 툴바 좌측 정렬 버튼 클릭\n4. 이미지 정렬 상태 확인',
    expect:  '이미지가 에디터 영역 내 좌측으로 정렬되어야 함',
    result:  '불합격',
    note:    '[결함] 이미지 첨부 후 정렬 버튼 클릭 시 이미지 정렬 미적용. Quill 2.x에서 img 태그에 align 포맷이 직접 작동하지 않음 — 이미지를 <p style="text-align:left"> 로 감싸는 방식 구현 필요',
  },
  {
    no:      28,
    gubn:    '공통 에디터',
    scrId:   'C04',
    title:   '이미지 정렬 — 가운데 정렬 적용',
    desc:    '에디터에서 이미지 첨부 후 툴바의 가운데 정렬 버튼 클릭 시 이미지 정렬 속성이 적용된다',
    type:    '기능',
    tcId:    'c04-t02',
    pre:     '로그인 상태 / 에디터 포함 글쓰기 페이지 접근',
    item:    '이미지 첨부 후 가운데 정렬 버튼 클릭 시 이미지 가운데 정렬 적용 여부',
    proc:    '1. 에디터 글쓰기 페이지 접근\n2. 이미지 첨부 버튼 클릭하여 이미지 업로드\n3. 이미지 삽입 위치(커서)에서 툴바 가운데 정렬 버튼 클릭\n4. 이미지 정렬 상태 확인',
    expect:  '이미지가 에디터 영역 내 가운데로 정렬되어야 함',
    result:  '불합격',
    note:    '[결함] 이미지 첨부 후 정렬 버튼 클릭 시 이미지 정렬 미적용. Quill 2.x에서 img 태그에 align 포맷이 직접 작동하지 않음 — 이미지를 <p style="text-align:center"> 로 감싸는 방식 구현 필요',
  },
  {
    no:      29,
    gubn:    '공통 에디터',
    scrId:   'C04',
    title:   '이미지 정렬 — 우측 정렬 적용',
    desc:    '에디터에서 이미지 첨부 후 툴바의 우측 정렬 버튼 클릭 시 이미지 정렬 속성이 적용된다',
    type:    '기능',
    tcId:    'c04-t03',
    pre:     '로그인 상태 / 에디터 포함 글쓰기 페이지 접근',
    item:    '이미지 첨부 후 우측 정렬 버튼 클릭 시 이미지 우측 정렬 적용 여부',
    proc:    '1. 에디터 글쓰기 페이지 접근\n2. 이미지 첨부 버튼 클릭하여 이미지 업로드\n3. 이미지 삽입 위치(커서)에서 툴바 우측 정렬 버튼 클릭\n4. 이미지 정렬 상태 확인',
    expect:  '이미지가 에디터 영역 내 우측으로 정렬되어야 함',
    result:  '불합격',
    note:    '[결함] 이미지 첨부 후 정렬 버튼 클릭 시 이미지 정렬 미적용. Quill 2.x에서 img 태그에 align 포맷이 직접 작동하지 않음 — 이미지를 <p style="text-align:right"> 로 감싸는 방식 구현 필요',
  },
];

// ─── 스타일 헬퍼 ──────────────────────────────────────────────────────────────
const C = {
  headerQaBg: '1B5E20',
  dataQaBg:   'F1F8E9',
  border:     'BDBDBD',
};

function borderAll(cell) {
  const b = { style: 'thin', color: { argb: 'FF' + C.border } };
  cell.border = { top: b, left: b, bottom: b, right: b };
}

function applyDataStyle(row, isQaCol) {
  for (let c = 1; c <= 17; c++) {
    const cell = row.getCell(c);
    borderAll(cell);
    cell.alignment = { vertical: 'top', wrapText: true };
    cell.font = { name: 'Malgun Gothic', size: 9 };
    if (c >= 12) {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + C.dataQaBg } };
    }
  }
}

function applyResultStyle(resultCell, result) {
  resultCell.dataValidation = {
    type: 'list', allowBlank: true,
    formulae: ['"합격,불합격,보류"'],
    showErrorMessage: false,
  };
  if (result === '합격') {
    resultCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F5E9' } };
    resultCell.font = { name: 'Malgun Gothic', size: 9, color: { argb: 'FF2E7D32' }, bold: true };
  } else if (result === '불합격') {
    resultCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFEBEE' } };
    resultCell.font = { name: 'Malgun Gothic', size: 9, color: { argb: 'FFC62828' }, bold: true };
  } else {
    resultCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF8E1' } };
    resultCell.font = { name: 'Malgun Gothic', size: 9, color: { argb: 'FFF57F17' }, bold: true };
  }
}

// ─── 메인 ────────────────────────────────────────────────────────────────────
(async () => {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(XLSX);

  const ws = wb.getWorksheet('공통');
  if (!ws) { console.error('[오류] "공통" 시트를 찾을 수 없습니다.'); process.exit(1); }

  // 마지막 데이터 행 탐색
  let lastDataRow = 2;
  ws.eachRow((row, rowNum) => {
    if (rowNum <= 2) return;
    const tcId = (row.getCell(7).value || '').toString().trim();
    if (tcId) lastDataRow = rowNum;
  });

  console.log(`[공통] 마지막 데이터 행: ${lastDataRow} → ${NEW_TCS.length}개 TC 추가 예정`);

  // 중복 TC ID 확인
  const existingIds = new Set();
  ws.eachRow((row, rowNum) => {
    if (rowNum <= 2) return;
    const tcId = (row.getCell(7).value || '').toString().trim();
    if (tcId) existingIds.add(tcId.toLowerCase());
  });

  let added = 0;
  for (const tc of NEW_TCS) {
    if (existingIds.has(tc.tcId.toLowerCase())) {
      console.log(`  [SKIP] ${tc.tcId} — 이미 존재`);
      continue;
    }

    const newRowNum = lastDataRow + 1 + added;
    const row = ws.getRow(newRowNum);

    row.getCell(1).value  = tc.no;
    row.getCell(2).value  = tc.gubn;
    row.getCell(3).value  = tc.scrId;
    row.getCell(4).value  = tc.title;
    row.getCell(5).value  = tc.desc;
    row.getCell(6).value  = tc.type;
    row.getCell(7).value  = tc.tcId;
    row.getCell(8).value  = tc.pre;
    row.getCell(9).value  = tc.item;
    row.getCell(10).value = tc.proc;
    row.getCell(11).value = tc.expect;
    row.getCell(12).value = tc.result;
    row.getCell(13).value = REVIEWER;
    row.getCell(14).value = TODAY;
    row.getCell(15).value = tc.note;
    row.getCell(16).value = '';   // 담당자 (공란)
    row.getCell(17).value = '';   // 예정처리일 (공란)
    row.height = 60;

    applyDataStyle(row);
    applyResultStyle(row.getCell(12), tc.result);

    row.commit();
    console.log(`  [추가] ${tc.tcId} — ${tc.title}`);
    added++;
  }

  await wb.xlsx.writeFile(XLSX);
  console.log(`\n✅ 완료: ${added}개 TC 추가 ([공통] 시트)`);

  // 집계 재계산
  let totalPass = 0, totalFail = 0, totalHold = 0, totalBlank = 0;
  wb.worksheets.forEach(sheet => {
    if (sheet.name === '표지') return;
    sheet.eachRow((row, rowNum) => {
      if (rowNum <= 2) return;
      const tcId = (row.getCell(7).value || '').toString().trim();
      if (!tcId) return;
      const r = (row.getCell(12).value || '').toString().trim();
      if (r === '합격') totalPass++;
      else if (r === '불합격') totalFail++;
      else if (r === '보류') totalHold++;
      else totalBlank++;
    });
  });
  console.log(`\n── 전체 집계 ──`);
  console.log(`  합격   : ${totalPass}개`);
  console.log(`  불합격 : ${totalFail}개`);
  console.log(`  보류   : ${totalHold}개`);
  console.log(`  미검수 : ${totalBlank}개`);
  console.log(`  총 TC  : ${totalPass + totalFail + totalHold + totalBlank}개`);
})().catch(e => { console.error('오류:', e.message); process.exit(1); });
