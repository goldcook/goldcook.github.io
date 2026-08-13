(function () {
  const content = window.SITE_CONTENT;

  if (!content) {
    return;
  }

  const escapeHtml = (value) =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const renderFacts = () => {
    const root = document.querySelector("[data-facts]");
    if (!root) return;

    root.innerHTML = content.facts
      .map(
        (fact) => `
          <article class="fact reveal">
            <span class="fact-index">${escapeHtml(fact.index)}</span>
            <strong>${escapeHtml(fact.value)}</strong>
            <p>${escapeHtml(fact.label)}</p>
          </article>
        `,
      )
      .join("");
  };

  const renderFocuses = () => {
    const root = document.querySelector("[data-focus-list]");
    if (!root) return;

    root.innerHTML = content.focuses
      .map(
        (focus) => `
          <article class="focus-item reveal">
            <span class="focus-index">${escapeHtml(focus.index)}</span>
            <div class="focus-name">
              <h3>${escapeHtml(focus.title)}</h3>
              <p>${escapeHtml(focus.titleZh)}</p>
            </div>
            <p class="focus-question">${escapeHtml(focus.question)}</p>
            <ul class="tag-list" aria-label="关键词">
              ${focus.tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("")}
            </ul>
          </article>
        `,
      )
      .join("");
  };

  const renderProjects = () => {
    const root = document.querySelector("[data-projects]");
    if (!root) return;

    root.innerHTML = content.projects
      .map(
        (project) => `
          <a
            class="project project-${escapeHtml(project.tone)} reveal"
            href="${escapeHtml(project.href)}"
            target="_blank"
            rel="noreferrer"
            aria-label="查看 ${escapeHtml(project.title)} 项目"
          >
            <div class="project-topline">
              <span>PROJECT / ${escapeHtml(project.index)}</span>
              <span aria-hidden="true">↗</span>
            </div>
            <h3>${escapeHtml(project.title)}</h3>
            <p>${escapeHtml(project.description)}</p>
            <div class="project-footer">
              <span>${escapeHtml(project.language)}</span>
              <span>OPEN REPOSITORY</span>
            </div>
          </a>
        `,
      )
      .join("");
  };

  const renderNotes = () => {
    const root = document.querySelector("[data-notes]");
    if (!root) return;

    root.innerHTML = content.notes
      .map(
        (note) => `
          <article class="note reveal">
            <p class="note-date">${escapeHtml(note.date)}</p>
            <h3>${escapeHtml(note.title)}</h3>
            <p>${escapeHtml(note.body)}</p>
          </article>
        `,
      )
      .join("");
  };

  renderFacts();
  renderFocuses();
  renderProjects();
  renderNotes();

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  const menuButton = document.querySelector("[data-menu-toggle]");
  const navigation = document.querySelector("[data-nav]");

  const closeMenu = () => {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "打开导航");
    navigation.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  menuButton?.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "打开导航" : "关闭导航");
    navigation?.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  navigation?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  const signalButton = document.querySelector("[data-signal]");
  const signalMessage = document.querySelector("[data-signal-message]");
  const signalCore = signalButton?.querySelector(".signal-core");
  const signals = [
    ["RL", "REWARD IS A HINT,", "NOT THE WHOLE ANSWER."],
    ["MA", "COORDINATION STARTS", "WHERE CONTROL ENDS."],
    ["AG", "LONG HORIZONS NEED", "BETTER MEMORY."],
  ];
  let signalIndex = 0;

  signalButton?.addEventListener("click", () => {
    signalIndex = (signalIndex + 1) % signals.length;
    const [label, lineOne, lineTwo] = signals[signalIndex];
    if (signalCore) signalCore.textContent = label;
    if (signalMessage) signalMessage.innerHTML = `${lineOne}<br>${lineTwo}`;
    signalButton.classList.remove("is-pulsing");
    requestAnimationFrame(() => signalButton.classList.add("is-pulsing"));
  });

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const revealNodes = document.querySelectorAll(".reveal");

  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.08 },
    );

    revealNodes.forEach((node) => revealObserver.observe(node));
  }

  const header = document.querySelector("[data-header]");
  let previousScroll = window.scrollY;

  window.addEventListener(
    "scroll",
    () => {
      const currentScroll = window.scrollY;
      header?.classList.toggle("is-compact", currentScroll > 40);
      header?.classList.toggle(
        "is-hidden",
        currentScroll > previousScroll && currentScroll > 360 && !document.body.classList.contains("menu-open"),
      );
      previousScroll = currentScroll;
    },
    { passive: true },
  );

  const cursorLight = document.querySelector(".cursor-light");
  if (cursorLight && !reducedMotion.matches && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("pointermove", (event) => {
      cursorLight.style.setProperty("--x", `${event.clientX}px`);
      cursorLight.style.setProperty("--y", `${event.clientY}px`);
      cursorLight.classList.add("is-active");
    });
  }
})();
