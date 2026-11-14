import type { MidiMapping, MidiVerification } from '@/engine/parameters/types';

/** Human-readable MIDI address, using the manual's notation. */
export function describeMidiMapping(mapping: MidiMapping | null): string {
  if (mapping === null) return '—';
  switch (mapping.type) {
    case 'cc':
      return mapping.lsbCc === undefined ? `CC ${mapping.cc}` : `CC ${mapping.cc}:${mapping.lsbCc}`;
    case 'nrpn':
      return `NRPN ${mapping.msb}:${mapping.lsb}`;
    case 'rpn':
      return `RPN ${mapping.msb}:${mapping.lsb}`;
    case 'program-change':
      return 'Program Change';
    case 'pitch-bend':
      return 'Pitch Bend';
    case 'channel-pressure':
      return 'Channel Pressure';
  }
}

export const VERIFICATION_LABELS: Record<MidiVerification, string> = {
  'both-verified': 'Verified (in + out)',
  'input-verified': 'Input verified',
  'output-verified': 'Output verified',
  'requires-testing': 'Documented, untested',
  'not-supported': 'No MIDI',
};

/** True only when hardware tests have confirmed the direction. */
export function isVerified(v: MidiVerification, direction: 'input' | 'output'): boolean {
  return v === 'both-verified' || v === `${direction}-verified`;
}
