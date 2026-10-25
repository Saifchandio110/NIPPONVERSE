/** Example words for the basic kana. Format: character -> [word, English, Urdu]. Urdu needs native review. */
type Raw = Record<string, [string, string, string]>;

export interface KanaExample {
  word: string;
  en: string;
  ur: string;
  /** Use only when the computed romaji would mislead (e.g. the particle を is read "o"). */
  romaji?: string;
}

const HIRA: Raw = {
  あ: ['あめ', 'rain', 'بارش'], い: ['いぬ', 'dog', 'کتا'], う: ['うみ', 'sea', 'سمندر'], え: ['えき', 'train station', 'ریلوے اسٹیشن'], お: ['おちゃ', 'tea', 'چائے'],
  か: ['かばん', 'bag', 'بیگ'], き: ['き', 'tree', 'درخت'], く: ['くるま', 'car', 'گاڑی'], け: ['けしごむ', 'eraser', 'ربڑ'], こ: ['こえ', 'voice', 'آواز'],
  さ: ['さかな', 'fish', 'مچھلی'], し: ['しお', 'salt', 'نمک'], す: ['すし', 'sushi', 'سوشی'], せ: ['せんせい', 'teacher', 'استاد'], そ: ['そら', 'sky', 'آسمان'],
  た: ['たまご', 'egg', 'انڈا'], ち: ['ちず', 'map', 'نقشہ'], つ: ['つくえ', 'desk', 'میز'], て: ['てがみ', 'letter', 'خط'], と: ['とり', 'bird', 'پرندہ'],
  な: ['なつ', 'summer', 'گرمیوں کا موسم'], に: ['にく', 'meat', 'گوشت'], ぬ: ['ぬの', 'cloth', 'کپڑا'], ね: ['ねこ', 'cat', 'بلی'], の: ['のみもの', 'drink', 'مشروب'],
  は: ['はな', 'flower', 'پھول'], ひ: ['ひと', 'person', 'شخص'], ふ: ['ふね', 'ship', 'کشتی'], へ: ['へや', 'room', 'کمرہ'], ほ: ['ほん', 'book', 'کتاب'],
  ま: ['まど', 'window', 'کھڑکی'], み: ['みず', 'water', 'پانی'], む: ['むし', 'insect', 'کیڑا'], め: ['め', 'eye', 'آنکھ'], も: ['もも', 'peach', 'آڑو'],
  や: ['やま', 'mountain', 'پہاڑ'], ゆ: ['ゆき', 'snow', 'برف'], よ: ['よる', 'night', 'رات'],
  ら: ['らいねん', 'next year', 'اگلا سال'], り: ['りんご', 'apple', 'سیب'], る: ['さる', 'monkey', 'بندر'], れ: ['れもん', 'lemon', 'لیموں'], ろ: ['ろく', 'six', 'چھ'],
  わ: ['わたし', 'I, me', 'میں'], を: ['ほんをよむ', 'to read a book', 'کتاب پڑھنا'], ん: ['ほん', 'book', 'کتاب'],
};

const KATA: Raw = {
  ア: ['アイス', 'ice cream', 'آئس کریم'], イ: ['インク', 'ink', 'روشنائی'], ウ: ['ウイスキー', 'whisky', 'وہسکی'], エ: ['エアコン', 'air conditioner', 'ایئر کنڈیشنر'], オ: ['オレンジ', 'orange', 'مالٹا'],
  カ: ['カメラ', 'camera', 'کیمرہ'], キ: ['キロ', 'kilo', 'کلو'], ク: ['クラス', 'class', 'کلاس'], ケ: ['ケーキ', 'cake', 'کیک'], コ: ['コーヒー', 'coffee', 'کافی'],
  サ: ['サラダ', 'salad', 'سلاد'], シ: ['シャツ', 'shirt', 'قمیض'], ス: ['スープ', 'soup', 'سوپ'], セ: ['セーター', 'sweater', 'سویٹر'], ソ: ['ソファ', 'sofa', 'صوفہ'],
  タ: ['タクシー', 'taxi', 'ٹیکسی'], チ: ['チーズ', 'cheese', 'پنیر'], ツ: ['ツアー', 'tour', 'ٹور'], テ: ['テレビ', 'television', 'ٹیلی ویژن'], ト: ['トマト', 'tomato', 'ٹماٹر'],
  ナ: ['ナイフ', 'knife', 'چاقو'], ニ: ['ニュース', 'news', 'خبریں'], ヌ: ['ヌードル', 'noodles', 'نوڈلز'], ネ: ['ネクタイ', 'necktie', 'ٹائی'], ノ: ['ノート', 'notebook', 'کاپی'],
  ハ: ['ハンバーガー', 'hamburger', 'ہیمبرگر'], ヒ: ['ヒーター', 'heater', 'ہیٹر'], フ: ['フォーク', 'fork', 'کانٹا'], ヘ: ['ヘリコプター', 'helicopter', 'ہیلی کاپٹر'], ホ: ['ホテル', 'hotel', 'ہوٹل'],
  マ: ['マスク', 'mask', 'ماسک'], ミ: ['ミルク', 'milk', 'دودھ'], ム: ['ムービー', 'movie', 'فلم'], メ: ['メニュー', 'menu', 'مینو'], モ: ['モデル', 'model', 'ماڈل'],
  ヤ: ['タイヤ', 'tire', 'ٹائر'], ユ: ['ユニフォーム', 'uniform', 'وردی'], ヨ: ['ヨーグルト', 'yogurt', 'دہی'],
  ラ: ['ラジオ', 'radio', 'ریڈیو'], リ: ['リボン', 'ribbon', 'ربن'], ル: ['ルール', 'rule', 'قاعدہ'], レ: ['レストラン', 'restaurant', 'ریستوران'], ロ: ['ロボット', 'robot', 'روبوٹ'],
  ワ: ['ワイン', 'wine', 'وائن'], ン: ['パン', 'bread', 'ڈبل روٹی'],
  // ヲ is almost never used in modern Japanese, so it intentionally has no example word.
};

const convert = (raw: Raw, special: Record<string, string> = {}): Record<string, KanaExample> =>
  Object.fromEntries(
    Object.entries(raw).map(([k, [word, en, ur]]) => [k, { word, en, ur, ...(special[k] ? { romaji: special[k] } : {}) }]),
  );

export const HIRA_EXAMPLES = convert(HIRA, { を: 'hon o yomu' });
export const KATA_EXAMPLES = convert(KATA);
