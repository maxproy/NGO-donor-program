<?php
/**
 * Get a single donation by ID
 * GET /api/donations/get.php?donation_id=1
 */

require_once '../../config/db.php';
require_once '../../includes/session.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method'
    ]);
    exit();
}

if (!isAdminLoggedIn() && !isLoggedIn()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$donation_id = isset($_GET['donation_id']) ? intval($_GET['donation_id']) : null;

if (!$donation_id) {
    echo json_encode([
        'success' => false,
        'message' => 'Donation ID is required'
    ]);
    exit();
}

// Fetch donation with donor details
$query = "SELECT d.donation_id, d.donor_id, dn.name as donor_name, dn.email as donor_email, 
                 dn.phone as donor_phone, dn.country, dn.city,
                 d.program, d.donation_plan, d.amount, d.payment_method, d.payment_details, 
                 d.status, d.transaction_id, d.donation_date, d.updated_at 
          FROM donations d 
          LEFT JOIN donors dn ON d.donor_id = dn.donor_id 
          WHERE d.donation_id = ?";

$stmt = $conn->prepare($query);

if (!$stmt) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $conn->error
    ]);
    exit();
}

$stmt->bind_param("i", $donation_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        'success' => false,
        'message' => 'Donation not found'
    ]);
    $stmt->close();
    exit();
}

$donation = $result->fetch_assoc();

// If it's a regular user, ensure they own the donation
if (!isAdminLoggedIn() && $donation['donor_id'] != getUserId()) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Access denied']);
    exit();
}

// Decode payment details if it's JSON
if (!empty($donation['payment_details'])) {
    $donation['payment_details'] = json_decode($donation['payment_details'], true);
}

echo json_encode([
    'success' => true,
    'data' => $donation
]);

$stmt->close();
$conn->close();

?>
