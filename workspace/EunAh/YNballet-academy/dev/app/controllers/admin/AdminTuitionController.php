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

    public function delete(string $id): void {
        Auth::csrfVerify();
        $model   = new TuitionModel();
        $tuition = $model->find((int)$id);
        if (!$tuition) { $this->json(['ok' => false]); return; }
        $model->delete((int)$id);
        $this->json(['ok' => true]);
    }

    public function export(): void {
        $year  = (int)$this->get('year',  date('Y'));
        $month = (int)$this->get('month', date('n'));
        if ($month < 1 || $month > 12) $month = (int)date('n');

        $items = (new TuitionModel())->getByMonth($year, $month);

        $statusLabels = [0 => '미납', 1 => '납부완료', 2 => '유예'];
        $filename = "원비_{$year}년{$month}월_" . date('Ymd') . '.csv';

        header('Content-Type: text/csv; charset=UTF-8');
        header('Content-Disposition: attachment; filename="' . rawurlencode($filename) . '"');
        header('Cache-Control: no-cache');

        $out = fopen('php://output', 'w');
        fputs($out, "\xEF\xBB\xBF");

        fputcsv($out, ['회원명', '클래스', '기본 원비', '실납부금액', '상태', '납부일', '메모']);

        foreach ($items as $t) {
            fputcsv($out, [
                $t['member_name'],
                $t['class_name'] ?? '',
                number_format((int)$t['base_fee']),
                number_format((int)$t['actual_fee']),
                $statusLabels[(int)$t['status']] ?? '',
                $t['paid_at'] ?? '',
                $t['memo'] ?? '',
            ]);
        }

        fclose($out);
        exit;
    }

    public function exportStats(): void {
        $year    = (int)$this->get('year', date('Y'));
        $monthly = (new TuitionModel())->getMonthlyStats($year);

        $filename = "매출통계_{$year}년_" . date('Ymd') . '.csv';
        header('Content-Type: text/csv; charset=UTF-8');
        header('Content-Disposition: attachment; filename="' . rawurlencode($filename) . '"');
        header('Cache-Control: no-cache');

        $out = fopen('php://output', 'w');
        fputs($out, "\xEF\xBB\xBF");

        fputcsv($out, ['월', '전체 인원', '납부', '미납', '유예', '예상 매출', '실 매출', '달성률(%)']);

        $monthNames = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
        $byMonth = [];
        foreach ($monthly as $row) $byMonth[(int)$row['month']] = $row;

        for ($m = 1; $m <= 12; $m++) {
            $row = $byMonth[$m] ?? null;
            if ($row) {
                $rate = $row['expected_revenue'] > 0
                    ? round($row['actual_revenue'] / $row['expected_revenue'] * 100)
                    : 0;
                fputcsv($out, [
                    $monthNames[$m - 1],
                    (int)$row['total_count'],
                    (int)$row['paid_count'],
                    (int)$row['unpaid_count'],
                    (int)$row['deferred_count'],
                    number_format((int)$row['expected_revenue']),
                    number_format((int)$row['actual_revenue']),
                    $rate,
                ]);
            } else {
                fputcsv($out, [$monthNames[$m - 1], 0, 0, 0, 0, 0, 0, 0]);
            }
        }

        fclose($out);
        exit;
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
