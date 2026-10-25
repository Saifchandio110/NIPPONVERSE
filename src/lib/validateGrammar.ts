import { GRAMMAR } from '../data/grammar/lessons';

const hasUrdu = (s: string) => /[\u0600-\u06FF]/.test(s);
const KANA_SENTENCE = /^[\u3041-\u3096\u30a1-\u30fa\u30fc、。！？ ]+$/;
const BLANK = '＿＿';
const stripEnd = (s: string) => s.replace(/[。？！]$/, '');

/** Returns a list of problems; an empty list means the grammar data passed every check. */
export function validateGrammar(): string[] {
  const errors: string[] = [];
  const lessonIds = new Set<string>();
  const orders = new Set<number>();
  const questionIds = new Set<string>();

  for (const l of GRAMMAR) {
    const at = `lesson ${l.id}`;
    if (!/^[a-z-]+$/.test(l.id)) errors.push(`${at}: id must be lowercase letters and hyphens`);
    if (lessonIds.has(l.id)) errors.push(`${at}: duplicate id`);
    lessonIds.add(l.id);
    if (orders.has(l.order)) errors.push(`${at}: duplicate order ${l.order}`);
    orders.add(l.order);

    for (const [name, b] of [['title', l.title], ['summary', l.summary], ['explanation', l.explanation]] as const) {
      if (!b.en.trim() || !hasUrdu(b.ur)) errors.push(`${at}: ${name} needs English and Urdu`);
    }
    if (!l.pattern.trim()) errors.push(`${at}: missing pattern`);
    if (l.examples.length < 2) errors.push(`${at}: needs at least 2 examples`);
    if (l.mistakes.length < 1) errors.push(`${at}: needs at least 1 common mistake`);
    if (l.questions.length < 5) errors.push(`${at}: needs at least 5 practice questions`);

    l.examples.forEach((e, i) => {
      const ea = `${at} example ${i + 1}`;
      if (!KANA_SENTENCE.test(e.reading)) errors.push(`${ea}: reading must be kana only`);
      if (e.tokens.length < 2) errors.push(`${ea}: needs a word-by-word breakdown`);
      const joined = e.tokens.map((x) => x.ja).join('');
      if (joined !== stripEnd(e.ja)) errors.push(`${ea}: tokens "${joined}" do not rebuild the sentence "${stripEnd(e.ja)}"`);
      const joinedReading = e.tokens.map((x) => x.reading ?? x.ja).join('');
      if (joinedReading !== stripEnd(e.reading)) errors.push(`${ea}: token readings "${joinedReading}" do not match reading "${stripEnd(e.reading)}"`);
      for (const x of e.tokens) if (!x.en.trim() || !hasUrdu(x.ur)) errors.push(`${ea}: token ${x.ja} needs English and Urdu glosses`);
      if (!e.en.trim() || !hasUrdu(e.ur)) errors.push(`${ea}: needs natural English and Urdu translations`);
      if (!/[。？！]$/.test(e.ja)) errors.push(`${ea}: sentence must end with 。？ or ！`);
    });

    for (const m of l.mistakes) if (!m.note.en.trim() || !hasUrdu(m.note.ur)) errors.push(`${at}: a mistake note needs English and Urdu`);

    for (const x of l.questions) {
      const qa = `question ${x.id}`;
      if (!x.id.startsWith(`${l.id}-`) || !/^[a-z0-9-]+$/.test(x.id) || x.id.length > 37) errors.push(`${qa}: id must be ${l.id}-<n>, lowercase, at most 37 chars`);
      if (questionIds.has(x.id)) errors.push(`${qa}: duplicate id`);
      questionIds.add(x.id);
      if (x.options.length < 3 || new Set(x.options).size !== x.options.length) errors.push(`${qa}: needs 3+ distinct options`);
      if (x.options.filter((o) => o === x.answer).length !== 1) errors.push(`${qa}: the answer must appear exactly once in the options`);
      if (!x.explanation.en.trim() || !hasUrdu(x.explanation.ur)) errors.push(`${qa}: explanation needs English and Urdu`);
      if (!hasUrdu(x.hint.ur) || (x.type !== 'translate' && !x.hint.en.trim())) errors.push(`${qa}: hint needs Urdu (and English for fill/particle)`);
      if (x.type === 'translate') {
        if (x.promptLang !== 'en') errors.push(`${qa}: translate prompts are English`);
        if (!x.options.every((o) => /[。]$/.test(o) || !/[。]/.test(o))) errors.push(`${qa}: option punctuation inconsistent`);
      } else {
        const blanks = x.prompt.split(BLANK).length - 1;
        if (blanks !== 1) errors.push(`${qa}: prompt needs exactly one ${BLANK}`);
        if (x.type === 'particle' && !x.options.every((o) => [...o].length <= 2)) errors.push(`${qa}: particle options must be short`);
        // the completed sentence must be one of this lesson's example sentences or end with a full stop
        if (!x.prompt.endsWith('。')) errors.push(`${qa}: prompt must end with 。`);
      }
    }
  }
  return errors;
}
