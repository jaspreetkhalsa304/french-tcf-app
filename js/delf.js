/* ===== DELF / DALF practice tab =====
 * One tab → pick a level (A1..C2) → pick a module (Listening / Reading /
 * Writing / Speaking) → practise.
 *   • Listening + Reading: offline MCQ banks, scored.
 *   • Writing: open-ended task; Claude grades on the official DELF rubric
 *     when a key is set, otherwise self-check guide.
 *   • Speaking: timed monologue; user records (Web Speech / Gemini),
 *     Claude grades the transcript on the DELF speaking rubric.
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
    view.innerHTML = `
      <div class="card">
        <div class="row">
          <span class="badge">🇫🇷 DELF</span>
          <span class="badge">${window.DELF.levelNames[lvl]}</span>
        </div>
        <h2>DELF practice — ${lvl}</h2>
        <p class="muted">Practise the four official DELF modules at your chosen level. Listening &amp; Reading are scored immediately; Writing &amp; Speaking are graded by the AI tutor on the official DELF rubric.</p>

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
            <div class="sub">${esc(fmt.listen || "")}</div>
          </div>
          <div class="skill-card" data-mod="reading">
            <div class="emoji">📖</div>
            <div class="name">Compréhension des écrits</div>
            <div class="sub">${esc(fmt.read || "")}</div>
          </div>
          <div class="skill-card" data-mod="writing">
            <div class="emoji">✍️</div>
            <div class="name">Production écrite</div>
            <div class="sub">${esc(fmt.write || "")}</div>
          </div>
          <div class="skill-card" data-mod="speaking">
            <div class="emoji">🗣️</div>
            <div class="name">Production orale</div>
            <div class="sub">${esc(fmt.speak || "")}</div>
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

  function openModule(view, lvl, mod) {
    if (mod === "listening") return openListening(view, lvl);
    if (mod === "reading") return openReading(view, lvl);
    if (mod === "writing") return openWriting(view, lvl);
    if (mod === "speaking") return openSpeaking(view, lvl);
  }

  /* ====================================================
   * Listening module
   * ==================================================== */
  function openListening(view, lvl) {
    const items = (window.DELF.listening[lvl] || []).slice();
    if (!items.length) return noItems(view, lvl, "Listening");
    runMCQ(view, lvl, "🎧 Compréhension de l'oral", items, true);
  }

  /* ====================================================
   * Reading module
   * ==================================================== */
  function openReading(view, lvl) {
    const items = (window.DELF.reading[lvl] || []).slice();
    if (!items.length) return noItems(view, lvl, "Reading");
    runMCQ(view, lvl, "📖 Compréhension des écrits", items, false);
  }

  function runMCQ(view, lvl, badge, items, isAudio) {
    let i = 0;
    const answers = []; // {ok}

    function draw() {
      const item = items[i];
      view.innerHTML = `
        <div class="card">
          <div class="row">
            <span class="badge">${badge}</span>
            <span class="badge">${lvl}</span>
            <span class="badge">${i + 1} / ${items.length}</span>
            <span class="spacer"></span>
            <button class="ghost-btn" id="backBtn">← Back</button>
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
      view.querySelector("#backBtn").addEventListener("click", () => {
        window.Speech.cancel();
        drawLevelHub(view, lvl);
      });
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
        b.addEventListener("click", () => choose(oi, b, optsEl, item));
        optsEl.appendChild(b);
      });
    }

    function choose(oi, btn, optsEl, item) {
      const all = optsEl.querySelectorAll(".mcq-option");
      all.forEach((el) => { el.classList.add("disabled"); el.onclick = null; });
      const ok = oi === item.answer;
      if (ok) btn.classList.add("correct");
      else { btn.classList.add("wrong"); all[item.answer].classList.add("correct"); }
      answers.push({ ok });
      const after = view.querySelector("#after");
      after.innerHTML = `
        ${isAudio ? `<div class="passage" style="margin-top:10px"><span class="muted">Transcript:</span> ${esc(item.audio)}</div>` : ""}
        <div class="row" style="justify-content:flex-end; margin-top:12px">
          <button class="btn" id="nextQ">${i === items.length - 1 ? "See results" : "Next →"}</button>
        </div>`;
      after.querySelector("#nextQ").addEventListener("click", () => {
        if (i === items.length - 1) finish();
        else { i++; draw(); }
      });
    }

    function finish() {
      window.Speech.cancel();
      const correct = answers.filter((a) => a.ok).length;
      const pct = Math.round((correct / items.length) * 100);
      const score25 = Math.round((correct / items.length) * 25);
      const skill = isAudio ? "listening" : "reading";
      window.App.recordResult(skill, pct);
      view.innerHTML = `
        <div class="card center">
          <h2>${badge}</h2>
          <div class="score-ring ${pct >= 70 ? "good" : pct >= 50 ? "mid" : "low"}">${correct} / ${items.length}</div>
          <p class="muted">${pct}% · ≈ ${score25} / 25 on the official DELF scale</p>
          <div class="tip" style="text-align:left;margin:12px 0">
            <strong>${verdict(score25)}</strong><br>
            <span class="muted">DELF passing mark per module is 5/25; the overall pass is 50/100.</span>
          </div>
          <div class="row" style="justify-content:center;margin-top:14px">
            <button class="btn blue" id="retry">Try again</button>
            <button class="btn secondary" id="back">← Back to DELF ${lvl}</button>
          </div>
        </div>`;
      view.querySelector("#retry").addEventListener("click", () => (isAudio ? openListening(view, lvl) : openReading(view, lvl)));
      view.querySelector("#back").addEventListener("click", () => drawLevelHub(view, lvl));
    }

    draw();
  }

  /* ====================================================
   * Writing module
   * ==================================================== */
  function openWriting(view, lvl) {
    const tasks = (window.DELF.writing[lvl] || []).slice();
    if (!tasks.length) return noItems(view, lvl, "Writing");
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
        <p class="muted">Choose a task. ${window.AI.hasKey() ? "Your response is graded on the official DELF rubric." : "Add an API key in Settings (⚙️) for AI grading."}</p>
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
    const system = `You are a certified DELF/DALF examiner. Grade the candidate's written response strictly using the official DELF ${lvl} Production écrite rubric (25 points total, typically: respect of the instruction, coherence/cohesion, lexical range and accuracy, morpho-syntactic range and accuracy). Always return valid JSON only, no prose outside the JSON.`;
    const user = `Task instructions (in French):
"""${task.instruction}"""

Target length: ${task.minWords}+ words.
Candidate level being assessed: DELF ${lvl}.
Candidate response:
"""${text}"""

Return JSON with this shape:
{
  "score25": <integer 0-25>,
  "band": "<CEFR band you'd give this text, e.g. A2 / A2+ / B1->",
  "criteria": [
    {"name": "Respect de la consigne", "score": <int 0-5 or 0-6>, "max": <int>, "comment": "<short FR or EN>"},
    {"name": "Cohérence et cohésion", "score": <int>, "max": <int>, "comment": "<short>"},
    {"name": "Lexique", "score": <int>, "max": <int>, "comment": "<short>"},
    {"name": "Morphosyntaxe", "score": <int>, "max": <int>, "comment": "<short>"}
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
        maxTokens: 1600,
      });
      const data = window.AI.parseJSON(raw);
      if (!data) throw new Error("parse");
      renderWritingFeedback(fb, data, words, task);
      window.App.recordResult("writing", Math.round((data.score25 / 25) * 100));
    } catch (e) {
      fb.innerHTML = `<div class="tip">⚠️ ${esc(window.AI.describeError(e))}</div>`;
    }
  }

  function renderWritingFeedback(fb, d, words, task) {
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
    if (!tasks.length) return noItems(view, lvl, "Speaking");
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
        // captureTranscript routes through Gemini when its key is set, otherwise Web Speech.
        // It resolves with the final transcript when stopCapture() is called or silence is hit.
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
      // captureTranscript's promise will resolve next; finishRec runs there.
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
      // Small delay so any in-flight transcript can land in the textarea.
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
    const system = `You are a certified DELF/DALF examiner grading a candidate's spoken production from a transcript. Grade strictly on the official DELF ${lvl} Production orale rubric (25 points: typically covering the prompt, coherence and fluency, lexical range, morpho-syntactic control, phonological aspects — note phonology is uncertain from a transcript and should be flagged as such). Return JSON only.`;
    const user = `Task (in French):
"""${task.instruction}"""
Target duration: ~${task.durationSec}s. Actual: ${durationSec}s. Words: ${words}.
Transcript of the candidate's spoken response:
"""${text}"""

Return JSON with this shape:
{
  "score25": <int 0-25>,
  "band": "<CEFR band>",
  "criteria": [
    {"name":"Couverture de la tâche","score":<int>,"max":<int>,"comment":"<short>"},
    {"name":"Cohérence / fluidité","score":<int>,"max":<int>,"comment":"<short>"},
    {"name":"Lexique","score":<int>,"max":<int>,"comment":"<short>"},
    {"name":"Morphosyntaxe","score":<int>,"max":<int>,"comment":"<short>"},
    {"name":"Phonologie (estimée)","score":<int>,"max":<int>,"comment":"transcript only — limited"}
  ],
  "strengths": ["..."],
  "fixes": [{"original":"<FR snippet>","corrected":"<FR corrected>","why":"<short>"}],
  "next_step": "<one concrete thing to practise>"
}`;
    try {
      const raw = await window.AI.call({
        system,
        messages: [{ role: "user", content: user }],
        maxTokens: 1600,
      });
      const data = window.AI.parseJSON(raw);
      if (!data) throw new Error("parse");
      renderWritingFeedback(fb, data, words, task); // same renderer
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
