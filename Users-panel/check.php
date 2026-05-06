<?php
/**
 * Check Donor Session
 * GET /api/auth/check.php
 */

require_once '../../includes/session.php';

header('Content-Type: application/json');

$isLoggedIn = isset($_SESSION['donor_id']);

echo json_encode([
    'success' => true,
    'isLoggedIn' => $isLoggedIn,
    'donor_id' => $isLoggedIn ? $_SESSION['donor_id'] : null,
    'donor_name' => $isLoggedIn ? $_SESSION['donor_name'] : null
]);
?>
<?php
/**
 * Check Donor Session
 * GET /api/auth/check.php
 */

require_once '../../includes/session.php';

header('Content-Type: application/json');

$isLoggedIn = isset($_SESSION['donor_id']);

echo json_encode([
    'success' => true,
    'isLoggedIn' => $isLoggedIn,
    'donor_id' => $isLoggedIn ? $_SESSION['donor_id'] : null,
    'donor_name' => $isLoggedIn ? $_SESSION['donor_name'] : null
]);
?>