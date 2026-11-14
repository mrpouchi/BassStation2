import { NavLink, Outlet, Link } from 'react-router-dom';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { MidiSupportIndicator } from '@/features/midi/MidiSupportIndicator';
import { useApplyTheme } from '@/hooks/useApplyTheme';
import { usePreferencesStore, type ThemePreference } from '@/stores/preferencesStore';
import styles from './AppShell.module.css';
import { BrandMark } from './icons';
import { NAV_ITEMS } from './navigation';

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'Auto' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export function AppShell() {
  useApplyTheme();
  const theme = usePreferencesStore((s) => s.theme);
  const setTheme = usePreferencesStore((s) => s.setTheme);

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link to="/" className={styles.brand} aria-label="Bass Station Academy home">
          <BrandMark className={styles.brandMark} />
          <span>
            <span className={styles.brandName}>Bass Station Academy</span>
            <br />
            <span className={styles.brandSub}>for Bass Station II</span>
          </span>
        </Link>
        <nav className={styles.nav} aria-label="Main">
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
              {label}
            </NavLink>
          ))}
        </nav>
        <div className={styles.footer}>
          <span className={styles.footerLabel}>Hardware</span>
          <MidiSupportIndicator />
          <span className={styles.footerLabel}>Theme</span>
          <SegmentedControl
            label="Theme"
            options={THEME_OPTIONS}
            value={theme}
            onChange={setTheme}
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
