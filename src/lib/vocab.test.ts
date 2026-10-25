import { describe, expect, it } from 'vitest';
import { VOCAB } from '../data/vocabulary/words';
import { searchVocab, vocabRomaji, type VocabFilters } from './vocab';
import { validateVocab } from './validateVocab';

const base: VocabFilters = { query: '', topic: 'all', pos: 'all', favoritesOnly: false, favorites: new Set(), sort: 'topic' };
const ids = (f: Partial<VocabFilters>) => searchVocab(VOCAB, { ...base, ...f }).map((e) => e.id);

describe('vocabulary data', () => {
  it('passes validation', () => {
    expect(validateVocab()).toEqual([]);
  });
  it('has a starter library', () => {
    expect(VOCAB.length).toBeGreaterThanOrEqual(45);
  });
  it('romanizes headwords, with the particle は override', () => {
    const r = (id: string) => vocabRomaji(VOCAB.find((v) => v.id === id)!);
    expect(r('konnichiwa')).toBe('konnichiwa');
    expect(r('gakkou')).toBe('gakkou');
    expect(r('ocha')).toBe('ocha');
    expect(r('pan')).toBe('pan');
  });
});

describe('vocabulary search', () => {
  it('finds by English, kanji, kana, katakana, romaji and Urdu', () => {
    expect(ids({ query: 'water' })).toContain('mizu');
    expect(ids({ query: '水' })).toContain('mizu');
    expect(ids({ query: 'みず' })).toContain('mizu');
    expect(ids({ query: 'ミズ' })).toContain('mizu');
    expect(ids({ query: 'mizu' })).toContain('mizu');
    expect(ids({ query: 'پانی' })).toContain('mizu');
    expect(ids({ query: 'ぱん' })).toContain('pan');
  });
  it('returns nothing for unknown text', () => {
    expect(ids({ query: 'zzzzqq' })).toEqual([]);
  });
  it('filters by topic, part of speech and favorites', () => {
    expect(ids({ topic: 'numbers' })).toEqual(['ichi', 'ni', 'san']);
    expect(ids({ pos: 'verb' })).toHaveLength(5);
    expect(ids({ favoritesOnly: true, favorites: new Set(['neko', 'inu']) }).sort()).toEqual(['inu', 'neko']);
  });
  it('sorts consistently', () => {
    const r = ids({ sort: 'reading' });
    expect(r).toHaveLength(VOCAB.length);
    expect(ids({ sort: 'english' })[0]).toBe(searchVocab(VOCAB, { ...base, sort: 'english' })[0].id);
  });
});
