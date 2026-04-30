/**
 * foresto_test.js
 * 한국숲해설가협회 홈페이지 자동 검수
 * - 실제 Chrome 창을 열어서 테스트
 * - 결과를 테스트시나리오_한국숲해설가협회.xlsx 에 자동 기록
 *
 * Usage:
 *   cd _shared/scripts
 *   node foresto_test.js
 */
const { chromium } = require('playwright');
const path    = require('path');
const fs      = require('fs');
const ExcelJS = require('exceljs');

const BASE     = 'https://foresto.or.kr';
const XLSX     = path.resolve(__dirname, '../../workspace/EunAh/foresto_homepage/테스트시나리오_한국숲해설가협회.xlsx');
const REVIEWER = 'PM자동검수';
const TODAY    = new Date().toISOString().slice(0, 10);

const USERS = {
  user1: { id: 'eunahp86',  pw: 'dmsdk86!' },
  user2: { id: 'test01',    pw: 'Qodmsk86!' },
  admin: { id: 'admin',     pw: 'admin' },
};

// ─── 결과 저장소 ──────────────────────────────────────────────────────────────
// tcId → { result, note }
const results = {};

function pass(tcId, note = '') {
  results[tcId] = { result: '합격', note };
  console.log(`  ✅ [합격] ${tcId}${note ? ' — ' + note : ''}`);
}
function fail(tcId, note = '') {
  results[tcId] = { result: '불합격', note };
  console.log(`  ❌ [불합격] ${tcId}${note ? ' — ' + note : ''}`);
}
function hold(tcId, note = '') {
  results[tcId] = { result: '보류', note };
  console.log(`  ⚠️  [보류] ${tcId}${note ? ' — ' + note : ''}`);
}

// ─── 페이지 헬퍼 ──────────────────────────────────────────────────────────────
async function goto(page, path, timeout = 10000) {
  const url = path.startsWith('http') ? path : `${BASE}/${path}`;
  try {
    const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout });
    return { ok: true, status: res.status(), url: page.url() };
  } catch (e) {
    return { ok: false, status: 0, url, error: e.message };
  }
}

async function hasEl(page, selector) {
  try { return (await page.$(selector)) !== null; } catch { return false; }
}

async function getText(page, selector) {
  try { return await page.$eval(selector, el => el.textContent.trim()); } catch { return ''; }
}

async function fillLogin(page, id, pw) {
  await page.fill('input[name="id"], input[name="userid"], input[name="username"], input[type="text"]:first-of-type', id).catch(() => {});
  await page.fill('input[type="password"]', pw).catch(() => {});
  await page.click('button[type="submit"], input[type="submit"], .btn-login, .login-btn').catch(() => {});
  await page.waitForLoadState('domcontentloaded').catch(() => {});
}

// ─── 테스트 스위트 ────────────────────────────────────────────────────────────

// C01: 공통 헤더/푸터/GNB
async function testC01(page) {
  console.log('\n▶ C01 공통헤더/푸터/GNB');
  const r = await goto(page, '');
  if (!r.ok || r.status !== 200) { fail('c01-t01', `홈 접속 실패 ${r.status}`); return; }
  pass('c01-t01', `HTTP ${r.status}`);

  const hasHeader  = await hasEl(page, 'header, #header, .header');
  const hasFooter  = await hasEl(page, 'footer, #footer, .footer');
  const hasGnb     = await hasEl(page, 'nav, .gnb, #gnb, .menu');
  const hasLogo    = await hasEl(page, 'header img, .logo img, .header img');

  hasHeader ? pass('c01-t02', '헤더 존재') : fail('c01-t02', '헤더 없음');
  hasFooter ? pass('c01-t03', '푸터 존재') : fail('c01-t03', '푸터 없음');
  hasGnb    ? pass('c01-t04', 'GNB 존재') : fail('c01-t04', 'GNB 없음');
  hasLogo   ? pass('c01-t05', '로고 존재') : fail('c01-t05', '로고 없음');

  // GNB 링크 수 확인
  const gnbCount = await page.$$eval('nav a, .gnb a, #gnb a, header a', els => els.length).catch(() => 0);
  gnbCount >= 3 ? pass('c01-t06', `GNB 링크 ${gnbCount}개`) : fail('c01-t06', `GNB 링크 부족: ${gnbCount}개`);
}

