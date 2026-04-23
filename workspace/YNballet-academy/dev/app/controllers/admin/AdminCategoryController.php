<?php

require_once APP_ROOT . '/app/models/CategoryModel.php';

class AdminCategoryController extends Controller {

    public function __construct() {
        parent::__construct();
        Auth::requireAdmin();
    }

    public function index(): void {
        $categories = (new CategoryModel())->all();

        $this->render('layouts/admin', [
            'pageTitle'   => '카테고리 관리',
            'adminActive' => 'category',
            'content'     => 'admin/category/list',
            'categories'  => $categories,
        ]);
    }

    public function create(): void {
        $this->render('layouts/admin', [
            'pageTitle'   => '카테고리 등록',
            'adminActive' => 'category',
            'content'     => 'admin/category/form',
            'category'    => null,
            'error'       => null,
        ]);
    }

    public function store(): void {
        Auth::csrfVerify();
        $name      = trim($this->post('name'));
        $sortOrder = (int)$this->post('sort_order', 0);

        if ($name === '') {
            $this->renderForm(null, '카테고리명을 입력해 주세요.');
            return;
        }
        if ((new CategoryModel())->nameExists($name)) {
            $this->renderForm(null, '이미 존재하는 카테고리명입니다.');
            return;
        }

        (new CategoryModel())->create($name, $sortOrder);
        $this->redirect(BASE_PATH . '/admin/category');
    }

    public function edit(string $id): void {
        $category = (new CategoryModel())->find((int)$id);
        if (!$category) $this->redirect(BASE_PATH . '/admin/category');

        $this->render('layouts/admin', [
            'pageTitle'   => '카테고리 수정',
            'adminActive' => 'category',
            'content'     => 'admin/category/form',
            'category'    => $category,
            'error'       => null,
        ]);
    }

    public function update(string $id): void {
        Auth::csrfVerify();
        $name      = trim($this->post('name'));
        $sortOrder = (int)$this->post('sort_order', 0);
        $model     = new CategoryModel();
        $cat       = $model->find((int)$id);
        if (!$cat) $this->redirect(BASE_PATH . '/admin/category');

        if ($name === '') {
            $this->renderForm($cat, '카테고리명을 입력해 주세요.');
            return;
        }
        if ($model->nameExists($name, (int)$id)) {
            $this->renderForm($cat, '이미 존재하는 카테고리명입니다.');
            return;
        }

        // 이름이 바뀐 경우 course.category 동기 업데이트
        if ($cat['name'] !== $name) {
            $model->syncCoursesCategory($cat['name'], $name);
        }

        $model->update((int)$id, $name, $sortOrder);
        $this->redirect(BASE_PATH . '/admin/category');
    }

    public function delete(string $id): void {
        Auth::csrfVerify();
        $model = new CategoryModel();
        $count = $model->courseCount((int)$id);
        if ($count > 0) {
            $this->json(['ok' => false, 'msg' => "이 카테고리를 사용 중인 과정이 {$count}개 있습니다. 과정의 카테고리를 먼저 변경해 주세요."]);
            return;
        }
        $model->delete((int)$id);
        $this->json(['ok' => true]);
    }

    // ─── 내부 헬퍼 ──────────────────────────────────────────

    private function renderForm(?array $category, string $error): void {
        $isEdit = $category !== null;
        $this->render('layouts/admin', [
            'pageTitle'   => $isEdit ? '카테고리 수정' : '카테고리 등록',
            'adminActive' => 'category',
            'content'     => 'admin/category/form',
            'category'    => $category,
            'error'       => $error,
        ]);
    }
}
