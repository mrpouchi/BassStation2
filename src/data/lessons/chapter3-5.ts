import type { Lesson } from './types';

export const chapter3: Lesson[] = [
  {
    id: 'oscillator-balance',
    objective: 'Balance two oscillators in the mixer.',
    explanation: [
      'The mixer decides how much of each source reaches the filter. Equal levels give an even blend, and favouring one oscillator lets the other add colour underneath.',
      'All sources are summed before the filter, so the filter treats the mix as one sound.',
    ],
    demonstration: {
      visual: 'waveform',
      values: { 'mixer.osc1': 128, 'mixer.osc2': 128, 'osc2.waveform': 'pulse', 'osc2.range': '4' },
      caption: 'Mixer output: a sawtooth and a pulse an octave up, at equal levels.',
    },
    experiment: {
      steps: ['Move the Osc 1 and Osc 2 levels and watch the mixer output change shape.'],
      parameters: ['mixer.osc1', 'mixer.osc2', 'osc2.waveform'],
      visual: 'waveform',
    },
    exercise: {
      kind: 'set',
      prompt: 'Blend both oscillators at roughly equal, moderate levels.',
      conditions: [
        {
          param: 'mixer.osc1',
          op: 'between',
          min: 100,
          max: 160,
          hint: 'Set the Osc 1 level between 100 and 160.',
        },
        {
          param: 'mixer.osc2',
          op: 'between',
          min: 100,
          max: 160,
          hint: 'Set the Osc 2 level between 100 and 160.',
        },
      ],
    },
    success: 'You balanced two sources in the mixer.',
  },
  {
    id: 'noise',
    objective: 'Use white noise as a sound source.',
    explanation: [
      'White noise contains all frequencies at random. It has no pitch, which makes it perfect for wind, breath, hi-hats and the snap of a snare.',
      'Noise shares the fourth mixer knob with Ring and Ext. Set the Noise/Ring/Ext switch to Noise first.',
    ],
    demonstration: {
      visual: 'waveform',
      values: { 'mixer.osc1': 0, 'mixer.noise': 255 },
      caption: 'Noise alone: no repeating cycle at all.',
    },
    experiment: {
      steps: [
        'Set the switch to Noise and raise the level.',
        'Turn the oscillators down to hear (and see) noise alone.',
      ],
      parameters: ['panel.mixerSource', 'mixer.noise', 'mixer.osc1'],
      visual: 'waveform',
    },
    exercise: {
      kind: 'set',
      prompt: 'Make a pure noise source: noise up, all oscillators down.',
      conditions: [
        {
          param: 'mixer.noise',
          op: 'gte',
          value: 128,
          hint: 'Switch the shared knob to Noise and turn it up (≥ 128).',
        },
        { param: 'mixer.osc1', op: 'eq', value: 0, hint: 'Turn the Osc 1 level fully down.' },
        { param: 'mixer.osc2', op: 'eq', value: 0, hint: 'Turn the Osc 2 level fully down.' },
        { param: 'mixer.sub', op: 'eq', value: 0, hint: 'Turn the Sub level fully down.' },
      ],
    },
    success: 'You built a noise source, the start of every synth drum.',
  },
  {
    id: 'sub-oscillator',
    objective: 'Add low-end weight with the sub oscillator.',
    explanation: [
      'The sub oscillator follows Osc 1, one or two octaves below. A sine sub adds pure, deep weight, while square and narrow pulse subs stay audible on small speakers.',
      'It is the quickest route to a bigger bass.',
    ],
    demonstration: {
      visual: 'waveform',
      values: { 'mixer.sub': 200, 'sub.octave': '-1', 'sub.wave': 'square' },
      caption: 'Sources view: the green square sub takes one cycle for every two Osc 1 cycles.',
    },
    experiment: {
      steps: ['Raise the Sub level.', 'Compare -1 and -2 octave and the three sub waveforms.'],
      parameters: ['mixer.sub', 'sub.octave', 'sub.wave'],
      visual: 'waveform',
    },
    exercise: {
      kind: 'set',
      prompt: 'Add a deep sine sub two octaves below Osc 1.',
      conditions: [
        { param: 'mixer.sub', op: 'gte', value: 128, hint: 'Raise the Sub level (≥ 128).' },
        { param: 'sub.octave', op: 'eq', value: '-2', hint: 'Set the sub Octave switch to -2.' },
        { param: 'sub.wave', op: 'eq', value: 'sine', hint: 'Choose the sine sub waveform.' },
      ],
    },
    success: 'You added sub-bass weight.',
  },
  {
    id: 'signal-mixing',
    objective: 'Understand ring modulation and external input as mixer sources.',
    explanation: [
      'The ring modulator multiplies Osc 1 by Osc 2. The output contains the sum and the difference of their frequencies, usually not harmonically related. The result is metallic, bell-like and clangorous.',
      'The Ext source lets any audio from the rear EXT IN socket pass through the filter and envelopes.',
    ],
    demonstration: {
      visual: 'waveform',
      values: {
        'mixer.osc1': 0,
        'mixer.ringMod': 255,
        'osc1.waveform': 'sine',
        'osc2.waveform': 'sine',
        'osc2.coarse': 7,
      },
      caption: 'Ring mod of two sines a fifth apart: a complex, beating shape.',
    },
    experiment: {
      steps: [
        'Switch the shared knob to Ring and raise it.',
        'Detune Osc 2 Coarse and watch the shape change.',
      ],
      parameters: ['panel.mixerSource', 'mixer.ringMod', 'osc2.coarse'],
      visual: 'waveform',
      start: { 'mixer.osc1': 0, 'mixer.ringMod': 200 },
    },
    exercise: {
      kind: 'choice',
      prompt: 'Ring-modulating 300 Hz with 200 Hz produces mainly which frequencies?',
      options: [
        {
          label: '100 Hz and 500 Hz',
          correct: true,
          feedback: 'Correct: the difference (300 − 200) and the sum (300 + 200).',
        },
        { label: '250 Hz', correct: false, feedback: 'Averaging is not what multiplication does.' },
        {
          label: '300 Hz and 200 Hz',
          correct: false,
          feedback: 'The original frequencies largely disappear in a ring modulator.',
        },
        {
          label: '60 000 Hz',
          correct: false,
          feedback: 'The signals are multiplied, not their frequencies.',
        },
      ],
    },
    success: 'You understand where metallic ring-mod tones come from.',
  },
];

