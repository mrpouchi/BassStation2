import type { Lesson } from './types';

export const chapter6: Lesson[] = [
  {
    id: 'lfo-1',
    objective: 'Create vibrato with LFO 1.',
    explanation: [
      'LFO 1 modulates oscillator pitch through each oscillator’s LFO 1 depth knob. A smooth triangle at around 5–7 Hz with a small depth sounds like natural vibrato.',
      'The manual’s scale: 6 = one semitone of swing, 12 = a whole tone, 32 = an octave.',
    ],
    demonstration: {
      visual: 'lfo',
      values: { 'osc1.lfo1Depth': 4 },
      caption: 'LFO 1 (orange) at the Init speed of about 7.9 Hz.',
    },
    experiment: {
      steps: ['Raise Osc 1 LFO 1 depth a little.', 'Change LFO 1 Speed and Waveform.'],
      parameters: ['lfo1.waveform', 'lfo1.speed', 'osc1.lfo1Depth', 'lfo1.delay'],
      visual: 'lfo',
    },
    exercise: {
      kind: 'set',
      prompt: 'Add a gentle vibrato to Osc 1.',
      conditions: [
        {
          param: 'lfo1.waveform',
          op: 'eq',
          value: 'triangle',
          hint: 'Use a smooth triangle LFO 1.',
        },
        {
          param: 'osc1.lfo1Depth',
          op: 'between',
          min: 2,
          max: 8,
          hint: 'A small Osc 1 LFO 1 depth (2–8) gives about ±1 semitone at most.',
        },
        {
          param: 'lfo1.speed',
          op: 'between',
          min: 55,
          max: 90,
          hint: 'Set LFO 1 Speed between 55 and 90 (about 3–12 Hz).',
        },
      ],
    },
    success: 'You created vibrato.',
  },
  {
    id: 'lfo-2',
    objective: 'Make the filter move with LFO 2.',
    explanation: [
      'LFO 2 modulates the filter frequency through the filter’s LFO 2 depth knob. Slow speeds give evolving sweeps, and faster speeds give wah and wobble.',
      'A depth of 16 swings the cutoff by one octave.',
    ],
    demonstration: {
      visual: 'lfo',
      values: { 'lfo2.speed': 40, 'filter.lfo2Depth': 32 },
      caption: 'LFO 2 (blue) sweeping the filter ±2 octaves.',
    },
    experiment: {
      steps: [
        'Lower the filter Frequency, then raise the filter LFO 2 depth.',
        'Try different LFO 2 waveforms.',
      ],
      parameters: ['lfo2.waveform', 'lfo2.speed', 'filter.lfo2Depth', 'filter.frequency'],
      visual: 'lfo',
      start: { 'filter.frequency': 120 },
    },
    exercise: {
      kind: 'set',
      prompt: 'Set up a slow filter sweep.',
      conditions: [
        {
          param: 'filter.lfo2Depth',
          op: 'gte',
          value: 20,
          hint: 'Raise the filter LFO 2 depth to at least 20.',
        },
        { param: 'lfo2.speed', op: 'lte', value: 60, hint: 'Slow LFO 2 down (Speed ≤ 60).' },
      ],
    },
    success: 'You made the filter move automatically.',
  },
  {
    id: 'modulation-depth',
    objective: 'Read modulation depth values as musical amounts.',
    explanation: [
      'Depth controls are centre-off: 0 means no modulation, and negative values invert the source.',
      'For LFO 1 to pitch the scale is musical: 6 = semitone, 12 = tone, 22 = fifth, 32 = octave, 56 = two octaves. The resolution is finer at low values, where vibrato lives.',
    ],
    demonstration: {
      visual: 'lfo',
      values: { 'osc1.lfo1Depth': 32 },
      caption: 'The LFO 1 readout shows the swing in semitones.',
    },
    experiment: {
      steps: ['Turn Osc 1 LFO 1 depth to 6, 12, 22 and 32 and read the semitone swing.'],
      parameters: ['osc1.lfo1Depth'],
      visual: 'lfo',
    },
    exercise: {
      kind: 'choice',
      prompt: 'On the Osc LFO 1 depth control, which value gives a pitch swing of one octave?',
      options: [
        { label: '12', correct: false, feedback: '12 gives a whole tone (2 semitones).' },
        { label: '32', correct: true, feedback: 'Correct: the manual lists 32 = one octave.' },
        { label: '63', correct: false, feedback: 'That is much more than an octave.' },
        { label: '127', correct: false, feedback: 'The maximum is about five octaves.' },
      ],
    },
    success: 'You can dial in modulation by ear and by number.',
  },
  {
    id: 'modulation-routing',
    objective: 'Route expression controls with On-Key functions.',
    explanation: [
      'Some routings live on the keyboard: hold Function and press a key. Mod Wh and Aftertouch functions decide what the mod wheel and key pressure do.',
      'For example, Aftertouch: Filter Freq (lower E) lets you press harder into a key to brighten the sound.',
    ],
    demonstration: {
      visual: 'lfo',
      values: {},
      caption:
        'Wheel and aftertouch scale modulation in real time. They are performance inputs, not drawn here.',
    },
    experiment: {
      steps: [
        'On the Hardware View press Function, then the lower E key, then use ◀ ▶ to change the value.',
      ],
      parameters: ['aftertouch.filterFreq', 'modWheel.lfo1ToOscPitch', 'modWheel.filterFreq'],
      visual: 'lfo',
    },
    exercise: {
      kind: 'set',
      prompt: 'Make key pressure open the filter strongly.',
      conditions: [
        {
          param: 'aftertouch.filterFreq',
          op: 'gte',
          value: 30,
          hint: 'Set Aftertouch: Filter Freq (Function + lower E) to +30 or more.',
        },
      ],
    },
    success: 'You routed an expression control.',
  },
  {
    id: 'modulation-destinations',
    objective: 'Know which modulation source reaches which destination.',
    explanation: [
      'On the panel, LFO 1 → oscillator pitch, LFO 2 → filter frequency and pulse width, and the Mod Env → pitch, pulse width and filter.',
      'Osc Filter Mod is a special case: Osc 2 modulates the filter at audio rate.',
    ],
    demonstration: {
      visual: 'lfo',
      values: { 'osc1.lfo1Depth': 10, 'filter.lfo2Depth': 20 },
      caption: 'Each LFO with its own destination.',
    },
    experiment: {
      steps: ['Open the Reference view, Panel controls, and find each depth control’s target.'],
      parameters: ['osc1.lfo1Depth', 'filter.lfo2Depth', 'effects.oscFilterMod'],
      visual: 'lfo',
    },
    exercise: {
      kind: 'choice',
      prompt: 'Which LFO modulates the filter frequency from the panel?',
      options: [
        { label: 'LFO 1', correct: false, feedback: 'LFO 1 is wired to oscillator pitch.' },
        { label: 'LFO 2', correct: true, feedback: 'Correct: the filter’s LFO 2 depth knob.' },
        {
          label: 'Both',
          correct: false,
          feedback: 'Only LFO 2 is used for filter modulation (p. 41).',
        },
      ],
    },
    success: 'You know the modulation map of the Bass Station II.',
  },
];

