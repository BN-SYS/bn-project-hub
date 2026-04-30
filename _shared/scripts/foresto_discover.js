/**
 * foresto_discover.js — 보류 항목 URL 탐색
 * 관리자/사용자 로그인 후 실제 링크 목록 수집
 */
const { chromium } = require('playwright');
const BASE = 'https://foresto.or.kr';

async function fillLogin(page, id, pw) {
  await page.fill('input[type="text"]:first-of-type, input[name="id"], input[name="username"]', id).catch(() => {});
  await page.fill('input[type="password"]', pw).catch(() => {});
  await page.click('button[type="submit"], input[type="submit"]').catch(() => {});
  await page.waitForLoadState('domcontentloaded').catch(() => {});
}

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--ignore-certificate-errors']
  });
  const ctx  = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await ctx.newPage();

  // ── 사용자 로그인 후 링크 수집 ──
  console.log('=== 사용자 로그인 후 내비 링크 ===');
  await page.goto(`${BASE}/auth/login.php`, { waitUntil: 'domcontentloaded' });
  await fillLogin(page, 'eunahp86', 'dmsdk86!');
  await page.waitForTimeout(1500);

  // 마이페이지에서 서브 링크
  await page.goto(`${BASE}/mypage/index.php`, { waitUntil: 'domcontentloaded' });
  const myLinks = await page.evaluate(() =>
    [...document.querySelectorAll('a[href]')]
      .filter(a => a.getAttribute('href').startsWith('/') || !a.getAttribute('href').startsWith('http'))
      .map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') }))
      .filter(l => l.text && l.href !== '#')
  );
  console.log('마이페이지 내 링크:');
  myLinks.forEach(l => console.log(`  ${l.text.slice(0,25).padEnd(26)} → ${l.href}`));

  // GNB 전체 링크 재수집 (로그인 후)
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  const allLinks = await page.evaluate(() =>
    [...document.querySelectorAll('header a, nav a, .gnb a')]
      .map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') }))
      .filter(l => l.text && l.href && l.href !== '#')
  );
  console.log('\nGNB 링크 (로그인 후):');
  allLinks.forEach(l => console.log(`  ${l.text.slice(0,25).padEnd(26)} → ${l.href}`));

  // 강좌 목록 페이지 내 링크 확인
  await page.goto(`${BASE}/education/academy.php`, { waitUntil: 'domcontentloaded' });
  const courseLinks = await page.evaluate(() =>
    [...document.querySelectorAll('a[href*="academy"], a[href*="course"], a[href*="detail"], table td a')]
      .map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') }))
      .filter(l => l.href)
  );
  console.log('\n강좌 상세 링크:');
  courseLinks.slice(0, 5).forEach(l => console.log(`  ${l.text.slice(0,25).padEnd(26)} → ${l.href}`));

  // 로그아웃
  await page.goto(`${BASE}/auth/logout.php`, { waitUntil: 'domcontentloaded' });

  // ── 관리자 로그인 후 링크 수집 ──
  console.log('\n=== 관리자 로그인 후 링크 수집 ===');
  await page.goto(`${BASE}/admin/`, { waitUntil: 'domcontentloaded' });
  await fillLogin(page, 'admin', 'admin');
  await page.waitForTimeout(1500);
  console.log('관리자 현재 URL:', page.url());

  const adminLinks = await page.evaluate(() =>
    [...document.querySelectorAll('a[href]')]
      .map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') }))
      .filter(l => l.text && l.href && l.href !== '#' &&
                   (l.href.includes('admin') || l.href.startsWith('/admin')))
  );
  const seen = new Set();
  console.log('관리자 메뉴 링크:');
  adminLinks.forEach(l => {
    const key = l.href;
    if (!seen.has(key)) {
      seen.add(key);
      console.log(`  ${l.text.slice(0,25).padEnd(26)} → ${l.href}`);
    }
  });

  // 관리자 페이지 탐색 (members.php 기반)
  await page.goto(`${BASE}/admin/members.php`, { waitUntil: 'domcontentloaded' });
  const adminSubLinks = await page.evaluate(() =>
    [...document.querySelectorAll('a[href]')]
      .map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') }))
      .filter(l => l.text && l.href && l.href !== '#')
  );
  console.log('\nadmin/members.php 내 링크:');
  const seen2 = new Set();
  adminSubLinks.slice(0, 30).forEach(l => {
    if (!seen2.has(l.href)) { seen2.add(l.href); console.log(`  ${l.text.slice(0,25).padEnd(26)} → ${l.href}`); }
  });

  // 로그인 폼 필드명 확인
  console.log('\n=== 로그인 폼 구조 ===');
  await page.goto(`${BASE}/auth/logout.php`, { waitUntil: 'domcontentloaded' });
  await page.goto(`${BASE}/auth/login.php`, { waitUntil: 'domcontentloaded' });
  const formFields = await page.evaluate(() =>
    [...document.querySelectorAll('input, select, textarea')]
      .map(el => ({ tag: el.tagName, type: el.type, name: el.name, id: el.id, placeholder: el.placeholder }))
  );
  console.log('폼 필드:', JSON.stringify(formFields, null, 2));

  // 회원가입 폼 구조
  console.log('\n=== 회원가입 폼 구조 ===');
  await page.goto(`${BASE}/auth/register.php`, { waitUntil: 'domcontentloaded' });
  const regFields = await page.evaluate(() =>
    [...document.querySelectorAll('input, select, textarea')]
      .map(el => ({ tag: el.tagName, type: el.type, name: el.name, id: el.id, placeholder: el.placeholder }))
  );
  console.log('회원가입 필드:', JSON.stringify(regFields, null, 2));

  await browser.close();
})().catch(e => { console.error('오류:', e.message); process.exit(1); });
