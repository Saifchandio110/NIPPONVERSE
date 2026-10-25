# NipponVerse — Content Sources and Licences

Accessed 2026-10-25. "Status" says whether anything from the source is already in the project.

| Source | What for | Licence (as stated by source) | Status |
|---|---|---|---|
| EDRDG KANJIDIC2 — https://www.edrdg.org/edrdg/license.html | kanji readings, English meanings, stroke counts, grades | CC BY-SA 4.0 (SKIP codes separate; not used) | Not imported yet |
| EDRDG JMdict (same licence page) | dictionary/vocabulary data | CC BY-SA 4.0 | Not imported yet; Urdu glosses not confirmed to exist |
| KanjiVG — https://kanjivg.tagaini.net/ | stroke-order SVG paths | CC BY-SA 3.0, © Ulrich Apel | Not imported yet |
| Kana tables, example words, notes (`src/data/kana/`) | hiragana/katakana lessons | Written for this project from standard kana tables; no third-party text copied | In project. Urdu text needs native review; confusable-character tips are our wording |
| Wikimedia Commons images | optional photos | Per-file licence; check each file page | None selected |
| Original SVG illustrations | vocabulary pictures | Created for the project | Not started |
| Browser Web Speech API | audio, recognition | Platform feature, device-dependent | TTS in project; recognition not yet |

## Rules for adding a source
1. Open the source's own licence page and record URL, licence name/version and access date here.
2. Put share-alike data under `src/data/<set>/` with a `NOTICE.md` containing the required attribution.
3. Never import a code or ID system the licence excludes (e.g. SKIP codes).
4. Images need a manifest entry (file, alt text EN/UR, source URL, author, licence, access date) before they are used.
5. Urdu text is marked "needs review" until a native speaker signs it off.
