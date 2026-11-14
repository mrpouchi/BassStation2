import { seededRandom } from './curves';

export type ArpMode = 'up' | 'down' | 'updn' | 'updn2' | 'played' | 'random';

/**
 * Order in which the arpeggiator plays held notes (manual p. 52, Table 1).
 * `held` is in the order the keys were pressed; octaves repeat the whole
 * pattern an octave higher each time (p. 52, Arp Octaves).
 */
export function arpSequence(
  held: readonly number[],
  mode: ArpMode,
  octaves: number,
  length = 16,
): number[] {
  if (held.length === 0) return [];
  const sorted = [...held].sort((a, b) => a - b);
  const span: number[] = [];
  for (let o = 0; o < octaves; o++) {
    const base = mode === 'played' ? held : sorted;
    span.push(...base.map((n) => n + 12 * o));
  }
  let cycle: number[];
  switch (mode) {
    case 'up':
    case 'played':
      cycle = span;
      break;
    case 'down':
      cycle = [...span].reverse();
      break;
    case 'updn':
      // Alternates direction without repeating the turning notes.
      cycle = span.length > 1 ? [...span, ...span.slice(1, -1).reverse()] : span;
      break;
    case 'updn2':
      // As UpDn, but the lowest and highest notes are played twice.
      cycle = [...span, ...[...span].reverse()];
      break;
    case 'random': {
      const rnd = seededRandom(span.length * 31 + octaves);
      return Array.from({ length }, () => span[Math.floor(rnd() * span.length)] ?? span[0] ?? 0);
    }
  }
  return Array.from({ length }, (_, i) => cycle[i % cycle.length] ?? 0);
}
