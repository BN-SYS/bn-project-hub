<?php

class UserModel {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function findById(int $id): ?array {
        $stmt = $this->db->prepare('SELECT * FROM users WHERE id=? AND is_active=1');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function findByUsername(string $username): ?array {
        $stmt = $this->db->prepare('SELECT * FROM users WHERE username=? AND is_active=1');
        $stmt->execute([$username]);
        return $stmt->fetch() ?: null;
    }

    public function findByEmail(string $email): ?array {
        $stmt = $this->db->prepare('SELECT * FROM users WHERE email=? AND is_active=1');
        $stmt->execute([$email]);
        return $stmt->fetch() ?: null;
    }

    public function usernameExists(string $username): bool {
        $stmt = $this->db->prepare('SELECT COUNT(*) FROM users WHERE username=?');
        $stmt->execute([$username]);
        return (int)$stmt->fetchColumn() > 0;
    }

    public function emailExists(string $email): bool {
        $stmt = $this->db->prepare('SELECT COUNT(*) FROM users WHERE email=?');
        $stmt->execute([$email]);
        return (int)$stmt->fetchColumn() > 0;
    }

    public function create(array $data): int {
        $stmt = $this->db->prepare(
            'INSERT INTO users
             (username, password_hash, name, birth_date, gender,
              address_zip, address1, address2, phone, email,
              note, agree_privacy, agree_marketing)
             VALUES
             (:username, :password_hash, :name, :birth_date, :gender,
              :address_zip, :address1, :address2, :phone, :email,
              :note, :agree_privacy, :agree_marketing)'
        );
        $stmt->execute([
            ':username'        => $data['username'],
            ':password_hash'   => password_hash($data['password'], PASSWORD_DEFAULT),
            ':name'            => $data['name'],
            ':birth_date'      => $data['birth_date'] ?: null,
            ':gender'          => $data['gender'] ?? '',
            ':address_zip'     => $data['address_zip'] ?? '',
            ':address1'        => $data['address1'] ?? '',
            ':address2'        => $data['address2'] ?? '',
            ':phone'           => $data['phone'],
            ':email'           => $data['email'],
            ':note'            => $data['note'] ?: null,
            ':agree_privacy'   => $data['agree_privacy'] ? 1 : 0,
            ':agree_marketing' => $data['agree_marketing'] ? 1 : 0,
        ]);
        return (int) $this->db->lastInsertId();
    }
}
