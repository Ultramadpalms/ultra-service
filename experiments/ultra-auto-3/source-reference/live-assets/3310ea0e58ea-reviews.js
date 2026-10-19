/* Ultra Service Auto — reviews.js
   Review submission modal (star picker) + HTML-based pseudo-pagination */

document.addEventListener('DOMContentLoaded', () => {

  // ── Review Modal ──────────────────────────────────────────────
  const reviewOverlay = document.getElementById('modal-review');
  if (reviewOverlay) {
    const reviewForm      = document.getElementById('review-modal-form');
    const reviewSuccess   = document.getElementById('review-modal-success');
    const reviewCloseBtn  = reviewOverlay.querySelector('.callback-modal__close');
    const reviewNameInput = document.getElementById('review-modal-name');
    const starPicker      = document.getElementById('review-star-picker');
    let selectedRating    = 0;

    function updateStars(count) {
      if (!starPicker) return;
      starPicker.querySelectorAll('.review-star-picker__star').forEach((s, i) => {
        s.classList.toggle('is-active', i < count);
      });
    }

    if (starPicker) {
      starPicker.querySelectorAll('.review-star-picker__star').forEach((star, i) => {
        star.addEventListener('click',      () => { selectedRating = i + 1; updateStars(selectedRating); });
        star.addEventListener('mouseenter', () => updateStars(i + 1));
        star.addEventListener('mouseleave', () => updateStars(selectedRating));
      });
    }

    function openReviewModal() {
      reviewOverlay.classList.add('is-open');
      reviewOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (reviewForm)    reviewForm.style.display = '';
      if (reviewSuccess) reviewSuccess.classList.remove('is-visible');
      selectedRating = 0;
      updateStars(0);
      if (reviewNameInput) reviewNameInput.value = '';
      const ta = document.getElementById('review-modal-text');
      if (ta) ta.value = '';
      const sub = reviewForm && reviewForm.querySelector('.callback-modal__submit');
      if (sub) { sub.disabled = false; sub.textContent = 'Отправить'; }
      setTimeout(() => reviewNameInput && reviewNameInput.focus(), 50);
    }

    function closeReviewModal() {
      reviewOverlay.classList.remove('is-open');
      reviewOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-open-review]').forEach(btn => {
      btn.addEventListener('click', e => { e.preventDefault(); openReviewModal(); });
    });

    if (reviewCloseBtn) reviewCloseBtn.addEventListener('click', closeReviewModal);
    reviewOverlay.addEventListener('click', e => { if (e.target === reviewOverlay) closeReviewModal(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && reviewOverlay.classList.contains('is-open')) closeReviewModal();
    });

    if (reviewForm) {
      reviewForm.addEventListener('submit', async e => {
        e.preventDefault();
        const sub = reviewForm.querySelector('.callback-modal__submit');
        sub.disabled = true;
        sub.textContent = 'Отправляем...';
        try {
          const key = window.USA?.recaptchaSiteKey;
          const recaptchaToken = (!key || typeof grecaptcha === 'undefined') ? '' :
            await new Promise(resolve => {
              grecaptcha.ready(() => {
                grecaptcha.execute(key, { action: 'review' }).then(resolve).catch(() => resolve(''));
              });
            });

          const res = await fetch(window.USA?.ajaxUrl || '/index.php?option=com_ajax&plugin=usaforms&group=system&format=raw', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type:            'review',
              name:            reviewNameInput ? reviewNameInput.value.trim() : '',
              rating:          selectedRating,
              text:            document.getElementById('review-modal-text')?.value.trim() || '',
              recaptcha_token: recaptchaToken,
            })
          });

          if (!res.ok) throw new Error('server error');
          reviewForm.style.display = 'none';
          if (reviewSuccess) reviewSuccess.classList.add('is-visible');
          setTimeout(closeReviewModal, 3000);
        } catch (_) {
          sub.disabled = false;
          sub.textContent = 'Отправить';
        }
      });
    }
  }

  // ── Reviews Pagination (pseudo, HTML-based) ──────────────────
  const rvList    = document.querySelector('.reviews-page__list');
  const rvPgBtns  = document.querySelector('.reviews-pagination__pages');
  const rvMoreBtn = document.querySelector('.reviews-pagination__more');

  if (rvList && rvPgBtns && rvMoreBtn) {
    const TOTAL_PAGES = 3;
    let curRvPage = 1;

    function getPageItems(page) {
      if (page === 1) return Array.from(rvList.querySelectorAll('.review-full:not([data-rv-page])'));
      return Array.from(rvList.querySelectorAll(`.review-full[data-rv-page="${page}"]`));
    }

    function syncPgBtns(page) {
      rvPgBtns.querySelectorAll('.reviews-pagination__btn').forEach((btn, i) => {
        const p = i + 1, active = p === page;
        btn.classList.toggle('reviews-pagination__btn--active', active);
        btn.innerHTML = active ? `<span class="gradient-text">${p}</span>` : String(p);
        btn.setAttribute('aria-current', active ? 'page' : 'false');
      });
      rvMoreBtn.style.display = curRvPage >= TOTAL_PAGES ? 'none' : '';
    }

    rvMoreBtn.addEventListener('click', () => {
      if (curRvPage >= TOTAL_PAGES) return;
      curRvPage++;
      const items = getPageItems(curRvPage);
      items.forEach(el => el.style.removeProperty('display'));
      syncPgBtns(curRvPage);
      if (items[0]) {
        const top = items[0].getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });

    rvPgBtns.addEventListener('click', e => {
      const btn = e.target.closest('.reviews-pagination__btn');
      if (!btn || btn.classList.contains('reviews-pagination__btn--active')) return;
      const idx = Array.from(rvPgBtns.querySelectorAll('.reviews-pagination__btn')).indexOf(btn);
      const page = idx + 1;
      for (let p = 1; p <= TOTAL_PAGES; p++) {
        getPageItems(p).forEach(el => {
          if (p === page) el.style.removeProperty('display');
          else el.style.display = 'none';
        });
      }
      curRvPage = page;
      syncPgBtns(page);
      const top = rvList.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: 'smooth' });
    });

    syncPgBtns(1);
  }

});
