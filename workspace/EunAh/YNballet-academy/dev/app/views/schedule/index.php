<?php
/* SCREEN: 수업 일정 캘린더 | PATH: /schedule | APIs: none (server-side render) */

$firstDay    = mktime(0, 0, 0, $month, 1, $year);
$daysInMonth = (int)date('t', $firstDay);
$startDow    = (int)date('w', $firstDay); // 0=Sun
$totalCells  = (int)ceil(($startDow + $daysInMonth) / 7) * 7;
$numRows     = $totalCells / 7;

$monthKo   = ['','1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
$dowLabels = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

$prevYear  = $month === 1 ? $year - 1 : $year;
$prevMonth = $month === 1 ? 12 : $month - 1;
$nextYear  = $month === 12 ? $year + 1 : $year;
$nextMonth = $month === 12 ? 1 : $month + 1;

// Card inner dimensions (card = 540×540, padding 22/22/20/22)
$gridH = 540 - 42 - 52 - 10 - 22 - 4; // 410px

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
/* ─── 수업 일정 페이지 ─────────────────────────── */
#schedule-page { padding: 60px 0 80px; }

.sch-page-title {
  font-family: 'Noto Serif KR', serif;
  font-size: 1.6rem;
  font-weight: 600;
  color: #2c3d50;
  letter-spacing: .04em;
}

.sch-nav-btn {
  width: 36px; height: 36px;
  border: 1px solid #ccc;
  background: #fff;
  border-radius: 50%;
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center;
  color: #333;
  text-decoration: none;
  transition: background .15s;
}
.sch-nav-btn:hover { background: #f0f0f0; color: #000; }

.sch-month-label {
  font-family: 'Noto Serif KR', serif;
  font-size: 1.05rem;
  font-weight: 600;
  color: #2c3d50;
  min-width: 90px;
  text-align: center;
}

/* ─── 캘린더 카드 ─────────────────────────────── */
#cal-outer {
  overflow: hidden;
}

#cal-scale-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  transform-origin: top center;
}

#calendar-card {
  width: 540px;
  height: 540px;
  min-width: 540px;
  background: #fffcf1;
  border: 1px solid #d0d0d0;
  padding: 22px 22px 20px;
  box-sizing: border-box;
  font-family: 'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif;
  position: relative;
}

/* 헤더 */
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

/* 요일 헤더 */
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

.cal-dow-cell.sun-label { color: #c0392b; }
.cal-dow-cell.sat-label { color: #2c7be5; }

/* 날짜 그리드 */
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

.cal-cell:nth-child(7n+1) { border-left: 0.5px solid #e4e4e4; }
.cal-grid .cal-cell:nth-child(-n+7) { border-top: 0.5px solid #e4e4e4; }

.cal-cell-empty { background: #fcfaf1; }

.cal-date-num {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  line-height: 1;
  margin-bottom: 3px;
}

.cal-date-num.sun-num { color: #c0392b; }
.cal-date-num.sat-num { color: #2c7be5; }

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

</style>

<section id="schedule-page">
  <div class="container">

    <!-- 제목 -->
    <div class="text-center mb-4">
      <p class="sch-page-title">수업 일정</p>
    </div>

    <!-- 월 이동 -->
    <div class="d-flex align-items-center justify-content-center gap-3 mb-4">
      <a href="<?= BASE_PATH ?>/schedule?year=<?= $prevYear ?>&month=<?= $prevMonth ?>" class="sch-nav-btn">&#8249;</a>
      <span class="sch-month-label"><?= $year ?>년 <?= $monthKo[$month] ?></span>
      <a href="<?= BASE_PATH ?>/schedule?year=<?= $nextYear ?>&month=<?= $nextMonth ?>" class="sch-nav-btn">&#8250;</a>
    </div>

    <!-- 캘린더 카드 -->
    <div id="cal-outer">
      <div id="cal-scale-wrapper">
      <div id="calendar-card">

        <!-- 헤더 -->
        <div class="cal-header">
          <div class="cal-logo-area">
            <div class="cal-logo-text">와이엔발레</div>
            <div class="cal-logo-sub">YN BALLET STUDIO</div>
          </div>
          <img src="<?= BASE_PATH ?>/assets/images/YN.png" alt="와이엔발레 로고" style="height:60px; margin-bottom: 20px; margin-right: 45px; object-fit:contain;">
          <div class="cal-month-display"><?= $monthKo[$month] ?></div>
        </div>

        <!-- 요일 -->
        <div class="cal-dow-row">
          <?php foreach ($dowLabels as $i => $d): ?>
          <div class="cal-dow-cell<?= $i === 0 ? ' sun-label' : ($i === 6 ? ' sat-label' : '') ?>"><?= $d ?></div>
          <?php endforeach; ?>
        </div>

        <!-- 날짜 그리드 -->
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
      </div><!-- /#cal-scale-wrapper -->
    </div><!-- /#cal-outer -->

    <!-- 이달 일정 목록 -->
    <?php
    $monthEvents = [];
    foreach ($events as $evList) {
        foreach ($evList as $ev) {
            $monthEvents[] = $ev;
        }
    }
    usort($monthEvents, fn($a, $b) => strcmp($a['event_date'], $b['event_date']));
    ?>
    <?php if (!empty($monthEvents)): ?>
    <div class="mt-4" style="max-width:540px; margin-left:auto; margin-right:auto;">
      <div style="background:#fff; border:1px solid #e4e4e4; border-radius:8px; overflow:hidden;">
        <div style="padding:14px 20px; border-bottom:1px solid #f0f0f0; background:#fafafa;">
          <span style="font-family:'Noto Serif KR',serif; font-size:.92rem; font-weight:600; color:#2c3d50; letter-spacing:.04em;">
            <?= $monthKo[$month] ?> 일정
          </span>
        </div>
        <ul class="list-unstyled mb-0">
          <?php foreach ($monthEvents as $i => $ev): ?>
          <li class="d-flex align-items-center gap-3" style="padding:11px 20px;<?= $i < count($monthEvents) - 1 ? 'border-bottom:1px solid #f5f5f5;' : '' ?>">
            <span style="font-size:.8rem; color:#999; min-width:86px; flex-shrink:0;">
              <?= date('m. d. (D)', strtotime($ev['event_date'])) ?>
            </span>
            <span style="font-size:.88rem; font-weight:500; color:<?= e($ev['color']) ?>;">
              <?= e($ev['title']) ?>
            </span>
            <?php if (!empty($ev['is_holiday'])): ?>
            <span class="ms-auto" style="font-size:.68rem; background:#fee2e2; color:#c0392b; padding:2px 8px; border-radius:20px; flex-shrink:0; font-weight:500;">공휴일</span>
            <?php endif; ?>
          </li>
          <?php endforeach; ?>
        </ul>
      </div>
    </div>
    <?php endif; ?>

  </div>
</section>

<script>
(function () {
  const outer   = document.getElementById('cal-outer');
  const wrapper = document.getElementById('cal-scale-wrapper');

  function resize() {
    const w     = outer.clientWidth;
    const scale = Math.min(1, w / 540);
    wrapper.style.width     = w + 'px';
    wrapper.style.height    = '540px';
    wrapper.style.transform = 'scale(' + scale + ')';
    outer.style.height      = (540 * scale) + 'px';
  }

  resize();
  window.addEventListener('resize', resize);
})();
</script>
