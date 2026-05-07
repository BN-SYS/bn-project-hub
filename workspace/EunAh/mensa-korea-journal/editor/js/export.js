async function exportToDocx() {
  if (typeof docx === 'undefined') {
    alert('내보내기 라이브러리 로딩 중입니다. 잠시 후 다시 시도해주세요.');
    return;
  }

  const articles = getArticles();
  if (articles.length === 0) { alert('내보낼 원고가 없습니다.'); return; }

  const { Document, Paragraph, TextRun, ImageRun, Packer, AlignmentType, BorderStyle } = docx;

  const children = [];
  const date = new Date().toLocaleDateString('ko-KR');

  // 표지 정보
  children.push(
    new Paragraph({
      children: [new TextRun({ text: '멘사코리아 회지 원고 취합본', bold: true, size: 40, font: '맑은 고딕' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [new TextRun({ text: `생성일: ${date}  |  총 원고: ${articles.length}편`, size: 20, color: '666666' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 800 },
    })
  );

  for (let i = 0; i < articles.length; i++) {
    const art = articles[i];

    // 구분
    if (i > 0) {
      children.push(new Paragraph({ text: '─'.repeat(30), spacing: { before: 500, after: 300 } }));
    }

    // 제목
    children.push(new Paragraph({
      children: [new TextRun({ text: `[${i + 1}] ${art.title || '(제목 없음)'}`, bold: true, size: 30, font: '맑은 고딕' })],
      spacing: { after: 120 },
    }));

    // 작성자
    if (art.author) {
      children.push(new Paragraph({
        children: [new TextRun({ text: `글 : ${art.author}`, size: 20, italics: true, color: '555555' })],
        spacing: { after: 240 },
      }));
    }

    // 본문
    const contentParas = htmlToDocxParagraphs(art.content || '', { Paragraph, TextRun });
    children.push(...contentParas);

    // 이미지
    const images = art.images || [];
    if (images.length > 0) {
      children.push(new Paragraph({
        children: [new TextRun({ text: '▶ 이미지', bold: true, size: 20, color: '1a56db' })],
        spacing: { before: 300, after: 160 },
      }));

      for (const img of images) {
        try {
          const buf = dataUrlToBuffer(img.dataUrl);
          const ext = img.name.split('.').pop().toLowerCase();
          const type = (ext === 'jpg' || ext === 'jpeg') ? 'jpg' : 'png';
          children.push(
            new Paragraph({
              children: [new ImageRun({ data: buf, transformation: { width: 420, height: 300 }, type })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 60 },
            }),
            new Paragraph({
              children: [new TextRun({ text: (img.photoLabel ? img.photoLabel + ' ' : '') + (img.caption || img.name), size: 18, color: '555555' })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            })
          );
        } catch {
          children.push(new Paragraph({
            children: [new TextRun({ text: `[이미지: ${img.name}]`, size: 18, color: '999999' })],
          }));
        }
      }
    }
  }

  const doc = new Document({
    styles: {
      default: { document: { run: { font: '맑은 고딕', size: 22 } } },
    },
    sections: [{
      properties: { page: { margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } },
      children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  const fname = '멘사코리아_회지_' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '.docx';
  saveAs(blob, fname);
}

function htmlToDocxParagraphs(html, { Paragraph, TextRun }) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const paras = [];

  function addPara(text) {
    if (!text.trim()) return;
    paras.push(new Paragraph({
      children: [new TextRun({ text, size: 22 })],
      spacing: { after: 120 },
    }));
  }

  if (doc.body.children.length > 0) {
    for (const el of doc.body.children) {
      addPara(el.textContent);
    }
  } else {
    doc.body.textContent.split(/\n+/).forEach(line => addPara(line));
  }

  return paras;
}

function dataUrlToBuffer(dataUrl) {
  const base64 = dataUrl.split(',')[1];
  const binary = atob(base64);
  const buf = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) buf[i] = binary.charCodeAt(i);
  return buf.buffer;
}
