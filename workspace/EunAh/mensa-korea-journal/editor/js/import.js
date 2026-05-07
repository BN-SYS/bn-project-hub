async function parseFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  if (ext === 'docx' || ext === 'doc') return parseDocx(file);
  if (ext === 'txt') return parseTxt(file);
  if (ext === 'hwp' || ext === 'hwpx') return parseHwp(file);
  throw new Error('지원하지 않는 형식: ' + ext);
}

async function parseDocx(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });
  return result.value;
}

async function parseTxt(file) {
  const text = await file.text();
  return text
    .split(/\n\n+/)
    .map(p => '<p>' + p.trim().replace(/\n/g, '<br>') + '</p>')
    .filter(p => p !== '<p></p>')
    .join('');
}

async function parseHwp(file) {
  // HWPX(ZIP 기반)는 JSZip으로 시도
  if (typeof JSZip !== 'undefined') {
    try {
      const zip = new JSZip();
      const content = await zip.loadAsync(file);
      const sectionKeys = Object.keys(content.files)
        .filter(n => /section\d+\.xml$/i.test(n))
        .sort();
      if (sectionKeys.length > 0) {
        const texts = [];
        for (const key of sectionKeys) {
          const xmlStr = await content.files[key].async('text');
          const doc = new DOMParser().parseFromString(xmlStr, 'application/xml');
          doc.querySelectorAll('t').forEach(t => {
            if (t.textContent.trim()) texts.push(t.textContent);
          });
        }
        return '<p>' + texts.join('</p><p>') + '</p>';
      }
    } catch {}
  }
  return null; // 실패 시 null — 호출부에서 붙여넣기 안내
}

