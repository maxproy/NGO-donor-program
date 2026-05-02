/* SMOOTH SCROLL  */
function scrollToSection(id) {
  const section = document.getElementById(id);

  if (section) {
    section.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
    // Close sidebar on mobile after clicking
    const sidebar = document.getElementById("sidebar");
    if (sidebar.style.right === "0px") {
      toggleMenu();
    }
  }
}

/* SECTION FADE-IN ANIMATION  */
const sections = document.querySelectorAll("section");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = "translateY(0)";
    }
  });
}, {
  threshold: 0.1
});

sections.forEach(section => {
  section.style.opacity = 0;
  section.style.transform = "translateY(30px)";
  section.style.transition = "0.8s ease-out";
  observer.observe(section);
});

/* ================= SIDEBAR TOGGLE ================= */
function toggleMenu() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar.style.right === "0px") {
    sidebar.style.right = "-280px";
  } else {
    sidebar.style.right = "0px";
  }
}

/* ================= AUTHENTICATION UI TOGGLE ================= */
document.addEventListener("DOMContentLoaded", () => {
  const currentUser = localStorage.getItem("currentUser");
  
  // Navbar Buttons
  const navLoginBtn = document.getElementById("nav-login-btn");
  const navProfileBtn = document.getElementById("nav-profile-btn");
  
  // Sidebar Buttons
  const sideLoginBtn = document.getElementById("side-login-btn");
  const sideProfileBtn = document.getElementById("side-profile-btn");
    
  // If the user is logged in, hide Login and show Profile
  if (currentUser) {
      if (navLoginBtn) navLoginBtn.style.display = "none";
      if (navProfileBtn) navProfileBtn.style.display = "inline-block";
      
      if (sideLoginBtn) sideLoginBtn.style.display = "none";
      if (sideProfileBtn) sideProfileBtn.style.display = "block";
  } else {
      // Ensure defaults if logged out
      if (navLoginBtn) navLoginBtn.style.display = "inline-block";
      if (navProfileBtn) navProfileBtn.style.display = "none";
      
      if (sideLoginBtn) sideLoginBtn.style.display = "block";
      if (sideProfileBtn) sideProfileBtn.style.display = "none";
  }
});