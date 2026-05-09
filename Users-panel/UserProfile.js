    document.addEventListener("DOMContentLoaded", async () => {
        // 1. Verify User is Logged In
        let user = null;
        try {
            const authResponse = await fetch('../api/auth/check.php', { credentials: 'include' });
            const authResult = await authResponse.json();
            if (!authResult.success || !authResult.isLoggedIn) {
                window.location.href = 'login.html'; // Redirect securely if not logged in
                return;
            }
            user = authResult;
            document.getElementById('userName').textContent = user.donor_name;
            
            // Load Profile Details
            await loadProfileData();
        } catch (error) {
            console.error("Auth check failed:", error);
            window.location.href = 'login.html';
            return;
        }
       // 2. Fetch User's Specific Donations
        try {
            // Pass the donor_id safely to our list.php API
            const res = await fetch(`../api/donations/list.php?donor_id=${user.donor_id}&sort_by=donation_date&sort_order=DESC`, { credentials: 'include' });
            const result = await res.json();
            
            const tbody = document.getElementById('donationsBody');
            tbody.innerHTML = ''; // clear loading text

         if (result.success && result.data && result.data.length > 0) {
                result.data.forEach(donation => {
                    // Format details gracefully
                    const date = new Date(donation.donation_date).toLocaleDateString();
                    const statusClass = `status-${donation.status.toLowerCase()}`;
                    const method = donation.payment_method.replace('_', ' ');
                    
                    tbody.innerHTML += `
                        <tr>
                            <td>${date}</td>
                            <td>${donation.program}</td>
                            <td>$${parseFloat(donation.amount).toFixed(2)}</td>
                            <td style="text-transform: capitalize;">${method}</td>
                            <td class="${statusClass}" style="text-transform: capitalize;">${donation.status}</td>
                        </tr>
                    `;
                });
            } else {
                tbody.innerHTML = `<tr><td colspan="5" class="empty-state">You haven't made any donations yet. <br><br> <a href="Donation_form.html" style="color: #1f7a4c; font-weight: bold; text-decoration: none;">Make your first donation!</a></td></tr>`;
            }
        } catch (error) {
            console.error("Failed to load donations:", error);
            document.getElementById('donationsBody').innerHTML = `<tr><td colspan="5" style="text-align: center; color: red;">Failed to load donation history.</td></tr>`;
        }
    });

// 3. Logout function (defined globally so onclick handler can access it)
async function logout() {
    try {
        await fetch('../api/auth/logout.php', { method: 'POST', credentials: 'include' });
        window.location.href = 'index.html';
    } catch (error) {
        console.error("Logout failed:", error);
        alert("Logout failed. Please try again.");
    }
}

// 4. Load Profile Data
async function loadProfileData() {
    try {
        const res = await fetch('../api/donors/get_profile.php', { credentials: 'include' });
        const result = await res.json();
        if (result.success && result.data) {
            renderProfileUI(result.data);
        } else {
            console.error("Profile load failed:", result.message);
            document.getElementById('viewName').innerHTML = `<span style="color:red; font-weight:bold;">Error: ${result.message}</span>`;
        }
    } catch (error) {
        console.error("Error loading profile:", error);
        document.getElementById('viewName').innerHTML = `<span style="color:red; font-weight:bold;">Network/Parse Error. Please check F12 Console.</span>`;
    }
}

// 5. Render Profile View & Edit Modes
function renderProfileUI(user) {
    // Update View fields
    document.getElementById('viewName').textContent = user.name;
    document.getElementById('viewEmail').textContent = user.email;
    document.getElementById('viewPhone').textContent = user.phone || 'N/A';
    document.getElementById('viewIdNo').textContent = user.id_no || 'N/A';
    if (document.getElementById('viewCountry')) document.getElementById('viewCountry').textContent = user.country || 'N/A';
    if (document.getElementById('viewCity')) document.getElementById('viewCity').textContent = user.city || 'N/A';

    // Update Edit Form fields
    document.getElementById('editName').value = user.name;
    document.getElementById('editEmail').value = user.email;
    document.getElementById('editPhone').value = user.phone || '';
    document.getElementById('editIdNo').value = user.id_no || '';
    if (document.getElementById('editCountry')) document.getElementById('editCountry').value = user.country || '';
    if (document.getElementById('editCity')) document.getElementById('editCity').value = user.city || '';
    document.getElementById('editPassword').value = ''; // Always empty on load

    // Prevent duplicate event listeners if this is called multiple times
    const form = document.getElementById('editProfileForm');
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);

    newForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', document.getElementById('editName').value);
        formData.append('email', document.getElementById('editEmail').value);
        formData.append('phone', document.getElementById('editPhone').value);
        formData.append('id_no', document.getElementById('editIdNo').value);
        if (document.getElementById('editCountry')) formData.append('country', document.getElementById('editCountry').value);
        if (document.getElementById('editCity')) formData.append('city', document.getElementById('editCity').value);
        formData.append('password', document.getElementById('editPassword').value);

        const res = await fetch('../api/donors/update_profile.php', { method: 'POST', body: formData, credentials: 'include' });
        const result = await res.json();
        if (result.success) {
            document.getElementById('userName').textContent = document.getElementById('editName').value; // Update header greeting dynamically
            loadProfileData(); // Re-render everything with the new updated DB state
            toggleEditMode(false); // Hide the form on success
            alert("Profile details successfully updated!");
        } else {
            alert('Update failed: ' + (result.message || 'Unknown error'));
        }
    });
}

function toggleEditMode(showEdit) {
    document.getElementById('viewMode').style.display = showEdit ? 'none' : 'block';
    document.getElementById('editMode').style.display = showEdit ? 'block' : 'none';
}
