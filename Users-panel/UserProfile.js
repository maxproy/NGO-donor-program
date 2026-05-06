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
