// ─── DOCX 내보내기 (html-docx-js 사용) ───────────────────
function exportToDocx() {
  if (typeof htmlDocx === 'undefined') {
    alert('내보내기 라이브러리를 불러오지 못했습니다.\n인터넷 연결을 확인하고 페이지를 새로고침해주세요.');
    return;
  }

  const articles = getArticles();
  if (!articles.length) { alert('내보낼 원고가 없습니다.'); return; }

  const date = new Date().toLocaleDateString('ko-KR');

  let body = `
    <div style="text-align:center;margin-bottom:24pt">
      <p style="font-size:20pt;font-weight:bold;margin:0">멘사코리아 회지 원고 취합본</p>
      <p style="font-size:10pt;color:#666;margin:6pt 0 0">생성일: ${date} &nbsp;|&nbsp; 총 원고: ${articles.length}편</p>
    </div>`;

  for (let i = 0; i < articles.length; i++) {
    const art = articles[i];
    if (i > 0) body += '<hr style="margin:20pt 0;border:none;border-top:1px solid #aaa">';

    body += `<h2 style="font-size:15pt;font-weight:bold;border-bottom:2px solid #333;padding-bottom:4pt;margin-bottom:8pt">
               [${i + 1}] ${esc(art.title || '(제목 없음)')}
             </h2>`;

    if (art.author) {
      body += `<p style="color:#555;font-style:italic;margin:0 0 10pt">${esc(art.author)} 글</p>`;
    }

    // 본문 HTML — ♣01 등 위치 태그 그대로 포함
    body += `<div style="line-height:1.9;margin-bottom:14pt">${art.content || '<p>(내용 없음)</p>'}</div>`;
  }

  const fullHtml = `<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<style>
  body { font-family: '맑은 고딕', 'Malgun Gothic', sans-serif; font-size: 11pt; line-height: 1.8; }
</style>
</head>
<body>${body}</body></html>`;

  const blob = htmlDocx.asBlob(fullHtml);
  const fname = '멘사코리아_회지_' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '.docx';
  saveAs(blob, fname);
}

// ─── 이미지 ZIP 다운로드 ──────────────────────────────────
async function exportImages() {
  if (typeof JSZip === 'undefined') {
    alert('ZIP 라이브러리 로딩 중입니다. 잠시 후 다시 시도해주세요.');
    return;
  }

  const articles = getArticles();
  const allImages = [];
  for (const art of articles) {
    for (const img of (art.images || [])) allImages.push({ img });
  }

  if (!allImages.length) {
    alert('다운로드할 이미지가 없습니다.\n편집기에서 이미지를 추가한 뒤 채번 후 시도해주세요.');
    return;
  }

  const hasNumbering = allImages.some(({ img }) => img.photoLabel);
  if (!hasNumbering) {
    if (!confirm('채번이 적용되지 않은 이미지입니다.\n원본 파일명으로 다운로드하시겠습니까?\n(채번 후 다운로드하면 사진01_파일명.jpg 형태로 저장됩니다)')) return;
  }

  const allIds = allImages.map(({ img }) => img.id);
  const dataMap = await idbGetAll(allIds);

  const zip = new JSZip();
  const folder = zip.folder('이미지_취합');

  for (const { img } of allImages) {
    const dataUrl = dataMap[img.id];
    if (!dataUrl) { console.warn('이미지 없음:', img.name); continue; }

    const label    = img.photoLabel ? img.photoLabel.replace('♣', '사진') + '_' : '';
    const safeName = img.name.replace(/[\\/:*?"<>|]/g, '_');

    try {
      folder.file(label + safeName, dataUrl.split(',')[1], { base64: true });
    } catch {
      console.warn('이미지 추가 실패:', img.name);
    }
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, `멘사코리아_이미지_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.zip`);
}

// ─── 유틸 ────────────────────────────────────────────────
function esc(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
