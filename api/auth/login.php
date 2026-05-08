<?php
/**
 * User/Donor Login API
 * POST /api/auth/login.php
 */

require_once '../../config/db.php';
require_once '../../includes/session.php';

header('Content-Type: application/json');

// Ensure the request is a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit();
}

// Support both JSON payload and standard form data
$json_data = json_decode(file_get_contents('php://input'), true);
$post_data = $json_data ?: $_POST;

$email = trim($post_data['email'] ?? '');
$password = $post_data['password'] ?? '';

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email and password are required']);
    exit();
}

$query = "SELECT donor_id, name, password, email FROM donors WHERE email = ?";
$stmt = $conn->prepare($query);

if ($stmt) {
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        
        // Verify password
        if (password_verify($password, $user['password'])) {
            $_SESSION['donor_id'] = $user['donor_id'];
            $_SESSION['name'] = $user['name'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['role'] = 'donor';
            
            echo json_encode(['success' => true, 'message' => 'Login successful', 'donor_id' => $user['donor_id'], 'donor_name' => $user['name']]);
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
        }
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'User not found']);
    }
    $stmt->close();
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
}

$conn->close();
?>