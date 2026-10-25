import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Check, X } from 'lucide-react';
import { normalizeAnswer, shuffle, type Question } from '../lib/quiz';
import { useApp } from '../state/AppState';
import { Button, Card, ProgressBar } from './ui';

export interface QuizResult {
  itemId: string;
  correct: boolean;
}

interface Props {
  questions: Question[];
  /** Called once per finished round (the first round, and each "retry mistakes" round). */
  onFinish: (results: QuizResult[], isRetry: boolean) => void;
  onExit: () => void;
}

export default function Quiz({ questions, onFinish, onExit }: Props) {
  const { t } = useApp();
  const [round, setRound] = useState({ qs: questions, retry: false });
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [typed, setTyped] = useState('');
  const [results, setResults] = useState<QuizResult[]>([]);
  const [done, setDone] = useState(false);
  const lock = useRef(false); // blocks a second submission before React re-renders

  const q = round.qs[index];
  const submitted = answer !== null;
  const correctNow = submitted ? results[index]?.correct : undefined;

  function submit(value: string) {
    if (lock.current || !q) return;
    lock.current = true;
    const correct = q.kind === 'choice' ? value === q.answer : q.accepted.includes(normalizeAnswer(value));
    setAnswer(value);
    setResults((r) => [...r, { itemId: q.itemId, correct }]);
  }

  function next() {
    lock.current = false;
    if (index + 1 >= round.qs.length) {
      setDone(true);
      onFinish(results, round.retry);
    } else {
      setIndex(index + 1);
      setAnswer(null);
      setTyped('');
    }
  }

  function retryMistakes() {
    const missed = round.qs.filter((_, i) => !results[i]?.correct).map((m) => ({ ...m, options: shuffle(m.options) }));
    lock.current = false;
    setRound({ qs: shuffle(missed), retry: true });
    setIndex(0);
    setAnswer(null);
    setTyped('');
    setResults([]);
    setDone(false);
  }

  // Number keys 1-4 pick a choice.
  useEffect(() => {
    if (done || submitted || !q || q.kind !== 'choice') return;
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (Number.isInteger(n) && n >= 1 && n <= q.options.length) submit(q.options[n - 1]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (done) {
    const correct = results.filter((r) => r.correct).length;
    const missed = round.qs.filter((_, i) => !results[i]?.correct);
    const uniqueMissed = [...new Map(missed.map((m) => [m.itemId, m])).values()];
    return (
      <Card title={t('score', { correct, total: results.length })}>
        {uniqueMissed.length > 0 && (
          <div className="mb-4">
            <h3 className="mb-2 font-semibold">{t('missed')}</h3>
            <ul className="flex flex-wrap gap-2">
              {uniqueMissed.map((m) => (
                <li key={m.itemId} className="rounded-lg border border-navy/15 px-3 py-2 text-center">
                  <span lang={m.promptLang} className="text-2xl">{m.prompt}</span>
                  <span className="mx-2 opacity-60">→</span>
                  <span lang={m.optionLang === 'ja' || m.kind === 'choice' ? m.optionLang : 'en'} className="text-xl">{m.answer}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {uniqueMissed.length > 0 && <Button variant="primary" onClick={retryMistakes}>{t('retryMistakes')}</Button>}
          <Button onClick={onExit}>{t('finish')}</Button>
        </div>
      </Card>
    );
  }

  const label = t('quizQuestion', { n: index + 1, total: round.qs.length });
  return (
    <Card>
      <div className="mb-4">
        <p className="mb-1 text-sm opacity-75">{label}</p>
        <ProgressBar value={index + (submitted ? 1 : 0)} max={round.qs.length} label={label} />
      </div>

      <p lang={q.promptLang} className="my-6 text-center text-7xl font-medium">{q.prompt}</p>

      {q.kind === 'choice' ? (
        <ul className="grid grid-cols-2 gap-3">
          {q.options.map((opt, i) => {
            const isAnswer = submitted && opt === q.answer;
            const isWrongPick = submitted && opt === answer && opt !== q.answer;
            return (
              <li key={opt}>
                <button
                  type="button"
                  disabled={submitted}
                  onClick={() => submit(opt)}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg border-2 px-4 py-3 text-xl ${
                    isAnswer ? 'border-green-600 bg-green-50 text-green-900' : isWrongPick ? 'border-red-600 bg-red-50 text-red-900' : 'border-navy/20 bg-white text-navy hover:bg-navy/5'
                  }`}
                >
                  <span className="text-xs opacity-60">{i + 1}</span>
                  <span lang={q.optionLang}>{opt}</span>
                  <span className="w-5">{isAnswer ? <Check size={18} aria-label={t('correct')} /> : isWrongPick ? <X size={18} aria-label={t('incorrect')} /> : null}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <form
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            if (typed.trim()) submit(typed);
          }}
          className="flex flex-wrap items-end justify-center gap-3"
        >
          <label className="text-sm font-medium">
            {t('typeAnswer')}
            <input
              autoFocus
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              lang="en"
              dir="ltr"
              disabled={submitted}
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              className="mt-1 block rounded-lg border border-navy/30 bg-white px-3 py-2 text-lg text-navy"
            />
          </label>
          <Button type="submit" variant="primary" disabled={submitted || !typed.trim()}>{t('check')}</Button>
        </form>
      )}

      {submitted && (
        <div role="status" className={`mt-5 rounded-lg p-4 ${correctNow ? 'bg-green-50 text-green-900' : 'bg-red-50 text-red-900'}`}>
          <p className="flex items-center gap-2 font-semibold">
            {correctNow ? <Check size={18} /> : <X size={18} />} {correctNow ? t('correct') : t('incorrect')}
          </p>
          {!correctNow && <p className="mt-1">{t('answerWas', { answer: q.answer })}</p>}
          <p className="mt-1 text-sm">{t(q.explanationKey, q.explanationVars)}</p>
          <Button autoFocus variant="primary" className="mt-3" onClick={next}>
            {index + 1 >= round.qs.length ? t('seeResults') : t('next')}
          </Button>
        </div>
      )}
    </Card>
  );
}
