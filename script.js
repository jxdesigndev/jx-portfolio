// ================================
// JX Design & Dev — script.js
// ================================

// --- Lenis Smooth Scroll ---
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// --- Custom Cursor ---
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
  gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.08, ease: 'none' });
});
function animateFollower() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  gsap.set(follower, { x: followerX, y: followerY });
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .btn, .tag').forEach((el) => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); follower.classList.add('hover'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); follower.classList.remove('hover'); });
});
document.addEventListener('mouseleave', () => gsap.to([cursor, follower], { opacity: 0, duration: 0.2 }));
document.addEventListener('mouseenter', () => gsap.to([cursor, follower], { opacity: 1, duration: 0.2 }));

// --- Nav scroll ---
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 60);
});

// ================================
// THREE.JS — Floating Particles
// ================================
const canvas = document.getElementById('hero-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const count = 2000;
const positions = new Float32Array(count * 3);
const speeds = new Float32Array(count);

for (let i = 0; i < count; i++) {
  positions[i * 3]     = (Math.random() - 0.5) * 22;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
  speeds[i] = Math.random() * 0.004 + 0.001;
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({
  color: 0x33ff14,
  size: 0.045,
  transparent: true,
  opacity: 0.55,
  sizeAttenuation: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

let targetRotX = 0, targetRotY = 0;
document.addEventListener('mousemove', (e) => {
  targetRotY = (e.clientX / window.innerWidth - 0.5) * 0.4;
  targetRotX = (e.clientY / window.innerHeight - 0.5) * 0.2;
});

const posArr = geometry.attributes.position.array;
let tick = 0;

function animateThree() {
  requestAnimationFrame(animateThree);
  tick += 0.003;
  for (let i = 0; i < count; i++) {
    posArr[i * 3 + 1] += speeds[i];
    posArr[i * 3] += Math.sin(tick + i * 0.1) * 0.0008;
    if (posArr[i * 3 + 1] > 11) {
      posArr[i * 3 + 1] = -11;
      posArr[i * 3] = (Math.random() - 0.5) * 22;
    }
  }
  geometry.attributes.position.needsUpdate = true;
  particles.rotation.y += (targetRotY - particles.rotation.y) * 0.04;
  particles.rotation.x += (targetRotX - particles.rotation.x) * 0.04;
  renderer.render(scene, camera);
}
animateThree();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ================================
// GSAP — Hero Entrance (cinematic)
// ================================
gsap.registerPlugin(ScrollTrigger);

// Set initial states
gsap.set('.hero-photo', { opacity: 0, scale: 1.08, x: 40 });
gsap.set('.hero-eyebrow', { opacity: 0, x: -40 });
gsap.set('.title-line', { opacity: 0, y: 100, skewY: 5 });
gsap.set('.hero-sub', { opacity: 0, y: 30 });
gsap.set('.hero-cta', { opacity: 0, y: 24 });
gsap.set('.tag', { opacity: 0, y: 16 });
gsap.set('.badge', { opacity: 0, y: -16 });
gsap.set('.scroll-indicator', { opacity: 0 });
gsap.set('#hero-canvas', { opacity: 0 });

const heroTL = gsap.timeline({ delay: 0.2 });

heroTL
  .to('#hero-canvas', { opacity: 1, duration: 2.5, ease: 'power2.out' })
  .to('.hero-photo', {
    opacity: 1, scale: 1, x: 0,
    duration: 1.8, ease: 'power4.out'
  }, 0.3)
  .to('.hero-eyebrow', {
    opacity: 1, x: 0,
    duration: 0.9, ease: 'power3.out'
  }, 0.8)
  .to('.title-line', {
    opacity: 1, y: 0, skewY: 0,
    stagger: 0.14, duration: 1.1, ease: 'power4.out'
  }, 1.0)
  .to('.hero-sub', {
    opacity: 1, y: 0,
    duration: 0.85, ease: 'power3.out'
  }, 1.5)
  .to('.hero-cta', {
    opacity: 1, y: 0,
    duration: 0.75, ease: 'power3.out'
  }, 1.75)
  .to('.tag', {
    opacity: 1, y: 0,
    stagger: 0.06, duration: 0.55, ease: 'power3.out'
  }, 1.95)
  .to('.badge', {
    opacity: 1, y: 0,
    stagger: 0.2, duration: 0.7, ease: 'power3.out'
  }, 1.6)
  .to('.scroll-indicator', {
    opacity: 1, duration: 0.6
  }, 2.3);

// Photo subtle parallax on scroll
gsap.to('.hero-photo', {
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1.5,
  },
  y: 100,
  scale: 1.06,
  ease: 'none',
});

// Hero content subtle upward drift on scroll
gsap.to('.hero-content', {
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
  },
  y: -60,
  ease: 'none',
});

// ================================
// STATS COUNTER — Bulletproof version
// ================================
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'));
  const suffix = el.getAttribute('data-suffix') || '+';
  const duration = 2000; // ms
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current + (progress === 1 ? suffix : '');
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// Use IntersectionObserver — fires when stats section enters view
const statsSection = document.getElementById('stats-bar');
let counted = false;

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !counted) {
      counted = true;
      document.querySelectorAll('.stat-num').forEach(el => animateCounter(el));
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

statsObserver.observe(statsSection);

// Stats entrance animation
gsap.from('.stat', {
  scrollTrigger: { trigger: '#stats-bar', start: 'top 85%' },
  opacity: 0, y: 50, stagger: 0.12, duration: 1, ease: 'power4.out',
});

// Marquee pause on hover
const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
  marqueeTrack.addEventListener('mouseenter', () => marqueeTrack.style.animationPlayState = 'paused');
  marqueeTrack.addEventListener('mouseleave', () => marqueeTrack.style.animationPlayState = 'running');
}

// Console signature
console.log('%c JX Design & Dev ', 'background:#33ff14;color:#000;font-weight:bold;font-size:16px;padding:10px 20px;border-radius:4px;');
console.log('%c Built by Okezie Ferdinand — System Designer & Builder ', 'color:#33ff14;font-size:11px;');