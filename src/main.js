import './style.css';
import { Engine } from '@/Experience/Engine';

// ── Hero scroll-jacked frame animation ───────────────────────────────────────

const TOTAL_FRAMES    = 300;
const TEXT_FADE_START = 0.08;
const TEXT_FADE_END   = 0.15;

const frameImg        = document.getElementById('frame-img');
const heroText        = document.getElementById('hero-text');
const scrollContainer = document.getElementById('scroll-container');
const loader          = document.getElementById('loader');
const loaderBar       = document.getElementById('loader-bar');
const loaderPct       = document.getElementById('loader-pct');
const nav             = document.getElementById('nav');
const gallerySection  = document.getElementById('gallery-section');

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
  const scrollY   = window.scrollY;
  const maxScroll = scrollContainer.offsetHeight - window.innerHeight;
  const progress  = Math.min(Math.max(scrollY / maxScroll, 0), 1);

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

  // Activate gallery only once the gallery section is fully in view
  // (scrollY exactly at the section's top edge = hero is fully gone)
  checkGalleryActivation(scrollY);
}

preload();
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ── Depth gallery — precise scroll-position activation ───────────────────────

let engine        = null;
let galleryReady  = false;
let galleryActive = false;

// Lazy-init: start loading Three.js when section is close (within 300px)
const initObserver = new IntersectionObserver(async (entries) => {
  if (!entries[0].isIntersecting || engine) return;
  initObserver.disconnect();

  const canvas = gallerySection.querySelector('.webgl');
  engine = new Engine(canvas);
  await engine.init();
  engine.deactivate();
  setupExitCallbacks();
  galleryReady = true;

  // In case the user is already past the threshold
  checkGalleryActivation(window.scrollY);
}, { rootMargin: '300px 0px 0px 0px', threshold: 0 });

initObserver.observe(gallerySection);

function activateGallery() {
  if (galleryActive) return;
  galleryActive = true;
  document.body.style.overflow = 'hidden';
  engine.activate();
}

function deactivateGallery() {
  if (!galleryActive) return;
  galleryActive = false;
  document.body.style.overflow = '';
  engine.deactivate();
}

function checkGalleryActivation(scrollY) {
  if (!galleryReady || galleryActive) return;
  // Fire only when the gallery section's top edge is at or above the viewport top
  if (scrollY >= gallerySection.offsetTop) {
    activateGallery();
  }
}

function setupExitCallbacks() {
  engine.scroll.onExitTop = () => {
    deactivateGallery();
    // Scroll back so the hero end is visible
    window.scrollTo({ top: gallerySection.offsetTop - 10, behavior: 'smooth' });
  };
  engine.scroll.onExitBottom = () => {
    deactivateGallery();
    // Drop into the coming-soon section
    window.scrollTo({ top: gallerySection.offsetTop + gallerySection.offsetHeight + 1, behavior: 'smooth' });
  };
}
