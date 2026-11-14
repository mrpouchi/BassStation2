import type { MidiInfo, ParameterAccess } from '@/engine/parameters/types';

/**
 * Documented MIDI mapping that has not yet been verified against hardware.
 * Every mapping starts here; only a hardware test session may upgrade it.
 */
export function documentedCc(
  cc: number,
  documentedRange?: string,
  notes?: string,
  lsbCc?: number,
): MidiInfo {
  return {
    mapping: lsbCc === undefined ? { type: 'cc', cc } : { type: 'cc', cc, lsbCc },
    verification: 'requires-testing',
    ...(documentedRange !== undefined && { documentedRange }),
    ...(notes !== undefined && { notes }),
  };
}

/** Manual notation "a:b" for CCs = coarse CC a + fine CC b. */
export function documentedCcPair(
  msb: number,
  lsb: number,
  documentedRange?: string,
  notes?: string,
): MidiInfo {
  return documentedCc(msb, documentedRange, notes, lsb);
}

export function documentedNrpn(
  msb: number,
  lsb: number,
  documentedRange?: string,
  notes?: string,
): MidiInfo {
  return {
    mapping: { type: 'nrpn', msb, lsb },
    verification: 'requires-testing',
    ...(documentedRange !== undefined && { documentedRange }),
    ...(notes !== undefined && { notes }),
  };
}

export function noMidi(notes = 'No MIDI message is documented for this parameter.'): MidiInfo {
  return { mapping: null, verification: 'not-supported', notes };
}

export const PANEL: ParameterAccess = { kind: 'panel' };

export function onKey(
  key: Extract<ParameterAccess, { kind: 'on-key' }>['key'],
  presses = 1,
): ParameterAccess {
  return { kind: 'on-key', key, presses };
}
