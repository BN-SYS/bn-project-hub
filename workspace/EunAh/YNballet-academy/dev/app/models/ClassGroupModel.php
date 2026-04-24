<?php

class ClassGroupModel {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAll(): array {
        return $this->db->query(
            'SELECT c.*,
                    (SELECT COUNT(*) FROM member m WHERE m.class_id = c.id AND m.is_active = 1) AS member_count
             FROM class_group c ORDER BY c.sort_order, c.id'
        )->fetchAll();
    }

    public function getActive(): array {
        return $this->db->query(
            'SELECT * FROM class_group WHERE is_active = 1 ORDER BY sort_order, id'
        )->fetchAll();
    }

    public function find(int $id): ?array {
        $stmt = $this->db->prepare('SELECT * FROM class_group WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function create(array $data): int {
        $nextOrder = (int) $this->db->query('SELECT COALESCE(MAX(sort_order),0) FROM class_group')->fetchColumn() + 1;
        $stmt = $this->db->prepare(
            'INSERT INTO class_group (name, fee, description, is_active, sort_order) VALUES (?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $data['name'],
            (int)$data['fee'],
            $data['description'] ?: null,
            (int)($data['is_active'] ?? 1),
            $nextOrder,
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, array $data): void {
        $stmt = $this->db->prepare(
            'UPDATE class_group SET name = ?, fee = ?, description = ?, is_active = ? WHERE id = ?'
        );
        $stmt->execute([
            $data['name'],
            (int)$data['fee'],
            $data['description'] ?: null,
            (int)($data['is_active'] ?? 1),
            $id,
        ]);
    }

    public function delete(int $id): void {
        $this->db->prepare('DELETE FROM class_group WHERE id = ?')->execute([$id]);
    }
}
