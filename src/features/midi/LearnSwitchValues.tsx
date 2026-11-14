import { Button } from '@/components/ui/Button';
import { findParameter } from '@/engine/parameters/registry';
import { useMidiStore } from '@/stores/midiStore';
import styles from './LearnSwitchValues.module.css';

/**
 * Lets the user teach the app what a switch value from their synth means.
 * Shown whenever the synth sends a value that no codec knows (the manual
 * rarely documents switch values), and lists what has been taught so far.
 */
export function UnknownValuePrompts({ limit = 3 }: { limit?: number }) {
  const unknown = useMidiStore((s) => s.unknownValues);
  const learnValue = useMidiStore((s) => s.learnValue);
  const set = useMidiStore((s) => s.set);
  const shown = unknown.slice(0, limit);
  if (shown.length === 0) return null;

  return (
    <div className={styles.prompts} role="region" aria-label="Unrecognised MIDI values">
      {shown.map((u) => {
        const def = findParameter(u.id);
        if (!def || def.kind !== 'enum') return null;
        return (
          <div key={`${u.id}-${u.raw}`} className={styles.prompt}>
            <p>
              Your synth sent <strong className="mono">{u.raw}</strong> for{' '}
              <strong>{def.name}</strong>, a value the manual does not document. Which position is
              the switch in?
            </p>
            <div className={styles.options}>
              {def.options.map((o) => (
                <Button key={o.value} size="sm" onClick={() => learnValue(u.id, u.raw, o.value)}>
                  {o.label}
                </Button>
              ))}
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  set({
                    unknownValues: useMidiStore
                      .getState()
                      .unknownValues.filter((x) => !(x.id === u.id && x.raw === u.raw)),
                  })
                }
              >
                Ignore
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function LearnedValuesList() {
  const learned = useMidiStore((s) => s.learnedValues);
  const forget = useMidiStore((s) => s.forgetLearned);
  const entries = Object.entries(learned);

  return (
    <>
      <UnknownValuePrompts limit={8} />
      {entries.length === 0 ? (
        <p className={styles.muted}>
          Nothing taught yet. When the synth sends a switch value the app does not recognise, it
          asks you here (and in the Synth Lab) which position it means.
        </p>
      ) : (
        <ul className={styles.list}>
          {entries.map(([id, table]) => {
            const def = findParameter(id);
            const label = (v: string) =>
              def?.kind === 'enum' ? (def.options.find((o) => o.value === v)?.label ?? v) : v;
            return (
              <li key={id}>
                <span>
                  <strong>{def?.name ?? id}</strong>:{' '}
                  {Object.entries(table)
                    .sort(([a], [b]) => Number(a) - Number(b))
                    .map(([raw, v]) => `${raw} = ${label(v)}`)
                    .join(', ')}
                </span>
                <Button size="sm" variant="ghost" onClick={() => forget(id)}>
                  Forget
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
