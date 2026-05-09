<?php
/**
 * Delete a program (admin only)
 * POST /api/programs/delete.php
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

$delete_query = "DELETE FROM programs WHERE program_id = ?";
$stmt = $conn->prepare($delete_query);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    exit();
}

$stmt->bind_param("i", $program_id);

if ($stmt->execute() && $stmt->affected_rows > 0) {
    echo json_encode(['success' => true, 'message' => 'Program deleted successfully']);
} else {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Failed to delete program or program not found']);
}

$stmt->close();
$conn->close();
?>