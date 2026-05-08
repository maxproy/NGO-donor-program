<?php
/**
 * User/Donor Logout API
 * POST /api/auth/logout.php
 */

require_once '../../includes/session.php';

// Assuming session_start() is handled inside includes/session.php
session_unset();
session_destroy();

header('Content-Type: application/json');
echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
?>
