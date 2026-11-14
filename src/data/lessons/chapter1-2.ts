import type { Lesson } from './types';

export const chapter1: Lesson[] = [
  {
    id: 'frequency',
    objective:
      'Explain frequency as cycles per second, and see that doubling it raises the pitch by an octave.',
    explanation: [
      'Sound is air pressure moving back and forth. One complete back-and-forth is a cycle, and frequency counts how many cycles happen each second. It is measured in hertz (Hz). The note A3 on the Bass Station II (8′ range) vibrates 440 times per second.',
      'Our ears hear frequency on a ratio scale. Doubling the frequency always sounds like “the same note, higher”, an interval called an octave. That is why the Range switch, which doubles or halves the frequency, moves in whole octaves.',
    ],
    demonstration: {
      visual: 'waveform',
      values: { 'osc1.waveform': 'sine' },
      caption:
        'A sine wave at Osc 1. The plot always shows two cycles, so a higher frequency means each cycle takes less time.',
    },
    experiment: {
      steps: [
        'Play different keys on the panel and watch the Hz readout under the waveform.',
        'Play two C keys an octave apart and compare their frequencies: the higher one is exactly double.',
        'Change Osc 1 Range between 16′, 8′, 4′ and 2′ and watch the frequency halve or double.',
      ],
      parameters: ['osc1.range', 'performance.octave'],
      visual: 'waveform',
      start: { 'osc1.waveform': 'sine' },
    },
    exercise: {
      kind: 'choice',
      prompt: 'A3 at 8′ is 440 Hz. What is the frequency of A4, one octave higher?',
      options: [
        {
          label: '450 Hz',
          correct: false,
          feedback: 'An octave is not a fixed number of hertz added. It is a doubling.',
        },
        {
          label: '660 Hz',
          correct: false,
          feedback: '660 Hz is 1.5 × 440, a perfect fifth above A3, not an octave.',
        },
        {
          label: '880 Hz',
          correct: true,
          feedback: 'Correct: one octave up doubles the frequency, 2 × 440 = 880 Hz.',
        },
        {
          label: '220 Hz',
          correct: false,
          feedback: 'Halving the frequency goes an octave down, to A2.',
        },
      ],
    },
    success: 'You know that pitch works on ratios: ×2 is one octave up.',
  },
  {
    id: 'amplitude',
    objective: 'Relate amplitude to loudness and see how the Amp Envelope controls it over time.',
    explanation: [
      'Amplitude is the size of the pressure swing. Bigger swings sound louder. On a waveform plot it is the height of the wave, while frequency is how tightly the cycles are packed.',
      'On the Bass Station II the VCA (voltage-controlled amplifier) sets the amplitude of every note. The Amp Envelope drives it, so loudness can change while a note plays. Sustain sets the level held while the key is down.',
    ],
    demonstration: {
      visual: 'envelope',
      values: {
        'ampEnv.attack': 30,
        'ampEnv.decay': 64,
        'ampEnv.sustain': 64,
        'ampEnv.release': 60,
      },
      caption:
        'Amplitude over time: rises during attack, settles to the sustain level, falls after release.',
    },
    experiment: {
      steps: [
        'Move Amp Env Sustain down and watch the held part of the curve drop.',
        'Set Sustain to 0: the note becomes silent once the decay finishes, even with the key held.',
      ],
      parameters: ['ampEnv.sustain', 'ampEnv.decay', 'master.volume'],
      visual: 'envelope',
    },
    exercise: {
      kind: 'set',
      prompt: 'Make held notes settle at roughly half amplitude.',
      conditions: [
        {
          param: 'ampEnv.sustain',
          op: 'between',
          min: 54,
          max: 74,
          hint: 'Put Amp Env Sustain near the middle (around 64).',
        },
        {
          param: 'ampEnv.decay',
          op: 'gte',
          value: 10,
          hint: 'Give Decay some time (≥ 10) so you can see the fall from the peak.',
        },
      ],
    },
    success:
      'You used the envelope to shape amplitude: loudness that changes over the life of a note.',
  },
  {
    id: 'waveforms',
    objective: 'Recognise the four oscillator waveforms by shape and describe their character.',
    explanation: [
      'Each oscillator offers sine, triangle, sawtooth and pulse. The shape of one cycle decides the timbre, so two waves at the same pitch and loudness can sound completely different.',
      'Smooth shapes sound soft and pure. Shapes with sharp corners and jumps sound bright and buzzy, because sharp edges are made of many high harmonics.',
    ],
    demonstration: {
      visual: 'waveform',
      values: {
        'osc1.waveform': 'triangle',
        'osc2.waveform': 'sawtooth',
        'mixer.osc2': 255,
        'osc2.range': '8',
      },
      caption: 'Sources view: Osc 1 triangle (orange) and Osc 2 sawtooth (blue) at the same pitch.',
    },
    experiment: {
      steps: [
        'Step Osc 1 through all four waveforms and compare their shapes.',
        'Switch the plot to “Sources” to see each oscillator separately.',
      ],
      parameters: ['osc1.waveform', 'osc2.waveform', 'mixer.osc2'],
      visual: 'waveform',
    },
    exercise: {
      kind: 'choice',
      prompt: 'Which waveform contains only the fundamental frequency and no harmonics?',
      options: [
        {
          label: 'Sawtooth',
          correct: false,
          feedback: 'The sawtooth contains every harmonic, which is why it is the brightest.',
        },
        {
          label: 'Sine',
          correct: true,
          feedback: 'Correct: a sine wave is a single pure frequency.',
        },
        {
          label: 'Pulse',
          correct: false,
          feedback: 'Pulse waves contain many harmonics. Their mix depends on the width.',
        },
        {
          label: 'Triangle',
          correct: false,
          feedback:
            'Close: a triangle has few harmonics, but it still has odd ones that fade quickly.',
        },
      ],
    },
    success: 'You can match each waveform to its sound character.',
  },
  {
    id: 'pitch',
    objective:
      'Use Range and Coarse to set oscillator pitch, and build a musical interval from two oscillators.',
    explanation: [
      'Pitch is how we perceive frequency. Range moves an oscillator in octaves, Coarse in semitones (±12) and Fine in cents (±100).',
      'With both oscillators in the mixer, tuning Osc 2 a few semitones away from Osc 1 makes every key play two notes. +7 semitones is a perfect fifth, the “power chord” of synth basses and leads.',
    ],
    demonstration: {
      visual: 'waveform',
      values: { 'mixer.osc2': 255, 'osc2.coarse': 7 },
      caption:
        'Osc 2 a fifth above Osc 1: three Osc 2 cycles for every two Osc 1 cycles (a 3:2 ratio).',
    },
    experiment: {
      steps: [
        'Bring Osc 2 into the mixer.',
        'Turn Osc 2 Coarse and watch the two waves line up only at certain intervals (+7, +12).',
      ],
      parameters: ['mixer.osc2', 'osc2.coarse', 'osc2.range'],
      visual: 'waveform',
    },
    exercise: {
      kind: 'set',
      prompt:
        'Make every key play a perfect fifth: Osc 2 seven semitones above Osc 1, both audible.',
      conditions: [
        {
          param: 'osc2.coarse',
          op: 'eq',
          value: 7,
          hint: 'Select Osc 2 and set Coarse to +7.0 semitones.',
        },
        {
          param: 'osc2.range',
          op: 'eq',
          value: '8',
          hint: 'Keep Osc 2 Range at 8′ so it sits in the same octave as Osc 1.',
        },
        { param: 'osc1.range', op: 'eq', value: '8', hint: 'Keep Osc 1 Range at 8′.' },
        {
          param: 'mixer.osc2',
          op: 'gte',
          value: 128,
          hint: 'Raise the Osc 2 level in the mixer (≥ 128).',
        },
      ],
    },
    success: 'You built an interval from two oscillators: one key, two notes.',
  },
  {
    id: 'harmonics',
    objective: 'Understand harmonics as the building blocks of timbre and see them on a spectrum.',
    explanation: [
      'Any repeating wave can be described as a sum of sine waves at whole-number multiples of its fundamental frequency: ×1, ×2, ×3… These are the harmonics, and their relative levels set the timbre.',
      'A sawtooth has every harmonic, each one quieter (1/n). A square has only the odd ones (1, 3, 5…). This matters because the filter works by removing harmonics: you can only take away what is there.',
    ],
    demonstration: {
      visual: 'filter',
      values: {},
      caption: 'Bars: harmonics of a sawtooth. The filter is fully open, so they all pass.',
    },
    experiment: {
      steps: [
        'Switch Osc 1 between sawtooth, pulse (50%), triangle and sine and watch the bars.',
        'Notice how the square (pulse at 50%) skips every second harmonic.',
      ],
      parameters: ['osc1.waveform', 'osc1.pwManual'],
      visual: 'filter',
    },
    exercise: {
      kind: 'choice',
      prompt: 'A square wave (pulse at 50%) contains…',
      options: [
        {
          label: 'Only the odd harmonics (1, 3, 5, …)',
          correct: true,
          feedback: 'Correct: that gap is what makes the square sound hollow.',
        },
        {
          label: 'Only the even harmonics',
          correct: false,
          feedback: 'The fundamental (harmonic 1) is odd and is always present.',
        },
        {
          label: 'Every harmonic at equal level',
          correct: false,
          feedback: 'No real waveform has equal harmonics. They fall off with frequency.',
        },
        { label: 'No harmonics', correct: false, feedback: 'That would be a sine wave.' },
      ],
    },
    success: 'You can read a spectrum and know which harmonics each waveform offers the filter.',
  },
];

