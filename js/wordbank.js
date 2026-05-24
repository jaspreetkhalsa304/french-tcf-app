/* ===== Word-bank sentence builder (Duolingo-style) =====
 * Given a French sentence, show its words shuffled as tappable chips.
 * The learner taps words in order to build the sentence, then checks it.
 * Active grammar/word-order practice — much stickier than recognising an MCQ.
 *
 * Usage:
 *   window.WordBank.mount(el, {
 *     fr: "Je suis étudiant.",          // target sentence
 *     en: "I am a student.",            // shown as the prompt
 *     hint: true,                        // optional: show a 🔊/🐢 hear button
 *     onResult: (ok, score) => {...}     // called after Check
 *   });
 */
window.WordBank = (function () {
  // Split a sentence into tappable tokens, keeping trailing punctuation attached
  // to its word (so "étudiant." stays one chip) but lone marks (?, !) separate.
  function tokenize(sentence) {
    return sentence
      .trim()
      .split(/\s+/)
      .filter(Boolean);
  }

  // Normalise for comparison: lowercase, strip accents & most punctuation.
  function norm(s) {
    return s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[.,!?;:«»"']/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function mount(el, opts) {
    const target = tokenize(opts.fr);
    // Build the bank from the target words, shuffled; if only 1-2 words, it's trivial.
    let bank = shuffle(target.map((w, idx) => ({ w, id: idx })));
    // Guard against the shuffle accidentally equalling the answer.
    if (bank.map((b) => b.w).join(" ") === target.join(" ") && target.length > 1) {
      bank = shuffle(bank);
    }
    const chosen = []; // {w, id}

    el.innerHTML = `
      <p class="muted">🧩 Build the sentence — tap the words in order.</p>
      <div class="wb-prompt">${esc(opts.en || "")}</div>
      <div class="wb-answer" id="wbAnswer" aria-label="Your sentence"></div>
      <div class="wb-bank" id="wbBank"></div>
      <div class="row" style="margin-top:10px">
        <button class="btn" id="wbCheck">Check</button>
        <button class="btn secondary" id="wbClear">↺ Clear</button>
        ${opts.hint ? `<button class="btn secondary" id="wbHear">🔊 Hint</button>` : ""}
      </div>
      <div id="wbResult"></div>
    `;

    const answerEl = el.querySelector("#wbAnswer");
    const bankEl = el.querySelector("#wbBank");
    const resultEl = el.querySelector("#wbResult");
    let done = false;

    function renderChips() {
      // Bank: words not yet chosen
      bankEl.innerHTML = "";
      bank.forEach((tok) => {
        if (chosen.find((c) => c.id === tok.id)) return;
        const b = document.createElement("button");
        b.className = "wb-chip";
        b.textContent = tok.w;
        b.addEventListener("click", () => {
          if (done) return;
          chosen.push(tok);
          renderChips();
        });
        bankEl.appendChild(b);
      });
      // Answer line: chosen words, tap to remove
      answerEl.innerHTML = "";
      if (!chosen.length) {
        answerEl.innerHTML = `<span class="wb-placeholder">tap words below…</span>`;
      }
      chosen.forEach((tok, i) => {
        const b = document.createElement("button");
        b.className = "wb-chip chosen";
        b.textContent = tok.w;
        b.addEventListener("click", () => {
          if (done) return;
          chosen.splice(i, 1);
          renderChips();
        });
        answerEl.appendChild(b);
      });
    }

    function check() {
      if (done) return;
      const built = chosen.map((c) => c.w).join(" ");
      const exact = built === target.join(" ");
      const close = norm(built) === norm(target.join(" ")); // ignore accents/punct/case
      const ok = exact || close;
      done = true;
      const score = ok ? 100 : 0;
      const chips = answerEl.querySelectorAll(".wb-chip");
      chips.forEach((c) => c.classList.add(ok ? "correct" : "wrong"));
      resultEl.innerHTML = `
        <div class="wb-feedback ${ok ? "good" : "low"}">
          ${ok
            ? (close && !exact ? "✅ Correct! (watch the accents/punctuation)" : "✅ Parfait !")
            : `❌ Not quite. Correct answer:`}
          <div class="wb-correct">${esc(opts.fr)}</div>
          <span class="muted">${esc(opts.en || "")}</span>
        </div>
        <div class="row" style="margin-top:8px">
          <button class="btn blue" id="wbPlay">🔊 Hear it</button>
          <button class="btn secondary" id="wbRetry">Try again</button>
        </div>`;
      resultEl.querySelector("#wbPlay").addEventListener("click", () => window.Speech.speak(opts.fr));
      resultEl.querySelector("#wbRetry").addEventListener("click", () => mount(el, opts));
      window.Speech.speak(opts.fr);
      if (typeof opts.onResult === "function") opts.onResult(ok, score);
    }

    el.querySelector("#wbCheck").addEventListener("click", check);
    el.querySelector("#wbClear").addEventListener("click", () => {
      if (done) return;
      chosen.length = 0;
      renderChips();
    });
    const hear = el.querySelector("#wbHear");
    if (hear) hear.addEventListener("click", () => window.Speech.speak(opts.fr, { rate: 0.75 }));

    renderChips();
  }

  function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

  return { mount, tokenize };
})();
