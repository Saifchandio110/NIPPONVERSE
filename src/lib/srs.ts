import type { Card, Progress, Rating, ReviewLogEntry } from '../types';
import { dateKey } from './stats';

/**
 * Simplified SM-2 style scheduler. All dates are local calendar days (YYYY-MM-DD), so refreshes,
 * time zones and daylight-saving changes cannot shift a due date by a few hours.
 *
 *  Again: reset streak, due again today (re-shown in the same session), ease -0.20 (min 1.3)
 *  Hard : 1 day on first success, else interval x1.2 (at least +1 day), ease -0.15
 *  Good : 1 day, then 3 days, then interval x ease (at least +1 day)
 *  Easy : 4 days, then 7 days, then interval x ease x 1.3 (at least +2 days), ease +0.15 (max 3.5)
 */
export const RATINGS: Rating[] = ['again', 'hard', 'good', 'easy'];
export const MIN_EASE = 1.3;
export const MAX_EASE = 3.5;
export const START_EASE = 2.5;
export const MAX_LOG = 500;

export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const round2 = (n: number) => Math.round(n * 100) / 100;

export const newCard = (id: string, now: Date): Card => ({
  id, ease: START_EASE, interval: 0, reps: 0, lapses: 0, due: dateKey(now), added: dateKey(now),
});

export const isNewCard = (c: Card) => c.last === undefined;

export function schedule(card: Card, rating: Rating, now: Date): Card {
  let { ease, interval, reps, lapses } = card;
  switch (rating) {
    case 'again':
      reps = 0; lapses += 1; interval = 0; ease = Math.max(MIN_EASE, ease - 0.2);
      break;
    case 'hard':
      interval = reps === 0 ? 1 : Math.max(interval + 1, Math.round(interval * 1.2));
      ease = Math.max(MIN_EASE, ease - 0.15); reps += 1;
      break;
    case 'good':
      interval = reps === 0 ? 1 : reps === 1 ? 3 : Math.max(interval + 1, Math.round(interval * ease));
      reps += 1;
      break;
    case 'easy':
      interval = reps === 0 ? 4 : reps === 1 ? 7 : Math.max(interval + 2, Math.round(interval * ease * 1.3));
      ease = Math.min(MAX_EASE, ease + 0.15); reps += 1;
      break;
  }
  return { ...card, ease: round2(ease), interval, reps, lapses, due: dateKey(addDays(now, interval)), last: dateKey(now) };
}

export function addCards(progress: Progress, ids: string[], now: Date): Progress {
  const cards = { ...progress.cards };
  for (const id of ids) if (!cards[id]) cards[id] = newCard(id, now);
  return { ...progress, cards };
}

export function removeCard(progress: Progress, id: string): Progress {
  const cards = { ...progress.cards };
  delete cards[id];
  return { ...progress, cards };
}

export function applyReview(progress: Progress, id: string, rating: Rating, now: Date): Progress {
  const card = progress.cards[id];
  if (!card) return progress;
  const next = schedule(card, rating, now);
  const day = dateKey(now);
  const entry: ReviewLogEntry = { id, rating, day, interval: next.interval, isNew: isNewCard(card) };
  return {
    ...progress,
    cards: { ...progress.cards, [id]: next },
    reviewLog: [entry, ...progress.reviewLog].slice(0, MAX_LOG),
    activity: { ...progress.activity, [day]: (progress.activity[day] ?? 0) + 1 },
  };
}

export interface Limits { newPerDay: number; reviewsPerDay: number }

export interface QueueInfo {
  due: string[]; // reviewed-before cards due today or earlier, oldest first
  fresh: string[]; // never-reviewed cards, within today's new-card allowance
  newDoneToday: number;
  reviewsDoneToday: number;
}

export function buildQueue(progress: Progress, limits: Limits, now: Date): QueueInfo {
  const today = dateKey(now);
  const todays = progress.reviewLog.filter((e) => e.day === today);
  const newDoneToday = todays.filter((e) => e.isNew).length;
  const reviewsDoneToday = todays.filter((e) => !e.isNew).length;
  const cards = Object.values(progress.cards);
  const byId = (a: Card, b: Card) => (a.id < b.id ? -1 : 1);
  const due = cards
    .filter((c) => !isNewCard(c) && c.due <= today)
    .sort((a, b) => (a.due === b.due ? byId(a, b) : a.due < b.due ? -1 : 1))
    .slice(0, Math.max(0, limits.reviewsPerDay - reviewsDoneToday))
    .map((c) => c.id);
  const fresh = cards
    .filter(isNewCard)
    .sort((a, b) => (a.added === b.added ? byId(a, b) : a.added < b.added ? -1 : 1))
    .slice(0, Math.max(0, limits.newPerDay - newDoneToday))
    .map((c) => c.id);
  return { due, fresh, newDoneToday, reviewsDoneToday };
}
