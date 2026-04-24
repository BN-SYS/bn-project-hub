<?php

require_once APP_ROOT . '/app/models/ScheduleModel.php';

class ScheduleController extends Controller {

    public function index(): void {
        $year  = max(2000, min(2100, (int)$this->get('year',  date('Y'))));
        $month = max(1,    min(12,   (int)$this->get('month', date('n'))));

        $rows   = (new ScheduleModel())->getByMonth($year, $month);
        $events = [];
        foreach ($rows as $r) {
            $events[$r['event_date']][] = $r;
        }

        $this->render('layouts/main', [
            'pageTitle'  => '수업 일정',
            'activePage' => 'schedule',
            'content'    => 'schedule/index',
            'year'       => $year,
            'month'      => $month,
            'events'     => $events,
        ]);
    }
}