export const chapter4: Lesson[] = [
  {
    id: 'low-pass',
    objective: 'Describe what a low-pass filter does to the spectrum.',
    explanation: [
      'A low-pass filter lets frequencies below the cutoff through and attenuates those above. Removing the upper harmonics makes a sound darker and warmer. This is the essence of subtractive synthesis.',
      'Bass Station II offers a Classic multimode filter (LP/BP/HP) and an Acid 24 dB diode-ladder low-pass.',
    ],
    demonstration: {
      visual: 'filter',
      values: { 'filter.frequency': 120 },
      caption: 'A low-pass at a moderate cutoff: low harmonics pass, high ones are removed.',
    },
    experiment: {
      steps: ['Switch Shape between LP, BP and HP and watch which bars survive.'],
      parameters: ['filter.type', 'filter.shape', 'filter.frequency'],
      visual: 'filter',
      start: { 'filter.frequency': 130 },
    },
    exercise: {
      kind: 'choice',
      prompt: 'A low-pass filter mainly removes…',
      options: [
        {
          label: 'Frequencies above the cutoff',
          correct: true,
          feedback: 'Correct: it passes the lows and removes the highs.',
        },
        {
          label: 'Frequencies below the cutoff',
          correct: false,
          feedback: 'That is a high-pass filter.',
        },
        {
          label: 'Everything except the cutoff frequency',
          correct: false,
          feedback: 'That is closer to a (narrow) band-pass.',
        },
        {
          label: 'Only noise',
          correct: false,
          feedback: 'Filters act on frequencies, whatever the source.',
        },
      ],
    },
    success: 'You know what a low-pass filter takes away.',
  },
  {
    id: 'cutoff',
    objective: 'Place the cutoff frequency to shape brightness.',
    explanation: [
      'The cutoff is where the filter starts working. It is the large Frequency knob because it is the most expressive control on the synth.',
      'Sweeping it changes a sound from muffled to bright in one gesture.',
    ],
    demonstration: {
      visual: 'filter',
      values: { 'filter.frequency': 100 },
      caption: 'Cutoff around 300 Hz on a sawtooth.',
    },
    experiment: {
      steps: ['Sweep Frequency from fully open to nearly closed and watch the coloured bars.'],
      parameters: ['filter.frequency'],
      visual: 'filter',
    },
    exercise: {
      kind: 'set',
      prompt: 'Darken the sound: set a low-pass cutoff in the low-mid range.',
      conditions: [
        { param: 'filter.shape', op: 'eq', value: 'lp', hint: 'Use the LP shape.' },
        {
          param: 'filter.frequency',
          op: 'between',
          min: 80,
          max: 140,
          hint: 'Set Frequency between 80 and 140 (the readout shows roughly 175 Hz to 1.2 kHz).',
        },
      ],
    },
    success: 'You placed the cutoff to control brightness.',
  },
  {
    id: 'resonance',
    objective: 'Add resonance and see the peak at the cutoff.',
    explanation: [
      'Resonance feeds some of the filter output back to its input. This boosts a narrow band right at the cutoff, so filter sweeps sound vocal, whistling and squelchy.',
      'At high settings the peak can dominate the sound. The VCA Limiter On-Key function helps tame the level.',
    ],
    demonstration: {
      visual: 'filter',
      values: { 'filter.frequency': 120, 'filter.resonance': 100 },
      caption: 'A strong resonant peak boosting the harmonics around the cutoff.',
    },
    experiment: {
      steps: [
        'Raise Resonance, then sweep Frequency and watch the peak travel through the harmonics.',
      ],
      parameters: ['filter.resonance', 'filter.frequency'],
      visual: 'filter',
      start: { 'filter.frequency': 120 },
    },
    exercise: {
      kind: 'set',
      prompt: 'Create a strongly resonant low-pass filter.',
      conditions: [
        {
          param: 'filter.resonance',
          op: 'gte',
          value: 90,
          hint: 'Turn Resonance up to 90 or more.',
        },
        {
          param: 'filter.frequency',
          op: 'lte',
          value: 180,
          hint: 'Lower Frequency to 180 or below so the peak sits among the harmonics.',
        },
      ],
    },
    success: 'You made the filter sing.',
  },
  {
    id: 'slope',
    objective: 'Compare 12 dB and 24 dB filter slopes.',
    explanation: [
      'The slope says how fast the filter attenuates beyond the cutoff. At 24 dB per octave, frequencies an octave past the cutoff are much quieter than at 12 dB.',
      '12 dB sounds open and gentle, and 24 dB sounds firm and focused. Slope works only with Type = Classic, because Acid is always 24 dB.',
    ],
    demonstration: {
      visual: 'filter',
      values: { 'filter.frequency': 120, 'filter.slope': '12' },
      caption: 'A 12 dB slope: the curve falls gently, so more harmonics leak through.',
    },
    experiment: {
      steps: ['Toggle Slope between 12 and 24 dB and compare the steepness of the curve.'],
      parameters: ['filter.type', 'filter.slope', 'filter.frequency'],
      visual: 'filter',
      start: { 'filter.frequency': 120 },
    },
    exercise: {
      kind: 'set',
      prompt: 'Select the gentler 12 dB slope on the Classic filter.',
      conditions: [
        {
          param: 'filter.type',
          op: 'eq',
          value: 'classic',
          hint: 'Slope only works with Type = Classic.',
        },
        { param: 'filter.slope', op: 'eq', value: '12', hint: 'Set Slope to 12 dB.' },
      ],
    },
    success: 'You can choose between gentle and steep filtering.',
  },
  {
    id: 'overdrive',
    objective: 'Use pre-filter overdrive to add harmonics before filtering.',
    explanation: [
      'Overdrive saturates the mixer output before the filter, adding new harmonics. The filter then shapes these harmonics, which gives a warm, gritty character.',
      'Compare with Distortion in the Effects section, which comes after the filter.',
    ],
    demonstration: {
      visual: 'filter',
      values: { 'filter.frequency': 140, 'filter.overdrive': 80 },
      caption:
        'Overdrive is not drawn on this ideal spectrum. It adds extra harmonics before the filter.',
    },
    experiment: {
      steps: ['Raise Overdrive with a closed filter, then open the filter.'],
      parameters: ['filter.overdrive', 'filter.frequency', 'effects.distortion'],
      visual: 'filter',
    },
    exercise: {
      kind: 'set',
      prompt: 'Drive the filter: add a solid amount of overdrive.',
      conditions: [
        { param: 'filter.overdrive', op: 'gte', value: 60, hint: 'Turn Overdrive to 60 or more.' },
      ],
    },
    success: 'You know where overdrive sits in the signal chain.',
  },
  {
    id: 'filter-modulation',
    objective: 'Sweep the filter with the Mod Envelope for a plucky bass.',
    explanation: [
      'The Mod Envelope can open the filter at the start of each note and let it close again. With a short decay and low sustain, every note gets a bright “pluck” that fades to a darker tone.',
      'Filter Mod Env depth sets how far it sweeps, up to eight octaves at maximum.',
    ],
    demonstration: {
      visual: 'envelope',
      values: { 'modEnv.decay': 50, 'modEnv.sustain': 0, 'panel.envSelect': 'mod' },
      caption: 'The Mod Envelope shape that will drive the filter.',
    },
    experiment: {
      steps: [
        'Lower Frequency.',
        'Set Env Select to Mod Env, then decay short and sustain 0.',
        'Raise the filter Mod Env depth.',
      ],
      parameters: ['filter.frequency', 'filter.modEnvDepth', 'modEnv.decay', 'modEnv.sustain'],
      visual: 'envelope',
      start: { 'filter.frequency': 90 },
    },
    exercise: {
      kind: 'set',
      prompt: 'Build an envelope-swept pluck: closed filter, short Mod Env, positive depth.',
      conditions: [
        {
          param: 'filter.frequency',
          op: 'lte',
          value: 120,
          hint: 'Close the filter (Frequency ≤ 120).',
        },
        {
          param: 'filter.modEnvDepth',
          op: 'gte',
          value: 30,
          hint: 'Raise the filter Mod Env depth to at least +30.',
        },
        {
          param: 'modEnv.decay',
          op: 'between',
          min: 30,
          max: 80,
          hint: 'Give the Mod Env a short-to-medium Decay (30–80).',
        },
        {
          param: 'modEnv.sustain',
          op: 'lte',
          value: 20,
          hint: 'Lower the Mod Env Sustain (≤ 20) so the filter closes again.',
        },
      ],
    },
    success: 'You made the classic envelope filter pluck.',
  },
];

