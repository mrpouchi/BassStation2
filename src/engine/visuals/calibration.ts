import type { Anchor } from './curves';
import { interpolateLinear, interpolateLog } from './curves';

/**
 * Mapping from panel values to physical quantities.
 *
 * DOCUMENTED anchors come from the Bass Station II user guide v5.0 and are
 * cited. INFERRED anchors fill gaps so curves can be drawn; they are an
 * educational approximation, not a measurement of the analog circuit.
 */
export interface Calibrated {
  readonly value: number;
  /** True when the result depends on at least one inferred anchor. */
  readonly approximate: boolean;
}

// --- Envelope times (seconds), p. 44 -----------------------------------------
// Attack: mid ≈ 250 ms (documented), top "over 5 s" (documented), bottom ≈ instant.
const ATTACK: readonly Anchor[] = [
  [0, 0.001],
  [64, 0.25],
  [127, 5],
];
// Decay: mid ≈ 150 ms (documented). Bottom/top inferred.
const DECAY: readonly Anchor[] = [
  [0, 0.001],
  [64, 0.15],
  [127, 8],
];
// Release: mid ≈ 360 ms, max "over 10 s" (documented).
const RELEASE: readonly Anchor[] = [
  [0, 0.001],
  [64, 0.36],
  [127, 10],
];

export function attackSeconds(v: number): number {
  return interpolateLog(ATTACK, v);
}
export function decaySeconds(v: number): number {
  return interpolateLog(DECAY, v);
}
export function releaseSeconds(v: number): number {
  return interpolateLog(RELEASE, v);
}

// --- LFO speed (Hz), p. 48 & p. 69 --------------------------------------------
// Init patch: 75 ≈ 7.9 Hz, 52 ≈ 3 Hz (documented); max "about 190 Hz" (documented).
// Value 0 is documented as "zero" Hz; we use a very slow rate for drawing.
const LFO_SPEED: readonly Anchor[] = [
  [0, 0.02],
  [52, 3],
  [75, 7.9],
  [255, 190],
];

export function lfoHz(v: number): number {
  return interpolateLog(LFO_SPEED, v);
}

// --- LFO delay (seconds) — not documented, inferred ---------------------------
const LFO_DELAY: readonly Anchor[] = [
  [0, 0],
  [1, 0.01],
  [127, 10],
];
export function lfoDelaySeconds(v: number): number {
  if (v <= 0) return 0;
  return interpolateLog(LFO_DELAY.slice(1), v);
}

// --- Oscillator pitch modulation depth (semitones), p. 35 --------------------
// "6 = a semitone, 12 = a tone, 22 = a perfect fifth, 32 = one octave,
//  56 = two octaves, 80 = three octaves" — documented for LFO 1 depth.
const LFO1_PITCH: readonly Anchor[] = [
  [0, 0],
  [6, 1],
  [12, 2],
  [22, 7],
  [32, 12],
  [56, 24],
  [80, 36],
  [127, 60], // "up to five octaves" (p. 35)
];

export function lfo1PitchSemitones(depth: number): number {
  return Math.sign(depth) * interpolateLinear(LFO1_PITCH, Math.abs(depth));
}

/** Mod Env → osc pitch: 8 = one octave at full envelope (p. 35). Max 63 ≈ 8 octaves. */
export function modEnvPitchSemitones(depth: number): number {
  return (depth / 8) * 12;
}

/** Filter LFO 2 depth: 1 = 76 cents, 16 = 1 octave, 32 = 2 octaves (p. 41). */
export function lfo2FilterOctaves(depth: number): number {
  return depth / 16;
}

/** Filter Mod Env depth: max (63) ≈ 8 octaves with full sustain (p. 42). */
export function modEnvFilterOctaves(depth: number): number {
  return (depth / 63) * 8;
}

// --- Filter cutoff (Hz) — not documented, inferred ----------------------------
const CUTOFF_MIN = 20;
const CUTOFF_MAX = 20000;
export function cutoffHz(v: number): number {
  return CUTOFF_MIN * Math.pow(CUTOFF_MAX / CUTOFF_MIN, v / 255);
}
export function cutoffToValue(hz: number): number {
  return (255 * Math.log(hz / CUTOFF_MIN)) / Math.log(CUTOFF_MAX / CUTOFF_MIN);
}

/** Resonance 0–127 → filter Q (inferred). 0.5 = no peak, ~25 = near self-oscillation. */
export function resonanceQ(v: number): number {
  return 0.5 * Math.pow(50, v / 127);
}

// --- Oscillator pitch ---------------------------------------------------------
export const RANGE_SEMITONES: Readonly<Record<string, number>> = {
  '16': -12,
  '8': 0,
  '4': 12,
  '2': 24,
};

/** Semitone offset of an oscillator relative to 8' with no detune. */
export function oscSemitones(range: string, coarse: number, fine: number): number {
  return (RANGE_SEMITONES[range] ?? 0) + coarse + fine / 100;
}

/** Reference: 8' plays A3 = 440 Hz (p. 68 "8' (A3=440Hz)"). */
export const REFERENCE_HZ = 440;
