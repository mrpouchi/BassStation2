import type { MidiInfo, OnKeyName, ParameterDefinition } from '@/engine/parameters/types';
import { SYNC_VALUES } from '../syncValues';
import { documentedCc, documentedCcPair, documentedNrpn, noMidi, onKey, PANEL } from './helpers';

interface LfoSpec {
  n: 1 | 2;
  waveform: MidiInfo;
  speed: MidiInfo;
  delay: MidiInfo;
  keySync: MidiInfo;
  speedSync: MidiInfo;
  syncValue: MidiInfo;
  slew: MidiInfo;
  keys: { keySync: OnKeyName; speedSync: OnKeyName; slew: OnKeyName };
  defaults: { speed: number; keySync: boolean };
  destinations: string;
  related: readonly string[];
}

const DUPLICATE_NRPN_NOTE =
  'The manual lists this NRPN number for both "Sync value" and "Speed/Sync". Needs hardware verification.';

const LFOS: readonly LfoSpec[] = [
  {
    n: 1,
    waveform: documentedCc(88, undefined, 'The manual gives no MIDI values for the waveforms.'),
    speed: documentedCcPair(18, 50, '0 to 255'),
    delay: documentedCc(86, 'off, 1 to 127'),
    keySync: documentedNrpn(0, 89, 'OFF or On'),
    speedSync: documentedNrpn(0, 87, undefined, DUPLICATE_NRPN_NOTE),
    syncValue: documentedNrpn(
      0,
      87,
      undefined,
      DUPLICATE_NRPN_NOTE + ' Written as "NRPN 87" without an MSB.',
    ),
    slew: documentedNrpn(0, 86),
    keys: { keySync: 'lower G', speedSync: 'lower A', slew: 'lower B' },
    defaults: { speed: 75, keySync: false },
    destinations:
      'oscillator pitch (via the Osc LFO 1 depth controls, the mod wheel and aftertouch)',
    related: ['osc1.lfo1Depth', 'osc2.lfo1Depth', 'modWheel.lfo1ToOscPitch'],
  },
  {
    n: 2,
    waveform: documentedCc(89, undefined, 'The manual gives no MIDI values for the waveforms.'),
    speed: documentedCcPair(19, 51, '0 to 255'),
    delay: documentedCc(87, 'off, 1 to 127'),
    keySync: documentedNrpn(0, 93, 'OFF or On'),
    speedSync: documentedNrpn(0, 91, undefined, DUPLICATE_NRPN_NOTE),
    syncValue: documentedNrpn(
      0,
      91,
      undefined,
      DUPLICATE_NRPN_NOTE + ' Written as "NRPN 91" without an MSB.',
    ),
    slew: documentedNrpn(0, 90),
    keys: { keySync: 'lower G#', speedSync: 'lower A#', slew: 'middle C' },
    defaults: { speed: 52, keySync: true },
    destinations:
      'pulse width and filter frequency (via the PW LFO 2 and Filter LFO 2 depth controls)',
    related: ['filter.lfo2Depth', 'osc1.pwLfo2', 'osc2.pwLfo2', 'modWheel.lfo2ToFilterFreq'],
  },
];

