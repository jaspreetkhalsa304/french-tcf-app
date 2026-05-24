/* ===== Listening (Compréhension orale) =====
 * A French passage is spoken via TTS; the learner answers comprehension MCQs.
 * Claude generates fresh audio scripts + questions when a key is set; otherwise
 * uses the offline bank. Reuses window.MCQ in audioMode.
 */
window.Listening = (function () {
  async function render(view) {
    const s = window.App.getState();
    const keyOn = window.AI.hasKey();
    view.innerHTML = `<div class="card center"><div class="spinner"></div><p class="muted">${keyOn ? "Preparing a listening passage…" : "Loading listening practice…"}</p></div>`;

    let items = null;
    if (keyOn) {
      items = await generate(s.level).catch(() => null);
    }
    if (!items || !items.length) {
      items = window.TCF.listeningBank[s.level] || window.TCF.listeningBank.A1;
    }
    window.MCQ.run(view, {
      title: "🎧 Compréhension orale",
      badge: `🎧 Listen · ${s.level}`,
      items,
      skill: "listening",
      audioMode: true,
      onDone: () => render(document.getElementById("view")),
    });
  }

  async function generate(level) {
    const grammar = (window.CURRICULUM.grammar[level] || []).join(", ");
    const schema = {
      type: "object",
      additionalProperties: false,
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              audio: { type: "string" },
              q: { type: "string" },
              options: { type: "array", items: { type: "string" } },
              answer: { type: "integer" },
            },
            required: ["audio", "q", "options", "answer"],
          },
        },
      },
      required: ["items"],
    };
    const text = await window.AI.call({
      system:
        "You generate French listening-comprehension practice for the TCF exam. Output ONLY JSON matching the schema. " +
        "The 'audio' field is a natural spoken French passage (an announcement, dialogue line, voicemail, weather, or short talk) that will be read aloud by text-to-speech, so write it to sound natural when spoken (no stage directions). Then one French question, exactly 4 French options, and the 0-based correct index.",
      messages: [{
        role: "user",
        content: `Generate 4 listening items at CEFR ${level}. Vary contexts (transport, phone, weather, workplace, media). Use level-appropriate grammar (${grammar}). Audio: 1–4 sentences, longer/more abstract at higher levels.`,
      }],
      maxTokens: 1800,
      jsonSchema: schema,
    });
    const parsed = window.AI.parseJSON(text);
    return parsed && parsed.items ? parsed.items.filter(validItem) : null;
  }

  function validItem(it) {
    return it && it.audio && it.q && Array.isArray(it.options) && it.options.length >= 2 &&
      Number.isInteger(it.answer) && it.answer >= 0 && it.answer < it.options.length;
  }

  return { render };
})();
