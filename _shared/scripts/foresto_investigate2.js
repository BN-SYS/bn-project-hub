/**
 * foresto_investigate2.js — 보류 2차 정밀 조사
 */
const { chromium } = require('playwright');
const BASE = 'https://foresto.or.kr';

async function loginUser(page) {
  await page.goto(`${BASE}/auth/login.php`, { waitUntil: 'domcontentloaded' });
  await page.fill('input[name="user_id"]', 'eunahp86');
  await page.fill('input[type="password"]', 'dmsdk86!');
  await page.click('button[type="submit"], input[type="submit"]');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1000);
}

async function loginAdmin(page) {
  await page.goto(`${BASE}/admin/`, { waitUntil: 'domcontentloaded' });
  await page.fill('input[name="user_id"]', 'admin');
  await page.fill('input[type="password"]', 'admin');
  await page.click('button[type="submit"], input[type="submit"]');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1000);
  console.log('  관리자 로그인 후 URL:', page.url());
}

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--ignore-certificate-errors']
  });
  const ctx = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await ctx.newPage();

  // ── u54-t01: 아이디/비밀번호 찾기 ──
  console.log('[u54-t01] /auth/find.php 확인');
  const r54 = await page.goto(`${BASE}/auth/find.php`, { waitUntil: 'domcontentloaded' });
  console.log(`  상태: ${r54?.status()}, URL: ${page.url()}`);
  const findForm = await page.evaluate(() => {
    const inputs = [...document.querySelectorAll('input')].map(i => ({ type: i.type, name: i.name, placeholder: i.placeholder }));
    return { inputs, title: document.title };
  });
  console.log('  폼:', JSON.stringify(findForm));

  // ── u01-t03: 홈 section 구조 재확인 ──
  console.log('\n[u01-t03] 홈 페이지 주요 섹션 구조');
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  const homeStructure = await page.evaluate(() => {
    const main = document.querySelector('main, #main, .main, .content');
    const allDivs = [...document.querySelectorAll('main > div, body > div, #wrap > div')]
      .map(d => ({ tag: d.tagName, id: d.id, class: d.className.slice(0, 60) }));
    return { mainTag: main?.tagName, mainClass: main?.className, children: allDivs.slice(0, 10) };
  });
  console.log('  홈 구조:', JSON.stringify(homeStructure, null, 2));

  // ── t3-d-t01: 공지사항 상세 (올바른 URL) ──
  console.log('\n[t3-d-t01] 공지사항 목록에서 상세 접근');
  await page.goto(`${BASE}/community/notice-list.php`, { waitUntil: 'domcontentloaded' });
  const noticeLink = await page.evaluate(() => {
    const a = document.querySelector('table a, .list a, .board a, [class*="notice"] a, td a');
    return a ? { text: a.textContent.trim(), href: a.getAttribute('href') } : null;
  });
  console.log('  공지 링크:', noticeLink);
  if (noticeLink?.href) {
    const detailUrl = noticeLink.href.startsWith('http') ? noticeLink.href
      : noticeLink.href.startsWith('/') ? `${BASE}${noticeLink.href}`
      : `${BASE}/community/${noticeLink.href}`;
    const rd = await page.goto(detailUrl, { waitUntil: 'domcontentloaded' });
    console.log(`  상세 URL: ${page.url()}, 상태: ${rd?.status()}`);
    const detailContent = await page.evaluate(() => {
      const content = document.querySelector('.view-content, .board-view, article, .detail, .content, #content, .post-content');
      const title = document.querySelector('h1, h2, h3, .title, .subject');
      return { hasContent: !!content, contentClass: content?.className, title: title?.textContent.trim().slice(0,50) };
    });
    console.log('  상세 내용:', detailContent);
  }

  // ── u52-t02: 숲해설 신청 비로그인 접근 ──
  console.log('\n[u52-t02] 숲해설 신청 비로그인 접근');
  await page.goto(`${BASE}/forest/index.php`, { waitUntil: 'domcontentloaded' });
  const forestCheck = await page.evaluate(() => ({
    url: window.location.href,
    hasForm: !!document.querySelector('form'),
    hasLoginMsg: document.body.innerText.includes('로그인') || document.body.innerText.includes('login'),
    bodyPreview: document.body.innerText.slice(0, 200)
  }));
  console.log('  숲해설(비로그인):', JSON.stringify(forestCheck));

  // ── u56: 마이페이지 상세 조사 ──
  console.log('\n[u56] 마이페이지 내용 상세');
  await loginUser(page);
  await page.goto(`${BASE}/mypage/index.php`, { waitUntil: 'domcontentloaded' });
  const mypageDetail = await page.evaluate(() => {
    const bodyText = document.body.innerText.slice(0, 500);
    const allLinks = [...document.querySelectorAll('a')].filter(a => {
      const h = a.getAttribute('href') || '';
      return h.includes('mypage') || h.includes('member') || h.includes('edit') || h.includes('modify') || h.includes('withdraw') || h.includes('password');
    }).map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') }));
    const buttons = [...document.querySelectorAll('button, input[type="button"], input[type="submit"]')]
      .map(b => ({ text: (b.textContent || b.value || '').trim(), type: b.type }));
    return { bodyText, links: allLinks, buttons };
  });
  console.log('  본문 미리보기:', mypageDetail.bodyText);
  console.log('  관련 링크:', JSON.stringify(mypageDetail.links));
  console.log('  버튼:', JSON.stringify(mypageDetail.buttons));

  // ── u49, u51: GNB에서 정회원·후원 신청 링크 찾기 ──
  console.log('\n[u49/u51] 사이트 전체에서 정회원·후원 신청 URL 탐색');
  // 메인 페이지 전체 링크
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  const mainLinks = await page.evaluate(() =>
    [...document.querySelectorAll('a[href]')].filter(a => {
      const h = a.getAttribute('href');
      const t = a.textContent.trim();
      return t.includes('정회원') || t.includes('후원') || t.includes('sponsor') || t.includes('regular') || t.includes('회원가입') || h?.includes('regular') || h?.includes('sponsor');
    }).map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') }))
  );
  console.log('  메인 페이지 정회원/후원 링크:', mainLinks);

  // 회원 안내 페이지
  await page.goto(`${BASE}/about/regulation.php`, { waitUntil: 'domcontentloaded' });
  const regLinks = await page.evaluate(() =>
    [...document.querySelectorAll('a[href]')].filter(a => {
      const h = a.getAttribute('href') || '';
      const t = a.textContent.trim();
      return t.includes('신청') || t.includes('가입') || h.includes('apply') || h.includes('join') || h.includes('regular') || h.includes('sponsor');
    }).map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') }))
  );
  console.log('  회원안내 페이지 링크:', JSON.stringify(regLinks));

  // ── t2-m-t01: 강좌 신청 academy-apply.php 확인 ──
  console.log('\n[t2-m-t01] academy-apply.php 확인');
  const rApply = await page.goto(`${BASE}/education/academy-apply.php`, { waitUntil: 'domcontentloaded' });
  console.log(`  상태: ${rApply?.status()}, URL: ${page.url()}`);
  const applyInfo = await page.evaluate(() => ({
    hasForm: !!document.querySelector('form'),
    title: document.title,
    bodyPreview: document.body.innerText.slice(0, 200)
  }));
  console.log('  신청 페이지:', applyInfo);

  // ── a05-t02: 관리자 강좌 등록 직접 확인 ──
  console.log('\n[a05-t02] 관리자 강좌 등록 버튼');
  await page.goto(`${BASE}/auth/logout.php`, { waitUntil: 'domcontentloaded' });
  await loginAdmin(page);
  // 관리자 로그인 성공 후 courses.php로 이동
  const rCourse = await page.goto(`${BASE}/admin/courses.php`, { waitUntil: 'domcontentloaded' });
  console.log(`  courses.php 상태: ${rCourse?.status()}, URL: ${page.url()}`);
  const courseAdmin = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('a, button')].filter(el => {
      const t = el.textContent.trim();
      return t.includes('등록') || t.includes('추가') || t.includes('신규') || t.includes('새') || t.includes('write') || t.includes('add') || t.includes('new');
    });
    const allBtns = [...document.querySelectorAll('a.btn, button, input[type="button"], input[type="submit"]')]
      .map(b => ({ text: (b.textContent || b.value || '').trim().slice(0, 30), href: b.getAttribute('href'), class: b.className }));
    return {
      registerBtns: btns.map(b => ({ text: b.textContent.trim().slice(0,30), href: b.getAttribute('href') })),
      allBtns: allBtns.slice(0, 10),
      bodyPreview: document.body.innerText.slice(0, 300)
    };
  });
  console.log('  등록 버튼:', courseAdmin.registerBtns);
  console.log('  모든 버튼:', courseAdmin.allBtns);
  console.log('  페이지 미리보기:', courseAdmin.bodyPreview.slice(0, 150));

  await browser.close();
  console.log('\n2차 조사 완료');
})().catch(e => { console.error('오류:', e.message); process.exit(1); });
