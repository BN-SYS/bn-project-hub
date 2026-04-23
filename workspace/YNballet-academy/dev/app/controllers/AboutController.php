<?php

class AboutController extends Controller {
    public function index(): void {
        $this->render('layouts/main', [
            'pageTitle'  => '아카데미 소개 — ' . SITE_NAME,
            'activePage' => 'about',
            'content'    => 'about/index',
        ]);
    }
}
