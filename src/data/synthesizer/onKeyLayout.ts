import type { OnKeyName } from '@/engine/parameters/types';

/**
 * On-Key function labels printed above each key (user guide v5.0, pp. 57–65).
 * The parameters reached through each key (including multi-press functions)
 * are derived from `access` in the parameter registry, not duplicated here.
 */
export interface OnKeyEntry {
  readonly key: OnKeyName;
  readonly group:
    | 'Mod Wh'
    | 'Aftertouch'
    | 'LFO'
    | 'Oscillator'
    | 'Velocity'
    | 'VCA'
    | 'Arp'
    | 'Global';
  readonly label: string;
  /** Present for keys that trigger an action instead of editing a value. */
  readonly action?: string;
}

export const ON_KEY_LAYOUT: readonly OnKeyEntry[] = [
  { key: 'lower C', group: 'Mod Wh', label: 'Filter Freq' },
  { key: 'lower C#', group: 'Mod Wh', label: 'LFO 1 to Osc Pitch' },
  { key: 'lower D', group: 'Mod Wh', label: 'LFO 2 to Filter Freq' },
  { key: 'lower D#', group: 'Mod Wh', label: 'Osc 2 Pitch' },
  { key: 'lower E', group: 'Aftertouch', label: 'Filter Freq' },
  { key: 'lower F', group: 'Aftertouch', label: 'LFO 1 to Osc Pitch' },
  { key: 'lower F#', group: 'Aftertouch', label: 'LFO 2 Speed' },
  { key: 'lower G', group: 'LFO', label: 'Keysync LFO 1' },
  { key: 'lower G#', group: 'LFO', label: 'Keysync LFO 2' },
  { key: 'lower A', group: 'LFO', label: 'Speed/Sync LFO 1' },
  { key: 'lower A#', group: 'LFO', label: 'Speed/Sync LFO 2' },
  { key: 'lower B', group: 'LFO', label: 'Slew LFO 1' },
  { key: 'middle C', group: 'LFO', label: 'Slew LFO 2' },
  { key: 'upper C#', group: 'Oscillator', label: 'Pitch Bend Range' },
  { key: 'upper D', group: 'Oscillator', label: 'Osc 1-2 Sync' },
  { key: 'upper D#', group: 'Velocity', label: 'Amp Env' },
  { key: 'upper E', group: 'Velocity', label: 'Mod Env' },
  { key: 'upper F', group: 'VCA', label: 'Limiter' },
  { key: 'upper F#', group: 'Arp', label: 'Swing' },
  { key: 'upper G', group: 'Arp', label: 'Seq Retrig' },
  { key: 'upper G#', group: 'Global', label: 'MIDI Channel' },
  { key: 'upper A', group: 'Global', label: 'Local' },
  { key: 'upper A#', group: 'Global', label: 'Tune' },
  { key: 'upper B', group: 'Global', label: 'Input Gain' },
  { key: 'upper C', group: 'Global', label: 'Dump', action: 'sysex-dump' },
];
