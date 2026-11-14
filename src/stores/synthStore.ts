import { create } from 'zustand';
import {
  defaultValues,
  findParameter,
  normalizeValue,
  sanitizeValues,
} from '@/engine/parameters/registry';
import type { ParameterValue } from '@/engine/parameters/types';

/**
 * The single live parameter state shared by every view. Components never keep
 * their own copy of a parameter value: they read and write here.
 */
export type ChangeOrigin = 'ui' | 'midi' | 'preset' | 'system';

interface SynthState {
  values: Record<string, ParameterValue>;
  /** Parameter currently shown in the inspector. */
  selectedId: string | null;
  /** Origin of the most recent change; lets the MIDI layer avoid echo loops. */
  lastChange: { id: string; origin: ChangeOrigin } | null;

  setValue: (id: string, raw: unknown, origin?: ChangeOrigin) => boolean;
  replaceValues: (input: unknown, origin?: ChangeOrigin) => string[];
  resetToInit: () => void;
  select: (id: string | null) => void;
}

export const useSynthStore = create<SynthState>()((set, get) => ({
  values: defaultValues(),
  selectedId: null,
  lastChange: null,

  setValue: (id, raw, origin = 'ui') => {
    const def = findParameter(id);
    if (!def) return false;
    const value = normalizeValue(def, raw);
    if (value === undefined) return false;
    if (get().values[id] === value) return true;
    set((s) => ({ values: { ...s.values, [id]: value }, lastChange: { id, origin } }));
    return true;
  },

  replaceValues: (input, origin = 'system') => {
    const { values, rejected } = sanitizeValues(input);
    set({ values, lastChange: { id: '*', origin } });
    return rejected;
  },

  resetToInit: () => set({ values: defaultValues(), lastChange: { id: '*', origin: 'system' } }),

  select: (id) => set({ selectedId: id !== null && findParameter(id) ? id : null }),
}));

/** Subscribe a component to a single parameter value. */
export function useParameterValue(id: string): ParameterValue | undefined {
  return useSynthStore((s) => s.values[id]);
}
