/* ========= Mobile nav toggle ========= */
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector("nav ul");
  if (toggle && navList) {
    toggle.addEventListener("click", () => navList.classList.toggle("open"));
  }
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});

/* ========= Typed role effect (Home only) ========= */
(function () {
  const el = document.getElementById("typed-role");
  if (!el) return;
  const roles = [
    "Business Systems Analyst",
    "Business Analyst"
    "Operations Analyst",
    "Product & Growth Analyst",
  ];
  let roleIndex = 0, charIndex = 0, typing = true;

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

/* ========= 3D Floating Particles (Depth Field) =========
   - Lightweight, no dependencies
   - Honors prefers-reduced-motion
   - Pauses when tab is hidden
*/
(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // config
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const PARTICLE_COUNT = 180;       // adjust if needed
  const FIELD_DEPTH = 1200;         // virtual z-depth
  const SPEED = 0.6;                // forward speed
  const BASE_SIZE = 2.2;            // base point size
  const FOCAL_LENGTH = 420;         // perspective scale
  const COLOR_NEAR = [210, 230, 255];
  const COLOR_FAR = [120, 140, 200];

  let width, height, cx, cy, running = true;
  let particles = [];
  let pointerX = 0, pointerY = 0;   // gentle parallax

  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.floor(width * DPR);
    canvas.height = Math.floor(height * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    cx = width / 2;
    cy = height / 2;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function resetParticle(p, far = false) {
    p.x = rand(-cx * 1.5, cx * 1.5);
    p.y = rand(-cy * 1.5, cy * 1.5);
    p.z = far ? rand(FIELD_DEPTH * 0.5, FIELD_DEPTH) : rand(FOCAL_LENGTH * 0.6, FIELD_DEPTH);
  }

  function create() {
    particles = new Array(PARTICLE_COUNT).fill(0).map(() => {
      const p = { x: 0, y: 0, z: 0 };
      resetParticle(p, true);
      return p;
    });
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function draw() {
    if (!running) return;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Move forward in Z space
      p.z -= SPEED;
      if (p.z < 1) resetParticle(p, true);

      // Gentle parallax from pointer
      const ox = (pointerX - cx) * 0.02;
      const oy = (pointerY - cy) * 0.02;

      // Perspective projection
      const scale = FOCAL_LENGTH / (p.z + FOCAL_LENGTH);
      const x2d = (p.x + ox) * scale + cx;
      const y2d = (p.y + oy) * scale + cy;

      // If off-screen, recycle
      if (x2d < -50 || x2d > width + 50 || y2d < -50 || y2d > height + 50) {
        resetParticle(p, false);
        continue;
      }

      // Size and alpha by depth
      const size = BASE_SIZE * scale * 1.2;
      const depthT = Math.min(1, Math.max(0, 1 - p.z / FIELD_DEPTH)); // near -> 1
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

    requestAnimationFrame(draw);
  }

  // Pointer parallax (gentle)
  function onPointerMove(e) {
    if (reduceMotion) return;
    const t = e.touches ? e.touches[0] : e;
    pointerX = t.clientX;
    pointerY = t.clientY;
  }

  // Pause when page hidden (battery friendly)
  document.addEventListener("visibilitychange", () => { running = !document.hidden; if (running) draw(); });

  // Initialize
  resize();
  create();

  if (!reduceMotion) {
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onPointerMove, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    requestAnimationFrame(draw);
  } else {
    // If reduced motion, draw a static frame
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      const scale = FOCAL_LENGTH / (p.z + FOCAL_LENGTH);
      const x2d = p.x * scale + cx;
      const y2d = p.y * scale + cy;
      ctx.beginPath();
      ctx.fillStyle = "rgba(200,210,255,0.45)";
      ctx.arc(x2d, y2d, BASE_SIZE * scale, 0, Math.PI * 2);
      ctx.fill();
    });
  }
})();
