/**
 * foresto_recon.js
 * 사이트 구조 파악 — GNB 메뉴, 주요 URL, 폼 구조 수집
 */
const { chromium } = require('playwright');

const BASE = 'https://foresto.or.kr';

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--ignore-certificate-errors']
  });
  const ctx  = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await ctx.newPage();

  console.log('=== 홈페이지 접속 ===');
  const res = await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 15000 });
  console.log('HTTP 상태:', res.status());
  console.log('최종 URL :', page.url());

  // GNB 메뉴 수집
  const gnbLinks = await page.evaluate(() => {
    const links = [];
    document.querySelectorAll('header a, nav a, .gnb a, .menu a, #menu a, .nav a').forEach(a => {
      const href = a.getAttribute('href');
      const text = a.textContent.trim();
      if (href && text && !links.find(l => l.href === href)) {
        links.push({ text, href });
      }
    });
    return links;
  });
  console.log('\n=== GNB 링크 ===');
  gnbLinks.forEach(l => console.log(`  ${l.text.padEnd(20)} → ${l.href}`));

  // 푸터 링크
  const footerLinks = await page.evaluate(() => {
    const links = [];
    document.querySelectorAll('footer a').forEach(a => {
      const href = a.getAttribute('href');
      const text = a.textContent.trim();
      if (href && text) links.push({ text, href });
    });
    return links;
  });
  console.log('\n=== 푸터 링크 ===');
  footerLinks.forEach(l => console.log(`  ${l.text.padEnd(20)} → ${l.href}`));

  // 페이지 타이틀·주요 섹션
  const title = await page.title();
  console.log('\n=== 페이지 제목 ===', title);

  // 로그인 폼 여부
  const loginForm = await page.$('form[action*="login"], input[type="password"]');
  console.log('\n=== 로그인 폼 ===', loginForm ? '있음' : '없음');

  // 모든 <a> href 목록 (경로만, 중복 제거)
  const allHrefs = await page.evaluate(() => {
    const set = new Set();
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('/') && !href.startsWith('//')) set.add(href);
    });
    return [...set].sort();
  });
  console.log('\n=== 내부 링크 전체 ===');
  allHrefs.forEach(h => console.log(' ', h));

  await browser.close();
})().catch(e => { console.error('오류:', e.message); process.exit(1); });
