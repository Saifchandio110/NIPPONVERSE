import { POS_LABELS } from '../data/vocabulary/schema';
import { exampleRomaji, getExample, getItems } from './kana';
import { VOCAB_BY_ID, vocabRomaji } from './vocab';

/** What the review screen shows for a card id. Kana ids look like hira:か, vocabulary ids like vocab:mizu. */
export interface CardFace {
  front: string;
  speakText: string;
  romaji: string;
  meaning?: { en: string; ur: string };
  example?: { word: string; romaji: string; en: string; ur: string }; // `romaji` holds the kana reading for vocabulary
}

const kana = new Map([...getItems('hira'), ...getItems('kata')].map((i) => [i.id, i]));

export function resolveCard(id: string): CardFace | null {
  if (id.startsWith('vocab:')) {
    const v = VOCAB_BY_ID.get(id.slice(6));
    if (!v) return null;
    return {
      front: v.word,
      speakText: v.reading,
      romaji: `${v.reading} · ${vocabRomaji(v)}`,
      meaning: { en: `${v.en} (${POS_LABELS[v.pos].en})`, ur: v.ur },
      example: { word: v.example.ja, romaji: v.example.reading, en: v.example.en, ur: v.example.ur },
    };
  }
  const item = kana.get(id);
  if (!item) return null;
  const ex = getExample(item);
  return {
    front: item.char,
    speakText: item.char,
    romaji: item.romaji,
    example: ex ? { word: ex.word, romaji: exampleRomaji(ex), en: ex.en, ur: ex.ur } : undefined,
  };
}
