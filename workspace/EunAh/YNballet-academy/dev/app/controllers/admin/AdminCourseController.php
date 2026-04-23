<?php

require_once APP_ROOT . '/app/models/CourseModel.php';
require_once APP_ROOT . '/app/models/CategoryModel.php';

class AdminCourseController extends Controller {
    public function __construct() {
        parent::__construct();
        Auth::requireAdmin();
    }

    private const VALID_PER_PAGES  = [10, 30, 50];
    private const DEFAULT_PER_PAGE = 10;

    public function index(): void {
        $perPage = (int)$this->get('per_page', self::DEFAULT_PER_PAGE);
        if (!in_array($perPage, self::VALID_PER_PAGES, true)) {
            $perPage = self::DEFAULT_PER_PAGE;
        }
        $page    = max(1, (int)$this->get('page', 1));
        $model   = new CourseModel();
        $courses = $model->adminPaginate($page, $perPage);
        $total   = $model->countAll();

        $this->render('layouts/admin', [
            'pageTitle'     => '과정 관리',
            'adminActive'   => 'course',
            'content'       => 'admin/course/list',
            'courses'       => $courses,
            'total'         => $total,
            'page'          => $page,
            'perPage'       => $perPage,
            'validPerPages' => self::VALID_PER_PAGES,
        ]);
    }

    public function create(): void {
        $this->render('layouts/admin', [
            'pageTitle'   => '과정 등록',
            'adminActive' => 'course',
            'content'     => 'admin/course/form',
            'course'      => null,
            'categories'  => (new CategoryModel())->list(),
        ]);
    }

    public function store(): void {
        Auth::csrfVerify();
        $data = $this->collectFormData();

        if ($data['title'] === '') {
            $this->render('layouts/admin', [
                'pageTitle'   => '과정 등록',
                'adminActive' => 'course',
                'content'     => 'admin/course/form',
                'course'      => null,
                'categories'  => (new CategoryModel())->list(),
                'error'       => '과정명을 입력해 주세요.',
            ]);
            return;
        }

        (new CourseModel())->create($data);
        $this->redirect(BASE_PATH . '/admin/course');
    }

    public function edit(string $id): void {
        $course = (new CourseModel())->find((int)$id);
        if (!$course) $this->redirect(BASE_PATH . '/admin/course');

        $this->render('layouts/admin', [
            'pageTitle'   => '과정 수정',
            'adminActive' => 'course',
            'content'     => 'admin/course/form',
            'course'      => $course,
            'categories'  => (new CategoryModel())->list(),
        ]);
    }

    public function update(string $id): void {
        Auth::csrfVerify();
        $data = $this->collectFormData();
        $course = (new CourseModel())->find((int)$id);
        if (!$course) $this->redirect(BASE_PATH . '/admin/course');

        if ($data['title'] === '') {
            $this->render('layouts/admin', [
                'pageTitle'   => '과정 수정',
                'adminActive' => 'course',
                'content'     => 'admin/course/form',
                'course'      => array_merge($course, $data),
                'categories'  => (new CategoryModel())->list(),
                'error'       => '과정명을 입력해 주세요.',
            ]);
            return;
        }

        (new CourseModel())->update((int)$id, $data);
        $this->redirect(BASE_PATH . '/admin/course');
    }

    public function toggle(string $id): void {
        Auth::csrfVerify();
        $isActive = (int)$this->post('is_active');
        (new CourseModel())->toggle((int)$id, $isActive ? 0 : 1);
        $this->json(['ok' => true]);
    }

    public function sort(): void {
        $courses = (new CourseModel())->adminAll();

        $this->render('layouts/admin', [
            'pageTitle'   => '과정 순서 정렬',
            'adminActive' => 'course',
            'content'     => 'admin/course/sort',
            'courses'     => $courses,
        ]);
    }

    public function updateSort(): void {
        Auth::csrfVerify();
        $ids = $_POST['ids'] ?? [];
        if (is_array($ids)) {
            (new CourseModel())->updateSort($ids);
        }
        $this->json(['ok' => true]);
    }

    private function collectFormData(): array {
        return [
            'title'       => trim($this->post('title')),
            'category'    => trim($this->post('category')),
            'level_badge' => trim($this->post('level_badge')),
            'target'      => trim($this->post('target')),
            'description' => trim($this->post('description')),
            'fee'         => trim($this->post('fee')),
            'sort_order'  => (int)$this->post('sort_order', 0),
        ];
    }
}
