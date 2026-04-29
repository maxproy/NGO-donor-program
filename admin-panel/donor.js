// Get donors
function getDonors() {
  return JSON.parse(localStorage.getItem("donors")) || [];
}

// Save donors
function saveDonors(donors) {
  localStorage.setItem("donors", JSON.stringify(donors));
}

// Render donors
function renderDonors() {
  const donors = getDonors();
  const table = document.getElementById("donorTable");

  table.innerHTML = "";

  donors.forEach((donor, index) => {
    table.innerHTML += `
      <tr>
        <td>${donor.name}</td>
        <td>${donor.email}</td>
        <td>${donor.phone}</td>
        <td>
          <button class="action-btn edit-btn" onclick="editDonor(${index})">Edit</button>
          <button class="action-btn delete-btn" onclick="deleteDonor(${index})">Delete</button>
        </td>
      </tr>
    `;
  });
}

// Add or Update donor
document.getElementById("donorForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const id = document.getElementById("donorId").value;
  const name = document.getElementById("donorName").value;
  const email = document.getElementById("donorEmail").value;
  const phone = document.getElementById("donorPhone").value;

  const donors = getDonors();

  if (id === "") {
    // Create
    donors.push({ name, email, phone });
  } else {
    // Update
    donors[id] = { name, email, phone };
  }

  saveDonors(donors);
  renderDonors();
  this.reset();
});

// Edit donor
function editDonor(index) {
  const donor = getDonors()[index];

  document.getElementById("donorId").value = index;
  document.getElementById("donorName").value = donor.name;
  document.getElementById("donorEmail").value = donor.email;
  document.getElementById("donorPhone").value = donor.phone;
}

// Delete donor
function deleteDonor(index) {
  const donors = getDonors();

  if (confirm("Are you sure you want to delete this donor?")) {
    donors.splice(index, 1);
    saveDonors(donors);
    renderDonors();
  }
}

// Load on page start
renderDonors();