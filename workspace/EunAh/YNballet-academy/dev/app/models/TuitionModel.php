<?php

class TuitionModel {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getByMonth(int $year, int $month): array {
        $stmt = $this->db->prepare(
            'SELECT t.*, m.name AS member_name, m.phone AS member_phone,
                    c.name AS class_name
             FROM tuition t
             JOIN member m ON t.member_id = m.id
             LEFT JOIN class_group c ON t.class_id = c.id
             WHERE t.year = ? AND t.month = ?
             ORDER BY t.status ASC, m.name'
        );
        $stmt->execute([$year, $month]);
        return $stmt->fetchAll();
    }

    public function find(int $id): ?array {
        $stmt = $this->db->prepare(
            'SELECT t.*, m.name AS member_name, c.name AS class_name
             FROM tuition t
             JOIN member m ON t.member_id = m.id
             LEFT JOIN class_group c ON t.class_id = c.id
             WHERE t.id = ?'
        );
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function generateForMonth(int $year, int $month): int {
        $members = (new MemberModel())->getActive();
        $stmt    = $this->db->prepare(
            'INSERT IGNORE INTO tuition (member_id, class_id, year, month, base_fee, actual_fee)
             VALUES (?, ?, ?, ?, ?, ?)'
        );
        $created = 0;
        foreach ($members as $m) {
            $fee = (int)($m['class_fee'] ?? 0);
            $stmt->execute([$m['id'], $m['class_id'] ?: null, $year, $month, $fee, $fee]);
            if ($stmt->rowCount() > 0) $created++;
        }
        return $created;
    }

    public function markPaid(int $id, string $paidAt): void {
        $stmt = $this->db->prepare(
            'UPDATE tuition SET status = 1, paid_at = ? WHERE id = ?'
        );
        $stmt->execute([$paidAt, $id]);
    }

    public function update(int $id, int $actualFee, int $status, ?string $paidAt, ?string $memo): void {
        $stmt = $this->db->prepare(
            'UPDATE tuition SET actual_fee = ?, status = ?, paid_at = ?, memo = ? WHERE id = ?'
        );
        $stmt->execute([$actualFee, $status, $paidAt ?: null, $memo ?: null, $id]);
    }

    public function getMonthlyStats(int $year): array {
        $stmt = $this->db->prepare(
            'SELECT month,
                    COUNT(*)                                          AS total_count,
                    SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END)     AS paid_count,
                    SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END)     AS unpaid_count,
                    SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END)     AS deferred_count,
                    SUM(base_fee)                                     AS expected_revenue,
                    SUM(CASE WHEN status = 1 THEN actual_fee ELSE 0 END) AS actual_revenue
             FROM tuition WHERE year = ?
             GROUP BY month ORDER BY month'
        );
        $stmt->execute([$year]);
        return $stmt->fetchAll();
    }

    public function getSummary(int $year, int $month): array {
        $stmt = $this->db->prepare(
            'SELECT
                COUNT(*)                                              AS total,
                SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END)         AS paid,
                SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END)         AS unpaid,
                SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END)         AS deferred,
                SUM(base_fee)                                         AS expected_revenue,
                SUM(CASE WHEN status = 1 THEN actual_fee ELSE 0 END) AS actual_revenue
             FROM tuition WHERE year = ? AND month = ?'
        );
        $stmt->execute([$year, $month]);
        return $stmt->fetch() ?: [];
    }
}
