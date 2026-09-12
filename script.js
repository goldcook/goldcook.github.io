(function () {
  const content = window.SITE_CONTENT;
  if (!content) return;

  const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");

  const roots = {
    map: document.querySelector("[data-map-nodes]"),
    sides: document.querySelector("[data-side-quests]"),
    games: document.querySelector("[data-games]"),
    bgmTracks: document.querySelector("[data-bgm-tracks]"),
    recentTracks: document.querySelector("[data-recent-tracks]"),
    growth: document.querySelector("[data-growth-items]"),
    reflections: document.querySelector("[data-reflections]"),
  };
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  roots.map.innerHTML = content.mapAreas.map((area) => `
    <button class="map-node node-${escapeHtml(area.target)}" type="button" style="--x:${area.x}%;--y:${area.y}%" data-screen-target="${escapeHtml(area.target)}" aria-label="进入${escapeHtml(area.name)}">
      <span class="node-icon" aria-hidden="true"><b>${escapeHtml(area.icon)}</b></span><span class="node-label">${escapeHtml(area.name)}</span>
    </button>`).join("");

  roots.growth.innerHTML = content.growthItems.map((item) => `
    <article class="growth-card pixel-window reveal">
      <div><span>${escapeHtml(item.code)}</span><b aria-hidden="true">${escapeHtml(item.icon)}</b></div>
      <h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p>
    </article>`).join("");

  roots.sides.innerHTML = content.sideQuests.map((item) => `
    <article class="side-card side-card-${escapeHtml(item.color)} reveal">
      <span class="side-icon" aria-hidden="true">${escapeHtml(item.icon)}</span><p class="side-subtitle">${escapeHtml(item.subtitle)}</p>
      <h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p>
    </article>`).join("");

  roots.games.innerHTML = content.games.map((game, index) => `<span style="--delay:${index * 55}ms">${escapeHtml(game)}</span>`).join("");
  roots.bgmTracks.innerHTML = content.bgmTracks.map((track, index) => `
    <button type="button" data-bgm-track-index="${index}" aria-pressed="${index === 0}">
      <span>${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(track.subtitle)}</strong>
    </button>`).join("");
  roots.recentTracks.innerHTML = content.recentTracks.map((track) => `
    <a href="${escapeHtml(track.url)}" target="_blank" rel="noopener noreferrer" aria-label="在 QQ 音乐播放 ${escapeHtml(track.title)}，歌手 ${escapeHtml(track.artist)}">
      <span><strong>${escapeHtml(track.title)}</strong><small>${escapeHtml(track.artist)}</small></span><i>↗</i>
    </a>`).join("");
  roots.reflections.innerHTML = content.reflections.map((item) => `
    <article class="reflection-card reveal"><span>${escapeHtml(item.code)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p><i aria-hidden="true">→</i></article>`).join("");

  document.querySelectorAll("[data-year]").forEach((node) => { node.textContent = new Date().getFullYear(); });

  const menuButton = document.querySelector("[data-menu-button]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const menuBackground = [document.querySelector("main"), document.querySelector(".floating-bgm"), document.querySelector("[data-back-home]"), document.querySelector("footer")].filter(Boolean);
  const setMenu = (open, restoreFocus = false) => {
    menuButton?.setAttribute("aria-expanded", String(open));
    menuButton?.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
    mobileMenu?.setAttribute("aria-hidden", String(!open));
    mobileMenu?.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    menuBackground.forEach((region) => { region.inert = open; });
    if (open) window.requestAnimationFrame(() => mobileMenu?.querySelector("a")?.focus());
    else if (restoreFocus) menuButton?.focus();
  };
  menuButton?.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    setMenu(open, !open);
  });
  mobileMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton?.getAttribute("aria-expanded") === "true") setMenu(false, true);
  });

  const screens = [...document.querySelectorAll("[data-screen]")];
  const backButton = document.querySelector("[data-back-home]");
  const validScreens = new Set(screens.map((screen) => screen.dataset.screen));
  const visitedScreens = new Set();
  let lastVisitedScreen = null;
  let returningToMap = false;
  const screenAliases = { save: "work", thoughts: "growth", lobby: "life" };
  const showScreen = (target, historyMode = "push", moveFocus = true) => {
    const normalizedTarget = screenAliases[target] || target;
    const next = validScreens.has(normalizedTarget) ? normalizedTarget : "home";
    const current = screens.find((screen) => !screen.hidden)?.dataset.screen || "home";
    if (next !== "home" && next !== "map") {
      visitedScreens.add(next);
      lastVisitedScreen = next;
    }
    screens.forEach((screen) => {
      const active = screen.dataset.screen === next;
      screen.hidden = !active;
      screen.classList.toggle("is-active", active);
    });
    document.querySelectorAll("[data-screen-target]").forEach((link) => {
      if (!link.matches("nav a")) return;
      if (link.dataset.screenTarget === next) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    document.querySelectorAll(".map-node[data-screen-target]").forEach((node) => {
      node.classList.toggle("is-visited", visitedScreens.has(node.dataset.screenTarget));
      node.classList.toggle("is-current", next === "map" && node.dataset.screenTarget === lastVisitedScreen);
    });
    if (backButton) backButton.hidden = next === "home" || next === "map";
    setMenu(false);
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
    if (moveFocus) {
      const heading = document.querySelector(`[data-screen="${next}"] h1, [data-screen="${next}"] h2`);
      window.requestAnimationFrame(() => heading?.focus({ preventScroll: true }));
    }
    if (historyMode !== "none" && (next !== current || historyMode === "replace")) {
      const url = new URL(window.location.href);
      url.hash = next === "home" ? "" : next;
      const state = { screen: next, fromMap: current === "map" };
      if (historyMode === "replace") window.history.replaceState(state, "", url.toString());
      else window.history.pushState(state, "", url.toString());
    }
  };
  document.querySelectorAll("[data-screen-target]").forEach((node) => node.addEventListener("click", (event) => {
    event.preventDefault();
    showScreen(node.dataset.screenTarget, "push");
  }));
  backButton?.addEventListener("click", () => {
    if (returningToMap) return;
    returningToMap = true;
    backButton.disabled = true;
    if (window.history.state?.fromMap) window.history.back();
    else {
      showScreen("map", "replace");
      returningToMap = false;
      backButton.disabled = false;
    }
  });
  window.addEventListener("popstate", () => {
    showScreen(window.location.hash.slice(1) || "home", "none");
    returningToMap = false;
    if (backButton) backButton.disabled = false;
  });
  const initialScreen = window.location.hash.slice(1) || "home";
  showScreen(initialScreen, validScreens.has(initialScreen) ? "none" : "replace", false);

  const revealNodes = document.querySelectorAll(".reveal");
  if (reducedMotion.matches || !("IntersectionObserver" in window)) revealNodes.forEach((node) => node.classList.add("is-visible"));
  else {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { rootMargin: "0px 0px -8%", threshold: 0.08 });
    revealNodes.forEach((node) => observer.observe(node));
  }
  const ageValues = [...document.querySelectorAll("[data-age-value]")];
  const finishAgeLoading = () => {
    ageValues.forEach((node) => { node.textContent = "25"; });
    document.querySelectorAll("[data-age-fill]").forEach((node) => node.classList.add("is-loaded"));
  };
  if (reducedMotion.matches) finishAgeLoading();
  else {
    document.querySelectorAll("[data-age-fill]").forEach((node) => node.classList.add("is-loaded"));
    const startedAt = performance.now();
    const animateAge = (now) => {
      const progress = Math.min((now - startedAt) / 1500, 1);
      const value = Math.round(progress * 25);
      ageValues.forEach((node) => { node.textContent = String(value).padStart(2, "0"); });
      if (progress < 1) window.requestAnimationFrame(animateAge);
      else finishAgeLoading();
    };
    window.requestAnimationFrame(animateAge);
  }

  let audioContext;
  let masterGain;
  let bgmTimer;
  let step = 0;
  let bgmPlaying = false;
  let bgmBusy = false;
  let lastBgmToggle = 0;
  let currentBgmIndex = 0;
  const midiToHz = (note) => 440 * 2 ** ((note - 69) / 12);
  const playNote = (note, duration, type, volume) => {
    if (!audioContext || !masterGain) return;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;
    oscillator.type = type;
    oscillator.frequency.value = midiToHz(note);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    oscillator.connect(gain); gain.connect(masterGain); oscillator.start(now); oscillator.stop(now + duration + 0.03);
  };
  const tickBgm = () => {
    const track = content.bgmTracks[currentBgmIndex];
    const melodyNote = track.melody[step % track.melody.length];
    if (melodyNote) playNote(melodyNote, track.duration, track.lead, currentBgmIndex === 0 ? 0.2 : 0.27);
    if (step % track.bassEvery === 0) {
      const bassIndex = Math.floor(step / track.bassEvery) % track.bass.length;
      playNote(track.bass[bassIndex], Math.max(track.duration * 1.7, 0.18), track.bassType, currentBgmIndex === 2 ? 0.22 : 0.3);
    }
    if (step % track.accentEvery === track.accentEvery - 1) {
      const accentNote = currentBgmIndex === 0 ? 81 : currentBgmIndex === 1 ? 88 : 48;
      playNote(accentNote, currentBgmIndex === 0 ? 0.3 : 0.045, currentBgmIndex === 0 ? "sine" : "square", 0.07);
    }
    step += 1;
  };
  const startBgmLoop = () => {
    clearInterval(bgmTimer);
    step = 0;
    tickBgm();
    bgmTimer = window.setInterval(tickBgm, content.bgmTracks[currentBgmIndex].tempo);
  };
  const updateBgmUi = () => {
    document.querySelectorAll("[data-bgm-toggle]").forEach((button) => {
      button.setAttribute("aria-pressed", String(bgmPlaying));
      button.setAttribute("aria-label", bgmPlaying ? "停止 BGM" : "播放 BGM");
      button.textContent = button.closest(".floating-bgm") ? (bgmPlaying ? "■" : "▶") : (bgmPlaying ? "■ 停止 BGM" : "♪ 播放 BGM");
    });
    document.querySelectorAll("[data-bgm-title]").forEach((node) => { node.textContent = content.bgmTracks[currentBgmIndex].title; });
    document.querySelectorAll("[data-bgm-track-index]").forEach((button) => {
      button.setAttribute("aria-pressed", String(Number(button.dataset.bgmTrackIndex) === currentBgmIndex));
    });
  };
  const toggleBgm = async () => {
    const now = performance.now();
    if (bgmBusy || now - lastBgmToggle < 300) return;
    lastBgmToggle = now;
    bgmBusy = true;
    document.querySelectorAll("[data-bgm-toggle]").forEach((button) => { button.disabled = true; });
    try {
      if (bgmPlaying) {
        const contextToClose = audioContext;
        clearInterval(bgmTimer); audioContext = undefined; masterGain = undefined; bgmPlaying = false; updateBgmUi();
        await contextToClose?.close();
        return;
      }
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const nextContext = new AudioContextClass();
      const nextGain = nextContext.createGain();
      nextGain.gain.value = Number(document.querySelector("[data-volume]")?.value || 35) / 1000;
      nextGain.connect(nextContext.destination);
      await nextContext.resume();
      audioContext = nextContext; masterGain = nextGain; bgmPlaying = true; startBgmLoop(); updateBgmUi();
    } finally {
      bgmBusy = false;
      document.querySelectorAll("[data-bgm-toggle]").forEach((button) => { button.disabled = false; });
    }
  };
  const selectBgm = (index) => {
    currentBgmIndex = (index + content.bgmTracks.length) % content.bgmTracks.length;
    if (bgmPlaying) startBgmLoop();
    updateBgmUi();
  };
  document.querySelectorAll("[data-bgm-toggle]").forEach((button) => button.addEventListener("click", toggleBgm));
  document.querySelectorAll("[data-bgm-prev]").forEach((button) => button.addEventListener("click", () => selectBgm(currentBgmIndex - 1)));
  document.querySelectorAll("[data-bgm-next]").forEach((button) => button.addEventListener("click", () => selectBgm(currentBgmIndex + 1)));
  document.querySelectorAll("[data-bgm-track-index]").forEach((button) => button.addEventListener("click", () => selectBgm(Number(button.dataset.bgmTrackIndex))));
  document.querySelector("[data-volume]")?.addEventListener("input", (event) => { if (masterGain) masterGain.gain.value = Number(event.target.value) / 1000; });

  const bgmPanelButton = document.querySelector("[data-bgm-panel-toggle]");
  const bgmPanel = document.querySelector("[data-bgm-panel]");
  bgmPanelButton?.addEventListener("click", () => {
    const open = bgmPanelButton.getAttribute("aria-expanded") !== "true";
    bgmPanelButton.setAttribute("aria-expanded", String(open));
    bgmPanel?.classList.toggle("is-open", open);
    const icon = document.querySelector("[data-bgm-panel-icon]");
    if (icon) icon.textContent = open ? "−" : "+";
  });
  document.addEventListener("click", (event) => {
    if (!bgmPanel?.classList.contains("is-open") || event.target.closest("[data-floating-bgm]")) return;
    bgmPanel.classList.remove("is-open");
    bgmPanelButton?.setAttribute("aria-expanded", "false");
    const icon = document.querySelector("[data-bgm-panel-icon]");
    if (icon) icon.textContent = "+";
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !bgmPanel?.classList.contains("is-open")) return;
    bgmPanel.classList.remove("is-open");
    bgmPanelButton?.setAttribute("aria-expanded", "false");
    const icon = document.querySelector("[data-bgm-panel-icon]");
    if (icon) icon.textContent = "+";
    bgmPanelButton?.focus();
  });
  updateBgmUi();

  const header = document.querySelector("[data-header]");
  window.addEventListener("scroll", () => header?.classList.toggle("is-scrolled", window.scrollY > 24), { passive: true });
})();
