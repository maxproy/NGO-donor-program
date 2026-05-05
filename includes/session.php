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
    return isset($_SESSION['user_id']) && isset($_SESSION['user_email']);
}

/**
 * Get current logged-in user ID
 */
function getUserId() {
    return isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
}

/**
 * Get current logged-in user email
 */
function getUserEmail() {
    return isset($_SESSION['user_email']) ? $_SESSION['user_email'] : null;
}

/**
 * Get current logged-in user name
 */
function getUserName() {
    return isset($_SESSION['user_name']) ? $_SESSION['user_name'] : null;
}

/**
 * Set user session
 */
function setUserSession($user_id, $email, $full_name) {
    $_SESSION['user_id'] = $user_id;
    $_SESSION['user_email'] = $email;
    $_SESSION['user_name'] = $full_name;
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
