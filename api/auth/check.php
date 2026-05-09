<?php
/**
 * Verify Public Donor Session
 * GET /api/auth/check.php
 */

require_once '../../includes/session.php';

header('Content-Type: application/json');

// Verify if the user is a logged-in donor
if (isLoggedIn()) {
    echo json_encode([
        'success' => true,
        'isLoggedIn' => true,
        'donor_id' => getUserId(),
        'donor_name' => getUserName(),
        'donor_email' => getUserEmail()
    ]);
} else {
    echo json_encode([
        'success' => true,
        'isLoggedIn' => false
    ]);
}
?>