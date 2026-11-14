import { CONTROLS } from '@/data/synthesizer/controls';
import { PARAMETERS } from '@/data/synthesizer/parameters';
import type {
  ControlDefinition,
  ControlTarget,
  OnKeyName,
  ParameterDefinition,
  ParameterValue,
  SectionId,
} from './types';

const parameterById = new Map<string, ParameterDefinition>(PARAMETERS.map((p) => [p.id, p]));
const controlById = new Map<string, ControlDefinition>(CONTROLS.map((c) => [c.id, c]));

export type ParameterValues = Readonly<Record<string, ParameterValue>>;

export function findParameter(id: string): ParameterDefinition | undefined {
  return parameterById.get(id);
}

export function getParameter(id: string): ParameterDefinition {
  const def = parameterById.get(id);
  if (!def) throw new Error(`Unknown parameter: ${id}`);
  return def;
}

export function findControl(id: string): ControlDefinition | undefined {
  return controlById.get(id);
}

export function parametersInSection(section: SectionId): ParameterDefinition[] {
  return PARAMETERS.filter((p) => p.section === section);
}

/** Parameters reached by holding Function and pressing `key`, ordered by press count. */
export function parametersOnKey(key: OnKeyName): ParameterDefinition[] {
  return PARAMETERS.filter((p) => p.access.kind === 'on-key' && p.access.key === key).sort(
    (a, b) =>
      (a.access.kind === 'on-key' ? a.access.presses : 0) -
      (b.access.kind === 'on-key' ? b.access.presses : 0),
  );
}

/** Default value of every parameter: the Init Patch where documented. */
export function defaultValues(): Record<string, ParameterValue> {
  return Object.fromEntries(PARAMETERS.map((p) => [p.id, p.defaultValue]));
}

/**
 * Coerces an untrusted value into a valid value for `def`.
 * Numbers are clamped and snapped to the step; invalid input returns undefined.
 */
export function normalizeValue(def: ParameterDefinition, raw: unknown): ParameterValue | undefined {
  switch (def.kind) {
    case 'continuous': {
      if (typeof raw !== 'number' || !Number.isFinite(raw)) return undefined;
      const clamped = Math.min(def.max, Math.max(def.min, raw));
      const steps = Math.round((clamped - def.min) / def.step);
      // Round to the step's decimal precision to avoid 0.30000000000000004.
      const decimals = (def.step.toString().split('.')[1] ?? '').length;
      return Number((def.min + steps * def.step).toFixed(decimals));
    }
    case 'enum':
      return typeof raw === 'string' && def.options.some((o) => o.value === raw) ? raw : undefined;
    case 'toggle':
      return typeof raw === 'boolean' ? raw : undefined;
  }
}

/**
 * Validates a full or partial value map (e.g. from storage or an imported preset).
 * Unknown ids and invalid values are dropped and reported; missing ids fall back to defaults.
 */
export function sanitizeValues(input: unknown): {
  values: Record<string, ParameterValue>;
  rejected: string[];
} {
  const values = defaultValues();
  const rejected: string[] = [];
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    return { values, rejected: ['<root>'] };
  }
  for (const [id, raw] of Object.entries(input)) {
    const def = parameterById.get(id);
    const value = def ? normalizeValue(def, raw) : undefined;
    if (value === undefined) rejected.push(id);
    else values[id] = value;
  }
  return { values, rejected };
}

/** Formats a value for display, e.g. "+7.0 st", "16'", "Off", "On". */
export function formatValue(def: ParameterDefinition, value: ParameterValue): string {
  switch (def.kind) {
    case 'enum':
      return def.options.find((o) => o.value === value)?.label ?? String(value);
    case 'toggle': {
      const [off, on] = def.labels ?? ['Off', 'On'];
      return value === true ? on : off;
    }
    case 'continuous': {
      if (typeof value !== 'number') return String(value);
      const label = def.valueLabels?.[value];
      if (label !== undefined) return label;
      const decimals = (def.step.toString().split('.')[1] ?? '').length;
      const text = value.toFixed(decimals);
      const signed = def.bipolar && value > 0 ? `+${text}` : text.replace('-', '−');
      return def.unit ? `${signed} ${def.unit}` : signed;
    }
  }
}

/** Position of a value within the parameter's range, 0…1 (for knobs and meters). */
export function toNormalized(def: ParameterDefinition, value: ParameterValue): number {
  switch (def.kind) {
    case 'continuous':
      return typeof value === 'number' ? (value - def.min) / (def.max - def.min) : 0;
    case 'enum': {
      const i = def.options.findIndex((o) => o.value === value);
      return def.options.length > 1 ? Math.max(0, i) / (def.options.length - 1) : 0;
    }
    case 'toggle':
      return value === true ? 1 : 0;
  }
}

/** Inverse of toNormalized: a 0…1 position to a valid value. */
export function fromNormalized(def: ParameterDefinition, n: number): ParameterValue {
  const x = Math.min(1, Math.max(0, n));
  switch (def.kind) {
    case 'continuous':
      return normalizeValue(def, def.min + x * (def.max - def.min)) ?? def.defaultValue;
    case 'enum': {
      const i = Math.round(x * (def.options.length - 1));
      return def.options[i]?.value ?? def.defaultValue;
    }
    case 'toggle':
      return x >= 0.5;
  }
}

