/* ===== Pronunciation practice =====
 * Flow: show phrase + IPA hint → Hear it (TTS) → Say it (STT) → score + word diff
 *       → AI phonetic tip (if key) → next / review queue.
 */
window.Pronunciation = (function () {
  let queue = [];     // list of items {fr, ipa, en}
  let idx = 0;
  let lastResult = null;

  function buildQueue() {
    const s = window.App.getState();
    const due = window.App.dueReviews();
    const levelVocab = window.CURRICULUM.vocab[s.level] || [];
    // Start with due reviews, then fresh level items (shuffled), avoid dupes.
    const seen = new Set();
    const out = [];
    due.forEach((r) => { if (!seen.has(r.fr)) { seen.add(r.fr); out.push({ fr: r.fr, ipa: r.ipa, en: r.en, review: true }); } });
    shuffle(levelVocab.slice()).forEach((v) => { if (!seen.has(v.fr)) { seen.add(v.fr); out.push(v); } });
    return out.length ? out : levelVocab;
  }
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; }

  function render(view) {
    queue = buildQueue();
    idx = 0;
    lastResult = null;
    if (!queue.length) {
      view.innerHTML = `<div class="card center"><h2>No items yet</h2><p class="muted">Try another level.</p></div>`;
      return;
    }
    drawCard(view);
  }

  function drawCard(view) {
    const item = queue[idx];
    const s = window.App.getState();
    const sttOk = window.Speech.sttSupported;

    view.innerHTML = `
      <div class="card">
        <div class="row">
          <span class="badge">🗣️ Speak · ${s.level}</span>
          <span class="badge">${idx + 1} / ${queue.length}</span>
          ${item.review ? '<span class="badge">🔁 review</span>' : ""}
          <span class="spacer"></span>
        </div>
        <div class="center" style="margin:18px 0">
          <div class="phrase-fr" id="phraseFr">${item.fr}</div>
          <div class="phrase-ipa">/${item.ipa || ""}/</div>
          <div class="phrase-en">${item.en || ""}</div>
        </div>

        <div class="row" style="justify-content:center">
          <button class="btn blue" id="hearBtn">▶︎ Hear it</button>
          <button class="btn secondary" id="hearSlow">🐢 Slow</button>
          <button class="btn ${sttOk ? "" : "secondary"}" id="sayBtn" ${sttOk ? "" : "disabled"}>🎤 Say it</button>
        </div>

        ${
          sttOk
            ? ""
            : `<div class="tip">🎤 Speech scoring needs <strong>Chrome</strong> or <strong>Edge</strong>. You can still listen and repeat here.</div>`
        }

        <div id="result"></div>

        <div class="row" style="justify-content:space-between; margin-top:14px">
          <button class="btn secondary" id="prevBtn" ${idx === 0 ? "disabled" : ""}>← Back</button>
          <button class="btn" id="nextBtn">${idx === queue.length - 1 ? "Finish" : "Next →"}</button>
        </div>
      </div>
    `;

    const item2 = item;
    view.querySelector("#hearBtn").addEventListener("click", () => window.Speech.speak(item2.fr));
    view.querySelector("#hearSlow").addEventListener("click", () => window.Speech.speak(item2.fr, { rate: 0.6 }));
    const sayBtn = view.querySelector("#sayBtn");
    if (sttOk) sayBtn.addEventListener("click", () => doListen(view, item2, sayBtn));

    view.querySelector("#prevBtn").addEventListener("click", () => { if (idx > 0) { idx--; lastResult = null; drawCard(view); } });
    view.querySelector("#nextBtn").addEventListener("click", () => next(view));

    // Auto-play the phrase so the learner hears it first.
    setTimeout(() => window.Speech.speak(item2.fr), 250);
  }

  async function doListen(view, item, btn) {
    const resultEl = view.querySelector("#result");
    btn.classList.add("recording");
    btn.textContent = "● Listening…";
    resultEl.innerHTML = "";
    try {
      const transcript = await window.Speech.listen((stateStr) => {
        if (stateStr === "processing") btn.textContent = "… scoring";
      }, { continuous: true, silenceMs: 1800 }); // a pause inside the phrase won't cut you off
      // Score against ALL of the engine's guesses, not just the top one.
      const candidates = window.Speech.lastAlternatives();
      let res = window.Speech.scorePronunciation(item.fr, transcript, candidates);
      // If a key is set, let Claude re-judge leniently (forgives homophones/accent
      // mishears that the literal string-match wrongly fails). Claude is the better judge.
      if (window.AI.hasKey()) {
        btn.textContent = "… checking";
        const all = [transcript].concat(candidates || []);
        const s2 = window.App.getState();
        const g = await window.AI.gradePronunciation(item.fr, all, s2.level);
        if (g) {
          res = {
            score: g.score,
            words: g.words.map((w) => ({ word: w.word, ok: w.ok })),
            heard: res.heard,
            aiNote: g.note,
          };
        }
      }
      lastResult = res;
      showResult(view, item, res);
      // Persist: record skill result + add to spaced-repetition queue.
      window.App.recordResult("pronunciation", res.score);
      window.App.addReview(item, res.score);
    } catch (e) {
      const reason = e.message === "no-speech" ? "Didn't catch that — try again, a bit louder." :
        e.message === "unsupported" ? "Speech recognition isn't available in this browser." :
        e.message === "not-allowed" ? "Microphone permission denied. Allow the mic and retry." :
        "Couldn't capture audio — try again.";
      resultEl.innerHTML = `<div class="tip">${reason}</div>`;
    } finally {
      btn.classList.remove("recording");
      btn.textContent = "🎤 Say it";
    }
  }

  function showResult(view, item, res) {
    const cls = res.score >= 80 ? "good" : res.score >= 55 ? "mid" : "low";
    const wordHtml = res.words
      .map((w) => `<span class="word ${w.ok ? "ok" : "miss"}">${w.word}</span>`)
      .join(" ");
    const resultEl = view.querySelector("#result");
    resultEl.innerHTML = `
      <div class="score-ring ${cls}">${res.score}%</div>
      <div class="center muted">You said:</div>
      <div class="transcript-box center">${res.heard ? escapeHtml(res.heard) : "<em>(nothing heard)</em>"}</div>
      <div class="center" style="margin-top:6px"><span class="muted">Word match:</span><br>${wordHtml}</div>
      ${res.aiNote ? `<div class="tip" style="margin-top:8px">🧑‍🏫 ${escapeHtml(res.aiNote)}</div>` : ""}
      <div class="row" style="justify-content:center; margin-top:10px">
        <button class="btn secondary" id="retryBtn">↻ Try again</button>
        <button class="btn blue" id="hearAgain">▶︎ Hear correct</button>
        ${window.AI.hasKey() ? `<button class="btn" id="tipBtn">💡 Coaching tip</button>` : ""}
      </div>
      <div id="aiTip"></div>
    `;
    resultEl.querySelector("#retryBtn").addEventListener("click", () => doListen(view, item, view.querySelector("#sayBtn")));
    resultEl.querySelector("#hearAgain").addEventListener("click", () => window.Speech.speak(item.fr, { rate: 0.7 }));
    const tipBtn = resultEl.querySelector("#tipBtn");
    if (tipBtn) tipBtn.addEventListener("click", () => getTip(view, item, res, tipBtn));
  }

  async function getTip(view, item, res, btn) {
    const tipEl = view.querySelector("#aiTip");
    btn.disabled = true;
    tipEl.innerHTML = `<div class="spinner"></div>`;
    const s = window.App.getState();
    const focus = (window.CURRICULUM.phonetics[s.level] || []).join(", ");
    const missed = res.words.filter((w) => !w.ok).map((w) => w.word).join(", ") || "(none)";
    try {
      const text = await window.AI.call({
        system:
          "You are a warm, expert French pronunciation coach. Give SHORT, concrete, actionable feedback in English (3–4 sentences max). Focus on French phonetics: nasal vowels, the uvular R, liaison, e muet, vowel rounding (u vs ou). Be encouraging.",
        messages: [
          {
            role: "user",
            content:
              `Target phrase: "${item.fr}" (IPA /${item.ipa}/).\n` +
              `The learner is at level ${s.level}. Speech recognition heard: "${res.heard}". ` +
              `Words likely mispronounced: ${missed}. Level phonetic focus: ${focus}.\n` +
              `Give one or two specific tips to fix the pronunciation. Mention the exact French sounds.`,
          },
        ],
        maxTokens: 350,
      });
      tipEl.innerHTML = `<div class="tip">💡 ${escapeHtml(text)}</div>`;
    } catch (e) {
      tipEl.innerHTML = `<div class="tip">${window.AI.describeError(e)}</div>`;
    } finally {
      btn.disabled = false;
    }
  }

  function next(view) {
    if (idx >= queue.length - 1) {
      const view2 = document.getElementById("view");
      view2.innerHTML = `
        <div class="card center">
          <h2>🎉 Session complete</h2>
          <p class="muted">Nice work practicing your pronunciation.</p>
          <div class="row" style="justify-content:center">
            <button class="btn" id="again">Practice more</button>
            <button class="btn secondary" id="goConv">Try a conversation →</button>
            <button class="btn secondary" id="goHome">Home</button>
          </div>
        </div>`;
      view2.querySelector("#again").addEventListener("click", () => render(view2));
      view2.querySelector("#goConv").addEventListener("click", () => window.App.go("conversation"));
      view2.querySelector("#goHome").addEventListener("click", () => window.App.go("home"));
      return;
    }
    idx++;
    lastResult = null;
    drawCard(view);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  return { render };
})();
