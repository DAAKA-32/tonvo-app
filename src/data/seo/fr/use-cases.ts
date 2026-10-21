import type { UseCaseEntry } from "../types";

export const useCasesFr: UseCaseEntry[] = [
  // ─── 1. Appels de vente ───
  {
    type: "use-cases",
    slug: "ai-copilot-for-sales-calls",
    title: "Appels de vente : des réponses en direct | Tonvo",
    metaDescription:
      "Tonvo suit votre appel de vente et affiche la question du client avec trois réponses prêtes à dire. Micro ou onglet partagé. Offre Free disponible.",
    h1: "Un copilote pour vos appels de vente",
    subtitle:
      "En plein appel, un client pose une question et il vous faut les bons mots. Tonvo affiche la question qui vient d'être posée et trois réponses que vous pouvez dire. C'est vous qui décidez de ce que vous utilisez.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "use-cases", slug: "sdr-onboarding-with-call-review", label: "Premiers appels pour nouveaux SDR" },
      { type: "industries", slug: "saas-sales-teams", label: "Équipes commerciales SaaS" },
    ],
    targetKeywords: [
      "assistant appel commercial",
      "que dire pendant un appel de vente",
      "répondre aux objections en direct",
      "aide en direct appel commercial",
      "copilote IA appels de vente",
      "réponses appel de vente",
    ],
    faq: [
      {
        question: "Comment Tonvo m'aide-t-il pendant un appel de vente en direct ?",
        answer:
          "Tonvo suit la conversation au fur et à mesure. Il affiche la question que votre interlocuteur vient de poser, vous donne trois réponses prêtes à dire et ajoute une courte lecture du moment. Il suggère, vous décidez. Il peut se tromper, fiez-vous donc à votre propre jugement.",
      },
      {
        question: "Mon interlocuteur sait-il que Tonvo est lancé ?",
        answer:
          "Tonvo ne rejoint pas l'appel comme un robot et n'ajoute rien à l'appel. Il écoute par votre micro ou par l'audio d'un onglet de navigateur que vous partagez. C'est à vous d'informer les personnes avec qui vous parlez et de respecter les règles applicables, comme le consentement et l'enregistrement. Tonvo recommande de les prévenir.",
      },
      {
        question: "Tonvo fonctionne-t-il avec Zoom, Meet ou mon CRM ?",
        answer:
          "Tonvo n'a pas d'intégration avec ces outils. C'est une application web qui capte l'audio de votre micro ou d'un onglet de navigateur partagé, elle peut donc tourner à côté de l'outil d'appel que vous utilisez. Sur téléphone, elle écoute uniquement par le micro : mettez l'appel en haut-parleur.",
      },
      {
        question: "Puis-je revoir un appel de vente une fois terminé ?",
        answer:
          "Oui. Après chaque session, vous obtenez un résumé avec le ton, ce qui a bien fonctionné, ce qui peut être amélioré et les actions de suivi. Tonvo n'enregistre ni ne stocke l'audio, mais le texte de vos sessions est conservé pour que vous puissiez le relire : 7 jours d'historique avec Free et l'historique complet avec les offres payantes.",
      },
    ],
    problem: {
      label: "Le problème",
      heading: "Les questions difficiles arrivent plus vite que votre réflexion",
      body: "Pendant un appel, vous écoutez, vous gardez le contact, vous encaissez une question et vous préparez la suite, tout en même temps. Une question sur le prix, ou un poli « on va y réfléchir », peut vous laisser sans mots, et quand vous les trouvez, le moment est passé.",
    },
    solution: {
      label: "La solution",
      heading: "Tonvo vous montre la question et trois façons d'y répondre",
      body: "Tonvo suit l'appel au fur et à mesure, par votre micro ou par l'audio d'un onglet de navigateur que vous partagez, afin d'entendre les deux côtés d'un appel en ligne. Il affiche la question que votre interlocuteur vient de poser, trois réponses que vous pouvez dire et une courte lecture du moment. Le mode vente est pensé pour ce type de conversation. Après la session, un résumé liste le ton, ce qui a bien fonctionné, ce qui peut être amélioré et les actions de suivi.",
    },
    features: [
      {
        icon: "zap",
        title: "Trois réponses prêtes à dire",
        description:
          "À chaque question, Tonvo rédige trois réponses adaptées à ce qui vient d'être dit, pour qu'une question de prix ou de calendrier ne vous laisse pas bloqué.",
      },
      {
        icon: "eye",
        title: "Signaux avec les offres payantes",
        description:
          "Plus et Team affichent des signaux au fil de l'appel : question, objection, opportunité, hésitation, accord et point clé.",
      },
      {
        icon: "target",
        title: "Mode vente",
        description:
          "Choisissez le mode vente dans une session en direct pour que les réponses collent à une conversation avec un client. Les modes général, recrutement, support et networking couvrent les autres types d'échanges.",
      },
      {
        icon: "bar-chart",
        title: "Résumé après l'appel",
        description:
          "Un résumé de session avec le ton, ce qui a bien fonctionné, ce qui peut être amélioré et les actions de suivi, pour reprendre là où l'appel s'est arrêté.",
      },
    ],
    stats: [],
  },

  // ─── 2. Support client ───
  {
    type: "use-cases",
    slug: "customer-support-tone-detection",
    title: "Support client : des réponses calmes et claires | Tonvo",
    metaDescription:
      "Tonvo suit vos appels et chats de support, affiche la question du client et propose trois réponses. Micro ou onglet partagé. Offre Free disponible.",
    h1: "Gardez votre calme et soyez clair dans les échanges de support difficiles",
    subtitle:
      "Quand un client est énervé ou perdu, trouver les bons mots n'est pas simple. Tonvo suit la conversation, affiche ce qui vient d'être demandé et propose trois réponses à adapter, en appel comme dans un chat écrit.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "use-cases", slug: "remote-meeting-communication", label: "Réunions à distance en langue étrangère" },
    ],
    targetKeywords: [
      "assistant appel support client",
      "que dire à un client énervé",
      "désamorcer un client mécontent",
      "aide IA pour agents de support",
      "répondre à un client mécontent",
      "copilote conversation support client",
    ],
    faq: [
      {
        question: "Comment Tonvo repère-t-il qu'un client est frustré ?",
        answer:
          "Tonvo travaille sur le texte transcrit de la conversation, pas sur le son de la voix. Toutes les offres donnent une courte lecture du moment, et Plus et Team ajoutent des signaux comme l'hésitation, l'objection et l'accord. Il peut se tromper : voyez-y un indice, pas un verdict.",
      },
      {
        question: "Les managers peuvent-ils suivre la frustration des clients dans l'équipe ?",
        answer:
          "Non. Tonvo n'a pas de tableau de bord pour managers ni pour équipes. Chacun voit ses propres sessions. L'offre Team est facturée par utilisateur et ajoute l'analyse d'écran de ce que vous partagez à l'écran.",
      },
      {
        question: "Tonvo fonctionne-t-il avec ma plateforme de support ?",
        answer:
          "Tonvo ne s'intègre ni aux plateformes de support, ni à Zoom, Meet, Teams, Discord, ni aux outils de CRM. C'est une application web qui écoute par votre micro ou par un onglet de navigateur que vous partagez. C'est à vous d'informer le client et de respecter les règles de votre entreprise, et Tonvo recommande de le prévenir.",
      },
      {
        question: "Tonvo fonctionne-t-il pour les chats écrits comme pour les appels ?",
        answer:
          "Oui. Avec toutes les offres, vous pouvez coller du texte ou importer des captures d'écran d'une conversation écrite et être aidé pour répondre. Pour les appels, Tonvo écoute par votre micro ou un onglet partagé, et sur téléphone il faut mettre l'appel en haut-parleur.",
      },
    ],
    problem: {
      label: "Le problème",
      heading: "Un client énervé rend les bons mots plus difficiles à trouver",
      body: "Quand un client est frustré, on attend quand même de vous que vous l'écoutiez, restiez calme et répondiez clairement, souvent en cherchant la réponse ailleurs en même temps. Une question difficile ou un message agressif peut vous faire hésiter, et une réponse hésitante a tendance à ajouter de la tension.",
    },
    solution: {
      label: "La solution",
      heading: "Trois réponses et une courte lecture du moment",
      body: "Tonvo suit la conversation au fur et à mesure et affiche la question ou la plainte que le client vient d'exprimer, trois réponses que vous pouvez dire et une courte lecture du moment. Le mode support est pensé pour ce type d'échange. L'analyse porte sur les mots transcrits : elle regarde donc le ton et les signaux dans ce qui est dit. Avec l'offre Team, l'analyse d'écran regarde aussi les chats, messages privés et e-mails que vous partagez à l'écran.",
    },
    features: [
      {
        icon: "heart",
        title: "Une courte lecture du moment",
        description:
          "Un aperçu rapide de la façon dont la conversation se déroule, basé sur les mots transcrits, pour ajuster votre approche en cours de route.",
      },
      {
        icon: "message",
        title: "Trois réponses à adapter",
        description:
          "Des réponses prêtes à dire, écrites pour ce que le client vient de dire. Reformulez-les avec vos mots et respectez les règles de votre entreprise.",
      },
      {
        icon: "bar-chart",
        title: "Résumé après la session",
        description:
          "Après chaque session, un résumé avec le ton de la conversation, ce qui a bien fonctionné, ce qui peut être amélioré et les actions de suivi.",
      },
      {
        icon: "monitor",
        title: "Analyse d'écran avec Team",
        description:
          "Partagez un chat, un message privé ou un e-mail à l'écran et Tonvo l'analyse pour vous aider à répondre. L'analyse d'écran est disponible uniquement avec l'offre Team.",
      },
    ],
    stats: [],
  },

  // ─── 3. Entretiens d'embauche ───
  {
    type: "use-cases",
    slug: "ai-coaching-for-job-interviews",
    title: "Entretien d'embauche : la question et des idées | Tonvo",
    metaDescription:
      "En entretien, Tonvo affiche la question posée et trois réponses prêtes à dire, avec une courte lecture du moment. Micro ou onglet partagé. Offre Free.",
    h1: "Trouvez les bons mots en entretien d'embauche",
    subtitle:
      "Une question vous prend de court et c'est le trou noir. Tonvo affiche la question qui vient d'être posée et trois réponses que vous pouvez dire, et la réponse finale reste la vôtre.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "use-cases", slug: "freelancer-client-call-assistant", label: "Assistant d'appels clients pour freelances" },
      { type: "features", slug: "post-session-analysis", label: "Analyse après session" },
    ],
    targetKeywords: [
      "aide pendant un entretien d'embauche",
      "que dire en entretien d'embauche",
      "assistant IA entretien d'embauche",
      "réponses en direct entretien",
      "aide entretien en visio",
      "comment répondre aux questions d'entretien",
    ],
    faq: [
      {
        question: "Puis-je utiliser Tonvo pendant un vrai entretien ?",
        answer:
          "Tonvo peut écouter par votre micro ou par un onglet de navigateur partagé pendant un entretien en ligne. Il ne rejoint pas l'appel. À vous de voir si vous avez le droit de l'utiliser : vérifiez d'abord les règles de l'employeur. Tonvo recommande de prévenir les personnes avec qui vous parlez.",
      },
      {
        question: "Que m'affiche Tonvo pendant un entretien ?",
        answer:
          "Il affiche la question qui vient d'être posée, trois réponses prêtes à dire et une courte lecture du moment. Plus et Team ajoutent aussi des conseils de coaching et des signaux. Tonvo suggère, vous décidez, et il peut se tromper.",
      },
      {
        question: "Existe-t-il une offre gratuite pour essayer avant un entretien ?",
        answer:
          "Oui. Free comprend 3 sessions en direct par mois de 5 minutes maximum chacune, de quoi essayer Tonvo dans une courte conversation d'entraînement avec un ami. Plus coûte $19 par mois et supprime la limite de sessions.",
      },
      {
        question: "Que me reste-t-il après l'entretien ?",
        answer:
          "Un résumé de session avec le ton, ce qui a bien fonctionné, ce qui peut être amélioré et les actions de suivi. Tonvo n'enregistre ni ne stocke l'audio, mais le texte de la session est conservé pour que vous puissiez le relire : 7 jours avec Free et l'historique complet avec les offres payantes.",
      },
    ],
    problem: {
      label: "Le problème",
      heading: "Le stress rend les bonnes réponses difficiles à trouver",
      body: "En entretien, une question inattendue peut vider votre tête. Vous écoutez, vous réfléchissez et vous essayez de paraître calme, tout à la fois, et il est facile de tomber dans un long silence ou une réponse qui part dans tous les sens, même quand vous connaissez bien votre parcours.",
    },
    solution: {
      label: "La solution",
      heading: "Voyez la question, puis choisissez vos mots",
      body: "Tonvo suit la conversation au fur et à mesure et affiche la question que le recruteur vient de poser, trois réponses que vous pouvez dire et une courte lecture du moment. Pour un entretien en ligne, partagez l'onglet du navigateur afin qu'il entende les deux côtés, ou laissez-le écouter par votre micro. Le mode recrutement est disponible dans une session en direct pour ce type de conversation. Adaptez chaque réponse à votre propre expérience.",
    },
    features: [
      {
        icon: "mic",
        title: "La question repérée",
        description:
          "Tonvo repère la question qui vient d'être posée, pour que vous puissiez consacrer votre attention à y répondre.",
      },
      {
        icon: "message",
        title: "Suggestions de réponses en direct",
        description:
          "Des réponses prêtes à dire, écrites pour ce qui vient d'être dit, pour ne jamais manquer d'une façon de commencer.",
      },
      {
        icon: "bar-chart",
        title: "Résumé et historique",
        description:
          "Après la session, un résumé avec le ton, ce qui a bien fonctionné, ce qui peut être amélioré et les actions de suivi. Free conserve 7 jours d'historique, les offres payantes conservent l'historique complet et l'analyse de progression.",
      },
    ],
    stats: [],
  },

  // ─── 4. Réunions de travail ───
  {
    type: "use-cases",
    slug: "team-meeting-engagement-tracking",
    title: "Réunions : suivez chaque question, répondez serein | Tonvo",
    metaDescription:
      "Tonvo suit une réunion de travail par votre micro ou un onglet partagé, affiche la question posée et suggère trois réponses. Offre Free disponible.",
    h1: "Suivez chaque question dans une réunion chargée",
    subtitle:
      "Dans une longue réunion, on perd facilement le fil, et c'est pire quand quelqu'un vous interpelle. Tonvo suit la discussion et affiche ce qui vient d'être demandé, avec trois réponses que vous pouvez utiliser.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "use-cases", slug: "remote-meeting-communication", label: "Réunions à distance en langue étrangère" },
    ],
    targetKeywords: [
      "assistant IA de réunion",
      "que dire en réunion",
      "répondre aux questions en réunion",
      "copilote de réunion en direct",
      "aide quand on est interpellé en réunion",
      "assistant réunion en ligne",
    ],
    faq: [
      {
        question: "Tout le monde dans la réunion doit-il avoir Tonvo ?",
        answer:
          "Non, vous seul. Tonvo est une application web qui écoute par votre micro ou par l'audio d'un onglet de navigateur que vous partagez. Il ne rejoint pas la réunion comme un robot et n'ajoute rien pour les autres participants. C'est à vous de les informer et de respecter les règles de votre entreprise, et Tonvo recommande de les prévenir.",
      },
      {
        question: "Tonvo peut-il me montrer l'engagement de chaque personne ?",
        answer:
          "Non. Tonvo n'a pas de tableau de bord des participants ni de rapports par personne. Avec Plus et Team, la répartition de la parole montre qui s'exprime, et des scores de conversation et d'engagement sont aussi disponibles.",
      },
      {
        question: "Tonvo fonctionne-t-il avec Zoom, Meet ou Teams ?",
        answer:
          "Tonvo n'a pas d'intégration avec ces outils. Partagez l'onglet du navigateur dans lequel tourne votre réunion pour qu'il entende tout le monde, ou laissez-le écouter par votre micro dans une salle. Sur téléphone, il écoute uniquement par le micro : utilisez le haut-parleur.",
      },
      {
        question: "Que me reste-t-il après la réunion ?",
        answer:
          "Un résumé de session avec le ton, ce qui a bien fonctionné, ce qui peut être amélioré et les actions de suivi. Tonvo n'enregistre ni ne stocke l'audio, mais le texte de la session est conservé pour que vous puissiez le relire.",
      },
    ],
    problem: {
      label: "Le problème",
      heading: "Être interpellé en plein milieu d'une réunion",
      body: "Les réunions vont vite. Vous suivez des slides, prenez des notes, vous écoutez à moitié, et quelqu'un se tourne vers vous avec une question. Il est facile de rater la question exacte ou de perdre le fil, et vous avez rarement une seconde chance de bien répondre.",
    },
    solution: {
      label: "La solution",
      heading: "Une vue en direct de ce qui a été demandé et de ce que vous pourriez dire",
      body: "Tonvo suit la réunion au fur et à mesure et affiche la question qui vient d'être posée, trois réponses prêtes à dire et une courte lecture du moment. Pour une réunion en ligne, partagez l'onglet du navigateur pour que Tonvo entende tout le monde, ou utilisez le micro dans une salle. Vous seul avez besoin de Tonvo. Avec Plus et Team, la répartition de la parole montre qui s'exprime, et après la session un résumé liste le ton, ce qui a bien fonctionné, ce qui peut être amélioré et les actions de suivi.",
    },
    features: [
      {
        icon: "message",
        title: "La question qui vient d'être posée",
        description:
          "Tonvo repère la question qui vient d'être posée, pour que vous puissiez y répondre même si votre attention était ailleurs un instant.",
      },
      {
        icon: "zap",
        title: "Trois réponses utilisables",
        description:
          "Des réponses prêtes à dire, écrites pour ce qui vient d'être dit. Choisissez-en une, modifiez-la ou ignorez les trois.",
      },
      {
        icon: "users",
        title: "Répartition de la parole avec les offres payantes",
        description:
          "Voyez qui s'exprime pendant la réunion. La répartition de la parole est disponible avec Plus et Team.",
      },
      {
        icon: "bar-chart",
        title: "Actions de suivi",
        description:
          "Après la session, un résumé liste le ton, ce qui a bien fonctionné, ce qui peut être amélioré et les actions de suivi à mener.",
      },
    ],
    stats: [],
  },

  // ─── 5. Freelances et appels clients ───
  {
    type: "use-cases",
    slug: "freelancer-client-call-assistant",
    title: "Appels clients en freelance : tarifs et périmètre | Tonvo",
    metaDescription:
      "Tonvo aide les freelances à trouver les mots lors des appels clients sur les tarifs et le périmètre. Trois réponses prêtes à dire. Offre Free disponible.",
    h1: "Abordez les discussions de tarif et de périmètre avec plus d'assurance",
    subtitle:
      "Parler de prix ou de travail supplémentaire avec un client est délicat quand on est seul. Tonvo affiche ce que le client vient de demander et trois réponses que vous pouvez dire, ou vous aide à répondre à un message.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "use-cases", slug: "ai-copilot-for-sales-calls", label: "Copilote IA pour appels de vente" },
    ],
    targetKeywords: [
      "aide appel client freelance",
      "comment négocier son tarif avec un client",
      "que dire quand un client demande plus de travail",
      "discussion tarif freelance",
      "assistant appel client",
      "répondre à un message de client",
    ],
    faq: [
      {
        question: "Comment Tonvo aide-t-il les freelances ?",
        answer:
          "Tonvo suit un appel client au fur et à mesure, affiche la question que le client vient de poser, vous donne trois réponses que vous pouvez dire et ajoute une courte lecture du moment. Il ne décide pas à votre place, et vous pouvez reformuler chaque réponse avec vos propres mots.",
      },
      {
        question: "Tonvo peut-il m'aider à négocier mon tarif ?",
        answer:
          "Il peut vous donner trois réponses pour le moment, par exemple quand un client remet votre prix en question. Plus et Team affichent aussi des signaux comme l'hésitation et l'objection. Tonvo ne promet aucun résultat, et la décision comme la formulation restent les vôtres.",
      },
      {
        question: "L'offre Free suffit-elle à un freelance ?",
        answer:
          "Free comprend 3 sessions en direct par mois de 5 minutes maximum chacune, de quoi essayer Tonvo sur de courtes conversations avec des clients. Plus coûte $19 par mois pour des sessions illimitées, des conseils de coaching, des signaux, la traduction en direct et l'historique complet. L'aide pour les messages écrits fonctionne avec toutes les offres.",
      },
      {
        question: "Tonvo conserve-t-il mes conversations avec mes clients ?",
        answer:
          "Tonvo n'enregistre ni ne stocke l'audio. Le texte de vos sessions est conservé pour que vous puissiez le relire : 7 jours avec Free et l'historique complet avec les offres payantes. C'est à vous d'expliquer à vos clients comment vous l'utilisez, et Tonvo recommande de le faire.",
      },
    ],
    problem: {
      label: "Le problème",
      heading: "Seul en appel quand la conversation passe à l'argent",
      body: "Les freelances gèrent la vente, la livraison et les échanges avec les clients sans collègue avec qui faire le point. Quand un client conteste votre tarif ou demande un petit extra en dehors du travail convenu, il est facile de dire oui trop vite ou de rester figé.",
    },
    solution: {
      label: "La solution",
      heading: "Un second regard pour les moments délicats avec un client",
      body: "Tonvo suit l'appel au fur et à mesure et affiche la question que le client vient de poser, trois réponses que vous pouvez dire et une courte lecture du moment. Pour un message de client, collez le texte ou importez une capture d'écran et soyez aidé pour répondre. Utilisez le mode vente ou le mode général selon la conversation. Après la session, un résumé liste le ton, ce qui a bien fonctionné, ce qui peut être amélioré et les actions de suivi.",
    },
    features: [
      {
        icon: "target",
        title: "Réponses pour les discussions de tarif",
        description:
          "Quand un client demande le prix ou conteste un tarif, Tonvo rédige trois réponses pour ce qui vient d'être dit, et vous choisissez vos propres mots.",
      },
      {
        icon: "shield",
        title: "Réponses pour les questions de périmètre",
        description:
          "Quand une demande dépasse ce qui était convenu, obtenez trois façons de répondre que vous pouvez adapter, en appel ou par message.",
      },
      {
        icon: "message",
        title: "Aide pour répondre aux messages",
        description:
          "Collez le message d'un client ou importez une capture d'écran et soyez aidé pour rédiger votre réponse. Cela fonctionne avec toutes les offres.",
      },
    ],
    stats: [],
  },

  // ─── 6. Nouveaux SDR ───
  {
    type: "use-cases",
    slug: "sdr-onboarding-with-call-review",
    title: "Premiers appels de vente : copilote pour SDR | Tonvo",
    metaDescription:
      "Nouveau SDR ? Tonvo affiche la question du prospect et trois réponses prêtes à dire pendant vos appels, avec un résumé après chaque session. Offre Free.",
    h1: "Un copilote pour vos premiers appels de vente en tant que nouveau SDR",
    subtitle:
      "Débuter comme SDR, c'est passer des appels en direct avant de se sentir prêt. Tonvo affiche la question que le prospect vient de poser et trois réponses que vous pouvez dire, puis vous donne un résumé de chaque appel pour apprendre.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "use-cases", slug: "ai-copilot-for-sales-calls", label: "Copilote IA pour appels de vente" },
      { type: "features", slug: "post-session-analysis", label: "Analyse après session" },
      { type: "industries", slug: "saas-sales-teams", label: "Équipes commerciales SaaS" },
    ],
    targetKeywords: [
      "aide nouveau SDR appels",
      "premiers appels commerciaux SDR",
      "assistant d'appel pour SDR",
      "que dire en phoning à froid",
      "copilote appel de vente pour débutants",
      "réponses aux objections SDR",
    ],
    faq: [
      {
        question: "Comment Tonvo peut-il aider un nouveau SDR pendant ses appels ?",
        answer:
          "Pendant un appel en direct, Tonvo affiche la question que le prospect vient de poser, trois réponses prêtes à dire et une courte lecture du moment. Après la session, vous obtenez un résumé avec le ton, ce qui a bien fonctionné, ce qui peut être amélioré et les actions de suivi. Tonvo suggère, vous décidez : respectez donc le script et les règles de votre entreprise.",
      },
      {
        question: "Mes managers peuvent-ils relire mes appels dans Tonvo ?",
        answer:
          "Non. Tonvo n'a ni tableau de bord pour managers ni file de relecture. Chaque utilisateur voit ses propres sessions et résumés. Vous pouvez relire votre propre résumé et le texte de vos sessions, et les passer en revue avec votre manager si vous le souhaitez.",
      },
      {
        question: "En quoi est-ce différent d'un outil d'enregistrement d'appels ?",
        answer:
          "Tonvo n'enregistre ni ne stocke l'audio, et ce n'est pas un système d'enregistrement ou de supervision. Il agit pendant l'appel en affichant la question et des réponses, puis conserve le texte de la session pour que vous puissiez le relire.",
      },
      {
        question: "Quelle offre convient à un SDR ?",
        answer:
          "Free comprend 3 sessions en direct par mois de 5 minutes maximum chacune. Plus coûte $19 par mois pour des sessions illimitées. Team coûte $49 par utilisateur et par mois et ajoute l'analyse d'écran. Les offres payantes bénéficient d'une garantie de remboursement de 7 jours et sont facturées en dollars américains.",
      },
    ],
    problem: {
      label: "Le problème",
      heading: "Les appels en direct commencent avant que vous vous sentiez prêt",
      body: "Les nouveaux SDR doivent passer de vrais appels très tôt, avec des scripts et des notes de formation qu'ils ne retrouvent pas toujours sur le moment. Quand un prospect pose une question inattendue ou dit qu'il n'est pas intéressé, la bonne réponse est difficile à trouver, et il n'y a souvent personne à proximité pour aider sur le moment.",
    },
    solution: {
      label: "La solution",
      heading: "De l'aide pendant l'appel, et un résumé pour apprendre ensuite",
      body: "Tonvo suit chaque appel au fur et à mesure et affiche la question que le prospect vient de poser, trois réponses prêtes à dire et une courte lecture du moment. Le mode vente d'une session en direct convient à ce type d'appel. Après chaque session, un résumé liste le ton, ce qui a bien fonctionné, ce qui peut être amélioré et les actions de suivi, pour que vous puissiez revenir sur vos propres appels. Faites de chaque réponse la vôtre.",
    },
    features: [
      {
        icon: "layers",
        title: "Un résumé après chaque appel",
        description:
          "Un résumé de session avec le ton, ce qui a bien fonctionné, ce qui peut être amélioré et les actions de suivi, prêt à lire une fois l'appel terminé.",
      },
      {
        icon: "zap",
        title: "Des réponses pendant l'appel",
        description:
          "Trois réponses prêtes à dire pour la question que le prospect vient de poser, pour qu'une objection inattendue ne vous laisse pas sans mots.",
      },
      {
        icon: "trending-up",
        title: "Historique des sessions",
        description:
          "Free conserve 7 jours d'historique de sessions. Les offres payantes conservent l'historique complet et ajoutent l'analyse de progression, pour revenir sur l'ensemble de vos appels.",
      },
      {
        icon: "users",
        title: "Offre Team, facturée par utilisateur",
        description:
          "Team coûte $49 par utilisateur et par mois et ajoute l'analyse d'écran. Il n'y a pas de tableau de bord pour managers : chaque commercial relit ses propres sessions.",
      },
    ],
    stats: [],
  },

  // ─── 7. Entretiens de recherche utilisateur ───
  {
    type: "use-cases",
    slug: "user-research-interview-insights",
    title: "Entretiens utilisateurs : transcription en direct | Tonvo",
    metaDescription:
      "Tonvo transcrit vos entretiens de recherche en direct en 10 langues et donne une courte lecture du moment, avec un résumé après. Micro ou onglet. Free.",
    h1: "Restez présent dans vos entretiens de recherche pendant que Tonvo suit",
    subtitle:
      "Quand vous menez un entretien utilisateur, vous écoutez, vous posez des questions et vous pensez à la suivante en même temps. Tonvo transcrit la conversation en direct et donne une courte lecture du moment, pour que votre attention reste sur la personne.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "use-cases", slug: "team-meeting-engagement-tracking", label: "Suivre chaque question en réunion" },
    ],
    targetKeywords: [
      "assistant entretien utilisateur",
      "transcription en direct d'entretiens",
      "aide pour interviews de recherche utilisateur",
      "questions de relance en entretien",
      "transcrire un entretien dans une autre langue",
      "outil entretien UX",
    ],
    faq: [
      {
        question: "Comment Tonvo aide-t-il pendant un entretien de recherche utilisateur ?",
        answer:
          "Tonvo suit l'entretien au fur et à mesure, par votre micro ou par un onglet de navigateur partagé, et le transcrit en direct. Il donne une courte lecture du moment et trois réponses prêtes à dire dont vous pouvez vous servir pour formuler une question de relance. Après la session, vous obtenez un résumé avec le ton, ce qui a bien fonctionné, ce qui peut être amélioré et les actions de suivi.",
      },
      {
        question: "Puis-je étiqueter et annoter les moments clés ?",
        answer:
          "Non. Tonvo n'a ni étiquetage, ni fonction de notes, ni export. Après une session, vous obtenez un résumé et le texte peut être relu : gardez donc votre outil de recherche habituel à côté si vous avez besoin d'étiqueter.",
      },
      {
        question: "Tonvo lit-il les émotions dans la voix du participant ?",
        answer:
          "Non. Tonvo travaille sur les mots transcrits et n'analyse pas le son de la voix. Avec Plus et Team, il affiche des signaux comme l'hésitation, l'accord et le point clé, d'après ce qui est dit. Il peut se tromper : voyez-y un indice.",
      },
      {
        question: "Les participants doivent-ils savoir que Tonvo est lancé ?",
        answer:
          "C'est à vous d'informer les personnes avec qui vous parlez et de respecter les règles applicables, comme le consentement. Tonvo recommande de les prévenir. Il ne rejoint pas l'appel, et il n'enregistre ni ne stocke l'audio.",
      },
    ],
    problem: {
      label: "Le problème",
      heading: "Difficile d'écouter attentivement et de préparer la question suivante",
      body: "Dans un entretien utilisateur, vous écoutez, vous gardez la conversation naturelle et vous décidez de ce que vous allez demander ensuite. Des détails vous échappent, et quand le participant parle une langue que vous ne comprenez qu'en partie, c'est encore plus difficile de suivre.",
    },
    solution: {
      label: "La solution",
      heading: "Une transcription en direct et une lecture du moment",
      body: "Tonvo suit l'entretien au fur et à mesure et le transcrit en direct en 10 langues, avec détection automatique de la langue. Il donne une courte lecture du moment et trois réponses prêtes à dire dont vous pouvez vous servir pour formuler une relance. Avec Plus et Team, les signaux et la traduction en direct sont aussi disponibles. Après la session, un résumé liste le ton, ce qui a bien fonctionné, ce qui peut être amélioré et les actions de suivi. L'analyse porte sur les mots transcrits, et l'audio n'est pas stocké.",
    },
    features: [
      {
        icon: "search",
        title: "Transcription en direct en 10 langues",
        description:
          "Suivez la conversation en texte pendant qu'elle se déroule, en anglais, français, espagnol, allemand, italien, portugais, néerlandais, chinois, japonais ou coréen.",
      },
      {
        icon: "eye",
        title: "Signaux avec les offres payantes",
        description:
          "Plus et Team affichent des signaux dans la conversation, comme l'hésitation, l'accord et le point clé, d'après les mots transcrits.",
      },
      {
        icon: "brain",
        title: "Réponses pour les relances",
        description:
          "Trois réponses prêtes à dire pour ce qui vient d'être dit, que vous pouvez reformuler en une question de relance à vous.",
      },
      {
        icon: "globe",
        title: "Traduction en direct avec les offres payantes",
        description:
          "Vous menez un entretien dans une langue que vous parlez à moitié ? La traduction en direct est disponible avec Plus et Team.",
      },
    ],
    stats: [],
  },

  // ─── 8. Réunions dans une autre langue ───
  {
    type: "use-cases",
    slug: "remote-meeting-communication",
    title: "Réunions en langue étrangère : suivez le fil | Tonvo",
    metaDescription:
      "Tonvo transcrit vos réunions en ligne en direct en 10 langues et affiche la question posée avec trois réponses. Onglet partagé ou micro. Offre Free.",
    h1: "Participez aux réunions en ligne dans une langue que vous apprenez encore",
    subtitle:
      "Dans un appel tenu dans une seconde langue, on peut perdre le fil comme les mots. Tonvo transcrit en direct en 10 langues et affiche la question posée avec trois réponses que vous pouvez dire.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "use-cases", slug: "team-meeting-engagement-tracking", label: "Suivre chaque question en réunion" },
    ],
    targetKeywords: [
      "aide en réunion en langue étrangère",
      "suivre une réunion à distance dans une autre langue",
      "transcription en direct visioconférence",
      "traduction en direct pendant les appels",
      "aide réunion anglais non natif",
      "assistant de réunion à distance",
    ],
    faq: [
      {
        question: "Comment Tonvo aide-t-il dans une réunion tenue dans une autre langue ?",
        answer:
          "Tonvo suit la réunion au fur et à mesure et la transcrit en direct. Il affiche la question qui vient d'être posée, trois réponses prêtes à dire et une courte lecture du moment. La traduction en direct est disponible avec Plus et Team. C'est vous qui décidez de ce que vous dites.",
      },
      {
        question: "Quelles langues Tonvo transcrit-il ?",
        answer:
          "La transcription en direct couvre 10 langues : anglais, français, espagnol, allemand, italien, portugais, néerlandais, chinois, japonais et coréen. La langue peut être détectée automatiquement.",
      },
      {
        question: "Tonvo fonctionne-t-il avec Zoom, Meet ou Teams ?",
        answer:
          "Tonvo n'a pas d'intégration avec ces outils et ne rejoint pas la réunion. Partagez l'onglet du navigateur dans lequel tourne votre réunion pour qu'il entende les deux côtés, ou laissez-le écouter par votre micro. Sur téléphone, il écoute uniquement par le micro : mettez l'appel en haut-parleur.",
      },
      {
        question: "En quoi est-ce différent d'un outil de transcription ?",
        answer:
          "La transcription en direct en fait partie, mais Tonvo affiche aussi la question posée, trois réponses et une courte lecture du moment, puis vous donne un résumé. Il n'enregistre ni ne stocke l'audio. Le texte de vos sessions est conservé pour que vous puissiez le relire, et vous devez indiquer aux autres participants comment vous l'utilisez.",
      },
    ],
    problem: {
      label: "Le problème",
      heading: "Les réunions en ligne sont plus difficiles quand la langue n'est pas la vôtre",
      body: "En visio, on perd les repères d'une salle, et dans une seconde langue on peut aussi manquer des mots, des accents et du rythme. Une question arrive, vous n'êtes pas sûr de l'avoir comprise, et le temps de trouver votre réponse, la discussion est déjà passée à autre chose.",
    },
    solution: {
      label: "La solution",
      heading: "Une transcription en direct, la question et des réponses à dire",
      body: "Tonvo suit la réunion au fur et à mesure. Partagez l'onglet du navigateur de la réunion pour qu'il entende les deux côtés, ou utilisez votre micro. Il transcrit en direct en 10 langues et peut détecter la langue, puis affiche la question posée, trois réponses prêtes à dire et une courte lecture du moment. La traduction en direct est disponible avec Plus et Team. Vous choisissez ce que vous dites.",
    },
    features: [
      {
        icon: "globe",
        title: "Transcription en direct en 10 langues",
        description:
          "Lisez la conversation pendant qu'elle se déroule, avec détection automatique de la langue, pour qu'un mot raté ne vous fasse pas perdre le fil.",
      },
      {
        icon: "message",
        title: "Traduction en direct avec les offres payantes",
        description:
          "Plus et Team ajoutent la traduction en direct, utile quand la réunion n'est pas dans la langue dans laquelle vous pensez.",
      },
      {
        icon: "headphones",
        title: "Les deux côtés d'un appel en ligne",
        description:
          "Partagez un onglet de navigateur pour que Tonvo entende tout le monde dans une réunion en ligne, ou utilisez votre micro pour un échange dans une salle.",
      },
      {
        icon: "bar-chart",
        title: "Résumé après la réunion",
        description:
          "Un résumé de session avec le ton, ce qui a bien fonctionné, ce qui peut être amélioré et les actions de suivi, conservé en texte que vous pouvez relire.",
      },
    ],
    stats: [],
  },
];
