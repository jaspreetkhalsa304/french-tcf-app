/* ===== Reading (Compréhension écrite) + shared MCQ engine =====
 * Reading: passage + comprehension MCQs. Uses Claude to generate fresh, level-
 * appropriate items when a key is set; otherwise falls back to the offline bank.
 * Exposes window.MCQ for the Listening module to reuse.
 */
window.MCQ = (function () {
  /**
   * Render a set of MCQ items into `view`.
   * opts: {
   *   title, badge, items:[{passage|audio, q, options[], answer}],
   *   skill, audioMode (bool), onDone(scorePct)
   * }
   */
  function run(view, opts) {
    let i = 0;
    let correct = 0;
    const total = opts.items.length;

    function draw() {
      const item = opts.items[i];
      view.innerHTML = `
        <div class="card">
          <div class="row">
            <span class="badge">${opts.badge}</span>
            <span class="badge">${i + 1} / ${total}</span>
            <span class="spacer"></span>
          </div>
          <h2>${opts.title}</h2>
          ${
            opts.audioMode
              ? `<div class="row" style="margin:10px 0">
                   <button class="btn blue" id="playAudio">▶︎ Play audio</button>
                   <button class="btn secondary" id="playSlow">🐢 Slow</button>
                   <span class="muted">Listen, then answer.</span>
                 </div>
                 <div id="reveal" class="passage hidden"></div>`
              : `<div class="passage">${escapeHtml(item.passage)}</div>`
          }
          <h3 style="margin-top:10px">${escapeHtml(item.q)}</h3>
          <div id="opts"></div>
          <div id="after"></div>
        </div>
      `;

      if (opts.audioMode) {
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
        all.forEach((el) => el.classList.add("disabled"));
        all.forEach((el) => (el.onclick = null));
        const right = item.answer;
        if (oi === right) { btn.classList.add("correct"); correct++; }
        else { btn.classList.add("wrong"); all[right].classList.add("correct"); }

        // reveal transcript for listening
        if (opts.audioMode) {
          const rev = view.querySelector("#reveal");
          rev.classList.remove("hidden");
          rev.innerHTML = `<span class="muted">Transcript:</span> ${escapeHtml(item.audio)}`;
        }

        const after = view.querySelector("#after");
        after.innerHTML = `
          <div class="row" style="justify-content:flex-end; margin-top:12px">
            <button class="btn" id="nextQ">${i === total - 1 ? "See result" : "Next →"}</button>
          </div>`;
        after.querySelector("#nextQ").addEventListener("click", nextQ);
      }
    }

    function nextQ() {
      if (i === total - 1) {
        const pct = Math.round((correct / total) * 100);
        if (opts.skill) window.App.recordResult(opts.skill, pct);
        view.innerHTML = `
          <div class="card center">
            <h2>Result</h2>
            <div class="score-ring ${pct >= 70 ? "good" : pct >= 50 ? "mid" : "low"}">${correct} / ${total}</div>
            <p class="muted">${pct}% correct</p>
            <div class="row" style="justify-content:center">
              <button class="btn" id="again">Another set</button>
              <button class="btn secondary" id="home">Home</button>
            </div>
          </div>`;
        view.querySelector("#again").addEventListener("click", () => opts.onDone && opts.onDone(pct));
        view.querySelector("#home").addEventListener("click", () => window.App.go("home"));
        return;
      }
      i++;
      draw();
    }

    draw();
  }

  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

  return { run, escapeHtml };
})();

window.Reading = (function () {
  async function render(view) {
    const s = window.App.getState();
    const keyOn = window.AI.hasKey();
    view.innerHTML = `<div class="card center"><div class="spinner"></div><p class="muted">${keyOn ? "Generating a fresh reading passage…" : "Loading reading practice…"}</p></div>`;

    let items = null;
    if (keyOn) {
      items = await generate(s.level).catch(() => null);
    }
    if (!items || !items.length) {
      items = window.TCF.readingBank[s.level] || window.TCF.readingBank.A1;
    }
    window.MCQ.run(view, {
      title: "📖 Compréhension écrite",
      badge: `📖 Read · ${s.level}`,
      items,
      skill: "reading",
      audioMode: false,
      onDone: () => render(document.getElementById("view")),
    });
  }

  async function generate(level) {
    const grammar = (window.CURRICULUM.grammar[level] || []).join(", ");
    const schema = {
      type: "object",
      additionalProperties: false,
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              passage: { type: "string" },
              q: { type: "string" },
              options: { type: "array", items: { type: "string" } },
              answer: { type: "integer" },
            },
            required: ["passage", "q", "options", "answer"],
          },
        },
      },
      required: ["items"],
    };
    const text = await window.AI.call({
      system:
        "You generate French reading-comprehension practice for the TCF exam. Output ONLY JSON matching the schema. " +
        "Each item: a short French passage appropriate to the CEFR level, one French comprehension question, exactly 4 French options, and the 0-based index of the correct answer. Make distractors plausible.",
      messages: [{
        role: "user",
        content: `Generate 4 reading items at CEFR ${level}. Vary topics (daily life, work, society, culture). Use level-appropriate grammar (${grammar}). Passages: 2–5 sentences, longer/more abstract for higher levels.`,
      }],
      maxTokens: 1800,
      jsonSchema: schema,
    });
    const parsed = window.AI.parseJSON(text);
    return parsed && parsed.items ? parsed.items.filter(validItem) : null;
  }

  function validItem(it) {
    return it && it.passage && it.q && Array.isArray(it.options) && it.options.length >= 2 &&
      Number.isInteger(it.answer) && it.answer >= 0 && it.answer < it.options.length;
  }

  return { render };
})();
