function changeImage(element) {
  const mainImage = document.getElementById("main-image");
  mainImage.src = element.src;
}
document.addEventListener('DOMContentLoaded', function() {
  const mainImage = document.getElementById('main-image');
  const thumbnails = document.querySelectorAll('.thumbnail');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  let currentIndex = 0;

  function updateMainImage(index) {
    currentIndex = index;
    mainImage.src = thumbnails[index].src;
    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
    });
  }

  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener('click', () => updateMainImage(index));
  });

  prevBtn.addEventListener('click', () => {
    let newIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
    updateMainImage(newIndex);
  });

  nextBtn.addEventListener('click', () => {
    let newIndex = (currentIndex + 1) % thumbnails.length;
    updateMainImage(newIndex);
  });

  // Swipe-toiminnallisuus
  let startX = 0;

  function showImage(index) {
    mainImage.src = thumbnails[index].src;
    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
    });
    currentIndex = index;
  }

  // Kosketuksen alku
  mainImage.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
  });

  // Kosketuksen loppu
  mainImage.addEventListener('touchend', function(e) {
    let endX = e.changedTouches[0].clientX;
    if (endX < startX - 30) {
      // Swipe vasemmalle (seuraava kuva)
      if (currentIndex < thumbnails.length - 1) {
        showImage(currentIndex + 1);
      }
    } else if (endX > startX + 30) {
      // Swipe oikealle (edellinen kuva)
      if (currentIndex > 0) {
        showImage(currentIndex - 1);
      }
    }
  });

  updateMainImage(0);
});
