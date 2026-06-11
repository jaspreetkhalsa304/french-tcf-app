/* ===== Lessons (sentence-building patterns) =====
 * Each lesson teaches ONE reusable sentence pattern (the "shape") with 6 ready-made
 * variations + a fill-in drill. Bridges Grammar (rules) and Talk (free output) by
 * giving the learner an immediately deployable shape to plug vocab into.
 *
 * Distinct from 🧩 Grammar (which lists the rule lessons from window.LESSONS).
 *
 * The `openLesson(view, lessonId)` export is preserved for the Grammar tab, which
 * still uses the step-by-step lesson player on window.LESSONS.
 */
window.Lessons = (function () {
  function donePatterns() {
    const s = window.App.getState();
    if (!s.patternsDone) s.patternsDone = {};
    return s.patternsDone;
  }
  function markPatternDone(id) {
    const s = window.App.getState();
    if (!s.patternsDone) s.patternsDone = {};
    if (!s.patternsDone[id]) {
      s.patternsDone[id] = true;
      window.App.addXP(10);
      window.App.recordResult("speaking", 80);
      window.App.save();
    }
  }

  /* ----- Pattern index: all 30 patterns, grouped by level ----- */
  function render(view) {
    const s = window.App.getState();
    const curLevel = s.level;
    const completed = donePatterns();
    const levels = window.CURRICULUM.levels;

    function patternRow(p) {
      const isDone = completed[p.id];
      const icon = isDone ? "✅" : (p.kind === "complex" ? "🧠" : "🧱");
      return `
        <button class="basic-row lesson-row" data-pattern="${p.id}">
          <div class="br-main">
            <span class="br-fr">${icon} ${escapeHtml(p.title)}</span>
          </div>
          <div class="br-en"><code style="font-size:12px">${escapeHtml(p.shape)}</code></div>
        </button>`;
    }

    function levelSection(lvl) {
      const list = (window.PATTERNS_BY_LEVEL && window.PATTERNS_BY_LEVEL[lvl]) || [];
      const total = list.length;
      const doneCount = list.filter((p) => completed[p.id]).length;
      const isCurrent = lvl === curLevel;
      const open = isCurrent ? "open" : "";
      const pct = total ? Math.round((doneCount / total) * 100) : 0;
      // Split into basic shapes vs complex-sentence structures so the learner can
      // see the progression: master the simple shapes first, then move to clauses.
      const basics = list.filter((p) => p.kind !== "complex");
      const complex = list.filter((p) => p.kind === "complex");
      const subSection = (label, rows) => rows.length
        ? `<h4 class="track-h" style="margin:10px 0 6px">${label} <span class="muted" style="font-size:12px">(${rows.filter((p) => completed[p.id]).length}/${rows.length})</span></h4>${rows.map(patternRow).join("")}`
        : "";
      return `
        <details class="level-block" ${open} data-level="${lvl}">
          <summary>
            <span class="lvl-tag">${lvl}</span>
            <span class="lvl-name">${escapeHtml(window.CURRICULUM.levelNames[lvl])}</span>
            ${isCurrent ? `<span class="badge" style="margin-left:6px">you are here</span>` : ""}
            <span class="spacer"></span>
            <span class="lvl-count">${total ? `${doneCount}/${total} done` : "soon"}</span>
          </summary>
          <div class="level-body">
            ${total ? `<div class="lesson-progress" style="margin:6px 0 10px"><span style="width:${pct}%"></span></div>` : ""}
            ${total
              ? (complex.length
                  ? subSection("🧱 Sentence shapes", basics) + subSection("🧠 Complex sentences", complex)
                  : list.map(patternRow).join(""))
              : `<p class="muted">Patterns for ${lvl} are coming soon.</p>`}
            <div class="row" style="margin-top:8px">
              ${!isCurrent ? `<button class="btn secondary" data-setlevel="${lvl}" style="font-size:13px;padding:7px 12px">Make this my level</button>` : ""}
            </div>
          </div>
        </details>`;
    }

    const totalPatterns = (window.PATTERNS || []).length;
    const totalDone = (window.PATTERNS || []).filter((p) => completed[p.id]).length;

    view.innerHTML = `
      <div class="card">
        <div class="row"><span class="badge">📚 Sentence patterns</span><span class="badge">A1 → C1</span></div>
        <h2>Leçons — sentence-building patterns</h2>
        <p class="muted">Each lesson teaches ONE reusable sentence shape — learn the pattern once, then plug different words in to say a lot. Different from <strong>🧩 Grammar</strong> (which lists the rules) — these turn rules into things you can actually say. ${totalDone}/${totalPatterns} patterns done.</p>
      </div>
      ${levels.map(levelSection).join("")}
    `;

    view.querySelectorAll("[data-pattern]").forEach((b) =>
      b.addEventListener("click", () => openPattern(view, b.dataset.pattern))
    );
    view.querySelectorAll("[data-setlevel]").forEach((b) =>
      b.addEventListener("click", (e) => {
        e.preventDefault();
        window.App.setLevel(b.dataset.setlevel);
        render(view);
        window.App.toast(`Level set to ${b.dataset.setlevel}.`);
      })
    );
  }

  /* ----- Pattern player ----- */
  function openPattern(view, patternId) {
    const p = (window.PATTERNS || []).find((x) => x.id === patternId);
    if (!p) return render(view);

    function drawExamples() {
      view.innerHTML = `
        <div class="card">
          <div class="row">
            <button class="btn secondary" id="backBtn" style="padding:6px 10px;font-size:13px">← Back</button>
            <span class="badge">${p.kind === "complex" ? "🧠 Complex sentence" : "🧱 Pattern"} · ${p.level}</span>
            <span class="spacer"></span>
          </div>
          <h2>${escapeHtml(p.title)}</h2>
          <div class="tip" style="margin:8px 0"><strong>Shape:</strong> <code>${escapeHtml(p.shape)}</code></div>
          <p>${escapeHtml(p.why)}</p>
          <h4 class="track-h" style="margin-top:14px">Examples — tap to hear</h4>
          <div id="exList"></div>
          <div class="row" style="justify-content:center;margin-top:14px">
            <button class="btn" id="drillBtn">🎯 Start drill →</button>
          </div>
        </div>
      `;
      const exList = view.querySelector("#exList");
      p.examples.forEach((it) => {
        const row = document.createElement("button");
        row.className = "basic-row";
        row.innerHTML = `<div class="br-main"><span class="br-fr">${escapeHtml(it.fr)}</span> <span class="play-hint">🔊</span></div><div class="br-en">${escapeHtml(it.en)}</div>`;
        row.addEventListener("click", () => window.Speech.speak(it.fr));
        exList.appendChild(row);
      });
      view.querySelector("#backBtn").addEventListener("click", () => render(view));
      view.querySelector("#drillBtn").addEventListener("click", drawDrill);
      // Auto-play the first example so the learner hears the shape immediately.
      setTimeout(() => p.examples[0] && window.Speech.speak(p.examples[0].fr), 300);
    }

    function normalize(s) {
      return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[.!?,;:]/g, "").replace(/\s+/g, " ").trim();
    }

    function drawDrill() {
      let qi = 0, correct = 0;
      const quiz = p.drill;

      function drawQ() {
        const item = quiz[qi];
        view.innerHTML = `
          <div class="card">
            <div class="row">
              <button class="btn secondary" id="backBtn" style="padding:6px 10px;font-size:13px">← Examples</button>
              <span class="badge">🎯 Drill · ${qi + 1} / ${quiz.length}</span>
              <span class="spacer"></span>
            </div>
            <h3>${escapeHtml(p.title)}</h3>
            <div class="tip" style="margin:10px 0"><strong>Fill in:</strong> ${escapeHtml(item.prompt)}</div>
            ${item.hint ? `<p class="muted" style="font-size:13px">💡 ${escapeHtml(item.hint)}</p>` : ""}
            <input type="text" id="ansInput" placeholder="your answer…" style="width:100%;padding:10px;font-size:16px;border-radius:8px;border:1px solid var(--border);background:var(--card-2);color:inherit" autocomplete="off" />
            <div class="row" style="justify-content:flex-end;margin-top:10px">
              <button class="btn" id="checkBtn">Check</button>
            </div>
            <div id="fb"></div>
          </div>
        `;
        const ans = view.querySelector("#ansInput");
        const fb = view.querySelector("#fb");
        const check = () => {
          const got = normalize(ans.value);
          const want = normalize(item.answer);
          const ok = got === want;
          if (ok) {
            correct++;
            fb.innerHTML = `<div class="tip tip-ok">✅ Correct! The full sentence: <em>${escapeHtml(item.prompt.replace("___", item.answer))}</em></div><div class="row" style="justify-content:flex-end;margin-top:8px"><button class="btn" id="nextBtn">${qi === quiz.length - 1 ? "Finish" : "Next →"}</button></div>`;
            view.querySelector("#nextBtn").addEventListener("click", () => {
              qi++;
              if (qi >= quiz.length) drawDone();
              else drawQ();
            });
          } else {
            fb.innerHTML = `<div class="tip tip-bad">❌ Not quite — the answer was <strong>${escapeHtml(item.answer)}</strong>. Full sentence: <em>${escapeHtml(item.prompt.replace("___", item.answer))}</em></div><div class="row" style="justify-content:flex-end;margin-top:8px"><button class="btn" id="nextBtn">${qi === quiz.length - 1 ? "Finish" : "Next →"}</button></div>`;
            view.querySelector("#nextBtn").addEventListener("click", () => {
              qi++;
              if (qi >= quiz.length) drawDone();
              else drawQ();
            });
          }
        };
        view.querySelector("#checkBtn").addEventListener("click", check);
        ans.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); check(); } });
        view.querySelector("#backBtn").addEventListener("click", drawExamples);
        setTimeout(() => ans.focus(), 50);
      }

      function drawDone() {
        const pct = Math.round((correct / quiz.length) * 100);
        const pass = pct >= 67;
        if (pass) markPatternDone(p.id);
        view.innerHTML = `
          <div class="card center">
            <h2>${pass ? "🎉" : "💪"} ${correct} / ${quiz.length} correct</h2>
            <p class="muted">${pass ? "Pattern marked complete (+10 XP)." : "Have another go — repetition makes the pattern stick."}</p>
            <div class="row" style="justify-content:center">
              <button class="btn" id="againBtn">↻ Try drill again</button>
              <button class="btn secondary" id="seeBtn">📖 See examples</button>
              <button class="btn secondary" id="indexBtn">📚 All patterns</button>
            </div>
          </div>
        `;
        view.querySelector("#againBtn").addEventListener("click", drawDrill);
        view.querySelector("#seeBtn").addEventListener("click", drawExamples);
        view.querySelector("#indexBtn").addEventListener("click", () => render(view));
      }

      drawQ();
    }

    drawExamples();
  }

  /* ----- Lesson player ----- */
  function openLesson(view, lessonId) {
    const lesson = window.LESSONS.find((l) => l.id === lessonId);
    if (!lesson) return render(view);
    let i = 0; // step index; quiz starts after the last step
    const totalSteps = lesson.steps.length;

    function drawStep() {
      const step = lesson.steps[i];
      view.innerHTML = `
        <div class="card">
          <div class="row">
            <span class="badge">${lesson.track === "Pronunciation" ? "🗣️" : "🧩"} ${lesson.level}</span>
            <span class="badge">Step ${i + 1} / ${totalSteps}</span>
            <span class="spacer"></span>
            <button class="ghost-btn" id="exitLesson">✕ Lessons</button>
          </div>
          <h2>${escapeHtml(lesson.title)}</h2>
          <div class="lesson-progress"><span style="width:${Math.round(((i + 1) / (totalSteps + 1)) * 100)}%"></span></div>
          <div id="stepBody" style="margin-top:14px"></div>
          <div class="row" style="justify-content:space-between; margin-top:16px">
            <button class="btn secondary" id="prevStep" ${i === 0 ? "disabled" : ""}>← Back</button>
            <button class="btn" id="nextStep">${i === totalSteps - 1 ? (lesson.quiz && lesson.quiz.length ? "Check yourself →" : "Finish") : "Continue →"}</button>
          </div>
        </div>
      `;
      renderStepBody(view.querySelector("#stepBody"), step, lesson);
      view.querySelector("#exitLesson").addEventListener("click", () => render(view));
      view.querySelector("#prevStep").addEventListener("click", () => { if (i > 0) { i--; drawStep(); } });
      view.querySelector("#nextStep").addEventListener("click", () => {
        if (i < totalSteps - 1) { i++; drawStep(); }
        else if (lesson.quiz && lesson.quiz.length) drawQuiz();
        else finish();
      });
    }

    function renderStepBody(el, step, lesson) {
      if (step.type === "text") {
        el.innerHTML = `<p style="font-size:16px; line-height:1.6">${step.html}</p>`;
      } else if (step.type === "rule") {
        el.innerHTML = `<div class="rule-box">${step.html}</div>`;
      } else if (step.type === "examples") {
        el.innerHTML =
          (step.note ? `<p class="muted">${escapeHtml(step.note)}</p>` : "") +
          `<div id="exList"></div>
           ${window.AI.hasKey() ? `<button class="btn secondary" id="moreEx" style="margin-top:8px">✨ More examples</button>` : ""}
           <div id="moreExBox"></div>`;
        const list = el.querySelector("#exList");
        step.items.forEach((it) => list.appendChild(exampleRow(it)));
        const more = el.querySelector("#moreEx");
        if (more) more.addEventListener("click", () => moreExamples(el, lesson, more));
      } else if (step.type === "build") {
        // Word-bank: build the sentence by tapping words in order.
        window.WordBank.mount(el, {
          fr: step.fr, en: step.en, hint: true,
          onResult: (ok) => window.App.recordResult("reading", ok ? 100 : 40),
        });
      } else if (step.type === "say") {
        el.innerHTML = `
          <p class="muted">🎤 Your turn — hear it, then say it.</p>
          <div class="center" style="margin:10px 0">
            <div class="phrase-fr">${escapeHtml(step.fr)}</div>
            <div class="phrase-ipa">/${escapeHtml(step.ipa || "")}/</div>
            <div class="phrase-en">${escapeHtml(step.en || "")}</div>
          </div>
          <div class="row" style="justify-content:center">
            <button class="btn blue" id="sHear">▶︎ Hear</button>
            <button class="btn secondary" id="sSlow">🐢 Slow</button>
            ${window.Speech.recognitionAvailable() ? `<button class="btn" id="sSay">🎤 Say it</button>` : ""}
          </div>
          <div id="sResult"></div>
        `;
        el.querySelector("#sHear").addEventListener("click", () => window.Speech.speak(step.fr));
        el.querySelector("#sSlow").addEventListener("click", () => window.Speech.speak(step.fr, { rate: 0.6 }));
        const say = el.querySelector("#sSay");
        if (say) say.addEventListener("click", () => sayCheck(el, step, say));
        setTimeout(() => window.Speech.speak(step.fr), 250);
      }
    }

    function exampleRow(it) {
      const row = document.createElement("button");
      row.className = "basic-row";
      row.innerHTML = `<div class="br-main"><span class="br-fr">${escapeHtml(it.fr)}</span> <span class="br-ipa">/${escapeHtml(it.ipa || "")}/</span> <span class="play-hint">🔊</span></div><div class="br-en">${escapeHtml(it.en || "")}</div>`;
      row.addEventListener("click", () => window.Speech.speak(it.fr));
      return row;
    }

    async function moreExamples(el, lesson, btn) {
      const box = el.querySelector("#moreExBox");
      btn.disabled = true;
      box.innerHTML = `<div class="spinner"></div>`;
      try {
        const out = await window.AI.call({
          system:
            "You are a French teacher. Give 3 extra example sentences illustrating the lesson concept, at the given CEFR level. Output ONLY JSON: {\"items\":[{\"fr\":\"\",\"ipa\":\"\",\"en\":\"\"}]}. 'ipa' is a simple phonetic hint, 'en' the English translation.",
          messages: [{ role: "user", content: `Lesson: "${lesson.title}" — ${lesson.goal}. Level ${lesson.level}. Give 3 fresh examples.` }],
          maxTokens: 700,
          jsonSchema: {
            type: "object", additionalProperties: false,
            properties: { items: { type: "array", items: { type: "object", additionalProperties: false, properties: { fr: { type: "string" }, ipa: { type: "string" }, en: { type: "string" } }, required: ["fr", "ipa", "en"] } } },
            required: ["items"],
          },
        });
        const parsed = window.AI.parseJSON(out);
        box.innerHTML = "";
        if (parsed && parsed.items) parsed.items.forEach((it) => box.appendChild(exampleRow(it)));
        else box.innerHTML = `<div class="tip">Couldn't generate more right now.</div>`;
      } catch (e) {
        box.innerHTML = `<div class="tip">${window.AI.describeError(e)}</div>`;
      } finally {
        btn.disabled = false;
      }
    }

    async function sayCheck(el, step, btn) {
      const res = el.querySelector("#sResult");
      btn.classList.add("recording");
      btn.textContent = window.Speech.geminiActive() ? "● Recording… (tap to stop)" : "● Listening…";
      res.innerHTML = "";
      const stopHandler = () => window.Speech.stopCapture();
      if (window.Speech.geminiActive()) btn.addEventListener("click", stopHandler);
      try {
        // Gemini grades the audio when its key is set; else Web Speech + local/Claude score.
        const r = await window.Speech.captureAndGrade(step.fr, window.App.getState().level, (st) => {
          if (st === "processing") btn.textContent = "… scoring";
        });
        const cls = r.score >= 80 ? "good" : r.score >= 55 ? "mid" : "low";
        const words = r.words.map((w) => `<span class="word ${w.ok ? "ok" : "miss"}">${w.word}</span>`).join(" ");
        res.innerHTML = `<div class="score-ring ${cls}">${r.score}%</div><div class="center">${words}</div>` +
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

    /* ----- End-of-lesson quiz ----- */
    function drawQuiz() {
      let qi = 0, correct = 0;
      const quiz = lesson.quiz;

      function drawQ() {
        const item = quiz[qi];
        view.innerHTML = `
          <div class="card">
            <div class="row"><span class="badge">✅ Check</span><span class="badge">${qi + 1} / ${quiz.length}</span><span class="spacer"></span><button class="ghost-btn" id="exitQuiz">✕</button></div>
            <h2>${escapeHtml(lesson.title)}</h2>
            <h3 style="margin-top:10px">${escapeHtml(item.q)}</h3>
            <div id="qOpts"></div>
            <div id="qAfter"></div>
          </div>`;
        view.querySelector("#exitQuiz").addEventListener("click", () => render(view));
        const opts = view.querySelector("#qOpts");
        item.options.forEach((opt, oi) => {
          const b = document.createElement("button");
          b.className = "mcq-option";
          b.textContent = opt;
          b.addEventListener("click", () => choose(oi, b));
          opts.appendChild(b);
        });
        function choose(oi, btn) {
          const all = opts.querySelectorAll(".mcq-option");
          all.forEach((e) => { e.classList.add("disabled"); e.onclick = null; });
          if (oi === item.answer) { btn.classList.add("correct"); correct++; }
          else { btn.classList.add("wrong"); all[item.answer].classList.add("correct"); }
          const after = view.querySelector("#qAfter");
          after.innerHTML = `
            ${item.explain ? `<div class="tip">${escapeHtml(item.explain)}</div>` : ""}
            <div class="row" style="justify-content:flex-end; margin-top:12px"><button class="btn" id="qNext">${qi === quiz.length - 1 ? "Finish lesson" : "Next →"}</button></div>`;
          after.querySelector("#qNext").addEventListener("click", () => {
            if (qi === quiz.length - 1) finishWithScore(Math.round((correct / quiz.length) * 100));
            else { qi++; drawQ(); }
          });
        }
      }
      drawQ();
    }

    function finishWithScore(pct) {
      done()[lesson.id] = true;
      window.App.recordResult(lesson.track === "Pronunciation" ? "pronunciation" : "reading", pct);
      window.App.save();
      view.innerHTML = `
        <div class="card center">
          <h2>${pct >= 70 ? "🎉" : "👍"} Lesson complete</h2>
          <div class="score-ring ${pct >= 70 ? "good" : pct >= 50 ? "mid" : "low"}">${pct}%</div>
          <p class="muted">"${escapeHtml(lesson.title)}" marked complete.</p>
          <div class="row" style="justify-content:center">
            <button class="btn" id="nextLesson">Next lesson →</button>
            <button class="btn secondary" id="backList">All lessons</button>
          </div>
        </div>`;
      view.querySelector("#nextLesson").addEventListener("click", () => {
        const nxt = nextLessonAfter(lesson);
        if (nxt) openLesson(view, nxt.id);
        else render(view);
      });
      view.querySelector("#backList").addEventListener("click", () => render(view));
    }

    function finish() { finishWithScore(100); }

    drawStep();
  }

  function nextLessonAfter(lesson) {
    const sameLevel = window.LESSONS.filter((l) => l.level === lesson.level);
    const idx = sameLevel.findIndex((l) => l.id === lesson.id);
    return idx >= 0 && idx < sameLevel.length - 1 ? sameLevel[idx + 1] : null;
  }

  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

  return { render, openLesson };
})();
