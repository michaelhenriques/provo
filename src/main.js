import './style.css';

const TOTAL_FRAMES   = 300;
const TEXT_FADE_START = 0.08;
const TEXT_FADE_END   = 0.15;

const frameImg       = document.getElementById('frame-img');
const heroText       = document.getElementById('hero-text');
const scrollContainer = document.getElementById('scroll-container');
const loader         = document.getElementById('loader');
const loaderBar      = document.getElementById('loader-bar');
const loaderPct      = document.getElementById('loader-pct');
const nav            = document.getElementById('nav');

// ── Preload ──────────────────────────────────────────────────────────────────

const frames = [];
let loadedCount = 0;
let loaderDismissed = false;
let currentFrameIndex = -1;

function frameUrl(i) {
  const n = String(i + 1).padStart(3, '0');
  return `/frames/ezgif-frame-${n}.jpg`;
}

function preload() {
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const img = new Image();

    img.onload = () => {
      loadedCount++;
      const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);
      loaderBar.style.width = pct + '%';
      loaderPct.textContent = pct + '%';

      if (loadedCount >= 20 && !loaderDismissed) {
        loaderDismissed = true;
        loader.classList.add('hidden');
      }
    };

    img.src = frameUrl(i);
    frames.push(img);
  }
}

// ── Scroll handler ───────────────────────────────────────────────────────────

function onScroll() {
  const scrollY        = window.scrollY;
  const containerH     = scrollContainer.offsetHeight;
  const maxScroll      = containerH - window.innerHeight;
  const progress       = Math.min(Math.max(scrollY / maxScroll, 0), 1);

  // Frame index
  const frameIndex = Math.min(
    Math.floor(progress * (TOTAL_FRAMES - 1)),
    TOTAL_FRAMES - 1
  );

  if (frameIndex !== currentFrameIndex) {
    currentFrameIndex = frameIndex;
    const cached = frames[frameIndex];
    frameImg.src = (cached && cached.complete) ? cached.src : frameUrl(frameIndex);
  }

  // Text opacity
  let textOpacity;
  if (progress <= TEXT_FADE_START) {
    textOpacity = 1;
  } else if (progress >= TEXT_FADE_END) {
    textOpacity = 0;
  } else {
    textOpacity = 1 - ((progress - TEXT_FADE_START) / (TEXT_FADE_END - TEXT_FADE_START));
  }
  heroText.style.opacity = textOpacity;

  // Nav background after first small scroll
  if (scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}

// ── Init ─────────────────────────────────────────────────────────────────────

preload();
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
