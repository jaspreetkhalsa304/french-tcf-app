/* ===== Core app: state, router, settings, home ===== */
window.App = (function () {
  const LEVELS = window.CURRICULUM.levels; // ["A1".."C1"]
  const SKILLS = ["pronunciation", "listening", "reading", "writing", "speaking"];

  /* ----- Persistent state ----- */
  const defaultState = {
    level: "A1",
    placed: false,
    xp: 0,
    // mastery 0-100 per skill, used to gate level progression + show on Progress.
    mastery: { pronunciation: 0, listening: 0, reading: 0, writing: 0, speaking: 0 },
    // counts of completed items per skill (for progress display)
    done: { pronunciation: 0, listening: 0, reading: 0, writing: 0, speaking: 0 },
    // simple spaced-repetition queue: array of {text, ipa, en, due}
    reviews: [],
    streakDay: null,
    streak: 0,
  };

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem("tcf_state");
      if (raw) return Object.assign(JSON.parse(JSON.stringify(defaultState)), JSON.parse(raw));
    } catch (_) {}
    return JSON.parse(JSON.stringify(defaultState));
  }
  function save() {
    localStorage.setItem("tcf_state", JSON.stringify(state));
    renderTopbar();
  }
  function getState() { return state; }

  /* ----- XP / mastery / progression ----- */
  function addXP(n) {
    state.xp += n;
    bumpStreak();
    save();
  }

  function bumpStreak() {
    const today = new Date().toISOString().slice(0, 10);
    if (state.streakDay !== today) {
      // consecutive-day check
      const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
      state.streak = state.streakDay === y ? state.streak + 1 : 1;
      state.streakDay = today;
    }
  }

  // Record a result (0-100) for a skill; updates rolling mastery + maybe unlocks next level.
  function recordResult(skill, score) {
    if (!(skill in state.mastery)) return;
    // Exponential moving average so recent performance matters most.
    state.mastery[skill] = Math.round(state.mastery[skill] * 0.7 + score * 0.3);
    state.done[skill] = (state.done[skill] || 0) + 1;
    addXP(Math.max(2, Math.round(score / 10)));
    maybeAdvanceLevel();
    save();
  }

  function avgMastery() {
    const vals = SKILLS.map((s) => state.mastery[s] || 0);
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }

  // Advance when average mastery is high AND enough items done at this level.
  function maybeAdvanceLevel() {
    const idx = LEVELS.indexOf(state.level);
    if (idx < 0 || idx >= LEVELS.length - 1) return;
    const totalDone = SKILLS.reduce((a, s) => a + (state.done[s] || 0), 0);
    if (avgMastery() >= 75 && totalDone >= (idx + 1) * 10) {
      const next = LEVELS[idx + 1];
      // reset mastery for the new (harder) level so it reflects new difficulty
      SKILLS.forEach((s) => (state.mastery[s] = 40));
      state.level = next;
      toast(`🎉 Niveau supérieur ! You've advanced to ${next} — ${window.CURRICULUM.levelNames[next]}.`);
    }
  }

  function setLevel(lvl) {
    if (LEVELS.includes(lvl)) {
      state.level = lvl;
      save();
    }
  }

  function unlockedLevels() {
    // All levels are open so you can browse/check any level's content freely.
    // (Your "current" level still drives auto-progression and what each tab defaults to.)
    return LEVELS.map((l) => ({ level: l, unlocked: true }));
  }

  /* ----- Spaced repetition (pronunciation/vocab) ----- */
  function addReview(item, score) {
    // Lower score => due sooner. Store minimal data.
    const dueIn = score >= 80 ? 5 : score >= 60 ? 2 : 1; // # of future sessions
    const existing = state.reviews.find((r) => r.fr === item.fr);
    if (existing) { existing.due = dueIn; existing.score = score; }
    else state.reviews.push({ fr: item.fr, ipa: item.ipa, en: item.en, due: dueIn, score });
    // keep queue bounded
    if (state.reviews.length > 60) state.reviews.shift();
    save();
  }
  function dueReviews() {
    return state.reviews.filter((r) => (r.due || 0) <= 1);
  }

  /* ----- Router ----- */
  const views = {}; // name -> render(container) registered by modules
  function registerView(name, renderFn) { views[name] = renderFn; }

  let currentView = "home";
  function go(name) {
    if (!views[name]) name = "home";
    currentView = name;
    document.querySelectorAll(".tab").forEach((t) =>
      t.classList.toggle("active", t.dataset.view === name)
    );
    if (window.Speech) window.Speech.cancel();
    const view = document.getElementById("view");
    view.innerHTML = "";
    views[name](view);
    view.scrollTop = 0;
    window.scrollTo(0, 0);
  }

  /* ----- Topbar / chips ----- */
  function renderTopbar() {
    const lv = document.getElementById("levelValue");
    const xp = document.getElementById("xpValue");
    if (lv) lv.textContent = state.level;
    if (xp) xp.textContent = state.xp;
  }

  /* ----- Toast ----- */
  let toastTimer = null;
  function toast(msg, ms = 3200) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.remove("hidden");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.add("hidden"), ms);
  }

  /* ----- Home view ----- */
  function renderHome(view) {
    const s = state;
    const levelName = window.CURRICULUM.levelNames[s.level];
    const keyOn = window.AI.hasKey();
    const due = dueReviews().length;

    const skillMeta = {
      basics: { emoji: "🔤", name: "Basics", sub: "Alphabet · sounds · numbers", view: "basics" },
      lessons: { emoji: "📚", name: "Lessons", sub: "Taught rules + examples", view: "lessons" },
      grammar: { emoji: "🧩", name: "Grammar", sub: "All tenses A1 → C1", view: "grammar" },
      pronunciation: { emoji: "🗣️", name: "Speak", sub: "Hear it · say it · score", view: "pronunciation" },
      conversation: { emoji: "💬", name: "Talk", sub: "AI tutor conversation", view: "conversation" },
      listening: { emoji: "🎧", name: "Listen", sub: "Comprehension orale", view: "listening" },
      reading: { emoji: "📖", name: "Read", sub: "Compréhension écrite", view: "reading" },
      writing: { emoji: "✍️", name: "Write", sub: "Expression écrite", view: "writing" },
    };

    view.innerHTML = `
      <div class="hero">
        <h2>Bonjour ! 👋</h2>
        <p class="muted">Niveau <strong style="color:var(--accent-2)">${s.level}</strong> — ${levelName}.
        ${s.placed ? "" : "Take a quick placement test to start at the right level."}</p>
        <div>
          <span class="badge">🔥 ${s.streak || 0} day streak</span>
          <span class="badge">⭐ ${s.xp} XP</span>
          <span class="badge">📊 ${avgMastery()}% mastery</span>
          ${due ? `<span class="badge">🔁 ${due} reviews due</span>` : ""}
        </div>
      </div>

      ${
        !s.placed
          ? `<div class="card center">
               <h3>Where are you?</h3>
               <p class="muted">A short test sets your starting level (A1 → C1).</p>
               <button class="btn big" id="startPlacement">Start placement test</button>
               <div style="margin-top:8px"><button class="btn secondary" id="skipPlacement">Skip — start at A1</button></div>
             </div>`
          : ""
      }

      ${
        !keyOn
          ? `<div class="card">
               <h3>🤖 Unlock the AI tutor</h3>
               <p class="muted">Conversation, fresh generated lessons, and writing/speaking grading need an Anthropic API key.
               Pronunciation drills, audio and the offline lessons already work.</p>
               <button class="btn secondary" id="openSettingsFromHome">Add API key</button>
             </div>`
          : ""
      }

      <div class="card">
        <h3>Practice</h3>
        ${
          s.level === "A1"
            ? `<p class="muted">New to French? Follow the path: <strong>🔤 Basics</strong> (sounds &amp; numbers) → <strong>📚 Lessons</strong> (taught rules + sentence-building) → <strong>🗣️ Speak</strong> to practice aloud.</p>`
            : `<p class="muted">Tip: <strong>📚 Lessons</strong> teaches the pronunciation rules and grammar for your level step-by-step.</p>`
        }
        <div class="skill-grid" id="skillGrid">
          ${Object.entries(skillMeta)
            .map(
              ([k, m]) => `
            <div class="skill-card" data-go="${m.view}">
              <div class="emoji">${m.emoji}</div>
              <div class="name">${m.name}</div>
              <div class="sub">${m.sub}</div>
            </div>`
            )
            .join("")}
        </div>
      </div>

      <div class="card">
        <h3>Levels</h3>
        <p class="muted">All levels are open — tap any level to focus there and explore its content. You'll still auto-advance as your mastery grows.</p>
        <div class="level-grid">
          ${unlockedLevels()
            .map(
              ({ level, unlocked }) => `
            <div class="level-tile ${unlocked ? "" : "locked"} ${level === s.level ? "current" : ""}" data-level="${unlocked ? level : ""}">
              ${unlocked ? "" : '<span class="lock">🔒</span>'}
              <div class="lvl">${level}</div>
              <div class="lvl-name">${window.CURRICULUM.levelNames[level]}</div>
            </div>`
            )
            .join("")}
        </div>
      </div>
    `;

    // wire up
    view.querySelectorAll("[data-go]").forEach((el) =>
      el.addEventListener("click", () => go(el.dataset.go))
    );
    view.querySelectorAll(".level-tile[data-level]").forEach((el) => {
      const lvl = el.dataset.level;
      if (!lvl) return;
      el.addEventListener("click", () => { setLevel(lvl); go("home"); });
    });
    const sp = view.querySelector("#startPlacement");
    if (sp) sp.addEventListener("click", () => go("placement"));
    const skip = view.querySelector("#skipPlacement");
    if (skip) skip.addEventListener("click", () => { state.placed = true; setLevel("A1"); go("home"); });
    const osh = view.querySelector("#openSettingsFromHome");
    if (osh) osh.addEventListener("click", openSettings);
  }

  /* ----- Settings modal ----- */
  function openSettings() {
    const modal = document.getElementById("settingsModal");
    modal.classList.remove("hidden");
    const keyInput = document.getElementById("apiKeyInput");
    keyInput.value = window.AI.getKey();
    refreshKeyStatus();
    const gemInput = document.getElementById("geminiKeyInput");
    if (gemInput && window.Gemini) { gemInput.value = window.Gemini.getKey(); }
    refreshGeminiStatus();
    const neural = document.getElementById("neuralToggle");
    if (neural) {
      const have = window.Speech.neuralAvailable();
      neural.checked = window.Speech.useNeural();
      neural.disabled = !have;
      const hint = document.getElementById("neuralHint");
      if (hint && !have) hint.textContent = "Neural voice service didn't load (offline?). Using built-in Mac voices.";
    }
    const fem = document.getElementById("femaleToggle");
    if (fem) fem.checked = localStorage.getItem("tcf_female") !== "0";
    const one = document.getElementById("oneVoiceToggle");
    if (one) one.checked = localStorage.getItem("tcf_one_voice") === "1";
    populateVoices();
    populateFamilies();
    const rate = parseFloat(localStorage.getItem("tcf_rate") || "0.9");
    document.getElementById("rateSlider").value = rate;
    document.getElementById("rateLabel").textContent = rate.toFixed(2) + "×";
  }
  function closeSettings() {
    document.getElementById("settingsModal").classList.add("hidden");
    renderTopbar();
  }
  function refreshKeyStatus() {
    const el = document.getElementById("apiKeyStatus");
    if (window.AI.hasKey()) { el.textContent = "✓ AI tutor enabled"; el.className = "key-status ok"; }
    else { el.textContent = "○ AI tutor off — offline lessons still work"; el.className = "key-status off"; }
  }
  function refreshGeminiStatus() {
    const el = document.getElementById("geminiKeyStatus");
    if (!el || !window.Gemini) return;
    if (window.Gemini.hasKey()) {
      el.textContent = window.Gemini.recordingSupported()
        ? "✓ Gemini voice scoring on — works in any browser"
        : "✓ Gemini key saved (this browser can't record audio)";
      el.className = "key-status ok";
    } else {
      el.textContent = "○ Optional — uses the built-in Chrome/Edge recogniser without it";
      el.className = "key-status off";
    }
  }
  function voiceTier(v) {
    const n = (v.name || "").toLowerCase();
    if (/premium/.test(n)) return "⭐ Premium";
    if (/enhanced/.test(n)) return "✨ Enhanced";
    if (/neural|natural|siri/.test(n)) return "✨ Natural";
    return "· compact";
  }

  function populateVoices() {
    const sel = document.getElementById("voiceSelect");
    const voices = window.Speech.rankedFrenchVoices(); // best-first
    const stored = localStorage.getItem("tcf_voice");
    const auto = window.Speech.pickVoice();
    if (!voices.length) {
      sel.innerHTML = `<option>(no French voice found — using browser default)</option>`;
      return;
    }
    // If the user hasn't chosen, the top (best) voice is selected.
    const selectedName = stored || (auto && auto.name);
    sel.innerHTML =
      voices
        .map(
          (v) =>
            `<option value="${v.name}" ${v.name === selectedName ? "selected" : ""}>${voiceTier(v)} — ${v.name} (${v.lang})</option>`
        )
        .join("");

    // Hint when only compact voices are present.
    const best = voices[0];
    const hasGood = best && /premium|enhanced|neural|natural|siri/i.test(best.name);
    const hintEl = document.getElementById("voiceHint");
    if (hintEl) {
      hintEl.innerHTML = hasGood
        ? `Using a high-quality voice. 👍`
        : `For much clearer audio, download a French <strong>Enhanced</strong> or <strong>Premium</strong> voice: macOS <em>System Settings → Accessibility → Spoken Content → System voice → Manage Voices…</em> → French. Then reopen Settings here and pick it.`;
    }

    populateEnglishVoices();
  }

  function populateEnglishVoices() {
    const sel = document.getElementById("enVoiceSelect");
    if (!sel) return;
    const voices = window.Speech.rankedEnglishVoices(); // best-first
    const stored = localStorage.getItem("tcf_en_voice");
    const auto = window.Speech.pickEnglishVoice();
    if (!voices.length) {
      sel.innerHTML = `<option>(no English voice found — using browser default)</option>`;
      return;
    }
    const selectedName = stored || (auto && auto.name);
    sel.innerHTML = voices
      .map((v) => `<option value="${v.name}" ${v.name === selectedName ? "selected" : ""}>${voiceTier(v)} — ${v.name} (${v.lang})</option>`)
      .join("");
    const best = voices[0];
    const hasGood = best && /premium|enhanced|neural|natural|siri/i.test(best.name);
    const hintEl = document.getElementById("enVoiceHint");
    if (hintEl) {
      hintEl.innerHTML = hasGood
        ? `Using a high-quality voice. 👍`
        : `Used to narrate lectures. For a clearer voice, download an English <strong>Enhanced</strong> voice: macOS <em>System Settings → Accessibility → Spoken Content → System voice → Manage Voices…</em> → English (try “Samantha (Enhanced)”). Then tap ↻ Refresh.`;
    }
  }

  function populateFamilies() {
    const sel = document.getElementById("familySelect");
    if (!sel) return;
    const fams = window.Speech.SINGLE_FAMILIES.filter(
      (f) => window.Speech.familyMember(f, /fr/i) && window.Speech.familyMember(f, /^en/i)
    );
    const stored = localStorage.getItem("tcf_voice_family") || window.Speech.chosenFamily();
    if (!fams.length) {
      sel.innerHTML = `<option>(no multilingual voice found on this device)</option>`;
      return;
    }
    sel.innerHTML = fams
      .map((f) => `<option value="${f}" ${f === stored ? "selected" : ""}>${f} (female, French + English)</option>`)
      .join("");
  }

  function wireSettings() {
    document.getElementById("settingsBtn").addEventListener("click", openSettings);
    document.getElementById("settingsClose").addEventListener("click", closeSettings);
    document.getElementById("settingsModal").addEventListener("click", (e) => {
      if (e.target.id === "settingsModal") closeSettings();
    });

    const keyInput = document.getElementById("apiKeyInput");
    keyInput.addEventListener("input", () => {
      localStorage.setItem("tcf_api_key", keyInput.value.trim());
      refreshKeyStatus();
    });
    document.getElementById("apiKeyToggle").addEventListener("click", () => {
      keyInput.type = keyInput.type === "password" ? "text" : "password";
    });

    const gemInput = document.getElementById("geminiKeyInput");
    if (gemInput) {
      gemInput.addEventListener("input", () => {
        localStorage.setItem("tcf_gemini_key", gemInput.value.trim());
        refreshGeminiStatus();
      });
      const gemToggle = document.getElementById("geminiKeyToggle");
      if (gemToggle) gemToggle.addEventListener("click", () => {
        gemInput.type = gemInput.type === "password" ? "text" : "password";
      });
    }

    document.getElementById("voiceSelect").addEventListener("change", (e) => {
      localStorage.setItem("tcf_voice", e.target.value);
      window.Speech.speak("Bonjour, voici ma voix. Écoutez bien.");
    });

    const TEST_PHRASE = "Bonjour, je m'appelle votre professeur de français. Écoutez et répétez après moi.";
    document.getElementById("testVoiceBtn").addEventListener("click", () =>
      window.Speech.speak(TEST_PHRASE)
    );
    document.getElementById("refreshVoicesBtn").addEventListener("click", () => {
      window.Speech.loadVoices();
      populateVoices();
      toast("Voice list refreshed.");
    });

    const enSel = document.getElementById("enVoiceSelect");
    if (enSel) {
      enSel.addEventListener("change", (e) => {
        localStorage.setItem("tcf_en_voice", e.target.value);
        window.Speech.speakEnglish("Hello, this is the voice that will explain your lessons.");
      });
    }
    const enTest = document.getElementById("testEnVoiceBtn");
    if (enTest) {
      enTest.addEventListener("click", () =>
        window.Speech.speakEnglish("Hello! In this lecture I will explain French grammar and pronunciation clearly, step by step.")
      );
    }

    const neural = document.getElementById("neuralToggle");
    if (neural) {
      neural.addEventListener("change", () => {
        localStorage.setItem("tcf_tts", neural.checked ? "neural" : "native");
        toast(neural.checked ? "Using human-like neural voice ✨" : "Using built-in Mac voices.");
        window.Speech.speakBilingual("Hello, this is my voice. « Bonjour, voici ma voix. »");
      });
    }
    const neuralTest = document.getElementById("testNeuralBtn");
    if (neuralTest) {
      neuralTest.addEventListener("click", () =>
        window.Speech.speakBilingual("Hello, I will teach you French. « Bonjour, je vais vous apprendre le français. »")
      );
    }

    const fem = document.getElementById("femaleToggle");
    if (fem) {
      fem.addEventListener("change", () => {
        localStorage.setItem("tcf_female", fem.checked ? "1" : "0");
        // Drop manual picks so the female-preferring auto-pick takes effect.
        localStorage.removeItem("tcf_voice");
        localStorage.removeItem("tcf_en_voice");
        populateVoices();
        toast(fem.checked ? "Using female voices." : "Female preference off.");
        window.Speech.speak("Bonjour !");
      });
    }

    const one = document.getElementById("oneVoiceToggle");
    if (one) {
      one.addEventListener("change", () => {
        localStorage.setItem("tcf_one_voice", one.checked ? "1" : "0");
        toast(one.checked ? "Using one voice for both languages." : "Separate voices per language.");
        window.Speech.speakBilingual("Hello, here is my voice. « Bonjour, voici ma voix. »");
      });
    }
    const famSel = document.getElementById("familySelect");
    if (famSel) {
      famSel.addEventListener("change", (e) => {
        localStorage.setItem("tcf_voice_family", e.target.value);
        window.Speech.speakBilingual("This is the voice. « Voici la voix. »");
      });
    }
    const famTest = document.getElementById("testFamilyBtn");
    if (famTest) {
      famTest.addEventListener("click", () =>
        window.Speech.speakBilingual("Hello, I will teach you French. « Bonjour, je vais vous apprendre le français. »")
      );
    }

    const rate = document.getElementById("rateSlider");
    rate.addEventListener("input", () => {
      localStorage.setItem("tcf_rate", rate.value);
      document.getElementById("rateLabel").textContent = parseFloat(rate.value).toFixed(2) + "×";
    });

    document.getElementById("resetBtn").addEventListener("click", () => {
      if (confirm("Clear all progress, XP and level on this device?")) {
        localStorage.removeItem("tcf_state");
        localStorage.removeItem("tcf_talk_session"); // drop the saved AI-tutor conversation too
        state = JSON.parse(JSON.stringify(defaultState));
        save();
        closeSettings();
        go("home");
        toast("Progress reset.");
      }
    });

    // Voices may arrive late.
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.Speech.loadVoices();
        if (!document.getElementById("settingsModal").classList.contains("hidden")) populateVoices();
      };
    }
  }

  /* ----- Boot ----- */
  function init() {
    registerView("home", renderHome);
    // skill modules register themselves when their scripts load
    if (window.Basics) registerView("basics", window.Basics.render);
    if (window.Lessons) registerView("lessons", window.Lessons.render);
    if (window.Grammar) registerView("grammar", window.Grammar.render);
    if (window.Verbs) registerView("verbs", window.Verbs.render);
    if (window.Pronunciation) registerView("pronunciation", window.Pronunciation.render);
    if (window.Conversation) registerView("conversation", window.Conversation.render);
    if (window.Listening) registerView("listening", window.Listening.render);
    if (window.Reading) registerView("reading", window.Reading.render);
    if (window.Writing) registerView("writing", window.Writing.render);
    if (window.MockTest) registerView("mocktest", window.MockTest.render);
    if (window.Progress) registerView("progress", window.Progress.render);
    if (window.Placement) registerView("placement", window.Placement.render);

    document.querySelectorAll(".tab").forEach((t) =>
      t.addEventListener("click", () => go(t.dataset.view))
    );
    wireSettings();
    renderTopbar();
    go("home");
  }

  return {
    init, getState, save, addXP, recordResult, setLevel, go, registerView,
    toast, addReview, dueReviews, avgMastery, openSettings, LEVELS, SKILLS,
  };
})();

