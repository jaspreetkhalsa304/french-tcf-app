/* ===== Conversation tutor =====
 * Chat with an AI French tutor at your level. Each AI reply is spoken aloud (TTS),
 * so you hear pronunciation. You reply by typing OR speaking (STT).
 * The tutor gently corrects mistakes and includes a short English coaching line.
 * Also offers the 3 TCF speaking tasks as guided prompts.
 */
window.Conversation = (function () {
  let messages = []; // {role, content} for the API
  let started = false;
  let lectureMode = false; // when true, AI replies are spoken bilingually & slowly
  let lectureLevel = null; // level being taught (may differ from current level via index)
  let lectureLesson = null; // the SPECIFIC syllabus lesson currently being taught (object)
  let scenarioMode = false; // when true, AI role-plays a scenario partner
  let activeScenario = null; // the scenario object being role-played

  /* ===== Syllabus: the AI tutor teaches the REAL lessons, in order =====
   * The Talk-tab lectures used to improvise from a loose topic list, so they
   * jumped around. Now they walk window.LESSONS in the SAME order the 📚 Lessons
   * tab shows them (Exam → Sentences → Pronunciation, within each level), teaching
   * one lesson at a time and tracking where the learner is. Completion is shared
   * with the Lessons tab via state.lessonsDone, so progress is one thing, not two. */

  // All lessons for a level, in canonical course order.
  function syllabusFor(level) {
    const by = (window.LESSONS_BY_LEVEL && window.LESSONS_BY_LEVEL[level]) || {};
    return [...(by.Exam || []), ...(by.Sentences || []), ...(by.Pronunciation || [])];
  }

  // Where is the learner in this level's syllabus? Returns the index of the first
  // not-yet-done lesson (so the tutor resumes where they left off), or 0.
  function syllabusPos(level) {
    const s = window.App.getState();
    const done = s.lessonsDone || {};
    const list = syllabusFor(level);
    // Honour an explicit saved position if the learner navigated manually.
    const saved = (s.syllabusPos || {})[level];
    if (typeof saved === "number" && saved >= 0 && saved < list.length) return saved;
    const firstUndone = list.findIndex((l) => !done[l.id]);
    return firstUndone === -1 ? 0 : firstUndone;
  }
  function setSyllabusPos(level, idx) {
    const s = window.App.getState();
    if (!s.syllabusPos) s.syllabusPos = {};
    s.syllabusPos[level] = idx;
    window.App.save();
  }

  // Turn a lesson's steps into a compact plain-text brief the AI teaches FROM,
  // so it covers the actual taught content (not something it makes up).
  function lessonBrief(lesson) {
    const parts = [];
    for (const st of lesson.steps || []) {
      if (st.type === "text" || st.type === "rule") {
        parts.push("• " + stripHtml(st.html));
      } else if (st.type === "examples") {
        const ex = (st.items || []).map((it) => `« ${it.fr} » (${it.en})`).join("; ");
        parts.push("• Examples: " + ex);
      } else if (st.type === "say" || st.type === "build") {
        if (st.fr) parts.push(`• Practice phrase: « ${st.fr} »${st.en ? " (" + st.en + ")" : ""}`);
      }
    }
    return parts.join("\n");
  }
  function stripHtml(h) {
    return String(h || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  }

  // How much English to use, by level. Beginners get heavy English support.
  function frenchRatio(lvl) {
    return { A1: "mostly English", A2: "about half English, half French",
             B1: "mostly French with English help when needed",
             B2: "almost entirely French", C1: "entirely French" }[lvl] || "balanced";
  }

  function systemPrompt() {
    const s = window.App.getState();
    const lvl = s.level;
    const canDo = window.CURRICULUM.canDo[lvl];
    const grammar = (window.CURRICULUM.grammar[lvl] || []).join(", ");
    return (
      `You are Camille, a warm, patient French tutor preparing a student for the TCF exam. ` +
      `The student is an ENGLISH speaker, CEFR level ${lvl} (can: ${canDo}). Target grammar at this level: ${grammar}.\n\n` +
      `LANGUAGE BALANCE — this is important: the student may not understand much French yet. ` +
      `At this level, speak ${frenchRatio(lvl)}. Explain meaning, grammar and corrections in clear ENGLISH so the student actually understands, ` +
      `but always TEACH real French. As the level rises, use progressively more French and less English.\n\n` +
      `FORMAT RULES (the app reads the French aloud, so this matters):\n` +
      `1. Put every French word or phrase you want spoken inside « guillemets ». Example: « Bonjour, comment ça va ? » (Hello, how are you?). ` +
      `Always give the English meaning right after, in parentheses or on the next line.\n` +
      `2. Keep replies SHORT and conversational (a few sentences). End with a question or prompt to keep the student practicing — you may ask it in French « ... » with the English in parentheses.\n` +
      `3. If the student writes French with a notable mistake, add ONE line at the very end starting with "🔧 " correcting it in English (quote the wrong bit and the fix).\n` +
      `4. Be encouraging. Never overwhelm a beginner — introduce one or two new things at a time.`
    );
  }

  // Persona for LECTURES: an INTERACTIVE class that teaches ONE SPECIFIC syllabus
  // lesson (lectureLesson), staying strictly on that lesson's content and order.
  function lectureSystemPrompt() {
    const s = window.App.getState();
    const lvl = lectureLevel || s.level;
    const canDo = window.CURRICULUM.canDo[lvl];
    const L = lectureLesson;
    const lessonBlock = L
      ? `\n\n===== THE LESSON YOU ARE TEACHING RIGHT NOW =====\n` +
        `Title: "${L.title}"\nGoal: ${L.goal}\nTrack: ${L.track} (level ${L.level}).\n` +
        `Here is the EXACT material to teach, as a numbered list of points. Cover EVERY point, IN THIS ORDER, one per turn:\n${lessonBrief(L)}\n\n` +
        `FIDELITY RULES (important):\n` +
        `• You MUST actually STATE each rule and its examples — quote the rule and the « example » phrases from the point you're on. Do NOT just gesture at the topic ("let's learn être") and move on; explain WHAT the rule is and WHY, using the wording above.\n` +
        `• ${L.track === "Pronunciation"
              ? "This is a PRONUNCIATION lesson — for each rule, tell the student exactly HOW it sounds (e.g. the silent letter that links, the 'z' sound in liaison, the rounded 'u'), give the « example », and have them say it back. Don't reduce it to grammar."
              : "Teach the rule precisely (forms, agreement, word order) with the « examples » given, then have the student produce one."}\n` +
        `• Do NOT wander onto other topics or other lessons. When (and only when) you have covered ALL the points above and the student has practised them, end your final message with the marker "✅ LESSON COMPLETE" on its own line, then a one-sentence recap.\n` +
        `=================================================`
      : "";
    return (
      `You are Camille, a warm French teacher giving a LIVE ONE-ON-ONE class to an ENGLISH-speaking student at CEFR level ${lvl} (can: ${canDo}).\n\n` +
      `You are teaching a FIXED SYLLABUS, one lesson at a time, in order. You teach ONLY the specific lesson given below — never skip ahead, never improvise a different topic, never start "random" material. Stay on THIS lesson until it is done.\n\n` +
      `THIS IS A CONVERSATION, NOT A LECTURE. The single most important rule: you speak only a LITTLE, then STOP and hand the turn back to the student. A real tutor never talks for more than ~20 seconds before letting the student respond.\n\n` +
      `EVERY message you send MUST:\n` +
      `1. Teach just ONE tiny piece of THIS lesson (a single phrase, word, or mini-rule) — never the whole lesson at once.\n` +
      `2. Be SHORT: at most ~3–4 sentences of English plus 1–2 French examples in « guillemets » (with English meaning right after).\n` +
      `3. END with a DIRECT request to the student that they must act on before you continue. Make it one of these and label it clearly on its own last line:\n` +
      `   • "🔁 Repeat:" → ask them to say a French phrase out loud (give the phrase in « »).\n` +
      `   • "❓ Try:" → ask them a simple question to answer in French (or English if A1).\n` +
      `   • "🌍 Translate:" → give an English phrase and ask how they'd say it in French.\n` +
      `   Pick whichever fits; vary them so it stays lively.\n\n` +
      `WHEN THE STUDENT RESPONDS:\n` +
      `• React to what THEY actually said first — praise what's right, gently fix what's wrong (quote it, give the fix in English).\n` +
      `• If they got it, teach the NEXT tiny piece OF THIS LESSON and again end with a request. If they struggled, re-explain that same thing a different way and ask again — don't move on.\n` +
      `• Keep it feeling like a back-and-forth chat with a friendly teacher, not a script being read.\n\n` +
      `OTHER RULES:\n` +
      `• Speak mostly ENGLISH at ${lvl} (more French as level rises). EVERY French word goes inside « guillemets » with its English meaning — the app reads the « French » aloud.\n` +
      `• Formatting: you MAY use **bold** for key terms and *italics* for translations — the app renders them. Use real line breaks between ideas. Never write a stray asterisk on its own.\n` +
      `• If the student writes French with a mistake, add ONE line at the very end starting with "🔧 " quoting the error and the fix in English.\n` +
      `• Be encouraging and patient. Build on what came before.` +
      lessonBlock
    );
  }

  function render(view) {
    started = false;
    messages = [];
    lectureMode = false;
    lectureLevel = null;
    lectureLesson = null;
    scenarioMode = false;
    activeScenario = null;
    const s = window.App.getState();
    const keyOn = window.AI.hasKey();
    const tasks = window.TCF.speakingTasks.filter((t) => allowed(t.minLevel, s.level));

    view.innerHTML = `
      <div class="card">
        <div class="row">
          <span class="badge">💬 Talk · ${s.level}</span>
          <span class="badge">tutor: Camille</span>
        </div>
        ${
          keyOn
            ? `<p class="muted">I explain in <strong>English</strong> and teach you French (spoken aloud). Type or tap 🎤 to answer in either language. I correct your French gently.</p>`
            : `<div class="tip">Add your Anthropic API key in Settings (⚙️) to chat with the AI tutor and get full lectures. Below: practice TCF speaking prompts with audio.</div>`
        }
        ${
          keyOn
            ? (function () {
                const list = syllabusFor(s.level);
                const pos = syllabusPos(s.level);
                const next = list[pos];
                const label = next
                  ? `Continue lesson ${pos + 1}/${list.length}: ${escapeHtml(next.title)} →`
                  : `Teach me level ${s.level} →`;
                return `<div class="row" style="margin-bottom:6px;flex-wrap:wrap">
                 <strong style="font-size:13px;width:100%;margin-bottom:2px">👩‍🏫 Guided course (taught in order):</strong>
                 <button class="btn blue" id="lectureBtn" style="padding:8px 12px;font-size:13px">${label}</button>
                 <button class="btn secondary" id="indexBtn" style="padding:8px 12px;font-size:13px">📑 Syllabus</button>
               </div>
               <div id="tutorIndex" class="tutor-index hidden"></div>`;
              })()
            : ""
        }
        <div class="row">
          <strong style="font-size:13px">TCF speaking tasks:</strong>
          ${tasks.map((t) => `<button class="btn secondary" data-task="${t.id}" style="padding:8px 10px;font-size:13px">${t.title.split("—")[0].trim()}</button>`).join("")}
        </div>
        ${
          keyOn && scenariosForLevel(s.level).length
            ? `<div class="row" style="margin-top:8px;flex-wrap:wrap">
                 <strong style="font-size:13px;width:100%;margin-bottom:2px">🎭 Conversation scenarios (${s.level}) — role-play with me:</strong>
                 ${scenariosForLevel(s.level).map((sc) => `<button class="btn secondary" data-scenario="${sc.id}" style="padding:8px 10px;font-size:13px">${sc.icon} ${escapeHtml(sc.title)}</button>`).join("")}
               </div>`
            : ""
        }
      </div>

      <div class="card">
        <div class="chat-window" id="chat"></div>
        <div class="chat-input-row">
          <textarea id="chatInput" placeholder="${keyOn ? "Type in English or French…" : "Add an API key to chat"}" ${keyOn ? "" : "disabled"}></textarea>
          <button class="icon-btn" id="micBtn" title="Speak" ${window.Speech.sttSupported && keyOn ? "" : "disabled"}>🎤</button>
          <button class="btn" id="sendBtn" ${keyOn ? "" : "disabled"}>Send</button>
        </div>
      </div>
    `;

    const chat = view.querySelector("#chat");
    const input = view.querySelector("#chatInput");

    view.querySelectorAll("[data-task]").forEach((b) =>
      b.addEventListener("click", () => startTask(view, b.dataset.task))
    );
    view.querySelectorAll("[data-scenario]").forEach((b) =>
      b.addEventListener("click", () => startScenario(view, b.dataset.scenario))
    );

    if (keyOn) {
      const greet = `Hello! I'm Camille, your French tutor. 👋 I'll explain in English and teach you French step by step. Let's start: « Bonjour ! Comment t'appelles-tu ? » (Hello! What's your name?) — you can answer in French or English.`;
      addBubble(chat, "ai", greet);
      window.Speech.speak("Bonjour ! Comment t'appelles-tu ?");

      view.querySelector("#sendBtn").addEventListener("click", () => send(view));
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(view); }
      });
      const mic = view.querySelector("#micBtn");
      if (window.Speech.sttSupported) mic.addEventListener("click", () => micInput(view, mic));
      const lec = view.querySelector("#lectureBtn");
      if (lec) lec.addEventListener("click", () => resumeSyllabus(view));
      const idxBtn = view.querySelector("#indexBtn");
      if (idxBtn) idxBtn.addEventListener("click", () => toggleIndex(view));
    }
  }

  /* ----- Course index inside the AI tutor: expandable levels + per-topic jump ----- */
  function toggleIndex(view) {
    const box = view.querySelector("#tutorIndex");
    if (!box) return;
    if (!box.classList.contains("hidden")) { box.classList.add("hidden"); return; }
    if (!box.dataset.built) { buildIndex(view, box); box.dataset.built = "1"; }
    box.classList.remove("hidden");
  }

  function buildIndex(view, box) {
    const s = window.App.getState();
    const C = window.CURRICULUM;
    const done = s.lessonsDone || {};
    const trackIcon = (t) => t === "Pronunciation" ? "🗣️" : t === "Exam" ? "📝" : "🧩";
    box.innerHTML = C.levels.map((lvl) => {
      const here = lvl === s.level;
      const list = syllabusFor(lvl);
      const pos = syllabusPos(lvl);
      const doneCount = list.filter((l) => done[l.id]).length;
      const rows = list.map((l, i) => {
        const isDone = done[l.id];
        const isNext = here && i === pos;
        const mark = isDone ? "✅" : trackIcon(l.track);
        return `
          <button class="basic-row" data-teachlesson="${l.id}" data-lessonlevel="${lvl}">
            <div class="br-main">
              <span class="br-fr">${mark} ${i + 1}. ${escapeHtml(l.title)}</span>
              ${isNext ? `<span class="badge" style="margin-left:6px">next ▶</span>` : ""}
            </div>
            <div class="br-en">${escapeHtml(l.goal)}</div>
          </button>`;
      }).join("");
      return `
        <details class="level-block" ${here ? "open" : ""}>
          <summary>
            <span class="lvl-tag">${lvl}</span>
            <span class="lvl-name">${escapeHtml(C.levelNames[lvl])}</span>
            ${here ? `<span class="badge" style="margin-left:6px">you are here</span>` : ""}
            <span class="spacer"></span>
            <span class="lvl-count">${list.length ? `${doneCount}/${list.length} done` : "soon"}</span>
          </summary>
          <div class="level-body">
            <p class="muted" style="margin:2px 0 8px">${escapeHtml(C.canDo[lvl] || "")}</p>
            ${list.length
              ? `<button class="btn blue" data-startlevel="${lvl}" style="font-size:13px;padding:7px 12px;margin-bottom:8px">👩‍🏫 Start ${lvl} from lesson 1 →</button>
                 <div class="muted" style="font-size:12px;margin:6px 0 4px">Lessons are taught <strong>in this order</strong> — tap any one to teach it now:</div>
                 ${rows}`
              : `<p class="muted">Guided lessons for ${lvl} are coming soon.</p>`}
          </div>
        </details>`;
    }).join("");

    // Start a level from its first lesson.
    box.querySelectorAll("[data-startlevel]").forEach((b) =>
      b.addEventListener("click", () => {
        setSyllabusPos(b.dataset.startlevel, 0);
        teachLessonByIndex(view, b.dataset.startlevel, 0);
      })
    );
    // Jump straight into a specific lesson (and set the position there).
    box.querySelectorAll("[data-teachlesson]").forEach((b) =>
      b.addEventListener("click", () => {
        const lvl = b.dataset.lessonlevel;
        const idx = syllabusFor(lvl).findIndex((l) => l.id === b.dataset.teachlesson);
        if (idx < 0) return;
        setSyllabusPos(lvl, idx);
        teachLessonByIndex(view, lvl, idx);
      })
    );
  }

  // Resume the guided course: teach the learner's CURRENT lesson in this level's
  // syllabus (the first not-yet-done one, or wherever they navigated to).
  function resumeSyllabus(view) {
    const lvl = window.App.getState().level;
    const list = syllabusFor(lvl);
    if (!list.length) { window.App.toast("No guided lessons for this level yet."); return; }
    let pos = syllabusPos(lvl);
    if (pos >= list.length) pos = list.length - 1; // all done → revisit the last
    teachLessonByIndex(view, lvl, pos);
  }

  // Teach ONE specific syllabus lesson interactively. The AI is anchored to that
  // lesson's real content (lessonBrief) and told not to wander. When it emits
  // "✅ LESSON COMPLETE", we mark it done and offer the next lesson in order.
  async function teachLessonByIndex(view, lvl, idx) {
    const list = syllabusFor(lvl);
    const lesson = list[idx];
    if (!lesson) return;
    lectureLevel = lvl;
    lectureLesson = lesson;
    lectureMode = true; // reply spoken slowly + bilingually
    setSyllabusPos(lvl, idx);

    // Collapse the syllabus panel if open, so the chat is in view.
    const box = view.querySelector("#tutorIndex");
    if (box) box.classList.add("hidden");
    const chat = view.querySelector("#chat");
    chat.innerHTML = "";

    addBubble(chat, "ai",
      `👩‍🏫 Lesson ${idx + 1} of ${list.length} · ${lvl}\n\n` +
      `“${lesson.title}” — ${lesson.goal}\n\n` +
      `I'll teach this step by step; answer me each time — type or tap 🎤. One moment…`);

    messages = [{
      role: "user",
      content:
        `Begin teaching me the lesson "${lesson.title}" (its goal: ${lesson.goal}). ` +
        `Give a one-line warm welcome that NAMES this lesson, then teach just the FIRST tiny piece of it ` +
        `(one point + an example in « guillemets »), then immediately STOP and ask me to repeat, answer, or translate. ` +
        `Stay on THIS lesson only; we'll go back and forth until it's complete.`,
    }];
    await replyFromAI(view, chat);
    showLectureBar(view);
  }

  // Move to the next lesson in the syllabus (called after "✅ LESSON COMPLETE"
  // or when the learner taps "Next lesson").
  function advanceSyllabus(view) {
    const lvl = lectureLevel || window.App.getState().level;
    const list = syllabusFor(lvl);
    const curIdx = lectureLesson ? list.findIndex((l) => l.id === lectureLesson.id) : syllabusPos(lvl);
    const nextIdx = curIdx + 1;
    if (nextIdx >= list.length) {
      // Finished this level's syllabus.
      const chat = view.querySelector("#chat");
      addBubble(chat, "ai", `🎓 That's the whole ${lvl} syllabus done — great work! Switch to a higher level in 📚 Lessons, or tap 📑 Syllabus to revisit anything.`);
      const bar = view.querySelector("#lectureBar"); if (bar) bar.remove();
      return;
    }
    setSyllabusPos(lvl, nextIdx);
    teachLessonByIndex(view, lvl, nextIdx);
  }

  // Mark the current lecture lesson complete (shared with the 📚 Lessons tab).
  function markLessonDone() {
    if (!lectureLesson) return;
    const s = window.App.getState();
    if (!s.lessonsDone) s.lessonsDone = {};
    if (!s.lessonsDone[lectureLesson.id]) {
      s.lessonsDone[lectureLesson.id] = true;
      window.App.recordResult(lectureLesson.track === "Pronunciation" ? "pronunciation" : "reading", 80);
      window.App.save();
    }
  }

  // Interactive helper bar shown during a lecture. The class is now a back-and-forth,
  // so the bar nudges the student to RESPOND (the input/mic are how you answer),
  // and offers low-effort shortcuts: a "Got it" reply, a "Didn't get it" reply,
  // and a "Skip ahead" escape hatch. It does NOT just auto-advance the monologue.
  function showLectureBar(view) {
    const chat = view.querySelector("#chat");
    let bar = view.querySelector("#lectureBar");
    if (bar) bar.remove(); // rebuild so the lesson label stays current
    const lvl = lectureLevel || window.App.getState().level;
    const list = syllabusFor(lvl);
    const idx = lectureLesson ? list.findIndex((l) => l.id === lectureLesson.id) : -1;
    const here = idx >= 0 ? `Lesson ${idx + 1}/${list.length} · ${escapeHtml(lectureLesson.title)}` : "Guided lesson";
    bar = document.createElement("div");
    bar.id = "lectureBar";
    bar.className = "row";
    bar.style.cssText = "justify-content:center;flex-wrap:wrap;margin-top:8px;gap:6px";
    bar.innerHTML = `
      <span class="muted" style="font-size:12px;width:100%;text-align:center">
        📘 ${here} — answer the teacher above (type or tap 🎤). Quick replies:</span>
      <button class="btn secondary" data-quick="✅ Got it!" style="padding:6px 10px;font-size:13px">✅ Got it</button>
      <button class="btn secondary" data-quick="I didn't understand — can you explain that differently?" style="padding:6px 10px;font-size:13px">🤔 Explain again</button>
      <button class="btn secondary" data-quick="Can you give me another example?" style="padding:6px 10px;font-size:13px">➕ Another example</button>
      <button class="btn secondary" data-quick="Let's move on to the next part of this lesson." style="padding:6px 10px;font-size:13px">⏭️ Next part</button>
      ${idx >= 0 && idx < list.length - 1 ? `<button class="btn" id="nextLessonBtn" style="padding:6px 10px;font-size:13px">📗 Next lesson →</button>` : ""}`;
    chat.parentElement.insertBefore(bar, chat.nextSibling);
    bar.querySelectorAll("[data-quick]").forEach((b) =>
      b.addEventListener("click", async () => {
        addBubble(chat, "user", b.dataset.quick);
        messages.push({ role: "user", content: b.dataset.quick });
        await replyFromAI(view, chat);
      })
    );
    const nlb = bar.querySelector("#nextLessonBtn");
    if (nlb) nlb.addEventListener("click", () => { markLessonDone(); advanceSyllabus(view); });
  }

  // Shown when the AI signals the lesson is complete: a clear next-step prompt.
  function showLessonCompleteBanner(view, afterBubble) {
    const lvl = lectureLevel || window.App.getState().level;
    const list = syllabusFor(lvl);
    const idx = lectureLesson ? list.findIndex((l) => l.id === lectureLesson.id) : -1;
    const hasNext = idx >= 0 && idx < list.length - 1;
    const banner = document.createElement("div");
    banner.className = "tip tip-ok";
    banner.style.marginTop = "10px";
    banner.innerHTML = `✅ <strong>Lesson complete!</strong> Marked done in your course.${
      hasNext
        ? ` Next up — lesson ${idx + 2}/${list.length}: <strong>${escapeHtml(list[idx + 1].title)}</strong>.`
        : ` That's the last ${lvl} lesson.`
    }<div class="row" style="justify-content:center;margin-top:8px;gap:6px">
        ${hasNext ? `<button class="btn" id="bannerNext" style="padding:6px 12px;font-size:13px">📗 Start next lesson →</button>` : ""}
        <button class="btn secondary" id="bannerReview" style="padding:6px 12px;font-size:13px">↻ Review this one</button>
      </div>`;
    afterBubble.appendChild(banner);
    const bn = banner.querySelector("#bannerNext");
    if (bn) bn.addEventListener("click", () => advanceSyllabus(view));
    const br = banner.querySelector("#bannerReview");
    if (br) br.addEventListener("click", () => teachLessonByIndex(view, lvl, idx));
    // Refresh the lecture bar so its label/Next-lesson button stay in sync.
    showLectureBar(view);
  }

  /* ----- Conversation scenarios (role-play) ----- */
  function scenariosForLevel(level) {
    const L = window.CURRICULUM.levels;
    const all = (window.TCF && window.TCF.scenarios) || [];
    // Scenarios at the current level, plus any from one level below (still useful).
    const i = L.indexOf(level);
    return all.filter((sc) => {
      const j = L.indexOf(sc.level);
      return j === i || j === i - 1;
    });
  }

  function scenarioSystemPrompt(sc) {
    const lvl = window.App.getState().level;
    return (
      `You are role-playing a real-life French conversation to help an ENGLISH-speaking student (CEFR ${lvl}) practise speaking. ` +
      `YOU PLAY: ${sc.role}. SETTING: ${sc.setting} The student's goal: ${sc.goal}\n\n` +
      `HOW TO PLAY:\n` +
      `• Stay IN CHARACTER as ${sc.role}. Speak natural French appropriate to ${lvl} — short and simple at A1/A2, richer at B1+.\n` +
      `• Keep YOUR turns short (1–3 sentences) so the student does most of the talking. Always end your turn so they can respond.\n` +
      `• After your French, add the English meaning in parentheses — at A1/A2 for everything, at B1 only for hard bits, at B2/C1 rarely. Put spoken French in « guillemets » so the app reads it aloud.\n` +
      `• React naturally to what they say. If they're stuck or silent, gently prompt them with a simpler question.\n` +
      `• If they make a notable French mistake, DON'T break character mid-flow; instead add ONE line at the very end starting with "🔧 " with the fix in English.\n` +
      `• When the goal is achieved (or after ~8 exchanges), wrap up in character, then add a final line starting with "🎯 " giving brief English feedback (what went well + 1 thing to improve).`
    );
  }

  async function startScenario(view, scenarioId) {
    const sc = (window.TCF.scenarios || []).find((x) => x.id === scenarioId);
    if (!sc) return;
    scenarioMode = true;
    activeScenario = sc;
    lectureMode = false;
    const chat = view.querySelector("#chat");
    chat.innerHTML = "";
    // Remove any lingering lecture bar.
    const bar = view.querySelector("#lectureBar");
    if (bar) bar.remove();
    addBubble(chat, "ai", `🎭 Scenario: ${sc.icon} ${sc.title}\n\nYou: yourself. Me: ${sc.role}.\nGoal: ${sc.en}\n\nType or tap 🎤 to respond. I'll start…`);
    messages = [{
      role: "user",
      content: `Let's begin the role-play. Start the scene in character as ${sc.role}: greet me / open the situation with a short first line, then wait for my response.`,
    }];
    await replyFromAI(view, chat);
  }

  function scenarioActive() { return scenarioMode; }

  function allowed(min, cur) {
    const L = window.CURRICULUM.levels;
    return L.indexOf(cur) >= L.indexOf(min);
  }

  function startTask(view, taskId) {
    const task = window.TCF.speakingTasks.find((t) => t.id === taskId);
    if (!task) return;
    const chat = view.querySelector("#chat");
    chat.innerHTML = "";
    const intro = `${task.title} — ${task.sub}\n\n${task.instruction}`;
    addBubble(chat, "ai", intro);
    addNote(chat, task.en);
    window.Speech.speak(task.instruction);
    if (window.AI.hasKey()) {
      // Seed the tutor with the task context so it role-plays / evaluates.
      messages = [{
        role: "user",
        content: `We are doing TCF speaking task "${task.title}". The instruction is: ${task.instruction}. ` +
          `Play the examiner. Ask me to begin, then respond naturally and, when I answer, evaluate my spoken French briefly (in your usual format with a 🔧 correction line if needed).`,
      }];
      replyFromAI(view, chat);
    }
  }

  async function send(view) {
    const input = view.querySelector("#chatInput");
    const text = input.value.trim();
    if (!text) return;
    const hr = view.querySelector("#heardReview"); if (hr) hr.remove();
    const chat = view.querySelector("#chat");
    addBubble(chat, "user", text);
    input.value = "";
    messages.push({ role: "user", content: text });
    await replyFromAI(view, chat);
  }

  async function replyFromAI(view, chat) {
    const typing = addBubble(chat, "ai", "…");
    typing.classList.add("typing");
    try {
      const system = lectureMode ? lectureSystemPrompt()
        : (scenarioMode && activeScenario) ? scenarioSystemPrompt(activeScenario)
        : systemPrompt();
      const text = await window.AI.call({
        system,
        messages: messages,
        maxTokens: lectureMode ? 1500 : 1000, // lectures need room to actually teach
      });
      messages.push({ role: "assistant", content: text });
      // In scenarios, peel off the final "🎯 ..." feedback line from the FULL text first
      // (it comes after the 🔧 line), then split the correction from the rest.
      let rest = text;
      let scenarioFeedback = "";
      if (scenarioMode) {
        const k = rest.indexOf("🎯");
        if (k !== -1) { scenarioFeedback = rest.slice(k + 2).trim(); rest = rest.slice(0, k).trim(); }
      }
      // In a lecture, detect the "✅ LESSON COMPLETE" marker. Strip it from what's
      // shown, mark the lesson done, and offer the next lesson in the syllabus.
      let lessonJustFinished = false;
      if (lectureMode) {
        const m = rest.match(/✅\s*LESSON COMPLETE/i);
        if (m) { lessonJustFinished = true; rest = rest.replace(/✅\s*LESSON COMPLETE/i, "").trim(); }
      }
      // Split off the optional "🔧 ..." correction line into a styled note.
      const { body, correction } = splitCorrection(rest);
      const mainBody = body;
      typing.classList.remove("typing");
      typing.innerHTML = "";
      typing.appendChild(renderRichAI(mainBody, lectureMode));
      if (correction) {
        const c = document.createElement("div");
        c.className = "corrections";
        c.textContent = "🔧 " + correction;
        typing.appendChild(c);
      }
      if (scenarioFeedback) {
        const f = document.createElement("div");
        f.className = "tip";
        f.style.marginTop = "8px";
        f.textContent = "🎯 " + scenarioFeedback;
        typing.appendChild(f);
      }
      // Lesson finished → mark complete + show a clear "next lesson" prompt.
      if (lessonJustFinished) {
        markLessonDone();
        showLessonCompleteBanner(view, typing);
      }
      // In a lecture, read the whole thing slowly in both languages.
      // In normal chat / scenario, speak only the French phrases.
      if (lectureMode) window.Speech.speakBilingual(mainBody);
      else speakFrench(mainBody);
      window.App.recordResult("speaking", 70); // engagement credit
      chat.scrollTop = chat.scrollHeight;
    } catch (e) {
      typing.classList.remove("typing");
      typing.textContent = window.AI.describeError(e);
    }
  }

  async function micInput(view, mic) {
    const input = view.querySelector("#chatInput");
    // Tap-to-toggle: if we're already listening, this tap means "I'm done" → stop & send.
    if (window.Speech.isListening()) {
      window.Speech.stopListening();
      return;
    }
    mic.classList.add("recording");
    mic.title = "Tap when you're done speaking";
    window.App.toast("Listening… speak, then tap 🎤 again when done.");
    try {
      // Continuous: a pause won't cut you off; it ends when you tap again or after silence.
      const t = await window.Speech.listen(null, { continuous: true, silenceMs: 3000 });
      mic.classList.remove("recording");
      mic.title = "Speak";
      if (!t || !t.trim()) { window.App.toast("Didn't catch that — try again."); return; }
      // Put the transcript in the box for REVIEW — don't auto-send. Recognition is
      // imperfect, so let the user fix it (or pick a better guess) before sending.
      input.value = input.value.trim() ? input.value.trim() + " " + t : t;
      input.focus();
      showHeardReview(view, window.Speech.lastAlternatives(), t);
    } catch (e) {
      mic.classList.remove("recording");
      mic.title = "Speak";
      window.App.toast(e.message === "no-speech" ? "Didn't catch that — try again." : "Mic error.");
    }
  }

  // After dictation, show "Heard: … — Send / re-record / pick another guess" so a
  // misrecognition never silently goes to the tutor.
  function showHeardReview(view, alternatives, top) {
    const input = view.querySelector("#chatInput");
    let bar = view.querySelector("#heardReview");
    if (bar) bar.remove();
    bar = document.createElement("div");
    bar.id = "heardReview";
    bar.className = "heard-review";
    const others = (alternatives || []).filter((a) => a && a.trim() && a.trim() !== (top || "").trim()).slice(0, 3);
    bar.innerHTML = `
      <div class="hr-row">
        <span class="muted" style="font-size:12px">Heard you say — edit if wrong, then Send:</span>
      </div>
      <div class="hr-row" style="gap:6px;flex-wrap:wrap">
        <button class="btn" id="hrSend" style="padding:6px 12px;font-size:13px">Send ✓</button>
        <button class="btn secondary" id="hrRedo" style="padding:6px 12px;font-size:13px">🎤 Re-record</button>
        <button class="btn secondary" id="hrClear" style="padding:6px 12px;font-size:13px">✕ Clear</button>
      </div>
      ${others.length ? `<div class="hr-row" style="gap:6px;flex-wrap:wrap;margin-top:4px">
        <span class="muted" style="font-size:12px;width:100%">Did you mean:</span>
        ${others.map((o, i) => `<button class="btn secondary hr-alt" data-alt="${escapeHtml(o)}" style="padding:5px 10px;font-size:12px">${escapeHtml(o)}</button>`).join("")}
      </div>` : ""}
    `;
    const row = view.querySelector(".chat-input-row");
    row.parentElement.insertBefore(bar, row.nextSibling);
    const cleanup = () => { const b = view.querySelector("#heardReview"); if (b) b.remove(); };
    bar.querySelector("#hrSend").addEventListener("click", () => { cleanup(); send(view); });
    bar.querySelector("#hrRedo").addEventListener("click", () => { input.value = ""; cleanup(); micInput(view, view.querySelector("#micBtn")); });
    bar.querySelector("#hrClear").addEventListener("click", () => { input.value = ""; cleanup(); input.focus(); });
    bar.querySelectorAll(".hr-alt").forEach((b) =>
      b.addEventListener("click", () => { input.value = b.dataset.alt; input.focus(); })
    );
  }

  function splitCorrection(text) {
    const i = text.indexOf("🔧");
    if (i === -1) return { body: text.trim(), correction: "" };
    return { body: text.slice(0, i).trim(), correction: text.slice(i + 2).trim() };
  }

  /* Pull out the French phrases (inside « ») so we speak French, not the English. */
  function frenchPhrases(text) {
    const out = [];
    const re = /«\s*([^»]+?)\s*»/g;
    let m;
    while ((m = re.exec(text)) !== null) out.push(m[1].trim());
    return out;
  }
  async function speakFrench(text) {
    const phrases = frenchPhrases(text);
    for (const p of phrases) {
      await window.Speech.speak(p);
      await new Promise((r) => setTimeout(r, 120));
    }
  }

  /* Render an AI message: highlight French « » inline + a 🔊 replay button.
   * Every French WORD inside « » is individually tappable → speaks it + shows an
   * English translation popover, without interrupting the conversation.
   * lecture=true → replay reads the whole thing slowly in both languages. */
  function renderRichAI(text, lecture) {
    const wrap = document.createElement("span");
    // Build HTML: wrap each « French phrase » in .fr-inline, and each word inside
    // it in a tappable .fr-word span. Then render light Markdown (**bold**, *italics*)
    // and line breaks on the surrounding English — the tutor uses these and we don't
    // want raw asterisks showing in the chat.
    let html = escapeHtml(text).replace(/«\s*([^»]+?)\s*»/g, (m, inner) => {
      const words = inner.split(/(\s+)/).map((tok) =>
        /\S/.test(tok) ? `<span class="fr-word" role="button" tabindex="0">${tok}</span>` : tok
      ).join("");
      return `<span class="fr-inline">« ${words} »</span>`;
    });
    html = renderMarkdown(html);
    wrap.innerHTML = html;
    // Wire each tappable word.
    wrap.querySelectorAll(".fr-word").forEach((el) => {
      const tapWord = (e) => { e.preventDefault(); e.stopPropagation(); onWordTap(el); };
      el.addEventListener("click", tapWord);
      el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") tapWord(e); });
    });
    const hasFrench = frenchPhrases(text).length > 0;
    if (hasFrench || lecture) {
      const btn = document.createElement("button");
      btn.className = "speak-mini";
      btn.textContent = " 🔊";
      btn.title = lecture ? "Replay (slow, English + French)" : "Hear the French";
      btn.addEventListener("click", () =>
        lecture ? window.Speech.speakBilingual(text) : speakFrench(text)
      );
      wrap.appendChild(btn);
    }
    return wrap;
  }

  /* Light Markdown → HTML for tutor replies. Input is ALREADY HTML-escaped (with
   * our own <span> tags injected for French phrases), so the only tags present are
   * ours and the only raw characters that matter are * and newlines. We convert:
   *   **x** → <strong>, *x* / _x_ → <em>, `x` → <code>, newlines → <br>.
   * We deliberately do NOT touch anything inside « » French spans (they contain
   * no asterisks). Bold is matched before italics so **x** isn't eaten by *x*. */
  function renderMarkdown(html) {
    return html
      .replace(/\*\*([^*]+?)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*([^*\n]+?)\*(?!\*)/g, "$1<em>$2</em>")
      .replace(/(^|[^_])_([^_\n]+?)_(?!_)/g, "$1<em>$2</em>")
      .replace(/`([^`]+?)`/g, "<code>$1</code>")
      // collapse any stray leftover asterisks the model emitted alone
      .replace(/(^|\s)\*(\s|$)/g, "$1$2")
      .replace(/\n/g, "<br>");
  }

  /* ----- Tap-a-word: speak it + show an English translation popover ----- */
  const wordTransCache = {}; // french word (clean) -> english translation

  function cleanWord(raw) {
    // Strip surrounding punctuation/guillemets but keep apostrophes inside (j'ai).
    return (raw || "").replace(/^[\s«».,;:!?…"'()]+|[\s«».,;:!?…"'()]+$/g, "").trim();
  }

  async function onWordTap(el) {
    const raw = el.textContent;
    const word = cleanWord(raw);
    if (!word) return;
    // 1) Speak the word immediately (doesn't touch the conversation).
    window.Speech.speak(word);
    // 2) Show a popover with the translation (cached → instant on repeat).
    const pop = openWordPopover(el, word);
    if (wordTransCache[word.toLowerCase()] != null) {
      pop.setBody(wordTransCache[word.toLowerCase()]);
      return;
    }
    if (!window.AI.hasKey()) {
      pop.setBody("(Add an API key in Settings for translations.)");
      return;
    }
    try {
      const out = await window.AI.call({
        system: "You are a French→English dictionary. The user taps ONE French word from a sentence. Reply with ONLY its English meaning — a few words max, no sentence, no punctuation at the end. If it's a conjugated verb, give the meaning + base form in parentheses, e.g. 'eats (manger)'.",
        messages: [{ role: "user", content: word }],
        maxTokens: 40,
      });
      const en = (out || "").trim().replace(/^["'«»]+|["'«».]+$/g, "");
      wordTransCache[word.toLowerCase()] = en;
      pop.setBody(en || "—");
    } catch (e) {
      pop.setBody("(translation unavailable)");
    }
  }

  let _openPop = null;
  function openWordPopover(anchor, word) {
    closeWordPopover();
    const pop = document.createElement("div");
    pop.className = "word-pop";
    pop.innerHTML = `
      <div class="wp-head"><span class="wp-fr">${escapeHtml(word)}</span>
        <button class="wp-play" title="Hear again">🔊</button>
        <button class="wp-close" title="Close">✕</button></div>
      <div class="wp-body"><span class="wp-spin"></span> translating…</div>`;
    document.body.appendChild(pop);
    // Position above the word (or below if no room).
    const r = anchor.getBoundingClientRect();
    const top = r.top + window.scrollY;
    const left = r.left + window.scrollX + r.width / 2;
    pop.style.left = left + "px";
    pop.style.top = top + "px";
    // If it would overflow the top, flip below.
    requestAnimationFrame(() => {
      const ph = pop.offsetHeight;
      if (r.top - ph - 10 < 0) { pop.classList.add("below"); pop.style.top = (r.bottom + window.scrollY) + "px"; }
    });
    anchor.classList.add("fr-word-active");
    pop.querySelector(".wp-play").addEventListener("click", (e) => { e.stopPropagation(); window.Speech.speak(word); });
    pop.querySelector(".wp-close").addEventListener("click", (e) => { e.stopPropagation(); closeWordPopover(); });
    pop._anchor = anchor;
    _openPop = pop;
    return {
      setBody: (txt) => { const b = pop.querySelector(".wp-body"); if (b) b.textContent = txt; },
    };
  }
  function closeWordPopover() {
    if (_openPop) {
      if (_openPop._anchor) _openPop._anchor.classList.remove("fr-word-active");
      _openPop.remove();
      _openPop = null;
    }
  }
  // Dismiss the popover when tapping elsewhere (but not when tapping a word/the popover).
  document.addEventListener("click", (e) => {
    if (!_openPop) return;
    if (e.target.closest(".word-pop") || e.target.classList.contains("fr-word")) return;
    closeWordPopover();
  });

  function addBubble(chat, who, text) {
    const b = document.createElement("div");
    b.className = "bubble " + who;
    if (who === "ai") b.appendChild(renderRichAI(text));
    else b.textContent = text;
    chat.appendChild(b);
    chat.scrollTop = chat.scrollHeight;
    return b;
  }
  function addNote(chat, en) {
    const n = document.createElement("div");
    n.className = "bubble ai";
    n.style.opacity = ".8";
    n.innerHTML = `<span class="muted" style="font-size:13px">🇬🇧 ${escapeHtml(en)}</span>`;
    chat.appendChild(n);
  }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

  return { render };
})();
