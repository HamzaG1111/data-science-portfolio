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
      const cityTravel = Math.min(scrollTop, window.innerHeight) * 0.065;

      animatedBackground.style.setProperty(
        "--city-scroll",
        `${cityTravel}px`
      );

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
    ".section-label, .section-title, .about-copy, .about-heading, " +
    ".about-introduction, .bento-card, .section-heading-row, " +
    ".experience-card, .experience-timeline, .experience-panel, " +
    ".skill-card, .skill-panel, .featured-content"
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
      ".profile-card, .bento-card, .experience-card, " +
      ".experience-panel, .skill-card, .skill-panel"
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

  // Highlight the current section in the navigation
  const sectionLinks = document.querySelectorAll(
    '.nav-links a[href^="#"]'
  );

  const pageSections = [...sectionLinks]
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (pageSections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          sectionLinks.forEach((link) => {
            const isCurrent =
              link.getAttribute("href") === `#${entry.target.id}`;

            link.classList.toggle("active-section", isCurrent);
          });
        });
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0
      }
    );

    pageSections.forEach((section) => sectionObserver.observe(section));
  }

  // Clickable work-experience browser
  const experienceTabs = [...document.querySelectorAll(".experience-tab")];
  const experiencePanels = [...document.querySelectorAll(".experience-detail")];

  function activateExperience(selectedTab) {
    const selectedExperience = selectedTab.dataset.experience;

    experienceTabs.forEach((tab) => {
      const isSelected = tab === selectedTab;
      tab.classList.toggle("is-active", isSelected);
      tab.setAttribute("aria-selected", String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
    });

    experiencePanels.forEach((panel) => {
      const isSelected = panel.dataset.panel === selectedExperience;
      panel.hidden = !isSelected;
      panel.classList.toggle("is-active", isSelected);
    });
  }

  experienceTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateExperience(tab));

    tab.addEventListener("keydown", (event) => {
      if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(event.key)) {
        return;
      }

      event.preventDefault();
      const direction = ["ArrowDown", "ArrowRight"].includes(event.key) ? 1 : -1;
      const nextIndex = (index + direction + experienceTabs.length) % experienceTabs.length;
      const nextTab = experienceTabs[nextIndex];
      activateExperience(nextTab);
      nextTab.focus();
    });
  });
});