export const chapter7: Lesson[] = [
  {
    id: 'arpeggiator',
    objective: 'Turn chords into patterns with the arpeggiator.',
    explanation: [
      'The arpeggiator plays held notes one at a time. Arp Mode sets the order, Arp Octaves repeats the pattern higher, Rhythm picks one of 32 patterns and Tempo sets the speed.',
      'Latch keeps the pattern running after you release the keys.',
    ],
    demonstration: {
      visual: 'arp',
      values: { 'arp.on': true, 'arp.mode': 'updn', 'arp.octaves': 2 },
      caption: 'UpDn over two octaves on a C major chord.',
    },
    experiment: {
      steps: ['Change Arp Mode and Octaves and watch the note order.'],
      parameters: ['arp.on', 'arp.mode', 'arp.octaves', 'arp.rhythm', 'arp.tempo'],
      visual: 'arp',
    },
    exercise: {
      kind: 'set',
      prompt: 'Set the arpeggiator to go up and down over two octaves.',
      conditions: [
        { param: 'arp.on', op: 'eq', value: true, hint: 'Turn the arpeggiator on.' },
        { param: 'arp.mode', op: 'eq', value: 'updn', hint: 'Set Arp Mode to UpDn.' },
        { param: 'arp.octaves', op: 'eq', value: 2, hint: 'Set Arp Octaves to 2.' },
      ],
    },
    success: 'You programmed an arpeggio.',
  },
  {
    id: 'sequencer',
    objective: 'Understand the built-in 32-step sequencer.',
    explanation: [
      'Switch Arp Mode to Record and play notes (Rest inserts silence, Legato ties notes). Play mode then plays the sequence back, transposed by the key you hold.',
      'Four sequences are stored, chosen with the SEQ control (Arp Octaves). Rhythm still sets the timing. Seq Retrig realigns the sequence every two bars.',
    ],
    demonstration: {
      visual: 'arp',
      values: { 'arp.mode': 'play' },
      caption: 'In Record and Play the timing comes from the Rhythm pattern.',
    },
    experiment: {
      steps: ['Set Arp Mode to Record and notice Arp Octaves now edits SEQ.'],
      parameters: ['arp.mode', 'arp.sequence', 'arp.seqRetrig'],
      visual: 'arp',
    },
    exercise: {
      kind: 'choice',
      prompt: 'How many notes or rests can one sequence hold?',
      options: [
        {
          label: '8',
          correct: false,
          feedback: 'Eight is the shortest rhythm pattern length, not the sequence capacity.',
        },
        { label: '16', correct: false, feedback: 'Sequences can be longer than 16 steps.' },
        { label: '32', correct: true, feedback: 'Correct: up to 32 notes or rests per sequence.' },
        { label: 'Unlimited', correct: false, feedback: 'Memory is limited to 32 steps.' },
      ],
    },
    success: 'You know how the sequencer is organised.',
  },
  {
    id: 'glide',
    objective: 'Slide between notes with portamento.',
    explanation: [
      'Glide Time makes the pitch slide from the previous note to the new one. Fully anticlockwise turns it off.',
      'With Triggering on Autoglide, only overlapping (legato) notes glide, which is ideal for expressive basslines.',
    ],
    demonstration: {
      visual: 'glide',
      values: { 'portamento.glideTime': 64 },
      caption: 'Pitch sliding up an octave.',
    },
    experiment: {
      steps: [
        'Raise Glide Time and watch the slide lengthen.',
        'Add Glide Divergence (Function + Input Gain key, twice) to make Osc 2 lag.',
      ],
      parameters: ['portamento.glideTime', 'voice.glideDivergence', 'ampEnv.triggering'],
      visual: 'glide',
    },
    exercise: {
      kind: 'set',
      prompt: 'Set up glide that only happens when you play legato.',
      conditions: [
        {
          param: 'portamento.glideTime',
          op: 'gte',
          value: 40,
          hint: 'Raise Glide Time to at least 40.',
        },
        {
          param: 'ampEnv.triggering',
          op: 'eq',
          value: 'autoglide',
          hint: 'Set the Amp Env Triggering switch to Autoglide.',
        },
      ],
    },
    success: 'You can glide between notes.',
  },
  {
    id: 'keyboard-controls',
    objective: 'Shift the keyboard range with Octave and Transpose.',
    explanation: [
      'Twenty-five keys cover two octaves. The Octave buttons shift them from −4 to +5 octaves (press both to reset), and Transpose shifts in semitones relative to middle C.',
      'Transposing lets you play a song in another key with the same fingering.',
    ],
    demonstration: {
      visual: 'keyboard',
      values: { 'performance.octave': -1 },
      caption: 'Octave −1: the keyboard moves down twelve semitones.',
    },
    experiment: {
      steps: ['Use the Octave buttons on the Hardware View.', 'Press Transpose, then a key.'],
      parameters: ['performance.octave', 'performance.transpose'],
      visual: 'keyboard',
    },
    exercise: {
      kind: 'set',
      prompt: 'Move the keyboard one octave down for bass playing.',
      conditions: [
        {
          param: 'performance.octave',
          op: 'eq',
          value: -1,
          hint: 'Press Octave ◀ once (octave −1).',
        },
      ],
    },
    success: 'You can reach any register.',
  },
  {
    id: 'performance-features',
    objective: 'Add touch sensitivity with velocity.',
    explanation: [
      'Velocity is how hard you strike a key. Velocity: Amp Env (Function + upper D#) makes harder playing louder, and the manual suggests about +40 for a natural feel. Velocity: Mod Env does the same for everything the Mod Env controls.',
      'Combined with aftertouch and the wheels, this makes the synth respond to your playing.',
    ],
    demonstration: {
      visual: 'envelope',
      values: { 'ampEnv.decay': 70, 'ampEnv.sustain': 60 },
      caption: 'Velocity scales the height of this curve per note.',
    },
    experiment: {
      steps: ['Press Function, then upper D# on the Hardware View, then use ◀ ▶.'],
      parameters: ['velocity.ampEnv', 'velocity.modEnv'],
      visual: 'envelope',
    },
    exercise: {
      kind: 'set',
      prompt: 'Give the synth a natural touch response on volume.',
      conditions: [
        {
          param: 'velocity.ampEnv',
          op: 'between',
          min: 30,
          max: 50,
          hint: 'Set Velocity: Amp Env between +30 and +50 (Function + upper D#).',
        },
      ],
    },
    success: 'Your playing dynamics now shape the sound.',
  },
];

