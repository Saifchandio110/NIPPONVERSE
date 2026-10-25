import { VOCAB } from '../data/vocabulary/words';
import { TOPICS, type Pos, type TopicId, type VocabEntry } from '../data/vocabulary/schema';
import { toHiragana, toRomaji } from './kana';

export const VOCAB_BY_ID = new Map<string, VocabEntry>(VOCAB.map((v) => [v.id, v]));
export const vocabCardId = (id: string) => `vocab:${id}`;
export const vocabRomaji = (e: VocabEntry) => e.romaji ?? toRomaji(e.reading);

export type SortKey = 'topic' | 'reading' | 'english';

export interface VocabFilters {
  query: string;
  topic: TopicId | 'all';
  pos: Pos | 'all';
  favoritesOnly: boolean;
  favorites: ReadonlySet<string>;
  sort: SortKey;
}

const topicIndex = new Map(TOPICS.map((t, i) => [t.id, i]));

/** Matches Japanese (kanji or kana, hiragana/katakana interchangeable), romaji, English or Urdu. */
export function searchVocab(entries: readonly VocabEntry[], f: VocabFilters): VocabEntry[] {
  const raw = f.query.trim();
  const lower = raw.toLowerCase();
  const kana = toHiragana(lower);
  const roman = lower.replace(/[\s'’-]/g, '');
  const matches = (e: VocabEntry) =>
    raw === '' ||
    e.word.includes(raw) ||
    toHiragana(e.reading).includes(kana) ||
    (roman !== '' && vocabRomaji(e).includes(roman)) ||
    e.en.toLowerCase().includes(lower) ||
    e.ur.includes(raw);

  const order = new Map(entries.map((e, i) => [e.id, i]));
  const list = entries.filter(
    (e) =>
      matches(e) &&
      (f.topic === 'all' || e.topic === f.topic) &&
      (f.pos === 'all' || e.pos === f.pos) &&
      (!f.favoritesOnly || f.favorites.has(e.id)),
  );
  const byOrder = (a: VocabEntry, b: VocabEntry) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0);
  if (f.sort === 'reading') return list.sort((a, b) => toHiragana(a.reading).localeCompare(toHiragana(b.reading), 'ja') || byOrder(a, b));
  if (f.sort === 'english') return list.sort((a, b) => a.en.localeCompare(b.en, 'en') || byOrder(a, b));
  return list.sort((a, b) => (topicIndex.get(a.topic) ?? 0) - (topicIndex.get(b.topic) ?? 0) || byOrder(a, b));
}
