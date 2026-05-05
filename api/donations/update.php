<?php
/**
 * Update donation status or details
 * POST /api/donations/update.php
 */

require_once '../../config/db.php';
require_once '../../includes/session.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method'
    ]);
    exit();
}

$donation_id = isset($_POST['donation_id']) ? intval($_POST['donation_id']) : null;
$status = isset($_POST['status']) ? trim($_POST['status']) : null;
$transaction_id = isset($_POST['transaction_id']) ? trim($_POST['transaction_id']) : null;
$payment_details = isset($_POST['payment_details']) ? $_POST['payment_details'] : null;

if (!$donation_id) {
    echo json_encode([
        'success' => false,
        'message' => 'Donation ID is required'
    ]);
    exit();
}

// Validate status if provided
$valid_statuses = ['pending', 'completed', 'failed', 'cancelled', 'processing'];
if ($status !== null && !in_array($status, $valid_statuses)) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid status. Allowed: ' . implode(', ', $valid_statuses)
    ]);
    exit();
}

// Check if donation exists
$check_query = "SELECT donation_id FROM donations WHERE donation_id = ?";
$check_stmt = $conn->prepare($check_query);
$check_stmt->bind_param("i", $donation_id);
$check_stmt->execute();
$check_result = $check_stmt->get_result();

if ($check_result->num_rows === 0) {
    echo json_encode([
        'success' => false,
        'message' => 'Donation not found'
    ]);
    $check_stmt->close();
    exit();
}
$check_stmt->close();

// Build dynamic update query
$updates = [];
$params = [];
$types = "";

if ($status !== null) {
    $updates[] = "status = ?";
    $params[] = $status;
    $types .= "s";
}

if ($transaction_id !== null) {
    $updates[] = "transaction_id = ?";
    $params[] = $transaction_id;
    $types .= "s";
}

if ($payment_details !== null) {
    $updates[] = "payment_details = ?";
    $payment_details_json = is_array($payment_details) ? json_encode($payment_details) : $payment_details;
    $params[] = $payment_details_json;
    $types .= "s";
}

if (empty($updates)) {
    echo json_encode([
        'success' => false,
        'message' => 'No fields to update'
    ]);
    exit();
}

$updates[] = "updated_at = CURRENT_TIMESTAMP";
$params[] = $donation_id;
$types .= "i";

$update_query = "UPDATE donations SET " . implode(", ", $updates) . " WHERE donation_id = ?";

$stmt = $conn->prepare($update_query);

if (!$stmt) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $conn->error
    ]);
    exit();
}

$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Donation updated successfully',
        'donation_id' => $donation_id
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Error updating donation: ' . $stmt->error
    ]);
}

$stmt->close();
$conn->close();

?>
