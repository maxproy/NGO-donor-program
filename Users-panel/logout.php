<?php
/**
 * Donor Logout API
 * POST or GET /api/auth/logout.php
 */

require_once '../../includes/session.php';

header('Content-Type: application/json');

// Unset all session variables
$_SESSION = array();

// Destroy the session entirely
session_destroy();

echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
?>