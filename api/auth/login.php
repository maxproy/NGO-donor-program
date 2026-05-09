<?php
/**
 * Public Donor Login API
 * POST /api/auth/login.php
 */

require_once '../../config/db.php';
require_once '../../includes/session.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit();
}

$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email and password are required']);
    exit();
}

$query = "SELECT donor_id, name, email, password FROM donors WHERE email = ?";
$stmt = $conn->prepare($query);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    exit();
}

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $donor = $result->fetch_assoc();
    
    // Verify the hashed password
    if (password_verify($password, $donor['password'])) {
        session_regenerate_id(true); // Security: prevent session fixation
        setUserSession($donor['donor_id'], $donor['email'], $donor['name']);
        echo json_encode(['success' => true, 'message' => 'Login successful']);
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
    }
} else {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Account not found. Please register first.']);
}

$stmt->close();
$conn->close();
?>