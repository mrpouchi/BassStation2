import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { NAV_ITEMS } from '@/app/navigation';
import { CHALLENGES } from '@/data/challenges/challenges';
import { LESSONS } from '@/data/lessons';
import { ON_KEY_LAYOUT } from '@/data/synthesizer/onKeyLayout';
import { VERIFICATION_LABELS } from '@/engine/midi/describe';
import { WEB_MIDI_SUPPORT_TEXT } from '@/engine/midi/support';
import { formatValue, getParameter } from '@/engine/parameters/registry';
import { CATEGORY_LABELS } from '@/engine/presets/presets';
import { describeCondition } from '@/engine/tasks/tasks';
import { CONTENT_SETS, englishText } from './content';
import { FR_CONTENT } from './fr/content';
import { FR_UI } from './fr/ui';
import { detectLocale, useLocaleStore } from './locale';
import { applyText, extractText, missingPaths, strayPaths } from './overlay';
import { t, tn } from './t';

describe('text overlays', () => {
  it('extracts and applies only text keys, leaving ids and values alone', () => {
    const item = { id: 'x', title: 'Hello', values: { a: 'sine' }, steps: ['One', 'Two'] };
    const keys = new Set(['title', 'steps']);
    expect(extractText(item, keys)).toEqual({ title: 'Hello', steps: ['One', 'Two'] });
    applyText(item, { title: 'Bonjour', steps: ['Un', ''], values: { a: 'sinus' } } as never);
    expect(item).toEqual({
      id: 'x',
      title: 'Bonjour',
      values: { a: 'sinus' },
      steps: ['Un', 'Two'],
    });
  });

  it('reports stray and missing translations', () => {
    expect(strayPaths({ a: 'x' }, { a: 'y', b: 'z' })).toEqual(['b']);
    expect(missingPaths({ a: 'x', b: ['y', 'z'] }, { a: 'X', b: ['Y'] })).toEqual(['b.1']);
  });
});

describe('French content', () => {
  for (const set of CONTENT_SETS) {
    it(`${set.name}: every English string is translated, and nothing else`, () => {
      const stray: string[] = [];
      const missing: string[] = [];
      for (const [id, item] of set.items()) {
        stray.push(...strayPaths(item, FR_CONTENT[set.name]?.[id]).map((p) => `${id}: ${p}`));
        missing.push(
          ...missingPaths(englishText(set, id), FR_CONTENT[set.name]?.[id]).map(
            (p) => `${id}: ${p}`,
          ),
        );
      }
      for (const id of Object.keys(FR_CONTENT[set.name] ?? {}))
        if (!set.items().has(id)) stray.push(`unknown id ${id}`);
      expect(stray).toEqual([]);
      expect(missing).toEqual([]);
    });
  }

  it('switches content to French and restores English exactly', async () => {
    const lesson = LESSONS.get('sound-fundamentals/frequency')!;
    const english = lesson.objective;
    const resonance = getParameter('filter.resonance');
    await useLocaleStore.getState().setLocale('fr');
    expect(lesson.objective).not.toBe(english);
    expect(resonance.name).toBe('Résonance');
    expect(CHALLENGES[0]!.title).toBe('Le potentiomètre de la brillance');
    // Ids and values are never translated.
    expect(lesson.id).toBe('frequency');
    expect(resonance.id).toBe('filter.resonance');
    await useLocaleStore.getState().setLocale('en');
    expect(lesson.objective).toBe(english);
    expect(resonance.name).toBe('Resonance');
  });

  it('formats engine text in the active language', async () => {
    await useLocaleStore.getState().setLocale('fr');
    expect(formatValue(getParameter('arp.on'), true)).toBe('On');
    expect(
      describeCondition({ param: 'filter.resonance', op: 'between', min: 10, max: 20, hint: '' }),
    ).toBe('Résonance entre 10 et 20');
    expect(tn(2, '{count} attempt', '{count} attempts')).toBe('2 essais');
  });
});

/** Literal keys passed to t() / tn() anywhere in the source. */
function sourceKeys(): string[] {
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) && !p.includes('i18n'))
        files.push(p);
    }
  };
  walk(join(__dirname, '..'));
  const keys = new Set<string>();
  const str = String.raw`'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"`;
  const call = new RegExp(String.raw`\bt\(\s*(?:${str})`, 'g');
  const plural = new RegExp(String.raw`\btn\(\s*[^,]+,\s*(?:${str})\s*,\s*(?:${str})`, 'g');
  for (const f of files) {
    const src = readFileSync(f, 'utf8');
    for (const m of src.matchAll(call)) keys.add((m[1] ?? m[2] ?? '').replace(/\\(.)/g, '$1'));
    for (const m of src.matchAll(plural)) {
      keys.add((m[1] ?? m[2] ?? '').replace(/\\(.)/g, '$1'));
      keys.add((m[3] ?? m[4] ?? '').replace(/\\(.)/g, '$1'));
    }
  }
  return [...keys];
}

describe('French interface strings', () => {
  it('translate every literal t() key used in the code', () => {
    const keys = sourceKeys();
    expect(keys.length).toBeGreaterThan(300);
    expect(keys.filter((k) => !(k in FR_UI))).toEqual([]);
  });

  it('translate labels that are passed to t() through tables', () => {
    const labels = [
      ...NAV_ITEMS.map((n) => n.label),
      ...Object.values(VERIFICATION_LABELS),
      ...Object.values(CATEGORY_LABELS),
      ...Object.values(WEB_MIDI_SUPPORT_TEXT).flatMap((x) => [x.label, x.detail]),
      ...ON_KEY_LAYOUT.map((k) => k.group),
    ];
    expect(labels.filter((l) => !(l in FR_UI))).toEqual([]);
  });

  it('keep the same {placeholders} as the English key', () => {
    const vars = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
    const bad = Object.entries(FR_UI).filter(([en, fr]) => vars(en).join() !== vars(fr).join());
    expect(bad).toEqual([]);
  });

  it('fall back to English for unknown keys and fill placeholders', async () => {
    await useLocaleStore.getState().setLocale('fr');
    expect(t('Not a real key {x}', { x: 1 })).toBe('Not a real key 1');
    expect(t('Saved “{name}”.', { name: 'Acid' })).toBe('« Acid » enregistré.');
  });
});

describe('switching order', () => {
  it('lets the latest request win when switches overlap', async () => {
    const store = useLocaleStore.getState();
    // Browser says French, then the saved preference says English.
    const first = store.setLocale('fr');
    const second = store.setLocale('en');
    await Promise.all([first, second]);
    expect(useLocaleStore.getState().locale).toBe('en');
    expect(LESSONS.get('sound-fundamentals/frequency')!.objective).toMatch(/^Explain frequency/);
  });
});

describe('locale detection', () => {
  it('picks French for French browsers and English otherwise', () => {
    expect(detectLocale(['fr-FR', 'en'])).toBe('fr');
    expect(detectLocale(['fr'])).toBe('fr');
    expect(detectLocale(['en-GB'])).toBe('en');
    expect(detectLocale(['de-DE', 'fr'])).toBe('en');
    expect(detectLocale(undefined)).toBe('en');
  });
});
