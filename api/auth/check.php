<?php
/**
 * Verify User/Donor Session
 * GET /api/auth/check.php
 */

require_once '../../includes/session.php';

header('Content-Type: application/json');

$isLoggedIn = isset($_SESSION['donor_id']) && (isset($_SESSION['role']) && $_SESSION['role'] === 'donor');

echo json_encode([
    'success' => true,
    'isLoggedIn' => $isLoggedIn,
    'donor_id' => $isLoggedIn ? $_SESSION['donor_id'] : null,
    'donor_name' => $isLoggedIn ? $_SESSION['name'] : null
]);
?>