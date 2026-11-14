import type { SongNote } from './midiFile';

export type NoteResult = 'hit' | 'wrong' | 'missed';

export interface GradeState {
  /** Result per expected note index; absent = not judged yet. */
  readonly results: ReadonlyMap<number, NoteResult>;
  /** Notes played that matched no expected note in time. */
  readonly extra: number;
}

export const EMPTY_GRADE: GradeState = { results: new Map(), extra: 0 };

export interface GradeOptions {
  /** Timing tolerance either side of the note start, in song seconds. */
  window: number;
  /** Accept the right note in any octave. */
  anyOctave: boolean;
  /** Semitones the expected notes are shifted by (the same transpose as playback). */
  transpose: number;
}

/**
 * Judges one note the player played at song time `at` against the expected
 * line: the nearest unjudged expected note within the window is marked hit
 * (right pitch) or wrong (wrong pitch). Pure: returns a new state.
 */
export function gradePlayedNote(
  state: GradeState,
  notes: readonly SongNote[],
  played: number,
  at: number,
  opts: GradeOptions,
): GradeState {
  let best = -1;
  let bestDist = Infinity;
  for (let i = 0; i < notes.length; i++) {
    const n = notes[i];
    if (!n) continue;
    if (n.start > at + opts.window) break;
    const dist = Math.abs(n.start - at);
    if (dist <= opts.window && dist < bestDist && !state.results.has(i)) {
      best = i;
      bestDist = dist;
    }
  }
  if (best < 0) return { ...state, extra: state.extra + 1 };
  const expected = (notes[best]?.note ?? 0) + opts.transpose;
  const ok = opts.anyOctave ? (played - expected) % 12 === 0 : played === expected;
  const results = new Map(state.results);
  results.set(best, ok ? 'hit' : 'wrong');
  return { ...state, results };
}

/** Marks every unjudged note whose window has passed as missed. */
export function markMissed(
  state: GradeState,
  notes: readonly SongNote[],
  now: number,
  window: number,
): GradeState {
  let results: Map<number, NoteResult> | null = null;
  for (let i = 0; i < notes.length; i++) {
    const n = notes[i];
    if (!n || n.start + window >= now) break;
    if (!state.results.has(i)) {
      results ??= new Map(state.results);
      results.set(i, 'missed');
    }
  }
  return results ? { ...state, results } : state;
}

export function summarize(state: GradeState) {
  let hit = 0;
  let wrong = 0;
  let missed = 0;
  for (const r of state.results.values()) {
    if (r === 'hit') hit++;
    else if (r === 'wrong') wrong++;
    else missed++;
  }
  const judged = hit + wrong + missed;
  return { hit, wrong, missed, extra: state.extra, judged, accuracy: judged ? hit / judged : 0 };
}
