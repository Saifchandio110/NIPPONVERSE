# Testing

## Automated tests (`npm test`, Vitest)
| File | What it checks |
|---|---|
| `src/lib/kana.test.ts` | script conversion, romaji (small tsu, long vowels, combinations), kana content validation, quiz builder invariants |
| `src/lib/storage.test.ts` | import/export round trip, clamping, rejecting bad or newer files, streak calculation |
| `src/lib/srs.test.ts` | interval growth, ease floor, month/year/daylight-saving boundaries, daily limits, save/load |
| `src/lib/vocab.test.ts` | vocabulary validation and search (kanji, kana, katakana, romaji, English, Urdu) |
| `src/lib/grammar.test.ts` | grammar validation, token rebuilds, answer keys, mistake review |
| `src/lib/romaji.test.ts` | sentence romaji against every example's kana reading |

Content validators also run inside these tests: kana, vocabulary and grammar data must pass or the tests fail.

## What was actually run, and by whom
- In the project owner's GitHub Codespace (Vitest 2.1.9, Vite 5.4.21): `typecheck`, `test` (34 tests at the time), `check:images` and `build` passed after two type errors were fixed. After the grammar batch the owner reported no errors; after the romaji update the owner reported it working. Test counts for those later runs were not reported.
- In the authoring sandbox (no network): the same test files were executed under a small Node stand-in for Vitest (47 tests, all passing) and strict TypeScript was run on non-React code. That is not a substitute for the real run above.

## Not automated (do by hand)
- Click through every page on desktop and a phone-width window.
- Urdu mode: right-to-left layout, text not clipped.
- Keyboard only: Tab through each page; number keys in quizzes; Space/Enter and 1-4 in review.
- Screen reader spot check (labels on buttons, image alt text).
- Speech: with and without a Japanese voice installed; message appears when none.
- Dark mode contrast.
- Reload persistence; export, reset, import.

No end-to-end tests, component tests, or accessibility audit tools have been run.
