# Parle — French TCF Prep (A1 → C1)

A browser app to prepare for the **French TCF exam** by *communicating* and learning
**pronunciation**: the app speaks French phrases aloud, you repeat them, and it scores
your pronunciation and coaches you — all the way up to **C1**.

Covers all four TCF skills:

| Tab | Skill | What it does |
|-----|-------|--------------|
| 🗣️ **Speak** | Pronunciation (Expression orale) | Hear a phrase → say it → get a score + word-by-word diff + AI phonetic coaching. Builds a spaced-repetition review queue. |
| 💬 **Talk** | Speaking / conversation | Chat with an AI French tutor that speaks its replies aloud, corrects you, and runs the 3 TCF speaking tasks. |
| 🎧 **Listen** | Compréhension orale | A French passage is spoken aloud → comprehension multiple-choice questions. |
| 📖 **Read** | Compréhension écrite | Read a passage → comprehension questions. |
| ✍️ **Write** | Expression écrite | Do a TCF writing task → AI grades it on TCF criteria with a CEFR band and concrete fixes. |
| 📈 **Progress** | — | Mastery per skill, XP, streak, level, and reviews due. |

A placement test sets your starting level; you unlock A2 → B1 → B2 → C1 as your average
mastery rises.

## How to run

No install, no build step. **Use Chrome or Edge** (see browser note below).

Option A — open the file directly:
- Double-click `index.html`, or open it in Chrome.

Option B — serve it locally (recommended; some browsers restrict the microphone on `file://`):

```bash
cd ~/Downloads/french_tcf_app
python3 -m http.server 8000
```
Then open <http://localhost:8000> in Chrome.

## API key (for the AI tutor)

The conversation tutor, freshly generated reading/listening passages, and writing/speaking
grading use the **Anthropic API** (model `claude-opus-4-7`).

1. Open the app → click **⚙️ Settings**.
2. Paste your Anthropic API key (`sk-ant-...`). It's stored **only in this browser**
   (`localStorage`) and sent directly to Anthropic.
3. The status shows “✓ AI tutor enabled”.

Without a key, the app still works: pronunciation practice with scoring, audio (text-to-speech),
the placement test, and curated offline lessons/questions for every level.

## Browser support

- **Pronunciation scoring** (recording + transcribing your voice) uses the Web Speech API,
  which is reliable in **Chrome** and **Edge** only. In Safari/Firefox you can still hear
  audio, do the chat, reading, listening, and writing — but the “🎤 Say it” scoring is disabled.
- **Text-to-speech** (hearing French) works in all modern browsers. macOS ships excellent
  French voices (Thomas, Jacques, Amélie); pick one in Settings → French voice.

## Files

```
index.html            app shell, tabs, settings modal
css/styles.css        styles (responsive; works on phone)
js/app.js             state, router, settings, home, progress, leveling
js/speech.js          TTS + STT + pronunciation scoring (Levenshtein word match)
js/claude.js          Anthropic SDK wrapper (browser, prompt caching, graceful no-key)
js/pronunciation.js   Speak tab
js/conversation.js    Talk tab (AI tutor + TCF speaking tasks)
js/listening.js       Listen tab
js/reading.js         Read tab + shared MCQ engine
js/writing.js         Write tab (AI TCF grading)
js/placement.js       placement test
data/curriculum.js    A1→C1 vocab, grammar, phonetics
data/tcf_tasks.js     TCF task templates + offline MCQ banks
```

Your progress, level, XP and API key live in the browser's `localStorage` — clearing site
data resets everything (or use Settings → Reset all progress).

## Privacy note

The API key is stored in `localStorage` and sent from the browser straight to Anthropic via
the official SDK (`dangerouslyAllowBrowser`). That's fine for personal local use; don't deploy
this publicly with your key embedded.

Bonne chance pour le TCF ! 🇫🇷
