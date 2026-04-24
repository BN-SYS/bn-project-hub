<?php

class BannerModel {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getActive(): array {
        $stmt = $this->db->prepare(
            'SELECT * FROM banner WHERE is_active=1 ORDER BY sort_order, id'
        );
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getAll(): array {
        return $this->db->query(
            'SELECT * FROM banner ORDER BY sort_order, id'
        )->fetchAll();
    }

    public function find(int $id): ?array {
        $stmt = $this->db->prepare('SELECT * FROM banner WHERE id=?');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function countAll(): int {
        return (int) $this->db->query('SELECT COUNT(*) FROM banner')->fetchColumn();
    }

    public function create(
        string $title, string $subtitle, string $image, string $overlay = 'dark',
        string $btn1Text = '', string $btn1Url = '', string $btn1Style = 'outline',
        string $btn2Text = '', string $btn2Url = '', string $btn2Style = 'gold'
    ): int {
        $nextOrder = (int) $this->db->query('SELECT COALESCE(MAX(sort_order),0) FROM banner')->fetchColumn() + 1;
        $stmt = $this->db->prepare(
            'INSERT INTO banner (title, subtitle, image, overlay, btn1_text, btn1_url, btn1_style, btn2_text, btn2_url, btn2_style, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $title ?: null, $subtitle ?: null, $image ?: null, $overlay,
            $btn1Text ?: null, $btn1Url ?: null, $btn1Style,
            $btn2Text ?: null, $btn2Url ?: null, $btn2Style,
            $nextOrder,
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function update(
        int $id, string $title, string $subtitle, string $image, string $overlay = 'dark',
        string $btn1Text = '', string $btn1Url = '', string $btn1Style = 'outline',
        string $btn2Text = '', string $btn2Url = '', string $btn2Style = 'gold'
    ): void {
        $stmt = $this->db->prepare(
            'UPDATE banner SET title=?, subtitle=?, image=?, overlay=?,
             btn1_text=?, btn1_url=?, btn1_style=?, btn2_text=?, btn2_url=?, btn2_style=? WHERE id=?'
        );
        $stmt->execute([
            $title ?: null, $subtitle ?: null, $image ?: null, $overlay,
            $btn1Text ?: null, $btn1Url ?: null, $btn1Style,
            $btn2Text ?: null, $btn2Url ?: null, $btn2Style,
            $id,
        ]);
    }

    public function toggle(int $id, int $isActive): void {
        $stmt = $this->db->prepare('UPDATE banner SET is_active=? WHERE id=?');
        $stmt->execute([$isActive, $id]);
    }

    public function delete(int $id): void {
        $stmt = $this->db->prepare('DELETE FROM banner WHERE id=?');
        $stmt->execute([$id]);
    }

    public function updateSort(array $ids): void {
        $stmt = $this->db->prepare('UPDATE banner SET sort_order=? WHERE id=?');
        foreach ($ids as $order => $id) {
            $stmt->execute([$order + 1, (int)$id]);
        }
    }
}