export const chapter5: Lesson[] = [
  {
    id: 'attack',
    objective: 'Shape how a note starts with Attack.',
    explanation: [
      'Attack is the time from key press to full level. Near zero sounds percussive. Long attacks make notes swell in, like bowed strings or pads.',
      'The manual gives about 250 ms at mid-travel and over 5 seconds at the top.',
    ],
    demonstration: {
      visual: 'envelope',
      values: { 'ampEnv.attack': 95 },
      caption: 'A slow attack: the note fades in.',
    },
    experiment: {
      steps: ['Move Amp Env Attack and watch the rising slope.'],
      parameters: ['ampEnv.attack'],
      visual: 'envelope',
    },
    exercise: {
      kind: 'set',
      prompt: 'Make notes swell in slowly.',
      conditions: [
        {
          param: 'ampEnv.attack',
          op: 'gte',
          value: 90,
          hint: 'Raise Amp Env Attack to 90 or more.',
        },
      ],
    },
    success: 'You control how notes begin.',
  },
  {
    id: 'decay',
    objective: 'Use Decay with low Sustain for plucked sounds.',
    explanation: [
      'Decay is the time from the peak down to the sustain level. With sustain at zero, decay alone sets how long a note rings, as with a plucked string.',
      'Mid-travel is about 150 ms.',
    ],
    demonstration: {
      visual: 'envelope',
      values: { 'ampEnv.decay': 55, 'ampEnv.sustain': 0 },
      caption: 'Zero attack, short decay, no sustain: a pluck.',
    },
    experiment: {
      steps: ['Set Sustain to 0, then vary Decay.'],
      parameters: ['ampEnv.attack', 'ampEnv.decay', 'ampEnv.sustain'],
      visual: 'envelope',
    },
    exercise: {
      kind: 'set',
      prompt: 'Design a pluck envelope.',
      conditions: [
        { param: 'ampEnv.attack', op: 'lte', value: 5, hint: 'Keep Attack at or near 0.' },
        {
          param: 'ampEnv.decay',
          op: 'between',
          min: 40,
          max: 75,
          hint: 'Set Decay between 40 and 75.',
        },
        {
          param: 'ampEnv.sustain',
          op: 'lte',
          value: 10,
          hint: 'Bring Sustain down to 10 or less.',
        },
      ],
    },
    success: 'You can shape plucks and stabs.',
  },
  {
    id: 'sustain',
    objective: 'Distinguish Sustain (a level) from the other ADSR stages (times).',
    explanation: [
      'Attack, Decay and Release are times. Sustain is a level: the height the envelope holds while the key stays down.',
      'An organ is all sustain, and a piano has none (it keeps decaying).',
    ],
    demonstration: {
      visual: 'envelope',
      values: { 'ampEnv.decay': 60, 'ampEnv.sustain': 90 },
      caption: 'The flat part is the sustain level.',
    },
    experiment: {
      steps: ['Move Sustain up and down and watch only the height of the flat section change.'],
      parameters: ['ampEnv.sustain'],
      visual: 'envelope',
      start: { 'ampEnv.decay': 60 },
    },
    exercise: {
      kind: 'choice',
      prompt: 'Which ADSR parameter sets a level rather than a time?',
      options: [
        { label: 'Attack', correct: false, feedback: 'Attack is the time to reach the peak.' },
        {
          label: 'Decay',
          correct: false,
          feedback: 'Decay is the time to fall to the sustain level.',
        },
        {
          label: 'Sustain',
          correct: true,
          feedback: 'Correct: Sustain is the level held while the key is down.',
        },
        {
          label: 'Release',
          correct: false,
          feedback: 'Release is the time to fade after the key is released.',
        },
      ],
    },
    success: 'You know the one ADSR control that is a level.',
  },
  {
    id: 'release',
    objective: 'Let notes ring on after the key is released.',
    explanation: [
      'Release is the fade time after you let go. Short releases make notes stop sharply, and long ones let them hang, which suits pads and atmospheric sounds.',
      'The maximum release is over 10 seconds, and the curve is not linear.',
    ],
    demonstration: {
      visual: 'envelope',
      values: { 'ampEnv.release': 95 },
      caption: 'A long release tail after the key-up marker.',
    },
    experiment: {
      steps: ['Raise Release and watch the tail after the dashed key-up line.'],
      parameters: ['ampEnv.release'],
      visual: 'envelope',
    },
    exercise: {
      kind: 'set',
      prompt: 'Give notes a long, lingering tail.',
      conditions: [
        {
          param: 'ampEnv.release',
          op: 'gte',
          value: 90,
          hint: 'Raise Amp Env Release to 90 or more.',
        },
      ],
    },
    success: 'You control how notes end.',
  },
  {
    id: 'amp-envelope',
    objective: 'Understand envelope triggering with legato playing.',
    explanation: [
      'Triggering decides whether overlapping (legato) notes restart the envelopes. Multi restarts on every note. Single only restarts on detached notes, so legato lines flow smoothly. Autoglide is like Single, but applies glide only to legato notes.',
      'The Env Select switch decides whether the faders and Triggering switch edit the Amp Env, the Mod Env, or both.',
    ],
    demonstration: {
      visual: 'envelope',
      values: { 'ampEnv.attack': 40, 'ampEnv.sustain': 90 },
      caption: 'With Multi, every new note starts the curve again from the attack.',
    },
    experiment: {
      steps: ['On the Hardware View, set Env Select and step the Triggering switch.'],
      parameters: ['panel.envSelect', 'ampEnv.triggering', 'modEnv.triggering'],
      visual: 'envelope',
    },
    exercise: {
      kind: 'choice',
      prompt:
        'Which Triggering mode restarts the envelope for every note, even when you play legato?',
      options: [
        { label: 'Single', correct: false, feedback: 'Single does not retrigger on legato notes.' },
        { label: 'Multi', correct: true, feedback: 'Correct: Multi always retriggers.' },
        {
          label: 'Autoglide',
          correct: false,
          feedback: 'Autoglide behaves like Single for triggering.',
        },
      ],
    },
    success: 'You can pick the right triggering for your playing style.',
  },
  {
    id: 'mod-envelope',
    objective: 'Use the Mod Envelope on pitch for a percussive drop.',
    explanation: [
      'The Mod Envelope does not control volume. It modulates pitch, pulse width and filter frequency through their Mod Env depth knobs.',
      'A fast negative pitch sweep at the start of each note is the classic synth-tom or “pew” sound. A depth of 8 corresponds to one octave.',
    ],
    demonstration: {
      visual: 'envelope',
      values: { 'panel.envSelect': 'mod', 'modEnv.decay': 35, 'modEnv.sustain': 0 },
      caption: 'A short Mod Env: fast hit, quick fall.',
    },
    experiment: {
      steps: [
        'Set Env Select to Mod, make a short decay with zero sustain.',
        'Turn Osc 1 pitch Mod Env depth negative.',
      ],
      parameters: ['osc1.modEnvDepth', 'modEnv.attack', 'modEnv.decay', 'modEnv.sustain'],
      visual: 'envelope',
    },
    exercise: {
      kind: 'set',
      prompt: 'Create a falling pitch sweep on Osc 1 at the start of each note.',
      conditions: [
        {
          param: 'osc1.modEnvDepth',
          op: 'lte',
          value: -10,
          hint: 'Turn the Osc 1 pitch Mod Env depth negative (≤ −10).',
        },
        { param: 'modEnv.attack', op: 'lte', value: 5, hint: 'Keep Mod Env Attack near 0.' },
        {
          param: 'modEnv.decay',
          op: 'between',
          min: 20,
          max: 70,
          hint: 'Short Mod Env Decay (20–70).',
        },
        {
          param: 'modEnv.sustain',
          op: 'eq',
          value: 0,
          hint: 'Mod Env Sustain at 0 so the pitch settles back.',
        },
      ],
    },
    success: 'You used the Mod Envelope as a modulation source.',
  },
];
