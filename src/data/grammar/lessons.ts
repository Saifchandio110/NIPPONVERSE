import type { GrammarExample, GrammarLesson, GrammarMistake, GrammarQuestion, GrammarQType, GrammarToken } from './schema';

// Starter beginner grammar. Urdu needs native-speaker review. Sentence readings are kana, not romaji,
// because the particles は, を and へ are pronounced wa, o and e, which cannot be converted automatically.

const t = (ja: string, reading: string, en: string, ur: string, romaji?: string): GrammarToken => ({ ja, ...(reading ? { reading } : {}), ...(romaji ? { romaji } : {}), en, ur });
const ex = (ja: string, reading: string, tokens: GrammarToken[], en: string, urText: string): GrammarExample => ({ ja, reading, tokens, en, ur: urText });
const mk = (wrong: string | undefined, right: string | undefined, en: string, ur: string): GrammarMistake => ({ ...(wrong ? { wrong } : {}), ...(right ? { right } : {}), note: { en, ur } });
const q = (
  id: string, type: GrammarQType, prompt: string, hintEn: string, hintUr: string,
  options: string[], answer: string, expEn: string, expUr: string,
): GrammarQuestion => ({
  id, type, prompt, promptLang: type === 'translate' ? 'en' : 'ja',
  hint: { en: hintEn, ur: hintUr }, options, answer, explanation: { en: expEn, ur: expUr },
});

