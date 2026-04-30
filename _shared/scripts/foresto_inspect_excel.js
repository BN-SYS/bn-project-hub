/**
 * foresto_inspect_excel.js — Excel 시트/TC 구조 확인용
 */
const path    = require('path');
const ExcelJS = require('exceljs');

const XLSX = path.resolve(__dirname, '../../workspace/EunAh/foresto_homepage/테스트시나리오_한국숲해설가협회.xlsx');

(async () => {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(XLSX);

  console.log('=== 시트 목록 ===');
  wb.worksheets.forEach(ws => {
    let rowCount = 0;
    let lastTcId = '';
    let lastNo = 0;
    ws.eachRow((row, rowNum) => {
      if (rowNum <= 2) return;
      const tcId = (row.getCell(7).value || '').toString().trim();
      const no = row.getCell(1).value;
      if (tcId) { rowCount++; lastTcId = tcId; if (no) lastNo = no; }
    });
    console.log(`  [${ws.name}] TC ${rowCount}개 | 마지막 No=${lastNo} | 마지막 TC=${lastTcId} | 전체행=${ws.rowCount}`);
  });

  // 공통/에디터 관련 TC 탐색
  console.log('\n=== "공통" 또는 "editor" 관련 행 ===');
  wb.worksheets.forEach(ws => {
    if (ws.name === '표지') return;
    ws.eachRow((row, rowNum) => {
      if (rowNum <= 2) return;
      const gubn = (row.getCell(2).value || '').toString();
      const scrId = (row.getCell(3).value || '').toString();
      const tcId = (row.getCell(7).value || '').toString();
      if (/공통|editor|write|글쓰기/i.test(gubn + scrId + tcId)) {
        console.log(`  [${ws.name}] row${rowNum} | 구분=${gubn} | ScreenID=${scrId} | TC=${tcId}`);
      }
    });
  });

  // 마지막 10개 TC (사용자 시트)
  wb.worksheets.forEach(ws => {
    if (ws.name === '표지') return;
    const rows = [];
    ws.eachRow((row, rowNum) => {
      if (rowNum <= 2) return;
      const tcId = (row.getCell(7).value || '').toString().trim();
      if (tcId) rows.push({ rowNum, no: row.getCell(1).value, gubn: (row.getCell(2).value||'').toString(), scrId: (row.getCell(3).value||'').toString(), tcId });
    });
    const last5 = rows.slice(-5);
    console.log(`\n=== [${ws.name}] 마지막 5개 TC ===`);
    last5.forEach(r => console.log(`  row${r.rowNum} | No=${r.no} | 구분=${r.gubn} | ScreenID=${r.scrId} | TC=${r.tcId}`));
  });
})().catch(e => { console.error('오류:', e.message); process.exit(1); });
