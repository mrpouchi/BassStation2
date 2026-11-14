import { CONTROLS } from '@/data/synthesizer/controls';
import { ON_KEY_LAYOUT } from '@/data/synthesizer/onKeyLayout';
import { getSection } from '@/data/synthesizer/sections';
import {
  allControlTargets,
  findControl,
  findParameter,
  selectorRoutingFor,
} from '@/engine/parameters/registry';
import type { ControlDefinition } from '@/engine/parameters/types';
import { t } from '@/i18n/t';
import { CONTROL_POSITIONS, KEYS } from './panelMap';

export interface LocatedPoint {
  controlId: string;
  x: number;
  y: number;
}

/** Where a parameter lives on the instrument, and what has to be set to reach it. */
export interface ParameterLocation {
  /** Controls that edit the parameter (highlighted). */
  controls: LocatedPoint[];
  /** Switches that must be in a given position first (highlighted differently). */
  selectors: LocatedPoint[];
  /** On-Key function: key index on the 25-key keyboard. */
  key: { index: number; x: number; presses: number } | null;
  /** Function/Exit must be held or pressed. */
  needsFunction: boolean;
  /** Human-readable steps, already translated. */
  steps: string[];
}

const at = (c: ControlDefinition): LocatedPoint | null => {
  const p = CONTROL_POSITIONS[c.id];
  return p ? { controlId: c.id, ...p } : null;
};

const routesTo = (c: ControlDefinition, id: string) =>
  c.target !== null &&
  allControlTargets(c.target).includes(id) &&
  !('via' in c.target && c.target.via === id);

/** "lower E" → "low E" / "E grave", "middle C" → "middle C" / "do central". */
export function keyLabel(key: string): string {
  if (key === 'middle C') return t('middle C');
  const [octave, note = ''] = key.split(' ');
  return octave === 'lower' ? t('low {note}', { note }) : t('high {note}', { note });
}

export function locateParameter(id: string): ParameterLocation {
  const def = findParameter(id);
  const loc: ParameterLocation = {
    controls: [],
    selectors: [],
    key: null,
    needsFunction: false,
    steps: [],
  };
  if (!def) return loc;

  const direct = CONTROLS.filter((c) => routesTo(c, id));
  const viaFunction = CONTROLS.filter(
    (c) => c.functionTarget && allControlTargets(c.functionTarget).includes(id),
  );

  // Switches that must be set first (Osc Select on 2, Env Select on Mod…).
  const routing = selectorRoutingFor(id);
  for (const [via, value] of Object.entries(routing?.single ?? {})) {
    const sw = CONTROLS.find((c) => c.target && 'param' in c.target && c.target.param === via);
    const swDef = findParameter(via);
    const option =
      swDef?.kind === 'enum' ? swDef.options.find((o) => o.value === value)?.label : value;
    if (sw) {
      const p = at(sw);
      if (p) loc.selectors.push(p);
      loc.steps.push(t('Set {control} to {value}.', { control: sw.label, value: option ?? value }));
    }
  }

  for (const c of direct) {
    const p = at(c);
    if (p) loc.controls.push(p);
    loc.steps.push(
      t('{control} in the {section} section.', {
        control: c.label,
        section: getSection(c.section).name,
      }),
    );
  }

  for (const c of viaFunction) {
    const p = at(c);
    if (p) loc.controls.push(p);
    loc.needsFunction = true;
    loc.steps.push(t('Hold Function and turn {control}.', { control: c.label }));
  }

  const access = def.access;
  if (access.kind === 'on-key') {
    const index = ON_KEY_LAYOUT.findIndex((k) => k.key === access.key);
    const key = KEYS[index];
    if (key) {
      const presses = access.presses;
      loc.key = { index, x: key.center, presses };
      loc.needsFunction = true;
      loc.steps.push(
        presses > 1
          ? t('Press Function, then the {key} key {n} times, then ◀ ▶.', {
              key: keyLabel(access.key),
              n: presses,
            })
          : t('Press Function, then the {key} key, then ◀ ▶.', { key: keyLabel(access.key) }),
      );
    }
  } else if (access.kind === 'function-modifier' && viaFunction.length === 0) {
    const c = findControl(access.controlId);
    const p = c ? at(c) : null;
    if (c && p) {
      loc.controls.push(p);
      loc.needsFunction = true;
      loc.steps.push(t('Hold Function and turn {control}.', { control: c.label }));
    }
  }

  if (loc.steps.length === 0) {
    loc.steps.push(
      access.kind === 'midi-only'
        ? t('Not on the panel: reachable over MIDI only.')
        : t('No dedicated control on the panel.'),
    );
  }
  return loc;
}
