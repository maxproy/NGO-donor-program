document.addEventListener("DOMContentLoaded", async () => {
    // 1. Check if user is logged in
    let currentUser = null;
    
    try {
        const response = await fetch('../api/users/profile.php', { credentials: 'include' });
        const result = await response.json();
        
        if (!result.success) {
            window.location.href = "login.html";
            return;
        }
        currentUser = result.data;
    } catch (error) {
        console.error("Error fetching profile:", error);
        window.location.href = "login.html";
        return;
    }

    // 2. Function to populate the View Mode
    function populateView() {
        document.getElementById("view-name").textContent = currentUser.name || "N/A";
        document.getElementById("view-email").textContent = currentUser.email || "N/A";
        document.getElementById("view-phone").textContent = currentUser.phone || currentUser.phoneno || "N/A";
        document.getElementById("view-idno").textContent = currentUser.id_no || currentUser.idno || "N/A";
    }
    
    // Run it immediately on page load
    populateView();

    // 3. Switch to Edit Mode
    document.getElementById("edit-btn").addEventListener("click", () => {
        document.getElementById("view-section").style.display = "none";
        document.getElementById("edit-section").style.display = "block";

        // Pre-fill the input boxes with current data
        document.getElementById("edit-name").value = currentUser.name;
        document.getElementById("edit-phone").value = currentUser.phone || currentUser.phoneno || "";
        document.getElementById("edit-idno").value = currentUser.id_no || currentUser.idno || "";
        document.getElementById("edit-email").value = currentUser.email;
    });

    // 4. Cancel Edit Mode
    document.getElementById("cancel-btn").addEventListener("click", () => {
        document.getElementById("view-section").style.display = "block";
        document.getElementById("edit-section").style.display = "none";
    });

    // 5. Save Changes
    document.getElementById("edit-section").addEventListener("submit", async (e) => {
        e.preventDefault(); // Prevent page refresh

        const formData = new FormData();
        formData.append("name", document.getElementById("edit-name").value);
        formData.append("phone", document.getElementById("edit-phone").value);
        formData.append("id_no", document.getElementById("edit-idno").value);

        try {
            const response = await fetch('../api/users/update.php', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
            const result = await response.json();

            if (result.success) {
                // Update the local current user object to reflect changes
                currentUser.name = document.getElementById("edit-name").value;
                currentUser.phone = document.getElementById("edit-phone").value;
                currentUser.id_no = document.getElementById("edit-idno").value;

                populateView();
                document.getElementById("view-section").style.display = "block";
                document.getElementById("edit-section").style.display = "none";
                alert("Profile updated successfully!");
            } else {
                alert("Failed to update profile: " + result.message);
            }
        } catch (error) {
            console.error("Update error:", error);
            alert("An error occurred while updating the profile.");
        }
    });

    // 6. Handle Logout
    document.getElementById("logout-btn").addEventListener("click", async () => {
        try {
            await fetch('../api/auth/logout.php', { 
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error("Logout error:", error);
        }
        window.location.href = "login.html";
    });
});