import { useMemo } from 'react';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { CURRICULUM } from '@/data/lessons/curriculum';
import { detectWebMidiSupport, WEB_MIDI_SUPPORT_TEXT } from '@/engine/midi/support';
import { computeRegistryStats } from '@/engine/parameters/stats';
import { usePersistenceStore } from '@/stores/persistenceStore';
import styles from './DashboardPage.module.css';

const ROADMAP: { label: string; status: 'done' | 'next' | 'planned' }[] = [
  { label: 'Foundations and parameter registry', status: 'done' },
  { label: 'Synth Lab: Hardware View, Learning View and visualizers', status: 'next' },
  { label: 'Learn: interactive lessons and progress', status: 'planned' },
  { label: 'Challenges', status: 'planned' },
  { label: 'MIDI connection to a Bass Station II', status: 'planned' },
  { label: 'Sound Library: presets, import and export', status: 'planned' },
];

export function DashboardPage() {
  const stats = useMemo(computeRegistryStats, []);
  const midi = useMemo(() => detectWebMidiSupport(), []);
  const persistence = usePersistenceStore();
  const lessonCount = CURRICULUM.reduce((n, c) => n + c.lessons.length, 0);
  const available = CURRICULUM.flatMap((c) => c.lessons).filter(
    (l) => l.status === 'available',
  ).length;

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title="Welcome to Bass Station Academy"
        description="Learn subtractive synthesis by exploring the Novation Bass Station II: first in the browser, then on the real instrument."
      />
      <div className={styles.grid}>
        <Card
          className={styles.wide}
          title="Explore the instrument"
          subtitle="The complete parameter reference is ready in Synth Lab."
          actions={
            <ButtonLink to="/synth-lab" variant="primary" size="sm">
              Open Synth Lab
            </ButtonLink>
          }
        >
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={`${styles.statValue} mono`}>{stats.parameters}</span>
              <span className={styles.statLabel}>parameters documented</span>
            </div>
            <div className={styles.stat}>
              <span className={`${styles.statValue} mono`}>{stats.controls}</span>
              <span className={styles.statLabel}>physical controls</span>
            </div>
            <div className={styles.stat}>
              <span className={`${styles.statValue} mono`}>{stats.onKey}</span>
              <span className={styles.statLabel}>On-Key functions</span>
            </div>
          </div>
        </Card>

        <Card className={styles.narrow} title="Hardware">
          <div>
            <Badge tone={midi === 'available' ? 'neutral' : 'warning'} dot>
              {WEB_MIDI_SUPPORT_TEXT[midi].label}
            </Badge>
          </div>
          <p className={styles.muted}>{WEB_MIDI_SUPPORT_TEXT[midi].detail}</p>
          <p className={styles.muted}>
            MIDI mappings: <span className="mono">{stats.midiDocumented}</span> documented by
            Novation, <span className="mono">{stats.midiVerified}</span> verified on hardware so
            far.
          </p>
        </Card>

        <Card className={styles.half} title="Learning progress">
          <p className={styles.muted}>
            The curriculum covers {CURRICULUM.length} chapters and {lessonCount} lessons.{' '}
            {available === 0
              ? 'No lessons are available yet. They are written in the Learn milestone, so no progress is tracked yet.'
              : `${available} lessons are available.`}
          </p>
          <div className={styles.actions}>
            <ButtonLink to="/learn" size="sm">
              See the curriculum
            </ButtonLink>
          </div>
        </Card>

        <Card className={styles.half} title="Build status">
          <ul className={styles.roadmap}>
            {ROADMAP.map((r) => (
              <li key={r.label}>
                <span>{r.label}</span>
                <Badge
                  tone={
                    r.status === 'done' ? 'success' : r.status === 'next' ? 'accent' : 'neutral'
                  }
                >
                  {r.status === 'done' ? 'Done' : r.status === 'next' ? 'Next' : 'Planned'}
                </Badge>
              </li>
            ))}
          </ul>
          <p className={styles.muted}>
            Local storage:{' '}
            {persistence.status === 'ready'
              ? 'your settings are saved on this device.'
              : persistence.status === 'loading'
                ? 'loading…'
                : `unavailable (${persistence.error ?? 'unknown error'}). Changes will not be kept.`}
          </p>
        </Card>
      </div>
    </>
  );
}
