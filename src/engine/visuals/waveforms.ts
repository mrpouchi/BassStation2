import { seededRandom } from './curves';

export type OscShape = 'sine' | 'triangle' | 'sawtooth' | 'pulse';
export type SubShape = 'sine' | 'narrow-pulse' | 'square';
export type LfoShape = 'triangle' | 'sawtooth' | 'square' | 'sample-hold';

const TAU = Math.PI * 2;
const frac = (x: number) => x - Math.floor(x);

/** One oscillator sample at `phase` (cycles), amplitude −1…1. `pw` is 0…1 duty cycle. */
export function oscSample(shape: OscShape, phase: number, pw = 0.5): number {
  const p = frac(phase);
  switch (shape) {
    case 'sine':
      return Math.sin(TAU * p);
    case 'triangle':
      return p < 0.25 ? 4 * p : p < 0.75 ? 2 - 4 * p : 4 * p - 4;
    case 'sawtooth':
      // Rising sawtooth (manual p. 34: "(rising) Sawtooth").
      return 2 * p - 1;
    case 'pulse':
      return p < pw ? 1 : -1;
  }
}

/**
 * Narrow-pulse width for the sub oscillator is not documented; 25% is used
 * as an illustrative value.
 */
export const SUB_NARROW_PULSE_WIDTH = 0.25;

export function subSample(shape: SubShape, phase: number): number {
  switch (shape) {
    case 'sine':
      return oscSample('sine', phase);
    case 'square':
      return oscSample('pulse', phase, 0.5);
    case 'narrow-pulse':
      return oscSample('pulse', phase, SUB_NARROW_PULSE_WIDTH);
  }
}

/**
 * LFO sample, amplitude −1…1. Sawtooth is FALLING for the LFO (manual p. 48).
 * Sample & hold uses a deterministic sequence so the drawing is stable.
 */
export function lfoSample(shape: LfoShape, phase: number, seed = 7): number {
  const p = frac(phase);
  switch (shape) {
    case 'triangle':
      return oscSample('triangle', phase);
    case 'sawtooth':
      return 1 - 2 * p;
    case 'square':
      return p < 0.5 ? 1 : -1;
    case 'sample-hold': {
      const cycle = Math.floor(phase);
      const rnd = seededRandom(seed + cycle * 9973)();
      return rnd * 2 - 1;
    }
  }
}

/**
 * Relative harmonic amplitudes (fundamental = 1) of ideal waveforms.
 * Classic Fourier series: saw 1/n; square odd 1/n; triangle odd 1/n²;
 * pulse |sin(nπd)|/(n·sin(πd)) normalised to the fundamental.
 */
export function harmonicAmplitudes(shape: OscShape, count: number, pw = 0.5): number[] {
  const out: number[] = [];
  for (let n = 1; n <= count; n++) {
    switch (shape) {
      case 'sine':
        out.push(n === 1 ? 1 : 0);
        break;
      case 'sawtooth':
        out.push(1 / n);
        break;
      case 'triangle':
        out.push(n % 2 === 1 ? 1 / (n * n) : 0);
        break;
      case 'pulse': {
        const base = Math.abs(Math.sin(Math.PI * pw));
        const a = Math.abs(Math.sin(n * Math.PI * pw)) / n;
        out.push(base < 1e-9 ? 0 : a / base);
        break;
      }
    }
  }
  return out;
}
