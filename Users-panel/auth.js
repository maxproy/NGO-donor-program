//// SIGNUP
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confpassword = document.getElementById("confpassword").value;
    const idno = document.getElementById("idno").value;
    const phoneno = document.getElementById("phoneno").value;
    const country = document.getElementById("country") ? document.getElementById("country").value : '';
    const city = document.getElementById("city") ? document.getElementById("city").value : '';

    if (password !== confpassword) {
        alert("Passwords do not match!");
        return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("id_no", idno);
    formData.append("phone", phoneno);
    formData.append("country", country);
    formData.append("city", city);

    try {
        const response = await fetch('../api/auth/register.php', { 
            method: 'POST', 
            body: formData,
            credentials: 'include'
        });
        const result = await response.json();

        if (result.success) {
            alert("Account created! Please login.");
            window.location.href = "login.html";
        } else {
            alert("Registration failed: " + (result.message || "Unknown error"));
        }
    } catch (error) {
        console.error("Signup error:", error);
        alert("An error occurred during registration. Please try again later.");
    }
  });
}

//// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
        const response = await fetch('../api/auth/login.php', { 
            method: 'POST', 
            body: formData,
            credentials: 'include'
        });
        const result = await response.json();

        if (result.success) {
            window.location.href = "index.html"; // go back to homepage
        } else {
            alert("Login failed: " + (result.message || "Invalid credentials"));
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("An error occurred during login. Please try again later.");
    }
  });
}