<?php
/**
 * Update an existing donor
 * POST /api/admin/update.php
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

// Get and sanitize inputs (as sent from donor.js)
$donor_id = isset($_POST['donor_id']) ? intval($_POST['donor_id']) : null;
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';

if (!$donor_id || empty($name) || empty($email)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Donor ID, name, and email are required']);
    exit();
}

// Check if the new email belongs to a different donor to prevent duplicates
$email_check_query = "SELECT donor_id FROM donors WHERE email = ? AND donor_id != ?";
$check_stmt = $conn->prepare($email_check_query);
$check_stmt->bind_param("si", $email, $donor_id);
$check_stmt->execute();
if ($check_stmt->get_result()->num_rows > 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'This email is already in use by another donor']);
    $check_stmt->close();
    exit();
}
$check_stmt->close();

// Prepare and execute the update statement
$update_query = "UPDATE donors SET name = ?, email = ?, phone = ? WHERE donor_id = ?";
$stmt = $conn->prepare($update_query);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    exit();
}

$stmt->bind_param("sssi", $name, $email, $phone, $donor_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Donor updated successfully']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to update donor: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
