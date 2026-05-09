<?php
/**
 * Update message status (admin only)
 * POST /api/messages/update.php
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

$message_id = isset($_POST['message_id']) ? intval($_POST['message_id']) : 0;
$status = isset($_POST['status']) ? trim($_POST['status']) : ''; // 'unread', 'read', 'replied'

if ($message_id <= 0 || empty($status)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Message ID and status are required']);
    exit();
}

// Define allowed statuses
$allowed_statuses = ['unread', 'read', 'replied'];
if (!in_array($status, $allowed_statuses)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid status']);
    exit();
}

// If status is 'replied', also update the replied_at timestamp
if ($status === 'replied') {
    $update_query = "UPDATE messages SET status = ?, replied_at = CURRENT_TIMESTAMP WHERE message_id = ?";
} else {
    $update_query = "UPDATE messages SET status = ? WHERE message_id = ?";
}

$stmt = $conn->prepare($update_query);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    exit();
}

$stmt->bind_param("si", $status, $message_id);
if ($stmt->execute() && $stmt->affected_rows > 0) {
    echo json_encode(['success' => true, 'message' => 'Message updated successfully']);
} else {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Failed to update message or message not found']);
}

$stmt->close();
$conn->close();
?>