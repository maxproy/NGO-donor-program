<?php
// config/db.php

define('DB_HOST', 'localhost');
define('DB_USER', 'root'); // XAMPP default is 'root'
define('DB_PASSWORD', ''); // XAMPP default password is empty
define('DB_NAME', 'ngo_project'); 

// Create connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
