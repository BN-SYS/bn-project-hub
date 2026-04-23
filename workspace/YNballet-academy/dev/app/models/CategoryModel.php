<?php

class CategoryModel {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    /** 전체 목록 (사용 과정 수 포함) */
    public function all(): array {
        return $this->db->query(
            'SELECT cc.*, COUNT(c.id) AS course_count
             FROM course_category cc
             LEFT JOIN course c ON c.category = cc.name
             GROUP BY cc.id
             ORDER BY cc.sort_order, cc.name'
        )->fetchAll();
    }

    /** 선택 목록용 (폼 드롭다운) */
    public function list(): array {
        return $this->db->query(
            'SELECT id, name FROM course_category ORDER BY sort_order, name'
        )->fetchAll();
    }

    public function find(int $id): ?array {
        $stmt = $this->db->prepare('SELECT * FROM course_category WHERE id=?');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function nameExists(string $name, int $excludeId = 0): bool {
        $stmt = $this->db->prepare('SELECT COUNT(*) FROM course_category WHERE name=? AND id!=?');
        $stmt->execute([$name, $excludeId]);
        return (int)$stmt->fetchColumn() > 0;
    }

    public function create(string $name, int $sortOrder): int {
        $stmt = $this->db->prepare('INSERT INTO course_category (name, sort_order) VALUES (?, ?)');
        $stmt->execute([$name, $sortOrder]);
        return (int)$this->db->lastInsertId();
    }

    public function update(int $id, string $name, int $sortOrder): void {
        $stmt = $this->db->prepare('UPDATE course_category SET name=?, sort_order=? WHERE id=?');
        $stmt->execute([$name, $sortOrder, $id]);
    }

    /** 카테고리명 변경 시 course.category 동기 업데이트 */
    public function syncCoursesCategory(string $oldName, string $newName): void {
        $stmt = $this->db->prepare('UPDATE course SET category=? WHERE category=?');
        $stmt->execute([$newName, $oldName]);
    }

    public function delete(int $id): void {
        $stmt = $this->db->prepare('DELETE FROM course_category WHERE id=?');
        $stmt->execute([$id]);
    }

    public function courseCount(int $id): int {
        $cat = $this->find($id);
        if (!$cat) return 0;
        $stmt = $this->db->prepare('SELECT COUNT(*) FROM course WHERE category=?');
        $stmt->execute([$cat['name']]);
        return (int)$stmt->fetchColumn();
    }
}
