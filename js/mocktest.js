/* ===== Mock TCF test (timed, mixed sections) =====
 * A short exam-style run that mirrors the TCF MCQ sections:
 *   Structures de la langue · Compréhension écrite · Compréhension orale.
 * Pulls items from the offline banks at the chosen level (±1 for spread),
 * runs them under a countdown, then shows a per-section breakdown + an
 * estimated CEFR band. Fully offline (no API key needed).
 */
window.MockTest = (function () {
  const LEVELS = ["A1", "A2", "B1", "B2", "C1"];

  function pick(arr, n) {
    const a = (arr || []).slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a.slice(0, n);
  }

  // Gather items of one kind around the target level (target + one above + one below).
  function gather(bank, level, n) {
    const idx = LEVELS.indexOf(level);
    const order = [level, LEVELS[idx + 1], LEVELS[idx - 1], LEVELS[idx + 2], LEVELS[idx - 2]].filter(Boolean);
    let out = [];
    for (const lv of order) {
      out = out.concat((bank[lv] || []).map((it) => ({ ...it, _lvl: lv })));
      if (out.length >= n * 2) break;
    }
    return pick(out, n);
  }

  function render(view) {
    const s = window.App.getState();
    drawIntro(view, s.level);
  }

  function drawIntro(view, level) {
    view.innerHTML = `
      <div class="card">
        <div class="row"><span class="badge">📝 Mock TCF</span><span class="badge">timed practice</span></div>
        <h2>Examen blanc</h2>
        <p class="muted">A short, timed run in the style of the real TCF MCQ sections — Structures, Reading and Listening — with a score breakdown and an estimated level at the end. No API key needed.</p>
        <div class="setting-group">
          <label for="mockLevel">Difficulty (centred on a level)</label>
          <select id="mockLevel">
            ${LEVELS.map((l) => `<option value="${l}" ${l === level ? "selected" : ""}>${l} — ${window.CURRICULUM.levelNames[l]}</option>`).join("")}
          </select>
        </div>
        <div class="setting-group">
          <label for="mockLen">Length</label>
          <select id="mockLen">
            <option value="9">Quick · 9 questions (~5 min)</option>
            <option value="15" selected>Standard · 15 questions (~8 min)</option>
            <option value="21">Long · 21 questions (~12 min)</option>
          </select>
        </div>
        <div class="tip">⏱️ A countdown runs while you work — just like the real exam. There's no penalty for wrong answers, so always answer. Listening items are read aloud (tap ▶︎).</div>
        <div class="row" style="margin-top:12px"><button class="btn blue" id="startMock">Start the mock exam →</button></div>
      </div>
    `;
    view.querySelector("#startMock").addEventListener("click", () => {
      const level = view.querySelector("#mockLevel").value;
      const len = parseInt(view.querySelector("#mockLen").value, 10);
      start(view, level, len);
    });
  }

  function start(view, level, len) {
    const per = Math.round(len / 3);
    const T = window.TCF;
    const struct = gather(T.structuresBank, level, per).map((it) => ({ ...it, _section: "Structures", kind: "text" }));
    const read = gather(T.readingBank, level, per).map((it) => ({ ...it, _section: "Reading", kind: "text" }));
    const listen = gather(T.listeningBank, level, len - 2 * per).map((it) => ({ ...it, _section: "Listening", kind: "audio" }));
    const items = [...struct, ...read, ...listen];
    if (!items.length) { view.innerHTML = `<div class="card center"><p class="muted">No items available. Try another level.</p></div>`; return; }

    // ~35s per question budget, like a brisk MCQ pace.
    const totalSec = items.length * 35;
    runExam(view, { items, level, totalSec });
  }

  function runExam(view, cfg) {
    let i = 0;
    const answers = []; // {section, ok}
    let remaining = cfg.totalSec;
    let timer = null;

    function fmt(sec) {
      const m = Math.floor(sec / 60), s = sec % 60;
      return `${m}:${String(s).padStart(2, "0")}`;
    }

    function tick() {
      remaining--;
      const el = document.getElementById("mockTimer");
      if (el) {
        el.textContent = "⏱️ " + fmt(Math.max(0, remaining));
        if (remaining <= 30) el.style.color = "var(--accent)";
      }
      if (remaining <= 0) { clearInterval(timer); finish(true); }
    }

    function draw() {
      const item = cfg.items[i];
      const isAudio = item.kind === "audio";
      view.innerHTML = `
        <div class="card">
          <div class="row">
            <span class="badge">${sectionBadge(item._section)}</span>
            <span class="badge">${i + 1} / ${cfg.items.length}</span>
            <span class="spacer"></span>
            <span class="badge" id="mockTimer">⏱️ ${fmt(remaining)}</span>
          </div>
          ${isAudio
            ? `<div class="row" style="margin:10px 0">
                 <button class="btn blue" id="playAudio">▶︎ Play audio</button>
                 <button class="btn secondary" id="playSlow">🐢 Slow</button>
                 <span class="muted">Listen, then answer.</span>
               </div>`
            : item.passage
              ? `<div class="passage">${esc(item.passage)}</div>`
              : ""}
          <h3 style="margin-top:10px">${esc(item.q)}</h3>
          <div id="opts"></div>
          <div id="after"></div>
        </div>
      `;
      if (isAudio) {
        const speakIt = (rate) => window.Speech.speak(item.audio, rate ? { rate } : {});
        view.querySelector("#playAudio").addEventListener("click", () => speakIt());
        view.querySelector("#playSlow").addEventListener("click", () => speakIt(0.6));
        setTimeout(() => speakIt(), 300);
      }
      const optsEl = view.querySelector("#opts");
      item.options.forEach((opt, oi) => {
        const b = document.createElement("button");
        b.className = "mcq-option";
        b.textContent = opt;
        b.addEventListener("click", () => choose(oi, b));
        optsEl.appendChild(b);
      });
      function choose(oi, btn) {
        const all = optsEl.querySelectorAll(".mcq-option");
        all.forEach((el) => { el.classList.add("disabled"); el.onclick = null; });
        const ok = oi === item.answer;
        if (ok) btn.classList.add("correct");
        else { btn.classList.add("wrong"); all[item.answer].classList.add("correct"); }
        answers.push({ section: item._section, ok });
        const after = view.querySelector("#after");
        after.innerHTML = `
          ${isAudio ? `<div class="passage" style="margin-top:10px"><span class="muted">Transcript:</span> ${esc(item.audio)}</div>` : ""}
          <div class="row" style="justify-content:flex-end; margin-top:12px">
            <button class="btn" id="nextQ">${i === cfg.items.length - 1 ? "Finish exam" : "Next →"}</button>
          </div>`;
        after.querySelector("#nextQ").addEventListener("click", () => {
          if (i === cfg.items.length - 1) finish(false);
          else { i++; draw(); }
        });
      }
    }

    function finish(timedOut) {
      clearInterval(timer);
      window.Speech.cancel();
      const total = cfg.items.length;
      const correct = answers.filter((a) => a.ok).length;
      const pct = Math.round((correct / total) * 100);
      // per-section
      const sections = ["Structures", "Reading", "Listening"];
      const rows = sections.map((sec) => {
        const subset = answers.filter((a) => a.section === sec);
        const sc = subset.filter((a) => a.ok).length;
        const t = cfg.items.filter((it) => it._section === sec).length;
        return { sec, sc, t };
      }).filter((r) => r.t > 0);
      const band = estimateBand(pct, cfg.level);
      if (cfg.level) window.App.recordResult("reading", pct); // engagement credit
      view.innerHTML = `
        <div class="card center">
          <h2>${timedOut ? "⏰ Time's up!" : "📝 Exam complete"}</h2>
          <div class="score-ring ${pct >= 70 ? "good" : pct >= 50 ? "mid" : "low"}">${correct} / ${total}</div>
          <p class="muted">${pct}% correct${timedOut ? " · unanswered questions counted wrong" : ""}</p>
          <div class="tip" style="text-align:left;margin:12px 0">
            <strong>Estimated level: ${band}</strong><br>
            <span class="muted">Rough guide from this short set — the real TCF is longer and scored 0–699.</span>
          </div>
          <div style="text-align:left;margin-top:6px">
            ${rows.map((r) => {
              const p = Math.round((r.sc / r.t) * 100);
              return `<div style="margin:8px 0">
                <div class="row"><strong style="font-size:13px">${sectionBadge(r.sec)}</strong><span class="spacer"></span><span class="muted">${r.sc}/${r.t}</span></div>
                <div class="lesson-progress"><span style="width:${p}%"></span></div>
              </div>`;
            }).join("")}
          </div>
          <div class="row" style="justify-content:center;margin-top:14px">
            <button class="btn blue" id="retry">New mock exam</button>
            <button class="btn secondary" id="home">Home</button>
          </div>
        </div>`;
      view.querySelector("#retry").addEventListener("click", () => drawIntro(view, cfg.level));
      view.querySelector("#home").addEventListener("click", () => window.App.go("home"));
    }

    timer = setInterval(tick, 1000);
    draw();
  }

  function sectionBadge(sec) {
    return sec === "Structures" ? "🧩 Structures" : sec === "Reading" ? "📖 Compréhension écrite" : "🎧 Compréhension orale";
  }

  // Very rough self-assessment band from % at a centred level.
  function estimateBand(pct, level) {
    const idx = LEVELS.indexOf(level);
    if (pct >= 85) return LEVELS[Math.min(idx + 1, 4)] + " (strong)";
    if (pct >= 65) return level + " (solid)";
    if (pct >= 45) return level + " (developing)";
    return (LEVELS[Math.max(idx - 1, 0)]) + " (keep practising)";
  }

  function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

  return { render };
})();
