export type Lang = 'en' | 'ur';
export type Theme = 'light' | 'dark';

export interface Settings {
  displayName: string;
  language: Lang;
  theme: Theme;
  dailyGoal: number; // study actions per day (lessons + reviews)
  fontScale: number; // percent, 90-130
  newCardsPerDay: number; // max never-reviewed cards introduced per day
  reviewsPerDay: number; // max due review cards shown per day
  showRomaji: boolean; // show romaji beside vocabulary words
}

export type Script = 'hira' | 'kata';
export type KanaKind = 'basic' | 'dakuten' | 'handakuten' | 'yoon' | 'extra';
export type QuizMode = 'read' | 'pick' | 'type' | 'cross';

/** Text that exists in both teaching languages. */
export interface Bilingual {
  en: string;
  ur: string;
}

export interface HistoryEntry {
  date: string; // ISO timestamp
  script: Script;
  scope: string; // 'all' | 'weak' | group id
  mode: QuizMode;
  correct: number;
  total: number;
  retry: boolean;
}

export type Rating = 'again' | 'hard' | 'good' | 'easy';

/** Spaced-repetition state for one item. Dates are local calendar days (YYYY-MM-DD). */
export interface Card {
  id: string; // item id, e.g. hira:か
  ease: number; // 1.3 to 3.5, starts at 2.5
  interval: number; // days until next review after the last rating
  reps: number; // consecutive successful reviews
  lapses: number; // times rated Again
  due: string;
  added: string;
  last?: string; // day of last review; absent means never reviewed (a "new" card)
}

export interface ReviewLogEntry {
  id: string;
  rating: Rating;
  day: string;
  interval: number; // interval chosen by this rating
  isNew: boolean; // card had never been reviewed before this rating
}

export interface Progress {
  /** local date key (YYYY-MM-DD) -> number of study actions that day */
  activity: Record<string, number>;
  completedLessons: string[];
  /** item id (e.g. hira:か) -> outstanding miss count */
  weak: Record<string, number>;
  /** most recent first, capped at 50 */
  history: HistoryEntry[];
  cards: Record<string, Card>;
  /** most recent first, capped at 500 */
  reviewLog: ReviewLogEntry[];
  /** vocabulary ids the learner starred */
  favorites: string[];
  /** vocabulary ids, most recently opened first, max 8 */
  recentVocab: string[];
}

export interface PersistedData {
  settings: Settings;
  progress: Progress;
}
