import { attackSeconds, decaySeconds, releaseSeconds } from './calibration';

export interface EnvelopeSettings {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  /** Fixed-duration sustain: decay is removed and the decay slider sets sustain length (p. 46). */
  fixedDuration?: boolean;
}

export interface EnvelopeTimes {
  attack: number;
  decay: number;
  sustainLevel: number;
  release: number;
}

export function envelopeTimes(s: EnvelopeSettings): EnvelopeTimes {
  return {
    attack: attackSeconds(s.attack),
    decay: decaySeconds(s.decay),
    sustainLevel: s.sustain / 127,
    release: releaseSeconds(s.release),
  };
}

/**
 * Envelope level (0…1) at time `t` for a key held for `gate` seconds.
 * Segments use exponential-style curves like analog envelopes (attack
 * approaches 1 fast-then-slow; decay/release fall fast-then-slow).
 */
export function envelopeLevel(s: EnvelopeSettings, t: number, gate: number): number {
  const { attack, decay, sustainLevel, release } = envelopeTimes(s);
  const fixed = s.fixedDuration === true;
  // With fixed duration the note releases after attack + sustain-length regardless of gate.
  const releaseAt = fixed ? attack + decay : gate;

  const held = (time: number): number => {
    if (time < attack) return curveRise(time / attack);
    if (fixed) return 1;
    const td = time - attack;
    return sustainLevel + (1 - sustainLevel) * curveFall(td / decay);
  };

  if (t < 0) return 0;
  if (t < releaseAt) return held(t);
  const startLevel = held(releaseAt);
  return startLevel * curveFall((t - releaseAt) / release);
}

/** 0→1 over x∈[0,1], concave like an RC charge (normalised so it reaches 1). */
function curveRise(x: number): number {
  if (x >= 1) return 1;
  const k = 3;
  return (1 - Math.exp(-k * x)) / (1 - Math.exp(-k));
}

/** 1→0 over x∈[0,∞), exponential decay reaching ~0.7% at x = 1. */
function curveFall(x: number): number {
  if (!Number.isFinite(x)) return 0;
  return Math.exp(-5 * Math.max(0, x));
}

/** Total length worth drawing: full envelope plus margin. */
export function envelopeDuration(s: EnvelopeSettings, gate: number): number {
  const { attack, decay, release } = envelopeTimes(s);
  const end = s.fixedDuration ? attack + decay : Math.max(gate, attack + decay);
  return end + release;
}
