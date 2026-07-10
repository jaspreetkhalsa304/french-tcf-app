/* ===== Study / Strategy material =====
 * "How to score" content — method sheets, templates, connector phrases,
 * common traps and timing — as opposed to the practice items in
 * delf_tasks.js and tcf_tasks.js.
 *
 * Two bodies of content:
 *   window.STUDY.delf[level][module]  → DELF/DALF method sheet (A1–C2 × 4 modules)
 *   window.STUDY.tcf[level]           → TCF per-level strategy (A1–C2, deep at C1)
 *   window.STUDY.tcfC1                → focused "Score C1 in the TCF" dossier
 *
 * Guide shape (rendered by js/study.js):
 *   {
 *     goal: "one-line aim for this module at this level",
 *     approach: ["step / tactic", ...],          // ordered method
 *     template: "reusable structure / skeleton",  // optional
 *     phrases: [{fr:"…", en:"…"}, ...],           // optional ready-to-use language
 *     traps: ["common mistake to avoid", ...],    // optional
 *     timing: "how to spend the clock",           // optional
 *   }
 */
window.STUDY = {
  delfLevels: ["A1", "A2", "B1", "B2", "C1", "C2"],
  tcfLevels: ["A1", "A2", "B1", "B2", "C1", "C2"],
  moduleNames: {
    listening: "🎧 Compréhension de l'oral",
    reading: "📖 Compréhension des écrits",
    writing: "✍️ Production écrite",
    speaking: "🗣️ Production orale",
  },

  /* =============================================================
   * DELF / DALF method sheets — per level, per module.
   * ============================================================= */
  delf: {
    A1: {
      listening: {
        goal: "Catch concrete facts — numbers, times, places, prices — from very short recordings.",
        approach: [
          "Read the question and all four options BEFORE the audio plays; underline what you must catch (a time? a price? a name?).",
          "First listen for the gist; second listen only for the one detail the question asks.",
          "Numbers are the #1 A1 skill: drill 0–69, times (17h40), prices (2,50 €) until they're automatic.",
          "Don't panic on unknown words — the answer is always a concrete fact you can hear directly.",
        ],
        phrases: [
          { fr: "Il part à dix-sept heures quarante.", en: "It leaves at 17:40 — train/bus times." },
          { fr: "Ça coûte deux euros cinquante.", en: "It costs €2.50 — prices." },
          { fr: "Tournez à gauche / à droite.", en: "Turn left / right — directions." },
        ],
        traps: [
          "Similar-sounding numbers: 'seize' (16) vs 'six' (6), 'deux' (2) vs 'douze' (12).",
          "Distractor options repeat a number you heard but for the wrong thing (the café price, not the croissant price).",
        ],
        timing: "~20 min for 4 short docs. Each audio is a few seconds — you get two listens; use the gap to lock in your answer.",
      },
      reading: {
        goal: "Find one piece of practical information in signs, notes, menus, SMS and short ads.",
        approach: [
          "Skim the document type first (a menu? an SMS? an opening-hours sign?) — that tells you where the answer lives.",
          "Scan for the exact word from the question (a day, a price, a place) rather than reading every word.",
          "For 'quand est-ce fermé ?' questions, look for 'fermé / sauf / lundi' — the trap is reading opening hours as closing.",
        ],
        traps: [
          "'sauf le lundi' = closed ON Monday, open the rest. Many A1 candidates invert this.",
          "Gratuit = free (not a price). 'à partir de 7h' = from 7am onwards.",
        ],
        timing: "~30 min, 4 short documents. Spend under 1 min hunting each fact — don't translate the whole text.",
      },
      writing: {
        goal: "Fill a form and write a 40–50 word message with correct greetings and simple full sentences.",
        approach: [
          "Answer EVERY point in the instruction — examiners tick off each required piece of information.",
          "Use one short sentence per idea. Don't attempt complex grammar; correctness beats ambition at A1.",
          "Always open and close a message: 'Salut …!' / 'Bisous' or 'À bientôt'.",
        ],
        template: "Salut [nom] !\n→ 1 sentence: where you are.\n→ 1 sentence: the weather.\n→ 1 sentence: what you do today.\n→ 1 sentence: a proposal to meet.\nÀ bientôt, [votre nom]",
        phrases: [
          { fr: "Je m'appelle… / J'ai … ans / Je suis [nationalité].", en: "Core self-presentation." },
          { fr: "J'habite à… / Je travaille comme…", en: "Where you live / your job." },
          { fr: "Tu veux venir ? / On se voit samedi ?", en: "Suggest meeting up." },
        ],
        traps: [
          "Forgetting the greeting/closing costs 'correction sociolinguistique' points (/4).",
          "Writing far under 40 words — count as you go.",
        ],
        timing: "~30 min. 5 min plan the points, 20 min write, 5 min re-read for accents & agreements.",
      },
      speaking: {
        goal: "Introduce yourself, ask simple questions, and handle a short café/shop role-play.",
        approach: [
          "Part 1 (entretien): rattle off name, age, nationality, city, job/studies, one hobby — rehearse this until it's reflex.",
          "Part 2 (échange): turn keywords into questions with 'Est-ce que…?' or a simple rising intonation.",
          "Part 3 (jeu de rôle): use the fixed café script — greet, order, ask the price, pay, thank.",
        ],
        phrases: [
          { fr: "Bonjour, je voudrais un café, s'il vous plaît.", en: "Order politely." },
          { fr: "Ça fait combien ? / C'est combien ?", en: "Ask the price." },
          { fr: "Comment tu t'appelles ? Qu'est-ce que tu aimes faire ?", en: "Ask simple questions." },
        ],
        traps: [
          "Answering in one word — always give a full short sentence.",
          "Forgetting 's'il vous plaît' and 'merci' loses politeness points.",
        ],
        timing: "5–7 min total, no prep. Keep sentences short and audible; a steady simple answer scores better than a stumbled complex one.",
      },
    },

    A2: {
      listening: {
        goal: "Understand short everyday exchanges: appointments, announcements, plans, instructions.",
        approach: [
          "Predict from the options what kind of situation it is (a phone message? a station announcement?).",
          "Track WHO does WHAT WHEN — A2 items often hinge on a change (rendez-vous moved, meeting place swapped).",
          "Listen for the reason connectors: 'parce que', 'à cause de', 'pour' — several questions ask 'pourquoi ?'.",
        ],
        phrases: [
          { fr: "Le rendez-vous est déplacé à jeudi.", en: "The appointment is moved to Thursday." },
          { fr: "en raison de / à cause de", en: "because of (announcements)." },
        ],
        traps: [
          "The recording states BOTH the old and new time/place — the answer is the new one.",
          "'sauf' again: 'ouvert tous les jours sauf le lundi'.",
        ],
        timing: "~25 min, 4 docs. Use the two listens: gist, then the specific detail.",
      },
      reading: {
        goal: "Extract information from emails, ads, notices and short personal texts.",
        approach: [
          "Identify the writer's intention first: invite? apologise? complain? inform?",
          "For 'pourquoi' questions, locate the justification clause.",
          "Map required facts to the text — supplements/extra costs ('en supplément') are classic A2 targets.",
        ],
        traps: [
          "Confusing what's included vs what costs extra (bagage cabine inclus / soute en supplément).",
          "Numbers written as words hidden mid-sentence.",
        ],
        timing: "~30 min, 3–4 docs. Skim for structure, then scan for each fact.",
      },
      writing: {
        goal: "Write two short 60–80 word texts: describe an experience (past tense) and interact (invite/thank/apologise).",
        approach: [
          "Exercice 1 usually needs the PASSÉ COMPOSÉ — 'je suis allé(e)', 'j'ai vu', 'on a mangé'.",
          "Exercice 2 is transactional: cover the social function (invite, thank, apologise) AND give the practical details.",
          "Link ideas with simple connectors so it reads as a text, not a list.",
        ],
        template: "EX.1 (récit): Où + avec qui + ce que j'ai fait + mon avis ('c'était super/fatigant').\nEX.2 (mail): Objet + formule d'appel + 3–4 infos utiles + demande de réponse + formule de fin.",
        phrases: [
          { fr: "Je suis allé(e) à… / On a visité… / C'était génial.", en: "Past-tense narration." },
          { fr: "Je t'invite à… ; peux-tu apporter… ? ; réponds-moi vite.", en: "Invitation with details + reply request." },
          { fr: "Je suis désolé(e), je ne peux pas venir parce que…", en: "Apologise + reason." },
        ],
        traps: [
          "Mixing up avoir/être auxiliaries in the passé composé.",
          "Forgetting past-participle agreement with être ('elle est allée').",
          "Being under 60 words on either exercise.",
        ],
        timing: "~45 min for both. ~20 min each + 5 min proofreading tenses and accents.",
      },
      speaking: {
        goal: "Talk about daily life in a short monologue and complete a transactional interaction (ticket, appointment).",
        approach: [
          "Monologue: cover all listed points and add a 'parce que' to justify at least one.",
          "Interaction: state your need clearly, then respond to the examiner's follow-ups (price, class, date).",
          "Use time markers: 'd'abord', 'ensuite', 'après', 'le week-end'.",
        ],
        phrases: [
          { fr: "Je fais ça depuis deux ans, parce que j'aime…", en: "Say since when + why." },
          { fr: "Je voudrais un aller-retour pour Lyon, en seconde classe.", en: "Buy a ticket." },
        ],
        traps: [
          "Skipping one of the required points in the monologue.",
          "Not asking the practical follow-up question (price, platform).",
        ],
        timing: "6–8 min. Aim for ~5 connected sentences in the monologue.",
      },
    },

    B1: {
      listening: {
        goal: "Follow the main idea and specific points of longer documents (announcements, interviews, reports).",
        approach: [
          "Note-take in shorthand while listening — you only hear it once at B1+.",
          "Separate main idea (theme) from supporting details; questions test both.",
          "For short-answer items, write a paraphrase that captures the FACT, not the exact words.",
        ],
        phrases: [
          { fr: "en raison de / suite à / à partir de", en: "Reason / from-when connectors." },
          { fr: "Il s'agit de… / Le sujet, c'est…", en: "Frame the main idea in your answer." },
        ],
        traps: [
          "Only one listen — don't get stuck on a missed word; keep following.",
          "Short-answer graded on meaning: a full-but-wrong sentence scores 0.",
        ],
        timing: "~25 min, 3 docs of increasing length. Read questions in the pre-listen gap.",
      },
      reading: {
        goal: "Understand articles, ads and personal texts, and answer why/how questions accurately.",
        approach: [
          "Read the questions first, then the text with them in mind (targeted reading).",
          "Watch reactions and nuance: 'certains s'inquiètent', 'ravit… mais inquiète' — B1 loves mixed reactions.",
          "For short answers, quote the fact but reformulate slightly.",
        ],
        traps: [
          "Options that are true statements but don't answer the specific question.",
          "Assuming everyone agrees when the text signals a divided reaction.",
        ],
        timing: "~35 min, 2 docs. ~15 min per document including answers.",
      },
      writing: {
        goal: "Write a structured ~180-word text expressing and justifying a personal opinion.",
        approach: [
          "State your position in the intro, don't bury it.",
          "Two developed arguments, ONE example each — depth over quantity.",
          "Signpost with connectors and use paragraphs; a wall of text loses cohesion marks.",
        ],
        template: "Intro: reformulate the topic + your position.\n§1: Argument 1 + example ('Par exemple…').\n§2: Argument 2 + example.\nConclusion: restate briefly + a nuance or opening.",
        phrases: [
          { fr: "À mon avis / Je pense que / Selon moi…", en: "State an opinion." },
          { fr: "D'abord… Ensuite… Par exemple… En revanche…", en: "Structuring connectors." },
          { fr: "En conclusion / Pour conclure / Finalement…", en: "Conclude." },
        ],
        traps: [
          "Listing arguments with no example — B1 rubric explicitly rewards illustration.",
          "Tense slips between present and past when giving examples.",
          "Under 160 words or a single undivided block.",
        ],
        timing: "~45 min. 5 min plan (position + 2 arguments), 30 min write, 10 min proofread.",
      },
      speaking: {
        goal: "Sustain an interview, negotiate/interact, and give a structured opinion from a trigger document.",
        approach: [
          "Interview: extend every answer with 'parce que…' or an example — no one-word replies.",
          "Interaction: argue, but also listen and offer a compromise ('et si on… ?').",
          "Monologue: intro → 2 arguments with examples → personal conclusion. Speak from key-word notes, don't read.",
        ],
        phrases: [
          { fr: "Je comprends ton point de vue, mais…", en: "Concede then counter (negotiation)." },
          { fr: "D'une part… d'autre part…", en: "Structure two arguments." },
          { fr: "Personnellement, je dirais que…", en: "Give your opinion in the monologue." },
        ],
        traps: [
          "Reading notes word-for-word — flat delivery loses fluency marks.",
          "Not reaching a compromise in the interaction task.",
        ],
        timing: "~10 min prep for the monologue, ~15 min speaking across the 3 parts.",
      },
    },

    B2: {
      listening: {
        goal: "Grasp complex argumentation and implicit meaning in longer interviews and reports (heard once).",
        approach: [
          "Map the argument structure as you listen: claim → nuance → counter-claim → conclusion.",
          "Catch the speaker's STANCE and any concessions ('certes… mais', 'pour autant').",
          "For short answers, reformulate an idea in your own words — verbatim copying isn't the goal.",
        ],
        phrases: [
          { fr: "pour autant / néanmoins / en revanche", en: "Signals a nuance or turn." },
          { fr: "L'idée principale est que… ; l'intervenant nuance en disant que…", en: "Frame stance + nuance." },
        ],
        traps: [
          "Missing the concession: a speaker can criticise AND defend the same thing.",
          "Only one listen; don't fixate on a single hard word.",
        ],
        timing: "~30 min, 2 long docs. Take structured notes during the single playback.",
      },
      reading: {
        goal: "Analyse two long argumentative articles and answer detail, inference and reformulation questions.",
        approach: [
          "First pass: get the thesis and the plan of the article.",
          "Second pass: answer questions, locating the paragraph that supports each.",
          "Reformulation items: explain a metaphor/idiom in plain French ('un copilote' = augmente sans remplacer).",
        ],
        traps: [
          "Inference questions where the answer is implied, not stated — don't pick an option just because its words appear.",
          "Time pressure — the second article is long.",
        ],
        timing: "~60 min, 2 docs. Budget ~25 min per article + 10 min review.",
      },
      writing: {
        goal: "Produce a ~250-word argumentative text: nuanced thesis, arguments, examples, counter-arguments, formal register.",
        approach: [
          "Problematise the topic in the intro (turn it into a real question), then announce your position.",
          "Develop 2–3 arguments, each with a concrete example; include a concession/counter-argument.",
          "Use a formal register and strong logical connectors; avoid the informal 'moi je pense'.",
        ],
        template: "Intro: contexte + problématique + annonce de position.\n§ Thèse: argument + exemple.\n§ Concession/antithèse: 'Certes… toutefois…'.\n§ Synthèse: votre position nuancée.\nConclusion: bilan + ouverture.",
        phrases: [
          { fr: "Certes… ; toutefois… ; il n'en demeure pas moins que…", en: "Concede then reassert." },
          { fr: "Force est de constater que… ; on peut s'interroger sur…", en: "Formal framing." },
          { fr: "En définitive / En somme…", en: "Conclude formally." },
        ],
        traps: [
          "Binary, unnuanced positions — B2 demands you weigh both sides.",
          "Informal register ('c'est cool', 'du coup') in a formal essay.",
          "No concrete examples; abstractions alone don't convince.",
        ],
        timing: "~60 min. 10 min plan (problématique + arguments + examples), 40 min write, 10 min proofread.",
      },
      speaking: {
        goal: "Present and defend a position from a short document, then debate and react to counter-arguments.",
        approach: [
          "During prep, dégager le thème and note a clear plan ('Je traiterai cela en trois temps…').",
          "Present a nuanced thesis with examples; anticipate objections in your exposé.",
          "In the debate, reformulate the examiner's objection before answering ('Vous me dites que…, néanmoins…').",
        ],
        phrases: [
          { fr: "Ce document soulève la question de…", en: "Identify the theme." },
          { fr: "Il me semble que… ; tout porte à croire que…", en: "Modalise your claims." },
          { fr: "Je vous concède que…, cependant…", en: "Handle counter-arguments." },
        ],
        traps: [
          "Just summarising the document instead of taking a position.",
          "Getting defensive in the debate rather than engaging with the objection.",
        ],
        timing: "~30 min prep, ~20 min speaking (≈10 exposé + ≈10 debate).",
      },
    },

    C1: {
      listening: {
        goal: "Follow a long, dense broadcast (interview/lecture) with abstract argumentation and implicit stance.",
        approach: [
          "Track the SPEAKER'S REASONING, not just facts: thesis, distinctions, paradoxes, proposed solution.",
          "Note key conceptual pairs the speaker builds (e.g. 'temps mesurable' vs 'temps long').",
          "Reformulation short-answers are worth most: restate an abstract idea in clear, faithful French.",
        ],
        phrases: [
          { fr: "L'intervenant établit une distinction entre… et…", en: "Name a conceptual distinction." },
          { fr: "Le paradoxe qu'il pointe est que…", en: "State a paradox." },
          { fr: "Autrement dit, … / En d'autres termes, …", en: "Reformulate faithfully." },
        ],
        traps: [
          "Answering the literal words when the question asks you to reformulate a concept.",
          "Losing the thread on a long single-play document — commit to structured note-taking.",
        ],
        timing: "~40 min: one long document + shorter ones. Notes are essential; heard once.",
      },
      reading: {
        goal: "Interpret a long, abstract article — thesis, structure, nuance, and reformulate dense expressions.",
        approach: [
          "First read for the thesis and the article's plan (how the argument unfolds).",
          "For reformulation items, unpack abstract phrases ('externaliser ses coûts environnementaux') in plain terms.",
          "Distinguish the author's own view from views they merely report or critique.",
        ],
        traps: [
          "Attributing a reported/criticised opinion to the author.",
          "Surface reformulations that miss the conceptual content.",
        ],
        timing: "~50 min on a long article. Read fully once, then answer with targeted re-reads.",
      },
      writing: {
        goal: "Write a neutral ~220-word synthesis (no 'je') AND a ~250-word argumentative essay with an assumed position.",
        approach: [
          "SYNTHÈSE: organise by THEMES/axes across documents, never document-by-document; reformulate everything, zero copying, total neutrality.",
          "ESSAI: take a clear, nuanced position; a dialectical or thematic plan; precise, varied examples.",
          "Deploy sophisticated cohesion and a controlled range of complex grammar (subjonctif, conditionnel, relative/concessive clauses).",
        ],
        template: "SYNTHÈSE — Intro: thème + problématique dégagée des docs.\n Axe 1 (croise les docs) · Axe 2 · Axe 3.\n Conclusion: bilan, sans opinion.\n\nESSAI — Intro: problématique + thèse.\n Partie 1 (thèse + exemples) · Partie 2 (nuance/antithèse) · Synthèse.\n Conclusion: position assumée + ouverture.",
        phrases: [
          { fr: "tandis que / à l'inverse / dans le prolongement de…", en: "Relate documents in a synthesis." },
          { fr: "Il convient de nuancer… ; loin de… , … ; quand bien même…", en: "Nuance and concede at C1." },
          { fr: "Il ressort de ces documents que…", en: "Neutral synthesis framing." },
        ],
        traps: [
          "Using 'je' or slipping an opinion into the synthesis (instant band drop).",
          "Structuring the synthesis document-by-document instead of by theme.",
          "Copying phrases from the source documents rather than reformulating.",
          "Repetitive vocabulary — C1 rewards lexical range and périphrases.",
        ],
        timing: "~2h30 total. Synthèse ~1h (read + plan by theme + write). Essai ~1h15. Keep 10–15 min to proofread grammar and register.",
      },
      speaking: {
        goal: "Deliver a structured, original exposé from a 2–3 document dossier, then defend it in a real debate.",
        approach: [
          "In prep, build a transversal problématique across the dossier — NOT a doc-by-doc summary.",
          "Announce a clear plan; use the documents as evidence in support, not as the backbone.",
          "In the debate, engage genuinely: concede fairly, then push back with reasoning and fluency.",
        ],
        phrases: [
          { fr: "La problématique que soulève ce dossier est la suivante : …", en: "Frame a transversal question." },
          { fr: "Comme le suggère le document 2… ; ce que corrobore le document 3…", en: "Use docs as support." },
          { fr: "J'entends votre objection ; il n'en reste pas moins que…", en: "Debate with poise." },
        ],
        traps: [
          "Summarising each document in turn instead of building one argument.",
          "A rigid, recited exposé that collapses when the debate goes off-script.",
        ],
        timing: "~1h prep, ~30 min oral (≈8 min exposé + ≈15 min débat).",
      },
    },

    C2: {
      listening: {
        goal: "Fully grasp a complex, allusive spoken document and its subtleties, implications and tone.",
        approach: [
          "Follow high-level reasoning including irony, implicit stance and rhetorical structure.",
          "Capture conceptual architecture (the speaker's key oppositions and their resolution).",
          "Reformulate the most abstract passages precisely and elegantly.",
        ],
        traps: [
          "Missing implied meaning or the speaker's tone (ironic, cautious, assertive).",
        ],
        timing: "~30 min, long document + Q&A. Structured notes on the argument's architecture.",
      },
      reading: {
        goal: "Read anything, including abstract, literary or specialised prose, with full appreciation of nuance.",
        approach: [
          "Read for argument AND style — implication, register, rhetorical strategy.",
          "Reformulate dense or literary expressions faithfully and idiomatically.",
        ],
        traps: [
          "Over-literal reading of figurative or ironic passages.",
        ],
        timing: "Read fully, then interpret; C2 prizes depth over speed.",
      },
      writing: {
        goal: "Produce a ~700-word structured, editorial-quality text from a rich dossier, with an assumed, original stance.",
        approach: [
          "Exploit the dossier expertly — synthesise and mobilise sources without paraphrase.",
          "Problematise ORIGINALLY; structure with titled parts and a strong through-line.",
          "Write with stylistic range: varied tenses, fine modalisation, precise, elegant lexis.",
        ],
        template: "Titre fort + chapeau.\nParties titrées (II–III) chacune adossée au dossier.\nPosition assumée, progression maîtrisée.\nConclusion qui ouvre.",
        phrases: [
          { fr: "loin de se réduire à… / il serait réducteur de… / ce n'est qu'au prix de…", en: "High-register nuance." },
          { fr: "à rebours de l'idée reçue selon laquelle…", en: "Overturn a received idea." },
        ],
        traps: [
          "Long verbatim quotes instead of expert integration of the dossier.",
          "Competent-but-flat style — C2 requires genuine command and originality.",
        ],
        timing: "~3h30. Read the dossier deeply, plan an original structure, write, then refine style.",
      },
      speaking: {
        goal: "Deliver a compte rendu and sustain a high-level debate from a complex dossier, with full mastery of discourse.",
        approach: [
          "Synthesise a rich dossier into a fine problématique and a compelling structure.",
          "Speak with oratorical control: rhythm, register shifts, precise formulation.",
          "In the debate, show real thought — anticipate, concede strategically, and lead the exchange.",
        ],
        phrases: [
          { fr: "Il importe de remarquer que… ; gardons-nous de… ; c'est précisément là que…", en: "Oratorical framing." },
        ],
        traps: [
          "Recitation over genuine argument; C2 debate rewards live thinking.",
        ],
        timing: "~1h prep, ~30 min oral (compte rendu + débat).",
      },
    },
  },

  /* =============================================================
   * TCF per-level strategy (Test de Connaissance du Français).
   * The TCF is score-based (not pass/fail): each item band maps to a
   * CEFR level. Strategy scales across levels; C1 is the detailed
   * target (see tcfC1 for the full dossier).
   * ============================================================= */
  tcf: {
    A1: {
      goal: "Reach the A1 band by nailing concrete, everyday items and not losing easy points.",
      approach: [
        "Compréhension orale/écrite: answer the concrete fact directly (time, place, price, need).",
        "Never leave an MCQ blank — there's no negative marking on the TCF.",
        "Expression écrite (tâche 1): a short correct message beats an ambitious broken one.",
        "Expression orale (tâche 1): present yourself fluently — rehearse until automatic.",
      ],
      phrases: [
        { fr: "Je voudrais… / Il y a… / Est-ce qu'il y a… ?", en: "Everyday survival language." },
      ],
      traps: ["Overthinking simple items and second-guessing a correct first instinct."],
      timing: "The TCF is time-boxed per section — pace yourself and always answer every MCQ.",
    },
    A2: {
      goal: "Consolidate the A2 band with reliable everyday comprehension and simple structured production.",
      approach: [
        "Track who/what/when in short dialogues; watch for changes and reasons.",
        "EE: cover the social function AND the practical details; use the passé composé correctly.",
        "EO: extend answers with 'parce que' and simple examples.",
      ],
      traps: ["avoir/être auxiliary errors; missing past-participle agreement."],
      timing: "Answer every MCQ; keep written tasks within word range.",
    },
    B1: {
      goal: "Push into the B1 band by handling main ideas + details and producing structured opinion.",
      approach: [
        "CO/CE: separate main idea from detail; beware options that are true but off-question.",
        "EE: intro (position) → 2 arguments with examples → short conclusion.",
        "EO: never one-word answers — justify with 'parce que' or an example; reach compromises in interaction.",
      ],
      phrases: [
        { fr: "À mon avis… ; d'une part… d'autre part… ; par exemple…", en: "Opinion + structure." },
      ],
      traps: ["Listing arguments with no example; undivided blocks of text."],
      timing: "Budget MCQ time so the harder late items still get an answer.",
    },
    B2: {
      goal: "Secure the B2 band with argumentation, nuance and formal register.",
      approach: [
        "CO/CE: follow argument structure and concessions; answer inference, not just word-matching.",
        "EE: problematise, argue with examples, concede, stay formal.",
        "EO: take a position and defend it; reformulate objections before answering.",
      ],
      phrases: [
        { fr: "Certes… toutefois… ; il n'en demeure pas moins que…", en: "Concede then reassert." },
      ],
      traps: ["Binary positions; informal register; missing examples."],
      timing: "Don't overspend on one long reading passage — leave time for the rest.",
    },
    C1: {
      goal: "Reach the C1 band: abstract comprehension + sophisticated, well-structured production. (See the full C1 dossier.)",
      approach: [
        "CO/CE: track reasoning, distinctions and implicit stance; reformulate abstract ideas.",
        "EE: neutral thematic synthesis (no 'je') + assumed nuanced essay; wide lexis + complex grammar.",
        "EO: transversal problématique from a dossier; structured exposé; genuine debate.",
      ],
      phrases: [
        { fr: "Il convient de nuancer… ; loin de… , … ; quand bien même…", en: "C1-level nuance." },
      ],
      traps: ["'je' in the synthesis; doc-by-doc structure; copying sources; repetitive vocabulary."],
      timing: "See the C1 dossier for a full per-section pacing plan.",
    },
    C2: {
      goal: "Reach the C2 band: full mastery — implicit meaning, style, original problematisation.",
      approach: [
        "CO/CE: grasp irony, tone and rhetorical structure; reformulate elegantly.",
        "Production: expert use of sources, original structure, stylistic range.",
      ],
      traps: ["Over-literal reading; flat, competent-but-unremarkable style."],
      timing: "Depth over speed; use prep time to build an original angle.",
    },
  },

  /* =============================================================
   * TCF C1 dossier — the focused "how to score C1" material.
   * ============================================================= */
  tcfC1: {
    intro:
      "The TCF is scored on a continuous scale; a C1 result means consistently hitting the C1 band across sections. C1 is defined by ABSTRACTION (handling complex, implicit ideas) and CONTROL (structured, nuanced, wide-ranging production). This dossier gives you the targets, tactics, language and pacing to land in that band.",
    targets: [
      { skill: "Compréhension orale", note: "Follow long, dense broadcasts; catch stance, distinctions and implication — not just facts." },
      { skill: "Compréhension écrite", note: "Interpret long abstract articles; separate the author's view from reported views; reformulate dense expressions." },
      { skill: "Expression écrite", note: "Neutral thematic synthesis (no opinion) + assumed, nuanced essay, with lexical range and complex, controlled grammar." },
      { skill: "Expression orale", note: "Transversal problématique from a dossier, structured original exposé, and genuine reasoning in debate." },
    ],
    sections: {
      listening: {
        goal: "Land C1 comprehension: reasoning, nuance and implicit stance in long single-play audio.",
        approach: [
          "Structured note-taking is non-negotiable — capture thesis, key distinctions, paradoxes, proposed solution.",
          "Listen for the SPEAKER'S position vs positions they report or critique.",
          "Practise reformulating abstract ideas aloud immediately after listening.",
        ],
        traps: ["Chasing every word instead of the argument's shape; confusing reported and held views."],
      },
      reading: {
        goal: "Interpret long abstract prose and reformulate dense conceptual language.",
        approach: [
          "One full read for thesis + plan, then targeted re-reads to answer.",
          "Unpack abstractions in plain French; distinguish authorial voice from cited voices.",
        ],
        traps: ["Attributing a criticised opinion to the author; surface reformulations."],
      },
      writing: {
        goal: "Neutral synthesis + assumed essay at C1 control.",
        approach: [
          "Synthèse: THEMES not documents, total neutrality, zero copying, systematic reformulation.",
          "Essai: clear nuanced thesis, dialectical/thematic plan, precise varied examples.",
          "Show off controlled complex grammar (subjonctif, conditionnel, concessive clauses) and lexical range.",
        ],
        traps: ["'je' in synthesis; doc-by-doc structure; copying; repetition; register slips."],
      },
      speaking: {
        goal: "Structured, original exposé from a dossier + real debate.",
        approach: [
          "Build a transversal problématique; use documents as support, not scaffolding.",
          "Announce a plan; deliver with fluency; in debate, concede fairly then push back with reasoning.",
        ],
        traps: ["Doc-by-doc summary; a recited exposé that breaks under debate pressure."],
      },
    },
    // High-value C1 connectors and framing language, grouped by function.
    connectors: [
      { fn: "Nuancer / concéder", items: [
        { fr: "Certes…, il n'en demeure pas moins que…", en: "Admittedly…, nevertheless the fact remains that…" },
        { fr: "Quand bien même…", en: "Even if / even supposing that…" },
        { fr: "Loin de… , …", en: "Far from …, …" },
        { fr: "Il convient toutefois de nuancer.", en: "It should nonetheless be qualified." },
      ]},
      { fn: "Opposer / contraster", items: [
        { fr: "À rebours de l'idée reçue selon laquelle…", en: "Contrary to the received idea that…" },
        { fr: "Là où les uns…, d'autres…", en: "Where some…, others…" },
        { fr: "À l'inverse / En revanche / Or…", en: "Conversely / However / Yet…" },
      ]},
      { fn: "Structurer / articuler", items: [
        { fr: "Il ressort de ces documents que…", en: "It emerges from these documents that…" },
        { fr: "Dans le prolongement de…", en: "In line with / extending…" },
        { fr: "Cela nous conduit à nous interroger sur…", en: "This leads us to question…" },
      ]},
      { fn: "Conclure / ouvrir", items: [
        { fr: "En définitive / En dernière analyse…", en: "Ultimately / In the final analysis…" },
        { fr: "Reste à savoir si…", en: "It remains to be seen whether…" },
      ]},
    ],
    // Reusable production frameworks.
    frameworks: [
      {
        name: "Synthèse (EE, ~220 mots — neutre)",
        steps: [
          "Introduction: présenter le thème et dégager une problématique commune aux documents (sans 'je').",
          "Axe 1: croiser ce que disent les documents sur un premier aspect (reformulation systématique).",
          "Axe 2 (et 3 si utile): un autre aspect, en reliant/opposant les sources.",
          "Conclusion: bilan neutre de ce qui ressort — aucune opinion personnelle.",
        ],
      },
      {
        name: "Essai argumenté (EE, ~250 mots — position assumée)",
        steps: [
          "Introduction: contexte bref + problématique + annonce d'une thèse nuancée.",
          "Partie 1: votre thèse, appuyée par 2 exemples précis et variés.",
          "Partie 2: concession / antithèse honnête ('Certes…'), puis dépassement.",
          "Conclusion: position assumée + ouverture ('Reste à savoir si…').",
        ],
      },
      {
        name: "Exposé oral à partir d'un dossier (EO)",
        steps: [
          "Accroche + problématique transversale au dossier (pas doc par doc).",
          "Plan annoncé en deux ou trois parties.",
          "Développement: arguments soutenus par les documents en appui ponctuel.",
          "Conclusion + transition vers le débat; puis concéder loyalement et répondre par le raisonnement.",
        ],
      },
    ],
    // Abstract-topic vocabulary that recurs in C1 documents and prompts.
    vocab: [
      { theme: "Société & numérique", words: "la sursollicitation, l'économie de l'attention, la fracture numérique, la modalisation, l'imputabilité, un impensé" },
      { theme: "Économie & écologie", words: "externaliser des coûts, un changement systémique, la soutenabilité, un indicateur de richesse, la comptabilité écologique" },
      { theme: "Culture & pensée", words: "une problématique, le temps long, une distinction conceptuelle, un paradoxe fécond, la délibération, une idée reçue" },
      { theme: "Argumentation", words: "corroborer, nuancer, réfuter, étayer, présupposer, une concession, une thèse, une antithèse" },
    ],
    plan: [
      "8–12 weeks out: read/listen to French current-affairs media daily (France Culture, Le Monde, Courrier international); note abstract vocabulary and connectors.",
      "Weekly: one full synthèse + one essai, self-graded on the DALF C1 writing rubric (available in the DELF tab).",
      "Weekly: one dossier-based oral exposé recorded and graded (use the Speak/DELF speaking grader).",
      "Drill reformulation: after every listening/reading text, restate its thesis in 2–3 sentences of your own French.",
      "Final 2 weeks: full timed mock sections; verify pacing; refine your connector and framework repertoire until automatic.",
    ],
  },
};
