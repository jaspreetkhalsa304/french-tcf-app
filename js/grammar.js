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

    // Count grammar lessons + how many done, for the header.
    const grammarAll = window.LESSONS.filter((l) => l.track === "Sentences");
    const doneCount = grammarAll.filter((l) => done[l.id]).length;

    function lessonRow(l) {
      const isDone = done[l.id];
      const cur = l.level === s.level ? ' <span class="badge" style="padding:1px 7px">your level</span>' : "";
      return `
        <button class="basic-row lesson-row" data-lesson="${l.id}">
          <div class="br-main"><span class="br-fr">${isDone ? "✅ " : "📘 "}${escapeHtml(l.title)}</span>${cur}</div>
          <div class="br-en">${escapeHtml(l.goal)}</div>
        </button>`;
    }

    const sections = levels
      .map((lv) => {
        const items = grammarAll.filter((l) => l.level === lv);
        if (!items.length) return "";
        return `
          <div class="card">
            <h3>${lv} — ${window.CURRICULUM.levelNames[lv]} <span class="muted" style="font-size:13px">(${items.length})</span></h3>
            ${items.map(lessonRow).join("")}
          </div>`;
      })
      .join("");

    view.innerHTML = `
      <div class="card">
        <div class="row"><span class="badge">🧩 Grammar</span><span class="badge">all levels A1 → C1</span></div>
        <h2>French grammar</h2>
        <p class="muted">Every grammar topic, taught step-by-step — conjugations, tenses, pronouns, sentence-building. You can open any lesson from any level. ${doneCount}/${grammarAll.length} completed.</p>
        <div class="bar" style="margin-top:6px"><span style="width:${Math.round((doneCount / grammarAll.length) * 100)}%"></span></div>
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
