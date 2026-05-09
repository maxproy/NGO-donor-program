<?php
/**
 * Create/Add a new donor (admin only)
 * POST /api/donors/create.php
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

// Get and sanitize input
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$country = trim($_POST['country'] ?? '');
$city = trim($_POST['city'] ?? '');

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

// Check if email already exists
$email_check = "SELECT donor_id FROM donors WHERE email = ?";
$check_stmt = $conn->prepare($email_check);
$check_stmt->bind_param("s", $email);
$check_stmt->execute();
if ($check_stmt->get_result()->num_rows > 0) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'This email is already registered'
    ]);
    $check_stmt->close();
    exit();
}
$check_stmt->close();

// Create donor with default password (they should change it)
$default_password = password_hash('changeme123', PASSWORD_DEFAULT);

$insert_query = "INSERT INTO donors (name, email, phone, password, country, city) VALUES (?, ?, ?, ?, ?, ?)";
$insert_stmt = $conn->prepare($insert_query);

if (!$insert_stmt) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $conn->error
    ]);
    exit();
}

$insert_stmt->bind_param("ssssss", $name, $email, $phone, $default_password, $country, $city);

if ($insert_stmt->execute()) {
    $donor_id = $insert_stmt->insert_id;

    echo json_encode([
        'success' => true,
        'message' => 'Donor created successfully. Default password is "changeme123" - they should change it.',
        'donor_id' => $donor_id,
        'data' => [
            'donor_id' => $donor_id,
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'country' => $country,
            'city' => $city,
            'created_at' => date('Y-m-d H:i:s')
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error creating donor: ' . $insert_stmt->error
    ]);
}

$insert_stmt->close();
$conn->close();

?>