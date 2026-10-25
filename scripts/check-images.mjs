// Verifies every file named in the image manifest exists in public/images/vocab/.
// Run: node scripts/check-images.mjs
import { existsSync, readFileSync } from 'node:fs';

const manifest = readFileSync('src/data/images/manifest.ts', 'utf8');
const files = [...manifest.matchAll(/img\('([^']+)'/g)].map((m) => m[1]);
const missing = files.filter((f) => !existsSync(`public/images/vocab/${f}`));
if (missing.length) {
  console.error('Missing image files:', missing.join(', '));
  process.exit(1);
}
console.log(`OK: ${files.length} manifest images exist.`);
