// Load data
const donations = getDonations();
const donors = getDonors();
const messages = getMessages();

// Calculate summary statistics
const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
const uniqueDonors = new Set(donations.map(d => d.donorName || "Unknown")).size;
const totalMessages = messages.length;

// Update summary cards
document.getElementById("reportTotalDonations").textContent = "$" + totalDonations.toFixed(2);
document.getElementById("reportTotalDonors").textContent = uniqueDonors;
document.getElementById("reportTotalMessages").textContent = totalMessages;

// Group donations by month for chart
const monthlyTotals = {};

donations.forEach(d => {
  const month = new Date(d.date).toLocaleString("default", { month: "short" });

  if (!monthlyTotals[month]) {
    monthlyTotals[month] = 0;
  }

  monthlyTotals[month] += d.amount;
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
function renderReportsTable() {
  const table = document.getElementById("reportsTable");
  table.innerHTML = "";

  if (donations.length === 0) {
    table.innerHTML = "<tr><td colspan='4' style='text-align: center; padding: 20px;'>No donations yet</td></tr>";
    return;
  }

  donations.forEach((donation, index) => {
    const date = new Date(donation.date).toLocaleDateString();
    table.innerHTML += `
      <tr>
        <td>${donation.donorName || "Unknown"}</td>
        <td>$${donation.amount.toFixed(2)}</td>
        <td>${date}</td>
        <td><span style="color: green; font-weight: bold;">✓ Completed</span></td>
      </tr>
    `;
  });
}

// Initial render
renderReportsTable();