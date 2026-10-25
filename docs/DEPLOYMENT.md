# Deployment

The app is a static site (`npm run build` creates `dist/`). It uses hash routing (`/#/vocabulary`) and relative asset paths, so it works on GitHub Pages under any repository name and on Vercel without special server rules.

**Status: deployment instructions are written but not yet verified by an actual deploy.** After your first deploy, tick the checklist at the end and report any problem.

## Option A: GitHub Pages (recommended, free for public repositories)
Check GitHub's current plan terms if your repository is private.

1. Make sure these files are in the repository: everything from the project, including `.github/workflows/deploy.yml`.
   - On GitHub's website (works on a phone): Add file -> Create new file, type the path `.github/workflows/deploy.yml`, paste the content from this project, Commit.
2. Repository **Settings -> Pages -> Build and deployment -> Source: GitHub Actions**.
3. Push to the `main` branch (or open **Actions** -> "Deploy to GitHub Pages" -> **Run workflow**).
4. Wait for the workflow to turn green (the build job runs typecheck, tests, image check, then build).
5. Your site is at `https://<your-username>.github.io/<repository-name>/`. The address also appears in the workflow's deploy step.

If the build job fails, open the failed step in **Actions**: it shows the same messages you see in the terminal.

The workflow uses `actions/checkout@v4`, `actions/setup-node@v4`, `actions/configure-pages@v4`, `actions/upload-pages-artifact@v3` and `actions/deploy-pages@v4`. These are the versions in common Vite/Pages examples; newer major versions may exist. If GitHub reports a deprecation, update the version numbers.

## Option B: Vercel (free personal plan; check Vercel's current terms)
1. Sign in at vercel.com with GitHub.
2. **Add New -> Project**, import this repository.
3. Vercel should detect Vite. Confirm: Build command `npm run build`, Output directory `dist`.
4. Click **Deploy**. Every later push to `main` redeploys.

No environment variables or secrets are needed.

## Working from a phone (GitHub Codespaces)
1. Open your repository on github.com, tap **Code -> Codespaces -> Create codespace**.
2. Upload a zip with the explorer's **Upload...**, then in the terminal run `unzip -o file.zip` and `rm file.zip`.
3. Run `npm install` once, then `npm run dev`, and open the forwarded port in the browser.
4. Save with Source Control: stage, write a message, Commit, then Sync/Push.
Codespaces has a monthly free allowance; check GitHub's current limits. Stop the codespace when you finish.

## After deploying: checklist
- [ ] Home page loads and the sidebar links all open.
- [ ] Reloading on `/#/vocabulary` still shows the page.
- [ ] Pictures appear on a word such as ご飯 (check the browser console for 404s if not).
- [ ] The English/Urdu switch flips the layout direction.
- [ ] Finish a hiragana quiz, refresh, and see the progress still there.
- [ ] Settings -> Export backup downloads a file; Import restores it.

## Common problems
- **Blank page after deploy:** open the browser console. A 404 for `/assets/...` means the build was not made with relative paths; check `base: './'` in `vite.config.ts`.
- **Pages shows the README instead of the app:** Pages source is still "Deploy from a branch". Change it to "GitHub Actions".
- **Images missing:** `public/images/vocab/` must be committed.
