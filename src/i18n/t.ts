import { currentLocale } from './locale';
import { FR_UI } from './fr/ui';

export type Vars = Readonly<Record<string, string | number>>;

const fill = (s: string, vars?: Vars) =>
  vars ? s.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m)) : s;

/**
 * Translates an interface string. The English text is the key, so code stays
 * readable and a missing translation falls back to English. Placeholders use
 * {name}.
 */
export function t(english: string, vars?: Vars): string {
  const locale = currentLocale();
  const s = locale === 'fr' ? (FR_UI[english] ?? english) : english;
  return fill(s, vars);
}

/** Pick between singular and plural English keys by count, then translate. */
export function tn(count: number, one: string, other: string, vars?: Vars): string {
  return t(count === 1 ? one : other, { count, ...vars });
}
