<?php

require_once APP_ROOT . '/app/models/ClassGroupModel.php';

class AdminClassGroupController extends Controller {

    public function __construct() {
        parent::__construct();
        Auth::requireAdmin();
    }

    public function index(): void {
        $this->render('layouts/admin', [
            'pageTitle'   => '클래스 관리',
            'adminActive' => 'class_group',
            'content'     => 'admin/class_group/list',
            'classes'     => (new ClassGroupModel())->getAll(),
        ]);
    }

    public function create(): void {
        $this->render('layouts/admin', [
            'pageTitle'   => '클래스 등록',
            'adminActive' => 'class_group',
            'content'     => 'admin/class_group/form',
            'cls'         => null,
            'error'       => null,
        ]);
    }

    public function store(): void {
        Auth::csrfVerify();
        $data = $this->extractData();
        if ($data['name'] === '') {
            $this->renderForm(null, $data, '클래스명을 입력해 주세요.');
            return;
        }
        (new ClassGroupModel())->create($data);
        $this->redirect(BASE_PATH . '/admin/class-group');
    }

    public function edit(string $id): void {
        $cls = (new ClassGroupModel())->find((int)$id);
        if (!$cls) $this->redirect(BASE_PATH . '/admin/class-group');
        $this->render('layouts/admin', [
            'pageTitle'   => '클래스 수정',
            'adminActive' => 'class_group',
            'content'     => 'admin/class_group/form',
            'cls'         => $cls,
            'error'       => null,
        ]);
    }

    public function update(string $id): void {
        Auth::csrfVerify();
        $data = $this->extractData();
        if ($data['name'] === '') {
            $cls = (new ClassGroupModel())->find((int)$id);
            $this->renderForm($cls, $data, '클래스명을 입력해 주세요.');
            return;
        }
        (new ClassGroupModel())->update((int)$id, $data);
        $this->redirect(BASE_PATH . '/admin/class-group');
    }

    public function delete(string $id): void {
        Auth::csrfVerify();
        (new ClassGroupModel())->delete((int)$id);
        $this->json(['ok' => true]);
    }

    private function extractData(): array {
        return [
            'name'        => trim($this->post('name')),
            'fee'         => (int)str_replace(',', '', $this->post('fee', '0')),
            'description' => trim($this->post('description')),
            'is_active'   => $this->post('is_active') !== '' ? 1 : 0,
        ];
    }

    private function renderForm(?array $cls, array $data, string $error): void {
        $this->render('layouts/admin', [
            'pageTitle'   => $cls ? '클래스 수정' : '클래스 등록',
            'adminActive' => 'class_group',
            'content'     => 'admin/class_group/form',
            'cls'         => array_merge($cls ?? [], $data),
            'error'       => $error,
        ]);
    }
}
