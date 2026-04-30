document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent page reload
    
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    // Hardcoded credentials for demonstration
    if (user === 'admin' && pass === 'admin123') {
        // Set a session token so the admin pages know we are authenticated
        sessionStorage.setItem('isAdminLoggedIn', 'true');
        
        // Redirect to the admin dashboard (assuming it is in the admin-panel folder)
        window.location.href = 'admin.html'; 
    } else {
        // Show error message
        document.getElementById('error-msg').style.display = 'block';
    }
});
