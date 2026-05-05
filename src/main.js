import './style.css';
import { Engine } from '@/Experience/Engine';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

function onScroll(scrollY = window.scrollY) {
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

// ── Lenis smooth scroll ────────────────────────────────────────────────────────
const lenis = new Lenis({ lerp: 0.08, syncTouch: true });

lenis.on('scroll', ({ scroll }) => {
  onScroll(scroll);
});

function rafLoop(time) {
  lenis.raf(time);
  requestAnimationFrame(rafLoop);
}
requestAnimationFrame(rafLoop);

ScrollTrigger.scrollerProxy(document.documentElement, {
  scrollTop(value) {
    if (arguments.length) lenis.scrollTo(value, { immediate: true });
    return lenis.scroll;
  },
  getBoundingClientRect() {
    return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
  },
});
lenis.on('scroll', ScrollTrigger.update);

preload();
onScroll(0);

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
  lenis.stop();
  engine.activate();
}

function deactivateGallery() {
  if (!galleryActive) return;
  galleryActive = false;
  lenis.start();
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
    lenis.scrollTo(gallerySection.offsetTop - 10, { duration: 0.8 });
  };
  engine.scroll.onExitBottom = () => {
    deactivateGallery();
    lenis.scrollTo(gallerySection.offsetTop + gallerySection.offsetHeight + 10, { duration: 0.8 });
  };
}

// ── Arch section — GSAP + ScrollTrigger ──────────────────────────────────────

const bgColors = ['#0a0a0a', '#0d1a0f', '#0a0c1a'];

const archImages = document.querySelectorAll('.arch__img');
const archSection = document.getElementById('arch-section');

if (archImages.length && archSection) {
  // Pin the right column
  ScrollTrigger.create({
    trigger: '.arch__right',
    start: 'top top',
    end: () => `+=${archSection.offsetHeight - window.innerHeight}`,
    pin: true,
    pinSpacing: false,
    scroller: document.documentElement,
  });

  // Wipe images in as each text block scrolls into view
  archImages.forEach((img, i) => {
    if (i === 0) return; // first image visible by default

    gsap.set(img, { clipPath: 'inset(100% 0% 0% 0%)' });

    ScrollTrigger.create({
      trigger: `.arch__block:nth-child(${i + 1})`,
      start: 'top 60%',
      end: 'top 20%',
      scroller: document.documentElement,
      onEnter: () => gsap.to(img, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power3.inOut' }),
      onLeaveBack: () => gsap.to(img, { clipPath: 'inset(100% 0% 0% 0%)', duration: 0.7, ease: 'power3.inOut' }),
    });

    // Background tint shift
    ScrollTrigger.create({
      trigger: `.arch__block:nth-child(${i + 1})`,
      start: 'top 55%',
      scroller: document.documentElement,
      onEnter: () => gsap.to(archSection, { backgroundColor: bgColors[i], duration: 1, ease: 'power2.inOut' }),
      onLeaveBack: () => gsap.to(archSection, { backgroundColor: bgColors[i - 1], duration: 1, ease: 'power2.inOut' }),
    });
  });
}
