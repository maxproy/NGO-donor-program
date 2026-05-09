<?php
/**
 * Get Donor Profile
 * GET /api/donors/get_profile.php
 */

require_once '../../config/db.php';
require_once '../../includes/session.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit();
}

if (!isset($_SESSION['donor_id']) || !isset($_SESSION['role']) || $_SESSION['role'] !== 'donor') {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized - Donor access required']);
    exit();
}

$donor_id = $_SESSION['donor_id'];

$query = "SELECT donor_id, name, email, phone, id_no, country, city, created_at FROM donors WHERE donor_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $donor_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(['success' => true, 'data' => $result->fetch_assoc()]);
} else {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Profile not found']);
}
?>
