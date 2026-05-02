document.addEventListener("DOMContentLoaded", () => {
    // 1. Check if a user is logged in via sessionStorage
    const loggedInEmail = sessionStorage.getItem("loggedInUser");
    
    if (!loggedInEmail) {
        // If no one is logged in, redirect to the login page
        window.location.href = "login.html";
        return;
    }

    // 2. Get the array of all registered users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    
    // 3. Find the specific user that matches the logged-in email
    const currentUser = users.find(user => user.email === loggedInEmail);

    if (currentUser) {
        // 4. Populate the HTML with their data
        document.getElementById("profile-name").textContent = currentUser.name;
        document.getElementById("profile-email").textContent = currentUser.email;
        document.getElementById("profile-phone").textContent = currentUser.phone || "Not provided";
        document.getElementById("profile-address").textContent = currentUser.address || "Not provided";
    } else {
        alert("Error loading user data.");
        sessionStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
    }

    // 5. Handle Logout
    document.getElementById("logout-btn").addEventListener("click", () => {
        sessionStorage.removeItem("loggedInUser"); // Clear the session
        window.location.href = "login.html"; // Send to login page
    });
});