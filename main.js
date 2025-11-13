// Typing effect for roles on the home page
const roles = [
  "Business Systems Analyst",
  "Engineering Operations Analyst",
  "Product & Growth Analyst",
  "API & Integration Enthusiast"
];

let roleIndex = 0;
let charIndex = 0;
let typingElement = null;
let typingDelay = 90;
let pauseDelay = 1400;

function typeRole() {
  if (!typingElement) return;

  if (charIndex < roles[roleIndex].length) {
    typingElement.textContent += roles[roleIndex].charAt(charIndex);
    charIndex++;
    setTimeout(typeRole, typingDelay);
  } else {
    setTimeout(eraseRole, pauseDelay);
  }
}

function eraseRole() {
  if (!typingElement) return;

  if (charIndex > 0) {
    typingElement.textContent = roles[roleIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(eraseRole, typingDelay / 1.6);
  } else {
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(typeRole, typingDelay);
  }
}

// Mobile nav toggle
function setupNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector("nav ul");

  if (!toggle || !navList) return;

  toggle.addEventListener("click", () => {
    navList.classList.toggle("open");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  typingElement = document.getElementById("typed-role");
  if (typingElement) {
    typeRole();
  }

  setupNavToggle();
});
// ===== 3D Tilt Card Effect =====
const tiltCard = document.getElementById("tilt-card");

if (tiltCard) {
  tiltCard.addEventListener("mousemove", (e) => {
    const rect = tiltCard.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotateX = -(y / 20);
    const rotateY = x / 20;

    tiltCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  tiltCard.addEventListener("mouseleave", () => {
    tiltCard.style.transform = "rotateX(0deg) rotateY(0deg)";
  });
}
