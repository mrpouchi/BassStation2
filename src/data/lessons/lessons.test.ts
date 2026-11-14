import { findParameter, getParameter, normalizeValue } from '@/engine/parameters/registry';
import { evaluateTask } from '@/engine/tasks/tasks';
import { defaultValues } from '@/engine/parameters/registry';
import { LESSON_ORDER, LESSONS } from '.';
import { CURRICULUM } from './curriculum';

describe('lesson content', () => {
  it('provides a complete lesson for every curriculum entry', () => {
    const missing = LESSON_ORDER.filter((l) => !LESSONS.has(l.key)).map((l) => l.key);
    expect(missing).toEqual([]);
    expect(LESSONS.size).toBe(CURRICULUM.reduce((n, c) => n + c.lessons.length, 0));
  });

  for (const [key, lesson] of LESSONS) {
    describe(key, () => {
      it('has all six parts', () => {
        expect(lesson.objective.length).toBeGreaterThan(10);
        expect(lesson.explanation.length).toBeGreaterThan(0);
        expect(lesson.demonstration.caption.length).toBeGreaterThan(0);
        expect(lesson.experiment.steps.length).toBeGreaterThan(0);
        expect(lesson.exercise.prompt.length).toBeGreaterThan(0);
        expect(lesson.success.length).toBeGreaterThan(0);
      });

      it('only uses valid parameters and values', () => {
        const maps = [lesson.demonstration.values, lesson.experiment.start ?? {}];
        for (const map of maps) {
          for (const [id, v] of Object.entries(map)) {
            expect(normalizeValue(getParameter(id), v), `${key}: ${id}=${String(v)}`).toBe(v);
          }
        }
        for (const id of lesson.experiment.parameters) expect(findParameter(id), id).toBeDefined();
        if (lesson.exercise.kind === 'set') {
          for (const c of lesson.exercise.conditions) {
            const def = getParameter(c.param);
            if (c.op === 'eq' || c.op === 'neq')
              expect(normalizeValue(def, c.value), `${key}: ${c.param}`).toBe(c.value);
          }
        }
      });

      it('has an exercise that is solvable and not already solved by the Init Patch', () => {
        const ex = lesson.exercise;
        if (ex.kind === 'choice') {
          expect(ex.options.filter((o) => o.correct)).toHaveLength(1);
          return;
        }
        if (ex.kind === 'changed') return;
        const init = defaultValues();
        expect(evaluateTask(ex, init).passed, `${key} is solved by Init`).toBe(false);
        // Build a solution from the conditions and check it passes.
        const solution: Record<string, string | number | boolean> = { ...init };
        for (const c of ex.conditions) {
          if (c.op === 'eq') solution[c.param] = c.value;
          else if (c.op === 'gte') solution[c.param] = c.value;
          else if (c.op === 'lte') solution[c.param] = c.value;
          else if (c.op === 'between') solution[c.param] = c.min;
          else if (c.op === 'outside') {
            const def = getParameter(c.param);
            solution[c.param] = def.kind === 'continuous' ? def.max : 0;
          }
        }
        expect(evaluateTask(ex, solution).passed, `${key} solution`).toBe(true);
      });
    });
  }
});
