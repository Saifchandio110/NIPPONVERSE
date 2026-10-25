import { GRAMMAR, GRAMMAR_Q_BY_ID } from '../data/grammar/lessons';
import type { GrammarQuestion } from '../data/grammar/schema';
import { shuffle, type Question, type Rng } from './quiz';
import { blankedRomaji, sentenceRomaji } from './sentenceRomaji';

export const GRAMMAR_ITEM_PREFIX = 'gq:';
export const grammarItemId = (questionId: string) => `${GRAMMAR_ITEM_PREFIX}${questionId}`;
export const grammarLessonId = (lessonId: string) => `grammar-${lessonId}`;

function toQuestion(g: GrammarQuestion, n: number, rng: Rng): Question {
  const optionRomaji: Record<string, string> = {};
  for (const o of g.options) {
    const r = sentenceRomaji(o);
    if (r) optionRomaji[o] = r;
  }
  const promptRomaji = g.promptLang === 'ja' ? blankedRomaji(g.prompt) : null;
  return {
    ...(promptRomaji ? { promptRomaji } : {}),
    ...(Object.keys(optionRomaji).length ? { optionRomaji } : {}),
    id: `grammar:${g.id}:${n}`,
    itemId: grammarItemId(g.id),
    mode: 'grammar',
    kind: 'choice',
    prompt: g.prompt,
    promptLang: g.promptLang,
    hint: g.hint,
    options: shuffle(g.options, rng),
    optionLang: 'ja',
    answer: g.answer,
    accepted: [],
    explanationText: g.explanation,
  };
}

/** All questions of one lesson in random order, with shuffled options. */
export function buildLessonQuestions(lessonId: string, rng: Rng = Math.random): Question[] {
  const lesson = GRAMMAR.find((l) => l.id === lessonId);
  return lesson ? shuffle(lesson.questions, rng).map((g, n) => toQuestion(g, n, rng)) : [];
}

/** Questions the learner previously missed (saved mistake ids look like gq:<question id>). */
export function weakGrammarIds(weak: Record<string, number>): string[] {
  return Object.keys(weak).filter((k) => k.startsWith(GRAMMAR_ITEM_PREFIX) && weak[k] > 0 && GRAMMAR_Q_BY_ID.has(k.slice(GRAMMAR_ITEM_PREFIX.length)));
}

export function buildWeakQuestions(weak: Record<string, number>, rng: Rng = Math.random): Question[] {
  const found = weakGrammarIds(weak).map((k) => GRAMMAR_Q_BY_ID.get(k.slice(GRAMMAR_ITEM_PREFIX.length))!.question);
  return shuffle(found, rng).map((g, n) => toQuestion(g, n, rng));
}
