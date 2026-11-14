import { formatValue, getParameter } from '@/engine/parameters/registry';
import { useSynthStore } from '@/stores/synthStore';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import styles from './ParameterEditor.module.css';

interface ParameterEditorProps {
  id: string;
}

/**
 * Generic editor bound to the shared synth store. Used by the inspector and
 * the Learning View; the Hardware View uses dedicated knob/switch components
 * that read and write the same store.
 */
export function ParameterEditor({ id }: ParameterEditorProps) {
  const def = getParameter(id);
  const value = useSynthStore((s) => s.values[id]);
  const setValue = useSynthStore((s) => s.setValue);
  if (value === undefined) return null;

  switch (def.kind) {
    case 'continuous': {
      const numeric = typeof value === 'number' ? value : def.defaultValue;
      return (
        <div className={styles.editor}>
          <div className={styles.row}>
            <input
              className={styles.range}
              type="range"
              min={def.min}
              max={def.max}
              step={def.step}
              value={numeric}
              aria-label={def.name}
              aria-valuetext={formatValue(def, numeric)}
              onChange={(e) => setValue(id, Number(e.target.value))}
              onDoubleClick={() => setValue(id, def.defaultValue)}
            />
            <output className={`${styles.value} mono`}>{formatValue(def, numeric)}</output>
          </div>
          <div className={`${styles.limits} mono`}>
            <span>{formatValue(def, def.min)}</span>
            <span>{formatValue(def, def.max)}</span>
          </div>
        </div>
      );
    }
    case 'enum': {
      const current = String(value);
      if (def.options.length <= 4) {
        return (
          <SegmentedControl
            label={def.name}
            fullWidth
            options={def.options.map((o) => ({
              value: o.value,
              label: o.label,
              ...(o.description !== undefined && { title: o.description }),
            }))}
            value={current}
            onChange={(v) => setValue(id, v)}
          />
        );
      }
      return (
        <select
          className={styles.select}
          aria-label={def.name}
          value={current}
          onChange={(e) => setValue(id, e.target.value)}
        >
          {def.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
              {o.description ? ` — ${o.description}` : ''}
            </option>
          ))}
        </select>
      );
    }
    case 'toggle': {
      const on = value === true;
      return (
        <div className={styles.row}>
          <button
            type="button"
            role="switch"
            aria-checked={on}
            aria-label={def.name}
            className={styles.switch}
            onClick={() => setValue(id, !on)}
          />
          <span className="mono">{formatValue(def, on)}</span>
        </div>
      );
    }
  }
}
