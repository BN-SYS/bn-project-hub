<?php

class Router {
    private array $routes = [];

    public function get(string $path, string $handler): void {
        $this->routes[] = ['GET', $path, $handler];
    }

    public function post(string $path, string $handler): void {
        $this->routes[] = ['POST', $path, $handler];
    }

    public function dispatch(): void {
        $method = $_SERVER['REQUEST_METHOD'];
        $uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        // base path 제거 (XAMPP 서브디렉토리 운영 시)
        $base = rtrim(BASE_PATH, '/');
        if ($base !== '' && str_starts_with($uri, $base)) {
            $uri = substr($uri, strlen($base));
        }
        $uri = '/' . ltrim($uri, '/');

        foreach ($this->routes as [$routeMethod, $routePath, $handler]) {
            $pattern = $this->toRegex($routePath);
            if ($method === $routeMethod && preg_match($pattern, $uri, $matches)) {
                array_shift($matches);
                $this->call($handler, $matches);
                return;
            }
        }

        http_response_code(404);
        echo '404 — 페이지를 찾을 수 없습니다.';
    }

    private function toRegex(string $path): string {
        // :param → named capture
        $pattern = preg_replace('#:([a-zA-Z_]+)#', '([^/]+)', $path);
        return '#^' . $pattern . '$#';
    }

    private function call(string $handler, array $params): void {
        [$class, $method] = explode('@', $handler);

        $file = APP_ROOT . '/app/controllers/' . str_replace('\\', '/', $class) . '.php';
        if (!file_exists($file)) {
            // admin 네임스페이스 처리
            $file = APP_ROOT . '/app/controllers/admin/' . $class . '.php';
        }
        if (!file_exists($file)) {
            http_response_code(500);
            exit("Controller not found: {$class}");
        }

        require_once $file;
        $controller = new $class();
        $controller->$method(...$params);
    }
}
