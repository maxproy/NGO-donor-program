<?php
/**
 * Admin Login API
 * POST /api/admin/login.php
 */

require_once '../../config/db.php';
require_once '../../includes/session.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit();
}

// Support both JSON payload and standard form data
$json_data = json_decode(file_get_contents('php://input'), true);
$post_data = $json_data ?: $_POST;

$username = trim($post_data['username'] ?? '');
$password = $post_data['password'] ?? '';

if (empty($username) || empty($password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Username and password are required']);
    exit();
}

$query = "SELECT admin_id, username, password, role FROM admin_users WHERE username = ?";
$stmt = $conn->prepare($query);

if ($stmt) {
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $admin = $result->fetch_assoc();
        
        if ($password === $admin['password']) {
            // Prevent session fixation attacks for high-privilege accounts
            session_regenerate_id(true);
            
            $_SESSION['admin_id'] = $admin['admin_id'];
            $_SESSION['username'] = $admin['username'];
            $_SESSION['role'] = 'admin'; // Must be 'admin' to match check.php
            
            // Update last_login timestamp
            $update_stmt = $conn->prepare("UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE admin_id = ?");
            if ($update_stmt) {
                $update_stmt->bind_param("i", $admin['admin_id']);
                $update_stmt->execute();
                $update_stmt->close();
            }
            
            echo json_encode(['success' => true, 'message' => 'Login successful']);
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
        }
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Admin user not found']);
    }
    $stmt->close();
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
}
$conn->close();
?>