import { defaultValues, findParameter, formatValue } from '@/engine/parameters/registry';
import type { ParameterValue } from '@/engine/parameters/types';

/**
 * Exercise/challenge task model shared by Learn and Challenges.
 * Tasks validate against the live synth state or a chosen answer, and every
 * failure produces specific, actionable feedback.
 */
export type Condition =
  | { param: string; op: 'eq' | 'neq'; value: ParameterValue; hint: string }
  | { param: string; op: 'gte' | 'lte'; value: number; hint: string }
  | { param: string; op: 'between' | 'outside'; min: number; max: number; hint: string };

export interface ChoiceOption {
  readonly label: string;
  readonly correct: boolean;
  /** Why this option is right or wrong — shown after answering. */
  readonly feedback: string;
}

export type Task =
  | { kind: 'set'; prompt: string; conditions: readonly Condition[] }
  | { kind: 'choice'; prompt: string; options: readonly ChoiceOption[] }
  | { kind: 'changed'; prompt: string; minChanged: number }
  /** Identify a control: passes when the inspected parameter is one of `params`. */
  | { kind: 'select'; prompt: string; params: readonly string[]; feedback: string };

export interface ConditionResult {
  condition: Condition;
  met: boolean;
  /** Current value, formatted for display. */
  current: string;
}

export interface TaskResult {
  passed: boolean;
  results: ConditionResult[];
  message: string;
}

export function checkCondition(
  c: Condition,
  values: Readonly<Record<string, ParameterValue>>,
): ConditionResult {
  const v = values[c.param];
  const def = findParameter(c.param);
  const current = def && v !== undefined ? formatValue(def, v) : String(v);
  let met = false;
  switch (c.op) {
    case 'eq':
      met = v === c.value;
      break;
    case 'neq':
      met = v !== c.value;
      break;
    case 'gte':
      met = typeof v === 'number' && v >= c.value;
      break;
    case 'lte':
      met = typeof v === 'number' && v <= c.value;
      break;
    case 'between':
      met = typeof v === 'number' && v >= c.min && v <= c.max;
      break;
    case 'outside':
      met = typeof v === 'number' && (v < c.min || v > c.max);
      break;
  }
  return { condition: c, met, current };
}

/** Parameters that count as "sound" changes (excludes panel routing and performance inputs). */
export function changedSoundParameters(values: Readonly<Record<string, ParameterValue>>): string[] {
  const init = defaultValues();
  return Object.keys(values).filter((id) => {
    const def = findParameter(id);
    return def !== undefined && def.scope === 'patch' && values[id] !== init[id];
  });
}

export function evaluateTask(
  task: Task,
  values: Readonly<Record<string, ParameterValue>>,
  choiceIndex?: number,
  selectedId?: string | null,
): TaskResult {
  switch (task.kind) {
    case 'set': {
      const results = task.conditions.map((c) => checkCondition(c, values));
      const missing = results.filter((r) => !r.met).length;
      return {
        passed: missing === 0,
        results,
        message:
          missing === 0
            ? 'Every target is met.'
            : `${results.length - missing} of ${results.length} targets met. Follow the hints below.`,
      };
    }
    case 'choice': {
      const option = choiceIndex === undefined ? undefined : task.options[choiceIndex];
      return {
        passed: option?.correct === true,
        results: [],
        message: option ? option.feedback : 'Choose an answer first.',
      };
    }
    case 'select': {
      const def = selectedId ? findParameter(selectedId) : undefined;
      const passed =
        selectedId !== null && selectedId !== undefined && task.params.includes(selectedId);
      return {
        passed,
        results: [],
        message: !def
          ? 'Click a control on the panel first. The selected control is shown in the inspector.'
          : passed
            ? `Correct: ${def.name}. ${task.feedback}`
            : `${def.name} is not the one: ${def.description} Try another control.`,
      };
    }
    case 'changed': {
      const n = changedSoundParameters(values).length;
      return {
        passed: n >= task.minChanged,
        results: [],
        message:
          n >= task.minChanged
            ? `You changed ${n} sound parameters from the Init Patch.`
            : `You have changed ${n} sound parameter${n === 1 ? '' : 's'} so far. Change at least ${task.minChanged}.`,
      };
    }
  }
}

/** Human-readable description of a target, e.g. "Resonance ≥ 90". */
export function describeCondition(c: Condition): string {
  const def = findParameter(c.param);
  const name = def?.name ?? c.param;
  const fmt = (v: ParameterValue) => (def ? formatValue(def, v) : String(v));
  switch (c.op) {
    case 'eq':
      return `${name} = ${fmt(c.value)}`;
    case 'neq':
      return `${name} ≠ ${fmt(c.value)}`;
    case 'gte':
      return `${name} ≥ ${fmt(c.value)}`;
    case 'lte':
      return `${name} ≤ ${fmt(c.value)}`;
    case 'between':
      return `${name} between ${fmt(c.min)} and ${fmt(c.max)}`;
    case 'outside':
      return `${name} below ${fmt(c.min)} or above ${fmt(c.max)}`;
  }
}
