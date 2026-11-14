import { oscSemitones } from './calibration';
import { seededRandom } from './curves';
import { oscSample, subSample, type OscShape, type SubShape } from './waveforms';

/** The subset of parameter values the oscillator visualiser needs. */
export interface OscillatorMixInput {
  osc1: { shape: OscShape; range: string; coarse: number; fine: number; pw: number };
  osc2: { shape: OscShape; range: string; coarse: number; fine: number; pw: number };
  sub: { shape: SubShape; octave: number; coarse: number; fine: number };
  levels: { osc1: number; osc2: number; sub: number; noise: number; ring: number };
  sync: boolean;
}

export interface MixSamples {
  /** x in Osc 1 cycles. */
  x: number[];
  osc1: number[];
  osc2: number[];
  sub: number[];
  mix: number[];
}

/**
 * Samples each source and the normalised mixer sum over `cycles` periods of Osc 1.
 * Osc 2 runs at its pitch ratio to Osc 1; with sync on it restarts every Osc 1 cycle.
 * The mix is normalised to the sum of levels so its *shape* stays readable.
 */
export function sampleMix(input: OscillatorMixInput, cycles = 2, points = 600): MixSamples {
  const st1 = oscSemitones(input.osc1.range, input.osc1.coarse, input.osc1.fine);
  const st2 = oscSemitones(input.osc2.range, input.osc2.coarse, input.osc2.fine);
  const ratio2 = Math.pow(2, (st2 - st1) / 12);
  // Sub follows Osc 1, an octave or two below, plus extended tuning (p. 38).
  const subRatio = Math.pow(2, input.sub.octave + (input.sub.coarse + input.sub.fine / 100) / 12);
  const rnd = seededRandom(42);

  const L = input.levels;
  const total = L.osc1 + L.osc2 + L.sub + L.noise + L.ring;
  const out: MixSamples = { x: [], osc1: [], osc2: [], sub: [], mix: [] };

  for (let i = 0; i < points; i++) {
    const x = (i / (points - 1)) * cycles;
    const o1 = oscSample(input.osc1.shape, x, input.osc1.pw);
    const phase2 = input.sync ? (x - Math.floor(x)) * ratio2 : x * ratio2;
    const o2 = oscSample(input.osc2.shape, phase2, input.osc2.pw);
    const s = subSample(input.sub.shape, x * subRatio);
    const noise = rnd() * 2 - 1;
    const sum = L.osc1 * o1 + L.osc2 * o2 + L.sub * s + L.noise * noise + L.ring * o1 * o2;
    out.x.push(x);
    out.osc1.push(o1);
    out.osc2.push(o2);
    out.sub.push(s);
    out.mix.push(total > 0 ? sum / total : 0);
  }
  return out;
}
