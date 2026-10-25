import { IMAGES } from '../data/images/manifest';
import { POS_LABELS, TOPICS } from '../data/vocabulary/schema';
import { VOCAB } from '../data/vocabulary/words';
import { vocabRomaji } from './vocab';

const hasUrdu = (s: string) => /[\u0600-\u06FF]/.test(s);
const KANA_WORD = /^[\u3041-\u3096\u30a1-\u30fa\u30fc]+$/;
const KANA_SENTENCE = /^[\u3041-\u3096\u30a1-\u30fa\u30fc、。！？ ]+$/;
const HAS_KANJI = /[\u4e00-\u9fff]/;

/** Returns a list of problems; an empty list means the vocabulary data passed every check. */
export function validateVocab(): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const pairs = new Set<string>();
  const topics = new Set<string>(TOPICS.map((t) => t.id));

  for (const e of VOCAB) {
    const at = `vocab ${e.id}`;
    if (!/^[a-z0-9-]+$/.test(e.id)) errors.push(`${at}: id must be a lowercase ascii slug`);
    if (ids.has(e.id)) errors.push(`${at}: duplicate id`);
    ids.add(e.id);
    const pair = `${e.word}|${e.reading}`;
    if (pairs.has(pair)) errors.push(`${at}: duplicate word/reading ${pair}`);
    pairs.add(pair);

    if (!e.word.trim() || !KANA_WORD.test(e.reading)) errors.push(`${at}: word missing or reading is not kana`);
    if (!/^[a-z]+$/.test(vocabRomaji(e))) errors.push(`${at}: romaji "${vocabRomaji(e)}" is not plain letters`);
    if (!topics.has(e.topic)) errors.push(`${at}: unknown topic ${e.topic}`);
    if (!(e.pos in POS_LABELS)) errors.push(`${at}: unknown part of speech ${e.pos}`);
    if (!e.en.trim()) errors.push(`${at}: missing English meaning`);
    if (!hasUrdu(e.ur)) errors.push(`${at}: Urdu meaning missing or not in Urdu script`);

    const x = e.example;
    if (!x.ja.includes(e.word[0])) errors.push(`${at}: example does not contain the word (${e.word[0]})`);
    if (!/[。！？]$/.test(x.ja)) errors.push(`${at}: example must end with 。！ or ？`);
    if (!KANA_SENTENCE.test(x.reading)) errors.push(`${at}: example reading must be kana only`);
    if (!HAS_KANJI.test(x.ja) && x.reading !== x.ja) errors.push(`${at}: example has no kanji, so its reading must equal it`);
    if (e.pos !== 'verb') {
      const stem = e.pos === 'i-adjective' ? e.reading.slice(0, -1) : e.reading;
      if (!x.reading.includes(stem)) errors.push(`${at}: example reading does not contain ${stem}`);
    }
    if (!x.en.trim() || !hasUrdu(x.ur)) errors.push(`${at}: example needs English and Urdu translations`);

    if (e.image !== undefined) {
      const img = IMAGES[e.image];
      if (!img) errors.push(`${at}: image "${e.image}" is not in the manifest`);
    }
  }

  for (const [key, img] of Object.entries(IMAGES)) {
    if (!img.file.endsWith('.svg') && !img.file.endsWith('.png') && !img.file.endsWith('.webp') && !img.file.endsWith('.jpg')) errors.push(`image ${key}: unsupported file type`);
    if (!img.alt.en.trim() || !hasUrdu(img.alt.ur)) errors.push(`image ${key}: needs English and Urdu alt text`);
    if (!img.source.trim() || !img.author.trim() || !img.license.trim()) errors.push(`image ${key}: source, author and license are required`);
  }
  return errors;
}
