<?php
/**
 * User Registration API
 * POST /api/auth/register.php
 */

require_once '../../config/db.php';

header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit();
}

// Get and sanitize POST data
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';
$id_no = trim($_POST['id_no'] ?? '');
$phone = trim($_POST['phone'] ?? '');

// Basic validation
if (empty($name) || empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Name, email, and password are required.']);
    exit();
}

// Check if the email already exists in the database
$check_query = "SELECT donor_id FROM donors WHERE email = ?";
$check_stmt = $conn->prepare($check_query);
$check_stmt->bind_param("s", $email);
$check_stmt->execute();
$result = $check_stmt->get_result();

if ($result->num_rows > 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'This email is already registered.']);
    $check_stmt->close();
    exit();
}
$check_stmt->close();

// Hash the password for security
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Insert the new user into the donors table
$insert_query = "INSERT INTO donors (name, email, password, id_no, phone) VALUES (?, ?, ?, ?, ?)";
$insert_stmt = $conn->prepare($insert_query);

$insert_stmt->bind_param("sssss", $name, $email, $hashed_password, $id_no, $phone);

if ($insert_stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Account created successfully']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to register account: ' . $insert_stmt->error]);
}

$insert_stmt->close();
$conn->close();
?>