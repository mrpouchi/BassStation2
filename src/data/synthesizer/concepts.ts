/**
 * Glossary of synthesis concepts referenced by parameters, lessons and challenges.
 * Keep definitions short and beginner-friendly; lessons go deeper.
 */
export interface Concept {
  readonly id: string;
  readonly term: string;
  readonly definition: string;
}

export const CONCEPTS: readonly Concept[] = [
  {
    id: 'frequency',
    term: 'Frequency',
    definition: 'How many times per second a wave repeats, measured in hertz (Hz).',
  },
  { id: 'amplitude', term: 'Amplitude', definition: 'The size of a wave: how loud a sound is.' },
  {
    id: 'waveform',
    term: 'Waveform',
    definition: 'The shape of one cycle of a wave. It determines which harmonics a sound contains.',
  },
  {
    id: 'pitch',
    term: 'Pitch',
    definition: 'How high or low a note sounds. It is our perception of frequency.',
  },
  {
    id: 'harmonics',
    term: 'Harmonics',
    definition:
      'Quieter tones at whole-number multiples of the fundamental frequency that give a sound its colour.',
  },
  {
    id: 'timbre',
    term: 'Timbre',
    definition:
      'The tone colour that makes two sounds with the same pitch and loudness sound different.',
  },
  {
    id: 'oscillator',
    term: 'Oscillator',
    definition:
      'The circuit that generates a repeating waveform. It is the sound source of a synthesizer.',
  },
  {
    id: 'octave',
    term: 'Octave',
    definition: 'The interval between one frequency and double that frequency.',
  },
  {
    id: 'semitone',
    term: 'Semitone',
    definition: 'The smallest interval on a keyboard. Twelve make an octave.',
  },
  { id: 'cent', term: 'Cent', definition: 'One hundredth of a semitone, used for fine tuning.' },
  {
    id: 'pulse-width',
    term: 'Pulse width',
    definition: 'The share of each cycle a pulse wave spends “high”. 50% is a square wave.',
  },
  {
    id: 'sub-oscillator',
    term: 'Sub oscillator',
    definition: 'An extra oscillator locked one or two octaves below the main one.',
  },
  {
    id: 'mixer',
    term: 'Mixer',
    definition: 'Combines several sound sources at adjustable levels.',
  },
  {
    id: 'noise',
    term: 'Noise',
    definition: 'A random signal containing all frequencies, with no pitch.',
  },
  {
    id: 'ring-modulation',
    term: 'Ring modulation',
    definition:
      'Multiplies two signals, producing their sum and difference frequencies. The result is often metallic.',
  },
  {
    id: 'filter',
    term: 'Filter',
    definition: 'Removes or emphasises parts of the frequency spectrum.',
  },
  {
    id: 'low-pass',
    term: 'Low-pass filter',
    definition: 'Lets low frequencies through and removes those above the cutoff.',
  },
  {
    id: 'band-pass',
    term: 'Band-pass filter',
    definition: 'Lets through a band around a centre frequency and removes the rest.',
  },
  {
    id: 'high-pass',
    term: 'High-pass filter',
    definition: 'Lets high frequencies through and removes those below the cutoff.',
  },
  {
    id: 'cutoff',
    term: 'Cutoff frequency',
    definition: 'The frequency where a filter starts to take effect.',
  },
  {
    id: 'resonance',
    term: 'Resonance',
    definition: 'A boost of the frequencies right at the cutoff point.',
  },
  {
    id: 'filter-slope',
    term: 'Filter slope',
    definition: 'How steeply a filter attenuates beyond its cutoff, in dB per octave.',
  },
  {
    id: 'overdrive',
    term: 'Overdrive',
    definition: 'Saturation that adds harmonics by pushing a signal into clipping.',
  },
  {
    id: 'distortion',
    term: 'Distortion',
    definition: 'Deliberate reshaping of a waveform that adds harmonics and aggression.',
  },
  {
    id: 'envelope',
    term: 'Envelope',
    definition: 'A shape that changes a parameter over the life of a note.',
  },
  {
    id: 'adsr',
    term: 'ADSR',
    definition: 'Attack, Decay, Sustain, Release: the four stages of a classic envelope.',
  },
  { id: 'attack', term: 'Attack', definition: 'Time from key press to the envelope’s peak.' },
  { id: 'decay', term: 'Decay', definition: 'Time from the peak down to the sustain level.' },
  { id: 'sustain', term: 'Sustain', definition: 'The level held while a key stays pressed.' },
  { id: 'release', term: 'Release', definition: 'Time from key release back to zero.' },
  {
    id: 'vca',
    term: 'VCA',
    definition: 'Voltage-controlled amplifier: the stage that sets the final volume of each note.',
  },
  {
    id: 'lfo',
    term: 'LFO',
    definition: 'Low-frequency oscillator: a slow, usually inaudible wave used to create movement.',
  },
  {
    id: 'modulation',
    term: 'Modulation',
    definition: 'Using one signal to change a parameter automatically.',
  },
  {
    id: 'modulation-depth',
    term: 'Modulation depth',
    definition: 'How strongly a modulation source affects its destination.',
  },
  { id: 'vibrato', term: 'Vibrato', definition: 'A gentle periodic variation in pitch.' },
  {
    id: 'oscillator-sync',
    term: 'Oscillator sync',
    definition: 'Forcing one oscillator to restart its cycle whenever another completes one.',
  },
  {
    id: 'portamento',
    term: 'Portamento',
    definition: 'A continuous pitch slide from one note to the next.',
  },
  { id: 'legato', term: 'Legato', definition: 'Playing so that each note overlaps the next.' },
  {
    id: 'arpeggiator',
    term: 'Arpeggiator',
    definition: 'Plays held notes one after another in a rhythmic pattern.',
  },
  {
    id: 'sequencer',
    term: 'Step sequencer',
    definition: 'Records and plays back a series of notes in steps.',
  },
  { id: 'tempo', term: 'Tempo', definition: 'The speed of music in beats per minute (BPM).' },
  { id: 'velocity', term: 'Velocity', definition: 'How hard (fast) a key is struck.' },
  {
    id: 'aftertouch',
    term: 'Aftertouch',
    definition: 'Pressure applied to a key after it has been struck.',
  },
  {
    id: 'key-tracking',
    term: 'Key tracking',
    definition: 'Making a parameter follow the note played on the keyboard.',
  },
  {
    id: 'paraphony',
    term: 'Paraphony',
    definition: 'Several notes from separate oscillators sharing one filter and amplifier.',
  },
  {
    id: 'midi',
    term: 'MIDI',
    definition: 'The standard protocol musical devices use to exchange notes and control data.',
  },
  {
    id: 'patch',
    term: 'Patch',
    definition: 'A stored set of all the settings that make up a sound.',
  },
];

const byId = new Map(CONCEPTS.map((c) => [c.id, c]));

export function findConcept(id: string): Concept | undefined {
  return byId.get(id);
}
