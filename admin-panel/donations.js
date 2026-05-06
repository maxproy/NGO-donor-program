let allDonations = [];

// ===== LOAD DONORS INTO DROPDOWN =====
async function loadDonorDropdown() {
  try {
    const response = await fetch('../api/donors/list.php', { credentials: 'include' });
    const result = await response.json();
    
    const select = document.getElementById("donorSelect");
    select.innerHTML = "<option value=''>Select Donor</option>";

    if (result.success && result.data) {
      result.data.forEach(d => {
        select.innerHTML += `<option value="${d.donor_id}">${d.name}</option>`;
      });
    }
  } catch (error) {
    console.error("Error loading donors:", error);
  }
}

// ===== FETCH DONATIONS =====
async function fetchDonations() {
  try {
    const response = await fetch('../api/donations/list.php?limit=1000', { credentials: 'include' });
    const result = await response.json();
    
    if (result.success && result.data) {
      allDonations = result.data;
      renderDonations();
    }
  } catch (error) {
    console.error("Error fetching donations:", error);
  }
}

// ===== RENDER DONATIONS =====
function renderDonations() {
  const table = document.getElementById("donationTable");
  const search = document.getElementById("searchDonation")?.value.toLowerCase() || "";

  table.innerHTML = "";

  const filtered = allDonations.filter(d => {
    const donorName = d.donor_name ? d.donor_name.toLowerCase() : "unknown";
    return donorName.includes(search);
  });

  if (filtered.length === 0) {
    table.innerHTML = "<tr><td colspan='4' style='text-align: center; padding: 20px;'>No donations found</td></tr>";
    return;
  }

  filtered.forEach(d => {
    const amount = parseFloat(d.amount).toFixed(2);
    const date = new Date(d.donation_date).toLocaleDateString();
    
    table.innerHTML += `
      <tr>
        <td>${d.donor_name || "Unknown"}</td>
        <td>$${amount}</td>
        <td>${date}</td>
        <td>
          <button class="action-btn delete-btn" onclick="deleteDonation(${d.donation_id})">Delete</button>
        </td>
      </tr>
    `;
  });
}

// ===== SAVE DONATION =====
async function saveDonation() {
  const donorId = document.getElementById("donorSelect").value;
  const amount = document.getElementById("amount").value;

  if (!donorId || !amount) {
    alert("Please select a donor and enter an amount.");
    return;
  }

  const formData = new FormData();
  formData.append("donor_id", donorId);
  formData.append("amount", amount);
  // Provide required defaults for an admin-created donation
  formData.append("program", "General Fund"); 
  formData.append("donation_plan", "one-time"); 
  formData.append("payment_method", "manual"); 

  try {
    const response = await fetch('../api/donations/create.php', {
        method: 'POST',
        body: formData,
        credentials: 'include'
    });
    const result = await response.json();

    if (result.success) {
        closeDonationModal();
        document.getElementById("amount").value = "";
        document.getElementById("donorSelect").value = "";
        fetchDonations(); // Refresh the list from the server
    } else {
        alert("Error saving donation: " + result.message);
    }
  } catch (error) {
    console.error("Error saving donation:", error);
    alert("An error occurred while saving the donation.");
  }
}

// ===== DELETE =====
async function deleteDonation(id) {
  if (confirm("Delete this donation?")) {
    try {
      const formData = new FormData();
      formData.append("donation_id", id);

      const response = await fetch('../api/donations/delete.php', {
          method: 'POST',
          body: formData,
          credentials: 'include'
      });
      const result = await response.json();

      if (result.success) {
          fetchDonations(); // Refresh the list from the server
      } else {
          alert("Error deleting donation: " + result.message);
      }
    } catch (error) {
      console.error("Error deleting donation:", error);
      alert("An error occurred while deleting the donation.");
    }
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
document.addEventListener('DOMContentLoaded', () => {
    loadDonorDropdown();
    fetchDonations();
});