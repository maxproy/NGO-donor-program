// Check if the session token exists
if (sessionStorage.getItem('isAdminLoggedIn') !== 'true') {
    // If not logged in, redirect back to the login page
    window.location.href = 'admin-login.html'; 
}

// Function to handle logging out
function adminLogout() {
    sessionStorage.removeItem('isAdminLoggedIn');
    window.location.href = 'admin-login.html';
}