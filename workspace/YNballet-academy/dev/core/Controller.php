<?php

abstract class Controller {
    protected PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    protected function render(string $view, array $data = []): void {
        extract($data);
        $viewPath = APP_ROOT . '/app/views/' . $view . '.php';
        if (!file_exists($viewPath)) {
            http_response_code(500);
            exit("View not found: {$view}");
        }
        require $viewPath;
    }

    protected function redirect(string $url): never {
        header('Location: ' . $url);
        exit;
    }

    protected function json(array $data, int $status = 200): never {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }

    protected function input(string $key, mixed $default = ''): mixed {
        return $_POST[$key] ?? $_GET[$key] ?? $default;
    }

    protected function post(string $key, mixed $default = ''): mixed {
        return $_POST[$key] ?? $default;
    }

    protected function get(string $key, mixed $default = ''): mixed {
        return $_GET[$key] ?? $default;
    }
}
