(function () {
  const content = window.SITE_CONTENT;
  if (!content) return;

  const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  const getSafeHref = (value, allowMailto = false) => {
    const href = String(value || "").trim();
    if (!href) return null;
    try {
      const protocol = new URL(href, window.location.origin).protocol;
      return ["http:", "https:", ...(allowMailto ? ["mailto:"] : [])].includes(protocol) ? href : null;
    } catch {
      return null;
    }
  };

  const roots = {
    editionLabel: document.querySelector("[data-edition-label]"),
    editionDate: document.querySelector("[data-edition-date]"),
    map: document.querySelector("[data-map-nodes]"),
    mapCount: document.querySelector("[data-map-count]"),
    mapRoutes: document.querySelector("[data-map-routes]"),
    treeNodes: document.querySelector("[data-tree-nodes]"),
    treeCount: document.querySelector("[data-tree-count]"),
    treeRoutes: document.querySelector("[data-tree-routes]"),
    socialLinks: document.querySelector("[data-social-links]"),
    notesEmpty: document.querySelector("[data-notes-empty]"),
    notesList: document.querySelector("[data-notes-list]"),
    notesStatus: document.querySelector("[data-notes-status]"),
    privateCode: document.querySelector("[data-private-code]"),
    privateEyebrow: document.querySelector("[data-private-eyebrow]"),
    privateHeadline: document.querySelector("[data-private-headline]"),
    privateLead: document.querySelector("[data-private-lead]"),
    privateQuote: document.querySelector("[data-private-quote]"),
    privateRecords: document.querySelector("[data-private-records]"),
    privateCollection: document.querySelector("[data-private-collection]"),
    privateCollections: document.querySelector("[data-private-collections]"),
    sides: document.querySelector("[data-side-quests]"),
    bgmTracks: document.querySelector("[data-bgm-tracks]"),
    recentTracks: document.querySelector("[data-recent-tracks]"),
    growth: document.querySelector("[data-growth-items]"),
    reflections: document.querySelector("[data-reflections]"),
  };
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const isLocalPreview = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);

  if (content.siteEdition) {
    roots.editionLabel.textContent = content.siteEdition.label;
    roots.editionDate.textContent = content.siteEdition.date;
    roots.editionDate.dateTime = content.siteEdition.isoDate;
  }

  roots.map.innerHTML = content.mapAreas.map((area) => `
    <button class="map-node node-${escapeHtml(area.target)}" type="button" style="--x:${area.x}%;--y:${area.y}%" data-screen-target="${escapeHtml(area.target)}" aria-label="进入${escapeHtml(area.name)}">
      <span class="node-icon" aria-hidden="true"><b>${escapeHtml(area.icon)}</b></span><span class="node-label">${escapeHtml(area.name)}</span>
    </button>`).join("");
  roots.mapCount.textContent = `${content.mapAreas.length} AREAS FOUND`;
  roots.mapRoutes.innerHTML = content.mapAreas.map((area) => {
    const controlX = 50 + (area.x - 50) * 0.55;
    const controlY = 58 + (area.y - 58) * 0.45;
    return `<path d="M50 58 C${controlX} ${controlY} ${controlX} ${area.y} ${area.x} ${area.y}" /><circle cx="${area.x}" cy="${area.y}" r="1.2" />`;
  }).join("");

  const socialLinks = Array.isArray(content.socialLinks)
    ? content.socialLinks.map((link) => ({ ...link, safeUrl: getSafeHref(link.url, true) })).filter((link) => link.safeUrl)
    : [];
  roots.socialLinks.hidden = socialLinks.length === 0;
  roots.socialLinks.innerHTML = socialLinks.map((link) => `
    <a href="${escapeHtml(link.safeUrl)}" target="_blank" rel="noopener noreferrer"><span>${escapeHtml(link.label)}</span><i aria-hidden="true">↗</i></a>`).join("");

  roots.treeNodes.innerHTML = content.lifeStages.map((stage, index) => `
    <button class="tree-node tree-node-${escapeHtml(stage.accent)}" type="button" style="--x:${stage.x}%;--y:${stage.y}%" data-tree-stage="${index}" aria-pressed="${index === content.lifeStages.length - 1}">
      <span>${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(stage.title)}</strong><i class="tree-node-lock" aria-label="私人档案已上锁"></i>
    </button>`).join("");
  roots.treeCount.textContent = `${content.lifeStages.length} CHAPTERS FOUND`;
  const treeY = content.lifeStages.map((stage) => stage.y);
  const trunkTop = Math.max(4, Math.min(...treeY) - 7);
  const trunkBottom = Math.min(96, Math.max(...treeY) + 16);
  roots.treeRoutes.innerHTML = [
    `<path class="tree-trunk" d="M50 ${trunkBottom} C49 ${trunkBottom - 20} 51 ${trunkTop + 20} 50 ${trunkTop}" />`,
    ...content.lifeStages.map((stage) => `<path d="M50 ${stage.y} C${50 + (stage.x - 50) * 0.35} ${stage.y} ${50 + (stage.x - 50) * 0.7} ${stage.y} ${stage.x} ${stage.y}" /><circle cx="50" cy="${stage.y}" r="1" />`),
  ].join("");

  let privateTimelineContent = null;
  const getStoredTreeStageIndex = () => {
    if (!isLocalPreview) return Number.NaN;
    try { return Number.parseInt(window.sessionStorage.getItem("goldcook-tree-stage") || "", 10); }
    catch { return Number.NaN; }
  };
  const storedTreeStageIndex = getStoredTreeStageIndex();
  let selectedTreeStageIndex = Number.isInteger(storedTreeStageIndex) && content.lifeStages[storedTreeStageIndex]
    ? storedTreeStageIndex
    : content.lifeStages.length - 1;
  const treeDetail = {
    code: document.querySelector("[data-tree-detail-code]"),
    title: document.querySelector("[data-tree-detail-title]"),
    summary: document.querySelector("[data-tree-detail-summary]"),
    tags: document.querySelector("[data-tree-detail-tags]"),
    privateOpen: document.querySelector("[data-private-open]"),
    privateOpenLabel: document.querySelector("[data-private-open-label]"),
  };
  const updatePrivateArchiveButton = () => {
    const stage = content.lifeStages[selectedTreeStageIndex];
    const hasLocalEntry = Boolean(stage?.privateId && privateTimelineContent?.[stage.privateId]);
    treeDetail.privateOpen.disabled = !hasLocalEntry;
    treeDetail.privateOpenLabel.textContent = hasLocalEntry ? "解锁本机档案 →" : privateTimelineContent ? "私人档案 · 待整理" : "私人档案 · 已上锁";
  };
  const selectTreeStage = (index) => {
    const stage = content.lifeStages[index];
    if (!stage) return;
    selectedTreeStageIndex = index;
    if (isLocalPreview) {
      try { window.sessionStorage.setItem("goldcook-tree-stage", String(index)); }
      catch { /* The archive still works when browser storage is unavailable. */ }
    }
    treeDetail.code.textContent = stage.code;
    treeDetail.title.textContent = stage.title;
    treeDetail.summary.textContent = stage.summary;
    treeDetail.tags.innerHTML = stage.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
    document.querySelectorAll("[data-tree-stage]").forEach((button) => button.setAttribute("aria-pressed", String(Number(button.dataset.treeStage) === index)));
    updatePrivateArchiveButton();
  };
  document.querySelectorAll("[data-tree-stage]").forEach((button) => button.addEventListener("click", () => selectTreeStage(Number(button.dataset.treeStage))));
  selectTreeStage(selectedTreeStageIndex);

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

  roots.bgmTracks.innerHTML = content.bgmTracks.map((track, index) => `
    <button type="button" data-bgm-track-index="${index}" aria-pressed="${index === 0}">
      <span>${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(track.subtitle)}</strong>
    </button>`).join("");
  roots.recentTracks.innerHTML = content.recentTracks.map((track) => `
    <a href="${escapeHtml(track.url)}" target="_blank" rel="noopener noreferrer" aria-label="在 QQ 音乐播放 ${escapeHtml(track.title)}，歌手 ${escapeHtml(track.artist)}">
      <span><strong>${escapeHtml(track.title)}</strong><small>${escapeHtml(track.artist)}</small></span><i>↗</i>
    </a>`).join("");
  roots.reflections.innerHTML = content.reflections.map((item) => `
    <article class="reflection-card reveal"><span>${escapeHtml(item.code)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></article>`).join("");

  const notes = Array.isArray(content.notes) ? content.notes : [];
  roots.notesEmpty.hidden = notes.length > 0;
  roots.notesList.hidden = notes.length === 0;
  roots.notesStatus.textContent = notes.length > 0 ? `${notes.length} NOTES` : "COMING SOON";
  roots.notesList.innerHTML = notes.map((note, index) => {
    const body = `<span>${escapeHtml(note.tag || `NOTE ${String(index + 1).padStart(2, "0")}`)}</span><h3>${escapeHtml(note.title)}</h3><p>${escapeHtml(note.excerpt || "")}</p>`;
    const safeUrl = getSafeHref(note.url);
    const externalAttributes = /^https?:\/\//i.test(safeUrl || "") ? ' target="_blank" rel="noopener noreferrer"' : "";
    return safeUrl
      ? `<a class="note-card" href="${escapeHtml(safeUrl)}"${externalAttributes}>${body}<i aria-hidden="true">READ →</i></a>`
      : `<article class="note-card">${body}</article>`;
  }).join("");

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
  const validScreens = new Set(screens.filter((screen) => !screen.hasAttribute("data-private-screen")).map((screen) => screen.dataset.screen));
  const visitedScreens = new Set();
  let lastVisitedScreen = null;
  let returningToMap = false;
  const screenParents = { "private-archive": "timeline" };
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
    if (backButton) {
      backButton.hidden = next === "home" || next === "map";
      backButton.textContent = screenParents[next] ? "← 返回背景故事" : "← 返回地图";
    }
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
  const renderPrivateArchive = (entry) => {
    roots.privateCode.textContent = entry.code;
    roots.privateEyebrow.textContent = entry.eyebrow;
    roots.privateHeadline.textContent = entry.headline;
    roots.privateLead.textContent = entry.lead;
    roots.privateQuote.textContent = entry.quote;
    roots.privateRecords.dataset.count = String(entry.records.length);
    roots.privateRecords.innerHTML = entry.records.map((record) => `
      <article class="private-record-card pixel-window reveal is-visible">
        <span>${escapeHtml(record.code)}</span><h3>${escapeHtml(record.title)}</h3><p>${escapeHtml(record.description)}</p>
      </article>`).join("");
    const collections = entry.collections || [];
    roots.privateRecords.classList.toggle("has-collection", collections.length > 0);
    roots.privateCollection.hidden = collections.length === 0;
    roots.privateCollections.innerHTML = collections.map((group) => `
      <div><strong>${escapeHtml(group.label)}</strong><p>${group.items.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</p></div>`).join("");
  };
  treeDetail.privateOpen?.addEventListener("click", () => {
    const stage = content.lifeStages[selectedTreeStageIndex];
    const entry = stage?.privateId ? privateTimelineContent?.[stage.privateId] : null;
    if (!entry) return;
    renderPrivateArchive(entry);
    showScreen("private-archive", "push");
  });
  backButton?.addEventListener("click", () => {
    if (returningToMap) return;
    returningToMap = true;
    backButton.disabled = true;
    const current = screens.find((screen) => !screen.hidden)?.dataset.screen || "home";
    if (screenParents[current]) {
      showScreen(screenParents[current], "replace");
      returningToMap = false;
      backButton.disabled = false;
      return;
    }
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
  const restorePrivateArchive = isLocalPreview && initialScreen === "private-archive";
  showScreen(restorePrivateArchive ? "timeline" : initialScreen, validScreens.has(initialScreen) || restorePrivateArchive ? "none" : "replace", false);

  if (isLocalPreview) {
    const privateScript = document.createElement("script");
    privateScript.src = `private/timeline.local.js?v=${Date.now()}`;
    privateScript.onload = () => {
      privateTimelineContent = window.PRIVATE_TIMELINE_CONTENT || null;
      if (privateTimelineContent) {
        validScreens.add("private-archive");
        document.body.classList.add("has-private-archive");
        updatePrivateArchiveButton();
        if (restorePrivateArchive) {
          const stage = content.lifeStages[selectedTreeStageIndex];
          const entry = stage?.privateId ? privateTimelineContent[stage.privateId] : null;
          if (entry) {
            renderPrivateArchive(entry);
            showScreen("private-archive", "none", false);
          }
        }
      }
    };
    document.head.append(privateScript);
  }

  const revealNodes = document.querySelectorAll(".reveal");
  if (reducedMotion.matches || !("IntersectionObserver" in window)) revealNodes.forEach((node) => node.classList.add("is-visible"));
  else {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { rootMargin: "0px 0px -8%", threshold: 0.08 });
    revealNodes.forEach((node) => observer.observe(node));
  }
  window.requestAnimationFrame(() => {
    document.querySelectorAll("[data-age-fill]").forEach((node) => node.classList.add("is-loaded"));
  });

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
  const bgmRoot = document.querySelector("[data-floating-bgm]");
  const setBgmPanel = (open) => {
    bgmPanelButton?.setAttribute("aria-expanded", String(open));
    bgmPanelButton?.setAttribute("aria-label", open ? "收起音乐播放器" : "打开音乐播放器");
    bgmPanel?.classList.toggle("is-open", open);
    bgmRoot?.classList.toggle("is-expanded", open);
    const icon = document.querySelector("[data-bgm-panel-icon]");
    if (icon) icon.textContent = open ? "−" : "+";
  };
  bgmPanelButton?.addEventListener("click", () => {
    const open = bgmPanelButton.getAttribute("aria-expanded") !== "true";
    setBgmPanel(open);
  });
  document.addEventListener("click", (event) => {
    if (!bgmPanel?.classList.contains("is-open") || event.target.closest("[data-floating-bgm]")) return;
    setBgmPanel(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !bgmPanel?.classList.contains("is-open")) return;
    setBgmPanel(false);
    bgmPanelButton?.focus();
  });
  updateBgmUi();

  const header = document.querySelector("[data-header]");
  window.addEventListener("scroll", () => header?.classList.toggle("is-scrolled", window.scrollY > 24), { passive: true });
})();
