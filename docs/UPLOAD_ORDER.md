# Upload order for GitHub

Upload in this order so each step only needs things from earlier steps. The folder structure must stay exactly as listed.

**Important notes**
- GitHub's website does **not** unzip files. Unzip `nipponverse.zip` on your phone first (Files app), then upload the folders/files.
- `.gitignore` starts with a dot and may be hidden on Android. If you cannot see it, use GitHub → Add file → Create new file, name it `.gitignore`, and paste its content.
- Keep every file's path exactly as shown (e.g. `src/lib/kana.ts`).
- After everything is uploaded, open the repo in a Codespace and run: `npm install && npm run typecheck && npm test && npm run check:images && npm run build`.

## Step 1 — Root config files (upload first) (7 files)
1. `package.json`
2. `vite.config.ts`
3. `tsconfig.json`
4. `tailwind.config.js`
5. `postcss.config.js`
6. `index.html`
7. `.gitignore`

## Step 2 — Docs folder (4 files)
1. `docs/BUILD_STATUS.md`
2. `docs/CONTENT_SOURCES.md`
3. `docs/PRODUCT_PLAN.md`
4. `docs/RESEARCH.md`

## Step 3 — src base files (6 files)
1. `src/main.tsx`
2. `src/index.css`
3. `src/vite-env.d.ts`
4. `src/test-setup.ts`
5. `src/types.ts`
6. `src/App.tsx`

## Step 4 — src/data (content) (6 files)
1. `src/data/images/manifest.ts`
2. `src/data/kana/content.ts`
3. `src/data/kana/examples.ts`
4. `src/data/kana/tables.ts`
5. `src/data/vocabulary/schema.ts`
6. `src/data/vocabulary/words.ts`

## Step 5 — src/i18n and src/state (3 files)
1. `src/i18n/en.ts`
2. `src/i18n/ur.ts`
3. `src/state/AppState.tsx`

## Step 6 — src/lib (logic and tests) (14 files)
1. `src/lib/cards.ts`
2. `src/lib/kana.test.ts`
3. `src/lib/kana.ts`
4. `src/lib/quiz.ts`
5. `src/lib/speech.ts`
6. `src/lib/srs.test.ts`
7. `src/lib/srs.ts`
8. `src/lib/stats.ts`
9. `src/lib/storage.test.ts`
10. `src/lib/storage.ts`
11. `src/lib/validateKana.ts`
12. `src/lib/validateVocab.ts`
13. `src/lib/vocab.test.ts`
14. `src/lib/vocab.ts`

## Step 7 — src/components (5 files)
1. `src/components/ErrorBoundary.tsx`
2. `src/components/Layout.tsx`
3. `src/components/Quiz.tsx`
4. `src/components/VocabImage.tsx`
5. `src/components/ui.tsx`

## Step 8 — src/pages (7 files)
1. `src/pages/Dashboard.tsx`
2. `src/pages/KanaPage.tsx`
3. `src/pages/NotFound.tsx`
4. `src/pages/Review.tsx`
5. `src/pages/Settings.tsx`
6. `src/pages/VocabDetail.tsx`
7. `src/pages/Vocabulary.tsx`

## Step 9 — public/images/vocab (14 SVG pictures) (14 files)
1. `public/images/vocab/ame.svg`
2. `public/images/vocab/gakkou.svg`
3. `public/images/vocab/gohan.svg`
4. `public/images/vocab/hana.svg`
5. `public/images/vocab/hon.svg`
6. `public/images/vocab/ie.svg`
7. `public/images/vocab/inu.svg`
8. `public/images/vocab/ki.svg`
9. `public/images/vocab/kuruma.svg`
10. `public/images/vocab/mizu.svg`
11. `public/images/vocab/neko.svg`
12. `public/images/vocab/ringo.svg`
13. `public/images/vocab/sakana.svg`
14. `public/images/vocab/yama.svg`

## Step 10 — scripts (1 files)
1. `scripts/check-images.mjs`

Total: 68 files including this one.