export const chapter8: Lesson[] = [
  {
    id: 'bass-sounds',
    objective: 'Combine oscillators, sub, filter and envelope into a solid bass.',
    explanation: [
      'A classic bass starts from a sawtooth with a sub oscillator underneath, a fairly closed low-pass filter and a tight envelope (fast attack, short release).',
      'Everything you have learned comes together here.',
    ],
    demonstration: {
      visual: 'filter',
      values: { 'mixer.sub': 200, 'filter.frequency': 95, 'filter.resonance': 30 },
      caption: 'Low harmonics dominate and the top end is rolled off.',
    },
    experiment: {
      steps: ['Start from Init, add the sub, close the filter, tighten the envelope.'],
      parameters: [
        'osc1.waveform',
        'mixer.sub',
        'sub.octave',
        'filter.frequency',
        'filter.resonance',
        'ampEnv.attack',
        'ampEnv.release',
      ],
      visual: 'filter',
    },
    exercise: {
      kind: 'set',
      prompt: 'Build a classic sub bass patch.',
      conditions: [
        { param: 'osc1.waveform', op: 'eq', value: 'sawtooth', hint: 'Osc 1 sawtooth.' },
        { param: 'mixer.sub', op: 'gte', value: 150, hint: 'Sub level at least 150.' },
        {
          param: 'filter.frequency',
          op: 'lte',
          value: 110,
          hint: 'Close the filter (Frequency ≤ 110).',
        },
        { param: 'ampEnv.attack', op: 'lte', value: 5, hint: 'Immediate attack (≤ 5).' },
        {
          param: 'ampEnv.release',
          op: 'lte',
          value: 30,
          hint: 'Short release (≤ 30) to keep notes tight.',
        },
      ],
    },
    success: 'You designed a bass from scratch.',
  },
  {
    id: 'leads',
    objective: 'Design an expressive lead with detune, glide and delayed vibrato.',
    explanation: [
      'Leads need to cut through: two detuned oscillators, some glide between notes and vibrato that fades in after the note starts (LFO 1 Delay).',
      'Delayed vibrato is how singers and string players phrase long notes.',
    ],
    demonstration: {
      visual: 'lfo',
      values: { 'lfo1.delay': 70, 'osc1.lfo1Depth': 5 },
      caption: 'LFO 1 fading in after the key press (delay).',
    },
    experiment: {
      steps: ['Detune Osc 2, add glide, then set LFO 1 Delay with the Delay/Speed switch.'],
      parameters: [
        'mixer.osc2',
        'osc2.fine',
        'portamento.glideTime',
        'osc1.lfo1Depth',
        'lfo1.delay',
      ],
      visual: 'lfo',
    },
    exercise: {
      kind: 'set',
      prompt: 'Build a lead: detuned oscillators, glide and delayed vibrato.',
      conditions: [
        { param: 'mixer.osc2', op: 'gte', value: 150, hint: 'Bring Osc 2 up (≥ 150).' },
        {
          param: 'osc2.fine',
          op: 'between',
          min: 5,
          max: 25,
          hint: 'Detune Osc 2 Fine by +5 to +25 cents.',
        },
        { param: 'portamento.glideTime', op: 'gte', value: 20, hint: 'Add some glide (≥ 20).' },
        {
          param: 'osc1.lfo1Depth',
          op: 'between',
          min: 2,
          max: 10,
          hint: 'A little LFO 1 on Osc 1 pitch (2–10).',
        },
        {
          param: 'lfo1.delay',
          op: 'gte',
          value: 30,
          hint: 'LFO 1 Delay ≥ 30 so vibrato fades in.',
        },
      ],
    },
    success: 'You designed a singing lead.',
  },
  {
    id: 'pads',
    objective: 'Create a slow, wide pad.',
    explanation: [
      'Pads swell in and fade out slowly, so they need long attack and release. Detuned oscillators and gentle movement keep them alive.',
      'Even on a monophonic synth, pads work beautifully for drones and slow lines.',
    ],
    demonstration: {
      visual: 'envelope',
      values: { 'ampEnv.attack': 95, 'ampEnv.release': 100 },
      caption: 'Slow attack and long release.',
    },
    experiment: {
      steps: ['Lengthen Attack and Release, detune Osc 2, add slow LFO 2 movement to the filter.'],
      parameters: [
        'ampEnv.attack',
        'ampEnv.release',
        'mixer.osc2',
        'osc2.fine',
        'filter.lfo2Depth',
      ],
      visual: 'envelope',
    },
    exercise: {
      kind: 'set',
      prompt: 'Design a pad that swells and lingers.',
      conditions: [
        { param: 'ampEnv.attack', op: 'gte', value: 80, hint: 'Attack ≥ 80.' },
        { param: 'ampEnv.release', op: 'gte', value: 80, hint: 'Release ≥ 80.' },
        { param: 'mixer.osc2', op: 'gte', value: 100, hint: 'Osc 2 level ≥ 100.' },
        {
          param: 'osc2.fine',
          op: 'outside',
          min: -4,
          max: 4,
          hint: 'Detune Osc 2 by more than 4 cents (either direction).',
        },
      ],
    },
    success: 'You made an evolving pad.',
  },
  {
    id: 'layering',
    objective: 'Understand why layered and detuned sources sound bigger.',
    explanation: [
      'Two sources at almost the same pitch interfere: their sum swells and dips as they drift in and out of phase. We hear this as width and movement.',
      'Layering octaves (Range or sub) adds weight and brightness. Layering intervals (Coarse) adds harmony.',
    ],
    demonstration: {
      visual: 'waveform',
      values: { 'mixer.osc2': 255, 'osc2.fine': 12, 'mixer.sub': 120 },
      caption: 'Osc 1, slightly detuned Osc 2 and a sub, summed.',
    },
    experiment: {
      steps: ['Combine Osc 1, Osc 2 and Sub in different proportions.'],
      parameters: ['mixer.osc1', 'mixer.osc2', 'mixer.sub', 'osc2.fine', 'osc2.range'],
      visual: 'waveform',
    },
    exercise: {
      kind: 'choice',
      prompt: 'Why does slightly detuning Osc 2 against Osc 1 make the sound wider?',
      options: [
        {
          label: 'The waves drift in and out of phase, creating slow beating',
          correct: true,
          feedback: 'Correct: that phase drift is heard as chorus-like movement.',
        },
        {
          label: 'It makes the sound louder',
          correct: false,
          feedback: 'Loudness changes only slightly. The movement is what matters.',
        },
        {
          label: 'It removes harmonics',
          correct: false,
          feedback: 'Detuning adds complexity. It does not filter.',
        },
        {
          label: 'It shifts the sound an octave',
          correct: false,
          feedback: 'A few cents is far less than an octave (1200 cents).',
        },
      ],
    },
    success: 'You understand why layering works.',
  },
  {
    id: 'original-presets',
    objective: 'Design an original sound and save it.',
    explanation: [
      'There is no single right answer in sound design. Start from the Init Patch, change something, look and listen to what it does, and keep going.',
      'When you like the result, save it in the Sound Library and give it a name and description so you remember how it was made.',
    ],
    demonstration: {
      visual: 'filter',
      values: {
        'osc1.waveform': 'pulse',
        'osc1.pwManual': 30,
        'filter.frequency': 140,
        'filter.resonance': 70,
      },
      caption: 'One possible starting point. Yours will be different.',
    },
    experiment: {
      steps: ['Use the Hardware View or Learning View to change any parameters you like.'],
      parameters: [
        'osc1.waveform',
        'filter.frequency',
        'filter.resonance',
        'ampEnv.attack',
        'lfo2.speed',
      ],
      visual: 'filter',
    },
    exercise: {
      kind: 'changed',
      prompt: 'Change at least 8 sound parameters from the Init Patch to make your own sound.',
      minChanged: 8,
    },
    success: 'You designed an original sound. Save it in the Sound Library.',
  },
];
