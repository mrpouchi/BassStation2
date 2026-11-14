import { CONTROLS } from '@/data/synthesizer/controls';
import { SECTIONS } from '@/data/synthesizer/sections';
import { findParameter, formatValue, resolveControlTarget } from '@/engine/parameters/registry';
import type { ControlType } from '@/engine/parameters/types';
import { useSynthStore } from '@/stores/synthStore';
import styles from './SynthLabPage.module.css';
import { t } from '@/i18n/t';

const TYPE_LABEL: Record<ControlType, string> = {
  knob: 'Knob',
  'large-knob': 'Large knob',
  'rotary-switch': 'Rotary switch',
  slider: 'Fader',
  switch: 'Switch',
  button: 'Button',
  'select-button': 'Select button',
  wheel: 'Wheel',
  display: 'Display',
  led: 'LED',
  keyboard: 'Keyboard',
};

/**
 * Physical control inventory. "Currently edits" is resolved live from the
 * panel routing switches, so changing Osc Select or Env Select updates it.
 */
export function ControlsTab() {
  const values = useSynthStore((s) => s.values);
  const select = useSynthStore((s) => s.select);

  return (
    <>
      <p className={styles.notice}>
        {t(
          'Every element of the top panel and keyboard area, numbered as in the manual’s hardware overview. Shared controls show the parameter they edit with the current switch positions.',
        )}
      </p>
      {SECTIONS.map((s) => {
        const controls = CONTROLS.filter((c) => c.section === s.id);
        if (controls.length === 0) return null;
        return (
          <section key={s.id} className={styles.group}>
            <h2 className={styles.groupTitle}>{s.name}</h2>
            <ul className={styles.list}>
              {controls.map((c) => {
                const targets = resolveControlTarget(c.target, values);
                const first = targets[0];
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      className={`${styles.row} ${styles.controlRow}`}
                      disabled={first === undefined}
                      onClick={() => first && select(first)}
                    >
                      <span className={styles.controlName}>
                        <span className={styles.calloutCell} title={t('Manual callout number')}>
                          {c.callout ?? '–'}
                        </span>
                        <span className={styles.rowName}>
                          {c.label}
                          {c.secondary && (
                            <span className={styles.rowSub}>
                              {t('Also: {label}', { label: c.secondary.label })}
                            </span>
                          )}
                        </span>
                      </span>
                      <span className={styles.rowMidi}>{t(TYPE_LABEL[c.type])}</span>
                      <span className={styles.rowValue}>
                        {targets.length === 0 ? (
                          <span className={styles.rowSub}>{c.description}</span>
                        ) : (
                          targets.map((id) => {
                            const def = findParameter(id);
                            const v = values[id];
                            return def && v !== undefined ? (
                              <span key={id} style={{ display: 'block' }}>
                                {def.name} · <span className="mono">{formatValue(def, v)}</span>
                              </span>
                            ) : null;
                          })
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </>
  );
}
