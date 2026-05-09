<?php
/**
 * Public Donor Logout API
 * POST /api/auth/logout.php
 */

require_once '../../includes/session.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit();
}

// Destroy the current public session
destroyUserSession();

echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
?>