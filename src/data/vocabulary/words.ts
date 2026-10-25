import type { Pos, TopicId, VocabEntry } from './schema';

// Starter beginner vocabulary. Each row: id, word, reading, part of speech, topic, English, Urdu,
// example (Japanese, kana reading, English, Urdu), optional image key. Urdu needs native-speaker review.
type Row = [string, string, string, Pos, TopicId, string, string, string, string, string, string, string?];

const rows: Row[] = [
  ['konnichiwa', 'こんにちは', 'こんにちは', 'expression', 'greetings', 'hello; good afternoon', 'ہیلو؛ دن کا سلام', 'こんにちは、はじめまして。', 'こんにちは、はじめまして。', 'Hello, nice to meet you.', 'ہیلو، آپ سے مل کر خوشی ہوئی۔'],
  ['arigatou', 'ありがとう', 'ありがとう', 'expression', 'greetings', 'thank you', 'شکریہ', 'どうもありがとうございます。', 'どうもありがとうございます。', 'Thank you very much.', 'بہت بہت شکریہ۔'],
  ['ohayou', 'おはよう', 'おはよう', 'expression', 'greetings', 'good morning', 'صبح بخیر', 'おはようございます。', 'おはようございます。', 'Good morning (polite).', 'صبح بخیر (باادب انداز)۔'],
  ['sayounara', 'さようなら', 'さようなら', 'expression', 'greetings', 'goodbye', 'خدا حافظ', 'では、さようなら。', 'では、さようなら。', 'Well then, goodbye.', 'تو پھر، خدا حافظ۔'],
  ['sumimasen', 'すみません', 'すみません', 'expression', 'greetings', 'excuse me; sorry', 'معاف کیجیے', 'すみません、駅はどこですか。', 'すみません、えきはどこですか。', 'Excuse me, where is the station?', 'معاف کیجیے، اسٹیشن کہاں ہے؟'],
  ['hai', 'はい', 'はい', 'expression', 'greetings', 'yes', 'جی ہاں', 'はい、そうです。', 'はい、そうです。', 'Yes, that is right.', 'جی ہاں، یہی ہے۔'],
  ['iie', 'いいえ', 'いいえ', 'expression', 'greetings', 'no', 'نہیں', 'いいえ、違います。', 'いいえ、ちがいます。', 'No, that is not right.', 'نہیں، ایسا نہیں ہے۔'],
  ['itadakimasu', 'いただきます', 'いただきます', 'expression', 'greetings', 'said before eating (lit. “I humbly receive”)', 'کھانے سے پہلے کہا جانے والا جملہ', 'いただきます！', 'いただきます！', 'Let’s eat! (said before a meal)', 'آئیے کھائیں! (کھانے سے پہلے کہا جاتا ہے)'],
  ['ichi', '一', 'いち', 'number', 'numbers', 'one', 'ایک', '一足す一は二です。', 'いちたすいちはにです。', 'One plus one is two.', 'ایک جمع ایک دو ہوتا ہے۔'],
  ['ni', '二', 'に', 'number', 'numbers', 'two', 'دو', '猫が二匹います。', 'ねこがにひきいます。', 'There are two cats.', 'دو بلیاں ہیں۔'],
  ['san', '三', 'さん', 'number', 'numbers', 'three', 'تین', '三時に会いましょう。', 'さんじにあいましょう。', 'Let’s meet at three o’clock.', 'تین بجے ملتے ہیں۔'],
  ['haha', '母', 'はは', 'noun', 'family', 'my mother (humble form)', 'میری والدہ (اپنی ماں کا ذکر)', '母は先生です。', 'はははせんせいです。', 'My mother is a teacher.', 'میری والدہ استاد ہیں۔'],
  ['chichi', '父', 'ちち', 'noun', 'family', 'my father (humble form)', 'میرے والد (اپنے باپ کا ذکر)', '父は会社員です。', 'ちちはかいしゃいんです。', 'My father is an office worker.', 'میرے والد دفتر میں ملازم ہیں۔'],
  ['tomodachi', '友達', 'ともだち', 'noun', 'family', 'friend', 'دوست', '友達は映画が好きです。', 'ともだちはえいががすきです。', 'My friend likes movies.', 'میرے دوست کو فلمیں پسند ہیں۔'],
  ['sensei', '先生', 'せんせい', 'noun', 'family', 'teacher', 'استاد', '先生は優しいです。', 'せんせいはやさしいです。', 'The teacher is kind.', 'استاد مہربان ہیں۔'],
  ['gohan', 'ご飯', 'ごはん', 'noun', 'food', 'cooked rice; meal', 'پکے ہوئے چاول؛ کھانا', 'ご飯はおいしいです。', 'ごはんはおいしいです。', 'The rice is delicious.', 'چاول مزیدار ہیں۔', 'gohan'],
  ['mizu', '水', 'みず', 'noun', 'food', 'water', 'پانی', '水をください。', 'みずをください。', 'Water, please.', 'براہِ کرم پانی دیجیے۔', 'mizu'],
  ['ringo', 'りんご', 'りんご', 'noun', 'food', 'apple', 'سیب', 'りんごが好きです。', 'りんごがすきです。', 'I like apples.', 'مجھے سیب پسند ہیں۔', 'ringo'],
  ['sakana', '魚', 'さかな', 'noun', 'food', 'fish', 'مچھلی', '魚はおいしいです。', 'さかなはおいしいです。', 'The fish is delicious.', 'مچھلی مزیدار ہے۔', 'sakana'],
  ['ocha', 'お茶', 'おちゃ', 'noun', 'food', 'tea (green tea)', 'چائے', 'お茶をください。', 'おちゃをください。', 'Tea, please.', 'براہِ کرم چائے دیجیے۔'],
  ['pan', 'パン', 'パン', 'noun', 'food', 'bread', 'ڈبل روٹی', 'パンは柔らかいです。', 'パンはやわらかいです。', 'The bread is soft.', 'ڈبل روٹی نرم ہے۔'],
  ['oishii', 'おいしい', 'おいしい', 'i-adjective', 'food', 'delicious', 'مزیدار', 'このパンはおいしいです。', 'このパンはおいしいです。', 'This bread is delicious.', 'یہ ڈبل روٹی مزیدار ہے۔'],
  ['ie', '家', 'いえ', 'noun', 'home', 'house; home', 'گھر', '家は小さいです。', 'いえはちいさいです。', 'The house is small.', 'گھر چھوٹا ہے۔', 'ie'],
  ['hon', '本', 'ほん', 'noun', 'home', 'book', 'کتاب', '本は机の上にあります。', 'ほんはつくえのうえにあります。', 'The book is on the desk.', 'کتاب میز کے اوپر ہے۔', 'hon'],
  ['mado', '窓', 'まど', 'noun', 'home', 'window', 'کھڑکی', '窓を開けてください。', 'まどをあけてください。', 'Please open the window.', 'براہِ کرم کھڑکی کھولیے۔'],
  ['gakkou', '学校', 'がっこう', 'noun', 'school', 'school', 'اسکول', '学校は明日休みです。', 'がっこうはあしたやすみです。', 'School is closed tomorrow.', 'کل اسکول کی چھٹی ہے۔', 'gakkou'],
  ['gakusei', '学生', 'がくせい', 'noun', 'school', 'student', 'طالب علم', '学生は本を読んでいます。', 'がくせいはほんをよんでいます。', 'The student is reading a book.', 'طالب علم کتاب پڑھ رہا ہے۔'],
  ['nihongo', '日本語', 'にほんご', 'noun', 'school', 'Japanese language', 'جاپانی زبان', '日本語は難しくないです。', 'にほんごはむずかしくないです。', 'Japanese is not difficult.', 'جاپانی مشکل نہیں ہے۔'],
  ['kuruma', '車', 'くるま', 'noun', 'travel', 'car', 'گاڑی', '車は青いです。', 'くるまはあおいです。', 'The car is blue.', 'گاڑی نیلی ہے۔', 'kuruma'],
  ['eki', '駅', 'えき', 'noun', 'travel', 'station', 'اسٹیشن', '駅はどこですか。', 'えきはどこですか。', 'Where is the station?', 'اسٹیشن کہاں ہے؟'],
  ['densha', '電車', 'でんしゃ', 'noun', 'travel', 'train (electric)', 'ٹرین', '電車は速いです。', 'でんしゃははやいです。', 'The train is fast.', 'ٹرین تیز ہے۔'],
  ['neko', '猫', 'ねこ', 'noun', 'nature', 'cat', 'بلی', '猫は寝ています。', 'ねこはねています。', 'The cat is sleeping.', 'بلی سو رہی ہے۔', 'neko'],
  ['inu', '犬', 'いぬ', 'noun', 'nature', 'dog', 'کتا', '犬は走っています。', 'いぬははしっています。', 'The dog is running.', 'کتا دوڑ رہا ہے۔', 'inu'],
  ['yama', '山', 'やま', 'noun', 'nature', 'mountain', 'پہاڑ', '山は高いです。', 'やまはたかいです。', 'The mountain is high.', 'پہاڑ اونچا ہے۔', 'yama'],
  ['hana', '花', 'はな', 'noun', 'nature', 'flower', 'پھول', '花はきれいです。', 'はなはきれいです。', 'The flower is beautiful.', 'پھول خوبصورت ہے۔', 'hana'],
  ['ki', '木', 'き', 'noun', 'nature', 'tree', 'درخت', '木の下に猫がいます。', 'きのしたにねこがいます。', 'There is a cat under the tree.', 'درخت کے نیچے ایک بلی ہے۔', 'ki'],
  ['ame', '雨', 'あめ', 'noun', 'time', 'rain', 'بارش', '今日は雨です。', 'きょうはあめです。', 'It is rainy today.', 'آج بارش ہے۔', 'ame'],
  ['kyou', '今日', 'きょう', 'noun', 'time', 'today', 'آج', '今日は暑いです。', 'きょうはあついです。', 'It is hot today.', 'آج گرمی ہے۔'],
  ['ashita', '明日', 'あした', 'noun', 'time', 'tomorrow', 'آنے والا کل', '明日は日曜日です。', 'あしたはにちようびです。', 'Tomorrow is Sunday.', 'کل (آنے والا) اتوار ہے۔'],
  ['jikan', '時間', 'じかん', 'noun', 'time', 'time; hours', 'وقت', '時間がありません。', 'じかんがありません。', 'There is no time.', 'وقت نہیں ہے۔'],
  ['aka', '赤', 'あか', 'noun', 'colors', 'red', 'سرخ؛ لال', '赤いりんごをください。', 'あかいりんごをください。', 'A red apple, please.', 'براہِ کرم سرخ سیب دیجیے۔'],
  ['ao', '青', 'あお', 'noun', 'colors', 'blue (also used for some greens)', 'نیلا (بعض اوقات سبز کے لیے بھی)', '空は青いです。', 'そらはあおいです。', 'The sky is blue.', 'آسمان نیلا ہے۔'],
  ['ookii', '大きい', 'おおきい', 'i-adjective', 'colors', 'big', 'بڑا', '犬は大きいです。', 'いぬはおおきいです。', 'The dog is big.', 'کتا بڑا ہے۔'],
  ['chiisai', '小さい', 'ちいさい', 'i-adjective', 'colors', 'small', 'چھوٹا', '猫は小さいです。', 'ねこはちいさいです。', 'The cat is small.', 'بلی چھوٹی ہے۔'],
  ['taberu', '食べる', 'たべる', 'verb', 'daily', 'to eat', 'کھانا', '子どもは朝ご飯を食べます。', 'こどもはあさごはんをたべます。', 'The child eats breakfast.', 'بچہ ناشتہ کرتا ہے۔'],
  ['nomu', '飲む', 'のむ', 'verb', 'daily', 'to drink', 'پینا', '子どもは水を飲みます。', 'こどもはみずをのみます。', 'The child drinks water.', 'بچہ پانی پیتا ہے۔'],
  ['miru', '見る', 'みる', 'verb', 'daily', 'to see; to watch', 'دیکھنا', '母はテレビを見ます。', 'はははテレビをみます。', 'My mother watches TV.', 'میری والدہ ٹی وی دیکھتی ہیں۔'],
  ['iku', '行く', 'いく', 'verb', 'daily', 'to go', 'جانا', '先生は学校に行きます。', 'せんせいはがっこうにいきます。', 'The teacher goes to school.', 'استاد اسکول جاتے ہیں۔'],
  ['kuru', '来る', 'くる', 'verb', 'daily', 'to come', 'آنا', '友達が来ます。', 'ともだちがきます。', 'A friend is coming.', 'ایک دوست آ رہا ہے۔'],
];

// Computed romaji is wrong for the topic particle は, so list overrides here.
const ROMAJI_OVERRIDE: Record<string, string> = { konnichiwa: 'konnichiwa' };

export const VOCAB: VocabEntry[] = rows.map(([id, word, reading, pos, topic, en, ur, ja, jaReading, exEn, exUr, image]) => ({
  id, word, reading, pos, topic, en, ur,
  ...(ROMAJI_OVERRIDE[id] ? { romaji: ROMAJI_OVERRIDE[id] } : {}),
  example: { ja, reading: jaReading, en: exEn, ur: exUr },
  ...(image ? { image } : {}),
  tags: [topic],
  level: 'beginner' as const,
}));
