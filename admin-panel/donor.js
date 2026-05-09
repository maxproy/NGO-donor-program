let donorsList = [];

// Load and Render donors
async function renderDonors() {
  try {
      const response = await fetch('../api/donors/list.php', { credentials: 'include' });
      const result = await response.json();
      
      const table = document.getElementById("donorTable");
      table.innerHTML = "";

      if (result.success && result.data && result.data.length > 0) {
          donorsList = result.data;
          donorsList.forEach(donor => {
              table.innerHTML += `
                <tr>
                  <td>${donor.name}</td>
                  <td>${donor.email}</td>
                  <td>${donor.phone || 'N/A'}</td>
                  <td>
                    <button class="action-btn edit-btn" onclick="editDonor(${donor.donor_id})">Edit</button>
                    <button class="action-btn delete-btn" onclick="deleteDonor(${donor.donor_id})">Delete</button>
                  </td>
                </tr>
              `;
          });
      } else {
          table.innerHTML = "<tr><td colspan='4' style='text-align: center; padding: 20px;'>No donors found</td></tr>";
      }
  } catch (error) {
      console.error("Error fetching donors:", error);
      document.getElementById("donorTable").innerHTML = "<tr><td colspan='4' style='text-align: center; color: red;'>Failed to load data</td></tr>";
  }
}

// Add or Update donor
document.getElementById("donorForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const id = document.getElementById("donorId").value;
  const name = document.getElementById("donorName").value;
  const email = document.getElementById("donorEmail").value;
  const phone = document.getElementById("donorPhone").value;
  const country = document.getElementById("donorCountry") ? document.getElementById("donorCountry").value : '';
  const city = document.getElementById("donorCity") ? document.getElementById("donorCity").value : '';

  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('phone', phone);
  formData.append('country', country);
  formData.append('city', city);

  try {
      let url = '../api/donors/create.php';
      if (id !== "") {
          url = '../api/donors/update.php';
          formData.append('donor_id', id);
      }

      const response = await fetch(url, {
          method: 'POST',
          body: formData,
          credentials: 'include'
      });
      const result = await response.json();

      if (result.success) {
          renderDonors();
          this.reset();
          document.getElementById("donorId").value = "";
      } else {
          alert("Error: " + (result.message || "Something went wrong"));
      }
  } catch (error) {
      console.error("Error saving donor:", error);
      alert("An error occurred while saving the donor.");
  }
});

// Edit donor
function editDonor(id) {
  const donor = donorsList.find(d => d.donor_id == id);
  
  if (donor) {
      document.getElementById("donorId").value = donor.donor_id;
      document.getElementById("donorName").value = donor.name;
      document.getElementById("donorEmail").value = donor.email;
      document.getElementById("donorPhone").value = donor.phone || '';
      if (document.getElementById("donorCountry")) document.getElementById("donorCountry").value = donor.country || '';
      if (document.getElementById("donorCity")) document.getElementById("donorCity").value = donor.city || '';
      
      // Scroll to form so the admin sees it
      document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
  }
}

// Delete donor
async function deleteDonor(id) {
  if (confirm("Are you sure you want to delete this donor?")) {
      try {
          const formData = new FormData();
          formData.append('donor_id', id);

          const response = await fetch('../api/donors/delete.php', {
              method: 'POST',
              body: formData,
              credentials: 'include'
          });
          const result = await response.json();

          if (result.success) {
              renderDonors();
          } else {
              alert("Error deleting donor: " + (result.message || "Unknown error"));
          }
      } catch (error) {
          console.error("Error deleting donor:", error);
          alert("An error occurred while deleting the donor.");
      }
  }
}

// Load on page start
document.addEventListener('DOMContentLoaded', renderDonors);