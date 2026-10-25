# NipponVerse — Research Notes

Accessed: 2026-10-25. Scope: only the questions listed below were researched. Everything else the brief asks about is listed under "Not yet researched" so nothing is presented as checked when it was not.
"Official" = stated by the rights holder or test organiser. "Secondary" = a third party describing it. Interpretations are marked as ours.

## 1. JLPT has no official vocabulary, kanji or grammar lists (affects the N5–N1 paths)
- Official site: the JLPT is run by the Japan Foundation and Japan Educational Exchanges and Services — https://jlpt.jp/e/about/purpose.html (official).
- The organisers' FAQ says the "Test Content Specifications" (lists of vocabulary, kanji, grammar) will not be published for the revised (2010-onward) test, because the test measures communicative competence as well as language knowledge. It adds that the old test's specifications "could be a reference" for N1, N2, N4, N5 since those levels are approximately the old levels 1–4. Source seen: a mirror of that FAQ at https://www.japanese-edu.org.hk/jp/jlpt/en/enquiry.html (secondary mirror; the original page at jlpt.jp/e/faq was not opened directly).
- The EDRDG kanji-dictionary maintainer quoted the same FAQ in 2013 and concluded there is no clean way to split the old level 2 into N2/N3: https://www.edrdg.org/jmdict_edict_list/2013/msg00045.html (secondary, but by a primary maintainer).
- Third-party sites publish N5–N1 lists anyway, and they disagree (e.g. N5 kanji counts of 79, 80, 103 appear across sites). Examples seen: https://jlptsensei.com/jlpt-n5-kanji-list/ and https://community.wanikani.com/t/jlpt-stats-differ/12858.
- **Decision (ours):** label paths "JLPT-oriented". Never state a fixed official list. Tag each item with the source list used, if any, and show the disclaimer from the brief. Progress is an activity estimate only.

## 2. Kanji data licences
- **KANJIDIC2 / JMdict (EDRDG):** the EDRDG licence page — https://www.edrdg.org/edrdg/license.html (official) — states the dictionary files, including KANJIDIC2, are under Creative Commons Attribution-ShareAlike 4.0. Older mirrors of the same statement still say 3.0 (e.g. https://src.opensuse.org/pool/edict/raw/branch/factory/licence.html), so the version has changed; use the official page. Conditions on that page include: provide links to the documentation/licence or EDRDG/Monash locations; software using the files need not be open source; "failure to keep the versions up-to-date is a violation". It also says the SKIP codes carry their own licence — **we will not import SKIP codes**.
- **KanjiVG (stroke order SVG):** copyright Ulrich Apel, Creative Commons Attribution-ShareAlike 3.0 — https://kanjivg.tagaini.net/ (official project site; copyright shown as 2009–2026) and the repository README mirrored at https://git.pvv.ntnu.no/mugiten/kanjivg/.
- **Our interpretation (not legal advice):** data derived from these files stays CC BY-SA and keeps attribution. We keep it in `src/data/kanji/` with its own LICENSE/NOTICE, separate from the app code, and record the dataset version and date in the data files. A lawyer should review before commercial distribution.
- **Not verified:** whether KANJIDIC2/JMdict contain Urdu glosses. We assume they do not, so **all Urdu meanings are written by us and need native review**.
- Sandbox note: this environment has no network, so the datasets cannot be downloaded here. Plan: a script (`scripts/build-kanji.mjs`) that you run in a Codespace to fetch the files and emit a trimmed JSON for a chosen kanji list. Nothing is typed from memory.

## 3. Browser speech
- **Speech synthesis (text-to-speech):** relies on voices installed on the device; our code already detects a missing Japanese voice and says so. Per-browser support tables were not re-checked in this pass.
- **Speech recognition:** https://caniuse.com/speech-recognition (accessed) lists partial support in Chrome, Safari and Samsung Internet and "disabled by default" in Firefox. A newer feature page, https://web-platform-dx.github.io/web-features-explorer/features/speech-recognition, lists the feature as "limited availability" with Chrome/Edge supported and Firefox/Safari not. A secondary guide (https://www.testmuai.com/learning-hub/speech-recognition-api-browser-support/) says Chrome sends audio to Google's cloud service; this was not confirmed from a primary source, so the app must say recognition may need an internet connection and may not work offline.
- An older result (reference.codeproject.com, a copy of MDN from about 2016) was discarded as outdated.
- **Decision:** speech recognition is a progressive enhancement behind feature detection, with a typed-answer fallback. No accent or pitch-accent scoring is claimed.

## 4. Images (vocabulary pictures)
- Wikimedia Commons guidance — https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia (official): most files are reusable, but each file has its own licence; attribution is required for many; ShareAlike licences impose conditions on derivatives; images of identifiable people can raise personality-rights issues; the author (not the uploader) must be credited. Hotlinking is "not recommended" (https://c.enwp.org/wiki/Commons:Reusing_content_outside_Wikimedia/technical).
- **Decision (ours):** no hotlinking. Every picture is a local file listed in an image manifest with source URL, author, licence, and access date. Start with simple original SVG illustrations authored for the project (no third-party licence), and add Commons photos only after the file page is checked. Avoid photos of identifiable people.
- No specific Commons file has been selected or verified yet.

## Not yet researched (the brief asks for these; none is claimed as done)
Japan Foundation teaching materials (e.g. Marugoto) and Can-do framework · pitch accent resources · evidence base for spaced repetition and retrieval practice (our SM-2-style scheduler is a documented simplification, not a validated optimum) · Tatoeba / example-sentence licences · Openverse · accessibility guidance (WCAG) beyond our own checks · free-tier terms for Vercel and GitHub Pages · exact npm versions (Batch 2 versions are from memory, unverified).
