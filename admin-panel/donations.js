// ===== STORAGE =====
function getDonations() {
  return JSON.parse(localStorage.getItem("donations")) || [];
}

function saveDonations(data) {
  localStorage.setItem("donations", JSON.stringify(data));
}

// reuse donor storage
function getDonors() {
  return JSON.parse(localStorage.getItem("donors")) || [];
}

// ===== LOAD DONORS INTO DROPDOWN =====
function loadDonorDropdown() {
  const donors = getDonors();
  const select = document.getElementById("donorSelect");

  select.innerHTML = "<option value=''>Select Donor</option>";

  donors.forEach(d => {
    select.innerHTML += `<option value="${d.id}">${d.name}</option>`;
  });
}

// ===== RENDER DONATIONS =====
function renderDonations() {
  const donations = getDonations();
  const donors = getDonors();
  const table = document.getElementById("donationTable");
  const search = document.getElementById("searchDonation")?.value.toLowerCase() || "";

  table.innerHTML = "";

  donations
    .filter(d => {
      const donor = donors.find(x => x.id == d.donorId);
      return donor?.name.toLowerCase().includes(search);
    })
    .forEach(d => {
      const donor = donors.find(x => x.id == d.donorId);

      table.innerHTML += `
        <tr>
          <td>${donor ? donor.name : "Unknown"}</td>
          <td>$${d.amount}</td>
          <td>${new Date(d.date).toLocaleDateString()}</td>
          <td>
            <button class="action-btn delete-btn" onclick="deleteDonation(${d.id})">Delete</button>
          </td>
        </tr>
      `;
    });
}

// ===== SAVE DONATION =====
function saveDonation() {
  const donorId = document.getElementById("donorSelect").value;
  const amount = document.getElementById("amount").value;

  if (!donorId || !amount) {
    alert("Fill all fields");
    return;
  }

  let donations = getDonations();

  donations.push({
    id: Date.now(),
    donorId: Number(donorId),
    amount: Number(amount),
    date: new Date().toISOString()
  });

  saveDonations(donations);

  closeDonationModal();
  renderDonations();
}

// ===== DELETE =====
function deleteDonation(id) {
  let donations = getDonations();

  if (confirm("Delete this donation?")) {
    donations = donations.filter(d => d.id !== id);
    saveDonations(donations);
    renderDonations();
  }
}

// ===== MODAL =====
function openDonationModal() {
  document.getElementById("donationModal").style.display = "flex";
}

function closeDonationModal() {
  document.getElementById("donationModal").style.display = "none";
}

// ===== SEARCH =====
document.getElementById("searchDonation")?.addEventListener("input", renderDonations);

// ===== INIT =====
loadDonorDropdown();
renderDonations();