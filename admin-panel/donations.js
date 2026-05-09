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

// ===== LOAD PROGRAMS INTO DROPDOWN =====
async function loadProgramDropdown() {
  try {
    const response = await fetch('../api/programs/list.php', { credentials: 'include' });
    const result = await response.json();
    
    const select = document.getElementById("programSelect");
    select.innerHTML = "<option value=''>Select Program</option>";

    if (result.success && result.data) {
      result.data.forEach(p => {
        select.innerHTML += `<option value="${p.name}">${p.name}</option>`;
      });
    }
  } catch (error) {
    console.error("Error loading programs:", error);
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
    const prog = d.program ? d.program.toLowerCase() : "";
    return donorName.includes(search) || prog.includes(search);
  });

  if (filtered.length === 0) {
    table.innerHTML = "<tr><td colspan='6' style='text-align: center; padding: 20px;'>No donations found</td></tr>";
    return;
  }

  filtered.forEach(d => {
    const amount = parseFloat(d.amount).toFixed(2);
    const date = new Date(d.donation_date).toLocaleDateString();
    
    // Status Badges
    const statusClass = d.status === 'completed' ? 'badge-completed' : 'badge-pending';
    const statusText = d.status ? d.status.charAt(0).toUpperCase() + d.status.slice(1) : 'Pending';
    
    table.innerHTML += `
      <tr>
        <td>${d.donor_name || "Unknown"}</td>
        <td>${d.program || "General"}</td>
        <td>$${amount}</td>
        <td>${date}</td>
        <td><span class="badge ${statusClass}">${statusText}</span></td>
        <td>
          ${d.status !== 'completed' ? `<button class="action-btn edit-btn" onclick="markCompleted(${d.donation_id})">Complete</button>` : ''}
          <button class="action-btn delete-btn" onclick="deleteDonation(${d.donation_id})">Delete</button>
        </td>
      </tr>
    `;
  });
}

// ===== SAVE DONATION =====
async function saveDonation() {
  const donorId = document.getElementById("donorSelect").value;
  const program = document.getElementById("programSelect").value;
  const amount = document.getElementById("amount").value;

  if (!donorId || !program || !amount) {
    alert("Please select a donor, a program, and enter an amount.");
    return;
  }

  const formData = new FormData();
  formData.append("donor_id", donorId);
  formData.append("amount", amount);
  // Provide required defaults for an admin-created donation
  formData.append("program", program); 
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
        document.getElementById("programSelect").value = "";
        fetchDonations(); // Refresh the list from the server
    } else {
        alert("Error saving donation: " + result.message);
    }
  } catch (error) {
    console.error("Error saving donation:", error);
    alert("An error occurred while saving the donation.");
  }
}

// ===== MARK COMPLETED (TRIGGERS DB UPDATE) =====
async function markCompleted(id) {
  if (confirm("Mark this donation as completed? This will update the program's raised amount!")) {
    const formData = new FormData();
    formData.append("donation_id", id);
    formData.append("status", "completed");

    try {
      const response = await fetch('../api/donations/update.php', {
          method: 'POST',
          body: formData,
          credentials: 'include'
      });
      const result = await response.json();

      if (result.success) {
          fetchDonations(); // Refresh to see the new status
      } else {
          alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
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
    loadProgramDropdown();
    fetchDonations();
});