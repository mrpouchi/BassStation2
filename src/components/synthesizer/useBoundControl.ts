import { useCallback } from 'react';
import { findControl, findParameter, resolveControlTarget } from '@/engine/parameters/registry';
import type {
  ControlDefinition,
  ParameterDefinition,
  ParameterValue,
} from '@/engine/parameters/types';
import { useHardwareUiStore } from '@/stores/hardwareUiStore';
import { useSynthStore } from '@/stores/synthStore';

export interface BoundControl {
  control: ControlDefinition;
  /** Parameters currently edited (after routing). */
  targets: string[];
  def: ParameterDefinition | undefined;
  value: ParameterValue | undefined;
  selected: boolean;
  set: (value: ParameterValue) => void;
  select: () => void;
}

/**
 * Connects a physical control to the shared store: resolves routing through
 * panel switches (and Function mode), writes to every routed target, marks
 * the value as "touched" for the LED display and selects it in the inspector.
 */
export function useBoundControl(controlId: string): BoundControl {
  const control = findControl(controlId);
  if (!control) throw new Error(`Unknown control ${controlId}`);
  const functionActive = useHardwareUiStore((s) => s.functionActive);
  const touch = useHardwareUiStore((s) => s.touch);

  const target = functionActive && control.functionTarget ? control.functionTarget : control.target;
  const targets = useSynthStore((s) => resolveControlTarget(target, s.values).join('|'));
  const ids = targets ? targets.split('|') : [];
  const primary = ids[0];
  const value = useSynthStore((s) => (primary ? s.values[primary] : undefined));
  const selected = useSynthStore((s) => primary !== undefined && s.selectedId === primary);
  const setValue = useSynthStore((s) => s.setValue);
  const selectId = useSynthStore((s) => s.select);

  const set = useCallback(
    (v: ParameterValue) => {
      for (const id of targets.split('|')) if (id) setValue(id, v, 'ui');
      const first = targets.split('|')[0];
      if (first) {
        touch(first);
        selectId(first);
      }
    },
    [targets, setValue, touch, selectId],
  );

  const select = useCallback(() => {
    if (primary) {
      selectId(primary);
      touch(primary);
    }
  }, [primary, selectId, touch]);

  return {
    control,
    targets: ids,
    def: primary ? findParameter(primary) : undefined,
    value,
    selected,
    set,
    select,
  };
}
