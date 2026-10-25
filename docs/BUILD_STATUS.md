# NipponVerse — Build Status

Last updated: 2026-10-25

## Environment facts (verified)
- Sandbox has NO network for bash: `npm install`, `npm run build`, and `vitest` cannot be run here.
- Therefore nothing below is claimed as "built" or "tested" until you run it (GitHub Codespaces or Vercel build log).

## Batches
| # | Batch | Status |
|---|-------|--------|
| 0 | Plan + status docs | DONE (this file, PRODUCT_PLAN.md) |
| 1 | Research docs (RESEARCH.md, CONTENT_SOURCES.md) | DONE for JLPT lists, kanji licences, speech support, image licensing; other topics listed as not yet researched |
| 2 | Project config (package.json, vite, tsconfig, tailwind, index.html, .gitignore, minimal shell) | WRITTEN, NOT YET BUILT (versions unverified: no network here) |
| 3 | Core: types, storage (versioned), i18n EN/UR, router, layout, design system | WRITTEN, NOT YET BUILT OR TESTED |
| 4 | Hiragana + katakana data, lesson pages, kana quiz | WRITTEN; logic verified offline, UI NOT YET BUILT |
| 5 | SRS (SM-2 style), review page, review limits, kana cards | WRITTEN; scheduler verified offline, UI NOT YET BUILT. Other quiz types move to batches 6-9 with their content |
| 6 | Vocabulary explorer (49 words, 14 original SVGs, manifest, search, favorites, detail page, listen, review cards) | WRITTEN; data/search/validator verified offline, UI NOT YET BUILT |
| 7 | Grammar lessons, reading, dialogues | PENDING |
| 8 | Kanji (verified dataset), stroke order, dictionary | PENDING |
| 9 | JLPT paths, writing studio, settings import/export | PENDING |
| 10 | Validation script, tests, deployment/testing/limitations docs | PENDING |

## Next step
(Batches 3-4) Run `npm install && npm run typecheck && npm test && npm run build`; report errors. Then Batch 4 (hiragana/katakana data).

Previous: Run `npm install && npm run build` (Codespaces) and report any error. Then Batch 3.
