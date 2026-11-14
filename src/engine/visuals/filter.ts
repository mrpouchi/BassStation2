/**
 * Idealised analog filter magnitude responses for visualisation.
 *
 * 12 dB/oct = one resonant 2-pole section; 24 dB/oct = a resonant 2-pole
 * section cascaded with a non-resonant one (Butterworth Q). This is a
 * textbook model — not a circuit simulation of the Bass Station II filters.
 */
export type FilterShape = 'lp' | 'bp' | 'hp';

export interface FilterModel {
  cutoffHz: number;
  q: number;
  shape: FilterShape;
  poles: 2 | 4;
}

function biquadMagnitude(shape: FilterShape, w: number, q: number): number {
  // w = f / fc. Analog prototypes: LP 1/(s²+s/Q+1), HP s²/(…), BP (s/Q)/(…).
  const re = 1 - w * w;
  const im = w / q;
  const den = Math.sqrt(re * re + im * im);
  switch (shape) {
    case 'lp':
      return 1 / den;
    case 'hp':
      return (w * w) / den;
    case 'bp':
      return im / den;
  }
}

/** Linear gain of the filter at `hz`. */
export function filterGain(model: FilterModel, hz: number): number {
  const w = hz / model.cutoffHz;
  const first = biquadMagnitude(model.shape, w, model.q);
  if (model.poles === 2) return first;
  return first * biquadMagnitude(model.shape, w, Math.SQRT1_2);
}

export function toDb(gain: number): number {
  return 20 * Math.log10(Math.max(gain, 1e-6));
}

/** Log-spaced frequencies between `min` and `max`. */
export function logFrequencies(min: number, max: number, count: number): number[] {
  const out: number[] = [];
  const ratio = Math.log(max / min);
  for (let i = 0; i < count; i++) out.push(min * Math.exp((ratio * i) / (count - 1)));
  return out;
}

export function responseCurve(model: FilterModel, freqs: readonly number[]): number[] {
  return freqs.map((f) => toDb(filterGain(model, f)));
}
