/* Ultra Service Auto — accordion.js
   FAQ accordion behaviour */

document.addEventListener('DOMContentLoaded', () => {

  // ── FAQ Accordion ────────────────────────────────────────────
  document.querySelectorAll('.faq-item__inner').forEach(inner => {
    inner.addEventListener('click', () => {
      const item   = inner.closest('.faq-item');
      const toggle = item.querySelector('.faq-item__toggle');
      const isOpen = item.classList.contains('is-open');

      document.querySelectorAll('.faq-item.is-open').forEach(openItem => {
        openItem.classList.remove('is-open');
        openItem.classList.add('is-closing');
        openItem.querySelector('.faq-item__answer')
          .addEventListener('transitionend', () => openItem.classList.remove('is-closing'), { once: true });
        openItem.querySelector('.faq-item__toggle').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });

});
