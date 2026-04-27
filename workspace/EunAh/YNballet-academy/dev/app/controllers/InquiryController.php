<?php

require_once APP_ROOT . '/app/models/InquiryModel.php';
require_once APP_ROOT . '/app/models/CourseModel.php';

class InquiryController extends Controller {
    private const PER_PAGE = 10;

    public function index(): void {
        $page    = max(1, (int)$this->get('page', 1));
        $model   = new InquiryModel();
        $items   = $model->paginate($page, self::PER_PAGE);
        $total   = $model->countAll();

        $this->render('layouts/main', [
            'pageTitle'  => '문의 목록 — ' . SITE_NAME,
            'activePage' => 'inquiry',
            'content'    => 'inquiry/list',
            'items'      => $items,
            'total'      => $total,
            'page'       => $page,
            'perPage'    => self::PER_PAGE,
        ]);
    }

    public function create(): void {
        $courses   = (new CourseModel())->getActiveList();
        $preselect = $this->get('course');
        $authUser  = Auth::getUser();

        $this->render('layouts/main', [
            'pageTitle'  => '수강 문의 — ' . SITE_NAME,
            'activePage' => 'inquiry',
            'content'    => 'inquiry/write',
            'courses'    => $courses,
            'preselect'  => $preselect,
            'errors'     => [],
            'old'        => [],
            'authUser'   => $authUser,
        ]);
    }

    public function store(): void {
        Auth::csrfVerify();

        $authUser = Auth::getUser();
        $course   = trim($this->post('course_interest'));
        $content  = trim($this->post('content'));

        // 로그인 회원: 이름·연락처·비밀번호 세션에서 자동 처리
        if ($authUser) {
            $name     = $authUser['name'];
            $contact  = $authUser['phone'];
            $password = bin2hex(random_bytes(8));
            $userId   = $authUser['id'];
        } else {
            $name      = trim($this->post('name'));
            $contact   = trim($this->post('contact'));
            $password  = $this->post('password');
            $pwConfirm = $this->post('password_confirm');
            $userId    = null;
        }

        $errors = [];
        $clen = mb_strlen($name, 'UTF-8');
        if ($clen < 2 || $clen > 20) $errors[] = '이름은 2~20자로 입력해 주세요.';
        if (!validContact($contact))  $errors[] = '연락처는 숫자와 하이픈으로 10~13자 입력해 주세요.';
        $ilen = mb_strlen($content, 'UTF-8');
        if ($ilen < 10 || $ilen > 1000) $errors[] = '문의 내용은 10~1000자로 입력해 주세요.';

        if (!$authUser) {
            $plen = strlen($password);
            if ($plen < 4 || $plen > 20) $errors[] = '비밀번호는 4~20자로 입력해 주세요.';
            if ($password !== $pwConfirm) $errors[] = '비밀번호가 일치하지 않습니다.';
        }

        if ($errors) {
            $courses = (new CourseModel())->getActiveList();
            $this->render('layouts/main', [
                'pageTitle'  => '수강 문의 — ' . SITE_NAME,
                'activePage' => 'inquiry',
                'content'    => 'inquiry/write',
                'courses'    => $courses,
                'preselect'  => $course,
                'errors'     => $errors,
                'old'        => $_POST,
                'authUser'   => $authUser,
            ]);
            return;
        }

        (new InquiryModel())->create([
            'user_id'         => $userId,
            'name'            => $name,
            'contact'         => $contact,
            'password'        => $password,
            'course_interest' => $course,
            'content'         => $content,
        ]);

        $this->redirect(BASE_PATH . '/inquiry/write?success=1');
    }

    public function show(string $id): void {
        $sid     = (int)$id;
        $inquiry = (new InquiryModel())->find($sid);
        if (!$inquiry) {
            http_response_code(404);
            exit('문의를 찾을 수 없습니다.');
        }

        $authUser = Auth::getUser();
        // 로그인 회원이 본인 문의 조회 시 비밀번호 확인 생략
        $isOwner = $authUser && !empty($inquiry['user_id']) && (int)$inquiry['user_id'] === $authUser['id'];
        if (!$isOwner && empty($_SESSION['inquiry_auth'][$sid])) {
            $this->redirect(BASE_PATH . '/inquiry/check?id=' . $sid);
        }

        $this->render('layouts/main', [
            'pageTitle'  => '문의 상세 — ' . SITE_NAME,
            'activePage' => 'inquiry',
            'content'    => 'inquiry/view',
            'inquiry'    => $inquiry,
        ]);
    }

    public function showCheck(): void {
        $id = (int)$this->get('id', 0);
        if (!$id) $this->redirect(BASE_PATH . '/inquiry');

        $this->render('layouts/main', [
            'pageTitle'  => '비밀번호 확인 — ' . SITE_NAME,
            'activePage' => 'inquiry',
            'content'    => 'inquiry/check_password',
            'id'         => $id,
            'error'      => null,
        ]);
    }

    public function checkPassword(): void {
        $id       = (int)$this->post('id');
        $password = $this->post('password');

        if ((new InquiryModel())->verifyPassword($id, $password)) {
            $_SESSION['inquiry_auth'][$id] = true;
            $this->redirect(BASE_PATH . '/inquiry/' . $id);
        }

        $this->render('layouts/main', [
            'pageTitle'  => '비밀번호 확인 — ' . SITE_NAME,
            'activePage' => 'inquiry',
            'content'    => 'inquiry/check_password',
            'id'         => $id,
            'error'      => '비밀번호가 일치하지 않습니다.',
        ]);
    }
}
