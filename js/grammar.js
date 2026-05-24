/* ===== Grammar tab =====
 * A dedicated view listing EVERY grammar lesson (track "Sentences") across all
 * levels A1 → C1, grouped by level — independent of the learner's current level.
 * Reuses the Lessons player (window.Lessons.openLesson) to teach each one.
 */
window.Grammar = (function () {
  function completed() {
    const s = window.App.getState();
    if (!s.lessonsDone) s.lessonsDone = {};
    return s.lessonsDone;
  }

  function render(view) {
    const s = window.App.getState();
    const done = completed();
    const levels = window.CURRICULUM.levels;

    // This tab now shows BOTH grammar rules (track "Sentences") AND pronunciation
    // rules (track "Pronunciation" — silent letters, liaison, the u vowel, nasal
    // vowels, e muet…), which were previously hidden here. Count all of them.
    const ruleTracks = ["Sentences", "Pronunciation"];
    const rulesAll = window.LESSONS.filter((l) => ruleTracks.includes(l.track));
    const doneCount = rulesAll.filter((l) => done[l.id]).length;

    function lessonRow(l) {
      const isDone = done[l.id];
      const icon = l.track === "Pronunciation" ? "🗣️" : "📘";
      const cur = l.level === s.level ? ' <span class="badge" style="padding:1px 7px">your level</span>' : "";
      return `
        <button class="basic-row lesson-row" data-lesson="${l.id}">
          <div class="br-main"><span class="br-fr">${isDone ? "✅ " : icon + " "}${escapeHtml(l.title)}</span>${cur}</div>
          <div class="br-en">${escapeHtml(l.goal)}</div>
        </button>`;
    }

    const sections = levels
      .map((lv) => {
        const grammar = window.LESSONS.filter((l) => l.level === lv && l.track === "Sentences");
        const pron = window.LESSONS.filter((l) => l.level === lv && l.track === "Pronunciation");
        const total = grammar.length + pron.length;
        if (!total) return "";
        return `
          <div class="card">
            <h3>${lv} — ${window.CURRICULUM.levelNames[lv]} <span class="muted" style="font-size:13px">(${total})</span></h3>
            ${grammar.length ? `<h4 class="track-h">🧩 Grammar rules</h4>${grammar.map(lessonRow).join("")}` : ""}
            ${pron.length ? `<h4 class="track-h">🗣️ Pronunciation rules <span class="muted" style="font-weight:400;font-size:12px">— silent letters, liaison, vowels</span></h4>${pron.map(lessonRow).join("")}` : ""}
          </div>`;
      })
      .join("");

    view.innerHTML = `
      <div class="card">
        <div class="row"><span class="badge">🧩 Grammar & pronunciation</span><span class="badge">all levels A1 → C1</span></div>
        <h2>French grammar & pronunciation rules</h2>
        <p class="muted">Every rule, taught step-by-step — conjugations, tenses, pronouns and sentence-building, plus the <strong>pronunciation rules</strong>: silent letters, liaison, the <em>u</em> vowel, nasal vowels, the <em>e muet</em>. Open any lesson from any level. ${doneCount}/${rulesAll.length} completed.</p>
        <div class="bar" style="margin-top:6px"><span style="width:${rulesAll.length ? Math.round((doneCount / rulesAll.length) * 100) : 0}%"></span></div>
      </div>
      ${sections}
    `;

    view.querySelectorAll("[data-lesson]").forEach((b) =>
      b.addEventListener("click", () => window.Lessons.openLesson(view, b.dataset.lesson))
    );
  }

  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

  return { render };
})();
