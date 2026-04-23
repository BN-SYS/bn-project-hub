<?php

class AdminAuthController extends Controller {
    public function showLogin(): void {
        if (Auth::isAdmin()) {
            $this->redirect(BASE_PATH . '/admin/notice');
        }
        $this->render('admin/auth/login', ['pageTitle' => '관리자 로그인', 'error' => null]);
    }

    public function login(): void {
        Auth::csrfVerify();
        $id   = trim($this->post('admin_id'));
        $pass = $this->post('admin_pass');

        if (Auth::login($id, $pass)) {
            $this->redirect(BASE_PATH . '/admin/notice');
        }

        $this->render('admin/auth/login', [
            'pageTitle' => '관리자 로그인',
            'error'     => '아이디 또는 비밀번호가 올바르지 않습니다.',
        ]);
    }

    public function logout(): void {
        Auth::logout();
        $this->redirect(BASE_PATH . '/admin/login');
    }
}
