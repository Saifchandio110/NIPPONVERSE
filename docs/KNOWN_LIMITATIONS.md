# Known limitations

## Not built yet (requested in the brief)
- Kanji explorer, stroke order, kanji search; no kanji dataset is imported yet (licences researched: see RESEARCH.md).
- Interactive dictionary and dictionary import/export.
- Reading academy (passages, furigana, dialogues, translation hiding).
- Listening and speaking lab (shadowing, listening exercises, speech recognition). Text-to-speech buttons exist on kana, vocabulary and grammar pages.
- JLPT N5-N1 learning paths and final assessments.
- Writing and sentence-building studio (tracing, tile ordering, translation exercises).
- Culture and real-life conversation lessons.
- Several quiz types: listening, image-to-word, kanji recognition, reading comprehension, verb conjugation, sentence ordering.
- Search across all lessons, keyboard shortcuts beyond quizzes/review, lazy-loaded routes.
- Settings: speech speed, furigana display, preferred categories, explanation-language choice.

## Content size
- Kana: complete charts. Example words for the 46 basic characters of each script only.
- Vocabulary: 49 words in 11 topics (many requested topics such as body, health, shopping, hobbies are missing). 14 illustrations; other words show a plain kana tile.
- Grammar: 6 beginner lessons (30 questions). Verb forms, conditionals, potential/passive/causative, honorifics etc. are not written.
- The "JLPT-oriented" label is not used for any item yet because no official lists exist.

## Language quality
- All Urdu text, and the Japanese example sentences, were written by an AI assistant and need review by native speakers.
- Romaji is simplified Hepburn without macrons (long vowels are doubled: "ou", "ii"). It is generated from a small dictionary; a sentence containing an unknown word shows no romaji rather than a guess.
- Sentence readings are shown in kana; the audio reads the written sentence and quality depends on the browser's Japanese voice. Pitch accent is not taught or scored.

## Technical
- Data lives in localStorage on one browser. It is lost if browser data is cleared; there is no sync. Export backups regularly.
- Spaced repetition is a simplified SM-2 style scheduler, not a validated optimum; limits and intervals may need tuning.
- Text-to-speech needs a Japanese voice installed on the device.
- Illustrations are original and their licence is still to be chosen; no licence file exists for the code.
- Deployment has not been verified yet (docs/DEPLOYMENT.md).
- Node/Vite/React package versions were chosen from memory and verified only by the owner's successful install and build.
