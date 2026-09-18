document.documentElement.classList.add('js');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menuButton.hidden = false;
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('open', open);
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) {
    closeMenu();
    menuButton.focus();
  }
});

// The section stays hidden until real, approved videos are supplied.
const videoSection = document.querySelector('#videos');
const videoGrid = videoSection?.querySelector('.video-grid');
const videoItems = Array.isArray(window.zeekrVideos) ? window.zeekrVideos : [];
for (const item of videoItems) {
  if (!item || !item.title || !item.src) continue;
  const card = document.createElement('article');
  card.className = 'video-card';
  const heading = document.createElement('h3');
  heading.textContent = item.title;
  const duration = document.createElement('p');
  duration.className = 'video-duration';
  duration.textContent = item.duration ? `Видео · ${item.duration}` : 'Видео из мастерской';
  const video = document.createElement('video');
  video.controls = true;
  video.playsInline = true;
  video.preload = 'none';
  video.src = item.src;
  if (item.poster) video.poster = item.poster;
  video.setAttribute('aria-label', item.title);
  const fallback = document.createElement('a');
  fallback.href = item.src;
  fallback.textContent = 'Открыть видео';
  video.append(fallback);
  const error = document.createElement('p');
  error.className = 'video-error';
  error.hidden = true;
  error.setAttribute('role', 'status');
  error.textContent = 'Не удалось загрузить видео. Попробуйте обновить страницу.';
  video.addEventListener('error', () => { error.hidden = false; });
  video.addEventListener('loadeddata', () => { error.hidden = true; });
  video.addEventListener('play', () => {
    videoGrid.querySelectorAll('video').forEach(other => {
      if (other !== video) other.pause();
    });
  });
  const description = document.createElement("p");
  description.className = "video-description";
  description.textContent = item.description || "";
  card.append(video, duration, heading, description, error);
  videoGrid?.append(card);
}
if (videoGrid?.children.length) videoSection.hidden = false;
