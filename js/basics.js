/* ===== Basics: beginner foundations =====
 * Alphabet, accents, vowels, letter combos, numbers, first words.
 * Tap an item to hear it (TTS uses the .say field). Open an item for IPA + English
 * and an optional "Say it" pronunciation check (Chrome/Edge). Fully offline.
 */
window.Basics = (function () {
  function render(view) {
    drawMenu(view);
  }

  function drawMenu(view) {
    const secs = window.BASICS.sections;
    const themes = (window.CURRICULUM && window.CURRICULUM.themes) || [];
    view.innerHTML = `
      <div class="card">
        <div class="row"><span class="badge">🔤 Basics</span><span class="badge">start here</span></div>
        <h2>Les bases du français</h2>
        <p class="muted">The foundations before phrases: alphabet, accents, vowel sounds, tricky letter combos and numbers. Tap any item to hear it, open one to see how it's pronounced.</p>
        <div class="skill-grid" id="secGrid"></div>
      </div>
      ${themes.length ? `
      <div class="card">
        <div class="row"><span class="badge">📚 Vocabulary by theme</span><span class="badge">TCF topics</span></div>
        <h3>Mots par thème</h3>
        <p class="muted">Topic word banks the TCF loves — family, food, travel, work, society… Tap a theme, then any word to hear it.</p>
        <div class="skill-grid" id="themeGrid"></div>
      </div>` : ""}
    `;
    const grid = view.querySelector("#secGrid");
    secs.forEach((sec) => {
      const c = document.createElement("div");
      c.className = "skill-card";
      c.innerHTML = `<div class="emoji">${sec.emoji}</div><div class="name">${sec.title}</div><div class="sub">${sec.items.length} items</div>`;
      c.addEventListener("click", () => drawSection(view, sec));
      grid.appendChild(c);
    });
    const tg = view.querySelector("#themeGrid");
    if (tg) themes.forEach((th) => {
      const c = document.createElement("div");
      c.className = "skill-card";
      c.innerHTML = `<div class="emoji">${th.icon}</div><div class="name">${th.title}</div><div class="sub">${th.words.length} words · ${th.level}</div>`;
      c.addEventListener("click", () => drawTheme(view, th));
      tg.appendChild(c);
    });
  }

  /* A theme = a topic word bank ({fr, en}); say=fr, no IPA. Reuses play/say flow. */
  function drawTheme(view, th) {
    const sec = {
      emoji: th.icon, title: th.title,
      blurb: `Topic vocabulary (${th.level}). Tap a word to hear it; open one to practise saying it.`,
      grid: false,
      items: th.words.map((w) => ({ fr: w.fr, en: w.en, say: w.fr, ipa: "" })),
    };
    drawSection(view, sec);
  }

  function drawSection(view, sec) {
    view.innerHTML = `
      <div class="card">
        <div class="row">
          <span class="badge">${sec.emoji} ${sec.title}</span>
          <span class="spacer"></span>
          <button class="ghost-btn" id="backBtn">← Basics</button>
        </div>
        <p class="muted">${sec.blurb}</p>
        <div class="row" style="margin:6px 0">
          <button class="btn secondary" id="playAll">▶︎ Play all</button>
          <button class="btn secondary" id="stopAll">⏹ Stop</button>
        </div>
        <div id="items" class="${sec.grid ? "basics-grid" : ""}"></div>
        <div id="detail"></div>
      </div>
    `;
    const itemsEl = view.querySelector("#items");

    sec.items.forEach((it) => {
      const el = document.createElement("button");
      el.className = sec.grid ? "basic-tile" : "basic-row";
      const ipaTag = it.ipa ? ` <span class="br-ipa">/${it.ipa}/</span>` : "";
      if (sec.grid) {
        el.innerHTML = `<div class="bt-fr">${it.fr}</div>${it.ipa ? `<div class="bt-ipa">/${it.ipa}/</div>` : ""}`;
      } else {
        el.innerHTML = `<div class="br-main"><span class="br-fr">${it.fr}</span>${ipaTag} <span class="play-hint">🔊</span></div><div class="br-en">${it.en}</div>`;
      }
      el.addEventListener("click", () => {
        window.Speech.speak(it.say);
        openDetail(view, sec, it);
      });
      itemsEl.appendChild(el);
    });

    view.querySelector("#backBtn").addEventListener("click", () => drawMenu(view));
    view.querySelector("#playAll").addEventListener("click", () => playAll(sec));
    view.querySelector("#stopAll").addEventListener("click", () => { _stop = true; window.Speech.cancel(); });
  }

  let _stop = false;
  async function playAll(sec) {
    _stop = false;
    for (const it of sec.items) {
      if (_stop) break;
      await window.Speech.speak(it.say);
      await wait(180);
    }
  }
  function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }

  function openDetail(view, sec, it) {
    const sttOk = window.Speech.recognitionAvailable();
    const d = view.querySelector("#detail");
    d.innerHTML = `
      <div class="card" style="background:var(--card-2); margin-top:14px">
        <div class="center">
          <div class="phrase-fr">${it.fr}</div>
          ${it.ipa ? `<div class="phrase-ipa">/${it.ipa}/</div>` : ""}
          <div class="phrase-en">${it.en}</div>
        </div>
        <div class="row" style="justify-content:center; margin-top:10px">
          <button class="btn blue" id="dHear">▶︎ Hear</button>
          <button class="btn secondary" id="dSlow">🐢 Slow</button>
          ${sttOk ? `<button class="btn" id="dSay">🎤 Say it</button>` : ""}
        </div>
        ${sttOk ? "" : `<div class="tip">🎤 Say-it scoring needs Chrome or Edge — or add a Gemini key in Settings (⚙️) to score your voice in any browser. You can still hear it here.</div>`}
        <div id="dResult"></div>
      </div>
    `;
    d.querySelector("#dHear").addEventListener("click", () => window.Speech.speak(it.say));
    d.querySelector("#dSlow").addEventListener("click", () => window.Speech.speak(it.say, { rate: 0.6 }));
    const sayBtn = d.querySelector("#dSay");
    if (sayBtn) sayBtn.addEventListener("click", () => sayIt(d, it, sayBtn));
    d.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  async function sayIt(d, it, btn) {
    const res = d.querySelector("#dResult");
    btn.classList.add("recording");
    btn.textContent = window.Speech.geminiActive() ? "● Recording… (tap to stop)" : "● Listening…";
    res.innerHTML = "";
    const stopHandler = () => window.Speech.stopCapture();
    if (window.Speech.geminiActive()) btn.addEventListener("click", stopHandler);
    try {
      // Gemini grades the audio when its key is set; else Web Speech + local/Claude score.
      const r = await window.Speech.captureAndGrade(it.say, window.App.getState().level, (st) => {
        if (st === "processing") btn.textContent = "… scoring";
      });
      const cls = r.score >= 80 ? "good" : r.score >= 55 ? "mid" : "low";
      res.innerHTML = `
        <div class="score-ring ${cls}">${r.score}%</div>
        <div class="center muted">You said: <em>${escapeHtml(r.heard) || "(nothing)"}</em></div>` +
        (r.aiNote ? `<div class="tip" style="margin-top:8px">🧑‍🏫 ${escapeHtml(r.aiNote)}</div>` : "");
      window.App.recordResult("pronunciation", r.score);
    } catch (e) {
      res.innerHTML = `<div class="tip">${e.message === "no-speech" ? "Didn't catch that — try again." : "Couldn't capture audio."}</div>`;
    } finally {
      btn.removeEventListener("click", stopHandler);
      btn.classList.remove("recording");
      btn.textContent = "🎤 Say it";
    }
  }

  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

  return { render };
})();
