<?php

require_once APP_ROOT . '/app/models/BannerModel.php';

class AdminBannerController extends Controller {

    public function __construct() {
        parent::__construct();
        Auth::requireAdmin();
    }

    public function index(): void {
        $banners = (new BannerModel())->getAll();
        $this->render('layouts/admin', [
            'pageTitle'   => '배너 관리',
            'adminActive' => 'banner',
            'content'     => 'admin/banner/list',
            'banners'     => $banners,
        ]);
    }

    public function create(): void {
        $this->render('layouts/admin', [
            'pageTitle'   => '배너 등록',
            'adminActive' => 'banner',
            'content'     => 'admin/banner/form',
            'banner'      => null,
        ]);
    }

    public function store(): void {
        Auth::csrfVerify();
        $title    = trim($this->post('title'));
        $subtitle = trim($this->post('subtitle'));
        $image    = trim($this->post('image'));

        $overlay   = in_array($this->post('overlay'), ['dark','light'], true) ? $this->post('overlay') : 'dark';
        $btn1Style = in_array($this->post('btn1_style'), ['outline','gold','white'], true) ? $this->post('btn1_style') : 'outline';
        $btn2Style = in_array($this->post('btn2_style'), ['outline','gold','white'], true) ? $this->post('btn2_style') : 'gold';
        (new BannerModel())->create(
            $title, $subtitle, $image, $overlay,
            trim($this->post('btn1_text')), trim($this->post('btn1_url')), $btn1Style,
            trim($this->post('btn2_text')), trim($this->post('btn2_url')), $btn2Style,
        );
        $this->redirect(BASE_PATH . '/admin/banner');
    }

    public function edit(string $id): void {
        $banner = (new BannerModel())->find((int)$id);
        if (!$banner) $this->redirect(BASE_PATH . '/admin/banner');

        $this->render('layouts/admin', [
            'pageTitle'   => '배너 수정',
            'adminActive' => 'banner',
            'content'     => 'admin/banner/form',
            'banner'      => $banner,
        ]);
    }

    public function update(string $id): void {
        Auth::csrfVerify();
        $title    = trim($this->post('title'));
        $subtitle = trim($this->post('subtitle'));
        $image    = trim($this->post('image'));

        $overlay   = in_array($this->post('overlay'), ['dark','light'], true) ? $this->post('overlay') : 'dark';
        $btn1Style = in_array($this->post('btn1_style'), ['outline','gold','white'], true) ? $this->post('btn1_style') : 'outline';
        $btn2Style = in_array($this->post('btn2_style'), ['outline','gold','white'], true) ? $this->post('btn2_style') : 'gold';
        (new BannerModel())->update(
            (int)$id, $title, $subtitle, $image, $overlay,
            trim($this->post('btn1_text')), trim($this->post('btn1_url')), $btn1Style,
            trim($this->post('btn2_text')), trim($this->post('btn2_url')), $btn2Style,
        );
        $this->redirect(BASE_PATH . '/admin/banner');
    }

    public function toggle(string $id): void {
        Auth::csrfVerify();
        $banner = (new BannerModel())->find((int)$id);
        if (!$banner) $this->json(['ok' => false], 404);
        (new BannerModel())->toggle((int)$id, $banner['is_active'] ? 0 : 1);
        $this->json(['ok' => true]);
    }

    public function delete(string $id): void {
        Auth::csrfVerify();
        (new BannerModel())->delete((int)$id);
        $this->json(['ok' => true]);
    }

    public function sort(): void {
        $banners = (new BannerModel())->getAll();
        $this->render('layouts/admin', [
            'pageTitle'   => '배너 순서 정렬',
            'adminActive' => 'banner',
            'content'     => 'admin/banner/sort',
            'banners'     => $banners,
        ]);
    }

    public function updateSort(): void {
        Auth::csrfVerify();
        $ids = $this->post('ids') ?? [];
        if (is_array($ids)) {
            (new BannerModel())->updateSort($ids);
        }
        $this->json(['ok' => true]);
    }
}
