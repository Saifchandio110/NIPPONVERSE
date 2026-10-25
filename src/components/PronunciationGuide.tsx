import type { Bilingual } from '../types';
import { useApp } from '../state/AppState';

// Approximate sounds for English and Urdu speakers. Romaji is only a guide: use the Listen buttons too.
const ROWS: { sound: string; text: Bilingual }[] = [
  { sound: 'a', text: { en: 'like “a” in “father”', ur: '“father” کے “a” جیسی (آ)' } },
  { sound: 'i', text: { en: 'like “ee” in “see”', ur: '“see” کے “ee” جیسی (ای)' } },
  { sound: 'u', text: { en: 'like “oo” in “food”, with relaxed lips', ur: '“food” کے “oo” جیسی (او)، ہونٹ ڈھیلے' } },
  { sound: 'e', text: { en: 'like “e” in “bed”', ur: '“bed” کے “e” جیسی (ایَ)' } },
  { sound: 'o', text: { en: 'like “o” in “more”', ur: '“more” کے “o” جیسی (او)' } },
  { sound: 'ei', text: { en: 'like “ay” in “say” (sensei ≈ “sen-say”)', ur: '“say” کے “ay” جیسی (sensei ≈ “سین-سے”)' } },
  { sound: 'aa ii uu ee oo ou', text: { en: 'long vowels: hold them about twice as long (arigatou ≈ “ari-ga-toh”)', ur: 'لمبی آوازیں: تقریباً دگنی دیر تک کھینچیں (arigatou ≈ “اری-گا-تو”)' } },
  { sound: 'kk tt pp ss', text: { en: 'doubled consonant: a short pause first (kitte = “kit-te”)', ur: 'دہرا حرف: پہلے مختصر وقفہ (kitte = “کِٹ-ٹے”)' } },
  { sound: 'r', text: { en: 'a quick tap of the tongue, between “r” and “l”', ur: 'زبان کی تیز ہلکی ضرب، “ر” اور “ل” کے درمیان' } },
  { sound: 'shi chi tsu ji', text: { en: '“shee”, “chee”, “tsoo”, “jee”', ur: '“شی”، “چی”، “تسو”، “جی”' } },
  { sound: 'g', text: { en: 'always hard, as in “go”', ur: 'ہمیشہ سخت “گ”' } },
  { sound: 'wa o e', text: { en: 'the particles は, を and へ are read “wa”, “o” and “e”', ur: 'ذرات は، を اور へ کو “wa”، “o” اور “e” پڑھا جاتا ہے' } },
];

export default function PronunciationGuide() {
  const { data } = useApp();
  const lang = data.settings.language;
  const title: Bilingual = { en: 'How to read romaji (pronunciation in English letters)', ur: 'رومانجی کیسے پڑھیں (انگریزی حروف میں تلفظ)' };
  return (
    <details className="rounded-xl border border-navy/10 bg-white p-4 text-navy">
      <summary className="cursor-pointer font-medium">{title[lang]}</summary>
      <table className="mt-3 w-full text-sm">
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.sound} className="border-t border-navy/10 align-top">
              <th scope="row" lang="en" className="whitespace-nowrap py-1 pe-3 text-start font-semibold">{r.sound}</th>
              <td className="py-1">
                <span lang="en" className="block">{r.text.en}</span>
                <span lang="ur" dir="rtl" className="block opacity-80">{r.text.ur}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}
