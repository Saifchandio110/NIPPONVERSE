import { useEffect, useId, useRef, useState, type ChangeEvent } from 'react';
import { Download, Trash2, Upload } from 'lucide-react';
import { Button, Card } from '../components/ui';
import { exportJson, parseImport } from '../lib/storage';
import { dateKey } from '../lib/stats';
import { useApp } from '../state/AppState';

const field = 'mt-1 block w-full max-w-sm rounded-lg border border-navy/20 bg-white px-3 py-2 text-navy';

function NumberField({ label, value, min, max, onValid, error }: { label: string; value: number; min: number; max: number; onValid: (n: number) => void; error: string }) {
  const [text, setText] = useState(String(value));
  const [bad, setBad] = useState(false);
  const errId = useId();
  // Re-sync when the stored value changes from outside (import or reset).
  useEffect(() => {
    setText(String(value));
    setBad(false);
  }, [value]);
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    const n = Number(e.target.value);
    const valid = /^\d+$/.test(e.target.value) && n >= min && n <= max;
    setBad(!valid);
    if (valid) onValid(n);
  };
  return (
    <label className="block text-sm font-medium">
      {label}
      <input className={field} inputMode="numeric" value={text} onChange={onChange} aria-invalid={bad} aria-describedby={bad ? errId : undefined} />
      {bad && <span id={errId} role="alert" className="mt-1 block text-red-700">{error}</span>}
    </label>
  );
}

export default function Settings() {
  const { t, data, updateSettings, importData, resetAll } = useApp();
  const s = data.settings;
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onExport = () => {
    const blob = new Blob([exportJson(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nipponverse-backup-${dateKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const res = parseImport(await file.text());
    if (res.ok) {
      importData(res.data);
      setMessage({ ok: true, text: t('importOk') });
    } else {
      setMessage({ ok: false, text: res.error });
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold">{t('settingsTitle')}</h1>

      <Card>
        <div className="space-y-5">
          <label className="block text-sm font-medium">
            {t('displayName')}
            <input className={field} maxLength={40} value={s.displayName} onChange={(e) => updateSettings({ displayName: e.target.value })} />
          </label>
          <label className="block text-sm font-medium">
            {t('interfaceLanguage')}
            <select className={field} value={s.language} onChange={(e) => updateSettings({ language: e.target.value === 'ur' ? 'ur' : 'en' })}>
              <option value="en">{t('english')}</option>
              <option value="ur">{t('urdu')}</option>
            </select>
          </label>
          <label className="block text-sm font-medium">
            {t('theme')}
            <select className={field} value={s.theme} onChange={(e) => updateSettings({ theme: e.target.value === 'dark' ? 'dark' : 'light' })}>
              <option value="light">{t('light')}</option>
              <option value="dark">{t('dark')}</option>
            </select>
          </label>
          <NumberField label={t('dailyGoal')} value={s.dailyGoal} min={1} max={200} onValid={(n) => updateSettings({ dailyGoal: n })} error={t('dailyGoalError')} />
          <NumberField label={t('newPerDay')} value={s.newCardsPerDay} min={0} max={100} onValid={(n) => updateSettings({ newCardsPerDay: n })} error={t('limitError', { max: 100 })} />
          <NumberField label={t('reviewsPerDay')} value={s.reviewsPerDay} min={0} max={500} onValid={(n) => updateSettings({ reviewsPerDay: n })} error={t('limitError', { max: 500 })} />
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={s.showRomaji} onChange={(e) => updateSettings({ showRomaji: e.target.checked })} />
            {t('showRomaji')}
          </label>
          <label className="block text-sm font-medium">
            {t('fontSize')}: {s.fontScale}%
            <input type="range" min={90} max={130} step={5} className="mt-1 block w-full max-w-sm" value={s.fontScale} onChange={(e) => updateSettings({ fontScale: Number(e.target.value) })} />
          </label>
        </div>
      </Card>

      <Card title={t('dataTitle')}>
        <p className="mb-4 text-sm">{t('dataExplain')}</p>
        <div className="flex flex-wrap gap-2">
          <Button onClick={onExport}><Download size={16} /> {t('exportData')}</Button>
          <Button onClick={() => fileRef.current?.click()}><Upload size={16} /> {t('importData')}</Button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={onImport} tabIndex={-1} aria-hidden="true" />
          {!confirmReset && (
            <Button variant="danger" onClick={() => setConfirmReset(true)}><Trash2 size={16} /> {t('resetData')}</Button>
          )}
        </div>
        {message && (
          <p role={message.ok ? 'status' : 'alert'} className={`mt-3 text-sm ${message.ok ? 'text-green-700' : 'text-red-700'}`}>{message.text}</p>
        )}
        {confirmReset && (
          <div role="alertdialog" aria-label={t('resetData')} className="mt-4 rounded-lg border border-red-300 bg-red-50 p-4 text-red-900">
            <p className="mb-3 text-sm">{t('resetConfirm')}</p>
            <div className="flex gap-2">
              <Button variant="danger" onClick={() => { resetAll(); setConfirmReset(false); }}>{t('resetYes')}</Button>
              <Button onClick={() => setConfirmReset(false)}>{t('cancel')}</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
