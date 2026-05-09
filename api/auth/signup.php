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

// Check if the request is sending JSON instead of standard form data
$json_data = json_decode(file_get_contents('php://input'), true);
$post_data = $json_data ?: $_POST;

// Capture data
$name = trim($post_data['name'] ?? '');
$email = trim($post_data['email'] ?? '');
$password = $post_data['password'] ?? '';
$phone = trim($post_data['phone'] ?? '');
$country = trim($post_data['country'] ?? '');
$city = trim($post_data['city'] ?? '');

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
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    exit();
}

// 2. Hash the password securely
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// 3. Insert the new user into the donors table
$insert_query = "INSERT INTO donors (name, email, password, phone, country, city) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($insert_query);

if ($stmt) {
    $stmt->bind_param("ssssss", $name, $email, $hashed_password, $phone, $country, $city);
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Registration successful. You can now login.']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Registration failed: ' . $stmt->error]);
    }
    $stmt->close();
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
}

$conn->close();
?>
