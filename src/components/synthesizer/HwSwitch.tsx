import { formatValue } from '@/engine/parameters/registry';
import styles from './Hardware.module.css';
import { at } from './layout';
import { useBoundControl } from './useBoundControl';

interface HwSwitchProps {
  controlId: string;
  x: number;
  y: number;
  orientation: 'vertical' | 'horizontal';
  /** Option values in the order they appear on the panel (top→bottom / left→right). */
  order?: readonly string[];
  /** Custom captions per option value. */
  captions?: Readonly<Record<string, string>>;
  /** Show LEDs next to captions (e.g. filter shape, triggering). */
  leds?: boolean;
  labelSide?: 'before' | 'after';
  title?: string;
  /** Show only the current position's caption (for crowded panel areas). */
  compact?: boolean;
}

/** A multi-position slide switch. Click the slot to step, or click a caption to jump. */
export function HwSwitch({
  controlId,
  x,
  y,
  orientation,
  order,
  captions,
  leds = false,
  labelSide = 'after',
  title,
  compact = false,
}: HwSwitchProps) {
  const { control, def, value, selected, set, select } = useBoundControl(controlId);
  if (!def || def.kind !== 'enum') return null;
  const values = order ?? def.options.map((o) => o.value);
  const index = Math.max(0, values.indexOf(String(value)));
  const count = values.length;
  const vertical = orientation === 'vertical';
  const slotLen = `calc(var(--u) * ${count * 7 + 2})`;
  const pos = count > 1 ? (index / (count - 1)) * 100 : 0;
  const optionLabel = (v: string) =>
    captions?.[v] ?? def.options.find((o) => o.value === v)?.label ?? v;
  const current = value !== undefined ? formatValue(def, value) : '';

  const slot = (
    <button
      type="button"
      className={[
        styles.switchSlot,
        vertical ? styles.slotV : styles.slotH,
        styles.interactive,
        selected && styles.selected,
      ]
        .filter(Boolean)
        .join(' ')}
      style={vertical ? { height: slotLen, borderRadius: 4 } : { width: slotLen, borderRadius: 4 }}
      aria-label={`${control.label}: ${current}. Activate to switch.`}
      title={`${def.name}: ${current}`}
      onClick={() => set(values[(index + 1) % count] ?? def.defaultValue)}
      onFocus={select}
    >
      <span
        className={styles.switchThumb}
        style={
          vertical
            ? {
                left: '50%',
                top: `calc(${pos}% * (1 - 6 / ${count * 7 + 2}) )`,
                transform: 'translateX(-50%)',
              }
            : {
                top: '50%',
                left: `calc(${pos}% * (1 - 6 / ${count * 7 + 2}) )`,
                transform: 'translateY(-50%)',
              }
        }
      />
    </button>
  );

  const options = compact ? (
    <span className={`${styles.label}`}>{optionLabel(String(value))}</span>
  ) : (
    <div
      className={[styles.switchOptions, vertical && styles.optionsV].filter(Boolean).join(' ')}
      role="radiogroup"
      aria-label={control.label}
    >
      {values.map((v) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={v === value}
          className={[styles.option, v === value && styles.optionActive].filter(Boolean).join(' ')}
          onClick={() => set(v)}
          tabIndex={-1}
        >
          {leds && labelSide === 'after' && (
            <span className={[styles.led, v === value && styles.ledOn].filter(Boolean).join(' ')} />
          )}
          {optionLabel(v)}
          {leds && labelSide === 'before' && (
            <span className={[styles.led, v === value && styles.ledOn].filter(Boolean).join(' ')} />
          )}
        </button>
      ))}
    </div>
  );

  return (
    <div className={styles.place} style={at(x, y)}>
      {title && <span className={styles.label}>{title}</span>}
      <div className={styles.switchWrap} style={vertical ? undefined : { flexDirection: 'column' }}>
        {labelSide === 'before' && options}
        {slot}
        {labelSide === 'after' && options}
      </div>
    </div>
  );
}
