import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import Quiz, { type QuizResult } from '../components/Quiz';
import PronunciationGuide from '../components/PronunciationGuide';
import { Bi, Button, Card } from '../components/ui';
import { GRAMMAR } from '../data/grammar/lessons';
import { buildWeakQuestions, grammarLessonId, weakGrammarIds } from '../lib/grammarQuiz';
import type { Question } from '../lib/quiz';
import { useApp } from '../state/AppState';

export default function Grammar() {
  const { t, data, recordQuiz } = useApp();
  const lang = data.settings.language;
  const done = new Set(data.progress.completedLessons);
  const weakCount = weakGrammarIds(data.progress.weak).length;
  const [session, setSession] = useState<Question[] | null>(null);

  function onFinish(results: QuizResult[], retry: boolean) {
    recordQuiz({ script: 'grammar', scope: 'weak', mode: 'grammar', results, retry });
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-3xl font-bold">{t('grammarTitle')}</h1>
        <p className="mt-2 max-w-3xl opacity-80">{t('grammarIntro')}</p>
        <p className="mt-1 text-sm opacity-70">{t('grammarNote', { n: GRAMMAR.length })}</p>
      </header>

      <PronunciationGuide />

      {session ? (
        <Quiz questions={session} onFinish={onFinish} onExit={() => setSession(null)} />
      ) : (
        <>
          {weakCount > 0 && (
            <Card>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p>{t('grammarToRevisit', { n: weakCount })}</p>
                <Button variant="primary" onClick={() => setSession(buildWeakQuestions(data.progress.weak))}>{t('practiceGrammarMistakes')}</Button>
              </div>
            </Card>
          )}
          <ol className="space-y-3">
            {[...GRAMMAR].sort((a, b) => a.order - b.order).map((l) => {
              const complete = done.has(grammarLessonId(l.id));
              return (
                <li key={l.id}>
                  <Card>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm opacity-70">{t('lessonNumber', { n: l.order })} · {t('questionsCount', { n: l.questions.length })}</p>
                        <h2 className="text-xl font-semibold">{l.title[lang]}</h2>
                        <Bi text={l.summary} primary={lang} />
                        <p lang="ja" className="mt-2 inline-block rounded bg-navy/5 px-2 py-1 text-sm">{l.pattern}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {complete && (
                          <span className="flex items-center gap-1 text-sm text-green-700"><CheckCircle2 size={16} /> {t('completed')}</span>
                        )}
                        <Link to={`/grammar/${l.id}`} className="rounded-lg bg-vermilion px-4 py-2 text-sm font-medium text-white hover:bg-red-700">{t('openLesson')}</Link>
                      </div>
                    </div>
                  </Card>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </div>
  );
}
