/* ===== Structured lessons (school-style) =====
 * Each lesson teaches ONE concept the way a class would: a short explanation,
 * worked examples you can hear, then a quick check. Two tracks per level:
 *   - "Pronunciation" rules (how words sound)
 *   - "Sentences" (how to build/conjugate/structure)
 *
 * Lesson shape:
 *   { id, level, track, title, goal, steps:[...], quiz:[...] }
 * Step kinds:
 *   { type:"text", html }                       // explanation
 *   { type:"rule", html }                        // highlighted rule box
 *   { type:"examples", note, items:[{fr,ipa,en}] } // each row is playable (TTS on fr)
 *   { type:"say", fr, ipa, en }                  // "your turn" — hear + (optionally) say it
 * Quiz item: { q, options:[...], answer, explain }
 *
 * Everything is offline. Claude (if a key is set) can generate extra examples,
 * but the taught content below stands on its own.
 */
window.LESSONS = [
  /* ============================================================= */
  /* ============ TCF EXAM STRATEGY (the test itself) =========== */
  /* Track "Exam" — how the TCF works + tactics for each section.  */
  /* Tagged A1 so they're visible from the start.                  */
  /* ============================================================= */
  {
    id: "tcf0", level: "A1", track: "Exam",
    title: "How the TCF works (read this first)",
    goal: "Understand the exam map: sections, questions, timing and scoring.",
    steps: [
      { type: "text", html: "The <strong>TCF Tout Public</strong> measures your French from A1 to C2. You don't pass/fail — you get a <strong>score (out of 699)</strong> that maps to a CEFR level. Questions go from easy to hard within each section." },
      { type: "rule", html: "📝 <strong>3 mandatory sections</strong> (multiple choice, 1 correct of 4):<br>• <strong>Compréhension orale</strong> (listening) — 29 Q, ~25 min<br>• <strong>Structures de la langue</strong> (grammar/vocab) — 18 Q, ~15 min<br>• <strong>Compréhension écrite</strong> (reading) — 29 Q, ~45 min" },
      { type: "rule", html: "✍️🗣️ <strong>2 optional sections</strong> (often required for visas/immigration):<br>• <strong>Expression écrite</strong> (writing) — 3 tasks, 60 min<br>• <strong>Expression orale</strong> (speaking) — 3 tasks, 12 min (with an examiner)" },
      { type: "text", html: "💡 <strong>Strategy that matters everywhere:</strong> there's <em>no penalty</em> for wrong answers — so <strong>never leave a blank</strong>; always guess. Manage time: don't get stuck on one hard question. Each section gets <em>harder as it goes</em>, so bank the early easy points." },
      { type: "text", html: "This app trains all five: 🎧 Listen, 📖 Read, 🧩 Grammar/🗣️ Speak (structures), ✍️ Write, 💬 Talk (speaking). Use the level index to climb A1→C1." },
    ],
    quiz: [
      { q: "If you don't know an MCQ answer, you should…", options: ["leave it blank", "always guess — no penalty", "skip the section", "pick the longest option"], answer: 1, explain: "Wrong answers aren't penalised, so always answer every question." },
      { q: "How many mandatory (compulsory) sections does the TCF have?", options: ["1", "2", "3", "5"], answer: 2, explain: "Listening, Structures, and Reading are mandatory; writing & speaking are optional." },
      { q: "Within a section, the questions…", options: ["are random", "get harder as you go", "get easier", "are all the same level"], answer: 1, explain: "Difficulty rises from A1 toward C2 — secure the early points." },
    ],
  },
  {
    id: "tcf1", level: "A1", track: "Exam",
    title: "Listening section (Compréhension orale) tactics",
    goal: "Score higher on the 29 listening questions you hear only once.",
    steps: [
      { type: "rule", html: "🎧 You hear each recording <strong>once</strong>. 29 questions, ~25 min. Audio includes ads, announcements, dialogues, interviews, then longer talks." },
      { type: "text", html: "<strong>Tactic 1 — read first.</strong> Before the audio plays, read the question and options. You'll know what to listen for (a number? a place? an opinion?)." },
      { type: "text", html: "<strong>Tactic 2 — catch keywords, not every word.</strong> Listen for the answer-bearing word (a time, a price, a reason). Don't panic at unknown words." },
      { type: "text", html: "<strong>Tactic 3 — beware traps.</strong> Recordings often mention a wrong option to mislead (e.g. they say 'not quai 2, but quai 3'). Listen to the <em>whole</em> sentence before choosing." },
      { type: "rule", html: "🔢 Drill the things that carry answers: <strong>numbers, times, dates, prices, places</strong> (do the A1 'Numbers, time & dates' lesson). These are the most common listening answers at lower levels." },
    ],
    quiz: [
      { q: "How many times do you hear each TCF listening recording?", options: ["Once", "Twice", "As many as you like", "Three times"], answer: 0, explain: "Only once — so read the question first and stay focused." },
      { q: "Best thing to do BEFORE the audio plays?", options: ["Close your eyes", "Read the question and options", "Write notes in English", "Nothing"], answer: 1, explain: "Reading first tells you what to listen for." },
    ],
  },
  {
    id: "tcf2", level: "A1", track: "Exam",
    title: "Reading & Structures sections tactics",
    goal: "Work fast and accurately through the 29 reading + 18 grammar questions.",
    steps: [
      { type: "rule", html: "📖 <strong>Compréhension écrite</strong>: 29 Q, ~45 min — signs, ads, emails, articles, then complex texts. <br>🧩 <strong>Structures de la langue</strong>: 18 Q, ~15 min — fill-the-gap grammar & vocabulary." },
      { type: "text", html: "<strong>Reading tactic — scan, then read.</strong> Read the question first, then scan the text for the relevant part. You rarely need every word. Watch for <em>négation</em> and connectors (mais, donc, cependant) that flip meaning." },
      { type: "text", html: "<strong>Structures tactic — spot the trigger.</strong> Each gap tests one rule: a verb tense, a pronoun, an article, a preposition, an agreement. Identify <em>what</em> is being tested, then apply the rule. Read the whole sentence for clues (time words → tense; à/de → pronoun)." },
      { type: "rule", html: "⏱️ <strong>Pace yourself:</strong> reading has ~90 sec/question — but early ones are quick, so bank time for the hard end. Structures should be ~50 sec each. Flag-and-move if stuck." },
      { type: "text", html: "📚 Everything the Structures section tests is in this app's 🧩 Grammar tab and the Sentences lessons — object pronouns, tenses, prepositions, relatives, subjunctive. Drill the quizzes." },
    ],
    quiz: [
      { q: "In the Structures section, each question mainly tests…", options: ["your handwriting", "one specific grammar/vocab rule", "your accent", "general opinion"], answer: 1, explain: "Identify the rule under test (tense, pronoun, preposition…) and apply it." },
      { q: "A good reading tactic is to…", options: ["read every word slowly", "read the question first, then scan", "answer without reading", "translate the whole text"], answer: 1, explain: "Question-first scanning is faster and targets the answer." },
    ],
  },
  {
    id: "tcf3", level: "A2", track: "Exam",
    title: "Writing section (Expression écrite) — the 3 tasks",
    goal: "Know exactly what each writing task wants and how it's scored.",
    steps: [
      { type: "rule", html: "✍️ 3 tasks, 60 min total, rising difficulty:<br>• <strong>Tâche 1</strong> (~A1–A2): a short message/note — describe, invite, thank. ~60–120 words.<br>• <strong>Tâche 2</strong> (~B1): a report/article about an experience. ~120–150 words.<br>• <strong>Tâche 3</strong> (~B2–C1): compare two opinions, then argue your own. ~120–180 words." },
      { type: "text", html: "<strong>Graded on:</strong> doing what the task asks (don't go off-topic), organisation (clear paragraphs + connectors), range (varied vocab & structures), and accuracy (grammar, spelling, agreement)." },
      { type: "text", html: "<strong>Tactic — use a skeleton.</strong> Tâche 3: intro (present the debate) → paragraph for side A → side B → your nuanced opinion → short conclusion. Glue it with <em>d'une part… d'autre part, cependant, en revanche, en conclusion</em>." },
      { type: "rule", html: "⏱️ Budget ~10 / 20 / 30 min across the three tasks. Leave 3–4 min to <strong>proofread</strong>: check verb endings, gender agreement, and accents — easy points." },
      { type: "text", html: "💡 Practice these exact tasks in the ✍️ Write tab — the AI grades you on the real TCF criteria and gives a CEFR band + fixes." },
    ],
    quiz: [
      { q: "Tâche 3 (the hardest) asks you to…", options: ["write a shopping list", "compare two viewpoints and argue your own", "translate a text", "describe a photo"], answer: 1, explain: "It's an argumentative essay: two sides + your nuanced position." },
      { q: "Which is NOT a grading criterion?", options: ["staying on task", "organisation & connectors", "your handwriting speed", "grammar accuracy"], answer: 2, explain: "Speed isn't graded; task fit, organisation, range and accuracy are." },
    ],
  },
  {
    id: "tcf4", level: "A2", track: "Exam",
    title: "Speaking section (Expression orale) — the 3 tasks",
    goal: "Walk into the 12-minute oral knowing the format and how to shine.",
    steps: [
      { type: "rule", html: "🗣️ One-on-one with an examiner, 12 min (2 min prep), 3 tasks:<br>• <strong>Tâche 1</strong> (~2 min, no prep): guided interview — talk about yourself, work/studies, hobbies, family.<br>• <strong>Tâche 2</strong> (~3.5 min): an interactive task — you ask the examiner questions to organise something (a trip, an event, a purchase).<br>• <strong>Tâche 3</strong> (~4.5 min): express and defend an opinion on a topic." },
      { type: "text", html: "<strong>Graded on:</strong> fluency & ease, range of vocab/structures, pronunciation & intonation, and how well you fulfil the task. <em>Keep talking</em> — silence costs more than small mistakes." },
      { type: "text", html: "<strong>Tâche 1 tactic:</strong> prepare a 90-second self-intro you can always give (name, où vous habitez, métier/études, loisirs, famille). <strong>Tâche 2:</strong> remember it's <em>you</em> asking the questions — prepare question forms (Est-ce que…? Combien…? À quelle heure…?). <strong>Tâche 3:</strong> opinion → 2 reasons → example → restate. Use <em>je pense que, selon moi, par exemple, en conclusion</em>." },
      { type: "rule", html: "💬 Practise all three in the 💬 Talk tab (TCF speaking tasks + the AI examiner), and drill pronunciation/intonation in 🗣️ Speak and the pronunciation lessons." },
    ],
    quiz: [
      { q: "In Tâche 2 of the oral, who asks the questions?", options: ["The examiner", "You", "Nobody", "A recording"], answer: 1, explain: "You drive the interaction — prepare your question forms." },
      { q: "If you're unsure mid-answer, you should…", options: ["stop and stay silent", "keep talking and rephrase", "switch to English", "ask to restart"], answer: 1, explain: "Fluency is graded; keep going and self-correct rather than freezing." },
    ],
  },

  /* ============ A1 — PRONUNCIATION ============ */
  {
    id: "a1p1", level: "A1", track: "Pronunciation",
    title: "Silent letters & final consonants",
    goal: "Learn why many French letters aren't pronounced — the #1 thing that confuses beginners.",
    steps: [
      { type: "text", html: "French is <em>not</em> read the way it's written. Many letters are silent, especially at the <strong>end</strong> of words. This is normal and follows clear patterns." },
      { type: "rule", html: "📏 <strong>Rule 1:</strong> A final consonant is usually <strong>silent</strong>. Think of the word <em>PaRiS</em> → only the start is said." },
      { type: "examples", note: "Listen — the last letter is silent:", items: [
        { fr: "Paris", ipa: "paʁi", en: "the final 's' is silent" },
        { fr: "petit", ipa: "pəti", en: "the 't' is silent" },
        { fr: "grand", ipa: "ɡʁɑ̃", en: "the 'd' is silent" },
        { fr: "vous", ipa: "vu", en: "the 's' is silent" },
      ]},
      { type: "rule", html: "📏 <strong>Rule 2 — CaReFuL:</strong> the consonants <strong>C, R, F, L</strong> are often <em>pronounced</em> at the end (remember the word \"CaReFuL\")." },
      { type: "examples", note: "Here the final letter IS said:", items: [
        { fr: "avec", ipa: "avɛk", en: "'c' is pronounced — 'avek'" },
        { fr: "bonjour", ipa: "bɔ̃ʒuʁ", en: "'r' is pronounced" },
        { fr: "neuf", ipa: "nœf", en: "'f' is pronounced" },
        { fr: "il", ipa: "il", en: "'l' is pronounced" },
      ]},
      { type: "rule", html: "📏 <strong>Rule 3:</strong> the letter <strong>H</strong> is <em>always</em> silent. And final <strong>-e</strong> is usually silent too (but it makes the consonant before it sound)." },
      { type: "examples", note: "Compare:", items: [
        { fr: "homme", ipa: "ɔm", en: "h silent → 'om'" },
        { fr: "petit / petite", ipa: "pəti / pətit", en: "the -e makes the 't' sound in 'petite'" },
      ]},
      { type: "say", fr: "Je suis petit.", ipa: "ʒə sɥi pəti", en: "Your turn — the final 's' and 't' are silent." },
    ],
    quiz: [
      { q: "How is the final 's' in « Paris » pronounced?", options: ["like 'ss'", "silent", "like 'z'", "like 'sh'"], answer: 1, explain: "Final consonants are usually silent — Paris = /paʁi/." },
      { q: "Which word has a PRONOUNCED final consonant?", options: ["petit", "grand", "avec", "vous"], answer: 2, explain: "'avec' ends in C (CaReFuL) so the 'c' is said: /avɛk/." },
      { q: "The letter H in « homme » is…", options: ["pronounced hard", "silent", "like 'k'", "rolled"], answer: 1, explain: "H is always silent in French." },
    ],
  },
  {
    id: "a1p2", level: "A1", track: "Pronunciation",
    title: "The vowel u (and u vs ou)",
    goal: "Master the French 'u' — a sound English doesn't have — and tell it apart from 'ou'.",
    steps: [
      { type: "text", html: "The French <strong>u</strong> (as in <em>tu</em>) has no English equivalent. The trick: say <strong>'ee'</strong> but round your lips as if to whistle." },
      { type: "rule", html: "👄 <strong>u</strong> = lips rounded + tongue forward (say 'ee' with kissing lips). <strong>ou</strong> = lips rounded + tongue back ('oo' as in English 'food')." },
      { type: "examples", note: "Hear the difference:", items: [
        { fr: "tu", ipa: "ty", en: "'you' — the special u" },
        { fr: "tout", ipa: "tu", en: "'all' — the ou = 'oo'" },
        { fr: "rue", ipa: "ʁy", en: "'street' — u" },
        { fr: "roue", ipa: "ʁu", en: "'wheel' — ou" },
        { fr: "vu", ipa: "vy", en: "'seen' — u" },
        { fr: "vous", ipa: "vu", en: "'you (formal)' — ou" },
      ]},
      { type: "say", fr: "Tu as vu la rue ?", ipa: "ty a vy la ʁy", en: "Your turn — three 'u' sounds in a row." },
    ],
    quiz: [
      { q: "To make the French 'u', you…", options: ["say 'oo' like food", "say 'ee' with rounded lips", "say 'uh'", "say 'yoo'"], answer: 1, explain: "u = tongue forward ('ee') + rounded lips." },
      { q: "Which word uses the 'oo' (ou) sound?", options: ["tu", "rue", "vous", "vu"], answer: 2, explain: "'vous' = /vu/, the back 'oo' sound." },
    ],
  },
  {
    id: "a1p3", level: "A1", track: "Pronunciation",
    title: "Liaison — linking words together",
    goal: "Understand why « les amis » sounds like 'lay-zami' — French links words.",
    steps: [
      { type: "text", html: "In French, a normally-silent final consonant often <strong>links</strong> to the next word if it starts with a vowel. This is called <strong>liaison</strong>, and it's why spoken French flows together." },
      { type: "rule", html: "🔗 silent final consonant + word starting with a vowel → the consonant is pronounced and 'glides' into the next word. <strong>s</strong> and <strong>x</strong> link as a <em>'z'</em> sound." },
      { type: "examples", note: "Hear the link:", items: [
        { fr: "les amis", ipa: "lez‿ami", en: "'lay-zami' — the s links as 'z'" },
        { fr: "vous avez", ipa: "vuz‿ave", en: "'voo-zavay'" },
        { fr: "un grand homme", ipa: "œ̃ ɡʁɑ̃t‿ɔm", en: "the d links as 't'" },
        { fr: "deux enfants", ipa: "døz‿ɑ̃fɑ̃", en: "the x links as 'z'" },
      ]},
      { type: "text", html: "Without liaison, « les amis » would sound like 'lay ami' — but a native always links it. Listen again and copy the smooth join." },
      { type: "say", fr: "Vous avez deux amis.", ipa: "vuz‿ave døz‿ami", en: "Your turn — link 'vous_avez' and 'deux_amis'." },
    ],
    quiz: [
      { q: "« les amis » is pronounced…", options: ["'lay ami'", "'lay-zami'", "'les amis'", "'luh ami'"], answer: 1, explain: "Liaison: the final 's' links to the vowel as 'z' → 'lay-zami'." },
      { q: "In liaison, a final 's' or 'x' links as which sound?", options: ["'s'", "'z'", "'sh'", "silent"], answer: 1, explain: "s/x become a 'z' sound in liaison." },
    ],
  },

  /* ============ A1 — SENTENCES ============ */
  {
    id: "a1s1", level: "A1", track: "Sentences",
    title: "Your first sentences: être (to be)",
    goal: "Build basic sentences with the most important verb in French: être.",
    steps: [
      { type: "text", html: "A sentence needs a <strong>subject</strong> (who) + a <strong>verb</strong> (action) + the rest. The verb <strong>être</strong> (to be) is the foundation. It's irregular, so we memorize it." },
      { type: "rule", html: "📒 <strong>être</strong>: je <strong>suis</strong> (I am) · tu <strong>es</strong> (you are) · il/elle <strong>est</strong> (he/she is) · nous <strong>sommes</strong> (we are) · vous <strong>êtes</strong> (you are, formal/plural) · ils/elles <strong>sont</strong> (they are)." },
      { type: "examples", note: "Hear full sentences:", items: [
        { fr: "Je suis étudiant.", ipa: "ʒə sɥiz‿etydjɑ̃", en: "I am a student." },
        { fr: "Tu es français.", ipa: "ty ɛ fʁɑ̃sɛ", en: "You are French." },
        { fr: "Elle est gentille.", ipa: "ɛl ɛ ʒɑ̃tij", en: "She is kind." },
        { fr: "Nous sommes amis.", ipa: "nu sɔmz‿ami", en: "We are friends." },
      ]},
      { type: "rule", html: "🚫 <strong>Negation:</strong> put <strong>ne … pas</strong> around the verb. « Je <strong>ne</strong> suis <strong>pas</strong> fatigué. » = I am not tired." },
      { type: "examples", note: "Negative sentences:", items: [
        { fr: "Je ne suis pas fatigué.", ipa: "ʒə nə sɥi pa fatiɡe", en: "I am not tired." },
        { fr: "Il n'est pas là.", ipa: "il nɛ pa la", en: "He is not here. (ne→n' before a vowel)" },
      ]},
      { type: "build", fr: "Je ne suis pas fatigué.", en: "I am not tired." },
      { type: "say", fr: "Je suis content et tu es content.", ipa: "ʒə sɥi kɔ̃tɑ̃ e ty ɛ kɔ̃tɑ̃", en: "Your turn — 'I am happy and you are happy.'" },
    ],
    quiz: [
      { q: "« I am a student » =", options: ["Je es étudiant", "Je suis étudiant", "Je est étudiant", "Je sommes étudiant"], answer: 1, explain: "je → suis." },
      { q: "Make it negative: « Il est là » →", options: ["Il est ne pas là", "Il ne est pas là", "Il n'est pas là", "Il est pas ne là"], answer: 2, explain: "ne … pas around the verb; ne→n' before the vowel of 'est'." },
      { q: "« Nous ___ amis » (we are friends)", options: ["sommes", "êtes", "sont", "est"], answer: 0, explain: "nous → sommes." },
    ],
  },
  {
    id: "a1s2", level: "A1", track: "Sentences",
    title: "avoir (to have) & articles",
    goal: "Use avoir and the words for 'a/the' to talk about things you have.",
    steps: [
      { type: "rule", html: "📒 <strong>avoir</strong>: j'<strong>ai</strong> · tu <strong>as</strong> · il/elle <strong>a</strong> · nous <strong>avons</strong> · vous <strong>avez</strong> · ils/elles <strong>ont</strong>." },
      { type: "text", html: "French nouns have a <strong>gender</strong> (masculine or feminine). The article changes with it." },
      { type: "rule", html: "🔤 <strong>'a/an':</strong> <strong>un</strong> (masc.) · <strong>une</strong> (fem.). &nbsp; <strong>'the':</strong> <strong>le</strong> (masc.) · <strong>la</strong> (fem.) · <strong>l'</strong> (before a vowel) · <strong>les</strong> (plural)." },
      { type: "examples", note: "Hear them:", items: [
        { fr: "J'ai un chien.", ipa: "ʒe œ̃ ʃjɛ̃", en: "I have a dog. (masc.)" },
        { fr: "J'ai une voiture.", ipa: "ʒe yn vwatyʁ", en: "I have a car. (fem.)" },
        { fr: "le livre / la table", ipa: "lə livʁ / la tabl", en: "the book (m) / the table (f)" },
        { fr: "l'ami / les amis", ipa: "lami / lez‿ami", en: "the friend / the friends" },
      ]},
      { type: "say", fr: "J'ai une question.", ipa: "ʒe yn kɛstjɔ̃", en: "Your turn — 'I have a question.'" },
    ],
    quiz: [
      { q: "« I have a dog » =", options: ["J'ai une chien", "J'ai un chien", "Je ai un chien", "J'as un chien"], answer: 1, explain: "j'ai + un (chien is masculine)." },
      { q: "Which means 'the' before a vowel, e.g. ___ ami?", options: ["le", "la", "l'", "les"], answer: 2, explain: "le/la become l' before a vowel: l'ami." },
    ],
  },
  {
    id: "a1s3", level: "A1", track: "Sentences",
    title: "Asking questions",
    goal: "Ask simple questions three different ways.",
    steps: [
      { type: "text", html: "There are three common ways to ask a yes/no question in French — from most casual to most formal." },
      { type: "rule", html: "❓ <strong>1. Intonation</strong> (rise your voice): « Tu viens ? » <br>❓ <strong>2. Est-ce que</strong> at the front: « Est-ce que tu viens ? » <br>❓ <strong>3. Inversion</strong> (verb-subject): « Viens-tu ? » (formal)." },
      { type: "examples", note: "Same question, three styles:", items: [
        { fr: "Tu parles français ?", ipa: "ty paʁl fʁɑ̃sɛ", en: "casual — voice rises at the end" },
        { fr: "Est-ce que tu parles français ?", ipa: "ɛs kə ty paʁl fʁɑ̃sɛ", en: "neutral — 'est-ce que' = 'is it that'" },
        { fr: "Parlez-vous français ?", ipa: "paʁle vu fʁɑ̃sɛ", en: "formal — inversion" },
      ]},
      { type: "rule", html: "🔑 Question words: <strong>où</strong> (where), <strong>quand</strong> (when), <strong>comment</strong> (how), <strong>pourquoi</strong> (why), <strong>qui</strong> (who), <strong>combien</strong> (how much)." },
      { type: "build", fr: "Est-ce que tu parles français ?", en: "Do you speak French?" },
      { type: "say", fr: "Est-ce que tu as un stylo ?", ipa: "ɛs kə ty a œ̃ stilo", en: "Your turn — 'Do you have a pen?'" },
    ],
    quiz: [
      { q: "Which is the FORMAL way to ask 'Do you speak French?'", options: ["Tu parles français ?", "Est-ce que tu parles français ?", "Parlez-vous français ?", "Français tu parles ?"], answer: 2, explain: "Inversion (verb-subject) is the formal register." },
      { q: "« ___ tu viens ? » to mean 'when do you come?'", options: ["Où", "Quand", "Comment", "Combien"], answer: 1, explain: "quand = when." },
    ],
  },

  /* ============ A2 ============ */
  {
    id: "a2p1", level: "A2", track: "Pronunciation",
    title: "The nasal vowels: on / an / in",
    goal: "Produce the three nasal vowels that give French its characteristic sound.",
    steps: [
      { type: "text", html: "When a vowel is followed by <strong>n</strong> or <strong>m</strong>, it often becomes <strong>nasal</strong> — air comes out through the nose and the n/m itself is <em>not</em> pronounced as a consonant." },
      { type: "rule", html: "👃 <strong>on/om</strong> → /ɔ̃/ (bon) · <strong>an/am/en/em</strong> → /ɑ̃/ (grand) · <strong>in/im/ain/ein</strong> → /ɛ̃/ (vin) · <strong>un</strong> → /œ̃/ (un)." },
      { type: "examples", note: "Hear each nasal:", items: [
        { fr: "bon", ipa: "bɔ̃", en: "on → /ɔ̃/" },
        { fr: "grand", ipa: "ɡʁɑ̃", en: "an → /ɑ̃/" },
        { fr: "vin", ipa: "vɛ̃", en: "in → /ɛ̃/" },
        { fr: "un pain", ipa: "œ̃ pɛ̃", en: "un /œ̃/ + ain /ɛ̃/" },
      ]},
      { type: "rule", html: "⚠️ If the n/m is doubled (nn, mm) or followed by a vowel, the vowel is <strong>NOT</strong> nasal: « bonne » = /bɔn/, « année » = /ane/." },
      { type: "examples", note: "Compare nasal vs not:", items: [
        { fr: "bon / bonne", ipa: "bɔ̃ / bɔn", en: "nasal vs normal n" },
        { fr: "an / année", ipa: "ɑ̃ / ane", en: "nasal vs normal n" },
      ]},
      { type: "say", fr: "Un bon vin blanc.", ipa: "œ̃ bɔ̃ vɛ̃ blɑ̃", en: "Your turn — four nasals in a row!" },
    ],
    quiz: [
      { q: "« bon » is pronounced with…", options: ["a hard 'n'", "a nasal /ɔ̃/, n not said", "a silent vowel", "an English 'on'"], answer: 1, explain: "on → nasal /ɔ̃/, the n isn't a separate consonant." },
      { q: "Why is « bonne » NOT nasal?", options: ["it's feminine", "the n is doubled", "it's plural", "it has an accent"], answer: 1, explain: "A doubled n (nn) blocks nasalization → /bɔn/." },
    ],
  },
  {
    id: "a2s1", level: "A2", track: "Sentences",
    title: "Talking about the past: passé composé",
    goal: "Form the most common past tense to say what you DID.",
    steps: [
      { type: "text", html: "To talk about a completed past action, French uses the <strong>passé composé</strong>: a helper verb (<strong>avoir</strong> or <strong>être</strong>) + the <strong>past participle</strong>." },
      { type: "rule", html: "🧱 <strong>avoir</strong> (most verbs) + participle: parler→parl<strong>é</strong>, finir→fin<strong>i</strong>, vendre→vend<strong>u</strong>. <br>« J'<strong>ai</strong> mang<strong>é</strong> » = I ate / I have eaten." },
      { type: "examples", note: "Hear them:", items: [
        { fr: "J'ai mangé une pizza.", ipa: "ʒe mɑ̃ʒe yn pitsa", en: "I ate a pizza." },
        { fr: "Tu as fini ?", ipa: "ty a fini", en: "Did you finish?" },
        { fr: "Nous avons vu le film.", ipa: "nuz‿avɔ̃ vy lə film", en: "We saw the film." },
      ]},
      { type: "rule", html: "🚶 Some verbs of <strong>movement</strong> use <strong>être</strong> (aller, venir, partir, arriver, rester, naître, mourir…). With être, the participle <strong>agrees</strong>: « Elle est all<strong>ée</strong> »." },
      { type: "examples", note: "être verbs:", items: [
        { fr: "Je suis allé au marché.", ipa: "ʒə sɥiz‿ale o maʁʃe", en: "I went to the market." },
        { fr: "Elle est arrivée.", ipa: "ɛl ɛt‿aʁive", en: "She arrived. (+e agreement)" },
      ]},
      { type: "build", fr: "Nous avons vu le film hier.", en: "We saw the film yesterday." },
      { type: "say", fr: "Hier, j'ai visité Paris.", ipa: "jɛʁ ʒe vizite paʁi", en: "Your turn — 'Yesterday I visited Paris.'" },
    ],
    quiz: [
      { q: "« I ate » =", options: ["Je mange", "J'ai mangé", "Je suis mangé", "J'ai manger"], answer: 1, explain: "avoir (ai) + participle mangé." },
      { q: "Which verb takes ÊTRE in the passé composé?", options: ["manger", "finir", "aller", "vendre"], answer: 2, explain: "aller is a movement verb → être: je suis allé." },
      { q: "« Elle est ___ » (she went)", options: ["allé", "allée", "aller", "allez"], answer: 1, explain: "With être, the participle agrees with the feminine subject: allée." },
    ],
  },
  {
    id: "a2s2", level: "A2", track: "Sentences",
    title: "The near future: aller + infinitive",
    goal: "Talk about what you're GOING to do — the easiest future tense.",
    steps: [
      { type: "text", html: "The simplest way to talk about the future is the <strong>futur proche</strong> (near future): conjugate <strong>aller</strong> (to go) + a verb in the <strong>infinitive</strong>. Just like English 'I'm going to…'." },
      { type: "rule", html: "📒 <strong>aller</strong>: je <strong>vais</strong> · tu <strong>vas</strong> · il/elle <strong>va</strong> · nous <strong>allons</strong> · vous <strong>allez</strong> · ils/elles <strong>vont</strong>. <br>Then add the infinitive: « Je <strong>vais manger</strong>. » = I'm going to eat." },
      { type: "examples", note: "Hear it:", items: [
        { fr: "Je vais voyager en France.", ipa: "ʒə vɛ vwajaʒe ɑ̃ fʁɑ̃s", en: "I'm going to travel to France." },
        { fr: "Tu vas réussir.", ipa: "ty va ʁeysiʁ", en: "You're going to succeed." },
        { fr: "Nous allons partir demain.", ipa: "nuz‿alɔ̃ paʁtiʁ dəmɛ̃", en: "We're going to leave tomorrow." },
      ]},
      { type: "rule", html: "🚫 Negative: <strong>ne … pas</strong> around <em>aller</em>. « Je <strong>ne vais pas</strong> sortir. » = I'm not going to go out." },
      { type: "build", fr: "Nous allons partir demain.", en: "We are going to leave tomorrow." },
      { type: "say", fr: "Je vais étudier le français.", ipa: "ʒə vɛ etydje lə fʁɑ̃sɛ", en: "Your turn — 'I'm going to study French.'" },
    ],
    quiz: [
      { q: "« We are going to leave » =", options: ["Nous partons", "Nous allons partir", "Nous avons parti", "Nous partir allons"], answer: 1, explain: "aller (allons) + infinitive partir." },
      { q: "« Tu ___ manger » (you're going to eat)", options: ["va", "vas", "vais", "vont"], answer: 1, explain: "tu → vas." },
      { q: "Make negative: « Je vais sortir » →", options: ["Je vais ne pas sortir", "Je ne vais pas sortir", "Je vais pas ne sortir", "Je ne sortir pas vais"], answer: 1, explain: "ne … pas wraps the conjugated verb aller." },
    ],
  },
  {
    id: "a2s3", level: "A2", track: "Sentences",
    title: "Reflexive verbs (se laver, se lever)",
    goal: "Describe daily routine with verbs that act on yourself.",
    steps: [
      { type: "text", html: "<strong>Reflexive verbs</strong> describe actions you do to <em>yourself</em> — washing, getting up, going to bed. They carry an extra pronoun (me, te, se…)." },
      { type: "rule", html: "📒 <strong>se laver</strong> (to wash oneself): je <strong>me</strong> lave · tu <strong>te</strong> laves · il/elle <strong>se</strong> lave · nous <strong>nous</strong> lavons · vous <strong>vous</strong> lavez · ils/elles <strong>se</strong> lavent. Before a vowel, me/te/se → m'/t'/s'." },
      { type: "examples", note: "Daily routine:", items: [
        { fr: "Je me lève à sept heures.", ipa: "ʒə mə lɛv a sɛt œʁ", en: "I get up at seven." },
        { fr: "Tu te laves les mains.", ipa: "ty tə lav le mɛ̃", en: "You wash your hands." },
        { fr: "Il s'appelle Marc.", ipa: "il sapɛl maʁk", en: "His name is Marc. (se→s')" },
        { fr: "Nous nous couchons tard.", ipa: "nu nu kuʃɔ̃ taʁ", en: "We go to bed late." },
      ]},
      { type: "rule", html: "⏪ In the passé composé, reflexive verbs use <strong>être</strong>: « Je <strong>me suis</strong> levé(e). » = I got up." },
      { type: "say", fr: "Je me lave et je m'habille.", ipa: "ʒə mə lav e ʒə mabij", en: "Your turn — 'I wash and I get dressed.'" },
    ],
    quiz: [
      { q: "« I get up » =", options: ["Je lève", "Je me lève", "Je se lève", "Me je lève"], answer: 1, explain: "Reflexive: je + me + lève." },
      { q: "« Il ___ appelle Marc »", options: ["se", "s'", "te", "me"], answer: 1, explain: "se → s' before the vowel of 'appelle'." },
      { q: "Reflexive verbs in the past use which helper?", options: ["avoir", "être", "aller", "faire"], answer: 1, explain: "Always être: je me suis levé(e)." },
    ],
  },
  {
    id: "a2s4", level: "A2", track: "Sentences",
    title: "Possessives & comparatives",
    goal: "Say 'my/your/his' and compare things (more/less/as … as).",
    steps: [
      { type: "text", html: "Possessive adjectives agree with the <strong>thing owned</strong> (not the owner), so they change with gender and number." },
      { type: "rule", html: "📒 my = <strong>mon</strong> (m) / <strong>ma</strong> (f) / <strong>mes</strong> (pl). your = <strong>ton/ta/tes</strong>. his/her = <strong>son/sa/ses</strong>. our = <strong>notre/nos</strong>. <br>⚠️ Before a vowel, ma/ta/sa → mon/ton/son: « <strong>mon</strong> amie »." },
      { type: "examples", note: "Possessives:", items: [
        { fr: "mon frère / ma sœur / mes parents", ipa: "mɔ̃ fʁɛʁ / ma sœʁ / me paʁɑ̃", en: "my brother / my sister / my parents" },
        { fr: "C'est son livre.", ipa: "sɛ sɔ̃ livʁ", en: "It's his/her book." },
      ]},
      { type: "rule", html: "⚖️ <strong>Comparatives:</strong> <strong>plus … que</strong> (more than), <strong>moins … que</strong> (less than), <strong>aussi … que</strong> (as … as). « Il est <strong>plus</strong> grand <strong>que</strong> moi. »" },
      { type: "examples", note: "Comparing:", items: [
        { fr: "Elle est plus rapide que lui.", ipa: "ɛl ɛ ply ʁapid kə lɥi", en: "She is faster than him." },
        { fr: "C'est moins cher que ça.", ipa: "sɛ mwɛ̃ ʃɛʁ kə sa", en: "It's cheaper than that." },
        { fr: "Je suis aussi grand que toi.", ipa: "ʒə sɥiz‿osi ɡʁɑ̃ kə twa", en: "I'm as tall as you." },
      ]},
      { type: "say", fr: "Ma voiture est plus rapide que ton vélo.", ipa: "ma vwatyʁ ɛ ply ʁapid kə tɔ̃ velo", en: "Your turn — 'My car is faster than your bike.'" },
    ],
    quiz: [
      { q: "« ___ sœur » (my sister, feminine)", options: ["mon", "ma", "mes", "me"], answer: 1, explain: "ma + feminine noun sœur." },
      { q: "Before a vowel, « ma amie » becomes…", options: ["ma amie", "mon amie", "mes amie", "m'amie"], answer: 1, explain: "ma→mon before a vowel for sound: mon amie." },
      { q: "« He is taller than me » = « Il est ___ grand ___ moi »", options: ["aussi / que", "plus / que", "moins / de", "très / que"], answer: 1, explain: "plus … que = more … than." },
    ],
  },

  /* ============ B1 ============ */
  {
    id: "b1s1", level: "B1", track: "Sentences",
    title: "Imparfait vs passé composé",
    goal: "Choose the right past tense — the classic B1 challenge.",
    steps: [
      { type: "text", html: "French has two past tenses that work together. Getting them right is what makes you sound fluent." },
      { type: "rule", html: "🎬 <strong>Passé composé</strong> = a specific, completed action ('what happened'). <br>🖼️ <strong>Imparfait</strong> = background, description, habit, ongoing state ('what was going on / used to be')." },
      { type: "examples", note: "See how they combine:", items: [
        { fr: "Je dormais quand le téléphone a sonné.", ipa: "ʒə dɔʁmɛ kɑ̃ lə telefɔn a sɔne", en: "I was sleeping (imparfait) when the phone rang (passé composé)." },
        { fr: "Quand j'étais petit, je jouais au foot.", ipa: "kɑ̃ ʒetɛ pəti ʒə ʒwɛ o fut", en: "When I was little, I used to play football. (habit → imparfait)" },
        { fr: "Hier, il a plu toute la journée.", ipa: "jɛʁ il a ply tut la ʒuʁne", en: "Yesterday it rained all day. (completed → passé composé)" },
      ]},
      { type: "rule", html: "🔑 Cue words: <em>soudain, tout à coup, hier, une fois</em> → passé composé. &nbsp; <em>souvent, toujours, tous les jours, quand j'étais</em> → imparfait." },
      { type: "say", fr: "Il faisait beau, alors nous sommes sortis.", ipa: "il fəzɛ bo alɔʁ nu sɔm suʁti", en: "Your turn — description (imparfait) + action (passé composé)." },
    ],
    quiz: [
      { q: "« Quand j'étais jeune, je ___ beaucoup. » (habit: travel)", options: ["ai voyagé", "voyageais", "voyagerai", "voyage"], answer: 1, explain: "A repeated past habit → imparfait: voyageais." },
      { q: "« Soudain, il ___ . » (a sudden action: leave)", options: ["partait", "est parti", "part", "partira"], answer: 1, explain: "'Soudain' signals a sudden completed action → passé composé." },
    ],
  },
  {
    id: "b1s2", level: "B1", track: "Sentences",
    title: "The simple future (futur simple)",
    goal: "State what WILL happen — the 'real' future tense.",
    steps: [
      { type: "text", html: "Beyond 'going to', French has the <strong>futur simple</strong> for what <em>will</em> happen. For most verbs: take the infinitive and add the endings." },
      { type: "rule", html: "🧱 Endings: -<strong>ai</strong>, -<strong>as</strong>, -<strong>a</strong>, -<strong>ons</strong>, -<strong>ez</strong>, -<strong>ont</strong>. <br>parler → je parler<strong>ai</strong>, tu parler<strong>as</strong>… (drop final -e of -re verbs: prendre → je prendr<strong>ai</strong>)." },
      { type: "examples", note: "Hear it:", items: [
        { fr: "Je parlerai français couramment.", ipa: "ʒə paʁləʁe fʁɑ̃sɛ kuʁamɑ̃", en: "I will speak French fluently." },
        { fr: "Nous finirons demain.", ipa: "nu finiʁɔ̃ dəmɛ̃", en: "We will finish tomorrow." },
        { fr: "Ils prendront le train.", ipa: "il pʁɑ̃dʁɔ̃ lə tʁɛ̃", en: "They will take the train." },
      ]},
      { type: "rule", html: "📌 Common irregular stems: être→<strong>ser-</strong>, avoir→<strong>aur-</strong>, aller→<strong>ir-</strong>, faire→<strong>fer-</strong>, venir→<strong>viendr-</strong>, voir→<strong>verr-</strong>, pouvoir→<strong>pourr-</strong>. « Je <strong>serai</strong>, j'<strong>aurai</strong>, j'<strong>irai</strong>. »" },
      { type: "examples", note: "Irregulars:", items: [
        { fr: "Je serai prêt.", ipa: "ʒə səʁe pʁɛ", en: "I will be ready. (être→ser-)" },
        { fr: "Tu auras le temps.", ipa: "ty oʁa lə tɑ̃", en: "You will have time. (avoir→aur-)" },
      ]},
      { type: "say", fr: "Un jour, je visiterai la France.", ipa: "œ̃ ʒuʁ ʒə vizitəʁe la fʁɑ̃s", en: "Your turn — 'One day, I will visit France.'" },
    ],
    quiz: [
      { q: "« I will speak » =", options: ["je parle", "je vais parler", "je parlerai", "je parlais"], answer: 2, explain: "futur simple: parler + ai = parlerai." },
      { q: "Future stem of « être » is…", options: ["êtr-", "ser-", "aur-", "fer-"], answer: 1, explain: "être → ser-: je serai." },
      { q: "« Nous ___ » (we will finish: finir)", options: ["finissons", "finirons", "finirions", "avons fini"], answer: 1, explain: "finir + ons = finirons." },
    ],
  },
  {
    id: "b1s3", level: "B1", track: "Sentences",
    title: "Relative pronouns: qui & que",
    goal: "Join two ideas into one richer sentence with 'who/which/that'.",
    steps: [
      { type: "text", html: "Relative pronouns link a noun to extra information, turning two short sentences into one fluent one. The choice between <strong>qui</strong> and <strong>que</strong> depends on its job in the clause." },
      { type: "rule", html: "🔗 <strong>qui</strong> = SUBJECT of the clause (does the action) → « l'homme <strong>qui</strong> parle » (the man who speaks). <br><strong>que</strong> = OBJECT (receives the action) → « le livre <strong>que</strong> je lis » (the book that I read). que→qu' before a vowel." },
      { type: "examples", note: "Hear the difference:", items: [
        { fr: "C'est la personne qui m'a aidé.", ipa: "sɛ la pɛʁsɔn ki ma ede", en: "That's the person who helped me. (qui = subject)" },
        { fr: "Voici le livre que j'aime.", ipa: "vwasi lə livʁ kə ʒɛm", en: "Here's the book that I like. (que = object)" },
        { fr: "La ville où j'habite.", ipa: "la vil u ʒabit", en: "The city where I live. (où = where)" },
      ]},
      { type: "rule", html: "💡 Quick test: if a <em>verb</em> follows directly → <strong>qui</strong>. If a <em>subject</em> (je, tu, il…) follows → <strong>que</strong>." },
      { type: "build", fr: "C'est la personne qui m'a aidé.", en: "That's the person who helped me." },
      { type: "say", fr: "C'est le film que je préfère.", ipa: "sɛ lə film kə ʒə pʁefɛʁ", en: "Your turn — 'It's the film that I prefer.'" },
    ],
    quiz: [
      { q: "« L'homme ___ parle est mon père » (a verb follows)", options: ["qui", "que", "où", "dont"], answer: 0, explain: "A verb (parle) follows → qui (subject)." },
      { q: "« Le gâteau ___ tu as fait » (a subject 'tu' follows)", options: ["qui", "que", "où", "quoi"], answer: 1, explain: "A subject (tu) follows → que (object)." },
    ],
  },
  {
    id: "b1s4", level: "B1", track: "Sentences",
    title: "The pronouns y and en",
    goal: "Replace places and quantities to avoid repeating yourself.",
    steps: [
      { type: "text", html: "Two small but essential pronouns let you speak more naturally by replacing whole phrases." },
      { type: "rule", html: "📍 <strong>y</strong> replaces <em>à + a place/thing</em> ('there', 'to it'). « Je vais <strong>à Paris</strong> → J'<strong>y</strong> vais. » <br>🔢 <strong>en</strong> replaces <em>de + something</em> or a quantity ('some', 'of it'). « J'ai <strong>des pommes</strong> → J'<strong>en</strong> ai. »" },
      { type: "examples", note: "Hear them:", items: [
        { fr: "Tu vas au marché ? — Oui, j'y vais.", ipa: "ty va o maʁʃe / wi ʒi vɛ", en: "Going to the market? — Yes, I'm going (there)." },
        { fr: "Tu veux du café ? — Oui, j'en veux.", ipa: "ty vø dy kafe / wi ʒɑ̃ vø", en: "Want some coffee? — Yes, I want some." },
        { fr: "J'en ai trois.", ipa: "ʒɑ̃n‿e tʁwa", en: "I have three (of them)." },
      ]},
      { type: "rule", html: "📌 Place: the pronoun goes <strong>before</strong> the verb. With quantities, 'en' is required even when the number stays: « J'en ai <strong>deux</strong>. »" },
      { type: "build", fr: "J'en ai trois.", en: "I have three (of them)." },
      { type: "say", fr: "J'y pense souvent et j'en parle beaucoup.", ipa: "ʒi pɑ̃s suvɑ̃ e ʒɑ̃ paʁl boku", en: "Your turn — 'I think about it often and talk about it a lot.'" },
    ],
    quiz: [
      { q: "« Je vais à Lyon » → replace the place:", options: ["J'en vais", "J'y vais", "Je le vais", "Je vais y"], answer: 1, explain: "à + place → y, before the verb: j'y vais." },
      { q: "« Tu as des stylos ? — Oui, j'___ ai cinq. »", options: ["y", "en", "les", "le"], answer: 1, explain: "Quantity → en: j'en ai cinq." },
    ],
  },
  {
    id: "b1s5", level: "B1", track: "Sentences",
    title: "Connecting ideas (connectors)",
    goal: "Link sentences smoothly to express cause, contrast and sequence.",
    steps: [
      { type: "text", html: "Fluent French strings ideas together with <strong>connectors</strong> instead of short choppy sentences. These also raise your TCF writing and speaking scores." },
      { type: "rule", html: "🔧 Cause: <strong>parce que</strong> (because), <strong>car</strong> (for/since), <strong>donc</strong> (so). Contrast: <strong>mais</strong> (but), <strong>cependant</strong> (however), <strong>pourtant</strong> (yet). Sequence: <strong>d'abord</strong> (first), <strong>ensuite</strong> (then), <strong>enfin</strong> (finally)." },
      { type: "examples", note: "Hear connected sentences:", items: [
        { fr: "Je reste, parce qu'il pleut.", ipa: "ʒə ʁɛst paʁs kil plø", en: "I'm staying because it's raining." },
        { fr: "C'est cher, cependant je l'achète.", ipa: "sɛ ʃɛʁ səpɑ̃dɑ̃ ʒə laʃɛt", en: "It's expensive; however, I'll buy it." },
        { fr: "D'abord on mange, ensuite on sort.", ipa: "dabɔʁ ɔ̃ mɑ̃ʒ ɑ̃sɥit ɔ̃ sɔʁ", en: "First we eat, then we go out." },
      ]},
      { type: "say", fr: "Je suis fatigué, donc je vais dormir.", ipa: "ʒə sɥi fatiɡe dɔ̃k ʒə vɛ dɔʁmiʁ", en: "Your turn — 'I'm tired, so I'm going to sleep.'" },
    ],
    quiz: [
      { q: "Which connector expresses CONTRAST?", options: ["donc", "parce que", "cependant", "ensuite"], answer: 2, explain: "cependant = however (contrast)." },
      { q: "« Il pleut, ___ je prends un parapluie » (so/therefore)", options: ["mais", "donc", "car", "pourtant"], answer: 1, explain: "donc = so/therefore (result)." },
    ],
  },
  {
    id: "b1p1", level: "B1", track: "Pronunciation",
    title: "The 'e muet' (dropping the silent e)",
    goal: "Speak more naturally by dropping e's the way native speakers do.",
    steps: [
      { type: "text", html: "In casual speech, the short <strong>e</strong> sound (e muet / schwa) is often <strong>dropped</strong>, making French faster and more connected." },
      { type: "rule", html: "🗣️ « je ne sais pas » in fast speech → 'jə n'sé pa' → even 'chais pas'. The written e's disappear when speaking." },
      { type: "examples", note: "Careful vs natural:", items: [
        { fr: "je ne sais pas", ipa: "ʒə nə sɛ pa", en: "careful, full form" },
        { fr: "j'sais pas", ipa: "ʃɛ pa", en: "natural, fast — e's dropped" },
        { fr: "petit", ipa: "p(ə)ti", en: "the e can vanish: 'pti'" },
        { fr: "samedi", ipa: "sam(ə)di", en: "'sam-di'" },
      ]},
      { type: "say", fr: "Je te le donne demain.", ipa: "ʒ(ə) t(ə) l(ə) dɔn dəmɛ̃", en: "Your turn — let the little e's almost disappear." },
    ],
    quiz: [
      { q: "In fast speech, « je ne sais pas » often becomes…", options: ["longer", "'jsais pas' (e's dropped)", "fully spelled out", "a question"], answer: 1, explain: "The e muet drops in casual speech." },
    ],
  },

  /* ============ B2 ============ */
  {
    id: "b2s1", level: "B2", track: "Sentences",
    title: "The subjunctive (le subjonctif)",
    goal: "Use the subjunctive after expressions of wish, doubt, emotion and necessity.",
    steps: [
      { type: "text", html: "The <strong>subjunctive</strong> is a verb mood for things that are <em>wished, doubted, feared, or required</em> — not stated as fact. It appears after « que »." },
      { type: "rule", html: "🎯 Triggers: <em>il faut que, je veux que, je doute que, bien que, pour que, avant que, je suis content que…</em> → subjunctive. <br>Endings (présent): -e, -es, -e, -ions, -iez, -ent. « que je <strong>parle</strong>, que nous <strong>parlions</strong> »." },
      { type: "examples", note: "Hear it in use:", items: [
        { fr: "Il faut que tu partes maintenant.", ipa: "il fo kə ty paʁt mɛ̃tnɑ̃", en: "You must leave now. (necessity)" },
        { fr: "Je doute qu'il vienne.", ipa: "ʒə dut kil vjɛn", en: "I doubt he'll come. (doubt — irregular venir→vienne)" },
        { fr: "Bien que ce soit difficile…", ipa: "bjɛ̃ kə sə swa difisil", en: "Although it is difficult… (être→soit)" },
      ]},
      { type: "rule", html: "📌 Key irregulars: être→<strong>sois/soit</strong>, avoir→<strong>aie/ait</strong>, aller→<strong>aille</strong>, faire→<strong>fasse</strong>, pouvoir→<strong>puisse</strong>." },
      { type: "build", fr: "Il faut que tu partes maintenant.", en: "You must leave now." },
      { type: "say", fr: "Je veux que vous soyez prêts.", ipa: "ʒə vø kə vu swaje pʁɛ", en: "Your turn — 'I want you to be ready.' (être→soyez)" },
    ],
    quiz: [
      { q: "« Il faut que je ___ » (partir)", options: ["pars", "parte", "partirai", "partais"], answer: 1, explain: "'Il faut que' triggers the subjunctive: que je parte." },
      { q: "Subjunctive of être for 'il': « bien qu'il ___ »", options: ["est", "soit", "sera", "était"], answer: 1, explain: "être → (qu'il) soit." },
      { q: "Which does NOT trigger the subjunctive?", options: ["je veux que", "je doute que", "je pense que", "il faut que"], answer: 2, explain: "'je pense que' (affirmative opinion = fact) takes the indicative, not subjunctive." },
    ],
  },
  {
    id: "b2s2", level: "B2", track: "Sentences",
    title: "The conditional (conditionnel)",
    goal: "Express 'would', make polite requests, and talk about hypotheticals.",
    steps: [
      { type: "text", html: "The <strong>conditionnel</strong> expresses what <em>would</em> happen, softens requests to be polite, and completes 'if' sentences." },
      { type: "rule", html: "🧱 Form: future stem + <strong>imparfait</strong> endings (-ais, -ais, -ait, -ions, -iez, -aient). « je parler<strong>ais</strong>, je ser<strong>ais</strong>, j'aimer<strong>ais</strong> »." },
      { type: "examples", note: "Hear it:", items: [
        { fr: "J'aimerais un café, s'il vous plaît.", ipa: "ʒɛməʁɛz‿œ̃ kafe", en: "I would like a coffee, please. (polite)" },
        { fr: "Je voudrais voyager.", ipa: "ʒə vudʁɛ vwajaʒe", en: "I would like to travel." },
        { fr: "Tu pourrais m'aider ?", ipa: "ty puʁɛ mede", en: "Could you help me?" },
      ]},
      { type: "rule", html: "🔀 <strong>Si</strong> (if) sentences: « Si + <strong>imparfait</strong>, → <strong>conditionnel</strong>. » « Si j'<strong>avais</strong> le temps, je <strong>viendrais</strong>. » = If I had time, I would come. <br>Past hypothetical: « Si + plus-que-parfait → conditionnel passé »: « Si j'avais su, je serais venu. »" },
      { type: "examples", note: "Hypotheticals:", items: [
        { fr: "Si j'étais riche, je voyagerais.", ipa: "si ʒetɛ ʁiʃ ʒə vwajaʒəʁɛ", en: "If I were rich, I would travel." },
        { fr: "Si j'avais su, je serais venu.", ipa: "si ʒavɛ sy ʒə səʁɛ vəny", en: "Had I known, I would have come." },
      ]},
      { type: "say", fr: "Je voudrais réserver une table.", ipa: "ʒə vudʁɛ ʁezɛʁve yn tabl", en: "Your turn — 'I would like to book a table.'" },
    ],
    quiz: [
      { q: "« I would like » (polite) =", options: ["je veux", "je voudrais", "je voulais", "je voudrai"], answer: 1, explain: "Conditional voudrais softens the request." },
      { q: "« Si j'avais le temps, je ___ » (would come)", options: ["viens", "viendrai", "viendrais", "venais"], answer: 2, explain: "Si + imparfait → conditionnel: viendrais." },
      { q: "Conditional endings are borrowed from which tense?", options: ["present", "imparfait", "passé composé", "subjunctive"], answer: 1, explain: "Future stem + imparfait endings." },
    ],
  },
  {
    id: "b2s3", level: "B2", track: "Sentences",
    title: "The passive voice",
    goal: "Shift focus from who acts to what is acted upon.",
    steps: [
      { type: "text", html: "In the <strong>passive voice</strong>, the subject <em>receives</em> the action instead of doing it — like English 'was made', 'is written'." },
      { type: "rule", html: "🧱 Form: <strong>être</strong> (in any tense) + <strong>past participle</strong>, which <strong>agrees</strong> with the subject. The doer (if named) follows <strong>par</strong>. « La lettre <strong>est écrite par</strong> Marie. »" },
      { type: "examples", note: "Hear it:", items: [
        { fr: "Ce livre est lu par tous.", ipa: "sə livʁ ɛ ly paʁ tus", en: "This book is read by everyone." },
        { fr: "La décision a été prise hier.", ipa: "la desizjɔ̃ a ete pʁiz jɛʁ", en: "The decision was made yesterday." },
        { fr: "Les fenêtres seront fermées.", ipa: "le fənɛtʁ səʁɔ̃ fɛʁme", en: "The windows will be closed. (agreement: -es)" },
      ]},
      { type: "rule", html: "💡 French often <em>avoids</em> the passive with <strong>on</strong>: « <strong>On</strong> a pris la décision. » = 'The decision was made / They made the decision.'" },
      { type: "say", fr: "Ce film a été réalisé en France.", ipa: "sə film a ete ʁealize ɑ̃ fʁɑ̃s", en: "Your turn — 'This film was made in France.'" },
    ],
    quiz: [
      { q: "The passive is formed with…", options: ["avoir + participle", "être + participle (agreeing)", "aller + infinitive", "se + verb"], answer: 1, explain: "être + past participle, which agrees with the subject." },
      { q: "« La lettre ___ écrite par Marie » (present)", options: ["a", "est", "été", "sera"], answer: 1, explain: "Present passive: est + écrite." },
    ],
  },
  {
    id: "b2s4", level: "B2", track: "Sentences",
    title: "Reported (indirect) speech",
    goal: "Report what someone said without quoting them directly.",
    steps: [
      { type: "text", html: "<strong>Indirect speech</strong> reports words inside a clause with <strong>que</strong>, and the tense often <em>shifts back</em> when the reporting verb is in the past." },
      { type: "rule", html: "🔄 Direct → Indirect: present → imparfait, passé composé → plus-que-parfait, futur → conditionnel. « Il dit : 'Je <strong>viens</strong>.' » → « Il a dit qu'il <strong>venait</strong>. »" },
      { type: "examples", note: "Hear the shift:", items: [
        { fr: "Il a dit qu'il était fatigué.", ipa: "il a di kil etɛ fatiɡe", en: "He said (that) he was tired. (present→imparfait)" },
        { fr: "Elle a expliqué qu'elle avait fini.", ipa: "ɛl a ɛksplike kɛl avɛ fini", en: "She explained she had finished. (PC→plus-que-parfait)" },
        { fr: "Je pensais qu'il viendrait.", ipa: "ʒə pɑ̃sɛ kil vjɛ̃dʁɛ", en: "I thought he would come. (futur→conditionnel)" },
      ]},
      { type: "rule", html: "❓ Reported questions use <strong>si</strong> (whether) or the question word: « Il demande <strong>si</strong> tu viens. » / « Elle demande <strong>où</strong> tu vas. »" },
      { type: "say", fr: "Il a dit qu'il arriverait bientôt.", ipa: "il a di kil aʁivəʁɛ bjɛ̃to", en: "Your turn — 'He said he would arrive soon.'" },
    ],
    quiz: [
      { q: "« Il dit : 'Je suis prêt' » → « Il a dit qu'il ___ prêt »", options: ["est", "était", "sera", "soit"], answer: 1, explain: "Past reporting verb shifts present → imparfait: était." },
      { q: "A reported yes/no question uses…", options: ["que", "si", "qui", "dont"], answer: 1, explain: "« Il demande si tu viens. » — si = whether." },
    ],
  },
  {
    id: "b2p1", level: "B2", track: "Pronunciation",
    title: "Question intonation & rhythm",
    goal: "Sound natural with French rhythm and rising/falling intonation.",
    steps: [
      { type: "text", html: "French has <strong>even syllable timing</strong> (each syllable about equal length) and stress falls on the <strong>last</strong> syllable of a group — unlike English's bouncing stress." },
      { type: "rule", html: "🎵 Statement → voice <strong>falls</strong> at the end. Yes/no question by intonation → voice <strong>rises</strong> at the end. Stress the final syllable of each phrase group." },
      { type: "examples", note: "Same words, different melody:", items: [
        { fr: "Tu viens demain.", ipa: "ty vjɛ̃ dəmɛ̃ ↘", en: "statement — falls" },
        { fr: "Tu viens demain ?", ipa: "ty vjɛ̃ dəmɛ̃ ↗", en: "question — rises" },
        { fr: "C'est intéressant.", ipa: "sɛt‿ɛ̃teʁesɑ̃", en: "stress the last syllable: -ssant" },
      ]},
      { type: "say", fr: "Vous travaillez ici ?", ipa: "vu tʁavaje isi ↗", en: "Your turn — let your voice rise at the end." },
    ],
    quiz: [
      { q: "In a yes/no question by intonation, your voice should…", options: ["fall at the end", "rise at the end", "stay flat", "rise then fall"], answer: 1, explain: "Rising intonation marks the question." },
      { q: "French stress falls on which syllable of a group?", options: ["the first", "the last", "the middle", "none"], answer: 1, explain: "French stresses the final syllable of a rhythmic group." },
    ],
  },

  /* ============ C1 ============ */
  {
    id: "c1s1", level: "C1", track: "Sentences",
    title: "Register & sophisticated connectors",
    goal: "Structure complex argument and shift register like an advanced speaker.",
    steps: [
      { type: "text", html: "At C1 you organize ideas with precise <strong>connectors</strong> and adjust <strong>register</strong> (formal vs casual). This is what the TCF rewards in speaking and writing." },
      { type: "rule", html: "🔧 Argument connectors: <em>en effet</em> (indeed), <em>néanmoins / toutefois</em> (nevertheless), <em>par ailleurs</em> (moreover), <em>en revanche</em> (on the other hand), <em>force est de constater que</em> (one must admit that), <em>il n'en demeure pas moins que</em> (it nonetheless remains that)." },
      { type: "examples", note: "Hear refined phrasing:", items: [
        { fr: "En effet, les chiffres confirment cette tendance.", ipa: "ɑ̃n‿efɛ le ʃifʁ kɔ̃fiʁm sɛt tɑ̃dɑ̃s", en: "Indeed, the figures confirm this trend." },
        { fr: "Néanmoins, certaines réserves s'imposent.", ipa: "neɑ̃mwɛ̃ sɛʁtɛn ʁezɛʁv sɛ̃poz", en: "Nevertheless, certain reservations are warranted." },
        { fr: "Il n'en demeure pas moins que le problème persiste.", ipa: "il nɑ̃ dəmœʁ pa mwɛ̃ kə lə pʁɔblɛm pɛʁsist", en: "It nonetheless remains that the problem persists." },
      ]},
      { type: "rule", html: "🎚️ Register: <em>familier</em> « Ouais, c'est nul » → <em>courant</em> « Non, ça ne me plaît pas » → <em>soutenu</em> « Cela ne saurait me convenir »." },
      { type: "say", fr: "Force est de constater que la situation a évolué.", ipa: "fɔʁs‿ɛ də kɔ̃state kə la sitɥasjɔ̃ a evɔlɥe", en: "Your turn — a soutenu opener for an argument." },
    ],
    quiz: [
      { q: "Which connector means 'nevertheless' (formal)?", options: ["en effet", "néanmoins", "par exemple", "donc"], answer: 1, explain: "néanmoins / toutefois = nevertheless." },
      { q: "« Cela ne saurait me convenir » is which register?", options: ["familier", "courant", "soutenu", "argotique"], answer: 2, explain: "It's soutenu — elevated/formal register." },
    ],
  },
  {
    id: "c1s2", level: "C1", track: "Sentences",
    title: "Subjonctif passé & concordance des temps",
    goal: "Use the past subjunctive and keep tenses in agreement.",
    steps: [
      { type: "text", html: "When a subjunctive trigger refers to a <em>completed</em> action, use the <strong>subjonctif passé</strong>. Mastering tense agreement (<strong>concordance des temps</strong>) is a hallmark of C1." },
      { type: "rule", html: "🧱 <strong>Subjonctif passé</strong> = subjunctive of avoir/être + past participle: « Je doute qu'il <strong>ait fini</strong>. » = I doubt he has finished. « Bien qu'elle <strong>soit partie</strong>… » = Although she has left…" },
      { type: "examples", note: "Hear it:", items: [
        { fr: "Je suis content que tu sois venu.", ipa: "ʒə sɥi kɔ̃tɑ̃ kə ty swa vəny", en: "I'm glad you came. (completed → subjonctif passé)" },
        { fr: "Bien qu'il ait travaillé, il a échoué.", ipa: "bjɛ̃ kil ɛ tʁavaje il a eʃwe", en: "Although he worked, he failed." },
        { fr: "Il faudra que vous ayez terminé avant midi.", ipa: "il fodʁa kə vuz‿eje tɛʁmine avɑ̃ midi", en: "You'll need to have finished before noon." },
      ]},
      { type: "rule", html: "⏳ <strong>Concordance:</strong> match the subordinate tense to the main verb. Present main → present/passé subjunctive; the action's <em>timing</em> (same time vs earlier) decides présent vs passé." },
      { type: "say", fr: "Je doute qu'ils aient compris.", ipa: "ʒə dut kilz‿ɛ kɔ̃pʁi", en: "Your turn — 'I doubt they have understood.'" },
    ],
    quiz: [
      { q: "« Je doute qu'il ___ fini » (he has finished)", options: ["a", "ait", "avait", "aura"], answer: 1, explain: "Subjonctif passé: subjunctive of avoir (ait) + participle." },
      { q: "Subjonctif passé combines the subjunctive of avoir/être with…", options: ["the infinitive", "the past participle", "the future stem", "the imparfait"], answer: 1, explain: "ait/soit + past participle." },
    ],
  },
  {
    id: "c1s3", level: "C1", track: "Sentences",
    title: "Nominalisation & stylistic inversion",
    goal: "Write densely and formally, the way advanced French texts do.",
    steps: [
      { type: "text", html: "Formal/written French prefers <strong>nouns</strong> over verbs (nominalisation) and uses <strong>inversion</strong> after certain adverbs — both raise your register." },
      { type: "rule", html: "🧱 <strong>Nominalisation:</strong> turn a verb into a noun. « Les prix <em>augmentent</em> » → « L'<strong>augmentation</strong> des prix ». « Le gouvernement <em>décide</em> » → « La <strong>décision</strong> du gouvernement »." },
      { type: "examples", note: "Verb → noun style:", items: [
        { fr: "L'augmentation des prix inquiète.", ipa: "loɡmɑ̃tasjɔ̃ de pʁi ɛ̃kjɛt", en: "The rise in prices is worrying." },
        { fr: "La mise en place du projet a réussi.", ipa: "la miz‿ɑ̃ plas dy pʁɔʒɛ a ʁeysi", en: "The setting-up of the project succeeded." },
      ]},
      { type: "rule", html: "🔄 <strong>Stylistic inversion:</strong> after <em>peut-être, ainsi, aussi (=therefore), sans doute</em>, invert verb-subject: « <strong>Peut-être a-t-il</strong> raison. » = Perhaps he is right. « <strong>Ainsi va</strong> la vie. »" },
      { type: "examples", note: "Inversion:", items: [
        { fr: "Peut-être a-t-il oublié.", ipa: "pøtɛtʁ a til ublije", en: "Perhaps he forgot. (inverted)" },
        { fr: "Sans doute viendra-t-elle.", ipa: "sɑ̃ dut vjɛ̃dʁa tɛl", en: "No doubt she will come." },
      ]},
      { type: "say", fr: "Ainsi s'achève notre discussion.", ipa: "ɛ̃si saʃɛv nɔtʁ diskysjɔ̃", en: "Your turn — 'Thus ends our discussion.'" },
    ],
    quiz: [
      { q: "Nominalise « les prix augmentent » →", options: ["les prix augmentation", "l'augmentation des prix", "augmenter les prix", "les prix sont augmentés"], answer: 1, explain: "Verb augmenter → noun l'augmentation des prix." },
      { q: "After « peut-être » at the start, you should…", options: ["keep normal order", "invert verb and subject", "use the subjunctive", "drop the subject"], answer: 1, explain: "Stylistic inversion: « Peut-être a-t-il raison. »" },
    ],
  },

  /* ============================================================= */
  /* ============ GAP-FILLER GRAMMAR & VOCAB LESSONS ============= */
  /* Added for full TCF coverage A1→C1. Same shape as above.       */
  /* ============================================================= */

  /* ---------- A1 additions ---------- */
  {
    id: "a1s4", level: "A1", track: "Sentences",
    title: "-er verbs in the present (the biggest verb group)",
    goal: "Conjugate regular -er verbs — 80% of all French verbs work this way.",
    steps: [
      { type: "text", html: "Most French verbs end in <strong>-er</strong> (parler, aimer, habiter, manger…). They all follow the <em>same</em> pattern, so learning one teaches you thousands." },
      { type: "rule", html: "📒 Drop <strong>-er</strong>, add: je -<strong>e</strong> · tu -<strong>es</strong> · il/elle -<strong>e</strong> · nous -<strong>ons</strong> · vous -<strong>ez</strong> · ils/elles -<strong>ent</strong>. <br>parler → je parl<strong>e</strong>, nous parl<strong>ons</strong>. (The -e, -es, -ent endings sound the same!)" },
      { type: "examples", note: "Hear the pattern:", items: [
        { fr: "Je parle français.", ipa: "ʒə paʁl fʁɑ̃sɛ", en: "I speak French." },
        { fr: "Nous habitons à Paris.", ipa: "nuz‿abitɔ̃ a paʁi", en: "We live in Paris." },
        { fr: "Ils aiment le café.", ipa: "ilz‿ɛm lə kafe", en: "They like coffee." },
      ]},
      { type: "rule", html: "🔑 The endings -e, -es, -ent are <strong>silent</strong> — « je parle », « tu parles », « ils parlent » all sound like /paʁl/. Only nous/-ons and vous/-ez are heard differently." },
      { type: "say", fr: "J'aime voyager et je parle un peu.", ipa: "ʒɛm vwajaʒe e ʒə paʁl œ̃ pø", en: "Your turn — 'I like to travel and I speak a little.'" },
    ],
    quiz: [
      { q: "« Nous ___ » (parler)", options: ["parle", "parles", "parlons", "parlent"], answer: 2, explain: "nous → -ons: parlons." },
      { q: "Which three forms sound identical?", options: ["je/nous/vous", "je/tu/ils(parlent)", "nous/vous/ils", "tu/nous/vous"], answer: 1, explain: "-e, -es, -ent are all silent → je parle = tu parles = ils parlent in sound." },
    ],
  },
  {
    id: "a1s5", level: "A1", track: "Sentences",
    title: "Numbers, time & dates",
    goal: "Count, tell the time, and say the date — essential for the TCF listening section.",
    steps: [
      { type: "rule", html: "🔢 Tricky numbers: 70 = <strong>soixante-dix</strong> (60+10), 80 = <strong>quatre-vingts</strong> (4×20), 90 = <strong>quatre-vingt-dix</strong> (4×20+10). 71 = soixante-et-onze, 99 = quatre-vingt-dix-neuf." },
      { type: "examples", note: "Hear them:", items: [
        { fr: "soixante-dix", ipa: "swasɑ̃t dis", en: "70" },
        { fr: "quatre-vingts", ipa: "katʁə vɛ̃", en: "80" },
        { fr: "quatre-vingt-quinze", ipa: "katʁə vɛ̃ kɛ̃z", en: "95" },
      ]},
      { type: "rule", html: "🕐 Time: « Il est <strong>trois heures</strong>. » (3:00) · « ...et quart » (:15) · « ...et demie » (:30) · « ...moins le quart » (:45). 24h clock is common: « quatorze heures trente » = 14:30." },
      { type: "examples", note: "Time & date:", items: [
        { fr: "Il est huit heures et demie.", ipa: "il ɛ ɥit‿œʁ e dəmi", en: "It's half past eight." },
        { fr: "On est le quinze mai.", ipa: "ɔ̃n‿ɛ lə kɛ̃z mɛ", en: "It's the 15th of May." },
        { fr: "lundi, mardi, mercredi…", ipa: "lœ̃di maʁdi mɛʁkʁədi", en: "Monday, Tuesday, Wednesday…" },
      ]},
      { type: "say", fr: "Le train part à quatorze heures quinze.", ipa: "lə tʁɛ̃ paʁ a katɔʁz‿œʁ kɛ̃z", en: "Your turn — 'The train leaves at 14:15.'" },
    ],
    quiz: [
      { q: "« quatre-vingts » means…", options: ["70", "80", "90", "60"], answer: 1, explain: "4×20 = 80." },
      { q: "« et demie » after an hour means…", options: ["quarter past", "half past", "quarter to", "o'clock"], answer: 1, explain: "et demie = :30 (half past)." },
    ],
  },

  /* ---------- A2 additions ---------- */
  {
    id: "a2s5", level: "A2", track: "Sentences",
    title: "Direct & indirect object pronouns (le/la/les, lui/leur)",
    goal: "Replace nouns with pronouns to stop repeating yourself — a TCF favourite.",
    steps: [
      { type: "text", html: "Instead of repeating a noun, French replaces it with a <strong>pronoun</strong> placed <em>before</em> the verb." },
      { type: "rule", html: "🎯 <strong>Direct</strong> (no preposition): me, te, <strong>le/la/les</strong>, nous, vous. « Je vois <em>Marie</em> → Je <strong>la</strong> vois. » <br>↪️ <strong>Indirect</strong> (à + person): me, te, <strong>lui</strong> (to him/her), nous, vous, <strong>leur</strong> (to them). « Je parle <em>à Paul</em> → Je <strong>lui</strong> parle. »" },
      { type: "examples", note: "Hear them:", items: [
        { fr: "Tu le connais ?", ipa: "ty lə kɔnɛ", en: "Do you know him/it? (le = direct)" },
        { fr: "Je lui téléphone.", ipa: "ʒə lɥi telefɔn", en: "I call him/her. (téléphoner à → lui)" },
        { fr: "Je leur ai écrit.", ipa: "ʒə lœʁ e ekʁi", en: "I wrote to them. (leur = indirect plural)" },
      ]},
      { type: "rule", html: "📌 The pronoun goes <strong>before</strong> the conjugated verb (or before the infinitive): « Je vais <strong>le</strong> faire. » me/te/le/la → m'/t'/l' before a vowel." },
      { type: "build", fr: "Je lui téléphone ce soir.", en: "I'm calling him/her this evening." },
      { type: "say", fr: "Je la vois et je lui parle.", ipa: "ʒə la vwa e ʒə lɥi paʁl", en: "Your turn — 'I see her and I talk to her.'" },
    ],
    quiz: [
      { q: "« Je vois Marie » → replace Marie:", options: ["Je lui vois", "Je la vois", "Je le vois", "Je vois la"], answer: 1, explain: "Marie = direct object, feminine → la, before the verb." },
      { q: "« Je parle à mes amis » → « Je ___ parle »", options: ["les", "leur", "lui", "y"], answer: 1, explain: "parler à + people, plural → leur (indirect)." },
    ],
  },
  {
    id: "a2s6", level: "A2", track: "Sentences",
    title: "Prepositions of place & countries (à, en, au, dans, chez)",
    goal: "Say where things are and where you're going — common in TCF tasks.",
    steps: [
      { type: "rule", html: "🌍 Cities → <strong>à</strong> (à Paris). Feminine countries → <strong>en</strong> (en France, en Italie). Masculine countries → <strong>au</strong> (au Japon, au Canada). Plural → <strong>aux</strong> (aux États-Unis)." },
      { type: "rule", html: "📦 Position: <strong>dans</strong> (in), <strong>sur</strong> (on), <strong>sous</strong> (under), <strong>devant</strong> (in front), <strong>derrière</strong> (behind), <strong>entre</strong> (between), <strong>chez</strong> (at someone's place: chez moi, chez le médecin)." },
      { type: "examples", note: "Hear them:", items: [
        { fr: "Je vais en France et au Portugal.", ipa: "ʒə vɛz‿ɑ̃ fʁɑ̃s e o pɔʁtyɡal", en: "I'm going to France and Portugal." },
        { fr: "Le livre est sur la table.", ipa: "lə livʁ ɛ syʁ la tabl", en: "The book is on the table." },
        { fr: "On dîne chez Marie.", ipa: "ɔ̃ din ʃe maʁi", en: "We're having dinner at Marie's." },
      ]},
      { type: "say", fr: "Je suis chez moi, devant la fenêtre.", ipa: "ʒə sɥi ʃe mwa dəvɑ̃ la fənɛtʁ", en: "Your turn — 'I'm at home, in front of the window.'" },
    ],
    quiz: [
      { q: "« Je vais ___ Japon » (masculine country)", options: ["en", "à", "au", "dans"], answer: 2, explain: "Masculine country → au: au Japon." },
      { q: "« at the doctor's » =", options: ["à le médecin", "dans le médecin", "chez le médecin", "sur le médecin"], answer: 2, explain: "chez + person/professional = at their place." },
    ],
  },

  /* ---------- B1 additions ---------- */
  {
    id: "b1s6", level: "B1", track: "Sentences",
    title: "Time: depuis, pendant, il y a, dans",
    goal: "Express duration and time reference precisely — a classic TCF structures trap.",
    steps: [
      { type: "rule", html: "⏳ <strong>depuis</strong> = since/for (action still going): « J'habite ici <strong>depuis</strong> 2020 / depuis trois ans. » (use the <em>present</em>!). <br><strong>pendant</strong> = for/during (a finished duration): « J'ai étudié <strong>pendant</strong> deux heures. »" },
      { type: "rule", html: "⏪ <strong>il y a</strong> = ago: « Je suis arrivé <strong>il y a</strong> deux jours. » <br>⏩ <strong>dans</strong> = in/within (future): « Je pars <strong>dans</strong> une heure. »" },
      { type: "examples", note: "Hear the contrast:", items: [
        { fr: "Je travaille ici depuis cinq ans.", ipa: "ʒə tʁavaj isi dəpɥi sɛ̃k ɑ̃", en: "I've worked here for five years. (still true → present)" },
        { fr: "J'ai voyagé pendant un mois.", ipa: "ʒe vwajaʒe pɑ̃dɑ̃ œ̃ mwa", en: "I travelled for a month. (finished)" },
        { fr: "Il est parti il y a une heure.", ipa: "il ɛ paʁti il j a yn œʁ", en: "He left an hour ago." },
        { fr: "Le film commence dans dix minutes.", ipa: "lə film kɔmɑ̃s dɑ̃ di minyt", en: "The film starts in ten minutes." },
      ]},
      { type: "build", fr: "Il est parti il y a une heure.", en: "He left an hour ago." },
      { type: "say", fr: "J'apprends le français depuis six mois.", ipa: "ʒapʁɑ̃ lə fʁɑ̃sɛ dəpɥi si mwa", en: "Your turn — 'I've been learning French for six months.'" },
    ],
    quiz: [
      { q: "« I have lived here for 3 years (still do) » = « J'habite ici ___ trois ans »", options: ["pendant", "depuis", "il y a", "dans"], answer: 1, explain: "Ongoing action → depuis + present tense." },
      { q: "« two days ago » =", options: ["depuis deux jours", "pendant deux jours", "il y a deux jours", "dans deux jours"], answer: 2, explain: "il y a = ago." },
    ],
  },
  {
    id: "b1s7", level: "B1", track: "Sentences",
    title: "The gérondif (en + -ant)",
    goal: "Say 'while/by doing something' in one neat construction.",
    steps: [
      { type: "text", html: "The <strong>gérondif</strong> expresses two actions at once, or the means of doing something — English '-ing' as in 'while eating', 'by working'." },
      { type: "rule", html: "🧱 Form: <strong>en</strong> + present participle (nous form minus -ons, add <strong>-ant</strong>). parler→parl<strong>ant</strong>, finir→finiss<strong>ant</strong>. Irregulars: être→étant, avoir→ayant, savoir→sachant." },
      { type: "examples", note: "Hear it:", items: [
        { fr: "Je chante en cuisinant.", ipa: "ʒə ʃɑ̃t ɑ̃ kɥizinɑ̃", en: "I sing while cooking. (simultaneous)" },
        { fr: "On apprend en pratiquant.", ipa: "ɔ̃n‿apʁɑ̃ ɑ̃ pʁatikɑ̃", en: "One learns by practising. (means)" },
        { fr: "Il est tombé en courant.", ipa: "il ɛ tɔ̃be ɑ̃ kuʁɑ̃", en: "He fell while running." },
      ]},
      { type: "rule", html: "📌 The gérondif's subject must be the <strong>same</strong> as the main verb's subject. For different subjects, use « pendant que » instead." },
      { type: "say", fr: "Je m'améliore en parlant tous les jours.", ipa: "ʒə mameljɔʁ ɑ̃ paʁlɑ̃ tu le ʒuʁ", en: "Your turn — 'I improve by speaking every day.'" },
    ],
    quiz: [
      { q: "Gérondif of « finir » =", options: ["en finir", "en finissant", "en finant", "en fini"], answer: 1, explain: "nous finissons → finiss- + ant = en finissant." },
      { q: "« One learns by practising » = « On apprend ___ »", options: ["en pratiquer", "en pratiquant", "pratiquant", "à pratiquer"], answer: 1, explain: "en + present participle = gérondif." },
    ],
  },

  /* ---------- B2 additions ---------- */
  {
    id: "b2s5", level: "B2", track: "Sentences",
    title: "Relative pronouns: dont, où, lequel",
    goal: "Use the advanced relatives that qui/que can't cover.",
    steps: [
      { type: "text", html: "Beyond qui/que, French has relatives for 'whose/of which', 'where/when', and prepositional cases." },
      { type: "rule", html: "🔗 <strong>dont</strong> = replaces <em>de</em> + noun ('whose', 'of which', 'about which'): « le film <strong>dont</strong> je parle » (the film I'm talking about), « l'homme <strong>dont</strong> la voiture est rouge » (whose car). <br><strong>où</strong> = where / when: « le jour <strong>où</strong> » (the day when)." },
      { type: "rule", html: "🔧 <strong>lequel / laquelle / lesquels</strong> = after a preposition for things: « la raison <strong>pour laquelle</strong> » (the reason for which), « le stylo <strong>avec lequel</strong> j'écris »." },
      { type: "examples", note: "Hear them:", items: [
        { fr: "C'est le livre dont je t'ai parlé.", ipa: "sɛ lə livʁ dɔ̃ ʒə te paʁle", en: "It's the book I told you about. (parler de → dont)" },
        { fr: "Voici la maison où je suis né.", ipa: "vwasi la mɛzɔ̃ u ʒə sɥi ne", en: "Here's the house where I was born." },
        { fr: "Le projet pour lequel je travaille.", ipa: "lə pʁɔʒɛ puʁ ləkɛl ʒə tʁavaj", en: "The project I work for." },
      ]},
      { type: "say", fr: "C'est une chose dont je suis fier.", ipa: "sɛt‿yn ʃoz dɔ̃ ʒə sɥi fjɛʁ", en: "Your turn — 'It's something I'm proud of.' (fier de → dont)" },
    ],
    quiz: [
      { q: "« le film ___ je parle » (parler DE)", options: ["que", "qui", "dont", "où"], answer: 2, explain: "parler de → dont replaces de + noun." },
      { q: "« le jour ___ il est arrivé »", options: ["que", "où", "dont", "lequel"], answer: 1, explain: "où covers 'where' AND 'when' (the day when)." },
    ],
  },
  {
    id: "b2s6", level: "B2", track: "Sentences",
    title: "Plus-que-parfait (the past-before-the-past)",
    goal: "Say what HAD happened before another past event.",
    steps: [
      { type: "text", html: "The <strong>plus-que-parfait</strong> describes an action completed <em>before</em> another past action — English 'had done'." },
      { type: "rule", html: "🧱 Form: <strong>imparfait</strong> of avoir/être + past participle. « j'<strong>avais</strong> mangé » (I had eaten), « elle <strong>était</strong> partie » (she had left, +agreement)." },
      { type: "examples", note: "Hear it:", items: [
        { fr: "Quand je suis arrivé, il était déjà parti.", ipa: "kɑ̃ ʒə sɥiz‿aʁive il etɛ deʒa paʁti", en: "When I arrived, he had already left." },
        { fr: "J'avais fini avant le dîner.", ipa: "ʒavɛ fini avɑ̃ lə dine", en: "I had finished before dinner." },
        { fr: "Ils n'avaient jamais vu la mer.", ipa: "il navɛ ʒamɛ vy la mɛʁ", en: "They had never seen the sea." },
      ]},
      { type: "rule", html: "📌 It's the natural partner of reported speech and 'si' clauses: « Si j'<strong>avais su</strong>… » (Had I known…)." },
      { type: "build", fr: "Quand je suis arrivé, il était déjà parti.", en: "When I arrived, he had already left." },
      { type: "say", fr: "Elle avait déjà mangé quand je suis venu.", ipa: "ɛl avɛ deʒa mɑ̃ʒe kɑ̃ ʒə sɥi vəny", en: "Your turn — 'She had already eaten when I came.'" },
    ],
    quiz: [
      { q: "Plus-que-parfait of « manger » (je) =", options: ["j'ai mangé", "je mangeais", "j'avais mangé", "je mangerai"], answer: 2, explain: "imparfait of avoir (avais) + participle." },
      { q: "« When I arrived, he ___ already left »", options: ["est parti", "était parti", "partait", "part"], answer: 1, explain: "Action before the past → plus-que-parfait: était parti." },
    ],
  },

  /* ---------- C1 addition ---------- */
  {
    id: "c1s4", level: "C1", track: "Sentences",
    title: "Advanced hypotheticals & the literary tenses",
    goal: "Handle all 'si' systems and recognise the passé simple in texts.",
    steps: [
      { type: "rule", html: "🔀 The three <strong>si</strong> systems: 1) Si + présent → futur (« Si tu viens, je serai content »). 2) Si + imparfait → conditionnel présent (« Si tu venais, je serais content »). 3) Si + plus-que-parfait → conditionnel passé (« Si tu étais venu, j'aurais été content »)." },
      { type: "examples", note: "Hear the three degrees:", items: [
        { fr: "Si j'ai le temps, je viendrai.", ipa: "si ʒe lə tɑ̃ ʒə vjɛ̃dʁe", en: "If I have time, I'll come. (real/likely)" },
        { fr: "Si j'avais le temps, je viendrais.", ipa: "si ʒavɛ lə tɑ̃ ʒə vjɛ̃dʁɛ", en: "If I had time, I would come. (unreal present)" },
        { fr: "Si j'avais eu le temps, je serais venu.", ipa: "si ʒavɛz‿y lə tɑ̃ ʒə səʁɛ vəny", en: "If I had had time, I would have come. (unreal past)" },
      ]},
      { type: "rule", html: "📖 <strong>Passé simple</strong>: the literary past you'll <em>read</em> (novels, history) but not speak. Recognise it: « il <strong>fut</strong> » (was), « il <strong>eut</strong> » (had), « elle <strong>alla</strong> » (went), « ils <strong>firent</strong> » (did). Mentally map it to the passé composé." },
      { type: "examples", note: "Recognise in reading:", items: [
        { fr: "Il entra et ferma la porte.", ipa: "il ɑ̃tʁa e fɛʁma la pɔʁt", en: "He entered and closed the door. (passé simple = entered/closed)" },
        { fr: "Ce fut un grand succès.", ipa: "sə fy œ̃ ɡʁɑ̃ syksɛ", en: "It was a great success. (fut = was)" },
      ]},
      { type: "build", fr: "Si j'avais le temps, je viendrais.", en: "If I had time, I would come." },
      { type: "say", fr: "Si j'avais su, j'aurais agi autrement.", ipa: "si ʒavɛ sy ʒoʁɛz‿aʒi otʁəmɑ̃", en: "Your turn — 'Had I known, I would have acted differently.'" },
    ],
    quiz: [
      { q: "« Si j'avais le temps, je ___ » (would come)", options: ["viendrai", "viendrais", "serais venu", "viens"], answer: 1, explain: "Si + imparfait → conditionnel présent: viendrais." },
      { q: "In a novel, « il fut » corresponds to which spoken tense?", options: ["futur", "passé composé (il a été)", "imparfait", "subjonctif"], answer: 1, explain: "Passé simple « fut » = passé composé « a été » in speech." },
    ],
  },

  /* ============================================================= */
  /* ====== DEPTH PASS: extra B2/C1 lessons for CLB-8 reach ====== */
  /* ============================================================= */
  {
    id: "b2p2", level: "B2", track: "Pronunciation",
    title: "Fast-speech reductions & liaison",
    goal: "Understand rapid spoken French — the #1 listening challenge at B2+.",
    steps: [
      { type: "text", html: "Native speech is fast and 'glued together'. Understanding the TCF listening section (heard once!) means training your ear for <strong>reductions</strong> and <strong>liaisons</strong>." },
      { type: "rule", html: "🔗 <strong>Liaison:</strong> a silent final consonant links to the next vowel. <strong>Enchaînement:</strong> a pronounced final consonant glides into the next word: « il est ici » → 'i-lè-ti-si'." },
      { type: "examples", note: "Careful vs natural speed:", items: [
        { fr: "Il y a", ipa: "il j a → 'ya'", en: "'there is' often reduces to 'ya'" },
        { fr: "Je ne sais pas", ipa: "ʒə nə sɛ pa → 'ʃɛ pa'", en: "→ 'chais pas' in fast speech" },
        { fr: "Tu as", ipa: "ty a → 'ta'", en: "'you have' often 't'as'" },
        { fr: "Qu'est-ce que c'est", ipa: "kɛs kə sɛ → 'kès-ksè'", en: "all run together" },
      ]},
      { type: "rule", html: "👂 Strategy: don't translate word-by-word. Catch the <strong>stressed last syllable</strong> of each group and the key content words; let the glue words blur." },
      { type: "say", fr: "Qu'est-ce que tu as fait hier ?", ipa: "kɛs kə ty a fɛ jɛʁ", en: "Your turn — say it fast and linked." },
    ],
    quiz: [
      { q: "In fast speech, « je ne sais pas » often sounds like…", options: ["'je ne sais pas' (full)", "'chais pas'", "'je sais'", "'ne pas'"], answer: 1, explain: "Reduction: drops to 'chais pas'." },
      { q: "Enchaînement means…", options: ["a silent letter", "a pronounced final consonant gliding into the next word", "a nasal vowel", "a question"], answer: 1, explain: "It's the gluing of words across a pronounced final consonant." },
    ],
  },
  {
    id: "c1p1", level: "C1", track: "Pronunciation",
    title: "Prosody, rhythm & register in the ear",
    goal: "Catch tone, emphasis and register in fast formal/informal speech (CLB-8 listening).",
    steps: [
      { type: "text", html: "At C1, comprehension isn't just words — it's <strong>how</strong> they're said: the speaker's attitude, irony, emphasis and register all carry meaning you must infer." },
      { type: "rule", html: "🎵 French groups words into rhythmic units with a slight rise, then a fall at the end of the sentence. <strong>Emphasis</strong> is shown by lengthening/stressing a word or by 'c'est … que' structures, not by loudness as in English." },
      { type: "examples", note: "Emphasis & nuance:", items: [
        { fr: "C'est LUI qui l'a dit.", ipa: "sɛ lɥi ki la di", en: "emphasis via 'c'est…qui' — HE said it (not someone else)" },
        { fr: "Ah, bravo… (ironique)", ipa: "a bʁavo", en: "tone can flip the meaning to sarcasm" },
        { fr: "Je veux bien, mais…", ipa: "ʒə vø bjɛ̃ mɛ", en: "polite hesitation — 'I'm willing, but…'" },
      ]},
      { type: "rule", html: "🎚️ Register cues: <em>soutenu</em> (formal: « Veuillez patienter »), <em>courant</em> (neutral: « Attendez »), <em>familier</em> (casual: « Attends ! »). Catching the register tells you the speaker–listener relationship." },
      { type: "say", fr: "C'est exactement ce que je voulais dire.", ipa: "sɛt‿ɛɡzaktəmɑ̃ sə kə ʒə vulɛ diʁ", en: "Your turn — stress 'exactement' for emphasis." },
    ],
    quiz: [
      { q: "French marks emphasis mainly by…", options: ["speaking louder", "structures like 'c'est … qui' + lengthening", "using English words", "speaking slower"], answer: 1, explain: "Cleft structures (c'est…qui/que) and stress, not volume." },
      { q: "« Veuillez patienter » is which register?", options: ["familier", "courant", "soutenu", "argotique"], answer: 2, explain: "It's soutenu (formal)." },
    ],
  },
  {
    id: "c1s5", level: "C1", track: "Sentences",
    title: "Advanced connectors & cohesion",
    goal: "Link complex ideas precisely — the backbone of C1 writing and reading.",
    steps: [
      { type: "text", html: "At C1, what separates a good text from a great one is <strong>cohesion</strong>: precise connectors that signal exactly how each idea relates to the last." },
      { type: "rule", html: "🔧 <strong>Concession:</strong> bien que / quoique (+subj), certes…mais, quitte à. <strong>Cause:</strong> dans la mesure où, étant donné que, du fait que. <strong>Consequence:</strong> de sorte que, si bien que, au point que. <strong>Addition:</strong> non seulement…mais aussi, par ailleurs, de surcroît." },
      { type: "examples", note: "Precise linking:", items: [
        { fr: "Dans la mesure où c'est vrai, agissons.", ipa: "dɑ̃ la məzyʁ u sɛ vʁɛ", en: "Insofar as it's true, let's act. (conditional cause)" },
        { fr: "Il a tant insisté qu'elle a cédé.", ipa: "il a tɑ̃ ɛ̃siste kɛl a sede", en: "He insisted so much that she gave in. (consequence)" },
        { fr: "Non seulement il est venu, mais il a aidé.", ipa: "nɔ̃ sœlmɑ̃ il ɛ vəny mɛ il a ede", en: "Not only did he come, but he helped." },
      ]},
      { type: "rule", html: "💡 In reading, these connectors are answer-keys: « certes… » signals a concession about to be reversed by « mais »; « de sorte que » introduces a result. Spot them to follow the argument." },
      { type: "build", fr: "Bien qu'il pleuve, nous sortirons.", en: "Although it's raining, we'll go out." },
      { type: "say", fr: "Non seulement c'est faux, mais c'est dangereux.", ipa: "nɔ̃ sœlmɑ̃ sɛ fo mɛ sɛ dɑ̃ʒʁø", en: "Your turn — 'Not only is it false, but it's dangerous.'" },
    ],
    quiz: [
      { q: "« dans la mesure où » expresses…", options: ["contrast", "a conditional cause ('insofar as')", "time", "addition"], answer: 1, explain: "It introduces a qualified cause/condition." },
      { q: "« Il a tant travaillé ___ il a réussi » (consequence)", options: ["bien que", "qu'", "dans la mesure où", "quitte à"], answer: 1, explain: "tant … que = so much … that (consequence)." },
    ],
  },
  {
    id: "a2s7", level: "A2", track: "Sentences",
    title: "savoir vs connaître + devoir",
    goal: "Master two pairs the TCF loves to test: savoir/connaître ('to know') and the many meanings of devoir.",
    steps: [
      { type: "text", html: "French has <strong>two verbs for 'to know'</strong>, and choosing the wrong one is a classic TCF trap." },
      { type: "rule", html: "🧠 <strong>savoir</strong> = to know a <em>fact</em>, or to know <em>how</em> to do something. Followed by a clause (que/si/où…) or an infinitive. <br>🤝 <strong>connaître</strong> = to be <em>acquainted</em> with a person, place, or work of art. Always followed by a <em>noun</em>, never a clause." },
      { type: "examples", note: "Hear the difference:", items: [
        { fr: "Je sais qu'il est parti.", ipa: "ʒə sɛ kil ɛ paʁti", en: "I know (the fact) that he left. → savoir + clause" },
        { fr: "Je sais nager.", ipa: "ʒə sɛ naʒe", en: "I know how to swim. → savoir + infinitive" },
        { fr: "Je connais Paris.", ipa: "ʒə kɔnɛ paʁi", en: "I know Paris. → connaître + place" },
        { fr: "Tu connais ce film ?", ipa: "ty kɔnɛ sə film", en: "Do you know this film? → connaître + noun" },
      ]},
      { type: "rule", html: "📒 <strong>savoir</strong>: je sais · tu sais · il sait · nous savons · vous savez · ils savent. <br>📒 <strong>connaître</strong>: je connais · tu connais · il connaît · nous connaissons · vous connaissez · ils connaissent." },
      { type: "text", html: "Now <strong>devoir</strong> — one verb, three meanings. The TCF tests which one the context calls for." },
      { type: "rule", html: "💶 <strong>Debt:</strong> « Je te dois 10 euros. » (I owe you 10€). <br>✅ <strong>Obligation:</strong> « Tu dois partir. » (You must leave). <br>🤔 <strong>Probability:</strong> « Il doit être malade. » (He must be / is probably sick)." },
      { type: "examples", note: "devoir in context:", items: [
        { fr: "Elle me doit une réponse.", ipa: "ɛl mə dwa yn ʁepɔ̃s", en: "She owes me an answer. (debt)" },
        { fr: "Vous devez arriver à l'heure.", ipa: "vu dəve aʁive a lœʁ", en: "You must arrive on time. (obligation)" },
        { fr: "Le train doit arriver à midi.", ipa: "lə tʁɛ̃ dwa aʁive a midi", en: "The train is supposed to arrive at noon. (probability)" },
      ]},
      { type: "build", fr: "Je sais qu'elle connaît la ville.", en: "I know that she knows the city." },
      { type: "say", fr: "Tu dois savoir la réponse.", ipa: "ty dwa savwaʁ la ʁepɔ̃s", en: "Your turn — 'You must know the answer.'" },
    ],
    quiz: [
      { q: "« Je ___ qu'il a raison. » (I know that he's right)", options: ["connais", "sais", "dois", "sait"], answer: 1, explain: "Followed by a clause (qu'…) → savoir." },
      { q: "« Tu ___ mon frère ? » (Do you know my brother?)", options: ["sais", "connais", "dois", "saves"], answer: 1, explain: "Followed by a person → connaître." },
      { q: "« Il ___ être fatigué » most likely means…", options: ["He owes being tired", "He is probably tired", "He knows he is tired", "He must (is forced to) be tired"], answer: 1, explain: "devoir + état often = probability." },
      { q: "« Elle ___ jouer du piano. » (She knows how to play piano)", options: ["connaît", "sait", "doit", "connaisse"], answer: 1, explain: "know HOW to do → savoir + infinitive." },
    ],
  },
  {
    id: "a2s8", level: "A2", track: "Sentences",
    title: "Pronominal verbs: the four types",
    goal: "Recognise reflexive, reciprocal, passive and idiomatic pronominal verbs — they behave differently.",
    steps: [
      { type: "text", html: "<strong>Pronominal verbs</strong> carry an extra pronoun (me/te/se/nous/vous/se). There are four types — knowing which is which helps you read and translate correctly." },
      { type: "rule", html: "🪞 <strong>1. Reflexive</strong> — action on oneself: « Je <strong>me</strong> lave. » (I wash myself). <br>↔️ <strong>2. Reciprocal</strong> — to each other (plural only): « Ils <strong>se</strong> parlent. » (They talk to each other)." },
      { type: "rule", html: "📦 <strong>3. Passive</strong> — subject is a thing, no agent: « Ça <strong>se</strong> dit. » (That is said) · « Le vin blanc <strong>se</strong> boit frais. » (White wine is drunk chilled). <br>🎭 <strong>4. Idiomatic (subjective)</strong> — the pronoun is just part of the verb: « Il <strong>s'</strong>en va. » (He's leaving) · « Je <strong>me</strong> souviens. » (I remember)." },
      { type: "examples", note: "One of each:", items: [
        { fr: "Elle se réveille à sept heures.", ipa: "ɛl sə ʁevɛj a sɛt‿œʁ", en: "She wakes (herself) up at seven. (reflexive)" },
        { fr: "Nous nous écrivons souvent.", ipa: "nu nuz‿ekʁivɔ̃ suvɑ̃", en: "We write to each other often. (reciprocal)" },
        { fr: "Comment ça se prononce ?", ipa: "kɔmɑ̃ sa sə pʁonɔ̃s", en: "How is that pronounced? (passive)" },
        { fr: "Je me doute de quelque chose.", ipa: "ʒə mə dut də kɛlkə ʃoz", en: "I suspect something. (idiomatic)" },
      ]},
      { type: "rule", html: "⏪ In the <strong>passé composé</strong>, ALL pronominals use <strong>être</strong>: « Elle s'est levée. » (agreement with subject when reflexive/reciprocal). 🚫 No agreement when a direct object follows: « Elle s'est lavé les mains. »" },
      { type: "build", fr: "Ils se sont rencontrés à Paris.", en: "They met (each other) in Paris." },
      { type: "say", fr: "Je me souviens de cette histoire.", ipa: "ʒə mə suvjɛ̃ də sɛt‿istwaʁ", en: "Your turn — 'I remember this story.'" },
    ],
    quiz: [
      { q: "« Ils s'aiment » (they love each other) is which type?", options: ["reflexive", "reciprocal", "passive", "idiomatic"], answer: 1, explain: "Action exchanged between two people → reciprocal." },
      { q: "« Ça ne se fait pas » is…", options: ["reflexive", "reciprocal", "passive", "idiomatic"], answer: 2, explain: "Subject is 'ça', no agent → passive pronominal." },
      { q: "Pronominal verbs in the passé composé use…", options: ["avoir", "être", "either", "no auxiliary"], answer: 1, explain: "Always être." },
      { q: "« Je me suis lavé les mains » — why no agreement on lavé?", options: ["It's reciprocal", "A direct object (les mains) follows the verb", "me is plural", "It's idiomatic"], answer: 1, explain: "When a direct object follows, the participle doesn't agree with the subject." },
    ],
  },
  {
    id: "a2s9", level: "A2", track: "Sentences",
    title: "The imperative (giving orders)",
    goal: "Give commands, advice and suggestions — including with pronominal verbs.",
    steps: [
      { type: "text", html: "The <strong>impératif</strong> gives orders, advice or invitations. Use the <strong>tu</strong>, <strong>nous</strong>, and <strong>vous</strong> forms of the present — <em>without</em> the subject pronoun." },
      { type: "rule", html: "📒 <strong>parler:</strong> Parle ! · Parlons ! (Let's…) · Parlez ! &nbsp; For <strong>-er</strong> verbs, drop the final <strong>-s</strong> of the tu form: « tu parles » → « Parle ! »" },
      { type: "examples", note: "Commands:", items: [
        { fr: "Écoute bien !", ipa: "ekut bjɛ̃", en: "Listen carefully! (tu, -er, no -s)" },
        { fr: "Finissons le travail.", ipa: "finisɔ̃ lə tʁavaj", en: "Let's finish the work. (nous)" },
        { fr: "Prenez le train de 9 heures.", ipa: "pʁəne lə tʁɛ̃ də nœv‿œʁ", en: "Take the 9 o'clock train. (vous)" },
      ]},
      { type: "rule", html: "🚫 <strong>Negative:</strong> ne … pas around the verb. « Ne parle pas ! » · « N'oubliez pas ! » <br>⭐ <strong>Irregulars:</strong> être → Sois/Soyons/Soyez · avoir → Aie/Ayons/Ayez · savoir → Sache/Sachez · vouloir → Veuillez (Please…)." },
      { type: "rule", html: "🪞 <strong>Pronominal verbs:</strong> in the AFFIRMATIVE the pronoun follows with a hyphen, and me/te → moi/toi: « Lève-<strong>toi</strong> ! » « Dépêchons-<strong>nous</strong> ! » In the NEGATIVE it goes back before the verb: « Ne <strong>te</strong> lève pas ! »" },
      { type: "examples", note: "Pronominal + polite:", items: [
        { fr: "Repose-toi !", ipa: "ʁəpoz twa", en: "Rest! (affirmative → toi after)" },
        { fr: "Ne vous inquiétez pas.", ipa: "nə vuz‿ɛ̃kjete pa", en: "Don't worry. (negative → vous before)" },
        { fr: "Veuillez patienter.", ipa: "vœje pasjɑ̃te", en: "Please wait. (polite vouloir)" },
      ]},
      { type: "build", fr: "Ne te couche pas trop tard.", en: "Don't go to bed too late." },
      { type: "say", fr: "Dépêche-toi, sois à l'heure !", ipa: "depɛʃ twa swa a lœʁ", en: "Your turn — 'Hurry up, be on time!'" },
    ],
    quiz: [
      { q: "Imperative 'tu' of parler is…", options: ["Parles !", "Parle !", "Tu parles !", "Parler !"], answer: 1, explain: "-er verbs drop the -s in the tu imperative." },
      { q: "« Get up! » (tu, se lever) =", options: ["Te lève !", "Lève-te !", "Lève-toi !", "Toi lève !"], answer: 2, explain: "Affirmative: pronoun after, te → toi." },
      { q: "« Don't worry! » (vous) =", options: ["Inquiétez-vous pas !", "Ne vous inquiétez pas !", "Vous ne inquiétez pas !", "Ne inquiétez-vous pas !"], answer: 1, explain: "Negative: ne + pronoun before the verb + pas." },
      { q: "Polite « Please sign here » uses…", options: ["Signez", "Veuillez signer", "Sachez signer", "Soyez signer"], answer: 1, explain: "Veuillez + infinitive = polite request." },
    ],
  },
  {
    id: "b1s8", level: "B1", track: "Sentences",
    title: "Verbs + their prepositions (à / de / —)",
    goal: "Know whether a verb takes à, de, or nothing before an infinitive — a core Structures-section skill.",
    steps: [
      { type: "text", html: "When one verb is followed by another in the <strong>infinitive</strong>, the first verb decides the preposition. There's no shortcut — these must be learned, and the TCF Structures section tests them constantly." },
      { type: "rule", html: "➖ <strong>No preposition</strong> (verb + infinitive directly): aimer, aller, devoir, espérer, faire, pouvoir, préférer, savoir, vouloir, venir, laisser. « Je <strong>veux partir</strong>. » « Elle <strong>aime voyager</strong>. »" },
      { type: "rule", html: "🅰️ <strong>Verb + à + infinitive:</strong> apprendre à, arriver à, chercher à, commencer à, continuer à, hésiter à, réussir à, se mettre à, tenir à, aider à. « Il <strong>commence à</strong> comprendre. » « J'<strong>apprends à</strong> nager. »" },
      { type: "rule", html: "🇩🇪 <strong>Verb + de + infinitive:</strong> accepter de, arrêter de, choisir de, décider de, essayer de, finir de, oublier de, refuser de, venir de, avoir besoin/envie/peur de. « Elle <strong>décide de</strong> rester. » « J'ai <strong>oublié de</strong> fermer. »" },
      { type: "examples", note: "Hear the contrast:", items: [
        { fr: "Je veux apprendre à conduire.", ipa: "ʒə vø apʁɑ̃dʁ a kɔ̃dɥiʁ", en: "I want (—) to learn TO (à) drive." },
        { fr: "Il a décidé de partir.", ipa: "il a deside də paʁtiʁ", en: "He decided TO (de) leave." },
        { fr: "Nous avons réussi à finir.", ipa: "nuz‿avɔ̃ ʁeysi a finiʁ", en: "We managed TO (à) finish." },
        { fr: "Elle refuse de répondre.", ipa: "ɛl ʁəfyz də ʁepɔ̃dʁ", en: "She refuses TO (de) answer." },
      ]},
      { type: "rule", html: "💡 Watch the meaning shift with the same verb: « Je <strong>viens</strong> de manger » (I've just eaten — venir de = recent past) vs « Je <strong>viens manger</strong> » (I'm coming to eat). And « commencer/finir <strong>par</strong> + inf » = to start/end up BY doing." },
      { type: "build", fr: "Il a essayé de comprendre la question.", en: "He tried to understand the question." },
      { type: "say", fr: "Je commence à apprendre le français.", ipa: "ʒə kɔmɑ̃s a apʁɑ̃dʁ lə fʁɑ̃sɛ", en: "Your turn — 'I'm starting to learn French.'" },
    ],
    quiz: [
      { q: "« J'ai décidé ___ partir. »", options: ["à", "de", "—", "par"], answer: 1, explain: "décider de + infinitive." },
      { q: "« Elle apprend ___ conduire. »", options: ["à", "de", "—", "par"], answer: 0, explain: "apprendre à + infinitive." },
      { q: "« Je veux ___ voyager. »", options: ["à", "de", "(nothing)", "par"], answer: 2, explain: "vouloir takes no preposition before an infinitive." },
      { q: "« Il a fini ___ accepter. » (he ended up accepting)", options: ["de", "à", "par", "—"], answer: 2, explain: "finir par + infinitive = to end up doing." },
    ],
  },
];

/* Helper: lessons grouped by level, then track. */
window.LESSONS_BY_LEVEL = (function () {
  const out = {};
  window.CURRICULUM.levels.forEach((lv) => (out[lv] = { Exam: [], Sentences: [], Pronunciation: [] }));
  window.LESSONS.forEach((l) => {
    if (out[l.level] && out[l.level][l.track]) out[l.level][l.track].push(l);
  });
  return out;
})();
