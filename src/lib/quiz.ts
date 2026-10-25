import type { Key } from '../i18n/en';
import type { Bilingual, QuizMode } from '../types';
import { toHiragana, type KanaItem } from './kana';

export type Rng = () => number;

export function shuffle<T>(arr: readonly T[], rng: Rng = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface Question {
  id: string;
  itemId: string;
  mode: QuizMode;
  kind: 'choice' | 'typing';
  prompt: string;
  promptLang: 'ja' | 'en';
  options: string[];
  optionLang: 'ja' | 'en';
  answer: string; // canonical answer shown to the learner
  accepted: string[]; // normalized answers accepted for typing questions
  explanationKey?: Key; // translated UI text (kana questions)
  explanationVars?: Record<string, string>;
  explanationText?: Bilingual; // authored bilingual text (grammar questions)
  hint?: Bilingual; // shown under the prompt; empty strings are skipped
  promptRomaji?: string; // pronunciation of a Japanese prompt, in English letters
  optionRomaji?: Record<string, string>; // pronunciation of Japanese options, keyed by option text
}

export const normalizeAnswer = (s: string) => s.trim().toLowerCase().replace(/\s+/g, '');

function distractors(values: string[], answer: string, rng: Rng, k = 3): string[] {
  return shuffle([...new Set(values)].filter((v) => v !== answer), rng).slice(0, k);
}

/**
 * Builds kana questions.
 * - items: what the learner chose to practise; pool: every item of that script (used for distractors).
 * - 'pick' skips characters whose romaji is shared with another kana (じ/ぢ, ず/づ), because the
 *   romaji prompt would then have two correct answers.
 * - 'cross' (katakana pages) shows the hiragana form and asks for the matching katakana.
 * - If fewer distinct items than `count` exist, items repeat in a fresh shuffled order.
 */
export function buildKanaQuestions(items: KanaItem[], pool: KanaItem[], mode: QuizMode, count: number, rng: Rng = Math.random): Question[] {
  const romajiUses = new Map<string, number>();
  for (const p of pool) romajiUses.set(p.romaji, (romajiUses.get(p.romaji) ?? 0) + 1);

  const candidates = items.filter((i) => {
    if (mode === 'pick') return romajiUses.get(i.romaji) === 1;
    if (mode === 'cross') return i.script === 'kata' && i.kind !== 'extra';
    return true;
  });
  if (candidates.length === 0 || count <= 0) return [];

  const order: KanaItem[] = [];
  while (order.length < count) order.push(...shuffle(candidates, rng));

  return order.slice(0, count).map((item, n): Question => {
    const base = {
      id: `${mode}:${item.id}:${n}`,
      itemId: item.id,
      mode,
      explanationKey: 'explainKana' as Key,
      explanationVars: { kana: item.char, romaji: item.romaji },
    };
    if (mode === 'read') {
      const opts = shuffle([item.romaji, ...distractors(pool.map((p) => p.romaji), item.romaji, rng)], rng);
      return { ...base, kind: 'choice', prompt: item.char, promptLang: 'ja', options: opts, optionLang: 'en', answer: item.romaji, accepted: [] };
    }
    if (mode === 'pick') {
      const opts = shuffle([item.char, ...distractors(pool.map((p) => p.char), item.char, rng)], rng);
      return { ...base, kind: 'choice', prompt: item.romaji, promptLang: 'en', options: opts, optionLang: 'ja', answer: item.char, accepted: [] };
    }
    if (mode === 'type') {
      return {
        ...base, kind: 'typing', prompt: item.char, promptLang: 'ja', options: [], optionLang: 'en',
        answer: item.romaji, accepted: [item.romaji, ...item.alts].map(normalizeAnswer),
      };
    }
    const hira = toHiragana(item.char);
    const others = pool.filter((p) => p.kind !== 'extra').map((p) => p.char);
    const opts = shuffle([item.char, ...distractors(others, item.char, rng)], rng);
    return {
      ...base, kind: 'choice', prompt: hira, promptLang: 'ja', options: opts, optionLang: 'ja', answer: item.char, accepted: [],
      explanationKey: 'explainCross', explanationVars: { hira, kata: item.char },
    };
  });
}
