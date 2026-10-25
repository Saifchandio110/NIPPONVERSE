import { ALTS, GROUPS, type KanaGroupDef } from '../data/kana/tables';
import { HIRA_EXAMPLES, KATA_EXAMPLES, type KanaExample } from '../data/kana/examples';
import type { KanaKind, Script } from '../types';

const HIRA_FIRST = 0x3041;
const HIRA_LAST = 0x3096;
const KATA_FIRST = 0x30a1;
const KATA_LAST = 0x30f6;
const OFFSET = 0x60;

const mapChars = (s: string, fn: (code: number) => number | null) =>
  [...s].map((c) => {
    const n = fn(c.codePointAt(0)!);
    return n === null ? c : String.fromCodePoint(n);
  }).join('');

export const toKatakana = (s: string) => mapChars(s, (n) => (n >= HIRA_FIRST && n <= HIRA_LAST ? n + OFFSET : null));
export const toHiragana = (s: string) => mapChars(s, (n) => (n >= KATA_FIRST && n <= KATA_LAST ? n - OFFSET : null));

export interface KanaItem {
  id: string; // e.g. hira:か
  script: Script;
  char: string;
  romaji: string;
  alts: string[];
  groupId: string;
  kind: KanaKind;
}

export const itemId = (script: Script, char: string) => `${script}:${char}`;
export const lessonId = (script: Script, groupId: string) => `${script}-${groupId}`;

const ROMAJI = new Map<string, string>(GROUPS.flatMap((g) => g.entries));
const SMALL = 'ゃゅょぁぃぅぇぉ';

/** Converts kana text to Hepburn romaji. Handles small っ, ー and combination kana. Other characters pass through. */
export function toRomaji(text: string): string {
  const chars = [...toHiragana(text)];
  let out = '';
  let doubling = false;
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    if (c === 'っ') {
      doubling = true;
      continue;
    }
    if (c === 'ー') {
      const m = out.match(/[aeiou]$/);
      if (m) out += m[0];
      continue;
    }
    const next = chars[i + 1];
    let syl = next && SMALL.includes(next) ? ROMAJI.get(c + next) : undefined;
    if (syl !== undefined) i++;
    else syl = ROMAJI.get(c);
    if (syl === undefined) {
      out += c;
      doubling = false;
      continue;
    }
    if (doubling) {
      syl = syl.startsWith('ch') ? `t${syl}` : syl[0] + syl;
      doubling = false;
    }
    out += syl;
  }
  return out;
}

export const getGroups = (script: Script): KanaGroupDef[] => GROUPS.filter((g) => g.scripts.includes(script));

export function getItems(script: Script): KanaItem[] {
  return getGroups(script).flatMap((g) =>
    g.entries.map(([hira, romaji]) => ({
      id: itemId(script, script === 'hira' ? hira : toKatakana(hira)),
      script,
      char: script === 'hira' ? hira : toKatakana(hira),
      romaji,
      alts: ALTS[hira] ?? [],
      groupId: g.id,
      kind: g.kind,
    })),
  );
}

export function groupLabel(g: KanaGroupDef, script: Script): string {
  const conv = (s: string) => (script === 'kata' ? toKatakana(s) : s);
  const firsts = g.entries.map(([k]) => conv(k));
  if (g.id === 'basic-nn') return firsts[0];
  if (g.kind === 'yoon' || g.kind === 'extra') return firsts.join('・');
  return `${firsts[0]}行`;
}

export function getExample(item: KanaItem): KanaExample | undefined {
  return (item.script === 'hira' ? HIRA_EXAMPLES : KATA_EXAMPLES)[item.char];
}

export function exampleRomaji(ex: KanaExample): string {
  return ex.romaji ?? toRomaji(ex.word);
}
