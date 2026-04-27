<?php

/*
 * Front Controller
 *
 * 로컬(XAMPP): DocumentRoot = dev/   (index.php와 app/ 동일 위치)
 * 카페24:      DocumentRoot = /www/  (index.php와 app/ 동일 위치)
 * → 두 환경 모두 APP_ROOT = index.php 가 있는 디렉터리
 */
define('APP_ROOT', __DIR__);

require APP_ROOT . '/config/config.php';
require APP_ROOT . '/core/Database.php';
require APP_ROOT . '/core/Controller.php';
require APP_ROOT . '/core/Router.php';
require APP_ROOT . '/app/helpers/functions.php';
require APP_ROOT . '/app/helpers/Auth.php';

Auth::startSession();

$router = new Router();
require APP_ROOT . '/routes/web.php';
$router->dispatch();