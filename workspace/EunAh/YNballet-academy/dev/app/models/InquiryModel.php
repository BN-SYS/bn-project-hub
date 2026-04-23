<?php

class InquiryModel {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function paginate(int $page, int $perPage): array {
        $offset = ($page - 1) * $perPage;
        $stmt = $this->db->prepare(
            'SELECT id, name, contact, course_interest, admin_memo, status, created_at FROM inquiry ORDER BY created_at DESC LIMIT ? OFFSET ?'
        );
        $stmt->execute([$perPage, $offset]);
        return $stmt->fetchAll();
    }

    public function countAll(): int {
        return (int) $this->db->query('SELECT COUNT(*) FROM inquiry')->fetchColumn();
    }

    public function find(int $id): ?array {
        $stmt = $this->db->prepare('SELECT * FROM inquiry WHERE id=?');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function create(array $data): int {
        $stmt = $this->db->prepare(
            'INSERT INTO inquiry (name, contact, course_interest, content, password)
             VALUES (:name, :contact, :course_interest, :content, :password)'
        );
        $stmt->execute([
            ':name'            => $data['name'],
            ':contact'         => $data['contact'],
            ':course_interest' => $data['course_interest'],
            ':content'         => $data['content'],
            ':password'        => password_hash($data['password'], PASSWORD_DEFAULT),
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function verifyPassword(int $id, string $password): bool {
        $inquiry = $this->find($id);
        if (!$inquiry) return false;
        return password_verify($password, $inquiry['password']);
    }

    public function updateStatus(int $id, int $status): void {
        $stmt = $this->db->prepare('UPDATE inquiry SET status=? WHERE id=?');
        $stmt->execute([$status, $id]);
    }

    public function updateMemo(int $id, string $memo): void {
        $stmt = $this->db->prepare('UPDATE inquiry SET admin_memo=? WHERE id=?');
        $stmt->execute([$memo, $id]);
    }

    public function updateAnswer(int $id, string $answer): void {
        $stmt = $this->db->prepare(
            'UPDATE inquiry SET answer=?, status=1, answered_at=COALESCE(answered_at, NOW()) WHERE id=?'
        );
        $stmt->execute([$answer, $id]);
    }
}
