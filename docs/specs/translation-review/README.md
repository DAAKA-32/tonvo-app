# Translation review sheets

All translations (interface, search-result texts, legal pages, the French SEO pages) were produced by AI with automated checks on variables, lengths and punctuation. **None has been reviewed by a native speaker.**

Send one sheet per language to a native reviewer. Priority: A (search results) and B (home page), then C and D, then the legal pages (E).

| Language | Sheet | Rows to review | Legal texts | Status |
|---|---|---|---|---|
| Français | [fr.md](fr.md) | 107 | 202 | to review |
| Español | [es.md](es.md) | 107 | 202 | to review |
| Deutsch | [de.md](de.md) | 107 | 202 | to review |
| Português | [pt.md](pt.md) | 107 | 202 | to review |
| Italiano | [it.md](it.md) | 107 | 202 | to review |
| Nederlands | [nl.md](nl.md) | 107 | 202 | to review |
| 中文 (简体) | [zh.md](zh.md) | 107 | 202 | to review |
| 日本語 | [ja.md](ja.md) | 107 | 202 | to review |
| 한국어 | [ko.md](ko.md) | 107 | 202 | to review |

Not covered by a sheet: the 34 French SEO pages (`src/data/seo/fr/`, about 35,000 words) and the English originals. Review those with the same checklist, titles and descriptions first.

After a review: apply the corrections in `src/i18n/locales/<lang>.json`, then run `npm run i18n:review` to refresh the sheets, and change the status here.

Regenerate: `npm run i18n:review`.
