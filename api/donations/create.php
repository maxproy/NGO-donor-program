<?php
/**
 * Create/Add a new donation
 * POST /api/donations/create.php
 */

require_once '../../config/db.php';
require_once '../../includes/session.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method'
    ]);
    exit();
}

// Get and sanitize input
$donor_id = isset($_POST['donor_id']) ? intval($_POST['donor_id']) : (isLoggedIn() ? getUserId() : null);
$program = trim($_POST['program'] ?? '');
$donation_plan = trim($_POST['donation_plan'] ?? ''); // 'one-time' or 'monthly'
$amount = isset($_POST['amount']) ? floatval($_POST['amount']) : 0;
$payment_method = trim($_POST['payment_method'] ?? ''); // 'credit_card', 'paypal', 'mobile', 'bank_transfer'
$payment_details = isset($_POST['payment_details']) ? $_POST['payment_details'] : null;
$status = 'pending'; // Default status
$transaction_id = trim($_POST['transaction_id'] ?? '');

// Validation
$errors = [];

if (!$donor_id) {
    $errors[] = 'Donor ID is required or you must be logged in';
}

if (empty($program) || strlen($program) < 2) {
    $errors[] = 'Program name is required';
}

if (empty($donation_plan) || !in_array($donation_plan, ['one-time', 'monthly'])) {
    $errors[] = 'Valid donation plan is required';
}

if ($amount <= 0) {
    $errors[] = 'Amount must be greater than 0';
}

if (empty($payment_method)) {
    $errors[] = 'Payment method is required';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => implode(', ', $errors)
    ]);
    exit();
}

// Check if donor exists
$donor_check = "SELECT donor_id FROM donors WHERE donor_id = ?";
$donor_stmt = $conn->prepare($donor_check);
$donor_stmt->bind_param("i", $donor_id);
$donor_stmt->execute();
$donor_result = $donor_stmt->get_result();

if ($donor_result->num_rows === 0) {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'message' => 'Donor not found'
    ]);
    $donor_stmt->close();
    exit();
}
$donor_stmt->close();

// Prepare payment details as JSON
$payment_details_json = null;
if (!empty($payment_details)) {
    if (is_array($payment_details)) {
        $payment_details_json = json_encode($payment_details);
    } else {
        $payment_details_json = $payment_details;
    }
}

// Insert donation
$insert_query = "INSERT INTO donations (donor_id, program, donation_plan, amount, payment_method, payment_details, status, transaction_id) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
$insert_stmt = $conn->prepare($insert_query);

if (!$insert_stmt) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $conn->error
    ]);
    exit();
}

$insert_stmt->bind_param(
    "isssdsss",
    $donor_id,
    $program,
    $donation_plan,
    $amount,
    $payment_method,
    $payment_details_json,
    $status,
    $transaction_id
);

if ($insert_stmt->execute()) {
    $donation_id = $insert_stmt->insert_id;
    
    echo json_encode([
        'success' => true,
        'message' => 'Donation created successfully',
        'donation_id' => $donation_id,
        'data' => [
            'donation_id' => $donation_id,
            'donor_id' => $donor_id,
            'program' => $program,
            'donation_plan' => $donation_plan,
            'amount' => $amount,
            'payment_method' => $payment_method,
            'status' => $status,
            'donation_date' => date('Y-m-d H:i:s')
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error creating donation: ' . $insert_stmt->error
    ]);
}

$insert_stmt->close();
$conn->close();

?>
