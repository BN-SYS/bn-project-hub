<?php

class PopupModel {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    /** 현재 노출 중인 팝업 (사용자 화면용) */
    public function getActivePopups(): array {
        $stmt = $this->db->prepare(
            'SELECT * FROM popup
             WHERE is_active=1
               AND display_start <= CURDATE()
               AND display_end   >= CURDATE()
             ORDER BY sort_order, id'
        );
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function adminPaginate(int $page, int $perPage): array {
        $offset = ($page - 1) * $perPage;
        $stmt = $this->db->prepare(
            'SELECT id, title, display_start, display_end, is_active, sort_order, created_at
             FROM popup ORDER BY sort_order, id DESC LIMIT ? OFFSET ?'
        );
        $stmt->execute([$perPage, $offset]);
        return $stmt->fetchAll();
    }

    public function countAll(): int {
        return (int) $this->db->query('SELECT COUNT(*) FROM popup')->fetchColumn();
    }

    public function find(int $id): ?array {
        $stmt = $this->db->prepare('SELECT * FROM popup WHERE id=?');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function create(array $d): int {
        $stmt = $this->db->prepare(
            'INSERT INTO popup
               (title, content, display_start, display_end,
                pos_top, pos_left, width, height, is_active, sort_order)
             VALUES (?,?,?,?,?,?,?,?,?,?)'
        );
        $stmt->execute([
            $d['title'], $d['content'],
            $d['display_start'], $d['display_end'],
            $d['pos_top'], $d['pos_left'],
            $d['width'], $d['height'],
            $d['is_active'], $d['sort_order'],
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, array $d): void {
        $stmt = $this->db->prepare(
            'UPDATE popup SET
               title=?, content=?, display_start=?, display_end=?,
               pos_top=?, pos_left=?, width=?, height=?,
               is_active=?, sort_order=?
             WHERE id=?'
        );
        $stmt->execute([
            $d['title'], $d['content'],
            $d['display_start'], $d['display_end'],
            $d['pos_top'], $d['pos_left'],
            $d['width'], $d['height'],
            $d['is_active'], $d['sort_order'],
            $id,
        ]);
    }

    public function toggle(int $id, int $isActive): void {
        $stmt = $this->db->prepare('UPDATE popup SET is_active=? WHERE id=?');
        $stmt->execute([$isActive, $id]);
    }

    public function delete(int $id): void {
        $stmt = $this->db->prepare('DELETE FROM popup WHERE id=?');
        $stmt->execute([$id]);
    }
}
