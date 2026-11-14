/**
 * Text overlays: a translation is a partial copy of a content object that
 * contains only its translatable strings, in the same shape (objects by key,
 * arrays by index). Applying one replaces string leaves, never ids, values or
 * structure.
 */
export type TextPatch = string | readonly TextPatch[] | { readonly [key: string]: TextPatch };

type Mutable = Record<string, unknown> | unknown[];

const isObj = (v: unknown): v is Mutable => typeof v === 'object' && v !== null;

/** Collects every string at or below a key in `textKeys` as a patch. */
export function extractText(
  value: unknown,
  textKeys: ReadonlySet<string>,
  underText = false,
): TextPatch | undefined {
  if (typeof value === 'string') return underText ? value : undefined;
  if (Array.isArray(value)) {
    const out = value.map((v) => extractText(v, textKeys, underText));
    return out.some((v) => v !== undefined) ? (out.map((v) => v ?? '') as TextPatch[]) : undefined;
  }
  if (isObj(value)) {
    const out: Record<string, TextPatch> = {};
    for (const [k, v] of Object.entries(value)) {
      const p = extractText(v, textKeys, underText || textKeys.has(k));
      if (p !== undefined) out[k] = p;
    }
    return Object.keys(out).length > 0 ? out : undefined;
  }
  return undefined;
}

/** Writes the patch's strings into `target` in place, where `target` has a string too. */
export function applyText(target: unknown, patch: TextPatch | undefined): void {
  if (patch === undefined || typeof patch === 'string' || !isObj(target)) return;
  const t = target as Record<string, unknown>;
  for (const [k, p] of Object.entries(patch as Record<string, TextPatch>)) {
    if (typeof p === 'string') {
      if (typeof t[k] === 'string' && p !== '') t[k] = p;
    } else applyText(t[k], p);
  }
}

/**
 * Problems in a patch relative to its base: strings the base does not have
 * (stale or misplaced keys). Used by tests.
 */
export function strayPaths(base: unknown, patch: TextPatch | undefined, path = ''): string[] {
  if (patch === undefined) return [];
  if (typeof patch === 'string') return typeof base === 'string' ? [] : [path];
  if (!isObj(base)) return [path];
  return Object.entries(patch as Record<string, TextPatch>).flatMap(([k, p]) =>
    strayPaths((base as Record<string, unknown>)[k], p, path ? `${path}.${k}` : k),
  );
}

/** Strings in `english` that `patch` leaves untranslated. Used by tests. */
export function missingPaths(
  english: TextPatch | undefined,
  patch: TextPatch | undefined,
  path = '',
): string[] {
  if (english === undefined) return [];
  if (typeof english === 'string')
    return english !== '' && (typeof patch !== 'string' || patch === '') ? [path] : [];
  const p = typeof patch === 'object' ? (patch as Record<string, TextPatch>) : undefined;
  return Object.entries(english as Record<string, TextPatch>).flatMap(([k, e]) =>
    missingPaths(e, p?.[k], path ? `${path}.${k}` : k),
  );
}
