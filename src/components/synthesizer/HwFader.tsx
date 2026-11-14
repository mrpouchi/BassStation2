import { formatValue, fromNormalized, toNormalized } from '@/engine/parameters/registry';
import styles from './Hardware.module.css';
import { at } from './layout';
import { ariaNow, ariaRange, handleSliderKey } from './sliderKeys';
import { useBoundControl } from './useBoundControl';
import { usePointerDrag } from './usePointerDrag';
import { t } from '@/i18n/t';

export function HwFader({ controlId, x, y }: { controlId: string; x: number; y: number }) {
  const { control, def, value, targets, selected, set, select } = useBoundControl(controlId);
  const n = def && value !== undefined ? toNormalized(def, value) : 0;
  const drag = usePointerDrag(
    () => {
      select();
      return n;
    },
    (next) => def && set(fromNormalized(def, next)),
    120,
  );
  const names =
    targets.length > 1
      ? t('{label} (Amp + Mod)', { label: control.label })
      : (def?.name ?? control.label);

  return (
    <div className={styles.place} style={at(x, y)}>
      <div
        role="slider"
        tabIndex={0}
        aria-label={t('{label} fader — {names}', { label: control.label, names })}
        aria-orientation="vertical"
        aria-valuemin={def ? ariaRange(def).min : 0}
        aria-valuemax={def ? ariaRange(def).max : 1}
        aria-valuenow={def && value !== undefined ? ariaNow(def, value) : 0}
        aria-valuetext={def && value !== undefined ? formatValue(def, value) : undefined}
        title={def && value !== undefined ? `${names}: ${formatValue(def, value)}` : control.label}
        className={[styles.fader, styles.interactive, selected && styles.selected]
          .filter(Boolean)
          .join(' ')}
        style={{ borderRadius: 3 }}
        onKeyDown={(e) => def && value !== undefined && handleSliderKey(e, def, value, set)}
        onFocus={select}
        onDoubleClick={() => def && set(def.defaultValue)}
        {...drag}
      >
        <div className={styles.faderTicks} />
        <div className={styles.faderSlot} />
        <div className={styles.faderCap} style={{ bottom: `${n * 86 + 7}%` }} />
      </div>
      <span className={styles.label}>{control.label}</span>
    </div>
  );
}
