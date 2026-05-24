/* ===== French curriculum: A1 → C1 =====
 * Curated seed content per CEFR level. Each level has:
 *   - vocab: word/phrase items with IPA-ish hint + English
 *   - grammar: focus points (used to prime the AI tutor and reading/listening generation)
 *   - phonetics: pronunciation focus notes for the level
 * Claude expands these on demand so practice never runs out, but everything
 * below works fully offline.
 */
window.CURRICULUM = {
  levels: ["A1", "A2", "B1", "B2", "C1"],

  levelNames: {
    A1: "Débutant",
    A2: "Élémentaire",
    B1: "Intermédiaire",
    B2: "Avancé",
    C1: "Autonome",
  },

  // What a learner should be able to do at each level (drives AI tutor difficulty).
  canDo: {
    A1: "introduce yourself, greet people, use numbers, order food, talk about daily basics in short phrases",
    A2: "describe routines, the past with passé composé, make simple plans, shop, ask directions",
    B1: "narrate experiences, give opinions, handle most travel situations, use future and imperfect, connect ideas",
    B2: "argue a point of view, understand abstract texts, use the subjunctive, nuance and hypotheticals (conditionnel)",
    C1: "express ideas fluently and spontaneously, use idiomatic and register-appropriate language, structure complex argument, subtle connotation",
  },

  // Absolute-beginner foundations — taught BEFORE A1 grammar. The very first
  // things a learner needs: the alphabet, accents, vowel sounds, etc. These appear
  // at the top of the A1 course index and the AI tutor can teach each one.
  foundations: [
    "the French alphabet (how each letter is named)",
    "the accents (é è ê ç) and what they change",
    "the vowel sounds (a, e, i, o, u and é/è/e)",
    "tricky letter combinations (ou, on, ch, gn, eau, oi)",
    "numbers 0 to 20 (saying them aloud)",
    "first essential words & greetings (bonjour, merci, oui/non)",
  ],

  phonetics: {
    A1: ["French vowels é/è/e", "the silent final consonant", "basic liaison (les_amis)"],
    A2: ["nasal vowels: on / an / in", "the French R (uvular)", "u vs ou (tu / tout)"],
    B1: ["liaison rules (obligatory vs forbidden)", "enchaînement", "rhythm & even syllable stress"],
    B2: ["intonation of questions vs statements", "schwa (e muet) dropping", "smooth liaison in fast speech"],
    C1: ["register & prosody", "emphatic stress for nuance", "near-native rhythm and reductions"],
  },

  grammar: {
    A1: ["present tense of être/avoir", "definite/indefinite articles", "subject pronouns", "basic negation ne...pas", "numbers 0–100"],
    A2: ["passé composé with avoir/être", "near future (aller + infinitif)", "reflexive verbs", "possessive adjectives", "comparatives"],
    B1: ["imparfait vs passé composé", "futur simple", "relative pronouns qui/que", "pronouns y and en", "connectors"],
    B2: ["subjonctif présent", "conditionnel présent & passé", "passive voice", "indirect speech", "advanced connectors"],
    C1: ["subjonctif passé", "concordance des temps", "stylistic inversion", "nominalisation", "register shifting (soutenu/familier)"],
  },

  vocab: {
    A1: [
      { fr: "Bonjour", ipa: "bɔ̃ʒuʁ", en: "Hello / Good morning" },
      { fr: "Comment ça va ?", ipa: "kɔmɑ̃ sa va", en: "How are you?" },
      { fr: "Je m'appelle Marie.", ipa: "ʒə mapɛl maʁi", en: "My name is Marie." },
      { fr: "Merci beaucoup.", ipa: "mɛʁsi boku", en: "Thank you very much." },
      { fr: "S'il vous plaît", ipa: "sil vu plɛ", en: "Please" },
      { fr: "Je voudrais un café.", ipa: "ʒə vudʁɛ œ̃ kafe", en: "I would like a coffee." },
      { fr: "Oui, d'accord.", ipa: "wi dakɔʁ", en: "Yes, okay." },
      { fr: "Je ne comprends pas.", ipa: "ʒə nə kɔ̃pʁɑ̃ pa", en: "I don't understand." },
      { fr: "Au revoir !", ipa: "o ʁəvwaʁ", en: "Goodbye!" },
      { fr: "Excusez-moi.", ipa: "ɛkskyze mwa", en: "Excuse me." },
    ],
    A2: [
      { fr: "Hier, j'ai mangé au restaurant.", ipa: "jɛʁ ʒe mɑ̃ʒe o ʁɛstoʁɑ̃", en: "Yesterday I ate at the restaurant." },
      { fr: "Je vais aller à Paris demain.", ipa: "ʒə vɛ ale a paʁi dəmɛ̃", en: "I'm going to go to Paris tomorrow." },
      { fr: "Je me lève à sept heures.", ipa: "ʒə mə lɛv a sɛt œʁ", en: "I get up at seven o'clock." },
      { fr: "Pouvez-vous m'aider, s'il vous plaît ?", ipa: "puve vu mede", en: "Can you help me, please?" },
      { fr: "Où est la gare ?", ipa: "u ɛ la ɡaʁ", en: "Where is the train station?" },
      { fr: "C'est plus cher que ça.", ipa: "sɛ ply ʃɛʁ kə sa", en: "It's more expensive than that." },
      { fr: "Mon frère travaille à Lyon.", ipa: "mɔ̃ fʁɛʁ tʁavaj a ljɔ̃", en: "My brother works in Lyon." },
    ],
    B1: [
      { fr: "Quand j'étais petit, je jouais au foot.", ipa: "kɑ̃ ʒetɛ pəti ʒə ʒwɛ o fut", en: "When I was little, I used to play football." },
      { fr: "À mon avis, c'est une bonne idée.", ipa: "a mɔ̃n‿avi sɛt‿yn bɔn‿ide", en: "In my opinion, it's a good idea." },
      { fr: "Je pense que nous y arriverons.", ipa: "ʒə pɑ̃s kə nuz‿i aʁivəʁɔ̃", en: "I think we'll get there." },
      { fr: "C'est la personne qui m'a aidé.", ipa: "sɛ la pɛʁsɔn ki ma ede", en: "That's the person who helped me." },
      { fr: "J'en ai besoin pour le travail.", ipa: "ʒɑ̃n‿e bəzwɛ̃ puʁ lə tʁavaj", en: "I need it for work." },
      { fr: "Si j'ai le temps, je viendrai.", ipa: "si ʒe lə tɑ̃ ʒə vjɛ̃dʁe", en: "If I have time, I'll come." },
    ],
    B2: [
      { fr: "Il faut que je parte maintenant.", ipa: "il fo kə ʒə paʁt mɛ̃tnɑ̃", en: "I have to leave now." },
      { fr: "Je doute qu'il vienne ce soir.", ipa: "ʒə dut kil vjɛn sə swaʁ", en: "I doubt he'll come tonight." },
      { fr: "Si j'avais su, je serais venu.", ipa: "si ʒavɛ sy ʒə səʁɛ vəny", en: "Had I known, I would have come." },
      { fr: "Bien que ce soit difficile, je continue.", ipa: "bjɛ̃ kə sə swa difisil", en: "Although it's hard, I continue." },
      { fr: "Cette décision a été prise par le comité.", ipa: "sɛt desizjɔ̃ a ete pʁiz paʁ lə kɔmite", en: "This decision was made by the committee." },
      { fr: "Il m'a dit qu'il avait terminé.", ipa: "il ma di kil avɛ tɛʁmine", en: "He told me he had finished." },
    ],
    C1: [
      { fr: "Quoi qu'il en soit, la question demeure entière.", ipa: "kwa kil‿ɑ̃ swa la kɛstjɔ̃ dəmœʁ‿ɑ̃tjɛʁ", en: "Be that as it may, the question remains entirely open." },
      { fr: "Force est de constater que les choses ont changé.", ipa: "fɔʁs‿ɛ də kɔ̃state", en: "One has to admit that things have changed." },
      { fr: "Il n'en demeure pas moins que cela pose problème.", ipa: "il nɑ̃ dəmœʁ pa mwɛ̃", en: "It nonetheless remains the case that this is problematic." },
      { fr: "Loin de moi l'idée de vous contredire.", ipa: "lwɛ̃ də mwa lide", en: "Far be it from me to contradict you." },
      { fr: "À supposer que ce soit vrai, qu'en concluriez-vous ?", ipa: "a sypoze kə sə swa vʁɛ", en: "Supposing it were true, what would you conclude?" },
      { fr: "Cela relève d'une logique purement spéculative.", ipa: "səla ʁəlɛv dyn lɔʒik pyʁmɑ̃ spekylativ", en: "This falls within a purely speculative logic." },
    ],
  },

  /* ----- Themed vocabulary banks (for the TCF — by topic, not just level) -----
   * Each theme has a tag (rough CEFR where it's most useful) and word items
   * {fr, en} that the Basics tab renders as playable, learnable lists. */
  themes: [
    { id: "greetings", title: "Greetings & politeness", icon: "👋", level: "A1", words: [
      { fr: "Bonjour", en: "Hello / Good morning" }, { fr: "Bonsoir", en: "Good evening" },
      { fr: "Salut", en: "Hi / Bye (casual)" }, { fr: "Au revoir", en: "Goodbye" },
      { fr: "Merci / Merci beaucoup", en: "Thank you / Thanks a lot" }, { fr: "De rien", en: "You're welcome" },
      { fr: "S'il vous plaît", en: "Please (formal)" }, { fr: "Excusez-moi", en: "Excuse me" },
      { fr: "Pardon", en: "Sorry / Pardon" }, { fr: "Enchanté(e)", en: "Nice to meet you" },
    ]},
    { id: "family", title: "Family & people", icon: "👨‍👩‍👧", level: "A1", words: [
      { fr: "la famille", en: "family" }, { fr: "le père / la mère", en: "father / mother" },
      { fr: "le fils / la fille", en: "son / daughter" }, { fr: "le frère / la sœur", en: "brother / sister" },
      { fr: "les parents", en: "parents" }, { fr: "les grands-parents", en: "grandparents" },
      { fr: "le mari / la femme", en: "husband / wife" }, { fr: "l'ami(e)", en: "friend" },
      { fr: "le collègue", en: "colleague" }, { fr: "le voisin / la voisine", en: "neighbour" },
    ]},
    { id: "numbers", title: "Numbers & quantities", icon: "🔢", level: "A1", words: [
      { fr: "un, deux, trois", en: "one, two, three" }, { fr: "dix / vingt / cent", en: "ten / twenty / hundred" },
      { fr: "premier / deuxième", en: "first / second" }, { fr: "beaucoup / peu", en: "a lot / a little" },
      { fr: "trop / assez", en: "too much / enough" }, { fr: "plusieurs", en: "several" },
      { fr: "la moitié", en: "half" }, { fr: "un kilo / un litre", en: "a kilo / a litre" },
    ]},
    { id: "food", title: "Food & restaurant", icon: "🍽️", level: "A2", words: [
      { fr: "le petit-déjeuner", en: "breakfast" }, { fr: "le déjeuner / le dîner", en: "lunch / dinner" },
      { fr: "l'eau / le vin", en: "water / wine" }, { fr: "le pain / le fromage", en: "bread / cheese" },
      { fr: "l'addition", en: "the bill" }, { fr: "la carte / le menu", en: "the menu" },
      { fr: "commander", en: "to order" }, { fr: "Je voudrais…", en: "I would like…" },
      { fr: "C'était délicieux", en: "It was delicious" }, { fr: "végétarien(ne)", en: "vegetarian" },
    ]},
    { id: "travel", title: "Travel & directions", icon: "🧳", level: "A2", words: [
      { fr: "la gare / l'aéroport", en: "station / airport" }, { fr: "le billet", en: "ticket" },
      { fr: "le départ / l'arrivée", en: "departure / arrival" }, { fr: "à droite / à gauche", en: "right / left" },
      { fr: "tout droit", en: "straight ahead" }, { fr: "près de / loin de", en: "near / far from" },
      { fr: "réserver", en: "to book" }, { fr: "annuler", en: "to cancel" },
      { fr: "en retard / à l'heure", en: "late / on time" }, { fr: "la valise", en: "suitcase" },
    ]},
    { id: "work", title: "Work & studies", icon: "💼", level: "B1", words: [
      { fr: "le travail / l'emploi", en: "work / job" }, { fr: "l'entreprise", en: "company" },
      { fr: "le collègue / le chef", en: "colleague / boss" }, { fr: "une réunion", en: "a meeting" },
      { fr: "un entretien", en: "an interview" }, { fr: "un stage", en: "an internship" },
      { fr: "le salaire", en: "salary" }, { fr: "les études", en: "studies" },
      { fr: "un diplôme", en: "a degree" }, { fr: "postuler", en: "to apply (for a job)" },
    ]},
    { id: "opinions", title: "Opinions & connectors", icon: "💬", level: "B1", words: [
      { fr: "à mon avis", en: "in my opinion" }, { fr: "je pense que / je trouve que", en: "I think that" },
      { fr: "d'une part… d'autre part", en: "on one hand… on the other" }, { fr: "par exemple", en: "for example" },
      { fr: "parce que / car", en: "because" }, { fr: "cependant / pourtant", en: "however / yet" },
      { fr: "en revanche", en: "on the other hand" }, { fr: "donc / par conséquent", en: "so / therefore" },
      { fr: "en conclusion", en: "in conclusion" }, { fr: "il me semble que", en: "it seems to me that" },
    ]},
    { id: "society", title: "Society & current issues", icon: "🌍", level: "B2", words: [
      { fr: "l'environnement", en: "the environment" }, { fr: "le réchauffement climatique", en: "global warming" },
      { fr: "le chômage", en: "unemployment" }, { fr: "les inégalités", en: "inequalities" },
      { fr: "le développement durable", en: "sustainable development" }, { fr: "les réseaux sociaux", en: "social media" },
      { fr: "la mondialisation", en: "globalisation" }, { fr: "une enquête / un sondage", en: "a survey / poll" },
      { fr: "lutter contre", en: "to fight against" }, { fr: "avoir un impact sur", en: "to have an impact on" },
    ]},
    { id: "abstract", title: "Abstract & argument (C1)", icon: "🎓", level: "C1", words: [
      { fr: "un enjeu", en: "a stake / issue" }, { fr: "une tendance", en: "a trend" },
      { fr: "remettre en question", en: "to call into question" }, { fr: "nuancer", en: "to qualify / add nuance" },
      { fr: "force est de constater", en: "one must admit" }, { fr: "il n'en demeure pas moins que", en: "it nonetheless remains that" },
      { fr: "par ailleurs", en: "moreover" }, { fr: "néanmoins / toutefois", en: "nevertheless" },
      { fr: "dans la mesure où", en: "insofar as" }, { fr: "à terme", en: "in the long run" },
    ]},

    /* ----- balance pass: each level now has 3–4 themed banks ----- */

    /* A1 (+1 → 4 banks) */
    { id: "daily", title: "Daily life & home", icon: "🏠", level: "A1", words: [
      { fr: "la maison / l'appartement", en: "house / flat" }, { fr: "la chambre", en: "bedroom" },
      { fr: "la cuisine", en: "kitchen" }, { fr: "la salle de bain", en: "bathroom" },
      { fr: "se lever / se coucher", en: "to get up / go to bed" }, { fr: "manger / boire", en: "to eat / drink" },
      { fr: "travailler", en: "to work" }, { fr: "dormir", en: "to sleep" },
      { fr: "aujourd'hui / demain", en: "today / tomorrow" }, { fr: "le matin / le soir", en: "morning / evening" },
      { fr: "la semaine / le week-end", en: "week / weekend" }, { fr: "tous les jours", en: "every day" },
    ]},

    /* A2 (+2 → 4 banks) */
    { id: "shopping", title: "Shopping & money", icon: "🛒", level: "A2", words: [
      { fr: "le magasin / la boutique", en: "shop / store" }, { fr: "le marché", en: "market" },
      { fr: "acheter / vendre", en: "to buy / sell" }, { fr: "payer", en: "to pay" },
      { fr: "l'argent / la monnaie", en: "money / change" }, { fr: "la carte bancaire", en: "bank card" },
      { fr: "cher / pas cher", en: "expensive / cheap" }, { fr: "les soldes / une réduction", en: "sales / a discount" },
      { fr: "la taille / la pointure", en: "size (clothes / shoes)" }, { fr: "Ça coûte combien ?", en: "How much is it?" },
    ]},
    { id: "health", title: "Health & body", icon: "🩺", level: "A2", words: [
      { fr: "le corps", en: "body" }, { fr: "la tête / le ventre", en: "head / stomach" },
      { fr: "le médecin", en: "doctor" }, { fr: "la pharmacie", en: "pharmacy" },
      { fr: "malade", en: "sick" }, { fr: "avoir mal à…", en: "to have pain in…" },
      { fr: "la fièvre", en: "fever" }, { fr: "un médicament", en: "medicine" },
      { fr: "un rendez-vous", en: "an appointment" }, { fr: "se reposer", en: "to rest" },
    ]},

    /* B1 (+2 → 4 banks) */
    { id: "leisure", title: "Leisure, media & culture", icon: "🎬", level: "B1", words: [
      { fr: "les loisirs", en: "hobbies / leisure" }, { fr: "un film / une série", en: "a film / a series" },
      { fr: "la musique", en: "music" }, { fr: "un roman", en: "a novel" },
      { fr: "une exposition", en: "an exhibition" }, { fr: "un spectacle", en: "a show" },
      { fr: "les actualités / les infos", en: "the news" }, { fr: "un journal", en: "a newspaper" },
      { fr: "assister à", en: "to attend" }, { fr: "ça vaut le coup", en: "it's worth it" },
    ]},
    { id: "feelings", title: "Feelings & relationships", icon: "💞", level: "B1", words: [
      { fr: "content / heureux", en: "glad / happy" }, { fr: "triste", en: "sad" },
      { fr: "inquiet / stressé", en: "worried / stressed" }, { fr: "avoir peur", en: "to be afraid" },
      { fr: "être déçu(e)", en: "to be disappointed" }, { fr: "s'entendre bien avec", en: "to get on well with" },
      { fr: "se disputer", en: "to argue" }, { fr: "faire confiance à", en: "to trust" },
      { fr: "manquer à quelqu'un", en: "to be missed by someone" }, { fr: "tomber amoureux(se)", en: "to fall in love" },
    ]},

    /* B2 (+3 → 4 banks) */
    { id: "education", title: "Education & work debate", icon: "🎓", level: "B2", words: [
      { fr: "la formation", en: "training" }, { fr: "les compétences", en: "skills" },
      { fr: "le marché du travail", en: "the job market" }, { fr: "la précarité", en: "job insecurity" },
      { fr: "le télétravail", en: "remote work" }, { fr: "l'équilibre vie pro/vie privée", en: "work-life balance" },
      { fr: "favoriser", en: "to promote / favour" }, { fr: "remettre en cause", en: "to question / challenge" },
      { fr: "à long terme", en: "in the long term" }, { fr: "un atout / un inconvénient", en: "an asset / a drawback" },
    ]},
    { id: "techsci", title: "Technology & science", icon: "🔬", level: "B2", words: [
      { fr: "l'intelligence artificielle", en: "artificial intelligence" }, { fr: "les données", en: "data" },
      { fr: "la vie privée", en: "privacy" }, { fr: "une innovation", en: "an innovation" },
      { fr: "une découverte", en: "a discovery" }, { fr: "une expérience", en: "an experiment" },
      { fr: "fiable", en: "reliable" }, { fr: "les conséquences", en: "the consequences" },
      { fr: "soulever des questions", en: "to raise questions" }, { fr: "avoir recours à", en: "to resort to" },
    ]},
    { id: "opinion-strong", title: "Stating & defending a view", icon: "🗣️", level: "B2", words: [
      { fr: "je suis convaincu(e) que", en: "I'm convinced that" }, { fr: "il est indéniable que", en: "it's undeniable that" },
      { fr: "certes…, mais…", en: "admittedly…, but…" }, { fr: "en effet", en: "indeed" },
      { fr: "au contraire", en: "on the contrary" }, { fr: "d'autant plus que", en: "all the more so since" },
      { fr: "en ce qui concerne", en: "as regards" }, { fr: "souligner / mettre en avant", en: "to stress / highlight" },
      { fr: "à juste titre", en: "rightly so" }, { fr: "force est d'admettre", en: "one must admit" },
    ]},

    /* C1 (+3 → 4 banks) */
    { id: "nuance", title: "Nuance & precision", icon: "🎯", level: "C1", words: [
      { fr: "une nuance / un bémol", en: "a nuance / a reservation" }, { fr: "relativiser", en: "to put into perspective" },
      { fr: "dans une certaine mesure", en: "to a certain extent" }, { fr: "voire", en: "even / indeed" },
      { fr: "à savoir", en: "namely" }, { fr: "en l'occurrence", en: "in this case / as it happens" },
      { fr: "le cas échéant", en: "if applicable / should the case arise" }, { fr: "sous réserve de", en: "subject to" },
      { fr: "quitte à", en: "even if it means" }, { fr: "loin s'en faut", en: "far from it" },
    ]},
    { id: "politics", title: "Politics & society (advanced)", icon: "🏛️", level: "C1", words: [
      { fr: "les pouvoirs publics", en: "the authorities" }, { fr: "une réforme", en: "a reform" },
      { fr: "la citoyenneté", en: "citizenship" }, { fr: "les libertés individuelles", en: "individual freedoms" },
      { fr: "le débat public", en: "public debate" }, { fr: "les enjeux sociétaux", en: "societal stakes" },
      { fr: "encadrer / réglementer", en: "to regulate" }, { fr: "creuser les inégalités", en: "to widen inequalities" },
      { fr: "un clivage", en: "a divide / split" }, { fr: "faire consensus", en: "to be widely agreed on" },
    ]},
    { id: "literary", title: "Arts & literary register", icon: "📜", level: "C1", words: [
      { fr: "une œuvre", en: "a work (of art)" }, { fr: "l'auteur / l'autrice", en: "the author" },
      { fr: "le style / la plume", en: "the style / the writing" }, { fr: "une métaphore", en: "a metaphor" },
      { fr: "le registre", en: "the register / tone" }, { fr: "subtil / saisissant", en: "subtle / striking" },
      { fr: "dépeindre", en: "to depict" }, { fr: "susciter l'émotion", en: "to evoke emotion" },
      { fr: "s'inscrire dans", en: "to be part of / fit within" }, { fr: "à l'instar de", en: "like / following the example of" },
    ]},
  ],
};
