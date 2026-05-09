<?php
/**
 * Delete a donor (admin only)
 * POST /api/donors/delete.php
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

// Get donor ID
$donor_id = isset($_POST['donor_id']) ? intval($_POST['donor_id']) : 0;

if ($donor_id <= 0) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Valid donor ID is required'
    ]);
    exit();
}

// Check if donor exists
$check_query = "SELECT donor_id FROM donors WHERE donor_id = ?";
$check_stmt = $conn->prepare($check_query);
$check_stmt->bind_param("i", $donor_id);
$check_stmt->execute();
$check_result = $check_stmt->get_result();

if ($check_result->num_rows === 0) {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'message' => 'Donor not found'
    ]);
    $check_stmt->close();
    exit();
}
$check_stmt->close();

// Check if donor has donations (optional: prevent deletion if they have donations)
$donation_check = "SELECT COUNT(*) as count FROM donations WHERE donor_id = ?";
$donation_stmt = $conn->prepare($donation_check);
$donation_stmt->bind_param("i", $donor_id);
$donation_stmt->execute();
$donation_result = $donation_stmt->get_result();
$donation_row = $donation_result->fetch_assoc();

if ($donation_row['count'] > 0) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Cannot delete donor with existing donations. Delete donations first.'
    ]);
    $donation_stmt->close();
    exit();
}
$donation_stmt->close();

// Delete donor
$delete_query = "DELETE FROM donors WHERE donor_id = ?";
$delete_stmt = $conn->prepare($delete_query);

if (!$delete_stmt) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $conn->error
    ]);
    exit();
}

$delete_stmt->bind_param("i", $donor_id);

if ($delete_stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Donor deleted successfully'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error deleting donor: ' . $delete_stmt->error
    ]);
}

$delete_stmt->close();
$conn->close();

?>