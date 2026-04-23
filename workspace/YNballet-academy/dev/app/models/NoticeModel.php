<?php

class NoticeModel {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getActive(int $limit): array {
        $stmt = $this->db->prepare(
            'SELECT id, title, thumbnail, is_pinned, created_at FROM notice WHERE is_active=1 ORDER BY is_pinned DESC, created_at DESC LIMIT ?'
        );
        $stmt->execute([$limit]);
        return $stmt->fetchAll();
    }

    public function paginate(int $page, int $perPage): array {
        $offset = ($page - 1) * $perPage;
        $stmt = $this->db->prepare(
            'SELECT id, title, thumbnail, is_pinned, created_at FROM notice WHERE is_active=1 ORDER BY is_pinned DESC, created_at DESC LIMIT ? OFFSET ?'
        );
        $stmt->execute([$perPage, $offset]);
        return $stmt->fetchAll();
    }

    public function countActive(): int {
        return (int) $this->db->query('SELECT COUNT(*) FROM notice WHERE is_active=1')->fetchColumn();
    }

    public function find(int $id): ?array {
        $stmt = $this->db->prepare('SELECT * FROM notice WHERE id=? AND is_active=1');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    // ─── 관리자 ──────────────────────────────────────────

    public function adminPaginate(int $page, int $perPage): array {
        $offset = ($page - 1) * $perPage;
        $stmt = $this->db->prepare(
            'SELECT id, title, is_pinned, is_active, created_at FROM notice ORDER BY is_pinned DESC, created_at DESC LIMIT ? OFFSET ?'
        );
        $stmt->execute([$perPage, $offset]);
        return $stmt->fetchAll();
    }

    public function countAll(): int {
        return (int) $this->db->query('SELECT COUNT(*) FROM notice')->fetchColumn();
    }

    public function findAdmin(int $id): ?array {
        $stmt = $this->db->prepare('SELECT * FROM notice WHERE id=?');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function create(string $title, string $content, int $isPinned = 0): int {
        $thumb = extractThumbnail($content);
        $stmt = $this->db->prepare(
            'INSERT INTO notice (title, content, thumbnail, is_pinned) VALUES (?, ?, ?, ?)'
        );
        $stmt->execute([$title, $content, $thumb, $isPinned]);
        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, string $title, string $content, int $isPinned = 0): void {
        $thumb = extractThumbnail($content);
        $stmt = $this->db->prepare(
            'UPDATE notice SET title=?, content=?, thumbnail=?, is_pinned=? WHERE id=?'
        );
        $stmt->execute([$title, $content, $thumb, $isPinned, $id]);
    }

    public function toggle(int $id, int $isActive): void {
        $stmt = $this->db->prepare('UPDATE notice SET is_active=? WHERE id=?');
        $stmt->execute([$isActive, $id]);
    }
}
