document.addEventListener('DOMContentLoaded', () => {
  const brands = document.querySelector('.stage11-brandline');
  if (brands) {
    const extra = [...brands.querySelectorAll('[data-extra-brand]')];
    const fitBrands = () => {
      extra.forEach(el => { el.hidden = true; });
      if (window.innerWidth < 1024) return;
      const gap = parseFloat(getComputedStyle(brands).columnGap) || 0;
      const primary = [...brands.querySelectorAll('li:not([data-extra-brand])')];
      let used = primary.reduce((n, el) => n + el.getBoundingClientRect().width, 0) + gap * (primary.length - 1);
      for (const el of extra) {
        el.hidden = false;
        const width = el.getBoundingClientRect().width;
        if (used + gap + width > brands.clientWidth) { el.hidden = true; break; }
        used += gap + width;
      }
    };
    new ResizeObserver(fitBrands).observe(brands);
    document.fonts.ready.then(fitBrands);
    fitBrands();
  }
  const map = document.querySelector('[data-map-src]');
  if (map) {
    const button = map.querySelector('[data-load-map]');
    const status = map.querySelector('.stage11-map-status');
    button.addEventListener('click', () => {
      if (map.dataset.loaded) return;
      map.dataset.loaded = 'true';
      button.disabled = true;
      status.textContent = 'Загрузка карты…';
      const frame = document.createElement('iframe');
      frame.title = 'Ultra Service Auto — Яндекс.Карта';
      frame.src = map.dataset.mapSrc;
      frame.loading = 'lazy';
      frame.referrerPolicy = 'no-referrer';
      frame.width = '100%'; frame.height = '450';
      frame.onload = () => { status.textContent = ''; };
      button.hidden = true;
      map.appendChild(frame);
    });
  }
});
