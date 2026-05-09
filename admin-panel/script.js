document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 1. Fetch overall donation stats
        const statsResponse = await fetch('../api/donations/stats.php', { credentials: 'include' });
        const statsResult = await statsResponse.json();

        if (statsResult.success) {
            const totalAmount = parseFloat(statsResult.summary.total_amount || 0);
            document.getElementById("totalDonations").textContent = "$" + totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        }

        // Fetch actual total donors count
        const donorsResponse = await fetch('../api/donors/list.php?limit=1', { credentials: 'include' });
        const donorsResult = await donorsResponse.json();
        if (donorsResult.success) {
            document.getElementById("totalDonors").textContent = donorsResult.pagination.total || 0;
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

                // Beautiful status badges
                const statusClass = donation.status === 'completed' ? 'badge-completed' : 'badge-pending';
                const statusText = donation.status ? donation.status.charAt(0).toUpperCase() + donation.status.slice(1) : 'Pending';
                
                tableBody.innerHTML += `<tr><td>${name}</td><td>$${amount}</td><td>${date}</td><td><span class="badge ${statusClass}">${statusText}</span></td></tr>`;
            });
        } else {
            tableBody.innerHTML = "<tr><td colspan='4' style='text-align: center;'>No recent donations found</td></tr>";
        }

        // 4. Fetch Active Programs for the dashboard
        const programsResponse = await fetch('../api/programs/list.php?status=active', { credentials: 'include' });
        
        const progTableBody = document.getElementById("dashboardProgramTable");
        if (progTableBody) {
            progTableBody.innerHTML = "";
            
            if (!programsResponse.ok) {
                progTableBody.innerHTML = `<tr><td colspan='4' style='text-align: center; color: red;'>Error: Programs API not found (${programsResponse.status})</td></tr>`;
            } else {
                const programsResult = await programsResponse.json();
                if (programsResult.success && programsResult.data && programsResult.data.length > 0) {
                programsResult.data.slice(0, 4).forEach(prog => {
                    const target = parseFloat(prog.target_amount);
                    const current = parseFloat(prog.current_amount);
                    let progress = 0;
                    if (target > 0) progress = Math.min(100, (current / target) * 100).toFixed(1);
                    
                    progTableBody.innerHTML += `
                        <tr>
                            <td><strong>${prog.name}</strong></td>
                            <td>$${target.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                            <td>$${current.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                            <td>
                                <div style="background-color: #e0e0e0; border-radius: 4px; width: 100%; height: 8px; margin-bottom: 4px;">
                                    <div style="background-color: #1f7a4c; height: 100%; border-radius: 4px; width: ${progress}%;"></div>
                                </div>
                                <small style="font-weight:bold;">${progress}%</small>
                            </td>
                        </tr>
                    `;
                });
            } else {
                progTableBody.innerHTML = "<tr><td colspan='4' style='text-align: center;'>No active programs found</td></tr>";
            }
            }
        }
    } catch (error) {
        console.error("Error loading dashboard data:", error);
        document.getElementById("donationTable").innerHTML = "<tr><td colspan='4' style='text-align: center; color: red;'>Failed to load data</td></tr>";
    }
});
