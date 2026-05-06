import './style.css';
import { Engine } from '@/Experience/Engine';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── DOM refs ──────────────────────────────────────────────────────────────────
const nav            = document.getElementById('nav');
const gallerySection = document.getElementById('gallery-section');
const loader         = document.getElementById('loader');

// ── Loader — hide once page assets are ready ──────────────────────────────────
if (loader) {
  window.addEventListener('load', () => loader.classList.add('hidden'));
}

// ── Lenis smooth scroll ────────────────────────────────────────────────────────
const lenis = new Lenis({ lerp: 0.08, syncTouch: true });

lenis.on('scroll', ({ scroll }) => {
  nav.classList.toggle('scrolled', scroll > 40);
  checkGalleryActivation(scroll);
});
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// ── Hero zoom (GSAP ScrollTrigger pin) ────────────────────────────────────────
gsap.timeline({
  scrollTrigger: {
    trigger: '.hero-wrapper',
    start: 'top top',
    end: '+=150%',
    pin: true,
    scrub: true,
  },
})
  .to('.hero-wrapper img', {
    scale: 2,
    z: 350,
    transformOrigin: 'center center',
    ease: 'power1.inOut',
  })
  .to('.section.hero', {
    scale: 1.1,
    transformOrigin: 'center center',
    ease: 'power1.inOut',
  }, '<')
  .to('#hero-text', { opacity: 0, duration: 0.25, ease: 'power1.in' }, '<');

// ── Depth gallery — precise scroll-position activation ───────────────────────
let engine            = null;
let galleryReady      = false;
let galleryActive     = false;
let galleryExiting    = false;
let galleryExitingTop = false;
let labelOverlay      = null;

const initObserver = new IntersectionObserver(async (entries) => {
  if (!entries[0].isIntersecting || engine) return;
  initObserver.disconnect();

  const canvas = gallerySection.querySelector('.webgl');
  engine = new Engine(canvas);
  await engine.init();
  labelOverlay = document.querySelector('.plane-label-overlay');
  engine.deactivate();
  setupExitCallbacks();
  galleryReady = true;

  checkGalleryActivation(window.scrollY);
}, { rootMargin: '300px 0px 0px 0px', threshold: 0 });

initObserver.observe(gallerySection);

function activateGallery() {
  if (galleryActive) return;
  galleryActive     = true;
  galleryExiting    = false;
  galleryExitingTop = false;
  lenis.stop();
  document.body.style.overflow = 'hidden';
  engine.activate();
  if (labelOverlay) labelOverlay.style.visibility = 'visible';
}

function deactivateGallery() {
  if (!galleryActive) return;
  galleryActive = false;
  document.body.style.overflow = '';
  lenis.start();
  engine.deactivate();
  if (labelOverlay) labelOverlay.style.visibility = 'hidden';
}

function checkGalleryActivation(scrollY) {
  if (!galleryReady || galleryActive) return;

  const galleryBottom = gallerySection.offsetTop + gallerySection.offsetHeight;

  if (galleryExiting) {
    if (scrollY > galleryBottom) galleryExiting = false;
    return;
  }

  if (galleryExitingTop) {
    if (scrollY < gallerySection.offsetTop) galleryExitingTop = false;
    return;
  }

  if (scrollY >= gallerySection.offsetTop && scrollY < galleryBottom) {
    activateGallery();
  }
}

function setupExitCallbacks() {
  engine.scroll.onExitTop = () => {
    galleryExitingTop = true;
    deactivateGallery();
    requestAnimationFrame(() => {
      lenis.scrollTo(gallerySection.offsetTop - 10, { duration: 0.8 });
    });
  };
  engine.scroll.onExitBottom = () => {
    galleryExiting = true;
    deactivateGallery();
    requestAnimationFrame(() => {
      lenis.scrollTo(gallerySection.offsetTop + gallerySection.offsetHeight + 10, { duration: 0.8 });
    });
  };
}

// ── Telescope zoom section ────────────────────────────────────────────────────
const teleSection = document.getElementById('tele-section');

if (teleSection) {
  const teleFronts = teleSection.querySelectorAll('.tele__front');
  const teleSmall  = teleSection.querySelectorAll('.tele__images img');

  gsap.set(teleSmall, {
    transformStyle: 'preserve-3d',
    backfaceVisibility: 'hidden',
    force3D: true,
  });

  const teleTl = gsap.timeline({
    scrollTrigger: {
      trigger: teleSection,
      start: 'top top',
      end: '+=250%',
      scrub: 1.5,
      pin: true,
      onUpdate: (self) => {
        const eased = gsap.parseEase('power1.inOut')(self.progress);
        teleSection.style.setProperty('--progress', 0.22 + eased * 0.83);
      },
    },
  });

  teleTl.to(teleSmall, {
    z: '100vh',
    duration: 1,
    ease: 'power1.inOut',
    stagger: { amount: 0.2, from: 'center' },
  });

  teleTl.to(teleFronts, {
    scale: 1,
    duration: 1,
    ease: 'power1.inOut',
    delay: 0.1,
  }, 0.6);

  teleTl.to(teleFronts, {
    filter: 'blur(0px)',
    duration: 1,
    ease: 'power1.inOut',
    delay: 0.4,
    stagger: { amount: 0.2, from: 'end' },
  }, 0.6);

  teleTl.to('.tele__reveal', { opacity: 1, duration: 0.4, ease: 'power2.inOut' }, '>-0.1');
}

// ── Arch section — GSAP + ScrollTrigger ──────────────────────────────────────
const bgColors    = ['#0a0a0a', '#0d1a0f', '#0a0c1a'];
const archImages  = document.querySelectorAll('.arch__img');
const archSection = document.getElementById('arch-section');

if (archImages.length && archSection) {
  ScrollTrigger.create({
    trigger: '.arch__right',
    start: 'top top',
    end: () => `+=${archSection.offsetHeight - window.innerHeight}`,
    pin: true,
    pinSpacing: false,
  });

  archImages.forEach((img, i) => {
    if (i === 0) return;

    gsap.set(img, { clipPath: 'inset(100% 0% 0% 0%)' });

    ScrollTrigger.create({
      trigger: `.arch__block:nth-child(${i + 1})`,
      start: 'top 60%',
      onEnter:     () => gsap.to(img, { clipPath: 'inset(0% 0% 0% 0%)',   duration: 0.9, ease: 'power3.inOut' }),
      onLeaveBack: () => gsap.to(img, { clipPath: 'inset(100% 0% 0% 0%)', duration: 0.7, ease: 'power3.inOut' }),
    });

    ScrollTrigger.create({
      trigger: `.arch__block:nth-child(${i + 1})`,
      start: 'top 55%',
      onEnter:     () => gsap.to(archSection, { backgroundColor: bgColors[i],     duration: 1, ease: 'power2.inOut' }),
      onLeaveBack: () => gsap.to(archSection, { backgroundColor: bgColors[i - 1], duration: 1, ease: 'power2.inOut' }),
    });
  });
}
