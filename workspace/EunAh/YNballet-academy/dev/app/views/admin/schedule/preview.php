<?php
/* SCREEN: 인스타 카드 추출 | PATH: /admin/schedule/preview */

$firstDay    = mktime(0, 0, 0, $month, 1, $year);
$daysInMonth = (int)date('t', $firstDay);
$startDow    = (int)date('w', $firstDay);
$totalCells  = (int)ceil(($startDow + $daysInMonth) / 7) * 7;
$numRows     = $totalCells / 7;

$monthKo   = ['', '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
$dowLabels = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

$prevYear  = $month === 1 ? $year - 1 : $year;
$prevMonth = $month === 1 ? 12 : $month - 1;
$nextYear  = $month === 12 ? $year + 1 : $year;
$nextMonth = $month === 12 ? 1 : $month + 1;

// 기존 540에서 675로 기준 변경
$gridH = 675 - 42 - 52 - 10 - 22 - 4; // 약 545px로 자동 계산됨

// 공휴일 날짜 집합
$holidayDates = [];
foreach ($events as $dateKey => $evList) {
  foreach ($evList as $ev) {
    if (!empty($ev['is_holiday'])) {
      $holidayDates[$dateKey] = true;
    }
  }
}
?>

<style>
  /* 카드 스타일 — html2canvas 캡처 대상 */
  #calendar-card {
    width: 540px;
    height: 675px;
    /* 540에서 675로 수정 */
    min-width: 540px;
    min-height: 675px;
    /* 추가 */
    background: #fffcf1;
    border: 1px solid #d0d0d0;
    padding: 22px 22px 20px;
    box-sizing: border-box;
    font-family: 'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif;
  }

  .cal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 52px;
    border-bottom: 1.5px solid #2c3d50;
    margin-bottom: 10px;
  }

  .cal-logo-area {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .cal-logo-text {
    font-family: 'Noto Serif KR', serif;
    font-size: 13px;
    font-weight: 600;
    color: #2c3d50;
    letter-spacing: .06em;
    line-height: 1.2;
  }

  .cal-logo-sub {
    font-size: 8px;
    letter-spacing: .18em;
    color: #8a9bb0;
    font-weight: 400;
    margin-top: 2px;
  }

  .cal-month-display {
    font-family: 'Noto Serif KR', serif;
    font-size: 30px;
    font-weight: 600;
    color: #2c3d50;
    letter-spacing: .02em;
    line-height: 1;
  }

  .cal-dow-row {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    height: 22px;
    margin-bottom: 4px;
  }

  .cal-dow-cell {
    text-align: center;
    font-size: 8.5px;
    font-weight: 500;
    color: #999;
    letter-spacing: .04em;
    line-height: 22px;
  }

  .cal-dow-cell.sun-label {
    color: #c0392b;
  }

  .cal-dow-cell.sat-label {
    color: #2c7be5;
  }

  .cal-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }

  .cal-cell {
    border-right: 0.5px solid #e4e4e4;
    border-bottom: 0.5px solid #e4e4e4;
    padding: 5px 5px 4px;
    overflow: hidden;
    box-sizing: border-box;
  }

  .cal-cell:nth-child(7n+1) {
    border-left: 0.5px solid #e4e4e4;
  }

  .cal-grid .cal-cell:nth-child(-n+7) {
    border-top: 0.5px solid #e4e4e4;
  }

  .cal-cell-empty {
    background: #fcfaf1;
  }

  .cal-date-num {
    font-size: 13px;
    font-weight: 600;
    color: #333;
    line-height: 1;
    margin-bottom: 3px;
  }

  .cal-date-num.sun-num {
    color: #c0392b;
  }

  .cal-date-num.sat-num {
    color: #2c7be5;
  }

  .cal-event {
    font-size: 10.5px;
    font-weight: 500;
    line-height: 1.3;
    word-break: break-word;
    overflow-wrap: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    line-clamp: 3;
    overflow: hidden;
  }

  /* 추출 버튼 */
  #btn-export {
    background: #2c3d50;
    color: #fff;
    border: none;
    padding: 10px 28px;
    border-radius: 4px;
    font-size: .88rem;
    cursor: pointer;
    letter-spacing: .03em;
    transition: background .15s;
  }

  #btn-export:hover {
    background: #1e2d3d;
  }

  #btn-export:disabled {
    opacity: .5;
    cursor: default;
  }
</style>

