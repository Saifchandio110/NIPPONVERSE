import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, Volume2, X } from 'lucide-react';
import Quiz, { type QuizResult } from '../components/Quiz';
import { Bi, Breadcrumbs, Button, Card } from '../components/ui';
import { GRAMMAR, GRAMMAR_BY_ID } from '../data/grammar/lessons';
import { buildLessonQuestions, grammarLessonId } from '../lib/grammarQuiz';
import type { Question } from '../lib/quiz';
import PronunciationGuide from '../components/PronunciationGuide';
import { exampleRomajiLine, sentenceRomaji, tokenRomaji } from '../lib/sentenceRomaji';
import { speak, type SpeakResult } from '../lib/speech';
import { useApp } from '../state/AppState';

export default function GrammarLesson() {
  const { id = '' } = useParams();
  const { t, data, recordQuiz } = useApp();
  const lang = data.settings.language;
  const lesson = GRAMMAR_BY_ID.get(id);
  const [session, setSession] = useState<Question[] | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [speechMsg, setSpeechMsg] = useState<SpeakResult | null>(null);

  const crumbs = (last: string) => [
    { text: t('navDashboard'), to: '/' },
    { text: t('navGrammar'), to: '/grammar' },
    { text: last },
  ];

  if (!lesson) {
    return (
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs label={t('breadcrumbs')} items={crumbs('?')} />
        <p role="alert" className="mb-4">{t('lessonNotFound')}</p>
        <Link to="/grammar" className="rounded-lg bg-vermilion px-4 py-2 text-white">{t('backToGrammar')}</Link>
      </div>
    );
  }

  const next = GRAMMAR.find((l) => l.order === lesson.order + 1);
  const complete = data.progress.completedLessons.includes(grammarLessonId(lesson.id));

  function onFinish(results: QuizResult[], retry: boolean) {
    if (!lesson) return;
    recordQuiz({ script: 'grammar', scope: lesson.id, mode: 'grammar', results, retry, lessonId: grammarLessonId(lesson.id) });
    const correct = results.filter((r) => r.correct).length;
    if (!retry && results.length >= 5 && correct / results.length >= 0.8) setNotice(t('lessonComplete'));
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Breadcrumbs label={t('breadcrumbs')} items={crumbs(lesson.title[lang])} />
      <header>
        <p className="text-sm opacity-70">{t('lessonNumber', { n: lesson.order })}{complete && ` · ${t('completed')}`}</p>
        <h1 className="text-3xl font-bold">{lesson.title[lang]}</h1>
        <p lang={lang === 'en' ? 'ur' : 'en'} dir={lang === 'en' ? 'rtl' : 'ltr'} className="opacity-75">{lesson.title[lang === 'en' ? 'ur' : 'en']}</p>
      </header>

      {notice && <p role="status" className="rounded-lg border border-green-300 bg-green-50 p-3 font-medium text-green-900">{notice}</p>}

      {session ? (
        <Quiz questions={session} onFinish={onFinish} onExit={() => setSession(null)} />
      ) : (
        <>
          <PronunciationGuide />

          <Card title={t('pattern')}>
            <p lang="ja" className="text-2xl">{lesson.pattern}</p>
          </Card>

          <Card title={t('explanation')}>
            <Bi text={lesson.explanation} primary={lang} />
          </Card>

          <section aria-labelledby="ex-h" className="space-y-3">
            <h2 id="ex-h" className="text-xl font-semibold">{t('examples')}</h2>
            {lesson.examples.map((e) => (
              <Card key={e.ja}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p lang="ja" className="text-2xl">{e.ja}</p>
                    <p lang="ja" className="text-sm opacity-80">{e.reading}</p>
                    {data.settings.showRomaji && <p lang="en" className="text-sm font-medium">{exampleRomajiLine(e)}</p>}
                  </div>
                  <Button onClick={() => setSpeechMsg(speak(e.ja))}><Volume2 size={16} /> {t('listenExample')}</Button>
                </div>
                <p className="mb-1 mt-4 text-sm font-medium opacity-70">{t('wordByWord')}</p>
                <ul className="flex flex-wrap gap-2">
                  {e.tokens.map((k, i) => (
                    <li key={i} className="min-w-[4.5rem] rounded-lg border border-navy/15 bg-navy/5 px-2 py-1 text-center">
                      <span lang="ja" className="block text-lg">{k.ja}</span>
                      {k.reading && <span lang="ja" className="block text-xs opacity-70">{k.reading}</span>}
                      {data.settings.showRomaji && <span lang="en" className="block text-xs font-medium">{tokenRomaji(k)}</span>}
                      <span lang="en" className="block text-xs">{k.en}</span>
                      <span lang="ur" dir="rtl" className="block text-xs">{k.ur}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <p lang="en">{e.en}</p>
                  <p lang="ur" dir="rtl">{e.ur}</p>
                </div>
              </Card>
            ))}
            {speechMsg && speechMsg !== 'ok' && (
              <p role="alert" className="text-sm text-red-700">{t(speechMsg === 'unsupported' ? 'speechUnsupported' : 'speechNoVoice')}</p>
            )}
            <p className="text-xs opacity-70">{t('grammarSpeechNote')}</p>
          </section>

          <section aria-labelledby="mk-h" className="space-y-3">
            <h2 id="mk-h" className="text-xl font-semibold">{t('grammarMistakes')}</h2>
            {lesson.mistakes.map((m, i) => (
              <Card key={i}>
                {(m.wrong || m.right) && (
                  <div className="mb-2 flex flex-wrap gap-4">
                    {m.wrong && <p className="flex items-center gap-1 text-red-800"><X size={16} aria-label={t('incorrect2')} /> <span lang="ja" className="text-lg line-through">{m.wrong}</span></p>}
                    {m.right && (
                      <p className="flex flex-wrap items-center gap-1 text-green-800"><Check size={16} aria-label={t('correct2')} /> <span lang="ja" className="text-lg">{m.right}</span>
                        {data.settings.showRomaji && sentenceRomaji(m.right) && <span lang="en" className="text-sm opacity-80">({sentenceRomaji(m.right)})</span>}
                      </p>
                    )}
                  </div>
                )}
                <Bi text={m.note} primary={lang} />
              </Card>
            ))}
          </section>

          <Card title={t('grammarPractice')}>
            <p className="mb-3 text-sm">{t('grammarPracticeIntro')}</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="primary" onClick={() => { setNotice(null); setSession(buildLessonQuestions(lesson.id)); }}>{t('startPractice')}</Button>
              {next && <Link to={`/grammar/${next.id}`} className="inline-flex items-center rounded-lg border border-navy/20 bg-white px-4 py-2 text-sm font-medium text-navy hover:bg-navy/5">{t('nextLessonLink')}: {next.title[lang]}</Link>}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
