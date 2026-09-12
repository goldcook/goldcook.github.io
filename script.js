(function () {
  const content = window.SITE_CONTENT;
  if (!content) return;

  const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");

  const roots = {
    quests: document.querySelector("[data-quests]"),
    map: document.querySelector("[data-map-nodes]"),
    sides: document.querySelector("[data-side-quests]"),
    games: document.querySelector("[data-games]"),
    tracks: document.querySelector("[data-tracks]"),
    thoughts: document.querySelector("[data-thoughts]"),
  };

  roots.quests.innerHTML = content.quests.map((quest) => `
    <article class="quest-card pixel-window reveal">
      <div class="quest-card-top"><span class="quest-icon">${escapeHtml(quest.icon)}</span><span>${escapeHtml(quest.status)}</span></div>
      <h3>${escapeHtml(quest.title)}</h3><p>${escapeHtml(quest.description)}</p>
      <div class="mini-progress" aria-label="进度 ${quest.progress}%"><span style="--progress:${quest.progress}%"></span></div><small>${quest.progress}%</small>
    </article>`).join("");

  roots.map.innerHTML = content.mapAreas.map((area, index) => `
    <button class="map-node${index === 0 ? " is-active" : ""}" type="button" style="--x:${area.x}%;--y:${area.y}%" data-area-index="${index}" aria-label="查看${escapeHtml(area.name)}" aria-pressed="${index === 0}">
      <span class="node-icon" aria-hidden="true">${escapeHtml(area.icon)}</span><span class="node-label">${escapeHtml(area.name)}</span>
    </button>`).join("");

  roots.sides.innerHTML = content.sideQuests.map((item) => `
    <article class="side-card side-card-${escapeHtml(item.color)} reveal">
      <span class="side-icon" aria-hidden="true">${escapeHtml(item.icon)}</span><p class="side-subtitle">${escapeHtml(item.subtitle)}</p>
      <h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p>
    </article>`).join("");

  roots.games.innerHTML = content.games.map((game, index) => `<span style="--delay:${index * 55}ms">${escapeHtml(game)}</span>`).join("");
  roots.tracks.innerHTML = content.tracks.map((track) => `
    <a class="track" href="${escapeHtml(track.href)}" target="_blank" rel="noreferrer">
      <span class="track-number">${escapeHtml(track.number)}</span><span class="track-title">${escapeHtml(track.title)}</span>
      <span class="track-artist">${escapeHtml(track.artist)}</span><span class="track-arrow" aria-hidden="true">↗</span>
    </a>`).join("");
  roots.thoughts.innerHTML = content.thoughts.map((thought, index) => `
    <li class="reveal"><span>QUEST ${String(index + 1).padStart(2, "0")}</span><p>${escapeHtml(thought)}</p><i aria-hidden="true">?</i></li>`).join("");

  document.querySelectorAll("[data-year]").forEach((node) => { node.textContent = new Date().getFullYear(); });

  const menuButton = document.querySelector("[data-menu-button]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const setMenu = (open) => {
    menuButton?.setAttribute("aria-expanded", String(open));
    menuButton?.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
    mobileMenu?.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
  };
  menuButton?.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
  mobileMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));

  const updateMapDialog = (index) => {
    const area = content.mapAreas[index];
    if (!area) return;
    document.querySelector("[data-map-code]").textContent = area.code;
    document.querySelector("[data-map-icon]").textContent = area.icon;
    document.querySelector("[data-map-name]").textContent = area.name;
    document.querySelector("[data-map-description]").textContent = area.description;
    document.querySelector("[data-map-items]").innerHTML = area.items.map((item) => `<li>+ ${escapeHtml(item)}</li>`).join("");
    document.querySelectorAll("[data-area-index]").forEach((node) => {
      const active = Number(node.dataset.areaIndex) === index;
      node.classList.toggle("is-active", active);
      node.setAttribute("aria-pressed", String(active));
    });
  };
  document.querySelectorAll("[data-area-index]").forEach((node) => node.addEventListener("click", () => updateMapDialog(Number(node.dataset.areaIndex))));
  updateMapDialog(0);

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const revealNodes = document.querySelectorAll(".reveal");
  if (reducedMotion.matches || !("IntersectionObserver" in window)) revealNodes.forEach((node) => node.classList.add("is-visible"));
  else {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { rootMargin: "0px 0px -8%", threshold: 0.08 });
    revealNodes.forEach((node) => observer.observe(node));
  }
  requestAnimationFrame(() => document.querySelector("[data-loading-fill]")?.classList.add("is-loaded"));

  let audioContext;
  let masterGain;
  let bgmTimer;
  let step = 0;
  let bgmPlaying = false;
  const melody = [72, 76, 79, 76, 69, 72, 76, 74, 67, 71, 74, 79, 76, 74, 71, 67];
  const bass = [48, 48, 45, 45, 41, 41, 43, 43];
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
    playNote(melody[step % melody.length], 0.18, "square", 0.28);
    if (step % 2 === 0) playNote(bass[(step / 2) % bass.length], 0.34, "triangle", 0.34);
    if (step % 4 === 2) playNote(84, 0.05, "square", 0.08);
    step += 1;
  };
  const updateBgmUi = () => {
    document.querySelectorAll("[data-bgm-toggle]").forEach((button) => {
      button.setAttribute("aria-pressed", String(bgmPlaying));
      button.textContent = bgmPlaying ? "■ 停止 BGM" : button.closest(".jukebox") ? "▶ PLAY" : "♪ 播放 BGM";
    });
    const status = document.querySelector("[data-bgm-status]");
    if (status) status.textContent = bgmPlaying ? "PLAYING" : "STOPPED";
    document.querySelector("[data-equalizer]")?.classList.toggle("is-playing", bgmPlaying);
  };
  const toggleBgm = async () => {
    if (bgmPlaying) {
      clearInterval(bgmTimer); await audioContext?.close(); audioContext = undefined; masterGain = undefined; bgmPlaying = false; updateBgmUi(); return;
    }
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    audioContext = new AudioContextClass(); masterGain = audioContext.createGain();
    masterGain.gain.value = Number(document.querySelector("[data-volume]")?.value || 35) / 1000;
    masterGain.connect(audioContext.destination); await audioContext.resume(); step = 0; tickBgm();
    bgmTimer = window.setInterval(tickBgm, 210); bgmPlaying = true; updateBgmUi();
  };
  document.querySelectorAll("[data-bgm-toggle]").forEach((button) => button.addEventListener("click", toggleBgm));
  document.querySelector("[data-volume]")?.addEventListener("input", (event) => { if (masterGain) masterGain.gain.value = Number(event.target.value) / 1000; });

  document.querySelector("[data-mailbox]")?.addEventListener("click", () => {
    const address = ["goldcook4", "gmail.com"].join("@");
    window.location.href = `mailto:${address}?subject=${encodeURIComponent("Hello from goldcook.github.io")}`;
    const hint = document.querySelector("[data-mail-hint]");
    if (hint) hint.textContent = `已尝试打开邮件应用 · ${address}`;
  });

  const header = document.querySelector("[data-header]");
  window.addEventListener("scroll", () => header?.classList.toggle("is-scrolled", window.scrollY > 24), { passive: true });
})();
