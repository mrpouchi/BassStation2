import type { ParameterDefinition } from '@/engine/parameters/types';
import { arpeggiatorParameters } from './arpeggiator';
import { envelopeParameters } from './envelopes';
import { effectsAndPortamentoParameters, filterParameters } from './filterAndEffects';
import { lfoParameters } from './lfos';
import {
  globalParameters,
  masterParameters,
  modulationMatrixParameters,
  performanceParameters,
  voiceParameters,
} from './masterAndPerformance';
import { oscillatorParameters } from './oscillators';
import { mixerParameters, subOscillatorParameters } from './subOscillatorAndMixer';

/**
 * THE canonical parameter registry. Every module (Synth Lab, inspector,
 * visualizers, challenges, MIDI, presets) must read definitions from here.
 */
export const PARAMETERS: readonly ParameterDefinition[] = [
  ...masterParameters,
  ...oscillatorParameters,
  ...subOscillatorParameters,
  ...mixerParameters,
  ...filterParameters,
  ...envelopeParameters,
  ...lfoParameters,
  ...effectsAndPortamentoParameters,
  ...arpeggiatorParameters,
  ...performanceParameters,
  ...modulationMatrixParameters,
  ...voiceParameters,
  ...globalParameters,
];
