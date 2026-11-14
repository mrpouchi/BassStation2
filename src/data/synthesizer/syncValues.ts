/**
 * LFO sync values table — Bass Station II user guide v5.0, p. 67.
 * `display` is what the 3-character LED display shows.
 */
export interface SyncValue {
  readonly index: number;
  readonly display: string;
  readonly meaning: string;
  readonly musical: string;
  readonly ticks: number;
}

const rows: ReadonlyArray<readonly [string, string, string, number]> = [
  ['64b', '64 beats', '1 cycle per 16 bars', 1536],
  ['48b', '48 beats', '1 cycle per 12 bars', 1152],
  ['42b', '42 beats', '2 cycles per 21 bars', 1002],
  ['36b', '36 beats', '1 cycle per 9 bars', 864],
  ['32b', '32 beats', '1 cycle per 8 bars', 768],
  ['30b', '30 beats', '2 cycles per 15 bars', 720],
  ['28b', '28 beats', '1 cycle per 7 bars', 672],
  ['24b', '24 beats', '1 cycle per 6 bars', 576],
  ['213', '21 + 2/3', '3 cycles per 16 bars', 512],
  ['20b', '20 beats', '1 cycle per 5 bars', 480],
  ['183', '18 + 2/3', '3 cycles per 14 bars', 448],
  ['18b', '18 beats', '1 cycle per 18 beats (2 cycles per 9 bars)', 432],
  ['16b', '16 beats', '1 cycle per 4 bars', 384],
  ['133', '13 + 1/3', '3 cycles per 4 bars', 320],
  ['12b', '12 beats', '1 cycle per 12 beats (1 cycle per 3 bars)', 288],
  ['102', '10 + 2/3', '3 cycles per 8 bars', 256],
  ['8b', '8 beats', '1 cycle per 2 bars', 192],
  ['6b', '6 beats', '1 cycle per 6 beats (2 cycles per 3 bars)', 144],
  ['5b3', '5 + 1/3', '3 cycles per 4 bars', 128],
  ['4b', '4 beats', '1 cycle per 1 bar', 96],
  ['3b', '3 beats', '1 cycle per 3 beats (4 cycles per 3 bars)', 72],
  ['8x3', '2 + 2/3', '3 cycles per 2 bars', 64],
  ['2n', '2nd', '2 cycles per 1 bar', 48],
  ['4d', '4th dotted', '2 cycles per 3 beats (8 cycles per 3 bars)', 36],
  ['4x3', '1 + 1/3', '3 cycles per 1 bar', 32],
  ['4n', '4th', '4 cycles per 1 bar', 24],
  ['8d', '8th dotted', '4 cycles per 3 beats (16 cycles per 3 bars)', 18],
  ['4t', '4th triplet', '6 cycles per 1 bar', 16],
  ['8n', '8th', '8 cycles per 1 bar', 12],
  ['16d', '16th dotted', '8 cycles per 3 beats (32 cycles per 3 bars)', 9],
  ['8t', '8th triplet', '12 cycles per 1 bar', 8],
  ['16n', '16th', '16 cycles per 1 bar', 6],
  ['16t', '16th triplet', '24 cycles per 1 bar', 4],
  ['32n', '32nd', '32 cycles per 1 bar', 3],
  ['32t', '32nd triplet', '48 cycles per 1 bar', 2],
];

export const SYNC_VALUES: readonly SyncValue[] = rows.map(
  ([display, meaning, musical, ticks], i) => ({
    index: i + 1,
    display,
    meaning,
    musical,
    ticks,
  }),
);
