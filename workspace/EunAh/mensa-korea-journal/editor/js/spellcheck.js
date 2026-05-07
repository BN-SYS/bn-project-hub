// ── 맞춤법 검사 ───────────────────────────────────────────
// 브라우저 내장 검사(빨간 밑줄) + 네이버 검사기 연동

function checkSpelling() {
  const panel = document.getElementById('spell-panel');
  panel.classList.toggle('hidden');
  if (!panel.classList.contains('hidden')) renderSpellPanel();
}

function renderSpellPanel() {
  const panel = document.getElementById('spell-panel');
  panel.innerHTML = `
    <div class="spell-header">
      <strong>맞춤법 검사</strong>
      <button class="btn btn-sm btn-outline" onclick="closeSpellPanel()">닫기</button>
    </div>
    <div class="spell-section">
      <div class="spell-section-title">① 브라우저 내장 검사 <span class="spell-badge active">활성화됨</span></div>
      <p class="spell-desc">오탈자는 본문에 <span style="text-decoration:underline wavy #e53e3e;text-underline-offset:2px">빨간 밑줄</span>로 표시됩니다.<br>밑줄 단어에서 <strong>우클릭 → 수정 제안</strong>을 선택하세요.</p>
    </div>
    <div class="spell-section" style="border-top:1px solid var(--c-border);padding-top:14px">
      <div class="spell-section-title">② 네이버 맞춤법 검사기 <span class="spell-badge">띄어쓰기 포함</span></div>
      <p class="spell-desc">더 정밀한 검사(띄어쓰기·문법)는 나라인포테크 맞춤법 검사기에서 확인할 수 있습니다.<br>아래 버튼을 누르면 본문이 복사되고 검사 페이지가 열립니다.</p>
      <button class="btn btn-primary btn-sm" style="margin-top:8px" onclick="openNaverSpell()">본문 복사 후 검사 사이트 열기</button>
    </div>`;
}

function openNaverSpell() {
  const text = quill.getText().replace(/\n$/, '').trim();
  if (!text) { showToast('내용이 없습니다.'); return; }
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
      .then(() => showToast('복사됐습니다. 네이버에 붙여넣기 하세요.'))
      .catch(() => {});
  }
  window.open('https://nara-speller.co.kr/', '_blank');
}

function closeSpellPanel() {
  const panel = document.getElementById('spell-panel');
  if (panel) { panel.innerHTML = ''; panel.classList.add('hidden'); }
}
