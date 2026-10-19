/* Ultra Service Auto — gallery.js
   Photo gallery lightbox */

document.addEventListener('DOMContentLoaded', () => {

  // ── Gallery Lightbox ─────────────────────────────────────────
  const lightbox = document.getElementById('gallery-lightbox');
  if (!lightbox) return;

  const galleryItems = Array.from(document.querySelectorAll('.gallery__item'));
  const lbImg        = lightbox.querySelector('.gallery-lightbox__img');
  const lbCounter    = lightbox.querySelector('.gallery-lightbox__counter');
  const photos = galleryItems.map(el => ({
    src: el.querySelector('img').src,
    alt: el.querySelector('img').alt
  }));
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    lbImg.src = photos[index].src;
    lbImg.alt = photos[index].alt;
    if (lbCounter) lbCounter.textContent = (index + 1) + ' / ' + photos.length;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  function showPrev() {
    openLightbox((currentIndex - 1 + photos.length) % photos.length);
  }

  function showNext() {
    openLightbox((currentIndex + 1) % photos.length);
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(i);
      }
    });
  });

  lightbox.querySelector('.gallery-lightbox__backdrop').addEventListener('click', closeLightbox);
  lightbox.querySelector('.gallery-lightbox__close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.gallery-lightbox__prev').addEventListener('click', showPrev);
  lightbox.querySelector('.gallery-lightbox__next').addEventListener('click', showNext);

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

});
