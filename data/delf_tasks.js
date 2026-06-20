/* ===== DELF / DALF practice content =====
 * Per-level (A1–C2) tasks for the four DELF modules:
 *   • compréhension de l'oral (Listening)
 *   • compréhension des écrits (Reading)
 *   • production écrite (Writing)
 *   • production orale (Speaking)
 *
 * Listening + Reading items are MCQ-style and run fully offline.
 * Writing + Speaking are open-ended tasks; Claude grades them on a DELF rubric
 * when a key is set, otherwise a self-check guide is shown.
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

  /* =============================================================
   * Listening bank — DELF style.
   * Each item: { audio (FR transcript spoken via TTS), q, options[], answer (idx), tip? }
   * ============================================================= */
  listening: {
    A1: [
      { audio: "Bonjour ! Je m'appelle Léa, j'ai vingt-deux ans et j'habite à Lyon.", q: "Quel âge a Léa ?", options: ["12 ans", "20 ans", "22 ans", "32 ans"], answer: 2 },
      { audio: "Le train pour Marseille part à dix-sept heures quarante, quai numéro huit.", q: "À quelle heure part le train ?", options: ["7h40", "16h40", "17h14", "17h40"], answer: 3 },
      { audio: "Aujourd'hui à Paris, il fait dix degrés et il pleut un peu.", q: "Quel temps fait-il ?", options: ["Il neige", "Il pleut", "Il fait chaud", "Il y a du vent"], answer: 1 },
      { audio: "Pour aller à la pharmacie, vous tournez à gauche après la boulangerie.", q: "Où va-t-on ?", options: ["À la boulangerie", "À la poste", "À la pharmacie", "À l'école"], answer: 2 },
      { audio: "Le menu du jour : une salade verte, un steak frites et une mousse au chocolat.", q: "Qu'est-ce qu'il y a en dessert ?", options: ["Une tarte", "Une glace", "Une mousse au chocolat", "Des fruits"], answer: 2 },
    ],
    A2: [
      { audio: "Bonjour, c'est le docteur Martin. Votre rendez-vous de mardi est déplacé à jeudi quatorze heures. Merci.", q: "Quel jour est le nouveau rendez-vous ?", options: ["Mardi", "Mercredi", "Jeudi", "Vendredi"], answer: 2 },
      { audio: "Le musée est ouvert tous les jours sauf le lundi, de neuf heures à dix-huit heures. L'entrée coûte huit euros.", q: "Quand le musée est-il fermé ?", options: ["Le dimanche", "Le lundi", "Le samedi", "Le mardi"], answer: 1 },
      { audio: "Pour votre commande, votre pizza sera livrée dans environ trente minutes. Le livreur s'appelle Karim.", q: "Dans combien de temps arrive la pizza ?", options: ["Dans 13 minutes", "Dans 15 minutes", "Dans 30 minutes", "Dans une heure"], answer: 2 },
      { audio: "Le week-end prochain, on part à la campagne. On part vendredi soir et on rentre dimanche après-midi.", q: "Quand rentrent-ils ?", options: ["Samedi soir", "Dimanche matin", "Dimanche après-midi", "Lundi"], answer: 2 },
      { audio: "Pour faire ce gâteau, il vous faut deux œufs, cent grammes de sucre et un peu de beurre.", q: "Combien d'œufs faut-il ?", options: ["Un œuf", "Deux œufs", "Trois œufs", "Quatre œufs"], answer: 1 },
    ],
    B1: [
      { audio: "Mesdames, messieurs, en raison d'un incident technique, le TGV à destination de Bordeaux aura un retard d'environ vingt-cinq minutes. Nous vous prions de nous excuser pour la gêne occasionnée.", q: "Pourquoi le train est-il en retard ?", options: ["À cause de la météo", "À cause d'un incident technique", "À cause d'une grève", "À cause d'un accident"], answer: 1 },
      { audio: "Salut, c'est Camille. Finalement, je ne peux pas venir au cinéma ce soir, je dois finir un dossier important pour demain. On peut se voir samedi à la place ?", q: "Pourquoi Camille annule-t-elle ?", options: ["Elle est malade", "Elle a du travail", "Elle est fatiguée", "Elle est en voyage"], answer: 1 },
      { audio: "Pour profiter de la promotion, présentez ce coupon en caisse avant le trente juin. Réduction de quinze pour cent sur toute la collection d'été.", q: "Quelle est la réduction ?", options: ["5%", "15%", "30%", "50%"], answer: 1 },
      { audio: "Le maire a annoncé hier l'ouverture d'une nouvelle piste cyclable longue de quatre kilomètres entre le centre-ville et l'université.", q: "Qu'est-ce qui va ouvrir ?", options: ["Une école", "Une piste cyclable", "Un parking", "Une bibliothèque"], answer: 1 },
      { audio: "Si vous souhaitez réserver une table pour plus de six personnes, merci d'appeler directement le restaurant au moins quarante-huit heures à l'avance.", q: "Quand faut-il réserver pour un grand groupe ?", options: ["24 h avant", "48 h avant", "Une semaine avant", "Le jour même"], answer: 1 },
    ],
    B2: [
      { audio: "Une étude récente montre que les Français passent en moyenne trois heures par jour sur leur smartphone, soit une augmentation de vingt pour cent par rapport à l'an dernier. Les experts s'inquiètent surtout pour les adolescents.", q: "Quelle est l'idée principale ?", options: ["Les smartphones coûtent plus cher", "Le temps passé sur smartphone augmente", "Les adolescents lisent moins", "Les Français travaillent davantage"], answer: 1 },
      { audio: "Le gouvernement envisage de réformer les retraites, mais plusieurs syndicats appellent déjà à la grève. Les négociations devraient durer plusieurs semaines avant tout vote au parlement.", q: "Quelle est la réaction des syndicats ?", options: ["Ils approuvent la réforme", "Ils appellent à la grève", "Ils ne se prononcent pas", "Ils demandent un référendum"], answer: 1 },
      { audio: "Bien que le télétravail offre une grande flexibilité, beaucoup de salariés se plaignent d'un isolement croissant et d'une difficulté à séparer vie professionnelle et vie privée.", q: "Quel est l'inconvénient mentionné ?", options: ["Le coût élevé", "L'isolement et le manque de séparation", "Le manque de matériel", "La baisse de productivité"], answer: 1 },
      { audio: "Selon le climatologue interviewé, il ne s'agit plus de prévenir le changement climatique, mais bien de s'adapter à ses conséquences déjà bien visibles.", q: "Quelle est la position de l'expert ?", options: ["Il faut encore prévenir", "Il faut s'adapter aux conséquences", "Rien ne peut être fait", "Le problème est exagéré"], answer: 1 },
      { audio: "Cette nouvelle plateforme propose aux jeunes diplômés un accompagnement personnalisé pendant six mois pour faciliter leur insertion professionnelle.", q: "À qui s'adresse la plateforme ?", options: ["Aux retraités", "Aux jeunes diplômés", "Aux entrepreneurs", "Aux étudiants étrangers"], answer: 1 },
    ],
    C1: [
      { audio: "Loin d'être un simple effet de mode, le retour aux circuits courts traduit une remise en question profonde de notre modèle agro-alimentaire. Producteurs et consommateurs cherchent à recréer un lien direct, gage de transparence comme de qualité.", q: "Quelle est l'idée centrale ?", options: ["Les circuits courts sont une mode passagère", "Ils reflètent une remise en question du système alimentaire", "Les producteurs ne gagnent pas assez", "La grande distribution disparaît"], answer: 1 },
      { audio: "L'intelligence artificielle ne remplacera pas le médecin, mais elle deviendra rapidement un outil indispensable à son diagnostic. Le véritable défi est éthique : qui sera responsable d'une erreur algorithmique ?", q: "Quel défi est mis en avant ?", options: ["La rapidité de l'IA", "Le coût pour les hôpitaux", "La responsabilité en cas d'erreur", "L'acceptation par les patients"], answer: 2 },
      { audio: "Si la natalité française reste légèrement supérieure à la moyenne européenne, elle connaît néanmoins une baisse régulière depuis une décennie, ce qui pose à terme la question du financement des retraites.", q: "Quelle conséquence est évoquée ?", options: ["Une hausse du chômage", "Un problème pour les retraites", "Une baisse des salaires", "Une crise du logement"], answer: 1 },
      { audio: "Contrairement à une idée répandue, ce n'est pas l'absence de talent qui freine les femmes dans les postes de direction, mais bien un ensemble de mécanismes structurels que les entreprises peinent encore à reconnaître.", q: "Quelle est la thèse défendue ?", options: ["Les femmes manquent de talent", "Le problème vient de structures, pas du talent", "Les entreprises ne recrutent plus", "Il faut des quotas obligatoires"], answer: 1 },
    ],
    C2: [
      { audio: "La langue, en perpétuelle évolution, n'est jamais le simple reflet d'une société : elle en est aussi l'un des moteurs. Les choix lexicaux d'aujourd'hui dessinent, presque à notre insu, les contours mentaux de demain.", q: "Quelle relation entre langue et société est décrite ?", options: ["La langue subit la société", "La langue est neutre", "La langue façonne aussi la société", "La société choisit les mots"], answer: 2 },
      { audio: "À l'heure où l'on célèbre l'instantanéité numérique, la lenteur retrouvée de la lecture sur papier apparaît, paradoxalement, comme un acte de résistance — une manière de réinvestir le temps long de la pensée.", q: "Comment est présentée la lecture sur papier ?", options: ["Comme dépassée", "Comme un acte de résistance", "Comme moins efficace", "Comme un luxe coûteux"], answer: 1 },
      { audio: "L'art contemporain dérange parce qu'il refuse précisément ce qu'on attend de lui : qu'il rassure, qu'il décore, qu'il confirme. Sa fonction première reste, depuis Duchamp, de déplacer le regard.", q: "Selon l'orateur, quel est le rôle de l'art contemporain ?", options: ["Rassurer le public", "Décorer les espaces", "Déplacer le regard", "Imiter les classiques"], answer: 2 },
    ],
  },

  /* =============================================================
   * Reading bank — DELF style passages + comprehension MCQs.
   * Each item: { passage, q, options[], answer (idx) }
   * ============================================================= */
  reading: {
    A1: [
      { passage: "Salut Marie ! Je vais à la piscine samedi à 15h avec Paul. Tu veux venir ? Bisous, Sophie.", q: "Que propose Sophie ?", options: ["Aller au cinéma", "Aller à la piscine", "Aller au restaurant", "Faire du shopping"], answer: 1 },
      { passage: "ÉCOLE DE LANGUES — Cours de français : lundi, mercredi, vendredi. De 18h à 20h. Prix : 200 €/mois.", q: "Combien de jours par semaine y a-t-il cours ?", options: ["1 jour", "2 jours", "3 jours", "5 jours"], answer: 2 },
      { passage: "Boulangerie Dupont — Ouverte du mardi au dimanche. Fermée le lundi. Pain frais à partir de 7h.", q: "Quand la boulangerie est-elle fermée ?", options: ["Mardi", "Dimanche", "Lundi", "Samedi"], answer: 2 },
      { passage: "Chère Anne, je suis à Paris cette semaine. Il fait beau ! On se voit jeudi ? Bisous, Tom.", q: "Quand Tom veut-il voir Anne ?", options: ["Lundi", "Mardi", "Jeudi", "Dimanche"], answer: 2 },
    ],
    A2: [
      { passage: "Bonjour, je m'appelle Karim. J'habite à Bordeaux depuis deux ans. Je travaille dans un restaurant le soir et j'apprends le français le matin à l'université. Le week-end, j'aime jouer au foot avec mes amis.", q: "Que fait Karim le matin ?", options: ["Il travaille au restaurant", "Il joue au foot", "Il étudie le français", "Il dort"], answer: 2 },
      { passage: "OFFRE SPÉCIALE — Réservez votre vol Paris–Rome avant le 31 mars et payez seulement 89 € au lieu de 150 €. Bagage cabine inclus, bagage soute en supplément.", q: "Que faut-il payer en plus ?", options: ["Le bagage cabine", "Le bagage soute", "Le repas", "Le siège"], answer: 1 },
      { passage: "Salut Pierre, désolé pour hier soir, je suis tombé malade au dernier moment. On peut se voir samedi à la place ? Tu choisis le restaurant. À bientôt, Marc.", q: "Pourquoi Marc s'excuse-t-il ?", options: ["Il a oublié le rendez-vous", "Il était malade", "Il a eu un accident", "Il devait travailler"], answer: 1 },
      { passage: "Je cherche un colocataire pour partager mon appartement de 60 m² dans le centre. Chambre meublée, 400 € par mois, charges comprises. Non-fumeur de préférence.", q: "Que cherche cette personne ?", options: ["Un appartement", "Un colocataire", "Un travail", "Un meuble"], answer: 1 },
    ],
    B1: [
      { passage: "Depuis dix ans, le vélo électrique connaît un succès grandissant en France. Plus accessible que le vélo classique pour les longues distances ou les terrains vallonnés, il séduit aussi les actifs qui souhaitent éviter les embouteillages. Les ventes ont triplé entre 2018 et 2023, malgré un prix moyen encore élevé, autour de 2 000 €.", q: "Pourquoi le vélo électrique séduit-il les actifs ?", options: ["Parce qu'il est gratuit", "Parce qu'il évite les embouteillages", "Parce qu'il est plus rapide qu'une voiture", "Parce qu'il est obligatoire"], answer: 1 },
      { passage: "Notre association recherche des bénévoles pour donner des cours de français aux migrants nouvellement arrivés. Aucune formation pédagogique n'est exigée : bonne humeur, patience et disponibilité (2 heures par semaine minimum) suffisent. Une formation interne d'une journée est proposée à la rentrée.", q: "Que faut-il pour devenir bénévole ?", options: ["Un diplôme de professeur", "De la patience et 2 h par semaine", "Parler plusieurs langues", "Payer une cotisation"], answer: 1 },
      { passage: "La municipalité a décidé de piétonniser le centre-ville chaque dimanche entre mai et septembre. Si la mesure ravit les promeneurs et les commerçants des terrasses, elle inquiète certains habitants qui redoutent les difficultés de stationnement.", q: "Quelle est la réaction des habitants ?", options: ["Ils sont tous satisfaits", "Certains s'inquiètent du stationnement", "Ils veulent étendre la mesure", "Ils refusent en bloc"], answer: 1 },
    ],
    B2: [
      { passage: "Le télétravail, plébiscité pendant la pandémie, fait aujourd'hui l'objet de débats plus nuancés au sein des entreprises. Si les salariés y voient un gain de qualité de vie indéniable, certaines directions estiment qu'il fragilise la culture d'entreprise et complique l'intégration des nouvelles recrues. La tendance actuelle privilégie donc le modèle hybride, généralement deux à trois jours de présentiel par semaine, perçu comme un compromis acceptable par les deux parties.", q: "Quelle est la position adoptée par la plupart des entreprises ?", options: ["Un retour total au bureau", "Le télétravail à 100 %", "Un modèle hybride", "La suppression du télétravail"], answer: 2 },
      { passage: "Longtemps réservée à une élite scientifique, l'intelligence artificielle est désormais intégrée dans des outils du quotidien. Cette démocratisation soulève toutefois des questions inédites : que devient la créativité humaine lorsque les machines produisent textes et images en quelques secondes ? Plutôt que d'opposer l'homme et l'IA, plusieurs chercheurs proposent une approche collaborative, où l'IA serait un copilote, et non un remplaçant.", q: "Quelle approche est recommandée ?", options: ["Interdire l'IA dans la création", "Voir l'IA comme un copilote", "Remplacer les artistes par l'IA", "Réserver l'IA aux scientifiques"], answer: 1 },
      { passage: "La gentrification des centres-villes français suit un schéma désormais bien connu : arrivée de nouveaux habitants aux revenus plus élevés, hausse des loyers, départ progressif des classes populaires vers la périphérie. Si certains saluent la rénovation du bâti et le dynamisme commercial qui en découlent, d'autres y voient une fracture sociale grandissante.", q: "Quel est l'effet négatif souligné ?", options: ["La rénovation du bâti", "Le départ des classes populaires", "L'arrivée de commerces", "La baisse de la pollution"], answer: 1 },
    ],
    C1: [
      { passage: "L'effondrement de la biodiversité ne saurait être appréhendé comme un simple sujet écologique parmi d'autres : il interroge en profondeur notre rapport au vivant et, partant, notre conception même du progrès. Penser une économie qui cesse d'externaliser ses coûts environnementaux suppose une refonte conceptuelle dont les sociétés industrielles peinent encore à mesurer l'ampleur.", q: "Quelle est la thèse principale ?", options: ["La biodiversité n'est pas en danger", "C'est un sujet purement écologique", "Il faut repenser notre conception du progrès", "L'économie ne peut rien changer"], answer: 2 },
      { passage: "On a longtemps cru que la lecture sur écran finirait par supplanter le livre papier. Or, les chiffres récents racontent une histoire plus subtile : loin de disparaître, le papier connaît un regain d'intérêt chez les jeunes adultes, qui y voient un antidote à la sursollicitation numérique. Le numérique, lui, s'est imposé pour la consultation rapide, mais peine à s'installer durablement pour la lecture longue.", q: "Quelle nuance est apportée ?", options: ["Le papier va disparaître", "Le papier garde sa place pour la lecture longue", "Les jeunes ne lisent plus", "Le numérique a tout remplacé"], answer: 1 },
    ],
    C2: [
      { passage: "Toute démocratie repose sur un paradoxe fondateur : elle suppose des citoyens éclairés pour fonctionner, mais c'est précisément en fonctionnant qu'elle est censée les éclairer. Ce cercle, vertueux pour les uns, vicieux pour les autres, explique sans doute pourquoi les institutions démocratiques sont aussi fragiles que résilientes : elles ne tiennent jamais d'elles-mêmes, et pourtant elles tiennent souvent contre toute attente.", q: "Quel paradoxe est mis en lumière ?", options: ["La démocratie est autosuffisante", "Elle a besoin de citoyens éclairés qu'elle est censée former", "Elle ne fonctionne que dans les pays riches", "Elle finit toujours par s'effondrer"], answer: 1 },
      { passage: "Réduire l'art à sa fonction esthétique reviendrait à le priver de sa charge la plus subversive. Depuis les avant-gardes du XXᵉ siècle, l'œuvre ne se contente plus d'exprimer le beau : elle interroge, déstabilise, voire offense, dans une démarche assumée d'écart par rapport à la norme. C'est en cela, peut-être, qu'elle reste irréductible à la marchandise.", q: "Quelle qualité de l'art est valorisée ?", options: ["Sa fonction décorative", "Sa capacité à interroger la norme", "Sa valeur marchande", "Sa beauté pure"], answer: 1 },
    ],
  },

  /* =============================================================
   * Writing tasks (Production écrite) — DELF format per level.
   * Each: { id, title, sub, instruction, en, minWords, tip }
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
   * Speaking tasks (Production orale) — DELF format per level.
   * Each: { id, title, sub, instruction, en, durationSec, tip }
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