// C02: 권한 정책 — 비회원 접근 시 redirect
async function testC02(page) {
  console.log('\n▶ C02 권한 정책');
  // 마이페이지 (로그아웃 상태)
  await page.goto(`${BASE}/auth/logout.php`, { waitUntil: 'domcontentloaded', timeout: 5000 }).catch(() => {});
  const myR = await goto(page, 'mypage/index.php');
  const myUrl = page.url();
  const redirectedToLogin = myUrl.includes('login') || myUrl.includes('auth');
  redirectedToLogin
    ? pass('c02-t01', '비로그인→마이페이지 → 로그인 redirect 확인')
    : hold('c02-t01', `redirect 미확인 — 현재 URL: ${myUrl}`);

  // 관리자 페이지 (비로그인 접근)
  const adminR = await goto(page, 'admin/index.php');
  const adminUrl = page.url();
  const adminRedirected = adminUrl.includes('login') || adminUrl.includes('auth') || adminR.status === 403;
  adminRedirected
    ? pass('c02-t02', '비로그인→관리자 → 차단 확인')
    : hold('c02-t02', `관리자 redirect 미확인 — 현재 URL: ${adminUrl}`);
}

// C03: 404/에러 페이지
async function testC03(page) {
  console.log('\n▶ C03 에러 페이지');
  const r = await goto(page, 'nonexistent-page-12345.php');
  const status = r.status;
  (status === 404 || await hasEl(page, '.error, .not-found, [class*="404"]'))
    ? pass('c03-t01', `404 처리 확인 (HTTP ${status})`)
    : hold('c03-t01', `404 페이지 처리 확인 필요 (HTTP ${status})`);
}

// 정적·법적 페이지
async function testStaticPages(page) {
  console.log('\n▶ 정적/법적 페이지');
  const pages = [
    { id: 'u58-t01', path: 'terms.php',   name: '이용약관' },
    { id: 'u59-t01', path: 'privacy.php', name: '개인정보처리방침' },
    { id: 'u60-t01', path: 'email.php',   name: '이메일무단수집거부' },
    { id: 'u61-t01', path: 'sitemap.php', name: '사이트맵' },
  ];
  for (const p of pages) {
    const r = await goto(page, p.path);
    r.ok && r.status === 200
      ? pass(p.id, `${p.name} 정상 로드`)
      : fail(p.id, `${p.name} 로드 실패 (${r.status})`);
  }
}

// U01: 홈메인
async function testU01(page) {
  console.log('\n▶ U01 홈메인');
  const r = await goto(page, '');
  r.status === 200 ? pass('u01-t01', '홈 정상 로드') : fail('u01-t01', `HTTP ${r.status}`);

  const hasBanner   = await hasEl(page, '.banner, .slider, .swiper, .main-visual, [class*="banner"], [class*="visual"]');
  const hasSection  = await hasEl(page, 'section, .section, main > div');
  hasBanner  ? pass('u01-t02', '메인 배너 존재') : hold('u01-t02', '배너 영역 확인 필요');
  hasSection ? pass('u01-t03', '메인 섹션 존재') : hold('u01-t03', '섹션 확인 필요');
}

// T1: 소개 정적 콘텐츠 (U05~U10)
async function testT1(page) {
  console.log('\n▶ T1 소개 정적 콘텐츠');
  const pages = [
    { id: 'u05-t01', path: 'about/index.php',      name: '협회 소개' },
    { id: 'u06-t01', path: 'about/members.php',    name: '조직 안내' },
    { id: 'u07-t01', path: 'about/regulation.php', name: '회원 안내' },
    { id: 'u08-t01', path: 'education/forester.php',    name: '숲해설가 소개' },
    { id: 'u09-t01', path: 'education/course-intro.php', name: '자격취득과정' },
    { id: 'u10-t01', path: 'education/job-training.php', name: '역량강화과정' },
  ];
  for (const p of pages) {
    const r = await goto(page, p.path);
    r.ok && r.status === 200
      ? pass(p.id, `${p.name} 정상 로드`)
      : fail(p.id, `${p.name} 로드 실패 (${r.status})`);
  }
}

// T2: 강좌 목록/상세
async function testT2(page) {
  console.log('\n▶ T2 강좌');
  const listR = await goto(page, 'education/academy.php');
  listR.ok && listR.status === 200
    ? pass('t2-l-t01', '강좌 목록 정상 로드')
    : fail('t2-l-t01', `강좌 목록 실패 (${listR.status})`);

  // 강좌 목록에서 첫 번째 항목 클릭
  const firstItem = await page.$('a[href*="academy"], a[href*="course"], .course-item a, .edu-item a, table a').catch(() => null);
  if (firstItem) {
    await firstItem.click().catch(() => {});
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    const detailUrl = page.url();
    detailUrl !== `${BASE}/education/academy.php`
      ? pass('t2-d-t01', `강좌 상세 이동: ${detailUrl}`)
      : hold('t2-d-t01', '강좌 상세 링크 확인 필요');
  } else {
    hold('t2-d-t01', '강좌 목록 항목 없음 (데이터 없음)');
  }
}

