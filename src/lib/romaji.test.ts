import { describe, expect, it } from 'vitest';
import { GRAMMAR } from '../data/grammar/lessons';
import { VOCAB } from '../data/vocabulary/words';
import { toRomaji } from './kana';
import { blankedRomaji, equalModuloParticles, exampleRomajiLine, sentenceRomaji, tokenRomaji } from './sentenceRomaji';

describe('sentence romaji', () => {
  it('handles particles and spacing', () => {
    expect(sentenceRomaji('私は学生です。')).toBe('Watashi wa gakusei desu.');
    expect(sentenceRomaji('水をください。')).toBe('Mizu o kudasai.');
    expect(sentenceRomaji('学校へ行きます。')).toBe('Gakkou e ikimasu.');
    expect(sentenceRomaji('こんにちは、はじめまして。')).toBe('Konnichiwa, hajimemashite.');
  });
  it('returns null instead of guessing for unknown kanji', () => {
    expect(sentenceRomaji('私は魔法使いです。')).toBeNull();
  });
  it('builds a blank prompt', () => {
    expect(blankedRomaji('私＿＿学生です。')).toBe('Watashi ＿＿ gakusei desu.');
    expect(blankedRomaji('母は水を＿＿。')).toBe('Haha wa mizu o ＿＿.');
  });
  it('every vocabulary example sentence has romaji that matches its kana reading', () => {
    for (const v of VOCAB) {
      const r = sentenceRomaji(v.example.ja);
      expect(r === null).toBe(false);
      expect(equalModuloParticles(toRomaji(v.example.reading), r ?? '')).toBe(true);
    }
  });
  it('every grammar example line and token matches its kana reading', () => {
    for (const l of GRAMMAR) {
      for (const e of l.examples) {
        expect(equalModuloParticles(toRomaji(e.reading), exampleRomajiLine(e))).toBe(true);
        expect(equalModuloParticles(toRomaji(e.reading), sentenceRomaji(e.ja) ?? '')).toBe(true);
        for (const t of e.tokens) expect(tokenRomaji(t).length > 0).toBe(true);
      }
    }
  });
  it('covers every grammar quiz prompt and option', () => {
    for (const l of GRAMMAR) {
      for (const q of l.questions) {
        if (q.promptLang === 'ja') expect(blankedRomaji(q.prompt) === null).toBe(false);
        if (q.type === 'translate') for (const o of q.options) expect(sentenceRomaji(o) === null).toBe(false);
        else for (const o of q.options) expect(sentenceRomaji(o) === null).toBe(false);
      }
    }
  });
});
