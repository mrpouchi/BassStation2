import type { MidiInfo, OnKeyName, ParameterDefinition } from '@/engine/parameters/types';
import { documentedCc, documentedNrpn, noMidi, onKey, PANEL } from './helpers';

interface EnvelopeSpec {
  prefix: 'ampEnv' | 'modEnv';
  label: 'Amp Env' | 'Mod Env';
  key: OnKeyName;
  cc: { attack: number; decay: number; sustain: number; release: number };
  triggering: MidiInfo;
  retrigger: MidiInfo;
  fixedDuration: MidiInfo;
  retriggerCount: MidiInfo;
  role: string;
}

const ENVELOPES: readonly EnvelopeSpec[] = [
  {
    prefix: 'ampEnv',
    label: 'Amp Env',
    key: 'upper D#',
    cc: { attack: 90, decay: 91, sustain: 92, release: 93 },
    triggering: documentedNrpn(
      0,
      73,
      '1,2,3',
      'Which NRPN value (1–3) selects which mode is not documented.',
    ),
    retrigger: documentedNrpn(0, 109),
    fixedDuration: documentedNrpn(
      0,
      114,
      undefined,
      'Listed in the manual as "amp env fixed sustatin duration".',
    ),
    retriggerCount: documentedNrpn(0, 117),
    role: 'the volume (VCA)',
  },
  {
    prefix: 'modEnv',
    label: 'Mod Env',
    key: 'upper E',
    cc: { attack: 102, decay: 103, sustain: 104, release: 105 },
    triggering: documentedNrpn(
      0,
      105,
      '1,2,3',
      'Which NRPN value (1–3) selects which mode is not documented.',
    ),
    retrigger: documentedNrpn(0, 110),
    fixedDuration: documentedNrpn(0, 115),
    retriggerCount: documentedNrpn(0, 118),
    role: 'oscillator pitch, pulse width and filter frequency (via their Mod Env depth controls)',
  },
];

