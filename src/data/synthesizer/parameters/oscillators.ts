import type { MidiInfo, ParameterDefinition } from '@/engine/parameters/types';
import { documentedCc, documentedCcPair, documentedNrpn, noMidi, PANEL } from './helpers';

/** MIDI numbers per oscillator, from the manual's MIDI parameters list (p. 71). */
interface OscillatorMidi {
  fine: MidiInfo;
  range: MidiInfo;
  coarse: MidiInfo;
  waveform: MidiInfo;
  modEnvDepth: MidiInfo;
  lfo1Depth: MidiInfo;
  pwModEnv: MidiInfo;
  pwLfo2: MidiInfo;
  pwManual: MidiInfo;
}

const OSC_MIDI: Record<1 | 2, OscillatorMidi> = {
  1: {
    fine: documentedCcPair(26, 58, '-100 to 100* (to 1 dec place, no 0 for ints)'),
    range: documentedCc(70, "16',8',4',2' (MIDI val of 63, 64, 65, 66)"),
    coarse: documentedCcPair(27, 59, '-12. to 12.'),
    waveform: documentedNrpn(0, 72, 'sine, tri, saw, pulse'),
    modEnvDepth: documentedCc(71, '-63 to +63*'),
    lfo1Depth: documentedCcPair(28, 60, '-127 to 127*'),
    pwModEnv: documentedCc(72, '-63 to 63*'),
    pwLfo2: documentedCc(73, '-90 to 90 (MIDI val of 63 & 64 = 0%)'),
    pwManual: documentedCc(74, '5. to 95. (MIDI val of 64 = 50%)'),
  },
  2: {
    fine: documentedCcPair(29, 61, '-100 to 100* (to 1 dec place, no 0 for ints)'),
    range: documentedCc(75, "16',8',4',2' (MIDI val of 63, 64, 65, 66)"),
    coarse: documentedCcPair(30, 62, '-12. to 12* (to 1 dec place, no 0 for ints)'),
    waveform: documentedNrpn(0, 82, 'sine, tri, saw, pulse'),
    modEnvDepth: documentedCc(76, '-63 to +63*'),
    lfo1Depth: documentedCcPair(31, 63, '-127 to 127*'),
    pwModEnv: documentedCc(
      77,
      '-63 to +63*',
      'Listed in the manual as "osc 2 env 2 PW mod amount".',
    ),
    pwLfo2: documentedCc(78, '-90 to 90 (MIDI val of 63 & 64 = 0%)'),
    pwManual: documentedCc(
      79,
      '5. to 94.3 (MIDI val of 64 = 50%)',
      'The manual lists 94.3 as the Osc 2 maximum but 95 for Osc 1 and on p. 36. The app uses 5–95 until verified on hardware.',
    ),
  },
};

