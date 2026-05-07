<?php
/**
 * User/Donor Signup API
 * POST /api/auth/signup.php
 */

require_once '../../config/db.php';

header('Content-Type: application/json');

// Ensure the request is a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit();
}

// Capture data sent via FormData
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';
$phone = trim($_POST['phone'] ?? '');

// Validate required fields
if (empty($name) || empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Name, email, and password are required']);
    exit();
}

// 1. Check if the email already exists in the database
$check_query = "SELECT donor_id FROM donors WHERE email = ?";
$check_stmt = $conn->prepare($check_query);

if ($check_stmt) {
    $check_stmt->bind_param("s", $email);
    $check_stmt->execute();
    if ($check_stmt->get_result()->num_rows > 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Email already registered']);
        $check_stmt->close();
        exit();
    }
    $check_stmt->close();
}

// 2. Hash the password securely
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// 3. Insert the new user into the donors table
$insert_query = "INSERT INTO donors (name, email, password, phone) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($insert_query);

if ($stmt) {
    $stmt->bind_param("ssss", $name, $email, $hashed_password, $phone);
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Registration successful. You can now login.']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Registration failed: ' . $stmt->error]);
    }
    $stmt->close();
}

$conn->close();
?>
