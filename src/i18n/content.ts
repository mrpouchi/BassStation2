import { CHALLENGE_TYPES, CHALLENGES } from '@/data/challenges/challenges';
import { CURRICULUM } from '@/data/lessons/curriculum';
import { LESSONS } from '@/data/lessons';
import { EXAMPLE_PRESETS } from '@/data/presets/examples';
import { CONCEPTS } from '@/data/synthesizer/concepts';
import { CONTROLS } from '@/data/synthesizer/controls';
import { PARAMETERS } from '@/data/synthesizer/parameters';
import { SECTIONS } from '@/data/synthesizer/sections';
import type { Locale } from './locale';
import { applyText, extractText, type TextPatch } from './overlay';

export interface ContentSet {
  readonly name: string;
  /** Live content objects by id (mutated in place on locale change). */
  readonly items: () => ReadonlyMap<string, object>;
  readonly textKeys: ReadonlySet<string>;
}

const byId = <T extends { id: string }>(list: readonly T[]) =>
  new Map<string, object>(list.map((x) => [x.id, x]));

const keys = (...k: string[]) => new Set(k);

export const CONTENT_SETS: readonly ContentSet[] = [
  {
    name: 'lessons',
    items: () => LESSONS as ReadonlyMap<string, object>,
    textKeys: keys(
      'objective',
      'explanation',
      'caption',
      'steps',
      'prompt',
      'label',
      'feedback',
      'hint',
      'success',
    ),
  },
  { name: 'curriculum', items: () => byId(CURRICULUM), textKeys: keys('title') },
  {
    name: 'challenges',
    items: () => byId(CHALLENGES),
    textKeys: keys('title', 'brief', 'prompt', 'label', 'feedback', 'hint', 'takeaway'),
  },
  {
    name: 'challengeTypes',
    items: () => byId(CHALLENGE_TYPES),
    textKeys: keys('name', 'description'),
  },
  {
    name: 'parameters',
    items: () => byId(PARAMETERS),
    textKeys: keys(
      'name',
      'description',
      'label',
      'labels',
      'valueLabels',
      'explanation',
      'increase',
      'decrease',
      'experiment',
    ),
  },
  { name: 'controls', items: () => byId(CONTROLS), textKeys: keys('description') },
  {
    name: 'concepts',
    items: () => byId(CONCEPTS),
    textKeys: keys('term', 'definition'),
  },
  {
    name: 'sections',
    items: () => byId(SECTIONS),
    textKeys: keys('name', 'summary'),
  },
  {
    name: 'presets',
    items: () => byId(EXAMPLE_PRESETS),
    textKeys: keys('description'),
  },
];

/** English text of every item, captured before the first translation. */
const english = new Map<string, Map<string, TextPatch | undefined>>();

function englishOf(set: ContentSet): Map<string, TextPatch | undefined> {
  let m = english.get(set.name);
  if (!m) {
    m = new Map();
    for (const [id, item] of set.items()) m.set(id, extractText(item, set.textKeys));
    english.set(set.name, m);
  }
  return m;
}

type Overlays = Readonly<Record<string, Readonly<Record<string, TextPatch>>>>;

let french: Promise<Overlays> | null = null;

/** The French overlays live in their own chunk, so English users never download them. */
export function loadFrench(): Promise<Overlays> {
  french ??= import('./fr/content').then((m) => m.FR_CONTENT);
  return french;
}

/**
 * Rewrites all content strings in place for `locale` (English is restored
 * first). Resolves once the strings are in place.
 */
export async function applyContentLocale(locale: Locale): Promise<void> {
  const overlays = locale === 'fr' ? await loadFrench() : null;
  for (const set of CONTENT_SETS) {
    const en = englishOf(set);
    const fr = overlays?.[set.name];
    for (const [id, item] of set.items()) {
      applyText(item, en.get(id));
      if (fr) applyText(item, fr[id]);
    }
  }
}

/** English text patch of one content item (for tests). */
export function englishText(set: ContentSet, id: string): TextPatch | undefined {
  return englishOf(set).get(id);
}