export const chapter2: Lesson[] = [
  {
    id: 'oscillator-1',
    objective: 'Operate the shared oscillator controls and set Oscillator 1’s waveform and octave.',
    explanation: [
      'Bass Station II has two identical oscillators but only one set of controls. The Osc Select switch decides which oscillator the knobs and buttons edit, and the other keeps its settings.',
      'Oscillator 1 is special: the sub oscillator follows it, and it drives Osc 2 when Sync is on.',
    ],
    demonstration: {
      visual: 'waveform',
      values: { 'osc1.waveform': 'triangle', 'osc1.range': '16' },
      caption: 'Osc 1 with a triangle wave at 16′, one octave below concert pitch.',
    },
    experiment: {
      steps: [
        'On the Hardware View, put Osc Select on 1.',
        'Press Waveform and Range and watch their LEDs step.',
      ],
      parameters: ['panel.oscSelect', 'osc1.waveform', 'osc1.range'],
      visual: 'waveform',
    },
    exercise: {
      kind: 'set',
      prompt: 'Give Oscillator 1 a triangle wave, one octave down (16′).',
      conditions: [
        {
          param: 'osc1.waveform',
          op: 'eq',
          value: 'triangle',
          hint: 'Select Osc 1 and step Waveform to triangle.',
        },
        { param: 'osc1.range', op: 'eq', value: '16', hint: 'Step Range to 16′.' },
      ],
    },
    success: 'You can configure Oscillator 1 with the shared controls.',
  },
  {
    id: 'oscillator-2',
    objective: 'Add Oscillator 2 and detune it slightly to thicken the sound.',
    explanation: [
      'Two oscillators at exactly the same pitch simply add up. Detune one by a few cents and the waves slowly drift in and out of phase. You hear a gentle “beating” that makes the sound wide and alive.',
      'This detuned-saw sound is the classic foundation of synth basses, leads and pads.',
    ],
    demonstration: {
      visual: 'waveform',
      values: { 'mixer.osc2': 255, 'osc2.fine': 30 },
      caption: 'Sources view: Osc 2 detuned by +30 cents slowly slides away from Osc 1.',
    },
    experiment: {
      steps: [
        'Bring up Osc 2 in the mixer.',
        'Move Osc 2 Fine and compare the Sources view at small and large detune.',
      ],
      parameters: ['mixer.osc2', 'osc2.waveform', 'osc2.fine'],
      visual: 'waveform',
    },
    exercise: {
      kind: 'set',
      prompt: 'Create a classic detuned pair: two sawtooths, Osc 2 slightly sharp.',
      conditions: [
        {
          param: 'osc2.waveform',
          op: 'eq',
          value: 'sawtooth',
          hint: 'Set Osc 2 waveform to sawtooth.',
        },
        {
          param: 'mixer.osc2',
          op: 'gte',
          value: 200,
          hint: 'Raise the Osc 2 mixer level to at least 200.',
        },
        {
          param: 'osc2.fine',
          op: 'between',
          min: 5,
          max: 20,
          hint: 'Detune Osc 2 Fine to between +5 and +20 cents. Small amounts give a gentle chorus.',
        },
      ],
    },
    success: 'You made the classic detuned two-oscillator sound.',
  },
  {
    id: 'sawtooth',
    objective: 'Understand why the sawtooth is the go-to waveform for subtractive synthesis.',
    explanation: [
      'The sawtooth (a rising ramp and then a jump) contains every harmonic, the nth at 1/n of the fundamental. That makes it the richest raw material for a filter to carve into.',
      'Brass, strings and most classic bass sounds start from sawtooth waves.',
    ],
    demonstration: {
      visual: 'filter',
      values: {},
      caption: 'The sawtooth harmonic series: every bar is present, gently falling.',
    },
    experiment: {
      steps: [
        'Lower the filter Frequency slowly and watch the high harmonics turn grey (removed).',
      ],
      parameters: ['osc1.waveform', 'filter.frequency'],
      visual: 'filter',
    },
    exercise: {
      kind: 'choice',
      prompt: 'How loud is the 4th harmonic of a sawtooth compared with the fundamental?',
      options: [
        {
          label: '1/4 of the fundamental',
          correct: true,
          feedback: 'Correct: a sawtooth’s nth harmonic has amplitude 1/n.',
        },
        {
          label: '1/16 of the fundamental',
          correct: false,
          feedback: '1/n² describes the triangle wave’s odd harmonics.',
        },
        {
          label: 'It is absent',
          correct: false,
          feedback: 'Even harmonics are missing in square waves, not sawtooths.',
        },
        {
          label: 'Same as the fundamental',
          correct: false,
          feedback: 'Harmonics fall off. Equal levels would sound like harsh noise.',
        },
      ],
    },
    success: 'You know the sawtooth’s harmonic recipe.',
  },
  {
    id: 'square',
    objective: 'Create a square wave and recognise its hollow character.',
    explanation: [
      'On Bass Station II a square wave is the Pulse waveform with a 50% pulse width: high for half the cycle, low for the other half.',
      'A square has only odd harmonics, which gives the hollow, woody tone of clarinets and many retro game sounds.',
    ],
    demonstration: {
      visual: 'waveform',
      values: { 'osc1.waveform': 'pulse', 'osc1.pwManual': 50 },
      caption: 'A 50% pulse: equal time high and low.',
    },
    experiment: {
      steps: [
        'Select Pulse on Osc 1.',
        'Set the PW source switch to Manual and turn Pulse Width to 50.',
      ],
      parameters: ['osc1.waveform', 'panel.pwSource', 'osc1.pwManual'],
      visual: 'waveform',
    },
    exercise: {
      kind: 'set',
      prompt: 'Turn Oscillator 1 into a perfect square wave.',
      conditions: [
        { param: 'osc1.waveform', op: 'eq', value: 'pulse', hint: 'Set Osc 1 waveform to Pulse.' },
        {
          param: 'osc1.pwManual',
          op: 'eq',
          value: 50,
          hint: 'Set the manual pulse width to exactly 50%.',
        },
      ],
    },
    success: 'You made a square wave from the pulse oscillator.',
  },
  {
    id: 'pulse',
    objective: 'Narrow the pulse width and hear the tone thin out.',
    explanation: [
      'Moving the pulse width away from 50% creates narrow pulses. Even harmonics return and the balance shifts: the sound gets thinner, more nasal and reedy.',
      '5% and 95% contain the same harmonics. They are the same pulse, upside down.',
    ],
    demonstration: {
      visual: 'waveform',
      values: { 'osc1.waveform': 'pulse', 'osc1.pwManual': 12 },
      caption: 'A 12% pulse: a short spike each cycle.',
    },
    experiment: {
      steps: [
        'Sweep the manual pulse width from 50 towards 95 and watch the shape and the harmonic bars.',
      ],
      parameters: ['osc1.waveform', 'osc1.pwManual'],
      visual: 'filter',
      start: { 'osc1.waveform': 'pulse' },
    },
    exercise: {
      kind: 'set',
      prompt: 'Make a thin, reedy narrow pulse on Oscillator 1.',
      conditions: [
        { param: 'osc1.waveform', op: 'eq', value: 'pulse', hint: 'Use the Pulse waveform.' },
        {
          param: 'osc1.pwManual',
          op: 'outside',
          min: 20,
          max: 80,
          hint: 'Push the pulse width below 20% or above 80%.',
        },
      ],
    },
    success: 'You used pulse width as a tone control.',
  },
  {
    id: 'octave',
    objective: 'Stack oscillators in octaves using the Range footages.',
    explanation: [
      'Range uses organ-stop footages. 16′, 8′, 4′ and 2′ are each one octave apart, and 8′ is concert pitch.',
      'Layering octaves (for example Osc 1 at 8′ and Osc 2 at 4′) adds brightness and size without changing the note.',
    ],
    demonstration: {
      visual: 'waveform',
      values: { 'mixer.osc2': 200, 'osc2.range': '4' },
      caption: 'Osc 2 at 4′ completes two cycles for every Osc 1 cycle.',
    },
    experiment: {
      steps: ['Bring up Osc 2 and change its Range while watching the Sources view.'],
      parameters: ['osc1.range', 'osc2.range', 'mixer.osc2'],
      visual: 'waveform',
    },
    exercise: {
      kind: 'set',
      prompt: 'Layer Osc 2 exactly one octave above Osc 1.',
      conditions: [
        { param: 'osc1.range', op: 'eq', value: '8', hint: 'Set Osc 1 to 8′.' },
        { param: 'osc2.range', op: 'eq', value: '4', hint: 'Set Osc 2 to 4′.' },
        {
          param: 'osc2.coarse',
          op: 'eq',
          value: 0,
          hint: 'Centre Osc 2 Coarse (0) so Range alone sets the interval.',
        },
        {
          param: 'mixer.osc2',
          op: 'gte',
          value: 128,
          hint: 'Make Osc 2 audible in the mixer (≥ 128).',
        },
      ],
    },
    success: 'You stacked oscillators in octaves.',
  },
  {
    id: 'semitone',
    objective: 'See that 12 semitones of Coarse equal one octave of Range.',
    explanation: [
      'The keyboard is divided into semitones, and twelve of them make an octave. Coarse tunes an oscillator by up to ±12 semitones, so its extreme settings land exactly one octave away.',
      'Fine adds cents (hundredths of a semitone) for detuning.',
    ],
    demonstration: {
      visual: 'waveform',
      values: { 'mixer.osc2': 200, 'osc2.coarse': 12 },
      caption: 'Osc 2 Coarse +12 at 8′ looks identical to Osc 2 at 4′.',
    },
    experiment: {
      steps: ['Turn Osc 2 Coarse through +5, +7 and +12 and compare the waveform alignment.'],
      parameters: ['osc2.coarse', 'osc2.fine', 'mixer.osc2'],
      visual: 'waveform',
    },
    exercise: {
      kind: 'set',
      prompt: 'Reach one octave up on Osc 2 using Coarse only (Range stays at 8′).',
      conditions: [
        { param: 'osc2.range', op: 'eq', value: '8', hint: 'Leave Osc 2 Range at 8′.' },
        {
          param: 'osc2.coarse',
          op: 'eq',
          value: 12,
          hint: 'Turn Osc 2 Coarse fully clockwise (+12.0).',
        },
        { param: 'mixer.osc2', op: 'gte', value: 128, hint: 'Make Osc 2 audible.' },
      ],
    },
    success: 'You proved that 12 semitones make an octave.',
  },
  {
    id: 'pulse-width',
    objective: 'Animate the pulse width with LFO 2 (pulse-width modulation).',
    explanation: [
      'The pulse width can be moved automatically. With the PW source switch on LFO 2, the Pulse Width knob sets how far LFO 2 sweeps the width. This is PWM, a rich chorus-like movement.',
      'The Mod Env can also move the width over each note. All three sources can be active at once, and the switch only chooses which one the knob edits.',
    ],
    demonstration: {
      visual: 'lfo',
      values: { 'lfo2.speed': 40, 'osc1.pwLfo2': 50 },
      caption: 'LFO 2 (blue) is the movement applied to the pulse width.',
    },
    experiment: {
      steps: [
        'Select Pulse on Osc 1.',
        'Set the PW source switch to LFO 2 and raise the Pulse Width knob.',
        'Slow LFO 2 down for a gentle sweep.',
      ],
      parameters: ['osc1.waveform', 'panel.pwSource', 'osc1.pwLfo2', 'lfo2.speed'],
      visual: 'lfo',
      start: { 'osc1.waveform': 'pulse' },
    },
    exercise: {
      kind: 'set',
      prompt: 'Set up slow pulse-width modulation on Oscillator 1.',
      conditions: [
        {
          param: 'osc1.waveform',
          op: 'eq',
          value: 'pulse',
          hint: 'PWM only affects the Pulse waveform.',
        },
        {
          param: 'osc1.pwLfo2',
          op: 'gte',
          value: 30,
          hint: 'With PW source on LFO 2, raise the Pulse Width knob (Osc 1 PW LFO 2 amount ≥ 30).',
        },
        {
          param: 'lfo2.speed',
          op: 'lte',
          value: 70,
          hint: 'Slow LFO 2 down (Speed ≤ 70) for a gentle sweep.',
        },
      ],
    },
    success: 'You animated the timbre with PWM.',
  },
];
