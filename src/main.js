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
}

preload();
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ── Depth gallery — activated by IntersectionObserver ────────────────────────

const gallerySection = document.getElementById('gallery-section');

let engine       = null;
let galleryReady = false;
let galleryActive = false;

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

function setupExitCallbacks() {
  // Scroll past first flavor → go back to hero
  engine.scroll.onExitTop = () => {
    deactivateGallery();
    window.scrollTo({ top: gallerySection.offsetTop - window.innerHeight * 0.5, behavior: 'smooth' });
  };
  // Scroll past last flavor → continue to coming-soon
  engine.scroll.onExitBottom = () => {
    deactivateGallery();
    window.scrollTo({ top: gallerySection.offsetTop + gallerySection.offsetHeight + 1, behavior: 'smooth' });
  };
}

const galleryObserver = new IntersectionObserver(async (entries) => {
  const entry = entries[0];

  if (entry.isIntersecting) {
    if (!galleryReady) {
      const canvas = gallerySection.querySelector('.webgl');
      engine = new Engine(canvas);
      await engine.init();
      engine.deactivate(); // unbind scroll events — we control activation
      setupExitCallbacks();
      galleryReady = true;
    }
    activateGallery();
  } else if (!entry.isIntersecting) {
    deactivateGallery();
  }
}, { threshold: 0.85 });

galleryObserver.observe(gallerySection);
