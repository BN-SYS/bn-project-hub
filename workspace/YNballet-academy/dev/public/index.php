<?php

define('APP_ROOT', dirname(__DIR__));

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
