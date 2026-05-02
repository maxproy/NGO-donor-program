// Initialize users
if (!localStorage.getItem("users")) {
  localStorage.setItem("users", JSON.stringify([]));
}

function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

//// SIGNUP
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const users = getUsers();

    // Check if user exists
    const exists = users.find(u => u.email === email);

    if (exists) {
      alert("User already exists!");
      return;
    }

    users.push({ name, email, password });
    saveUsers(users);

    alert("Account created! Please login.");
    window.location.href = "login.html";
  });
}

//// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const users = getUsers();

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      alert("Invalid credentials");
      return;
    }

    // Save logged-in user
    localStorage.setItem("currentUser", JSON.stringify(user));

    window.location.href = "index.html"; // go to dashboard
  });
}