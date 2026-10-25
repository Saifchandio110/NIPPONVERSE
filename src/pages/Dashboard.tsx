import { Link } from 'react-router-dom';
import { Card, ProgressBar } from '../components/ui';
import { GRAMMAR, GRAMMAR_BY_ID } from '../data/grammar/lessons';
import { grammarLessonId, weakGrammarIds } from '../lib/grammarQuiz';
import { getGroups, getItems, groupLabel, lessonId } from '../lib/kana';
import { buildQueue } from '../lib/srs';
import { computeStreak, dateKey, lastDays } from '../lib/stats';
import { VOCAB_BY_ID } from '../lib/vocab';
import { useApp } from '../state/AppState';
import type { Script, StudySet } from '../types';

const SCRIPTS: Script[] = ['hira', 'kata'];
const PATH: Record<Script, string> = { hira: '/hiragana', kata: '/katakana' };

// Every number here is derived from saved activity. There are no demo values.
export default function Dashboard() {
  const { t, data } = useApp();
  const { activity, completedLessons, weak, history, recentVocab } = data.progress;
  const { displayName, dailyGoal, language } = data.settings;
  const today = activity[dateKey()] ?? 0;
  const days = lastDays(7);
  const counts = days.map((d) => activity[dateKey(d)] ?? 0);
  const peak = Math.max(1, ...counts);
  const locale = language === 'ur' ? 'ur-PK' : 'en-GB';

  const scriptName = (s: StudySet) => t(s === 'hira' ? 'hiragana' : s === 'kata' ? 'katakana' : 'navGrammar');
  const scopeLabel = (s: StudySet, scope: string) => {
    if (scope === 'all') return t('scopeAll');
    if (scope === 'weak') return t('scopeWeak');
    if (s === 'grammar') return GRAMMAR_BY_ID.get(scope)?.title[language] ?? scope;
    const groups = getGroups(s);
    return groupLabel(groups.find((g) => g.id === scope) ?? groups[0], s);
  };

  // Kana lessons first, then grammar lessons in order.
  const lessons = [
    ...SCRIPTS.flatMap((s) =>
      getGroups(s).map((g) => ({ id: lessonId(s, g.id), name: `${scriptName(s)} · ${groupLabel(g, s)}`, to: `${PATH[s]}?scope=${g.id}` })),
    ),
    ...[...GRAMMAR].sort((a, b) => a.order - b.order).map((l) => ({ id: grammarLessonId(l.id), name: `${scriptName('grammar')} · ${l.title[language]}`, to: `/grammar/${l.id}` })),
  ];
  const doneSet = new Set(completedLessons);
  const doneCount = lessons.filter((l) => doneSet.has(l.id)).length;
  const next = lessons.find((l) => !doneSet.has(l.id));

  const queue = buildQueue(data.progress, { newPerDay: data.settings.newCardsPerDay, reviewsPerDay: data.settings.reviewsPerDay }, new Date());

  const weakList = SCRIPTS.flatMap((s) => getItems(s))
    .filter((i) => (weak[i.id] ?? 0) > 0)
    .sort((a, b) => (weak[b.id] ?? 0) - (weak[a.id] ?? 0))
    .slice(0, 8);
  const weakScripts = SCRIPTS.filter((s) => weakList.some((i) => i.script === s));
  const grammarWeak = weakGrammarIds(weak).length;

  const link = 'inline-block rounded-lg px-4 py-2 text-sm font-medium';
  const primaryLink = `${link} bg-vermilion text-white hover:bg-red-700`;
  const plainLink = `${link} border border-navy/20 bg-white text-navy hover:bg-navy/5`;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{displayName ? t('welcomeNamed', { name: displayName }) : t('welcome')}</h1>
        <p className="mt-1 opacity-75">{t('welcomeSub')}</p>
      </div>

      <Card title={t('nextLesson')}>
        {next ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xl">{next.name}</p>
            <Link to={next.to} className={primaryLink}>{t('continueLearning')}</Link>
          </div>
        ) : (
          <p>{t('allDone')}</p>
        )}
      </Card>

      <Card title={t('reviewQueue')}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p>
            {t('dueNow')}: <strong>{queue.due.length}</strong> · {t('newAvailable')}: <strong>{queue.fresh.length}</strong>
          </p>
          <Link to="/review" className={plainLink}>{t('goReview')}</Link>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card title={t('streak')}>
          <p className="text-3xl font-bold">{t('streakDays', { n: computeStreak(activity) })}</p>
        </Card>
        <Card title={t('lessonsCompleted')}>
          <p className="text-3xl font-bold">{t('lessonsOf', { n: doneCount, total: lessons.length })}</p>
        </Card>
        <Card title={t('todayGoal')}>
          <p className="mb-2 text-sm">{t('goalProgress', { done: today, goal: dailyGoal })}</p>
          <ProgressBar value={today} max={dailyGoal} label={t('todayGoal')} />
        </Card>
      </div>

      <Card title={t('quickAccess')}>
        <div className="flex flex-wrap gap-2">
          {SCRIPTS.map((s) => (
            <Link key={s} to={PATH[s]} className={plainLink}>
              {scriptName(s)} <span lang="ja">{s === 'hira' ? 'ひらがな' : 'カタカナ'}</span>
            </Link>
          ))}
          <Link to="/grammar" className={plainLink}>{t('navGrammar')}</Link>
          <Link to="/vocabulary" className={plainLink}>{t('navVocabulary')}</Link>
        </div>
      </Card>

      <Card title={t('weeklyActivity')}>
        {counts.some((c) => c > 0) ? (
          <ul className="flex h-32 items-end gap-2">
            {days.map((d, i) => {
              const label = d.toLocaleDateString(locale, { weekday: 'short' });
              const text = t('activityCount', { n: counts[i], day: label });
              return (
                <li key={dateKey(d)} className="flex flex-1 flex-col items-center justify-end gap-1" title={text}>
                  <div className="w-full rounded-t bg-vermilion" style={{ height: `${(counts[i] / peak) * 100}%`, minHeight: counts[i] ? 4 : 0 }} role="img" aria-label={text} />
                  <span className="text-xs opacity-70">{label}</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="opacity-75">{t('weeklyEmpty')}</p>
        )}
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title={t('recent')}>
          {history.length === 0 ? (
            <p className="opacity-75">{t('recentEmpty')}</p>
          ) : (
            <ul className="space-y-2">
              {history.slice(0, 5).map((h) => (
                <li key={h.date} className="text-sm">
                  {t('recentLine', { label: `${scriptName(h.script)} · ${scopeLabel(h.script, h.scope)}`, correct: h.correct, total: h.total })}
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card title={t('weakAreas')}>
          {weakList.length === 0 && grammarWeak === 0 ? (
            <p className="opacity-75">{t('weakEmpty')}</p>
          ) : (
            <>
              {weakList.length > 0 && (
                <ul className="mb-3 flex flex-wrap gap-2">
                  {weakList.map((i) => (
                    <li key={i.id} className="rounded-lg border border-navy/15 px-3 py-1 text-center" title={t('misses', { n: weak[i.id] })}>
                      <span lang="ja" className="text-xl">{i.char}</span>
                      <span className="block text-xs opacity-70">{t('misses', { n: weak[i.id] })}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex flex-wrap gap-2">
                {weakScripts.map((s) => (
                  <Link key={s} to={`${PATH[s]}?scope=weak`} className={primaryLink}>
                    {t('practiceWeak')}: {scriptName(s)}
                  </Link>
                ))}
                {grammarWeak > 0 && <Link to="/grammar" className={primaryLink}>{t('grammarToRevisit', { n: grammarWeak })}</Link>}
              </div>
            </>
          )}
        </Card>
      </div>

      <Card title={t('recentWords')}>
        {recentVocab.length === 0 ? (
          <p className="opacity-75">{t('recentWordsEmpty')}</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {recentVocab.flatMap((id) => {
              const v = VOCAB_BY_ID.get(id);
              return v ? [v] : [];
            }).map((v) => (
              <li key={v.id}>
                <Link to={`/vocabulary/${v.id}`} className="block rounded-lg border border-navy/15 px-3 py-1 text-center hover:bg-navy/5">
                  <span lang="ja" className="text-xl">{v.word}</span>
                  <span className="block text-xs opacity-70">{language === 'ur' ? v.ur : v.en}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <p className="text-sm opacity-70">{t('storageNotice')}</p>
    </div>
  );
}
