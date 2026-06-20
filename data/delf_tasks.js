/* ===== DELF / DALF practice content =====
 * Per-level (A1–C2) tasks for the four DELF modules:
 *   • compréhension de l'oral (Listening)
 *   • compréhension des écrits (Reading)
 *   • production écrite (Writing)
 *   • production orale (Speaking)
 *
 * Item shapes:
 *   MCQ:           { kind: "mcq", q, options[], answer (idx) }
 *   Short answer:  { kind: "short", q, model: "<expected FR>", criteria?: "<grading hint>" }
 *   Group/passage: { passage|audio, items: [<MCQ or short>] }   // multiple Qs share one doc
 *   Flat (legacy): { audio|passage, q, options, answer }        // still supported
 *
 * Writing + Speaking are open-ended tasks; Claude grades them on the
 * official DELF rubric (descriptors in window.DELF.rubric) when a key is set.
 *
 * Levels: A1, A2, B1, B2 (DELF) and C1, C2 (DALF).
 */
window.DELF = {
  levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
  levelNames: {
    A1: "DELF A1 — Découverte",
    A2: "DELF A2 — Survie",
    B1: "DELF B1 — Seuil",
    B2: "DELF B2 — Avancé",
    C1: "DALF C1 — Autonome",
    C2: "DALF C2 — Maîtrise",
  },
  // Official DELF format summary used in the per-level intro.
  format: {
    A1: { listen: "~20 min · 4 short docs", read: "~30 min · 4 short docs", write: "~30 min · form + short message (40–50 words)", speak: "5–7 min · interview + info exchange + role-play" },
    A2: { listen: "~25 min · 4 short docs", read: "~30 min · 3–4 docs", write: "~45 min · 2 short texts (60–80 words each)", speak: "6–8 min · interview + monologue + interaction" },
    B1: { listen: "~25 min · 3 docs", read: "~35 min · 2 docs", write: "~45 min · personal opinion essay (~180 words)", speak: "~15 min prep + 15 min · interview + interaction + monologue from a doc" },
    B2: { listen: "~30 min · 2 docs", read: "~60 min · 2 docs", write: "~60 min · argumentative text (~250 words)", speak: "~30 min prep + 20 min · defend a position from a short doc" },
    C1: { listen: "~40 min · long doc + short docs", read: "~50 min · long article", write: "~2½ h · synthesis (~220 words) + essay (~250 words)", speak: "~1 h prep + 30 min · exposé + debate from a dossier" },
    C2: { listen: "~30 min · long doc + Q&A", read: "—", write: "~3½ h · structured production from a dossier (literary or human sciences)", speak: "~1 h prep + 30 min · report + debate from a dossier" },
  },

  // Approx target durations for the per-module timed mode (seconds).
  // Mirrors official exam timing scaled to the item-count we provide.
  examDuration: {
    A1: { listening: 20 * 60, reading: 30 * 60 },
    A2: { listening: 25 * 60, reading: 30 * 60 },
    B1: { listening: 25 * 60, reading: 35 * 60 },
    B2: { listening: 30 * 60, reading: 60 * 60 },
    C1: { listening: 40 * 60, reading: 50 * 60 },
    C2: { listening: 30 * 60, reading: 50 * 60 },
  },

  /* =============================================================
   * Official DELF rubric descriptors — paraphrased from the CIEP /
   * France Éducation International grilles d'évaluation. Used in the
   * grading prompt so Claude calibrates against the real exam.
   * ============================================================= */
  rubric: {
    writing: {
      A1: `RUBRIQUE OFFICIELLE — DELF A1 Production écrite (25 points)
1. Respect de la consigne / capacité à informer (peut décrire, présenter des personnes / situations en lien direct avec son environnement) — /6
2. Correction sociolinguistique (formule d'appel, salutations simples adaptées) — /4
3. Lexique / orthographe lexicale (répertoire élémentaire, suffit pour besoins concrets) — /6
4. Morphosyntaxe / orthographe grammaticale (contrôle limité de structures simples, fautes systématiques attendues) — /6
5. Cohérence et cohésion (groupes de mots avec connecteurs très simples : et, mais, parce que, alors) — /3`,
      A2: `RUBRIQUE OFFICIELLE — DELF A2 Production écrite (25 points sur 2 exercices)
EXERCICE 1 — décrire un événement / des expériences personnelles (13 pts)
  • Respect de la consigne (1) · Capacité à présenter (4) · Capacité à décrire (4) · Lexique/orthographe (2) · Morphosyntaxe (2)
EXERCICE 2 — écrire pour inviter, remercier, s'excuser, demander, informer, féliciter (12 pts)
  • Respect de la consigne (1) · Correction sociolinguistique (1) · Capacité à interagir (4) · Lexique (2) · Morphosyntaxe (4)
Globalement : phrases courtes liées par des connecteurs simples, contrôle limité mais sens compréhensible.`,
      B1: `RUBRIQUE OFFICIELLE — DELF B1 Production écrite (25 points)
1. Respect de la consigne (longueur, format, type de production) — /2
2. Capacité à présenter des faits (peut relater, décrire, exposer) — /4
3. Capacité à exprimer sa pensée (prend position, argumente, justifie un choix) — /4
4. Cohérence et cohésion (texte articulé, connecteurs variés, paragraphes) — /3
5. Lexique / orthographe lexicale (vocabulaire suffisant, périphrases acceptables) — /6
6. Morphosyntaxe / orthographe grammaticale (bon contrôle des structures simples, structures complexes émergentes) — /6
Niveau visé : un texte personnel d'environ 180 mots, structuré, exprimant un point de vue argumenté.`,
      B2: `RUBRIQUE OFFICIELLE — DELF B2 Production écrite (25 points)
1. Respect de la consigne (type de production, format, longueur) — /2
2. Capacité à présenter des faits — /3
3. Capacité à argumenter une prise de position (thèse + arguments + exemples + contre-arguments) — /4
4. Cohérence et cohésion (structure démonstrative, connecteurs logiques nuancés) — /4
5. Étendue du vocabulaire (lexique étendu, périphrases efficaces, peu de répétitions) — /2
6. Maîtrise du vocabulaire (orthographe lexicale, registre adapté) — /2
7. Choix des formes grammaticales (gamme étendue : conditionnels, subjonctif, structures complexes) — /4
8. Degré d'élaboration des phrases (subordonnées variées) — /4
Niveau visé : texte d'opinion construit d'environ 250 mots, nuancé, registre formel approprié.`,
      C1: `RUBRIQUE OFFICIELLE — DALF C1 Production écrite (25 points sur 2 exercices)
EXERCICE 1 — synthèse de documents (~220 mots, neutre) — 12 pts
  • Respect de la consigne et reformulation (3) · Capacité à dégager une problématique (3) · Capacité à hiérarchiser et restituer les idées-clés (3) · Cohérence/cohésion (1) · Lexique/morphosyntaxe (2)
EXERCICE 2 — essai argumenté (~250 mots) — 13 pts
  • Respect de la consigne (1) · Capacité à présenter et défendre un point de vue (4) · Cohérence (2) · Lexique (3) · Morphosyntaxe (3)
Niveau visé : neutralité totale en synthèse (pas de « je »), prise de position assumée et nuancée en essai.`,
      C2: `RUBRIQUE OFFICIELLE — DALF C2 Production écrite (25 points)
À partir d'un dossier (3–4 documents), production d'un texte structuré d'environ 700 mots, généralement de type éditorial ou article de fond.
1. Adéquation au discours visé / respect du type de production attendu — /5
2. Capacité à mobiliser et à exploiter les documents du dossier sans paraphrase — /5
3. Capacité à structurer / hiérarchiser / problématiser de manière originale — /5
4. Étendue et finesse lexicales (style soigné, registre maîtrisé) — /5
5. Maîtrise morphosyntaxique (gamme complète, modalisation fine, peu d'erreurs) — /5
Niveau visé : style abouti, position assumée, exploitation experte du dossier.`,
    },
    speaking: {
      A1: `RUBRIQUE OFFICIELLE — DELF A1 Production orale (25 points sur 3 parties)
Entretien dirigé (/5) · Échange d'informations (/4) · Dialogue simulé (/6) · Lexique/correction lexicale (/3) · Morphosyntaxe (/4) · Maîtrise du système phonologique (/3)
Niveau visé : peut se présenter, poser des questions simples, et gérer un échange courant très simple.`,
      A2: `RUBRIQUE OFFICIELLE — DELF A2 Production orale (25 points sur 3 parties)
Entretien dirigé (/3) · Monologue suivi (/4) · Exercice en interaction (/6) · Lexique/correction lexicale (/4) · Morphosyntaxe (/4) · Maîtrise du système phonologique (/4)
Niveau visé : se présenter, parler de sa vie quotidienne, mener un échange transactionnel simple.`,
      B1: `RUBRIQUE OFFICIELLE — DELF B1 Production orale (25 points sur 3 parties)
Entretien dirigé (/4) · Exercice en interaction (/4) · Expression d'un point de vue à partir d'un document déclencheur (/6) · Lexique/correction lexicale (/4) · Morphosyntaxe (/4) · Maîtrise du système phonologique (/3)
Niveau visé : peut s'exprimer simplement sur une variété de sujets familiers, défendre brièvement une opinion.`,
      B2: `RUBRIQUE OFFICIELLE — DELF B2 Production orale (25 points)
Présentation et défense d'un point de vue à partir d'un court document.
Capacité à dégager le thème du document (/2) · Capacité à présenter son point de vue (/4) · Capacité à argumenter (/4) · Capacité à débattre / réagir aux relances (/4) · Lexique (étendue + maîtrise) (/4) · Morphosyntaxe (/4) · Phonologie (/3)
Niveau visé : exposé structuré + débat nuancé, modalisation, registre formel.`,
      C1: `RUBRIQUE OFFICIELLE — DALF C1 Production orale (25 points)
À partir d'un dossier de 2–3 documents : exposé (~8 min) + débat (~15 min).
Capacité à dégager et formuler une problématique (/3) · Capacité à mobiliser le dossier (/3) · Structure et progression de l'exposé (/4) · Lexique (/4) · Morphosyntaxe (/4) · Phonologie + fluidité (/4) · Capacité de débat / réactivité (/3)
Niveau visé : exposé construit et autonome, position défendue avec aisance dans le débat.`,
      C2: `RUBRIQUE OFFICIELLE — DALF C2 Production orale (25 points)
À partir d'un dossier complexe : compte rendu et débat (~30 min).
Exploitation experte des documents (/5) · Problématisation et originalité (/5) · Structure et progression (/5) · Lexique et registre (/5) · Aisance, débit, phonologie (/5)
Niveau visé : maîtrise complète du discours, style et débat de haut niveau.`,
    },
    shortAnswer: `Grade short-answer comprehension items strictly. The candidate writes a short free-form French answer that should match the meaning of the model answer (paraphrase OK, exact wording not required). 0 = wrong/empty, 1 = partially correct, 2 = fully correct. Be fair on synonyms and minor spelling but strict on factual content.`,
  },

  /* =============================================================
   * LISTENING bank — DELF style.
   * Mix of single-Q items and longer multi-Q passages (B2+).
   * ============================================================= */
  listening: {
    A1: [
      { audio: "Bonjour ! Je m'appelle Léa, j'ai vingt-deux ans et j'habite à Lyon.", q: "Quel âge a Léa ?", options: ["12 ans", "20 ans", "22 ans", "32 ans"], answer: 2 },
      { audio: "Le train pour Marseille part à dix-sept heures quarante, quai numéro huit.", q: "À quelle heure part le train ?", options: ["7h40", "16h40", "17h14", "17h40"], answer: 3 },
      { audio: "Aujourd'hui à Paris, il fait dix degrés et il pleut un peu.", q: "Quel temps fait-il ?", options: ["Il neige", "Il pleut", "Il fait chaud", "Il y a du vent"], answer: 1 },
      { audio: "Pour aller à la pharmacie, vous tournez à gauche après la boulangerie.", q: "Où va-t-on ?", options: ["À la boulangerie", "À la poste", "À la pharmacie", "À l'école"], answer: 2 },
      { audio: "Le menu du jour : une salade verte, un steak frites et une mousse au chocolat.", q: "Qu'est-ce qu'il y a en dessert ?", options: ["Une tarte", "Une glace", "Une mousse au chocolat", "Des fruits"], answer: 2 },
      { audio: "Allô ? Marc, c'est Sophie. Je suis en retard, j'arrive à huit heures et demie.", q: "À quelle heure arrive Sophie ?", options: ["7h30", "8h00", "8h15", "8h30"], answer: 3 },
      { audio: "Ce week-end, on va à la piscine samedi et au cinéma dimanche.", q: "Qu'est-ce qu'on fait dimanche ?", options: ["On va à la piscine", "On va au parc", "On va au cinéma", "On reste à la maison"], answer: 2 },
      { audio: "J'habite un petit appartement avec une chambre, une cuisine et un balcon.", q: "Combien de chambres a l'appartement ?", options: ["Aucune", "Une", "Deux", "Trois"], answer: 1 },
      { audio: "Le café coûte deux euros et le croissant un euro cinquante.", q: "Combien coûte le croissant ?", options: ["1 €", "1,50 €", "2 €", "2,50 €"], answer: 1 },
      { audio: "Je suis professeur de français et je travaille dans une école à Bordeaux.", q: "Quel est son métier ?", options: ["Étudiant", "Médecin", "Professeur", "Cuisinier"], answer: 2 },
      { audio: "Maman, je vais chez Théo après l'école. Je rentre vers six heures.", q: "Où va l'enfant après l'école ?", options: ["À la maison", "Chez Théo", "Au parc", "À la bibliothèque"], answer: 1 },
      { audio: "Notre bébé est né mardi dernier. Il s'appelle Hugo et il est très calme.", q: "Comment s'appelle le bébé ?", options: ["Henri", "Hugo", "Théo", "Léo"], answer: 1 },
      { audio: "Pour mon anniversaire, je voudrais un vélo rouge, s'il te plaît papa !", q: "Qu'est-ce que l'enfant veut ?", options: ["Une voiture", "Un vélo rouge", "Un jeu vidéo", "Un livre"], answer: 1 },
      { audio: "Mon père est grand, brun, avec des lunettes. Il porte un manteau noir.", q: "De quelle couleur est le manteau ?", options: ["Bleu", "Rouge", "Noir", "Marron"], answer: 2 },
      { audio: "Le supermarché est ouvert de neuf heures à vingt heures, du lundi au samedi.", q: "Quand le supermarché est-il fermé ?", options: ["Lundi", "Jeudi", "Samedi", "Dimanche"], answer: 3 },
      { audio: "Pour faire de la salade : tomates, concombre, olives noires et un peu d'huile.", q: "Quel ingrédient n'est pas dans la salade ?", options: ["Tomates", "Concombre", "Fromage", "Olives"], answer: 2 },
      { audio: "Le bus numéro douze passe toutes les quinze minutes devant la gare.", q: "Quel est le numéro du bus ?", options: ["2", "12", "20", "15"], answer: 1 },
      { audio: "J'aime beaucoup le sport. Je fais du tennis le mardi et du yoga le jeudi.", q: "Quel sport fait-il le jeudi ?", options: ["Tennis", "Yoga", "Football", "Natation"], answer: 1 },
      { audio: "Excusez-moi madame, je cherche la rue Victor Hugo. — C'est la deuxième à droite.", q: "Où est la rue Victor Hugo ?", options: ["Première à droite", "Deuxième à droite", "Première à gauche", "Tout droit"], answer: 1 },
      { audio: "À table, les enfants ! Le dîner est prêt. Aujourd'hui, c'est des pâtes !", q: "Qu'est-ce qu'on mange ce soir ?", options: ["Du riz", "De la pizza", "Des pâtes", "De la soupe"], answer: 2 },
      { audio: "Mon chien s'appelle Bobby. Il a trois ans et il adore courir au parc.", q: "Quel âge a le chien ?", options: ["2 ans", "3 ans", "5 ans", "10 ans"], answer: 1 },
      { audio: "Bonjour, je voudrais une baguette et deux pains au chocolat, s'il vous plaît.", q: "Qu'est-ce qu'on achète ?", options: ["Une baguette et deux croissants", "Une baguette et deux pains au chocolat", "Deux baguettes", "Deux pains au chocolat"], answer: 1 },
    ],
    A2: [
      { audio: "Bonjour, c'est le docteur Martin. Votre rendez-vous de mardi est déplacé à jeudi quatorze heures. Merci.", q: "Quel jour est le nouveau rendez-vous ?", options: ["Mardi", "Mercredi", "Jeudi", "Vendredi"], answer: 2 },
      { audio: "Le musée est ouvert tous les jours sauf le lundi, de neuf heures à dix-huit heures. L'entrée coûte huit euros.", q: "Quand le musée est-il fermé ?", options: ["Le dimanche", "Le lundi", "Le samedi", "Le mardi"], answer: 1 },
      { audio: "Pour votre commande, votre pizza sera livrée dans environ trente minutes. Le livreur s'appelle Karim.", q: "Dans combien de temps arrive la pizza ?", options: ["Dans 13 minutes", "Dans 15 minutes", "Dans 30 minutes", "Dans une heure"], answer: 2 },
      { audio: "Le week-end prochain, on part à la campagne. On part vendredi soir et on rentre dimanche après-midi.", q: "Quand rentrent-ils ?", options: ["Samedi soir", "Dimanche matin", "Dimanche après-midi", "Lundi"], answer: 2 },
      { audio: "Pour faire ce gâteau, il vous faut deux œufs, cent grammes de sucre et un peu de beurre.", q: "Combien d'œufs faut-il ?", options: ["Un œuf", "Deux œufs", "Trois œufs", "Quatre œufs"], answer: 1 },
      { audio: "Mesdames, messieurs, le magasin va fermer dans dix minutes. Merci de vous diriger vers les caisses.", q: "Pourquoi cette annonce ?", options: ["Le magasin ouvre", "Le magasin va fermer", "Il y a une promotion", "Il y a un incendie"], answer: 1 },
      { audio: "Salut Léa, c'est Tom. On se retrouve devant le cinéma à vingt heures, pas devant le restaurant. À tout à l'heure !", q: "Où Tom et Léa se retrouvent-ils ?", options: ["Au restaurant", "Au cinéma", "Chez Tom", "Chez Léa"], answer: 1 },
      { audio: "L'année prochaine, je voudrais apprendre l'espagnol parce que je vais habiter à Madrid pour mon travail.", q: "Pourquoi veut-il apprendre l'espagnol ?", options: ["Pour les vacances", "Pour ses études", "Pour son travail à Madrid", "Pour sa famille"], answer: 2 },
      { audio: "Le bureau de poste est en face de la mairie, à côté de la pharmacie verte.", q: "Où est le bureau de poste ?", options: ["Dans la mairie", "En face de la mairie", "Derrière la pharmacie", "Loin du centre"], answer: 1 },
      { audio: "Cette nouvelle application permet de réserver un taxi en moins de deux minutes, partout dans la ville.", q: "À quoi sert l'application ?", options: ["Commander à manger", "Réserver un hôtel", "Réserver un taxi", "Acheter des billets de train"], answer: 2 },
      { audio: "Hier soir, on est allés au restaurant italien, mais il y avait beaucoup de monde et on a attendu une heure.", q: "Quel était le problème ?", options: ["Le restaurant était fermé", "Il fallait attendre longtemps", "La nourriture était mauvaise", "Le restaurant était cher"], answer: 1 },
      { audio: "Pour louer un vélo, vous payez cinq euros pour la première heure et trois euros pour chaque heure suivante.", q: "Combien coûtent deux heures de vélo ?", options: ["5 €", "6 €", "8 €", "10 €"], answer: 2 },
      { audio: "Mon nouveau colocataire est étudiant en médecine. Il est sympa mais il étudie tout le temps.", q: "Que fait le colocataire ?", options: ["Il travaille beaucoup", "Il sort beaucoup", "Il dort beaucoup", "Il fait du sport"], answer: 0 },
      { audio: "Annonce SNCF : le train de seize heures pour Lille est annulé en raison d'une grève. Prochain train à dix-huit heures.", q: "Pourquoi le train est-il annulé ?", options: ["Un accident", "Une grève", "Un retard", "La météo"], answer: 1 },
      { audio: "Au programme du festival : du jazz vendredi soir, du rock samedi et de la musique classique dimanche.", q: "Quelle musique entend-on samedi ?", options: ["Jazz", "Rock", "Classique", "Reggae"], answer: 1 },
      { audio: "Excuse-moi, je ne peux pas venir à la fête samedi, je suis invité au mariage de ma cousine.", q: "Pourquoi refuse-t-il l'invitation ?", options: ["Il travaille", "Il est malade", "Il va à un mariage", "Il part en voyage"], answer: 2 },
      { audio: "Le nouveau parking souterrain ouvre lundi. La première heure est gratuite pour tous les clients.", q: "Que se passe-t-il la première heure ?", options: ["Le parking est complet", "C'est gratuit", "C'est interdit aux clients", "Il faut réserver"], answer: 1 },
      { audio: "Pour le contrôle de français, n'oubliez pas vos dictionnaires. Le contrôle dure deux heures.", q: "Qu'est-ce qu'il ne faut pas oublier ?", options: ["Un crayon", "Un dictionnaire", "Une calculatrice", "Une bouteille d'eau"], answer: 1 },
      { audio: "Notre nouvelle adresse, c'est le quinze rue des Lilas, à Toulouse. Notez bien le code postal : trente et un mille.", q: "Quel est le code postal ?", options: ["13000", "31000", "11000", "75000"], answer: 1 },
      { audio: "Aujourd'hui, le rayon poissonnerie propose du saumon frais à dix euros le kilo.", q: "Quel est le prix du saumon ?", options: ["5 €/kg", "10 €/kg", "15 €/kg", "20 €/kg"], answer: 1 },
      { audio: "Tu peux passer à la pharmacie ? Il me faut du paracétamol et des pastilles pour la gorge.", q: "Que demande la personne ?", options: ["Aller chez le médecin", "Acheter des médicaments", "Faire des courses", "Téléphoner à la pharmacie"], answer: 1 },
      { audio: "Le directeur a accepté ta demande de congés. Tu peux partir du quinze au trente juillet.", q: "Combien de jours de congés ?", options: ["7 jours", "15 jours", "20 jours", "30 jours"], answer: 1 },
    ],
    B1: [
      { audio: "Mesdames, messieurs, en raison d'un incident technique, le TGV à destination de Bordeaux aura un retard d'environ vingt-cinq minutes. Nous vous prions de nous excuser pour la gêne occasionnée.", q: "Pourquoi le train est-il en retard ?", options: ["À cause de la météo", "À cause d'un incident technique", "À cause d'une grève", "À cause d'un accident"], answer: 1 },
      { audio: "Salut, c'est Camille. Finalement, je ne peux pas venir au cinéma ce soir, je dois finir un dossier important pour demain. On peut se voir samedi à la place ?", q: "Pourquoi Camille annule-t-elle ?", options: ["Elle est malade", "Elle a du travail", "Elle est fatiguée", "Elle est en voyage"], answer: 1 },
      { audio: "Pour profiter de la promotion, présentez ce coupon en caisse avant le trente juin. Réduction de quinze pour cent sur toute la collection d'été.", q: "Quelle est la réduction ?", options: ["5%", "15%", "30%", "50%"], answer: 1 },
      { audio: "Le maire a annoncé hier l'ouverture d'une nouvelle piste cyclable longue de quatre kilomètres entre le centre-ville et l'université.", q: "Qu'est-ce qui va ouvrir ?", options: ["Une école", "Une piste cyclable", "Un parking", "Une bibliothèque"], answer: 1 },
      { audio: "Si vous souhaitez réserver une table pour plus de six personnes, merci d'appeler directement le restaurant au moins quarante-huit heures à l'avance.", q: "Quand faut-il réserver pour un grand groupe ?", options: ["24 h avant", "48 h avant", "Une semaine avant", "Le jour même"], answer: 1 },
      { audio: "Notre association recrute des bénévoles pour donner des cours de soutien scolaire aux enfants du quartier. Engagement : deux heures par semaine minimum.", q: "Quel est l'engagement minimum ?", options: ["1 heure/mois", "1 heure/semaine", "2 heures/semaine", "1 jour/semaine"], answer: 2 },
      { audio: "Le nouveau roman de cet auteur sera disponible en librairie à partir du quinze octobre. Il est déjà possible de le précommander en ligne.", q: "Que peut-on faire dès maintenant ?", options: ["L'acheter en librairie", "Le précommander en ligne", "Le télécharger gratuitement", "Le lire en bibliothèque"], answer: 1 },
      { audio: "Allô, c'est le garage Renault. Votre voiture est prête. Vous pouvez passer la chercher jusqu'à dix-huit heures aujourd'hui ou demain matin.", q: "Quand peut-on récupérer la voiture ?", options: ["Aujourd'hui après 18h", "Demain après-midi", "Aujourd'hui jusqu'à 18h ou demain matin", "Dans une semaine"], answer: 2 },
      { audio: "Les inscriptions pour les cours de natation adultes ouvrent le premier septembre. Les places sont limitées à vingt personnes par cours.", q: "Combien de places par cours ?", options: ["10", "15", "20", "25"], answer: 2 },
      { audio: "À cause de la canicule annoncée ce week-end, la mairie ouvrira gratuitement la piscine municipale jusqu'à vingt-deux heures vendredi et samedi soir.", q: "Pourquoi ouvre-t-on la piscine plus tard ?", options: ["Pour une fête", "À cause de la chaleur", "Pour une compétition", "Pour des travaux"], answer: 1 },
      { kind: "short", audio: "Bonjour, ici Sophie de l'agence immobilière. L'appartement que vous avez visité hier est disponible à partir du premier octobre. Le loyer est de huit cents euros par mois, charges comprises. Rappelez-moi avant vendredi.", q: "Quel est le loyer ?", model: "800 euros par mois, charges comprises" },
      { kind: "short", audio: "Le festival de cinéma européen aura lieu du douze au dix-huit mars dans plusieurs salles du centre-ville. Plus de quarante films seront projetés, dont une dizaine en avant-première.", q: "Combien de films sont en avant-première ?", model: "Une dizaine / environ dix films" },
      { kind: "short", audio: "Si vous avez perdu vos clés ou votre portefeuille dans le bus, vous pouvez vous adresser au bureau des objets trouvés, ouvert du lundi au vendredi de neuf heures à dix-sept heures.", q: "Où aller pour récupérer un objet perdu ?", model: "Au bureau des objets trouvés" },
      // Multi-question passage
      {
        audio: "Bonjour à tous et bienvenue dans notre émission « Tendances ». Aujourd'hui, on parle d'un phénomène en pleine croissance : la colocation entre seniors. De plus en plus de personnes âgées de plus de soixante ans choisissent de partager un appartement, soit pour réduire leurs dépenses, soit surtout pour rompre la solitude. Une récente enquête montre que cette solution séduit particulièrement les femmes vivant seules après un divorce ou un veuvage. Pour faciliter la rencontre, plusieurs sites internet spécialisés ont vu le jour. Reste un défi majeur : adapter les logements existants aux besoins spécifiques des seniors.",
        items: [
          { kind: "mcq", q: "Quel est le sujet principal de l'émission ?", options: ["Le marché du logement", "La colocation entre personnes âgées", "Les sites de rencontre", "Les pensions de retraite"], answer: 1 },
          { kind: "mcq", q: "Quelle est la raison principale citée ?", options: ["Économiser de l'argent", "Rompre la solitude", "Voyager", "Trouver l'amour"], answer: 1 },
          { kind: "short", q: "Qui est particulièrement concerné par ce phénomène ?", model: "Les femmes vivant seules après un divorce ou un veuvage" },
          { kind: "short", q: "Quel défi reste à relever ?", model: "Adapter les logements aux besoins des seniors" },
        ],
      },
    ],
    B2: [
      // Long multi-Q passages (2 docs, ~5–8 Qs each — mirrors real DELF B2 listening structure)
      {
        audio: "Bonjour à tous. Aujourd'hui dans notre rubrique société, nous nous penchons sur un sujet qui fait débat : la place du smartphone dans la vie des adolescents. Selon la dernière étude de l'Observatoire de l'enfance, les jeunes de douze à dix-sept ans passent en moyenne quatre heures et demie par jour sur leur téléphone, principalement sur les réseaux sociaux. Cette consommation a augmenté de trente pour cent en cinq ans. Les spécialistes s'inquiètent surtout des effets sur le sommeil : huit adolescents sur dix consultent leur téléphone juste avant de dormir, ce qui retarde l'endormissement et réduit la qualité du sommeil profond. Pour autant, les chercheurs refusent de diaboliser l'outil. Selon la sociologue Anne Lefèvre, interrogée par notre rédaction, « le smartphone reste avant tout un instrument de socialisation pour cette génération ; le supprimer brutalement créerait plus d'isolement que de bénéfice ». La solution, selon elle, passerait par une éducation au numérique dès le primaire et par des règles familiales claires, plutôt que par l'interdiction.",
        items: [
          { kind: "mcq", q: "Quel est le thème principal de l'émission ?", options: ["L'éducation au numérique", "L'usage du smartphone chez les adolescents", "Les troubles du sommeil", "Les réseaux sociaux dans le monde"], answer: 1 },
          { kind: "mcq", q: "Combien de temps en moyenne les adolescents passent-ils sur leur téléphone ?", options: ["2 h par jour", "3 h par jour", "4 h 30 par jour", "6 h par jour"], answer: 2 },
          { kind: "mcq", q: "Quelle est l'évolution sur cinq ans ?", options: ["Une baisse de 10 %", "Une hausse de 30 %", "Une hausse de 50 %", "Aucune évolution"], answer: 1 },
          { kind: "mcq", q: "Selon les spécialistes, quel est l'effet le plus inquiétant ?", options: ["La baisse des notes", "L'isolement social", "Les troubles du sommeil", "Les problèmes de vue"], answer: 2 },
          { kind: "short", q: "Quelle est la position de la sociologue Anne Lefèvre sur l'interdiction ?", model: "Elle s'y oppose ; interdire créerait plus d'isolement que de bénéfice" },
          { kind: "short", q: "Quelle solution propose-t-elle ?", model: "Une éducation au numérique dès le primaire et des règles familiales claires" },
        ],
      },
      {
        audio: "Et nous accueillons maintenant Pierre Moreau, directeur d'une PME spécialisée dans le télétravail, pour parler des nouvelles habitudes professionnelles. Pierre Moreau, bonjour. Bonjour. Trois ans après la pandémie, où en est-on du télétravail en France ? Eh bien, contrairement à ce que beaucoup pensaient, le télétravail ne disparaît pas, il se transforme. La grande majorité des entreprises a adopté un modèle hybride, avec deux à trois jours de présentiel par semaine. Ce qui change, c'est la façon dont on l'organise. On voit émerger une nouvelle culture managériale, davantage fondée sur la confiance et sur les résultats que sur la présence physique. Mais il y a quand même des limites, non ? Absolument. D'abord, toutes les fonctions ne s'y prêtent pas — un soudeur ou une infirmière ne télétravaillent pas. Ensuite, les jeunes recrues souffrent souvent d'un manque d'accompagnement et d'apprentissage informel. Enfin, le risque d'isolement reste réel, même si paradoxalement, beaucoup de salariés disent se sentir mieux concentrés à la maison.",
        items: [
          { kind: "mcq", q: "Selon Pierre Moreau, qu'est devenu le télétravail ?", options: ["Il a disparu", "Il s'est généralisé à 100 %", "Il s'est transformé en modèle hybride", "Il est rejeté par les entreprises"], answer: 2 },
          { kind: "mcq", q: "Combien de jours de présentiel en moyenne ?", options: ["Aucun", "1 jour", "2 à 3 jours", "5 jours"], answer: 2 },
          { kind: "mcq", q: "Sur quoi repose la nouvelle culture managériale ?", options: ["La présence physique", "Le contrôle horaire", "La confiance et les résultats", "Les rapports écrits"], answer: 2 },
          { kind: "mcq", q: "Qui souffre particulièrement du télétravail ?", options: ["Les dirigeants", "Les jeunes recrues", "Les seniors", "Les commerciaux"], answer: 1 },
          { kind: "short", q: "Citez une catégorie professionnelle qui ne peut pas télétravailler.", model: "Un soudeur ou une infirmière (toute fonction manuelle ou de terrain)" },
          { kind: "short", q: "Quel paradoxe est mentionné à la fin ?", model: "Beaucoup de salariés se sentent mieux concentrés à la maison malgré le risque d'isolement" },
        ],
      },
    ],
    C1: [
      {
        audio: "Mesdames et messieurs, bonsoir et bienvenue dans « Esprit critique ». Notre invitée ce soir est la philosophe Hélène Vasseur, qui publie aux éditions du Seuil un essai intitulé « Le numérique, ou la fin du temps long ». Hélène Vasseur, bonsoir. Bonsoir. Votre thèse est provocatrice : selon vous, le numérique ne nous fait pas seulement gagner du temps, il nous priverait d'une forme de temporalité essentielle à la pensée. C'est cela. Il faut bien distinguer deux choses : d'un côté, le temps mesurable, celui que les outils numériques optimisent à merveille — répondre à un mail, faire une recherche, regarder une vidéo. De l'autre, le temps long de la maturation, celui dont nous avons besoin pour qu'une idée se forme, qu'un livre nous habite, qu'un raisonnement s'approfondisse. Or ce temps long, par nature, n'est pas optimisable. Quand on tente de le compresser, on ne fait pas qu'aller plus vite : on change la nature même de ce qu'on produit. Vous parlez aussi d'une forme d'urgence permanente. Oui, et c'est le paradoxe le plus déroutant. Nous gagnons constamment du temps sur des tâches élémentaires, et pourtant nous nous sentons toujours plus pressés. C'est parce que ce temps libéré n'est jamais réinvesti dans la lenteur ; il est aussitôt absorbé par de nouvelles sollicitations. Le numérique, en quelque sorte, crée la demande qu'il prétend satisfaire. Quelle issue voyez-vous, alors ? Sûrement pas un retour en arrière nostalgique — ce serait absurde et même réactionnaire. Plutôt une éducation à choisir ses temporalités, à savoir basculer délibérément du temps court au temps long. C'est, je crois, un des grands défis culturels du siècle qui commence.",
        items: [
          { kind: "mcq", q: "Quelle est la thèse centrale de l'essai d'Hélène Vasseur ?", options: ["Le numérique fait gagner du temps", "Le numérique nous prive du temps long de la pensée", "Le numérique doit être interdit", "Le numérique remplace la philosophie"], answer: 1 },
          { kind: "mcq", q: "Quelle distinction fondamentale propose-t-elle ?", options: ["Vrai / faux temps", "Temps mesurable vs temps long de maturation", "Temps des jeunes / temps des vieux", "Temps de travail / temps de loisirs"], answer: 1 },
          { kind: "mcq", q: "Quel paradoxe identifie-t-elle ?", options: ["On gagne du temps mais on se sent plus pressé", "On perd du temps mais on est plus efficace", "On lit moins mais on comprend mieux", "On travaille moins mais on est plus stressé"], answer: 0 },
          { kind: "mcq", q: "Comment qualifie-t-elle l'idée d'un retour en arrière ?", options: ["Souhaitable", "Inévitable", "Absurde et réactionnaire", "Difficile mais nécessaire"], answer: 2 },
          { kind: "short", q: "Quelle solution propose-t-elle ?", model: "Une éducation à choisir ses temporalités, savoir basculer entre temps court et temps long" },
          { kind: "short", q: "Reformulez l'idée « le numérique crée la demande qu'il prétend satisfaire ».", model: "Le numérique génère de nouvelles sollicitations qui absorbent le temps qu'il libère ailleurs" },
        ],
      },
      {
        audio: "L'effondrement de la biodiversité est désormais documenté avec une précision glaçante : plus de soixante-quinze pour cent des insectes volants ont disparu d'Europe en trente ans, un quart des espèces de mammifères marins est aujourd'hui menacé d'extinction, et le rythme actuel de disparition des espèces est au moins cent fois supérieur au rythme naturel. Or, contrairement au réchauffement climatique, dont les conséquences se déploient sur plusieurs décennies, la biodiversité s'effondre presque en temps réel, sous nos yeux. Pourtant, l'opinion publique semble paradoxalement moins mobilisée. Pourquoi ? Plusieurs hypothèses circulent. D'abord, la biodiversité est un concept abstrait, difficile à incarner ; on s'émeut d'un ours polaire, plus difficilement d'un coléoptère. Ensuite, les solutions individuelles paraissent dérisoires face à un phénomène aussi massif — bien plus que dans le cas du climat. Enfin, les responsabilités sont diffuses : l'agriculture intensive, l'artificialisation des sols, la pollution lumineuse, les pesticides… personne n'est seul coupable, ce qui rend la mobilisation politique d'autant plus complexe. Pourtant, la sortie ne pourra venir que d'un changement systémique, mêlant régulation publique, transformation agricole et redéfinition de notre rapport au vivant.",
        items: [
          { kind: "mcq", q: "Quelle est l'idée principale du document ?", options: ["La biodiversité s'effondre plus vite que prévu mais mobilise moins que le climat", "Les insectes ont disparu en Europe", "L'agriculture intensive est la seule cause", "Il faut interdire les pesticides"], answer: 0 },
          { kind: "mcq", q: "Comparée au réchauffement climatique, la biodiversité…", options: ["…s'effondre plus lentement", "…s'effondre presque en temps réel", "…suit le même rythme", "…est moins documentée"], answer: 1 },
          { kind: "mcq", q: "Pourquoi l'opinion serait-elle moins mobilisée ?", options: ["Le sujet est trop ancien", "La biodiversité est un concept abstrait", "Les médias en parlent peu", "Les solutions sont déjà appliquées"], answer: 1 },
          { kind: "short", q: "Citez deux causes diffuses mentionnées dans le document.", model: "Agriculture intensive, artificialisation des sols, pollution lumineuse, pesticides (deux parmi ces quatre)" },
          { kind: "short", q: "Quelle est la nature de la sortie envisagée ?", model: "Un changement systémique : régulation publique, transformation agricole, redéfinition du rapport au vivant" },
        ],
      },
    ],
    C2: [
      {
        audio: "Notre invité ce soir est l'historien Étienne Lambert, qui revient sur la notion de progrès, à laquelle il a consacré son dernier ouvrage. Étienne Lambert, votre livre s'ouvre sur un constat troublant : depuis les Lumières, l'idée de progrès s'est imposée comme une évidence, mais aujourd'hui, elle vacille. Oui, et le mot lui-même est suspect. Pendant deux siècles, progresser, c'était à la fois croître techniquement, s'émanciper politiquement et améliorer moralement. Cette triple unité s'est défaite. Le progrès technique se poursuit, à un rythme même vertigineux. Mais nul ne soutient plus qu'il s'accompagne mécaniquement d'un progrès moral, et plus personne ne croit que l'innovation libère par essence. Vous parlez d'un déplacement du progrès, du collectif vers l'individuel. Précisément. Le grand récit moderne — celui d'une humanité collectivement en marche — s'est fragmenté. À sa place, on assiste à une myriade de progrès individuels : optimiser son corps, son sommeil, sa productivité, sa parentalité, sa vie intime. Le progrès devient une affaire de coaching personnel. Et cette privatisation du progrès, qui peut sembler émancipatrice, masque souvent une délégitimation des projets politiques de transformation. Comment expliquer cette inflexion ? Trois facteurs s'enchevêtrent. D'abord, l'épuisement des grandes idéologies du XXᵉ siècle. Ensuite, la prise de conscience écologique, qui a brisé l'équation entre progrès et croissance. Enfin, et c'est plus subtil, la révolution numérique a substitué à l'horizon long de l'utopie l'horizon court de l'optimisation. Quelle perspective vous semble alors possible ? La tâche, urgente, est de redonner au progrès une dimension à la fois collective et soutenable. Cela suppose d'inventer un récit qui ne soit ni nostalgique du progrès ancien, ni cynique à son égard. C'est, à mes yeux, l'enjeu intellectuel majeur de notre temps.",
        items: [
          { kind: "mcq", q: "Quel est le constat initial d'Étienne Lambert ?", options: ["Le progrès est mort", "L'idée de progrès, longtemps évidente, vacille aujourd'hui", "Le progrès n'a jamais existé", "Le progrès est uniquement technique"], answer: 1 },
          { kind: "mcq", q: "Quelle « triple unité » s'est selon lui défaite ?", options: ["Économique, sociale, culturelle", "Technique, politique, morale", "Individuelle, collective, étatique", "Locale, nationale, internationale"], answer: 1 },
          { kind: "mcq", q: "Selon lui, vers quoi le progrès s'est-il déplacé ?", options: ["Du moral vers le technique", "Du collectif vers l'individuel", "Du public vers le privé étatique", "Du Nord vers le Sud"], answer: 1 },
          { kind: "mcq", q: "Comment qualifie-t-il cette « privatisation du progrès » ?", options: ["Émancipatrice sans réserve", "Apparemment émancipatrice mais délégitimant le politique", "Strictement régressive", "Indifférente"], answer: 1 },
          { kind: "short", q: "Citez les trois facteurs qui, selon lui, expliquent cette inflexion.", model: "Épuisement des grandes idéologies du XXᵉ ; prise de conscience écologique ; révolution numérique substituant l'optimisation à l'utopie" },
          { kind: "short", q: "Quelle tâche estime-t-il urgente ?", model: "Redonner au progrès une dimension à la fois collective et soutenable, par un récit ni nostalgique ni cynique" },
          { kind: "short", q: "Reformulez l'expression « l'horizon court de l'optimisation ».", model: "Une perspective temporelle réduite, centrée sur des améliorations immédiates plutôt que sur une utopie à long terme" },
        ],
      },
    ],
  },

  /* =============================================================
   * READING bank — DELF style.
   * ============================================================= */
  reading: {
    A1: [
      { passage: "Salut Marie ! Je vais à la piscine samedi à 15h avec Paul. Tu veux venir ? Bisous, Sophie.", q: "Que propose Sophie ?", options: ["Aller au cinéma", "Aller à la piscine", "Aller au restaurant", "Faire du shopping"], answer: 1 },
      { passage: "ÉCOLE DE LANGUES — Cours de français : lundi, mercredi, vendredi. De 18h à 20h. Prix : 200 €/mois.", q: "Combien de jours par semaine y a-t-il cours ?", options: ["1 jour", "2 jours", "3 jours", "5 jours"], answer: 2 },
      { passage: "Boulangerie Dupont — Ouverte du mardi au dimanche. Fermée le lundi. Pain frais à partir de 7h.", q: "Quand la boulangerie est-elle fermée ?", options: ["Mardi", "Dimanche", "Lundi", "Samedi"], answer: 2 },
      { passage: "Chère Anne, je suis à Paris cette semaine. Il fait beau ! On se voit jeudi ? Bisous, Tom.", q: "Quand Tom veut-il voir Anne ?", options: ["Lundi", "Mardi", "Jeudi", "Dimanche"], answer: 2 },
      { passage: "MENU DU JOUR — Entrée : salade verte. Plat : poulet rôti et frites. Dessert : tarte aux pommes. Prix : 14 €.", q: "Quel est le plat ?", options: ["Salade", "Poulet rôti", "Tarte aux pommes", "Soupe"], answer: 1 },
      { passage: "PHARMACIE CENTRALE — Ouverte 7j/7. Lundi-samedi : 8h-20h. Dimanche : 10h-18h.", q: "À quelle heure ouvre-t-elle le dimanche ?", options: ["7h", "8h", "10h", "20h"], answer: 2 },
      { passage: "Métro Paris — Ligne 1 : Direction La Défense. Prochain train dans 3 minutes.", q: "Dans combien de minutes arrive le train ?", options: ["1 min", "3 min", "5 min", "10 min"], answer: 1 },
      { passage: "Salut Léo, joyeux anniversaire ! 25 ans déjà ! Gros bisous, Mamie.", q: "Quel âge a Léo ?", options: ["20 ans", "25 ans", "30 ans", "35 ans"], answer: 1 },
      { passage: "CAFÉ DES AMIS — Petit déjeuner : café + croissant = 4 €. Disponible jusqu'à 11h.", q: "Que peut-on prendre au petit déjeuner ?", options: ["Une bière", "Un café et un croissant", "Un thé glacé", "Une pizza"], answer: 1 },
      { passage: "Allô Camille, c'est Maman. Je rentre tard ce soir. Le dîner est dans le frigo. Bisous.", q: "Pourquoi Maman téléphone-t-elle ?", options: ["Pour dire bonjour", "Pour dire qu'elle rentre tard", "Pour inviter au restaurant", "Pour acheter à manger"], answer: 1 },
      { passage: "GARE DE LYON — Départ TGV pour Marseille à 14h. Quai 3.", q: "À quelle heure part le train ?", options: ["13h", "14h", "15h", "16h"], answer: 1 },
      { passage: "Bibliothèque municipale — Fermée le dimanche et le lundi. Ouverte du mardi au samedi de 10h à 19h.", q: "Combien de jours par semaine est-elle ouverte ?", options: ["3 jours", "4 jours", "5 jours", "7 jours"], answer: 2 },
      { passage: "Je m'appelle Karim, j'ai 30 ans, je suis marocain et j'habite à Paris depuis 5 ans. Je travaille comme cuisinier.", q: "Quelle est la profession de Karim ?", options: ["Boulanger", "Cuisinier", "Serveur", "Étudiant"], answer: 1 },
      { passage: "SOLDES — 30% sur tous les vêtements d'hiver. Jusqu'au 31 janvier.", q: "Quelle est la réduction ?", options: ["10%", "20%", "30%", "50%"], answer: 2 },
      { passage: "PARC FLORAL — Entrée : adultes 6 €, enfants gratuit. Ouvert tous les jours de 9h à 18h.", q: "Combien paient les enfants ?", options: ["3 €", "6 €", "Rien", "10 €"], answer: 2 },
      { passage: "Coucou Théo ! On part en vacances en Espagne du 15 au 30 août. Tu veux venir ? Bisous, Léa.", q: "Où Léa part-elle en vacances ?", options: ["En Italie", "En Espagne", "Au Portugal", "En France"], answer: 1 },
      { passage: "MUSÉE DU LOUVRE — Fermé le mardi. Entrée : 17 €. Gratuit le premier dimanche du mois.", q: "Quand est-ce gratuit ?", options: ["Tous les dimanches", "Le 1ᵉʳ dimanche du mois", "Le mardi", "Jamais"], answer: 1 },
      { passage: "PETITE ANNONCE — Vends vélo rouge, très bon état. 80 €. Téléphone : 06 12 34 56 78.", q: "Combien coûte le vélo ?", options: ["18 €", "60 €", "80 €", "100 €"], answer: 2 },
      { passage: "Bonjour, je suis Tom. J'ai un chien qui s'appelle Max et un chat qui s'appelle Mia. J'adore les animaux !", q: "Quels animaux a Tom ?", options: ["Un chien et un poisson", "Un chat seulement", "Un chien et un chat", "Un oiseau et un chat"], answer: 2 },
      { passage: "MÉTÉO PARIS — Aujourd'hui : nuageux, 12°C. Demain : soleil, 18°C.", q: "Quel temps fait-il demain ?", options: ["Nuageux", "Pluvieux", "Soleil", "Neige"], answer: 2 },
      { passage: "Maman ! On peut acheter une pizza ce soir ? Je n'ai pas envie de cuisiner. — D'accord ma chérie.", q: "Que va-t-on manger ce soir ?", options: ["Une salade", "Une pizza", "Des pâtes", "Du poulet"], answer: 1 },
      { passage: "AUTO-ÉCOLE — Cours du soir : mardi et jeudi, 18h-20h. Premier cours gratuit !", q: "Quand a lieu le cours ?", options: ["Lundi et mercredi", "Mardi et jeudi", "Vendredi et samedi", "Tous les jours"], answer: 1 },
    ],
    A2: [
      { passage: "Bonjour, je m'appelle Karim. J'habite à Bordeaux depuis deux ans. Je travaille dans un restaurant le soir et j'apprends le français le matin à l'université. Le week-end, j'aime jouer au foot avec mes amis.", q: "Que fait Karim le matin ?", options: ["Il travaille au restaurant", "Il joue au foot", "Il étudie le français", "Il dort"], answer: 2 },
      { passage: "OFFRE SPÉCIALE — Réservez votre vol Paris–Rome avant le 31 mars et payez seulement 89 € au lieu de 150 €. Bagage cabine inclus, bagage soute en supplément.", q: "Que faut-il payer en plus ?", options: ["Le bagage cabine", "Le bagage soute", "Le repas", "Le siège"], answer: 1 },
      { passage: "Salut Pierre, désolé pour hier soir, je suis tombé malade au dernier moment. On peut se voir samedi à la place ? Tu choisis le restaurant. À bientôt, Marc.", q: "Pourquoi Marc s'excuse-t-il ?", options: ["Il a oublié le rendez-vous", "Il était malade", "Il a eu un accident", "Il devait travailler"], answer: 1 },
      { passage: "Je cherche un colocataire pour partager mon appartement de 60 m² dans le centre. Chambre meublée, 400 € par mois, charges comprises. Non-fumeur de préférence.", q: "Que cherche cette personne ?", options: ["Un appartement", "Un colocataire", "Un travail", "Un meuble"], answer: 1 },
      { passage: "Bonjour Madame, votre commande est prête. Vous pouvez venir la récupérer à l'accueil entre 9h et 18h, du lundi au vendredi. N'oubliez pas votre pièce d'identité.", q: "Que faut-il apporter ?", options: ["Un colis", "De l'argent", "Une pièce d'identité", "Un sac"], answer: 2 },
      { passage: "Cher Léo, je n'ai pas pu venir à ton anniversaire parce que ma voiture était en panne. Ton cadeau arrive par la poste cette semaine. Bisous, Tata Anne.", q: "Pourquoi Tata Anne n'est-elle pas venue ?", options: ["Elle était malade", "Sa voiture était en panne", "Elle travaillait", "Elle était à l'étranger"], answer: 1 },
      { passage: "CINÉMA — Le nouveau film de Spielberg sort vendredi prochain. Réservations recommandées. Tarif : 12 € en plein tarif, 9 € pour les étudiants.", q: "Combien paie un étudiant ?", options: ["3 €", "9 €", "12 €", "Gratuit"], answer: 1 },
      { passage: "Bonjour, je suis intéressée par votre annonce pour le poste de serveuse. J'ai trois ans d'expérience dans un café et je parle français, anglais et espagnol. Pouvons-nous nous rencontrer cette semaine ?", q: "Que propose-t-elle ?", options: ["Un café", "Un travail", "Une rencontre", "Un repas"], answer: 2 },
      { passage: "Mon père est cuisinier dans un grand restaurant à Lyon. Il travaille tous les soirs sauf le lundi. Le matin, il fait les courses au marché.", q: "Quel jour ne travaille-t-il pas ?", options: ["Lundi", "Mardi", "Samedi", "Dimanche"], answer: 0 },
      { passage: "STAGE D'ÉTÉ — Apprenez à cuisiner italien ! Une semaine en Toscane, du 7 au 14 juillet. Hébergement inclus. Prix : 850 €. Places limitées.", q: "Que peut-on apprendre ?", options: ["L'italien", "La cuisine italienne", "L'histoire de la Toscane", "Le vin"], answer: 1 },
      { passage: "Je ne peux pas venir à la réunion de jeudi parce que mon fils est malade. Je vais essayer d'envoyer un collègue à ma place. Sinon, on pourrait peut-être faire la réunion en visio ?", q: "Quelle alternative propose-t-elle ?", options: ["Annuler la réunion", "La reporter à vendredi", "La faire en visio", "Y aller en retard"], answer: 2 },
      { passage: "GYM CITY — Nouveau ! Cours de yoga, zumba et pilates. Premier mois offert pour toute inscription avant le 30 septembre. Renseignements à l'accueil.", q: "Qu'est-ce qui est offert ?", options: ["Une boisson", "Le premier mois", "Un t-shirt", "Une serviette"], answer: 1 },
      { passage: "Salut Hugo, est-ce que tu peux garder mon chat pendant le week-end ? Je pars à Lille pour le mariage de mon frère. Je rentre dimanche soir. Bisous, Manon.", q: "Pourquoi Manon part-elle ?", options: ["Pour un mariage", "Pour un anniversaire", "Pour le travail", "Pour des vacances"], answer: 0 },
      { passage: "POSTE — Vos lettres et colis sont distribués entre 9h et 13h du lundi au samedi. En cas d'absence, un avis de passage est laissé dans votre boîte aux lettres.", q: "Que faire en cas d'absence ?", options: ["Téléphoner au facteur", "Récupérer l'avis de passage", "Aller à la mairie", "Demander au voisin"], answer: 1 },
      { passage: "Mon meilleur ami a déménagé à Berlin pour son travail. Il me manque beaucoup, mais on s'appelle tous les week-ends. Je vais le voir en mars.", q: "À quelle fréquence s'appellent-ils ?", options: ["Tous les jours", "Tous les week-ends", "Une fois par mois", "Une fois par an"], answer: 1 },
      { passage: "ÉCOLE DE LANGUES — Inscriptions ouvertes ! Cours de français, anglais, espagnol et chinois. Petits groupes de 8 élèves max. 25 € la séance.", q: "Combien d'élèves par cours au maximum ?", options: ["5", "8", "10", "15"], answer: 1 },
      { passage: "Notre voyage au Canada s'est très bien passé. Nous avons visité Montréal et Québec. Les gens étaient très accueillants et la nourriture était délicieuse. Le seul problème : il faisait très froid !", q: "Quel a été le problème ?", options: ["Les gens étaient froids", "La nourriture n'était pas bonne", "Il faisait très froid", "L'hôtel était cher"], answer: 2 },
      { passage: "BIBLIOTHÈQUE — Pour emprunter des livres, vous devez avoir une carte. Inscription gratuite avec un justificatif de domicile. Vous pouvez emprunter jusqu'à 5 livres pour 3 semaines.", q: "Combien de temps peut-on garder un livre ?", options: ["1 semaine", "2 semaines", "3 semaines", "1 mois"], answer: 2 },
      { passage: "Bonsoir Madame, votre table est prête. Voulez-vous boire quelque chose en attendant votre invité ? Nous avons une carte des vins très complète, ou bien un cocktail maison.", q: "Que propose le serveur ?", options: ["Un menu", "Une boisson en attendant", "Une autre table", "Un dessert"], answer: 1 },
      { passage: "ANNONCE — Recherche professeur particulier de mathématiques pour aider notre fille (15 ans) à préparer son examen. 2 séances/semaine. Niveau lycée. Salaire à discuter.", q: "Pour quelle matière cherche-t-on un professeur ?", options: ["Français", "Mathématiques", "Anglais", "Physique"], answer: 1 },
      { passage: "Demain, c'est l'anniversaire de Sarah. Elle aura 10 ans. Nous organisons une petite fête avec ses amis : gâteau au chocolat, jeux dans le jardin et bonbons. Tout est prêt !", q: "Quel âge va avoir Sarah ?", options: ["8 ans", "9 ans", "10 ans", "12 ans"], answer: 2 },
      { passage: "TRAIN — Suite à des travaux sur la voie, votre train est remplacé par un autocar. Départ depuis le parking de la gare. Durée du trajet : 2 heures au lieu d'1 heure.", q: "Pourquoi un autocar ?", options: ["Le train est en panne", "Il y a des travaux", "Il y a une grève", "C'est moins cher"], answer: 1 },
    ],
    B1: [
      { passage: "Depuis dix ans, le vélo électrique connaît un succès grandissant en France. Plus accessible que le vélo classique pour les longues distances ou les terrains vallonnés, il séduit aussi les actifs qui souhaitent éviter les embouteillages. Les ventes ont triplé entre 2018 et 2023, malgré un prix moyen encore élevé, autour de 2 000 €.", q: "Pourquoi le vélo électrique séduit-il les actifs ?", options: ["Parce qu'il est gratuit", "Parce qu'il évite les embouteillages", "Parce qu'il est plus rapide qu'une voiture", "Parce qu'il est obligatoire"], answer: 1 },
      { passage: "Notre association recherche des bénévoles pour donner des cours de français aux migrants nouvellement arrivés. Aucune formation pédagogique n'est exigée : bonne humeur, patience et disponibilité (2 heures par semaine minimum) suffisent. Une formation interne d'une journée est proposée à la rentrée.", q: "Que faut-il pour devenir bénévole ?", options: ["Un diplôme de professeur", "De la patience et 2 h par semaine", "Parler plusieurs langues", "Payer une cotisation"], answer: 1 },
      { passage: "La municipalité a décidé de piétonniser le centre-ville chaque dimanche entre mai et septembre. Si la mesure ravit les promeneurs et les commerçants des terrasses, elle inquiète certains habitants qui redoutent les difficultés de stationnement.", q: "Quelle est la réaction des habitants ?", options: ["Ils sont tous satisfaits", "Certains s'inquiètent du stationnement", "Ils veulent étendre la mesure", "Ils refusent en bloc"], answer: 1 },
      { passage: "Selon une récente étude, les jeunes Français lisent davantage de bandes dessinées que de romans. Le manga, en particulier, séduit les 15-25 ans, qui apprécient ses scénarios variés et son rythme rapide. Les éditeurs traditionnels s'adaptent en lançant leurs propres collections.", q: "Quel genre est particulièrement populaire ?", options: ["Le roman classique", "La poésie", "Le manga", "Le théâtre"], answer: 2 },
      { passage: "Pour ce stage en entreprise, nous cherchons un étudiant en marketing capable de travailler en équipe et maîtrisant l'anglais. Une expérience préalable n'est pas exigée, mais serait appréciée. Indemnité de stage : 600 €/mois.", q: "Quelle qualité est essentielle ?", options: ["Une expérience préalable", "Maîtriser plusieurs langues", "Savoir travailler en équipe", "Avoir un diplôme avancé"], answer: 2 },
      { passage: "Chaque été, le festival de musique de Carcassonne attire plus de 30 000 spectateurs venus de toute l'Europe. Cette année, la programmation mêle jazz, musique classique et chanson française. Les concerts gratuits du dimanche après-midi rencontrent un succès particulier.", q: "Quels concerts sont gratuits ?", options: ["Tous les concerts", "Ceux du dimanche après-midi", "Les concerts de jazz", "Les concerts du soir"], answer: 1 },
      { passage: "Notre nouveau cours en ligne permet d'apprendre à programmer en 12 semaines, à raison de 5 heures par semaine. Aucune connaissance préalable n'est requise. Une attestation est délivrée à la fin si vous validez tous les modules. Prix : 290 €.", q: "Combien d'heures par semaine ?", options: ["3 h", "5 h", "10 h", "12 h"], answer: 1 },
      { passage: "L'épidémie de bronchiolite touche un nombre record de jeunes enfants cet hiver. Les hôpitaux sont saturés et les pédiatres appellent à plus de prudence : aérer régulièrement, se laver les mains et limiter les bisous aux nourrissons.", q: "Quels conseils sont donnés ?", options: ["Vacciner les enfants", "Aérer et se laver les mains", "Rester à la maison", "Consulter immédiatement"], answer: 1 },
      { passage: "Selon les commerçants du quartier, la nouvelle piétonnisation a entraîné une hausse de fréquentation de 20 %, mais une partie de leur clientèle âgée se plaint de la distance à parcourir depuis les parkings. Un service de navette gratuite est à l'étude.", q: "Quel inconvénient est signalé ?", options: ["Le bruit", "La saleté", "La distance depuis les parkings", "La fermeture des magasins"], answer: 2 },
      { passage: "Le télétravail à temps complet, plébiscité en 2020, est aujourd'hui en recul. La plupart des entreprises ont adopté un format hybride : deux à trois jours au bureau, le reste à la maison. Cette formule semble convenir à la fois aux employeurs et aux salariés.", q: "Quelle est la formule la plus courante aujourd'hui ?", options: ["100% télétravail", "100% bureau", "Hybride 2-3 jours bureau", "1 jour par semaine au bureau"], answer: 2 },
      { kind: "short", passage: "Bonjour Mme Lefèvre, votre fils Théo m'a beaucoup aidée en mathématiques cette semaine. Grâce à lui, j'ai obtenu 16/20 à mon contrôle ! Je vous remercie de l'avoir mis en contact avec moi. Voudriez-vous qu'il continue à m'aider la semaine prochaine ? Camille.", q: "Pourquoi Camille écrit-elle ?", model: "Pour remercier et demander si Théo peut continuer à l'aider la semaine prochaine" },
      { kind: "short", passage: "L'application « Trop Bon » permet de récupérer à prix réduit les invendus alimentaires des commerçants en fin de journée. Lancée en 2018, elle compte aujourd'hui plus de 8 millions d'utilisateurs en France, et a permis de sauver près de 100 millions de repas qui auraient autrement été jetés.", q: "Quel est l'objectif principal de l'application ?", model: "Lutter contre le gaspillage alimentaire en proposant les invendus à prix réduit" },
      { kind: "short", passage: "La mairie organise dimanche prochain une grande braderie dans le parc central. Les habitants peuvent venir vendre leurs vieux objets ou simplement chiner. L'inscription est gratuite mais obligatoire avant vendredi soir. Une buvette sera installée par l'association de quartier.", q: "Que faut-il faire pour participer en tant que vendeur ?", model: "S'inscrire gratuitement avant vendredi soir" },
      // Multi-Q passage
      {
        passage: "OFFRE D'EMPLOI — Café-restaurant « Le Bon Coin », situé en centre-ville de Lille, recherche un serveur ou une serveuse à temps plein pour un contrat à durée indéterminée à partir du 1er octobre. Profil recherché : expérience minimum d'un an dans la restauration, sens du contact, capacité à travailler en équipe, anglais souhaité. Salaire selon profil, à partir de 1 700 € net par mois, plus pourboires. Avantages : repas pris sur place, deux jours de repos consécutifs en semaine, mutuelle d'entreprise prise en charge à 70 %. Pour postuler, envoyer CV et lettre de motivation à direction@leboncoin.fr avant le 15 septembre.",
        items: [
          { kind: "mcq", q: "Quel type de contrat est proposé ?", options: ["CDD", "Stage", "CDI", "Intérim"], answer: 2 },
          { kind: "mcq", q: "Quelle expérience est exigée ?", options: ["Aucune", "Au moins 6 mois", "Au moins 1 an", "Au moins 3 ans"], answer: 2 },
          { kind: "mcq", q: "Quels sont les jours de repos ?", options: ["Le week-end", "Deux jours consécutifs en semaine", "Un jour fixe", "À choisir librement"], answer: 1 },
          { kind: "short", q: "Quelle est la prise en charge de la mutuelle ?", model: "70 %" },
          { kind: "short", q: "Avant quelle date faut-il postuler ?", model: "Avant le 15 septembre" },
        ],
      },
    ],
    B2: [
      // Long article passages with 6–8 Qs each (mirrors real DELF B2 reading)
      {
        passage: "Le télétravail, plébiscité pendant la pandémie, fait aujourd'hui l'objet de débats plus nuancés au sein des entreprises. Si les salariés y voient un gain de qualité de vie indéniable, certaines directions estiment qu'il fragilise la culture d'entreprise et complique l'intégration des nouvelles recrues. La tendance actuelle privilégie donc le modèle hybride, généralement deux à trois jours de présentiel par semaine, perçu comme un compromis acceptable par les deux parties.\n\nToutefois, ce modèle n'est pas exempt de contradictions. Plusieurs études récentes pointent ainsi un paradoxe : alors que les salariés disent gagner en autonomie et en concentration, leurs managers estiment que la collaboration informelle — celle qui naît d'une rencontre fortuite à la machine à café — s'est considérablement appauvrie. Or c'est précisément dans ces moments non planifiés que naissent souvent les idées les plus innovantes.\n\nLa question de l'équité interne se pose également avec acuité. Tous les postes ne se prêtent pas au télétravail : un magasinier, un soignant ou un caissier ne peuvent pas l'envisager. Cette asymétrie crée parfois des tensions, accentuant le sentiment d'une entreprise « à deux vitesses ». Plusieurs DRH expérimentent désormais des compensations — primes spécifiques, jours supplémentaires de congé — pour les salariés non éligibles. Au final, la généralisation du télétravail oblige les entreprises à repenser leur organisation en profondeur, bien au-delà du simple aménagement des horaires.",
        items: [
          { kind: "mcq", q: "Quelle est la position adoptée par la plupart des entreprises ?", options: ["Un retour total au bureau", "Le télétravail à 100 %", "Un modèle hybride", "La suppression du télétravail"], answer: 2 },
          { kind: "mcq", q: "Quel paradoxe est évoqué ?", options: ["Plus d'autonomie mais moins de collaboration informelle", "Plus de salaire mais moins de motivation", "Plus de réunions mais moins de productivité", "Plus de stress mais plus d'innovation"], answer: 0 },
          { kind: "mcq", q: "Où naissent souvent les idées innovantes selon le texte ?", options: ["En réunion formelle", "Dans les moments non planifiés", "Par mail", "En télétravail"], answer: 1 },
          { kind: "mcq", q: "Quelle inégalité est soulignée ?", options: ["Hommes / femmes", "Cadres / non-cadres", "Postes éligibles / non éligibles au télétravail", "Anciens / nouveaux salariés"], answer: 2 },
          { kind: "short", q: "Citez deux exemples de postes non éligibles au télétravail.", model: "Magasinier, soignant ou caissier (deux parmi ces trois)" },
          { kind: "short", q: "Quelles compensations expérimentent certaines DRH ?", model: "Des primes spécifiques ou des jours supplémentaires de congé pour les salariés non éligibles" },
          { kind: "short", q: "Quelle conclusion générale tire l'auteur ?", model: "Le télétravail oblige à repenser l'organisation en profondeur, bien au-delà des horaires" },
        ],
      },
      {
        passage: "Longtemps réservée à une élite scientifique, l'intelligence artificielle est désormais intégrée dans des outils du quotidien — moteurs de recherche, suggestions de films, correcteurs orthographiques, applications de retouche photo. Cette démocratisation soulève toutefois des questions inédites : que devient la créativité humaine lorsque les machines produisent textes et images en quelques secondes ?\n\nLa première inquiétude concerne les métiers créatifs eux-mêmes. Graphistes, traducteurs, rédacteurs et même musiciens voient apparaître des outils capables, en théorie, de les concurrencer. Pourtant, plusieurs études récentes nuancent ce constat alarmiste : si certaines tâches répétitives sont effectivement remplacées, la valeur ajoutée humaine — direction artistique, sens du contexte, jugement éthique — devient au contraire plus précieuse.\n\nUne deuxième question touche à la propriété intellectuelle. Une image générée par IA appartient-elle à celui qui a saisi la commande, à l'entreprise qui développe l'algorithme, ou à personne ? Le flou juridique persiste, et plusieurs procès en cours pourraient redessiner profondément le droit d'auteur dans les années à venir.\n\nPlutôt que d'opposer l'homme et l'IA, plusieurs chercheurs proposent une approche collaborative, où l'IA serait un copilote — un outil qui accélère et démultiplie sans se substituer. Encore faut-il, soulignent-ils, que l'éducation prépare les futures générations à ce dialogue nouveau, sous peine de voir se creuser un fossé entre ceux qui maîtrisent ces outils et ceux qui les subissent.",
        items: [
          { kind: "mcq", q: "Quelle métaphore est proposée pour décrire l'IA idéale ?", options: ["Un remplaçant", "Un copilote", "Un robot", "Un adversaire"], answer: 1 },
          { kind: "mcq", q: "Quelle est la première inquiétude évoquée ?", options: ["La sécurité des données", "L'impact sur les métiers créatifs", "Le coût des outils", "La pollution numérique"], answer: 1 },
          { kind: "mcq", q: "Selon les études récentes, quelle est la valeur humaine renforcée ?", options: ["La rapidité d'exécution", "Le jugement éthique et le sens du contexte", "La capacité à imiter", "La mémoire"], answer: 1 },
          { kind: "mcq", q: "Quel domaine du droit pourrait être bouleversé ?", options: ["Le droit du travail", "Le droit pénal", "Le droit d'auteur", "Le droit fiscal"], answer: 2 },
          { kind: "short", q: "Citez deux exemples d'outils du quotidien intégrant l'IA mentionnés.", model: "Moteurs de recherche, suggestions de films, correcteurs orthographiques, applications de retouche photo (deux parmi ces quatre)" },
          { kind: "short", q: "Quel risque l'éducation doit-elle prévenir ?", model: "Un fossé entre ceux qui maîtrisent les outils d'IA et ceux qui les subissent" },
          { kind: "short", q: "Reformulez « un copilote — un outil qui accélère et démultiplie sans se substituer ».", model: "Un assistant qui augmente la productivité humaine sans remplacer l'humain lui-même" },
        ],
      },
    ],
    C1: [
      {
        passage: "L'effondrement de la biodiversité ne saurait être appréhendé comme un simple sujet écologique parmi d'autres : il interroge en profondeur notre rapport au vivant et, partant, notre conception même du progrès. Penser une économie qui cesse d'externaliser ses coûts environnementaux suppose une refonte conceptuelle dont les sociétés industrielles peinent encore à mesurer l'ampleur.\n\nLe constat scientifique est désormais sans appel. Soixante-quinze pour cent des insectes volants ont disparu d'Europe en trois décennies, un quart des espèces de mammifères marins est aujourd'hui menacé d'extinction, et le rythme actuel de disparition des espèces est cent fois supérieur au rythme naturel. Ces chiffres, longtemps cantonnés aux revues spécialisées, font désormais l'objet d'une médiatisation croissante, sans pour autant déboucher sur l'inflexion politique espérée.\n\nPlusieurs raisons expliquent ce hiatus. La première tient à la nature même du phénomène : la biodiversité s'effondre selon une temporalité diffuse, sans événement spectaculaire mobilisateur. La deuxième relève de la sociologie des représentations : les espèces emblématiques — ours blancs, baleines — mobilisent l'émotion, mais les espèces réellement menacées — coléoptères, mollusques, plantes endémiques — restent invisibles. La troisième, plus politique, tient à l'enchevêtrement des responsabilités : agriculture intensive, urbanisation, pollution lumineuse, pesticides, changement climatique… aucun acteur n'est isolément coupable, ce qui dilue l'imputabilité et complique l'action publique.\n\nUne sortie suppose donc moins une succession de mesures sectorielles qu'un changement systémique : transformation des modèles agricoles, redéfinition des indicateurs de richesse, intégration de la valeur du vivant dans la comptabilité économique. Plusieurs économistes parlent désormais d'une « comptabilité écologique étendue » dont les contours restent à inventer. La tâche est immense, mais l'alternative — une planète biologiquement appauvrie au point de compromettre les conditions mêmes de notre subsistance — n'en est pas une.",
        items: [
          { kind: "mcq", q: "Quelle est la thèse principale ?", options: ["La biodiversité n'est pas en danger", "C'est un sujet purement écologique", "Il faut repenser notre conception du progrès et l'économie en profondeur", "L'économie ne peut rien changer"], answer: 2 },
          { kind: "mcq", q: "Pourquoi la médiatisation ne suffit-elle pas ?", options: ["Les chiffres sont contestés", "Plusieurs facteurs sociologiques et politiques diluent la mobilisation", "Les médias n'en parlent pas", "Le public est désintéressé"], answer: 1 },
          { kind: "mcq", q: "Quel obstacle politique est souligné ?", options: ["L'opposition des écologistes", "L'enchevêtrement des responsabilités qui dilue l'imputabilité", "Le coût des mesures", "La complexité juridique"], answer: 1 },
          { kind: "short", q: "Qu'oppose l'auteur aux « espèces emblématiques » ?", model: "Les espèces réellement menacées mais invisibles : coléoptères, mollusques, plantes endémiques" },
          { kind: "short", q: "Qu'est-ce que la « comptabilité écologique étendue » ?", model: "Une approche qui intègre la valeur du vivant et les coûts environnementaux dans la comptabilité économique" },
          { kind: "short", q: "Quelle est la conclusion sur l'alternative ?", model: "Il n'y a pas d'alternative : une planète biologiquement appauvrie compromettrait nos conditions de subsistance" },
          { kind: "short", q: "Reformulez « externaliser ses coûts environnementaux ».", model: "Faire supporter par la nature ou la collectivité les dommages écologiques produits par l'activité économique" },
        ],
      },
      {
        passage: "On a longtemps cru que la lecture sur écran finirait par supplanter le livre papier. Les chiffres récents racontent une histoire plus subtile : loin de disparaître, le papier connaît un regain d'intérêt chez les jeunes adultes, qui y voient un antidote à la sursollicitation numérique. Le numérique, lui, s'est imposé pour la consultation rapide, mais peine à s'installer durablement pour la lecture longue.\n\nLes neurosciences éclairent ce partage. Plusieurs études convergent pour montrer que la lecture profonde — celle qui mobilise la mémoire de travail sur la durée — bénéficie de la matérialité du papier : repères spatiaux, sensation tactile, absence de notifications. La lecture sur écran, à l'inverse, sollicite un mode de traitement plus rapide, plus superficiel, mieux adapté à la consultation qu'à l'immersion. Ces différences ne traduisent aucun jugement de valeur, mais bien deux usages cognitifs distincts.\n\nReste un facteur trop souvent négligé : l'économie de l'attention. Le livre papier offre une expérience auto-suffisante, sans concurrence, alors que la lecture numérique se déroule dans un environnement saturé de sollicitations. Cette différence n'est pas anecdotique ; elle conditionne en grande partie la qualité de la compréhension, et explique sans doute pourquoi un jeune adulte qui prépare un examen choisira instinctivement un manuel papier, là même où il regarderait une série en streaming.\n\nL'avenir n'est donc sans doute pas à la substitution mais à la complémentarité : le numérique pour la rapidité, l'accessibilité et la recherche ; le papier pour l'immersion, la mémorisation et la pensée longue. Cette répartition, encore en construction, dessine une écologie de la lecture où chaque support trouverait sa place.",
        items: [
          { kind: "mcq", q: "Quelle évolution observe-t-on chez les jeunes adultes ?", options: ["Ils abandonnent le papier", "Ils retournent au papier comme antidote à la sursollicitation", "Ils ne lisent plus du tout", "Ils ne lisent qu'en numérique"], answer: 1 },
          { kind: "mcq", q: "Qu'apporte le papier selon les neurosciences ?", options: ["Une lecture plus rapide", "Une lecture profonde mieux soutenue", "Une meilleure mémorisation immédiate uniquement", "Aucun bénéfice"], answer: 1 },
          { kind: "mcq", q: "Quel facteur est dit « trop souvent négligé » ?", options: ["Le prix du livre", "L'économie de l'attention", "Le format de l'écran", "La taille des caractères"], answer: 1 },
          { kind: "mcq", q: "Quelle thèse défend l'auteur en conclusion ?", options: ["Le papier remplacera le numérique", "Le numérique gagnera tout", "La complémentarité plutôt que la substitution", "Il faut interdire les écrans"], answer: 2 },
          { kind: "short", q: "Citez deux caractéristiques cognitives propres à la lecture sur écran.", model: "Traitement plus rapide, plus superficiel, mieux adapté à la consultation qu'à l'immersion" },
          { kind: "short", q: "Pourquoi un étudiant choisit-il un manuel papier ?", model: "Parce que le papier offre une expérience auto-suffisante sans concurrence de sollicitations" },
          { kind: "short", q: "Que désigne l'expression « écologie de la lecture » ?", model: "Une répartition équilibrée des supports de lecture, où chaque support trouve sa place selon l'usage" },
        ],
      },
    ],
    C2: [
      {
        passage: "Toute démocratie repose sur un paradoxe fondateur : elle suppose des citoyens éclairés pour fonctionner, mais c'est précisément en fonctionnant qu'elle est censée les éclairer. Ce cercle, vertueux pour les uns, vicieux pour les autres, explique sans doute pourquoi les institutions démocratiques sont aussi fragiles que résilientes : elles ne tiennent jamais d'elles-mêmes, et pourtant elles tiennent souvent contre toute attente.\n\nLa modernité a redoublé ce paradoxe. L'élargissement progressif du corps politique — suffrage universel, scolarisation de masse, accès illimité à l'information — devait, selon le récit progressiste, garantir une élévation continue du niveau de délibération collective. Or l'expérience contemporaine semble suggérer l'inverse : jamais l'accès à l'information n'a été aussi étendu, jamais le sentiment d'une délibération éclairée n'a été aussi fragilisé. Cette dissociation entre quantité d'information et qualité de jugement constitue peut-être le grand impensé de notre époque démocratique.\n\nIl serait trop simple, cependant, d'imputer cette dissociation aux seules plateformes numériques. Celles-ci ne créent pas tant qu'elles révèlent et amplifient des fragilités antérieures, longtemps masquées par les médiations institutionnelles classiques : partis politiques, presse de référence, école républicaine. L'érosion de ces médiations laisse les individus face à une information brute, qu'il leur appartient désormais de trier, hiérarchiser, interpréter — opération cognitive exigeante, à laquelle peu ont été véritablement formés.\n\nIl faut sans doute, ici, dépasser l'opposition réflexe entre nostalgie et fascination. Ni le retour à un âge d'or fantasmé des médias d'autorité, ni l'abandon technocratique à des algorithmes de modération ne sauraient répondre au défi. Restaurer les conditions d'une délibération démocratique exige bien davantage : repenser l'éducation au jugement, soutenir un journalisme indépendant, et — peut-être surtout — admettre humblement que la démocratie est une discipline collective qui ne tient que par l'effort renouvelé de ceux qui la pratiquent.",
        items: [
          { kind: "mcq", q: "Quel paradoxe est mis en lumière ?", options: ["La démocratie est autosuffisante", "Elle a besoin de citoyens éclairés qu'elle est censée former", "Elle ne fonctionne que dans les pays riches", "Elle finit toujours par s'effondrer"], answer: 1 },
          { kind: "mcq", q: "Selon l'auteur, quel est le « grand impensé » ?", options: ["La crise économique", "La dissociation entre quantité d'information et qualité de jugement", "L'effondrement des partis", "La montée des extrêmes"], answer: 1 },
          { kind: "mcq", q: "Quel rôle attribue-t-il aux plateformes numériques ?", options: ["Créatrices uniques des fragilités actuelles", "Révélatrices et amplificatrices de fragilités antérieures", "Sans effet sur la démocratie", "Garantes du progrès démocratique"], answer: 1 },
          { kind: "mcq", q: "Quelle attitude récuse-t-il en conclusion ?", options: ["Repenser l'éducation au jugement", "Restaurer un journalisme indépendant", "À la fois la nostalgie et la fascination technocratique", "L'effort collectif"], answer: 2 },
          { kind: "short", q: "Qu'est-ce que la « modernité a redoublé » selon l'auteur ?", model: "Le paradoxe fondateur de la démocratie (citoyens éclairés / délibération censée éclairer)" },
          { kind: "short", q: "Citez deux médiations institutionnelles classiques dont l'érosion est évoquée.", model: "Partis politiques, presse de référence, école républicaine (deux parmi ces trois)" },
          { kind: "short", q: "Quelle est la définition finale de la démocratie proposée par l'auteur ?", model: "Une discipline collective qui ne tient que par l'effort renouvelé de ceux qui la pratiquent" },
          { kind: "short", q: "Reformulez « il faut admettre humblement ».", model: "Il faut reconnaître sans orgueil / avec lucidité" },
        ],
      },
    ],
  },

  /* =============================================================
   * WRITING tasks (Production écrite) — DELF format per level.
   * ============================================================= */
  writing: {
    A1: [
      { id: "w_a1_form", title: "Remplir une fiche d'inscription", sub: "Information personnelle", instruction: "Vous vous inscrivez à un cours de yoga. Remplissez les informations demandées en phrases complètes : nom, âge, nationalité, profession, ville où vous habitez, et un loisir que vous aimez.", en: "Fill in a gym/club registration form with full sentences.", minWords: 40, tip: "Une phrase courte par information. Utilisez « Je m'appelle », « J'ai … ans », « Je suis … », « J'habite à … »." },
      { id: "w_a1_msg", title: "Envoyer un message à un ami", sub: "Court message (40–50 mots)", instruction: "Vous êtes à Paris pour la première fois. Écrivez un court message à un ami français pour : (1) dire où vous êtes, (2) parler du temps qu'il fait, (3) dire ce que vous faites aujourd'hui, (4) proposer de se voir.", en: "Write a short message about being in Paris and suggest meeting.", minWords: 40, tip: "Commencez par « Salut … ! » et terminez par « À bientôt » ou « Bisous ». Une phrase par point." },
    ],
    A2: [
      { id: "w_a2_invite", title: "Inviter un ami à une fête", sub: "Court texte (60–80 mots)", instruction: "Vous organisez une fête pour votre anniversaire samedi prochain. Écrivez un mail à un ami pour l'inviter : précisez l'heure, l'adresse, ce qu'il doit apporter, et qui sera là. Demandez-lui de confirmer.", en: "Email a friend to invite them to your birthday party.", minWords: 60, tip: "Objet du mail + formule d'appel + 4 informations utiles + demande de réponse + formule de fin." },
      { id: "w_a2_story", title: "Raconter un week-end", sub: "Court récit (60–80 mots)", instruction: "Racontez votre dernier week-end dans un mail à un ami : où vous êtes allé(e), avec qui, ce que vous avez fait, et ce que vous avez aimé. Utilisez le passé composé.", en: "Tell a friend about your last weekend, using the past tense.", minWords: 60, tip: "Verbes au passé composé : « je suis allé(e) », « j'ai vu », « on a mangé ». Ajoutez un adjectif : « c'était super / fatigant »." },
    ],
    B1: [
      { id: "w_b1_opinion", title: "Donner son avis sur un sujet", sub: "Essai d'opinion (~180 mots)", instruction: "« Les téléphones portables devraient être interdits à l'école. » Donnez votre opinion sur cette affirmation dans un texte construit. Présentez deux arguments avec un exemple chacun, puis concluez.", en: "Argue for or against banning phones in schools — ~180 words.", minWords: 160, tip: "Intro (votre position) + 2 paragraphes (1 argument + exemple chacun) + conclusion brève. Connecteurs : « d'abord », « ensuite », « par exemple », « en conclusion »." },
      { id: "w_b1_letter", title: "Lettre de réclamation polie", sub: "Lettre formelle (~180 mots)", instruction: "Vous avez acheté un produit en ligne qui est arrivé cassé. Écrivez au service client pour expliquer le problème, demander un remboursement, et indiquer un délai sous lequel vous attendez une réponse. Restez poli mais ferme.", en: "Write a polite-but-firm complaint letter about a broken online order.", minWords: 160, tip: "Formule d'appel formelle + numéro de commande + description claire + demande précise + délai + « Dans l'attente de votre réponse, je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées »." },
    ],
    B2: [
      { id: "w_b2_essay", title: "Texte argumentatif", sub: "Argumentation (~250 mots)", instruction: "Le télétravail s'est généralisé depuis 2020. Dans un texte argumenté, présentez ses avantages et ses limites, puis donnez votre position personnelle. Appuyez-vous sur au moins un exemple concret pour chaque côté.", en: "Argumentative essay weighing pros and cons of remote work — ~250 words.", minWords: 220, tip: "Intro problématisée + § avantages avec exemple + § limites avec exemple + § position personnelle nuancée + conclusion ouverte. Connecteurs forts : « certes », « toutefois », « il n'en demeure pas moins que »." },
      { id: "w_b2_contrib", title: "Contribution à un forum", sub: "Texte argumenté (~250 mots)", instruction: "Sur un forum en ligne, un internaute affirme qu'« il faut interdire les voitures dans les centres-villes ». Répondez à ce message en exposant votre point de vue de façon nuancée, avec au moins deux arguments et un exemple par argument.", en: "Forum reply: nuanced response to a 'ban cars from city centres' claim.", minWords: 220, tip: "Reprise courte de la thèse adverse + votre position globale + 2 arguments développés + concession éventuelle + conclusion personnelle." },
    ],
    C1: [
      { id: "w_c1_synth", title: "Synthèse de documents", sub: "Synthèse (~220 mots)", instruction: "Imaginez que vous disposez de trois articles sur le thème : « L'intelligence artificielle et le monde du travail ». Sans copier de phrases, rédigez une synthèse problématisée qui présente les idées principales et les met en relation. Restez neutre — ne donnez pas votre opinion.", en: "Document synthesis on AI and work — neutral, ~220 words, no personal opinion.", minWords: 200, tip: "Pas de « je ». Reformulation systématique. Structure : intro avec problématique + 2–3 axes thématiques (pas par document) + conclusion ouverte. Connecteurs précis : « tandis que », « à l'inverse », « dans le prolongement »." },
      { id: "w_c1_essay", title: "Essai argumenté", sub: "Essai (~250 mots)", instruction: "« L'art contemporain a-t-il encore quelque chose à dire au grand public ? » Répondez à cette question dans un essai structuré en présentant une thèse personnelle nuancée, étayée par au moins trois exemples précis.", en: "Argumentative essay on contemporary art and the public — ~250 words.", minWords: 230, tip: "Thèse claire dès l'intro + plan dialectique (thèse / antithèse / synthèse) ou thématique + exemples précis et variés + conclusion qui ouvre. Évitez les généralités." },
    ],
    C2: [
      { id: "w_c2_dossier", title: "Production écrite à partir d'un dossier", sub: "Texte structuré (~700 mots)", instruction: "À partir d'un dossier imaginaire portant sur « la place du livre à l'ère numérique » (3–4 documents : article, témoignage, étude chiffrée), rédigez un texte de type éditorial qui synthétise les enjeux, prend position, et propose une perspective originale. Style soigné exigé.", en: "Op-ed style structured text from a multi-doc dossier on books in the digital era.", minWords: 600, tip: "Titre fort + chapeau + structure en parties titrées (II ou III) + appui constant sur le dossier (sans citations longues) + position assumée + style maîtrisé : variation des temps, modalisation fine, lexique précis." },
    ],
  },

  /* =============================================================
   * SPEAKING tasks (Production orale) — DELF format per level.
   * ============================================================= */
  speaking: {
    A1: [
      { id: "s_a1_entretien", title: "Entretien dirigé", sub: "Se présenter (1 min)", instruction: "Présentez-vous à l'examinateur : nom, âge, nationalité, ville où vous habitez, profession ou études, langues parlées, et une chose que vous aimez.", en: "Simple self-introduction.", durationSec: 60, tip: "Phrases courtes. « Je m'appelle … », « J'ai … ans », « Je viens de … », « J'habite à … », « Je parle … », « J'aime … »." },
      { id: "s_a1_info", title: "Échange d'informations", sub: "Poser 5 questions (2 min)", instruction: "À partir des mots-clés suivants, posez une question simple pour chacun : NOM · ÂGE · FAMILLE · TRAVAIL · LOISIRS.", en: "Ask 5 simple questions from given keywords.", durationSec: 120, tip: "Inversion ou « est-ce que ». « Comment tu t'appelles ? », « Quel âge tu as ? », « Tu as des frères et sœurs ? », « Qu'est-ce que tu fais dans la vie ? », « Qu'est-ce que tu aimes faire ? »." },
      { id: "s_a1_jeu", title: "Jeu de rôle", sub: "Au café (2 min)", instruction: "Vous êtes au café à Paris. Vous saluez le serveur, vous commandez une boisson et quelque chose à manger, vous demandez le prix et vous payez.", en: "Order at a Parisian café.", durationSec: 120, tip: "« Bonjour ! », « Je voudrais … s'il vous plaît », « Ça fait combien ? », « Voilà », « Merci, au revoir ! »." },
    ],
    A2: [
      { id: "s_a2_monologue", title: "Monologue suivi", sub: "Parler de ses goûts (2 min)", instruction: "Parlez de votre activité préférée : ce que vous faites, depuis quand, avec qui, où, à quelle fréquence, et pourquoi vous aimez ça.", en: "Talk about a favorite activity — 6 points to cover.", durationSec: 120, tip: "Connecteurs simples : « d'abord », « ensuite », « parce que », « par exemple »." },
      { id: "s_a2_interaction", title: "Exercice en interaction", sub: "Au guichet (3 min)", instruction: "Vous arrivez à la gare. Vous achetez un billet pour Lyon : précisez la date, l'heure, aller-retour ou simple, première ou seconde classe. Demandez le prix et le quai de départ.", en: "Buy a train ticket: date, time, class, price, platform.", durationSec: 180, tip: "« Je voudrais un aller-retour pour … le … à … », « En seconde classe », « C'est combien ? », « Quel quai ? »." },
    ],
    B1: [
      { id: "s_b1_entretien", title: "Entretien dirigé", sub: "Conversation (2–3 min)", instruction: "Présentez-vous brièvement, puis répondez aux questions probables de l'examinateur sur vos études/votre travail, votre famille, vos loisirs et vos projets.", en: "Guided interview: study/work, family, hobbies, plans.", durationSec: 180, tip: "Étoffez : pour chaque réponse, ajoutez « parce que … » ou un exemple. Évitez les réponses en un mot." },
      { id: "s_b1_interaction", title: "Exercice en interaction", sub: "Négociation (3–4 min)", instruction: "Vous voulez partir en vacances avec un(e) ami(e), mais vous n'êtes pas d'accord sur la destination (mer / montagne). Convainquez-le/la, écoutez ses arguments, et trouvez un compromis acceptable.", en: "Convince a friend on a holiday destination and reach a compromise.", durationSec: 240, tip: "Arguments + écoute + concession : « je comprends, mais … », « et si on … ? », « finalement, je propose qu'on … »." },
      { id: "s_b1_expression", title: "Expression d'un point de vue", sub: "À partir d'un document (5–7 min)", instruction: "À partir du titre « Les jeunes lisent de moins en moins de livres », faites un court exposé en trois temps : présentez le sujet, donnez votre opinion avec des arguments, et concluez. Vous pouvez préparer mentalement pendant 10 minutes.", en: "5–7 min monologue from a headline; structured opinion with arguments.", durationSec: 360, tip: "Structure : intro → 2 arguments avec exemples → conclusion personnelle. Évitez la lecture mot à mot, préférez les notes-clés." },
    ],
    B2: [
      { id: "s_b2_defense", title: "Défendre un point de vue", sub: "Exposé argumenté (~10 min) + débat (~10 min)", instruction: "À partir d'un court article (imaginez : « Faut-il taxer davantage les voyages en avion ? »), préparez un exposé clair qui présente le problème, dégage les enjeux, défend une position nuancée et anticipe les objections. L'examinateur jouera ensuite le rôle d'un contradicteur.", en: "Defend a position from a short article, then debate with examiner.", durationSec: 600, tip: "Plan visible : « Je traiterai cette question en trois temps … ». Reformulez l'objection avant d'y répondre : « Vous me dites que … ; je comprends, néanmoins … »." },
      { id: "s_b2_actuel", title: "Sujet d'actualité", sub: "Exposé + débat (~20 min)", instruction: "Sujet : « Les réseaux sociaux : véritables espaces de débat ou simples chambres d'écho ? ». Faites un exposé construit, puis défendez votre position face aux contre-arguments de l'examinateur.", en: "Topical exposé + debate on social media as echo chambers.", durationSec: 600, tip: "Modalisez : « il semble que », « tout porte à croire que ». Nuancez systématiquement : aucune position binaire en B2." },
    ],
    C1: [
      { id: "s_c1_expose", title: "Exposé à partir d'un dossier", sub: "Monologue (~8 min) + débat (~15 min)", instruction: "À partir d'un dossier imaginaire de 2–3 documents sur « la place du français face à l'anglais dans le monde scientifique », dégagez un problème central, structurez un exposé personnel et original, puis défendez votre position lors du débat.", en: "Synthesise a 2–3 doc dossier, deliver a structured exposé, then debate.", durationSec: 600, tip: "Pas un résumé doc par doc : axes thématiques transverses. Ouverture d'exposé soignée + plan annoncé + reprise habile des documents en appui ponctuel." },
    ],
    C2: [
      { id: "s_c2_compte", title: "Compte rendu et débat", sub: "Exposé (~15 min) + débat (~15 min)", instruction: "À partir d'un dossier complexe (4–5 documents : article de fond, données chiffrées, extrait littéraire, témoignage), faites un compte rendu structuré qui dégage une problématique fine, puis défendez une thèse personnelle lors d'un débat exigeant.", en: "Long structured compte rendu from a rich dossier, then high-level debate.", durationSec: 900, tip: "Style oratoire : variation rythmique, formules d'appui (« il importe de remarquer que »), maîtrise des registres. Le débat attend une vraie pensée, non une récitation." },
    ],
  },
};
