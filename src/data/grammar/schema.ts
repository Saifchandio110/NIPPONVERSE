import type { Bilingual } from '../../types';

/** One piece of a sentence in the word-by-word breakdown. */
export interface GrammarToken {
  ja: string;
  reading?: string; // only when ja contains kanji
  romaji?: string; // only when the computed romaji would be wrong (e.g. ではありません → dewa arimasen)
  en: string;
  ur: string;
}

export interface GrammarExample {
  ja: string;
  reading: string; // full kana reading as written (は stays は)
  tokens: GrammarToken[]; // concatenated, they must equal ja without its final punctuation
  en: string; // natural English
  ur: string; // natural Urdu
}

export type GrammarQType = 'fill' | 'particle' | 'translate';

export interface GrammarQuestion {
  id: string; // unique across all lessons, lowercase ascii, used for saved mistakes
  type: GrammarQType;
  prompt: string; // fill/particle: Japanese with ＿＿ for the blank; translate: the sentence to translate
  promptLang: 'ja' | 'en';
  hint: Bilingual; // meaning of the prompt (for translate questions the English part may be empty)
  options: string[];
  answer: string;
  explanation: Bilingual;
}

export interface GrammarMistake {
  wrong?: string;
  right?: string;
  note: Bilingual;
}

export interface GrammarLesson {
  id: string;
  order: number;
  level: 'beginner';
  title: Bilingual;
  summary: Bilingual;
  pattern: string;
  explanation: Bilingual;
  examples: GrammarExample[];
  mistakes: GrammarMistake[];
  questions: GrammarQuestion[];
}
