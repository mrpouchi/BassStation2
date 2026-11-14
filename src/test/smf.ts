/** Builds Standard MIDI Files byte by byte for tests. */

export const vlq = (n: number): number[] => {
  const out = [n & 0x7f];
  while ((n >>= 7)) out.unshift((n & 0x7f) | 0x80);
  return out;
};
export const u32 = (n: number) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255];
export const text = (s: string) => [...s].map((c) => c.charCodeAt(0));
export const meta = (type: number, data: number[]) => [0xff, type, ...vlq(data.length), ...data];
export const name = (s: string) => meta(0x03, text(s));
export const tempo = (bpm: number) => {
  const us = Math.round(60_000_000 / bpm);
  return meta(0x51, [(us >> 16) & 255, (us >> 8) & 255, us & 255]);
};

/** events: [deltaTicks, ...bytes] */
export function track(events: number[][]): number[] {
  const body = events.flatMap(([delta = 0, ...bytes]) => [...vlq(delta), ...bytes]);
  body.push(0, 0xff, 0x2f, 0);
  return [...text('MTrk'), ...u32(body.length), ...body];
}

export function smf(tracks: number[][], ppq = 480, format = 1): Uint8Array {
  const header = [...text('MThd'), ...u32(6), 0, format, 0, tracks.length, ppq >> 8, ppq & 255];
  return new Uint8Array([...header, ...tracks.flat()]);
}

export const conductor = (bpm = 120, extra: number[][] = []) =>
  track([[0, ...name('My Tune')], [0, ...tempo(bpm)], [0, ...meta(0x58, [3, 2, 24, 8])], ...extra]);
