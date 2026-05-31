/* ===== Realtime voice call =====
 * A WebRTC bridge to the OpenAI Realtime API (gpt-realtime-mini) so the AI tutor
 * answers in real time — you talk, it talks back, you can interrupt.
 *
 * BYOK: the user's OpenAI key (tcf_openai_key) is sent in the SDP offer's
 * Authorization header. Same security tradeoff already accepted for Anthropic
 * (dangerouslyAllowBrowser) and Gemini — the key never leaves their browser.
 *
 * Events surfaced to callers via onEvent(type, payload):
 *   "state"          — { phase: "connecting"|"live"|"closed", message? }
 *   "transcript"     — { who: "user"|"ai", text, final }
 *   "error"          — { message }
 */
window.Realtime = (function () {
  const MODEL = "gpt-realtime-mini";
  const KEY_NAME = "tcf_openai_key";

  let pc = null;
  let dc = null;
  let micStream = null;
  let audioEl = null;
  let onEventCb = null;
  // Per-call transcript assembly. Realtime streams partial deltas under a
  // server-generated item id; we buffer per id and emit "final" on the matching
  // *.done event.
  const userParts = new Map(); // itemId -> running text
  const aiParts = new Map();

  function getKey() {
    try { return localStorage.getItem(KEY_NAME) || ""; } catch (_) { return ""; }
  }
  function hasKey() { return !!getKey(); }
  function isLive() { return !!pc; }

  function emit(type, payload) {
    try { onEventCb && onEventCb(type, payload || {}); } catch (_) {}
  }

  /* The system prompt that tells the realtime tutor how to behave. Built per-call
   * so it picks up the learner's current level. Kept short — Realtime instructions
   * count against context every turn. */
  function instructionsFor(level) {
    return (
      `You are Camille, a warm and patient French tutor on a live voice call with an English-speaking student preparing for the TCF exam (CEFR level ${level}). ` +
      `Speak NATURALLY, like a real teacher on the phone — short turns (10–20 seconds each), then let the student talk. ` +
      `LANGUAGE BALANCE: at A1 speak mostly English with single French phrases, at A2 mix half-and-half, at B1 mostly French with English help, at B2/C1 almost entirely French. ` +
      `Always SAY the English meaning right after any French phrase so the student can follow. ` +
      `When the student speaks French with a mistake, gently restate the correct version and explain the fix briefly in English. ` +
      `Keep the conversation moving with a question or prompt at the end of each turn. Don't lecture — make it a real back-and-forth.`
    );
  }

  /* Open a realtime voice call. Returns a Promise that resolves once the data
   * channel is open (state="live") or rejects on failure. */
  async function start({ onEvent, level }) {
    if (pc) { await stop(); }
    onEventCb = onEvent || null;
    const key = getKey();
    if (!key) throw new Error("no-key");
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error("unsupported");
    if (typeof RTCPeerConnection === "undefined") throw new Error("unsupported");

    emit("state", { phase: "connecting" });

    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      const name = (e && e.name) || "";
      if (name === "NotAllowedError" || name === "SecurityError") throw new Error("not-allowed");
      throw new Error("mic-error");
    }

    pc = new RTCPeerConnection();

    // Remote audio (the AI's voice) → hidden <audio> element so it plays.
    audioEl = document.createElement("audio");
    audioEl.autoplay = true;
    audioEl.style.display = "none";
    document.body.appendChild(audioEl);
    pc.ontrack = (e) => { audioEl.srcObject = e.streams[0]; };

    // Send our mic upstream.
    for (const track of micStream.getTracks()) pc.addTrack(track, micStream);

    // Control channel: send config + receive transcripts/events.
    dc = pc.createDataChannel("oai-events");
    dc.onopen = () => {
      sendSessionUpdate(level);
      emit("state", { phase: "live" });
    };
    dc.onmessage = (e) => {
      let msg;
      try { msg = JSON.parse(e.data); } catch (_) { return; }
      handleEvent(msg);
    };
    dc.onerror = (e) => {
      emit("error", { message: (e && e.message) || "data channel error" });
    };

    pc.onconnectionstatechange = () => {
      if (!pc) return;
      const s = pc.connectionState;
      if (s === "failed" || s === "disconnected" || s === "closed") {
        if (pc) { // not already torn down
          emit("state", { phase: "closed", message: s });
          cleanup();
        }
      }
    };

    // SDP offer/answer dance with the Realtime API.
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    let answerSdp;
    try {
      const r = await fetch(`https://api.openai.com/v1/realtime?model=${encodeURIComponent(MODEL)}`, {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + key,
          "Content-Type": "application/sdp",
        },
        body: offer.sdp,
      });
      if (!r.ok) {
        const body = await r.text();
        cleanup();
        if (r.status === 401) throw new Error("Invalid OpenAI key. Check it in Settings.");
        if (r.status === 429) throw new Error("Rate-limited by OpenAI. Wait a moment and try again.");
        throw new Error(`OpenAI Realtime returned ${r.status}: ${body.slice(0, 200)}`);
      }
      answerSdp = await r.text();
    } catch (e) {
      cleanup();
      throw e;
    }

    await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });
  }

  /* Configure the session: voice, instructions, and ask the server to transcribe
   * both sides so we can show a live chat transcript. */
  function sendSessionUpdate(level) {
    const update = {
      type: "session.update",
      session: {
        instructions: instructionsFor(level || "A1"),
        voice: "marin", // multilingual, handles French well
        modalities: ["audio", "text"],
        input_audio_transcription: { model: "whisper-1" },
        turn_detection: { type: "server_vad" },
      },
    };
    try { dc.send(JSON.stringify(update)); } catch (_) {}
  }

  /* Translate raw Realtime events into our simple "state"/"transcript"/"error"
   * stream. Realtime emits many event types — we only surface the ones the UI needs. */
  function handleEvent(msg) {
    const t = msg.type || "";

    // User speech transcribed by Whisper (delta + done).
    if (t === "conversation.item.input_audio_transcription.delta") {
      const id = msg.item_id || "u";
      const prev = userParts.get(id) || "";
      const next = prev + (msg.delta || "");
      userParts.set(id, next);
      emit("transcript", { who: "user", text: next, final: false });
      return;
    }
    if (t === "conversation.item.input_audio_transcription.completed") {
      const id = msg.item_id || "u";
      const text = msg.transcript || userParts.get(id) || "";
      userParts.delete(id);
      emit("transcript", { who: "user", text, final: true });
      return;
    }

    // AI speech: text deltas (server transcribes its own audio when modalities
    // include "text") arrive as response.audio_transcript.delta / .done.
    if (t === "response.audio_transcript.delta") {
      const id = msg.response_id || "a";
      const prev = aiParts.get(id) || "";
      const next = prev + (msg.delta || "");
      aiParts.set(id, next);
      emit("transcript", { who: "ai", text: next, final: false });
      return;
    }
    if (t === "response.audio_transcript.done") {
      const id = msg.response_id || "a";
      const text = msg.transcript || aiParts.get(id) || "";
      aiParts.delete(id);
      emit("transcript", { who: "ai", text, final: true });
      return;
    }

    if (t === "error") {
      const m = (msg.error && (msg.error.message || msg.error.code)) || "Realtime error";
      emit("error", { message: m });
      return;
    }
  }

  function cleanup() {
    if (dc) { try { dc.close(); } catch (_) {} dc = null; }
    if (pc) { try { pc.close(); } catch (_) {} pc = null; }
    if (micStream) {
      try { micStream.getTracks().forEach((t) => t.stop()); } catch (_) {}
      micStream = null;
    }
    if (audioEl) {
      try { audioEl.srcObject = null; audioEl.remove(); } catch (_) {}
      audioEl = null;
    }
    userParts.clear();
    aiParts.clear();
  }

  async function stop() {
    if (!pc) return;
    cleanup();
    emit("state", { phase: "closed" });
  }

  function describeError(e) {
    const m = (e && e.message) || "";
    if (m === "no-key") return "Add an OpenAI key in Settings to start a voice call.";
    if (m === "unsupported") return "Your browser doesn't support voice calls (needs WebRTC + microphone).";
    if (m === "not-allowed") return "Microphone permission was denied. Allow mic access and try again.";
    if (m === "mic-error") return "Couldn't access the microphone.";
    return m || "Couldn't start the call.";
  }

  return {
    MODEL,
    KEY_NAME,
    getKey,
    hasKey,
    isLive,
    start,
    stop,
    describeError,
  };
})();
