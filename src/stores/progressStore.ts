import { create } from 'zustand';

/**
 * Learning progress. Nothing here locks content. It only records what the
 * learner has done so the dashboard can recommend what comes next.
 */
export interface ActivityEntry {
  kind: 'lesson' | 'challenge';
  key: string;
  at: number;
  passed: boolean;
}

export interface ChallengeRecord {
  attempts: number;
  solvedAt: number | null;
  lastAt: number;
}

export interface ProgressData {
  lessons: Record<string, { completedAt: number }>;
  lastLesson: string | null;
  challenges: Record<string, ChallengeRecord>;
  activity: ActivityEntry[];
}

interface ProgressState extends ProgressData {
  visitLesson: (key: string) => void;
  completeLesson: (key: string) => void;
  recordChallenge: (key: string, passed: boolean) => void;
  load: (data: ProgressData) => void;
  reset: () => void;
}

const EMPTY: ProgressData = { lessons: {}, lastLesson: null, challenges: {}, activity: [] };
const MAX_ACTIVITY = 30;

const pushActivity = (list: ActivityEntry[], entry: ActivityEntry) =>
  [entry, ...list].slice(0, MAX_ACTIVITY);

export const useProgressStore = create<ProgressState>()((set) => ({
  ...EMPTY,
  visitLesson: (key) => set({ lastLesson: key }),
  completeLesson: (key) =>
    set((s) => ({
      lessons: s.lessons[key] ? s.lessons : { ...s.lessons, [key]: { completedAt: Date.now() } },
      activity: pushActivity(s.activity, { kind: 'lesson', key, at: Date.now(), passed: true }),
    })),
  recordChallenge: (key, passed) =>
    set((s) => {
      const prev = s.challenges[key];
      const now = Date.now();
      return {
        challenges: {
          ...s.challenges,
          [key]: {
            attempts: (prev?.attempts ?? 0) + 1,
            solvedAt: prev?.solvedAt ?? (passed ? now : null),
            lastAt: now,
          },
        },
        activity: pushActivity(s.activity, { kind: 'challenge', key, at: now, passed }),
      };
    }),
  load: (data) => set(data),
  reset: () => set(EMPTY),
}));

/** Validates untrusted stored progress; returns null if unusable. */
export function parseProgress(input: unknown): ProgressData | null {
  if (typeof input !== 'object' || input === null) return null;
  const o = input as Record<string, unknown>;
  if (o.format !== 1) return null;
  const isRecord = (v: unknown): v is Record<string, unknown> =>
    typeof v === 'object' && v !== null && !Array.isArray(v);
  const lessons: ProgressData['lessons'] = {};
  if (isRecord(o.lessons)) {
    for (const [k, v] of Object.entries(o.lessons)) {
      if (isRecord(v) && typeof v.completedAt === 'number')
        lessons[k] = { completedAt: v.completedAt };
    }
  }
  const challenges: ProgressData['challenges'] = {};
  if (isRecord(o.challenges)) {
    for (const [k, v] of Object.entries(o.challenges)) {
      if (isRecord(v) && typeof v.attempts === 'number' && typeof v.lastAt === 'number') {
        challenges[k] = {
          attempts: v.attempts,
          lastAt: v.lastAt,
          solvedAt: typeof v.solvedAt === 'number' ? v.solvedAt : null,
        };
      }
    }
  }
  const activity: ActivityEntry[] = Array.isArray(o.activity)
    ? o.activity
        .filter(
          (a): a is ActivityEntry =>
            isRecord(a) &&
            (a.kind === 'lesson' || a.kind === 'challenge') &&
            typeof a.key === 'string' &&
            typeof a.at === 'number' &&
            typeof a.passed === 'boolean',
        )
        .slice(0, MAX_ACTIVITY)
    : [];
  return {
    lessons,
    challenges,
    activity,
    lastLesson: typeof o.lastLesson === 'string' ? o.lastLesson : null,
  };
}

export function serializeProgress(s: ProgressData): Record<string, unknown> {
  return {
    format: 1,
    lessons: s.lessons,
    lastLesson: s.lastLesson,
    challenges: s.challenges,
    activity: s.activity,
  };
}
