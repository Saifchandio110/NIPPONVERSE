# NipponVerse — Product Plan (draft v0)

Tagline: Learn Japanese. Understand Japan.

## Decisions
- Stack: React + TypeScript + Vite + Tailwind + React Router + lucide-react. Exact versions are pinned in Batch 2 after checking npm.
- Storage: localStorage with a versioned envelope `{version, data}` and migration functions. IndexedDB only if review history outgrows localStorage.
- Routing: HashRouter, so GitHub Pages works without server rewrites (Vercel works too).
- i18n: typed dictionaries `en` / `ur`; `dir="rtl"` on the root for Urdu; Japanese text wrapped in `lang="ja" dir="ltr"`.
- SRS: SM-2-style scheduler with Again/Hard/Good/Easy, due dates stored as ISO timestamps, daily new/review limits.
- TTS: browser SpeechSynthesis (`ja-JP`) with a visible fallback message when no Japanese voice exists. Speech recognition via Web Speech API only where supported. No accent scoring is claimed.
- Images: curated manifest (`src/data/images/manifest.ts`) holding file, alt text (EN/UR), source URL, license, author. Only CC0/public-domain or self-made SVG assets; nothing hotlinked.
- Kanji: use KANJIDIC2 (EDRDG licence, CC BY-SA 4.0) for readings/meanings and KanjiVG (CC BY-SA 3.0) for stroke order, after confirming current terms. If unavailable, ship a small hand-verified set with the same schema.
- JLPT: no official vocabulary or kanji lists exist; paths are labelled "JLPT-oriented" and progress is an activity estimate only.

## Content principle
Small, verified content first (kana complete; modest vocabulary, kanji, and grammar sets), with a validation script that blocks missing translations, duplicate IDs, and bad references. Urdu text will need native-speaker review before being treated as final.

## Out of scope for v1
Accounts, sync, backend, paid AI grading, pitch-accent scoring.
