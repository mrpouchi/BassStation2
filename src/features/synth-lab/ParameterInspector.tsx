import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ParameterEditor } from '@/components/controls/ParameterEditor';
import { findConcept } from '@/data/synthesizer/concepts';
import { getSection } from '@/data/synthesizer/sections';
import { describeMidiMapping, VERIFICATION_LABELS } from '@/engine/midi/describe';
import { describeAccess, findParameter, formatValue } from '@/engine/parameters/registry';
import type { MidiVerification } from '@/engine/parameters/types';
import { useSynthStore } from '@/stores/synthStore';
import styles from './ParameterInspector.module.css';

const VERIFICATION_TONE: Record<MidiVerification, BadgeTone> = {
  'both-verified': 'success',
  'input-verified': 'success',
  'output-verified': 'success',
  'requires-testing': 'warning',
  'not-supported': 'neutral',
};

const SCOPE_LABEL = {
  patch: 'Saved in patch',
  global: 'Global setting',
  performance: 'Performance input',
  panel: 'Panel routing',
} as const;

export function ParameterInspector() {
  const selectedId = useSynthStore((s) => s.selectedId);
  const select = useSynthStore((s) => s.select);
  const setValue = useSynthStore((s) => s.setValue);
  const def = selectedId ? findParameter(selectedId) : undefined;

  if (!def) {
    return (
      <aside className={styles.inspector} aria-label="Parameter inspector">
        <p className={styles.empty}>
          Select a parameter or control to see what it does, how to experiment with it and how it
          maps to MIDI.
        </p>
      </aside>
    );
  }

  const { education: edu, midi } = def;

  return (
    <aside className={styles.inspector} aria-label="Parameter inspector">
      <div className={styles.head}>
        <div className={styles.meta}>
          <span>{getSection(def.section).name}</span>
          <span>·</span>
          <span>{describeAccess(def)}</span>
          <span>·</span>
          <span>{SCOPE_LABEL[def.scope]}</span>
        </div>
        <h2 className={styles.name}>{def.name}</h2>
        <p className={styles.description}>{def.description}</p>
      </div>

      <div className={styles.body}>
        <section className={styles.block}>
          <ParameterEditor id={def.id} />
          <div>
            <Button size="sm" variant="ghost" onClick={() => setValue(def.id, def.defaultValue)}>
              Reset to {formatValue(def, def.defaultValue)}
              {def.defaultInferred ? ' (app default)' : ' (Init Patch)'}
            </Button>
          </div>
        </section>

        <section className={styles.block}>
          <h3 className={styles.blockTitle}>What it does</h3>
          <p>{edu.explanation}</p>
          <div className={styles.direction}>
            <p className={styles.directionItem}>
              <span className={styles.directionLabel}>Increase</span>
              {edu.increase}
            </p>
            <p className={styles.directionItem}>
              <span className={styles.directionLabel}>Decrease</span>
              {edu.decrease}
            </p>
          </div>
        </section>

        {edu.experiment && (
          <section className={styles.block}>
            <h3 className={styles.blockTitle}>Try this</h3>
            <p className={styles.experiment}>{edu.experiment}</p>
          </section>
        )}

        {def.concepts.length > 0 && (
          <section className={styles.block}>
            <h3 className={styles.blockTitle}>Concepts</h3>
            <div className={styles.chips}>
              {def.concepts.map((c) => {
                const concept = findConcept(c);
                return (
                  <span
                    key={c}
                    className={`${styles.chip} ${styles.concept}`}
                    title={concept?.definition}
                  >
                    {concept?.term ?? c}
                  </span>
                );
              })}
            </div>
          </section>
        )}

        {def.related.length > 0 && (
          <section className={styles.block}>
            <h3 className={styles.blockTitle}>Works together with</h3>
            <div className={styles.chips}>
              {def.related.map((id) => {
                const rel = findParameter(id);
                return rel ? (
                  <button key={id} type="button" className={styles.chip} onClick={() => select(id)}>
                    {rel.name}
                  </button>
                ) : null;
              })}
            </div>
          </section>
        )}

        <section className={styles.block}>
          <h3 className={styles.blockTitle}>Reference</h3>
          <dl className={styles.dl}>
            {def.kind === 'continuous' && (
              <>
                <dt>Range</dt>
                <dd className="mono">
                  {formatValue(def, def.min)} … {formatValue(def, def.max)}
                  {def.rangeSource === 'inferred' && ' (inferred)'}
                </dd>
              </>
            )}
            {def.kind === 'enum' && (
              <>
                <dt>Options</dt>
                <dd>
                  {def.options.length <= 8
                    ? def.options.map((o) => o.label).join(', ')
                    : `${def.options.length} values`}
                </dd>
              </>
            )}
            <dt>Default</dt>
            <dd className="mono">{formatValue(def, def.defaultValue)}</dd>
            <dt>MIDI</dt>
            <dd className="mono">{describeMidiMapping(midi.mapping)}</dd>
            {midi.documentedRange && (
              <>
                <dt>Manual range</dt>
                <dd className="mono">{midi.documentedRange}</dd>
              </>
            )}
            <dt>Status</dt>
            <dd>
              <Badge tone={VERIFICATION_TONE[midi.verification]} dot>
                {VERIFICATION_LABELS[midi.verification]}
              </Badge>
            </dd>
            <dt>Source</dt>
            <dd>User guide v5.0, p. {def.source.page}</dd>
          </dl>
          {midi.notes && <p className={styles.note}>{midi.notes}</p>}
        </section>
      </div>
    </aside>
  );
}
