import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { findParameter } from '@/engine/parameters/registry';
import { describeCondition, evaluateTask, type Task, type TaskResult } from '@/engine/tasks/tasks';
import { useSynthStore } from '@/stores/synthStore';
import styles from './TaskPanel.module.css';
import { t } from '@/i18n/t';

interface TaskPanelProps {
  task: Task;
  /** Show the target list before checking (lessons) or only after a check (challenges). */
  revealTargets?: boolean;
  successMessage?: string;
  onResult?: (passed: boolean) => void;
}

/** Interactive exercise: validates against the live synth state or a chosen answer. */
export function TaskPanel({
  task,
  revealTargets = true,
  successMessage,
  onResult,
}: TaskPanelProps) {
  const values = useSynthStore((s) => s.values);
  const selectedId = useSynthStore((s) => s.selectedId);
  const [choice, setChoice] = useState<number | undefined>(undefined);
  const [result, setResult] = useState<TaskResult | null>(null);

  const check = () => {
    const r = evaluateTask(task, values, choice, selectedId);
    setResult(r);
    onResult?.(r.passed);
  };

  const live = task.kind === 'set' ? evaluateTask(task, values) : null;

  return (
    <div className={styles.panel}>
      <p className={styles.prompt}>{task.prompt}</p>

      {task.kind === 'set' && (revealTargets || result) && (
        <ul className={styles.targets} aria-label={t('Targets')}>
          {task.conditions.map((c, i) => {
            const r = (result ?? live)?.results[i];
            const checked = result !== null;
            const met = r?.met === true;
            return (
              <li key={i} className={styles.target}>
                <span
                  className={[
                    styles.icon,
                    checked && (met ? styles.met : styles.unmet),
                    !checked && met && styles.met,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-label={met ? t('met') : t('not met')}
                >
                  {met ? '✓' : checked ? '!' : ''}
                </span>
                <span>
                  {revealTargets ? describeCondition(c) : met ? describeCondition(c) : c.hint}
                  {r && (
                    <span className={styles.hint}>{t('Now: {value}', { value: r.current })}</span>
                  )}
                  {checked && !met && revealTargets && (
                    <span className={styles.hint}>{c.hint}</span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {task.kind === 'choice' && (
        <div className={styles.options} role="radiogroup" aria-label={task.prompt}>
          {task.options.map((o, i) => {
            const selected = choice === i;
            const answered = result !== null && selected;
            return (
              <button
                key={o.label}
                type="button"
                role="radio"
                aria-checked={selected}
                className={[
                  styles.option,
                  selected && styles.optionSelected,
                  answered && (o.correct ? styles.optionCorrect : styles.optionWrong),
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => {
                  setChoice(i);
                  setResult(null);
                }}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      )}

      {task.kind === 'select' && (
        <p className={styles.hint}>
          {t('Selected:')}{' '}
          <strong>
            {selectedId ? (findParameter(selectedId)?.name ?? selectedId) : t('nothing yet')}
          </strong>
        </p>
      )}

      {task.kind === 'changed' && live === null && (
        <p className={styles.hint}>{evaluateTask(task, values).message}</p>
      )}

      <div className={styles.actions}>
        <Button
          variant="primary"
          onClick={check}
          disabled={task.kind === 'choice' && choice === undefined}
        >
          {t('Check')}
        </Button>
        {result && !result.passed && (
          <span className={styles.hint}>
            {t('Adjust and check again. There is no limit on attempts.')}
          </span>
        )}
      </div>

      {result && (
        <div
          className={`${styles.feedback} ${result.passed ? styles.success : styles.retry}`}
          role="status"
          aria-label={t('Exercise feedback')}
        >
          {result.passed
            ? successMessage
              ? `${result.message} ${successMessage}`
              : result.message
            : result.message}
        </div>
      )}
    </div>
  );
}
