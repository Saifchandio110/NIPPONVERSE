import { describe, expect, it } from 'vitest';
import { defaultData, sanitize } from './storage';
import { addCards, applyReview, buildQueue, newCard, schedule } from './srs';

const day = (m: number, d: number) => new Date(2026, m - 1, d, 9, 30);

describe('schedule', () => {
  it('Good grows 1, 3 days, then by ease', () => {
    let c = newCard('hira:あ', day(10, 20));
    c = schedule(c, 'good', day(10, 20));
    expect([c.interval, c.due]).toEqual([1, '2026-10-21']);
    c = schedule(c, 'good', day(10, 21));
    expect([c.interval, c.due]).toEqual([3, '2026-10-24']);
    c = schedule(c, 'good', day(10, 24));
    expect([c.interval, c.due, c.ease]).toEqual([8, '2026-11-01', 2.5]);
  });
  it('Again resets, is due today, lowers ease with a floor', () => {
    let c = schedule(schedule(newCard('x', day(10, 20)), 'good', day(10, 20)), 'again', day(10, 21));
    expect([c.reps, c.interval, c.due, c.lapses, c.ease]).toEqual([0, 0, '2026-10-21', 1, 2.3]);
    for (let i = 0; i < 20; i++) c = schedule(c, 'again', day(10, 21));
    expect(c.ease).toBe(1.3);
  });
  it('Easy and Hard adjust ease and interval', () => {
    const e = schedule(newCard('x', day(10, 20)), 'easy', day(10, 20));
    expect([e.interval, e.ease]).toEqual([4, 2.65]);
    const h = schedule(schedule(newCard('x', day(10, 20)), 'good', day(10, 20)), 'hard', day(10, 21));
    expect([h.interval, h.ease]).toEqual([2, 2.35]);
  });
  it('handles month and year boundaries and DST by calendar day', () => {
    const c = schedule(newCard('x', new Date(2026, 11, 31, 23, 59)), 'good', new Date(2026, 11, 31, 23, 59));
    expect(c.due).toBe('2027-01-01');
    const dst = schedule(newCard('x', new Date(2026, 2, 7, 12)), 'easy', new Date(2026, 2, 7, 12));
    expect(dst.due).toBe('2026-03-11');
  });
});

describe('queue and reviews', () => {
  const ids = ['hira:あ', 'hira:い', 'hira:う', 'hira:え'];
  it('limits new cards per day and counts today’s reviews', () => {
    let p = addCards(defaultData().progress, ids, day(10, 20));
    let q = buildQueue(p, { newPerDay: 2, reviewsPerDay: 50 }, day(10, 20));
    expect(q.fresh).toHaveLength(2);
    p = applyReview(p, q.fresh[0], 'good', day(10, 20));
    p = applyReview(p, q.fresh[1], 'again', day(10, 20));
    q = buildQueue(p, { newPerDay: 2, reviewsPerDay: 50 }, day(10, 20));
    expect(q.fresh).toHaveLength(0);
    expect(q.newDoneToday).toBe(2);
    expect(q.due).toEqual([ids[1]]); // the Again card is due today
    expect(p.activity['2026-10-20']).toBe(2);
    expect(p.reviewLog).toHaveLength(2);
  });
  it('shows due cards only when due and respects the review limit', () => {
    let p = addCards(defaultData().progress, ids, day(10, 20));
    for (const id of ids) p = applyReview(p, id, 'good', day(10, 20));
    expect(buildQueue(p, { newPerDay: 10, reviewsPerDay: 50 }, day(10, 20)).due).toEqual([]);
    expect(buildQueue(p, { newPerDay: 10, reviewsPerDay: 50 }, day(10, 21)).due).toHaveLength(4);
    expect(buildQueue(p, { newPerDay: 10, reviewsPerDay: 3 }, day(10, 21)).due).toHaveLength(3);
  });
  it('survives a save/load round trip (sanitize)', () => {
    let p = addCards(defaultData().progress, ids, day(10, 20));
    p = applyReview(p, ids[0], 'easy', day(10, 20));
    const back = sanitize({ progress: p }).progress;
    expect(back.cards).toEqual(p.cards);
    expect(back.reviewLog).toEqual(p.reviewLog);
  });
  it('ignores reviews for cards that do not exist', () => {
    const p = defaultData().progress;
    expect(applyReview(p, 'nope', 'good', day(10, 20))).toBe(p);
  });
});
