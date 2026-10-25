import { describe, expect, it } from 'vitest';
import { CURRENT_VERSION, defaultData, exportJson, parseImport, sanitize } from './storage';
import { computeStreak, dateKey } from './stats';

describe('storage', () => {
  it('falls back to defaults for garbage', () => {
    expect(sanitize(42)).toEqual(defaultData());
    expect(sanitize({ settings: { dailyGoal: 'x', language: 'fr' } }).settings.language).toBe('en');
  });
  it('clamps values and drops bad activity keys', () => {
    const d = sanitize({ settings: { dailyGoal: 9999 }, progress: { activity: { '2026-01-01': 3, bad: 5, '2026-01-02': -1 } } });
    expect(d.settings.dailyGoal).toBe(200);
    expect(d.progress.activity).toEqual({ '2026-01-01': 3 });
  });
  it('keeps valid weak/history and drops invalid ones', () => {
    const ok = { date: '2026-10-20T10:00:00Z', script: 'hira', scope: 'all', mode: 'read', correct: 3, total: 5, retry: false };
    const d = sanitize({ progress: { weak: { 'hira:か': 2, bad: 0, x: 1.5 }, history: [ok, { ...ok, mode: 'nope' }, { ...ok, correct: 9 }] } });
    expect(d.progress.weak).toEqual({ 'hira:か': 2 });
    expect(d.progress.history).toEqual([ok]);
  });
  it('round-trips an export', () => {
    const d = defaultData();
    d.settings.displayName = 'Aya';
    const res = parseImport(exportJson(d));
    expect(res.ok && res.data.settings.displayName).toBe('Aya');
  });
  it('rejects newer versions and non-backups', () => {
    expect(parseImport(JSON.stringify({ version: CURRENT_VERSION + 1, data: {} })).ok).toBe(false);
    expect(parseImport('{}').ok).toBe(false);
    expect(parseImport('not json').ok).toBe(false);
  });
});

describe('streak', () => {
  const today = new Date(2026, 9, 20);
  it('counts consecutive days ending today', () => {
    expect(computeStreak({ '2026-10-20': 1, '2026-10-19': 2, '2026-10-17': 1 }, today)).toBe(2);
  });
  it('keeps streak alive if only yesterday is active', () => {
    expect(computeStreak({ '2026-10-19': 1 }, today)).toBe(1);
  });
  it('is zero with no recent activity', () => {
    expect(computeStreak({}, today)).toBe(0);
    expect(dateKey(today)).toBe('2026-10-20');
  });
});
