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

  updateMainImage(0);
});
