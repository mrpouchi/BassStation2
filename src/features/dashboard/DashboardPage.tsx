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
import { t } from '@/i18n/t';

function relative(at: number): string {
  const s = Math.round((Date.now() - at) / 1000);
  if (s < 60) return t('just now');
  if (s < 3600) return t('{n} min ago', { n: Math.round(s / 60) });
  if (s < 86400) return t('{n} h ago', { n: Math.round(s / 3600) });
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
        title: t('Start with {title}', { title: next.outline.title }),
        detail: t('Lesson 1.1: what frequency is and how pitch works.'),
        to: `/learn/${next.key}`,
      };
    if (nextChallenge && done >= 3 && solved < Math.floor(done / 3))
      return {
        title: t('Try the challenge “{title}”', { title: nextChallenge.title }),
        detail: t('Practice what you have learned so far.'),
        to: `/challenges/${nextChallenge.id}`,
      };
    if (next)
      return {
        title: t('Continue: {title}', { title: next.outline.title }),
        detail: t('Chapter {n} · {title}', { n: next.chapter.number, title: next.chapter.title }),
        to: `/learn/${next.key}`,
      };
    if (nextChallenge)
      return {
        title: t('Challenge: {title}', { title: nextChallenge.title }),
        detail: t('All lessons done. Keep practising.'),
        to: `/challenges/${nextChallenge.id}`,
      };
    return {
      title: t('Design something new'),
      detail: t('Every lesson and challenge is complete.'),
      to: '/synth-lab',
    };
  })();

  return (
    <>
      <PageHeader
        eyebrow={t('Dashboard')}
        title={t('Welcome to Bass Station Academy')}
        description={t(
          'Learn subtractive synthesis by exploring the Novation Bass Station II: in the browser first, then on the real instrument.',
        )}
      />
      <div className={styles.grid}>
        <Card
          className={styles.wide}
          title={t('Recommended next')}
          actions={
            <ButtonLink to={recommendation.to} variant="primary" size="sm">
              {t('Go')}
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
              <span className={styles.statLabel}>{t('lessons completed')}</span>
            </div>
            <div className={styles.stat}>
              <span className={`${styles.statValue} mono`}>
                {solved}/{CHALLENGES.length}
              </span>
              <span className={styles.statLabel}>{t('challenges solved')}</span>
            </div>
            <div className={styles.stat}>
              <span className={`${styles.statValue} mono`}>{presets.length}</span>
              <span className={styles.statLabel}>{t('saved presets')}</span>
            </div>
          </div>
          <div
            className={styles.progress}
            aria-label={t('Overall progress {pct}%', { pct: Math.round((done / total) * 100) })}
          >
            <div className={styles.progressBar} style={{ width: `${(done / total) * 100}%` }} />
          </div>
        </Card>

        <Card
          className={styles.narrow}
          title={t('Hardware')}
          actions={
            <Link to="/hardware" className={styles.link}>
              {t('Manage')}
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
                ? t('Bass Station II connected')
                : midi.status === 'unsupported'
                  ? t('Web MIDI unsupported')
                  : midi.status === 'insecure'
                    ? t('MIDI needs HTTPS')
                    : midi.status === 'ready'
                      ? t('No device connected')
                      : t('Not connected')}
            </Badge>
          </div>
          <p className={styles.muted}>
            {connected
              ? t('Receiving {r} · sending {s}.', {
                  r: midi.receive ? t('on') : t('off'),
                  s: midi.send ? t('on') : t('off'),
                })
              : t(
                  'Everything works without hardware. Connect a Bass Station II by USB to sync it with the virtual panel.',
                )}
          </p>
          <p className={styles.muted}>
            {t('{n} documented MIDI mappings, {m} tested on your device.', {
              n: stats.midiDocumented,
              m: Object.keys(midi.verification).length,
            })}
          </p>
        </Card>

        <Card
          className={styles.half}
          title={t('Current chapter')}
          actions={
            chapter ? (
              <Link to="/learn" className={styles.link}>
                {t('Curriculum')}
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
                {t('{done} of {total} lessons completed', {
                  done: chapterDone,
                  total: chapter.lessons.length,
                })}
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
                        <Badge tone="success">{t('Done')}</Badge>
                      ) : key === progress.lastLesson ? (
                        <Badge tone="accent">{t('Last opened')}</Badge>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <p className={styles.muted}>{t('Every chapter is complete.')}</p>
          )}
        </Card>

        <Card className={styles.half} title={t('Recent exercises')}>
          {progress.activity.length === 0 ? (
            <p className={styles.muted}>
              {t('Lesson exercises and challenges you check will appear here.')}
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
                      {a.kind === 'lesson' ? t('Lesson') : t('Challenge')}: {title}
                    </Link>
                    <span className={styles.muted}>
                      <Badge tone={a.passed ? 'success' : 'warning'}>
                        {a.passed ? t('Passed') : t('Retry')}
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
          title={t('Recently saved presets')}
          actions={
            <Link to="/library" className={styles.link}>
              {t('Library')}
            </Link>
          }
        >
          {recentPresets.length === 0 ? (
            <p className={styles.muted}>
              {t('No presets yet. Design a sound in Synth Lab and save it in the Sound Library.')}
            </p>
          ) : (
            <ul className={styles.list}>
              {recentPresets.map((p) => (
                <li key={p.id}>
                  <span>{p.name}</span>
                  <span className={styles.muted}>
                    <Badge>{t(CATEGORY_LABELS[p.category])}</Badge> {relative(p.updatedAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className={styles.half} title={t('The instrument in the Academy')}>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={`${styles.statValue} mono`}>{stats.parameters}</span>
              <span className={styles.statLabel}>{t('parameters')}</span>
            </div>
            <div className={styles.stat}>
              <span className={`${styles.statValue} mono`}>{stats.controls}</span>
              <span className={styles.statLabel}>{t('panel controls')}</span>
            </div>
            <div className={styles.stat}>
              <span className={`${styles.statValue} mono`}>{stats.onKey}</span>
              <span className={styles.statLabel}>{t('On-Key functions')}</span>
            </div>
          </div>
          <p className={styles.muted}>
            {t('Local storage:')}{' '}
            {persistence.status === 'ready'
              ? t('progress, presets and settings are saved on this device.')
              : persistence.status === 'loading'
                ? t('loading…')
                : t('unavailable ({error}). Changes will not be kept.', {
                    error: persistence.error ?? t('unknown error'),
                  })}
          </p>
        </Card>
      </div>
    </>
  );
}
