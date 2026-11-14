import type { CSSProperties } from 'react';
import { formatValue, stepValue } from '@/engine/parameters/registry';
import styles from './Hardware.module.css';
import { at } from './layout';
import { useBoundControl } from './useBoundControl';
import { t } from '@/i18n/t';

interface HwSelectButtonProps {
  controlId: string;
  x: number;
  y: number;
  /** [option value, LED caption] pairs in panel order (left→right / top→bottom). */
  captions: readonly (readonly [string, string])[];
  layout: 'row-above' | 'column-right' | 'column-left';
  label?: string;
  tall?: boolean;
  /** Blink the active LED at this rate (Hz), e.g. LFO speed (p. 10). */
  blinkHz?: number | undefined;
}

/** A button that steps through options, with one LED per option (Range, Waveform, LFO wave…). */
export function HwSelectButton({
  controlId,
  x,
  y,
  captions,
  layout,
  label,
  tall = false,
  blinkHz,
}: HwSelectButtonProps) {
  const { control, def, value, selected, set, select } = useBoundControl(controlId);
  if (!def) return null;
  const order = captions.map(([v]) => v);
  const captionOf = (v: string) => captions.find(([k]) => k === v)?.[1] ?? v;
  const current = value !== undefined ? formatValue(def, value) : '';

  const leds = (
    <div
      style={{
        display: 'flex',
        flexDirection: layout === 'row-above' ? 'row' : 'column',
        gap: 'calc(var(--u) * 2.5)',
      }}
    >
      {order.map((v) => {
        const on = v === value;
        const blink = on && blinkHz !== undefined && blinkHz > 0.05 && blinkHz < 25;
        return (
          <span
            key={v}
            className={styles.dim}
            style={{
              display: 'flex',
              flexDirection:
                layout === 'row-above'
                  ? 'column'
                  : layout === 'column-left'
                    ? 'row-reverse'
                    : 'row',
              alignItems: 'center',
              gap: 'calc(var(--u) * 1.5)',
              fontSize: 'max(6px, calc(var(--u) * 4.8))',
            }}
          >
            <span>{captionOf(v)}</span>
            <span
              className={[styles.led, on && styles.ledOn, blink && styles.ledBlink]
                .filter(Boolean)
                .join(' ')}
              style={blink ? ({ '--blink': `${1 / blinkHz}s` } as CSSProperties) : undefined}
            />
          </span>
        );
      })}
    </div>
  );

  const button = (
    <button
      type="button"
      className={[
        styles.hwButton,
        tall ? styles.lfoButton : styles.wideButton,
        styles.interactive,
        selected && styles.selected,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ borderRadius: 3 }}
      aria-label={t('{label}: {value}. Activate for next option.', {
        label: control.label,
        value: current,
      })}
      title={`${def.name}: ${current}`}
      onClick={() => value !== undefined && set(stepValue(def, value, 1, true))}
      onFocus={select}
    />
  );

  return (
    <div
      className={styles.place}
      style={{
        ...at(x, y),
        flexDirection: layout === 'row-above' ? 'column' : 'row',
        gap: 'calc(var(--u) * 3)',
      }}
    >
      {layout === 'column-left' ? (
        <>
          {leds}
          {button}
        </>
      ) : (
        <>
          {layout === 'row-above' && leds}
          {button}
          {layout === 'column-right' && leds}
        </>
      )}
      {label && layout === 'row-above' && <span className={styles.label}>{label}</span>}
    </div>
  );
}
