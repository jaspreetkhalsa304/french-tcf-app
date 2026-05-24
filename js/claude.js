/* ===== Claude AI tutor wrapper =====
 * Calls the Anthropic API directly from the browser with the user's pasted key.
 * Model: claude-opus-4-7. Adaptive thinking. Prompt caching on the (stable) system
 * prompt so repeated calls in a session are cheap.
 *
 * Everything degrades gracefully: if no key is set, hasKey() is false and callers
 * fall back to offline content.
 */
window.AI = (function () {
  const MODEL = "claude-opus-4-7";
  let client = null;
  let clientKey = null;

  function getKey() {
    return (localStorage.getItem("tcf_api_key") || "").trim();
  }
  function hasKey() {
    return getKey().length > 10;
  }

  function ensureClient() {
    const key = getKey();
    if (!key) return null;
    if (client && clientKey === key) return client;
    if (!window.Anthropic) return null; // SDK not loaded yet
    client = new window.Anthropic({ apiKey: key, dangerouslyAllowBrowser: true });
    clientKey = key;
    return client;
  }

  /* Extract concatenated text from a response's content blocks. */
  function textOf(resp) {
    if (!resp || !resp.content) return "";
    return resp.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();
  }

  /**
   * Low-level call. `system` is cached (stable prefix); `messages` is the volatile turn data.
   * Returns the assistant text. Throws on API/auth/network errors so callers can surface them.
   */
  async function call({ system, messages, maxTokens = 1400, thinking = true, jsonSchema = null }) {
    const c = ensureClient();
    if (!c) throw new Error("no-key");

    const params = {
      model: MODEL,
      max_tokens: maxTokens,
      // Cache the stable system prompt so multi-turn chats and repeated drills are cheap.
      system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
      messages,
    };
    if (thinking) params.thinking = { type: "adaptive" };
    if (jsonSchema) {
      params.output_config = { format: { type: "json_schema", schema: jsonSchema } };
    }

    const resp = await c.messages.create(params);
    return textOf(resp);
  }

  /* Best-effort JSON parse (handles models that wrap JSON in prose/code fences). */
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
   * Have Claude judge a spoken attempt LENIENTLY.
   *
   * Chrome still does the listening; we hand Claude the target phrase plus EVERY
   * transcript Chrome guessed (its top result + alternatives). Claude decides
   * whether the learner actually said the target — forgiving French homophones
   * (manger/mangé/mangez), accent mishears, and minor word-order/elision noise
   * that a literal string-match wrongly fails.
   *
   * Returns { score:0-100, words:[{word, ok}], note } or null on failure
   * (callers keep the local score when this returns null).
   */
  async function gradePronunciation(target, candidates, level) {
    if (!hasKey()) return null;
    const cands = (Array.isArray(candidates) ? candidates : [candidates])
      .map((c) => (c || "").trim())
      .filter(Boolean);
    if (!cands.length) return null;

    const targetWords = String(target).trim().split(/\s+/);
    const schema = {
      type: "object",
      additionalProperties: false,
      properties: {
        score: { type: "integer", minimum: 0, maximum: 100 },
        words: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              word: { type: "string" },
              ok: { type: "boolean" },
            },
            required: ["word", "ok"],
          },
        },
        note: { type: "string" },
      },
      required: ["score", "words", "note"],
    };

    try {
      const text = await call({
        system:
          "You grade a French learner's SPOKEN attempt. Speech-to-text is imperfect, " +
          "so you receive the target phrase and SEVERAL machine transcripts of what the " +
          "learner may have said (the engine's best guess plus alternatives). Judge " +
          "GENEROUSLY whether the learner actually said the target:\n" +
          "• French homophones count as CORRECT (manger/mangé/mangez/mangez, et/est, " +
          "a/à, ou/où, son/sont, ces/ses/c'est, vingt/vin, mer/mère, etc.).\n" +
          "• Accent mishears, dropped silent letters, liaison artifacts, and small " +
          "word-order noise from the STT engine are NOT the learner's fault — forgive them.\n" +
          "• Only mark a target word wrong if NONE of the transcripts plausibly contain it " +
          "(sound-alikes included).\n" +
          "Return JSON only: a 0-100 score (how well it matches, lenient), a `words` array " +
          "with each TARGET word and whether it was said, and a short `note` (one sentence, " +
          "English, encouraging; mention a real sound to fix only if there's a genuine miss).",
        messages: [
          {
            role: "user",
            content:
              `Learner level: ${level || "A1"}.\n` +
              `TARGET phrase: "${target}"\n` +
              `Target words (grade each): ${JSON.stringify(targetWords)}\n` +
              `Machine transcripts (pick the most charitable reading across all):\n` +
              cands.map((c, i) => `  ${i + 1}. "${c}"`).join("\n"),
          },
        ],
        maxTokens: 600,
        jsonSchema: schema,
      });
      const data = parseJSON(text);
      if (!data || typeof data.score !== "number" || !Array.isArray(data.words)) return null;
      data.score = Math.max(0, Math.min(100, Math.round(data.score)));
      return data;
    } catch (_) {
      return null; // any failure → caller keeps the local score
    }
  }

  /* Friendly error message for the UI. */
  function describeError(e) {
    const msg = (e && e.message) || String(e);
    if (msg === "no-key") return "Add your Anthropic API key in Settings (⚙️) to use the AI tutor.";
    if (/401|authentication/i.test(msg)) return "Your API key was rejected. Check it in Settings.";
    if (/429|rate/i.test(msg)) return "Rate limited — wait a moment and try again.";
    if (/network|fetch|connection/i.test(msg)) return "Network error reaching the API.";
    if (/cors/i.test(msg)) return "Browser blocked the request (CORS). Try Chrome and a fresh key.";
    return "AI error: " + msg;
  }

  return { MODEL, hasKey, getKey, call, parseJSON, describeError, textOf, gradePronunciation };
})();
