<?php
/**
 * Get all donations or filter by criteria
 * GET /api/donations/list.php?donor_id=1&status=pending&program=education
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

// Get filter parameters
$donor_id = isset($_GET['donor_id']) ? intval($_GET['donor_id']) : null;

// Security Check: Admins see all, but normal users can ONLY see their own records.
if (!isAdminLoggedIn()) {
    if (!isLoggedIn() || $donor_id != getUserId()) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
        exit();
    }
    // Force donor_id to match the logged-in user
    $donor_id = getUserId();
}

$program = isset($_GET['program']) ? trim($_GET['program']) : null;
$status = isset($_GET['status']) ? trim($_GET['status']) : null;
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 100;
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;
$sort_by = isset($_GET['sort_by']) ? trim($_GET['sort_by']) : 'donation_date';
$sort_order = isset($_GET['sort_order']) ? trim($_GET['sort_order']) : 'DESC';

// Validate sort parameters
$allowed_sort_columns = ['donation_id', 'donor_id', 'amount', 'donation_date', 'status'];
if (!in_array($sort_by, $allowed_sort_columns)) {
    $sort_by = 'donation_date';
}
if (!in_array(strtoupper($sort_order), ['ASC', 'DESC'])) {
    $sort_order = 'DESC';
}

// Build base query
$query = "SELECT d.donation_id, d.donor_id, dn.name as donor_name, dn.email as donor_email, 
                 d.program, d.donation_plan, d.amount, d.payment_method, d.status, 
                 d.transaction_id, d.donation_date, d.updated_at 
          FROM donations d 
          LEFT JOIN donors dn ON d.donor_id = dn.donor_id 
          WHERE 1=1";

$params = [];
$types = "";

// Add filters
if ($donor_id !== null) {
    $query .= " AND d.donor_id = ?";
    $params[] = $donor_id;
    $types .= "i";
}

if ($program !== null) {
    $query .= " AND d.program LIKE ?";
    $params[] = "%$program%";
    $types .= "s";
}

if ($status !== null) {
    $query .= " AND d.status = ?";
    $params[] = $status;
    $types .= "s";
}

// Add sorting and pagination
$query .= " ORDER BY d." . $sort_by . " " . strtoupper($sort_order);
$query .= " LIMIT ? OFFSET ?";
$params[] = $limit;
$params[] = $offset;
$types .= "ii";

// Execute query
$stmt = $conn->prepare($query);

if (!$stmt) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $conn->error
    ]);
    exit();
}

if (!empty($types)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

$donations = [];
while ($row = $result->fetch_assoc()) {
    $donations[] = $row;
}

// Get total count
$count_query = "SELECT COUNT(*) as total FROM donations d WHERE 1=1";
$count_params = [];
$count_types = "";

if ($donor_id !== null) {
    $count_query .= " AND d.donor_id = ?";
    $count_params[] = $donor_id;
    $count_types .= "i";
}
if ($program !== null) {
    $count_query .= " AND d.program LIKE ?";
    $count_params[] = "%$program%";
    $count_types .= "s";
}
if ($status !== null) {
    $count_query .= " AND d.status = ?";
    $count_params[] = $status;
    $count_types .= "s";
}

$count_stmt = $conn->prepare($count_query);
if ($count_params) {
    $count_stmt->bind_param($count_types, ...$count_params);
}
$count_stmt->execute();
$count_result = $count_stmt->get_result();
$count_row = $count_result->fetch_assoc();
$total = $count_row['total'];

echo json_encode([
    'success' => true,
    'data' => $donations,
    'pagination' => [
        'total' => $total,
        'limit' => $limit,
        'offset' => $offset,
        'page' => floor($offset / $limit) + 1
    ]
]);

$stmt->close();
$count_stmt->close();
$conn->close();

?>
