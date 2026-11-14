import { create } from 'zustand';

export type ThemePreference = 'system' | 'light' | 'dark';

interface PreferencesState {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
}

export const THEMES: readonly ThemePreference[] = ['system', 'light', 'dark'];

export function isThemePreference(v: unknown): v is ThemePreference {
  return typeof v === 'string' && (THEMES as readonly string[]).includes(v);
}

export const usePreferencesStore = create<PreferencesState>()((set) => ({
  theme: 'system',
  setTheme: (theme) => set({ theme }),
}));
