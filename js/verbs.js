/* ===== Verbs tab =====
 * Systematic conjugation trainer. Per level A1→C1: browse verb TABLES, study one
 * (full conjugation grid + hear each form + model sentence), then DRILL it
 * (fill-in quiz generated from the same forms, scored). Data: window.VERBS.
 * Works fully offline; uses the same state/XP plumbing as the other tabs.
 */
window.Verbs = (function () {
  function doneMap() {
    const s = window.App.getState();
    if (!s.verbsDone) s.verbsDone = {};
    return s.verbsDone;
  }

  /* ---------- Index: all tables grouped by level ---------- */
  function render(view) {
    const s = window.App.getState();
    const done = doneMap();
    const levels = window.CURRICULUM.levels;
    const all = window.VERBS;
    const doneCount = all.filter((t) => done[t.id]).length;

    function tableRow(t) {
      const isDone = done[t.id];
      const cur = t.level === s.level ? ' <span class="badge" style="padding:1px 7px">your level</span>' : "";
      return `
        <button class="basic-row lesson-row" data-table="${t.id}">
          <div class="br-main"><span class="br-fr">${isDone ? "✅ " : "🔡 "}${escapeHtml(t.verb)}</span> <span class="muted">· ${escapeHtml(t.tense)}</span>${cur}</div>
          <div class="br-en">${escapeHtml(t.en)}</div>
        </button>`;
    }

    const sections = levels
      .map((lv) => {
        const items = all.filter((t) => t.level === lv);
        if (!items.length) return "";
        return `
          <div class="card">
            <h3>${lv} — ${window.CURRICULUM.levelNames[lv]} <span class="muted" style="font-size:13px">(${items.length})</span></h3>
            ${items.map(tableRow).join("")}
          </div>`;
      })
      .join("");

    view.innerHTML = `
      <div class="card">
        <div class="row"><span class="badge">🔡 Verbs</span><span class="badge">all levels A1 → C1</span></div>
        <h2>Verb conjugations</h2>
        <p class="muted">Learn every key verb and tense, level by level — study the table, hear each form, then drill yourself. ${doneCount}/${all.length} drilled.</p>
        <div class="bar" style="margin-top:6px"><span style="width:${all.length ? Math.round((doneCount / all.length) * 100) : 0}%"></span></div>
      </div>
      ${sections}
    `;

    view.querySelectorAll("[data-table]").forEach((b) =>
      b.addEventListener("click", () => study(view, b.dataset.table))
    );
  }

  function find(id) { return window.VERBS.find((t) => t.id === id); }

  /* ---------- Study one table ---------- */
  function study(view, id) {
    const t = find(id);
    if (!t) return render(view);
    const done = doneMap();

    const rows = t.forms
      .map(
        (f) => `
        <button class="verb-row" data-form="${escapeHtml(f[1])}">
          <span class="vr-pro">${escapeHtml(f[0])}</span>
          <span class="vr-form">${escapeHtml(f[1])}</span>
          <span class="vr-spk">🔊</span>
        </button>`
      )
      .join("");

    view.innerHTML = `
      <div class="card">
        <div class="row">
          <button class="ghost-btn" id="backBtn">← Verbs</button>
          <span class="spacer"></span>
          <span class="badge">${t.level}</span>
          ${done[t.id] ? '<span class="badge">✅ drilled</span>' : ""}
        </div>
        <h2>${escapeHtml(t.verb)}</h2>
        <div class="muted">${escapeHtml(t.en)} · <strong>${escapeHtml(t.tense)}</strong></div>
        ${t.note ? `<div class="tip" style="margin-top:8px">💡 ${escapeHtml(t.note)}</div>` : ""}

        <div class="verb-table">${rows}</div>

        ${t.example ? `<div class="verb-example">📝 ${escapeHtml(t.example)}</div>` : ""}

        <div class="row" style="justify-content:space-between; margin-top:14px">
          <button class="btn secondary" id="hearAll">🔊 Hear all</button>
          <button class="btn" id="drillBtn">🎯 Drill this verb →</button>
        </div>
      </div>
    `;

    view.querySelector("#backBtn").addEventListener("click", () => render(view));
    view.querySelector("#drillBtn").addEventListener("click", () => drill(view, id));

    // Tap a single form to hear it (pronoun + form, so liaison sounds right).
    view.querySelectorAll(".verb-row").forEach((b, i) => {
      b.addEventListener("click", () => {
        const f = t.forms[i];
        window.Speech.speak(spoken(f));
      });
    });
    view.querySelector("#hearAll").addEventListener("click", async () => {
      for (const f of t.forms) {
        await window.Speech.speak(spoken(f));
        await new Promise((r) => setTimeout(r, 250));
      }
    });
  }

  /* A speakable string from a [pronoun, form] pair. Some rows pack two columns
   * (e.g. "je peux" / "je veux") — speak the form as-is then. */
  function spoken(f) {
    const pro = f[0].replace(/\(.*?\)/g, "").trim(); // drop "(être)" hints
    const form = f[1];
    if (!form || form === "—") return pro;
    // If the form already starts with a pronoun (packed two-column rows), say it alone.
    if (/^(je|tu|il|elle|nous|vous|ils|elles|j'|qu')/i.test(form)) return form;
    // Join, fixing je+vowel → j'
    if (/^[aeiouéèêh]/i.test(form) && pro === "je") return "j'" + form;
    return pro.replace(/\/.*$/, "") + " " + form; // "il/elle" → "il"
  }

  /* ---------- Drill: fill-in conjugation quiz from the same forms ---------- */
  function drill(view, id) {
    const t = find(id);
    if (!t) return render(view);

    // Build questions from the 6 forms. Skip rows with no real answer (— / packed).
    const qs = t.forms
      .map((f, i) => ({ pro: f[0], answer: f[1], i }))
      .filter((q) => q.answer && q.answer !== "—");
    let qi = 0, correct = 0;

    function drawQ() {
      if (qi >= qs.length) return finish();
      const q = qs[qi];
      view.innerHTML = `
        <div class="card">
          <div class="row">
            <button class="ghost-btn" id="exitDrill">✕</button>
            <span class="spacer"></span>
            <span class="badge">🎯 Drill · ${t.level}</span>
            <span class="badge">${qi + 1} / ${qs.length}</span>
          </div>
          <h3 style="margin-top:8px">${escapeHtml(t.verb)} · ${escapeHtml(t.tense)}</h3>
          <div class="muted" style="margin-bottom:10px">${escapeHtml(t.en)}</div>
          <div class="verb-q">${escapeHtml(stripPro(q.pro))} <input id="vAns" class="verb-input" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="…" /></div>
          <div id="vFeedback"></div>
          <div class="row" style="justify-content:flex-end; margin-top:12px">
            <button class="btn secondary" id="hintBtn">👁 Show</button>
            <button class="btn" id="checkBtn">Check</button>
          </div>
        </div>
      `;
      const input = view.querySelector("#vAns");
      input.focus();
      const submit = () => check(q, input.value);
      view.querySelector("#checkBtn").addEventListener("click", submit);
      input.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });
      view.querySelector("#exitDrill").addEventListener("click", () => study(view, id));
      view.querySelector("#hintBtn").addEventListener("click", () => {
        view.querySelector("#vFeedback").innerHTML = `<div class="tip">Answer: <strong>${escapeHtml(q.answer)}</strong></div>`;
      });
    }

    function check(q, raw) {
      const fb = view.querySelector("#vFeedback");
      const ok = matches(raw, q.answer);
      if (ok) {
        correct++;
        fb.innerHTML = `<div class="tip tip-ok">✅ Correct — <strong>${escapeHtml(stripPro(q.pro))} ${escapeHtml(q.answer)}</strong></div>`;
      } else {
        fb.innerHTML = `<div class="tip tip-bad">❌ Not quite. Answer: <strong>${escapeHtml(stripPro(q.pro))} ${escapeHtml(q.answer)}</strong></div>`;
      }
      window.Speech.speak(spoken([q.pro, q.answer]));
      // Replace the buttons with a single Next.
      const input = view.querySelector("#vAns");
      if (input) input.disabled = true;
      const checkBtn = view.querySelector("#checkBtn");
      const hintBtn = view.querySelector("#hintBtn");
      if (hintBtn) hintBtn.style.display = "none";
      checkBtn.textContent = qi === qs.length - 1 ? "Finish →" : "Next →";
      const fresh = checkBtn.cloneNode(true); // drop old listener
      checkBtn.parentNode.replaceChild(fresh, checkBtn);
      fresh.addEventListener("click", () => { qi++; drawQ(); });
    }

    function finish() {
      const pct = Math.round((correct / qs.length) * 100);
      const done = doneMap();
      done[t.id] = true;
      window.App.save();
      window.App.recordResult("grammar", pct);
      window.App.addXP(8);
      const cls = pct >= 80 ? "good" : pct >= 55 ? "mid" : "low";
      view.innerHTML = `
        <div class="card center">
          <div class="score-ring ${cls}">${pct}%</div>
          <h2>${escapeHtml(t.verb)} — ${escapeHtml(t.tense)}</h2>
          <p class="muted">${correct} / ${qs.length} correct.</p>
          <div class="row" style="justify-content:center; margin-top:8px">
            <button class="btn" id="againBtn">↻ Drill again</button>
            <button class="btn secondary" id="studyBtn">📖 Review table</button>
            <button class="btn secondary" id="allBtn">All verbs</button>
          </div>
        </div>`;
      view.querySelector("#againBtn").addEventListener("click", () => drill(view, id));
      view.querySelector("#studyBtn").addEventListener("click", () => study(view, id));
      view.querySelector("#allBtn").addEventListener("click", () => render(view));
    }

    drawQ();
  }

  /* Show just the pronoun part for the prompt (strip "(être)" type hints). */
  function stripPro(pro) { return pro.replace(/\s*\(.*?\)\s*/g, "").trim(); }

  /* Accent/case/space-insensitive answer match (forgiving of the (e)/(s) agreement marks). */
  function norm(s) {
    return String(s)
      .toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/\(.*?\)/g, "")          // drop optional-agreement marks like (e)
      .replace(/[^a-z' ]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
  function matches(raw, answer) {
    const a = norm(raw), b = norm(answer);
    if (!a) return false;
    if (a === b) return true;
    // Accept the answer with or without a leading pronoun the learner may add.
    return b.endsWith(a) || a.endsWith(b);
  }

  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

  return { render, study, drill };
})();
