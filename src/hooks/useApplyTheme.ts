import { useEffect } from 'react';
import { usePreferencesStore } from '@/stores/preferencesStore';

/** Mirrors the theme preference onto <html data-theme>. "system" removes the attribute. */
export function useApplyTheme(): void {
  const theme = usePreferencesStore((s) => s.theme);
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', theme);
  }, [theme]);
}
