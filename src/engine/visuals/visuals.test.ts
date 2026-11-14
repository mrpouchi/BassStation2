import {
  attackSeconds,
  cutoffHz,
  cutoffToValue,
  decaySeconds,
  lfo1PitchSemitones,
  lfo2FilterOctaves,
  lfoHz,
  modEnvPitchSemitones,
  releaseSeconds,
} from './calibration';
import { interpolateLog } from './curves';
import { envelopeLevel } from './envelope';
import { filterGain, toDb } from './filter';
import { sampleLfo } from './lfo';
import { sampleMix, type OscillatorMixInput } from './oscillatorMix';
import { harmonicAmplitudes, lfoSample, oscSample } from './waveforms';

describe('documented calibration anchors (user guide v5.0)', () => {
  it('envelope times (p. 44)', () => {
    expect(attackSeconds(64)).toBeCloseTo(0.25);
    expect(attackSeconds(127)).toBeGreaterThanOrEqual(5);
    expect(decaySeconds(64)).toBeCloseTo(0.15);
    expect(releaseSeconds(64)).toBeCloseTo(0.36);
    expect(releaseSeconds(127)).toBeGreaterThanOrEqual(10);
  });
  it('LFO speed (pp. 48, 69)', () => {
    expect(lfoHz(52)).toBeCloseTo(3);
    expect(lfoHz(75)).toBeCloseTo(7.9);
    expect(lfoHz(255)).toBeCloseTo(190);
  });
  it('modulation depths (pp. 35, 41)', () => {
    expect(lfo1PitchSemitones(6)).toBe(1);
    expect(lfo1PitchSemitones(-32)).toBe(-12);
    expect(lfo1PitchSemitones(80)).toBe(36);
    expect(modEnvPitchSemitones(8)).toBe(12);
    expect(lfo2FilterOctaves(16)).toBe(1);
    expect(lfo2FilterOctaves(32)).toBe(2);
  });
  it('cutoff mapping round-trips', () => {
    expect(cutoffToValue(cutoffHz(100))).toBeCloseTo(100);
    expect(cutoffHz(0)).toBe(20);
    expect(cutoffHz(255)).toBeCloseTo(20000);
  });
  it('interpolates monotonically between anchors', () => {
    const a = [
      [0, 1],
      [10, 100],
    ] as const;
    expect(interpolateLog(a, 5)).toBeCloseTo(10);
  });
});

describe('waveforms', () => {
  it('produces the expected shapes', () => {
    expect(oscSample('sawtooth', 0)).toBe(-1);
    expect(oscSample('sawtooth', 0.5)).toBe(0);
    expect(oscSample('pulse', 0.2, 0.25)).toBe(1);
    expect(oscSample('pulse', 0.3, 0.25)).toBe(-1);
    expect(oscSample('triangle', 0.25)).toBe(1);
    expect(lfoSample('sawtooth', 0)).toBe(1); // LFO saw falls
  });
  it('has textbook harmonic series', () => {
    expect(harmonicAmplitudes('sawtooth', 3)).toEqual([1, 1 / 2, 1 / 3]);
    const sq = harmonicAmplitudes('pulse', 4, 0.5);
    expect(sq[1]).toBeCloseTo(0);
    expect(sq[2]).toBeCloseTo(1 / 3);
    expect(harmonicAmplitudes('sine', 3)).toEqual([1, 0, 0]);
    // 5% and 95% pulses have identical spectra.
    expect(harmonicAmplitudes('pulse', 8, 0.05)).toEqual(
      harmonicAmplitudes('pulse', 8, 0.95).map((v) => expect.closeTo(v, 9)),
    );
  });
});

describe('filter model', () => {
  const base = { cutoffHz: 1000, q: Math.SQRT1_2, shape: 'lp' as const };
  it('is -3 dB at cutoff for a Butterworth 2-pole and steeper with 4 poles', () => {
    expect(toDb(filterGain({ ...base, poles: 2 }, 1000))).toBeCloseTo(-3.01, 1);
    const twoPole = toDb(filterGain({ ...base, poles: 2 }, 8000));
    const fourPole = toDb(filterGain({ ...base, poles: 4 }, 8000));
    expect(twoPole).toBeCloseTo(-36, 0); // 12 dB/oct × 3 octaves
    expect(fourPole).toBeCloseTo(-72, 0); // 24 dB/oct × 3 octaves
  });
  it('peaks at the cutoff with resonance', () => {
    expect(toDb(filterGain({ ...base, q: 10, poles: 2 }, 1000))).toBeCloseTo(20, 0);
  });
  it('high-pass passes highs and band-pass peaks at centre', () => {
    expect(filterGain({ ...base, shape: 'hp', poles: 2 }, 20000)).toBeCloseTo(1, 2);
    expect(filterGain({ ...base, shape: 'bp', poles: 2 }, 1000)).toBeCloseTo(1, 5);
  });
});

