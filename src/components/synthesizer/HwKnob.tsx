import { formatValue, fromNormalized, toNormalized } from '@/engine/parameters/registry';
import styles from './Hardware.module.css';
import { at } from './layout';
import { ariaNow, ariaRange, handleSliderKey } from './sliderKeys';
import { useBoundControl } from './useBoundControl';
import { usePointerDrag } from './usePointerDrag';

interface HwKnobProps {
  controlId: string;
  x: number;
  y: number;
  label?: string;
  size?: 'xs' | 'sm' | 'lg';
  /** Scale captions shown under the knob, e.g. ["40", "240"]. */
  scale?: readonly [string, string];
}

const SWEEP = 270;

export function HwKnob({ controlId, x, y, label, size = 'sm', scale }: HwKnobProps) {
  const { control, def, value, selected, set, select } = useBoundControl(controlId);
  const n = def && value !== undefined ? toNormalized(def, value) : 0;
  const drag = usePointerDrag(
    () => {
      select();
      return n;
    },
    (next) => def && set(fromNormalized(def, next)),
    size === 'lg' ? 260 : 180,
  );

  const angle = -SWEEP / 2 + n * SWEEP;
  const bipolar = def?.kind === 'continuous' && def.bipolar === true;
  const arcFrom = bipolar ? 0.5 : 0;
  const arc = describeArc(
    50,
    50,
    46,
    -SWEEP / 2 + Math.min(arcFrom, n) * SWEEP,
    -SWEEP / 2 + Math.max(arcFrom, n) * SWEEP,
  );
  const dots = Array.from({ length: 11 }, (_, i) => -SWEEP / 2 + (i / 10) * SWEEP);
  const sizeClass = size === 'lg' ? styles.knobLg : size === 'xs' ? styles.knobXs : styles.knobSm;
  const name = def ? `${control.label} — ${def.name}` : control.label;

  return (
    <div className={styles.place} style={at(x, y)}>
      <div
        role="slider"
        tabIndex={0}
        aria-label={name}
        aria-valuemin={def ? ariaRange(def).min : 0}
        aria-valuemax={def ? ariaRange(def).max : 1}
        aria-valuenow={def && value !== undefined ? ariaNow(def, value) : 0}
        aria-valuetext={def && value !== undefined ? formatValue(def, value) : undefined}
        title={
          def && value !== undefined ? `${def.name}: ${formatValue(def, value)}` : control.label
        }
        className={[styles.knob, sizeClass, styles.interactive, selected && styles.selected]
          .filter(Boolean)
          .join(' ')}
        onKeyDown={(e) => def && value !== undefined && handleSliderKey(e, def, value, set)}
        onFocus={select}
        onDoubleClick={() => def && set(def.defaultValue)}
        onWheel={(e) => {
          if (!def || value === undefined) return;
          set(
            fromNormalized(
              def,
              n +
                (e.deltaY < 0 ? 1 : -1) /
                  (def.kind === 'continuous'
                    ? 64
                    : Math.max(1, (def.kind === 'enum' ? def.options.length : 2) - 1)),
            ),
          );
        }}
        {...drag}
      >
        <svg viewBox="0 0 100 100" aria-hidden>
          {dots.map((a) => {
            const p = polar(50, 50, 49, a);
            return <circle key={a} cx={p.x} cy={p.y} r={1.6} fill="#c9ced6" opacity={0.7} />;
          })}
          {n !== arcFrom && (
            <path d={arc} stroke="#4fb8e6" strokeWidth={3} fill="none" strokeLinecap="round" />
          )}
          <circle cx={50} cy={50} r={38} fill="#0f1012" />
          <circle cx={50} cy={50} r={38} fill="none" stroke="#2c2e33" strokeWidth={2} />
          <g transform={`rotate(${angle} 50 50)`}>
            <circle cx={50} cy={50} r={size === 'lg' ? 27 : 22} fill="#f1f2f3" />
            <rect
              x={48.5}
              y={size === 'lg' ? 24 : 29}
              width={3}
              height={14}
              rx={1.5}
              fill="#16171a"
            />
          </g>
        </svg>
      </div>
      {scale && (
        <span
          className={`${styles.label} ${styles.dim}`}
          style={{ display: 'flex', justifyContent: 'space-between', width: '140%' }}
        >
          <span>{scale[0]}</span>
          <span>{scale[1]}</span>
        </span>
      )}
      <span className={styles.label}>{label ?? control.label}</span>
    </div>
  );
}

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, a0: number, a1: number) {
  const s = polar(cx, cy, r, a0);
  const e = polar(cx, cy, r, a1);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M${s.x},${s.y} A${r},${r} 0 ${large} 1 ${e.x},${e.y}`;
}
