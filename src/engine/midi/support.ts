/**
 * Web MIDI capability detection. This reports what the *browser* allows; it
 * does not request access or claim that any device is connected.
 */
export type WebMidiSupport = 'available' | 'insecure-context' | 'unsupported';

export function detectWebMidiSupport(
  nav: Pick<Navigator, 'requestMIDIAccess'> | undefined = typeof navigator === 'undefined'
    ? undefined
    : navigator,
  secure: boolean = typeof window !== 'undefined' && window.isSecureContext,
): WebMidiSupport {
  if (!nav || typeof nav.requestMIDIAccess !== 'function') return 'unsupported';
  if (!secure) return 'insecure-context';
  return 'available';
}

export const WEB_MIDI_SUPPORT_TEXT: Record<WebMidiSupport, { label: string; detail: string }> = {
  available: {
    label: 'Web MIDI available',
    detail:
      'This browser supports USB MIDI. Connecting to a Bass Station II arrives in the MIDI milestone.',
  },
  'insecure-context': {
    label: 'MIDI needs HTTPS',
    detail: 'Web MIDI only works on HTTPS or localhost.',
  },
  unsupported: {
    label: 'Web MIDI unsupported',
    detail:
      'This browser does not support Web MIDI. Use desktop Chrome for hardware features. Everything else works without hardware.',
  },
};
