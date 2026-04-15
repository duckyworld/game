const page = document.body.dataset.page;
const navLinks = document.querySelectorAll("[data-nav]");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const yearTarget = document.querySelector("[data-year]");
const flickerTargets = document.querySelectorAll("[data-flicker]");

if (page) {
  navLinks.forEach((link) => {
    const isActive = link.dataset.nav === page;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    }
  });
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    siteNav.classList.toggle("is-open", !expanded);
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("is-open");
    });
  });
}

if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

flickerTargets.forEach((target) => {
  const stableText = target.dataset.flicker;
  const glyphs = "01ABCDEF?/\\\\";

  window.setInterval(() => {
    if (Math.random() > 0.28) {
      return;
    }

    const scrambled = stableText
      .split("")
      .map((character) =>
        Math.random() > 0.55 ? glyphs[Math.floor(Math.random() * glyphs.length)] : character
      )
      .join("");

    target.textContent = scrambled;

    window.setTimeout(() => {
      target.textContent = stableText;
    }, 120);
  }, 1800);
});
