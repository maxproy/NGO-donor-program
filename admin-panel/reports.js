const donations = getDonations();

// Group by month
const monthlyTotals = {};

donations.forEach(d => {
  const month = new Date(d.date).toLocaleString("default", { month: "short" });

  if (!monthlyTotals[month]) {
    monthlyTotals[month] = 0;
  }

  monthlyTotals[month] += d.amount;
});

const ctx = document.getElementById("donationChart");

new Chart(ctx, {
  type: "bar",
  data: {
    labels: Object.keys(monthlyTotals),
    datasets: [{
      label: "Donations",
      data: Object.values(monthlyTotals)
    }]
  }
});
document.getElementById("searchDonor").addEventListener("input", renderDonors);

function renderDonors() {
  const donors = getDonors();
  const search = document.getElementById("searchDonor").value.toLowerCase();
  const table = document.getElementById("donorTable");

  table.innerHTML = "";

  donors
    .filter(d => d.name.toLowerCase().includes(search))
    .forEach((donor, index) => {
      table.innerHTML += `
        <tr>
          <td>${donor.name}</td>
          <td>${donor.email}</td>
          <td>${donor.phone}</td>
          <td>
            <button onclick="viewDonor(${donor.id})">View</button>
            <button onclick="editDonor(${index})">Edit</button>
            <button onclick="deleteDonor(${index})">Delete</button>
          </td>
        </tr>
      `;
    });
}