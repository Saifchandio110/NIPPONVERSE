import type { Bilingual } from '../../types';

/**
 * Every picture used in the app is listed here with its provenance.
 * Files live in public/images/vocab/. Add new pictures here BEFORE referencing them from word data.
 * These 14 are original drawings made for NipponVerse (no third-party material).
 */
export interface ImageInfo {
  file: string;
  alt: Bilingual;
  source: string;
  author: string;
  license: string;
}

const ORIGINAL = {
  source: 'Original illustration created for NipponVerse',
  author: 'NipponVerse project',
  license: 'Project-owned artwork; licence to be chosen by the project owner before public release',
};

const img = (file: string, en: string, ur: string): ImageInfo => ({ file, alt: { en, ur }, ...ORIGINAL });

export const IMAGES: Record<string, ImageInfo> = {
  gohan: img('gohan.svg', 'A bowl of cooked white rice with chopsticks', 'چاپ اسٹکس کے ساتھ پکے ہوئے سفید چاولوں کا پیالہ'),
  mizu: img('mizu.svg', 'A glass of water', 'پانی کا گلاس'),
  neko: img('neko.svg', 'The face of a cat', 'بلی کا چہرہ'),
  inu: img('inu.svg', 'The face of a dog with floppy ears', 'لٹکے ہوئے کانوں والے کتے کا چہرہ'),
  hon: img('hon.svg', 'A closed book', 'ایک بند کتاب'),
  kuruma: img('kuruma.svg', 'A red car seen from the side', 'سرخ گاڑی، پہلو سے'),
  gakkou: img('gakkou.svg', 'A school building with a clock tower', 'گھڑی والے مینار کے ساتھ اسکول کی عمارت'),
  ringo: img('ringo.svg', 'A red apple with a leaf', 'پتے والا سرخ سیب'),
  sakana: img('sakana.svg', 'A fish', 'ایک مچھلی'),
  yama: img('yama.svg', 'Mountains with a snow-capped peak', 'برف سے ڈھکی چوٹی والے پہاڑ'),
  hana: img('hana.svg', 'A pink flower on a stem', 'ڈنڈی پر ایک گلابی پھول'),
  ie: img('ie.svg', 'A house with a red roof', 'سرخ چھت والا گھر'),
  ki: img('ki.svg', 'A tree', 'ایک درخت'),
  ame: img('ame.svg', 'A rain cloud with falling raindrops', 'برستی بوندوں والا بارش کا بادل'),
};