describe('envelope', () => {
  const s = { attack: 0, decay: 64, sustain: 64, release: 64 };
  it('reaches peak, settles to sustain, and releases', () => {
    expect(envelopeLevel(s, 0.0011, 2)).toBeCloseTo(1, 1);
    expect(envelopeLevel(s, 1.5, 2)).toBeCloseTo(64 / 127, 2);
    expect(envelopeLevel(s, 2 + 0.36, 2)).toBeLessThan(0.01);
  });
  it('ignores the gate with fixed-duration sustain', () => {
    const fixed = { ...s, sustain: 127, fixedDuration: true };
    expect(envelopeLevel(fixed, 0.1, 10)).toBe(1);
    expect(envelopeLevel(fixed, 0.152 + 0.36, 10)).toBeLessThan(0.05);
  });
});

describe('oscillator mix', () => {
  const input: OscillatorMixInput = {
    osc1: { shape: 'sawtooth', range: '8', coarse: 0, fine: 0, pw: 0.5 },
    osc2: { shape: 'sawtooth', range: '4', coarse: 0, fine: 0, pw: 0.5 },
    sub: { shape: 'square', octave: -1, coarse: 0, fine: 0 },
    levels: { osc1: 255, osc2: 0, sub: 0, noise: 0, ring: 0 },
    sync: false,
  };
  it('equals Osc 1 alone when only Osc 1 is mixed', () => {
    const m = sampleMix(input, 1, 11);
    expect(m.mix).toEqual(m.osc1);
  });
  it('runs Osc 2 an octave higher at 4′', () => {
    const m = sampleMix(input, 1, 5);
    expect(m.osc2[2]).toBeCloseTo(-1); // half an Osc 1 cycle = one full Osc 2 cycle
  });
  it('restarts Osc 2 each Osc 1 cycle with sync', () => {
    const synced = sampleMix(
      { ...input, osc2: { ...input.osc2, range: '8', coarse: 5 }, sync: true },
      2,
      401,
    );
    expect(synced.osc2[200]).toBeCloseTo(-1);
  });
});

describe('LFO sampler', () => {
  it('fades in with delay', () => {
    const { y } = sampleLfo({ shape: 'square', speed: 52, delay: 127, slew: 0 }, 1, 100);
    expect(Math.abs(y[1] ?? 1)).toBeLessThan(0.05);
  });
  it('smooths edges with slew', () => {
    const sharp = sampleLfo({ shape: 'square', speed: 52, delay: 0, slew: 0 }, 1, 200).y;
    const slewed = sampleLfo({ shape: 'square', speed: 52, delay: 0, slew: 127 }, 1, 200).y;
    const maxStep = (a: number[]) =>
      Math.max(...a.slice(1).map((v, i) => Math.abs(v - (a[i] ?? v))));
    expect(maxStep(slewed)).toBeLessThan(maxStep(sharp));
  });
});

import { arpSequence } from './arp';
import { glidePitch } from './glide';

describe('arpeggiator order (p. 52)', () => {
  const chord = [64, 60, 67]; // played E, C, G
  it('up / down / played', () => {
    expect(arpSequence(chord, 'up', 1, 6)).toEqual([60, 64, 67, 60, 64, 67]);
    expect(arpSequence(chord, 'down', 1, 3)).toEqual([67, 64, 60]);
    expect(arpSequence(chord, 'played', 1, 3)).toEqual([64, 60, 67]);
  });
  it('UpDn alternates, UpDn2 repeats the end notes', () => {
    expect(arpSequence(chord, 'updn', 1, 8)).toEqual([60, 64, 67, 64, 60, 64, 67, 64]);
    expect(arpSequence(chord, 'updn2', 1, 6)).toEqual([60, 64, 67, 67, 64, 60]);
  });
  it('octaves repeat the pattern higher', () => {
    expect(arpSequence([60, 64], 'up', 2, 4)).toEqual([60, 64, 72, 76]);
  });
  it('random only uses held notes', () => {
    for (const n of arpSequence(chord, 'random', 1, 20)) expect(chord).toContain(n);
  });
});

describe('glide', () => {
  it('jumps when off and slides when on', () => {
    expect(glidePitch(0, 12, 0, 0.001)).toBe(12);
    const mid = glidePitch(0, 12, 64, 0.05);
    expect(mid).toBeGreaterThan(0);
    expect(mid).toBeLessThan(12);
  });
  it('diverged oscillator lags behind', () => {
    expect(glidePitch(0, 12, 64, 0.1, 10)).toBeLessThan(glidePitch(0, 12, 64, 0.1, 0));
  });
});
