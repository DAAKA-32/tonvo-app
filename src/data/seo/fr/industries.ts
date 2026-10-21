import type { IndustryEntry } from "../types";

export const industriesFr: IndustryEntry[] = [
  // ── 1. Équipes commerciales SaaS ─────────────────────────────────────
  {
    type: "industries",
    slug: "saas-sales-teams",
    title: "Tonvo pour équipes SaaS | Copilote pour vos appels",
    metaDescription:
      "Tonvo suit vos appels de découverte et démos en direct, affiche la question de l'acheteur et propose trois réponses. Depuis votre micro ou un onglet.",
    h1: "Trouvez les bons mots à chaque appel de découverte et chaque démo",
    subtitle:
      "Tonvo suit vos conversations commerciales en direct, affiche la question que l'acheteur vient de poser et propose trois réponses. C'est vous qui décidez quoi dire.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "use-cases", slug: "ai-copilot-for-sales-calls", label: "Copilote IA pour appels commerciaux" },
      { type: "use-cases", slug: "sdr-onboarding-with-call-review", label: "Onboarding des SDR avec revue d'appels" },
    ],
    targetKeywords: [
      "copilote ia appels commerciaux",
      "que dire pendant un appel de vente",
      "assistant d'appel commercial en direct",
      "répondre aux objections au téléphone",
      "assistant démo saas",
    ],
    faq: [
      {
        question: "Comment Tonvo m'aide-t-il pendant un appel commercial ?",
        answer:
          "Tonvo suit la conversation en direct et affiche la question que votre interlocuteur vient de poser, trois réponses prêtes à dire et une courte lecture du moment. Il suggère, vous décidez. Il peut se tromper : voyez-le comme un deuxième avis plutôt que comme un script.",
      },
      {
        question: "Tonvo rejoint-il mes appels Zoom ou Meet ?",
        answer:
          "Non. Tonvo ne rejoint pas les appels comme un bot et ne s'intègre ni à Zoom, ni à Meet, ni à Teams, ni à Discord, ni à aucun CRM. Il écoute par votre micro, ou par le son d'un onglet de navigateur que vous partagez, pour entendre les deux côtés d'un appel en ligne. Il vous revient d'informer les personnes avec qui vous parlez et de respecter les règles applicables.",
      },
      {
        question: "Tonvo propose-t-il des tableaux de bord pour les managers commerciaux ?",
        answer:
          "Non. Tonvo est un copilote pour la personne qui est en ligne, il n'y a donc ni tableau de bord manager ni statistiques partagées. Le plan Team (49 $ par utilisateur et par mois) ajoute l'analyse d'écran de ce que vous partagez, comme des conversations et des e-mails.",
      },
      {
        question: "Existe-t-il un plan gratuit pour les commerciaux ?",
        answer:
          "Oui. Le plan Free comprend 3 sessions en direct par mois, de 5 minutes maximum chacune, avec les questions détectées, trois réponses et un résumé de session. Plus coûte 19 $ par mois pour des sessions illimitées, et les plans payants bénéficient d'une garantie de remboursement de 7 jours.",
      },
    ],
    industryName: "Vente SaaS",
    painPoints: [
      "Un acheteur pose une question sur le prix ou la sécurité que vous n'aviez pas préparée, et le silence se remarque",
      "Les objections arrivent en pleine phrase et passent facilement inaperçues pendant que vous prenez des notes",
      "Mener une démo, une fenêtre de chat et une conversation en même temps laisse peu d'attention pour ce que l'acheteur a réellement dit",
      "Les détails et les prochaines étapes se mélangent une fois l'appel terminé",
    ],
    howTonvoHelps: {
      label: "Comment ça marche",
      heading: "Une seconde paire d'oreilles pendant l'appel",
      body: "Ouvrez Tonvo dans votre navigateur et laissez-le écouter par votre micro, ou partagez l'onglet de votre appel pour qu'il entende les deux côtés. Il affiche la question qui vient d'être posée, trois réponses prêtes à dire et une courte lecture du moment. Choisissez le mode vente, puis lisez après la session un résumé avec ce qui a bien fonctionné, ce qui est à améliorer et les actions de suivi.",
    },
    features: [
      {
        icon: "message",
        title: "La question, repérée",
        description:
          "Affiche la question que le prospect vient de poser, pour que vous répondiez à ce qui a été dit et non à ce que vous aviez supposé.",
      },
      {
        icon: "zap",
        title: "Trois réponses prêtes à dire",
        description:
          "Chaque moment s'accompagne de trois réponses que vous pouvez dire telles quelles ou adapter. Vous gardez la main sur la conversation.",
      },
      {
        icon: "eye",
        title: "Signaux avec Plus et Team",
        description:
          "Les plans payants signalent questions, objections, opportunités, hésitations et accords au fil de l'appel.",
      },
      {
        icon: "bar-chart",
        title: "Résumé de session",
        description:
          "Après la session, lisez le ton, ce qui a bien fonctionné, ce qui est à améliorer et les actions de suivi suggérées.",
      },
    ],
    stats: [],
    useCaseLinks: [
      "ai-copilot-for-sales-calls",
      "sdr-onboarding-with-call-review",
      "team-meeting-engagement-tracking",
    ],
  },

  // ── 2. Équipes Customer Success ──────────────────────────────────────
  {
    type: "industries",
    slug: "customer-success-teams",
    title: "Tonvo pour le Customer Success | Copilote appels clients",
    metaDescription:
      "Tonvo suit en direct vos appels d'onboarding, de suivi et de renouvellement, affiche la question du client et propose des réponses pour les moments tendus.",
    h1: "Restez présent à chaque appel client",
    subtitle:
      "De l'onboarding aux renouvellements et aux escalades, Tonvo suit ce que dit le client et propose des réponses pour les moments délicats, pour que vous puissiez vous concentrer sur la personne.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "use-cases", slug: "customer-support-tone-detection", label: "Détection du ton en support client" },
      { type: "industries", slug: "saas-sales-teams", label: "Équipes commerciales SaaS" },
    ],
    targetKeywords: [
      "assistant d'appel customer success",
      "que dire à un client mécontent",
      "copilote ia customer success",
      "préparer un appel de renouvellement",
      "gérer un appel d'escalade client",
    ],
    faq: [
      {
        question: "Comment Tonvo m'aide-t-il pendant un appel client ?",
        answer:
          "Tonvo suit la conversation en direct et affiche la question que le client vient de poser, trois réponses prêtes à dire et une courte lecture du moment. Quand un appel devient tendu, les réponses vous donnent des mots pour reconnaître le problème et avancer. Vous décidez quoi dire, et Tonvo peut se tromper.",
      },
      {
        question: "Tonvo suit-il la santé des comptes clients ?",
        answer:
          "Non. Tonvo ne tient pas de fiches de comptes et ne produit pas de statistiques agrégées. Chaque session a son propre résumé avec le ton, ce qui a bien fonctionné et les actions de suivi, et les plans payants conservent tout votre historique de sessions pour que vous puissiez relire les précédentes.",
      },
      {
        question: "Tonvo fonctionne-t-il pour les appels à plusieurs participants ?",
        answer:
          "Il fonctionne avec le son qu'il peut entendre. Si vous partagez l'onglet du navigateur où se déroule votre appel, il entend les deux côtés d'un appel en ligne, y compris avec plusieurs participants. Sur les plans payants, un équilibre de parole montre qui s'exprime. Tonvo ne rejoint pas l'appel et ne s'intègre ni à Zoom, ni à Meet, ni à Discord.",
      },
      {
        question: "Par quel plan les équipes Customer Success doivent-elles commencer ?",
        answer:
          "Commencez avec Free : 3 sessions en direct par mois, de 5 minutes maximum chacune. Plus coûte 19 $ par mois pour des sessions illimitées. Team coûte 49 $ par utilisateur et par mois et ajoute l'analyse d'écran des conversations et des e-mails que vous partagez. Les plans payants bénéficient d'une garantie de remboursement de 7 jours.",
      },
    ],
    industryName: "Customer Success",
    painPoints: [
      "Un client frustré pose une question directe et les bons mots ne viennent pas",
      "Prendre des notes pendant un renouvellement ou une escalade détourne votre attention du client",
      "Les clients passent d'un sujet à l'autre, et la question derrière une remarque échappe facilement",
      "Les actions de suivi sont difficiles à retrouver avec exactitude après une série d'appels",
    ],
    howTonvoHelps: {
      label: "Comment ça marche",
      heading: "Suivez la conversation, sereinement",
      body: "Lancez Tonvo dans le navigateur, à côté de votre appel client. Il écoute par votre micro ou un onglet partagé, affiche la question que le client vient de poser et trois réponses utilisables, y compris pour les moments tendus. Choisissez le mode support pour les escalades. Ensuite, le résumé de session liste le ton, ce qui a bien fonctionné et les actions de suivi.",
    },
    features: [
      {
        icon: "message",
        title: "Des réponses pour les moments tendus",
        description:
          "Trois réponses prêtes à dire vous aident à reconnaître la frustration et à orienter la conversation vers une prochaine étape.",
      },
      {
        icon: "eye",
        title: "Signaux avec Plus et Team",
        description:
          "Les signaux de question, d'objection, d'hésitation et d'accord vous aident à percevoir ce que le client dit vraiment.",
      },
      {
        icon: "headphones",
        title: "Mode support",
        description:
          "Choisissez le mode support pour les escalades et les appels de dépannage, ou le mode général pour les points d'étape et les renouvellements.",
      },
      {
        icon: "check",
        title: "Actions de suivi",
        description:
          "Chaque résumé de session liste des actions de suivi suggérées, pour que les prochaines étapes soient sous vos yeux à la fin de l'appel.",
      },
    ],
    stats: [],
    useCaseLinks: [
      "customer-support-tone-detection",
      "team-meeting-engagement-tracking",
      "remote-meeting-communication",
    ],
  },

  // ── 3. Cabinets de recrutement ───────────────────────────────────────
  {
    type: "industries",
    slug: "recruitment-agencies",
    title: "Tonvo pour recruteurs | Copilote pour entretiens",
    metaDescription:
      "Tonvo suit vos préqualifications et entretiens en direct, affiche la question posée et propose trois réponses. Mode recrutement, micro ou onglet.",
    h1: "Restez concentré sur le candidat pendant chaque entretien",
    subtitle:
      "Tonvo suit vos appels de préqualification et vos entretiens en direct, pour que vous répondiez clairement aux questions des candidats et gardiez votre attention sur la personne, pas sur vos notes.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "use-cases", slug: "ai-coaching-for-job-interviews", label: "Coaching IA pour entretiens d'embauche" },
      { type: "use-cases", slug: "user-research-interview-insights", label: "Enseignements d'entretiens" },
      { type: "industries", slug: "consulting-firms", label: "Cabinets de conseil" },
    ],
    targetKeywords: [
      "assistant d'appel pour recruteur",
      "copilote ia pour recruteurs",
      "aide préqualification candidat",
      "répondre aux questions des candidats en direct",
      "assistant entretien de recrutement",
    ],
    faq: [
      {
        question: "Comment Tonvo aide-t-il les recruteurs pendant les préqualifications ?",
        answer:
          "Tonvo suit la conversation en direct et affiche la question que le candidat vient de poser, avec trois réponses utilisables et une courte lecture du moment. Choisissez le mode recrutement pour l'adapter aux entretiens et aux appels de préqualification. Vous décidez quoi dire.",
      },
      {
        question: "Tonvo note-t-il ou classe-t-il les candidats ?",
        answer:
          "Non. Tonvo vous aide à suivre la conversation et à trouver vos mots. Il ne note pas et ne classe pas les candidats, et il n'analyse ni la hauteur de la voix, ni le débit, ni les mots de remplissage. Votre propre jugement et votre processus d'évaluation tranchent.",
      },
      {
        question: "Dois-je dire aux candidats que j'utilise Tonvo ?",
        answer:
          "Il vous revient d'informer les personnes avec qui vous parlez et de respecter les règles applicables, notamment le consentement et la politique de votre entreprise. La recommandation de Tonvo est de les prévenir. Il ne rejoint pas l'appel : il écoute par votre micro ou un onglet de navigateur partagé.",
      },
      {
        question: "Quel plan convient le mieux aux recruteurs ?",
        answer:
          "Commencez avec Free : 3 sessions en direct par mois, de 5 minutes maximum chacune. Plus (19 $ par mois) donne des sessions illimitées, la traduction en direct et l'historique complet, utiles si vous enchaînez beaucoup d'appels ou menez des entretiens dans une autre langue.",
      },
    ],
    industryName: "Recrutement et intérim",
    painPoints: [
      "Les candidats posent des questions sur la rémunération, le process ou le client, et la réponse dont vous avez besoin n'est pas sous la main",
      "Prendre des notes pendant une préqualification partage votre attention entre la frappe et l'écoute",
      "Les appels qui s'enchaînent se confondent, et il devient difficile de se souvenir de ce que chaque candidat a dit",
      "Les appels dans une autre langue demandent un effort de plus à chaque question et chaque réponse",
    ],
    howTonvoHelps: {
      label: "Comment ça marche",
      heading: "Gardez votre attention sur le candidat",
      body: "Ouvrez Tonvo dans votre navigateur et laissez-le écouter par votre micro, ou partagez l'onglet de votre appel vidéo. Il affiche la question qui vient d'être posée, trois réponses utilisables et une courte lecture du moment. Après l'appel, le résumé de session vous donne le ton, ce qui a bien fonctionné et les actions de suivi à relire.",
    },
    features: [
      {
        icon: "users",
        title: "Mode recrutement",
        description:
          "Choisissez le mode recrutement pour les appels de préqualification et les entretiens, ou passez en mode général pour toute autre conversation.",
      },
      {
        icon: "message",
        title: "Questions et réponses prêtes",
        description:
          "Affiche la question qu'un candidat vient de poser et trois réponses utilisables, des détails du poste aux prochaines étapes.",
      },
      {
        icon: "globe",
        title: "Traduction en direct avec Plus et Team",
        description:
          "Suivez des conversations dans une autre langue. La transcription en direct couvre 10 langues, avec traduction en direct sur les plans payants.",
      },
      {
        icon: "check",
        title: "Résumé de session",
        description:
          "Relisez après chaque appel le ton, ce qui a bien fonctionné, ce qui est à améliorer et les actions de suivi suggérées.",
      },
    ],
    stats: [],
    useCaseLinks: [
      "ai-coaching-for-job-interviews",
      "user-research-interview-insights",
      "team-meeting-engagement-tracking",
    ],
  },

  // ── 4. Cabinets de conseil ───────────────────────────────────────────
  {
    type: "industries",
    slug: "consulting-firms",
    title: "Tonvo pour consultants | Copilote pour réunions clients",
    metaDescription:
      "Tonvo suit en direct vos appels clients et ateliers, affiche la question posée et propose trois réponses, avec un résumé après chaque session.",
    h1: "Suivez chaque réunion client et trouvez les bons mots",
    subtitle:
      "Des réunions de lancement aux comités de pilotage, Tonvo suit la discussion en direct, affiche les questions des clients et propose des réponses quand on vous prend au dépourvu.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "use-cases", slug: "freelancer-client-call-assistant", label: "Assistant d'appels clients" },
      { type: "features", slug: "post-session-analysis", label: "Analyse après session" },
      { type: "industries", slug: "saas-sales-teams", label: "Équipes commerciales SaaS" },
      { type: "use-cases", slug: "remote-meeting-communication", label: "Communication en réunion à distance" },
    ],
    targetKeywords: [
      "assistant ia pour consultants",
      "copilote réunion client",
      "assistant d'appel pour consultant",
      "répondre aux questions du client en direct",
      "assistant animation d'atelier",
    ],
    faq: [
      {
        question: "Comment Tonvo aide-t-il les consultants en réunion client ?",
        answer:
          "Tonvo suit la discussion en direct et affiche la question qu'un client vient de poser, trois réponses utilisables et une courte lecture du moment. Il aide quand on vous prend au dépourvu. Vous décidez quoi dire, et il peut se tromper.",
      },
      {
        question: "Tonvo peut-il produire un résumé de session ?",
        answer:
          "Oui. Après chaque session, vous obtenez un résumé avec le ton, ce qui a bien fonctionné, ce qui est à améliorer et des actions de suivi suggérées. C'est un point de départ pour vos propres notes, pas un livrable client finalisé.",
      },
      {
        question: "Tonvo convient-il aux consultants indépendants comme aux grands cabinets ?",
        answer:
          "Chaque personne utilise son propre compte, et il n'y a pas de tableaux de bord partagés pour le cabinet. Plus (19 $ par mois) couvre des sessions illimitées pour un consultant indépendant. Team (49 $ par utilisateur et par mois) ajoute l'analyse d'écran de ce que vous partagez, comme des conversations et des e-mails.",
      },
      {
        question: "Tonvo conserve-t-il les conversations avec mes clients ?",
        answer:
          "Tonvo n'enregistre ni ne conserve l'audio. Il transcrit la conversation en direct et envoie ce texte à des prestataires de services d'IA pour le traiter (voir notre Politique de confidentialité). Le texte de vos sessions est conservé pour que vous puissiez le relire. Vérifiez les conditions de confidentialité de votre client avant de l'utiliser.",
      },
    ],
    industryName: "Conseil en management",
    painPoints: [
      "Un client pose une question directe en comité de pilotage et il vous faut une réponse digne d'être dite à voix haute",
      "Animer une discussion tout en notant ce qui a été décidé partage votre attention",
      "Les consultants juniors face à des interlocuteurs seniors peuvent perdre le fil sous la pression",
      "Les actions décidées lors d'une longue session sont difficiles à reconstituer avec exactitude ensuite",
    ],
    howTonvoHelps: {
      label: "Comment ça marche",
      heading: "Suivez la discussion pendant que vous la menez",
      body: "Tonvo ne rejoint pas votre appel Zoom, Meet ou Teams. Il écoute par votre micro ou un onglet de navigateur que vous partagez, et affiche la question qui vient d'être posée, trois réponses utilisables et une courte lecture du moment. Ensuite, le résumé de session liste le ton, ce qui a bien fonctionné et les actions de suivi, pour que vous démarriez vos propres notes à partir de quelque chose de concret.",
    },
    features: [
      {
        icon: "message",
        title: "Questions et réponses prêtes",
        description:
          "Affiche la question qu'un client vient de poser et trois réponses que vous pouvez dire telles quelles ou adapter à votre propre point de vue.",
      },
      {
        icon: "eye",
        title: "Signaux avec Plus et Team",
        description:
          "Les plans payants signalent questions, objections, hésitations et points clés, et affichent un équilibre de parole pour savoir qui s'exprime.",
      },
      {
        icon: "layers",
        title: "Résumés de session",
        description:
          "Après chaque session, un résumé avec le ton, ce qui a bien fonctionné, ce qui est à améliorer et les actions de suivi.",
      },
      {
        icon: "monitor",
        title: "Analyse d'écran avec Team",
        description:
          "Le plan Team lit ce que vous partagez à l'écran, comme des conversations, des messages privés et des e-mails, pour vous aider à répondre.",
      },
    ],
    stats: [],
    useCaseLinks: [
      "freelancer-client-call-assistant",
      "remote-meeting-communication",
      "team-meeting-engagement-tracking",
    ],
  },

  // ── 5. Startups tech ─────────────────────────────────────────────────
  {
    type: "industries",
    slug: "tech-startups",
    title: "Tonvo pour fondateurs | Copilote pour vos appels clés",
    metaDescription:
      "Tonvo suit vos appels investisseurs, entretiens clients et premières ventes en direct et propose trois réponses. Gratuit pour commencer.",
    h1: "Trouvez les mots pour vos pitchs, vos appels clients et vos recrutements",
    subtitle:
      "Les fondateurs enchaînent les conversations à fort enjeu sans script. Tonvo les suit en direct et suggère quoi dire, des appels investisseurs aux entretiens de découverte client.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "use-cases", slug: "ai-copilot-for-sales-calls", label: "Copilote IA pour appels commerciaux" },
      { type: "use-cases", slug: "user-research-interview-insights", label: "Enseignements des études utilisateurs" },
      { type: "industries", slug: "saas-sales-teams", label: "Équipes commerciales SaaS" },
    ],
    targetKeywords: [
      "copilote ia pour fondateurs",
      "assistant d'appel investisseur",
      "aide entretien de découverte client",
      "que dire à un investisseur",
      "copilote de conversation pour startup",
    ],
    faq: [
      {
        question: "Pourquoi un fondateur de startup utiliserait-il Tonvo ?",
        answer:
          "Une startup avance à coups de conversations : appels investisseurs, découverte client, premières ventes, recrutement. Tonvo les suit en direct, affiche la question qui vient d'être posée et propose trois réponses, pour que vous trouviez vos mots sans coach à chaque appel.",
      },
      {
        question: "Puis-je utiliser Tonvo pendant un appel avec un investisseur ?",
        answer:
          "Oui, sur tout appel dont il peut entendre le son par votre micro ou un onglet de navigateur partagé. Il affiche la question de l'investisseur et trois réponses utilisables. Il suggère, vous décidez, et il ne remplace pas la connaissance de votre propre activité. Prévenez les personnes avec qui vous parlez que vous l'utilisez.",
      },
      {
        question: "Combien coûte Tonvo pour une petite startup ?",
        answer:
          "Le plan Free offre 3 sessions en direct par mois, de 5 minutes maximum chacune. Plus coûte 19 $ par mois pour des sessions illimitées pour une personne. Team coûte 49 $ par utilisateur et par mois et ajoute l'analyse d'écran. Les plans payants bénéficient d'une garantie de remboursement de 7 jours.",
      },
      {
        question: "Tonvo fonctionne-t-il aussi pour les conversations écrites ?",
        answer:
          "Oui. Collez le texte d'une conversation ou importez des captures d'écran, comme un fil d'e-mails ou un message privé, et obtenez de l'aide pour répondre. C'est disponible sur tous les plans. Pour les conversations orales, Tonvo fonctionne en direct.",
      },
    ],
    industryName: "Startups tech",
    painPoints: [
      "Les investisseurs posent des questions difficiles à toute vitesse, sans laisser le temps de réfléchir",
      "Les appels de découverte client dérivent, et la question de relance que vous vouliez poser vous échappe",
      "Les fondateurs mènent des conversations de vente, de recrutement et de support dans la même semaine",
      "Les jeunes équipes n'ont pas de coach avec qui revenir sur le déroulé d'une conversation",
      "Avec un budget serré, un outil doit être facile à essayer avant de payer",
    ],
    howTonvoHelps: {
      label: "Comment ça marche",
      heading: "Un seul copilote pour les conversations d'un fondateur",
      body: "Tonvo fonctionne dans le navigateur, il n'y a donc rien à installer pour l'appel. Il écoute par votre micro ou un onglet partagé et affiche la question qui vient d'être posée, trois réponses prêtes à dire et une courte lecture du moment. Passez d'un mode à l'autre (général, vente, recrutement, support, réseautage) et lisez un résumé après chaque session.",
    },
    features: [
      {
        icon: "zap",
        title: "Questions et réponses prêtes",
        description:
          "Affiche la question qu'on vient de vous poser et trois réponses, pour qu'une question difficile pendant un pitch ne vous laisse pas sans voix.",
      },
      {
        icon: "layers",
        title: "Cinq modes de conversation",
        description:
          "Les modes général, vente, recrutement, support et réseautage couvrent l'éventail des appels d'un fondateur.",
      },
      {
        icon: "message",
        title: "Aide pour les conversations écrites",
        description:
          "Collez du texte ou importez des captures d'e-mails et de messages, et obtenez de l'aide pour répondre.",
      },
      {
        icon: "target",
        title: "Plan gratuit pour commencer",
        description:
          "Trois sessions en direct gratuites par mois, de 5 minutes maximum chacune, pour tester Tonvo sur vos appels les plus importants.",
      },
    ],
    stats: [],
    useCaseLinks: [
      "ai-copilot-for-sales-calls",
      "user-research-interview-insights",
      "remote-meeting-communication",
    ],
  },

  // ── 6. Services financiers ───────────────────────────────────────────
  {
    type: "industries",
    slug: "financial-services",
    title: "Tonvo pour conseillers financiers | Copilote clients",
    metaDescription:
      "Tonvo aide les conseillers à suivre leurs rendez-vous clients en direct et à trouver des mots clairs pour les sujets complexes. Pas un outil de conformité.",
    h1: "Des conversations clients plus claires, en direct",
    subtitle:
      "Tonvo suit les appels entre conseiller et client en direct, avec des réponses prêtes et une courte lecture du moment, pour que les conseillers expliquent les sujets complexes avec des mots simples.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "use-cases", slug: "customer-support-tone-detection", label: "Détection du ton" },
      { type: "industries", slug: "healthcare-communication", label: "Communication en santé" },
    ],
    targetKeywords: [
      "assistant de conversation pour conseiller financier",
      "copilote rendez-vous client conseiller",
      "expliquer des sujets complexes aux clients",
      "outil de communication conseiller client",
      "assistant ia pour conseillers financiers",
    ],
    faq: [
      {
        question: "Tonvo remplace-t-il notre enregistrement et notre contrôle de conformité ?",
        answer:
          "Non. Tonvo est un assistant de conversation pour le conseiller. Il ne remplace aucun enregistrement, aucune supervision ni aucun contrôle exigé par votre régulateur.",
      },
      {
        question: "Tonvo peut-il repérer qu'un client est perplexe ou hésite devant une recommandation ?",
        answer:
          "Il peut parfois signaler un moment d'hésitation, une question ou une objection. Les signaux sont disponibles avec Plus et Team, ils reposent sur le texte transcrit et peuvent être faux. Tonvo suggère, c'est le conseiller qui décide quand marquer une pause pour clarifier.",
      },
      {
        question: "Tonvo convient-il aux environnements financiers réglementés ?",
        answer:
          "Tonvo transcrit la conversation pour suggérer des réponses, et envoie ce texte à des prestataires de services d'IA pour le traiter (voir notre Politique de confidentialité). Les établissements financiers doivent l'évaluer au regard de leurs propres exigences réglementaires, de confidentialité et de traitement des données avant de l'utiliser.",
      },
      {
        question: "Que contient le résumé après session pour les conseillers financiers ?",
        answer:
          "Après une session, le résumé comprend le ton, ce qui a bien fonctionné, ce qui est à améliorer et des actions de suivi suggérées.",
      },
    ],
    industryName: "Services financiers",
    painPoints: [
      "Un client pose une question inattendue sur un produit, et le conseiller doit répondre clairement sur le moment",
      "Expliquer des sujets complexes en langage simple est difficile quand il faut aussi suivre les réactions du client",
      "Prendre des notes pendant un rendez-vous entre en concurrence avec l'écoute",
      "Les rendez-vous dans une autre langue ou à plusieurs personnes demandent un effort de plus à chaque réponse",
    ],
    howTonvoHelps: {
      label: "Comment ça marche",
      heading: "Un appui pour le conseiller sur le moment",
      body: "Tonvo ne rejoint pas l'appel. Il écoute par votre micro ou un onglet de navigateur partagé, ce qui lui permet de fonctionner à côté de Zoom, de Meet ou de tout appel dont vous pouvez partager le son, et affiche des réponses prêtes et une courte lecture du moment à côté de l'appel. Sur les plans payants, des signaux comme l'hésitation peuvent indiquer un moment qui mérite une pause. Après la session, le conseiller reçoit un résumé et des actions de suivi suggérées.",
    },
    features: [
      {
        icon: "shield",
        title: "Conçu pour assister, pas pour remplacer le contrôle",
        description:
          "Tonvo aide le conseiller sur le moment. Ce n'est pas un système d'enregistrement ni de supervision.",
      },
      {
        icon: "message",
        title: "Questions et réponses prêtes",
        description:
          "Affiche la question que le client vient de poser et trois réponses à adapter, pour vous aider à expliquer clairement.",
      },
      {
        icon: "eye",
        title: "Signaux avec Plus et Team",
        description:
          "Les plans payants signalent questions, hésitations et points clés de la conversation. Les signaux sont des suggestions et peuvent être faux.",
      },
      {
        icon: "bar-chart",
        title: "Résumés de session",
        description:
          "Après chaque session, un résumé avec le ton, ce qui a bien fonctionné et des suites suggérées.",
      },
    ],
    stats: [],
    useCaseLinks: [
      "customer-support-tone-detection",
      "remote-meeting-communication",
      "team-meeting-engagement-tracking",
    ],
  },

  // ── 7. Communication en santé ────────────────────────────────────────
  {
    type: "industries",
    slug: "healthcare-communication",
    title: "Tonvo pour la santé | Copilote de conversation non clinique",
    metaDescription:
      "Tonvo suit en direct les conversations non cliniques en santé, comme les appels administratifs et réunions d'équipe. Non conçu pour un usage clinique.",
    h1: "Des mots plus clairs pour les conversations non cliniques en santé",
    subtitle:
      "Tonvo suit en direct des conversations comme les appels de prise de rendez-vous, les réunions d'équipe et les sessions de formation, et suggère quoi dire. Il n'est pas conçu pour un usage clinique.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "use-cases", slug: "remote-meeting-communication", label: "Communication en réunion à distance" },
      { type: "industries", slug: "financial-services", label: "Services financiers" },
    ],
    targetKeywords: [
      "outil de communication pour personnel de santé",
      "assistant de conversation pour appels administratifs",
      "assistant réunion d'équipe santé",
      "traduction en direct pour appels",
      "copilote de conversation non clinique",
    ],
    faq: [
      {
        question: "Tonvo peut-il être utilisé dans des conversations cliniques ?",
        answer:
          "Non. Tonvo n'est pas conçu pour un usage clinique et n'est ni un outil médical, ni un outil de diagnostic, ni un outil d'enregistrement. Il est destiné aux conversations non cliniques, comme les appels administratifs, les réunions d'équipe et la formation.",
      },
      {
        question: "Tonvo est-il conforme aux réglementations sur la confidentialité des données de santé ?",
        answer:
          "Tonvo n'a pas été évalué au regard des réglementations sur la confidentialité des données de santé, comme HIPAA, et il n'est pas conçu pour un usage clinique. Il transcrit la conversation et envoie le texte à des prestataires de services d'IA. Ne l'utilisez pas pour des conversations contenant des informations de santé protégées, sauf si votre organisation l'a examiné et approuvé.",
      },
      {
        question: "Quels types de conversations en santé conviennent à Tonvo ?",
        answer:
          "Les conversations qui ne comportent pas d'informations de santé protégées : appels de prise de rendez-vous et de facturation, réunions d'équipe, sessions de formation, entretiens d'embauche et conversations dans une autre langue. Il suggère des réponses, et c'est la personne qui décide quoi dire.",
      },
      {
        question: "Comment Tonvo entend-il un appel ?",
        answer:
          "Par votre micro, ou par le son d'un onglet de navigateur que vous partagez. Tonvo ne rejoint pas les appels, ne s'intègre ni à Zoom ni à Meet, et n'enregistre ni ne conserve l'audio. Il vous revient d'informer les personnes avec qui vous parlez et de respecter les règles de votre organisation.",
      },
    ],
    industryName: "Santé et télésanté",
    painPoints: [
      "Les appels administratifs et de facturation amènent des questions inattendues qui appellent une réponse claire",
      "Les réunions d'équipe et les sessions de formation vont vite, et il est difficile de suivre et de contribuer en même temps",
      "Les conversations dans une autre langue demandent un effort de plus à chaque question et chaque réponse",
      "Formateurs et responsables enchaînent les sessions avec peu de temps pour revenir sur le déroulé de chacune",
    ],
    howTonvoHelps: {
      label: "Comment ça marche",
      heading: "Trouvez les mots dans les conversations du quotidien",
      body: "Ouvrez Tonvo dans votre navigateur et laissez-le écouter par votre micro ou un onglet partagé. Il affiche la question qui vient d'être posée, trois réponses utilisables et une courte lecture du moment, puis un résumé après la session. Ne l'utilisez pas pour des conversations contenant des informations de santé protégées, sauf si votre organisation l'a examiné et approuvé.",
    },
    features: [
      {
        icon: "message",
        title: "Questions et réponses prêtes",
        description:
          "Affiche la question qui vient d'être posée et trois réponses utilisables, pour les appels administratifs, les réunions et la formation.",
      },
      {
        icon: "globe",
        title: "Traduction en direct avec Plus et Team",
        description:
          "Suivez des conversations dans une autre langue. La transcription en direct couvre 10 langues, avec traduction en direct sur les plans payants.",
      },
      {
        icon: "check",
        title: "Résumé de session",
        description:
          "Après une session, lisez le ton, ce qui a bien fonctionné, ce qui est à améliorer et les actions de suivi suggérées.",
      },
      {
        icon: "shield",
        title: "Pas d'usage clinique",
        description:
          "Tonvo est un copilote de conversation, pas un outil clinique, et il n'a pas été évalué au regard des réglementations sur la confidentialité des données de santé.",
      },
    ],
    stats: [],
    useCaseLinks: [
      "customer-support-tone-detection",
      "remote-meeting-communication",
      "team-meeting-engagement-tracking",
    ],
  },

  // ── 8. Éducation et formation ────────────────────────────────────────
  {
    type: "industries",
    slug: "education-training",
    title: "Tonvo pour formateurs | Copilote cours et réunions",
    metaDescription:
      "Tonvo suit vos cours en ligne, ateliers et réunions de parents en direct, affiche la question posée et propose des réponses. Micro ou onglet.",
    h1: "Trouvez les bons mots quand vos apprenants posent des questions",
    subtitle:
      "Des cours en ligne aux ateliers et aux réunions parents-professeurs, Tonvo suit la conversation, affiche la question qui vient d'être posée et suggère des réponses utilisables.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "use-cases", slug: "team-meeting-engagement-tracking", label: "Suivi de l'engagement en réunion" },
      { type: "use-cases", slug: "remote-meeting-communication", label: "Communication à distance" },
      { type: "industries", slug: "consulting-firms", label: "Cabinets de conseil" },
    ],
    targetKeywords: [
      "assistant ia pour enseignants",
      "répondre aux questions des élèves en direct",
      "assistant cours en ligne",
      "aide réunion parents professeurs",
      "assistant de conversation pour formateur en entreprise",
    ],
    faq: [
      {
        question: "Comment Tonvo aide-t-il les enseignants et formateurs pendant une session ?",
        answer:
          "Tonvo suit la conversation en direct et affiche la question qu'un apprenant vient de poser, trois réponses utilisables et une courte lecture du moment. Vous décidez quoi dire, et il peut se tromper : vérifiez vous-même tout ce qui est factuel.",
      },
      {
        question: "Les formateurs en entreprise peuvent-ils utiliser Tonvo ?",
        answer:
          "Oui, pour les parties conversationnelles d'une session, comme les questions et la discussion. Tonvo suit une conversation et vous aide à trouver vos mots. Il ne mesure pas l'engagement des apprenants et ne fournit pas de données de participation.",
      },
      {
        question: "Tonvo fonctionne-t-il pour les sessions de grands groupes ?",
        answer:
          "Il fonctionne avec le son qu'il entend par votre micro ou un onglet de navigateur partagé. Il est conçu pour suivre une conversation, pas pour suivre chaque participant d'une classe. Sur les plans payants, un équilibre de parole montre qui s'exprime.",
      },
      {
        question: "Quel plan convient le mieux à un enseignant ou à un formateur ?",
        answer:
          "Commencez avec Free : 3 sessions en direct par mois, de 5 minutes maximum chacune. Plus coûte 19 $ par mois pour des sessions illimitées et la traduction en direct, utile pour les groupes multilingues. Les plans payants bénéficient d'une garantie de remboursement de 7 jours.",
      },
    ],
    industryName: "Éducation et formation en entreprise",
    painPoints: [
      "Un apprenant pose une question inattendue en plein cours, et la réponse doit être claire sur le moment",
      "Dans les grandes sessions virtuelles, les questions arrivent à l'oral et par le chat pendant que vous expliquez",
      "Les réunions parents-professeurs et avec les élèves peuvent être délicates, et trouver les bons mots compte",
      "Enseigner dans une seconde langue ou à un groupe multilingue demande un effort de plus",
      "Les formateurs enchaînent les sessions avec peu de temps pour revenir sur le déroulé de chacune",
    ],
    howTonvoHelps: {
      label: "Comment ça marche",
      heading: "Suivez les questions, quelle que soit la session",
      body: "Tonvo ne rejoint pas votre session Zoom, Meet ou Teams. Il écoute par votre micro ou un onglet de navigateur que vous partagez, et affiche la question qui vient d'être posée, trois réponses utilisables et une courte lecture du moment. Ensuite, le résumé de session liste le ton, ce qui a bien fonctionné, ce qui est à améliorer et les actions de suivi.",
    },
    features: [
      {
        icon: "message",
        title: "Questions et réponses prêtes",
        description:
          "Affiche la question qu'un apprenant vient de poser et trois réponses à adapter, pour que vous répondiez clairement.",
      },
      {
        icon: "globe",
        title: "Traduction en direct avec Plus et Team",
        description:
          "Suivez une conversation dans une autre langue. La transcription en direct couvre 10 langues, avec traduction en direct sur les plans payants.",
      },
      {
        icon: "monitor",
        title: "Analyse d'écran avec Team",
        description:
          "Le plan Team lit ce que vous partagez à l'écran, comme des messages de chat et des e-mails, pour vous aider à répondre.",
      },
      {
        icon: "check",
        title: "Résumé de session",
        description:
          "Après chaque session, lisez le ton, ce qui a bien fonctionné, ce qui est à améliorer et les actions de suivi suggérées.",
      },
    ],
    stats: [],
    useCaseLinks: [
      "team-meeting-engagement-tracking",
      "remote-meeting-communication",
      "sdr-onboarding-with-call-review",
    ],
  },
];
