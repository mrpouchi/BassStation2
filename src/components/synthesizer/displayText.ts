import type { ParameterDefinition, ParameterValue } from '@/engine/parameters/types';

/** Renders a value as up to 3 characters (plus a decimal point), like the 7-segment display. */
export function displayText(def: ParameterDefinition, value: ParameterValue): string {
  switch (def.kind) {
    case 'toggle':
      if (def.labels) return value === true ? def.labels[1] : def.labels[0];
      return value === true ? 'On' : 'OFF';
    case 'enum': {
      const label = def.options.find((o) => o.value === value)?.label ?? String(value);
      return label.replace(/[^A-Za-z0-9+\-']/g, '').slice(0, 3);
    }
    case 'continuous': {
      if (typeof value !== 'number') return '---';
      if (def.step < 1 && Math.abs(value) < 10) return value.toFixed(1);
      return String(Math.round(value)).slice(0, 4);
    }
  }
}