function envelope(s: EnvelopeSpec): ParameterDefinition[] {
  const p = s.prefix;
  const isAmp = p === 'ampEnv';
  const visuals = ['envelope'] as const;
  const concepts = ['envelope', 'adsr', ...(isAmp ? ['amplitude', 'vca'] : ['modulation'])];
  return [
    {
      id: `${p}.attack`,
      name: `${s.label} Attack`,
      section: 'envelopes',
      scope: 'patch',
      access: PANEL,
      kind: 'continuous',
      min: 0,
      max: 127,
      step: 1,
      defaultValue: 0,
      rangeSource: 'documented',
      description: `Time for the ${s.label} to rise from zero to its maximum after a key is pressed.`,
      education: {
        explanation: isAmp
          ? 'Attack is the fade-in of each note. Plucked and struck instruments have near-zero attack, while bowed strings and pads swell in slowly. The manual gives about 250 ms at mid-travel and over 5 s at the top.'
          : 'Mod Env Attack sets how quickly the modulation reaches full strength. For a filter sweep, it is how long the filter takes to open.',
        increase: isAmp ? 'Slower fade-in: soft, swelling notes.' : 'Slower modulation build-up.',
        decrease: isAmp
          ? 'Instant start: percussive, immediate notes.'
          : 'Modulation hits immediately.',
      },
      concepts: [...concepts, 'attack'],
      related: [`${p}.decay`, `${p}.sustain`, `${p}.release`],
      midi: documentedCc(s.cc.attack, '0 to 127'),
      source: { page: 44 },
      visuals,
    },
    {
      id: `${p}.decay`,
      name: `${s.label} Decay`,
      section: 'envelopes',
      scope: 'patch',
      access: PANEL,
      kind: 'continuous',
      min: 0,
      max: 127,
      step: 1,
      defaultValue: 0,
      rangeSource: 'documented',
      description: `Time for the ${s.label} to fall from its peak to the Sustain level while the key is held.`,
      education: {
        explanation:
          'Decay only matters when Sustain is below maximum. It is the time the envelope takes to settle from its peak down to the sustain level, about 150 ms at mid-travel.',
        increase: 'Longer, slower settling after the peak.',
        decrease: 'A quick drop to the sustain level: snappy and plucky.',
      },
      concepts: [...concepts, 'decay'],
      related: [`${p}.attack`, `${p}.sustain`, `${p}.fixedDuration`],
      midi: documentedCc(s.cc.decay, '0 to 127'),
      source: { page: 44 },
      visuals,
    },
    {
      id: `${p}.sustain`,
      name: `${s.label} Sustain`,
      section: 'envelopes',
      scope: 'patch',
      access: PANEL,
      kind: 'continuous',
      min: 0,
      max: 127,
      step: 1,
      defaultValue: 127,
      rangeSource: 'documented',
      description: `Level the ${s.label} holds while the key remains pressed. Sustain is a level, not a time.`,
      education: {
        explanation:
          'Sustain is the only ADSR control that sets a level instead of a time. It decides what remains once attack and decay have finished, for as long as the key is held.',
        increase: isAmp
          ? 'Notes stay loud while held, like an organ.'
          : 'The modulation stays strong while held.',
        decrease: isAmp
          ? 'Notes die away even while held. At 0 they become inaudible after the decay.'
          : 'The modulation falls back after the decay.',
      },
      concepts: [...concepts, 'sustain'],
      related: [`${p}.decay`, `${p}.release`],
      midi: documentedCc(s.cc.sustain, '0 to 127'),
      source: { page: 44 },
      visuals,
    },
    {
      id: `${p}.release`,
      name: `${s.label} Release`,
      section: 'envelopes',
      scope: 'patch',
      access: PANEL,
      kind: 'continuous',
      min: 0,
      max: 127,
      step: 1,
      defaultValue: 0,
      rangeSource: 'documented',
      description: `Time for the ${s.label} to fall to zero after the key is released.`,
      education: {
        explanation:
          'Release is how long a note keeps sounding after you let go. The response is not linear: about 360 ms at mid-travel and over 10 s at the top.',
        increase: 'Notes ring on and fade gently after release.',
        decrease: 'Notes stop as soon as the key is released.',
      },
      concepts: [...concepts, 'release'],
      related: [`${p}.sustain`],
      midi: documentedCc(s.cc.release, '0 to 127'),
      source: { page: 44 },
      visuals,
    },
    {
      id: `${p}.triggering`,
      name: `${s.label} Triggering`,
      section: 'envelopes',
      scope: 'patch',
      access: PANEL,
      kind: 'enum',
      options: [
        {
          value: 'single',
          label: 'Single',
          description: 'Retriggers on detached notes only. Legato notes do not retrigger.',
        },
        {
          value: 'multi',
          label: 'Multi',
          description: 'Retriggers on every note, regardless of playing style.',
        },
        {
          value: 'autoglide',
          label: 'Autoglide',
          description: 'Like Single, but portamento applies only to legato notes.',
        },
      ],
      defaultValue: 'multi',
      description: `How the ${s.label} responds to legato playing and portamento.`,
      education: {
        explanation:
          'Legato means overlapping notes. Single and Autoglide let a held envelope continue smoothly into the next legato note. Multi always restarts it, so each note gets its own attack.',
        increase: 'Towards Autoglide: glide only on overlapping notes.',
        decrease: 'Towards Single: no retrigger on legato notes.',
      },
      concepts: ['envelope', 'legato', 'portamento'],
      related: ['portamento.glideTime'],
      midi: s.triggering,
      source: { page: 44 },
      visuals: [],
    },
    {
      id: `${p}.retrigger`,
      name: `${s.label} Retrigger`,
      section: 'envelopes',
      scope: 'patch',
      access: onKey(s.key, 2),
      kind: 'toggle',
      defaultValue: false,
      labels: ['r-0', 'r-1'],
      description: `When on, the ${s.label} restarts (loops) once its decay stage ends.`,
      education: {
        explanation:
          'A looping envelope repeats its attack-decay cycle while the key is held. It then behaves like an LFO with a shape you draw with the ADSR sliders.',
        increase: 'On: the envelope loops.',
        decrease: 'Off: a normal one-shot envelope.',
      },
      concepts: ['envelope'],
      related: [`${p}.retriggerCount`, `${p}.fixedDuration`],
      midi: s.retrigger,
      source: { page: 45 },
      visuals,
    },
    {
      id: `${p}.retriggerCount`,
      name: `${s.label} Retrigger Count`,
      section: 'envelopes',
      scope: 'patch',
      access: onKey(s.key, 3),
      kind: 'continuous',
      min: 0,
      max: 16,
      step: 1,
      defaultValue: 0,
      rangeSource: 'documented',
      valueLabels: { 0: '∞' },
      description: `Number of loops when ${s.label} Retrigger is on (0 = loop indefinitely, 1–16).`,
      education: {
        explanation:
          'Limits how many times a retriggering envelope repeats. 0 means it loops forever.',
        increase: 'More repetitions before the envelope stops looping.',
        decrease: 'Fewer repetitions. 0 loops forever.',
      },
      concepts: ['envelope'],
      related: [`${p}.retrigger`],
      midi: s.retriggerCount,
      source: { page: 46 },
      visuals,
    },
    {
      id: `${p}.fixedDuration`,
      name: `${s.label} Fixed Duration Sustain`,
      section: 'envelopes',
      scope: 'patch',
      access: onKey(s.key, 4),
      kind: 'toggle',
      defaultValue: false,
      labels: ['d-0', 'd-1'],
      description: `Gives the ${s.label} sustain stage a fixed length set by the Decay slider. The decay stage is removed.`,
      education: {
        explanation:
          'With a fixed-duration sustain, the envelope moves to release after a set time even if you keep holding the key. This is ideal for drum sounds. It overrides envelope retriggering.',
        increase: 'On: note length no longer depends on how long you hold the key.',
        decrease: 'Off: a standard ADSR.',
      },
      concepts: ['envelope', 'sustain'],
      related: [`${p}.decay`, `${p}.retrigger`],
      midi: s.fixedDuration,
      source: { page: 46 },
      visuals,
    },
  ];
}

export const envelopeParameters: readonly ParameterDefinition[] = [
  {
    id: 'panel.envSelect',
    name: 'Env Select',
    section: 'envelopes',
    scope: 'panel',
    access: PANEL,
    kind: 'enum',
    options: [
      { value: 'amp', label: 'Amp Env' },
      { value: 'mod', label: 'Mod Env' },
      { value: 'both', label: 'Amp+Mod Env' },
    ],
    defaultValue: 'amp',
    description:
      'Assigns the four ADSR faders and the Triggering switch to the Amp Envelope, Mod Envelope, or both.',
    education: {
      explanation:
        'The two envelopes share one set of faders. Amp Env always shapes the volume. Mod Env shapes ' +
        (ENVELOPES[1]?.role ?? 'other parameters') +
        '.',
      increase: 'Cycles Amp → Mod → Amp+Mod.',
      decrease: 'Cycles back.',
    },
    concepts: ['envelope'],
    related: ['ampEnv.attack', 'modEnv.attack'],
    midi: noMidi('Panel routing switch.'),
    source: { page: 11, note: 'Callout 38' },
    visuals: [],
  },
  ...ENVELOPES.flatMap(envelope),
];
