import type { Bilingual } from '../../types';

export type Pos = 'noun' | 'verb' | 'i-adjective' | 'expression' | 'number';
export type TopicId = 'greetings' | 'numbers' | 'family' | 'food' | 'home' | 'school' | 'travel' | 'nature' | 'time' | 'colors' | 'daily';

export interface VocabExample {
  ja: string;
  reading: string; // full kana reading of the sentence, as written (は stays は)
  en: string;
  ur: string;
}

export interface VocabEntry {
  id: string; // lowercase ascii slug, used in URLs and card ids
  word: string; // as normally written (kanji where usual)
  reading: string; // kana
  romaji?: string; // only when computed romaji would be wrong (e.g. こんにちは)
  pos: Pos;
  topic: TopicId;
  en: string;
  ur: string; // Urdu script; needs native review
  example: VocabExample;
  image?: string; // key in the image manifest
  tags: string[];
  level: 'beginner'; // no JLPT level is claimed: there is no official list
}

export const TOPICS: { id: TopicId; label: Bilingual }[] = [
  { id: 'greetings', label: { en: 'Greetings and expressions', ur: 'سلام دعا اور عام جملے' } },
  { id: 'numbers', label: { en: 'Numbers', ur: 'اعداد' } },
  { id: 'family', label: { en: 'Family and people', ur: 'خاندان اور لوگ' } },
  { id: 'food', label: { en: 'Food and drink', ur: 'کھانا پینا' } },
  { id: 'home', label: { en: 'Home', ur: 'گھر' } },
  { id: 'school', label: { en: 'School and study', ur: 'اسکول اور تعلیم' } },
  { id: 'travel', label: { en: 'Travel and transport', ur: 'سفر اور آمدورفت' } },
  { id: 'nature', label: { en: 'Nature and animals', ur: 'قدرت اور جانور' } },
  { id: 'time', label: { en: 'Time and weather', ur: 'وقت اور موسم' } },
  { id: 'colors', label: { en: 'Colors and sizes', ur: 'رنگ اور سائز' } },
  { id: 'daily', label: { en: 'Daily activities', ur: 'روزمرہ کام' } },
];

export const POS_LABELS: Record<Pos, Bilingual> = {
  noun: { en: 'Noun', ur: 'اسم' },
  verb: { en: 'Verb', ur: 'فعل' },
  'i-adjective': { en: 'い-adjective', ur: 'い صفت' },
  expression: { en: 'Expression', ur: 'جملہ' },
  number: { en: 'Number', ur: 'عدد' },
};
