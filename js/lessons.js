/* ===== Lessons (school-style, taught) =====
 * Browse lessons for your level (two tracks: Pronunciation, Sentences), then walk
 * through a lesson step-by-step: explanation → playable examples → "your turn" →
 * end-of-lesson quiz. Completion is tracked in App state (state.lessonsDone).
 * Fully offline; an "✨ More examples" button uses Claude if a key is set.
 */
window.Lessons = (function () {
  function done() {
    const s = window.App.getState();
    if (!s.lessonsDone) s.lessonsDone = {};
    return s.lessonsDone;
  }

  /* ----- Full course index: every level A1→C1, jump into ANY lesson ----- */
  function render(view) {
    const s = window.App.getState();
    const curLevel = s.level;
    const completed = done();
    const levels = window.CURRICULUM.levels;

    function lessonRow(l) {
      const isDone = completed[l.id];
      const icon = l.track === "Pronunciation" ? "🗣️" : l.track === "Exam" ? "📝" : "🧩";
      return `
        <button class="basic-row lesson-row" data-lesson="${l.id}">
          <div class="br-main">
            <span class="br-fr">${isDone ? "✅" : icon} ${escapeHtml(l.title)}</span>
          </div>
          <div class="br-en">${escapeHtml(l.goal)}</div>
        </button>`;
    }

    function levelSection(lvl) {
      const byTrack = window.LESSONS_BY_LEVEL[lvl] || { Exam: [], Pronunciation: [], Sentences: [] };
      const all = [...(byTrack.Exam || []), ...(byTrack.Pronunciation || []), ...(byTrack.Sentences || [])];
      const total = all.length;
      const doneCount = all.filter((l) => completed[l.id]).length;
      const isCurrent = lvl === curLevel;
      const grammar = (window.CURRICULUM.grammar[lvl] || []).join(" · ");
      const phon = (window.CURRICULUM.phonetics[lvl] || []).join(" · ");
      const open = isCurrent ? "open" : "";
      const pct = total ? Math.round((doneCount / total) * 100) : 0;
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
            <div class="lvl-meta">
              <p><strong>🎯 You'll be able to:</strong> ${escapeHtml(window.CURRICULUM.canDo[lvl] || "")}</p>
              ${grammar ? `<p><strong>🧩 Grammar:</strong> <span class="muted">${escapeHtml(grammar)}</span></p>` : ""}
              ${phon ? `<p><strong>🗣️ Pronunciation:</strong> <span class="muted">${escapeHtml(phon)}</span></p>` : ""}
            </div>
            ${total ? `<div class="lesson-progress" style="margin:6px 0 10px"><span style="width:${pct}%"></span></div>` : ""}
            ${byTrack.Exam && byTrack.Exam.length ? `<h4 class="track-h">📝 TCF exam guide & strategy</h4>${byTrack.Exam.map(lessonRow).join("")}` : ""}
            ${byTrack.Sentences && byTrack.Sentences.length ? `<h4 class="track-h">🧩 Sentences & grammar</h4>${byTrack.Sentences.map(lessonRow).join("")}` : ""}
            ${byTrack.Pronunciation && byTrack.Pronunciation.length ? `<h4 class="track-h">🗣️ Pronunciation</h4>${byTrack.Pronunciation.map(lessonRow).join("")}` : ""}
            ${!total ? `<p class="muted">Taught lessons for ${lvl} are coming soon. Use 🔤 Basics, 🗣️ Speak, or 💬 Talk for this level.</p>` : ""}
            <div class="row" style="margin-top:8px">
              ${!isCurrent ? `<button class="btn secondary" data-setlevel="${lvl}" style="font-size:13px;padding:7px 12px">Make this my level</button>` : ""}
            </div>
          </div>
        </details>`;
    }

    const totalLessons = window.LESSONS.length;
    const totalDone = window.LESSONS.filter((l) => completed[l.id]).length;

    view.innerHTML = `
      <div class="card">
        <div class="row"><span class="badge">📚 Course index</span><span class="badge">A1 → C1</span></div>
        <h2>Leçons — full syllabus</h2>
        <p class="muted">Everything you'll learn, level by level. Tap any lesson to jump straight in — you don't have to be on that level. ${totalDone}/${totalLessons} lessons done.</p>
      </div>
      ${levels.map(levelSection).join("")}
    `;

    view.querySelectorAll("[data-lesson]").forEach((b) =>
      b.addEventListener("click", () => openLesson(view, b.dataset.lesson))
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
