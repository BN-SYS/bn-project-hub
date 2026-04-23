<?php

function e(string $str): string {
    return htmlspecialchars($str, ENT_QUOTES, 'UTF-8');
}

function fmtDate(string $datetime): string {
    return date('Y.m.d', strtotime($datetime));
}

function mbTruncate(string $str, int $len, string $suffix = '…'): string {
    if (mb_strlen($str, 'UTF-8') <= $len) return $str;
    return mb_substr($str, 0, $len, 'UTF-8') . $suffix;
}

function validContact(string $contact): bool {
    return (bool) preg_match('/^[\d\-]{10,13}$/', $contact);
}

function extractThumbnail(string $html): ?string {
    if (preg_match('/<img[^>]+src=["\']([^"\']+)["\']/', $html, $m)) {
        return $m[1];
    }
    return null;
}

function maskName(string $name): string {
    $first = mb_substr($name, 0, 1, 'UTF-8');
    $rest  = str_repeat('*', mb_strlen($name, 'UTF-8') - 1);
    return $first . $rest;
}

function inquiryBadge(int $status): string {
    return match($status) {
        0 => '<span class="badge-waiting">미답변</span>',
        1 => '<span class="badge-done">답변완료</span>',
        2 => '<span class="badge-waiting">보류</span>',
        default => '<span class="badge-waiting">알 수 없음</span>',
    };
}

function pagination(int $total, int $page, int $perPage, string $baseUrl): string {
    $totalPages = (int) ceil($total / $perPage);
    if ($totalPages <= 1) return '';

    $html  = '<nav><ul class="pagination pagination-sm justify-content-center">';
    $prev  = max(1, $page - 1);
    $next  = min($totalPages, $page + 1);
    $dis   = $page === 1 ? ' disabled' : '';
    $html .= "<li class=\"page-item{$dis}\"><a class=\"page-link\" href=\"{$baseUrl}&page={$prev}\">&laquo;</a></li>";

    for ($i = max(1, $page - 2); $i <= min($totalPages, $page + 2); $i++) {
        $active = $i === $page ? ' active' : '';
        $html  .= "<li class=\"page-item{$active}\"><a class=\"page-link\" href=\"{$baseUrl}&page={$i}\">{$i}</a></li>";
    }

    $dis   = $page === $totalPages ? ' disabled' : '';
    $html .= "<li class=\"page-item{$dis}\"><a class=\"page-link\" href=\"{$baseUrl}&page={$next}\">&raquo;</a></li>";
    $html .= '</ul></nav>';
    return $html;
}

function jsonResponse(array $data, int $status = 200): never {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
