<?php

require_once APP_ROOT . '/app/models/MemberModel.php';
require_once APP_ROOT . '/app/models/ClassGroupModel.php';

class AdminMemberController extends Controller {
    private const VALID_PER_PAGES  = [20, 50, 100];
    private const DEFAULT_PER_PAGE = 20;

    public function __construct() {
        parent::__construct();
        Auth::requireAdmin();
    }

    public function index(): void {
        $perPage = (int)$this->get('per_page', self::DEFAULT_PER_PAGE);
        if (!in_array($perPage, self::VALID_PER_PAGES, true)) $perPage = self::DEFAULT_PER_PAGE;
        $page    = max(1, (int)$this->get('page', 1));
        $search  = trim($this->get('search', ''));
        $classId = $this->get('class_id', '') !== '' ? (int)$this->get('class_id') : null;

        $model   = new MemberModel();
        $items   = $model->paginate($page, $perPage, $search ?: null, $classId);
        $total   = $model->countAll($search ?: null, $classId);

        $this->render('layouts/admin', [
            'pageTitle'     => '회원 관리',
            'adminActive'   => 'member',
            'content'       => 'admin/member/list',
            'items'         => $items,
            'total'         => $total,
            'page'          => $page,
            'perPage'       => $perPage,
            'validPerPages' => self::VALID_PER_PAGES,
            'search'        => $search,
            'classId'       => $classId,
            'classes'       => (new ClassGroupModel())->getAll(),
        ]);
    }

    public function create(): void {
        $this->render('layouts/admin', [
            'pageTitle'   => '회원 등록',
            'adminActive' => 'member',
            'content'     => 'admin/member/form',
            'member'      => null,
            'classes'     => (new ClassGroupModel())->getActive(),
            'error'       => null,
        ]);
    }

    public function store(): void {
        Auth::csrfVerify();
        $data = $this->extractData();
        if ($data['name'] === '') {
            $this->renderForm(null, $data, '이름을 입력해 주세요.');
            return;
        }
        (new MemberModel())->create($data);
        $this->redirect(BASE_PATH . '/admin/member');
    }

    public function edit(string $id): void {
        $member = (new MemberModel())->find((int)$id);
        if (!$member) $this->redirect(BASE_PATH . '/admin/member');
        $this->render('layouts/admin', [
            'pageTitle'   => '회원 수정',
            'adminActive' => 'member',
            'content'     => 'admin/member/form',
            'member'      => $member,
            'classes'     => (new ClassGroupModel())->getActive(),
            'error'       => null,
        ]);
    }

    public function update(string $id): void {
        Auth::csrfVerify();
        $data = $this->extractData();
        if ($data['name'] === '') {
            $member = (new MemberModel())->find((int)$id);
            $this->renderForm($member, $data, '이름을 입력해 주세요.');
            return;
        }
        (new MemberModel())->update((int)$id, $data);
        $this->redirect(BASE_PATH . '/admin/member');
    }

    public function delete(string $id): void {
        Auth::csrfVerify();
        (new MemberModel())->delete((int)$id);
        $this->json(['ok' => true]);
    }

    private function extractData(): array {
        $isActive    = $this->post('is_active') !== '' ? 1 : 0;
        $suspendedAt = $this->post('suspended_at') ?: null;
        if (!$isActive && !$suspendedAt) {
            $suspendedAt = date('Y-m-d');
        }
        if ($isActive) {
            $suspendedAt = null;
        }
        $gender = $this->post('gender');
        return [
            'name'         => trim($this->post('name')),
            'phone'        => trim($this->post('phone')),
            'email'        => trim($this->post('email')),
            'birth_date'   => $this->post('birth_date') ?: null,
            'gender'       => in_array($gender, ['M', 'F'], true) ? $gender : null,
            'class_id'     => $this->post('class_id') !== '' ? (int)$this->post('class_id') : null,
            'joined_at'    => $this->post('joined_at') ?: null,
            'suspended_at' => $suspendedAt,
            'memo'         => trim($this->post('memo')),
            'is_active'    => $isActive,
        ];
    }

    private function renderForm(?array $member, array $data, string $error): void {
        $this->render('layouts/admin', [
            'pageTitle'   => $member ? '회원 수정' : '회원 등록',
            'adminActive' => 'member',
            'content'     => 'admin/member/form',
            'member'      => array_merge($member ?? [], $data),
            'classes'     => (new ClassGroupModel())->getActive(),
            'error'       => $error,
        ]);
    }
}
