import type { Card, HistoryEntry, PersistedData, Rating, ReviewLogEntry, Settings } from '../types';

export const STORAGE_KEY = 'nipponverse:data';
export const CURRENT_VERSION = 1;

export const defaultSettings: Settings = {
  displayName: '',
  language: 'en',
  theme: 'light',
  dailyGoal: 10,
  fontScale: 100,
  newCardsPerDay: 10,
  reviewsPerDay: 50,
  showRomaji: true,
};

export const defaultData = (): PersistedData => ({
  settings: { ...defaultSettings },
  progress: { activity: {}, completedLessons: [], weak: {}, history: [], cards: {}, reviewLog: [], favorites: [], recentVocab: [] },
});

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const clampInt = (v: unknown, min: number, max: number, fallback: number) =>
  typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(min, Math.round(v))) : fallback;

/** Turns untrusted data into a valid PersistedData, filling anything missing with defaults. */
export function sanitize(raw: unknown): PersistedData {
  const out = defaultData();
  if (!isObj(raw)) return out;
  const s = isObj(raw.settings) ? raw.settings : {};
  out.settings = {
    displayName: typeof s.displayName === 'string' ? s.displayName.slice(0, 40) : defaultSettings.displayName,
    language: s.language === 'ur' ? 'ur' : 'en',
    theme: s.theme === 'dark' ? 'dark' : 'light',
    dailyGoal: clampInt(s.dailyGoal, 1, 200, defaultSettings.dailyGoal),
    fontScale: clampInt(s.fontScale, 90, 130, defaultSettings.fontScale),
    newCardsPerDay: clampInt(s.newCardsPerDay, 0, 100, defaultSettings.newCardsPerDay),
    reviewsPerDay: clampInt(s.reviewsPerDay, 0, 500, defaultSettings.reviewsPerDay),
    showRomaji: s.showRomaji !== false,
  };
  const p = isObj(raw.progress) ? raw.progress : {};
  if (isObj(p.activity)) {
    for (const [k, v] of Object.entries(p.activity)) {
      if (DATE_RE.test(k) && typeof v === 'number' && Number.isInteger(v) && v >= 0) {
        out.progress.activity[k] = v;
      }
    }
  }
  if (Array.isArray(p.completedLessons)) {
    out.progress.completedLessons = [...new Set(p.completedLessons.filter((x): x is string => typeof x === 'string'))];
  }
  if (isObj(p.weak)) {
    for (const [k, v] of Object.entries(p.weak)) {
      if (k.length <= 40 && typeof v === 'number' && Number.isInteger(v) && v > 0) out.progress.weak[k] = Math.min(v, 999);
    }
  }
  if (Array.isArray(p.history)) {
    out.progress.history = p.history.filter(isHistoryEntry).slice(0, 50);
  }
  if (isObj(p.cards)) {
    for (const [id, c] of Object.entries(p.cards)) {
      const card = sanitizeCard(id, c);
      if (card) out.progress.cards[id] = card;
    }
  }
  const idList = (v: unknown, max: number) =>
    Array.isArray(v) ? [...new Set(v.filter((x): x is string => typeof x === 'string' && x.length > 0 && x.length <= 40))].slice(0, max) : [];
  out.progress.favorites = idList(p.favorites, 2000);
  out.progress.recentVocab = idList(p.recentVocab, 8);
  if (Array.isArray(p.reviewLog)) {
    out.progress.reviewLog = p.reviewLog.filter(isLogEntry).slice(0, 500);
  }
  return out;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const RATINGS: Rating[] = ['again', 'hard', 'good', 'easy'];
const clampNum = (v: unknown, min: number, max: number, fallback: number) =>
  typeof v === 'number' && Number.isFinite(v) ? Math.round(Math.min(max, Math.max(min, v)) * 100) / 100 : fallback;

function sanitizeCard(id: string, c: unknown): Card | null {
  if (id.length > 40 || !isObj(c)) return null;
  const { due, added, last } = c;
  if (typeof due !== 'string' || !DATE_RE.test(due) || typeof added !== 'string' || !DATE_RE.test(added)) return null;
  if (last !== undefined && (typeof last !== 'string' || !DATE_RE.test(last))) return null;
  const card: Card = {
    id,
    ease: clampNum(c.ease, 1.3, 3.5, 2.5),
    interval: clampInt(c.interval, 0, 36500, 0),
    reps: clampInt(c.reps, 0, 10000, 0),
    lapses: clampInt(c.lapses, 0, 10000, 0),
    due,
    added,
  };
  if (typeof last === 'string') card.last = last;
  return card;
}

function isLogEntry(e: unknown): e is ReviewLogEntry {
  return (
    isObj(e) &&
    typeof e.id === 'string' && e.id.length <= 40 &&
    typeof e.rating === 'string' && RATINGS.includes(e.rating as Rating) &&
    typeof e.day === 'string' && DATE_RE.test(e.day) &&
    typeof e.interval === 'number' && Number.isInteger(e.interval) && e.interval >= 0 &&
    typeof e.isNew === 'boolean'
  );
}

const MODES = ['read', 'pick', 'type', 'cross', 'grammar'];
function isHistoryEntry(h: unknown): h is HistoryEntry {
  return (
    isObj(h) &&
    typeof h.date === 'string' &&
    (h.script === 'hira' || h.script === 'kata' || h.script === 'grammar') &&
    typeof h.scope === 'string' &&
    typeof h.mode === 'string' &&
    MODES.includes(h.mode) &&
    typeof h.correct === 'number' && Number.isInteger(h.correct) && h.correct >= 0 &&
    typeof h.total === 'number' && Number.isInteger(h.total) && h.total >= h.correct &&
    typeof h.retry === 'boolean'
  );
}

/** migrations[n] upgrades the `data` payload from version n to n+1. Add entries when the format changes. */
const migrations: Record<number, (data: unknown) => unknown> = {};

export type ParseResult = { ok: true; data: PersistedData } | { ok: false; error: string };

export function migrate(envelope: unknown): ParseResult {
  if (!isObj(envelope) || typeof envelope.version !== 'number') {
    return { ok: false, error: 'This file is not a NipponVerse backup.' };
  }
  if (envelope.version > CURRENT_VERSION) {
    return { ok: false, error: 'This backup was made by a newer version of NipponVerse.' };
  }
  let data: unknown = envelope.data;
  for (let v = envelope.version; v < CURRENT_VERSION; v++) data = migrations[v] ? migrations[v](data) : data;
  return { ok: true, data: sanitize(data) };
}

export function parseImport(text: string): ParseResult {
  try {
    return migrate(JSON.parse(text));
  } catch {
    return { ok: false, error: 'The file could not be read as JSON.' };
  }
}

export const exportJson = (data: PersistedData) =>
  JSON.stringify({ version: CURRENT_VERSION, data }, null, 2);

export function loadData(): PersistedData {
  try {
    const text = localStorage.getItem(STORAGE_KEY);
    if (!text) return defaultData();
    const res = parseImport(text);
    return res.ok ? res.data : defaultData();
  } catch {
    return defaultData();
  }
}

/** Returns false if the browser refused the write (private mode, quota). */
export function saveData(data: PersistedData): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, exportJson(data));
    return true;
  } catch {
    return false;
  }
}