/* Boot once SDK module + DOM are ready. */
(function boot() {
  function start() {
    // Progress module lives here (small) to avoid an extra file.
    window.Progress = window.Progress || {
      render(view) {
        const s = window.App.getState();
        const names = { pronunciation: "Speaking sound", listening: "Listening", reading: "Reading", writing: "Writing", speaking: "Speaking task" };
        view.innerHTML = `
          <div class="card">
            <h2>📈 Your progress</h2>
            <p class="muted">Level <strong style="color:var(--accent-2)">${s.level}</strong> · ${window.App.avgMastery()}% average mastery · ${s.xp} XP · 🔥 ${s.streak || 0} day streak</p>
          </div>
          <div class="card">
            <h3>Skill mastery</h3>
            ${window.App.SKILLS.map((sk) => {
              const m = s.mastery[sk] || 0;
              const d = s.done[sk] || 0;
              return `<div class="skill-stat">
                <div class="label"><span>${names[sk]}</span><span>${m}% · ${d} done</span></div>
                <div class="bar"><span style="width:${m}%"></span></div>
              </div>`;
            }).join("")}
          </div>
          <div class="card">
            <h3>🔁 Reviews due (${window.App.dueReviews().length})</h3>
            ${
              window.App.dueReviews().length
                ? `<p class="muted">These pronunciation items will resurface in the Speak tab.</p>` +
                  window.App.dueReviews().slice(0, 12).map((r) => `<div class="row" style="justify-content:space-between"><span>${r.fr}</span><span class="muted">${r.score || 0}%</span></div>`).join("")
                : `<p class="muted">No reviews due — nice work. Practice in Speak to build a review queue.</p>`
            }
            <div style="margin-top:12px"><button class="btn" id="goReview">Practice now →</button></div>
          </div>
        `;
        const g = view.querySelector("#goReview");
        if (g) g.addEventListener("click", () => window.App.go("pronunciation"));
      },
    };
    if (window.App.__started) return;
    window.App.__started = true;
    window.App.init();
  }

  if (window.Anthropic) start();
  else {
    window.addEventListener("anthropic-ready", start, { once: true });
    // Fallback: start anyway after a moment so the app works even if the CDN is slow/blocked.
    setTimeout(start, 2500);
  }
})();
