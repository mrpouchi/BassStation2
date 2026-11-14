import { defaultValues } from '@/engine/parameters/registry';
import { changedSoundParameters, describeCondition, evaluateTask, type Task } from './tasks';

const init = defaultValues();

describe('task engine', () => {
  const task: Task = {
    kind: 'set',
    prompt: 'Make it resonant',
    conditions: [
      { param: 'filter.resonance', op: 'gte', value: 90, hint: 'Turn up Resonance' },
      { param: 'filter.shape', op: 'eq', value: 'lp', hint: 'Use low-pass' },
    ],
  };
  it('reports which targets are unmet', () => {
    const r = evaluateTask(task, init);
    expect(r.passed).toBe(false);
    expect(r.results.map((x) => x.met)).toEqual([false, true]);
    expect(r.results[0]?.current).toBe('0');
  });
  it('passes when all targets are met', () => {
    expect(evaluateTask(task, { ...init, 'filter.resonance': 100 }).passed).toBe(true);
  });
  it('evaluates multiple choice', () => {
    const choice: Task = {
      kind: 'choice',
      prompt: 'Q',
      options: [
        { label: 'a', correct: false, feedback: 'no' },
        { label: 'b', correct: true, feedback: 'yes' },
      ],
    };
    expect(evaluateTask(choice, init, 1)).toMatchObject({ passed: true, message: 'yes' });
    expect(evaluateTask(choice, init, 0)).toMatchObject({ passed: false, message: 'no' });
    expect(evaluateTask(choice, init).passed).toBe(false);
  });
  it('counts changed sound parameters, ignoring panel routing', () => {
    const v = {
      ...init,
      'panel.oscSelect': 'osc2',
      'filter.resonance': 10,
      'osc1.waveform': 'pulse',
    };
    expect(changedSoundParameters(v).sort()).toEqual(['filter.resonance', 'osc1.waveform']);
    expect(evaluateTask({ kind: 'changed', prompt: '', minChanged: 2 }, v).passed).toBe(true);
  });
  it('evaluates control identification against the selected parameter', () => {
    const t: Task = { kind: 'select', prompt: 'p', params: ['filter.frequency'], feedback: 'f' };
    expect(evaluateTask(t, init, undefined, null).passed).toBe(false);
    expect(evaluateTask(t, init, undefined, 'filter.resonance').message).toContain('not the one');
    expect(evaluateTask(t, init, undefined, 'filter.frequency').passed).toBe(true);
  });
  it('describes conditions with formatted values', () => {
    expect(describeCondition({ param: 'osc2.coarse', op: 'eq', value: 7, hint: '' })).toBe(
      'Osc 2 Coarse = +7.0 st',
    );
  });
});
