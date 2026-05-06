<?php
/**
 * Donor Login API
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
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $donor = $result->fetch_assoc();
    
    // Only allow login if a password exists and matches
    if (!empty($donor['password']) && password_verify($password, $donor['password'])) {
        $_SESSION['donor_id'] = $donor['donor_id'];
        $_SESSION['donor_name'] = $donor['name'];
        $_SESSION['donor_email'] = $donor['email'];
        
        echo json_encode(['success' => true, 'message' => 'Login successful', 'donor_id' => $donor['donor_id']]);
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
    }
} else {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
}

$stmt->close();
$conn->close();
?>
