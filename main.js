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
