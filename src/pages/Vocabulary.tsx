import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import VocabImage from '../components/VocabImage';
import { Button, Card } from '../components/ui';
import { POS_LABELS, TOPICS, type Pos, type TopicId } from '../data/vocabulary/schema';
import { VOCAB } from '../data/vocabulary/words';
import { searchVocab, vocabRomaji, type SortKey } from '../lib/vocab';
import { useApp } from '../state/AppState';
import type { Key } from '../i18n/en';

const control = 'mt-1 block w-full rounded-lg border border-navy/20 bg-white px-3 py-2 text-navy';
const SORTS: { id: SortKey; label: Key }[] = [
  { id: 'topic', label: 'sortTopic' },
  { id: 'reading', label: 'sortReading' },
  { id: 'english', label: 'sortEnglish' },
];

export default function Vocabulary() {
  const { t, data, toggleFavorite } = useApp();
  const lang = data.settings.language;
  const favorites = useMemo(() => new Set(data.progress.favorites), [data.progress.favorites]);
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState<TopicId | 'all'>('all');
  const [pos, setPos] = useState<Pos | 'all'>('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>('topic');

  const results = useMemo(
    () => searchVocab(VOCAB, { query, topic, pos, favoritesOnly, favorites, sort }),
    [query, topic, pos, favoritesOnly, favorites, sort],
  );
  const filtered = query !== '' || topic !== 'all' || pos !== 'all' || favoritesOnly;
  const clear = () => { setQuery(''); setTopic('all'); setPos('all'); setFavoritesOnly(false); };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-3xl font-bold">{t('vocabTitle')}</h1>
        <p className="mt-1 text-sm opacity-75">{t('vocabNote', { n: VOCAB.length })}</p>
      </header>

      <Card>
        <div className="grid gap-3 md:grid-cols-4">
          <label className="block text-sm font-medium md:col-span-2">
            {t('searchLabel')}
            <input type="search" className={control} value={query} placeholder={t('searchPlaceholder')} onChange={(e) => setQuery(e.target.value)} />
          </label>
          <label className="block text-sm font-medium">
            {t('topic')}
            <select className={control} value={topic} onChange={(e) => setTopic(e.target.value as TopicId | 'all')}>
              <option value="all">{t('allTopics')}</option>
              {TOPICS.map((x) => <option key={x.id} value={x.id}>{x.label[lang]}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium">
            {t('partOfSpeech')}
            <select className={control} value={pos} onChange={(e) => setPos(e.target.value as Pos | 'all')}>
              <option value="all">{t('allPos')}</option>
              {(Object.keys(POS_LABELS) as Pos[]).map((p) => <option key={p} value={p}>{POS_LABELS[p][lang]}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium">
            {t('sortBy')}
            <select className={control} value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
              {SORTS.map((s) => <option key={s.id} value={s.id}>{t(s.label)}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm font-medium md:mt-6">
            <input type="checkbox" checked={favoritesOnly} onChange={(e) => setFavoritesOnly(e.target.checked)} />
            {t('onlyFavorites')}
          </label>
          <div className="flex items-end gap-3 md:col-span-2 md:justify-end">
            <p role="status" className="text-sm opacity-75">{t('resultsCount', { n: results.length })}</p>
            {filtered && <Button onClick={clear}>{t('clearFilters')}</Button>}
          </div>
        </div>
      </Card>

      {results.length === 0 ? (
        <p className="rounded-lg border border-navy/15 p-6 text-center">{t('noResults')}</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {results.map((e) => {
            const fav = favorites.has(e.id);
            return (
              <li key={e.id} className="flex items-stretch gap-2 rounded-xl border border-navy/10 bg-white p-3 text-navy shadow-sm">
                <Link to={`/vocabulary/${e.id}`} className="flex min-w-0 flex-1 items-center gap-3 rounded-lg">
                  <VocabImage entry={e} />
                  <span className="min-w-0">
                    <span lang="ja" className="block text-2xl font-medium">{e.word}</span>
                    <span lang="ja" className="block text-sm opacity-80">
                      {e.reading}{data.settings.showRomaji && <span lang="en"> · {vocabRomaji(e)}</span>}
                    </span>
                    <span lang="en" className="block truncate text-sm">{e.en}</span>
                    <span lang="ur" dir="rtl" className="block truncate text-sm">{e.ur}</span>
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => toggleFavorite(e.id)}
                  aria-pressed={fav}
                  aria-label={`${fav ? t('unfavorite') : t('favorite')}: ${e.word}`}
                  className="self-start rounded-lg p-2 hover:bg-navy/5"
                >
                  <Star size={20} className={fav ? 'fill-yellow-400 text-yellow-500' : 'text-navy/50'} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
