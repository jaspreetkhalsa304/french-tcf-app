/* ===== Study / Strategy tab =====
 * Renders the "how to score" material from data/study_guides.js:
 *   • DELF/DALF method sheets — pick a level, then a module (all 4).
 *   • TCF strategy — per-level tactics (A1–C2).
 *   • TCF C1 dossier — focused "score C1" guide (targets, connectors,
 *     frameworks, vocabulary, study plan).
 * Pure offline content — no API key required.
 */
window.Study = (function () {
  const S = window.STUDY;

  function render(view) {
    drawHub(view);
  }

  /* -------- top hub: choose an exam track -------- */
  function drawHub(view) {
    view.innerHTML = `
      <div class="card">
        <div class="row">
          <span class="badge">📘 Study &amp; Strategy</span>
        </div>
        <h2>How to score — strategies &amp; material</h2>
        <p class="muted">Method sheets, structuring templates, ready-to-use phrases, common traps and timing for the two exams. This is the <em>how-to</em> that pairs with the practice in the 🇫🇷 DELF and 📝 Mock tabs.</p>
        <div class="skill-grid" style="margin-top:6px">
          <div class="skill-card" data-track="delf">
            <div class="emoji">🇫🇷</div>
            <div class="name">DELF / DALF guides</div>
            <div class="sub">All 4 modules · A1 → C2<br><span class="muted">approach · templates · traps</span></div>
          </div>
          <div class="skill-card" data-track="tcf">
            <div class="emoji">🎯</div>
            <div class="name">TCF strategy</div>
            <div class="sub">Per-level tactics · A1 → C2<br><span class="muted">band-by-band</span></div>
          </div>
          <div class="skill-card" data-track="tcfc1">
            <div class="emoji">🏆</div>
            <div class="name">Score C1 in the TCF</div>
            <div class="sub">Focused C1 dossier<br><span class="muted">connectors · frameworks · plan</span></div>
          </div>
        </div>
      </div>
    `;
    view.querySelectorAll("[data-track]").forEach((el) =>
      el.addEventListener("click", () => {
        const t = el.dataset.track;
        if (t === "delf") drawDelfLevels(view);
        else if (t === "tcf") drawTcfLevels(view);
        else drawTcfC1(view);
      })
    );
  }

  /* ==================================================
   * DELF method sheets
   * ================================================== */
  function drawDelfLevels(view) {
    const s = window.App.getState();
    const cur = S.delfLevels.includes(s.level) ? s.level : "A1";
    drawDelfLevel(view, cur);
  }

  function drawDelfLevel(view, lvl) {
    const mods = ["listening", "reading", "writing", "speaking"];
    view.innerHTML = `
      <div class="card">
        <div class="row">
          <span class="badge">🇫🇷 DELF / DALF guides</span>
          <span class="badge">${lvl}</span>
          <span class="spacer"></span>
          <button class="ghost-btn" id="backHub">← Study home</button>
        </div>
        <h2>DELF ${lvl} — method by module</h2>
        <div class="setting-group" style="padding-left:0;padding-right:0;border:none">
          <label for="delfGuideLvl">Choose level</label>
          <select id="delfGuideLvl">
            ${S.delfLevels.map((l) => `<option value="${l}" ${l === lvl ? "selected" : ""}>${l}</option>`).join("")}
          </select>
        </div>
        <div class="skill-grid" style="margin-top:6px">
          ${mods.map((m) => `
            <div class="skill-card" data-mod="${m}">
              <div class="emoji">${S.moduleNames[m].split(" ")[0]}</div>
              <div class="name">${S.moduleNames[m].replace(/^\S+\s/, "")}</div>
              <div class="sub muted">${esc((S.delf[lvl][m] || {}).goal || "")}</div>
            </div>`).join("")}
        </div>
      </div>
    `;
    view.querySelector("#backHub").addEventListener("click", () => drawHub(view));
    view.querySelector("#delfGuideLvl").addEventListener("change", (e) => drawDelfLevel(view, e.target.value));
    view.querySelectorAll("[data-mod]").forEach((el) =>
      el.addEventListener("click", () => drawDelfGuide(view, lvl, el.dataset.mod))
    );
  }

  function drawDelfGuide(view, lvl, mod) {
    const g = (S.delf[lvl] || {})[mod] || {};
    view.innerHTML = `
      <div class="card">
        <div class="row">
          <span class="badge">${S.moduleNames[mod]}</span>
          <span class="badge">DELF ${lvl}</span>
          <span class="spacer"></span>
          <button class="ghost-btn" id="backLvl">← ${lvl} modules</button>
        </div>
        <h2>${S.moduleNames[mod]} — ${lvl}</h2>
        ${guideBody(g)}
        <div class="row" style="margin-top:14px">
          <button class="btn blue" id="goPractice">Practise this in the DELF tab →</button>
        </div>
      </div>
    `;
    view.querySelector("#backLvl").addEventListener("click", () => drawDelfLevel(view, lvl));
    view.querySelector("#goPractice").addEventListener("click", () => window.App.go("delf"));
  }

  /* Shared renderer for a single module guide object. */
  function guideBody(g) {
    let html = "";
    if (g.goal) html += `<div class="tip">🎯 <strong>Goal:</strong> ${esc(g.goal)}</div>`;
    if (g.approach && g.approach.length) {
      html += `<h3 style="margin-top:14px">Approach</h3><ol style="margin:6px 0 0 18px;line-height:1.6">${g.approach.map((a) => `<li>${esc(a)}</li>`).join("")}</ol>`;
    }
    if (g.template) {
      html += `<h3 style="margin-top:14px">🗂️ Structure template</h3><div class="passage" style="white-space:pre-wrap">${esc(g.template)}</div>`;
    }
    if (g.phrases && g.phrases.length) {
      html += `<h3 style="margin-top:14px">🗣️ Ready-to-use phrases</h3>${phraseTable(g.phrases)}`;
    }
    if (g.traps && g.traps.length) {
      html += `<h3 style="margin-top:14px">⚠️ Common traps</h3><ul style="margin:6px 0 0 18px;line-height:1.6">${g.traps.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;
    }
    if (g.timing) {
      html += `<div class="tip" style="margin-top:14px">⏱️ <strong>Timing:</strong> ${esc(g.timing)}</div>`;
    }
    return html;
  }

  function phraseTable(phrases) {
    return phrases.map((p) =>
      `<div style="margin:6px 0;padding:8px 10px;background:rgba(255,255,255,.04);border-radius:6px">
         <div><strong>${esc(p.fr)}</strong></div>
         <div class="muted" style="font-size:12px;margin-top:2px">${esc(p.en)}</div>
       </div>`
    ).join("");
  }

  /* ==================================================
   * TCF per-level strategy
   * ================================================== */
  function drawTcfLevels(view) {
    const s = window.App.getState();
    const cur = S.tcfLevels.includes(s.level) ? s.level : "A1";
    drawTcfLevel(view, cur);
  }

  function drawTcfLevel(view, lvl) {
    const g = S.tcf[lvl] || {};
    view.innerHTML = `
      <div class="card">
        <div class="row">
          <span class="badge">🎯 TCF strategy</span>
          <span class="badge">${lvl}</span>
          <span class="spacer"></span>
          <button class="ghost-btn" id="backHub">← Study home</button>
        </div>
        <h2>TCF — target the ${lvl} band</h2>
        <p class="muted">The TCF is scored on a scale — each item you get right pushes your band up. Answer <strong>every</strong> MCQ (no negative marking) and produce at the level below.</p>
        <div class="setting-group" style="padding-left:0;padding-right:0;border:none">
          <label for="tcfGuideLvl">Choose target level</label>
          <select id="tcfGuideLvl">
            ${S.tcfLevels.map((l) => `<option value="${l}" ${l === lvl ? "selected" : ""}>${l}</option>`).join("")}
          </select>
        </div>
        ${guideBody(g)}
        ${lvl === "C1" ? `<div class="row" style="margin-top:14px"><button class="btn blue" id="goC1">Open the full C1 dossier →</button></div>` : ""}
        <div class="row" style="margin-top:10px">
          <button class="btn secondary" id="goMock">Practise in the Mock TCF tab →</button>
        </div>
      </div>
    `;
    view.querySelector("#backHub").addEventListener("click", () => drawHub(view));
    view.querySelector("#tcfGuideLvl").addEventListener("change", (e) => drawTcfLevel(view, e.target.value));
    view.querySelector("#goMock").addEventListener("click", () => window.App.go("mocktest"));
    const c1 = view.querySelector("#goC1");
    if (c1) c1.addEventListener("click", () => drawTcfC1(view));
  }

  /* ==================================================
   * TCF C1 dossier
   * ================================================== */
  function drawTcfC1(view) {
    const d = S.tcfC1;
    const sectionOrder = ["listening", "reading", "writing", "speaking"];
    const targets = d.targets.map((t) =>
      `<div style="margin:6px 0;padding:8px 10px;background:rgba(255,255,255,.04);border-radius:6px">
         <strong style="font-size:13px">${esc(t.skill)}</strong>
         <div class="muted" style="font-size:13px;margin-top:2px">${esc(t.note)}</div>
       </div>`).join("");

    const sections = sectionOrder.map((k) => {
      const g = d.sections[k];
      return `<details style="margin:8px 0"><summary style="cursor:pointer"><strong>${S.moduleNames[k]}</strong></summary>
        <div style="margin-top:8px">${guideBody(g)}</div></details>`;
    }).join("");

    const connectors = d.connectors.map((grp) =>
      `<h4 style="margin:10px 0 4px;color:var(--accent-2)">${esc(grp.fn)}</h4>${phraseTable(grp.items)}`
    ).join("");

    const frameworks = d.frameworks.map((f) =>
      `<div style="margin:10px 0;padding:10px;background:rgba(255,255,255,.04);border-radius:6px">
         <strong>${esc(f.name)}</strong>
         <ol style="margin:6px 0 0 18px;line-height:1.6">${f.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
       </div>`).join("");

    const vocab = d.vocab.map((v) =>
      `<div style="margin:6px 0"><strong style="font-size:13px">${esc(v.theme)} :</strong> <span class="muted">${esc(v.words)}</span></div>`
    ).join("");

    const plan = d.plan.map((p) => `<li>${esc(p)}</li>`).join("");

    view.innerHTML = `
      <div class="card">
        <div class="row">
          <span class="badge">🏆 Score C1 in the TCF</span>
          <span class="spacer"></span>
          <button class="ghost-btn" id="backHub">← Study home</button>
        </div>
        <h2>Score C1 in the TCF — full dossier</h2>
        <div class="tip">${esc(d.intro)}</div>

        <h3 style="margin-top:16px">🎯 What C1 demands, per skill</h3>
        ${targets}

        <h3 style="margin-top:16px">📋 Section-by-section tactics</h3>
        ${sections}

        <h3 style="margin-top:16px">🔗 High-value C1 connectors</h3>
        ${connectors}

        <h3 style="margin-top:16px">🧱 Production frameworks</h3>
        ${frameworks}

        <h3 style="margin-top:16px">📚 Abstract-topic vocabulary</h3>
        ${vocab}

        <h3 style="margin-top:16px">🗓️ Study plan</h3>
        <ol style="margin:6px 0 0 18px;line-height:1.6">${plan}</ol>

        <div class="row" style="margin-top:16px;gap:8px;flex-wrap:wrap">
          <button class="btn blue" id="goDelf">DALF C1 writing rubric &amp; grader →</button>
          <button class="btn secondary" id="goMock">Timed Mock TCF →</button>
        </div>
      </div>
    `;
    view.querySelector("#backHub").addEventListener("click", () => drawHub(view));
    view.querySelector("#goDelf").addEventListener("click", () => window.App.go("delf"));
    view.querySelector("#goMock").addEventListener("click", () => window.App.go("mocktest"));
  }

  /* -------- helper -------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  return { render };
})();
