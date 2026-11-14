import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { HardwarePanel } from '@/components/synthesizer/HardwarePanel';
import { TaskPanel } from '@/components/learning/TaskPanel';
import { Badge } from '@/components/ui/Badge';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { LessonVisual } from '@/components/visualizers/LessonVisual';
import { CHALLENGE_TYPES, CHALLENGES, findChallenge } from '@/data/challenges/challenges';
import { LESSONS } from '@/data/lessons';
import { CURRICULUM } from '@/data/lessons/curriculum';
import { defaultValues } from '@/engine/parameters/registry';
import { ValuesOverrideContext, VizOptionsContext } from '@/hooks/valuesOverride';
import { ParameterInspector } from '@/features/synth-lab/ParameterInspector';
import { useProgressStore } from '@/stores/progressStore';
import { useSynthStore } from '@/stores/synthStore';
import styles from './Challenges.module.css';
import { t, tn } from '@/i18n/t';

const HIDE_READOUT = { hideReadout: true };

function lessonTitle(key: string): string | undefined {
  const [chapterId, lessonId] = key.split('/');
  return CURRICULUM.find((c) => c.id === chapterId)?.lessons.find((l) => l.id === lessonId)?.title;
}

export function ChallengePage() {
  const { challengeId = '' } = useParams();
  const challenge = findChallenge(challengeId);
  const record = useProgressStore((s) => s.challenges[challengeId]);
  const recordChallenge = useProgressStore((s) => s.recordChallenge);
  const replaceValues = useSynthStore((s) => s.replaceValues);
  const [solvedNow, setSolvedNow] = useState(false);
  const targetValues = useMemo(
    () => (challenge?.target ? { ...defaultValues(), ...challenge.target.values } : null),
    [challenge],
  );

  if (!challenge) {
    return (
      <EmptyState
        title={t('Challenge not found')}
        actions={<ButtonLink to="/challenges">{t('All challenges')}</ButtonLink>}
      >
        {t('This challenge does not exist.')}
      </EmptyState>
    );
  }

  const type = CHALLENGE_TYPES.find((t) => t.id === challenge.type);
  const index = CHALLENGES.indexOf(challenge);
  const next = CHALLENGES[index + 1];
  const solved = solvedNow || Boolean(record?.solvedAt);
  const loadStart = () =>
    replaceValues({ ...defaultValues(), ...(challenge.start ?? {}) }, 'preset');
  const isReconstruction = challenge.type === 'reconstruction';

  return (
    <>
      <PageHeader
        eyebrow={`${t('Challenge')} · ${type?.name ?? challenge.type}`}
        title={challenge.title}
        description={challenge.brief}
        actions={
          solved ? (
            <Badge tone="success">{t('Solved')}</Badge>
          ) : record ? (
            <Badge tone="warning">
              {tn(record.attempts, '{count} attempt', '{count} attempts')}
            </Badge>
          ) : undefined
        }
      />
      <div className={styles.layout}>
        <div className={styles.stack}>
          {(challenge.start !== undefined ||
            isReconstruction ||
            challenge.type === 'manipulation') && (
            <Card title={t('Starting point')}>
              <p className={styles.muted}>
                {challenge.start
                  ? t(
                      'Load the patch for this challenge. This replaces your current Synth Lab settings, so save anything you want to keep in the Sound Library first.',
                    )
                  : t(
                      'Start from the Init Patch for a clean slate, or keep your current settings.',
                    )}
              </p>
              <div className={styles.row}>
                <Button onClick={loadStart}>
                  {challenge.start ? t('Load the challenge patch') : t('Reset to Init Patch')}
                </Button>
              </div>
            </Card>
          )}

          {challenge.target && targetValues && (
            <Card
              title={
                isReconstruction
                  ? t('Target vs. yours')
                  : challenge.type === 'troubleshooting'
                    ? t('Symptom')
                    : t('Look at this')
              }
            >
              <div className={isReconstruction ? styles.compare : undefined}>
                <div>
                  {isReconstruction && <p className={styles.label}>{t('Target')}</p>}
                  <VizOptionsContext.Provider value={HIDE_READOUT}>
                    <ValuesOverrideContext.Provider value={targetValues}>
                      <LessonVisual kind={challenge.target.visual} />
                    </ValuesOverrideContext.Provider>
                  </VizOptionsContext.Provider>
                </div>
                {isReconstruction && (
                  <div>
                    <p className={styles.label}>{t('Your settings (live)')}</p>
                    <LessonVisual kind={challenge.target.visual} />
                  </div>
                )}
              </div>
            </Card>
          )}

          {challenge.panel && <HardwarePanel />}

          <Card title={t('Your task')}>
            <TaskPanel
              key={challenge.id}
              task={challenge.task}
              revealTargets={challenge.revealTargets}
              onResult={(passed) => {
                recordChallenge(challenge.id, passed);
                if (passed) setSolvedNow(true);
              }}
            />
          </Card>

          {solved && (
            <Card title={t('Takeaway')}>
              <p className={styles.takeaway}>{challenge.takeaway}</p>
            </Card>
          )}

          <div className={styles.row} style={{ justifyContent: 'space-between' }}>
            <Link to="/challenges" className={styles.muted}>
              {t('All challenges')}
            </Link>
            {challenge.lesson && LESSONS.has(challenge.lesson) && (
              <Link to={`/learn/${challenge.lesson}`} className={styles.muted}>
                {t('Review the lesson: {title}', { title: lessonTitle(challenge.lesson) ?? '' })}
              </Link>
            )}
            {next && (
              <ButtonLink to={`/challenges/${next.id}`} variant={solved ? 'primary' : 'secondary'}>
                {t('Next: {title}', { title: next.title })} →
              </ButtonLink>
            )}
          </div>
        </div>
        <div className={styles.side}>
          <ParameterInspector />
        </div>
      </div>
    </>
  );
}
