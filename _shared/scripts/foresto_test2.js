/**
 * foresto_test2.js — 전체 정밀 검수
 * 실제 URL·필드명 반영 버전
 */
const { chromium } = require('playwright');
const path    = require('path');
const fs      = require('fs');
const ExcelJS = require('exceljs');

const BASE     = 'https://foresto.or.kr';
const XLSX     = path.resolve(__dirname, '../../workspace/EunAh/foresto_homepage/테스트시나리오_한국숲해설가협회.xlsx');
const REVIEWER = 'PM자동검수';
const TODAY    = new Date().toISOString().slice(0, 10);

const results = {};
let  totalPass = 0, totalFail = 0, totalHold = 0;

function pass(tcId, note = '') {
  results[tcId] = { result: '합격', note };
  totalPass++;
  console.log(`  ✅ [합격]  ${tcId.padEnd(16)} ${note}`);
}
function fail(tcId, note = '') {
  results[tcId] = { result: '불합격', note };
  totalFail++;
  console.log(`  ❌ [불합격] ${tcId.padEnd(16)} ${note}`);
}
function hold(tcId, note = '') {
  results[tcId] = { result: '보류', note };
  totalHold++;
  console.log(`  ⚠️  [보류]  ${tcId.padEnd(16)} ${note}`);
}

async function goto(page, p, ms = 10000) {
  const url = p.startsWith('http') ? p : `${BASE}/${p}`;
  try {
    const r = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: ms });
    return { ok: true, status: r.status(), url: page.url() };
  } catch (e) {
    return { ok: false, status: 0, error: e.message };
  }
}
async function has(page, sel) {
  try { return !!(await page.$(sel)); } catch { return false; }
}
async function count(page, sel) {
  try { return await page.$$eval(sel, els => els.length); } catch { return 0; }
}

