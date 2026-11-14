import { LocateOnHover } from '@/components/synthesizer/LocateOnHover';
import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ParameterEditor } from '@/components/controls/ParameterEditor';
import { TaskPanel } from '@/components/learning/TaskPanel';
import { Badge } from '@/components/ui/Badge';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { LessonVisual } from '@/components/visualizers/LessonVisual';
import { findLesson, LESSON_ORDER, lessonKey } from '@/data/lessons';
import { defaultValues, getParameter } from '@/engine/parameters/registry';
import { ValuesOverrideContext } from '@/hooks/valuesOverride';
import { ParameterInspector } from '@/features/synth-lab/ParameterInspector';
import { useProgressStore } from '@/stores/progressStore';
import { useSynthStore } from '@/stores/synthStore';
import styles from './LessonPage.module.css';
import { t } from '@/i18n/t';

export function LessonPage() {
  const { chapterId = '', lessonId = '' } = useParams();
  const key = lessonKey(chapterId, lessonId);
  const lesson = findLesson(chapterId, lessonId);
  const index = LESSON_ORDER.findIndex((l) => l.key === key);
  const ref = LESSON_ORDER[index];
  const prev = index > 0 ? LESSON_ORDER[index - 1] : undefined;
  const next = index >= 0 ? LESSON_ORDER[index + 1] : undefined;
  const completed = useProgressStore((s) => Boolean(s.lessons[key]));
  const visitLesson = useProgressStore((s) => s.visitLesson);
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const replaceValues = useSynthStore((s) => s.replaceValues);
  const select = useSynthStore((s) => s.select);

  useEffect(() => {
    if (lesson) visitLesson(key);
  }, [key, lesson, visitLesson]);

  const demoValues = useMemo(
    () => (lesson ? { ...defaultValues(), ...lesson.demonstration.values } : null),
    [lesson],
  );

  if (!lesson || !ref || !demoValues) {
    return (
      <EmptyState
        title={t('Lesson not found')}
        actions={<ButtonLink to="/learn">{t('Back to the curriculum')}</ButtonLink>}
      >
        {t('This lesson does not exist.')}
      </EmptyState>
    );
  }

  const position = ref.chapter.lessons.findIndex((l) => l.id === lessonId) + 1;
  const loadStart = () =>
    replaceValues({ ...defaultValues(), ...(lesson.experiment.start ?? {}) }, 'preset');

  return (
    <>
      <PageHeader
        eyebrow={t('Chapter {n} · {title} · Lesson {position}', {
          n: ref.chapter.number,
          title: ref.chapter.title,
          position,
        })}
        title={ref.outline.title}
        actions={completed ? <Badge tone="success">{t('Completed')}</Badge> : undefined}
      />
      <div className={styles.layout}>
        <div className={styles.sections}>
          <Card title={t('Objective')} actions={<span className={styles.stepNum}>1</span>}>
            <p className={styles.objective}>{lesson.objective}</p>
          </Card>

          <Card title={t('Explanation')} actions={<span className={styles.stepNum}>2</span>}>
            <div className={styles.paragraphs}>
              {lesson.explanation.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Card>

          <Card
            title={t('Demonstration')}
            subtitle={t('A fixed example. It does not change your settings.')}
            actions={<span className={styles.stepNum}>3</span>}
          >
            <ValuesOverrideContext.Provider value={demoValues}>
              <LessonVisual kind={lesson.demonstration.visual} />
            </ValuesOverrideContext.Provider>
            <p className={styles.muted}>{lesson.demonstration.caption}</p>
          </Card>

          <Card
            title={t('Experiment')}
            subtitle={t('These controls edit your live Synth Lab state.')}
            actions={<span className={styles.stepNum}>4</span>}
          >
            <ol className={styles.steps}>
              {lesson.experiment.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
            <div className={styles.row}>
              <Button
                size="sm"
                onClick={loadStart}
                title={t(
                  "Replaces your current settings with the Init Patch plus this lesson's starting values",
                )}
              >
                {t('Load lesson starting point')}
              </Button>
              <ButtonLink size="sm" variant="ghost" to="/synth-lab">
                {t('Open the Hardware View')}
              </ButtonLink>
            </div>
            <div className={styles.editors}>
              {lesson.experiment.parameters.map((id) => (
                <div key={id}>
                  <button type="button" className={styles.editorName} onClick={() => select(id)}>
                    <LocateOnHover id={id}>{getParameter(id).name}</LocateOnHover>
                  </button>
                  <ParameterEditor id={id} />
                </div>
              ))}
            </div>
            <LessonVisual kind={lesson.experiment.visual} />
          </Card>

          <Card
            title={t('Exercise')}
            subtitle={t('Checked against your current settings.')}
            actions={<span className={styles.stepNum}>5–6</span>}
          >
            <TaskPanel
              key={key}
              task={lesson.exercise}
              successMessage={lesson.success}
              onResult={(passed) => passed && completeLesson(key)}
            />
          </Card>

          <nav className={styles.nav} aria-label={t('Lesson navigation')}>
            {prev ? (
              <ButtonLink to={`/learn/${prev.key}`}>← {prev.outline.title}</ButtonLink>
            ) : (
              <span />
            )}
            <Link to="/learn" className={styles.muted}>
              {t('All lessons')}
            </Link>
            {next ? (
              <ButtonLink to={`/learn/${next.key}`} variant={completed ? 'primary' : 'secondary'}>
                {next.outline.title} →
              </ButtonLink>
            ) : (
              <span />
            )}
          </nav>
        </div>
        <div className={styles.side}>
          <ParameterInspector />
        </div>
      </div>
    </>
  );
}