function oscillator(n: 1 | 2): ParameterDefinition[] {
  const p = `osc${n}`;
  const m = OSC_MIDI[n];
  const other = n === 1 ? 'osc2' : 'osc1';
  return [
    {
      id: `${p}.waveform`,
      name: `Osc ${n} Waveform`,
      section: 'oscillators',
      scope: 'patch',
      access: PANEL,
      kind: 'enum',
      options: [
        {
          value: 'sine',
          label: 'Sine',
          description: 'Pure tone: a fundamental with no harmonics.',
        },
        {
          value: 'triangle',
          label: 'Triangle',
          description: 'Soft tone: odd harmonics that fall away quickly.',
        },
        {
          value: 'sawtooth',
          label: 'Sawtooth',
          description: 'Bright, buzzy tone containing every harmonic.',
        },
        {
          value: 'pulse',
          label: 'Pulse',
          description: 'Hollow tone whose colour depends on pulse width.',
        },
      ],
      defaultValue: 'sawtooth',
      description: `Selects the fundamental wave shape of Oscillator ${n}.`,
      education: {
        explanation:
          'The waveform is the raw material of every subtractive sound. Each shape contains a different recipe of harmonics, and the filter can only remove harmonics that are already there.',
        increase:
          'Stepping from sine towards sawtooth adds harmonics: the sound gets brighter and richer.',
        decrease: 'Stepping back towards sine removes harmonics: the sound gets purer and darker.',
        experiment:
          'Hold one note and step through all four waveforms. Notice how the sine sounds “empty” and the sawtooth sounds “full”.',
      },
      concepts: ['waveform', 'harmonics', 'timbre', 'oscillator'],
      related: [`${p}.pwManual`, 'filter.frequency'],
      midi: m.waveform,
      source: { page: 34 },
      visuals: ['waveform'],
    },
    {
      id: `${p}.range`,
      name: `Osc ${n} Range`,
      section: 'oscillators',
      scope: 'patch',
      access: PANEL,
      kind: 'enum',
      options: [
        { value: '16', label: "16'", description: 'One octave below concert pitch.' },
        { value: '8', label: "8'", description: 'Concert pitch (A3 = 440 Hz).' },
        { value: '4', label: "4'", description: 'One octave above concert pitch.' },
        { value: '2', label: "2'", description: 'Two octaves above concert pitch.' },
      ],
      defaultValue: '8',
      description: `Sets the base octave of Oscillator ${n} in organ-stop footages.`,
      education: {
        explanation:
          'Range uses traditional organ “footage”. Halving the footage doubles the frequency, which raises the pitch by exactly one octave.',
        increase: "Moving towards 2' raises the pitch in whole-octave steps.",
        decrease: "Moving towards 16' lowers the pitch in whole-octave steps.",
        experiment: `Set Osc 1 and Osc 2 to the same waveform, then put one at 8' and the other at 16'. You will hear an octave interval that blends into one thicker tone.`,
      },
      concepts: ['pitch', 'octave', 'frequency'],
      related: [`${p}.coarse`, `${p}.fine`],
      midi: m.range,
      source: { page: 34 },
      visuals: ['waveform'],
    },
    {
      id: `${p}.coarse`,
      name: `Osc ${n} Coarse`,
      section: 'oscillators',
      scope: 'patch',
      access: PANEL,
      kind: 'continuous',
      min: -12,
      max: 12,
      step: 0.1,
      defaultValue: 0,
      unit: 'st',
      bipolar: true,
      rangeSource: 'documented',
      description: `Tunes Oscillator ${n} over ±1 octave, shown in semitones.`,
      education: {
        explanation:
          'Coarse tuning shifts the pitch in semitones. Tuning the two oscillators to a musical interval, such as +7 semitones (a fifth), turns one key press into a two-note chord.',
        increase: 'Raises the pitch, up to 12 semitones (one octave).',
        decrease: 'Lowers the pitch, down to 12 semitones (one octave).',
        experiment: `Set Osc 2 Coarse to +7 with both oscillators in the mixer. Play a single note and listen for the “power-chord” fifth.`,
      },
      concepts: ['pitch', 'semitone'],
      related: [`${p}.fine`, `${p}.range`, `${other}.coarse`],
      midi: m.coarse,
      source: { page: 35 },
      visuals: ['waveform'],
    },
    {
      id: `${p}.fine`,
      name: `Osc ${n} Fine`,
      section: 'oscillators',
      scope: 'patch',
      access: PANEL,
      kind: 'continuous',
      min: -100,
      max: 100,
      step: 1,
      defaultValue: 0,
      unit: 'ct',
      bipolar: true,
      rangeSource: 'documented',
      description: `Fine-tunes Oscillator ${n} over ±100 cents (±1 semitone).`,
      education: {
        explanation:
          'A cent is one hundredth of a semitone. Slightly detuning one oscillator against the other makes the two waves drift in and out of phase. You hear this as a slow “beating” that thickens the sound.',
        increase:
          'Raises the pitch slightly. Small values against the other oscillator create a chorus-like beating.',
        decrease:
          'Lowers the pitch slightly. Larger detune makes the beating faster and more out-of-tune.',
        experiment:
          'Mix both oscillators with sawtooth waves and set Osc 2 Fine to about +8 cents. Listen to the movement, then try +30.',
      },
      concepts: ['pitch', 'cent'],
      related: [`${p}.coarse`, `${other}.fine`],
      midi: m.fine,
      source: { page: 35 },
      visuals: ['waveform'],
    },
    {
      id: `${p}.modEnvDepth`,
      name: `Osc ${n} Pitch Mod Env Depth`,
      section: 'oscillators',
      scope: 'patch',
      access: PANEL,
      kind: 'continuous',
      min: -63,
      max: 63,
      step: 1,
      defaultValue: 0,
      bipolar: true,
      rangeSource: 'documented',
      description: `Amount by which the Mod Envelope bends the pitch of Oscillator ${n}. Centre-off.`,
      education: {
        explanation:
          'The Mod Envelope can move the pitch over the life of a note. With Sustain at maximum, a value of 8 moves the pitch by one octave, and the maximum value covers eight octaves.',
        increase:
          'Positive values make the pitch rise as the envelope rises, which is useful for zaps and laser sounds.',
        decrease:
          'Negative values make the pitch fall during the attack, giving classic drum and “pew” sounds.',
        experiment:
          'Set Mod Env Attack 0, Decay short, Sustain 0, then set this depth to +30. Each note now starts with a fast pitch drop… then try a negative value.',
      },
      concepts: ['modulation', 'envelope', 'pitch', 'modulation-depth'],
      related: ['modEnv.attack', 'modEnv.decay', 'modEnv.sustain'],
      midi: m.modEnvDepth,
      source: { page: 35 },
      visuals: ['envelope', 'waveform'],
    },
    {
      id: `${p}.lfo1Depth`,
      name: `Osc ${n} Pitch LFO 1 Depth`,
      section: 'oscillators',
      scope: 'patch',
      access: PANEL,
      kind: 'continuous',
      min: -127,
      max: 127,
      step: 1,
      defaultValue: 0,
      bipolar: true,
      rangeSource: 'documented',
      description: `Amount by which LFO 1 modulates the pitch of Oscillator ${n}.`,
      education: {
        explanation:
          'LFO 1 repeatedly raises and lowers the pitch. Small amounts with a triangle LFO produce vibrato. The control has finer resolution below ±12. The manual lists 6 as a semitone, 12 as a tone, 32 as an octave.',
        increase: 'Wider pitch swing: from subtle vibrato to siren-like sweeps.',
        decrease: 'Negative values invert the LFO waveform before it reaches the pitch.',
        experiment:
          'Select a triangle LFO 1 at a moderate speed and set this depth to about 4. Then switch the LFO to square and hear a trill.',
      },
      concepts: ['lfo', 'vibrato', 'modulation-depth', 'pitch'],
      related: ['lfo1.waveform', 'lfo1.speed', 'lfo1.delay'],
      midi: m.lfo1Depth,
      source: { page: 35 },
      visuals: ['lfo', 'waveform'],
    },
    {
      id: `${p}.pwManual`,
      name: `Osc ${n} Pulse Width (Manual)`,
      section: 'oscillators',
      scope: 'patch',
      access: PANEL,
      kind: 'continuous',
      min: 5,
      max: 95,
      step: 1,
      defaultValue: 50,
      unit: '%',
      rangeSource: 'documented',
      description: `Static pulse width (duty cycle) of Oscillator ${n}. Active only with the Pulse waveform.`,
      education: {
        explanation:
          'A pulse wave spends part of each cycle “high” and the rest “low”. At 50% it is a square wave, which has only odd harmonics and a hollow tone. Narrower pulses gain extra harmonics and sound thinner and more reedy.',
        increase: 'Moves towards a narrow positive pulse (95%): thinner, nasal tone.',
        decrease:
          'Moves towards a narrow negative pulse (5%): equally thin. 5% and 95% contain the same harmonics.',
        experiment:
          'Select the Pulse waveform, set the PW source switch to Manual and sweep from 50 to 90. Watch the waveform narrow while the tone thins.',
      },
      concepts: ['pulse-width', 'harmonics', 'timbre'],
      related: [`${p}.waveform`, `${p}.pwModEnv`, `${p}.pwLfo2`],
      midi: m.pwManual,
      source: { page: 36 },
      visuals: ['waveform'],
    },
    {
      id: `${p}.pwModEnv`,
      name: `Osc ${n} Pulse Width Mod Env Amount`,
      section: 'oscillators',
      scope: 'patch',
      access: PANEL,
      kind: 'continuous',
      min: -63,
      max: 63,
      step: 1,
      defaultValue: 0,
      bipolar: true,
      rangeSource: 'documented',
      description: `How much the Mod Envelope varies the pulse width of Oscillator ${n}.`,
      education: {
        explanation:
          'Instead of a fixed pulse width, the Mod Envelope can change the width over the course of each note. The harmonic content then evolves while the note plays.',
        increase: 'The pulse narrows further as the envelope rises.',
        decrease: 'Negative values move the width the opposite way.',
      },
      concepts: ['pulse-width', 'envelope', 'modulation'],
      related: [`${p}.pwManual`, 'modEnv.attack', 'modEnv.decay'],
      midi: m.pwModEnv,
      source: { page: 36 },
      visuals: ['waveform', 'envelope'],
    },
    {
      id: `${p}.pwLfo2`,
      name: `Osc ${n} Pulse Width LFO 2 Amount`,
      section: 'oscillators',
      scope: 'patch',
      access: PANEL,
      kind: 'continuous',
      min: -90,
      max: 90,
      step: 1,
      defaultValue: 0,
      bipolar: true,
      rangeSource: 'documented',
      description: `How much LFO 2 sweeps the pulse width of Oscillator ${n} (pulse-width modulation, PWM).`,
      education: {
        explanation:
          'Pulse-width modulation (PWM) lets LFO 2 sweep the pulse width back and forth. This gives a lush, chorus-like movement that a single oscillator cannot produce otherwise.',
        increase: 'Deeper, wider sweeps of the pulse width.',
        decrease: 'Negative values invert the LFO before it reaches the pulse width.',
        experiment:
          'Pulse waveform, PW source on LFO 2, slow triangle LFO 2: raise this amount until the tone starts to “breathe”.',
      },
      concepts: ['pulse-width', 'lfo', 'modulation'],
      related: [`${p}.pwManual`, 'lfo2.waveform', 'lfo2.speed'],
      midi: m.pwLfo2,
      source: { page: 36 },
      visuals: ['waveform', 'lfo'],
    },
  ];
}

