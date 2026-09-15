document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const progressBar = document.querySelector(".scroll-progress");
  const animatedBackground = document.querySelector(".animated-background");
  const backgroundGrid = document.querySelector(".background-grid");

  // Scroll progress and background parallax
  function updateScrollEffects() {
    const scrollTop = window.scrollY;
    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const scrollProgress =
      scrollableHeight > 0 ? scrollTop / scrollableHeight : 0;

    if (progressBar) {
      progressBar.style.width = `${scrollProgress * 100}%`;
    }

    if (!reduceMotion && animatedBackground) {
      animatedBackground.style.setProperty(
        "--orb-one-scroll",
        `${scrollTop * -0.05}px`
      );

      animatedBackground.style.setProperty(
        "--orb-two-scroll",
        `${scrollTop * 0.07}px`
      );

      animatedBackground.style.setProperty(
        "--orb-three-scroll",
        `${scrollTop * -0.1}px`
      );
    }

    if (!reduceMotion && backgroundGrid) {
      backgroundGrid.style.backgroundPositionY = `${scrollTop * 0.12}px`;
    }
  }

  let scrollAnimationFrame;

  window.addEventListener(
    "scroll",
    () => {
      if (scrollAnimationFrame) {
        cancelAnimationFrame(scrollAnimationFrame);
      }

      scrollAnimationFrame = requestAnimationFrame(updateScrollEffects);
    },
    { passive: true }
  );

  updateScrollEffects();

  // Reveal sections when scrolling
  const revealElements = document.querySelectorAll(
    ".section-label, .section-title, .about-copy, " +
    ".experience-card, .skill-card, .featured-content"
  );

  revealElements.forEach((element, index) => {
    element.classList.add("reveal-on-scroll");
    element.style.setProperty("--reveal-delay", `${(index % 4) * 90}ms`);
  });

  if (reduceMotion) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -60px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  // Mouse-following spotlight
  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    const cursorLight = document.createElement("div");
    cursorLight.className = "cursor-light";
    cursorLight.setAttribute("aria-hidden", "true");
    document.body.appendChild(cursorLight);

    window.addEventListener("pointermove", (event) => {
      cursorLight.style.transform =
        `translate3d(${event.clientX}px, ${event.clientY}px, 0) ` +
        "translate(-50%, -50%)";

      cursorLight.classList.add("cursor-light-visible");
    });

    document.documentElement.addEventListener("mouseleave", () => {
      cursorLight.classList.remove("cursor-light-visible");
    });
  }

  // Subtle 3D movement on cards
  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    const tiltCards = document.querySelectorAll(
      ".profile-card, .skill-card, .experience-card"
    );

    tiltCards.forEach((card) => {
      card.addEventListener("mousemove", (event) => {
        const rectangle = card.getBoundingClientRect();

        const mouseX = event.clientX - rectangle.left;
        const mouseY = event.clientY - rectangle.top;

        const rotateY =
          ((mouseX - rectangle.width / 2) / rectangle.width) * 5;

        const rotateX =
          ((rectangle.height / 2 - mouseY) / rectangle.height) * 5;

        card.style.transform =
          `perspective(1000px) rotateX(${rotateX}deg) ` +
          `rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform =
          "perspective(1000px) rotateX(0deg) rotateY(0deg)";
      });
    });
  }
});
