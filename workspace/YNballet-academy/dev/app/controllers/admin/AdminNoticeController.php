<?php

require_once APP_ROOT . '/app/models/NoticeModel.php';

class AdminNoticeController extends Controller {
    private const VALID_PER_PAGES = [10, 30, 50];
    private const DEFAULT_PER_PAGE = 10;

    public function __construct() {
        parent::__construct();
        Auth::requireAdmin();
    }

    public function index(): void {
        $perPage = (int)$this->get('per_page', self::DEFAULT_PER_PAGE);
        if (!in_array($perPage, self::VALID_PER_PAGES, true)) {
            $perPage = self::DEFAULT_PER_PAGE;
        }
        $page    = max(1, (int)$this->get('page', 1));
        $model   = new NoticeModel();
        $notices = $model->adminPaginate($page, $perPage);
        $total   = $model->countAll();

        $this->render('layouts/admin', [
            'pageTitle'      => '공지사항 관리',
            'adminActive'    => 'notice',
            'content'        => 'admin/notice/list',
            'notices'        => $notices,
            'total'          => $total,
            'page'           => $page,
            'perPage'        => $perPage,
            'validPerPages'  => self::VALID_PER_PAGES,
        ]);
    }

    public function create(): void {
        $this->render('layouts/admin', [
            'pageTitle'   => '공지 작성',
            'adminActive' => 'notice',
            'content'     => 'admin/notice/form',
            'notice'      => null,
        ]);
    }

    public function store(): void {
        Auth::csrfVerify();
        $title   = trim($this->post('title'));
        $content = $this->post('content');

        if ($title === '' || $content === '') {
            $this->render('layouts/admin', [
                'pageTitle'   => '공지 작성',
                'adminActive' => 'notice',
                'content'     => 'admin/notice/form',
                'notice'      => null,
                'error'       => '제목과 내용을 입력해 주세요.',
            ]);
            return;
        }

        $isPinned = $this->post('is_pinned') ? 1 : 0;
        (new NoticeModel())->create($title, $content, $isPinned);
        $this->redirect(BASE_PATH . '/admin/notice');
    }

    public function edit(string $id): void {
        $notice = (new NoticeModel())->findAdmin((int)$id);
        if (!$notice) $this->redirect(BASE_PATH . '/admin/notice');

        $this->render('layouts/admin', [
            'pageTitle'   => '공지 수정',
            'adminActive' => 'notice',
            'content'     => 'admin/notice/form',
            'notice'      => $notice,
        ]);
    }

    public function update(string $id): void {
        Auth::csrfVerify();
        $title   = trim($this->post('title'));
        $content = $this->post('content');

        if ($title === '' || $content === '') {
            $notice = (new NoticeModel())->findAdmin((int)$id);
            $this->render('layouts/admin', [
                'pageTitle'   => '공지 수정',
                'adminActive' => 'notice',
                'content'     => 'admin/notice/form',
                'notice'      => $notice,
                'error'       => '제목과 내용을 입력해 주세요.',
            ]);
            return;
        }

        $isPinned = $this->post('is_pinned') ? 1 : 0;
        (new NoticeModel())->update((int)$id, $title, $content, $isPinned);
        $this->redirect(BASE_PATH . '/admin/notice');
    }

    public function toggle(string $id): void {
        Auth::csrfVerify();
        $isActive = (int)$this->post('is_active');
        (new NoticeModel())->toggle((int)$id, $isActive ? 0 : 1);
        $this->json(['ok' => true]);
    }
}
