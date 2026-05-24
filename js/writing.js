/* ===== Writing (Expression écrite) =====
 * Pick a TCF writing task → write a response → Claude grades it on TCF criteria
 * with a CEFR band + concrete corrections. Falls back to a self-check word count
 * guide when no API key.
 */
window.Writing = (function () {
  let current = null;

  function render(view) {
    const s = window.App.getState();
    const all = window.TCF.writingTasks;
    // Tasks tagged exactly at the current level, + the canonical TCF "tâche" types
    // available at this level (minLevel cumulative). Deduped.
    const atLevel = all.filter((t) => t.level === s.level);
    const officialNow = all.filter((t) => t.minLevel && allowed(t.minLevel, s.level));
    const seen = new Set();
    const tasks = [...officialNow, ...atLevel].filter((t) => (seen.has(t.id) ? false : (seen.add(t.id), true)));

    view.innerHTML = `
      <div class="card">
        <div class="row"><span class="badge">✍️ Write · ${s.level}</span><span class="badge">${tasks.length} tasks</span></div>
        <h2>Expression écrite</h2>
        <p class="muted">Choose a writing task for your level. ${window.AI.hasKey() ? "Your text is graded on TCF criteria with a CEFR band and specific fixes." : "Each task has a guide + model answer so you can practise without an API key. Add a key in Settings (⚙️) for full AI grading."}</p>
        <div id="taskList"></div>
        <p class="muted" style="margin-top:10px;font-size:13px">Change your level on 🏠 Home to see other levels' tasks.</p>
      </div>
    `;
    const list = view.querySelector("#taskList");
    tasks.forEach((t) => {
      const card = document.createElement("div");
      card.className = "skill-card";
      card.style.textAlign = "left";
      const official = t.minLevel ? ` <span class="badge" style="font-size:10px">TCF type</span>` : "";
      card.innerHTML = `<div class="name">${t.title}${official}</div><div class="sub">${t.sub}</div>`;
      card.addEventListener("click", () => openTask(view, t));
      list.appendChild(card);
    });
  }

  function allowed(min, cur) {
    const L = window.CURRICULUM.levels;
    return L.indexOf(cur) >= L.indexOf(min);
  }

  function openTask(view, task) {
    current = task;
    const keyOn = window.AI.hasKey();
    view.innerHTML = `
      <div class="card">
        <div class="row"><span class="badge">✍️ ${task.sub}</span><span class="spacer"></span><button class="ghost-btn" id="backBtn">← Tasks</button></div>
        <h2>${task.title}</h2>
        <div class="passage">${escapeHtml(task.instruction)}</div>
        <p class="muted">🇬🇧 ${escapeHtml(task.en)} · aim for ~${task.minWords}+ words.</p>
        ${task.tip ? `<div class="tip">🗂️ <strong>How to structure it:</strong> ${escapeHtml(task.tip)}</div>` : ""}
        <textarea class="write-area" id="essay" placeholder="Écrivez votre réponse en français ici…"></textarea>
        <div class="word-count" id="wc">0 words</div>
        <div class="row" style="justify-content:flex-end; gap:8px">
          ${keyOn ? `<button class="btn secondary" id="modelBtn">📄 Model answer</button>` : `<button class="btn secondary" id="modelBtn">📄 Show a model answer</button>`}
          <button class="btn ${keyOn ? "" : "secondary"}" id="gradeBtn">${keyOn ? "Submit for grading" : "Check my writing"}</button>
        </div>
        <div id="feedback"></div>
      </div>
    `;
    const essay = view.querySelector("#essay");
    const wc = view.querySelector("#wc");
    essay.addEventListener("input", () => {
      const n = (essay.value.trim().match(/\S+/g) || []).length;
      wc.textContent = `${n} words` + (n < task.minWords ? ` (aim for ${task.minWords}+)` : " ✓");
    });
    view.querySelector("#backBtn").addEventListener("click", () => render(view));
    view.querySelector("#gradeBtn").addEventListener("click", () => grade(view, task, essay.value.trim()));
    view.querySelector("#modelBtn").addEventListener("click", () => showModel(view, task));
  }

  // A model answer: AI-generated when a key is set, otherwise a self-check checklist
  // built from the task's structure tip so offline users still get guidance.
  async function showModel(view, task) {
    const fb = view.querySelector("#feedback");
    if (!window.AI.hasKey()) {
      fb.innerHTML = `
        <div class="card" style="margin-top:14px; background:var(--card-2)">
          <h3>📄 Self-check guide</h3>
          ${task.tip ? `<div class="tip">${escapeHtml(task.tip)}</div>` : ""}
          <ul>
            <li>Did you do <strong>everything the task asks</strong> (every part of the instruction)?</li>
            <li>Length ≥ <strong>${task.minWords}</strong> words?</li>
            <li>Clear <strong>paragraphs</strong> and <strong>connectors</strong> (d'abord, ensuite, cependant, en conclusion)?</li>
            <li>Checked <strong>verb endings</strong>, <strong>gender agreement</strong> and <strong>accents</strong>?</li>
            <li>Varied <strong>vocabulary</strong> (not repeating the same words)?</li>
          </ul>
          <p class="muted">Add an API key in Settings (⚙️) for a written model answer + a graded CEFR band on your own text.</p>
        </div>`;
      return;
    }
    fb.innerHTML = `<div class="spinner"></div><p class="muted center">Writing a model answer…</p>`;
    try {
      const out = await window.AI.call({
        system: "You are a French teacher. Write a MODEL ANSWER for the given TCF writing task, at the target CEFR level — natural, well-structured, using good connectors. Output ONLY the French text (no preamble, no English).",
        messages: [{ role: "user", content: `Task (${task.level || task.minLevel}): ${task.instruction}\nAim for ~${task.minWords}+ words.` }],
        maxTokens: 900,
      });
      const text = (out || "").trim();
      fb.innerHTML = `
        <div class="card" style="margin-top:14px; background:var(--card-2)">
          <h3>📄 Model answer</h3>
          <div class="passage">${escapeHtml(text)}</div>
          <button class="btn secondary" id="hearModel" style="margin-top:8px">🔊 Hear it</button>
          <p class="muted" style="margin-top:8px;font-size:13px">Read it, notice the structure and connectors, then write your own version above.</p>
        </div>`;
      const h = fb.querySelector("#hearModel");
      if (h) h.addEventListener("click", () => window.Speech.speak(text));
    } catch (e) {
      fb.innerHTML = `<div class="tip">${window.AI.describeError(e)}</div>`;
    }
  }

  async function grade(view, task, text) {
    const fb = view.querySelector("#feedback");
    if (!text || text.length < 10) { fb.innerHTML = `<div class="tip">Write a bit more first.</div>`; return; }

    if (!window.AI.hasKey()) {
      const n = (text.match(/\S+/g) || []).length;
      const sentences = (text.match(/[.!?]+/g) || []).length;
      const connectors = ["d'abord", "ensuite", "enfin", "cependant", "donc", "parce que", "car", "mais", "par exemple", "en conclusion", "d'une part", "d'autre part", "en revanche", "néanmoins"];
      const used = connectors.filter((c) => text.toLowerCase().includes(c));
      fb.innerHTML = `
        <div class="card" style="margin-top:14px; background:var(--card-2)">
          <h3>📝 Self-check</h3>
          <ul>
            <li>Length: <strong>${n} words</strong> — ${n >= task.minWords ? "✅ good for this task" : `aim for ${task.minWords}+`}</li>
            <li>Sentences: <strong>${sentences}</strong> ${sentences >= 3 ? "✅" : "— try to develop more"}</li>
            <li>Connectors used: ${used.length ? "✅ " + used.slice(0, 5).join(", ") : "❌ none found — add d'abord/ensuite/cependant…"}</li>
            <li>Now re-read for verb endings, agreement and accents.</li>
          </ul>
          <p class="muted">Tap <strong>📄 Show a model answer</strong> to compare, or add an API key in Settings for a full CEFR grade on your text.</p>
        </div>`;
      window.App.recordResult("writing", Math.min(72, 40 + n + used.length * 3)); // engagement credit
      return;
    }

    fb.innerHTML = `<div class="spinner"></div>`;
    const schema = {
      type: "object",
      additionalProperties: false,
      properties: {
        cefr_band: { type: "string" },
        score_0_100: { type: "integer" },
        summary: { type: "string" },
        strengths: { type: "array", items: { type: "string" } },
        corrections: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: { original: { type: "string" }, fixed: { type: "string" }, why: { type: "string" } },
            required: ["original", "fixed", "why"],
          },
        },
        improved_version: { type: "string" },
      },
      required: ["cefr_band", "score_0_100", "summary", "strengths", "corrections", "improved_version"],
    };

    try {
      const out = await window.AI.call({
        system:
          "You are a certified TCF examiner grading French writing (Expression écrite). Grade on TCF criteria: " +
          "task achievement (did they do what was asked), coherence/cohesion, lexical range, and grammatical accuracy. " +
          "Be fair but rigorous. Output ONLY JSON per the schema. 'cefr_band' is one of A1,A2,B1,B2,C1,C2. " +
          "'corrections' lists up to 6 concrete fixes (quote the original French and the corrected French, with a short English reason). " +
          "'improved_version' is a polished rewrite of their text at one level higher. Keep feedback constructive.",
        messages: [{
          role: "user",
          content: `TCF task: "${task.title}". Instruction: ${task.instruction}\n\nStudent's response:\n"""${text}"""\n\nGrade it.`,
        }],
        maxTokens: 2000,
        jsonSchema: schema,
      });
      const r = window.AI.parseJSON(out);
      if (!r) throw new Error("Could not parse grading.");
      showFeedback(fb, r);
      window.App.recordResult("writing", clamp(r.score_0_100, 0, 100));
    } catch (e) {
      fb.innerHTML = `<div class="tip">${window.AI.describeError(e)}</div>`;
    }
  }

  function showFeedback(fb, r) {
    const band = (r.cefr_band || "").toUpperCase();
    fb.innerHTML = `
      <div class="card" style="margin-top:14px; background:var(--card-2)">
        <div class="grade-band">${band}</div>
        <div class="center muted">${clamp(r.score_0_100, 0, 100)}/100 — ${escapeHtml(r.summary || "")}</div>
        ${
          r.strengths && r.strengths.length
            ? `<h3 style="margin-top:12px">✅ Strengths</h3><ul>${r.strengths.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}</ul>`
            : ""
        }
        ${
          r.corrections && r.corrections.length
            ? `<h3>🔧 Corrections</h3>` +
              r.corrections
                .map(
                  (c) => `<div class="tip" style="margin:6px 0">
                    <span style="text-decoration:line-through;color:var(--bad)">${escapeHtml(c.original)}</span>
                    → <strong style="color:var(--good)">${escapeHtml(c.fixed)}</strong>
                    <div class="muted" style="font-size:13px">${escapeHtml(c.why)}</div>
                  </div>`
                )
                .join("")
            : ""
        }
        ${
          r.improved_version
            ? `<h3>⭐ Polished version</h3><div class="passage">${escapeHtml(r.improved_version)}</div>
               <button class="btn secondary" id="hearImproved">🔊 Hear it</button>`
            : ""
        }
      </div>
    `;
    const h = fb.querySelector("#hearImproved");
    if (h) h.addEventListener("click", () => window.Speech.speak(r.improved_version));
  }

  function clamp(n, lo, hi) { n = parseInt(n, 10) || 0; return Math.max(lo, Math.min(hi, n)); }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

  return { render };
})();
