<?php

class CourseModel {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getActiveGrouped(): array {
        $stmt = $this->db->prepare(
            'SELECT id, title, category, level_badge, target, description, fee
             FROM course WHERE is_active=1 ORDER BY category, sort_order'
        );
        $stmt->execute();
        $rows = $stmt->fetchAll();

        $grouped = [];
        foreach ($rows as $row) {
            $grouped[$row['category']][] = $row;
        }
        return $grouped;
    }

    public function getActiveList(): array {
        $stmt = $this->db->prepare(
            'SELECT id, title FROM course WHERE is_active=1 ORDER BY category, sort_order'
        );
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getActiveFlat(): array {
        $stmt = $this->db->prepare(
            'SELECT id, title, category, level_badge, description, fee
             FROM course WHERE is_active=1 ORDER BY category, sort_order'
        );
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // ─── 관리자 ──────────────────────────────────────────

    public function adminAll(): array {
        $stmt = $this->db->query(
            'SELECT id, title, category, level_badge, sort_order, is_active FROM course ORDER BY category, sort_order'
        );
        return $stmt->fetchAll();
    }

    public function adminPaginate(int $page, int $perPage): array {
        $offset = ($page - 1) * $perPage;
        $stmt = $this->db->prepare(
            'SELECT id, title, category, level_badge, sort_order, is_active FROM course ORDER BY category, sort_order LIMIT ? OFFSET ?'
        );
        $stmt->execute([$perPage, $offset]);
        return $stmt->fetchAll();
    }

    public function countAll(): int {
        return (int) $this->db->query('SELECT COUNT(*) FROM course')->fetchColumn();
    }

    public function find(int $id): ?array {
        $stmt = $this->db->prepare('SELECT * FROM course WHERE id=?');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function create(array $data): int {
        $stmt = $this->db->prepare(
            'INSERT INTO course (title, category, level_badge, target, description, fee, sort_order)
             VALUES (:title, :category, :level_badge, :target, :description, :fee, :sort_order)'
        );
        $stmt->execute([
            ':title'       => $data['title'],
            ':category'    => $data['category'],
            ':level_badge' => $data['level_badge'],
            ':target'      => $data['target'],
            ':description' => $data['description'],
            ':fee'         => $data['fee'],
            ':sort_order'  => $data['sort_order'] ?? 0,
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, array $data): void {
        $stmt = $this->db->prepare(
            'UPDATE course SET title=:title, category=:category, level_badge=:level_badge,
             target=:target, description=:description, fee=:fee WHERE id=:id'
        );
        $stmt->execute([
            ':title'       => $data['title'],
            ':category'    => $data['category'],
            ':level_badge' => $data['level_badge'],
            ':target'      => $data['target'],
            ':description' => $data['description'],
            ':fee'         => $data['fee'],
            ':id'          => $id,
        ]);
    }

    public function toggle(int $id, int $isActive): void {
        $stmt = $this->db->prepare('UPDATE course SET is_active=? WHERE id=?');
        $stmt->execute([$isActive, $id]);
    }

    public function updateSort(array $orderedIds): void {
        $stmt = $this->db->prepare('UPDATE course SET sort_order=? WHERE id=?');
        foreach ($orderedIds as $order => $id) {
            $stmt->execute([$order + 1, (int)$id]);
        }
    }
}
