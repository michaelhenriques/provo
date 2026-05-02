import './style.css';
import { Engine } from '@/Experience/Engine';

// ── Hero scroll-jacked frame animation ───────────────────────────────────────

const TOTAL_FRAMES   = 300;
const TEXT_FADE_START = 0.08;
const TEXT_FADE_END   = 0.15;

const frameImg        = document.getElementById('frame-img');
const heroText        = document.getElementById('hero-text');
const scrollContainer = document.getElementById('scroll-container');
const loader          = document.getElementById('loader');
const loaderBar       = document.getElementById('loader-bar');
const loaderPct       = document.getElementById('loader-pct');
const nav             = document.getElementById('nav');

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

function onScroll() {
  const scrollY    = window.scrollY;
  const maxScroll  = scrollContainer.offsetHeight - window.innerHeight;
  const progress   = Math.min(Math.max(scrollY / maxScroll, 0), 1);

  const frameIndex = Math.min(Math.floor(progress * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1);
  if (frameIndex !== currentFrameIndex) {
    currentFrameIndex = frameIndex;
    const cached = frames[frameIndex];
    frameImg.src = (cached && cached.complete) ? cached.src : frameUrl(frameIndex);
  }

  let textOpacity;
  if (progress <= TEXT_FADE_START) {
    textOpacity = 1;
  } else if (progress >= TEXT_FADE_END) {
    textOpacity = 0;
  } else {
    textOpacity = 1 - ((progress - TEXT_FADE_START) / (TEXT_FADE_END - TEXT_FADE_START));
  }
  heroText.style.opacity = textOpacity;

  nav.classList.toggle('scrolled', scrollY > 40);
}

preload();
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ── Depth gallery (flavors overlay) ──────────────────────────────────────────

const galleryOverlay = document.getElementById('gallery-overlay');
const exploreBtn     = document.getElementById('explore-btn');
const closeBtn       = document.getElementById('gallery-close');

let engine = null;
let galleryReady = false;

async function openGallery() {
  galleryOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  if (!galleryReady) {
    const canvas = document.querySelector('.webgl');
    engine = new Engine(canvas);
    await engine.init();
    galleryReady = true;
  } else {
    engine.activate();
  }
}

function closeGallery() {
  galleryOverlay.classList.remove('active');
  document.body.style.overflow = '';
  engine?.deactivate();
}

exploreBtn.addEventListener('click', openGallery);
closeBtn.addEventListener('click', closeGallery);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && galleryOverlay.classList.contains('active')) closeGallery();
});
