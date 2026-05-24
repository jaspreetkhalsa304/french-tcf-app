/* ===== Speech engine =====
 * TTS  : SpeechSynthesis (hear French)
 * STT  : SpeechRecognition (capture your French) — Chrome/Edge
 * Score: text-similarity of what STT heard vs the target phrase, word-by-word.
 */
window.Speech = (function () {
  const synth = window.speechSynthesis;
  let voices = [];

  /* ===== Neural TTS via Puter.js (free, no key, AWS Polly voices) =====
   * Far more human than the macOS built-in voices. We route French/English
   * speech through it when available, and fall back to SpeechSynthesis on any
   * error (offline, blocked, etc.) so the app always speaks. */
  const NEURAL_VOICE = { fr: "Lea", en: "Joanna" }; // female neural personas
  function neuralAvailable() {
    return !!(window.puter && window.puter.ai && window.puter.ai.txt2speech);
  }
  function useNeural() {
    // Default ON when Puter loaded; user can disable via Settings (tcf_tts="native").
    const pref = localStorage.getItem("tcf_tts");
    if (pref === "native") return false;
    return neuralAvailable();
  }
  let curAudio = null; // currently-playing neural audio, so we can cancel it
  function langKey(langStr) {
    return /^fr/i.test(langStr || "") ? "fr" : "en";
  }
  /* Speak via Puter neural TTS. Resolves when playback ends; rejects on failure. */
  function speakNeural(text, langStr, rate) {
    return new Promise((resolve, reject) => {
      const key = langKey(langStr);
      const opts = {
        voice: NEURAL_VOICE[key],
        engine: "neural",
        language: key === "fr" ? "fr-FR" : "en-US",
      };
      let settled = false;
      const finish = (ok, err) => {
        if (settled) return; settled = true;
        ok ? resolve() : reject(err || new Error("neural-failed"));
      };
      Promise.resolve(window.puter.ai.txt2speech(text, opts))
        .then((audio) => {
          if (!audio || typeof audio.play !== "function") { finish(false); return; }
          curAudio = audio;
          audio.playbackRate = rate || 1;
          audio.onended = () => { if (curAudio === audio) curAudio = null; finish(true); };
          audio.onerror = () => finish(false);
          const p = audio.play();
          if (p && p.catch) p.catch(() => finish(false));
          // Safety net in case onended never fires.
          const ms = Math.max(4000, (text.length / Math.max(0.5, rate || 1)) * 95 + 3000);
          setTimeout(() => finish(true), ms);
        })
        .catch(() => finish(false));
    });
  }
  function cancelNeural() {
    if (curAudio) { try { curAudio.pause(); } catch (_) {} curAudio = null; }
  }

  function loadVoices() {
    voices = (synth && synth.getVoices ? synth.getVoices() : []) || [];
    return voices;
  }
  if (synth) {
    loadVoices();
    if (synth.onvoiceschanged !== undefined) synth.onvoiceschanged = loadVoices;
  }

  function frenchVoices() {
    return loadVoices().filter((v) => /fr(-|_)/i.test(v.lang));
  }

  /* Best-effort female-voice detector by known names (works offline, no metadata). */
  const FEMALE_NAMES = /audrey|aurélie|aurelie|amélie|amelie|marie|chantal|virginie|julie|léa|lea|céline|celine|samantha|ava|allison|susan|karen|moira|tessa|fiona|serena|kathy|victoria|zoe|sandy|shelley|grandma|princess|kate|catherine|nicky|joana|luciana|alice|amira|sara/;
  const MALE_NAMES = /thomas|jacques|nicolas|eddy|rocko|reed|fred|albert|alex|daniel|tom|aaron|arthur|rishi|aman|grandpa|ralph|junior|oliver|gordon|lee/;
  function isFemale(v) {
    const n = (v.name || "").toLowerCase();
    if (FEMALE_NAMES.test(n)) return true;
    if (MALE_NAMES.test(n)) return false;
    return null; // unknown
  }
  function preferFemale() {
    return localStorage.getItem("tcf_female") !== "0"; // default ON
  }

  /* Score a voice for clarity/quality — higher is better.
   * Enhanced/Premium downloaded voices sound far better than compact defaults. */
  function voiceQuality(v) {
    let score = 0;
    const name = (v.name || "").toLowerCase();
    if (/premium/.test(name)) score += 100;       // best tier
    if (/enhanced/.test(name)) score += 60;        // high quality
    if (/neural|natural|siri/.test(name)) score += 50;
    // Known clear France-French voices
    if (/audrey|aurélie|aurelie|thomas|marie/.test(name)) score += 12;
    // France French preferred over Canada for TCF (metropolitan accent)
    if (/fr-FR|fr_FR/i.test(v.lang)) score += 8;
    // Prefer a FEMALE voice when requested (default).
    if (preferFemale()) { const f = isFemale(v); if (f === true) score += 25; else if (f === false) score -= 25; }
    if (v.localService) score += 1;
    // Demote the "novelty" voices (Grandma, Grandpa, Flo, Rocko, etc.)
    if (/grandma|grandpa|flo|rocko|reed|sandy|shelley|eddy|jester|bells|bad news|good news/.test(name)) score -= 30;
    return score;
  }

  /* French voices sorted best-first. */
  function rankedFrenchVoices() {
    return frenchVoices().slice().sort((a, b) => voiceQuality(b) - voiceQuality(a));
  }

  /* ----- Single-voice mode: one female voice family for BOTH languages -----
   * macOS multilingual families (Sandy, Shelley, Flo, Grandma, Eddy, Reed…) exist
   * as separate fr_FR and en_US entries. We pick a family and use its French entry
   * for French and its English entry for English — so it sounds like ONE voice. */
  const SINGLE_FAMILIES = ["Sandy", "Shelley", "Flo", "Grandma"]; // female, exist in fr+en
  function singleVoiceMode() {
    return localStorage.getItem("tcf_one_voice") === "1";
  }
  function familyMember(family, langRe) {
    const re = new RegExp(family, "i");
    return loadVoices().find((v) => re.test(v.name) && langRe.test(v.lang)) || null;
  }
  function chosenFamily() {
    const stored = localStorage.getItem("tcf_voice_family");
    if (stored && familyMember(stored, /fr/i) && familyMember(stored, /^en/i)) return stored;
    // first family that actually exists in both fr and en on this machine
    return SINGLE_FAMILIES.find((f) => familyMember(f, /fr/i) && familyMember(f, /^en/i)) || null;
  }

  function pickVoice() {
    if (singleVoiceMode()) {
      const fam = chosenFamily();
      const fv = fam && (familyMember(fam, /fr-FR|fr_FR/i) || familyMember(fam, /fr/i));
      if (fv) return fv;
    }
    const stored = localStorage.getItem("tcf_voice");
    const fr = frenchVoices();
    if (stored) {
      const m = fr.find((v) => v.name === stored) || loadVoices().find((v) => v.name === stored);
      if (m) return m;
    }
    // Auto-pick the highest-quality French voice available.
    const ranked = rankedFrenchVoices();
    return ranked[0] || null;
  }

  function englishVoices() {
    return loadVoices().filter((v) => /^en(-|_)/i.test(v.lang));
  }

  /* Score an English voice for clarity — higher is better. */
  function englishQuality(v) {
    let score = 0;
    const n = (v.name || "").toLowerCase();
    if (/premium/.test(n)) score += 100;
    if (/enhanced/.test(n)) score += 60;
    if (/neural|natural|siri/.test(n)) score += 50;
    // Known clear, natural standard voices
    if (/samantha|ava|allison|susan|tom|alex|daniel|karen|serena|moira|tessa|fiona/.test(n)) score += 20;
    if (/en-US|en_US/i.test(v.lang)) score += 5; // default to US clarity
    else if (/en-GB|en_GB/i.test(v.lang)) score += 4;
    // Prefer a FEMALE voice when requested (default).
    if (preferFemale()) { const f = isFemale(v); if (f === true) score += 25; else if (f === false) score -= 25; }
    if (v.localService) score += 1;
    // Demote robotic/novelty voices heavily
    if (/albert|fred|junior|ralph|kathy|princess|bad news|good news|bells|boing|bubbles|cellos|jester|organ|superstar|wobble|bahh|grandma|grandpa|flo|rocko|reed|sandy|shelley|eddy|trinoids|whisper|zarvox/.test(n)) score -= 40;
    return score;
  }

  function rankedEnglishVoices() {
    return englishVoices().slice().sort((a, b) => englishQuality(b) - englishQuality(a));
  }

  /* Pick a clear English voice (for narration in lectures). Honors a stored choice. */
  function pickEnglishVoice() {
    if (singleVoiceMode()) {
      const fam = chosenFamily();
      const ev = fam && (familyMember(fam, /en-US|en_US/i) || familyMember(fam, /^en/i));
      if (ev) return ev;
    }
    const stored = localStorage.getItem("tcf_en_voice");
    const en = englishVoices();
    if (stored) {
      const m = en.find((v) => v.name === stored);
      if (m) return m;
    }
    return rankedEnglishVoices()[0] || null;
  }

  /* Low-level: speak one segment with a given voice/rate. cancelFirst=false lets
   * callers queue several segments back-to-back without cutting each other off.
   * Hardened against Chrome's known bugs: dropped onend, the "paused" stall, and
   * long-utterance truncation (callers should pass short, sentence-sized chunks). */
  async function speakWith(text, voice, rate, cancelFirst) {
    if (!text || !text.trim()) return;
    const langStr = (voice && voice.lang) || "fr-FR";
    if (cancelFirst) { cancelNeural(); if (synth) synth.cancel(); }
    // Prefer the human-like neural voice; fall back to native on any failure.
    if (useNeural()) {
      try {
        await speakNeural(text.trim(), langStr, rate || 1);
        return;
      } catch (_) {
        // fall through to native SpeechSynthesis below
      }
    }
    return speakNative(text, voice, rate);
  }

  function speakNative(text, voice, rate) {
    return new Promise((resolve) => {
      if (!synth || !text || !text.trim()) { resolve(); return; }
      const u = new SpeechSynthesisUtterance(text);
      if (voice) u.voice = voice;
      u.lang = (voice && voice.lang) || "fr-FR";
      u.rate = rate;
      u.pitch = 1;
      let done = false, keepAlive = null, guard = null;
      const finish = () => {
        if (done) return; done = true;
        if (keepAlive) clearInterval(keepAlive);
        if (guard) clearTimeout(guard);
        resolve();
      };
      u.onend = finish;
      u.onerror = finish;
      // Chrome sometimes silently pauses mid-utterance — nudge it to keep going.
      keepAlive = setInterval(() => {
        if (synth.speaking && synth.paused) synth.resume();
      }, 4000);
      // Safety net: if onend never fires (Chrome drops it), don't hang forever.
      const ms = Math.max(4000, (text.length / Math.max(0.5, rate)) * 90 + 2000);
      guard = setTimeout(finish, ms);
      synth.speak(u);
    });
  }

  /* Split English narration into short, speakable chunks (sentence-ish), because
   * Chrome truncates/drops long utterances. */
  function chunkEnglish(text) {
    const cleaned = text
      .replace(/[*_#`>🔧👋📚🇬🇧👩‍🏫➡️→•]/g, " ")
      .replace(/\(([^)]*)\)/g, " $1 ")
      .replace(/\s+/g, " ")
      .trim();
    if (!cleaned) return [];
    // Split on sentence enders and newlines, keeping pieces under ~160 chars.
    const rough = cleaned.split(/(?<=[.!?:])\s+/);
    const out = [];
    for (let part of rough) {
      while (part.length > 160) {
        let cut = part.lastIndexOf(",", 160);
        if (cut < 40) cut = 160;
        out.push(part.slice(0, cut).trim());
        part = part.slice(cut).trim();
      }
      if (part) out.push(part);
    }
    return out;
  }

  /** Speak French text aloud. Returns a Promise resolving when done. */
  function speak(text, opts = {}) {
    const rate = opts.rate != null ? opts.rate : parseFloat(localStorage.getItem("tcf_rate") || "0.9");
    return speakWith(text, pickVoice(), rate, true);
  }

  /** Speak English text aloud (for explanations/narration). */
  function speakEnglish(text, opts = {}) {
    const rate = opts.rate != null ? opts.rate : 0.95;
    return speakWith(text, pickEnglishVoice(), rate, true);
  }

  /**
   * Speak a bilingual lesson string in order: English narration in an English voice,
   * French phrases (inside « ») in the French voice — slowed down for lectures.
   * `opts.frRate` / `opts.enRate` override the slow defaults.
   */
  async function speakBilingual(text, opts = {}) {
    if (!text) return;
    cancel();
    // Neural voices already sound natural; slowing them to 0.78 sounds sluggish.
    // Use gentler slowdowns for neural, the heavier slowdown for the robotic natives.
    const neural = useNeural();
    const frRate = opts.frRate != null ? opts.frRate : (neural ? 0.92 : 0.78);
    const enRate = opts.enRate != null ? opts.enRate : (neural ? 1.0 : 0.92);
    const enVoice = pickEnglishVoice();
    const frVoice = pickVoice();
    // Split into segments, marking which are French (inside guillemets).
    const segs = [];
    const re = /«\s*([^»]+?)\s*»/g;
    let last = 0, m;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) segs.push({ fr: false, t: text.slice(last, m.index) });
      segs.push({ fr: true, t: m[1].trim() });
      last = re.lastIndex;
    }
    if (last < text.length) segs.push({ fr: false, t: text.slice(last) });

    for (const seg of segs) {
      if (seg.fr) {
        const clean = seg.t.trim();
        if (!clean) continue;
        await speakWith(clean, frVoice, frRate, false);
        await new Promise((r) => setTimeout(r, 450)); // pause so the learner can repeat
      } else {
        // Speak English narration as several SHORT chunks (Chrome drops long ones).
        for (const chunk of chunkEnglish(seg.t)) {
          await speakWith(chunk, enVoice, enRate, false);
          await new Promise((r) => setTimeout(r, 120));
        }
      }
    }
  }

  function cancel() {
    cancelNeural();
    if (synth) synth.cancel();
  }

  /* ----- Speech recognition ----- */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const sttSupported = !!SR;

  /**
   * Listen and resolve with the recognized transcript.
   *
   * Continuous by default: a natural pause does NOT end the session, so you can
   * speak a full sentence (or several). Recognition keeps running until either
   *   • the caller calls stopListening()  → resolves with everything heard, or
   *   • silence exceeds `opts.silenceMs`  → auto-stops (default 2500ms).
   * Pass opts.continuous=false for the old single-utterance behavior.
   *
   * onState(state) gets "listening" | "processing" for UI feedback.
   * opts.lang sets the recognition language (default "fr-FR").
   */
  function listen(onState, opts = {}) {
    return new Promise((resolve, reject) => {
      if (!SR) {
        reject(new Error("unsupported"));
        return;
      }
      const continuous = opts.continuous !== false; // default ON now
      const silenceMs = opts.silenceMs != null ? opts.silenceMs : 2500;
      const rec = new SR();
      rec.lang = opts.lang || "fr-FR";
      rec.interimResults = true;   // needed to detect that you're still talking
      // Keep several guesses, not just the top one — the engine's #1 is often wrong
      // for non-native accents while a lower-ranked alternative is right.
      rec.maxAlternatives = opts.maxAlternatives || 5;
      rec.continuous = continuous;

      let finalText = "";          // accumulated finalized (best-guess) speech
      const altSets = [];          // per-segment arrays of alternative transcripts
      let settled = false;
      let silenceTimer = null;
      let stoppedByUser = false;

      const armSilence = () => {
        if (!continuous) return;
        if (silenceTimer) clearTimeout(silenceTimer);
        silenceTimer = setTimeout(() => { try { rec.stop(); } catch (_) {} }, silenceMs);
      };
      const settle = (fn) => {
        if (settled) return; settled = true;
        if (silenceTimer) clearTimeout(silenceTimer);
        listen._active = null;
        fn();
      };

      rec.onstart = () => { onState && onState("listening"); armSilence(); };
      rec.onresult = (e) => {
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const r = e.results[i];
          if (r.isFinal) {
            finalText += r[0].transcript + " ";
            // Capture every alternative the engine offers for this segment.
            const alts = [];
            for (let a = 0; a < r.length; a++) alts.push(r[a].transcript);
            altSets.push(alts);
          } else interim += r[0].transcript;
        }
        // Any speech (final OR interim) means you're still talking — reset the timer.
        if (finalText.trim() || interim.trim()) armSilence();
        if (!continuous && finalText.trim()) {
          onState && onState("processing");
          listen._alternatives = buildAlternatives(altSets);
          settle(() => resolve(finalText.trim()));
        }
      };
      rec.onerror = (e) => {
        // "no-speech" while continuous just means a quiet stretch — keep going
        // unless nothing has been captured at all.
        if (e.error === "no-speech" && continuous && finalText.trim()) return;
        settle(() => reject(new Error(e.error || "error")));
      };
      rec.onend = () => {
        onState && onState("processing");
        listen._alternatives = buildAlternatives(altSets);
        const text = finalText.trim();
        if (text || stoppedByUser) settle(() => resolve(text));
        else settle(() => reject(new Error("no-speech")));
      };
      try {
        rec.start();
      } catch (err) {
        settle(() => reject(err));
      }
      // expose stop for caller (stopListening resolves with what was heard so far)
      listen._active = rec;
      listen._markUserStop = () => { stoppedByUser = true; };
    });
  }
  function stopListening() {
    if (listen._active) {
      if (listen._markUserStop) listen._markUserStop();
      try { listen._active.stop(); } catch (_) {}
    }
  }
  function isListening() { return !!listen._active; }

  /* Combine per-segment alternative lists into up to 6 full-sentence candidates.
   * altSets = [ [seg1alt1, seg1alt2…], [seg2alt1…], … ]. We expand a limited
   * cartesian product so scoring can pick whichever candidate best matches a target. */
  function buildAlternatives(altSets) {
    if (!altSets || !altSets.length) return [];
    let combos = [""];
    for (const alts of altSets) {
      const next = [];
      for (const base of combos) {
        for (const a of (alts.length ? alts : [""])) {
          next.push((base ? base + " " : "") + a);
          if (next.length >= 12) break;
        }
        if (next.length >= 12) break;
      }
      combos = next;
    }
    // Dedupe, cap at 6.
    return Array.from(new Set(combos.map((c) => c.trim()).filter(Boolean))).slice(0, 6);
  }
  /* The alternative transcripts from the most recent listen() call. */
  function lastAlternatives() { return listen._alternatives || []; }

  /* ----- Pronunciation scoring ----- */
  function normalize(s) {
    return s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "") // strip accents
      .replace(/[^a-z0-9\s']/g, " ")   // strip punctuation
      .replace(/\s+/g, " ")
      .trim();
  }

  /* Fold a French word to a rough phonetic key so spellings that SOUND alike
   * compare as equal (the STT engine often returns a homophone of what you said).
   * e.g. "manger"/"mangé"/"mangez" → same key; silent endings dropped. */
  function phon(w) {
    let x = normalize(w);
    x = x
      .replace(/eaux?$/,"o").replace(/aux$/,"o").replace(/eau/g,"o")
      .replace(/(er|ez|ai|ais|ait|aient|é|ée|ées|és)$/,"e")
      .replace(/ent$/,"")          // silent 3rd-person plural ending
      .replace(/[hxstdpz]$/,"")    // common silent final consonants
      .replace(/qu/g,"k").replace(/c([eiy])/g,"s$1").replace(/c/g,"k")
      .replace(/ph/g,"f").replace(/gn/g,"n")
      .replace(/ou/g,"u").replace(/(ai|ei)/g,"e").replace(/au/g,"o")
      .replace(/(in|im|ain|ein)/g,"1").replace(/(on|om)/g,"2").replace(/(an|am|en|em)/g,"3")
      .replace(/(.)\1+/g,"$1")     // collapse doubled letters
      .replace(/[\s']/g,"");
    return x;
  }

  function levenshtein(a, b) {
    const m = a.length, n = b.length;
    if (!m) return n;
    if (!n) return m;
    const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      }
    }
    return dp[m][n];
  }

  function strSim(a, b) {
    if (a === b) return 1;
    const d = levenshtein(a, b);
    const maxLen = Math.max(a.length, b.length) || 1;
    return Math.max(0, 1 - d / maxLen);
  }
  // Word similarity = best of literal spelling and phonetic (sound-alike) match.
  function wordSimilar(a, b) {
    const literal = strSim(a, b);
    const phonetic = strSim(phon(a), phon(b));
    return Math.max(literal, phonetic * 0.97); // phonetic match nearly as good as exact
  }

  // Score one heard transcript against the target. Returns {score, words}.
  function scoreOne(tWords, heard) {
    const hWords = normalize(heard).split(" ").filter(Boolean);
    const usedH = new Array(hWords.length).fill(false);
    const wordResults = tWords.map((tw) => {
      let bestIdx = -1, best = 0;
      for (let i = 0; i < hWords.length; i++) {
        if (usedH[i]) continue;
        const sim = wordSimilar(tw, hWords[i]);
        if (sim > best) { best = sim; bestIdx = i; }
      }
      const ok = best >= 0.78;
      if (ok && bestIdx >= 0) usedH[bestIdx] = true;
      return { word: tw, ok, sim: best };
    });
    const matched = wordResults.filter((w) => w.ok).length;
    const ratio = matched / tWords.length;
    const avgSim = wordResults.reduce((s, w) => s + w.sim, 0) / tWords.length;
    const score = Math.round((ratio * 0.6 + avgSim * 0.4) * 100);
    return { score, words: wordResults };
  }

  /**
   * Compare target vs what was heard. Returns:
   *   { score: 0-100, words: [{ word, ok }], heard }
   * `heard` may be a string OR an array of candidate transcripts (the engine's
   * alternatives). We score the target against EVERY candidate and keep the best,
   * so a correct pronunciation isn't failed just because the engine's #1 guess was
   * a homophone. Pass Speech.lastAlternatives() as extra candidates for best results.
   */
  function scorePronunciation(target, heard, extraCandidates) {
    const tWords = normalize(target).split(" ").filter(Boolean);
    if (!tWords.length) return { score: 0, words: [], heard: "" };

    let candidates = [];
    if (Array.isArray(heard)) candidates = heard.slice();
    else if (heard) candidates = [heard];
    if (Array.isArray(extraCandidates)) candidates = candidates.concat(extraCandidates);
    candidates = Array.from(new Set(candidates.map((c) => (c || "").trim()).filter(Boolean)));
    if (!candidates.length) return { score: 0, words: tWords.map((w) => ({ word: w, ok: false, sim: 0 })), heard: "" };

    let best = null, bestHeard = candidates[0];
    for (const cand of candidates) {
      const r = scoreOne(tWords, cand);
      if (!best || r.score > best.score) { best = r; bestHeard = cand; }
    }
    return { score: best.score, words: best.words, heard: bestHeard };
  }

  return {
    speak,
    speakEnglish,
    speakBilingual,
    pickEnglishVoice,
    englishVoices,
    rankedEnglishVoices,
    chosenFamily,
    familyMember,
    SINGLE_FAMILIES,
    cancel,
    neuralAvailable,
    useNeural,
    listen,
    stopListening,
    isListening,
    lastAlternatives,
    scorePronunciation,
    normalize,
    sttSupported,
    frenchVoices,
    rankedFrenchVoices,
    voiceQuality,
    pickVoice,
    loadVoices,
  };
})();
