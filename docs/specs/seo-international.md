# SEO international et localisation de Tonvo

Branche `feat/seo-international` (empilée sur `feat/conversation-copilot`, PR #19). Positionnement : voir `docs/specs/conversation-copilot-audit.md`.

## 1. Architecture des URL

| Zone | URL | Langue |
|---|---|---|
| Pages publiques (accueil, prix, à propos, légal, hubs et pages SEO) | `/about` (anglais), `/fr/about`, `/es/about`... | dans l'URL, `<html lang>` rendu côté serveur |
| Application connectée (`/dashboard`, `/session`, `/plans`, `/login`...) | une seule URL par page | choisie par l'utilisateur (navigateur) |

- `src/app/[locale]/` : pages publiques, avec son propre layout racine (`<html lang>` correct, fournisseur i18n par requête).
- `src/app/(app)/` : l'application, layout racine inchangé (langue gardée dans `localStorage`).
- `src/middleware.ts` (sous `src/`, sinon `next dev` l'ignore) : l'anglais est servi depuis `/en` par réécriture (l'URL reste `/about`). `/en/...` est redirigé en 308 vers l'URL sans préfixe ; `/fr/dashboard` (URL localisée d'une page non publique) est redirigé en 308 vers `/dashboard`.
- `src/i18n/locales-config.ts` : liste des langues, pages disponibles par langue, `localePath`, `publicHref`. C'est la seule source de vérité du routage.
- `/pricing` est maintenant la page publique (rendue côté serveur, indexable). L'ancienne page d'abonnement connectée est devenue `/plans` (`noindex`).

## 2. Ce qui est rendu côté serveur

La page d'accueil et `/pricing` ne contenaient presque rien dans le HTML initial avant ce chantier (47 caractères, aucun `<h1>`, aucun lien) : la page attendait la connexion Firebase avant de s'afficher. Elles s'affichent maintenant toujours ; un visiteur déjà connecté est redirigé vers le tableau de bord par un effet côté client.

## 3. Langues et couverture

| Page | Langues |
|---|---|
| Accueil, prix, à propos, confidentialité, conditions, cookies, mentions légales | les 10 : en, fr, es, de, pt, it, nl, zh, ja, ko |
| Hubs (`/use-cases`, `/features`, `/industries`, `/compare`, `/guides`) et leurs 34 pages | en, fr |
| `/blog` | en seulement, `noindex` (les articles n'existent pas) |

Une page n'est listée (hreflang, plan du site, sélecteur) que dans les langues où elle existe réellement : `/es/use-cases` renvoie 404, et un lien depuis une page espagnole vers `/use-cases` pointe vers la page anglaise. Les autres langues n'ont pas de pages SEO programmatiques : les traduire demande les cinq fichiers de données de `src/data/seo/fr/` dans la nouvelle langue (même slugs) et une ligne dans `src/data/seo/registry.ts`.

**Qualité des traductions** : toutes les traductions (interface, textes SEO, pages françaises) ont été produites par IA avec des consignes strictes et contrôlées automatiquement (variables, longueurs de titres, ponctuation). **Aucune n'a été relue par un locuteur natif.** À faire relire avant de compter dessus pour le référencement, en priorité les titres et descriptions (`seo.*`) et la page d'accueil.

## 4. SEO technique

- **hreflang** : réciproque, pour toutes les langues d'une page, plus `x-default` (anglais). Aucun hreflang pour une page qui n'existe que dans une langue.
- **Canonical** : chaque page a le sien (jamais l'anglais pour toutes les langues), absolu, identique à `og:url`.
- **Plan du site** (`src/app/sitemap.ts`) : 148 URL, une par langue et par page existante, avec les alternatives hreflang. Pas de pages privées, ni `/login`, `/plans`, `/blog`. Dates fixes, pas l'heure du build.
- **robots.txt** : chemins sans barre finale (`/dashboard` et non `/dashboard/`, qui ne bloquait pas la page elle-même), `/plans` et `/demo` ajoutés. Le groupe application porte aussi `noindex`.
- **Données structurées** : Organization et WebSite (localisés) sur toutes les pages publiques, SoftwareApplication sur l'accueil, BreadcrumbList et WebPage/Article sur les pages SEO. Retirés : FAQPage (Google ne l'affiche plus pour ce type de site), HowTo (supprimé par Google), Product pour un concurrent.
- **Titres de page** : `DynamicTitle` ne s'applique plus qu'aux pages de l'application ; les titres des pages publiques viennent du serveur et ne sont plus écrasés.

## 5. Contrôles automatiques

- `src/lib/seo.test.ts` : titres et descriptions propres et de bonne longueur dans les 10 langues, hreflang réciproque, plan du site (aucune page privée, alternatives présentes dans le plan), robots, middleware (réécritures, redirections sans chaîne).
- `src/lib/copy-guards.test.ts` : parité des clés avec l'anglais pour les 10 langues, mêmes variables `{{x}}`, pas de tiret dans le texte marketing, toute clé `t("...")` statique du code existe.
- `src/data/seo/seo-data.test.ts` : les pages françaises existent pour chaque page anglaise et ne sont pas des copies.

## 6. Revue indépendante et corrections

Un agent sans accès à mes conclusions a audité le chantier (148 URL du plan du site chargées et contrôlées, routage, i18n, tests). Il a trouvé :

- **Critique, corrigé** : une URL avec une langue en majuscules (`/FR`) était acceptée par la route, puis le layout répondait 404 et cette 404 **écrasait la page réelle `/fr` dans le cache** (l'accueil, `/fr` et `/es` devenaient 404 pour tout le monde jusqu'au prochain build). Le middleware redirige maintenant toute casse non minuscule en un seul saut (`/FR` vers `/fr`, `/Fr/Use-Cases/X` vers `/fr/use-cases/x`) ; les chemins de l'application gardent leur casse. Tests ajoutés. Non vérifié : si Vercel se comporte comme `next start` ici.
- **Corrigés** : URL d'annulation Stripe (`/pricing` vers `/plans`), sélecteur de langue accessible (aria-expanded, Échap, fermeture au changement de focus, drapeaux masqués, élément courant), libellé « fil d'Ariane » traduit, droits d'auteur ja/ko, période de prix (« /month ») traduite, page 404 de marque, charge de la page allégée (le navigateur ne reçoit plus que les textes de la page : `/de` de 185 à 131 Ko, `/fr/pricing` de 132 à 75 Ko ; un test vérifie que le code client n'utilise que les textes envoyés).

## 7. Points traités après la revue

1. **Cookies** : le Meta Pixel ne se charge plus qu'après un « Accepter » explicite (`src/lib/consent.ts`, `ConsentBanner`, `MetaPixel`). Un signal Global Privacy Control ou Do Not Track vaut refus et supprime la bannière. Pas d'image de repli `<noscript>`. Le miroir serveur (Conversions API) ne part que si le pixel navigateur a produit un identifiant d'événement : un seul interrupteur. La politique de cookies, celle de confidentialité et la bannière sont réécrites dans les 10 langues ; la page des cookies a un bouton pour revenir sur son choix. Vérifié dans un navigateur sur un build de production avec un identifiant de pixel factice : aucune requête vers Meta avant la réponse, aucune après un refus, une requête `fbevents.js` après « Accepter », la bannière revient depuis la page des cookies, aucune bannière ni requête avec GPC. La bannière n'apparaît que si `NEXT_PUBLIC_FB_PIXEL_ID` est défini (sans cela, aucun pixel, donc rien à consentir).
2. **Prix** : toutes les langues affichent des dollars (`src/lib/currency.ts`, `EUR_LANGUAGES` vide), la facturation Stripe étant en USD uniquement. Vérifié sur `/fr`, `/de`, `/es`, `/it`, `/nl/pricing`. Pour afficher des euros il faudra d'abord créer des prix en euros côté Stripe.
3. **Slug** : `invisible-copilot-mode` devient `separate-window-copilot` (EN et FR). Redirections permanentes (308) de l'ancienne adresse vers la nouvelle, avec et sans `/fr`, vérifiées ; le plan du site ne liste que le nouveau slug ; un test garde les anciens liens.
4. **Relecture native** : une fiche par langue (`docs/specs/translation-review/<langue>.md`, générée par `npm run i18n:review`) : titres et descriptions, accueil, tarifs, bannière et cookies, anglais en regard, colonne à remplir. Les textes juridiques sont à lire dans le fichier de langue.
5. **Mesure** : l'analytics maison découpe maintenant l'entonnoir par langue (langue de la première page publique vue, `en` sans préfixe) : tableau « Par langue » dans `/admin/analytics`, test dans `analytics.test.ts`.

## 8. Ce qui reste, et ce que je ne peux pas faire d'ici

1. **Relecture par un natif** des 9 langues : à faire par vous ou un prestataire, fiches prêtes. Les textes juridiques traduits par IA n'ont jamais été relus par un juriste et portent la date de la version anglaise.
2. **Search Console, positions, trafic, Core Web Vitals** : aucun accès. À brancher après la mise en ligne (propriété de domaine, envoi du plan du site `/sitemap.xml`). Aucune donnée de langue n'existe avant le déploiement.
3. **Pages SEO** : seulement en anglais et en français (34 pages, environ 35 000 mots en français). Une page n'est listée (hreflang, plan du site, sélecteur) que là où elle est traduite : `/es/use-cases` renvoie 404. Les étendre aux 8 autres langues est un chantier à part (écriture et relecture de 8 x 34 pages), non fait.
4. L'image de partage (`tonvo-og-v2.png`) est en anglais pour toutes les langues.
5. 404 : la page de marque n'existe qu'en anglais pour les adresses que le routeur rejette avant le rendu (`/xx`, `/es/use-cases`, `/fr/blog`) ; une page localisée est prête pour les autres cas.
6. Slugs des pages SEO en anglais dans toutes les langues.
7. Mentions « Support prioritaire » (offres Plus et Team) cohérentes avec `plan-features.ts` ; lignes de la carte Enterprise (« revue sécurité », « conditions sur mesure ») à confirmer.
8. Correctif de casse des URL (section 6) : non vérifié sur Vercel, seulement avec `next start`.
9. **Rien n'est commité, poussé ni déployé.** La PR #19 (`feat/conversation-copilot`) n'est pas fusionnée ; cette branche (`feat/seo-international`) s'appuie dessus.
