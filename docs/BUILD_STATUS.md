# NipponVerse — Build Status

Last updated: 2026-10-25

## Verified by the owner's run in GitHub Codespaces (2026-10-25)
`npm run typecheck`, `npm test` (Vitest 2.1.9: 4 files, 34 tests passed), `npm run check:images` (14 images OK) and `npm run build` (Vite 5.4.21, 1608 modules, built in 7.19 s) all succeeded after two type errors were fixed (tsconfig ES2021, AppState.recordQuiz spread).
NOT yet verified: behaviour in a real browser (`npm run dev`), keyboard/screen-reader checks, speech, dark mode, Urdu RTL layout.

## Environment facts (verified)
- Sandbox has NO network for bash: `npm install`, `npm run build`, and `vitest` cannot be run here.
- Therefore nothing below is claimed as "built" or "tested" until you run it (GitHub Codespaces or Vercel build log).

## Batches
| # | Batch | Status |
|---|-------|--------|
| 0 | Plan + status docs | DONE (this file, PRODUCT_PLAN.md) |
| 1 | Research docs (RESEARCH.md, CONTENT_SOURCES.md) | DONE for JLPT lists, kanji licences, speech support, image licensing; other topics listed as not yet researched |
| 2 | Project config (package.json, vite, tsconfig, tailwind, index.html, .gitignore, minimal shell) | BUILT OK in Codespaces (versions from package.json installed without error) |
| 3 | Core: types, storage (versioned), i18n EN/UR, router, layout, design system | BUILT OK; unit tests pass; browser behaviour not yet checked |
| 4 | Hiragana + katakana data, lesson pages, kana quiz | BUILT OK; unit tests pass; browser behaviour not yet checked |
| 5 | SRS (SM-2 style), review page, review limits, kana cards | BUILT OK; unit tests pass; browser behaviour not yet checked. Other quiz types move to batches 6-9 with their content |
| 6 | Vocabulary explorer (49 words, 14 original SVGs, manifest, search, favorites, detail page, listen, review cards) | BUILT OK; unit tests pass; browser behaviour not yet checked |
| 7 | Grammar lessons, reading, dialogues | PENDING |
| 8 | Kanji (verified dataset), stroke order, dictionary | PENDING |
| 9 | JLPT paths, writing studio, settings import/export | PENDING |
| 10 | Validation script, tests, deployment/testing/limitations docs | PENDING |

## Next step
(Batches 3-4) Run `npm install && npm run typecheck && npm test && npm run build`; report errors. Then Batch 4 (hiragana/katakana data).

Previous: Run `npm install && npm run build` (Codespaces) and report any error. Then Batch 3.
