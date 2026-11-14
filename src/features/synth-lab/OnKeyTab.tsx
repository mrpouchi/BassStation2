import { ON_KEY_LAYOUT } from '@/data/synthesizer/onKeyLayout';
import { formatValue, parametersOnKey } from '@/engine/parameters/registry';
import { useSynthStore } from '@/stores/synthStore';
import styles from './SynthLabPage.module.css';

export function OnKeyTab() {
  const values = useSynthStore((s) => s.values);
  const select = useSynthStore((s) => s.select);

  return (
    <>
      <p className={styles.notice}>
        Hold <strong>Function/Exit</strong> and press a key to edit its function with the
        Patch/Value buttons. Pressing the same key again reaches extended functions (shown as 2×,
        3×, 4×).
      </p>
      <div className={styles.keys}>
        {ON_KEY_LAYOUT.map((entry) => {
          const params = parametersOnKey(entry.key);
          return (
            <article
              key={entry.key}
              className={[styles.key, entry.key.includes('#') && styles.keyBlack]
                .filter(Boolean)
                .join(' ')}
            >
              <div className={styles.keyHead}>
                <span>{entry.key}</span>
                <span>{entry.group}</span>
              </div>
              <span className={styles.keyLabel}>{entry.label}</span>
              {entry.action && (
                <span className={styles.keyAction}>
                  Sends the current patch (or all 128) as SysEx. This is a hardware action.
                </span>
              )}
              {params.map((p) => {
                const presses = p.access.kind === 'on-key' ? p.access.presses : 1;
                const v = values[p.id];
                return (
                  <button
                    key={p.id}
                    type="button"
                    className={styles.keyParam}
                    onClick={() => select(p.id)}
                  >
                    <span>
                      {presses > 1 && <span className="mono">{presses}× </span>}
                      {p.name}
                    </span>
                    <span className="mono">{v === undefined ? '—' : formatValue(p, v)}</span>
                  </button>
                );
              })}
            </article>
          );
        })}
      </div>
    </>
  );
}
