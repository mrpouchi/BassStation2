import type { VisualKind } from '@/components/visualizers/LessonVisual';
import type { ParameterValue } from '@/engine/parameters/types';
import type { Task } from '@/engine/tasks/tasks';

export type ChallengeType =
  | 'identification'
  | 'manipulation'
  | 'comprehension'
  | 'reconstruction'
  | 'troubleshooting'
  | 'interpretation';

export const CHALLENGE_TYPES: { id: ChallengeType; name: string; description: string }[] = [
  {
    id: 'identification',
    name: 'Parameter identification',
    description: 'Find the right control on the panel.',
  },
  {
    id: 'manipulation',
    name: 'Parameter manipulation',
    description: 'Reach a described result by turning the right controls.',
  },
  {
    id: 'comprehension',
    name: 'Concept comprehension',
    description: 'Check that you understand why things work.',
  },
  {
    id: 'reconstruction',
    name: 'Sound reconstruction',
    description: 'Recreate a configuration from its pictures.',
  },
  {
    id: 'troubleshooting',
    name: 'Troubleshooting',
    description: 'A patch is broken. Find out why and fix it.',
  },
  {
    id: 'interpretation',
    name: 'Visual interpretation',
    description: 'Read a waveform, filter or envelope plot.',
  },
];

export interface Challenge {
  readonly id: string;
  readonly type: ChallengeType;
  readonly title: string;
  readonly level: 'beginner' | 'intermediate';
  readonly brief: string;
  readonly task: Task;
  /** Patch (Init + these values) the learner can load to start; required for troubleshooting. */
  readonly start?: Readonly<Record<string, ParameterValue>>;
  /** A fixed visual shown as the target or the thing to interpret. */
  readonly target?: {
    readonly visual: VisualKind;
    readonly values: Readonly<Record<string, ParameterValue>>;
  };
  /** Show the hardware panel (identification and manipulation). */
  readonly panel?: boolean;
  /** Reveal exact targets before checking (false = hints only after a check). */
  readonly revealTargets: boolean;
  /** Why the answer is what it is — shown once solved. */
  readonly takeaway: string;
  readonly lesson?: string;
}

