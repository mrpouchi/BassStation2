import type { KeyboardEvent } from 'react';
import { stepValue } from '@/engine/parameters/registry';
import type { ParameterDefinition, ParameterValue } from '@/engine/parameters/types';

/** Standard slider keyboard handling: arrows, PageUp/Down (×10), Home/End. */
export function handleSliderKey(
  e: KeyboardEvent,
  def: ParameterDefinition,
  value: ParameterValue,
  set: (v: ParameterValue) => void,
): void {
  let next: ParameterValue | undefined;
  switch (e.key) {
    case 'ArrowUp':
    case 'ArrowRight':
      next = stepValue(def, value, e.shiftKey ? 10 : 1);
      break;
    case 'ArrowDown':
    case 'ArrowLeft':
      next = stepValue(def, value, e.shiftKey ? -10 : -1);
      break;
    case 'PageUp':
      next = stepValue(def, value, 10);
      break;
    case 'PageDown':
      next = stepValue(def, value, -10);
      break;
    case 'Home':
      next =
        def.kind === 'continuous' ? def.min : def.kind === 'enum' ? def.options[0]?.value : false;
      break;
    case 'End':
      next =
        def.kind === 'continuous'
          ? def.max
          : def.kind === 'enum'
            ? def.options[def.options.length - 1]?.value
            : true;
      break;
    default:
      return;
  }
  e.preventDefault();
  if (next !== undefined) set(next);
}

export function ariaRange(def: ParameterDefinition): { min: number; max: number } {
  if (def.kind === 'continuous') return { min: def.min, max: def.max };
  if (def.kind === 'enum') return { min: 0, max: def.options.length - 1 };
  return { min: 0, max: 1 };
}

export function ariaNow(def: ParameterDefinition, value: ParameterValue): number {
  if (def.kind === 'continuous') return typeof value === 'number' ? value : def.defaultValue;
  if (def.kind === 'enum')
    return Math.max(
      0,
      def.options.findIndex((o) => o.value === value),
    );
  return value === true ? 1 : 0;
}
