import { describe, expect, it } from 'vitest';
import { getGroups, getItems, toHiragana, toKatakana, toRomaji } from './kana';
import { buildKanaQuestions, normalizeAnswer } from './quiz';
import { validateKanaContent } from './validateKana';

describe('kana conversion', () => {
  it('converts between scripts', () => {
    expect(toKatakana('かんじ')).toBe('カンジ');
    expect(toHiragana('コーヒー')).toBe('こーひー');
  });
  it('romanizes with small tsu, long vowel mark and combinations', () => {
    expect(toRomaji('きっぷ')).toBe('kippu');
    expect(toRomaji('コーヒー')).toBe('koohii');
    expect(toRomaji('フォーク')).toBe('fooku');
    expect(toRomaji('ニュース')).toBe('nyuusu');
    expect(toRomaji('しゃしん')).toBe('shashin');
    expect(toRomaji('まっちゃ')).toBe('matcha');
  });
});

describe('kana content', () => {
  it('passes validation', () => {
    expect(validateKanaContent()).toEqual([]);
  });
  it('has the expected sizes', () => {
    expect(getItems('hira')).toHaveLength(104);
    expect(getItems('kata')).toHaveLength(116);
    expect(getGroups('hira').some((g) => g.kind === 'extra')).toBe(false);
  });
});

describe('quiz builder', () => {
  const pool = getItems('hira');
  for (const mode of ['read', 'pick', 'type'] as const) {
    it(`builds valid ${mode} questions`, () => {
      const qs = buildKanaQuestions(pool, pool, mode, 30);
      expect(qs).toHaveLength(30);
      for (const q of qs) {
        if (q.kind === 'choice') {
          expect(q.options).toContain(q.answer);
          expect(new Set(q.options).size).toBe(q.options.length);
          expect(q.options.length).toBeGreaterThanOrEqual(2);
        } else {
          expect(q.accepted).toContain(normalizeAnswer(q.answer));
        }
      }
    });
  }
  it('repeats items when the scope is small', () => {
    const small = pool.filter((i) => i.groupId === 'basic-nn');
    expect(buildKanaQuestions(small, pool, 'type', 10)).toHaveLength(10);
  });
  it('skips ambiguous romaji in pick mode', () => {
    const qs = buildKanaQuestions(pool, pool, 'pick', 200);
    expect(qs.some((q) => q.answer === 'ぢ' || q.answer === 'づ')).toBe(false);
  });
  it('cross mode asks for the matching katakana', () => {
    const kata = getItems('kata');
    const qs = buildKanaQuestions(kata, kata, 'cross', 20);
    for (const q of qs) expect(toKatakana(q.prompt)).toBe(q.answer);
  });
  it('accepts alternative romaji when typing', () => {
    const si = pool.find((i) => i.char === 'し')!;
    const [q] = buildKanaQuestions([si], pool, 'type', 1);
    expect(q.accepted).toContain('shi');
    expect(q.accepted).toContain('si');
  });
});
