<?php
/**
 * Delete a donation
 * POST /api/donations/delete.php
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

if (!isAdminLoggedIn()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized - Admin access required']);
    exit();
}

$donation_id = isset($_POST['donation_id']) ? intval($_POST['donation_id']) : null;

if (!$donation_id) {
    echo json_encode([
        'success' => false,
        'message' => 'Donation ID is required'
    ]);
    exit();
}

// Check if donation exists
$check_query = "SELECT donation_id FROM donations WHERE donation_id = ?";
$check_stmt = $conn->prepare($check_query);
$check_stmt->bind_param("i", $donation_id);
$check_stmt->execute();
$check_result = $check_stmt->get_result();

if ($check_result->num_rows === 0) {
    echo json_encode([
        'success' => false,
        'message' => 'Donation not found'
    ]);
    $check_stmt->close();
    exit();
}
$check_stmt->close();

// Delete donation
$delete_query = "DELETE FROM donations WHERE donation_id = ?";
$delete_stmt = $conn->prepare($delete_query);

if (!$delete_stmt) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $conn->error
    ]);
    exit();
}

$delete_stmt->bind_param("i", $donation_id);

if ($delete_stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Donation deleted successfully',
        'donation_id' => $donation_id
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Error deleting donation: ' . $delete_stmt->error
    ]);
}

$delete_stmt->close();
$conn->close();

?>
