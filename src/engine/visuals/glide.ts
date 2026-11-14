import { interpolateLog } from './curves';

/**
 * Glide (portamento) time in seconds for a Glide Time value. Not documented
 * by Novation: inferred curve (0 = off, 64 ≈ 0.3 s, 127 ≈ 5 s).
 */
export function glideSeconds(v: number): number {
  if (v <= 0) return 0;
  return interpolateLog(
    [
      [1, 0.005],
      [64, 0.3],
      [127, 5],
    ],
    v,
  );
}

/**
 * Pitch (in semitones) over time when moving from `from` to `to` at t = 0.
 * Exponential approach, ~99% there after the glide time. Osc 2 lags by
 * `divergence` (0–15): its glide time is scaled by 1 + divergence / 5 (inferred).
 */
export function glidePitch(
  from: number,
  to: number,
  glideTime: number,
  t: number,
  divergence = 0,
): number {
  const time = glideSeconds(glideTime) * (1 + divergence / 5);
  if (time <= 0 || t >= time * 3) return to;
  if (t <= 0) return from;
  return to + (from - to) * Math.exp((-4.6 * t) / time);
}
