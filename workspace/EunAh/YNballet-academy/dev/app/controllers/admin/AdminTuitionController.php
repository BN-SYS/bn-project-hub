<?php

require_once APP_ROOT . '/app/models/TuitionModel.php';
require_once APP_ROOT . '/app/models/MemberModel.php';
require_once APP_ROOT . '/app/models/ClassGroupModel.php';

class AdminTuitionController extends Controller {

    public function __construct() {
        parent::__construct();
        Auth::requireAdmin();
    }

    public function index(): void {
        $year  = (int)$this->get('year',  date('Y'));
        $month = (int)$this->get('month', date('n'));
        if ($month < 1 || $month > 12) $month = (int)date('n');

        $model   = new TuitionModel();
        $items   = $model->getByMonth($year, $month);
        $summary = $model->getSummary($year, $month);

        $this->render('layouts/admin', [
            'pageTitle'   => '원비 관리',
            'adminActive' => 'tuition',
            'content'     => 'admin/tuition/list',
            'items'       => $items,
            'summary'     => $summary,
            'year'        => $year,
            'month'       => $month,
        ]);
    }

    public function generate(): void {
        Auth::csrfVerify();
        $year    = (int)$this->post('year');
        $month   = (int)$this->post('month');
        $created = (new TuitionModel())->generateForMonth($year, $month);
        $this->json(['ok' => true, 'created' => $created]);
    }

    public function markPaid(string $id): void {
        Auth::csrfVerify();
        $paidAt = $this->post('paid_at') ?: date('Y-m-d');
        (new TuitionModel())->markPaid((int)$id, $paidAt);
        $this->json(['ok' => true]);
    }

    public function edit(string $id): void {
        $tuition = (new TuitionModel())->find((int)$id);
        if (!$tuition) $this->redirect(BASE_PATH . '/admin/tuition');
        $this->render('layouts/admin', [
            'pageTitle'   => '원비 수정',
            'adminActive' => 'tuition',
            'content'     => 'admin/tuition/form',
            'tuition'     => $tuition,
            'error'       => null,
        ]);
    }

    public function update(string $id): void {
        Auth::csrfVerify();
        $actualFee = (int)str_replace(',', '', $this->post('actual_fee', '0'));
        $status    = (int)$this->post('status');
        $paidAt    = $this->post('paid_at') ?: null;
        $memo      = trim($this->post('memo'));
        if (!in_array($status, [0, 1, 2], true)) $status = 0;

        $model = new TuitionModel();
        $model->update((int)$id, $actualFee, $status, $paidAt, $memo);

        $tuition = $model->find((int)$id);
        $this->redirect(BASE_PATH . '/admin/tuition?year=' . $tuition['year'] . '&month=' . $tuition['month']);
    }

    public function stats(): void {
        $year    = (int)$this->get('year', date('Y'));
        $model   = new TuitionModel();
        $monthly = $model->getMonthlyStats($year);
        $summary = $model->getSummary($year, (int)date('n'));

        $this->render('layouts/admin', [
            'pageTitle'   => '매출 통계',
            'adminActive' => 'tuition_stats',
            'content'     => 'admin/tuition/stats',
            'monthly'     => $monthly,
            'summary'     => $summary,
            'year'        => $year,
        ]);
    }
}
