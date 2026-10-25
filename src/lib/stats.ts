const pad = (n: number) => String(n).padStart(2, '0');

/** Local-time date key, e.g. 2026-10-20. */
export const dateKey = (d: Date = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const daysAgo = (from: Date, n: number) => {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  d.setDate(d.getDate() - n);
  return d;
};

/** Last n local days, oldest first. */
export const lastDays = (n: number, today: Date = new Date()) =>
  Array.from({ length: n }, (_, i) => daysAgo(today, n - 1 - i));

/** Consecutive active days ending today (or yesterday if today has no activity yet). */
export function computeStreak(activity: Record<string, number>, today: Date = new Date()): number {
  let offset = (activity[dateKey(today)] ?? 0) > 0 ? 0 : 1;
  let streak = 0;
  while ((activity[dateKey(daysAgo(today, offset))] ?? 0) > 0) {
    streak++;
    offset++;
  }
  return streak;
}
