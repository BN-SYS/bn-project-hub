<?php

require_once APP_ROOT . '/app/models/NoticeModel.php';
require_once APP_ROOT . '/app/models/CourseModel.php';

class HomeController extends Controller {
    public function index(): void {
        $notices = (new NoticeModel())->getActive(3);
        $courses = (new CourseModel())->getActiveFlat();

        $this->render('layouts/main', [
            'pageTitle'  => SITE_NAME,
            'activePage' => 'home',
            'content'    => 'home/index',
            'notices'    => $notices,
            'courses'    => $courses,
        ]);
    }
}
