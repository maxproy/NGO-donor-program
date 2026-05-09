<?php
/**
 * Update a program (admin only)
 * POST /api/programs/update.php
 */

require_once '../../config/db.php';
require_once '../../includes/session.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit();
}

if (!isAdminLoggedIn()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized - Admin access required']);
    exit();
}

$program_id = isset($_POST['program_id']) ? intval($_POST['program_id']) : 0;

if ($program_id <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Program ID is required']);
    exit();
}

// Fetch existing program details to fall back on if some fields aren't sent
$check_query = "SELECT * FROM programs WHERE program_id = ?";
$check_stmt = $conn->prepare($check_query);
$check_stmt->bind_param("i", $program_id);
$check_stmt->execute();
$result = $check_stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Program not found']);
    $check_stmt->close();
    exit();
}
$existing = $result->fetch_assoc();
$check_stmt->close();

// Get and sanitize input (or keep existing)
$name = isset($_POST['name']) && trim($_POST['name']) !== '' ? trim($_POST['name']) : $existing['name'];
$description = isset($_POST['description']) ? trim($_POST['description']) : $existing['description'];
$target_amount = isset($_POST['target_amount']) && $_POST['target_amount'] !== '' ? floatval($_POST['target_amount']) : $existing['target_amount'];
$country = isset($_POST['country']) ? trim($_POST['country']) : $existing['country'];
$status = isset($_POST['status']) && trim($_POST['status']) !== '' ? trim($_POST['status']) : $existing['status'];

$update_query = "UPDATE programs SET name = ?, description = ?, target_amount = ?, country = ?, status = ? WHERE program_id = ?";
$update_stmt = $conn->prepare($update_query);

if (!$update_stmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    exit();
}

$update_stmt->bind_param("ssdssi", $name, $description, $target_amount, $country, $status, $program_id);

if ($update_stmt->execute()) {
    echo json_encode([
        'success' => true, 
        'message' => 'Program updated successfully'
    ]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to update program: ' . $update_stmt->error]);
}

$update_stmt->close();
$conn->close();
?>