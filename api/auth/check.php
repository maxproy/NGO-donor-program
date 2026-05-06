<?php
header('Content-Type: application/json');
$__origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($__origin) {
    header('Access-Control-Allow-Origin: ' . $__origin);
    header('Access-Control-Allow-Credentials: true');
} else {
    header('Access-Control-Allow-Origin: http://localhost');
    header('Access-Control-Allow-Credentials: true');
}
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (empty($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'isLoggedIn' => false]);
    exit;
}

try {
    require_once __DIR__ . '/../../config/db.php';
    $user_id = (int) $_SESSION['user_id'];

    $stmt = $conn->prepare('SELECT user_id, full_name, email FROM users WHERE user_id = ?');
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $res = $stmt->get_result();
    if ($res->num_rows === 0) throw new Exception('User not found');
    $user = $res->fetch_assoc();
    $stmt->close();

    // Get donor info
    $donor = $conn->prepare('SELECT donor_id FROM donors WHERE user_id = ?');
    $donor->bind_param('i', $user_id);
    $donor->execute();
    $donor_res = $donor->get_result();
    $donor_data = $donor_res->fetch_assoc();
    $donor->close();
    $conn->close();

    $donor_id = $donor_data['donor_id'] ?? null;

    echo json_encode([
        'success' => true,
        'isLoggedIn' => true,
        'user_id' => (int) $user['user_id'],
        'email' => $user['email'],
        'donor_name' => $user['full_name'],
        'donor_id' => $donor_id
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'isLoggedIn' => false, 'message' => $e->getMessage()]);
}
?>