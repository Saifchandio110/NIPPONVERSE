import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { en, type Key } from '../i18n/en';
import { ur } from '../i18n/ur';
import { dateKey } from '../lib/stats';
import { addCards, applyReview, removeCard } from '../lib/srs';
import { defaultData, loadData, saveData } from '../lib/storage';
import type { PersistedData, QuizMode, Rating, Script, Settings } from '../types';

type Vars = Record<string, string | number>;

export interface QuizReport {
  script: Script;
  scope: string;
  mode: QuizMode;
  results: { itemId: string; correct: boolean }[];
  retry: boolean;
  /** Set when the quiz covered exactly one lesson; completes it at 80%+ with 5+ questions (first attempt only). */
  lessonId?: string;
}

interface AppContextValue {
  data: PersistedData;
  saveFailed: boolean;
  t: (key: Key, vars?: Vars) => string;
  updateSettings: (patch: Partial<Settings>) => void;
  /** Call when the learner completes a study action (lesson step, review, quiz). */
  recordActivity: (count?: number) => void;
  recordQuiz: (report: QuizReport) => void;
  addToReview: (ids: string[]) => void;
  removeFromReview: (id: string) => void;
  reviewCard: (id: string, rating: Rating) => void;
  toggleFavorite: (id: string) => void;
  viewVocab: (id: string) => void;
  importData: (data: PersistedData) => void;
  resetAll: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PersistedData>(loadData);
  const [saveFailed, setSaveFailed] = useState(false);
  const { language, theme, fontScale } = data.settings;

  useEffect(() => setSaveFailed(!saveData(data)), [data]);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = language;
    root.dir = language === 'ur' ? 'rtl' : 'ltr';
    root.classList.toggle('dark', theme === 'dark');
    root.style.fontSize = `${fontScale}%`;
  }, [language, theme, fontScale]);

  const t = useCallback(
    (key: Key, vars?: Vars) => {
      let s = (language === 'ur' ? ur : en)[key];
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
      return s;
    },
    [language],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      data,
      saveFailed,
      t,
      updateSettings: (patch) => setData((d) => ({ ...d, settings: { ...d.settings, ...patch } })),
      recordActivity: (count = 1) =>
        setData((d) => {
          const key = dateKey();
          const activity = { ...d.progress.activity, [key]: (d.progress.activity[key] ?? 0) + count };
          return { ...d, progress: { ...d.progress, activity } };
        }),
      recordQuiz: (r) =>
        setData((d) => {
          const total = r.results.length;
          const correct = r.results.filter((x) => x.correct).length;
          const key = dateKey();
          const weak = { ...d.progress.weak };
          for (const { itemId, correct: ok } of r.results) {
            if (!ok) weak[itemId] = Math.min(999, (weak[itemId] ?? 0) + 1);
            else if (weak[itemId]) {
              weak[itemId] -= 1;
              if (weak[itemId] <= 0) delete weak[itemId];
            }
          }
          const completed = new Set(d.progress.completedLessons);
          if (!r.retry && r.lessonId && total >= 5 && correct / total >= 0.8) completed.add(r.lessonId);
          return {
            ...d,
            progress: {
              ...d.progress,
              activity: { ...d.progress.activity, [key]: (d.progress.activity[key] ?? 0) + total },
              completedLessons: [...completed],
              weak,
              history: [
                { date: new Date().toISOString(), script: r.script, scope: r.scope, mode: r.mode, correct, total, retry: r.retry },
                ...d.progress.history,
              ].slice(0, 50),
            },
          };
        }),
      addToReview: (ids) => setData((d) => ({ ...d, progress: addCards(d.progress, ids, new Date()) })),
      removeFromReview: (id) => setData((d) => ({ ...d, progress: removeCard(d.progress, id) })),
      reviewCard: (id, rating) => setData((d) => ({ ...d, progress: applyReview(d.progress, id, rating, new Date()) })),
      toggleFavorite: (id) =>
        setData((d) => {
          const fav = d.progress.favorites;
          return { ...d, progress: { ...d.progress, favorites: fav.includes(id) ? fav.filter((x) => x !== id) : [...fav, id] } };
        }),
      viewVocab: (id) =>
        setData((d) => {
          if (d.progress.recentVocab[0] === id) return d;
          return { ...d, progress: { ...d.progress, recentVocab: [id, ...d.progress.recentVocab.filter((x) => x !== id)].slice(0, 8) } };
        }),
      importData: setData,
      resetAll: () => setData(defaultData()),
    }),
    [data, saveFailed, t],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
