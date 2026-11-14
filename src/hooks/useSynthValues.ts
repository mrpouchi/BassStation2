import { useShallow } from 'zustand/react/shallow';
import type { ParameterValue } from '@/engine/parameters/types';
import { useSynthStore } from '@/stores/synthStore';

/** Subscribe to several parameter values; re-renders only when one of them changes. */
export function useSynthValues<const K extends readonly string[]>(
  ids: K,
): Record<K[number], ParameterValue> {
  return useSynthStore(
    useShallow((s) => {
      const out: Record<string, ParameterValue> = {};
      for (const id of ids) {
        const v = s.values[id];
        if (v !== undefined) out[id] = v;
      }
      return out as Record<K[number], ParameterValue>;
    }),
  );
}

export const num = (v: ParameterValue | undefined, fallback = 0): number =>
  typeof v === 'number' ? v : fallback;
export const str = (v: ParameterValue | undefined, fallback = ''): string =>
  typeof v === 'string' ? v : fallback;
export const bool = (v: ParameterValue | undefined): boolean => v === true;
