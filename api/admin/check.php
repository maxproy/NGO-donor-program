<?php
/**
 * Verify Admin Session
 * GET /api/admin/check.php
 */

require_once '../../includes/session.php';

header('Content-Type: application/json');

// Check if the admin_id is set in the session AND the role is explicitly set to 'admin'
$isAdminLoggedIn = isset($_SESSION['admin_id']) && (isset($_SESSION['role']) && $_SESSION['role'] === 'admin');

echo json_encode([
    'success' => true,
    'isLoggedIn' => $isAdminLoggedIn,
    'admin_id' => isset($_SESSION['admin_id']) ? $_SESSION['admin_id'] : null
]);
?>
