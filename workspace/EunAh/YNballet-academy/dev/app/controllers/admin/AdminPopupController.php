<?php

require_once APP_ROOT . '/app/models/PopupModel.php';

class AdminPopupController extends Controller {

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
        $model = new PopupModel();

        $this->render('layouts/admin', [
            'pageTitle'     => '팝업 관리',
            'adminActive'   => 'popup',
            'content'       => 'admin/popup/list',
            'popups'        => $model->adminPaginate($page, $perPage),
            'total'         => $model->countAll(),
            'page'          => $page,
            'perPage'       => $perPage,
            'validPerPages' => self::VALID_PER_PAGES,
        ]);
    }

    public function create(): void {
        $this->render('layouts/admin', [
            'pageTitle'   => '팝업 등록',
            'adminActive' => 'popup',
            'content'     => 'admin/popup/form',
            'popup'       => null,
            'error'       => null,
        ]);
    }

    public function store(): void {
        Auth::csrfVerify();
        $data = $this->collectFormData();

        if ($data['title'] === '' || $data['content'] === '') {
            $this->renderForm(null, $data, '제목과 팝업 내용을 입력해 주세요.');
            return;
        }
        if ($data['display_start'] > $data['display_end']) {
            $this->renderForm(null, $data, '종료일은 시작일 이후여야 합니다.');
            return;
        }

        (new PopupModel())->create($data);
        $this->redirect(BASE_PATH . '/admin/popup');
    }

    public function edit(string $id): void {
        $popup = (new PopupModel())->find((int)$id);
        if (!$popup) $this->redirect(BASE_PATH . '/admin/popup');

        $this->render('layouts/admin', [
            'pageTitle'   => '팝업 수정',
            'adminActive' => 'popup',
            'content'     => 'admin/popup/form',
            'popup'       => $popup,
            'error'       => null,
        ]);
    }

    public function update(string $id): void {
        Auth::csrfVerify();
        $data  = $this->collectFormData();
        $popup = (new PopupModel())->find((int)$id);
        if (!$popup) $this->redirect(BASE_PATH . '/admin/popup');

        if ($data['title'] === '' || $data['content'] === '') {
            $this->renderForm($popup, $data, '제목과 팝업 내용을 입력해 주세요.');
            return;
        }
        if ($data['display_start'] > $data['display_end']) {
            $this->renderForm($popup, $data, '종료일은 시작일 이후여야 합니다.');
            return;
        }

        (new PopupModel())->update((int)$id, $data);
        $this->redirect(BASE_PATH . '/admin/popup');
    }

    public function toggle(string $id): void {
        Auth::csrfVerify();
        $isActive = (int)$this->post('is_active');
        (new PopupModel())->toggle((int)$id, $isActive ? 0 : 1);
        $this->json(['ok' => true]);
    }

    public function delete(string $id): void {
        Auth::csrfVerify();
        (new PopupModel())->delete((int)$id);
        $this->json(['ok' => true]);
    }

    // ─── 내부 헬퍼 ──────────────────────────────────────────

    private function collectFormData(): array {
        return [
            'title'         => trim($this->post('title')),
            'content'       => $this->post('content'),
            'display_start' => $this->post('display_start') ?: date('Y-m-d'),
            'display_end'   => $this->post('display_end')   ?: date('Y-m-d'),
            'pos_top'       => max(0, (int)$this->post('pos_top', 100)),
            'pos_left'      => max(0, (int)$this->post('pos_left', 100)),
            'width'         => max(200, (int)$this->post('width', 400)),
            'height'        => max(100, (int)$this->post('height', 300)),
            'is_active'     => $this->post('is_active') ? 1 : 0,
            'sort_order'    => (int)$this->post('sort_order', 0),
        ];
    }

    private function renderForm(?array $popup, array $data, string $error): void {
        // 기존 팝업 정보 위에 입력값 덮어쓰기
        $merged = $popup ? array_merge($popup, $data) : $data;
        $this->render('layouts/admin', [
            'pageTitle'   => $popup ? '팝업 수정' : '팝업 등록',
            'adminActive' => 'popup',
            'content'     => 'admin/popup/form',
            'popup'       => $merged ?: null,
            'error'       => $error,
        ]);
    }
}
