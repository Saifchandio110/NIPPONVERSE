# Romaji update: files to upload

NEW (4): src/data/lexicon.ts src/lib/sentenceRomaji.ts src/lib/romaji.test.ts src/components/PronunciationGuide.tsx

REPLACE (12): src/data/grammar/schema.ts src/data/grammar/lessons.ts src/lib/quiz.ts src/lib/grammarQuiz.ts src/lib/cards.ts src/components/Quiz.tsx src/pages/GrammarLesson.tsx src/pages/VocabDetail.tsx src/pages/Vocabulary.tsx src/pages/Grammar.tsx src/i18n/en.ts src/i18n/ur.ts

Then run: npm run typecheck && npm test && npm run check:images && npm run build
