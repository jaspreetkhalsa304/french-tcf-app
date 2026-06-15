/* ===== Absolute beginner foundations =====
 * The building blocks a true A1 learner needs BEFORE phrases: the alphabet (with
 * how each letter is named aloud), accents, vowel sounds, tricky letter
 * combinations, and numbers. Each item is { fr, say, ipa, en }:
 *   fr  = what's shown big
 *   say = what the TTS should pronounce (often the letter NAME, e.g. "bé" for B)
 *   ipa = pronunciation hint
 *   en  = English note / example
 * Everything works offline (TTS + optional STT scoring); no API key needed.
 */
window.BASICS = {
  sections: [
    {
      id: "alphabet",
      title: "L'alphabet",
      emoji: "🔤",
      blurb: "The 26 letters and how their NAMES are said in French. Tap any letter to hear it.",
      grid: true,
      items: [
        { fr: "A", say: "ah", ipa: "a", en: "like 'ah'" },
        { fr: "B", say: "bé", ipa: "be", en: "'bay'" },
        { fr: "C", say: "cé", ipa: "se", en: "'say'" },
        { fr: "D", say: "dé", ipa: "de", en: "'day'" },
        { fr: "E", say: "euh", ipa: "ø", en: "'uh'" },
        { fr: "F", say: "effe", ipa: "ɛf", en: "'eff'" },
        { fr: "G", say: "gé", ipa: "ʒe", en: "'zhay'" },
        { fr: "H", say: "ache", ipa: "aʃ", en: "'ash' (always silent in words)" },
        { fr: "I", say: "i", ipa: "i", en: "'ee'" },
        { fr: "J", say: "ji", ipa: "ʒi", en: "'zhee'" },
        { fr: "K", say: "ka", ipa: "ka", en: "'kah'" },
        { fr: "L", say: "elle", ipa: "ɛl", en: "'ell'" },
        { fr: "M", say: "emme", ipa: "ɛm", en: "'em'" },
        { fr: "N", say: "enne", ipa: "ɛn", en: "'en'" },
        { fr: "O", say: "o", ipa: "o", en: "'oh'" },
        { fr: "P", say: "pé", ipa: "pe", en: "'pay'" },
        { fr: "Q", say: "ku", ipa: "ky", en: "'ku' (rounded)" },
        { fr: "R", say: "erre", ipa: "ɛʁ", en: "'air' with the throaty French R" },
        { fr: "S", say: "esse", ipa: "ɛs", en: "'ess'" },
        { fr: "T", say: "té", ipa: "te", en: "'tay'" },
        { fr: "U", say: "u", ipa: "y", en: "'ew' — lips rounded, no English equivalent" },
        { fr: "V", say: "vé", ipa: "ve", en: "'vay'" },
        { fr: "W", say: "double vé", ipa: "dublə ve", en: "'double-vay'" },
        { fr: "X", say: "ixe", ipa: "iks", en: "'eeks'" },
        { fr: "Y", say: "i grec", ipa: "i ɡʁɛk", en: "'ee-grek' (Greek i)" },
        { fr: "Z", say: "zède", ipa: "zɛd", en: "'zed'" },
      ],
    },
    {
      id: "accents",
      title: "Les accents",
      emoji: "✨",
      blurb: "Accents change how a letter sounds (or just distinguish words). These are essential to read and write French.",
      grid: false,
      items: [
        { fr: "é — accent aigu", say: "é", ipa: "e", en: "closed 'ay': été (summer), café" },
        { fr: "è — accent grave", say: "è", ipa: "ɛ", en: "open 'eh': mère (mother), très" },
        { fr: "ê — accent circonflexe", say: "ê", ipa: "ɛ", en: "open 'eh', often a lost 's': fête, forêt" },
        { fr: "ë / ï — tréma", say: "Noël", ipa: "nɔɛl", en: "the two vowels are said separately: Noël, naïf" },
        { fr: "ç — cédille", say: "ça", ipa: "sa", en: "makes c sound like 's' before a/o/u: ça, garçon, français" },
        { fr: "à / où — accent grave (sens)", say: "où", ipa: "u", en: "distinguishes words: à (to) vs a (has); où (where) vs ou (or)" },
      ],
    },
    {
      id: "vowels",
      title: "Les voyelles",
      emoji: "🅰️",
      blurb: "The core French vowel sounds. The hard ones for English speakers: u, the nasals (on/an/in), and é vs è.",
      grid: false,
      items: [
        { fr: "a", say: "la", ipa: "a", en: "'ah' as in la, chat" },
        { fr: "i", say: "ici", ipa: "isi", en: "'ee' as in ici (here)" },
        { fr: "ou", say: "ou", ipa: "u", en: "'oo' as in vous, tout" },
        { fr: "u", say: "tu", ipa: "ty", en: "round your lips for 'oo' but say 'ee': tu, rue" },
        { fr: "é", say: "été", ipa: "ete", en: "closed 'ay': été, parler" },
        { fr: "è / ai", say: "mais", ipa: "mɛ", en: "open 'eh': mais, père, lait" },
        { fr: "eu", say: "deux", ipa: "dø", en: "rounded 'uh': deux, peu" },
        { fr: "o / au / eau", say: "beau", ipa: "bo", en: "'oh': beau, eau, mot" },
        { fr: "on (nasal)", say: "bon", ipa: "bɔ̃", en: "nasal 'õ': bon, non, maison" },
        { fr: "an / en (nasal)", say: "grand", ipa: "ɡʁɑ̃", en: "nasal 'ã': grand, enfant, temps" },
        { fr: "in / ain (nasal)", say: "vin", ipa: "vɛ̃", en: "nasal 'ẽ': vin, pain, main" },
        { fr: "un (nasal)", say: "un", ipa: "œ̃", en: "nasal 'ũ': un, brun, lundi" },
      ],
    },
    {
      id: "combos",
      title: "Combinaisons",
      emoji: "🔗",
      blurb: "Letter combinations that don't sound the way an English reader expects.",
      grid: false,
      items: [
        { fr: "ch", say: "chat", ipa: "ʃa", en: "'sh': chat (cat), chien" },
        { fr: "gn", say: "montagne", ipa: "mɔ̃taɲ", en: "'ny' as in canyon: montagne, gagner" },
        { fr: "qu", say: "qui", ipa: "ki", en: "just 'k': qui, quand, que" },
        { fr: "oi", say: "moi", ipa: "mwa", en: "'wah': moi, trois, voiture" },
        { fr: "ille", say: "fille", ipa: "fij", en: "'ee-y': fille (girl), famille" },
        { fr: "th", say: "thé", ipa: "te", en: "just 't' (no English 'th'): thé, théâtre" },
        { fr: "ph", say: "photo", ipa: "fɔto", en: "'f': photo, pharmacie" },
        { fr: "h muet", say: "homme", ipa: "ɔm", en: "h is silent: homme, heure, hôtel" },
        { fr: "r", say: "rouge", ipa: "ʁuʒ", en: "throaty/uvular R from the back: rouge, Paris" },
      ],
    },
    {
      id: "numbers",
      title: "Les nombres 0–20",
      emoji: "🔢",
      blurb: "Counting is one of the first things tested. Tap to hear each number.",
      grid: true,
      items: [
        { fr: "0 — zéro", say: "zéro", ipa: "zeʁo", en: "0" },
        { fr: "1 — un", say: "un", ipa: "œ̃", en: "1" },
        { fr: "2 — deux", say: "deux", ipa: "dø", en: "2" },
        { fr: "3 — trois", say: "trois", ipa: "tʁwa", en: "3" },
        { fr: "4 — quatre", say: "quatre", ipa: "katʁ", en: "4" },
        { fr: "5 — cinq", say: "cinq", ipa: "sɛ̃k", en: "5" },
        { fr: "6 — six", say: "six", ipa: "sis", en: "6" },
        { fr: "7 — sept", say: "sept", ipa: "sɛt", en: "7" },
        { fr: "8 — huit", say: "huit", ipa: "ɥit", en: "8" },
        { fr: "9 — neuf", say: "neuf", ipa: "nœf", en: "9" },
        { fr: "10 — dix", say: "dix", ipa: "dis", en: "10" },
        { fr: "11 — onze", say: "onze", ipa: "ɔ̃z", en: "11" },
        { fr: "12 — douze", say: "douze", ipa: "duz", en: "12" },
        { fr: "13 — treize", say: "treize", ipa: "tʁɛz", en: "13" },
        { fr: "14 — quatorze", say: "quatorze", ipa: "katɔʁz", en: "14" },
        { fr: "15 — quinze", say: "quinze", ipa: "kɛ̃z", en: "15" },
        { fr: "16 — seize", say: "seize", ipa: "sɛz", en: "16" },
        { fr: "17 — dix-sept", say: "dix-sept", ipa: "dis sɛt", en: "17" },
        { fr: "18 — dix-huit", say: "dix-huit", ipa: "diz ɥit", en: "18" },
        { fr: "19 — dix-neuf", say: "dix-neuf", ipa: "diz nœf", en: "19" },
        { fr: "20 — vingt", say: "vingt", ipa: "vɛ̃", en: "20" },
      ],
    },
    {
      id: "articles",
      title: "Les articles",
      emoji: "🔠",
      blurb: "French puts a tiny word before almost every noun: « le », « la », « un », « du »… English usually drops it. Get these right and your French stops sounding broken. Tap any example to hear it.",
      grid: false,
      items: [
        /* ---- Definite: le / la / l' / les ---- */
        { fr: "le (masculine)", say: "le chat", ipa: "lə ʃa", en: "« le » before a masculine noun starting with a consonant: le chat (the cat), le pain (the bread)." },
        { fr: "la (feminine)", say: "la maison", ipa: "la mɛzɔ̃", en: "« la » before a feminine noun starting with a consonant: la maison (the house), la femme (the woman)." },
        { fr: "l' (vowel/h)", say: "l'ami. l'eau. l'homme.", ipa: "lami / lo / lɔm", en: "« le » or « la » becomes « l' » before a vowel or silent h: l'ami, l'eau, l'homme." },
        { fr: "les (plural)", say: "les chats. les maisons.", ipa: "le ʃa / le mɛzɔ̃", en: "One « les » for every plural — masculine or feminine: les chats, les maisons." },
        { fr: "Use le/la/les with likes & general truths", say: "J'aime le café. Les chats sont mignons.", ipa: "ʒɛm lə kafe / le ʃa sɔ̃ miɲɔ̃", en: "Talking about something in general or what you like? Use the definite article — even when English drops it. NOT « J'aime café »." },

        /* ---- Indefinite: un / une / des ---- */
        { fr: "un (a — masculine)", say: "un livre", ipa: "ɛ̃ livʁ", en: "« un » = 'a' before masculine nouns: un livre, un homme. (Slight nasal sound.)" },
        { fr: "une (a — feminine)", say: "une pomme", ipa: "yn pɔm", en: "« une » = 'a' before feminine nouns: une pomme, une femme. Pronounce the final 'n'." },
        { fr: "des (some — plural)", say: "des livres. des pommes.", ipa: "de livʁ / de pɔm", en: "« des » = 'some' (often untranslated in English): des amis, des livres. There's no plural for « un/une » — use « des »." },
        { fr: "Negation: un/une/des → de", say: "Je n'ai pas de voiture.", ipa: "ʒə nɛ pa də vwatyʁ", en: "After « ne…pas », « un/une/des » all become « de » (or « d' »). « J'ai une voiture » → « Je n'ai pas DE voiture ». Classic A1 mistake." },

        /* ---- Partitive: du / de la / de l' / des ---- */
        { fr: "du (some — masc.)", say: "du pain", ipa: "dy pɛ̃", en: "« du » = 'some' with a masculine uncountable: du pain (some bread), du café, du fromage. English drops the word — French doesn't." },
        { fr: "de la (some — fem.)", say: "de la viande", ipa: "də la vjɑ̃d", en: "« de la » = 'some' with a feminine uncountable: de la viande, de la musique, de la chance." },
        { fr: "de l' (vowel/h)", say: "de l'eau. de l'huile.", ipa: "də lo / də lɥil", en: "« du » or « de la » becomes « de l' » before a vowel: de l'eau, de l'huile, de l'argent." },
        { fr: "des (some — plural)", say: "des fruits. des œufs.", ipa: "de fʁɥi / de zø", en: "« des » = 'some' with plural countables: des fruits, des œufs, des amis. Same form as the indefinite plural." },
        { fr: "Negation: partitive → de", say: "Je ne mange pas de pain.", ipa: "ʒə nə mɑ̃ʒ pa də pɛ̃", en: "After « ne…pas », « du / de la / de l' / des » all collapse to « de »: « Je mange du pain » → « Je ne mange pas DE pain »." },

        /* ---- Contractions: à + le, de + le, etc. ---- */
        { fr: "à + le = au", say: "Je vais au marché.", ipa: "ʒə vɛ o maʁʃe", en: "« à le » is forbidden — it becomes « au »: au marché, au cinéma, au Canada. (« à la » and « à l' » stay.)" },
        { fr: "à + les = aux", say: "Je parle aux enfants.", ipa: "ʒə paʁl o zɑ̃fɑ̃", en: "« à les » becomes « aux »: aux enfants, aux États-Unis. Same rule, plural." },
        { fr: "de + le = du", say: "Je viens du Canada.", ipa: "ʒə vjɛ̃ dy kanada", en: "« de le » → « du »: du Canada, du parc, du travail. (« de la » and « de l' » stay.) Don't confuse with the partitive « du »: same form, different job." },
        { fr: "de + les = des", say: "Je parle des enfants.", ipa: "ʒə paʁl de zɑ̃fɑ̃", en: "« de les » → « des »: des enfants, des amis. Yes, also the same form as 'some' — French recycles." },

        /* ---- Drop-the-article cases ---- */
        { fr: "Professions: NO article", say: "Je suis professeur. Elle est médecin.", ipa: "ʒə sɥi pʁɔfɛsœʁ / ɛl ɛ medsɛ̃", en: "After « être » + a profession, drop the article: « Je suis professeur » (NOT « un professeur »). Same for nationality, religion." },
        { fr: "Countries: en (fem.) / au (masc.)", say: "Je vais en France. Je vais au Canada.", ipa: "ʒə vɛ ɑ̃ fʁɑ̃s / ʒə vɛ o kanada", en: "Use « en » before feminine countries (la France, l'Inde) and « au » before masculine (le Canada, le Japon). Cities take « à »: à Paris." },

        /* ---- Quick decision tree to memorise ---- */
        { fr: "Quick rule (tap to hear)", say: "Specific? le, la, les. New thing? un, une, des. Some food or drink? du, de la, des. After ne pas? de.", ipa: "", en: "🎯 Specific thing? → le / la / les. New / one of many? → un / une / des. Some food or drink? → du / de la / de l' / des. After « ne…pas »? → everything becomes « de ». Memorise this one rule and 80% of article choices solve themselves." },
      ],
    },
    {
      id: "greetings",
      title: "Premiers mots",
      emoji: "👋",
      blurb: "The first survival words — greetings, please, thank you, yes/no.",
      grid: false,
      items: [
        { fr: "Bonjour", say: "Bonjour", ipa: "bɔ̃ʒuʁ", en: "Hello / Good day" },
        { fr: "Bonsoir", say: "Bonsoir", ipa: "bɔ̃swaʁ", en: "Good evening" },
        { fr: "Salut", say: "Salut", ipa: "saly", en: "Hi / Bye (casual)" },
        { fr: "Au revoir", say: "Au revoir", ipa: "o ʁəvwaʁ", en: "Goodbye" },
        { fr: "Oui / Non", say: "Oui. Non.", ipa: "wi / nɔ̃", en: "Yes / No" },
        { fr: "S'il vous plaît", say: "S'il vous plaît", ipa: "sil vu plɛ", en: "Please (formal)" },
        { fr: "Merci", say: "Merci", ipa: "mɛʁsi", en: "Thank you" },
        { fr: "De rien", say: "De rien", ipa: "də ʁjɛ̃", en: "You're welcome" },
        { fr: "Pardon / Excusez-moi", say: "Pardon. Excusez-moi.", ipa: "paʁdɔ̃ / ɛkskyze mwa", en: "Sorry / Excuse me" },
        { fr: "Comment allez-vous ?", say: "Comment allez-vous ?", ipa: "kɔmɑ̃t‿ale vu", en: "How are you? (formal)" },
      ],
    },
  ],
};
