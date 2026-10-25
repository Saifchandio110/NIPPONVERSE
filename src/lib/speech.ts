// Browser text-to-speech helpers. Voices depend on the device and installed language packs.
export type SpeakResult = 'ok' | 'unsupported' | 'no-voice';

export const speechSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

export function getJapaneseVoice(): SpeechSynthesisVoice | null {
  if (!speechSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  const norm = (l: string) => l.toLowerCase().replace('_', '-');
  return voices.find((v) => norm(v.lang) === 'ja-jp') ?? voices.find((v) => norm(v.lang).startsWith('ja')) ?? null;
}

/**
 * Speaks Japanese text. Returns 'no-voice' (and stays silent) when the browser has loaded its voice
 * list and none is Japanese, rather than reading Japanese with the wrong language.
 * If the voice list has not loaded yet, it still tries with lang ja-JP.
 */
export function speak(text: string, rate = 0.85): SpeakResult {
  if (!speechSupported()) return 'unsupported';
  const synth = window.speechSynthesis;
  const voice = getJapaneseVoice();
  if (!voice && synth.getVoices().length > 0) return 'no-voice';
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ja-JP';
  u.rate = rate;
  if (voice) u.voice = voice;
  synth.speak(u);
  return 'ok';
}
