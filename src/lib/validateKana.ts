import { ALTS, GROUPS } from '../data/kana/tables';
import { CONFUSABLES, NOTES } from '../data/kana/content';
import { HIRA_EXAMPLES, KATA_EXAMPLES, type KanaExample } from '../data/kana/examples';
import { exampleRomaji, getItems, toKatakana, toRomaji } from './kana';

const isHira = (s: string) => [...s].every((c) => c >= '\u3041' && c <= '\u3096');
const isKata = (s: string) => [...s].every((c) => c >= '\u30a1' && c <= '\u30f6');
const hasUrdu = (s: string) => /[\u0600-\u06FF]/.test(s);

const EXPECTED_COUNTS: Record<string, number> = { basic: 46, dakuten: 20, handakuten: 5, yoon: 33, extra: 12 };

/** Returns a list of problems. An empty list means the kana content passed every check. */
export function validateKanaContent(): string[] {
  const errors: string[] = [];

  const groupIds = new Set<string>();
  const counts: Record<string, number> = {};
  for (const g of GROUPS) {
    if (groupIds.has(g.id)) errors.push(`duplicate group id ${g.id}`);
    groupIds.add(g.id);
    counts[g.kind] = (counts[g.kind] ?? 0) + g.entries.length;
    for (const [kana, romaji] of g.entries) {
      if (!isHira(kana)) errors.push(`${g.id}: "${kana}" is not hiragana`);
      if (!isKata(toKatakana(kana))) errors.push(`${g.id}: katakana form of "${kana}" is invalid`);
      if (!/^[a-z]+$/.test(romaji)) errors.push(`${g.id}: bad romaji "${romaji}" for ${kana}`);
      if (toRomaji(kana) !== romaji) errors.push(`${g.id}: toRomaji(${kana}) = ${toRomaji(kana)}, expected ${romaji}`);
    }
  }
  for (const [kind, n] of Object.entries(EXPECTED_COUNTS)) {
    if (counts[kind] !== n) errors.push(`expected ${n} ${kind} entries, found ${counts[kind] ?? 0}`);
  }

  for (const script of ['hira', 'kata'] as const) {
    const items = getItems(script);
    const ids = new Set<string>();
    for (const i of items) {
      if (ids.has(i.id)) errors.push(`duplicate item id ${i.id}`);
      ids.add(i.id);
    }
    const chars = new Set(items.map((i) => i.char));
    for (const c of CONFUSABLES[script]) {
      for (const ch of c.chars) if (!chars.has(ch)) errors.push(`${script} confusable references unknown character ${ch}`);
      if (!c.tip.en || !hasUrdu(c.tip.ur)) errors.push(`${script} confusable ${c.chars.join('')} lacks English or Urdu text`);
    }
    for (const n of NOTES[script]) {
      if (!n.title.en || !n.body.en || !hasUrdu(n.title.ur) || !hasUrdu(n.body.ur)) errors.push(`${script} note "${n.title.en}" lacks English or Urdu text`);
    }
    const examples: Record<string, KanaExample> = script === 'hira' ? HIRA_EXAMPLES : KATA_EXAMPLES;
    for (const i of items.filter((x) => x.kind === 'basic')) {
      const ex = examples[i.char];
      if (!ex) {
        if (i.char !== 'ヲ') errors.push(`${i.id} has no example word`);
        continue;
      }
      if (!ex.word.includes(i.char)) errors.push(`${i.id}: example "${ex.word}" does not contain the character`);
      if (!ex.en.trim()) errors.push(`${i.id}: missing English meaning`);
      if (!hasUrdu(ex.ur)) errors.push(`${i.id}: Urdu meaning missing or not in Urdu script`);
      if (!/^[a-z' ]+$/.test(exampleRomaji(ex))) errors.push(`${i.id}: example "${ex.word}" has non-romaji output "${exampleRomaji(ex)}"`);
    }
    for (const key of Object.keys(examples)) if (!chars.has(key)) errors.push(`${script} example keyed by unknown character ${key}`);
  }

  const horizontals = new Set(GROUPS.flatMap((g) => g.entries.map(([k]) => k)));
  for (const k of Object.keys(ALTS)) if (!horizontals.has(k)) errors.push(`ALTS key ${k} is not a known kana`);
  return errors;
}
