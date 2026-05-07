function countPhotos(content) {
  if (!content) return 0;
  const text = content.replace(/<[^>]*>/g, '');
  return (text.match(/♣\d*/g) || []).length;
}

function getTotalPhotos() {
  return getArticles().reduce((sum, a) => sum + countPhotos(a.content), 0);
}

function applyPhotoNumbering() {
  const articles = getArticles();
  let counter = 1;

  for (const article of articles) {
    let content = article.content || '';

    // 기존 채번 제거: ♣01 → ♣
    content = content.replace(/♣\d+/g, '♣');

    const startNum = counter;

    // 순서대로 채번
    content = content.replace(/♣/g, () => {
      return '♣' + String(counter++).padStart(2, '0');
    });

    article.content = content;

    // 이미지 라벨 업데이트
    if (article.images && article.images.length > 0) {
      article.images.forEach((img, i) => {
        const n = startNum + i;
        img.photoLabel = '♣' + String(n).padStart(2, '0');
      });
    }

    upsertArticle(article);
  }

  return counter - 1;
}
