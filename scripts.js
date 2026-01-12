// Odotetaan että sivu latautuu
document.addEventListener("DOMContentLoaded", () => {
  // === Smooth scroll navigaatiossa ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      e.preventDefault(); // estetään teleporttaus
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  // === Kuvagalleria ===
  let currentImageIndex = 0;
  const thumbnails = document.querySelectorAll(".thumbnail");
  const mainImage = document.getElementById("main-image");
  const mainVideo = document.getElementById("main-video");
  const prevBtn = document.querySelector(".gallery-btn.prev");
  const nextBtn = document.querySelector(".gallery-btn.next");

  function showImage(imgElement) {
    thumbnails.forEach(thumb => thumb.classList.remove("active"));
    imgElement.classList.add("active");
    
    // Tarkistetaan onko video vai kuva
    if (imgElement.dataset.video === "true" && mainVideo) {
      // Näytetään video, piilotetaan kuva
      mainImage.style.display = "none";
      mainVideo.style.display = "block";
      mainVideo.src = imgElement.src;
      mainVideo.load();
    } else {
      // Näytetään kuva, piilotetaan video
      if (mainVideo) {
        mainVideo.style.display = "none";
      }
      mainImage.style.display = "block";
      mainImage.src = imgElement.src;
      if (mainVideo) {
        mainVideo.pause();
      }
    }
    
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

  // === Swipe mobiilille ===
  if (mainImage) {
    let startX = 0;

    mainImage.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    mainImage.addEventListener("touchend", (e) => {
      e.preventDefault();
      let endX = e.changedTouches[0].clientX;
      let diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          changeImage(1);
        } else {
          changeImage(-1);
        }
      }
    });
  }
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
          navbar.classList.add("hide");   // Scrollataan alas
        } else {
          navbar.classList.remove("hide"); // Scrollataan ylös
        }
        lastScrollY = window.scrollY;
      }
      ticking = false;
    });
    ticking = true;
  }
});

// === Takaisin ylös -nappi ===
const backToTopBtn = document.getElementById("back-to-top");
if (backToTopBtn) {
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
}

// === Projektikorttien video automaattinen toisto ===
const projectCards = document.querySelectorAll(".project-card");

// Tarkista onko laite kosketusnäytöllinen
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

if (isTouchDevice) {
  // MOBIILI: Intersection Observer automaattiseen toistoon
  let currentlyPlayingVideo = null;
  let hasScrolled = false;
  let initialScrollY = window.scrollY;
  const scrollThreshold = 50; // Pikseliä scrollausta ennen aktivointia

  const videoObserver = new IntersectionObserver((entries) => {
    // Älä toista videoita ennen kuin käyttäjä on scrollannut tarpeeksi
    if (!hasScrolled) return;

    entries.forEach(entry => {
      const video = entry.target.querySelector(".project-video");
      if (!video) return;

      // Jos kortti on riittävästi näkyvissä
      if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
        // Pysäytä aiemmin toistava video
        if (currentlyPlayingVideo && currentlyPlayingVideo !== video) {
          currentlyPlayingVideo.classList.remove("playing");
          currentlyPlayingVideo.pause();
          currentlyPlayingVideo.currentTime = 0;
        }
        
        // Toista tämä video
        video.classList.add("playing");
        video.play().catch(err => console.log("Video play failed:", err));
        currentlyPlayingVideo = video;
      } else {
        // Kortti ei ole riittävästi näkyvissä
        if (currentlyPlayingVideo === video) {
          video.classList.remove("playing");
          video.pause();
          video.currentTime = 0;
          currentlyPlayingVideo = null;
        }
      }
    });
  }, {
    threshold: [0, 0.6, 1.0],
    rootMargin: "-20% 0px -20% 0px" // Aktivoituu kun kortti on keskellä ruutua
  });

  projectCards.forEach(card => {
    if (card.querySelector(".project-video")) {
      videoObserver.observe(card);
    }
  });

  // Aktivoi videon toisto kun on scrollattu riittävästi
  function checkScroll() {
    const scrolledDistance = Math.abs(window.scrollY - initialScrollY);
    if (scrolledDistance >= scrollThreshold && !hasScrolled) {
      hasScrolled = true;
      // Tarkista heti mitä videoita pitäisi toistaa
      videoObserver.disconnect();
      projectCards.forEach(card => {
        if (card.querySelector(".project-video")) {
          videoObserver.observe(card);
        }
      });
      window.removeEventListener("scroll", checkScroll);
      window.removeEventListener("touchmove", checkScroll);
    }
  }

  window.addEventListener("scroll", checkScroll);
  window.addEventListener("touchmove", checkScroll);
  
} else {
  // DESKTOP: Hover-toiminto
  projectCards.forEach(card => {
    const video = card.querySelector(".project-video");
    if (video) {
      card.addEventListener("mouseenter", () => {
        video.classList.add("playing");
        video.play().catch(err => console.log("Video play failed:", err));
      });
      
      card.addEventListener("mouseleave", () => {
        video.classList.remove("playing");
        video.pause();
        video.currentTime = 0;
      });
    }
  });
}
