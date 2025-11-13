/* ========= Basic setup: mobile nav + year ========= */
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector("nav ul");
  if (toggle && navList) {
    toggle.addEventListener("click", () => {
      navList.classList.toggle("open");
    });
  }

  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ========= Scroll Reveal ========= */
  const SELECTORS =
    ".section-card, .item-card, .project-card, .contact-card, .timeline";

  const elements = Array.from(document.querySelectorAll(SELECTORS));

  if (!elements.length) return;

  // If IntersectionObserver not supported, show everything
  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("reveal-visible"));
    return;
  }

  elements.forEach((el) => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  elements.forEach((el) => observer.observe(el));
});

/* ========= Typed role effect (Home only) ========= */
(function () {
  const el = document.getElementById("typed-role");
  if (!el) return;

  const roles = [
    "Business Systems Analyst",
    "Engineering Operations Analyst",
    "Product & Growth Analyst",
    "API & Integration Enthusiast",
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let typing = true;

  function tick() {
    const text = roles[roleIndex];
    if (typing) {
      el.textContent = text.slice(0, ++charIndex);
      if (charIndex === text.length) {
        typing = false;
        setTimeout(tick, 1200);
        return;
      }
    } else {
      el.textContent = text.slice(0, --charIndex);
      if (charIndex === 0) {
        typing = true;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(tick, typing ? 85 : 55);
  }

  tick();
})();

/* ========= 3D Floating Particles (for pages with #bg-canvas) ========= */
(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const PARTICLE_COUNT = 180;
  const FIELD_DEPTH = 1200;
  const SPEED = 0.6;
  const BASE_SIZE = 2.2;
  const FOCAL_LENGTH = 420;
  const COLOR_NEAR = [210, 230, 255];
  const COLOR_FAR = [120, 140, 200];

  let width, height, cx, cy;
  let particles = [];
  let pointerX = 0;
  let pointerY = 0;
  let running = true;

  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.floor(width * DPR);
    canvas.height = Math.floor(height * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    cx = width / 2;
    cy = height / 2;
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function resetParticle(p, far = false) {
    p.x = rand(-cx * 1.5, cx * 1.5);
    p.y = rand(-cy * 1.5, cy * 1.5);
    p.z = far
      ? rand(FIELD_DEPTH * 0.5, FIELD_DEPTH)
      : rand(FOCAL_LENGTH * 0.6, FIELD_DEPTH);
  }

  function create() {
    particles = new Array(PARTICLE_COUNT).fill(0).map(() => {
      const p = { x: 0, y: 0, z: 0 };
      resetParticle(p, true);
      return p;
    });
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function drawFrame() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Move forward in Z space
      p.z -= SPEED;
      if (p.z < 1) {
        resetParticle(p, true);
      }

      const ox = (pointerX - cx) * 0.02;
      const oy = (pointerY - cy) * 0.02;

      const scale = FOCAL_LENGTH / (p.z + FOCAL_LENGTH);
      const x2d = (p.x + ox) * scale + cx;
      const y2d = (p.y + oy) * scale + cy;

      if (
        x2d < -50 ||
        x2d > width + 50 ||
        y2d < -50 ||
        y2d > height + 50
      ) {
        resetParticle(p, false);
        continue;
      }

      const size = BASE_SIZE * scale * 1.2;
      const depthT = Math.min(1, Math.max(0, 1 - p.z / FIELD_DEPTH));
      const r = Math.round(lerp(COLOR_FAR[0], COLOR_NEAR[0], depthT));
      const g = Math.round(lerp(COLOR_FAR[1], COLOR_NEAR[1], depthT));
      const b = Math.round(lerp(COLOR_FAR[2], COLOR_NEAR[2], depthT));
      const alpha = 0.35 + 0.45 * depthT;

      ctx.beginPath();
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.shadowColor = `rgba(${r},${g},${b},${Math.min(0.6, alpha)})`;
      ctx.shadowBlur = 6 * depthT + 2;
      ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function loop() {
    if (!running) return;
    drawFrame();
    requestAnimationFrame(loop);
  }

  function onPointerMove(e) {
    if (reduceMotion) return;
    const t = e.touches ? e.touches[0] : e;
    pointerX = t.clientX;
    pointerY = t.clientY;
  }

  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) requestAnimationFrame(loop);
  });

  resize();
  create();

  if (!reduceMotion) {
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onPointerMove, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    requestAnimationFrame(loop);
  } else {
    // Static frame for reduced motion
    drawFrame();
  }
})();

/* ========= 3D Neon Sphere (homepage only, for #sphere-canvas) ========= */
(function () {
  const canvas = document.getElementById("sphere-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let width, height, cx, cy;
  let orbs = [];
  const ORB_COUNT = 110;
  const SPHERE_RADIUS_BASE = 140;
  const ROTATION_SPEED = 0.004;
  let rotation = 0;
  let running = true;

  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.floor(width * DPR);
    canvas.height = Math.floor(height * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    cx = width / 2;
    cy = height / 2;
  }

  function createOrbs() {
    orbs = [];
    for (let i = 0; i < ORB_COUNT; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const radiusFactor = 0.6 + Math.random() * 0.4;

      orbs.push({
        phi,
        theta,
        radiusFactor,
        speed: 0.0015 + Math.random() * 0.0025,
      });
    }
  }

  function drawSphereCore() {
    const r = SPHERE_RADIUS_BASE * 1.05;
    const gradient = ctx.createRadialGradient(
      cx - r * 0.3,
      cy - r * 0.4,
      r * 0.1,
      cx,
      cy,
      r * 1.15
    );
    gradient.addColorStop(0, "rgba(248, 250, 252, 0.9)");
    gradient.addColorStop(0.3, "rgba(59, 130, 246, 0.85)");
    gradient.addColorStop(0.65, "rgba(168, 85, 247, 0.3)");
    gradient.addColorStop(1, "rgba(15, 23, 42, 0.0)");

    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = "rgba(129, 140, 248, 0.9)";
    ctx.lineWidth = 1.3;
    ctx.shadowColor = "rgba(129, 140, 248, 0.9)";
    ctx.shadowBlur = 12;
    ctx.arc(cx, cy, r * 1.05, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  function drawOrbs() {
    for (let i = 0; i < orbs.length; i++) {
      const o = orbs[i];
      o.theta += o.speed;
      const phi = o.phi;
      const theta = o.theta + rotation;

      const r = SPHERE_RADIUS_BASE * o.radiusFactor;

      const x3d = r * Math.sin(phi) * Math.cos(theta);
      const y3d = r * Math.cos(phi);
      const z3d = r * Math.sin(phi) * Math.sin(theta);

      const perspective = 0.8 + z3d / (SPHERE_RADIUS_BASE * 2);
      const x2d = cx + x3d * perspective;
      const y2d = cy + y3d * 0.55 * perspective;

      const depth = (z3d + SPHERE_RADIUS_BASE) / (SPHERE_RADIUS_BASE * 2);
      const size = 2 + depth * 2.2;

      const rCol = Math.round(120 + depth * 120);
      const gCol = Math.round(180 + depth * 50);
      const bCol = Math.round(255);

      const alpha = 0.25 + depth * 0.6;

      ctx.beginPath();
      ctx.fillStyle = `rgba(${rCol},${gCol},${bCol},${alpha})`;
      ctx.shadowColor = `rgba(${rCol},${gCol},${bCol},${Math.min(
        0.9,
        alpha + 0.1
      )})`;
      ctx.shadowBlur = 6 + depth * 10;
      ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    const bgGradient = ctx.createRadialGradient(
      cx,
      cy,
      Math.min(width, height) * 0.1,
      cx,
      cy,
      Math.max(width, height) * 0.9
    );
    bgGradient.addColorStop(0, "rgba(15, 23, 42, 0.0)");
    bgGradient.addColorStop(1, "rgba(3, 7, 18, 0.85)");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    drawSphereCore();
    drawOrbs();

    rotation += ROTATION_SPEED;
  }

  function loop() {
    if (!running) return;
    draw();
    requestAnimationFrame(loop);
  }

  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) requestAnimationFrame(loop);
  });

  function onPointerMove(e) {
    const t = e.touches ? e.touches[0] : e;
    const normX = (t.clientX / width - 0.5) * 2;
    const normY = (t.clientY / height - 0.5) * 2;
    cx = width / 2 + normX * 20;
    cy = height / 2 + normY * 14;
  }

  resize();
  createOrbs();

  if (!reduceMotion) {
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onPointerMove, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    requestAnimationFrame(loop);
  } else {
    drawSphereCore();
  }
})();