/**
 * Moves a value by `steps` increments: one step for small ranges, ~1/127 of the
 * range for large ones (e.g. 0–255), the next option for enums, flip for toggles.
 * `wrap` cycles enums like the hardware select buttons do.
 */
export function stepValue(
  def: ParameterDefinition,
  value: ParameterValue,
  steps: number,
  wrap = false,
): ParameterValue {
  switch (def.kind) {
    case 'continuous': {
      const current = typeof value === 'number' ? value : def.defaultValue;
      const increment = Math.max(def.step, (def.max - def.min) / 127 >= 1 ? 1 : def.step);
      return normalizeValue(def, current + steps * increment) ?? current;
    }
    case 'enum': {
      const n = def.options.length;
      const i = Math.max(
        0,
        def.options.findIndex((o) => o.value === value),
      );
      const next = wrap ? (((i + steps) % n) + n) % n : Math.min(n - 1, Math.max(0, i + steps));
      return def.options[next]?.value ?? def.defaultValue;
    }
    case 'toggle':
      return steps === 0 ? value : !(value === true);
  }
}

/**
 * Resolves which parameter(s) a physical control edits given the current
 * panel state. Returns [] for display-only controls and actions.
 */
export function resolveControlTarget(
  target: ControlTarget | null,
  values: ParameterValues,
): string[] {
  if (target === null || 'action' in target) return [];
  if ('param' in target) return [target.param];
  if ('params' in target) return [...target.params];
  const selector = values[target.via];
  const next = typeof selector === 'string' ? target.routes[selector] : undefined;
  return next ? resolveControlTarget(next, values) : [];
}

/** Every parameter a control can ever reach, regardless of panel state. */
export function allControlTargets(target: ControlTarget | null): string[] {
  if (target === null || 'action' in target) return [];
  if ('param' in target) return [target.param];
  if ('params' in target) return [...target.params];
  return [target.via, ...Object.values(target.routes).flatMap(allControlTargets)];
}

/**
 * Panel switch positions that route a physical control to a parameter.
 * `single` reaches the parameter alone; `group` (optional) reaches it together
 * with `siblings` (e.g. Env Select on Amp+Mod edits both envelopes at once).
 */
export interface SelectorRouting {
  readonly single: Readonly<Record<string, string>> | null;
  readonly group: {
    readonly selectors: Readonly<Record<string, string>>;
    readonly siblings: readonly string[];
  } | null;
}

function collectRoutes(
  target: ControlTarget,
  path: Record<string, string>,
  out: Map<string, { single: Record<string, string>[]; groups: SelectorRouting['group'][] }>,
): void {
  if ('action' in target) return;
  const entry = (id: string) => {
    let e = out.get(id);
    if (!e) out.set(id, (e = { single: [], groups: [] }));
    return e;
  };
  if ('param' in target) entry(target.param).single.push(path);
  else if ('params' in target) {
    for (const id of target.params)
      entry(id).groups.push({
        selectors: path,
        siblings: target.params.filter((p) => p !== id),
      });
  } else {
    for (const [key, next] of Object.entries(target.routes))
      collectRoutes(next, { ...path, [target.via]: key }, out);
  }
}

const selectorRoutingById: ReadonlyMap<string, SelectorRouting> = (() => {
  const raw = new Map<
    string,
    { single: Record<string, string>[]; groups: SelectorRouting['group'][] }
  >();
  for (const c of CONTROLS) if (c.target) collectRoutes(c.target, {}, raw);
  const out = new Map<string, SelectorRouting>();
  for (const [id, r] of raw) {
    // A parameter that some control reaches without any switch needs no routing.
    if (r.single.some((p) => Object.keys(p).length === 0)) continue;
    // Only unambiguous routes are usable.
    const single = r.single.length === 1 ? (r.single[0] ?? null) : null;
    const group = r.groups.length === 1 ? (r.groups[0] ?? null) : null;
    if (single || group) out.set(id, { single, group });
  }
  return out;
})();

/**
 * How the panel switches must be set for a physical control to edit `id`, or
 * undefined when no switch is involved. Used to follow hardware switches
 * that transmit no MIDI of their own (Osc Select, Env Select, …).
 */
export function selectorRoutingFor(id: string): SelectorRouting | undefined {
  return selectorRoutingById.get(id);
}

/** Like allControlTargets, plus the Function-modifier target. */
export function allControlTargetsWithFunction(control: ControlDefinition): string[] {
  return [
    ...allControlTargets(control.target),
    ...(control.functionTarget ? allControlTargets(control.functionTarget) : []),
  ];
}

export function describeAccess(def: ParameterDefinition): string {
  const a = def.access;
  switch (a.kind) {
    case 'panel':
      return 'Panel control';
    case 'on-key':
      return a.presses === 1
        ? `Function + ${a.key} key`
        : `Function + ${a.key} key, pressed ${a.presses}×`;
    case 'function-modifier':
      return `Hold Function and turn ${findControl(a.controlId)?.label ?? a.controlId}`;
    case 'midi-only':
      return 'MIDI only';
  }
}
