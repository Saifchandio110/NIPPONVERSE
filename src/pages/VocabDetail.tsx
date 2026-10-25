import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ListMinus, ListPlus, Star, Volume2 } from 'lucide-react';
import VocabImage from '../components/VocabImage';
import { Breadcrumbs, Button, Card } from '../components/ui';
import { POS_LABELS, TOPICS } from '../data/vocabulary/schema';
import PronunciationGuide from '../components/PronunciationGuide';
import { sentenceRomaji } from '../lib/sentenceRomaji';
import { speak, type SpeakResult } from '../lib/speech';
import { VOCAB_BY_ID, vocabCardId, vocabRomaji } from '../lib/vocab';
import { useApp } from '../state/AppState';

export default function VocabDetail() {
  const { id = '' } = useParams();
  const { t, data, toggleFavorite, addToReview, removeFromReview, viewVocab } = useApp();
  const lang = data.settings.language;
  const entry = VOCAB_BY_ID.get(id);
  const [speechMsg, setSpeechMsg] = useState<SpeakResult | null>(null);

  useEffect(() => {
    if (entry) viewVocab(entry.id);
    // viewVocab changes identity on each state change; only the opened word matters here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry?.id]);

  const crumbs = (last: string) => [
    { text: t('navDashboard'), to: '/' },
    { text: t('navVocabulary'), to: '/vocabulary' },
    { text: last },
  ];

  if (!entry) {
    return (
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs label={t('breadcrumbs')} items={crumbs('?')} />
        <p role="alert" className="mb-4">{t('wordNotFound')}</p>
        <Link to="/vocabulary" className="rounded-lg bg-vermilion px-4 py-2 text-white">{t('backToVocab')}</Link>
      </div>
    );
  }

  const fav = data.progress.favorites.includes(entry.id);
  const cardId = vocabCardId(entry.id);
  const inReview = Boolean(data.progress.cards[cardId]);
  const topic = TOPICS.find((x) => x.id === entry.topic);
  const say = (text: string) => setSpeechMsg(speak(text));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Breadcrumbs label={t('breadcrumbs')} items={crumbs(entry.word)} />

      <Card>
        <div className="flex flex-wrap items-start gap-6">
          <VocabImage entry={entry} size="lg" />
          <div className="min-w-0 flex-1 space-y-2">
            <h1 lang="ja" className="text-5xl font-bold">{entry.word}</h1>
            <p lang="ja" className="text-xl">
              {entry.reading}
              {data.settings.showRomaji && <span lang="en" className="opacity-75"> · {vocabRomaji(entry)}</span>}
            </p>
            <p className="text-sm opacity-75">
              {POS_LABELS[entry.pos][lang]} · {topic?.label[lang]}
            </p>
            <div>
              <p className="text-sm opacity-70">{t('meaning')}</p>
              <p lang="en" className="text-lg">{entry.en}</p>
              <p lang="ur" dir="rtl" className="text-lg">{entry.ur}</p>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button onClick={() => say(entry.reading)}><Volume2 size={16} /> {t('listenWord')}</Button>
              <Button aria-pressed={fav} onClick={() => toggleFavorite(entry.id)}>
                <Star size={16} className={fav ? 'fill-yellow-400 text-yellow-500' : ''} /> {fav ? t('unfavorite') : t('favorite')}
              </Button>
              {inReview ? (
                <Button onClick={() => removeFromReview(cardId)}><ListMinus size={16} /> {t('removeFromReview')}</Button>
              ) : (
                <Button onClick={() => addToReview([cardId])}><ListPlus size={16} /> {t('addToReview')}</Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Card title={t('exampleSentence')}>
        <p lang="ja" className="text-2xl">{entry.example.ja}</p>
        <p lang="ja" className="mt-1 text-sm opacity-80">{entry.example.reading}</p>
        {data.settings.showRomaji && sentenceRomaji(entry.example.ja) && <p lang="en" className="mt-1 text-sm font-medium">{sentenceRomaji(entry.example.ja)}</p>}
        <p lang="en" className="mt-3">{entry.example.en}</p>
        <p lang="ur" dir="rtl" className="mt-1">{entry.example.ur}</p>
        <Button className="mt-3" onClick={() => say(entry.example.ja)}><Volume2 size={16} /> {t('listenSentence')}</Button>
        <p className="mt-3 text-xs opacity-70">{t('furiganaNote')}</p>
      </Card>

      <PronunciationGuide />

      {speechMsg && speechMsg !== 'ok' && (
        <p role="alert" className="text-sm text-red-700">{t(speechMsg === 'unsupported' ? 'speechUnsupported' : 'speechNoVoice')}</p>
      )}
    </div>
  );
}
