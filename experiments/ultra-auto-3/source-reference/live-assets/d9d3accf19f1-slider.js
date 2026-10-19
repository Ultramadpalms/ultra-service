/* Ultra Service Auto — slider.js
   Video & team sliders, nav indicator dots, video card play */

document.addEventListener('DOMContentLoaded', () => {

  // ── Simple slider for video & team sections ─────────────────
  function initSliderNav(indicatorGroup, totalItems, onPageChange) {
    let current = 0;
    const spans = Array.from(indicatorGroup.querySelectorAll('span:not(.slider-nav__counter)'));
    const counter = indicatorGroup.querySelector('.slider-nav__counter');

    function renderCounter(idx) {
      if (!counter) return;
      const cur = String(idx + 1).padStart(2, '0');
      const tot = String(totalItems).padStart(2, '0');
      counter.innerHTML =
        `<span class="gradient-text">${cur}</span>` +
        `<span class="slider-nav__sep"> / </span>` +
        `<span>${tot}</span>`;
    }

    function update(idx) {
      current = idx;
      spans.forEach((span, i) => {
        span.classList.toggle('gradient-text', i === idx);
      });
      renderCounter(idx);
      if (onPageChange) onPageChange(idx);
    }

    renderCounter(0);
    spans.forEach((span, i) => {
      span.addEventListener('click', () => update(i));
    });

    return { update, getCurrent: () => current, total: totalItems };
  }

  const videoIndicators = document.querySelector('[data-slider="video"]');
  const teamIndicators  = document.querySelector('[data-slider="team"]');

  // ── Video slider ──────────────────────────────────────────────
  const allVideoCards = Array.from(document.querySelectorAll('#video-slider .video-card'));
  const VIDEO_PAGE_SIZE = 3;
  const isMobileVideo = () => window.matchMedia('(max-width: 768px)').matches;

  function showVideoPage(pageIdx) {
    if (isMobileVideo()) {
      allVideoCards.forEach(card => {
        card.style.display = '';
        card.classList.add('is-visible');
      });
      const prevBtn = document.querySelector('.nav-btn--prev[data-target="video-slider"]');
      const nextBtn = document.querySelector('.nav-btn--next[data-target="video-slider"]');
      if (prevBtn) prevBtn.disabled = false;
      if (nextBtn) nextBtn.disabled = false;
      return;
    }
    allVideoCards.forEach((card, i) => {
      const visible = Math.floor(i / VIDEO_PAGE_SIZE) === pageIdx;
      card.style.display = visible ? '' : 'none';
      if (visible) card.classList.add('is-visible');
    });
    const totalPages = Math.ceil(allVideoCards.length / VIDEO_PAGE_SIZE);
    const prevBtn = document.querySelector('.nav-btn--prev[data-target="video-slider"]');
    const nextBtn = document.querySelector('.nav-btn--next[data-target="video-slider"]');
    if (prevBtn) prevBtn.disabled = (pageIdx === 0);
    if (nextBtn) nextBtn.disabled = (pageIdx === totalPages - 1);
  }

  showVideoPage(0);
  window.addEventListener('resize', () => showVideoPage(0), { passive: true });

  const videoSlider = videoIndicators ? initSliderNav(videoIndicators, allVideoCards.length, showVideoPage) : null;

  const videoGrid = document.getElementById('video-slider');
  if (videoGrid) {
    videoGrid.addEventListener('scroll', () => {
      if (!isMobileVideo() || !videoSlider) return;
      const card = videoGrid.querySelector('.video-card');
      if (!card) return;
      const cardW = card.offsetWidth + 12;
      const idx = Math.round(videoGrid.scrollLeft / cardW);
      const counter = videoIndicators && videoIndicators.querySelector('.slider-nav__counter');
      if (counter) {
        const cur = String(idx + 1).padStart(2, '0');
        const tot = String(allVideoCards.length).padStart(2, '0');
        counter.innerHTML =
          `<span class="gradient-text">${cur}</span>` +
          `<span class="slider-nav__sep"> / </span>` +
          `<span>${tot}</span>`;
      }
    }, { passive: true });
  }

  // ── Team slider ───────────────────────────────────────────────
  const allTeamCards = Array.from(document.querySelectorAll('#team-slider .team-card'));
  const TEAM_PAGE_SIZE = 3;
  const isMobileTeam = () => window.matchMedia('(max-width: 768px)').matches;

  function showTeamPage(pageIdx) {
    if (isMobileTeam()) {
      allTeamCards.forEach(card => {
        card.style.display = '';
        card.classList.add('is-visible');
      });
      const prevBtn = document.querySelector('.nav-btn--prev[data-target="team-slider"]');
      const nextBtn = document.querySelector('.nav-btn--next[data-target="team-slider"]');
      if (prevBtn) prevBtn.disabled = false;
      if (nextBtn) nextBtn.disabled = false;
      return;
    }
    allTeamCards.forEach((card, i) => {
      const visible = Math.floor(i / TEAM_PAGE_SIZE) === pageIdx;
      card.style.display = visible ? '' : 'none';
    });
    const totalPages = Math.ceil(allTeamCards.length / TEAM_PAGE_SIZE);
    const prevBtn = document.querySelector('.nav-btn--prev[data-target="team-slider"]');
    const nextBtn = document.querySelector('.nav-btn--next[data-target="team-slider"]');
    if (prevBtn) prevBtn.disabled = (pageIdx === 0);
    if (nextBtn) nextBtn.disabled = (pageIdx === totalPages - 1);
  }

  showTeamPage(0);
  window.addEventListener('resize', () => showTeamPage(0), { passive: true });

  const teamSlider = teamIndicators ? initSliderNav(teamIndicators, allTeamCards.length, showTeamPage) : null;

  const teamGrid = document.getElementById('team-slider');
  if (teamGrid) {
    teamGrid.addEventListener('scroll', () => {
      if (!isMobileTeam() || !teamSlider) return;
      const card = teamGrid.querySelector('.team-card');
      if (!card) return;
      const cardW = card.offsetWidth + 12;
      const idx = Math.round(teamGrid.scrollLeft / cardW);
      const counter = teamIndicators && teamIndicators.querySelector('.slider-nav__counter');
      if (counter) {
        const cur = String(idx + 1).padStart(2, '0');
        const tot = String(allTeamCards.length).padStart(2, '0');
        counter.innerHTML =
          `<span class="gradient-text">${cur}</span>` +
          `<span class="slider-nav__sep"> / </span>` +
          `<span>${tot}</span>`;
      }
    }, { passive: true });
  }

  // ── Prev / Next buttons ───────────────────────────────────────
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;

      if (targetId === 'video-slider' && isMobileVideo()) {
        const grid = document.getElementById('video-slider');
        const cardWidth = grid.querySelector('.video-card').offsetWidth + 12;
        const dir = btn.classList.contains('nav-btn--prev') ? -1 : 1;
        grid.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
        return;
      }

      if (targetId === 'team-slider' && isMobileTeam()) {
        const grid = document.getElementById('team-slider');
        const cardWidth = grid.querySelector('.team-card').offsetWidth + 12;
        const dir = btn.classList.contains('nav-btn--prev') ? -1 : 1;
        grid.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
        return;
      }

      let slider;
      if (targetId === 'video-slider') slider = videoSlider;
      if (targetId === 'team-slider')  slider = teamSlider;
      if (!slider) return;

      const dir  = btn.classList.contains('nav-btn--prev') ? -1 : 1;
      const next = (slider.getCurrent() + dir + slider.total) % slider.total;
      slider.update(next);
    });
  });

  // ── Video card play button ────────────────────────────────────
  document.querySelectorAll('.video-card .play-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.video-card');
      const videoId = card.dataset.rutubeId;
      if (!videoId) return;
      const iframe = document.createElement('iframe');
      iframe.src = 'https://rutube.ru/play/embed/' + videoId + '?autoplay=1';
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('allow', 'autoplay; encrypted-media');
      iframe.setAttribute('title', 'Rutube видео');
      card.innerHTML = '';
      card.appendChild(iframe);
      card.classList.add('is-playing');
    });
  });

});
