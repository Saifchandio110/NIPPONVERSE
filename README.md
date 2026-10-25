# NipponVerse — Learn Japanese. Understand Japan.

A free Japanese learning website for English and Urdu speakers. It runs entirely in the browser: no account, no server, no paid API. Progress is saved in your browser (localStorage).

> Status: early version. See [docs/KNOWN_LIMITATIONS.md](docs/KNOWN_LIMITATIONS.md) for exactly what is and is not built.

## What works today
- **Dashboard** driven by your real activity: streak, daily goal, weekly chart, recommended next lesson, review queue, weak areas, recent words.
- **Hiragana and katakana:** full charts (basic, voiced, half-voiced, combinations, katakana foreign-sound combinations), example words with English and Urdu meanings, notes, commonly confused characters, listen buttons, and four quiz types.
- **Vocabulary explorer:** 49 beginner words in 11 topics, search (Japanese, kana, romaji, English, Urdu), filters, favorites, 14 original illustrations, detail pages with example sentences.
- **Grammar academy:** 6 beginner lessons with English and Urdu explanations, word-by-word breakdowns, common mistakes, practice questions, and a mistakes review.
- **Romaji (pronunciation in English letters)** under Japanese words and sentences, with a pronunciation guide. Can be switched off in Settings.
- **Spaced review** (SM-2 style: Again / Hard / Good / Easy) for kana and vocabulary.
- **English and Urdu interface** (Urdu is right-to-left), dark mode, text size, backup export/import, reset with confirmation.

Not built yet: kanji, dictionary, reading academy, listening/speaking lab, JLPT paths, writing studio, culture lessons. Details in the limitations file.

## Run it
Requires Node.js 20 or newer.
```bash
npm install
npm run dev        # development server
npm run typecheck  # TypeScript check
npm test           # unit tests (Vitest)
npm run check:images
npm run build      # production build into dist/
npm run preview    # serve the built site locally
```
On a phone without a terminal, use a GitHub Codespace (see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)).

## Deploy
GitHub Pages (a workflow is included) or Vercel. Step-by-step instructions: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). Deployment has not been verified yet; follow the checklist there after your first deploy.

## Project layout
```
src/
  components/   shared UI (Quiz, Layout, PronunciationGuide, ...)
  data/         kana, vocabulary, grammar, image manifest, romaji lexicon
  i18n/         English and Urdu interface text
  lib/          logic: kana/romaji, quizzes, spaced repetition, search, storage, validators, tests
  pages/        one file per page
  state/        app state and saving
public/images/vocab/   original SVG illustrations
docs/           research, plan, status, deployment, testing, limitations
```

## Add content
- **Vocabulary word:** add a row in `src/data/vocabulary/words.ts` (id, word, kana reading, part of speech, topic, English, Urdu, example sentence with kana reading, English, Urdu, optional image key). Run `npm test`: the validator checks required fields, Urdu script, reading consistency, duplicates and image references.
- **Sentence romaji:** if a new sentence shows no romaji, add its new words to `src/data/lexicon.ts` (particles use their spoken sound: は = wa, を = o, へ = e).
- **Picture:** put the file in `public/images/vocab/`, then add it to `src/data/images/manifest.ts` with alt text (English and Urdu), source, author and licence. Only use material you created or have a licence for. See [docs/CONTENT_SOURCES.md](docs/CONTENT_SOURCES.md).
- **Grammar lesson:** add an object to `src/data/grammar/lessons.ts` following `schema.ts`. The validator checks that word-by-word tokens rebuild the sentence and match the kana reading, and that each question's answer is among its options.
- **Interface text:** add the key to `src/i18n/en.ts`; TypeScript will then require the same key in `src/i18n/ur.ts`.

## Privacy
No analytics, no tracking, no external services. Everything stays in your browser. Clearing browser data erases progress unless you exported a backup (Settings -> Your data). Nothing is synced between devices.

## Licence
Code and artwork licences have not been chosen yet. Kanji data from KANJIDIC2 and KanjiVG (CC BY-SA) is not included yet; see docs/CONTENT_SOURCES.md before adding it.
