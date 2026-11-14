/**
 * Curriculum outline. Phase 1 defines structure only: lesson content
 * (objective, explanation, demonstration, experiment, exercise, validation)
 * is authored in Phase 3. `status` must stay 'planned' until a lesson has all six parts.
 */
export type LessonStatus = 'planned' | 'available';

export interface LessonOutline {
  readonly id: string;
  readonly title: string;
  readonly status: LessonStatus;
  /** Parameters this lesson teaches; validated against the registry in tests. */
  readonly parameters: readonly string[];
}

export interface ChapterOutline {
  readonly id: string;
  readonly number: number;
  readonly title: string;
  readonly lessons: readonly LessonOutline[];
}

const lesson = (id: string, title: string, parameters: readonly string[] = []): LessonOutline => ({
  id,
  title,
  status: 'planned',
  parameters,
});

export const CURRICULUM: readonly ChapterOutline[] = [
  {
    id: 'sound-fundamentals',
    number: 1,
    title: 'Sound Fundamentals',
    lessons: [
      lesson('frequency', 'Frequency'),
      lesson('amplitude', 'Amplitude', ['master.volume']),
      lesson('waveforms', 'Waveforms', ['osc1.waveform']),
      lesson('pitch', 'Pitch', ['osc1.range', 'osc1.coarse']),
      lesson('harmonics', 'Harmonics', ['osc1.waveform']),
    ],
  },
  {
    id: 'oscillators',
    number: 2,
    title: 'Oscillators',
    lessons: [
      lesson('oscillator-1', 'Oscillator 1', ['panel.oscSelect', 'osc1.waveform']),
      lesson('oscillator-2', 'Oscillator 2', ['osc2.waveform', 'mixer.osc2']),
      lesson('sawtooth', 'Sawtooth', ['osc1.waveform']),
      lesson('square', 'Square', ['osc1.waveform', 'osc1.pwManual']),
      lesson('pulse', 'Pulse', ['osc1.waveform', 'osc1.pwManual']),
      lesson('octave', 'Octave', ['osc1.range', 'sub.octave']),
      lesson('semitone', 'Semitone', ['osc1.coarse', 'osc1.fine']),
      lesson('pulse-width', 'Pulse Width', [
        'panel.pwSource',
        'osc1.pwManual',
        'osc1.pwLfo2',
        'osc1.pwModEnv',
      ]),
    ],
  },
  {
    id: 'mixer',
    number: 3,
    title: 'Mixer',
    lessons: [
      lesson('oscillator-balance', 'Oscillator balance', ['mixer.osc1', 'mixer.osc2']),
      lesson('noise', 'Noise', ['panel.mixerSource', 'mixer.noise']),
      lesson('sub-oscillator', 'Sub oscillator', ['sub.octave', 'sub.wave', 'mixer.sub']),
      lesson('signal-mixing', 'Signal mixing', ['mixer.ringMod', 'mixer.external']),
    ],
  },
  {
    id: 'filters',
    number: 4,
    title: 'Filters',
    lessons: [
      lesson('low-pass', 'Low-pass filters', ['filter.type', 'filter.shape']),
      lesson('cutoff', 'Cutoff frequency', ['filter.frequency']),
      lesson('resonance', 'Resonance', ['filter.resonance']),
      lesson('slope', 'Filter slope', ['filter.slope']),
      lesson('overdrive', 'Overdrive', ['filter.overdrive']),
      lesson('filter-modulation', 'Filter modulation', ['filter.modEnvDepth', 'filter.lfo2Depth']),
    ],
  },
  {
    id: 'envelopes',
    number: 5,
    title: 'Envelopes',
    lessons: [
      lesson('attack', 'Attack', ['ampEnv.attack']),
      lesson('decay', 'Decay', ['ampEnv.decay']),
      lesson('sustain', 'Sustain', ['ampEnv.sustain']),
      lesson('release', 'Release', ['ampEnv.release']),
      lesson('amp-envelope', 'Amplitude envelope', ['panel.envSelect', 'ampEnv.triggering']),
      lesson('mod-envelope', 'Modulation envelope', ['modEnv.attack', 'filter.modEnvDepth']),
    ],
  },
  {
    id: 'modulation',
    number: 6,
    title: 'Modulation',
    lessons: [
      lesson('lfo-1', 'LFO 1', ['lfo1.waveform', 'lfo1.speed', 'osc1.lfo1Depth']),
      lesson('lfo-2', 'LFO 2', ['lfo2.waveform', 'lfo2.speed', 'filter.lfo2Depth']),
      lesson('modulation-depth', 'Modulation depth', ['osc1.lfo1Depth', 'filter.lfo2Depth']),
      lesson('modulation-routing', 'Modulation routing', [
        'modWheel.lfo1ToOscPitch',
        'aftertouch.filterFreq',
      ]),
      lesson('modulation-destinations', 'Modulation destinations', [
        'osc1.pwLfo2',
        'effects.oscFilterMod',
      ]),
    ],
  },
  {
    id: 'performance',
    number: 7,
    title: 'Performance',
    lessons: [
      lesson('arpeggiator', 'Arpeggiator', ['arp.on', 'arp.mode', 'arp.rhythm', 'arp.octaves']),
      lesson('sequencer', 'Sequencer', ['arp.sequence', 'arp.seqRetrig']),
      lesson('glide', 'Glide', ['portamento.glideTime', 'ampEnv.triggering']),
      lesson('keyboard-controls', 'Keyboard controls', [
        'performance.octave',
        'performance.transpose',
      ]),
      lesson('performance-features', 'Performance features', [
        'performance.modWheel',
        'performance.aftertouch',
        'velocity.ampEnv',
      ]),
    ],
  },
  {
    id: 'sound-design',
    number: 8,
    title: 'Sound Design',
    lessons: [
      lesson('bass-sounds', 'Bass sounds'),
      lesson('leads', 'Leads'),
      lesson('pads', 'Pads'),
      lesson('layering', 'Sound layering'),
      lesson('original-presets', 'Creating original presets'),
    ],
  },
];