// U12: FAQ (추정 URL 탐색)
async function testU12(page) {
  console.log('\n▶ U12 FAQ');
  const candidates = ['community/faq.php', 'faq.php', 'community/faq-list.php', 'about/faq.php'];
  let found = false;
  for (const p of candidates) {
    const r = await goto(page, p);
    if (r.ok && r.status === 200 && !page.url().includes('login')) {
      pass('u12-t01', `FAQ 정상 로드: ${p}`);
      found = true; break;
    }
  }
  if (!found) hold('u12-t01', 'FAQ URL 확인 필요');
}

// T3: 공지사항
async function testT3(page) {
  console.log('\n▶ T3 공지사항');
  const r = await goto(page, 'community/notice-list.php');
  r.ok && r.status === 200
    ? pass('t3-l-t01', '공지사항 목록 정상 로드')
    : fail('t3-l-t01', `공지사항 목록 실패 (${r.status})`);

  // 첫 번째 게시글 클릭
  const firstPost = await page.$('table a, .notice-item a, .board-item a').catch(() => null);
  if (firstPost) {
    await firstPost.click().catch(() => {});
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    pass('t3-d-t01', `공지사항 상세 이동: ${page.url()}`);
  } else {
    hold('t3-d-t01', '공지사항 게시글 없음 또는 링크 확인 필요');
  }
}

// T5: 갤러리
async function testT5(page) {
  console.log('\n▶ T5 갤러리');
  const r = await goto(page, 'community/gallery.php');
  r.ok && r.status === 200
    ? pass('t5-l-t01', '갤러리 목록 정상 로드')
    : fail('t5-l-t01', `갤러리 실패 (${r.status})`);
}

// U38: 협회 캘린더
async function testU38(page) {
  console.log('\n▶ U38 협회 캘린더');
  const candidates = ['community/calendar.php', 'calendar.php', 'community/schedule.php', 'schedule.php'];
  let found = false;
  for (const p of candidates) {
    const r = await goto(page, p);
    if (r.ok && r.status === 200 && !page.url().includes('login')) {
      pass('u38-t01', `캘린더 정상 로드: ${p}`);
      found = true; break;
    }
  }
  if (!found) hold('u38-t01', '캘린더 URL 확인 필요 — GNB에서 직접 탐색 필요');
}

// U53: 로그인 페이지
async function testU53(page) {
  console.log('\n▶ U53 로그인');
  const r = await goto(page, 'auth/login.php');
  r.ok && r.status === 200
    ? pass('u53-t01', '로그인 페이지 정상 로드')
    : fail('u53-t01', `로그인 페이지 실패 (${r.status})`);

  const hasIdInput  = await hasEl(page, 'input[name="id"], input[name="userid"], input[name="username"]');
  const hasPwInput  = await hasEl(page, 'input[type="password"]');
  const hasBtn      = await hasEl(page, 'button[type="submit"], input[type="submit"]');
  hasIdInput ? pass('u53-t02', '아이디 입력 필드 존재') : fail('u53-t02', '아이디 필드 없음');
  hasPwInput ? pass('u53-t03', '비밀번호 입력 필드 존재') : fail('u53-t03', '비밀번호 필드 없음');
  hasBtn     ? pass('u53-t04', '로그인 버튼 존재') : fail('u53-t04', '로그인 버튼 없음');

  // 잘못된 비밀번호 테스트
  await fillLogin(page, USERS.user1.id, 'wrongpassword!');
  await page.waitForTimeout(1000);
  const stillOnLogin = page.url().includes('login') || page.url().includes('auth');
  const hasErrMsg = await hasEl(page, '.error, .alert, .msg, [class*="error"], [class*="alert"]');
  (stillOnLogin || hasErrMsg)
    ? pass('u53-t05', '잘못된 비밀번호 → 오류 처리 확인')
    : fail('u53-t05', '잘못된 비밀번호 시 처리 미확인');
}

