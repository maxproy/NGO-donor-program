<?php
/**
 * List all programs
 * GET /api/programs/list.php
 */

require_once '../../config/db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit();
}

$status = isset($_GET['status']) ? trim($_GET['status']) : null;

$query = "SELECT program_id, name, description, target_amount, current_amount, country, status, created_at FROM programs";
if ($status) {
    $query .= " WHERE status = '" . $conn->real_escape_string($status) . "'";
}
$query .= " ORDER BY created_at DESC";

$result = $conn->query($query);

if (!$result) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    exit();
}

$programs = [];
while ($row = $result->fetch_assoc()) {
    // Calculate the remaining amount to meet the goal
    $target = floatval($row['target_amount']);
    $current = floatval($row['current_amount']);
    // max(0, ...) ensures it doesn't show negative numbers if the goal is exceeded
    $row['remaining_amount'] = max(0, $target - $current);
    
    $programs[] = $row;
}

echo json_encode(['success' => true, 'data' => $programs]);
$conn->close();
?>