<?php

require_once APP_ROOT . '/app/models/InquiryModel.php';

class AdminInquiryController extends Controller {
    private const VALID_PER_PAGES  = [10, 30, 50];
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
        $page  = max(1, (int)$this->get('page', 1));
        $model = new InquiryModel();
        $items = $model->paginate($page, $perPage);
        $total = $model->countAll();

        $this->render('layouts/admin', [
            'pageTitle'     => '문의 목록',
            'adminActive'   => 'inquiry',
            'content'       => 'admin/inquiry/list',
            'items'         => $items,
            'total'         => $total,
            'page'          => $page,
            'perPage'       => $perPage,
            'validPerPages' => self::VALID_PER_PAGES,
        ]);
    }

    public function show(string $id): void {
        $inquiry = (new InquiryModel())->find((int)$id);
        if (!$inquiry) $this->redirect(BASE_PATH . '/admin/inquiry');

        $this->render('layouts/admin', [
            'pageTitle'   => '문의 상세',
            'adminActive' => 'inquiry',
            'content'     => 'admin/inquiry/view',
            'inquiry'     => $inquiry,
        ]);
    }

    public function updateStatus(string $id): void {
        Auth::csrfVerify();
        $status = (int)$this->post('status');
        (new InquiryModel())->updateStatus((int)$id, $status);
        $this->json(['ok' => true]);
    }

    public function saveMemo(string $id): void {
        Auth::csrfVerify();
        $memo = trim($this->post('admin_memo') ?? '');
        (new InquiryModel())->updateMemo((int)$id, $memo);
        $this->json(['ok' => true]);
    }

    public function saveAnswer(string $id): void {
        Auth::csrfVerify();
        $answer = trim($this->post('answer') ?? '');
        if ($answer === '') {
            $this->json(['ok' => false, 'msg' => '답변 내용을 입력해 주세요.']);
            return;
        }
        (new InquiryModel())->updateAnswer((int)$id, $answer);
        $this->json(['ok' => true]);
    }
}