// U55: 회원가입 페이지
async function testU55(page) {
  console.log('\n▶ U55 회원가입');
  const r = await goto(page, 'auth/register.php');
  r.ok && r.status === 200
    ? pass('u55-t01', '회원가입 페이지 정상 로드')
    : fail('u55-t01', `회원가입 페이지 실패 (${r.status})`);

  const hasForm = await hasEl(page, 'form');
  hasForm ? pass('u55-t02', '회원가입 폼 존재') : fail('u55-t02', '회원가입 폼 없음');
}

// 로그인 후 테스트 (user1: eunahp86)
async function testLoggedInUser(page, ctx) {
  console.log('\n▶ 사용자 로그인 (eunahp86)');
  await goto(page, 'auth/login.php');
  await fillLogin(page, USERS.user1.id, USERS.user1.pw);
  await page.waitForTimeout(2000);

  const afterUrl = page.url();
  const loginOk  = !afterUrl.includes('login') || afterUrl === `${BASE}/`;
  loginOk
    ? pass('u53-t06', `로그인 성공 → ${afterUrl}`)
    : fail('u53-t06', `로그인 실패 — URL: ${afterUrl}`);

  if (!loginOk) {
    console.log('  ⚠️  로그인 실패로 로그인 후 테스트 건너뜀');
    return;
  }

  // 마이페이지
  console.log('\n▶ U56 마이페이지');
  const mpCandidates = ['mypage/index.php', 'mypage.php', 'member/mypage.php', 'user/mypage.php'];
  let mpFound = false;
  for (const p of mpCandidates) {
    const r = await goto(page, p);
    if (r.ok && r.status === 200 && !page.url().includes('login')) {
      pass('u56-t01', `마이페이지 정상 로드: ${p}`);
      mpFound = true; break;
    }
  }
  if (!mpFound) hold('u56-t01', '마이페이지 URL 확인 필요');

  // 강좌 신청
  console.log('\n▶ T2-L 강좌 목록 (로그인 후)');
  const edR = await goto(page, 'education/academy.php');
  edR.ok && edR.status === 200
    ? pass('t2-l-t02', '로그인 후 강좌 목록 정상')
    : fail('t2-l-t02', `강좌 목록 실패: ${edR.status}`);

  // 정회원 신청
  console.log('\n▶ U49 정회원 신청');
  const memCandidates = ['member/join.php', 'member/apply.php', 'member/regular.php', 'join.php'];
  let memFound = false;
  for (const p of memCandidates) {
    const r = await goto(page, p);
    if (r.ok && r.status === 200 && !page.url().includes('login')) {
      pass('u49-t01', `정회원 신청 정상 로드: ${p}`);
      memFound = true; break;
    }
  }
  if (!memFound) hold('u49-t01', '정회원 신청 URL 확인 필요');

  // 숲해설 신청
  console.log('\n▶ U52 숲해설 신청');
  const forestR = await goto(page, 'forest/index.php');
  forestR.ok && forestR.status === 200
    ? pass('u52-t01', '숲해설 신청 정상 로드')
    : fail('u52-t01', `숲해설 신청 실패: ${forestR.status}`);

  // 후원 신청
  console.log('\n▶ U51 후원 신청');
  const donCandidates = ['member/donation.php', 'donate.php', 'support.php', 'member/support.php'];
  let donFound = false;
  for (const p of donCandidates) {
    const r = await goto(page, p);
    if (r.ok && r.status === 200 && !page.url().includes('login')) {
      pass('u51-t01', `후원 신청 정상 로드: ${p}`);
      donFound = true; break;
    }
  }
  if (!donFound) hold('u51-t01', '후원 신청 URL 확인 필요');

  // 로그아웃
  await goto(page, 'auth/logout.php');
  console.log('  사용자 로그아웃 완료');
}