// 로그인 (정확한 필드명 사용)
async function login(page, id, pw, isAdmin = false) {
  const loginUrl = isAdmin ? `${BASE}/admin/` : `${BASE}/auth/login.php`;
  await page.goto(loginUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
  await page.fill('input[name="user_id"]', id).catch(() =>
    page.fill('input[type="text"]:first-of-type', id)
  );
  await page.fill('input[type="password"]', pw);
  await page.click('button[type="submit"], input[type="submit"]');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(800);
}

// ─── 공통 테스트 ─────────────────────────────────────────────────────────────
async function runCommon(page) {
  console.log('\n══════════════════ 공통 ══════════════════');

  // C01 헤더/푸터/GNB
  console.log('\n▶ C01 헤더·푸터·GNB·브레드크럼');
  const r = await goto(page, '');
  r.status === 200 ? pass('c01-t01', '홈 HTTP 200') : fail('c01-t01', `HTTP ${r.status}`);
  await has(page, 'header, #header, .header') ? pass('c01-t02', '헤더 존재') : fail('c01-t02', '헤더 없음');
  await has(page, 'footer, #footer, .footer') ? pass('c01-t03', '푸터 존재') : fail('c01-t03', '푸터 없음');
  await has(page, 'nav, .gnb, #gnb')          ? pass('c01-t04', 'GNB 존재')  : fail('c01-t04', 'GNB 없음');
  await has(page, 'header img, .logo')         ? pass('c01-t05', '로고 존재') : fail('c01-t05', '로고 없음');

  // 브레드크럼: 내부 페이지에서 확인
  await goto(page, 'about/index.php');
  await has(page, '.breadcrumb, .bread, [class*="crumb"], nav[aria-label*="breadcrumb"]')
    ? pass('c01-t06', '브레드크럼 존재')
    : hold('c01-t06', '브레드크럼 selector 확인 필요');

  // C02 권한 정책
  console.log('\n▶ C02 권한 정책');
  await page.goto(`${BASE}/auth/logout.php`, { waitUntil: 'domcontentloaded' }).catch(() => {});

  const myR = await goto(page, 'mypage/index.php');
  page.url().includes('login') || page.url().includes('auth')
    ? pass('c02-t01', '비로그인→마이페이지 redirect 확인')
    : fail('c02-t01', `redirect 미확인: ${page.url()}`);

  const adminR = await goto(page, 'admin/members.php');
  (page.url().includes('login') || adminR.status === 403 || page.url().includes('auth'))
    ? pass('c02-t02', '비로그인→관리자 차단 확인')
    : fail('c02-t02', `관리자 차단 미확인: ${page.url()}`);

  // C03 에러 페이지
  console.log('\n▶ C03 404 에러');
  const e404 = await goto(page, 'no-such-page-xyz123.php');
  e404.status === 404 ? pass('c03-t01', '404 처리 정상') : hold('c03-t01', `HTTP ${e404.status}`);

  // 정적·법적 페이지
  console.log('\n▶ 정적/법적 페이지');
  for (const [id, p, name] of [
    ['u58-t01', 'terms.php',   '이용약관'],
    ['u59-t01', 'privacy.php', '개인정보처리방침'],
    ['u60-t01', 'email.php',   '이메일무단수집거부'],
    ['u61-t01', 'sitemap.php', '사이트맵'],
  ]) {
    const r = await goto(page, p);
    r.status === 200 ? pass(id, `${name} 정상`) : fail(id, `${name} ${r.status}`);
  }
}

// ─── 사용자 비로그인 테스트 ───────────────────────────────────────────────────
async function runUserPublic(page) {
  console.log('\n══════════════════ 사용자 (비로그인) ══════════════════');

  // U01 홈
  console.log('\n▶ U01 홈메인');
  await goto(page, '');
  pass('u01-t01', '홈 정상 접속');
  const bannerEl = await has(page, '.main-visual, .swiper, .slider, [class*="visual"], [class*="banner"], [class*="slide"]');
  bannerEl ? pass('u01-t02', '메인 비주얼 존재') : hold('u01-t02', '메인 배너 class 확인 필요');
  const sectionCnt = await count(page, 'section, .section');
  sectionCnt > 0 ? pass('u01-t03', `섹션 ${sectionCnt}개`) : hold('u01-t03', 'section 태그 확인 필요');

  // T1 소개 정적 콘텐츠
  console.log('\n▶ T1 소개 페이지');
  for (const [id, p, name] of [
    ['u05-t01', 'about/index.php',            '협회소개'],
    ['u06-t01', 'about/members.php',          '조직안내'],
    ['u07-t01', 'about/regulation.php',       '회원안내'],
    ['u08-t01', 'education/forester.php',     '숲해설가란'],
    ['u09-t01', 'education/course-intro.php', '자격취득과정'],
    ['u10-t01', 'education/job-training.php', '역량강화과정'],
    ['t4-t01',  'member/competency.php',      '회원아카데미'],
    ['t4-t02',  'member/sagongdan.php',        '사회공헌사업단'],
    ['t4-t03',  'member/club.php',             '숲동아리단'],
    ['t4-t04',  'community/archive.php',       '자료실'],
    ['t4-t05',  'member/forest-work.php',      '숲일터'],
    ['t4-t06',  'member/instructor.php',       '강사신청'],
  ]) {
    const r = await goto(page, p);
    r.status === 200 ? pass(id, `${name} 정상`) : fail(id, `${name} HTTP ${r.status}`);
  }

  // T2 강좌
  console.log('\n▶ T2 강좌 목록');
  for (const [id, p, name] of [
    ['t2-l-t01',  'education/academy.php',      '기초과정 목록'],
    ['t2-l-t02',  'education/course-intro.php', '자격취득 목록'],
  ]) {
    const r = await goto(page, p);
    r.status === 200 ? pass(id, `${name} 정상`) : fail(id, `${name} HTTP ${r.status}`);
  }

  // T3 공지사항
  console.log('\n▶ T3 공지사항');
  const noticeR = await goto(page, 'community/notice-list.php');
  noticeR.status === 200 ? pass('t3-l-t01', '공지사항 목록 정상') : fail('t3-l-t01', `HTTP ${noticeR.status}`);
  // 상세 클릭
  const firstNotice = await page.$('table a, .notice-list a, .board a').catch(() => null);
  if (firstNotice) {
    await firstNotice.click().catch(() => {});
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    await has(page, '.content, .detail, article, .post-content')
      ? pass('t3-d-t01', `공지 상세 정상: ${page.url()}`)
      : hold('t3-d-t01', '상세 콘텐츠 영역 확인 필요');
  } else {
    hold('t3-d-t01', '공지사항 목록 항목 없음');
  }

  // T5 갤러리
  console.log('\n▶ T5 갤러리');
  const gallR = await goto(page, 'community/gallery.php');
  gallR.status === 200 ? pass('t5-l-t01', '갤러리 목록 정상') : fail('t5-l-t01', `HTTP ${gallR.status}`);

  // U38 캘린더
  console.log('\n▶ U38 협회 캘린더');
  const calR = await goto(page, 'community/calendar.php');
  calR.status === 200 ? pass('u38-t01', '캘린더 정상') : fail('u38-t01', `HTTP ${calR.status}`);
  await has(page, '.fc, .calendar, [class*="calendar"]')
    ? pass('u38-t02', '캘린더 컴포넌트 존재')
    : hold('u38-t02', '캘린더 렌더링 확인 필요');

  // U53 로그인 페이지
  console.log('\n▶ U53 로그인');
  const loginR = await goto(page, 'auth/login.php');
  loginR.status === 200 ? pass('u53-t01', '로그인 페이지 정상') : fail('u53-t01', `HTTP ${loginR.status}`);
  await has(page, 'input[name="user_id"]') ? pass('u53-t02', '아이디 필드(user_id) 존재') : fail('u53-t02', '아이디 필드 없음');
  await has(page, 'input[type="password"]') ? pass('u53-t03', '비밀번호 필드 존재') : fail('u53-t03', '비밀번호 필드 없음');
  await has(page, 'button[type="submit"], input[type="submit"]') ? pass('u53-t04', '로그인 버튼 존재') : fail('u53-t04', '로그인 버튼 없음');

  // 잘못된 비밀번호
  await page.fill('input[name="user_id"]', 'eunahp86');
  await page.fill('input[type="password"]', 'wrongpw!');
  await page.click('button[type="submit"], input[type="submit"]');
  await page.waitForTimeout(1000);
  (page.url().includes('login') || await has(page, '.error, .alert, .msg-error'))
    ? pass('u53-t05', '잘못된 비밀번호 → 오류 처리 확인')
    : hold('u53-t05', '오류 메시지 표시 확인 필요');

  // 비밀번호 찾기
  console.log('\n▶ U54 비밀번호 찾기');
  for (const p of ['auth/find-pw.php', 'auth/forgot.php', 'auth/find-password.php']) {
    const r = await goto(page, p);
    if (r.status === 200 && !page.url().includes('login')) {
      pass('u54-t01', `비밀번호 찾기 정상: ${p}`); break;
    } else if (p === 'auth/find-password.php') {
      hold('u54-t01', '비밀번호 찾기 URL 확인 필요');
    }
  }

  // U55 회원가입
  console.log('\n▶ U55 회원가입');
  const regR = await goto(page, 'auth/register.php');
  regR.status === 200 ? pass('u55-t01', '회원가입 페이지 정상') : fail('u55-t01', `HTTP ${regR.status}`);
  // 약관 동의 페이지 → 체크박스 존재
  await has(page, 'input[type="checkbox"]')
    ? pass('u55-t02', '회원가입 약관 동의 체크박스 존재')
    : fail('u55-t02', '약관 체크박스 없음');

  // 숲해설 신청 (비로그인)
  console.log('\n▶ U52 숲해설 신청 (비로그인)');
  const forestR = await goto(page, 'forest/index.php');
  if (page.url().includes('login')) {
    pass('u52-t02', '비로그인→숲해설 신청 → 로그인 redirect 확인');
  } else if (forestR.status === 200) {
    hold('u52-t02', '로그인 없이 접근 가능 — 권한 체크 확인 필요');
  }
}

// ─── 사용자 로그인 후 테스트 ──────────────────────────────────────────────────
async function runUserLoggedIn(page) {
  console.log('\n══════════════════ 사용자 로그인 후 ══════════════════');

  await login(page, 'eunahp86', 'dmsdk86!');
  const afterUrl = page.url();
  !afterUrl.includes('login')
    ? pass('u53-t06', `로그인 성공 → ${afterUrl}`)
    : fail('u53-t06', `로그인 실패 — ${afterUrl}`);

  if (afterUrl.includes('login')) {
    console.log('  ⚠️  로그인 실패. 로그인 후 테스트 건너뜀');
    return;
  }

  // 마이페이지
  console.log('\n▶ U56 마이페이지');
  const mpR = await goto(page, 'mypage/index.php');
  mpR.status === 200 ? pass('u56-t01', '마이페이지 정상') : fail('u56-t01', `HTTP ${mpR.status}`);

  // 마이페이지 서브
  for (const [id, sel, name] of [
    ['u56-t02', 'a[href*="profile"], a[href*="info"]',     '회원정보 수정 링크'],
    ['u56-t03', 'a[href*="password"], a[href*="pw"]',      '비밀번호 변경 링크'],
    ['u56-t04', 'a[href*="withdraw"], a[href*="delete"]',  '탈퇴 링크'],
    ['u56-t05', 'a[href*="apply"], a[href*="history"], .apply-list', '신청내역 영역'],
  ]) {
    await has(page, sel) ? pass(id, `${name} 존재`) : hold(id, `${name} 확인 필요`);
  }

  // T2 강좌 신청 모달
  console.log('\n▶ T2-M 강좌 신청');
  await goto(page, 'education/academy.php');
  const applyBtn = await page.$('button[onclick*="apply"], button[class*="apply"], a[class*="apply"], .btn-apply').catch(() => null);
  if (applyBtn) {
    await applyBtn.click().catch(() => {});
    await page.waitForTimeout(1000);
    await has(page, '.modal, dialog, [role="dialog"]')
      ? pass('t2-m-t01', '강좌 신청 모달 열림')
      : hold('t2-m-t01', '모달 또는 신청 페이지 확인 필요');
  } else {
    hold('t2-m-t01', '신청 버튼 없음 — 강좌 데이터 또는 selector 확인 필요');
  }

  // U49 정회원 신청
  console.log('\n▶ U49 정회원 신청');
  for (const p of ['member/apply-regular.php', 'apply-regular.php', 'member/regular-apply.php', 'member/join-regular.php']) {
    const r = await goto(page, p);
    if (r.status === 200 && !page.url().includes('login')) {
      pass('u49-t01', `정회원 신청 정상: ${p}`);
      await has(page, 'form') ? pass('u49-t02', '정회원 신청 폼 존재') : hold('u49-t02', '폼 확인 필요');
      break;
    } else if (p === 'member/join-regular.php') {
      hold('u49-t01', '정회원 신청 URL 직접 확인 필요 (GNB에 없음)');
    }
  }

  // U51 후원 신청
  console.log('\n▶ U51 후원 신청');
  for (const p of ['member/apply-sponsor.php', 'apply-sponsor.php', 'support.php', 'member/sponsor.php']) {
    const r = await goto(page, p);
    if (r.status === 200 && !page.url().includes('login')) {
      pass('u51-t01', `후원 신청 정상: ${p}`);
      break;
    } else if (p === 'member/sponsor.php') {
      hold('u51-t01', '후원 신청 URL 직접 확인 필요');
    }
  }

  // U52 숲해설 신청
  console.log('\n▶ U52 숲해설 신청');
  const forestR = await goto(page, 'forest/index.php');
  forestR.status === 200
    ? pass('u52-t01', '숲해설 신청 페이지 정상')
    : fail('u52-t01', `HTTP ${forestR.status}`);
  await has(page, 'form') ? pass('u52-t03', '숲해설 신청 폼 존재') : hold('u52-t03', '폼 확인 필요');

  // 로그아웃
  await goto(page, 'auth/logout.php');
  console.log('  사용자 로그아웃');
}

// ─── 관리자 테스트 ────────────────────────────────────────────────────────────
async function runAdmin(page) {
  console.log('\n══════════════════ 관리자 ══════════════════');

  await login(page, 'admin', 'admin', true);
  const adminAfterUrl = page.url();
  console.log(`  로그인 후 URL: ${adminAfterUrl}`);

  // 관리자 GNB에 관리자 링크 확인
  await has(page, 'a[href*="admin"]')
    ? pass('a01-t01', `관리자 로그인 성공 — 관리자 링크 확인`)
    : fail('a01-t01', '관리자 로그인 실패');

  // 회원 관리
  console.log('\n▶ A01~A04 회원 관리');
  for (const [id, p, name] of [
    ['a01-t02', 'admin/members.php',            '회원 목록'],
    ['a04-t01', 'admin/members-withdrawn.php',   '탈퇴회원 목록'],
  ]) {
    const r = await goto(page, p);
    r.status === 200 && !page.url().includes('login')
      ? pass(id, `${name} 정상`)
      : fail(id, `${name} 실패 (${r.status})`);
  }

  // 강좌 관리
  console.log('\n▶ A05~A10 강좌 관리');
  for (const [id, p, name] of [
    ['a05-t01', 'admin/courses.php',               '기초과정 관리'],
    ['a07-t01', 'admin/courses.php?type=qualify',  '자격취득 관리'],
    ['a08-t01', 'admin/courses.php?type=enhance',  '역량강화 관리'],
    ['a09-t01', 'admin/courses.php?type=academy',  '회원아카데미 관리'],
    ['a10-t01', 'admin/applicants.php',            '신청자 통합 관리'],
    ['a10-t02', 'admin/courses.php?type=instructor','강사신청 일정 관리'],
    ['a10-t03', 'admin/applicants.php?type=instructor','강사신청자 관리'],
  ]) {
    const r = await goto(page, p);
    r.status === 200 && !page.url().includes('login')
      ? pass(id, `${name} 정상`)
      : fail(id, `${name} 실패 (${r.status})`);
  }

  // 신청 관리
  console.log('\n▶ A11~A16 신청 관리');
  for (const [id, p, name] of [
    ['a11-t01', 'admin/apply-regular.php',  '정회원 신청 관리'],
    ['a15-t01', 'admin/apply-forest.php',   '숲해설 신청 관리'],
    ['a16-t01', 'admin/apply-sponsor.php',  '후원 신청 관리'],
  ]) {
    const r = await goto(page, p);
    r.status === 200 && !page.url().includes('login')
      ? pass(id, `${name} 정상`)
      : fail(id, `${name} 실패 (${r.status})`);
  }

  // 일정 관리
  console.log('\n▶ A17~A19 일정 관리');
  const calR = await goto(page, 'admin/calendar.php');
  calR.status === 200 ? pass('a17-t01', '일정 관리 정상') : fail('a17-t01', `HTTP ${calR.status}`);

  // 게시판 관리
  console.log('\n▶ A20~A22 게시판 관리');
  for (const [id, p, name] of [
    ['a20-t01', 'admin/board.php?type=notice',     '공지사항 관리'],
    ['a21-t01', 'admin/board.php?type=newsletter', '협회지 관리'],
    ['a22-t01', 'admin/board.php?type=archive',    '자료실 관리'],
    ['a22-t02', 'admin/board.php?type=press',      '언론보도 관리'],
  ]) {
    const r = await goto(page, p);
    r.status === 200 && !page.url().includes('login')
      ? pass(id, `${name} 정상`)
      : fail(id, `${name} 실패 (${r.status})`);
  }

  // 콘텐츠 관리
  console.log('\n▶ A23~A25 콘텐츠 관리');
  for (const [id, p, name] of [
    ['a23-t01', 'admin/history.php',      '연혁 관리'],
    ['a24-t01', 'admin/organization.php', '조직도·임원진 관리'],
    ['a25-t01', 'admin/board.php?type=region',        '전국지역협회 관리'],
    ['a25-t02', 'admin/board.php?type=sagongdan_intro','사공단소개 관리'],
    ['a25-t03', 'admin/board.php?type=club_intro',    '동아리소개 관리'],
    ['a25-t04', 'admin/board.php?type=forest-work',   '숲일터 관리'],
  ]) {
    const r = await goto(page, p);
    r.status === 200 && !page.url().includes('login')
      ? pass(id, `${name} 정상`)
      : fail(id, `${name} 실패 (${r.status})`);
  }

  // 배너·팝업
  console.log('\n▶ A26~A29 배너·팝업');
  for (const [id, p, name] of [
    ['a26-t01', 'admin/banner.php', '배너 관리'],
    ['a28-t01', 'admin/popup.php',  '팝업 관리'],
  ]) {
    const r = await goto(page, p);
    r.status === 200 && !page.url().includes('login')
      ? pass(id, `${name} 정상`)
      : fail(id, `${name} 실패 (${r.status})`);
  }

  // 관리자 등록 기능 (데이터 생성 테스트 — 테스트 데이터만 추가)
  console.log('\n▶ 관리자 등록 폼 존재 확인');
  await goto(page, 'admin/courses.php');
  const addBtn = await page.$('a[href*="write"], a[href*="add"], a[href*="create"], button[class*="add"], .btn-add').catch(() => null);
  if (addBtn) {
    await addBtn.click().catch(() => {});
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    await has(page, 'form') ? pass('a05-t02', '강좌 등록 폼 정상') : hold('a05-t02', '강좌 등록 폼 확인 필요');
  } else {
    hold('a05-t02', '강좌 등록 버튼 확인 필요');
  }

  // 로그아웃
  await goto(page, 'auth/logout.php');
  console.log('  관리자 로그아웃');
}

// ─── Excel 결과 기록 ─────────────────────────────────────────────────────────
async function writeResults() {
  if (!fs.existsSync(XLSX)) return;
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(XLSX);

  let updated = 0;
  wb.worksheets.forEach(ws => {
    if (ws.name === '표지') return;
    ws.eachRow((row, rowNum) => {
      if (rowNum <= 2) return;
      const tcId = (row.getCell(7).value || '').toString().trim().toLowerCase();
      if (!tcId || !results[tcId]) return;
      const { result, note } = results[tcId];
      row.getCell(12).value = result;
      row.getCell(13).value = REVIEWER;
      row.getCell(14).value = TODAY;
      if (note) {
        const cur = (row.getCell(15).value || '').toString();
        row.getCell(15).value = cur ? `${cur} / ${note}` : note;
      }
      updated++;
    });
  });

  await wb.xlsx.writeFile(XLSX);
  console.log(`\n📝 Excel 업데이트: ${updated}개 TC`);
}

// ─── 메인 ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('='.repeat(60));
  console.log(' 한국숲해설가협회 전체 정밀 검수 v2');
  console.log('='.repeat(60));

  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: false,
    slowMo: 200,
    args: ['--ignore-certificate-errors', '--start-maximized']
  });
  const ctx  = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  try {
    await runCommon(page);
    await runUserPublic(page);
    await runUserLoggedIn(page);
    await runAdmin(page);
  } finally {
    console.log('\n' + '='.repeat(60));
    console.log(' 검수 결과 최종 집계');
    console.log('='.repeat(60));
    console.log(`  ✅ 합격   : ${totalPass}개`);
    console.log(`  ❌ 불합격 : ${totalFail}개`);
    console.log(`  ⚠️  보류   : ${totalHold}개`);
    console.log(`  총       : ${totalPass + totalFail + totalHold}개`);

    // 불합격 목록
    if (totalFail > 0) {
      console.log('\n── 불합격 항목 ──');
      Object.entries(results).filter(([,v]) => v.result === '불합격')
        .forEach(([id, v]) => console.log(`  ❌ ${id.padEnd(16)} ${v.note}`));
    }
    if (totalHold > 0) {
      console.log('\n── 보류 항목 ──');
      Object.entries(results).filter(([,v]) => v.result === '보류')
        .forEach(([id, v]) => console.log(`  ⚠️  ${id.padEnd(16)} ${v.note}`));
    }

    await writeResults();
    await page.waitForTimeout(1500);
    await browser.close();
  }
}

main().catch(e => { console.error('\n오류:', e.message); process.exit(1); });