export const GRAMMAR: GrammarLesson[] = [
  {
    id: 'noun-desu', order: 1, level: 'beginner',
    title: { en: 'Noun sentences: です and か', ur: 'اسمیہ جملے: です اور か' },
    summary: { en: 'Say what something is, make it negative, and ask questions.', ur: 'کسی چیز کے بارے میں بتانا، اس کی نفی کرنا اور سوال پوچھنا۔' },
    pattern: 'A は B です ／ A は B ではありません ／ A は B ですか',
    explanation: {
      en: 'Say what something is with [A]は[B]です. です is the polite “is / am / are” and comes last. は (read “wa”) marks the topic: what the sentence is about. Make it negative with ではありません, and make it a question by adding か at the end.',
      ur: 'کسی چیز کے بارے میں بتانے کے لیے [A]は[B]です استعمال ہوتا ہے۔ です باادب انداز میں “ہے / ہوں / ہیں” کے معنی دیتا ہے اور جملے کے آخر میں آتا ہے۔ は (جسے “wa” پڑھا جاتا ہے) موضوع کی علامت ہے، یعنی جملہ کس کے بارے میں ہے۔ منفی بنانے کے لیے ではありません اور سوال بنانے کے لیے آخر میں か لگائیں۔',
    },
    examples: [
      ex('私は学生です。', 'わたしはがくせいです。', [t('私', 'わたし', 'I', 'میں'), t('は', '', 'topic marker (read “wa”)', 'موضوع کی علامت'), t('学生', 'がくせい', 'student', 'طالب علم'), t('です', '', 'polite “am / is / are”', 'ہوں / ہے (باادب)')], 'I am a student.', 'میں طالب علم ہوں۔'),
      ex('田中さんは先生ではありません。', 'たなかさんはせんせいではありません。', [t('田中', 'たなか', 'Tanaka (a surname)', 'تاناکا (خاندانی نام)'), t('さん', '', 'Mr. / Ms. (polite title)', 'محترم / محترمہ'), t('は', '', 'topic marker', 'موضوع کی علامت'), t('先生', 'せんせい', 'teacher', 'استاد'), t('ではありません', '', 'is not (polite)', 'نہیں ہے (باادب)', 'dewa arimasen')], 'Mr. / Ms. Tanaka is not a teacher.', 'تاناکا صاحب / صاحبہ استاد نہیں ہیں۔'),
      ex('これは本ですか。', 'これはほんですか。', [t('これ', '', 'this (thing near me)', 'یہ (میرے قریب کی چیز)'), t('は', '', 'topic marker', 'موضوع کی علامت'), t('本', 'ほん', 'book', 'کتاب'), t('です', '', 'polite “is”', 'ہے (باادب)'), t('か', '', 'question marker', 'سوالیہ علامت')], 'Is this a book?', 'کیا یہ کتاب ہے؟'),
    ],
    mistakes: [
      mk(undefined, undefined, 'は is read “wa”, not “ha”, when it works as the topic particle.', 'جب は موضوع کی علامت کے طور پر آئے تو اسے “ha” نہیں بلکہ “wa” پڑھا جاتا ہے۔'),
      mk('私は学生。', '私は学生です。', 'In polite speech do not leave out です. Without it the sentence sounds casual or abrupt.', 'باادب گفتگو میں です نہ چھوڑیں۔ اس کے بغیر جملہ غیر رسمی یا روکھا لگتا ہے۔'),
      mk(undefined, undefined, 'Japanese questions end with か. A question mark is optional.', 'جاپانی میں سوال کے آخر میں か آتا ہے۔ سوالیہ نشان لگانا ضروری نہیں۔'),
    ],
    questions: [
      q('noun-desu-1', 'fill', '私は学生＿＿。', 'I am a student.', 'میں طالب علم ہوں۔', ['です', 'ですか', 'ではありません', 'は'], 'です', 'です ends a polite noun sentence: 私は学生です.', 'です باادب اسمیہ جملے کو ختم کرتا ہے: 私は学生です۔'),
      q('noun-desu-2', 'particle', '私＿＿学生です。', 'I am a student.', 'میں طالب علم ہوں۔', ['は', 'を', 'に', 'で'], 'は', 'は marks the topic: “as for me”.', 'は موضوع کی علامت ہے: “جہاں تک میرا تعلق ہے”۔'),
      q('noun-desu-3', 'translate', 'Is this a book?', '', 'کیا یہ کتاب ہے؟', ['これは本です。', 'これは本ですか。', 'これは本ではありません。', 'これを本ですか。'], 'これは本ですか。', 'か at the end turns the sentence into a question.', 'آخر میں か لگانے سے جملہ سوال بن جاتا ہے۔'),
      q('noun-desu-4', 'fill', '田中さんは先生＿＿。', 'Mr. / Ms. Tanaka is not a teacher.', 'تاناکا صاحب / صاحبہ استاد نہیں ہیں۔', ['ではありません', 'です', 'ですか', 'はい'], 'ではありません', 'ではありません is the polite negative of です.', 'ではありません، です کی باادب منفی شکل ہے۔'),
      q('noun-desu-5', 'translate', 'I am not a student.', '', 'میں طالب علم نہیں ہوں۔', ['私は学生です。', '私は学生ではありません。', '私は学生ですか。', '学生は私です。'], '私は学生ではありません。', 'ではありません negates the noun. 学生は私です would mean “the student is me”.', 'ではありません اسم کی نفی کرتا ہے۔ 学生は私です کا مطلب ہوگا “طالب علم میں ہوں”۔'),
    ],
  },
  {
    id: 'wa-no', order: 2, level: 'beginner',
    title: { en: 'は and の', ur: 'は اور の' },
    summary: { en: 'Mark the topic with は and link two nouns with の.', ur: 'は سے موضوع بتانا اور の سے دو اسموں کو جوڑنا۔' },
    pattern: 'A の B ／ A は …',
    explanation: {
      en: 'は marks the topic: “as for A…”. の joins two nouns: A の B means “B of A” or “A’s B”. The owner or describer comes first and the thing described comes second.',
      ur: 'は موضوع کی علامت ہے: “جہاں تک A کا تعلق ہے…”۔ の دو اسموں کو جوڑتا ہے: A の B کا مطلب ہے “A کا B”۔ مالک یا وضاحت کرنے والا لفظ پہلے آتا ہے اور جس چیز کی بات ہو وہ بعد میں۔',
    },
    examples: [
      ex('これは私の本です。', 'これはわたしのほんです。', [t('これ', '', 'this', 'یہ'), t('は', '', 'topic marker', 'موضوع کی علامت'), t('私', 'わたし', 'I / my', 'میں / میرا'), t('の', '', 'possessive: “’s”, “of”', 'کا / کی / کے'), t('本', 'ほん', 'book', 'کتاب'), t('です', '', 'polite “is”', 'ہے (باادب)')], 'This is my book.', 'یہ میری کتاب ہے۔'),
      ex('日本語の先生は優しいです。', 'にほんごのせんせいはやさしいです。', [t('日本語', 'にほんご', 'Japanese language', 'جاپانی زبان'), t('の', '', 'of', 'کے'), t('先生', 'せんせい', 'teacher', 'استاد'), t('は', '', 'topic marker', 'موضوع کی علامت'), t('優しい', 'やさしい', 'kind', 'مہربان'), t('です', '', 'polite “is”', 'ہیں (باادب)')], 'The Japanese-language teacher is kind.', 'جاپانی زبان کے استاد مہربان ہیں۔'),
      ex('母の友達は先生です。', 'ははのともだちはせんせいです。', [t('母', 'はは', 'my mother', 'میری والدہ'), t('の', '', '’s', 'کے'), t('友達', 'ともだち', 'friend', 'دوست'), t('は', '', 'topic marker', 'موضوع کی علامت'), t('先生', 'せんせい', 'teacher', 'استاد'), t('です', '', 'polite “is”', 'ہیں (باادب)')], 'My mother’s friend is a teacher.', 'میری والدہ کے دوست استاد ہیں۔'),
    ],
    mistakes: [
      mk('本の私', '私の本', 'The owner comes first: 私の本 means “my book”. Reversing it changes the meaning.', 'مالک پہلے آتا ہے: 私の本 کا مطلب “میری کتاب” ہے۔ ترتیب الٹنے سے مطلب بدل جاتا ہے۔'),
      mk(undefined, undefined, 'Use は for “as for X…” sentences for now. が is a different particle (introduced in lesson 5) and the two are not interchangeable.', 'فی الحال “X کے بارے میں…” والے جملوں کے لیے は استعمال کریں۔ が مختلف ذرہ ہے (سبق 5 میں آئے گا) اور دونوں ایک دوسرے کی جگہ نہیں لیتے۔'),
    ],
    questions: [
      q('wa-no-1', 'particle', 'これは私＿＿本です。', 'This is my book.', 'یہ میری کتاب ہے۔', ['の', 'は', 'を', 'に'], 'の', 'の links 私 and 本: “my book”.', 'の، 私 اور 本 کو جوڑتا ہے: “میری کتاب”۔'),
      q('wa-no-2', 'particle', '母＿＿友達は先生です。', 'My mother’s friend is a teacher.', 'میری والدہ کے دوست استاد ہیں۔', ['の', 'を', 'で', 'と'], 'の', 'の links 母 and 友達: “mother’s friend”.', 'の، 母 اور 友達 کو جوڑتا ہے: “والدہ کے دوست”۔'),
      q('wa-no-3', 'translate', 'This is my teacher’s book.', '', 'یہ میرے استاد کی کتاب ہے۔', ['これは先生の本です。', 'これは本の先生です。', 'これは先生は本です。', 'これの先生は本です。'], 'これは先生の本です。', '先生の本 means “the teacher’s book”. The owner comes before の.', '先生の本 کا مطلب “استاد کی کتاب” ہے۔ مالک の سے پہلے آتا ہے۔'),
      q('wa-no-4', 'translate', 'my mother', '', 'میری والدہ', ['私の母', '母の私', '私は母', '母は私'], '私の母', '私の母 puts the owner (私) before の.', '私の母 میں مالک (私) の سے پہلے آتا ہے۔'),
      q('wa-no-5', 'particle', '田中さん＿＿先生です。', 'Mr. / Ms. Tanaka is a teacher.', 'تاناکا صاحب / صاحبہ استاد ہیں۔', ['は', 'の', 'を', 'で'], 'は', 'は marks the topic: “as for Mr. / Ms. Tanaka”.', 'は موضوع کی علامت ہے: “تاناکا صاحب / صاحبہ کے بارے میں”۔'),
    ],
  },
  {
    id: 'wo-masu', order: 3, level: 'beginner',
    title: { en: 'Objects and polite verbs: を and ます', ur: 'مفعول اور باادب افعال: を اور ます' },
    summary: { en: 'Put the verb last, mark the object with を, and use the polite ます form.', ur: 'فعل آخر میں رکھنا، مفعول کو を سے ظاہر کرنا اور باادب ます شکل استعمال کرنا۔' },
    pattern: 'A は B を verb-ます',
    explanation: {
      en: 'Japanese puts the verb at the end of the sentence (subject – object – verb). を marks the object, the thing the verb acts on. Polite verbs end in ます, which covers present and near-future (“eat / will eat”). Urdu also puts the verb last, so the order will feel familiar.',
      ur: 'جاپانی میں فعل جملے کے آخر میں آتا ہے (فاعل – مفعول – فعل)۔ を مفعول کی علامت ہے، یعنی وہ چیز جس پر فعل کا اثر ہو۔ باادب افعال ます پر ختم ہوتے ہیں اور حال اور قریبی مستقبل کے لیے استعمال ہوتے ہیں (“کھاتا ہوں / کھاؤں گا”)۔ اردو کی طرح جاپانی میں بھی فعل آخر میں آتا ہے، اس لیے ترتیب جانی پہچانی لگے گی۔',
    },
    examples: [
      ex('私はりんごを食べます。', 'わたしはりんごをたべます。', [t('私', 'わたし', 'I', 'میں'), t('は', '', 'topic marker', 'موضوع کی علامت'), t('りんご', '', 'apple', 'سیب'), t('を', '', 'object marker (read “o”)', 'مفعول کی علامت'), t('食べます', 'たべます', 'eat (polite)', 'کھاتا / کھاتی ہوں (باادب)')], 'I eat an apple.', 'میں سیب کھاتا / کھاتی ہوں۔'),
      ex('母は水を飲みます。', 'はははみずをのみます。', [t('母', 'はは', 'my mother', 'میری والدہ'), t('は', '', 'topic marker', 'موضوع کی علامت'), t('水', 'みず', 'water', 'پانی'), t('を', '', 'object marker', 'مفعول کی علامت'), t('飲みます', 'のみます', 'drink (polite)', 'پیتی ہیں (باادب)')], 'My mother drinks water.', 'میری والدہ پانی پیتی ہیں۔'),
      ex('友達はテレビを見ます。', 'ともだちはテレビをみます。', [t('友達', 'ともだち', 'friend', 'دوست'), t('は', '', 'topic marker', 'موضوع کی علامت'), t('テレビ', '', 'TV', 'ٹی وی'), t('を', '', 'object marker', 'مفعول کی علامت'), t('見ます', 'みます', 'watch (polite)', 'دیکھتے ہیں (باادب)')], 'My friend watches TV.', 'دوست ٹی وی دیکھتے ہیں۔'),
    ],
    mistakes: [
      mk('食べます私はりんごを', '私はりんごを食べます', 'The verb goes last. Putting it earlier makes the sentence wrong.', 'فعل آخر میں آتا ہے۔ اسے پہلے رکھنے سے جملہ غلط ہو جاتا ہے۔'),
      mk('私は学生をです', '私は学生です', 'を marks the object of an action verb. Do not use it with です.', 'を عمل والے فعل کے مفعول کی علامت ہے۔ です کے ساتھ اسے استعمال نہ کریں۔'),
      mk(undefined, undefined, 'In ordinary speech を is read “o”, not “wo”.', 'عام گفتگو میں を کو “wo” نہیں بلکہ “o” پڑھا جاتا ہے۔'),
    ],
    questions: [
      q('wo-masu-1', 'particle', '私はりんご＿＿食べます。', 'I eat an apple.', 'میں سیب کھاتا / کھاتی ہوں۔', ['を', 'は', 'に', 'で'], 'を', 'を marks the thing being eaten, the object.', 'を اس چیز کی علامت ہے جو کھائی جا رہی ہے، یعنی مفعول۔'),
      q('wo-masu-2', 'fill', '母は水を＿＿。', 'My mother drinks water.', 'میری والدہ پانی پیتی ہیں۔', ['飲みます', '食べます', '見ます', '行きます'], '飲みます', '飲みます means “drink”. The verb comes last.', '飲みます کا مطلب “پینا” ہے۔ فعل آخر میں آتا ہے۔'),
      q('wo-masu-3', 'translate', 'My friend watches TV.', '', 'دوست ٹی وی دیکھتے ہیں۔', ['友達はテレビを見ます。', '友達はテレビを食べます。', 'テレビは友達を見ます。', '友達を見ますテレビは。'], '友達はテレビを見ます。', 'Friend は TV を watch: the order is subject – object – verb.', 'دوست は ٹی وی を دیکھنا: ترتیب فاعل – مفعول – فعل ہے۔'),
      q('wo-masu-4', 'translate', 'I drink water.', '', 'میں پانی پیتا / پیتی ہوں۔', ['私は水を飲みます。', '私は飲みます水を。', '飲みます私は水を。', '私を水は飲みます。'], '私は水を飲みます。', 'The natural order is 私は (subject) 水を (object) 飲みます (verb).', 'فطری ترتیب ہے: 私は (فاعل) 水を (مفعول) 飲みます (فعل)۔'),
      q('wo-masu-5', 'particle', '友達はテレビ＿＿見ます。', 'My friend watches TV.', 'دوست ٹی وی دیکھتے ہیں۔', ['を', 'の', 'で', 'と'], 'を', 'を marks TV as the object of 見ます.', 'を، ٹی وی کو 見ます کا مفعول بتاتا ہے۔'),
    ],
  },
  {
    id: 'ni-de-he', order: 4, level: 'beginner',
    title: { en: 'Place and time: に, で, へ', ur: 'جگہ اور وقت: に، で، へ' },
    summary: { en: 'Choose the right particle for times, destinations and places of action.', ur: 'وقت، منزل اور کام کی جگہ کے لیے درست ذرہ منتخب کرنا۔' },
    pattern: 'time に ／ place に 行きます ／ place で verb ／ place へ 行きます',
    explanation: {
      en: 'Particles show the role of the word before them. に marks a specific time (七時に), a destination (学校に行きます) and the person you meet. で marks the place where an action happens (駅で…). へ marks direction and is read “e”; for going somewhere it can replace に.',
      ur: 'ذرات (particles) اپنے سے پہلے لفظ کا کردار بتاتے ہیں۔ に کسی خاص وقت (七時に)، منزل (学校に行きます) اور جس سے ملا جائے اس شخص کو ظاہر کرتا ہے۔ で اس جگہ کو بتاتا ہے جہاں کام ہوتا ہے (駅で…)۔ へ سمت بتاتا ہے اور اسے “e” پڑھا جاتا ہے؛ کہیں جانے کے لیے یہ に کی جگہ آ سکتا ہے۔',
    },
    examples: [
      ex('私は学校に行きます。', 'わたしはがっこうにいきます。', [t('私', 'わたし', 'I', 'میں'), t('は', '', 'topic marker', 'موضوع کی علامت'), t('学校', 'がっこう', 'school', 'اسکول'), t('に', '', 'destination marker', 'منزل کی علامت'), t('行きます', 'いきます', 'go (polite)', 'جاتا / جاتی ہوں (باادب)')], 'I go to school.', 'میں اسکول جاتا / جاتی ہوں۔'),
      ex('駅で友達に会います。', 'えきでともだちにあいます。', [t('駅', 'えき', 'station', 'اسٹیشن'), t('で', '', 'at (where the action happens)', 'پر (جہاں کام ہو)'), t('友達', 'ともだち', 'friend', 'دوست'), t('に', '', 'the person met', 'جس سے ملا جائے'), t('会います', 'あいます', 'meet (polite)', 'ملتا / ملتی ہوں (باادب)')], '(I) meet a friend at the station.', '(میں) اسٹیشن پر دوست سے ملتا / ملتی ہوں۔'),
      ex('七時に起きます。', 'しちじにおきます。', [t('七時', 'しちじ', 'seven o’clock', 'سات بجے'), t('に', '', 'at (a specific time)', 'پر (خاص وقت)'), t('起きます', 'おきます', 'get up (polite)', 'اٹھتا / اٹھتی ہوں (باادب)')], '(I) get up at seven.', '(میں) سات بجے اٹھتا / اٹھتی ہوں۔'),
    ],
    mistakes: [
      mk('学校で行きます', '学校に行きます', 'で marks where an action happens. A destination takes に (or へ).', 'で اس جگہ کو بتاتا ہے جہاں کام ہو۔ منزل کے لیے に (یا へ) آتا ہے۔'),
      mk(undefined, undefined, 'When used as a particle, へ is read “e”, not “he”. 学校へ行きます and 学校に行きます both mean “I go to school”.', 'ذرے کے طور پر へ کو “he” نہیں بلکہ “e” پڑھا جاتا ہے۔ 学校へ行きます اور 学校に行きます دونوں کا مطلب “میں اسکول جاتا ہوں” ہے۔'),
    ],
    questions: [
      q('ni-de-he-1', 'particle', '私は学校＿＿行きます。', 'I go to school.', 'میں اسکول جاتا / جاتی ہوں۔', ['に', 'で', 'を', 'は'], 'に', 'A destination takes に.', 'منزل کے ساتھ に آتا ہے۔'),
      q('ni-de-he-2', 'particle', '駅＿＿友達に会います。', '(I) meet a friend at the station.', '(میں) اسٹیشن پر دوست سے ملتا / ملتی ہوں۔', ['で', 'に', 'を', 'の'], 'で', 'The station is where the meeting happens, so it takes で.', 'اسٹیشن وہ جگہ ہے جہاں ملاقات ہوتی ہے، اس لیے で آتا ہے۔'),
      q('ni-de-he-3', 'particle', '七時＿＿起きます。', '(I) get up at seven.', '(میں) سات بجے اٹھتا / اٹھتی ہوں۔', ['に', 'で', 'を', 'と'], 'に', 'A specific clock time takes に.', 'گھڑی کے خاص وقت کے ساتھ に آتا ہے۔'),
      q('ni-de-he-4', 'particle', '学校＿＿行きます。', 'I go toward school (direction).', 'میں اسکول کی طرف جاتا / جاتی ہوں۔', ['へ', 'で', 'を', 'の'], 'へ', 'へ (read “e”) marks direction and can replace に with 行きます.', 'へ (جسے “e” پڑھا جاتا ہے) سمت بتاتا ہے اور 行きます کے ساتھ に کی جگہ آ سکتا ہے۔'),
      q('ni-de-he-5', 'translate', 'I eat rice at home.', '', 'میں گھر پر چاول کھاتا / کھاتی ہوں۔', ['私は家でご飯を食べます。', '私は家にご飯を食べます。', '私は家をご飯で食べます。', '私は家でご飯に食べます。'], '私は家でご飯を食べます。', 'The home is where the action happens (で) and the rice is the object (を).', 'گھر وہ جگہ ہے جہاں کام ہوتا ہے (で) اور چاول مفعول ہیں (を)۔'),
    ],
  },
  {
    id: 'aru-iru', order: 5, level: 'beginner',
    title: { en: 'There is / there are: あります and います', ur: 'موجود ہونا: あります اور います' },
    summary: { en: 'Say that something exists, using あります for things and います for living beings.', ur: 'کسی چیز کے موجود ہونے کا بیان: بے جان کے لیے あります اور جاندار کے لیے います۔' },
    pattern: 'place に thing が あります ／ います',
    explanation: {
      en: 'To say something exists, use Place に Thing が あります / います. います is for living things (people, animals); あります is for non-living things (objects, plants). が marks the thing that exists. The negatives are いません and ありません.',
      ur: 'کسی چیز کے موجود ہونے کے لیے جگہ に چیز が あります / います استعمال ہوتا ہے۔ います جاندار چیزوں (لوگ، جانور) کے لیے اور あります بے جان چیزوں (اشیا، پودے) کے لیے ہے۔ が اس چیز کی علامت ہے جو موجود ہے۔ منفی شکلیں いません اور ありません ہیں۔',
    },
    examples: [
      ex('机の上に本があります。', 'つくえのうえにほんがあります。', [t('机', 'つくえ', 'desk', 'میز'), t('の', '', 'of', 'کے'), t('上', 'うえ', 'top, above', 'اوپر'), t('に', '', 'at (location)', 'میں / پر (مقام)'), t('本', 'ほん', 'book', 'کتاب'), t('が', '', 'marks the thing that exists', 'موجود چیز کی علامت'), t('あります', '', 'there is (non-living)', 'ہے (بے جان)')], 'There is a book on the desk.', 'میز کے اوپر ایک کتاب ہے۔'),
      ex('庭に猫がいます。', 'にわにねこがいます。', [t('庭', 'にわ', 'garden, yard', 'باغ، صحن'), t('に', '', 'at (location)', 'میں (مقام)'), t('猫', 'ねこ', 'cat', 'بلی'), t('が', '', 'marks the thing that exists', 'موجود چیز کی علامت'), t('います', '', 'there is (living)', 'ہے (جاندار)')], 'There is a cat in the garden.', 'باغ میں ایک بلی ہے۔'),
      ex('教室に学生がいません。', 'きょうしつにがくせいがいません。', [t('教室', 'きょうしつ', 'classroom', 'کلاس روم'), t('に', '', 'at (location)', 'میں (مقام)'), t('学生', 'がくせい', 'student', 'طالب علم'), t('が', '', 'marks the thing that exists', 'موجود چیز کی علامت'), t('いません', '', 'there is not (living)', 'نہیں ہے (جاندار)')], 'There are no students in the classroom.', 'کلاس روم میں کوئی طالب علم نہیں ہے۔'),
    ],
    mistakes: [
      mk('猫があります', '猫がいます', 'Animals and people use います. あります is for things that are not alive.', 'جانور اور لوگ います استعمال کرتے ہیں۔ あります بے جان چیزوں کے لیے ہے۔'),
      mk('庭で猫がいます', '庭に猫がいます', 'Existence uses に for the location. で is for where an action happens.', 'موجودگی کی جگہ کے لیے に آتا ہے۔ で اس جگہ کے لیے ہے جہاں کام ہوتا ہے۔'),
    ],
    questions: [
      q('aru-iru-1', 'fill', '庭に猫が＿＿。', 'There is a cat in the garden.', 'باغ میں ایک بلی ہے۔', ['います', 'あります', 'です', 'いません'], 'います', 'A cat is alive, so use います.', 'بلی جاندار ہے، اس لیے います آتا ہے۔'),
      q('aru-iru-2', 'fill', '机の上に本が＿＿。', 'There is a book on the desk.', 'میز کے اوپر ایک کتاب ہے۔', ['あります', 'います', 'です', 'ありません'], 'あります', 'A book is not alive, so use あります.', 'کتاب بے جان ہے، اس لیے あります آتا ہے۔'),
      q('aru-iru-3', 'particle', '庭＿＿猫がいます。', 'There is a cat in the garden.', 'باغ میں ایک بلی ہے۔', ['に', 'で', 'を', 'は'], 'に', 'The location of existence takes に.', 'موجودگی کی جگہ کے ساتھ に آتا ہے۔'),
      q('aru-iru-4', 'translate', 'There are no students in the classroom.', '', 'کلاس روم میں کوئی طالب علم نہیں ہے۔', ['教室に学生がいません。', '教室に学生がありません。', '教室で学生がいます。', '教室を学生がいません。'], '教室に学生がいません。', 'Students are living, so use いません. The location takes に.', 'طلبہ جاندار ہیں، اس لیے いません آتا ہے۔ جگہ کے ساتھ に آتا ہے۔'),
      q('aru-iru-5', 'fill', '部屋にテレビが＿＿。', 'There is a TV in the room.', 'کمرے میں ایک ٹی وی ہے۔', ['あります', 'います', 'ありません', 'いません'], 'あります', 'A TV is not alive, and the sentence says it exists, so あります.', 'ٹی وی بے جان ہے اور جملہ اس کی موجودگی بتاتا ہے، اس لیے あります۔'),
    ],
  },
  {
    id: 'i-adjectives', order: 6, level: 'beginner',
    title: { en: 'い-adjectives', ur: 'い صفات' },
    summary: { en: 'Describe nouns with adjectives ending in い, and make them negative.', ur: 'い پر ختم ہونے والی صفات سے اسم کی وضاحت اور ان کی نفی۔' },
    pattern: 'adj-い + noun ／ adj-い です ／ adj-くない です',
    explanation: {
      en: 'い-adjectives end in い (大きい, 小さい, 面白い). Put them before a noun without any extra word (大きい犬) or end a polite sentence with です (犬は大きいです). To make one negative, change い to くない (大きくないです). The adjective いい (good) becomes よくない.',
      ur: 'い صفات い پر ختم ہوتی ہیں (大きい، 小さい، 面白い)۔ انہیں اسم سے پہلے بغیر کسی اضافی لفظ کے رکھا جاتا ہے (大きい犬) یا باادب جملہ ختم کرنے کے لیے です لگایا جاتا ہے (犬は大きいです)۔ منفی کے لیے い کو くない سے بدلیں (大きくないです)۔ صفت いい (اچھا) کی منفی شکل よくない ہے۔',
    },
    examples: [
      ex('大きい犬がいます。', 'おおきいいぬがいます。', [t('大きい', 'おおきい', 'big', 'بڑا'), t('犬', 'いぬ', 'dog', 'کتا'), t('が', '', 'marks the thing that exists', 'موجود چیز کی علامت'), t('います', '', 'there is (living)', 'ہے (جاندار)')], 'There is a big dog.', 'ایک بڑا کتا ہے۔'),
      ex('この本は面白いです。', 'このほんはおもしろいです。', [t('この', '', 'this (before a noun)', 'یہ (اسم سے پہلے)'), t('本', 'ほん', 'book', 'کتاب'), t('は', '', 'topic marker', 'موضوع کی علامت'), t('面白い', 'おもしろい', 'interesting', 'دلچسپ'), t('です', '', 'polite “is”', 'ہے (باادب)')], 'This book is interesting.', 'یہ کتاب دلچسپ ہے۔'),
      ex('日本語は難しくないです。', 'にほんごはむずかしくないです。', [t('日本語', 'にほんご', 'Japanese language', 'جاپانی زبان'), t('は', '', 'topic marker', 'موضوع کی علامت'), t('難しくない', 'むずかしくない', 'not difficult', 'مشکل نہیں'), t('です', '', 'polite “is”', 'ہے (باادب)')], 'Japanese is not difficult.', 'جاپانی مشکل نہیں ہے۔'),
    ],
    mistakes: [
      mk('大きいな犬', '大きい犬', 'Do not add な after an い-adjective. (な belongs to a different adjective group you will learn later.)', 'い صفت کے بعد な نہ لگائیں۔ (な صفات کے ایک اور گروہ کے لیے ہے جو آگے سیکھیں گے۔)'),
      mk('大きいではありません', '大きくないです', 'To negate an い-adjective, change い to くない. ではありません is for nouns.', 'い صفت کی نفی کے لیے い کو くない بنائیں۔ ではありません اسموں کے لیے ہے۔'),
    ],
    questions: [
      q('i-adjectives-1', 'fill', 'この本は面白＿＿です。', 'This book is interesting.', 'یہ کتاب دلچسپ ہے۔', ['い', 'くない', 'な', 'に'], 'い', 'The adjective is 面白い; です follows it directly.', 'صفت 面白い ہے؛ اس کے فوراً بعد です آتا ہے۔'),
      q('i-adjectives-2', 'translate', 'Japanese is not difficult.', '', 'جاپانی مشکل نہیں ہے۔', ['日本語は難しくないです。', '日本語は難しいではありません。', '日本語は難しなです。', '日本語は難しいくないです。'], '日本語は難しくないです。', 'Change 難しい to 難しくない, then add です.', '難しい کو 難しくない بنائیں، پھر です لگائیں۔'),
      q('i-adjectives-3', 'translate', 'a big dog', '', 'ایک بڑا کتا', ['大きい犬', '大きいな犬', '大きく犬', '大きだ犬'], '大きい犬', 'An い-adjective goes straight before the noun.', 'い صفت سیدھی اسم سے پہلے آتی ہے۔'),
      q('i-adjectives-4', 'fill', 'この犬は大きく＿＿です。', 'This dog is not big.', 'یہ کتا بڑا نہیں ہے۔', ['ない', 'あります', 'いません', 'ではありません'], 'ない', '大きくない is the negative; です follows.', '大きくない منفی شکل ہے؛ اس کے بعد です آتا ہے۔'),
      q('i-adjectives-5', 'fill', '猫は小さ＿＿です。', 'The cat is small.', 'بلی چھوٹی ہے۔', ['い', 'くない', 'な', 'に'], 'い', 'The adjective is 小さい.', 'صفت 小さい ہے۔'),
    ],
  },
];

export const GRAMMAR_BY_ID = new Map(GRAMMAR.map((l) => [l.id, l]));
export const GRAMMAR_Q_BY_ID = new Map(GRAMMAR.flatMap((l) => l.questions.map((x) => [x.id, { lesson: l, question: x }] as const)));