export const oscillatorParameters: readonly ParameterDefinition[] = [
  {
    id: 'panel.oscSelect',
    name: 'Osc Select',
    section: 'oscillators',
    scope: 'panel',
    access: PANEL,
    kind: 'enum',
    options: [
      { value: 'osc1', label: 'Osc 1' },
      { value: 'osc2', label: 'Osc 2' },
    ],
    defaultValue: 'osc1',
    description: 'Assigns the shared Oscillator section controls to Oscillator 1 or Oscillator 2.',
    education: {
      explanation:
        'Bass Station II has two identical oscillators but only one set of oscillator controls. This switch chooses which oscillator the controls edit. The other oscillator keeps its settings.',
      increase: 'Selects Oscillator 2.',
      decrease: 'Selects Oscillator 1.',
    },
    concepts: ['oscillator'],
    related: ['osc1.waveform', 'osc2.waveform'],
    midi: noMidi(
      'Panel routing switch. It changes which oscillator the knobs edit, not the sound itself.',
    ),
    source: { page: 34 },
    visuals: [],
  },
  {
    id: 'panel.pwSource',
    name: 'Pulse Width Modulation Source',
    section: 'oscillators',
    scope: 'panel',
    access: PANEL,
    kind: 'enum',
    options: [
      { value: 'mod-env', label: 'Mod Env' },
      { value: 'lfo2', label: 'LFO 2' },
      { value: 'manual', label: 'Manual' },
    ],
    defaultValue: 'manual',
    description:
      'Chooses which pulse-width amount the Pulse Width knob adjusts: Mod Env depth, LFO 2 depth, or the manual width.',
    education: {
      explanation:
        'All three pulse-width sources can act at the same time. This switch only decides which one the single Pulse Width knob is currently editing.',
      increase: 'Cycles through Mod Env → LFO 2 → Manual.',
      decrease: 'Cycles back.',
    },
    concepts: ['pulse-width'],
    related: ['osc1.pwManual', 'osc1.pwModEnv', 'osc1.pwLfo2'],
    midi: noMidi('Panel routing switch.'),
    source: { page: 9, note: 'Callout 18' },
    visuals: [],
  },
  ...oscillator(1),
  ...oscillator(2),
];
