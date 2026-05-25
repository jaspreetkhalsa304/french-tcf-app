/* ===== Gemini speech engine (optional) =====
 * The browser Web Speech API (js/speech.js) is flaky — it drops events, throws
 * random no-speech/network/aborted errors, and only works in Chrome/Edge. When the
 * user pastes a Google AI (Gemini) key in Settings, we instead:
 *   1. Record the mic with MediaRecorder  — rock-solid, works in EVERY browser.
 *   2. Send the audio clip to Gemini      — it transcribes AND grades the actual
 *      AUDIO (not an STT text guess), so French homophones/accent mishears are
 *      judged fairly in one call.
 *
 * No SDK: plain REST against generativelanguage.googleapis.com with the key in the
 * query string (Google allows browser calls this way — keeps the app static).
 * Everything degrades gracefully: no key → hasKey() is false → callers fall back to
 * the Web Speech path.
 */
window.Gemini = (function () {
  const MODEL = "gemini-2.5-flash"; // change here to gemini-2.5-pro if desired
  const ENDPOINT = (model, key) =>
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;

  function getKey() {
    return (localStorage.getItem("tcf_gemini_key") || "").trim();
  }
  function hasKey() {
    return getKey().length > 10;
  }

  /* ----- Mic capture via MediaRecorder ----- */
  let _rec = null;          // active MediaRecorder
  let _stream = null;       // active mic stream (so we can stop the tracks)
  let _silenceTimer = null;

  function recordingSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
  }

  /* Pick a mime type the browser can actually record. */
  function pickMime() {
    const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus", "audio/ogg"];
    for (const m of candidates) {
      if (window.MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) return m;
    }
    return ""; // let the browser choose its default
  }

  /* Map a recorder mime to the value Gemini's inlineData wants. */
  function geminiMime(recMime) {
    const m = (recMime || "").toLowerCase();
    if (m.includes("webm")) return "audio/webm";
    if (m.includes("mp4") || m.includes("m4a") || m.includes("aac")) return "audio/mp4";
    if (m.includes("ogg")) return "audio/ogg";
    if (m.includes("wav")) return "audio/wav";
    return "audio/webm";
  }

  function isRecording() { return !!_rec && _rec.state === "recording"; }

  /**
   * Record the microphone until stopRecording() is called or `silenceMs` of quiet
   * passes (default 2500ms). onState(state) gets "listening" | "processing".
   * Resolves with { b64, mime } (base64-encoded audio, no data: prefix).
   */
  function recordClip(onState, opts = {}) {
    const silenceMs = opts.silenceMs != null ? opts.silenceMs : 2500;
    return new Promise((resolve, reject) => {
      if (!recordingSupported()) { reject(new Error("unsupported")); return; }
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        _stream = stream;
        const mime = pickMime();
        let rec;
        try { rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream); }
        catch (_) { rec = new MediaRecorder(stream); }
        _rec = rec;
        const chunks = [];
        let settled = false;

        /* Auto-stop on silence using a Web Audio level meter. */
        let audioCtx = null, analyser = null, rafId = null, quietSince = Date.now(), spoke = false;
        try {
          const AC = window.AudioContext || window.webkitAudioContext;
          audioCtx = new AC();
          const src = audioCtx.createMediaStreamSource(stream);
          analyser = audioCtx.createAnalyser();
          analyser.fftSize = 512;
          src.connect(analyser);
          const buf = new Uint8Array(analyser.frequencyBinCount);
          const tick = () => {
            if (settled) return;
            analyser.getByteTimeDomainData(buf);
            let sum = 0;
            for (let i = 0; i < buf.length; i++) { const v = (buf[i] - 128) / 128; sum += v * v; }
            const rms = Math.sqrt(sum / buf.length);
            const now = Date.now();
            if (rms > 0.025) { spoke = true; quietSince = now; }
            // Only auto-stop after the user has actually spoken something.
            if (spoke && now - quietSince > silenceMs) { stopRecording(); return; }
            rafId = requestAnimationFrame(tick);
          };
          rafId = requestAnimationFrame(tick);
        } catch (_) { /* no level meter — rely on manual stop */ }

        const cleanup = () => {
          if (rafId) cancelAnimationFrame(rafId);
          if (audioCtx && audioCtx.state !== "closed") { try { audioCtx.close(); } catch (_) {} }
          if (_stream) { _stream.getTracks().forEach((t) => { try { t.stop(); } catch (_) {} }); }
          _stream = null; _rec = null;
          if (_silenceTimer) { clearTimeout(_silenceTimer); _silenceTimer = null; }
        };

        rec.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunks.push(e.data); };
        rec.onerror = () => {
          if (settled) return; settled = true;
          cleanup();
          reject(new Error("record-error"));
        };
        rec.onstop = () => {
          if (settled) return; settled = true;
          onState && onState("processing");
          cleanup();
          const blob = new Blob(chunks, { type: mime || "audio/webm" });
          if (!blob.size) { reject(new Error("no-speech")); return; }
          const reader = new FileReader();
          reader.onloadend = () => {
            const dataUrl = String(reader.result || "");
            const b64 = dataUrl.includes(",") ? dataUrl.split(",")[1] : "";
            if (!b64) { reject(new Error("no-speech")); return; }
            resolve({ b64, mime: geminiMime(mime) });
          };
          reader.onerror = () => reject(new Error("read-error"));
          reader.readAsDataURL(blob);
        };

        // Hard cap so a stuck recording can't run forever.
        _silenceTimer = setTimeout(() => { if (isRecording()) stopRecording(); }, opts.maxMs || 30000);

        rec.start();
        onState && onState("listening");
      }).catch((err) => {
        const name = (err && err.name) || "";
        if (/NotAllowed|Security/i.test(name)) reject(new Error("not-allowed"));
        else reject(new Error("mic-error"));
      });
    });
  }

  function stopRecording() {
    if (_rec && _rec.state !== "inactive") { try { _rec.stop(); } catch (_) {} }
  }

  /* ----- Gemini REST call ----- */
  async function generate(parts, { jsonSchema = null, maxOutputTokens = 700, noThinking = false } = {}) {
    const key = getKey();
    if (!key) throw new Error("no-key");
    const body = {
      contents: [{ role: "user", parts }],
      generationConfig: { maxOutputTokens, temperature: 0 },
    };
    // gemini-2.5-flash is a thinking model; for mechanical tasks (plain transcription)
    // disable thinking so the token budget isn't burned on reasoning, returning empty.
    if (noThinking) body.generationConfig.thinkingConfig = { thinkingBudget: 0 };
    if (jsonSchema) {
      body.generationConfig.responseMimeType = "application/json";
      body.generationConfig.responseSchema = jsonSchema;
    }
    const resp = await fetch(ENDPOINT(MODEL, key), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!resp.ok) {
      let detail = "";
      try { const j = await resp.json(); detail = (j.error && j.error.message) || ""; } catch (_) {}
      throw new Error(`${resp.status}${detail ? ": " + detail : ""}`);
    }
    const data = await resp.json();
    const cand = data.candidates && data.candidates[0];
    const text = cand && cand.content && cand.content.parts
      ? cand.content.parts.map((p) => p.text || "").join("").trim()
      : "";
    return text;
  }

  /* Best-effort JSON parse (Gemini honors responseSchema, but be defensive). */
  function parseJSON(text) {
    if (!text) return null;
    try { return JSON.parse(text); } catch (_) {}
    const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fence) { try { return JSON.parse(fence[1]); } catch (_) {} }
    const obj = text.match(/[{[][\s\S]*[}\]]/);
    if (obj) { try { return JSON.parse(obj[0]); } catch (_) {} }
    return null;
  }

  /**
   * Plain transcription of a French audio clip (for the Talk-tab mic, where we just
   * want the words, not a grade). Returns the transcript string ("" if nothing).
   */
  async function transcribe(b64, mime) {
    const text = await generate([
      { text:
        "Transcribe this audio of someone speaking French. Output ONLY the French words " +
        "they said, with correct French spelling and accents — no quotes, no commentary, " +
        "no translation. If the audio is silent or unintelligible, output an empty string." },
      { inlineData: { mimeType: mime || "audio/webm", data: b64 } },
    ], { maxOutputTokens: 256, noThinking: true });
    return (text || "").replace(/^["'\s]+|["'\s]+$/g, "").trim();
  }

  /**
   * Transcribe AND grade a spoken attempt in one call — Gemini judges the actual
   * AUDIO, so accent and homophone fairness comes for free.
   * Returns { score:0-100, heard, words:[{word, ok}], note } or null on failure.
   */
  async function transcribeAndGrade(target, level, b64, mime) {
    const targetWords = String(target).trim().split(/\s+/);
    const schema = {
      type: "object",
      properties: {
        heard: { type: "string" },
        score: { type: "integer" },
        words: {
          type: "array",
          items: {
            type: "object",
            properties: { word: { type: "string" }, ok: { type: "boolean" } },
            required: ["word", "ok"],
          },
        },
        note: { type: "string" },
      },
      required: ["heard", "score", "words", "note"],
    };
    try {
      const text = await generate([
        { text:
          "You are a warm French pronunciation examiner. The audio is a French learner " +
          `(level ${level || "A1"}) attempting to say this TARGET phrase:\n` +
          `TARGET: "${target}"\n` +
          `Target words to grade individually: ${JSON.stringify(targetWords)}\n\n` +
          "Listen to the AUDIO and judge how well they said the target. Be encouraging and " +
          "fair to a non-native accent — small accent colouring is fine; only penalise sounds " +
          "that would confuse a French listener (wrong vowel, missing liaison, an extra/garbled " +
          "syllable). Return JSON only:\n" +
          "• heard: what they actually said, in French spelling (\"\" if silent/unintelligible)\n" +
          "• score: 0-100, how close to the target (lenient but honest)\n" +
          "• words: each TARGET word with ok=true if they pronounced it acceptably\n" +
          "• note: ONE short English sentence — encouraging; name the exact French sound to fix only if there's a real miss." },
        { inlineData: { mimeType: mime || "audio/webm", data: b64 } },
      ], { jsonSchema: schema, maxOutputTokens: 700 });
      const data = parseJSON(text);
      if (!data || typeof data.score !== "number" || !Array.isArray(data.words)) return null;
      data.score = Math.max(0, Math.min(100, Math.round(data.score)));
      data.heard = (data.heard || "").trim();
      return data;
    } catch (_) {
      return null;
    }
  }

  /* Friendly error message for the UI. */
  function describeError(e) {
    const msg = (e && e.message) || String(e);
    if (msg === "no-key") return "Add your Google AI (Gemini) key in Settings (⚙️).";
    if (msg === "unsupported") return "This browser can't record audio.";
    if (msg === "not-allowed") return "Microphone permission denied. Allow the mic and retry.";
    if (msg === "no-speech") return "Didn't catch any audio — try again, a bit louder.";
    if (msg === "mic-error" || msg === "record-error") return "Couldn't access the microphone. Check it's connected and the tab has mic permission.";
    if (msg === "read-error") return "Couldn't read the recorded audio — try again.";
    if (/API key not valid|API_KEY_INVALID/i.test(msg)) return "Your Gemini key was rejected. Check it in Settings (⚙️).";
    if (/^4\d\d/.test(msg) && /key|API_KEY|invalid|permission|denied/i.test(msg)) return "Your Gemini key was rejected or lacks access. Check it in Settings.";
    if (/^429/.test(msg)) return "Gemini rate limited — wait a moment and try again.";
    if (/^403/.test(msg)) return "Gemini denied the request (key not enabled for this API?). Check Settings.";
    if (/Failed to fetch|NetworkError|network/i.test(msg)) return "Network error reaching Gemini — check your connection.";
    return "Speech error: " + msg;
  }

  return {
    MODEL, hasKey, getKey,
    recordingSupported, recordClip, stopRecording, isRecording,
    transcribe, transcribeAndGrade, describeError, parseJSON,
  };
})();
