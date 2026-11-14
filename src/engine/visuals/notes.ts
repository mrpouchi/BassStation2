/**
 * Note helpers. Novation names MIDI 69 "A3" (= 440 Hz at 8', manual p. 68),
 * so middle C (MIDI 60) is "C3". The lowest key at octave 0 is one octave
 * below middle C (p. 17): MIDI 48.
 */
const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

export const LOWEST_KEY_MIDI = 48;

export function noteName(midi: number): string {
  return `${NAMES[((midi % 12) + 12) % 12] ?? '?'}${Math.floor(midi / 12) - 2}`;
}

export function midiToHz(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/** MIDI note produced by key index 0–24 with octave shift and transpose. */
export function keyToMidi(keyIndex: number, octave: number, transpose: number): number {
  return LOWEST_KEY_MIDI + keyIndex + octave * 12 + transpose;
}
