# Link previews (Open Graph / X cards)

## Where things live

- `src/lib/seo.ts` is the single source of truth: home title and description, the social image, and
  `pageMetadata()`, which every public page uses for title, description, canonical, `og:*` and `twitter:*`.
  Do not hand-write `openGraph` objects in pages: Next.js replaces the parent object, so the image would be lost.
- `public/og/tonvo-og-v2.png` is the social image (1200 x 630, opaque PNG, about 110 KB). The older `tonvo-og.png` is kept so links already cached by platforms still resolve.
- `scripts/og/og-card.html` is the image design. `scripts/og/render-og.mjs` renders it.

## Regenerate the image

```bash
node scripts/og/render-og.mjs   # needs network for the Inter web font
```

When the design changes, **give the file a new name** (for example `tonvo-og-v2.png`) and update
`OG_IMAGE.url` in `src/lib/seo.ts`. Platforms cache previews by image URL, so a new name forces a fresh fetch.
Keep important content inside the centre 630 x 630 area: some apps crop the card to a square.

## Refresh a platform's cached preview after a change

Platforms keep their own copy of a page's preview. Deploying does not update it.

| Platform | How to refresh |
|---|---|
| Facebook, Messenger, Instagram DMs | Sharing Debugger: https://developers.facebook.com/tools/debug/ then "Scrape Again" |
| LinkedIn | Post Inspector: https://www.linkedin.com/post-inspector/ then "Inspect" (re-scrapes the URL) |
| X (Twitter) | No public validator anymore; the card refreshes after about 7 days, or share the URL with a query such as `?v=2` |
| WhatsApp | Caches per URL on each device; share the URL with a query such as `?v=2` to see the new card right away |
| Telegram | Send the URL to @WebpageBot in Telegram to refresh |
| Slack | Unfurls are cached for about 30 minutes; a query such as `?v=2` forces a fresh unfurl |
| Discord | Cached per URL; add a query such as `?v=2` to force a new embed |
| iMessage | Fetched by the sender's device when the link is sent; no shared cache to clear |

Query strings do not change the canonical URL: every page declares its own canonical without them.

## Check

```bash
npx vitest run src/lib/seo.test.ts   # every public page: clean text, image present, canonical == og:url
curl -s https://tonvo.co/ -A "facebookexternalhit/1.1" | grep -E 'og:|twitter:'
```
