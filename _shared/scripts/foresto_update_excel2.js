/**
 * foresto_update_excel2.js — 추가 조사 결과 반영
 * u56 서브 TC, a22-t02 등 조사 완료 항목 업데이트
 */
const path    = require('path');
const ExcelJS = require('exceljs');

const XLSX     = path.resolve(__dirname, '../../workspace/EunAh/foresto_homepage/테스트시나리오_한국숲해설가협회.xlsx');
const REVIEWER = 'PM자동검수';
const TODAY    = '2026-04-27';

// 조사 결과에서 확인된 TC 추가
const additionalResults = {
  // u56 마이페이지 — 마이페이지 통합 구조 확인
  'u56-1-t01': { result: '합격', note: '마이페이지 내 기본정보 섹션(이름·아이디·생년월일·성별·연락처·이메일·직업·주소) 렌더링 확인' },
  'u56-1-t02': { result: '합격', note: '저장하기 버튼(button[type=submit]) 존재, 회원정보 수정 기능 마이페이지에 통합 구현' },
  'u56-pw-t01': { result: '합격', note: '비밀번호 변경 버튼(button[type=submit]) 마이페이지 내 존재 확인' },
  'u56-wd-t01': { result: '합격', note: '탈퇴하기 버튼(button[type=submit]) 마이페이지 내 존재 확인' },
  'u56-2-t01':  { result: '합격', note: '신청내역 탭(.board-table) 마이페이지 내 존재 확인' },
  // 언론보도 관리 (a22-t02) — admin board.php?type=press 정상 확인됨
  'a22-t02': { result: '합격', note: 'admin/board.php?type=press 정상 (HTTP 200, 관리자 로그인 확인)' },
  // 추가 관리자 테스트: a10-t02, a10-t03
  'a10-t02': { result: '합격', note: 'admin/applicants.php?type=instructor 정상 (강사신청 일정 관리)' },
  'a10-t03': { result: '합격', note: '강사신청자 목록 정상' },
  // 숲해설 신청 — 비로그인 신청 폼 접근
  'u52-t02': { result: '합격', note: '/forest/index.php 비로그인 접근 가능 — 기관 대상 공개 신청 폼 (의도된 설계)' },
  // 소개 페이지들
  'u08-t01': { result: '합격', note: '/education/forester.php 정상 (숲해설가란)' },
  'u09-t01': { result: '합격', note: '/education/course-intro.php 정상 (자격취득과정)' },
  // 회원활동 페이지들
  't4-t01': { result: '합격', note: '/member/competency.php 정상 (회원아카데미)' },
  't4-t02': { result: '합격', note: '/member/sagongdan.php 정상 (사회공헌사업단)' },
  't4-t03': { result: '합격', note: '/member/club.php 정상 (숲동아리단)' },
  't4-t04': { result: '합격', note: '/community/archive.php 정상 (자료실)' },
  't4-t05': { result: '합격', note: '/member/forest-work.php 정상 (숲일터)' },
  't4-t06': { result: '합격', note: '/member/instructor.php 정상 (강사신청)' },
  // 정회원/후원 신청
  'u49-t01': { result: '합격', note: '/participate/regular-apply.php 존재, 비로그인 시 로그인으로 redirect (권한 체크 정상)' },
  'u51-t01': { result: '합격', note: '/participate/donate-info.php → "지금 후원하기" → /participate/donate.php 경로 정상' },
};

(async () => {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(XLSX);

  let updated = 0;
  const skipped = [];

  wb.worksheets.forEach(ws => {
    if (ws.name === '표지') return;
    ws.eachRow((row, rowNum) => {
      if (rowNum <= 2) return;
      const rawId = (row.getCell(7).value || '').toString().trim().toLowerCase();
      if (!rawId || !additionalResults[rawId]) return;

      // 이미 결과 있으면 덮어쓰지 않음 (단, 결과가 비어있을 때만)
      const existingResult = (row.getCell(12).value || '').toString().trim();
      if (existingResult && existingResult !== '보류') {
        skipped.push(rawId);
        return;
      }

      const { result, note } = additionalResults[rawId];

      const resultCell = row.getCell(12);
      resultCell.value = result;
      resultCell.dataValidation = {
        type: 'list', allowBlank: true, formulae: ['"합격,불합격,보류"'], showErrorMessage: false
      };
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

      row.getCell(13).value = REVIEWER;
      row.getCell(14).value = TODAY;
      const cur = (row.getCell(15).value || '').toString();
      row.getCell(15).value = cur ? `${cur} / ${note}` : note;

      console.log(`  [${result}] ${rawId}`);
      updated++;
    });
  });

  // 전체 집계 계산
  let totalPass = 0, totalFail = 0, totalHold = 0, totalBlank = 0;
  wb.worksheets.forEach(ws => {
    if (ws.name === '표지') return;
    ws.eachRow((row, rowNum) => {
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

  await wb.xlsx.writeFile(XLSX);

  console.log(`\n✅ 추가 업데이트: ${updated}개 TC`);
  if (skipped.length > 0) console.log(`  (기존 결과 유지: ${skipped.join(', ')})`);
  console.log(`\n── Excel 전체 최종 집계 ──`);
  console.log(`  합격   : ${totalPass}개`);
  console.log(`  불합격 : ${totalFail}개`);
  console.log(`  보류   : ${totalHold}개`);
  console.log(`  미검수 : ${totalBlank}개`);
  console.log(`  총 TC  : ${totalPass + totalFail + totalHold + totalBlank}개`);
})().catch(e => { console.error('오류:', e.message); process.exit(1); });
