/**
 * foresto_investigate3.js — u49·u51·u52·t3 최종 확인
 */
const { chromium } = require('playwright');
const BASE = 'https://foresto.or.kr';

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--ignore-certificate-errors']
  });
  const ctx = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await ctx.newPage();

  // ── u49: participate/membership.php ──
  console.log('[u49] participate/membership.php');
  const r49 = await page.goto(`${BASE}/participate/membership.php`, { waitUntil: 'domcontentloaded' });
  console.log(`  상태: ${r49?.status()}, URL: ${page.url()}`);
  const m49 = await page.evaluate(() => {
    const form = document.querySelector('form');
    const applyBtn = [...document.querySelectorAll('a, button')].filter(el => el.textContent.includes('신청') || el.textContent.includes('가입'));
    const bodyPreview = document.body.innerText.slice(0, 400);
    return { hasForm: !!form, applyBtns: applyBtn.map(b => ({ text: b.textContent.trim().slice(0,30), href: b.getAttribute('href') })), bodyPreview };
  });
  console.log('  폼:', m49.hasForm, '신청버튼:', m49.applyBtns);
  console.log('  내용:', m49.bodyPreview.slice(0, 200));

  // ── u51: 후원 신청 URL 탐색 ──
  console.log('\n[u51] 후원 신청 URL 탐색');
  for (const url of ['/participate/sponsor.php', '/participate/donation.php', '/support/sponsor.php', '/donate.php', '/sponsor.php', '/community/sponsor.php']) {
    const r = await page.goto(`${BASE}${url}`, { waitUntil: 'domcontentloaded' }).catch(() => null);
    const status = r?.status();
    if (status === 200) {
      console.log(`  ✅ 후원 신청: ${url}`);
      const body = await page.evaluate(() => document.body.innerText.slice(0, 100));
      console.log('  내용:', body);
    }
  }
  // 전체 사이트 탐색: regulation 페이지에서 링크 수집
  await page.goto(`${BASE}/about/regulation.php`, { waitUntil: 'domcontentloaded' });
  const allLinks = await page.evaluate(() =>
    [...document.querySelectorAll('a[href]')].map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') }))
      .filter(l => l.text && l.href && l.href !== '#')
  );
  const sponsorLinks = allLinks.filter(l => l.text.includes('후원') || (l.href && l.href.includes('sponsor')));
  console.log('  regulation 후원 링크:', sponsorLinks);

  // participate 폴더 탐색
  for (const url of ['/participate/', '/participate/index.php']) {
    const r = await page.goto(`${BASE}${url}`, { waitUntil: 'domcontentloaded' }).catch(() => null);
    if (r?.status() === 200) {
      const links = await page.evaluate(() =>
        [...document.querySelectorAll('a[href]')].map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') }))
          .filter(l => l.text && l.href && l.href !== '#').slice(0, 20)
      );
      console.log(`  ${url} 링크:`, links.filter(l => !l.href.includes('foresto.or.kr') && l.text.length < 30));
    }
  }

  // ── u52-t02: 숲해설 신청 버튼 클릭 시 흐름 ──
  console.log('\n[u52-t02] 숲해설 신청 버튼 클릭 → 로그인 요구 확인');
  await page.goto(`${BASE}/forest/index.php`, { waitUntil: 'domcontentloaded' });
  const forestBtns = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('a, button')].filter(el => el.textContent.includes('신청'));
    return btns.map(b => ({ text: b.textContent.trim(), href: b.getAttribute('href'), tag: b.tagName }));
  });
  console.log('  신청 버튼:', forestBtns);
  // 신청 URL 직접 접근
  if (forestBtns.length > 0) {
    const firstBtn = forestBtns[0];
    if (firstBtn.href && firstBtn.href !== '#') {
      const applyUrl = firstBtn.href.startsWith('http') ? firstBtn.href : `${BASE}/${firstBtn.href.replace(/^\//, '')}`;
      const rApply = await page.goto(applyUrl, { waitUntil: 'domcontentloaded' }).catch(() => null);
      console.log(`  신청 URL: ${page.url()}, 상태: ${rApply?.status()}`);
      const applyPage = await page.evaluate(() => ({
        hasForm: !!document.querySelector('form'),
        isLoginPage: window.location.href.includes('login'),
        bodyPreview: document.body.innerText.slice(0, 200)
      }));
      console.log('  신청 결과:', applyPage);
    }
  }

  // ── t3-d-t01: 공지사항 상세 콘텐츠 ──
  console.log('\n[t3-d-t01] 공지사항 상세 콘텐츠 상세 조사');
  const rt3 = await page.goto(`${BASE}/community/notice-detail.php?id=9`, { waitUntil: 'domcontentloaded' });
  console.log(`  상태: ${rt3?.status()}`);
  const t3content = await page.evaluate(() => {
    const allDivs = [...document.querySelectorAll('div, article, section')].map(el => ({
      tag: el.tagName, class: el.className.slice(0, 50), id: el.id,
      text: el.textContent.trim().slice(0, 60)
    })).filter(d => d.text.length > 20 && !d.text.includes('\n\n\n'));
    return {
      bodyPreview: document.body.innerText.slice(200, 500),
      candidates: allDivs.slice(5, 15)
    };
  });
  console.log('  본문(200~500):', t3content.bodyPreview);

  await browser.close();
  console.log('\n3차 조사 완료');
})().catch(e => { console.error('오류:', e.message); process.exit(1); });
