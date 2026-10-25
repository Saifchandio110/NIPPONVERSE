import { useEffect, useState } from 'react';
import { Volume2 } from 'lucide-react';
import { Button, Card } from '../components/ui';
import { resolveCard } from '../lib/cards';
import { RATINGS, buildQueue, schedule } from '../lib/srs';
import { speak, type SpeakResult } from '../lib/speech';
import { useApp } from '../state/AppState';
import type { Key } from '../i18n/en';
import type { Rating } from '../types';

const RATING_KEY: Record<Rating, Key> = { again: 'rateAgain', hard: 'rateHard', good: 'rateGood', easy: 'rateEasy' };

export default function Review() {
  const { t, data, reviewCard } = useApp();
  const { cards, reviewLog } = data.progress;
  const { newCardsPerDay, reviewsPerDay } = data.settings;
  const now = new Date();
  const queue = buildQueue(data.progress, { newPerDay: newCardsPerDay, reviewsPerDay }, now);

  const [session, setSession] = useState<{ ids: string[]; reviewed: number } | null>(null);
  const [finished, setFinished] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [speechMsg, setSpeechMsg] = useState<SpeakResult | null>(null);

  const currentId = session?.ids[0];
  const card = currentId ? cards[currentId] : undefined;
  const face = currentId ? resolveCard(currentId) : null;

  function start() {
    const ids = [...queue.due, ...queue.fresh];
    if (ids.length === 0) return;
    setFinished(null);
    setRevealed(false);
    setSpeechMsg(null);
    setSession({ ids, reviewed: 0 });
  }

  function rate(rating: Rating) {
    if (!session || !currentId) return;
    reviewCard(currentId, rating);
    const rest = session.ids.slice(1);
    const ids = rating === 'again' ? [...rest, currentId] : rest; // Again cards come back this session
    const reviewed = session.reviewed + 1;
    setRevealed(false);
    setSpeechMsg(null);
    if (ids.length === 0) {
      setSession(null);
      setFinished(reviewed);
    } else {
      setSession({ ids, reviewed });
    }
  }

  // A card that cannot be shown (removed or unknown id) is skipped rather than blocking the session.
  useEffect(() => {
    if (session && (!card || !face)) {
      const ids = session.ids.slice(1);
      if (ids.length === 0) {
        setSession(null);
        setFinished(session.reviewed);
      } else setSession({ ...session, ids });
    }
  });

  // Space/Enter reveals; 1-4 rate.
  useEffect(() => {
    if (!session) return;
    const onKey = (e: KeyboardEvent) => {
      if (!revealed && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        setRevealed(true);
      } else if (revealed) {
        const n = Number(e.key);
        if (n >= 1 && n <= 4) rate(RATINGS[n - 1]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const label = (n: number) => (n === 0 ? t('today') : n === 1 ? t('oneDay') : t('nDays', { n }));
  const log = reviewLog.length;
  const recalled = log ? Math.round((reviewLog.filter((e) => e.rating !== 'again').length / log) * 100) : 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold">{t('reviewTitle')}</h1>

      {session && card && face ? (
        <Card>
          <p lang="ja" className={`my-6 text-center font-medium ${[...face.front].length <= 2 ? 'text-8xl' : 'text-5xl'}`}>{face.front}</p>
          {!revealed ? (
            <div className="flex justify-center">
              <Button variant="primary" autoFocus onClick={() => setRevealed(true)}>{t('showAnswer')}</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg bg-navy/5 p-4 text-center">
                <p className="text-3xl font-semibold">{face.romaji}</p>
                {face.meaning && (
                  <p className="mt-1">
                    <span lang="en">{face.meaning.en}</span> / <span lang="ur" dir="rtl">{face.meaning.ur}</span>
                  </p>
                )}
                {face.example && (
                  <div className="mt-2 text-sm">
                    <span lang="ja" className="text-lg">{face.example.word}</span> ({face.example.romaji}) — {face.example.en} / <span lang="ur" dir="rtl">{face.example.ur}</span>
                  </div>
                )}
                <Button className="mt-3" onClick={() => setSpeechMsg(speak(face.speakText))}><Volume2 size={16} /> {t('pronounce')}</Button>
                {speechMsg && speechMsg !== 'ok' && (
                  <p role="alert" className="mt-2 text-sm text-red-700">{t(speechMsg === 'unsupported' ? 'speechUnsupported' : 'speechNoVoice')}</p>
                )}
              </div>
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {RATINGS.map((r, i) => (
                  <li key={r}>
                    <Button variant={r === 'good' ? 'primary' : 'secondary'} className="w-full flex-col !py-3" onClick={() => rate(r)}>
                      <span>{i + 1}. {t(RATING_KEY[r])}</span>
                      <span className="text-xs font-normal opacity-80">{label(schedule(card, r, now).interval)}</span>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      ) : (
        <>
          {finished !== null && (
            <p role="status" className="rounded-lg border border-green-300 bg-green-50 p-3 text-green-900">
              <strong>{t('reviewDone')}.</strong> {t('reviewedCount', { n: finished })}
            </p>
          )}
          <Card>
            <dl className="grid grid-cols-3 gap-4 text-center">
              <div><dt className="text-sm opacity-75">{t('dueNow')}</dt><dd className="text-3xl font-bold">{queue.due.length}</dd></div>
              <div><dt className="text-sm opacity-75">{t('newAvailable')}</dt><dd className="text-3xl font-bold">{queue.fresh.length}</dd></div>
              <div><dt className="text-sm opacity-75">{t('reviewsDone')}</dt><dd className="text-3xl font-bold">{queue.reviewsDoneToday + queue.newDoneToday}</dd></div>
            </dl>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button variant="primary" disabled={queue.due.length + queue.fresh.length === 0} onClick={start}>{t('startReview')}</Button>
              <span className="text-sm opacity-75">{t('cardsInList', { n: Object.keys(cards).length })}</span>
            </div>
            {queue.due.length + queue.fresh.length === 0 && (
              <div className="mt-4 text-sm">
                <p className="font-medium">{t('nothingDue')}</p>
                <p className="opacity-75">{t('nothingDueHint')}</p>
              </div>
            )}
            {log > 0 && <p className="mt-4 text-sm opacity-75">{t('statsLine', { n: log, pct: recalled })}</p>}
          </Card>
        </>
      )}

      <Card title={t('schedTitle')}>
        <p className="text-sm">{t('schedText')}</p>
      </Card>
    </div>
  );
}
