import { lfoDelaySeconds, lfoHz } from './calibration';
import { lfoSample, type LfoShape } from './waveforms';

export interface LfoSettings {
  shape: LfoShape;
  speed: number;
  delay: number;
  slew: number;
}

/**
 * LFO output over `seconds`, after a key press at t = 0.
 * Delay ramps the amplitude in linearly; slew is drawn as a one-pole
 * smoothing whose time constant grows with the slew value (inferred model).
 */
export function sampleLfo(
  s: LfoSettings,
  seconds: number,
  points = 400,
): { t: number[]; y: number[] } {
  const hz = lfoHz(s.speed);
  const delay = lfoDelaySeconds(s.delay);
  // Slew time constant as a fraction of the LFO period: 0 → none, 127 → half a period.
  const tau = (s.slew / 127) * (0.5 / hz);
  const dt = seconds / (points - 1);
  const alpha = tau > 0 ? 1 - Math.exp(-dt / tau) : 1;

  const t: number[] = [];
  const y: number[] = [];
  let prev = lfoSample(s.shape, 0);
  for (let i = 0; i < points; i++) {
    const time = i * dt;
    const raw = lfoSample(s.shape, time * hz);
    prev = prev + alpha * (raw - prev);
    const fade = delay > 0 ? Math.min(1, time / delay) : 1;
    t.push(time);
    y.push(prev * fade);
  }
  return { t, y };
}
