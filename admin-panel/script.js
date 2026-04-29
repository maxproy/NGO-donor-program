

const donations = getDonations();
const donors = getDonors();

// Total donations
const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);

// Unique donors
const uniqueDonors = new Set(donations.map(d => d.name));
const totalDonors = uniqueDonors.size;

// Monthly donations
const currentMonth = new Date().getMonth();

const monthlyDonations = donations
  .filter(d => new Date(d.date).getMonth() === currentMonth)
  .reduce((sum, d) => sum + d.amount, 0);

// Update UI
document.getElementById("totalDonations").textContent = "$" + totalDonations;
document.getElementById("totalDonors").textContent = totalDonors;
document.getElementById("monthlyDonations").textContent = "$" + monthlyDonations;

document.getElementById("donationForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const amount = Number(document.getElementById("amount").value);

  const newDonation = {
    name,
    amount,
    date: new Date().toISOString()
  };

  const donations = getDonations();
  donations.push(newDonation);
  saveDonations(donations);

  alert("Donation added!");

  this.reset();
});
