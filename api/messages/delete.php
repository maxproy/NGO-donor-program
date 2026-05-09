<?php
/**
 * Delete a message (admin only)
 * POST /api/messages/delete.php
 */

require_once '../../config/db.php';
require_once '../../includes/session.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method'
    ]);
    exit();
}

// Check if admin is logged in
if (!isAdminLoggedIn()) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized - Admin access required'
    ]);
    exit();
}

// Get message ID
$message_id = isset($_POST['message_id']) ? intval($_POST['message_id']) : 0;

if ($message_id <= 0) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Valid message ID is required'
    ]);
    exit();
}

// Check if message exists
$check_query = "SELECT message_id FROM messages WHERE message_id = ?";
$check_stmt = $conn->prepare($check_query);
$check_stmt->bind_param("i", $message_id);
$check_stmt->execute();
$check_result = $check_stmt->get_result();

if ($check_result->num_rows === 0) {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'message' => 'Message not found'
    ]);
    $check_stmt->close();
    exit();
}
$check_stmt->close();

// Delete message
$delete_query = "DELETE FROM messages WHERE message_id = ?";
$delete_stmt = $conn->prepare($delete_query);

if (!$delete_stmt) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $conn->error
    ]);
    exit();
}

$delete_stmt->bind_param("i", $message_id);

if ($delete_stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Message deleted successfully'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error deleting message: ' . $delete_stmt->error
    ]);
}

$delete_stmt->close();
$conn->close();

?>