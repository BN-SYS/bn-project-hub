/* A03 — 회지 목록 */
document.addEventListener('DOMContentLoaded', function () {

  // 새 회지 생성 모달 폼 제출
  const addJournalSubmit = document.getElementById('addJournalSubmit');
  if (addJournalSubmit) {
    addJournalSubmit.addEventListener('click', function () {
      const form = document.getElementById('add-journal-form');
      if (form) form.requestSubmit();
    });
  }

});
