/* Ultra Service Auto — brands-slider.js
   Auto-advancing brand logos carousel.
   Native horizontal scroller (so mouse-drag / touch swipe just works),
   plus a timer that nudges it forward by one logo every few seconds.
   Pauses while the user is interacting (hover, touch, drag, scroll, focus). */

document.addEventListener('DOMContentLoaded', () => {

  const STEP_INTERVAL = 3000; // ms between auto steps
  const RESUME_DELAY   = 4000; // ms of inactivity before auto-play resumes

  document.querySelectorAll('.brands__viewport').forEach((viewport) => {
    const track = viewport.querySelector('.brands__track');
    if (!track) return;

    const slider = viewport.closest('.brands__slider');
    const prevBtn = slider && slider.querySelector('.brands__arrow--prev');
    const nextBtn = slider && slider.querySelector('.brands__arrow--next');

    let timer = null;
    let resumeTimeout = null;

    function itemStep() {
      const first = track.querySelector('.brands__logo-link');
      if (!first) return 0;
      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.columnGap || style.gap || '0') || 0;
      return first.getBoundingClientRect().width + gap;
    }

    function atEnd() {
      return viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 2;
    }

    function atStart() {
      return viewport.scrollLeft <= 1;
    }

    function goNext() {
      const step = itemStep();
      if (!step) return;

      if (atEnd()) {
        // Content is duplicated in the markup, so jumping back to the start
        // lands on an identical-looking set — the loop reads as seamless.
        viewport.scrollTo({ left: 0, behavior: 'auto' });
        return;
      }

      viewport.scrollBy({ left: step, behavior: 'smooth' });
    }

    function goPrev() {
      const step = itemStep();
      if (!step) return;

      if (atStart()) {
        // Wrap to the duplicated tail so it reads as a continuous loop.
        viewport.scrollTo({ left: viewport.scrollWidth - viewport.clientWidth, behavior: 'auto' });
        return;
      }

      viewport.scrollBy({ left: -step, behavior: 'smooth' });
    }

    function play() {
      stop();
      timer = window.setInterval(goNext, STEP_INTERVAL);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function pauseThenResume() {
      stop();
      if (resumeTimeout) window.clearTimeout(resumeTimeout);
      resumeTimeout = window.setTimeout(play, RESUME_DELAY);
    }

    // Pause on hover / focus (desktop) and on any touch/drag/scroll (mobile).
    viewport.addEventListener('mouseenter', stop);
    viewport.addEventListener('mouseleave', play);
    viewport.addEventListener('focusin', stop);
    viewport.addEventListener('focusout', play);
    viewport.addEventListener('touchstart', pauseThenResume, { passive: true });
    viewport.addEventListener('pointerdown', pauseThenResume);

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goPrev();
        pauseThenResume();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goNext();
        pauseThenResume();
      });
    }

    play();
  });

});
