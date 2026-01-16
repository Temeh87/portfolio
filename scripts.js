document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      e.preventDefault();
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

  let currentImageIndex = 0;
  const thumbnails = document.querySelectorAll(".thumbnail");
  const mainImage = document.getElementById("main-image");
  const mainVideo = document.getElementById("main-video");
  const prevBtn = document.querySelector(".gallery-btn.prev");
  const nextBtn = document.querySelector(".gallery-btn.next");

  function showImage(imgElement) {
    thumbnails.forEach(thumb => thumb.classList.remove("active"));
    imgElement.classList.add("active");
    
    if (imgElement.dataset.video === "true" && mainVideo) {
      mainImage.style.display = "none";
      mainVideo.style.display = "block";
      mainVideo.src = imgElement.src;
      mainVideo.load();
    } else {
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

  thumbnails.forEach(thumb => {
    thumb.addEventListener("click", () => showImage(thumb));
  });

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => changeImage(-1));
    nextBtn.addEventListener("click", () => changeImage(1));
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") changeImage(-1);
    if (e.key === "ArrowRight") changeImage(1);
  });

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

let lastScrollY = window.scrollY;
let threshold = 100;
let ticking = false;

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const navbar = document.querySelector(".navbar");
      let diff = window.scrollY - lastScrollY;
      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          navbar.classList.add("hide");
        } else {
          navbar.classList.remove("hide");
        }
        lastScrollY = window.scrollY;
      }
      ticking = false;
    });
    ticking = true;
  }
});

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

const projectCards = document.querySelectorAll(".project-card");

const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

if (isTouchDevice) {
  let currentlyPlayingVideo = null;
  let hasScrolled = false;
  let initialScrollY = window.scrollY;
  const scrollThreshold = 50;


  function updateActiveVideo() {
    const viewportCenter = window.innerHeight / 2;
    let closestCard = null;
    let closestDistance = Infinity;

    projectCards.forEach(card => {
      const video = card.querySelector(".project-video");
      if (!video) return;

      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const distance = Math.abs(viewportCenter - cardCenter);

      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (isVisible && distance < closestDistance) {
        closestDistance = distance;
        closestCard = card;
      }
    });

    projectCards.forEach(card => {
      const video = card.querySelector(".project-video");
      if (!video) return;

      if (card === closestCard && closestCard !== null) {
        if (currentlyPlayingVideo !== video) {
          if (currentlyPlayingVideo) {
            currentlyPlayingVideo.classList.remove("playing");
            currentlyPlayingVideo.pause();
            currentlyPlayingVideo.currentTime = 0;
          }
          video.classList.add("playing");
          video.play().catch(err => console.log("Video play failed:", err));
          currentlyPlayingVideo = video;
        }
      } else if (currentlyPlayingVideo === video) {
        video.classList.remove("playing");
        video.pause();
        video.currentTime = 0;
        if (currentlyPlayingVideo === video) {
          currentlyPlayingVideo = null;
        }
      }
    });
  }

  let scrollTicking = false;
  function onScroll() {
    if (!hasScrolled) return;
    
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        updateActiveVideo();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }

  const videoObserver = new IntersectionObserver((entries) => {
    if (!hasScrolled) return;
    onScroll();
  }, {
    threshold: [0, 0.5, 1.0],
    rootMargin: "-10% 0px -10% 0px"
  });

  projectCards.forEach(card => {
    if (card.querySelector(".project-video")) {
      videoObserver.observe(card);
    }
  });

  window.addEventListener("scroll", onScroll);
  window.addEventListener("resize", onScroll);

  function checkScroll() {
    const scrolledDistance = Math.abs(window.scrollY - initialScrollY);
    if (scrolledDistance >= scrollThreshold && !hasScrolled) {
      hasScrolled = true;
      updateActiveVideo();
      window.removeEventListener("scroll", checkScroll);
      window.removeEventListener("touchmove", checkScroll);
    }
  }

  window.addEventListener("scroll", checkScroll);
  window.addEventListener("touchmove", checkScroll);
  
} else {
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
