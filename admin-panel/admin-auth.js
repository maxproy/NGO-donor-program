document.addEventListener("DOMContentLoaded", async () => {
    // Check if the session token exists securely via PHP
    try {
        const response = await fetch('../api/admin/check.php', { credentials: 'include' });
        const result = await response.json();
        
        if (!result.success || !result.isLoggedIn) {
            window.location.href = 'admin-login.html'; 
        }
    } catch (error) {
        console.error("Auth check failed:", error);
        window.location.href = 'admin-login.html';
    }
});

// Function to handle logging out
async function adminLogout() {
    try {
        await fetch('../api/admin/logout.php', { method: 'POST', credentials: 'include' });
    } catch (error) {
        console.error("Logout failed:", error);
    }
    window.location.href = 'admin-login.html';
}
