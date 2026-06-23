/* ===== DELF / DALF practice tab =====
 * Per level (A1..C2), four modules:
 *   • Listening — offline MCQ + short-answer (B1+); supports multi-Q passages
 *   • Reading — same shape, longer passages at B2+
 *   • Writing — Claude-graded with the official rubric descriptors
 *   • Speaking — Web Speech / Gemini transcript, Claude grades on the rubric
 *
 * Listening & Reading run as a timed exam (exam mode) with a section timer.
 */
window.DELFPractice = (function () {
  const LEVELS = window.DELF.levels;

  /* -------- top-level render: level picker -------- */
  function render(view) {
    const s = window.App.getState();
    const defaultLvl = LEVELS.includes(s.level) ? s.level : "A1";
    drawLevelHub(view, defaultLvl);
  }

  function drawLevelHub(view, lvl) {
    const fmt = window.DELF.format[lvl] || {};
    const counts = moduleCounts(lvl);
    view.innerHTML = `
      <div class="card">
        <div class="row">
          <span class="badge">🇫🇷 DELF</span>
          <span class="badge">${window.DELF.levelNames[lvl]}</span>
        </div>
        <h2>DELF practice — ${lvl}</h2>
        <p class="muted">Practise the four official DELF modules. Listening &amp; Reading run as a timed exam (full session, scored /25). Writing &amp; Speaking are graded by Claude on the official DELF descriptors.</p>

        <div class="setting-group">
          <label for="delfLvlSel">Choose level</label>
          <select id="delfLvlSel">
            ${LEVELS.map((l) => `<option value="${l}" ${l === lvl ? "selected" : ""}>${window.DELF.levelNames[l]}</option>`).join("")}
          </select>
        </div>

        <div class="skill-grid" style="margin-top:6px">
          <div class="skill-card" data-mod="listening">
            <div class="emoji">🎧</div>
            <div class="name">Compréhension de l'oral</div>
            <div class="sub">${esc(fmt.listen || "")}<br><span class="muted">${counts.listening} questions</span></div>
          </div>
          <div class="skill-card" data-mod="reading">
            <div class="emoji">📖</div>
            <div class="name">Compréhension des écrits</div>
            <div class="sub">${esc(fmt.read || "")}<br><span class="muted">${counts.reading} questions</span></div>
          </div>
          <div class="skill-card" data-mod="writing">
            <div class="emoji">✍️</div>
            <div class="name">Production écrite</div>
            <div class="sub">${esc(fmt.write || "")}<br><span class="muted">${counts.writing} tasks · official rubric</span></div>
          </div>
          <div class="skill-card" data-mod="speaking">
            <div class="emoji">🗣️</div>
            <div class="name">Production orale</div>
            <div class="sub">${esc(fmt.speak || "")}<br><span class="muted">${counts.speaking} tasks · official rubric</span></div>
          </div>
        </div>

        <p class="muted" style="margin-top:12px;font-size:13px">DELF (A1–B2) and DALF (C1–C2) share the same 4-module format. Each module is scored /25; pass = 50/100 total with ≥5/25 per module.</p>
      </div>
    `;
    view.querySelector("#delfLvlSel").addEventListener("change", (e) => drawLevelHub(view, e.target.value));
    view.querySelectorAll("[data-mod]").forEach((el) => {
      el.addEventListener("click", () => openModule(view, lvl, el.dataset.mod));
    });
  }

  function moduleCounts(lvl) {
    return {
      listening: countQuestions(window.DELF.listening[lvl]),
      reading: countQuestions(window.DELF.reading[lvl]),
      writing: (window.DELF.writing[lvl] || []).length,
      speaking: (window.DELF.speaking[lvl] || []).length,
    };
  }
  function countQuestions(bank) {
    if (!bank) return 0;
    let n = 0;
    bank.forEach((it) => { n += it.items ? it.items.length : 1; });
    return n;
  }

  function openModule(view, lvl, mod) {
    if (mod === "listening") return openExam(view, lvl, "listening", "🎧 Compréhension de l'oral", true);
    if (mod === "reading") return openExam(view, lvl, "reading", "📖 Compréhension des écrits", false);
    if (mod === "writing") return openWriting(view, lvl);
    if (mod === "speaking") return openSpeaking(view, lvl);
  }

  /* ====================================================
   * Listening / Reading — timed exam mode with multi-Q passages
   * ==================================================== */
  function openExam(view, lvl, modKey, badge, isAudio) {
    const bank = (window.DELF[modKey][lvl] || []).slice();
    if (!bank.length) return noItems(view, lvl, modKey);
    const totalQ = countQuestions(bank);
    const examSec = (window.DELF.examDuration[lvl] && window.DELF.examDuration[lvl][modKey]) || 25 * 60;
    // Intro card with timer info + start
    view.innerHTML = `
      <div class="card">
        <div class="row">
          <span class="badge">${badge}</span>
          <span class="badge">DELF ${lvl}</span>
          <span class="spacer"></span>
          <button class="ghost-btn" id="backBtn">← Back</button>
        </div>
        <h2>${badge} — ${lvl}</h2>
        <p class="muted">This module contains <strong>${totalQ}</strong> questions across <strong>${bank.length}</strong> document(s). A countdown of <strong>${fmtSec(examSec)}</strong> runs in the background — answer at exam pace. Short-answer items at B1+ are graded by Claude when a key is set.</p>
        <div class="tip">⏱️ ${isAudio ? "Each audio plays automatically (you can replay). " : ""}You can navigate freely between questions before submitting. Submit to see your /25 score with a breakdown.</div>
        <div class="row" style="margin-top:14px">
          <button class="btn blue" id="startBtn">Start exam →</button>
        </div>
      </div>
    `;
    view.querySelector("#backBtn").addEventListener("click", () => drawLevelHub(view, lvl));
    view.querySelector("#startBtn").addEventListener("click", () => runExam(view, lvl, modKey, badge, isAudio, bank, examSec));
  }

  function runExam(view, lvl, modKey, badge, isAudio, bank, examSec) {
    // Flatten bank into a list of questions, each linked back to its doc index.
    const flat = [];
    bank.forEach((doc, di) => {
      const items = doc.items || [doc];
      items.forEach((q, qi) => flat.push({ q, di, qi, doc }));
    });
    const responses = new Array(flat.length).fill(null); // store choice index or short text
    let cur = 0;
    let remaining = examSec;
    let timer = null;

    function tick() {
      remaining--;
      const el = document.getElementById("examTimer");
      if (el) {
        el.textContent = "⏱️ " + fmtSec(Math.max(0, remaining));
        if (remaining <= 60) el.style.color = "var(--accent)";
      }
      if (remaining <= 0) { clearInterval(timer); submit(true); }
    }

    function draw() {
      const f = flat[cur];
      const doc = f.doc;
      const q = f.q;
      const isShort = q.kind === "short";
      // Only show audio/passage UI when this is the FIRST question of its doc.
      const firstOfDoc = (cur === 0) || flat[cur - 1].di !== f.di;
      const docBlock = firstOfDoc
        ? (isAudio
            ? `<div class="row" style="margin:10px 0">
                 <button class="btn blue" id="playAudio">▶︎ Play audio</button>
                 <button class="btn secondary" id="playSlow">🐢 Slow</button>
                 <span class="muted">${doc.items ? `Document ${f.di + 1} — ${doc.items.length} questions` : ""}</span>
               </div>`
            : doc.passage
              ? `<div class="passage" style="white-space:pre-wrap">${esc(doc.passage)}</div>`
              : "")
        : (isAudio
            ? `<div class="row" style="margin:6px 0"><button class="btn secondary" id="playAudio">▶︎ Replay audio</button> <button class="btn secondary" id="playSlow">🐢 Slow</button></div>`
            : doc.passage && doc.items ? `<details style="margin:6px 0"><summary class="muted">Show document again</summary><div class="passage" style="white-space:pre-wrap;margin-top:6px">${esc(doc.passage)}</div></details>` : "");

      view.innerHTML = `
        <div class="card">
          <div class="row">
            <span class="badge">${badge}</span>
            <span class="badge">${lvl}</span>
            <span class="badge">${cur + 1} / ${flat.length}</span>
            <span class="spacer"></span>
            <span class="badge" id="examTimer">⏱️ ${fmtSec(remaining)}</span>
          </div>
          ${docBlock}
          <h3 style="margin-top:10px">${esc(q.q)}</h3>
          <div id="answerArea"></div>
          <div class="row" style="margin-top:14px;gap:8px;flex-wrap:wrap">
            <button class="btn secondary" id="prevBtn" ${cur === 0 ? "disabled" : ""}>← Previous</button>
            <button class="btn" id="nextBtn" ${cur === flat.length - 1 ? "disabled" : ""}>Next →</button>
            <span class="spacer"></span>
            <button class="btn secondary" id="navBtn">📋 All questions</button>
            <button class="btn blue" id="submitBtn">Submit exam</button>
          </div>
        </div>
      `;

      if (isAudio) {
        const speakIt = (rate) => window.Speech.speak(doc.audio, rate ? { rate } : {});
        const pa = view.querySelector("#playAudio");
        const ps = view.querySelector("#playSlow");
        if (pa) pa.addEventListener("click", () => speakIt());
        if (ps) ps.addEventListener("click", () => speakIt(0.6));
        if (firstOfDoc) setTimeout(() => speakIt(), 250);
      }

      const ans = view.querySelector("#answerArea");
      if (isShort) {
        const prev = responses[cur] || "";
        ans.innerHTML = `<textarea id="shortIn" class="write-area" placeholder="Réponse courte en français…" style="min-height:80px">${esc(prev)}</textarea>`;
        ans.querySelector("#shortIn").addEventListener("input", (e) => { responses[cur] = e.target.value; });
      } else {
        const prev = responses[cur];
        q.options.forEach((opt, oi) => {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "mcq-option" + (prev === oi ? " selected" : "");
          b.textContent = opt;
          b.dataset.oi = String(oi);
          ans.appendChild(b);
        });
        ans.addEventListener("click", (ev) => {
          const t = ev.target.closest(".mcq-option");
          if (!t || !ans.contains(t)) return;
          const oi = parseInt(t.dataset.oi, 10);
          if (isNaN(oi)) return;
          responses[cur] = oi;
          ans.querySelectorAll(".mcq-option").forEach((el) => el.classList.remove("selected"));
          t.classList.add("selected");
        });
      }

      view.querySelector("#prevBtn").addEventListener("click", () => { if (cur > 0) { window.Speech.cancel(); cur--; draw(); } });
      view.querySelector("#nextBtn").addEventListener("click", () => { if (cur < flat.length - 1) { window.Speech.cancel(); cur++; draw(); } });
      view.querySelector("#navBtn").addEventListener("click", showNav);
      view.querySelector("#submitBtn").addEventListener("click", () => submit(false));
    }

    function showNav() {
      const grid = flat.map((f, i) => {
        const done = responses[i] !== null && responses[i] !== "" && responses[i] !== undefined;
        return `<button class="mcq-option" style="min-width:48px;${done ? "background:rgba(80,200,120,.2);" : ""}${i === cur ? "border:2px solid var(--accent);" : ""}" data-nav="${i}">${i + 1}${done ? " ✓" : ""}</button>`;
      }).join("");
      const modal = document.createElement("div");
      modal.className = "modal";
      modal.innerHTML = `<div class="modal-card" style="max-width:520px"><div class="modal-head"><h2>Questions</h2><button class="icon-btn" id="navClose">✕</button></div><div style="display:flex;flex-wrap:wrap;gap:6px">${grid}</div><p class="muted" style="margin-top:10px;font-size:13px">Green = answered. Click any to jump.</p></div>`;
      document.body.appendChild(modal);
      modal.querySelector("#navClose").addEventListener("click", () => modal.remove());
      modal.querySelectorAll("[data-nav]").forEach((b) => b.addEventListener("click", () => {
        cur = parseInt(b.dataset.nav, 10);
        modal.remove();
        window.Speech.cancel();
        draw();
      }));
    }

    async function submit(timedOut) {
      clearInterval(timer);
      window.Speech.cancel();
      // MCQ scoring: instant. Short-answer: needs Claude. Each item is worth 1 raw point.
      const shortIdxs = flat.map((f, i) => f.q.kind === "short" ? i : -1).filter((i) => i >= 0);
      const mcqResults = flat.map((f, i) => {
        if (f.q.kind === "short") return null;
        return { idx: i, ok: responses[i] === f.q.answer };
      });
      let shortResults = shortIdxs.map((i) => ({ idx: i, score: 0, max: 2, comment: "" }));

      if (shortIdxs.length && window.AI.hasKey()) {
        showGrading(view, lvl, badge, `Grading ${shortIdxs.length} short-answer item(s)…`);
        try {
          shortResults = await gradeShortBatch(flat, responses, shortIdxs);
        } catch (e) {
          // Soft-fail: give 0 on short answers
          shortResults = shortIdxs.map((i) => ({ idx: i, score: 0, max: 2, comment: "Grading failed: " + window.AI.describeError(e) }));
        }
      } else if (shortIdxs.length) {
        // No key: skip short grading (count as 0, flag in result)
        shortResults = shortIdxs.map((i) => {
          const ans = responses[i];
          return { idx: i, score: ans && ans.trim().length > 5 ? 1 : 0, max: 2, comment: "Self-check only (add an API key for proper grading)" };
        });
      }

      finishExam(view, lvl, modKey, badge, isAudio, flat, responses, mcqResults, shortResults, timedOut, examSec - remaining);
    }

    timer = setInterval(tick, 1000);
    draw();
  }

  async function gradeShortBatch(flat, responses, shortIdxs) {
    const system = `You are a certified DELF examiner grading short-answer comprehension items. ${window.DELF.rubric.shortAnswer} Return ONLY valid JSON, no prose.`;
    const items = shortIdxs.map((i) => ({
      idx: i,
      q: flat[i].q.q,
      model: flat[i].q.model,
      candidate: (responses[i] || "").trim(),
    }));
    const user = `Grade each item independently. Each is worth 0, 1, or 2 points (full DELF short-answer scale).
Items to grade:
${JSON.stringify(items, null, 2)}

Return JSON:
{
  "results": [
    {"idx": <int matches item.idx>, "score": <0|1|2>, "max": 2, "comment": "<short FR or EN feedback>"},
    ...
  ]
}`;
    const raw = await window.AI.call({
      system,
      messages: [{ role: "user", content: user }],
      maxTokens: 1200,
    });
    const data = window.AI.parseJSON(raw);
    if (!data || !data.results) throw new Error("Bad grading response");
    return data.results;
  }

  function showGrading(view, lvl, badge, msg) {
    view.innerHTML = `<div class="card center"><h2>${badge}</h2><div class="tip">⏳ ${esc(msg)}</div><p class="muted">This may take 10–30 seconds for long passages with many short-answer items.</p></div>`;
  }

  function finishExam(view, lvl, modKey, badge, isAudio, flat, responses, mcqResults, shortResults, timedOut, secsUsed) {
    // Combine scores into /25 (DELF section scale)
    let raw = 0, maxRaw = 0;
    const perQ = flat.map((f, i) => {
      if (f.q.kind === "short") {
        const r = shortResults.find((x) => x.idx === i);
        const sc = r ? r.score : 0;
        const mx = r ? r.max : 2;
        raw += sc; maxRaw += mx;
        return { i, kind: "short", q: f.q.q, model: f.q.model, candidate: responses[i] || "", score: sc, max: mx, comment: r ? r.comment : "" };
      }
      const r = mcqResults.find((x) => x && x.idx === i);
      const ok = r && r.ok;
      raw += ok ? 1 : 0; maxRaw += 1;
      return { i, kind: "mcq", q: f.q.q, options: f.q.options, correctIdx: f.q.answer, chosenIdx: responses[i], ok };
    });
    const score25 = Math.round((raw / maxRaw) * 25);
    const pct = Math.round((raw / maxRaw) * 100);
    window.App.recordResult(isAudio ? "listening" : "reading", pct);

    const rowsHTML = perQ.map((r) => {
      if (r.kind === "mcq") {
        return `<div style="margin:10px 0;padding:10px;background:rgba(255,255,255,.04);border-radius:6px">
          <div class="row"><strong style="font-size:13px">Q${r.i + 1} · ${r.ok ? "✅" : "❌"}</strong><span class="spacer"></span><span class="muted">${r.ok ? "1" : "0"}/1</span></div>
          <div style="font-size:13px;margin-top:4px">${esc(r.q)}</div>
          <div class="muted" style="font-size:12px;margin-top:4px">${r.chosenIdx == null ? "(no answer)" : "Your answer: " + esc(r.options[r.chosenIdx])}</div>
          ${!r.ok ? `<div class="muted" style="font-size:12px">Correct: ${esc(r.options[r.correctIdx])}</div>` : ""}
        </div>`;
      }
      return `<div style="margin:10px 0;padding:10px;background:rgba(255,255,255,.04);border-radius:6px">
        <div class="row"><strong style="font-size:13px">Q${r.i + 1} · ${r.score === r.max ? "✅" : r.score > 0 ? "🟡" : "❌"} (short)</strong><span class="spacer"></span><span class="muted">${r.score}/${r.max}</span></div>
        <div style="font-size:13px;margin-top:4px">${esc(r.q)}</div>
        <div class="muted" style="font-size:12px;margin-top:4px">Your answer: ${esc(r.candidate || "(empty)")}</div>
        <div class="muted" style="font-size:12px">Model: ${esc(r.model || "")}</div>
        ${r.comment ? `<div class="muted" style="font-size:12px;font-style:italic;margin-top:4px">${esc(r.comment)}</div>` : ""}
      </div>`;
    }).join("");

    view.innerHTML = `
      <div class="card center">
        <h2>${timedOut ? "⏰ Time's up — " : ""}${badge}</h2>
        <div class="score-ring ${pct >= 70 ? "good" : pct >= 50 ? "mid" : "low"}">${score25} / 25</div>
        <p class="muted">${raw} / ${maxRaw} raw · ${pct}% · time used ${fmtSec(secsUsed)}</p>
        <div class="tip" style="text-align:left;margin:12px 0">
          <strong>${verdict(score25)}</strong><br>
          <span class="muted">DELF passing mark per module is 5/25; the overall pass is 50/100.</span>
        </div>
      </div>
      <div class="card">
        <h3>Question-by-question</h3>
        ${rowsHTML}
        <div class="row" style="justify-content:center;margin-top:14px">
          <button class="btn blue" id="retry">Try again</button>
          <button class="btn secondary" id="back">← Back to DELF ${lvl}</button>
        </div>
      </div>`;
    view.querySelector("#retry").addEventListener("click", () => openExam(view, lvl, modKey, badge, isAudio));
    view.querySelector("#back").addEventListener("click", () => drawLevelHub(view, lvl));
  }

  /* ====================================================
   * Writing module
   * ==================================================== */
  function openWriting(view, lvl) {
    const tasks = (window.DELF.writing[lvl] || []).slice();
    if (!tasks.length) return noItems(view, lvl, "writing");
    drawTaskList(view, lvl, "✍️ Production écrite", tasks, openWritingTask);
  }

  function drawTaskList(view, lvl, badge, tasks, opener) {
    view.innerHTML = `
      <div class="card">
        <div class="row">
          <span class="badge">${badge}</span>
          <span class="badge">${lvl}</span>
          <span class="spacer"></span>
          <button class="ghost-btn" id="backBtn">← Back</button>
        </div>
        <h2>${badge} — ${lvl}</h2>
        <p class="muted">Choose a task. ${window.AI.hasKey() ? "Your response is graded on the official DELF descriptors." : "Add an API key in Settings (⚙️) for AI grading."}</p>
        <div id="taskList"></div>
      </div>
    `;
    view.querySelector("#backBtn").addEventListener("click", () => drawLevelHub(view, lvl));
    const list = view.querySelector("#taskList");
    tasks.forEach((t) => {
      const card = document.createElement("div");
      card.className = "skill-card";
      card.style.textAlign = "left";
      card.innerHTML = `<div class="name">${esc(t.title)}</div><div class="sub">${esc(t.sub)}</div>`;
      card.addEventListener("click", () => opener(view, lvl, t));
      list.appendChild(card);
    });
  }

  function openWritingTask(view, lvl, task) {
    const keyOn = window.AI.hasKey();
    view.innerHTML = `
      <div class="card">
        <div class="row">
          <span class="badge">✍️ ${esc(task.sub)}</span>
          <span class="badge">DELF ${lvl}</span>
          <span class="spacer"></span>
          <button class="ghost-btn" id="backBtn">← Tasks</button>
        </div>
        <h2>${esc(task.title)}</h2>
        <div class="passage">${esc(task.instruction)}</div>
        <p class="muted">🇬🇧 ${esc(task.en)} · aim for ~${task.minWords}+ words.</p>
        ${task.tip ? `<div class="tip">🗂️ <strong>How to structure it:</strong> ${esc(task.tip)}</div>` : ""}
        <textarea class="write-area" id="essay" placeholder="Écrivez votre réponse en français ici…"></textarea>
        <div class="word-count" id="wc">0 words</div>
        <div class="row" style="justify-content:flex-end; gap:8px">
          <button class="btn ${keyOn ? "" : "secondary"}" id="gradeBtn">${keyOn ? "Submit for DELF grading" : "Check my writing"}</button>
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
    view.querySelector("#backBtn").addEventListener("click", () => openWriting(view, lvl));
    view.querySelector("#gradeBtn").addEventListener("click", () => gradeWriting(view, lvl, task, essay.value.trim()));
  }

  async function gradeWriting(view, lvl, task, text) {
    const fb = view.querySelector("#feedback");
    if (!text || text.length < 10) {
      fb.innerHTML = `<div class="tip">Write a few sentences first, then click <strong>${window.AI.hasKey() ? "Submit for DELF grading" : "Check my writing"}</strong>.</div>`;
      return;
    }
    const words = (text.match(/\S+/g) || []).length;

    if (!window.AI.hasKey()) {
      fb.innerHTML = `
        <div class="tip" style="margin-top:12px">
          <strong>Self-check (no API key):</strong>
          <ul style="margin:6px 0 0 18px">
            <li>Word count: <strong>${words}</strong> / target ${task.minWords}+ ${words >= task.minWords ? "✓" : "— add a bit more"}</li>
            <li>Did you cover every point in the instruction?</li>
            <li>Are tenses consistent (especially passé composé / imparfait at A2+)?</li>
            <li>Connectors used: <em>${task.tip || "see structure tip above"}</em></li>
          </ul>
          <p class="muted" style="margin-top:8px">Add an Anthropic key in Settings (⚙️) for AI grading on the official DELF rubric.</p>
        </div>`;
      return;
    }

    fb.innerHTML = `<div class="tip">⏳ Grading on the official DELF ${lvl} rubric…</div>`;
    const rubric = (window.DELF.rubric.writing && window.DELF.rubric.writing[lvl]) || "";
    const system = `You are a certified DELF/DALF examiner. Use the following OFFICIAL rubric verbatim as your grading reference — do not deviate from its criteria, weights, or scale. Return valid JSON only.

${rubric}`;
    const user = `Task instructions (in French):
"""${task.instruction}"""

Target length: ${task.minWords}+ words.
Candidate response:
"""${text}"""

Grade strictly according to the rubric above. Score each criterion using the EXACT max points specified in the rubric. Return JSON:
{
  "score25": <integer 0-25, sum of criteria>,
  "band": "<CEFR band you'd give this text, e.g. A2 / A2+ / B1->",
  "criteria": [
    {"name": "<criterion name from rubric>", "score": <int>, "max": <int from rubric>, "comment": "<short FR or EN>"}
  ],
  "strengths": ["<bullet>", "<bullet>"],
  "fixes": [
    {"original": "<exact FR snippet from text>", "corrected": "<corrected version>", "why": "<short explanation>"}
  ],
  "next_step": "<one concrete thing to work on>"
}`;

    try {
      const raw = await window.AI.call({
        system,
        messages: [{ role: "user", content: user }],
        maxTokens: 1800,
      });
      const data = window.AI.parseJSON(raw);
      if (!data) throw new Error("parse");
      renderRubricFeedback(fb, data, words, task);
      window.App.recordResult("writing", Math.round((data.score25 / 25) * 100));
    } catch (e) {
      fb.innerHTML = `<div class="tip">⚠️ ${esc(window.AI.describeError(e))}</div>`;
    }
  }

  function renderRubricFeedback(fb, d, words, task) {
    const pct = Math.round((d.score25 / 25) * 100);
    const crit = (d.criteria || []).map((c) =>
      `<div style="margin:6px 0">
         <div class="row"><strong style="font-size:13px">${esc(c.name)}</strong><span class="spacer"></span><span class="muted">${c.score}/${c.max}</span></div>
         <div class="lesson-progress"><span style="width:${Math.round((c.score / c.max) * 100)}%"></span></div>
         ${c.comment ? `<div class="muted" style="font-size:12px;margin-top:2px">${esc(c.comment)}</div>` : ""}
       </div>`
    ).join("");
    const strengths = (d.strengths || []).map((s) => `<li>${esc(s)}</li>`).join("");
    const fixes = (d.fixes || []).map((f) =>
      `<div style="margin:8px 0;padding:8px;background:rgba(255,255,255,.04);border-radius:6px">
         <div style="font-size:12px" class="muted">Original</div>
         <div style="text-decoration:line-through">${esc(f.original)}</div>
         <div style="font-size:12px;margin-top:6px" class="muted">Corrected</div>
         <div><strong>${esc(f.corrected)}</strong></div>
         ${f.why ? `<div class="muted" style="font-size:12px;margin-top:4px">${esc(f.why)}</div>` : ""}
       </div>`
    ).join("");
    fb.innerHTML = `
      <div class="card" style="margin-top:12px">
        <div class="row"><span class="badge">DELF rubric</span><span class="badge">${d.band || ""}</span><span class="spacer"></span><span class="muted">${words} words</span></div>
        <div class="score-ring ${pct >= 70 ? "good" : pct >= 50 ? "mid" : "low"}" style="margin:8px auto">${d.score25} / 25</div>
        <div style="text-align:left">${crit}</div>
        ${strengths ? `<h3 style="margin-top:14px">✅ Strengths</h3><ul>${strengths}</ul>` : ""}
        ${fixes ? `<h3 style="margin-top:14px">🛠️ Specific fixes</h3>${fixes}` : ""}
        ${d.next_step ? `<div class="tip" style="margin-top:12px">🎯 <strong>Next step:</strong> ${esc(d.next_step)}</div>` : ""}
      </div>`;
  }

  /* ====================================================
   * Speaking module
   * ==================================================== */
  function openSpeaking(view, lvl) {
    const tasks = (window.DELF.speaking[lvl] || []).slice();
    if (!tasks.length) return noItems(view, lvl, "speaking");
    drawTaskList(view, lvl, "🗣️ Production orale", tasks, openSpeakingTask);
  }

  function openSpeakingTask(view, lvl, task) {
    const recAvail = window.Speech && window.Speech.recognitionAvailable && window.Speech.recognitionAvailable();
    view.innerHTML = `
      <div class="card">
        <div class="row">
          <span class="badge">🗣️ ${esc(task.sub)}</span>
          <span class="badge">DELF ${lvl}</span>
          <span class="spacer"></span>
          <button class="ghost-btn" id="backBtn">← Tasks</button>
        </div>
        <h2>${esc(task.title)}</h2>
        <div class="passage">${esc(task.instruction)}</div>
        <p class="muted">🇬🇧 ${esc(task.en)} · target duration ≈ ${Math.round(task.durationSec / 60)} min</p>
        ${task.tip ? `<div class="tip">🎙️ <strong>Tip:</strong> ${esc(task.tip)}</div>` : ""}
        ${!recAvail ? `<div class="tip">⚠️ Your browser doesn't support speech recognition. You can type your response below instead — Claude grades the transcript either way.</div>` : ""}

        <div class="row" style="margin-top:14px;gap:8px;flex-wrap:wrap">
          <button class="btn blue" id="recBtn" ${recAvail ? "" : "disabled"}>🎤 Start recording</button>
          <button class="btn secondary" id="stopBtn" disabled>⏹ Stop</button>
          <span class="muted" id="recState">Idle</span>
        </div>
        <textarea class="write-area" id="manualEdit" placeholder="${recAvail ? "Your spoken French will appear here; you can edit it before grading…" : "Type your response in French here…"}" style="margin-top:8px;min-height:120px"></textarea>

        <div class="row" style="justify-content:flex-end; gap:8px; margin-top:8px">
          <button class="btn ${window.AI.hasKey() ? "" : "secondary"}" id="gradeBtn">${window.AI.hasKey() ? "Submit for DELF grading" : "Self-check transcript"}</button>
        </div>
        <div id="feedback"></div>
      </div>
    `;
    view.querySelector("#backBtn").addEventListener("click", () => openSpeaking(view, lvl));

    const recBtn = view.querySelector("#recBtn");
    const stopBtn = view.querySelector("#stopBtn");
    const stateEl = view.querySelector("#recState");
    const editEl = view.querySelector("#manualEdit");

    let timerId = null;
    let secs = 0;
    let recording = false;

    function startTimer() {
      secs = 0;
      stateEl.textContent = "🔴 Recording 0:00 / target ≈ " + fmtSec(task.durationSec);
      timerId = setInterval(() => {
        secs++;
        stateEl.textContent = `🔴 Recording ${fmtSec(secs)} / target ≈ ${fmtSec(task.durationSec)}`;
      }, 1000);
    }
    function stopTimer() {
      if (timerId) clearInterval(timerId);
      timerId = null;
    }

    async function startRec() {
      if (recording) return;
      recording = true;
      recBtn.disabled = true;
      stopBtn.disabled = false;
      startTimer();
      try {
        const transcript = await window.Speech.captureTranscript(
          (s) => { if (s && !recording) stateEl.textContent = s; },
          { silenceMs: 3500 }
        );
        editEl.value = (transcript || "").trim();
        finishRec();
      } catch (e) {
        finishRec();
        stateEl.textContent = "⚠️ " + (e && e.message ? e.message : "Mic error");
      }
    }

    function stopRec() {
      if (!recording) return;
      try { window.Speech.stopCapture(); } catch (_) {}
    }

    function finishRec() {
      stopTimer();
      recording = false;
      recBtn.disabled = !recAvail;
      stopBtn.disabled = true;
      stateEl.textContent = "⏹ Stopped at " + fmtSec(secs) + ". Edit the transcript if needed, then grade.";
    }

    recBtn.addEventListener("click", startRec);
    stopBtn.addEventListener("click", stopRec);
    view.querySelector("#gradeBtn").addEventListener("click", () => {
      if (recording) stopRec();
      setTimeout(() => gradeSpeaking(view, lvl, task, editEl.value.trim(), secs), 150);
    });
  }

  async function gradeSpeaking(view, lvl, task, text, durationSec) {
    const fb = view.querySelector("#feedback");
    if (!text || text.length < 5) {
      fb.innerHTML = `<div class="tip">Record (or type) at least a sentence, then click grade.</div>`;
      return;
    }
    const words = (text.match(/\S+/g) || []).length;
    if (!window.AI.hasKey()) {
      fb.innerHTML = `
        <div class="tip" style="margin-top:12px">
          <strong>Self-check (no API key):</strong>
          <ul style="margin:6px 0 0 18px">
            <li>Duration: ${fmtSec(durationSec)} / target ${fmtSec(task.durationSec)}</li>
            <li>Words spoken: <strong>${words}</strong></li>
            <li>Did you cover every point in the instruction?</li>
            <li>${esc(task.tip || "Use connectors and full sentences.")}</li>
          </ul>
          <p class="muted" style="margin-top:8px">Add an Anthropic key in Settings (⚙️) for full DELF speaking grading.</p>
        </div>`;
      return;
    }

    fb.innerHTML = `<div class="tip">⏳ Grading on the DELF ${lvl} Production orale rubric…</div>`;
    const rubric = (window.DELF.rubric.speaking && window.DELF.rubric.speaking[lvl]) || "";
    const system = `You are a certified DELF/DALF examiner grading a candidate's spoken production from a transcript. Use the following OFFICIAL rubric verbatim. Note that phonology cannot be assessed reliably from a transcript — score it conservatively and flag the limit in your comment.

${rubric}

Return JSON only.`;
    const user = `Task (in French):
"""${task.instruction}"""
Target duration: ~${task.durationSec}s. Actual: ${durationSec}s. Words: ${words}.
Transcript of the candidate's spoken response:
"""${text}"""

Grade strictly. Each criterion's max must match the rubric above. Return JSON:
{
  "score25": <int 0-25>,
  "band": "<CEFR band>",
  "criteria": [
    {"name":"<from rubric>","score":<int>,"max":<int from rubric>,"comment":"<short>"}
  ],
  "strengths": ["..."],
  "fixes": [{"original":"<FR snippet>","corrected":"<FR corrected>","why":"<short>"}],
  "next_step": "<one concrete thing to practise>"
}`;
    try {
      const raw = await window.AI.call({
        system,
        messages: [{ role: "user", content: user }],
        maxTokens: 1800,
      });
      const data = window.AI.parseJSON(raw);
      if (!data) throw new Error("parse");
      renderRubricFeedback(fb, data, words, task);
      window.App.recordResult("speaking", Math.round((data.score25 / 25) * 100));
    } catch (e) {
      fb.innerHTML = `<div class="tip">⚠️ ${esc(window.AI.describeError(e))}</div>`;
    }
  }

  /* ====================================================
   * Helpers
   * ==================================================== */
  function noItems(view, lvl, label) {
    view.innerHTML = `
      <div class="card center">
        <h2>No ${label} items yet for ${lvl}</h2>
        <p class="muted">Try another level or another module.</p>
        <button class="btn" id="back">← Back</button>
      </div>`;
    view.querySelector("#back").addEventListener("click", () => drawLevelHub(view, lvl));
  }
  function verdict(score25) {
    if (score25 >= 20) return "Excellent — well above the pass mark.";
    if (score25 >= 13) return "Solid — comfortable pass on this module.";
    if (score25 >= 5) return "Pass — above the per-module minimum.";
    return "Below 5/25 — this module would currently disqualify the whole exam.";
  }
  function fmtSec(sec) {
    const m = Math.floor(sec / 60), s = sec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  return { render };
})();
