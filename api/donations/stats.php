<?php
/**
 * Donation Statistics and Summaries
 * GET /api/donations/stats.php?program=education&donor_id=1
 */

require_once '../../config/db.php';
require_once '../../includes/session.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method'
    ]);
    exit();
}

$donor_id = isset($_GET['donor_id']) ? intval($_GET['donor_id']) : null;
$program = isset($_GET['program']) ? trim($_GET['program']) : null;
$start_date = isset($_GET['start_date']) ? trim($_GET['start_date']) : null;
$end_date = isset($_GET['end_date']) ? trim($_GET['end_date']) : null;

// Build base query for stats
$stats_query = "SELECT 
                COUNT(*) as total_donations,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_donations,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_donations,
                SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_donations,
                SUM(amount) as total_amount,
                SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as completed_amount,
                AVG(amount) as average_amount,
                MAX(amount) as max_amount,
                MIN(amount) as min_amount
          FROM donations 
          WHERE 1=1";

$params = [];
$types = "";

if ($donor_id !== null) {
    $stats_query .= " AND donor_id = ?";
    $params[] = $donor_id;
    $types .= "i";
}

if ($program !== null) {
    $stats_query .= " AND program LIKE ?";
    $params[] = "%$program%";
    $types .= "s";
}

if ($start_date !== null) {
    $stats_query .= " AND donation_date >= ?";
    $params[] = $start_date . " 00:00:00";
    $types .= "s";
}

if ($end_date !== null) {
    $stats_query .= " AND donation_date <= ?";
    $params[] = $end_date . " 23:59:59";
    $types .= "s";
}

$stmt = $conn->prepare($stats_query);

if (!$stmt) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $conn->error
    ]);
    exit();
}

if ($types) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();
$stats = $result->fetch_assoc();

// Get donation by program breakdown
$program_query = "SELECT program, 
                         COUNT(*) as count, 
                         SUM(amount) as total,
                         SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as completed_total
                  FROM donations 
                  WHERE 1=1";

$program_params = [];
$program_types = "";

if ($donor_id !== null) {
    $program_query .= " AND donor_id = ?";
    $program_params[] = $donor_id;
    $program_types .= "i";
}

if ($start_date !== null) {
    $program_query .= " AND donation_date >= ?";
    $program_params[] = $start_date . " 00:00:00";
    $program_types .= "s";
}

if ($end_date !== null) {
    $program_query .= " AND donation_date <= ?";
    $program_params[] = $end_date . " 23:59:59";
    $program_types .= "s";
}

$program_query .= " GROUP BY program ORDER BY total DESC";

$program_stmt = $conn->prepare($program_query);

if ($program_types) {
    $program_stmt->bind_param($program_types, ...$program_params);
}

$program_stmt->execute();
$program_result = $program_stmt->get_result();

$by_program = [];
while ($row = $program_result->fetch_assoc()) {
    $by_program[] = $row;
}

// Get donation by status breakdown
$status_query = "SELECT status, COUNT(*) as count, SUM(amount) as total 
                 FROM donations 
                 WHERE 1=1";

$status_params = [];
$status_types = "";

if ($donor_id !== null) {
    $status_query .= " AND donor_id = ?";
    $status_params[] = $donor_id;
    $status_types .= "i";
}

if ($start_date !== null) {
    $status_query .= " AND donation_date >= ?";
    $status_params[] = $start_date . " 00:00:00";
    $status_types .= "s";
}

if ($end_date !== null) {
    $status_query .= " AND donation_date <= ?";
    $status_params[] = $end_date . " 23:59:59";
    $status_types .= "s";
}

$status_query .= " GROUP BY status ORDER BY count DESC";

$status_stmt = $conn->prepare($status_query);

if ($status_types) {
    $status_stmt->bind_param($status_types, ...$status_params);
}

$status_stmt->execute();
$status_result = $status_stmt->get_result();

$by_status = [];
while ($row = $status_result->fetch_assoc()) {
    $by_status[] = $row;
}

echo json_encode([
    'success' => true,
    'summary' => $stats,
    'by_program' => $by_program,
    'by_status' => $by_status
]);

$stmt->close();
$program_stmt->close();
$status_stmt->close();
$conn->close();

?>
