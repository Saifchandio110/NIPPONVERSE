/**
 * Extra words and particles used to build romaji for whole sentences (see lib/sentenceRomaji.ts).
 * Format: [Japanese as written, romaji]. Vocabulary words and grammar breakdown tokens are added automatically.
 * Particles are listed with their SPOKEN romaji: は = wa, を = o, へ = e.
 * Add a word here when a new sentence shows no romaji. The tests check every entry against the kana reading.
 */
export const EXTRA_LEXICON: [string, string][] = [
  // particles and function words
  ['は', 'wa'], ['が', 'ga'], ['を', 'o'], ['に', 'ni'], ['で', 'de'], ['の', 'no'], ['と', 'to'], ['も', 'mo'], ['へ', 'e'], ['か', 'ka'], ['な', 'na'],
  ['です', 'desu'], ['ます', 'masu'], ['ません', 'masen'], ['ました', 'mashita'], ['ありません', 'arimasen'], ['では', 'dewa'],
  // words used in the starter sentences
  ['はじめまして', 'hajimemashite'], ['どうも', 'doumo'], ['ございます', 'gozaimasu'], ['どこ', 'doko'], ['そう', 'sou'], ['違います', 'chigaimasu'],
  ['足す', 'tasu'], ['匹', 'hiki'], ['三時', 'sanji'], ['会いましょう', 'aimashou'], ['会社員', 'kaishain'], ['映画', 'eiga'], ['好き', 'suki'],
  ['ください', 'kudasai'], ['柔らかい', 'yawarakai'], ['この', 'kono'], ['机', 'tsukue'], ['上', 'ue'], ['下', 'shita'], ['開けて', 'akete'],
  ['休み', 'yasumi'], ['読んでいます', 'yondeimasu'], ['青い', 'aoi'], ['速い', 'hayai'], ['寝ています', 'neteimasu'], ['走っています', 'hashitteimasu'],
  ['高い', 'takai'], ['きれい', 'kirei'], ['暑い', 'atsui'], ['日曜日', 'nichiyoubi'], ['赤い', 'akai'], ['空', 'sora'], ['子ども', 'kodomo'],
  ['朝ご飯', 'asagohan'], ['来ます', 'kimasu'],
  // quiz sentences, including adjective stems used with a blank
  ['部屋', 'heya'], ['面白', 'omoshiro'], ['難しい', 'muzukashii'], ['難し', 'muzukashi'], ['大き', 'ooki'], ['大きく', 'ookiku'], ['小さ', 'chiisa'],
];
