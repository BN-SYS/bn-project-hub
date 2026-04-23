<?php
/**
 * 팝업 렌더링 파셜
 * 변수: $__popups (PopupModel::getActivePopups() 결과)
 */
if (empty($__popups)) return;
?>

<?php foreach ($__popups as $__p): ?>
<div class="yn-popup"
  id="yn-popup-<?= (int)$__p['id'] ?>"
  data-popup-id="<?= (int)$__p['id'] ?>"
  style="top:<?= (int)$__p['pos_top'] ?>px;left:<?= (int)$__p['pos_left'] ?>px;width:<?= (int)$__p['width'] ?>px;height:<?= (int)$__p['height'] ?>px;">
  <div class="yn-popup-header">
    <span class="yn-popup-title"><?= e($__p['title']) ?></span>
    <button class="yn-popup-close-x" aria-label="닫기">&#10005;</button>
  </div>
  <div class="yn-popup-body ql-editor">
    <?= $__p['content'] ?>
  </div>
  <div class="yn-popup-footer">
    <button class="yn-popup-dismiss" data-id="<?= (int)$__p['id'] ?>">오늘 하루 닫기</button>
    <button class="yn-popup-close-btn" data-id="<?= (int)$__p['id'] ?>">닫기</button>
  </div>
</div>
<?php endforeach; ?>

<script>
(function () {
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit'
  }).replace(/\.\s*/g, '-').replace(/-$/, ''); // YYYY-MM-DD

  document.querySelectorAll('.yn-popup').forEach(function (popup) {
    const id  = popup.dataset.popupId;
    const key = 'yn_popup_dismiss_' + id;

    // 오늘 하루 닫기 상태 확인
    if (localStorage.getItem(key) === today) {
      popup.style.display = 'none';
      return;
    }

    // 닫기 (X 버튼)
    popup.querySelector('.yn-popup-close-x').addEventListener('click', function () {
      popup.style.display = 'none';
    });

    // 오늘 하루 닫기
    popup.querySelector('.yn-popup-dismiss').addEventListener('click', function () {
      localStorage.setItem(key, today);
      popup.style.display = 'none';
    });

    // 닫기 버튼
    popup.querySelector('.yn-popup-close-btn').addEventListener('click', function () {
      popup.style.display = 'none';
    });
  });
})();
</script>