function lfo(s: LfoSpec): ParameterDefinition[] {
  const p = `lfo${s.n}`;
  const name = `LFO ${s.n}`;
  return [
    {
      id: `${p}.waveform`,
      name: `${name} Waveform`,
      section: 'lfos',
      scope: 'patch',
      access: PANEL,
      kind: 'enum',
      options: [
        {
          value: 'triangle',
          label: 'Triangle',
          description: 'Smooth, even rise and fall: vibrato, gentle sweeps.',
        },
        { value: 'sawtooth', label: 'Sawtooth', description: 'Falling ramp, then a jump back up.' },
        {
          value: 'square',
          label: 'Square',
          description: 'Jumps between two values: trills, gated effects.',
        },
        { value: 'sample-hold', label: 'S&H', description: 'Random steps: computer-like bleeps.' },
      ],
      defaultValue: 'triangle',
      description: `Wave shape of ${name}.`,
      education: {
        explanation: `An LFO is an oscillator too slow to hear. Its shape is the shape of the movement it applies. ${name} drives ${s.destinations}.`,
        increase: 'Towards S&H: more abrupt, stepped movement.',
        decrease: 'Towards Triangle: smooth, continuous movement.',
      },
      concepts: ['lfo', 'waveform', 'modulation'],
      related: [`${p}.speed`, ...s.related],
      midi: s.waveform,
      source: { page: 48 },
      visuals: ['lfo'],
    },
    {
      id: `${p}.speed`,
      name: `${name} Speed`,
      section: 'lfos',
      scope: 'patch',
      access: PANEL,
      kind: 'continuous',
      min: 0,
      max: 255,
      step: 1,
      defaultValue: s.defaults.speed,
      rangeSource: 'documented',
      description: `Rate of ${name}, from zero to about 190 Hz. Turn the LFO knob with Delay/Speed set to Speed.`,
      education: {
        explanation:
          'Speed sets how many times per second the modulation repeats. Slow speeds give sweeps, moderate speeds give vibrato and wobble, and the fastest speeds reach audio rate. The Init patch values are 75 ≈ 7.9 Hz and 52 ≈ 3 Hz.',
        increase: 'Faster movement.',
        decrease: 'Slower movement.',
      },
      concepts: ['lfo', 'frequency'],
      related: [`${p}.delay`, `${p}.speedSync`],
      midi: s.speed,
      source: { page: 48 },
      visuals: ['lfo'],
    },
    {
      id: `${p}.delay`,
      name: `${name} Delay`,
      section: 'lfos',
      scope: 'patch',
      access: PANEL,
      kind: 'continuous',
      min: 0,
      max: 127,
      step: 1,
      defaultValue: 0,
      rangeSource: 'documented',
      valueLabels: { 0: 'Off' },
      description: `Fade-in time of ${name} after a key is pressed. Turn the LFO knob with Delay/Speed set to Delay.`,
      education: {
        explanation:
          'Singers and violinists usually start a note steady and add vibrato afterwards. LFO Delay copies this by ramping the modulation in gradually.',
        increase: 'The modulation fades in more slowly.',
        decrease: 'The modulation starts immediately.',
      },
      concepts: ['lfo', 'vibrato'],
      related: [`${p}.speed`],
      midi: s.delay,
      source: { page: 48 },
      visuals: ['lfo'],
    },
    {
      id: `${p}.keySync`,
      name: `${name} Key Sync`,
      section: 'lfos',
      scope: 'patch',
      access: onKey(s.keys.keySync),
      kind: 'toggle',
      defaultValue: s.defaults.keySync,
      description: `Restarts ${name} at the start of its waveform each time a key is pressed.`,
      education: {
        explanation:
          'Without key sync the LFO runs freely, so each note catches it at a random point. With key sync, every note starts the modulation from the same place, which makes it predictable and repeatable.',
        increase: 'On: every note starts the LFO cycle from the beginning.',
        decrease: 'Off: the LFO free-runs and each note differs.',
      },
      concepts: ['lfo'],
      related: [`${p}.waveform`],
      midi: s.keySync,
      source: { page: 49 },
      visuals: ['lfo'],
    },
    {
      id: `${p}.speedSync`,
      name: `${name} Speed/Sync`,
      section: 'lfos',
      scope: 'patch',
      access: onKey(s.keys.speedSync),
      kind: 'enum',
      options: [
        { value: 'speed', label: 'SPd', description: 'The LFO knob sets a free speed.' },
        {
          value: 'sync',
          label: 'Snc',
          description: 'The LFO knob selects a tempo-synced division.',
        },
      ],
      defaultValue: 'speed',
      description: `Whether the ${name} knob (in Speed mode) sets a free rate or a tempo-synced division.`,
      education: {
        explanation:
          'In Sync mode the LFO locks to the internal arpeggiator tempo or an external MIDI clock, so its movement stays in time with the music.',
        increase: 'Snc: the rate follows the tempo.',
        decrease: 'SPd: free-running rate in Hz.',
      },
      concepts: ['lfo', 'tempo'],
      related: [`${p}.speed`, `${p}.syncValue`, 'arp.tempo'],
      midi: s.speedSync,
      source: { page: 49 },
      visuals: ['lfo'],
    },
    {
      id: `${p}.syncValue`,
      name: `${name} Sync Value`,
      section: 'lfos',
      scope: 'patch',
      access: PANEL,
      kind: 'enum',
      options: SYNC_VALUES.map((v) => ({
        value: v.display,
        label: v.display,
        description: `${v.meaning} — ${v.musical} (${v.ticks} MIDI ticks)`,
      })),
      defaultValue: '4b',
      defaultInferred: true,
      description: `Tempo-synced rate of ${name}, selected with the LFO knob when Speed/Sync is set to Snc.`,
      education: {
        explanation:
          'Sync values range from one cycle every 16 bars (64b) to 48 cycles per bar (32t). The display uses short codes such as 4n (quarter note) and 8t (eighth-note triplet).',
        increase: 'Shorter divisions: faster, rhythmic movement.',
        decrease: 'Longer divisions: slow evolving sweeps over many bars.',
      },
      concepts: ['lfo', 'tempo'],
      related: [`${p}.speedSync`],
      midi: s.syncValue,
      source: { page: 67 },
      visuals: ['lfo'],
    },
    {
      id: `${p}.slew`,
      name: `${name} Slew`,
      section: 'lfos',
      scope: 'patch',
      access: onKey(s.keys.slew),
      kind: 'continuous',
      min: 0,
      max: 127,
      step: 1,
      defaultValue: 0,
      rangeSource: 'documented',
      description: `Smooths the sharp edges of the ${name} waveform.`,
      education: {
        explanation:
          'Slew rounds off sudden jumps. A square LFO that flips between two pitches starts to glide between them instead. High settings can stop the waveform from ever reaching full amplitude.',
        increase: 'Smoother, rounder edges, with lower peak amplitude at high values.',
        decrease: 'Sharp, unmodified edges.',
      },
      concepts: ['lfo'],
      related: [`${p}.waveform`],
      midi: s.slew,
      source: { page: 49 },
      visuals: ['lfo'],
    },
  ];
}

export const lfoParameters: readonly ParameterDefinition[] = [
  {
    id: 'panel.lfoDelaySpeed',
    name: 'LFO Delay/Speed',
    section: 'lfos',
    scope: 'panel',
    access: PANEL,
    kind: 'enum',
    options: [
      { value: 'delay', label: 'Delay' },
      { value: 'speed', label: 'Speed' },
    ],
    defaultValue: 'speed',
    description: 'Sets whether the two LFO knobs adjust LFO speed or LFO delay.',
    education: {
      explanation:
        'Each LFO has one knob with two jobs. This switch decides whether the knobs set how fast the LFOs run or how slowly they fade in.',
      increase: 'Speed: the knobs set the rate (or sync division).',
      decrease: 'Delay: the knobs set the fade-in time.',
    },
    concepts: ['lfo'],
    related: ['lfo1.speed', 'lfo1.delay', 'lfo2.speed', 'lfo2.delay'],
    midi: noMidi('Panel routing switch.'),
    source: { page: 10, note: 'Callout 23' },
    visuals: [],
  },
  ...LFOS.flatMap(lfo),
];
