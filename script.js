const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealItems = document.querySelectorAll("[data-reveal]");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => revealObserver.observe(item));

document.querySelectorAll(".tab-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const target = trigger.dataset.tab;
    document.querySelectorAll(".tab-trigger").forEach((item) => item.classList.remove("is-active"));
    document.querySelectorAll(".tab-content").forEach((panel) => panel.classList.remove("is-active"));
    trigger.classList.add("is-active");
    document.querySelector(`[data-tab-panel="${target}"]`)?.classList.add("is-active");
  });
});

document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    trigger.closest(".accordion-item")?.classList.toggle("is-open");
  });
});

const contactModal = document.querySelector(".qr-modal");
const openContactButtons = document.querySelectorAll("[data-open-contact]");
const closeContactButtons = document.querySelectorAll("[data-close-contact]");

function openContactModal() {
  if (!contactModal) return;
  contactModal.hidden = false;
  document.body.style.overflow = "hidden";
  contactModal.querySelector(".qr-close")?.focus();
}

function closeContactModal() {
  if (!contactModal) return;
  contactModal.hidden = true;
  document.body.style.overflow = "";
}

openContactButtons.forEach((button) => {
  button.addEventListener("click", openContactModal);
});

closeContactButtons.forEach((button) => {
  button.addEventListener("click", closeContactModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && contactModal && !contactModal.hidden) {
    closeContactModal();
  }
});

document.querySelectorAll(".magnetic").forEach((button) => {
  button.addEventListener("pointermove", (event) => {
    if (prefersReducedMotion) return;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    button.style.transform = `translate(${x * 0.08}px, ${y * 0.14}px)`;
  });

  button.addEventListener("pointerleave", () => {
    button.style.transform = "";
  });
});

const hero = document.querySelector(".hero");
const grid = document.querySelector(".spatial-grid");

if (hero && grid && !prefersReducedMotion) {
  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    grid.style.transform = `perspective(900px) rotateX(${61 + y * 5}deg) rotateZ(${-21 + x * 4}deg) translate3d(${x * 18}px, ${y * 18}px, 0)`;
  });
}

const canvas = document.querySelector("#waveform");
const ctx = canvas?.getContext("2d");
let frame = 0;

function drawWaveform() {
  if (!canvas || !ctx) return;

  const ratio = Math.max(window.devicePixelRatio || 1, 1);
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.floor(rect.width * ratio));
  const height = Math.max(1, Math.floor(rect.height * ratio));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  ctx.clearRect(0, 0, width, height);

  const barCount = Math.floor(width / 9);
  const center = height / 2;

  for (let i = 0; i < barCount; i += 1) {
    const phase = i * 0.38 + frame * 0.045;
    const pulse = Math.sin(phase) * 0.5 + Math.sin(phase * 0.41) * 0.5;
    const amplitude = Math.max(8 * ratio, (Math.abs(pulse) * 0.7 + 0.2) * height * 0.78);
    const x = i * 9 * ratio;
    const hueMix = i / barCount;
    const alpha = 0.28 + Math.abs(pulse) * 0.48;

    ctx.fillStyle =
      hueMix < 0.5
        ? `rgba(255, 212, 59, ${alpha})`
        : `rgba(86, 243, 255, ${alpha})`;
    ctx.fillRect(x, center - amplitude / 2, 4 * ratio, amplitude);
  }

  frame += 1;
  if (!prefersReducedMotion) requestAnimationFrame(drawWaveform);
}

drawWaveform();
