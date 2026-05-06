document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 1. Fetch overall donation stats
        const statsResponse = await fetch('../api/donations/stats.php', { credentials: 'include' });
        const statsResult = await statsResponse.json();

        if (statsResult.success) {
            const totalAmount = parseFloat(statsResult.summary.total_amount || 0);
            document.getElementById("totalDonations").textContent = "$" + totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
            
            // Note: Since stats.php currently returns total_donations, we'll use it as a proxy for total donors here.
            // You can easily update this later if you add a specific unique donors count to your API.
            document.getElementById("totalDonors").textContent = statsResult.summary.total_donations || 0;
        }

        // 2. Fetch "This Month" stats using the newly added date filters
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
        
        const monthlyStatsResponse = await fetch(`../api/donations/stats.php?start_date=${firstDay}&end_date=${lastDay}`, { credentials: 'include' });
        const monthlyStatsResult = await monthlyStatsResponse.json();

        if (monthlyStatsResult.success) {
            const monthlyAmount = parseFloat(monthlyStatsResult.summary.total_amount || 0);
            document.getElementById("monthlyDonations").textContent = "$" + monthlyAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        }

        // 3. Fetch Recent Donations for the table
        const recentResponse = await fetch('../api/donations/list.php?limit=5&sort_by=donation_date&sort_order=DESC', { credentials: 'include' });
        const recentResult = await recentResponse.json();

        const tableBody = document.getElementById("donationTable");
        tableBody.innerHTML = "";

        if (recentResult.success && recentResult.data && recentResult.data.length > 0) {
            recentResult.data.forEach(donation => {
                const date = new Date(donation.donation_date).toLocaleDateString();
                const amount = parseFloat(donation.amount).toFixed(2);
                const name = donation.donor_name || 'Anonymous';
                
                tableBody.innerHTML += `<tr><td>${name}</td><td>$${amount}</td><td>${date}</td></tr>`;
            });
        } else {
            tableBody.innerHTML = "<tr><td colspan='3' style='text-align: center;'>No recent donations found</td></tr>";
        }
    } catch (error) {
        console.error("Error loading dashboard data:", error);
        document.getElementById("donationTable").innerHTML = "<tr><td colspan='3' style='text-align: center; color: red;'>Failed to load data</td></tr>";
    }
});
