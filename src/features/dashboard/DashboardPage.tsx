import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { CHALLENGES, findChallenge } from '@/data/challenges/challenges';
import { LESSON_ORDER, nextLessonKey } from '@/data/lessons';
import { CATEGORY_LABELS } from '@/engine/presets/presets';
import { computeRegistryStats } from '@/engine/parameters/stats';
import { usePersistenceStore } from '@/stores/persistenceStore';
import { usePresetStore } from '@/stores/presetStore';
import { useProgressStore } from '@/stores/progressStore';
import { selectInputConnected, selectOutputConnected, useMidiStore } from '@/stores/midiStore';
import styles from './DashboardPage.module.css';

function relative(at: number): string {
  const s = Math.round((Date.now() - at) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  return new Date(at).toLocaleDateString();
}

export function DashboardPage() {
  const stats = useMemo(computeRegistryStats, []);
  const progress = useProgressStore();
  const presets = usePresetStore((s) => s.presets);
  const persistence = usePersistenceStore();
  const midi = useMidiStore();
  const connected = selectInputConnected(midi) || selectOutputConnected(midi);

  const total = LESSON_ORDER.length;
  const done = LESSON_ORDER.filter((l) => progress.lessons[l.key]).length;
  const nextKey = nextLessonKey(progress.lessons);
  const next = LESSON_ORDER.find((l) => l.key === nextKey);
  const current = LESSON_ORDER.find((l) => l.key === progress.lastLesson) ?? next;
  const chapter = current?.chapter;
  const chapterDone = chapter
    ? chapter.lessons.filter((l) => progress.lessons[`${chapter.id}/${l.id}`]).length
    : 0;
  const solved = CHALLENGES.filter((c) => progress.challenges[c.id]?.solvedAt).length;
  const nextChallenge = CHALLENGES.find((c) => !progress.challenges[c.id]?.solvedAt);
  const recentPresets = [...presets].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 4);

  // Recommendation: continue lessons; after 3 completed lessons in a chapter, suggest a related challenge.
  const recommendation = (() => {
    if (next && done === 0)
      return {
        title: `Start with ${next.outline.title}`,
        detail: 'Lesson 1.1: what frequency is and how pitch works.',
        to: `/learn/${next.key}`,
      };
    if (nextChallenge && done >= 3 && solved < Math.floor(done / 3))
      return {
        title: `Try the challenge “${nextChallenge.title}”`,
        detail: 'Practice what you have learned so far.',
        to: `/challenges/${nextChallenge.id}`,
      };
    if (next)
      return {
        title: `Continue: ${next.outline.title}`,
        detail: `Chapter ${next.chapter.number} · ${next.chapter.title}`,
        to: `/learn/${next.key}`,
      };
    if (nextChallenge)
      return {
        title: `Challenge: ${nextChallenge.title}`,
        detail: 'All lessons done. Keep practising.',
        to: `/challenges/${nextChallenge.id}`,
      };
    return {
      title: 'Design something new',
      detail: 'Every lesson and challenge is complete.',
      to: '/synth-lab',
    };
  })();

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title="Welcome to Bass Station Academy"
        description="Learn subtractive synthesis by exploring the Novation Bass Station II: in the browser first, then on the real instrument."
      />
      <div className={styles.grid}>
        <Card
          className={styles.wide}
          title="Recommended next"
          actions={
            <ButtonLink to={recommendation.to} variant="primary" size="sm">
              Go
            </ButtonLink>
          }
        >
          <div>
            <p className={styles.recoTitle}>{recommendation.title}</p>
            <p className={styles.muted}>{recommendation.detail}</p>
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={`${styles.statValue} mono`}>
                {done}/{total}
              </span>
              <span className={styles.statLabel}>lessons completed</span>
            </div>
            <div className={styles.stat}>
              <span className={`${styles.statValue} mono`}>
                {solved}/{CHALLENGES.length}
              </span>
              <span className={styles.statLabel}>challenges solved</span>
            </div>
            <div className={styles.stat}>
              <span className={`${styles.statValue} mono`}>{presets.length}</span>
              <span className={styles.statLabel}>saved presets</span>
            </div>
          </div>
          <div
            className={styles.progress}
            aria-label={`Overall progress ${Math.round((done / total) * 100)}%`}
          >
            <div className={styles.progressBar} style={{ width: `${(done / total) * 100}%` }} />
          </div>
        </Card>

        <Card
          className={styles.narrow}
          title="Hardware"
          actions={
            <Link to="/hardware" className={styles.link}>
              Manage
            </Link>
          }
        >
          <div>
            <Badge
              tone={
                connected
                  ? 'success'
                  : midi.status === 'unsupported' || midi.status === 'insecure'
                    ? 'warning'
                    : 'neutral'
              }
              dot
            >
              {connected
                ? 'Bass Station II connected'
                : midi.status === 'unsupported'
                  ? 'Web MIDI unsupported'
                  : midi.status === 'insecure'
                    ? 'MIDI needs HTTPS'
                    : midi.status === 'ready'
                      ? 'No device connected'
                      : 'Not connected'}
            </Badge>
          </div>
          <p className={styles.muted}>
            {connected
              ? `Receiving ${midi.receive ? 'on' : 'off'} · sending ${midi.send ? 'on' : 'off'}.`
              : 'Everything works without hardware. Connect a Bass Station II by USB to sync it with the virtual panel.'}
          </p>
          <p className={styles.muted}>
            {stats.midiDocumented} documented MIDI mappings, {Object.keys(midi.verification).length}{' '}
            tested on your device.
          </p>
        </Card>

        <Card
          className={styles.half}
          title="Current chapter"
          actions={
            chapter ? (
              <Link to="/learn" className={styles.link}>
                Curriculum
              </Link>
            ) : undefined
          }
        >
          {chapter ? (
            <>
              <p className={styles.recoTitle}>
                {chapter.number}. {chapter.title}
              </p>
              <p className={styles.muted}>
                {chapterDone} of {chapter.lessons.length} lessons completed
              </p>
              <ul className={styles.list}>
                {chapter.lessons.map((l) => {
                  const key = `${chapter.id}/${l.id}`;
                  return (
                    <li key={l.id}>
                      <Link to={`/learn/${key}`} className={styles.link}>
                        {l.title}
                      </Link>
                      {progress.lessons[key] ? (
                        <Badge tone="success">Done</Badge>
                      ) : key === progress.lastLesson ? (
                        <Badge tone="accent">Last opened</Badge>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <p className={styles.muted}>Every chapter is complete.</p>
          )}
        </Card>

        <Card className={styles.half} title="Recent exercises">
          {progress.activity.length === 0 ? (
            <p className={styles.muted}>
              Lesson exercises and challenges you check will appear here.
            </p>
          ) : (
            <ul className={styles.list}>
              {progress.activity.slice(0, 6).map((a, i) => {
                const lesson =
                  a.kind === 'lesson' ? LESSON_ORDER.find((l) => l.key === a.key) : undefined;
                const challenge = a.kind === 'challenge' ? findChallenge(a.key) : undefined;
                const title = lesson?.outline.title ?? challenge?.title ?? a.key;
                const to = a.kind === 'lesson' ? `/learn/${a.key}` : `/challenges/${a.key}`;
                return (
                  <li key={`${a.key}-${a.at}-${i}`}>
                    <Link to={to} className={styles.link}>
                      {a.kind === 'lesson' ? 'Lesson' : 'Challenge'}: {title}
                    </Link>
                    <span className={styles.muted}>
                      <Badge tone={a.passed ? 'success' : 'warning'}>
                        {a.passed ? 'Passed' : 'Retry'}
                      </Badge>{' '}
                      {relative(a.at)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card
          className={styles.half}
          title="Recently saved presets"
          actions={
            <Link to="/library" className={styles.link}>
              Library
            </Link>
          }
        >
          {recentPresets.length === 0 ? (
            <p className={styles.muted}>
              No presets yet. Design a sound in Synth Lab and save it in the Sound Library.
            </p>
          ) : (
            <ul className={styles.list}>
              {recentPresets.map((p) => (
                <li key={p.id}>
                  <span>{p.name}</span>
                  <span className={styles.muted}>
                    <Badge>{CATEGORY_LABELS[p.category]}</Badge> {relative(p.updatedAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className={styles.half} title="The instrument in the Academy">
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={`${styles.statValue} mono`}>{stats.parameters}</span>
              <span className={styles.statLabel}>parameters</span>
            </div>
            <div className={styles.stat}>
              <span className={`${styles.statValue} mono`}>{stats.controls}</span>
              <span className={styles.statLabel}>panel controls</span>
            </div>
            <div className={styles.stat}>
              <span className={`${styles.statValue} mono`}>{stats.onKey}</span>
              <span className={styles.statLabel}>On-Key functions</span>
            </div>
          </div>
          <p className={styles.muted}>
            Local storage:{' '}
            {persistence.status === 'ready'
              ? 'progress, presets and settings are saved on this device.'
              : persistence.status === 'loading'
                ? 'loading…'
                : `unavailable (${persistence.error ?? 'unknown error'}). Changes will not be kept.`}
          </p>
        </Card>
      </div>
    </>
  );
}
