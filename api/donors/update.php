<?php
/**
 * Update donor information (admin only)
 * POST /api/donors/update.php
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
$donor_check = "SELECT donor_id FROM donors WHERE donor_id = ?";
$donor_stmt = $conn->prepare($donor_check);
$donor_stmt->bind_param("i", $donor_id);
$donor_stmt->execute();
$donor_result = $donor_stmt->get_result();

if ($donor_result->num_rows === 0) {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'message' => 'Donor not found'
    ]);
    $donor_stmt->close();
    exit();
}
$donor_stmt->close();

// Get and sanitize input
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');

// Validation
$errors = [];

if (empty($name) || strlen($name) < 2) {
    $errors[] = 'Name is required and must be at least 2 characters';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Valid email is required';
}

if (!empty($phone) && !preg_match('/^[0-9+\-\s()]+$/', $phone)) {
    $errors[] = 'Invalid phone number format';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => implode(', ', $errors)
    ]);
    exit();
}

// Prevent taking an email that already belongs to another donor
$email_check = "SELECT donor_id FROM donors WHERE email = ? AND donor_id != ?";
$check_stmt = $conn->prepare($email_check);
$check_stmt->bind_param("si", $email, $donor_id);
$check_stmt->execute();
if ($check_stmt->get_result()->num_rows > 0) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'This email is already in use by another donor'
    ]);
    $check_stmt->close();
    exit();
}
$check_stmt->close();

// Update donor
$update_query = "UPDATE donors SET name = ?, email = ?, phone = ?, updated_at = CURRENT_TIMESTAMP WHERE donor_id = ?";
$update_stmt = $conn->prepare($update_query);

if (!$update_stmt) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $conn->error
    ]);
    exit();
}

$update_stmt->bind_param("sssi", $name, $email, $phone, $donor_id);

if ($update_stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Donor updated successfully',
        'data' => [
            'donor_id' => $donor_id,
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'updated_at' => date('Y-m-d H:i:s')
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error updating donor: ' . $update_stmt->error
    ]);
}

$update_stmt->close();
$conn->close();

?>