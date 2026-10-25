import { EXTRA_LEXICON } from '../data/lexicon';
import { GRAMMAR } from '../data/grammar/lessons';
import type { GrammarExample, GrammarToken } from '../data/grammar/schema';
import { VOCAB } from '../data/vocabulary/words';
import { toRomaji } from './kana';
import { vocabRomaji } from './vocab';

const PARTICLES: Record<string, string> = { は: 'wa', を: 'o', へ: 'e' };

/** Romaji for one breakdown token. は, を, へ are particles there, so they use their spoken sound. */
export function tokenRomaji(t: GrammarToken): string {
  return t.romaji ?? PARTICLES[t.ja] ?? toRomaji(t.reading ?? t.ja);
}

/** Romaji for a grammar example, built from its tokens so particles are always right. */
export function exampleRomajiLine(e: GrammarExample): string {
  const end = e.ja.match(/[。？！]$/)?.[0];
  const body = e.tokens.map(tokenRomaji).join(' ');
  const punct = end === '？' ? '?' : end === '！' ? '!' : '.';
  const s = `${body}${punct}`;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ---- Dictionary-based romaji for any sentence made of known words ----
const LEX = new Map<string, string>();
const add = (ja: string, romaji: string) => { if (!LEX.has(ja)) LEX.set(ja, romaji); };
for (const [ja, r] of EXTRA_LEXICON) add(ja, r);
for (const l of GRAMMAR) for (const e of l.examples) for (const t of e.tokens) add(t.ja, tokenRomaji(t));
for (const v of VOCAB) {
  add(v.word, vocabRomaji(v));
  if ([...v.reading].length >= 2) add(v.reading, vocabRomaji(v));
}
const MAX_LEN = Math.max(...[...LEX.keys()].map((k) => [...k].length));

function startsKnownWord(chars: string[], pos: number): boolean {
  for (let len = Math.min(MAX_LEN, chars.length - pos); len >= 2; len--) {
    if (LEX.has(chars.slice(pos, pos + len).join(''))) return true;
  }
  return false;
}

const PUNCT: Record<string, string> = { '、': ',', '。': '.', '？': '?', '！': '!' };
const isKanaRunChar = (c: string) => /[\u3041-\u3096\u30a1-\u30fa\u30fc]/.test(c) && !(c in PARTICLES);

/**
 * Romaji for a sentence or phrase, using the longest known word at each position.
 * Unknown runs of plain kana are converted directly. Returns null when it meets text it cannot
 * pronounce with confidence (for example an unknown kanji), so the app shows nothing rather than a guess.
 */
export function sentenceRomaji(text: string): string | null {
  const s = convert(text);
  if (s === null) return null;
  return /[.?!]$/.test(s) ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function convert(text: string): string | null {
  const chars = [...text];
  const out: string[] = [];
  let i = 0;
  while (i < chars.length) {
    const c = chars[i];
    if (c === ' ' || c === '　') { i++; continue; }
    if (PUNCT[c]) {
      if (out.length) out[out.length - 1] += PUNCT[c]; else out.push(PUNCT[c]);
      i++;
      continue;
    }
    let matched = 0;
    for (let len = Math.min(MAX_LEN, chars.length - i); len >= 1; len--) {
      const r = LEX.get(chars.slice(i, i + len).join(''));
      if (r !== undefined) { out.push(r); matched = len; break; }
    }
    if (matched) { i += matched; continue; }
    if (!isKanaRunChar(c)) return null;
    // Unknown kana: take it up to the next known word of two or more characters, so "くないです" -> "kunai desu".
    let j = i + 1;
    while (j < chars.length && isKanaRunChar(chars[j]) && !startsKnownWord(chars, j)) j++;
    out.push(toRomaji(chars.slice(i, j).join('')));
    i = j;
  }
  return out.join(' ');
}

/** Romaji for a quiz prompt that contains one blank (＿＿). */
export function blankedRomaji(prompt: string): string | null {
  const parts = prompt.split('＿＿');
  if (parts.length !== 2) return sentenceRomaji(prompt);
  const a = parts[0] === '' ? '' : convert(parts[0]);
  const b = parts[1] === '' ? '' : convert(parts[1]);
  if (a === null || b === null) return null;
  const s = `${a} ＿＿ ${b}`.trim().replace(/\s+([,.?!])/g, '$1');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** True when `shown` matches `auto` apart from particle sounds (ha→wa, wo→o, he→e). Used by tests. */
export function equalModuloParticles(auto: string, shown: string): boolean {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, '');
  const a = norm(auto);
  const b = norm(shown);
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (a.startsWith('ha', i) && b.startsWith('wa', j)) { i += 2; j += 2; continue; }
    if (a.startsWith('wo', i) && b[j] === 'o') { i += 2; j += 1; continue; }
    if (a.startsWith('he', i) && b[j] === 'e') { i += 2; j += 1; continue; }
    return false;
  }
  return i === a.length && j === b.length;
}
