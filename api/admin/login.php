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

$username = trim($_POST['username'] ?? '');
$password = $_POST['password'] ?? '';

if (empty($username) || empty($password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Username and password are required']);
    exit();
}

// Query the database for the admin user
$query = "SELECT admin_id, username, password, role FROM admin_users WHERE username = ?";
$stmt = $conn->prepare($query);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    exit();
}

$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $admin = $result->fetch_assoc();
    
    // Verify password (supports both secure hashes and plain text for easy testing)
    if (password_verify($password, $admin['password']) || $password === $admin['password']) {
        
        // Setup the secure session variables
        $_SESSION['admin_id'] = $admin['admin_id'];
        $_SESSION['role'] = $admin['role'];
        $_SESSION['admin_username'] = $admin['username'];
        
        // Update the last_login timestamp
        $update_login = "UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE admin_id = ?";
        $update_stmt = $conn->prepare($update_login);
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
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
}

$stmt->close();
$conn->close();
?>