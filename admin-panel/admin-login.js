document.getElementById('adminLoginForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent page reload
    
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-msg');

    try {
        // Creates a FormData object
        const formData = new FormData();
        formData.append("username", user);
        formData.append("password", pass);

        const response = await fetch('../api/admin/login.php', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });
        
        const result = await response.json();

        if (result.success) {
            window.location.href = 'admin.html'; 
        } else {
            errorMsg.textContent = result.message || 'Invalid credentials';
            errorMsg.style.display = 'block';
        }
    } catch (error) {
        console.error("Login error:", error);
        errorMsg.textContent = 'An error occurred during login. Please try again.';
        errorMsg.style.display = 'block';
    }
});
