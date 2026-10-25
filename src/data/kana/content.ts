import type { Bilingual, Script } from '../../types';

export interface Note { title: Bilingual; body: Bilingual }
export interface Confusable { chars: string[]; tip: Bilingual }

export const NOTES: Record<Script, Note[]> = {
  hira: [
    {
      title: { en: 'Dakuten and handakuten', ur: 'داکوتن اور ہانداکوتن' },
      body: {
        en: 'Two small marks (゛) or a small circle (゜) change the consonant: か becomes が, and は becomes ば or ぱ.',
        ur: 'دو چھوٹے نشان (゛) یا ایک چھوٹا دائرہ (゜) حرف کی آواز بدل دیتے ہیں: か سے が بنتا ہے، اور は سے ば یا ぱ۔',
      },
    },
    {
      title: { en: 'Combination sounds (yōon)', ur: 'مرکب آوازیں (یوون)' },
      body: {
        en: 'A small ゃ, ゅ or ょ after an i-ending kana joins into one syllable: き + ゃ = きゃ (kya). Keep the second kana small.',
        ur: 'ی پر ختم ہونے والے حرف کے بعد چھوٹا ゃ، ゅ یا ょ مل کر ایک ہی آواز بناتا ہے: き + ゃ = きゃ (kya)۔ دوسرا حرف چھوٹا ہی لکھیں۔',
      },
    },
    {
      title: { en: 'Particles are read differently', ur: 'ذرات مختلف پڑھے جاتے ہیں' },
      body: {
        en: 'When used as particles, は is read “wa”, を is read “o”, and へ is read “e”.',
        ur: 'جب یہ حروف ذرات (particles) کے طور پر آئیں تو は کو “wa”، を کو “o” اور へ کو “e” پڑھا جاتا ہے۔',
      },
    },
    {
      title: { en: 'Small っ', ur: 'چھوٹا っ' },
      body: {
        en: 'A small っ makes a short pause and doubles the next consonant: きって is “kitte” (stamp).',
        ur: 'چھوٹا っ ایک مختصر وقفہ دیتا ہے اور اگلے حرف کی آواز دہرائی جاتی ہے: きって کو “kitte” (ڈاک ٹکٹ) پڑھا جاتا ہے۔',
      },
    },
  ],
  kata: [
    {
      title: { en: 'Where katakana is used', ur: 'کاتاکانا کہاں استعمال ہوتا ہے' },
      body: {
        en: 'Katakana is mainly used for foreign loanwords, foreign names, and emphasis. コーヒー (coffee) and ホテル (hotel) are common examples.',
        ur: 'کاتاکانا زیادہ تر غیر ملکی الفاظ، غیر ملکی ناموں اور زور دینے کے لیے استعمال ہوتا ہے۔ コーヒー (کافی) اور ホテル (ہوٹل) عام مثالیں ہیں۔',
      },
    },
    {
      title: { en: 'Long vowel mark ー', ur: 'لمبی آواز کا نشان ー' },
      body: {
        en: 'The mark ー lengthens the previous vowel: コーヒー is “koohii”. In katakana it is always written, not spelled with extra vowels.',
        ur: 'ー پچھلی آواز کو لمبا کر دیتا ہے: コーヒー کو “koohii” پڑھا جاتا ہے۔',
      },
    },
    {
      title: { en: 'Small ッ', ur: 'چھوٹا ッ' },
      body: {
        en: 'A small ッ doubles the next consonant: カット is “katto” (cut).',
        ur: 'چھوٹا ッ اگلے حرف کی آواز کو دہرا دیتا ہے: カット کو “katto” (کٹ) پڑھا جاتا ہے۔',
      },
    },
    {
      title: { en: 'Small vowels for foreign sounds', ur: 'غیر ملکی آوازوں کے لیے چھوٹے حروف' },
      body: {
        en: 'Small ァ ィ ェ ォ create sounds Japanese did not originally have: フォーク (fork) is “fooku”, ティ is “ti”.',
        ur: 'چھوٹے ァ ィ ェ ォ ایسی آوازیں بناتے ہیں جو اصل جاپانی میں نہیں تھیں: フォーク (کانٹا) کو “fooku” اور ティ کو “ti” پڑھا جاتا ہے۔',
      },
    },
  ],
};

export const CONFUSABLES: Record<Script, Confusable[]> = {
  hira: [
    { chars: ['ぬ', 'め'], tip: { en: 'ぬ ends with a small loop at the bottom right; め has no loop.', ur: 'ぬ کے نیچے دائیں طرف چھوٹا لوپ ہے؛ め میں لوپ نہیں ہوتا۔' } },
    { chars: ['ね', 'れ', 'わ'], tip: { en: 'All three share a left stem. ね ends in a loop, れ in an outward flick, わ in a rounded curve.', ur: 'تینوں میں بائیں طرف ایک ہی ڈنڈی ہے۔ ね کے آخر میں لوپ، れ کے آخر میں باہر کی طرف جھٹکا اور わ کے آخر میں گول خم ہے۔' } },
    { chars: ['は', 'ほ'], tip: { en: 'ほ has an extra horizontal stroke on its right-hand part.', ur: 'ほ کے دائیں حصے میں ایک اضافی افقی لکیر ہوتی ہے۔' } },
    { chars: ['る', 'ろ'], tip: { en: 'る finishes with a small loop; ろ does not.', ur: 'る کے آخر میں چھوٹا لوپ ہے؛ ろ میں نہیں۔' } },
    { chars: ['い', 'り'], tip: { en: 'The right stroke of り is longer and dips lower than the left one; in い the two strokes are similar.', ur: 'り کی دائیں لکیر بائیں سے لمبی اور نیچے تک جاتی ہے؛ い میں دونوں لکیریں تقریباً برابر ہوتی ہیں۔' } },
  ],
  kata: [
    { chars: ['シ', 'ツ'], tip: { en: 'シ: the two small strokes are nearly horizontal and the long stroke sweeps upward. ツ: the small strokes are nearly vertical and the long stroke sweeps downward.', ur: 'シ: دونوں چھوٹی لکیریں تقریباً افقی ہیں اور لمبی لکیر اوپر کی طرف جاتی ہے۔ ツ: چھوٹی لکیریں تقریباً عمودی ہیں اور لمبی لکیر نیچے کی طرف آتی ہے۔' } },
    { chars: ['ソ', 'ン'], tip: { en: 'ソ: both strokes slant downward. ン: the long stroke sweeps upward from the bottom left.', ur: 'ソ: دونوں لکیریں نیچے کی طرف ترچھی ہیں۔ ン: لمبی لکیر نیچے بائیں سے اوپر کی طرف جاتی ہے۔' } },
    { chars: ['ク', 'ワ'], tip: { en: 'ワ starts with a short vertical stroke; ク starts with a diagonal stroke.', ur: 'ワ ایک چھوٹی عمودی لکیر سے شروع ہوتا ہے؛ ク ترچھی لکیر سے۔' } },
    { chars: ['ウ', 'ワ'], tip: { en: 'ウ has a small vertical tick on top; ワ does not.', ur: 'ウ کے اوپر چھوٹی عمودی لکیر ہوتی ہے؛ ワ میں نہیں۔' } },
  ],
};
