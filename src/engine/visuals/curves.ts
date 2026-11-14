/**
 * Piecewise interpolation through anchor points. Used to turn the manual's
 * documented calibration points (e.g. "attack mid-travel ≈ 250 ms") into
 * continuous curves. Between anchors we interpolate in log space, which suits
 * time and frequency quantities that span several orders of magnitude.
 */
export type Anchor = readonly [x: number, y: number];

export function interpolateLog(anchors: readonly Anchor[], x: number): number {
  const first = anchors[0];
  const last = anchors[anchors.length - 1];
  if (!first || !last) throw new Error('interpolateLog needs at least one anchor');
  if (x <= first[0]) return first[1];
  if (x >= last[0]) return last[1];
  for (let i = 1; i < anchors.length; i++) {
    const a = anchors[i - 1];
    const b = anchors[i];
    if (!a || !b || x > b[0]) continue;
    const t = (x - a[0]) / (b[0] - a[0]);
    return Math.exp(Math.log(a[1]) + t * (Math.log(b[1]) - Math.log(a[1])));
  }
  return last[1];
}

export function interpolateLinear(anchors: readonly Anchor[], x: number): number {
  const first = anchors[0];
  const last = anchors[anchors.length - 1];
  if (!first || !last) throw new Error('interpolateLinear needs at least one anchor');
  if (x <= first[0]) return first[1];
  if (x >= last[0]) return last[1];
  for (let i = 1; i < anchors.length; i++) {
    const a = anchors[i - 1];
    const b = anchors[i];
    if (!a || !b || x > b[0]) continue;
    return a[1] + ((x - a[0]) / (b[0] - a[0])) * (b[1] - a[1]);
  }
  return last[1];
}

/** Deterministic pseudo-random generator (mulberry32) so S&H and noise plots don't flicker. */
export function seededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