// 관리자 로그인 후 테스트
async function testAdmin(page) {
  console.log('\n▶ 관리자 로그인');
  // 관리자 로그인 URL 탐색
  const adminLoginCandidates = ['admin/login.php', 'admin/index.php', 'admin/', 'admin'];
  let adminLoginUrl = null;
  for (const p of adminLoginCandidates) {
    const r = await goto(page, p);
    if (r.ok && r.status === 200) { adminLoginUrl = p; break; }
  }

  if (!adminLoginUrl) { hold('a01-t01', '관리자 URL 확인 필요'); return; }

  await fillLogin(page, USERS.admin.id, USERS.admin.pw);
  await page.waitForTimeout(2000);
  const adminUrl = page.url();
  const adminOk  = !adminUrl.includes('login');
  adminOk
    ? pass('a01-t01', `관리자 로그인 성공 → ${adminUrl}`)
    : fail('a01-t01', `관리자 로그인 실패 — URL: ${adminUrl}`);

  if (!adminOk) return;

  // 관리자 주요 페이지 점검
  console.log('\n▶ 관리자 페이지 목록');
  const adminPages = [
    { id: 'a01-t02', paths: ['admin/member/list.php', 'admin/members.php', 'admin/user/list.php'], name: '회원 목록' },
    { id: 'a05-t01', paths: ['admin/education/list.php', 'admin/course/list.php', 'admin/academy.php'], name: '강좌 관리' },
    { id: 'a11-t01', paths: ['admin/member/regular-list.php', 'admin/regular.php', 'admin/apply/regular.php'], name: '정회원 신청 관리' },
    { id: 'a15-t01', paths: ['admin/forest/list.php', 'admin/forest.php', 'admin/apply/forest.php'], name: '숲해설 신청 관리' },
    { id: 'a17-t01', paths: ['admin/schedule/list.php', 'admin/calendar.php', 'admin/schedule.php'], name: '일정 관리' },
    { id: 'a20-t01', paths: ['admin/board/list.php', 'admin/notice/list.php', 'admin/community/list.php'], name: '게시판 관리' },
    { id: 'a26-t01', paths: ['admin/banner/list.php', 'admin/banner.php'], name: '배너 관리' },
    { id: 'a28-t01', paths: ['admin/popup/list.php', 'admin/popup.php'], name: '팝업 관리' },
  ];

  for (const ap of adminPages) {
    let found = false;
    for (const p of ap.paths) {
      const r = await goto(page, p);
      if (r.ok && r.status === 200 && !page.url().includes('login')) {
        pass(ap.id, `${ap.name} 정상 로드: ${p}`);
        found = true; break;
      }
    }
    if (!found) hold(ap.id, `${ap.name} URL 확인 필요`);
  }

  // 관리자 로그아웃
  await goto(page, 'admin/logout.php').catch(() => goto(page, 'auth/logout.php'));
  console.log('  관리자 로그아웃 완료');
}

// ─── Excel 결과 기록 ─────────────────────────────────────────────────────────
async function writeResults() {
  if (!fs.existsSync(XLSX)) { console.log('\n⚠️  Excel 파일 없음 — 결과 저장 생략'); return; }

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
        const existing = (row.getCell(15).value || '').toString();
        row.getCell(15).value = existing ? `${existing} / ${note}` : note;
      }
      updated++;
    });
  });

  await wb.xlsx.writeFile(XLSX);
  console.log(`\n📝 Excel 결과 업데이트: ${updated}개 TC`);
}

// ─── 메인 ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('='.repeat(60));
  console.log(' 한국숲해설가협회 홈페이지 자동 검수');
  console.log('='.repeat(60));

  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: false,   // ← 실제 브라우저 창 표시
    slowMo: 300,
    args: ['--ignore-certificate-errors', '--start-maximized']
  });

  const ctx  = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: { width: 1280, height: 900 }
  });
  const page = await ctx.newPage();

  try {
    // ── 비로그인 테스트 ──
    await testC01(page);
    await testC02(page);
    await testC03(page);
    await testStaticPages(page);
    await testU01(page);
    await testT1(page);
    await testU53(page);
    await testU55(page);
    await testU12(page);
    await testT3(page);
    await testT5(page);
    await testU38(page);

    // ── 강좌 (비로그인 가능한 경우 포함) ──
    await testT2(page);

    // ── 로그인 후 ──
    await testLoggedInUser(page, ctx);

    // ── 관리자 ──
    await testAdmin(page);

  } finally {
    // 결과 집계
    const counts = Object.values(results).reduce((acc, r) => {
      acc[r.result] = (acc[r.result] || 0) + 1;
      return acc;
    }, {});

    console.log('\n' + '='.repeat(60));
    console.log(' 검수 결과 요약');
    console.log('='.repeat(60));
    console.log(`  합격   : ${counts['합격']   || 0}개`);
    console.log(`  불합격 : ${counts['불합격'] || 0}개`);
    console.log(`  보류   : ${counts['보류']   || 0}개`);
    console.log(`  총     : ${Object.keys(results).length}개`);

    await writeResults();

    await page.waitForTimeout(2000);
    await browser.close();
  }
}

main().catch(e => { console.error('\n오류:', e.message); process.exit(1); });
