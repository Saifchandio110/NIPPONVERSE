import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, ListPlus, ListMinus, Volume2 } from 'lucide-react';
import Quiz, { type QuizResult } from '../components/Quiz';
import { Bi, Button, Card } from '../components/ui';
import { CONFUSABLES, NOTES } from '../data/kana/content';
import type { Key } from '../i18n/en';
import { exampleRomaji, getExample, getGroups, getItems, groupLabel, lessonId, toKatakana, type KanaItem } from '../lib/kana';
import { buildKanaQuestions, type Question } from '../lib/quiz';
import { speak, type SpeakResult } from '../lib/speech';
import { useApp } from '../state/AppState';
import type { KanaKind, QuizMode, Script } from '../types';

const SECTIONS: { title: Key; kinds: KanaKind[] }[] = [
  { title: 'sectionBasic', kinds: ['basic'] },
  { title: 'sectionVoiced', kinds: ['dakuten', 'handakuten'] },
  { title: 'sectionYoon', kinds: ['yoon'] },
  { title: 'sectionExtra', kinds: ['extra'] },
];

const select = 'mt-1 block w-full rounded-lg border border-navy/20 bg-white px-3 py-2 text-navy';

export default function KanaPage({ script }: { script: Script }) {
  const { t, data, recordQuiz, addToReview, removeFromReview } = useApp();
  const lang = data.settings.language;
  const [params] = useSearchParams();
  const groups = useMemo(() => getGroups(script), [script]);
  const allItems = useMemo(() => getItems(script), [script]);
  const done = new Set(data.progress.completedLessons);
  const weakItems = allItems.filter((i) => (data.progress.weak[i.id] ?? 0) > 0);

  const [selected, setSelected] = useState<KanaItem | null>(null);
  const [speechMsg, setSpeechMsg] = useState<SpeakResult | null>(null);
  const requested = params.get('scope');
  const [scope, setScope] = useState(requested && (requested === 'all' || requested === 'weak' || groups.some((g) => g.id === requested)) ? requested : 'all');
  const [mode, setMode] = useState<QuizMode>('read');
  const [length, setLength] = useState(10);
  const [session, setSession] = useState<{ questions: Question[]; scope: string; mode: QuizMode } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const pool = scope === 'all' ? allItems : scope === 'weak' ? weakItems : allItems.filter((i) => i.groupId === scope);
  const canStart = buildKanaQuestions(pool, allItems, mode, 1).length > 0;

  function start() {
    const questions = buildKanaQuestions(pool, allItems, mode, length);
    if (questions.length === 0) return;
    setNotice(null);
    setSession({ questions, scope, mode });
  }

  function onFinish(results: QuizResult[], retry: boolean) {
    if (!session) return;
    const single = session.scope !== 'all' && session.scope !== 'weak';
    recordQuiz({ script, scope: session.scope, mode: session.mode, results, retry, lessonId: single ? lessonId(script, session.scope) : undefined });
    const correct = results.filter((r) => r.correct).length;
    if (!retry && single && results.length >= 5 && correct / results.length >= 0.8) {
      setNotice(t('lessonComplete'));
      addToReview(allItems.filter((i) => i.groupId === session.scope).map((i) => i.id));
    }
  }

  const example = selected ? getExample(selected) : undefined;
  const otherForm = selected && selected.kind !== 'extra' ? (script === 'hira' ? toKatakana(selected.char) : [...getItems('hira')].find((i) => toKatakana(i.char) === selected.char)?.char) : undefined;
  const pronounce = (text: string) => setSpeechMsg(speak(text));
  const modeOptions: QuizMode[] = script === 'kata' ? ['read', 'pick', 'type', 'cross'] : ['read', 'pick', 'type'];
  const modeKey: Record<QuizMode, Key> = { read: 'modeRead', pick: 'modePick', type: 'modeType', cross: 'modeCross' };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header>
        <h1 className="text-3xl font-bold">
          {t(script === 'hira' ? 'hiragana' : 'katakana')} <span lang="ja" className="text-vermilion">{script === 'hira' ? 'ひらがな' : 'カタカナ'}</span>
        </h1>
        <p className="mt-2 max-w-3xl opacity-80">{t(script === 'hira' ? 'hiraIntro' : 'kataIntro')}</p>
      </header>

      {notice && <p role="status" className="rounded-lg border border-green-300 bg-green-50 p-3 font-medium text-green-900">{notice}</p>}

      {session ? (
        <Quiz questions={session.questions} onFinish={onFinish} onExit={() => setSession(null)} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
          <div className="space-y-8">
            {SECTIONS.map((sec) => {
              const gs = groups.filter((g) => sec.kinds.includes(g.kind));
              if (gs.length === 0) return null;
              return (
                <section key={sec.title} aria-labelledby={sec.title}>
                  <h2 id={sec.title} className="mb-3 text-xl font-semibold">{t(sec.title)}</h2>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {gs.map((g) => {
                      const items = allItems.filter((i) => i.groupId === g.id);
                      const complete = done.has(lessonId(script, g.id));
                      return (
                        <Card key={g.id} className="!p-3">
                          <div className="mb-2 flex items-center justify-between">
                            <span lang="ja" className="text-sm font-semibold opacity-80">{groupLabel(g, script)}</span>
                            {complete && <CheckCircle2 size={16} className="text-green-700" aria-label={t('lessonComplete')} />}
                          </div>
                          <ul className="flex flex-wrap gap-2">
                            {items.map((i) => (
                              <li key={i.id}>
                                <button
                                  type="button"
                                  aria-pressed={selected?.id === i.id}
                                  aria-label={`${i.char} ${i.romaji}`}
                                  onClick={() => { setSelected(i); setSpeechMsg(null); }}
                                  className={`flex h-16 w-14 flex-col items-center justify-center rounded-lg border ${selected?.id === i.id ? 'border-vermilion bg-vermilion/10' : 'border-navy/15 hover:bg-navy/5'}`}
                                >
                                  <span lang="ja" className="text-2xl leading-none">{i.char}</span>
                                  <span className="mt-1 text-xs opacity-70">{i.romaji}</span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </Card>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <Card title={selected ? undefined : t('selectChar')}>
              {selected && (
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span lang="ja" className="text-7xl">{selected.char}</span>
                    <div>
                      <p className="text-sm opacity-70">{t('romaji')}</p>
                      <p className="text-2xl font-semibold">{selected.romaji}</p>
                      {otherForm && (
                        <p className="mt-1 text-sm opacity-70">
                          {t(script === 'hira' ? 'kataForm' : 'hiraForm')}: <span lang="ja" className="text-lg">{otherForm}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => pronounce(selected.char)}><Volume2 size={16} /> {t('pronounce')}</Button>
                    {data.progress.cards[selected.id] ? (
                      <Button onClick={() => removeFromReview(selected.id)}><ListMinus size={16} /> {t('removeFromReview')}</Button>
                    ) : (
                      <Button onClick={() => addToReview([selected.id])}><ListPlus size={16} /> {t('addToReview')}</Button>
                    )}
                  </div>
                  {example && (
                    <div className="rounded-lg bg-navy/5 p-3">
                      <p className="text-sm opacity-70">{t('example')}</p>
                      <p lang="ja" className="text-2xl">{example.word}</p>
                      <p className="text-sm">{exampleRomaji(example)}</p>
                      <p className="mt-1" lang="en">{example.en}</p>
                      <p className="mt-1" lang="ur" dir="rtl">{example.ur}</p>
                      <Button className="mt-2" onClick={() => pronounce(example.word)}><Volume2 size={16} /> {t('pronounce')}</Button>
                    </div>
                  )}
                  {speechMsg && speechMsg !== 'ok' && (
                    <p role="alert" className="text-sm text-red-700">{t(speechMsg === 'unsupported' ? 'speechUnsupported' : 'speechNoVoice')}</p>
                  )}
                </div>
              )}
            </Card>

            <Card title={t('practice')}>
              <div className="space-y-3">
                <label className="block text-sm font-medium">
                  {t('scope')}
                  <select className={select} value={scope} onChange={(e) => setScope(e.target.value)}>
                    <option value="all">{t('scopeAll')}</option>
                    <option value="weak">{t('scopeWeak')} ({weakItems.length})</option>
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>{groupLabel(g, script)}{done.has(lessonId(script, g.id)) ? ' ✓' : ''}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-medium">
                  {t('mode')}
                  <select className={select} value={mode} onChange={(e) => setMode(e.target.value as QuizMode)}>
                    {modeOptions.map((m) => <option key={m} value={m}>{t(modeKey[m])}</option>)}
                  </select>
                </label>
                <label className="block text-sm font-medium">
                  {t('length')}
                  <select className={select} value={length} onChange={(e) => setLength(Number(e.target.value))}>
                    {[5, 10, 20].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </label>
                {!canStart && scope === 'weak' && <p className="text-sm opacity-75">{t('noWeak')}</p>}
                <Button variant="primary" disabled={!canStart} onClick={start}>{t('start')}</Button>
                <p className="text-xs opacity-70">{t('lessonRule')}</p>
              </div>
            </Card>
          </aside>
        </div>
      )}

      {!session && (
        <>
          <section aria-labelledby="notes-h" className="space-y-3">
            <h2 id="notes-h" className="text-xl font-semibold">{t('notes')}</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {NOTES[script].map((n) => (
                <Card key={n.title.en}>
                  <h3 className="mb-1 font-semibold">{n.title[lang]}</h3>
                  <Bi text={n.body} primary={lang} />
                </Card>
              ))}
            </div>
          </section>

          <section aria-labelledby="conf-h" className="space-y-3">
            <h2 id="conf-h" className="text-xl font-semibold">{t('commonMistakes')}</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {CONFUSABLES[script].map((c) => (
                <Card key={c.chars.join('')}>
                  <p lang="ja" className="mb-2 text-3xl tracking-widest">{c.chars.join('  ')}</p>
                  <Bi text={c.tip} primary={lang} />
                </Card>
              ))}
            </div>
          </section>

          {script === 'kata' && (
            <section aria-labelledby="cmp-h" className="space-y-3">
              <h2 id="cmp-h" className="text-xl font-semibold">{t('comparison')}</h2>
              <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-8">
                {getItems('hira').filter((i) => i.kind === 'basic').map((i) => (
                  <li key={i.id} className="rounded-lg border border-navy/15 bg-white p-2 text-center text-navy" aria-label={`${i.char} ${toKatakana(i.char)} ${i.romaji}`}>
                    <span lang="ja" className="text-xl">{i.char} {toKatakana(i.char)}</span>
                    <span className="block text-xs opacity-70">{i.romaji}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
