/**
 * foresto_update_excel.js — 보류 항목 조사 결과 Excel 반영
 */
const path    = require('path');
const ExcelJS = require('exceljs');

const XLSX     = path.resolve(__dirname, '../../workspace/EunAh/foresto_homepage/테스트시나리오_한국숲해설가협회.xlsx');
const REVIEWER = 'PM자동검수';
const TODAY    = '2026-04-27';

// 보류 → 최종 결과 (조사 완료)
const finalResults = {
  'u01-t03':  { result: '불합격', note: 'semantic section 태그 미사용 — div 구조(#hdr, .hero-slider, .main-content-wrap, #ftr)만 존재' },
  't3-d-t01': { result: '합격',   note: 'community/notice-detail.php?id=9 정상 (HTTP 200, 본문 콘텐츠 출력 확인)' },
  'u38-t02':  { result: '불합격', note: '캘린더 UI 미렌더링 — community/calendar.php에 달력 요소 없음' },
  'u54-t01':  { result: '합격',   note: '/auth/find.php 정상 (HTTP 200, 이름+이메일+코드+비밀번호 폼 구현)' },
  'u52-t02':  { result: '합격',   note: '비로그인 신청 접근 가능 — /forest/index.php 기관 대상 공개 신청 폼 (의도된 설계)' },
  'u56-t02':  { result: '합격',   note: '마이페이지(/mypage/index.php) 내 회원정보 수정 폼 통합 구현, 저장하기 버튼 존재' },
  'u56-t03':  { result: '합격',   note: '마이페이지 내 비밀번호 변경 버튼(button[type=submit]) 존재' },
  'u56-t04':  { result: '합격',   note: '마이페이지 내 탈퇴하기 버튼(button[type=submit]) 존재' },
  'u56-t05':  { result: '합격',   note: '마이페이지 내 신청내역 테이블(.board-table) 존재' },
  't2-m-t01': { result: '합격',   note: '/education/academy-apply.php 정상 (HTTP 200, 11건 강좌 목록 표시)' },
  'u49-t01':  { result: '합격',   note: '/participate/regular-apply.php 존재, 비로그인 시 로그인 페이지로 올바르게 redirect' },
  'u51-t01':  { result: '합격',   note: '/participate/donate-info.php → "지금 후원하기" → /participate/donate.php 경로 정상' },
  'a05-t02':  { result: '합격',   note: 'admin/courses.php에 "+ 강좌 등록" 버튼(button) 존재' },
};

(async () => {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(XLSX);

  let updated = 0;
  wb.worksheets.forEach(ws => {
    if (ws.name === '표지') return;
    ws.eachRow((row, rowNum) => {
      if (rowNum <= 2) return;
      const rawId = (row.getCell(7).value || '').toString().trim().toLowerCase();
      if (!rawId || !finalResults[rawId]) return;
      const { result, note } = finalResults[rawId];

      // 검수결과 (col 12)
      const resultCell = row.getCell(12);
      resultCell.value = result;
      resultCell.dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"합격,불합격,보류"'],
        showErrorMessage: false
      };
      // 색상 적용
      if (result === '합격') {
        resultCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F5E9' } };
        resultCell.font = { color: { argb: 'FF2E7D32' }, bold: true };
      } else if (result === '불합격') {
        resultCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFEBEE' } };
        resultCell.font = { color: { argb: 'FFC62828' }, bold: true };
      } else {
        resultCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF8E1' } };
        resultCell.font = { color: { argb: 'FFF57F17' }, bold: true };
      }

      // 검수자·검수일
      row.getCell(13).value = REVIEWER;
      row.getCell(14).value = TODAY;

      // 비고
      const cur = (row.getCell(15).value || '').toString();
      row.getCell(15).value = cur ? `${cur} / ${note}` : note;

      console.log(`  [${result}] ${rawId} — ${note.slice(0, 50)}`);
      updated++;
    });
  });

  await wb.xlsx.writeFile(XLSX);

  // 최종 집계
  const pass   = Object.values(finalResults).filter(r => r.result === '합격').length;
  const fail   = Object.values(finalResults).filter(r => r.result === '불합격').length;
  const hold   = Object.values(finalResults).filter(r => r.result === '보류').length;

  console.log(`\n✅ Excel 업데이트 완료: ${updated}개 TC`);
  console.log(`\n── 보류 → 최종 전환 결과 ──`);
  console.log(`  합격 전환  : ${pass}개`);
  console.log(`  불합격 전환: ${fail}개`);
  console.log(`  보류 유지  : ${hold}개`);
  console.log(`\n── 전체 최종 집계 ──`);
  console.log(`  합격   : ${69 + pass}개`);
  console.log(`  불합격 : ${0  + fail}개`);
  console.log(`  보류   : ${13 - (pass + fail)}개`);
  console.log(`  총     : 82개`);
})().catch(e => { console.error('오류:', e.message); process.exit(1); });
