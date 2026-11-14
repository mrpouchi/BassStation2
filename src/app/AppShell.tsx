import { NavLink, Outlet, Link } from 'react-router-dom';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { MidiSupportIndicator } from '@/features/midi/MidiSupportIndicator';
import { useApplyTheme } from '@/hooks/useApplyTheme';
import { useLocaleStore, type Locale } from '@/i18n/locale';
import { t } from '@/i18n/t';
import { usePreferencesStore, type ThemePreference } from '@/stores/preferencesStore';
import styles from './AppShell.module.css';
import { BrandMark } from './icons';
import { NAV_ITEMS } from './navigation';

const LANGUAGE_OPTIONS: { value: Locale; label: string; title: string }[] = [
  { value: 'en', label: 'English', title: 'English' },
  { value: 'fr', label: 'Français', title: 'Français' },
];

export function AppShell() {
  useApplyTheme();
  const theme = usePreferencesStore((s) => s.theme);
  const setTheme = usePreferencesStore((s) => s.setTheme);
  // Re-render everything (including engine-generated text) when the language changes.
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const themeOptions: { value: ThemePreference; label: string }[] = [
    { value: 'system', label: t('Auto') },
    { value: 'light', label: t('Light') },
    { value: 'dark', label: t('Dark') },
  ];

  return (
    <div className={styles.shell} key={locale}>
      <aside className={styles.sidebar}>
        <Link to="/" className={styles.brand} aria-label={t('Bass Station Academy home')}>
          <BrandMark className={styles.brandMark} />
          <span>
            <span className={styles.brandName}>Bass Station Academy</span>
            <br />
            <span className={styles.brandSub}>{t('for Bass Station II')}</span>
          </span>
        </Link>
        <nav className={styles.nav} aria-label={t('Main')}>
          {NAV_ITEMS.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                [styles.link, isActive && styles.active].filter(Boolean).join(' ')
              }
            >
              <Icon className={styles.icon} />
              {t(label)}
            </NavLink>
          ))}
        </nav>
        <div className={styles.footer}>
          <span className={styles.footerLabel}>{t('Hardware')}</span>
          <MidiSupportIndicator />
          <span className={styles.footerLabel}>{t('Theme')}</span>
          <SegmentedControl
            label={t('Theme')}
            options={themeOptions}
            value={theme}
            onChange={setTheme}
          />
          <span className={styles.footerLabel} lang="en">
            Language · Langue
          </span>
          <SegmentedControl
            label="Language / Langue"
            options={LANGUAGE_OPTIONS}
            value={locale}
            onChange={setLocale}
          />
        </div>
      </aside>
      <main className={styles.main}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
