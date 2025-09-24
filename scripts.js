// Odotetaan että sivu latautuu
document.addEventListener("DOMContentLoaded", () => {
  // Haetaan kaikki nav-linkit, jotka viittaavat ID:hen sivulla
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      e.preventDefault(); // estetään "teleporttaus"

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start"   // voit vaihtaa "center" tai "end"
        });
      }
    });
  });
});

let lastScrollY = window.scrollY;
let threshold = 100; // kuinka paljon pitää liikkua ennen reaktiota
let ticking = false;

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const navbar = document.querySelector(".navbar");
      let diff = window.scrollY - lastScrollY;

      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          // Scrollataan alas
          navbar.classList.add("hide");
        } else {
          // Scrollataan ylös
          navbar.classList.remove("hide");
        }
        lastScrollY = window.scrollY;
      }

      ticking = false;
    });

    ticking = true;
  }
});


