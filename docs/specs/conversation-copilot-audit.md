# Tonvo : audit et repositionnement « copilote de toutes les conversations »

Date : 2026-10-21 · Branche : `feat/conversation-copilot` · Positionnement détaillé : `marketing/brand/BRAND-PRODUCT-BIBLE.md` section 0.

Méthode : lecture du code (pas de README ni de noms de fichiers pris pour acquis), puis vérification dans un navigateur réel sur un build de production local. Ce qui n'a pas pu être exécuté est marqué **non vérifié**.

## 1. Architecture (résumé)

- Next.js 16 (App Router), React 19, TypeScript strict, Tailwind 4, framer-motion. i18next, 10 locales (`src/i18n/locales`, `en` embarquée, les autres chargées à la demande, repli sur `en`).
- Auth : **Firebase** (identité seule). Les routes serveur vérifient le JWT elles-mêmes. Base : **Supabase**, uniquement côté serveur (clé service). Paiement : Stripe (checkout, portail, webhook).
- Session live : capture micro et/ou audio d'onglet (`getDisplayMedia`) → AssemblyAI streaming (token court délivré par `/api/transcribe-token`) → `/api/analyze` (Claude Haiku, une requête à la fois, tours fusionnés) → panneau copilote (PiP Chrome desktop, popup, ou inline sur mobile) → `/api/summarize` (Sonnet) à la fin.
- Desktop Tauri : simple coque qui ouvre le site distant, pas de capture native.

## 2. État réel des fonctionnalités

| Capacité | État (lecture du code) |
|---|---|
| Réponses à dire en direct (3 options) + question détectée | Implémentée. Non vérifiée à l'exécution (pas de micro ni de clé en environnement de test). |
| Transcription 10 langues, mode double flux « moi / eux » | Implémentée. Dépend du partage de l'audio d'onglet par la personne. |
| Traduction en direct | Implémentée, interface limitée à Plus/Team. **Les routes serveur n'appliquent pas la limite de plan.** |
| Comprendre ce que l'autre veut dire | Partielle : ligne « insight » et zone « Ask the copilot » (résumé glissant seulement). |
| Analyse de texte / captures (`/analyze-text`) | Implémentée. Résultat non enregistré. |
| Rapport après session + actions de suivi | Implémenté. Pas d'export PDF/CSV (promis auparavant, n'existe pas). |
| Analyse d'écran | Implémentée, offre Team seulement. Cadrage « attraction » pour les chats. |
| Mode Prépa (`/api/copilot-prep`) | **Mort côté interface** (jamais affiché). L'appel automatique depuis la page session est supprimé dans cette branche. |
| Notes / mémoire | N'existe pas. |
| Onboarding | N'existait pas. Ajouté (voir section 4). |
| Téléphone / tablette | Web seulement. L'autre côté d'un appel téléphonique n'est jamais capté (haut-parleur + micro). iOS Safari ancien : capture probablement cassée (type MIME), **non vérifié**. |
| Quota gratuit (3 sessions par mois, 5 min par session) | Appliqué surtout **côté navigateur** : contournable par appel direct aux API. Voir section 5. |

## 3. Positionnement retenu

Catégorie : copilote de conversation par IA. Promesse : « Your copilot for every conversation. » Ton : humain, calme, précis. Cas d'usage montrés : uniquement ceux du tableau ci-dessus marqués comme implémentés. « Préparer une conversation », « notes » et toute métrique de résultat (close rate) ne sont pas annoncés.

## 4. Ce que cette branche change

