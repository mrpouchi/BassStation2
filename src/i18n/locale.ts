import { create } from 'zustand';

export type Locale = 'en' | 'fr';
export const LOCALES: readonly Locale[] = ['en', 'fr'];

export function isLocale(v: unknown): v is Locale {
  return typeof v === 'string' && (LOCALES as readonly string[]).includes(v);
}

/** French when the browser prefers it, English otherwise. */
export function detectLocale(languages: readonly string[] | undefined): Locale {
  const first = languages?.[0]?.toLowerCase() ?? 'en';
  return first.startsWith('fr') ? 'fr' : 'en';
}

type Listener = (locale: Locale) => void | Promise<void>;
const listeners: Listener[] = [];
let target: Locale = 'en';
let applied: Locale = 'en';
let queue: Promise<void> = Promise.resolve();

/**
 * Runs before every locale change is published (the content overlay registers
 * here; keeping it out of this module avoids import cycles with the data).
 */
export function onBeforeLocaleChange(fn: Listener): void {
  listeners.push(fn);
}

interface LocaleState {
  locale: Locale;
  /** Resolves once the new language is fully applied (content may load lazily). */
  setLocale: (locale: Locale) => Promise<void>;
}

/**
 * The interface language. Changing it rewrites the content strings in place
 * (lessons, parameters…) and the app shell remounts the pages, so every
 * component and engine message is rendered again in the new language.
 */
export const useLocaleStore = create<LocaleState>()((set, get) => ({
  locale: 'en',
  setLocale: (locale) => {
    target = locale;
    // Switches run one after another; a newer request supersedes queued ones.
    const run = queue.then(async () => {
      if (target !== locale || (locale === get().locale && applied === locale)) return;
      await Promise.all(listeners.map((fn) => fn(locale)));
      applied = locale;
      if (typeof document !== 'undefined') document.documentElement.lang = locale;
      set({ locale });
    });
    queue = run.catch(() => undefined);
    return run;
  },
}));

export const currentLocale = (): Locale => useLocaleStore.getState().locale;
