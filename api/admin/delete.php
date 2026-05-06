<?php
/**
 * Delete an existing message
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

// Get and sanitize the message_id
$message_id = isset($_POST['message_id']) ? intval($_POST['message_id']) : null;

if (!$message_id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Message ID is required']);
    exit();
}

// Prepare and execute the delete statement
$delete_query = "DELETE FROM messages WHERE message_id = ?";
$stmt = $conn->prepare($delete_query);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    exit();
}

$stmt->bind_param("i", $message_id);

if ($stmt->execute() && $stmt->affected_rows > 0) {
    echo json_encode(['success' => true, 'message' => 'Message deleted successfully']);
} else {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Failed to delete message or message not found']);
}

$stmt->close();
$conn->close();
?>
