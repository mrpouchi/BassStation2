/** Builds an SVG polyline path from data arrays and axis mappers. */
export function linePath(
  xs: readonly number[],
  ys: readonly number[],
  mapX: (x: number) => number,
  mapY: (y: number) => number,
): string {
  let d = '';
  for (let i = 0; i < xs.length; i++) {
    const x = xs[i];
    const y = ys[i];
    if (x === undefined || y === undefined) continue;
    d += `${i === 0 ? 'M' : 'L'}${mapX(x).toFixed(1)},${mapY(y).toFixed(1)}`;
  }
  return d;
}

export const linear =
  (d0: number, d1: number, r0: number, r1: number) =>
  (v: number): number =>
    r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);

export const logScale =
  (d0: number, d1: number, r0: number, r1: number) =>
  (v: number): number =>
    r0 + (Math.log(v / d0) / Math.log(d1 / d0)) * (r1 - r0);

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
