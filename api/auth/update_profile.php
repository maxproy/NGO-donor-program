<?php
/**
 * Update Donor Profile
 * POST /api/donors/update_profile.php
 */

require_once '../../config/db.php';
require_once '../../includes/session.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit();
}

if (!isset($_SESSION['donor_id']) || $_SESSION['role'] !== 'donor') {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$donor_id = $_SESSION['donor_id'];
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$id_no = trim($_POST['id_no'] ?? '');

if (empty($name) || empty($email)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Name and email are required']);
    exit();
}

// Prevent taking an email that already belongs to another donor
$email_check = "SELECT donor_id FROM donors WHERE email = ? AND donor_id != ?";
$check_stmt = $conn->prepare($email_check);
$check_stmt->bind_param("si", $email, $donor_id);
$check_stmt->execute();
if ($check_stmt->get_result()->num_rows > 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'This email is already in use']);
    $check_stmt->close();
    exit();
}
$check_stmt->close();

$update_query = "UPDATE donors SET name = ?, email = ?, phone = ?, id_no = ? WHERE donor_id = ?";
$stmt = $conn->prepare($update_query);
$stmt->bind_param("ssssi", $name, $email, $phone, $id_no, $donor_id);

if ($stmt->execute()) {
    $_SESSION['name'] = $name; // Update the session name to reflect the new state immediately
    echo json_encode(['success' => true, 'message' => 'Profile updated successfully']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to update profile']);
}
?>
