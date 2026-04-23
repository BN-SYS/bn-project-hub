<?php

require_once APP_ROOT . '/app/models/CourseModel.php';

class CourseController extends Controller {
    public function index(): void {
        $grouped = (new CourseModel())->getActiveGrouped();

        $this->render('layouts/main', [
            'pageTitle'  => '과정소개 — ' . SITE_NAME,
            'activePage' => 'course',
            'content'    => 'course/index',
            'grouped'    => $grouped,
        ]);
    }
}
