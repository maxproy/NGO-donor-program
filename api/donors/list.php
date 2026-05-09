<?php
/**
 * Get all donors for admin
 * GET /api/donors/list.php
 */

require_once '../../config/db.php';
require_once '../../includes/session.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method'
    ]);
    exit();
}

// Check if admin is logged in
if (!isAdminLoggedIn()) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized - Admin access required'
    ]);
    exit();
}

// Get filter parameters
$name = isset($_GET['name']) ? trim($_GET['name']) : null;
$email = isset($_GET['email']) ? trim($_GET['email']) : null;
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 100;
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;
$sort_by = isset($_GET['sort_by']) ? trim($_GET['sort_by']) : 'created_at';
$sort_order = isset($_GET['sort_order']) ? trim($_GET['sort_order']) : 'DESC';

// Validate sort parameters
$allowed_sort_columns = ['donor_id', 'name', 'email', 'phone', 'created_at'];
if (!in_array($sort_by, $allowed_sort_columns)) {
    $sort_by = 'created_at';
}
if (!in_array(strtoupper($sort_order), ['ASC', 'DESC'])) {
    $sort_order = 'DESC';
}

// Build base query
$query = "SELECT donor_id, name, email, phone, id_no, country, city, created_at, updated_at 
          FROM donors 
          WHERE 1=1";

$params = [];
$types = "";

// Add filters
if ($name !== null) {
    $query .= " AND name LIKE ?";
    $params[] = "%$name%";
    $types .= "s";
}

if ($email !== null) {
    $query .= " AND email LIKE ?";
    $params[] = "%$email%";
    $types .= "s";
}

// Add sorting and pagination
$query .= " ORDER BY " . $sort_by . " " . strtoupper($sort_order);
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

$donors = [];
while ($row = $result->fetch_assoc()) {
    $donors[] = $row;
}

// Get total count
$count_query = "SELECT COUNT(*) as total FROM donors WHERE 1=1";
$count_params = [];
$count_types = "";

if ($name !== null) {
    $count_query .= " AND name LIKE ?";
    $count_params[] = "%$name%";
    $count_types .= "s";
}

if ($email !== null) {
    $count_query .= " AND email LIKE ?";
    $count_params[] = "%$email%";
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
    'data' => $donors,
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