<div class="p-4">

  <!-- 헤더 -->
  <div class="d-flex align-items-center gap-3 mb-4">
    <a href="<?= BASE_PATH ?>/admin/schedule" class="text-muted text-decoration-none">수업 일정</a>
    <span class="text-muted">/</span>
    <h1 class="h4 fw-bold mb-0">인스타 카드 추출</h1>
  </div>

  <!-- 월 이동 -->
  <div class="d-flex align-items-center gap-3 mb-4">
    <a href="?year=<?= $prevYear ?>&month=<?= $prevMonth ?>" class="btn btn-outline-secondary btn-sm">&#8249; 이전</a>
    <strong><?= $year ?>년 <?= $monthKo[$month] ?></strong>
    <a href="?year=<?= $nextYear ?>&month=<?= $nextMonth ?>" class="btn btn-outline-secondary btn-sm">다음 &#8250;</a>
  </div>

  <!-- 카드 미리보기 -->
  <div style="overflow-x:auto; margin-bottom:24px;">
    <div id="calendar-card">

      <div class="cal-header">
        <div class="cal-logo-area">
          <div class="cal-logo-text">와이엔발레</div>
          <div class="cal-logo-sub">YN BALLET STUDIO</div>
        </div>
        <img src="<?= BASE_PATH ?>/assets/images/YN.png" alt="와이엔발레 로고" style="height:60px; margin-bottom: 20px; margin-right: 45px; object-fit:contain;">
        <div class="cal-month-display"><?= $monthKo[$month] ?></div>
      </div>

      <div class="cal-dow-row">
        <?php foreach ($dowLabels as $i => $d): ?>
          <div class="cal-dow-cell<?= $i === 0 ? ' sun-label' : ($i === 6 ? ' sat-label' : '') ?>"><?= $d ?></div>
        <?php endforeach; ?>
      </div>

      <div class="cal-grid" style="grid-template-rows: repeat(<?= $numRows ?>, 1fr); height: <?= $gridH ?>px;">
        <?php for ($i = 0; $i < $totalCells; $i++):
          $day = $i - $startDow + 1;
          $isInMonth = $day >= 1 && $day <= $daysInMonth;
          $dow = $i % 7;
          $dateKey = sprintf('%04d-%02d-%02d', $year, $month, $day);
          $cellEvents = $isInMonth ? ($events[$dateKey] ?? []) : [];
          $isHoliday  = isset($holidayDates[$dateKey]);
        ?>
          <div class="cal-cell<?= $isInMonth ? '' : ' cal-cell-empty' ?>">
            <?php if ($isInMonth): ?>
              <div class="cal-date-num<?= ($dow === 0 || $isHoliday) ? ' sun-num' : ($dow === 6 ? ' sat-num' : '') ?>"><?= $day ?></div>
              <?php foreach ($cellEvents as $ev): ?>
                <div class="cal-event" style="color:<?= e($ev['color']) ?>;"><?= e($ev['title']) ?></div>
              <?php endforeach; ?>
            <?php endif; ?>
          </div>
        <?php endfor; ?>
      </div>

    </div><!-- /#calendar-card -->
  </div>

  <!-- 추출 버튼 -->
  <button id="btn-export">↓ 인스타 카드 추출 (1080×1080)</button>
  <p class="text-muted small mt-2">PNG 파일로 자동 다운로드됩니다.</p>

</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" crossorigin="anonymous"></script>
<script>
  (function() {
      const btn = document.getElementById('btn-export');
      const card = document.getElementById('calendar-card');

      btn.addEventListener('click', function() {
          btn.disabled = true;
          btn.textContent = '생성 중…';

          html2canvas(card, {
              scale: 2, 
              useCORS: true,
              allowTaint: false,
              backgroundColor: '#ffffff',
              width: 540, 
              height: 675, 
              scrollX: 0,
              scrollY: 0,
              onclone: function(clonedDoc) {
                  // 캡처 시점에 높이를 확실히 고정
                  clonedDoc.getElementById('calendar-card').style.height = '675px';
              } // 이 부분의 닫는 괄호가 누락되었었습니다.
          }).then(function(canvas) {
              const link = document.createElement('a');
              link.download = 'yn-ballet-<?= $year ?>-<?= sprintf('%02d', $month) ?>.png';
              link.href = canvas.toDataURL('image/png');
              link.click();
          }).catch(function(err) {
              console.error(err);
              alert('이미지 생성 중 오류가 발생했습니다.');
          }).finally(function() {
              btn.disabled = false;
              btn.textContent = '↓ 인스타 카드 추출 (1080×1350)'; // 비율에 맞게 텍스트 수정
          });
      });
  })();
</script>