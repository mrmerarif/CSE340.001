// Dark mode toggle, scroll effects, parallax, micro-interactions

const initDarkModeToggle = () => {
  const toggle = document.getElementById("darkModeToggle");
  if (!toggle) return;

  const stored = localStorage.getItem("darkMode");
  if (stored === "on") {
    document.body.classList.add("dark");
  }

  toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("darkMode", isDark ? "on" : "off");
  });
};

const initScrollFadeSections = () => {
  const sections = document.querySelectorAll(".fade-section");
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.15 }
  );

  sections.forEach(section => observer.observe(section));
};

const initParallaxHero = () => {
  const hero = document.querySelector(".parallax-hero");
  if (!hero) return;

  window.addEventListener("scroll", () => {
    const offset = window.scrollY * 0.3;
    hero.style.transform = `translateY(${offset}px)`;
  });
};

const initFloatingCards = () => {
  const cards = document.querySelectorAll(
    ".categories-list li, .organizations-list li, .projects-list li"
  );
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      card.style.transform = `translateY(-4px) rotateX(${(-y / 40)}deg) rotateY(${x / 40}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  initDarkModeToggle();
  initScrollFadeSections();
  initParallaxHero();
  initFloatingCards();
});
