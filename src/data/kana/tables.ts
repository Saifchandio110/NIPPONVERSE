import type { KanaKind, Script } from '../../types';

/**
 * Source of truth for kana. Every entry is [hiragana form, Hepburn romaji].
 * Katakana is derived from the hiragana form by a fixed Unicode offset (see lib/kana.ts),
 * so the two scripts can never drift apart. Groups with scripts ['kata'] are katakana-only.
 */
export interface KanaGroupDef {
  id: string;
  kind: KanaKind;
  scripts: Script[];
  entries: [string, string][];
}

const both: Script[] = ['hira', 'kata'];

function g(id: string, kind: KanaKind, spec: string, scripts: Script[] = both): KanaGroupDef {
  return {
    id,
    kind,
    scripts,
    entries: spec.split(',').map((p) => {
      const [kana, romaji] = p.trim().split(' ');
      return [kana, romaji] as [string, string];
    }),
  };
}

export const GROUPS: KanaGroupDef[] = [
  g('basic-v', 'basic', 'あ a,い i,う u,え e,お o'),
  g('basic-k', 'basic', 'か ka,き ki,く ku,け ke,こ ko'),
  g('basic-s', 'basic', 'さ sa,し shi,す su,せ se,そ so'),
  g('basic-t', 'basic', 'た ta,ち chi,つ tsu,て te,と to'),
  g('basic-n', 'basic', 'な na,に ni,ぬ nu,ね ne,の no'),
  g('basic-h', 'basic', 'は ha,ひ hi,ふ fu,へ he,ほ ho'),
  g('basic-m', 'basic', 'ま ma,み mi,む mu,め me,も mo'),
  g('basic-y', 'basic', 'や ya,ゆ yu,よ yo'),
  g('basic-r', 'basic', 'ら ra,り ri,る ru,れ re,ろ ro'),
  g('basic-w', 'basic', 'わ wa,を wo'),
  g('basic-nn', 'basic', 'ん n'),
  g('dak-g', 'dakuten', 'が ga,ぎ gi,ぐ gu,げ ge,ご go'),
  g('dak-z', 'dakuten', 'ざ za,じ ji,ず zu,ぜ ze,ぞ zo'),
  g('dak-d', 'dakuten', 'だ da,ぢ ji,づ zu,で de,ど do'),
  g('dak-b', 'dakuten', 'ば ba,び bi,ぶ bu,べ be,ぼ bo'),
  g('han-p', 'handakuten', 'ぱ pa,ぴ pi,ぷ pu,ぺ pe,ぽ po'),
  g('yoon-ky', 'yoon', 'きゃ kya,きゅ kyu,きょ kyo'),
  g('yoon-sh', 'yoon', 'しゃ sha,しゅ shu,しょ sho'),
  g('yoon-ch', 'yoon', 'ちゃ cha,ちゅ chu,ちょ cho'),
  g('yoon-ny', 'yoon', 'にゃ nya,にゅ nyu,にょ nyo'),
  g('yoon-hy', 'yoon', 'ひゃ hya,ひゅ hyu,ひょ hyo'),
  g('yoon-my', 'yoon', 'みゃ mya,みゅ myu,みょ myo'),
  g('yoon-ry', 'yoon', 'りゃ rya,りゅ ryu,りょ ryo'),
  g('yoon-gy', 'yoon', 'ぎゃ gya,ぎゅ gyu,ぎょ gyo'),
  g('yoon-j', 'yoon', 'じゃ ja,じゅ ju,じょ jo'),
  g('yoon-by', 'yoon', 'びゃ bya,びゅ byu,びょ byo'),
  g('yoon-py', 'yoon', 'ぴゃ pya,ぴゅ pyu,ぴょ pyo'),
  // Katakana-only sounds used for foreign words (hiragana forms stored for the offset conversion).
  g('extra-foreign', 'extra', 'うぃ wi,うぇ we,うぉ wo,しぇ she,じぇ je,ちぇ che,てぃ ti,でぃ di,ふぁ fa,ふぃ fi,ふぇ fe,ふぉ fo', ['kata']),
];

/** Other romaji spellings accepted when the learner types an answer. Keyed by hiragana form. */
export const ALTS: Record<string, string[]> = {
  し: ['si'], ち: ['ti'], つ: ['tu'], ふ: ['hu'], を: ['o'], ん: ['nn'],
  じ: ['zi'], ぢ: ['di', 'zi'], づ: ['du'],
  しゃ: ['sya'], しゅ: ['syu'], しょ: ['syo'],
  ちゃ: ['tya'], ちゅ: ['tyu'], ちょ: ['tyo'],
  じゃ: ['zya', 'jya'], じゅ: ['zyu', 'jyu'], じょ: ['zyo', 'jyo'],
  しぇ: ['sye'], ちぇ: ['tye'], じぇ: ['zye'],
};
