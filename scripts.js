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

  // === Kuvagalleria ===
  let currentImageIndex = 0;
  const thumbnails = document.querySelectorAll(".thumbnail");
  const mainImage = document.getElementById("main-image");
  const prevBtn = document.querySelector(".gallery-btn.prev");
  const nextBtn = document.querySelector(".gallery-btn.next");

  function showImage(imgElement) {
    thumbnails.forEach(thumb => thumb.classList.remove("active"));
    imgElement.classList.add("active");
    mainImage.src = imgElement.src;
    currentImageIndex = Array.from(thumbnails).indexOf(imgElement);
  }

  function changeImage(direction) {
    currentImageIndex += direction;
    if (currentImageIndex < 0) currentImageIndex = thumbnails.length - 1;
    if (currentImageIndex >= thumbnails.length) currentImageIndex = 0;
    showImage(thumbnails[currentImageIndex]);
  }

  // Klikkaamalla pikkukuvaa
  thumbnails.forEach(thumb => {
    thumb.addEventListener("click", () => showImage(thumb));
  });

  // Nuolinapit
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => changeImage(-1));
    nextBtn.addEventListener("click", () => changeImage(1));
  }

  // Näppäimistö ← ja →
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") changeImage(-1);
    if (e.key === "ArrowRight") changeImage(1);
  });
});

// === Navbar scrollin mukaan ===
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
// Takaisin ylös -nappi
const backToTopBtn = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
});

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