**Vérité des claims (priorité 1 à 3)**
- Pages SEO programmatiques (34) : 16 blocs de statistiques inventées et 8 témoignages nominatifs supprimés ; 76 liens vers des pages inexistantes retirés ; phrases chiffrées sans source retirées des guides ; pages finance et santé réécrites (elles prétendaient à tort ne pas analyser le contenu et être « compliance-friendly ») ; page « Invisible Copilot Mode » réécrite d'après le comportement réel (fenêtre séparée **sur Plus et Team seulement** ; sur Free les réponses s'affichent dans la page ; visible si l'on partage tout l'écran). Affirmations produit inventées retirées des autres pages (rejoindre un appel Zoom, analyse de la hauteur de voix, tableaux de bord Team, détails de modèle).
- Prix : noms Free / Plus / Team ; fonctionnalités alignées sur `plan-features.ts` (suppression de API, SSO, playbook, dashboard d'équipe, export PDF, close-rate) ; la landing lit désormais l'i18n comme `/pricing` ; la limite de 5 minutes du plan gratuit est enfin dite.
- Confidentialité : ajout d'AssemblyAI, Upstash et Meta aux sous-traitants ; la rétention de 7 jours est décrite comme un masquage de l'historique (c'est ce que fait le code).

**Positionnement** : landing, FAQ (7 questions, dont téléphone et vie privée), métadonnées, JSON-LD (FAQ générée depuis `en.json`), manifeste, image de partage (`tonvo-og-v2.png`), prompts IA généralisés (plus de « prospect » imposé), libellés du tableau de bord et de la page session.

**Produit** : composant `OnboardingChooser` (une fois par compte, avant la première session, sans modale) ; événement `onboarding_choice` ; chaînes en dur de la page session passées en i18n ; titre de page non écrasé par `DynamicTitle` ; bug d'espacement de la section « problème ».

**Sécurité légère** : `language` d'`analyze-conversation` limité à une liste ; six routes ne journalisent plus la sortie brute du modèle.

**Garde-fous** : `src/lib/copy-guards.test.ts` (parité EN/FR, tirets, claims interdits, « invisible » et anciens noms de plans bannis, cohérence prix/plans, toute clé `t("...")` statique du code existe dans `en.json`) et `src/data/seo/seo-data.test.ts` (pas de statistique ni témoignage, pas de lien cassé, pas d'affirmation produit non soutenue, fenêtre séparée toujours qualifiée Plus/Team).

**Revue indépendante** (agent sans accès à mes conclusions) : aucun défaut critique ; 5 défauts élevés corrigés (nom « Pro » resté dans l'app, fenêtre séparée fausse pour Free, textes « invisible » restants, affirmations SEO restantes, phrases orphelines dans les guides) et 5 moyens (onboarding affiché après un échec de chargement, sous-traitant Anthropic et captures d'écran, ancien texte « close rate » dans d'autres locales, garantie « tous les plans »).

## 5. Écarts, risques et bloqueurs restants

1. **Vidéo hero** (`public/vsl/tonvo-vsl.mp4`) : texte incrusté « Never freeze. on a sales call again. ». À remonter pour le nouveau positionnement.
2. **Quota gratuit côté serveur** : `/api/subscription` « increment » est appelable par le client, `/api/transcribe-token`, `/api/analyze` et `/api/summarize` ne consultent pas le compteur, la durée de 5 min n'est vérifiée que dans le navigateur. Coût exposé. Correctif recommandé en priorité.
3. **Injection de prompt** : huit routes IA n'assainissent pas `language` / contexte ou n'ont qu'une limite IP par instance (`copilot-ask`, `conversation-context`, `summarize-screen`, `translate`, flux de traduction…). Seul `analyze-conversation` est corrigé ici.
4. **Données** : aucune purge réelle des sessions gratuites au-delà de 7 jours (masquage en lecture), pas d'endpoint de suppression de compte (bouton = `alert()`), export et suppression par e-mail. Pas de migration destructive tentée.
5. **Consentement de l'autre personne** : aucune mécanique produit ; les Conditions renvoient la responsabilité à l'utilisateur. Les textes publics recommandent maintenant de prévenir les interlocuteurs.
6. **Traductions** : EN et FR faites. Les 8 autres locales retombent sur l'anglais pour les clés réécrites (environ 140 clés par locale : hero, FAQ, prix, onboarding, bandeaux de session). Visible pour le trafic non EN/FR tant que la traduction n'est pas faite. Le JSON-LD FAQ reste en anglais.
7. **Accessibilité** : zoom bloqué (`maximumScale`, `userScalable`) et `<html lang>` fixé à `en` côté serveur, **non modifiés** (retirer le blocage du zoom peut provoquer le zoom automatique sur les champs iOS, à tester sur appareil). Pas de lien d'évitement.
8. **Lint cassé avant ma branche** : `npm run lint` lance `next lint`, retiré de Next 16, sans ESLint ni configuration.
9. **Tauri** : `shortDescription` encore « sales co-pilot » (demande une release desktop).
10. **Pages SEO** : texte encore en anglais seulement et parfois axé « sales » ; réécriture complète à planifier. Les liens `useCasesForFeature` sont du texte libre, pas des slugs.

## 6. Prochaines priorités (impact / effort)

1. Quota et durée côté serveur (impact élevé, effort moyen).
2. Remonter la vidéo hero (impact élevé, effort élevé).
3. Traduire les 8 locales restantes (impact moyen, effort faible avec relecture).
4. Assainir les 8 routes IA restantes et ajouter des tests de route (impact moyen).
5. Réparer ou remplacer le script lint (effort faible).
6. Mode Prépa avec une vraie interface, puis l'annoncer (impact moyen, effort moyen).
