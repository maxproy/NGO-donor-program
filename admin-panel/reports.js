document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Fetch summary statistics
    const statsRes = await fetch('../api/donations/stats.php', { credentials: 'include' });
    const statsData = await statsRes.json();
    
    // Fetch donors for total count
    const donorsRes = await fetch('../api/donors/list.php', { credentials: 'include' });
    const donorsData = await donorsRes.json();
    
    // Fetch messages for total count
    const messagesRes = await fetch('../api/messages/list.php', { credentials: 'include' });
    const messagesData = await messagesRes.json();
    
    // Fetch donations for chart and table
    const donationsRes = await fetch('../api/donations/list.php?limit=1000', { credentials: 'include' });
    const donationsData = await donationsRes.json();

    if (statsData.success) {
      const totalAmount = parseFloat(statsData.summary.total_amount || 0);
      document.getElementById("reportTotalDonations").textContent = "$" + totalAmount.toFixed(2);
    }

    if (donorsData.success) {
      document.getElementById("reportTotalDonors").textContent = donorsData.data ? donorsData.data.length : 0;
    }

    if (messagesData.success) {
      document.getElementById("reportTotalMessages").textContent = messagesData.data ? messagesData.data.length : 0;
    }

    const donations = donationsData.success && donationsData.data ? donationsData.data : [];

    // Group donations by month for chart
    const monthlyTotals = {};

    donations.forEach(d => {
      const month = new Date(d.donation_date).toLocaleString("default", { month: "short" });

      if (!monthlyTotals[month]) {
        monthlyTotals[month] = 0;
      }

      monthlyTotals[month] += parseFloat(d.amount);
    });

    // Create chart
    const ctx = document.getElementById("donationChart");
    if (ctx) {
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: Object.keys(monthlyTotals),
          datasets: [{
            label: "Donations ($)",
            data: Object.values(monthlyTotals),
            backgroundColor: "#1f7a4c",
            borderColor: "#1f7a4c",
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }

    // Render donations table
    const table = document.getElementById("reportsTable");
    if (table) {
      table.innerHTML = "";

      if (donations.length === 0) {
        table.innerHTML = "<tr><td colspan='4' style='text-align: center; padding: 20px;'>No donations yet</td></tr>";
      } else {
        donations.forEach((donation) => {
          const date = new Date(donation.donation_date).toLocaleDateString();
          const amount = parseFloat(donation.amount).toFixed(2);
          const statusHtml = donation.status === 'completed' || donation.status === 'Completed'
            ? '<span style="color: green; font-weight: bold;">✓ Completed</span>'
            : `<span style="color: orange; font-weight: bold;">⏳ ${donation.status}</span>`;

          table.innerHTML += `
            <tr>
              <td>${donation.donor_name || "Unknown"}</td>
              <td>$${amount}</td>
              <td>${date}</td>
              <td>${statusHtml}</td>
            </tr>
          `;
        });
      }
    }
  } catch (error) {
    console.error("Error loading reports data:", error);
  }
});