export const CHALLENGES: readonly Challenge[] = [
  // ---------------------------------------------------------------- Identification
  {
    id: 'find-cutoff',
    type: 'identification',
    title: 'The brightness knob',
    level: 'beginner',
    brief:
      'One control on the panel is bigger than all the others, because it is the one you play the most.',
    task: {
      kind: 'select',
      prompt: 'Click the control that sets the filter cutoff frequency.',
      params: ['filter.frequency'],
      feedback: 'The large Frequency knob in the Filter section.',
    },
    panel: true,
    revealTargets: false,
    takeaway:
      'Filter Frequency gets the large knob because sweeping the cutoff is the most expressive move on a subtractive synth.',
    lesson: 'filters/cutoff',
  },
  {
    id: 'find-release',
    type: 'identification',
    title: 'Let it ring',
    level: 'beginner',
    brief: 'You want notes to keep sounding for a while after you let go of the key.',
    task: {
      kind: 'select',
      prompt:
        'Click the control that sets how long the Amp Envelope takes to fade after key release.',
      params: ['ampEnv.release'],
      feedback: 'The Release fader (with Env Select on Amp Env or Amp+Mod).',
    },
    panel: true,
    revealTargets: false,
    takeaway:
      'Release is a time: how long the envelope takes to fall to zero after the key is released.',
    lesson: 'envelopes/release',
  },
  {
    id: 'find-vibrato',
    type: 'identification',
    title: 'Where is the vibrato?',
    level: 'intermediate',
    brief:
      'Vibrato is LFO 1 applied to oscillator pitch. Which knob sets its depth for the selected oscillator?',
    task: {
      kind: 'select',
      prompt: 'Click the knob that sets how much LFO 1 moves Osc 1 pitch.',
      params: ['osc1.lfo1Depth'],
      feedback: 'LFO 1 depth in the Oscillators section (with Osc Select on 1).',
    },
    panel: true,
    revealTargets: false,
    takeaway:
      'Modulation depth lives at the destination: the oscillator section has its own LFO 1 depth control.',
    lesson: 'modulation/lfo-1',
  },
  // ---------------------------------------------------------------- Manipulation
  {
    id: 'octave-up-bass',
    type: 'manipulation',
    title: 'Fatten the bass',
    level: 'beginner',
    brief:
      'Make the bass heavier: add the sub oscillator two octaves down as a sine, and keep Osc 1 in the mix.',
    task: {
      kind: 'set',
      prompt: 'Add a deep sine sub under Osc 1.',
      conditions: [
        { param: 'mixer.sub', op: 'gte', value: 150, hint: 'Raise the Sub level in the Mixer.' },
        { param: 'sub.octave', op: 'eq', value: '-2', hint: 'Sub Octave switch to -2.' },
        { param: 'sub.wave', op: 'eq', value: 'sine', hint: 'Sub wave: sine.' },
        { param: 'mixer.osc1', op: 'gte', value: 128, hint: 'Keep Osc 1 audible.' },
      ],
    },
    panel: true,
    revealTargets: true,
    takeaway: 'A sine sub adds weight without adding harmonics that crowd the mix.',
    lesson: 'mixer/sub-oscillator',
  },
  {
    id: 'acid-squelch',
    type: 'manipulation',
    title: 'Squelch',
    level: 'intermediate',
    brief:
      'Set up the classic acid bass filter: the Acid type, a lowish cutoff, high resonance and a positive envelope sweep.',
    task: {
      kind: 'set',
      prompt: 'Configure an acid filter sweep.',
      conditions: [
        { param: 'filter.type', op: 'eq', value: 'acid', hint: 'Filter Type: Acid.' },
        { param: 'filter.frequency', op: 'lte', value: 120, hint: 'Lower the Frequency.' },
        { param: 'filter.resonance', op: 'gte', value: 80, hint: 'Raise Resonance a lot.' },
        {
          param: 'filter.modEnvDepth',
          op: 'gte',
          value: 25,
          hint: 'Positive Mod Env depth on the filter.',
        },
        {
          param: 'modEnv.sustain',
          op: 'lte',
          value: 30,
          hint: 'Lower the Mod Env Sustain so the sweep falls back.',
        },
      ],
    },
    panel: true,
    revealTargets: true,
    takeaway:
      'Resonance plus an envelope sweep through a diode-ladder low-pass gives the vocal “squelch” of acid bass.',
    lesson: 'filters/filter-modulation',
  },
  {
    id: 'sync-scream',
    type: 'manipulation',
    title: 'Sync lead',
    level: 'intermediate',
    brief:
      'Make the classic hard-sync lead: sync on, only Osc 2 audible, Osc 2 tuned well above Osc 1.',
    task: {
      kind: 'set',
      prompt: 'Set up oscillator sync.',
      conditions: [
        {
          param: 'voice.oscSync',
          op: 'eq',
          value: true,
          hint: 'Turn on Osc 1-2 Sync (Function + upper D).',
        },
        {
          param: 'mixer.osc1',
          op: 'lte',
          value: 20,
          hint: 'Turn Osc 1 down in the mixer, so you hear only the synced Osc 2.',
        },
        { param: 'mixer.osc2', op: 'gte', value: 150, hint: 'Bring Osc 2 up.' },
        {
          param: 'osc2.coarse',
          op: 'gte',
          value: 5,
          hint: 'Tune Osc 2 Coarse at least +5 semitones above Osc 1.',
        },
      ],
    },
    panel: true,
    revealTargets: true,
    takeaway:
      'With sync, Osc 2’s pitch changes its timbre, not its note. The note stays locked to Osc 1.',
    lesson: 'oscillators/oscillator-2',
  },
  // ---------------------------------------------------------------- Comprehension
  {
    id: 'why-saw',
    type: 'comprehension',
    title: 'Why start with a sawtooth?',
    level: 'beginner',
    brief: 'Most classic subtractive patches start from a sawtooth wave.',
    task: {
      kind: 'choice',
      prompt: 'Why is the sawtooth such a good starting point for subtractive synthesis?',
      options: [
        {
          label: 'It contains every harmonic, so the filter has the most to shape',
          correct: true,
          feedback: 'Correct: a filter can only remove harmonics that exist.',
        },
        {
          label: 'It is the loudest waveform',
          correct: false,
          feedback: 'Loudness is set by the mixer and VCA. Richness is what matters here.',
        },
        {
          label: 'It has no harmonics, so it is easy to filter',
          correct: false,
          feedback: 'That describes a sine. Filtering a sine changes almost nothing.',
        },
        {
          label: 'Only sawtooths can be filtered',
          correct: false,
          feedback: 'Every source can be filtered, but harmonic-rich ones change the most.',
        },
      ],
    },
    revealTargets: false,
    takeaway:
      'Subtractive synthesis starts rich and takes away. The sawtooth is the richest raw material.',
    lesson: 'oscillators/sawtooth',
  },
  {
    id: 'overdrive-vs-distortion',
    type: 'comprehension',
    title: 'Before or after?',
    level: 'intermediate',
    brief:
      'Bass Station II has two kinds of drive: Overdrive in the Filter section and Distortion in Effects.',
    task: {
      kind: 'choice',
      prompt: 'What is the key difference between Overdrive and Distortion?',
      options: [
        {
          label: 'Overdrive is before the filter, Distortion after it',
          correct: true,
          feedback:
            'Correct: overdriven harmonics are then shaped by the filter, while distortion acts on the filtered signal (before the VCA).',
        },
        {
          label: 'They are the same circuit with two knobs',
          correct: false,
          feedback: 'They sit at different points in the signal chain (pp. 42, 47).',
        },
        {
          label: 'Distortion only affects the sub oscillator',
          correct: false,
          feedback: 'Distortion affects the whole filtered signal.',
        },
        {
          label: 'Overdrive is after the VCA',
          correct: false,
          feedback: 'Overdrive is applied to the mixer output, before the filter.',
        },
      ],
    },
    revealTargets: false,
    takeaway: 'Where an effect sits in the signal chain changes how it sounds.',
    lesson: 'filters/overdrive',
  },
  {
    id: 'env-vs-lfo',
    type: 'comprehension',
    title: 'Once or forever?',
    level: 'beginner',
    brief: 'Envelopes and LFOs are both modulation sources.',
    task: {
      kind: 'choice',
      prompt: 'What distinguishes an envelope from an LFO?',
      options: [
        {
          label: 'An envelope runs once per note, while an LFO repeats continuously',
          correct: true,
          feedback: 'Correct (unless you turn on envelope retrigger, which loops it).',
        },
        {
          label: 'An LFO can only affect volume',
          correct: false,
          feedback:
            'On Bass Station II the LFOs affect pitch, pulse width and filter. The Amp Env controls volume.',
        },
        { label: 'Envelopes are faster', correct: false, feedback: 'Both can be fast or slow.' },
        {
          label: 'There is no difference',
          correct: false,
          feedback: 'Their shapes over time are fundamentally different.',
        },
      ],
    },
    revealTargets: false,
    takeaway: 'Envelope: a one-shot shape tied to the key. LFO: a repeating cycle.',
    lesson: 'modulation/lfo-1',
  },
  // ---------------------------------------------------------------- Reconstruction
  {
    id: 'match-pulse',
    type: 'reconstruction',
    title: 'Match the waveform',
    level: 'beginner',
    brief:
      'Recreate the waveform shown on the left. The targets stay hidden, but you get hints after each check.',
    task: {
      kind: 'set',
      prompt: 'Make Osc 1 match the target picture.',
      conditions: [
        {
          param: 'osc1.waveform',
          op: 'eq',
          value: 'pulse',
          hint: 'The wave jumps between two levels. Which waveform does that?',
        },
        {
          param: 'osc1.pwManual',
          op: 'between',
          min: 20,
          max: 30,
          hint: 'It is high for only about a quarter of each cycle.',
        },
      ],
    },
    target: { visual: 'waveform', values: { 'osc1.waveform': 'pulse', 'osc1.pwManual': 25 } },
    revealTargets: false,
    takeaway: 'A 25% pulse: high for a quarter of each cycle.',
    lesson: 'oscillators/pulse',
  },
  {
    id: 'match-filter',
    type: 'reconstruction',
    title: 'Match the filter curve',
    level: 'intermediate',
    brief: 'Recreate the filter response shown: shape, slope, cutoff and resonance.',
    task: {
      kind: 'set',
      prompt: 'Make your filter match the target curve.',
      conditions: [
        {
          param: 'filter.type',
          op: 'eq',
          value: 'classic',
          hint: 'The shape is not low-pass, so the Classic type is needed.',
        },
        {
          param: 'filter.shape',
          op: 'eq',
          value: 'hp',
          hint: 'Low frequencies are removed and high ones pass.',
        },
        { param: 'filter.slope', op: 'eq', value: '12', hint: 'The roll-off is gentle.' },
        {
          param: 'filter.frequency',
          op: 'between',
          min: 110,
          max: 150,
          hint: 'The cutoff is in the low-mid range (around 500 Hz–1 kHz).',
        },
        {
          param: 'filter.resonance',
          op: 'gte',
          value: 60,
          hint: 'There is a clear peak at the cutoff.',
        },
      ],
    },
    target: {
      visual: 'filter',
      values: {
        'filter.shape': 'hp',
        'filter.slope': '12',
        'filter.frequency': 130,
        'filter.resonance': 75,
      },
    },
    revealTargets: false,
    takeaway: 'A resonant 12 dB high-pass, which is useful for thin, cutting sounds.',
    lesson: 'filters/slope',
  },
  {
    id: 'match-envelope',
    type: 'reconstruction',
    title: 'Match the envelope',
    level: 'intermediate',
    brief: 'Recreate the Amp Envelope shape shown.',
    task: {
      kind: 'set',
      prompt: 'Shape your Amp Envelope like the target.',
      conditions: [
        {
          param: 'ampEnv.attack',
          op: 'between',
          min: 50,
          max: 80,
          hint: 'The rise is clearly gradual, but not extremely slow.',
        },
        {
          param: 'ampEnv.sustain',
          op: 'between',
          min: 50,
          max: 80,
          hint: 'The held level is around half.',
        },
        {
          param: 'ampEnv.decay',
          op: 'gte',
          value: 40,
          hint: 'The fall to the held level takes a noticeable time.',
        },
        { param: 'ampEnv.release', op: 'gte', value: 70, hint: 'The tail after key-up is long.' },
      ],
    },
    target: {
      visual: 'envelope',
      values: {
        'ampEnv.attack': 65,
        'ampEnv.decay': 60,
        'ampEnv.sustain': 64,
        'ampEnv.release': 85,
      },
    },
    revealTargets: false,
    takeaway: 'You can read the ADSR settings straight off an envelope curve.',
    lesson: 'envelopes/sustain',
  },
  // ---------------------------------------------------------------- Troubleshooting
  {
    id: 'no-sound',
    type: 'troubleshooting',
    title: 'Silence',
    level: 'beginner',
    brief: 'A student says their patch makes no sound at all. Load it and find out why.',
    start: { 'mixer.osc1': 0, 'mixer.osc2': 0, 'mixer.sub': 0 },
    task: {
      kind: 'set',
      prompt: 'Make the patch audible again.',
      conditions: [
        {
          param: 'mixer.osc1',
          op: 'gte',
          value: 100,
          hint: 'Look at the Mixer: is any source turned up?',
        },
      ],
    },
    revealTargets: false,
    takeaway: 'When there is no sound, follow the signal: source → mixer → filter → amp.',
    lesson: 'mixer/oscillator-balance',
  },
  {
    id: 'muffled',
    type: 'troubleshooting',
    title: 'Under a blanket',
    level: 'beginner',
    brief: 'This patch sounds extremely dull and quiet, as if heard through a wall.',
    start: { 'filter.frequency': 10 },
    task: {
      kind: 'set',
      prompt: 'Bring the brightness back.',
      conditions: [
        {
          param: 'filter.frequency',
          op: 'gte',
          value: 150,
          hint: 'Something in the Filter is removing almost every harmonic.',
        },
      ],
    },
    target: { visual: 'filter', values: { 'filter.frequency': 10 } },
    revealTargets: false,
    takeaway: 'A nearly closed low-pass filter removes almost all harmonics.',
    lesson: 'filters/cutoff',
  },
  {
    id: 'seasick',
    type: 'troubleshooting',
    title: 'Seasick lead',
    level: 'intermediate',
    brief: 'The lead’s pitch wobbles wildly, by several octaves. A gentle vibrato was intended.',
    start: { 'osc1.lfo1Depth': 70, 'osc2.lfo1Depth': 70, 'mixer.osc2': 200 },
    task: {
      kind: 'set',
      prompt: 'Turn the wobble into a gentle vibrato on both oscillators.',
      conditions: [
        {
          param: 'osc1.lfo1Depth',
          op: 'between',
          min: -8,
          max: 8,
          hint: 'Something is moving Osc 1 pitch far too much. Check the Oscillator section with Osc Select on 1.',
        },
        {
          param: 'osc2.lfo1Depth',
          op: 'between',
          min: -8,
          max: 8,
          hint: 'Osc 2 has the same problem. Switch Osc Select to 2.',
        },
      ],
    },
    target: { visual: 'lfo', values: { 'osc1.lfo1Depth': 70 } },
    revealTargets: false,
    takeaway:
      'Each oscillator has its own LFO 1 depth. 6 ≈ one semitone, so vibrato needs small values.',
    lesson: 'modulation/modulation-depth',
  },
  // ---------------------------------------------------------------- Interpretation
  {
    id: 'read-wave',
    type: 'interpretation',
    title: 'Name that wave',
    level: 'beginner',
    brief: 'Look at the plot and identify the oscillator waveform.',
    target: { visual: 'waveform', values: { 'osc1.waveform': 'triangle' } },
    task: {
      kind: 'choice',
      prompt: 'Which waveform is shown?',
      options: [
        {
          label: 'Sawtooth',
          correct: false,
          feedback:
            'A sawtooth ramps one way and then jumps. This wave rises and falls symmetrically.',
        },
        {
          label: 'Triangle',
          correct: true,
          feedback: 'Correct: straight, symmetric rises and falls.',
        },
        { label: 'Square', correct: false, feedback: 'A square jumps between two flat levels.' },
        {
          label: 'Sine',
          correct: false,
          feedback: 'A sine is rounded. This one has sharp corners.',
        },
      ],
    },
    revealTargets: false,
    takeaway: 'Triangle: symmetric ramps, few harmonics, soft tone.',
    lesson: 'sound-fundamentals/waveforms',
  },
  {
    id: 'read-filter',
    type: 'interpretation',
    title: 'Which filter?',
    level: 'intermediate',
    brief: 'Identify the filter shape from its response curve.',
    target: {
      visual: 'filter',
      values: { 'filter.shape': 'bp', 'filter.frequency': 140, 'filter.resonance': 40 },
    },
    task: {
      kind: 'choice',
      prompt: 'Which filter shape produces this response?',
      options: [
        {
          label: 'Low-pass',
          correct: false,
          feedback: 'A low-pass would pass everything below the cutoff.',
        },
        {
          label: 'High-pass',
          correct: false,
          feedback: 'A high-pass would pass everything above the cutoff.',
        },
        {
          label: 'Band-pass',
          correct: true,
          feedback:
            'Correct: only a band around the centre frequency passes, and both sides fall away.',
        },
      ],
    },
    revealTargets: false,
    takeaway:
      'Band-pass keeps a band around the centre frequency, which gives thin, telephone-like or vocal tones.',
    lesson: 'filters/low-pass',
  },
  {
    id: 'read-envelope',
    type: 'interpretation',
    title: 'What instrument shape?',
    level: 'beginner',
    brief: 'Look at this Amp Envelope.',
    target: {
      visual: 'envelope',
      values: { 'ampEnv.attack': 0, 'ampEnv.decay': 60, 'ampEnv.sustain': 0, 'ampEnv.release': 40 },
    },
    task: {
      kind: 'choice',
      prompt: 'Which kind of sound has an envelope like this?',
      options: [
        {
          label: 'A plucked string',
          correct: true,
          feedback: 'Correct: instant attack, then it decays to silence even while held.',
        },
        {
          label: 'An organ',
          correct: false,
          feedback: 'An organ holds full level while the key is down (high sustain).',
        },
        {
          label: 'A slowly bowed string pad',
          correct: false,
          feedback: 'That would have a slow attack.',
        },
      ],
    },
    revealTargets: false,
    takeaway: 'Zero attack, short decay, zero sustain: the pluck shape.',
    lesson: 'envelopes/decay',
  },
];

export function findChallenge(id: string): Challenge | undefined {
  return CHALLENGES.find((c) => c.id === id);
}
