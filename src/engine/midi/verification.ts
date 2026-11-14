import type { MidiVerification, ParameterDefinition } from '@/engine/parameters/types';
import type { LocalVerification } from '@/stores/midiStore';

/**
 * Combines the registry status (documentation) with the user's own hardware
 * test results. Local results are labelled as such in the UI.
 */
export function effectiveVerification(
  def: ParameterDefinition,
  local: LocalVerification | undefined,
): { status: MidiVerification; local: boolean } {
  if (def.midi.mapping === null) return { status: 'not-supported', local: false };
  const input = local?.input === 'pass';
  const output = local?.output === 'pass';
  if (input && output) return { status: 'both-verified', local: true };
  if (input) return { status: 'input-verified', local: true };
  if (output) return { status: 'output-verified', local: true };
  return { status: def.midi.verification, local: false };
}
