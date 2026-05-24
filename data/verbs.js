/* ===== French verb conjugation tables: A1 → C1 =====
 * Systematic verb teaching + drilling, level by level. Each entry is one
 * "table" the learner studies, then drills (fill-in conjugation quizzes are
 * generated from the same data, so tables and drills never disagree).
 *
 * Shape:
 *   {
 *     id, level,
 *     verb,            // infinitive (or pattern name, e.g. "-er verbs")
 *     en,              // English meaning
 *     tense,           // tense/mood name shown to the learner
 *     note,            // one-line teaching note (English)
 *     forms: [         // the six persons, in standard order
 *       ["je", "suis"], ["tu", "es"], ["il/elle", "est"],
 *       ["nous", "sommes"], ["vous", "êtes"], ["ils/elles", "sont"]
 *     ],
 *     example          // a model sentence using the verb (French — English)
 *   }
 *
 * The pronoun column may include elision (j', qu') already applied.
 * Everything works fully offline.
 */
window.VERBS = [
  /* ---------------- A1 ---------------- */
  {
    id: "etre-present", level: "A1", verb: "être", en: "to be", tense: "Présent",
    note: "The most important verb in French. Irregular — memorize it.",
    forms: [["je", "suis"], ["tu", "es"], ["il/elle", "est"], ["nous", "sommes"], ["vous", "êtes"], ["ils/elles", "sont"]],
    example: "Je suis étudiant. — I am a student.",
  },
  {
    id: "avoir-present", level: "A1", verb: "avoir", en: "to have", tense: "Présent",
    note: "Also used for age (« j'ai 20 ans ») and to build the past tense.",
    forms: [["j'", "ai"], ["tu", "as"], ["il/elle", "a"], ["nous", "avons"], ["vous", "avez"], ["ils/elles", "ont"]],
    example: "J'ai deux frères. — I have two brothers.",
  },
  {
    id: "er-present", level: "A1", verb: "parler", en: "to speak (-er pattern)", tense: "Présent",
    note: "~80% of verbs follow this -er pattern. Drop -er, add: -e -es -e -ons -ez -ent.",
    forms: [["je", "parle"], ["tu", "parles"], ["il/elle", "parle"], ["nous", "parlons"], ["vous", "parlez"], ["ils/elles", "parlent"]],
    example: "Nous parlons français. — We speak French.",
  },
  {
    id: "aller-present", level: "A1", verb: "aller", en: "to go", tense: "Présent",
    note: "Irregular. Also builds the near future (aller + infinitive).",
    forms: [["je", "vais"], ["tu", "vas"], ["il/elle", "va"], ["nous", "allons"], ["vous", "allez"], ["ils/elles", "vont"]],
    example: "Je vais à Paris. — I'm going to Paris.",
  },
  {
    id: "faire-present", level: "A1", verb: "faire", en: "to do / to make", tense: "Présent",
    note: "Very common, irregular. Used in many fixed expressions (faire du sport).",
    forms: [["je", "fais"], ["tu", "fais"], ["il/elle", "fait"], ["nous", "faisons"], ["vous", "faites"], ["ils/elles", "font"]],
    example: "Que fais-tu ? — What are you doing?",
  },

  /* ---------------- A2 ---------------- */
  {
    id: "ir-present", level: "A2", verb: "finir", en: "to finish (-ir pattern)", tense: "Présent",
    note: "Regular -ir verbs: drop -ir, add -is -is -it -issons -issez -issent.",
    forms: [["je", "finis"], ["tu", "finis"], ["il/elle", "finit"], ["nous", "finissons"], ["vous", "finissez"], ["ils/elles", "finissent"]],
    example: "Je finis mes devoirs. — I'm finishing my homework.",
  },
  {
    id: "re-present", level: "A2", verb: "vendre", en: "to sell (-re pattern)", tense: "Présent",
    note: "Regular -re verbs: drop -re, add -s -s -(nothing) -ons -ez -ent.",
    forms: [["je", "vends"], ["tu", "vends"], ["il/elle", "vend"], ["nous", "vendons"], ["vous", "vendez"], ["ils/elles", "vendent"]],
    example: "Ils vendent leur voiture. — They're selling their car.",
  },
  {
    id: "passe-compose-avoir", level: "A2", verb: "manger", en: "to eat — passé composé (avoir)", tense: "Passé composé",
    note: "Completed past: avoir + past participle. -er verbs → participle in -é.",
    forms: [["j'", "ai mangé"], ["tu", "as mangé"], ["il/elle", "a mangé"], ["nous", "avons mangé"], ["vous", "avez mangé"], ["ils/elles", "ont mangé"]],
    example: "Hier j'ai mangé au restaurant. — Yesterday I ate at the restaurant.",
  },
  {
    id: "passe-compose-etre", level: "A2", verb: "aller", en: "to go — passé composé (être)", tense: "Passé composé",
    note: "Movement/state verbs use être; the participle AGREES with the subject (allé/allée/allés).",
    forms: [["je", "suis allé(e)"], ["tu", "es allé(e)"], ["il/elle", "est allé(e)"], ["nous", "sommes allé(e)s"], ["vous", "êtes allé(e)s"], ["ils/elles", "sont allé(e)s"]],
    example: "Elle est allée au marché. — She went to the market.",
  },
  {
    id: "futur-proche", level: "A2", verb: "aller + infinitif", en: "near future", tense: "Futur proche",
    note: "« going to … »: conjugate aller, then add any verb in the infinitive.",
    forms: [["je", "vais partir"], ["tu", "vas partir"], ["il/elle", "va partir"], ["nous", "allons partir"], ["vous", "allez partir"], ["ils/elles", "vont partir"]],
    example: "Je vais partir demain. — I'm going to leave tomorrow.",
  },
  {
    id: "reflexive-present", level: "A2", verb: "se lever", en: "to get up (reflexive)", tense: "Présent",
    note: "Reflexive verbs carry a pronoun (me/te/se/nous/vous/se) before the verb.",
    forms: [["je", "me lève"], ["tu", "te lèves"], ["il/elle", "se lève"], ["nous", "nous levons"], ["vous", "vous levez"], ["ils/elles", "se lèvent"]],
    example: "Je me lève à sept heures. — I get up at seven.",
  },

  /* ---------------- B1 ---------------- */
  {
    id: "imparfait", level: "B1", verb: "parler", en: "to speak — imperfect", tense: "Imparfait",
    note: "Past description / habits / ongoing action. Stem = nous-form minus -ons, + -ais -ais -ait -ions -iez -aient.",
    forms: [["je", "parlais"], ["tu", "parlais"], ["il/elle", "parlait"], ["nous", "parlions"], ["vous", "parliez"], ["ils/elles", "parlaient"]],
    example: "Quand j'étais petit, je parlais espagnol. — When I was little, I spoke Spanish.",
  },
  {
    id: "etre-imparfait", level: "B1", verb: "être", en: "to be — imperfect", tense: "Imparfait",
    note: "Irregular stem ét-. Extremely common for past description (« c'était… »).",
    forms: [["j'", "étais"], ["tu", "étais"], ["il/elle", "était"], ["nous", "étions"], ["vous", "étiez"], ["ils/elles", "étaient"]],
    example: "C'était une belle journée. — It was a beautiful day.",
  },
  {
    id: "futur-simple", level: "B1", verb: "parler", en: "to speak — simple future", tense: "Futur simple",
    note: "« will … »: infinitive + endings -ai -as -a -ons -ez -ont.",
    forms: [["je", "parlerai"], ["tu", "parleras"], ["il/elle", "parlera"], ["nous", "parlerons"], ["vous", "parlerez"], ["ils/elles", "parleront"]],
    example: "Je te parlerai demain. — I'll speak to you tomorrow.",
  },
  {
    id: "futur-simple-irreg", level: "B1", verb: "être / avoir / aller / faire", en: "irregular future stems", tense: "Futur simple",
    note: "Same endings, irregular stems: être→ser-, avoir→aur-, aller→ir-, faire→fer-.",
    forms: [["je (être)", "serai"], ["j' (avoir)", "aurai"], ["j' (aller)", "irai"], ["je (faire)", "ferai"], ["nous (être)", "serons"], ["ils (avoir)", "auront"]],
    example: "Je serai là, j'aurai le temps. — I'll be there, I'll have time.",
  },
  {
    id: "venir-present", level: "B1", verb: "venir", en: "to come", tense: "Présent",
    note: "Irregular. « venir de + infinitif » = to have just done something.",
    forms: [["je", "viens"], ["tu", "viens"], ["il/elle", "vient"], ["nous", "venons"], ["vous", "venez"], ["ils/elles", "viennent"]],
    example: "Je viens de finir. — I've just finished.",
  },
  {
    id: "pouvoir-vouloir", level: "B1", verb: "pouvoir / vouloir", en: "can / want", tense: "Présent",
    note: "Two essential modal verbs, both irregular. Followed by an infinitive.",
    forms: [["je peux", "je veux"], ["tu peux", "tu veux"], ["il peut", "il veut"], ["nous pouvons", "nous voulons"], ["vous pouvez", "vous voulez"], ["ils peuvent", "ils veulent"]],
    example: "Je peux venir, je veux aider. — I can come, I want to help.",
  },

  /* ---------------- B2 ---------------- */
  {
    id: "conditionnel-present", level: "B2", verb: "aimer", en: "to like — conditional", tense: "Conditionnel présent",
    note: "« would … »: future stem + imperfect endings (-ais -ais -ait -ions -iez -aient). Politeness & hypotheticals.",
    forms: [["j'", "aimerais"], ["tu", "aimerais"], ["il/elle", "aimerait"], ["nous", "aimerions"], ["vous", "aimeriez"], ["ils/elles", "aimeraient"]],
    example: "Je voudrais un café, s'il vous plaît. — I would like a coffee, please.",
  },
  {
    id: "subjonctif-present", level: "B2", verb: "faire", en: "to do — subjunctive", tense: "Subjonctif présent",
    note: "After « il faut que », « bien que », « pour que », emotion/doubt. Stem = ils-form minus -ent.",
    forms: [["que je", "fasse"], ["que tu", "fasses"], ["qu'il/elle", "fasse"], ["que nous", "fassions"], ["que vous", "fassiez"], ["qu'ils/elles", "fassent"]],
    example: "Il faut que je fasse mes devoirs. — I have to do my homework.",
  },
  {
    id: "subjonctif-etre-avoir", level: "B2", verb: "être / avoir — subjunctive", en: "to be / to have", tense: "Subjonctif présent",
    note: "The two most common irregular subjunctives — learn them by heart.",
    forms: [["que je sois", "que j'aie"], ["que tu sois", "que tu aies"], ["qu'il soit", "qu'il ait"], ["que nous soyons", "que nous ayons"], ["que vous soyez", "que vous ayez"], ["qu'ils soient", "qu'ils aient"]],
    example: "Je doute qu'il soit prêt. — I doubt he's ready.",
  },
  {
    id: "conditionnel-passe", level: "B2", verb: "aller", en: "conditional perfect", tense: "Conditionnel passé",
    note: "« would have … »: conditional of avoir/être + past participle. Regret / unrealized past.",
    forms: [["je", "serais allé(e)"], ["tu", "serais allé(e)"], ["il/elle", "serait allé(e)"], ["nous", "serions allé(e)s"], ["vous", "seriez allé(e)s"], ["ils/elles", "seraient allé(e)s"]],
    example: "J'aurais aimé venir. — I would have liked to come.",
  },
  {
    id: "plus-que-parfait", level: "B2", verb: "finir", en: "pluperfect", tense: "Plus-que-parfait",
    note: "« had …(done) »: imperfect of avoir/être + past participle. A past before the past.",
    forms: [["j'", "avais fini"], ["tu", "avais fini"], ["il/elle", "avait fini"], ["nous", "avions fini"], ["vous", "aviez fini"], ["ils/elles", "avaient fini"]],
    example: "Il avait déjà fini quand je suis arrivé. — He had already finished when I arrived.",
  },

  /* ---------------- C1 ---------------- */
  {
    id: "subjonctif-passe", level: "C1", verb: "partir", en: "past subjunctive", tense: "Subjonctif passé",
    note: "Subjunctive of avoir/être + participle. After a trigger, for a completed action.",
    forms: [["que je", "sois parti(e)"], ["que tu", "sois parti(e)"], ["qu'il/elle", "soit parti(e)"], ["que nous", "soyons parti(e)s"], ["que vous", "soyez parti(e)s"], ["qu'ils/elles", "soient parti(e)s"]],
    example: "Je regrette qu'il soit parti si tôt. — I'm sorry he left so early.",
  },
  {
    id: "futur-anterieur", level: "C1", verb: "terminer", en: "future perfect", tense: "Futur antérieur",
    note: "« will have …(done) »: future of avoir/être + participle. An action finished before a future point.",
    forms: [["j'", "aurai terminé"], ["tu", "auras terminé"], ["il/elle", "aura terminé"], ["nous", "aurons terminé"], ["vous", "aurez terminé"], ["ils/elles", "auront terminé"]],
    example: "Quand tu arriveras, j'aurai terminé. — By the time you arrive, I'll have finished.",
  },
  {
    id: "passe-simple", level: "C1", verb: "être / avoir / faire", en: "literary past (recognition)", tense: "Passé simple",
    note: "Written/literary narration. You won't speak it, but you must RECOGNIZE it for the TCF reading.",
    forms: [["il fut (être)", "—"], ["il eut (avoir)", "—"], ["il fit (faire)", "—"], ["ils furent", "—"], ["ils eurent", "—"], ["ils firent", "—"]],
    example: "Il fut surpris et ne dit rien. — He was surprised and said nothing.",
  },
  {
    id: "subjonctif-imparfait", level: "C1", verb: "être", en: "imperfect subjunctive (recognition)", tense: "Subjonctif imparfait",
    note: "Highly literary (soutenu). Recognition only — appears in formal/classic texts.",
    forms: [["que je", "fusse"], ["que tu", "fusses"], ["qu'il/elle", "fût"], ["que nous", "fussions"], ["que vous", "fussiez"], ["qu'ils/elles", "fussent"]],
    example: "Il fallait qu'il fût présent. — It was necessary that he be present.",
  },
];
