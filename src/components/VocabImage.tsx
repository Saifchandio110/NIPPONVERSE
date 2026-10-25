import { useState } from 'react';
import { IMAGES } from '../data/images/manifest';
import type { VocabEntry } from '../data/vocabulary/schema';
import { useApp } from '../state/AppState';

/**
 * Shows the picture for a word if one exists in the manifest, otherwise a plain kana tile.
 * It never substitutes an unrelated picture. If the file fails to load, the tile is shown instead.
 */
export default function VocabImage({ entry, size = 'md' }: { entry: VocabEntry; size?: 'md' | 'lg' }) {
  const { t, data } = useApp();
  const [failed, setFailed] = useState(false);
  const info = entry.image ? IMAGES[entry.image] : undefined;
  const dim = size === 'lg' ? 'h-48 w-48' : 'h-20 w-20';

  if (info && !failed) {
    return (
      <img
        src={`${import.meta.env.BASE_URL}images/vocab/${info.file}`}
        alt={info.alt[data.settings.language]}
        loading="lazy"
        width={size === 'lg' ? 192 : 80}
        height={size === 'lg' ? 192 : 80}
        onError={() => setFailed(true)}
        className={`${dim} shrink-0 rounded-lg border border-navy/10 bg-white object-contain p-1`}
      />
    );
  }
  return (
    <div
      role={info ? 'img' : undefined}
      aria-label={info ? t('imageFailed') : undefined}
      aria-hidden={info ? undefined : true}
      className={`${dim} flex shrink-0 items-center justify-center rounded-lg border border-navy/10 bg-navy/5`}
    >
      <span lang="ja" className={`${size === 'lg' ? 'text-5xl' : 'text-2xl'} opacity-60`}>{[...entry.word][0]}</span>
    </div>
  );
}
