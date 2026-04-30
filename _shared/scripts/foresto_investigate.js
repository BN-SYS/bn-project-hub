/**
 * foresto_investigate.js — 보류 항목 상세 조사
 */
const { chromium } = require('playwright');
const BASE = 'https://foresto.or.kr';

async function login(page, id, pw, isAdmin = false) {
  const url = isAdmin ? `${BASE}/admin/` : `${BASE}/auth/login.php`;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.fill('input[name="user_id"]', id).catch(() => {});
  await page.fill('input[type="password"]', pw).catch(() => {});
  await page.click('button[type="submit"], input[type="submit"]').catch(() => {});
  await page.waitForLoadState('domcontentloaded').catch(() => {});
  await page.waitForTimeout(1000);
}

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--ignore-certificate-errors']
  });
  const ctx = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await ctx.newPage();

  // ── u01-t03: section 태그 ──
  console.log('\n[u01-t03] 홈페이지 section 태그 확인');
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  const sections = await page.evaluate(() => {
    const els = document.querySelectorAll('section, .section, [class*="section"], main > div');
    return [...els].map(el => ({ tag: el.tagName, class: el.className.slice(0, 50), id: el.id })).slice(0, 10);
  });
  console.log('section/유사 태그:', JSON.stringify(sections, null, 2));

  // ── t3-d-t01: 공지사항 상세 ──
  console.log('\n[t3-d-t01] 공지사항 상세 페이지 확인');
  await page.goto(`${BASE}/board/notice.php`, { waitUntil: 'domcontentloaded' });
  const firstNotice = await page.evaluate(() => {
    const a = document.querySelector('table td a, .board-list a, .list a');
    return a ? { text: a.textContent.trim(), href: a.getAttribute('href') } : null;
  });
  console.log('첫 번째 공지:', firstNotice);
  if (firstNotice?.href) {
    const detailUrl = firstNotice.href.startsWith('http') ? firstNotice.href : `${BASE}${firstNotice.href}`;
    await page.goto(detailUrl, { waitUntil: 'domcontentloaded' });
    const detail = await page.evaluate(() => {
      const content = document.querySelector('.view-content, .board-view, .content-area, article, .detail, #content');
      const title = document.querySelector('.view-title, .board-title, h2, h3');
      return {
        title: title?.textContent.trim().slice(0, 50),
        contentExists: !!content,
        contentTag: content?.tagName,
        contentClass: content?.className
      };
    });
    console.log('상세 내용:', detail);
    console.log('URL:', page.url());
  }

  // ── u38-t02: 캘린더 렌더링 ──
  console.log('\n[u38-t02] 캘린더 렌더링 확인');
  await page.goto(`${BASE}/community/calendar.php`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  const calendar = await page.evaluate(() => {
    const cal = document.querySelector('.calendar, #calendar, table.cal, .fc, [class*="calendar"]');
    const cells = document.querySelectorAll('td[class*="day"], .fc-day, .cal-day');
    return {
      calendarEl: cal ? { tag: cal.tagName, class: cal.className.slice(0, 60) } : null,
      cellCount: cells.length,
      allTags: [...document.querySelectorAll('table')].map(t => ({ class: t.className.slice(0, 50) })).slice(0, 5)
    };
  });
  console.log('캘린더:', JSON.stringify(calendar, null, 2));

  // ── u54-t01: 비밀번호 찾기 URL ──
  console.log('\n[u54-t01] 비밀번호 찾기 URL 확인');
  await page.goto(`${BASE}/auth/login.php`, { waitUntil: 'domcontentloaded' });
  const pwFind = await page.evaluate(() => {
    const links = [...document.querySelectorAll('a')].map(a => ({
      text: a.textContent.trim(),
      href: a.getAttribute('href')
    })).filter(l => l.text);
    return links;
  });
  console.log('로그인 페이지 링크:', JSON.stringify(pwFind, null, 2));
  // 직접 URL 시도
  for (const url of ['/auth/find_pw.php', '/auth/forgot.php', '/auth/password.php', '/member/find_pw.php']) {
    const r = await page.goto(`${BASE}${url}`, { waitUntil: 'domcontentloaded' }).catch(() => null);
    if (r && r.status() === 200) {
      console.log(`✅ 비밀번호 찾기 URL 발견: ${url}`);
      break;
    }
  }

  // ── u52-t02: 숲해설 신청 권한 체크 ──
  console.log('\n[u52-t02] 숲해설 신청 (비로그인) 폼 접근 확인');
  await page.goto(`${BASE}/apply/forest.php`, { waitUntil: 'domcontentloaded' });
  const forestApply = await page.evaluate(() => {
    const form = document.querySelector('form');
    const loginRedirect = document.querySelector('.login-required, [class*="login"]');
    const url = window.location.href;
    return { hasForm: !!form, hasLoginNote: !!loginRedirect, url, bodyText: document.body.innerText.slice(0, 200) };
  });
  console.log('숲해설 신청(비로그인):', JSON.stringify(forestApply, null, 2));

  // ── u56 마이페이지 링크들 ──
  console.log('\n[u56] 마이페이지 링크 상세 조사');
  await login(page, 'eunahp86', 'dmsdk86!');
  await page.goto(`${BASE}/mypage/index.php`, { waitUntil: 'domcontentloaded' });
  const mypageLinks = await page.evaluate(() => {
    return [...document.querySelectorAll('a')].map(a => ({
      text: a.textContent.trim(),
      href: a.getAttribute('href')
    })).filter(l => l.text && l.href);
  });
  console.log('마이페이지 전체 링크:');
  mypageLinks.forEach(l => console.log(`  "${l.text.slice(0,30)}" → ${l.href}`));

  // 회원정보 수정
  for (const url of ['/mypage/edit.php', '/mypage/modify.php', '/mypage/profile.php', '/member/edit.php']) {
    const r = await page.goto(`${BASE}${url}`, { waitUntil: 'domcontentloaded' }).catch(() => null);
    if (r && r.status() === 200 && !page.url().includes('login')) {
      console.log(`✅ 회원정보 수정: ${url}`);
    }
  }

  // 비밀번호 변경
  for (const url of ['/mypage/change_pw.php', '/mypage/password.php', '/member/change_pw.php']) {
    const r = await page.goto(`${BASE}${url}`, { waitUntil: 'domcontentloaded' }).catch(() => null);
    if (r && r.status() === 200 && !page.url().includes('login')) {
      console.log(`✅ 비밀번호 변경: ${url}`);
    }
  }

  // 탈퇴
  for (const url of ['/mypage/withdraw.php', '/mypage/delete.php', '/member/withdraw.php']) {
    const r = await page.goto(`${BASE}${url}`, { waitUntil: 'domcontentloaded' }).catch(() => null);
    if (r && r.status() === 200 && !page.url().includes('login')) {
      console.log(`✅ 탈퇴: ${url}`);
    }
  }

  // 신청내역
  await page.goto(`${BASE}/mypage/index.php`, { waitUntil: 'domcontentloaded' });
  const applyHistory = await page.evaluate(() => {
    const el = document.querySelector('.apply-list, .history, [class*="apply"], [class*="history"], table');
    return el ? { tag: el.tagName, class: el.className } : null;
  });
  console.log('신청내역 영역:', applyHistory);

  // ── u49-t01: 정회원 신청 URL ──
  console.log('\n[u49] 정회원 신청 URL 확인');
  for (const url of ['/apply/regular.php', '/apply/member.php', '/apply/join.php', '/member/apply.php', '/membership/apply.php']) {
    const r = await page.goto(`${BASE}${url}`, { waitUntil: 'domcontentloaded' }).catch(() => null);
    const status = r?.status();
    if (status === 200) console.log(`✅ 정회원 신청: ${url}`);
    else console.log(`  ❌ ${url} → ${status}`);
  }
  // admin 에서 실제 링크 확인
  await page.goto(`${BASE}/apply-regular.php`, { waitUntil: 'domcontentloaded' }).catch(() => {});
  console.log('apply-regular.php 직접:', page.url(), await page.title());

  // ── u51-t01: 후원 신청 URL ──
  console.log('\n[u51] 후원 신청 URL 확인');
  for (const url of ['/apply/sponsor.php', '/apply/donation.php', '/support/apply.php', '/donation/apply.php']) {
    const r = await page.goto(`${BASE}${url}`, { waitUntil: 'domcontentloaded' }).catch(() => null);
    if (r?.status() === 200) console.log(`✅ 후원 신청: ${url}`);
  }

  // ── t2-m-t01: 강좌 신청 버튼 ──
  console.log('\n[t2-m-t01] 강좌 신청 버튼 확인');
  await page.goto(`${BASE}/education/academy.php`, { waitUntil: 'domcontentloaded' });
  const courseInfo = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('a, button')].filter(el => {
      const t = el.textContent.trim();
      return t.includes('신청') || t.includes('apply') || t.includes('등록');
    });
    const rows = document.querySelectorAll('tr, .course-item, .list-item');
    return {
      applyBtns: btns.map(b => ({ text: b.textContent.trim(), href: b.getAttribute('href') })).slice(0, 5),
      rowCount: rows.length,
      pageTitle: document.title
    };
  });
  console.log('강좌 신청:', JSON.stringify(courseInfo, null, 2));

  // ── a05-t02: 관리자 강좌 등록 버튼 ──
  console.log('\n[a05-t02] 관리자 강좌 등록 버튼 확인');
  await login(page, 'admin', 'admin', true);
  await page.goto(`${BASE}/admin/courses.php`, { waitUntil: 'domcontentloaded' });
  const adminCourse = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('a, button')].filter(el => {
      const t = el.textContent.trim();
      return t.includes('등록') || t.includes('추가') || t.includes('신규') || t.includes('write') || t.includes('add');
    });
    return btns.map(b => ({ text: b.textContent.trim().slice(0, 30), href: b.getAttribute('href'), tag: b.tagName }));
  });
  console.log('관리자 강좌 등록 버튼:', JSON.stringify(adminCourse, null, 2));
  console.log('URL:', page.url());

  await browser.close();
  console.log('\n조사 완료');
})().catch(e => { console.error('오류:', e.message); process.exit(1); });
