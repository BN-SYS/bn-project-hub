<?php

class MemberModel {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function paginate(int $page, int $perPage, ?string $search = null, ?int $classId = null, ?int $isActive = null): array {
        [$where, $params] = $this->buildWhere($search, $classId, $isActive);
        $offset = ($page - 1) * $perPage;
        $stmt   = $this->db->prepare(
            "SELECT m.*, c.name AS class_name, c.fee AS class_fee
             FROM member m LEFT JOIN class_group c ON m.class_id = c.id
             $where ORDER BY m.is_active DESC, m.name
             LIMIT ? OFFSET ?"
        );
        $stmt->execute([...$params, $perPage, $offset]);
        return $stmt->fetchAll();
    }

    public function countAll(?string $search = null, ?int $classId = null, ?int $isActive = null): int {
        [$where, $params] = $this->buildWhere($search, $classId, $isActive);
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM member m $where");
        $stmt->execute($params);
        return (int) $stmt->fetchColumn();
    }

    public function getAll(?string $search = null, ?int $classId = null, ?int $isActive = null): array {
        [$where, $params] = $this->buildWhere($search, $classId, $isActive);
        $stmt = $this->db->prepare(
            "SELECT m.*, c.name AS class_name, c.fee AS class_fee
             FROM member m LEFT JOIN class_group c ON m.class_id = c.id
             $where ORDER BY m.is_active DESC, m.name"
        );
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    private function buildWhere(?string $search, ?int $classId, ?int $isActive = null): array {
        $conds  = [];
        $params = [];
        if ($search) {
            $conds[]  = '(m.name LIKE ? OR m.phone LIKE ?)';
            $params[] = "%$search%";
            $params[] = "%$search%";
        }
        if ($classId !== null) {
            $conds[]  = 'm.class_id = ?';
            $params[] = $classId;
        }
        if ($isActive !== null) {
            $conds[]  = 'm.is_active = ?';
            $params[] = $isActive;
        }
        $where = $conds ? 'WHERE ' . implode(' AND ', $conds) : '';
        return [$where, $params];
    }

    public function find(int $id): ?array {
        $stmt = $this->db->prepare(
            'SELECT m.*, c.name AS class_name, c.fee AS class_fee
             FROM member m LEFT JOIN class_group c ON m.class_id = c.id
             WHERE m.id = ?'
        );
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function getActive(): array {
        return $this->db->query(
            'SELECT m.*, c.fee AS class_fee
             FROM member m LEFT JOIN class_group c ON m.class_id = c.id
             WHERE m.is_active = 1 ORDER BY m.name'
        )->fetchAll();
    }

    public function create(array $data): int {
        $stmt = $this->db->prepare(
            'INSERT INTO member (name, phone, email, birth_date, gender, class_id, joined_at, suspended_at, memo, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $data['name'],
            $data['phone'] ?: null,
            $data['email'] ?: null,
            $data['birth_date'] ?: null,
            $data['gender'] ?: null,
            $data['class_id'] ?: null,
            $data['joined_at'] ?: null,
            $data['suspended_at'] ?: null,
            $data['memo'] ?: null,
            (int)($data['is_active'] ?? 1),
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, array $data): void {
        $stmt = $this->db->prepare(
            'UPDATE member SET name=?, phone=?, email=?, birth_date=?, gender=?,
             class_id=?, joined_at=?, suspended_at=?, memo=?, is_active=? WHERE id=?'
        );
        $stmt->execute([
            $data['name'],
            $data['phone'] ?: null,
            $data['email'] ?: null,
            $data['birth_date'] ?: null,
            $data['gender'] ?: null,
            $data['class_id'] ?: null,
            $data['joined_at'] ?: null,
            $data['suspended_at'] ?: null,
            $data['memo'] ?: null,
            (int)($data['is_active'] ?? 1),
            $id,
        ]);
    }

    public function delete(int $id): void {
        $this->db->prepare('DELETE FROM tuition WHERE member_id = ?')->execute([$id]);
        $this->db->prepare('DELETE FROM member WHERE id = ?')->execute([$id]);
    }
}
