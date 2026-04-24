<?php

class AdminSettingsController extends Controller {

    public function showProfile(): void {
        Auth::requireAdmin();
        Auth::startSession();
        $flash = $_SESSION['flash'] ?? null;
        unset($_SESSION['flash']);

        $this->render('layouts/admin', [
            'pageTitle'   => '계정 설정',
            'adminActive' => 'settings',
            'content'     => 'admin/settings/profile',
            'profile'     => Auth::getProfile(),
            'flash'       => $flash,
        ]);
    }

    public function updateProfile(): void {
        Auth::requireAdmin();
        Auth::csrfVerify();
        Auth::startSession();

        $profile = Auth::getProfile();
        $current = $this->post('current_pass');

        if (!password_verify($current, $profile['pass_hash'])) {
            $_SESSION['flash'] = ['type' => 'danger', 'msg' => '현재 비밀번호가 올바르지 않습니다.'];
            $this->redirect(BASE_PATH . '/admin/settings/profile');
        }

        $name    = trim($this->post('name'));
        $contact = trim($this->post('contact'));
        $newId   = trim($this->post('admin_id'));
        $newPass = $this->post('new_pass');
        $confirm = $this->post('confirm_pass');

        if ($name)  $profile['name']    = $name;
        $profile['contact'] = $contact;
        if ($newId) $profile['id']      = $newId;

        if ($newPass !== '') {
            if (strlen($newPass) < 6) {
                $_SESSION['flash'] = ['type' => 'danger', 'msg' => '새 비밀번호는 6자 이상이어야 합니다.'];
                $this->redirect(BASE_PATH . '/admin/settings/profile');
            }
            if ($newPass !== $confirm) {
                $_SESSION['flash'] = ['type' => 'danger', 'msg' => '새 비밀번호가 일치하지 않습니다.'];
                $this->redirect(BASE_PATH . '/admin/settings/profile');
            }
            $profile['pass_hash'] = password_hash($newPass, PASSWORD_BCRYPT);
        }

        Auth::saveProfile($profile);
        $_SESSION['flash'] = ['type' => 'success', 'msg' => '계정 정보가 저장되었습니다.'];
        $this->redirect(BASE_PATH . '/admin/settings/profile');
    }
}
