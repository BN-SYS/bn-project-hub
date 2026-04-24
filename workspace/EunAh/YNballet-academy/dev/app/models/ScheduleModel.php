<?php

class ScheduleModel {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getByMonth(int $year, int $month): array {
        $from = sprintf('%04d-%02d-01', $year, $month);
        $to   = date('Y-m-t', strtotime($from));
        $stmt = $this->db->prepare(
            'SELECT * FROM schedule WHERE event_date BETWEEN ? AND ? ORDER BY event_date, id'
        );
        $stmt->execute([$from, $to]);
        return $stmt->fetchAll();
    }

    public function adminPaginate(int $page, int $perPage, ?int $year = null, ?int $month = null): array {
        $offset = ($page - 1) * $perPage;
        if ($year && $month) {
            $from = sprintf('%04d-%02d-01', $year, $month);
            $to   = date('Y-m-t', strtotime($from));
            $stmt = $this->db->prepare(
                'SELECT * FROM schedule WHERE event_date BETWEEN ? AND ? ORDER BY event_date, id LIMIT ? OFFSET ?'
            );
            $stmt->execute([$from, $to, $perPage, $offset]);
        } else {
            $stmt = $this->db->prepare(
                'SELECT * FROM schedule ORDER BY event_date DESC, id DESC LIMIT ? OFFSET ?'
            );
            $stmt->execute([$perPage, $offset]);
        }
        return $stmt->fetchAll();
    }

    public function countAll(?int $year = null, ?int $month = null): int {
        if ($year && $month) {
            $from = sprintf('%04d-%02d-01', $year, $month);
            $to   = date('Y-m-t', strtotime($from));
            $stmt = $this->db->prepare('SELECT COUNT(*) FROM schedule WHERE event_date BETWEEN ? AND ?');
            $stmt->execute([$from, $to]);
            return (int) $stmt->fetchColumn();
        }
        return (int) $this->db->query('SELECT COUNT(*) FROM schedule')->fetchColumn();
    }

    public function find(int $id): ?array {
        $stmt = $this->db->prepare('SELECT * FROM schedule WHERE id=?');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function create(string $date, string $title, string $color, int $isHoliday = 0): int {
        $stmt = $this->db->prepare(
            'INSERT INTO schedule (event_date, title, color, is_holiday) VALUES (?, ?, ?, ?)'
        );
        $stmt->execute([$date, $title, $color, $isHoliday]);
        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, string $date, string $title, string $color, int $isHoliday = 0): void {
        $stmt = $this->db->prepare(
            'UPDATE schedule SET event_date=?, title=?, color=?, is_holiday=? WHERE id=?'
        );
        $stmt->execute([$date, $title, $color, $isHoliday, $id]);
    }

    public function delete(int $id): void {
        $stmt = $this->db->prepare('DELETE FROM schedule WHERE id=?');
        $stmt->execute([$id]);
    }
}
