import type { PointerEvent } from 'react';
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
  /** Move to the position under the pointer, like sliding the real switch. */
  const jumpTo = (e: PointerEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const length = vertical ? r.height : r.width;
    if (length <= 0 || count < 2) return;
    const along = (vertical ? e.clientY - r.top : e.clientX - r.left) / length;
    // Thumb centres sit between 3/L and 1 - 3/L of the slot (L = slot length in units).
    const units = count * 7 + 2;
    const f = (along * units - 3) / (units - 6);
    const next = Math.min(count - 1, Math.max(0, Math.round(f * (count - 1))));
    if (next !== index) set(values[next] ?? def.defaultValue);
    else select();
  };

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
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        jumpTo(e);
      }}
      onPointerMove={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) jumpTo(e);
      }}
      onClick={(e) => {
        // Keyboard activation (Enter/Space) steps; pointer clicks are handled on pointer down.
        if (e.detail === 0) set(values[(index + 1) % count] ?? def.defaultValue);
      }}
      onKeyDown={(e) => {
        const back = vertical ? 'ArrowUp' : 'ArrowLeft';
        const fwd = vertical ? 'ArrowDown' : 'ArrowRight';
        if (e.key !== back && e.key !== fwd) return;
        e.preventDefault();
        const next = Math.min(count - 1, Math.max(0, index + (e.key === fwd ? 1 : -1)));
        if (next !== index) set(values[next] ?? def.defaultValue);
      }}
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
