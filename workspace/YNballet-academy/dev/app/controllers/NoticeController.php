<?php

require_once APP_ROOT . '/app/models/NoticeModel.php';

class NoticeController extends Controller {
    private const PER_PAGE = 6; // 3열 × 2행

    public function index(): void {
        $page    = max(1, (int)$this->get('page', 1));
        $model   = new NoticeModel();
        $notices = $model->paginate($page, self::PER_PAGE);
        $total   = $model->countActive();

        $this->render('layouts/main', [
            'pageTitle'  => '공지사항 — ' . SITE_NAME,
            'activePage' => 'notice',
            'content'    => 'notice/list',
            'notices'    => $notices,
            'total'      => $total,
            'page'       => $page,
            'perPage'    => self::PER_PAGE,
        ]);
    }

    public function show(string $id): void {
        $notice = (new NoticeModel())->find((int)$id);
        if (!$notice) {
            http_response_code(404);
            exit('공지사항을 찾을 수 없습니다.');
        }

        $this->render('layouts/main', [
            'pageTitle'  => e($notice['title']) . ' — ' . SITE_NAME,
            'activePage' => 'notice',
            'content'    => 'notice/view',
            'notice'     => $notice,
        ]);
    }
}
