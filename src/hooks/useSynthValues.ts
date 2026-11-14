import { useShallow } from 'zustand/react/shallow';
import type { ParameterValue } from '@/engine/parameters/types';
import { useSynthStore } from '@/stores/synthStore';
import { useValuesOverride } from './valuesOverride';

type Values = Readonly<Record<string, ParameterValue>>;

/**
 * Subscribe to several parameter values; re-renders only when one of them changes.
 * Inside a ValuesOverrideContext the override values are returned instead.
 */
export function useSynthValues<const K extends readonly string[]>(
  ids: K,
): Record<K[number], ParameterValue> {
  const override = useValuesOverride();
  const live = useSynthStore(
    useShallow((s) => {
      const out: Record<string, ParameterValue> = {};
      for (const id of ids) {
        const v = s.values[id];
        if (v !== undefined) out[id] = v;
      }
      return out as Record<K[number], ParameterValue>;
    }),
  );
  return override ? (pick(override, ids) as Record<K[number], ParameterValue>) : live;
}

const cache = new WeakMap<Values, Map<string, Record<string, ParameterValue>>>();

/** Stable subset of an override object, so consumers' useMemo stays effective. */
function pick(source: Values, ids: readonly string[]): Record<string, ParameterValue> {
  const key = ids.join('|');
  let byKey = cache.get(source);
  if (!byKey) {
    byKey = new Map();
    cache.set(source, byKey);
  }
  let out = byKey.get(key);
  if (!out) {
    out = {};
    for (const id of ids) {
      const v = source[id];
      if (v !== undefined) out[id] = v;
    }
    byKey.set(key, out);
  }
  return out;
}

export const num = (v: ParameterValue | undefined, fallback = 0): number =>
  typeof v === 'number' ? v : fallback;
export const str = (v: ParameterValue | undefined, fallback = ''): string =>
  typeof v === 'string' ? v : fallback;
export const bool = (v: ParameterValue | undefined): boolean => v === true;
