import { formatValue, fromNormalized, toNormalized } from '@/engine/parameters/registry';
import styles from './Hardware.module.css';
import { at } from './layout';
import { ariaNow, ariaRange, handleSliderKey } from './sliderKeys';
import { useBoundControl } from './useBoundControl';
import { usePointerDrag } from './usePointerDrag';

/** Pitch (spring-loaded, returns to centre) or Mod wheel. */
export function HwWheel({
  controlId,
  x,
  y,
  spring = false,
}: {
  controlId: string;
  x: number;
  y: number;
  spring?: boolean;
}) {
  const { control, def, value, selected, set, select } = useBoundControl(controlId);
  const n = def && value !== undefined ? toNormalized(def, value) : 0;
  const drag = usePointerDrag(
    () => {
      select();
      return n;
    },
    (next) => def && set(fromNormalized(def, next)),
    140,
    () => {
      if (spring && def) set(def.defaultValue);
    },
  );
  return (
    <div className={styles.place} style={at(x, y)}>
      <div
        role="slider"
        tabIndex={0}
        aria-label={`${control.label} wheel`}
        aria-orientation="vertical"
        aria-valuemin={def ? ariaRange(def).min : 0}
        aria-valuemax={def ? ariaRange(def).max : 1}
        aria-valuenow={def && value !== undefined ? ariaNow(def, value) : 0}
        aria-valuetext={def && value !== undefined ? formatValue(def, value) : undefined}
        title={spring ? 'Pitch wheel: drag and release; it springs back to centre' : 'Mod wheel'}
        className={[styles.wheel, styles.interactive, selected && styles.selected]
          .filter(Boolean)
          .join(' ')}
        style={{ borderRadius: 6 }}
        onKeyDown={(e) => def && value !== undefined && handleSliderKey(e, def, value, set)}
        onKeyUp={() => spring && def && set(def.defaultValue)}
        onFocus={select}
        {...drag}
      >
        <div className={styles.wheelSurface} style={{ backgroundPositionY: `${-n * 60}px` }} />
        <div className={styles.wheelGlow} style={{ top: `${(1 - n) * 82 + 7}%` }} />
      </div>
      <span className={styles.label}>{control.label}</span>
    </div>
  );
}
