import { describe, expect, it } from 'vitest';
import { GRAMMAR, GRAMMAR_Q_BY_ID } from '../data/grammar/lessons';
import { buildLessonQuestions, buildWeakQuestions, grammarItemId, weakGrammarIds } from './grammarQuiz';
import { validateGrammar } from './validateGrammar';

describe('grammar data', () => {
  it('passes validation', () => {
    expect(validateGrammar()).toEqual([]);
  });
  it('has six ordered beginner lessons with five questions each', () => {
    expect(GRAMMAR.map((l) => l.order)).toEqual([1, 2, 3, 4, 5, 6]);
    for (const l of GRAMMAR) expect(l.questions).toHaveLength(5);
  });
  it('every example sentence rebuilds from its tokens', () => {
    for (const l of GRAMMAR) for (const e of l.examples) expect(e.tokens.map((t) => t.ja).join('')).toBe(e.ja.replace(/[。？！]$/, ''));
  });
  it('fill and particle answers are taught somewhere in their own lesson', () => {
    // Guards against answer keys drifting from the lesson text: the completed sentence is an example
    // sentence, or the answer appears in an example, the pattern or the explanation of the same lesson.
    const allExamples = GRAMMAR.flatMap((l) => l.examples.map((e) => e.ja));
    for (const l of GRAMMAR) {
      for (const q of l.questions.filter((x) => x.type !== 'translate')) {
        const completed = q.prompt.replace('＿＿', q.answer);
        const inSomeExample = allExamples.some((s) => s === completed);
        const inLesson = l.examples.some((e) => e.ja.includes(q.answer)) || l.pattern.includes(q.answer) || l.explanation.en.includes(q.answer);
        expect(inSomeExample || inLesson).toBe(true);
      }
    }
  });
});

describe('grammar quiz builder', () => {
  it('builds every question with its answer among shuffled options', () => {
    for (const l of GRAMMAR) {
      const qs = buildLessonQuestions(l.id);
      expect(qs).toHaveLength(5);
      for (const q of qs) {
        expect(q.options).toContain(q.answer);
        expect(q.explanationText).toBeTruthy();
        expect(q.itemId.startsWith('gq:')).toBe(true);
      }
    }
  });
  it('returns nothing for an unknown lesson', () => {
    expect(buildLessonQuestions('nope')).toEqual([]);
  });
  it('rebuilds a practice set from saved mistakes and ignores unknown ids', () => {
    const weak = { [grammarItemId('wo-masu-1')]: 2, [grammarItemId('noun-desu-3')]: 1, 'gq:missing-9': 3, 'hira:か': 4 };
    expect(weakGrammarIds(weak).sort()).toEqual(['gq:noun-desu-3', 'gq:wo-masu-1']);
    const qs = buildWeakQuestions(weak);
    expect(qs.map((q) => q.itemId).sort()).toEqual(['gq:noun-desu-3', 'gq:wo-masu-1']);
    expect(GRAMMAR_Q_BY_ID.size).toBe(30);
  });
});
