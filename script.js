// JX Design & Dev — script.js v4
// ================================

// 1. LENIS SMOOTH SCROLL
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// 2. CUSTOM CURSOR
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.08, ease: 'none' });
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  gsap.set(follower, { x: followerX, y: followerY });
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, .btn, .tag').forEach((el) => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); follower.classList.add('hover'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); follower.classList.remove('hover'); });
});
document.addEventListener('mouseleave', () => gsap.to([cursor, follower], { opacity: 0, duration: 0.2 }));
document.addEventListener('mouseenter', () => gsap.to([cursor, follower], { opacity: 1, duration: 0.2 }));

// 3. NAV SCROLL EFFECT
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 60);
});

// 4. THREE.JS PARTICLES
const canvas = document.getElementById('hero-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const count = 1800;
const positions = new Float32Array(count * 3);
const speeds = new Float32Array(count);

for (let i = 0; i < count; i++) {
  positions[i * 3]     = (Math.random() - 0.5) * 22;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
  speeds[i] = Math.random() * 0.004 + 0.001;
}

const geo = new THREE.BufferGeometry();
geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const mat = new THREE.PointsMaterial({
  color: 0x33ff14, size: 0.045, transparent: true, opacity: 0.55,
  sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false,
});

const particles = new THREE.Points(geo, mat);
scene.add(particles);

let tRX = 0, tRY = 0;
document.addEventListener('mousemove', (e) => {
  tRY = (e.clientX / window.innerWidth - 0.5) * 0.4;
  tRX = (e.clientY / window.innerHeight - 0.5) * 0.2;
});

const pos = geo.attributes.position.array;
let tick = 0;

function animateThree() {
  requestAnimationFrame(animateThree);
  tick += 0.003;
  for (let i = 0; i < count; i++) {
    pos[i * 3 + 1] += speeds[i];
    pos[i * 3] += Math.sin(tick + i * 0.1) * 0.0008;
    if (pos[i * 3 + 1] > 11) {
      pos[i * 3 + 1] = -11;
      pos[i * 3] = (Math.random() - 0.5) * 22;
    }
  }
  geo.attributes.position.needsUpdate = true;
  particles.rotation.y += (tRY - particles.rotation.y) * 0.04;
  particles.rotation.x += (tRX - particles.rotation.x) * 0.04;
  renderer.render(scene, camera);
}
animateThree();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 5. GSAP HERO ENTRANCE — cinematic
gsap.registerPlugin(ScrollTrigger);

gsap.set('.hero-photo',      { opacity: 0, scale: 1.08, x: 60 });
gsap.set('.hero-eyebrow',    { opacity: 0, x: -40 });
gsap.set('.title-line',      { opacity: 0, y: 100, skewY: 6 });
gsap.set('.hero-sub',        { opacity: 0, y: 30 });
gsap.set('.hero-cta',        { opacity: 0, y: 20 });
gsap.set('.tag',             { opacity: 0, y: 14 });
gsap.set('.badge',           { opacity: 0, y: -14 });
gsap.set('.scroll-indicator',{ opacity: 0 });
gsap.set('#hero-canvas',     { opacity: 0 });

const tl = gsap.timeline({ delay: 0.3 });
tl
  .to('#hero-canvas',        { opacity: 1, duration: 2, ease: 'power2.out' })
  .to('.hero-photo',         { opacity: 1, scale: 1, x: 0, duration: 1.8, ease: 'power4.out' }, 0.3)
  .to('.hero-eyebrow',       { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' }, 0.9)
  .to('.title-line',         { opacity: 1, y: 0, skewY: 0, stagger: 0.15, duration: 1.1, ease: 'power4.out' }, 1.1)
  .to('.hero-sub',           { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 1.6)
  .to('.hero-cta',           { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 1.85)
  .to('.tag',                { opacity: 1, y: 0, stagger: 0.06, duration: 0.5, ease: 'power3.out' }, 2.0)
  .to('.badge',              { opacity: 1, y: 0, stagger: 0.2, duration: 0.7, ease: 'power3.out' }, 1.7)
  .to('.scroll-indicator',   { opacity: 1, duration: 0.5 }, 2.4);

// Scroll parallax
gsap.to('.hero-photo', {
  scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
  y: 100, scale: 1.06, ease: 'none',
});
gsap.to('.hero-content', {
  scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
  y: -50, ease: 'none',
});

// 6. STATS COUNTER — direct ID targeting, no data attributes needed
function countUp(id, target, suffix) {
  const el = document.getElementById(id);
  if (!el) return;
  let current = 0;
  const step = target / 80;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, 25);
}

// Fire counters after 1.5s — guaranteed to run regardless of scroll
setTimeout(() => {
  countUp('stat-1', 4,   '+');
  countUp('stat-2', 20,  '+');
  countUp('stat-3', 4,   '+');
  countUp('stat-4', 100, '%');
}, 1500);

// Stats entrance
gsap.from('.stat', {
  scrollTrigger: { trigger: '#stats-bar', start: 'top 85%' },
  opacity: 0, y: 50, stagger: 0.12, duration: 1, ease: 'power4.out',
});

// 7. MARQUEE PAUSE ON HOVER
const marquee = document.querySelector('.marquee-track');
if (marquee) {
  marquee.addEventListener('mouseenter', () => marquee.style.animationPlayState = 'paused');
  marquee.addEventListener('mouseleave', () => marquee.style.animationPlayState = 'running');
}

// Console Easter egg
console.log('%c JX Design & Dev ', 'background:#33ff14;color:#000;font-weight:900;font-size:18px;padding:12px 24px;border-radius:4px;');
console.log('%c Okezie Ferdinand — System Designer & Builder ', 'color:#33ff14;font-size:12px;');