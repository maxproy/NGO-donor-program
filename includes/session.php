<?php
/**
 * Session Management and Validation
 * NGO Project
 */

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Check if user is logged in
 */
function isLoggedIn() {
    return isset($_SESSION['donor_id']) && isset($_SESSION['role']) && $_SESSION['role'] === 'donor';
}

/**
 * Get current logged-in user ID
 */
function getUserId() {
    return isset($_SESSION['donor_id']) ? $_SESSION['donor_id'] : null;
}

/**
 * Get current logged-in user email
 */
function getUserEmail() {
    return isset($_SESSION['email']) ? $_SESSION['email'] : null;
}

/**
 * Get current logged-in user name
 */
function getUserName() {
    return isset($_SESSION['name']) ? $_SESSION['name'] : null;
}

/**
 * Check if admin is logged in
 */
function isAdminLoggedIn() {
    return isset($_SESSION['admin_id']) && isset($_SESSION['role']) && $_SESSION['role'] === 'admin';
}

/**
 * Get current logged-in admin ID
 */
function getAdminId() {
    return isset($_SESSION['admin_id']) ? $_SESSION['admin_id'] : null;
}

/**
 * Set user session
 */
function setUserSession($donor_id, $email, $full_name) {
    $_SESSION['donor_id'] = $donor_id;
    $_SESSION['email'] = $email;
    $_SESSION['name'] = $full_name;
    $_SESSION['role'] = 'donor';
    $_SESSION['login_time'] = time();
}

/**
 * Destroy user session
 */
function destroyUserSession() {
    session_unset();
    session_destroy();
}

?>
