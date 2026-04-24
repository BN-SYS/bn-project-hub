<?php

require_once APP_ROOT . '/app/models/NoticeModel.php';
require_once APP_ROOT . '/app/models/CourseModel.php';
require_once APP_ROOT . '/app/models/BannerModel.php';

class HomeController extends Controller {
    public function index(): void {
        $notices = (new NoticeModel())->getActive(3);
        $courses = (new CourseModel())->getActiveFlat();
        $banners = (new BannerModel())->getActive();

        $this->render('layouts/main', [
            'pageTitle'  => SITE_NAME,
            'activePage' => 'home',
            'content'    => 'home/index',
            'notices'    => $notices,
            'courses'    => $courses,
            'banners'    => $banners,
        ]);
    }
}
