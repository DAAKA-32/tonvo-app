import type { FeatureEntry } from "../types";

export const featuresFr: FeatureEntry[] = [
  // ── 1. Détection du ton en temps réel ────────────────────────────
  {
    type: "features",
    slug: "real-time-tone-detection",
    title: "Détection du ton en conversation | Tonvo",
    metaDescription:
      "Tonvo lit le ton d'une conversation à partir de la transcription en direct et vous donne un aperçu du moment, pour choisir vos mots avec soin.",
    h1: "Percevez le ton d'une conversation au fil de l'échange",
    subtitle:
      "Tonvo suit les mots d'un appel, d'une réunion ou d'un échange et vous donne un aperçu du moment, par exemple si votre interlocuteur semble intéressé, tendu ou hésitant.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "features", slug: "conversation-signal-detection", label: "Détection de signaux" },
    ],
    targetKeywords: [
      "ton d'une conversation",
      "analyse du ton pendant un appel",
      "comment lire l'ambiance d'une conversation",
      "détecteur de ton IA",
      "analyse de sentiment en conversation",
    ],
    faq: [
      {
        question: "Comment Tonvo lit-il le ton ?",
        answer:
          "Tonvo transcrit la conversation en direct et analyse le texte : les mots choisis et la façon de formuler les choses. Il ne mesure ni la hauteur de la voix, ni le débit, ni d'autres caractéristiques sonores. Le résultat est un aperçu du moment, pas un verdict, et il peut se tromper.",
      },
      {
        question: "Pour quels types de conversations ça fonctionne ?",
        answer:
          "Pour toute conversation que Tonvo peut entendre : un appel professionnel, une réunion, un entretien, une négociation ou un échange du quotidien. Il écoute par votre micro, et sur ordinateur il peut aussi capter le son d'un onglet de navigateur que vous partagez, afin d'entendre les deux côtés d'un appel en ligne. Sur téléphone, mettez l'appel sur haut-parleur.",
      },
      {
        question: "Puis-je revoir le ton après la conversation ?",
        answer:
          "Oui. Après une session, votre résumé décrit le ton de la conversation, ce qui s'est bien passé, ce qu'il faut améliorer et les actions de suivi. Le texte de vos sessions est conservé pour que vous puissiez le relire. Free garde 7 jours d'historique, et les formules payantes gardent tout l'historique.",
      },
      {
        question: "La détection du ton fonctionne-t-elle dans d'autres langues ?",
        answer:
          "Tonvo transcrit 10 langues : anglais, français, espagnol, allemand, italien, portugais, néerlandais, chinois, japonais et coréen, et il peut détecter la langue automatiquement. Comme le ton vient de la transcription, une mauvaise transcription, par exemple à cause du bruit de fond, peut donner un aperçu moins fiable.",
      },
    ],
    featureName: "Détection du ton",
    howItWorks: {
      label: "Comment ça marche",
      heading: "Un aperçu du moment, fondé sur les mots",
      body: "Tonvo transcrit la conversation au fur et à mesure, puis un modèle d'IA lit le texte pour comprendre où en est le moment. Il s'appuie sur le choix des mots et la formulation, pas sur le son d'une voix. Vous voyez un court aperçu du moment, à côté de la question qui vient d'être posée et de trois réponses que vous pourriez utiliser. Avec Plus et Team, les insights et signaux en direct ajoutent des détails. C'est vous qui décidez de ce que vous dites.",
    },
    benefits: [
      {
        icon: "heart",
        title: "Repérez un changement d'ambiance",
        description:
          "Voyez quand votre interlocuteur semble hésiter, approuver ou se crisper, pour ralentir, clarifier ou changer de direction.",
      },
      {
        icon: "message",
        title: "Trouvez les mots qui conviennent",
        description:
          "Un court aperçu du moment, à côté de trois réponses prêtes à dire, vous aide à répondre d'une façon qui correspond à l'atmosphère de l'échange.",
      },
      {
        icon: "shield",
        title: "Comprenez mieux dans une langue étrangère",
        description:
          "Quand une conversation se tient dans une langue que vous maîtrisez moins bien, un court aperçu du moment peut vous aider à suivre ce qui se passe.",
      },
    ],
    useCasesForFeature: [
      "Suivre un appel professionnel tendu et choisir vos prochains mots",
      "Avoir une idée de la réaction d'un recruteur ou d'un candidat",
      "Garder une négociation sereine quand l'autre partie hésite",
      "Aborder une conversation difficile du quotidien avec plus d'assurance",
    ],
    technicalDetail: {
      label: "Sous le capot",
      heading: "Basé sur le texte, pas sur la voix",
      body: "Le ton est déduit de la transcription. La transcription est assurée par AssemblyAI et l'analyse par un modèle d'IA d'Anthropic. Comme seul le texte est analysé, Tonvo n'évalue ni la hauteur de la voix, ni le débit, ni les mots de remplissage, et il ne voit pas les expressions du visage. Considérez l'aperçu comme une suggestion, car il peut être faux.",
    },
  },

  // ── 2. Suggestions de réponses ───────────────────────────────────
  {
    type: "features",
    slug: "ai-coaching-suggestions",
    title: "Suggestions de réponses en direct | Tonvo",
    metaDescription:
      "Recevez trois réponses prêtes à dire en direct pendant un appel, une réunion ou un entretien. Tonvo affiche la question posée, et vous choisissez.",
    h1: "Sachez quoi dire ensuite, sur le moment",
    subtitle:
      "Tonvo affiche la question que votre interlocuteur vient de poser et trois réponses que vous pouvez utiliser. Avec Plus et Team, des conseils de coaching apportent plus de guidage.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "features", slug: "real-time-tone-detection", label: "Détection du ton" },
    ],
    targetKeywords: [
      "suggestions de réponses en direct",
      "quoi dire dans une conversation",
      "aide en temps réel pendant une conversation",
      "copilote IA pour conversations",
      "aide pour répondre en entretien d'embauche",
    ],
    faq: [
      {
        question: "Que suggère Tonvo ?",
        answer:
          "Tonvo détecte la question que votre interlocuteur vient de poser et propose trois réponses prêtes à dire. C'est disponible dans toutes les formules. Avec Plus et Team, vous recevez aussi des conseils de coaching et des insights en direct pendant la conversation.",
      },
      {
        question: "L'autre personne verra-t-elle les suggestions ?",
        answer:
          "Seulement si ce que vous partagez inclut Tonvo. Avec Plus et Team, Tonvo peut afficher le copilote dans une fenêtre séparée (Picture-in-Picture sur Chrome pour ordinateur, ou une popup), qui ne fait pas partie d'un onglet ou d'une fenêtre que vous partagez. Avec Free, et sur téléphone, le copilote s'affiche dans la page elle-même. Si vous partagez tout votre écran, les autres peuvent voir tout ce qui s'y trouve.",
      },
      {
        question: "Puis-je adapter les suggestions à ma situation ?",
        answer:
          "Oui. Une session live propose plusieurs modes : général, vente, recrutement, support et networking. Choisissez celui qui se rapproche le plus de votre conversation pour que les suggestions lui correspondent.",
      },
      {
        question: "L'IA se souvient-elle de mes conversations passées ?",
        answer:
          "Non. Tonvo n'a pas de fonction de notes ni de mémoire qui reporte le contexte d'une conversation à la suivante. Le texte de chaque session est conservé pour que vous puissiez le relire, et le résumé de session indique ce qui s'est bien passé et ce qu'il faut améliorer.",
      },
    ],
    featureName: "Suggestions de réponses en direct",
    howItWorks: {
      label: "Comment ça marche",
      heading: "Des suggestions qui suivent la conversation",
      body: "Pendant la conversation, Tonvo la transcrit en direct et un modèle d'IA lit le texte. Quand votre interlocuteur pose une question, Tonvo l'isole et rédige trois réponses que vous pourriez dire. Vous pouvez en utiliser une telle quelle, l'adapter ou l'ignorer. Avec Plus et Team, des conseils de coaching et des insights en direct s'affichent à côté des réponses.",
    },
    benefits: [
      {
        icon: "brain",
        title: "Ne restez plus bloqué sur une question",
        description:
          "Quand une question tombe et que le trou noir s'installe, trois réponses sont déjà à l'écran pour vous lancer.",
      },
      {
        icon: "zap",
        title: "Répondez avec plus de clarté",
        description:
          "Une question difficile ou inattendue se gère mieux quand vous la voyez écrite, avec plusieurs façons d'y répondre.",
      },
      {
        icon: "message",
        title: "Adapté à votre conversation",
        description:
          "Choisissez général, vente, recrutement, support ou networking, pour que les suggestions conviennent à un appel professionnel, un entretien ou un premier échange avec un nouveau contact.",
      },
      {
        icon: "check",
        title: "Vous gardez la main",
        description:
          "Tonvo suggère, vous décidez. Les réponses peuvent être fausses : lisez-les, ajustez-les et dites-les avec vos propres mots.",
      },
    ],
    useCasesForFeature: [
      "Répondre à une question délicate en réunion",
      "Trouver les bons mots pendant un entretien d'embauche",
      "Gérer une objection ou une question sur le prix lors d'un appel commercial",
      "Accompagner un client mécontent, quand vous travaillez au support",
      "Faire vivre la conversation avec quelqu'un que vous venez de rencontrer",
    ],
    technicalDetail: {
      label: "Sous le capot",
      heading: "Ce qui tourne derrière les réponses",
      body: "La transcription vient d'AssemblyAI. Le texte transcrit est envoyé à un modèle d'IA d'Anthropic, qui repère la question et rédige les réponses. Comme l'analyse porte sur le texte, elle suit ce qui est dit, pas la façon dont c'est dit. C'est un outil de suggestion : il peut se tromper, et c'est vous qui parlez.",
    },
  },

  // ── 3. Détection de signaux ──────────────────────────────────────
  {
    type: "features",
    slug: "conversation-signal-detection",
    title: "Signaux : objections et hésitations | Tonvo",
    metaDescription:
      "Avec Plus et Team, Tonvo signale en direct questions, objections, opportunités, hésitations, accords et points clés, pour repérer ce qui compte.",
    h1: "Repérez ce qui compte pendant que la conversation a lieu",
    subtitle:
      "Tonvo marque des moments comme une question, une objection ou une hésitation au fil de l'échange. Les signaux en direct font partie de Plus et Team.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "features", slug: "real-time-tone-detection", label: "Détection du ton" },
    ],
    targetKeywords: [
      "signaux dans une conversation",
      "détecter les objections pendant un appel",
      "repérer l'hésitation dans une conversation",
      "insights de conversation en temps réel",
      "repérer les signaux d'achat",
    ],
    faq: [
      {
        question: "Quels types de signaux Tonvo affiche-t-il ?",
        answer:
          "Tonvo affiche six types de signaux : question, objection, opportunité, hésitation, accord et point clé. Les signaux en direct sont disponibles avec Plus et Team.",
      },
      {
        question: "En quoi un signal diffère-t-il du ton ?",
        answer:
          "Le ton est un aperçu de l'ambiance générale du moment. Un signal marque un instant précis, par exemple quelqu'un qui dit ne pas être sûr du calendrier, ou qui approuve une proposition. Les deux reposent sur le texte transcrit.",
      },
      {
        question: "Puis-je choisir les signaux affichés ou régler des alertes ?",
        answer:
          "Non. Tonvo n'a ni réglages d'alertes ni seuils. Les signaux apparaissent dans la vue en direct au fil de la conversation, et c'est vous qui décidez lesquels méritent une action.",
      },
      {
        question: "Que reçois-je après la session ?",
        answer:
          "Dans toutes les formules, vous recevez un résumé avec le ton de la conversation, ce qui s'est bien passé, ce qu'il faut améliorer et les actions de suivi. Le texte de la session est conservé pour que vous puissiez le relire.",
      },
    ],
    featureName: "Signaux de conversation",
    howItWorks: {
      label: "Comment ça marche",
      heading: "Des moments repérés dans la transcription",
      body: "Tonvo transcrit la conversation en direct et un modèle d'IA lit le texte à la recherche de moments qui méritent votre attention. Quelqu'un qui doute du calendrier, demande comment quelque chose fonctionnerait ou dit être d'accord : chacun est un type de moment différent. Chacun s'affiche comme un signal dans la vue en direct, pour que vous le remarquiez alors que vous pouvez encore réagir. Les signaux viennent des mots, pas des caractéristiques de la voix.",
    },
    benefits: [
      {
        icon: "target",
        title: "Réagissez quand c'est encore utile",
        description:
          "Un signal vous aide à repérer une objection ou un moment d'hésitation pendant que vous pouvez encore y répondre, au lieu de le réaliser une fois la conversation terminée.",
      },
      {
        icon: "search",
        title: "Captez ce qui échappe facilement",
        description:
          "Quand vous êtes occupé à parler, les moments discrets passent inaperçus : un doute furtif, une pointe d'intérêt, un point à reprendre. Les signaux vous aident à les remarquer.",
      },
      {
        icon: "users",
        title: "Utile bien au-delà de la vente",
        description:
          "Les signaux servent aussi pour les entretiens, les négociations, les appels de support et les échanges du quotidien, car ils viennent de ce que les gens disent.",
      },
    ],
    useCasesForFeature: [
      "Repérer une hésitation en négociation et choisir quand clarifier",
      "Remarquer une objection dès le début d'un appel commercial",
      "Saisir un point d'accord pendant un entretien",
      "Isoler le point clé d'une longue réunion",
      "Reconnaître une ouverture pour passer à l'étape suivante",
    ],
    technicalDetail: {
      label: "Sous le capot",
      heading: "Comment les signaux sont produits",
      body: "Les signaux sont produits à partir du texte transcrit par un modèle d'IA d'Anthropic, tandis qu'AssemblyAI assure la transcription. Tonvo n'analyse pas la voix elle-même : un signal reflète des mots, pas un ton de voix. Les signaux sont des suggestions qui peuvent être fausses : servez-vous-en comme d'une invitation à écouter de près, pas comme d'une conclusion.",
    },
  },

  // ── 4. Analyse après la session ──────────────────────────────────
  {
    type: "features",
    slug: "post-session-analysis",
    title: "Résumé de session : revoir une conversation | Tonvo",
    metaDescription:
      "Après une session, Tonvo vous remet un résumé : le ton, ce qui s'est bien passé, ce qu'il faut améliorer et les actions de suivi. À relire à volonté.",
    h1: "Revenez sur une conversation grâce à un résumé clair",
    subtitle:
      "À la fin d'une session, Tonvo résume le déroulé et liste les actions de suivi, pour vous rappeler ce qui a été dit et ce qu'il reste à faire.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "features", slug: "speaker-balance-tracking", label: "Équilibre de parole" },
    ],
    targetKeywords: [
      "résumé de conversation",
      "compte rendu d'appel après l'appel",
      "comment faire le bilan d'une conversation",
      "résumé de réunion par IA",
      "actions de suivi après un appel",
    ],
    faq: [
      {
        question: "Que contient le résumé de session ?",
        answer:
          "Le résumé couvre le ton de la conversation, ce qui s'est bien passé, ce qu'il faut améliorer et les actions de suivi. Il est inclus dans toutes les formules.",
      },
      {
        question: "Tonvo stocke-t-il des enregistrements ?",
        answer:
          "Non. Tonvo n'enregistre ni ne stocke l'audio. Le texte de vos sessions est conservé pour que vous puissiez le relire.",
      },
      {
        question: "Combien de temps mon historique est-il conservé ?",
        answer:
          "Free garde 7 jours d'historique de sessions. Plus et Team gardent tout l'historique et incluent aussi des analyses de progression.",
      },
      {
        question: "Puis-je exporter ou partager un résumé ?",
        answer:
          "Pas pour le moment. Tonvo n'a ni export PDF ou CSV, ni liens de partage, ni tableau de bord d'équipe. Vous pouvez rouvrir une session depuis votre historique et y lire le résumé.",
      },
    ],
    featureName: "Résumé de session",
    howItWorks: {
      label: "Comment ça marche",
      heading: "De la conversation en direct au résumé",
      body: "Pendant que vous parlez, Tonvo transcrit la conversation. À la fin de la session, un modèle d'IA lit la transcription et rédige un résumé : le ton général, ce qui s'est bien passé, ce qu'il faut améliorer et les actions de suivi. Le texte de la session est conservé pour que vous puissiez la rouvrir depuis votre historique. Les résumés sont générés à partir du texte : ils peuvent passer à côté de certains éléments, surtout si la transcription était peu claire.",
    },
    benefits: [
      {
        icon: "clock",
        title: "Moins de notes pendant l'échange",
        description:
          "Concentrez-vous sur la personne en face de vous au lieu d'écrire, puis lisez le résumé ensuite.",
      },
      {
        icon: "layers",
        title: "Gardez le fil de vos conversations passées",
        description:
          "Vos sessions restent dans votre historique, 7 jours avec Free et tout l'historique avec Plus et Team, pour revenir sur ce qui a été dit.",
      },
      {
        icon: "trending-up",
        title: "Suivez votre propre progression",
        description:
          "Plus et Team incluent des analyses de progression, pour voir comment évoluent vos conversations au fil du temps.",
      },
    ],
    useCasesForFeature: [
      "Rédiger un message de suivi après un appel professionnel, avec les actions sous les yeux",
      "Faire le bilan d'un entretien d'embauche",
      "Revenir sur une négociation pour voir ce qu'il faut améliorer",
      "Relire une conversation tenue dans une autre langue",
    ],
    technicalDetail: {
      label: "Bon à savoir",
      heading: "Ce qui est conservé et ce qui ne l'est pas",
      body: "Tonvo n'enregistre ni ne stocke l'audio. Il conserve le texte de vos sessions et le résumé pour que vous puissiez les relire. La transcription vient d'AssemblyAI et le résumé est rédigé par un modèle d'IA d'Anthropic. Le résumé est une aide, pas une retranscription fidèle, et il peut contenir des erreurs. Il vous revient d'informer les personnes avec qui vous parlez et de respecter les règles qui s'appliquent.",
    },
  },

  // ── 5. Analyse d'écran ───────────────────────────────────────────
  {
    type: "features",
    slug: "screen-analysis",
    title: "Analyse d'écran : chats, DM et e-mails | Tonvo",
    metaDescription:
      "Avec Team, Tonvo lit le chat, le DM ou l'e-mail partagé à l'écran et vous aide à répondre. Avec toute formule, collez le texte ou importez des captures.",
    h1: "Obtenez de l'aide pour répondre à un chat, un DM ou un e-mail à l'écran",
    subtitle:
      "Partagez une conversation écrite à l'écran et Tonvo la lit, pour que vous répondiez avec des mots plus clairs. L'analyse d'écran fait partie de la formule Team.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "features", slug: "ai-coaching-suggestions", label: "Coaching IA" },
    ],
    targetKeywords: [
      "aide IA pour répondre à des messages",
      "comment répondre à un e-mail difficile",
      "aide pour répondre à un DM",
      "analyse d'écran IA",
      "IA pour répondre à un chat",
    ],
    faq: [
      {
        question: "Que peut lire Tonvo sur mon écran ?",
        answer:
          "Les conversations écrites que vous partagez à l'écran, comme des chats, des DM et des e-mails. L'analyse d'écran fait partie de la formule Team.",
      },
      {
        question: "Puis-je être aidé pour une conversation écrite avec une autre formule ?",
        answer:
          "Oui. Avec toutes les formules, vous pouvez coller le texte d'une conversation ou importer des captures d'écran, et Tonvo vous aide à répondre. L'analyse d'écran de ce que vous partagez est réservée à Team, à $49 par utilisateur et par mois.",
      },
      {
        question: "Tonvo rédige-t-il et envoie-t-il des messages à ma place ?",
        answer:
          "Non. Tonvo suggère une formulation et vous décidez. Vous la lisez, la modifiez et l'envoyez vous-même. Les suggestions peuvent être fausses.",
      },
      {
        question: "Dois-je prévenir les personnes de la conversation ?",
        answer:
          "Les messages contiennent les mots d'autres personnes, et les règles varient selon le pays et le contexte, par exemple au travail. Il vous revient de respecter celles qui s'appliquent à vous, et Tonvo recommande de prévenir les personnes avec qui vous échangez.",
      },
    ],
    featureName: "Analyse d'écran",
    howItWorks: {
      label: "Comment ça marche",
      heading: "Lire une conversation écrite à l'écran",
      body: "Avec l'analyse d'écran, vous partagez avec Tonvo un écran qui affiche une conversation écrite, comme un fil de chat, un DM ou un e-mail. Tonvo lit ce qui s'y trouve et vous aide à comprendre le message et à trouver des mots pour répondre. Vous décidez de ce que vous écrivez et vous l'envoyez vous-même. Si vous n'avez pas la formule Team, vous pouvez coller le texte ou importer des captures d'écran pour obtenir une aide à la réponse.",
    },
    benefits: [
      {
        icon: "eye",
        title: "Des réponses adaptées au message",
        description:
          "Tonvo part du texte réel affiché à l'écran, donc les suggestions répondent à ce qui a été écrit plutôt qu'à une situation générique.",
      },
      {
        icon: "message",
        title: "De l'aide pour les messages délicats",
        description:
          "Quand vous hésitez sur la façon de répondre à un e-mail tendu ou à un DM gênant, vous obtenez une formulation pour démarrer.",
      },
      {
        icon: "zap",
        title: "Moins de copier-coller",
        description:
          "Avec Team, partagez l'écran au lieu de copier le texte dans l'app à chaque fois.",
      },
    ],
    useCasesForFeature: [
      "Répondre à un e-mail difficile d'un client ou d'un manager",
      "Répondre à un DM d'un recruteur ou d'un nouveau contact",
      "Gérer un chat client quand vous travaillez au support",
      "Trouver le bon ton dans un message écrit dans une autre langue",
    ],
  },

  // ── 6. Équilibre de parole ───────────────────────────────────────
  {
    type: "features",
    slug: "speaker-balance-tracking",
    title: "Équilibre de parole : qui parle | Tonvo",
    metaDescription:
      "Avec Plus et Team, Tonvo montre qui parle et comment se partage la parole, pour mieux écouter et laisser de la place aux autres.",
    h1: "Voyez comment la parole se partage dans une conversation",
    subtitle:
      "Tonvo montre qui parle au fil de la conversation, pour que vous remarquiez quand vous parlez trop ou quand quelqu'un n'a pas pu s'exprimer.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "features", slug: "post-session-analysis", label: "Analyse après session" },
    ],
    targetKeywords: [
      "temps de parole dans une conversation",
      "qui parle dans une réunion",
      "outil d'équilibre de la parole",
      "comment mieux écouter dans une conversation",
      "répartition du temps de parole en réunion",
    ],
    faq: [
      {
        question: "Comment Tonvo sait-il qui parle ?",
        answer:
          "Tonvo sépare les voix qu'il entend et indique qui parle dans la vue en direct. Cela fonctionne mieux quand les voix arrivent clairement : utilisez un bon micro ou partagez l'onglet d'un appel en ligne pour que les deux côtés soient entendus. Il peut se tromper, surtout quand les gens se coupent la parole.",
      },
      {
        question: "Quelles formules incluent l'équilibre de parole ?",
        answer:
          "L'équilibre de parole fait partie de Plus et Team. Les sessions Free affichent la question détectée, trois réponses et un résumé de session.",
      },
      {
        question: "Ça fonctionne dans les conversations de groupe ?",
        answer:
          "Tonvo peut montrer qui parle dans un groupe, mais la précision dépend de l'audio. Quand plusieurs voix passent par un seul micro, les étiquettes peuvent être moins fiables.",
      },
      {
        question: "Tonvo m'indique-t-il l'équilibre idéal ?",
        answer:
          "Non. Tonvo montre l'équilibre et vous laisse en juger. Le bon équilibre dépend de la conversation : un entretien où vous écoutez n'est pas une présentation que vous donnez.",
      },
    ],
    featureName: "Équilibre de parole",
    howItWorks: {
      label: "Comment ça marche",
      heading: "Qui parle, en direct",
      body: "Pendant que la conversation est transcrite, Tonvo repère aussi qui parle. À partir de là, la vue en direct montre comment la parole se partage entre les personnes. Un coup d'œil suffit pour remarquer que vous parlez depuis longtemps, ou que quelqu'un est resté silencieux. C'est une information, pas une règle, et c'est à vous de décider quoi en faire.",
    },
    benefits: [
      {
        icon: "users",
        title: "Laissez de la place aux autres",
        description:
          "Voir qui a parlé vous aide à remarquer une personne silencieuse et à l'inviter à s'exprimer, que vous meniez une réunion ou un appel en famille.",
      },
      {
        icon: "bar-chart",
        title: "Découvrez vos propres habitudes",
        description:
          "Un coup d'œil à qui a parlé vous aide à voir si vous avez tendance à prendre la plus grande part de l'espace dans une conversation.",
      },
      {
        icon: "mic",
        title: "Un rappel pour écouter",
        description:
          "Voir l'équilibre bouger peut vous rappeler de faire une pause, de poser une question et de laisser l'autre finir.",
      },
    ],
    useCasesForFeature: [
      "Suivre un appel de découverte pour s'assurer que l'autre personne peut s'exprimer",
      "Animer une réunion où chacun doit contribuer",
      "Vérifier qu'un entretien laisse assez de place au candidat",
      "Remarquer que vous parlez trop dans une conversation difficile",
    ],
  },

  // ── 7. Multilingue ───────────────────────────────────────────────
  {
    type: "features",
    slug: "multi-language-support",
    title: "Aide en direct dans 10 langues | Tonvo",
    metaDescription:
      "Tonvo suit vos conversations en direct en anglais, français, espagnol, allemand, italien, portugais, néerlandais, chinois, japonais et coréen.",
    h1: "Suivez une conversation en 10 langues",
    subtitle:
      "Tonvo transcrit en direct dans 10 langues et peut détecter la langue pour vous : un appel, une réunion ou un échange n'a pas besoin d'être en anglais.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "features", slug: "real-time-tone-detection", label: "Détection du ton" },
    ],
    targetKeywords: [
      "assistant de conversation multilingue",
      "transcription en direct en 10 langues",
      "aide IA pour appels dans une autre langue",
      "traduction en direct pendant un appel",
      "copilote de conversation en français",
    ],
    faq: [
      {
        question: "Quelles langues Tonvo prend-il en charge ?",
        answer:
          "Tonvo transcrit l'anglais, le français, l'espagnol, l'allemand, l'italien, le portugais, le néerlandais, le chinois, le japonais et le coréen. La langue peut être détectée automatiquement.",
      },
      {
        question: "Tonvo peut-il traduire une conversation en direct ?",
        answer:
          "Oui, la traduction en direct est disponible avec Plus et Team. Avec la formule Free, vous avez la transcription en direct, la question détectée et trois réponses.",
      },
      {
        question: "Et si une conversation mélange plusieurs langues ?",
        answer:
          "Tonvo peut détecter la langue automatiquement, mais une conversation qui passe d'une langue à l'autre est plus difficile à transcrire : la transcription et les suggestions peuvent donc être moins précises.",
      },
      {
        question: "Quelle est la précision dans les langues autres que l'anglais ?",
        answer:
          "La précision dépend de la qualité audio, des accents et du bruit de fond, et elle peut varier d'une langue à l'autre. Comme l'analyse porte sur la transcription, une transcription claire donne de meilleures suggestions. Tonvo peut se tromper : c'est vous qui décidez de ce que vous dites.",
      },
    ],
    featureName: "Multilingue",
    howItWorks: {
      label: "Comment ça marche",
      heading: "D'abord la transcription, ensuite l'analyse",
      body: "Tonvo écoute par votre micro et, sur ordinateur, peut aussi capter un onglet de navigateur que vous partagez. Il transcrit la parole en direct dans l'une des 10 langues, et la langue peut être détectée automatiquement. Un modèle d'IA s'appuie ensuite sur ce texte pour repérer la question et suggérer des réponses. Avec Plus et Team, vous pouvez aussi utiliser la traduction en direct pour suivre ce qui se dit.",
    },
    benefits: [
      {
        icon: "globe",
        title: "Utilisez-le dans votre langue",
        description:
          "Les conversations en français, en espagnol, en japonais ou dans l'une des autres langues prises en charge bénéficient de la même transcription en direct et du même type d'aide.",
      },
      {
        icon: "users",
        title: "Parlez dans une langue que vous maîtrisez moins bien",
        description:
          "Avec la traduction en direct de Plus et Team, vous pouvez suivre ce qui se dit pendant que vous préparez votre réponse.",
      },
      {
        icon: "layers",
        title: "Un seul copilote pour de nombreuses conversations",
        description:
          "Utilisez le même outil pour un appel avec un client à l'étranger, une réunion dans une langue seconde ou une discussion avec un ami.",
      },
    ],
    useCasesForFeature: [
      "Prendre un appel avec un client ou un fournisseur d'un autre pays",
      "Suivre une réunion tenue dans votre deuxième langue",
      "Répondre à des questions d'entretien dans une langue que vous apprenez encore",
      "Suivre une conversation en famille ou entre amis dans une langue que vous pratiquez",
    ],
  },

  // ── 8. Copilote en fenêtre séparée (slug conservé pour garder les liens et le classement) ──
  {
    type: "features",
    slug: "separate-window-copilot",
    title: "Copilote dans une fenêtre séparée | Tonvo",
    metaDescription:
      "Avec Plus et Team, Tonvo s'ouvre dans sa propre fenêtre : un onglet ou une fenêtre partagé ne montre que votre appel. Ce qui change avec Free.",
    h1: "Un copilote dans sa propre fenêtre",
    subtitle:
      "Avec Plus et Team, Tonvo s'ouvre dans une fenêtre séparée à côté de votre appel. Quand vous partagez un onglet ou une fenêtre, les participants voient ce que vous partagez, et pas Tonvo.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "features", slug: "ai-coaching-suggestions", label: "Coaching IA" },
    ],
    targetKeywords: [
      "copilote en fenêtre séparée",
      "fenêtre copilote pour conversation",
      "partage d'écran et assistant IA",
      "copilote picture in picture",
    ],
    faq: [
      {
        question: "Comment fonctionne la fenêtre séparée ?",
        answer:
          "Avec Plus et Team, sur Chrome pour ordinateur, Tonvo ouvre son copilote dans une fenêtre Picture-in-Picture. C'est une fenêtre différente de l'onglet ou de la fenêtre que vous partagez, donc un onglet ou une fenêtre partagé ne l'inclut pas. Là où ce type de fenêtre n'est pas disponible, Tonvo ouvre une petite popup à la place. Avec la formule Free et sur téléphone, le copilote s'affiche dans la page elle-même.",
      },
      {
        question: "Et si je partage tout mon écran ?",
        answer:
          "Alors tout ce qui est sur votre écran peut être vu par les autres, y compris la fenêtre Tonvo. Pour la garder hors de vue, partagez un seul onglet ou une seule fenêtre plutôt que tout votre écran.",
      },
      {
        question: "Tonvo se cache-t-il des enregistrements ?",
        answer:
          "Non. Tonvo ne change pas la façon dont votre outil de visioconférence partage ou enregistre. Ce qui est capturé dépend de ce que vous choisissez de partager : vérifiez-le avant de commencer.",
      },
      {
        question: "Dois-je dire à l'autre personne que j'utilise Tonvo ?",
        answer:
          "Oui. De nombreux endroits exigent d'informer les personnes avec qui vous parlez, ou d'obtenir leur consentement, avant qu'une conversation soit analysée. Les règles varient selon le pays et le contexte, et il vous revient de respecter celles qui s'appliquent à vous.",
      },
    ],
    featureName: "Copilote en fenêtre séparée",
    howItWorks: {
      label: "Comment ça marche",
      heading: "Une fenêtre à part",
      body: "Avec Plus et Team, Tonvo affiche les réponses et les insights dans une fenêtre séparée : une fenêtre Picture-in-Picture sur Chrome pour ordinateur, ou une petite popup ailleurs. Comme cette fenêtre ne fait pas partie de l'onglet ou de la fenêtre que vous partagez, un onglet ou une fenêtre partagé ne montre que votre appel ou votre contenu. Avec la formule Free et sur téléphone, Tonvo affiche le copilote dans la page elle-même.",
    },
    benefits: [
      {
        icon: "shield",
        title: "Reste hors d'un onglet ou d'une fenêtre partagé",
        description:
          "Partagez un onglet ou une fenêtre et le copilote reste de votre côté de l'écran.",
      },
      {
        icon: "monitor",
        title: "Présentez tout en lisant",
        description:
          "Partagez une présentation ou une démo et gardez les réponses sous les yeux, juste à côté.",
      },
      {
        icon: "check",
        title: "Vous gardez la main",
        description:
          "Tonvo suggère, vous décidez de ce que vous dites, et vous pouvez fermer la fenêtre à tout moment.",
      },
    ],
    useCasesForFeature: [
      "Partager un diaporama tout en suivant un appel",
      "Garder les réponses sous les yeux pendant une visioconférence",
      "Suivre une conversation dans une autre langue avec le copilote à côté",
    ],
    technicalDetail: {
      label: "Bon à savoir",
      heading: "Ce qui est partagé et ce qui ne l'est pas",
      body: "La fenêtre du copilote est séparée de la surface que vous partagez, mais ce n'est pas un moyen de cacher Tonvo. Si vous partagez tout votre écran, les autres peuvent la voir. Tonvo ne change pas non plus ce que votre outil de visioconférence enregistre. Avec la formule Free, les réponses s'affichent dans la page elle-même : gardez cette page hors de ce que vous partagez.",
    },
  },
];
