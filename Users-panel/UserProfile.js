document.addEventListener("DOMContentLoaded", () => {
    // 1. Check if user is logged in
    const userStr = localStorage.getItem("currentUser");
    
    if (!userStr) {
        // If not logged in, kick them back to login
        window.location.href = "login.html";
        return;
    }
    
    let currentUser = JSON.parse(userStr);

    // 2. Function to populate the View Mode
    function populateView() {
        document.getElementById("view-name").textContent = currentUser.name || "N/A";
        document.getElementById("view-email").textContent = currentUser.email || "N/A";
        document.getElementById("view-phone").textContent = currentUser.phoneno || "N/A";
        document.getElementById("view-idno").textContent = currentUser.idno || "N/A";
    }
    
    // Run it immediately on page load
    populateView();

    // 3. Switch to Edit Mode
    document.getElementById("edit-btn").addEventListener("click", () => {
        document.getElementById("view-section").style.display = "none";
        document.getElementById("edit-section").style.display = "block";

        // Pre-fill the input boxes with current data
        document.getElementById("edit-name").value = currentUser.name;
        document.getElementById("edit-phone").value = currentUser.phoneno || "";
        document.getElementById("edit-idno").value = currentUser.idno || "";
        document.getElementById("edit-email").value = currentUser.email;
    });

    // 4. Cancel Edit Mode
    document.getElementById("cancel-btn").addEventListener("click", () => {
        document.getElementById("view-section").style.display = "block";
        document.getElementById("edit-section").style.display = "none";
    });

    // 5. Save Changes
    document.getElementById("edit-section").addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent page refresh

        // Update the current user object
        currentUser.name = document.getElementById("edit-name").value;
        currentUser.phoneno = document.getElementById("edit-phone").value;
        currentUser.idno = document.getElementById("edit-idno").value;
        
        // Save the updated logged-in user session
        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        // We also must update the master "users" array so changes persist after logging out
        let users = JSON.parse(localStorage.getItem("users")) || [];
        let userIndex = users.findIndex(u => u.email === currentUser.email);
        
        if (userIndex !== -1) {
            users[userIndex].name = currentUser.name;
            users[userIndex].phoneno = currentUser.phoneno;
            users[userIndex].idno = currentUser.idno;
            localStorage.setItem("users", JSON.stringify(users));
        }

        // Refresh the View Mode and switch back to it
        populateView();
        document.getElementById("view-section").style.display = "block";
        document.getElementById("edit-section").style.display = "none";
        alert("Profile updated successfully!");
    });

    // 6. Handle Logout
    document.getElementById("logout-btn").addEventListener("click", () => {
        // Destroy the session and redirect
        localStorage.removeItem("currentUser");
        window.location.href = "login.html";
    });
});