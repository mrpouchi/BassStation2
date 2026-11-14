import type { SectionId } from '@/engine/parameters/types';

export interface SectionInfo {
  readonly id: SectionId;
  readonly name: string;
  readonly summary: string;
}

/** Ordered roughly by signal flow: source → shaping → modulation → performance. */
export const SECTIONS: readonly SectionInfo[] = [
  { id: 'master', name: 'Master', summary: 'Volume, patch selection and saving.' },
  {
    id: 'oscillators',
    name: 'Oscillators',
    summary: 'Two oscillators that generate the raw waveforms.',
  },
  {
    id: 'sub-oscillator',
    name: 'Sub Oscillator',
    summary: 'Adds weight one or two octaves below Osc 1.',
  },
  { id: 'mixer', name: 'Mixer', summary: 'Blends six sources before the filter.' },
  { id: 'filter', name: 'Filter', summary: 'Removes harmonics to sculpt the tone.' },
  {
    id: 'envelopes',
    name: 'Envelopes',
    summary: 'Shape volume and modulation over the life of a note.',
  },
  { id: 'lfos', name: 'LFOs', summary: 'Two slow oscillators that create cyclic movement.' },
  {
    id: 'effects',
    name: 'Effects',
    summary: 'Post-filter distortion and audio-rate filter modulation.',
  },
  { id: 'portamento', name: 'Portamento', summary: 'Pitch glide between notes.' },
  { id: 'arpeggiator', name: 'Arpeggiator', summary: 'Arpeggiator and 32-step sequencer.' },
  {
    id: 'performance',
    name: 'Performance',
    summary: 'Wheels, aftertouch, sustain, octave and transpose.',
  },
  {
    id: 'modulation-matrix',
    name: 'Mod Wheel & Aftertouch',
    summary: 'On-Key routings for the wheel and aftertouch.',
  },
  {
    id: 'voice',
    name: 'Voice',
    summary: 'Sync, paraphony, velocity, bend range and other voice settings.',
  },
  {
    id: 'global',
    name: 'Global',
    summary: 'Instrument-wide settings: MIDI, tuning, input gain, AFX mode.',
  },
];

const byId = new Map(SECTIONS.map((s) => [s.id, s]));

export function getSection(id: SectionId): SectionInfo {
  const s = byId.get(id);
  if (!s) throw new Error(`Unknown section: ${id}`);
  return s;
}
