// Initialize data if not present
if (!localStorage.getItem("donations")) {
  localStorage.setItem("donations", JSON.stringify([]));
}

if (!localStorage.getItem("donors")) {
  localStorage.setItem("donors", JSON.stringify([]));
}

if (!localStorage.getItem("messages")) {
  localStorage.setItem("messages", JSON.stringify([]));
}

if (!localStorage.getItem("reports")) {
  localStorage.setItem("reports", JSON.stringify([]));
}

// Get data
function getDonations() {
  return JSON.parse(localStorage.getItem("donations")) || [];
}

function getDonors() {
  return JSON.parse(localStorage.getItem("donors")) || [];
}

function getMessages() {
  return JSON.parse(localStorage.getItem("messages")) || [];
}

function getReports() {
  return JSON.parse(localStorage.getItem("reports")) || [];
}

// Save data
function saveDonations(donations) {
  localStorage.setItem("donations", JSON.stringify(donations));
}

function saveDonors(donors) {
  localStorage.setItem("donors", JSON.stringify(donors));
}

function saveMessages(messages) {
  localStorage.setItem("messages", JSON.stringify(messages));
}

function saveReports(reports) {
  localStorage.setItem("reports", JSON.stringify(reports));
}