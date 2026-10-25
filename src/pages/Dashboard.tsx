import { Link } from 'react-router-dom';
import { VOCAB_BY_ID } from '../lib/vocab';
import { Card, ProgressBar } from '../components/ui';
import { getGroups, getItems, groupLabel, lessonId } from '../lib/kana';
import { buildQueue } from '../lib/srs';
import { computeStreak, dateKey, lastDays } from '../lib/stats';
import { useApp } from '../state/AppState';
import type { Script } from '../types';

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

  const allLessons = SCRIPTS.flatMap((s) => getGroups(s).map((g) => ({ script: s, group: g, id: lessonId(s, g.id) })));
  const doneSet = new Set(completedLessons);
  const doneCount = allLessons.filter((l) => doneSet.has(l.id)).length;
  const queue = buildQueue(data.progress, { newPerDay: data.settings.newCardsPerDay, reviewsPerDay: data.settings.reviewsPerDay }, new Date());
  const next = allLessons.find((l) => !doneSet.has(l.id));

  const scriptName = (s: Script) => t(s === 'hira' ? 'hiragana' : 'katakana');
  const scopeLabel = (s: Script, scope: string) =>
    scope === 'all' ? t('scopeAll') : scope === 'weak' ? t('scopeWeak') : groupLabel(getGroups(s).find((g) => g.id === scope) ?? getGroups(s)[0], s);

  const weakList = SCRIPTS.flatMap((s) => getItems(s))
    .filter((i) => (weak[i.id] ?? 0) > 0)
    .sort((a, b) => (weak[b.id] ?? 0) - (weak[a.id] ?? 0))
    .slice(0, 8);
  const weakScripts = SCRIPTS.filter((s) => weakList.some((i) => i.script === s));

  const link = 'inline-block rounded-lg px-4 py-2 text-sm font-medium';

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{displayName ? t('welcomeNamed', { name: displayName }) : t('welcome')}</h1>
        <p className="mt-1 opacity-75">{t('welcomeSub')}</p>
      </div>

      <Card title={t('nextLesson')}>
        {next ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xl">
              {scriptName(next.script)} · <span lang="ja">{groupLabel(next.group, next.script)}</span>
            </p>
            <Link to={`${PATH[next.script]}?scope=${next.group.id}`} className={`${link} bg-vermilion text-white hover:bg-red-700`}>
              {t('continueLearning')}
            </Link>
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
          <Link to="/review" className={`${link} border border-navy/20 bg-white text-navy hover:bg-navy/5`}>{t('goReview')}</Link>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card title={t('streak')}>
          <p className="text-3xl font-bold">{t('streakDays', { n: computeStreak(activity) })}</p>
        </Card>
        <Card title={t('lessonsCompleted')}>
          <p className="text-3xl font-bold">{t('lessonsOf', { n: doneCount, total: allLessons.length })}</p>
        </Card>
        <Card title={t('todayGoal')}>
          <p className="mb-2 text-sm">{t('goalProgress', { done: today, goal: dailyGoal })}</p>
          <ProgressBar value={today} max={dailyGoal} label={t('todayGoal')} />
        </Card>
      </div>

      <Card title={t('quickAccess')}>
        <div className="flex flex-wrap gap-2">
          {SCRIPTS.map((s) => (
            <Link key={s} to={PATH[s]} className={`${link} border border-navy/20 bg-white text-navy hover:bg-navy/5`}>
              {scriptName(s)} <span lang="ja">{s === 'hira' ? 'ひらがな' : 'カタカナ'}</span>
            </Link>
          ))}
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
          {weakList.length === 0 ? (
            <p className="opacity-75">{t('weakEmpty')}</p>
          ) : (
            <>
              <ul className="mb-3 flex flex-wrap gap-2">
                {weakList.map((i) => (
                  <li key={i.id} className="rounded-lg border border-navy/15 px-3 py-1 text-center" title={t('misses', { n: weak[i.id] })}>
                    <span lang="ja" className="text-xl">{i.char}</span>
                    <span className="block text-xs opacity-70">{t('misses', { n: weak[i.id] })}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                {weakScripts.map((s) => (
                  <Link key={s} to={`${PATH[s]}?scope=weak`} className={`${link} bg-vermilion text-white hover:bg-red-700`}>
                    {t('practiceWeak')}: {scriptName(s)}
                  </Link>
                ))}
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
