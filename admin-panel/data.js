// Initialize data if not present
if (!localStorage.getItem("donations")) {
  localStorage.setItem("donations", JSON.stringify([]));
}

if (!localStorage.getItem("donors")) {
  localStorage.setItem("donors", JSON.stringify([]));
}

// Get data
function getDonations() {
  return JSON.parse(localStorage.getItem("donations")) || [];
}

function getDonors() {
  return JSON.parse(localStorage.getItem("donors")) || [];
}

// Save data
function saveDonations(donations) {
  localStorage.setItem("donations", JSON.stringify(donations));
}

function saveDonors(donors) {
  localStorage.setItem("donors", JSON.stringify(donors));
}