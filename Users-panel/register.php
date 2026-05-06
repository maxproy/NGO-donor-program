<?php
/**
 * Donor Registration API
 * POST /api/auth/register.php
 */

require_once '../../config/db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit();
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$password = $_POST['password'] ?? '';

if (empty($name) || empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Name, email, and password are required']);
    exit();
}

// Check if email already exists
$check_query = "SELECT donor_id FROM donors WHERE email = ?";
$check_stmt = $conn->prepare($check_query);
$check_stmt->bind_param("s", $email);
$check_stmt->execute();
if ($check_stmt->get_result()->num_rows > 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email already registered']);
    $check_stmt->close();
    exit();
}
$check_stmt->close();

$hashed_password = password_hash($password, PASSWORD_DEFAULT);
$insert_query = "INSERT INTO donors (name, email, phone, password) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($insert_query);
$stmt->bind_param("ssss", $name, $email, $phone, $hashed_password);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Registration successful. You can now login.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Registration failed: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>