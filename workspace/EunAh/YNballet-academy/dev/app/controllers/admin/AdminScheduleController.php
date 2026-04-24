<?php

require_once APP_ROOT . '/app/models/ScheduleModel.php';

class AdminScheduleController extends Controller {
    private const VALID_PER_PAGES  = [20, 50, 100];
    private const DEFAULT_PER_PAGE = 20;

    public function __construct() {
        parent::__construct();
        Auth::requireAdmin();
    }

    public function index(): void {
        $perPage = (int)$this->get('per_page', self::DEFAULT_PER_PAGE);
        if (!in_array($perPage, self::VALID_PER_PAGES, true)) {
            $perPage = self::DEFAULT_PER_PAGE;
        }
        $page        = max(1, (int)$this->get('page', 1));
        $filterYear  = max(2000, min(2100, (int)$this->get('year',  date('Y'))));
        $filterMonth = max(1,    min(12,   (int)$this->get('month', date('n'))));
        $model       = new ScheduleModel();
        $schedules   = $model->adminPaginate($page, $perPage, $filterYear, $filterMonth);
        $total       = $model->countAll($filterYear, $filterMonth);

        $this->render('layouts/admin', [
            'pageTitle'     => '수업 일정 관리',
            'adminActive'   => 'schedule',
            'content'       => 'admin/schedule/list',
            'schedules'     => $schedules,
            'total'         => $total,
            'page'          => $page,
            'perPage'       => $perPage,
            'validPerPages' => self::VALID_PER_PAGES,
            'filterYear'    => $filterYear,
            'filterMonth'   => $filterMonth,
        ]);
    }

    public function create(): void {
        $this->render('layouts/admin', [
            'pageTitle'   => '일정 등록',
            'adminActive' => 'schedule',
            'content'     => 'admin/schedule/form',
            'schedule'    => null,
        ]);
    }

    public function store(): void {
        Auth::csrfVerify();
        $date  = trim($this->post('event_date'));
        $title = trim($this->post('title'));
        $color = trim($this->post('color')) ?: '#2c3d50';

        if ($date === '' || $title === '') {
            $this->render('layouts/admin', [
                'pageTitle'   => '일정 등록',
                'adminActive' => 'schedule',
                'content'     => 'admin/schedule/form',
                'schedule'    => null,
                'error'       => '날짜와 일정명을 입력해 주세요.',
            ]);
            return;
        }

        $isHoliday = $this->post('is_holiday') ? 1 : 0;
        (new ScheduleModel())->create($date, $title, $color, $isHoliday);
        $this->redirect(BASE_PATH . '/admin/schedule');
    }

    public function edit(string $id): void {
        $schedule = (new ScheduleModel())->find((int)$id);
        if (!$schedule) $this->redirect(BASE_PATH . '/admin/schedule');

        $this->render('layouts/admin', [
            'pageTitle'   => '일정 수정',
            'adminActive' => 'schedule',
            'content'     => 'admin/schedule/form',
            'schedule'    => $schedule,
        ]);
    }

    public function update(string $id): void {
        Auth::csrfVerify();
        $date  = trim($this->post('event_date'));
        $title = trim($this->post('title'));
        $color = trim($this->post('color')) ?: '#2c3d50';

        if ($date === '' || $title === '') {
            $schedule = (new ScheduleModel())->find((int)$id);
            $this->render('layouts/admin', [
                'pageTitle'   => '일정 수정',
                'adminActive' => 'schedule',
                'content'     => 'admin/schedule/form',
                'schedule'    => $schedule,
                'error'       => '날짜와 일정명을 입력해 주세요.',
            ]);
            return;
        }

        $isHoliday = $this->post('is_holiday') ? 1 : 0;
        (new ScheduleModel())->update((int)$id, $date, $title, $color, $isHoliday);
        $this->redirect(BASE_PATH . '/admin/schedule');
    }

    public function delete(string $id): void {
        Auth::csrfVerify();
        (new ScheduleModel())->delete((int)$id);
        $this->json(['ok' => true]);
    }

    public function preview(): void {
        $year  = max(2000, min(2100, (int)$this->get('year',  date('Y'))));
        $month = max(1,    min(12,   (int)$this->get('month', date('n'))));

        $rows   = (new ScheduleModel())->getByMonth($year, $month);
        $events = [];
        foreach ($rows as $r) {
            $events[$r['event_date']][] = $r;
        }

        $this->render('layouts/admin', [
            'pageTitle'   => '인스타 카드 추출',
            'adminActive' => 'schedule',
            'content'     => 'admin/schedule/preview',
            'year'        => $year,
            'month'       => $month,
            'events'      => $events,
        ]);
    }
}
