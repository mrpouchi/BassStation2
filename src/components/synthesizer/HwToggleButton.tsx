import { formatValue } from '@/engine/parameters/registry';
import styles from './Hardware.module.css';
import { at } from './layout';
import { useBoundControl } from './useBoundControl';

/** Latching button with an LED (Arp On, Latch). Shows its secondary function tag. */
export function HwToggleButton({
  controlId,
  x,
  y,
  ledSide,
}: {
  controlId: string;
  x: number;
  y: number;
  ledSide: 'left' | 'right';
}) {
  const { control, def, value, selected, set, select } = useBoundControl(controlId);
  const on = value === true;
  const led = <span className={[styles.led, on && styles.ledOn].filter(Boolean).join(' ')} />;
  return (
    <div className={styles.place} style={at(x, y)}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 'calc(var(--u) * 4)' }}>
        {ledSide === 'left' && led}
        <button
          type="button"
          aria-pressed={on}
          className={[styles.hwButton, styles.interactive, selected && styles.selected]
            .filter(Boolean)
            .join(' ')}
          style={{ borderRadius: 3 }}
          title={
            def && value !== undefined ? `${def.name}: ${formatValue(def, value)}` : control.label
          }
          onClick={() => set(!on)}
          onFocus={select}
        >
          {control.label}
        </button>
        {ledSide === 'right' && led}
      </span>
      {control.secondary && (
        <span className={styles.secondaryTag} title={control.secondary.description}>
          {control.secondary.label}
        </span>
      )}
    </div>
  );
}
