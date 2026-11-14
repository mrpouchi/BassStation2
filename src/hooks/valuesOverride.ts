import { createContext, useContext } from 'react';
import type { ParameterValue } from '@/engine/parameters/types';

/**
 * When provided, visualisers render these values instead of the live synth
 * state (used for lesson demonstrations and challenge prompts).
 */
export const ValuesOverrideContext = createContext<Readonly<Record<string, ParameterValue>> | null>(
  null,
);

export function useValuesOverride() {
  return useContext(ValuesOverrideContext);
}

/** Presentation options for visualisers (e.g. hide numeric readouts in quizzes). */
export const VizOptionsContext = createContext<{ hideReadout: boolean }>({ hideReadout: false });

export function useVizOptions() {
  return useContext(VizOptionsContext);
}
