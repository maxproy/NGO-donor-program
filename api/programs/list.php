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

// Dynamically calculate the sum of all past and present completed donations!
$query = "SELECT p.program_id, p.name, p.description, p.target_amount, 
                 COALESCE((SELECT SUM(amount) FROM donations d WHERE d.program = p.name AND d.status = 'completed'), 0) as current_amount, 
                 p.country, p.status, p.created_at 
          FROM programs p";

if ($status) {
    $query .= " WHERE p.status = '" . $conn->real_escape_string($status) . "'";
}
$query .= " ORDER BY p.created_at DESC";

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
    $row['remaining_amount'] = max(0, $target - $current);
    $programs[] = $row;
}

echo json_encode(['success' => true, 'data' => $programs]);
$conn->close();
?>
