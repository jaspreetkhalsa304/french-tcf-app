/* ===== Placement test =====
 * A short adaptive reading/grammar quiz spanning A1→C1. Each correct answer at a
 * level contributes to placing the learner. Sets state.level + marks placed.
 * Works fully offline (curated items); no API key needed.
 */
window.Placement = (function () {
  // Ordered easy → hard. Each item tagged with the level it tests.
  const QUESTIONS = [
    { level: "A1", q: "Choisissez : « Je ___ étudiant. »", options: ["suis", "es", "est", "ont"], answer: 0 },
    { level: "A1", q: "« Comment ___ tu ? »", options: ["vas", "va", "allez", "vont"], answer: 0 },
    { level: "A2", q: "Passé composé : « Hier, nous ___ au cinéma. »", options: ["allons", "sommes allés", "irons", "allions"], answer: 1 },
    { level: "A2", q: "« Il y a ___ pommes sur la table. »", options: ["du", "des", "le", "une"], answer: 1 },
    { level: "B1", q: "Imparfait ou passé composé : « Quand il ___, il pleuvait. » (action soudaine)", options: ["arrivait", "est arrivé", "arrive", "arrivera"], answer: 1 },
    { level: "B1", q: "Pronom : « Tu as des stylos ? — Oui, j'___ ai trois. »", options: ["y", "en", "le", "les"], answer: 1 },
    { level: "B2", q: "Subjonctif : « Il faut que tu ___ tôt. »", options: ["pars", "partes", "partiras", "partais"], answer: 1 },
    { level: "B2", q: "Conditionnel passé : « Si j'avais su, je ne ___ pas venu. »", options: ["serais", "serai", "suis", "étais"], answer: 0 },
    { level: "C1", q: "Registre soutenu équivalent de « avant que » : « ___ qu'il ne parte… »", options: ["Pendant", "Dès", "Avant", "Après"], answer: 2 },
    { level: "C1", q: "Sens de « Force est de constater » :", options: ["Il est interdit de constater", "On ne peut que constater", "Il est inutile de constater", "On refuse de constater"], answer: 1 },
  ];

  const LV = window.CURRICULUM.levels;

  function render(view) {
    let i = 0;
    const scoreByLevel = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0 };
    const countByLevel = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0 };

    function draw() {
      const item = QUESTIONS[i];
      view.innerHTML = `
        <div class="card">
          <div class="row"><span class="badge">🧭 Placement</span><span class="badge">${i + 1} / ${QUESTIONS.length}</span></div>
          <h2>Where are you?</h2>
          <h3 style="margin-top:10px">${escapeHtml(item.q)}</h3>
          <div id="opts"></div>
        </div>
      `;
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
        all.forEach((el) => { el.classList.add("disabled"); el.onclick = null; });
        countByLevel[item.level]++;
        if (oi === item.answer) { btn.classList.add("correct"); scoreByLevel[item.level]++; }
        else { btn.classList.add("wrong"); all[item.answer].classList.add("correct"); }
        const after = document.createElement("div");
        after.className = "row";
        after.style.cssText = "justify-content:flex-end;margin-top:12px";
        after.innerHTML = `<button class="btn" id="nx">${i === QUESTIONS.length - 1 ? "See result" : "Next →"}</button>`;
        view.querySelector(".card").appendChild(after);
        after.querySelector("#nx").addEventListener("click", nextQ);
      }
    }

    function nextQ() {
      if (i === QUESTIONS.length - 1) return finish();
      i++; draw();
    }

    function finish() {
      // Highest level where the learner got >=50% of that level's items right.
      let placed = "A1";
      for (const lv of LV) {
        const c = countByLevel[lv] || 0;
        if (c && scoreByLevel[lv] / c >= 0.5) placed = lv;
        else if (c) break; // failed this level — stop climbing
      }
      const s = window.App.getState();
      s.placed = true;
      // seed mastery so progression feels right
      window.App.SKILLS.forEach((sk) => (s.mastery[sk] = 45));
      window.App.setLevel(placed);

      view.innerHTML = `
        <div class="card center">
          <h2>Your level: <span style="color:var(--accent-2)">${placed}</span></h2>
          <p class="muted">${window.CURRICULUM.levelNames[placed]} — we'll start you here and build toward C1.</p>
          <div class="row" style="justify-content:center">
            <button class="btn" id="startNow">Start practicing →</button>
            <button class="btn secondary" id="home">Home</button>
          </div>
        </div>`;
      view.querySelector("#startNow").addEventListener("click", () => window.App.go("pronunciation"));
      view.querySelector("#home").addEventListener("click", () => window.App.go("home"));
    }

    draw();
  }

  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

  return { render };
})();
