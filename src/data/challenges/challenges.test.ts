import { CONTROLS } from '@/data/synthesizer/controls';
import { LESSONS } from '@/data/lessons';
import {
  allControlTargetsWithFunction,
  defaultValues,
  getParameter,
  normalizeValue,
} from '@/engine/parameters/registry';
import { evaluateTask } from '@/engine/tasks/tasks';
import { CHALLENGE_TYPES, CHALLENGES } from './challenges';

describe('challenges', () => {
  it('cover all six required types with unique ids', () => {
    expect(new Set(CHALLENGES.map((c) => c.id)).size).toBe(CHALLENGES.length);
    for (const t of CHALLENGE_TYPES)
      expect(
        CHALLENGES.some((c) => c.type === t.id),
        t.id,
      ).toBe(true);
  });

  for (const c of CHALLENGES) {
    it(`${c.id}: valid, solvable and not pre-solved`, () => {
      for (const map of [c.start ?? {}, c.target?.values ?? {}]) {
        for (const [id, v] of Object.entries(map))
          expect(normalizeValue(getParameter(id), v), `${c.id} ${id}`).toBe(v);
      }
      if (c.lesson) expect(LESSONS.has(c.lesson), c.lesson).toBe(true);
      const start = { ...defaultValues(), ...(c.start ?? {}) };
      const t = c.task;
      if (t.kind === 'set') {
        expect(evaluateTask(t, start).passed, 'pre-solved').toBe(false);
        const solution: Record<string, string | number | boolean> = { ...start };
        for (const k of t.conditions) {
          if (k.op === 'eq' || k.op === 'gte' || k.op === 'lte') solution[k.param] = k.value;
          if (k.op === 'between') solution[k.param] = (k.min + k.max) / 2;
        }
        expect(evaluateTask(t, solution).passed, 'solution').toBe(true);
      } else if (t.kind === 'choice') {
        expect(t.options.filter((o) => o.correct)).toHaveLength(1);
      } else if (t.kind === 'select') {
        // The answer must be reachable by clicking a physical control.
        const reachable = new Set(CONTROLS.flatMap(allControlTargetsWithFunction));
        for (const id of t.params) expect(reachable.has(id), id).toBe(true);
        expect(c.panel).toBe(true);
      }
    });
  }
});
