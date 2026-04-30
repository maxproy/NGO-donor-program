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
    sidebar.style.right = "-250px";
  } else {
    sidebar.style.right = "0px";
  }
}