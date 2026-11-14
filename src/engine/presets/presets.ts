import { PARAMETERS } from '@/data/synthesizer/parameters';
import {
  defaultValues,
  findParameter,
  formatValue,
  normalizeValue,
} from '@/engine/parameters/registry';
import type { ParameterValue, SectionId } from '@/engine/parameters/types';

/**
 * Presets store patch-scope parameters only (the sound itself) — not panel
 * routing, performance inputs or global instrument settings.
 */
export const PRESET_CATEGORIES = [
  'bass',
  'lead',
  'pad',
  'pluck',
  'keys',
  'fx',
  'drum',
  'other',
] as const;
export type PresetCategory = (typeof PRESET_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<PresetCategory, string> = {
  bass: 'Bass',
  lead: 'Lead',
  pad: 'Pad',
  pluck: 'Pluck',
  keys: 'Keys',
  fx: 'FX',
  drum: 'Drum',
  other: 'Other',
};

export interface Preset {
  id: string;
  name: string;
  description: string;
  category: PresetCategory;
  tags: string[];
  favorite: boolean;
  values: Record<string, ParameterValue>;
  createdAt: number;
  updatedAt: number;
}

export const PATCH_PARAMETER_IDS: readonly string[] = PARAMETERS.filter(
  (p) => p.scope === 'patch',
).map((p) => p.id);
const PATCH_SET = new Set(PATCH_PARAMETER_IDS);

/** Extract the patch-scope values from a full value map. */
export function patchValues(
  values: Readonly<Record<string, ParameterValue>>,
): Record<string, ParameterValue> {
  const out: Record<string, ParameterValue> = {};
  for (const id of PATCH_PARAMETER_IDS) {
    const v = values[id];
    if (v !== undefined) out[id] = v;
  }
  return out;
}

/**
 * Values to load: keeps the user's current global, panel and performance
 * settings, and replaces the sound (patch-scope) with the preset. Patch values
 * missing from the preset fall back to the Init Patch.
 */
export function valuesForLoad(
  current: Readonly<Record<string, ParameterValue>>,
  preset: Pick<Preset, 'values'>,
): Record<string, ParameterValue> {
  const init = defaultValues();
  const out: Record<string, ParameterValue> = { ...current };
  for (const id of PATCH_PARAMETER_IDS) out[id] = preset.values[id] ?? init[id] ?? 0;
  return out;
}

export function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export interface ParseResult {
  preset: Preset | null;
  /** Parameter ids dropped because they were unknown, not patch-scope, or invalid. */
  rejected: string[];
  error?: string;
}

const MAX_NAME = 80;
const MAX_DESCRIPTION = 1000;

/** Validate untrusted preset data (from storage or an imported file). */
export function parsePreset(input: unknown, opts: { keepId?: boolean } = {}): ParseResult {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    return { preset: null, rejected: [], error: 'Not a preset object.' };
  }
  const o = input as Record<string, unknown>;
  const name = typeof o.name === 'string' ? o.name.trim().slice(0, MAX_NAME) : '';
  if (!name) return { preset: null, rejected: [], error: 'The preset has no name.' };
  if (typeof o.values !== 'object' || o.values === null || Array.isArray(o.values)) {
    return { preset: null, rejected: [], error: `“${name}” has no parameter values.` };
  }
  const values: Record<string, ParameterValue> = {};
  const rejected: string[] = [];
  for (const [id, raw] of Object.entries(o.values as Record<string, unknown>)) {
    const def = findParameter(id);
    const v = def && PATCH_SET.has(id) ? normalizeValue(def, raw) : undefined;
    if (v === undefined) rejected.push(id);
    else values[id] = v;
  }
  const now = Date.now();
  const category = PRESET_CATEGORIES.includes(o.category as PresetCategory)
    ? (o.category as PresetCategory)
    : 'other';
  const tags = Array.isArray(o.tags)
    ? [
        ...new Set(
          o.tags
            .filter((t): t is string => typeof t === 'string')
            .map((t) => t.trim().toLowerCase())
            .filter(Boolean),
        ),
      ].slice(0, 12)
    : [];
  return {
    preset: {
      id: opts.keepId && typeof o.id === 'string' && o.id ? o.id : newId(),
      name,
      description: typeof o.description === 'string' ? o.description.slice(0, MAX_DESCRIPTION) : '',
      category,
      tags,
      favorite: o.favorite === true,
      values,
      createdAt: typeof o.createdAt === 'number' ? o.createdAt : now,
      updatedAt: typeof o.updatedAt === 'number' ? o.updatedAt : now,
    },
    rejected,
  };
}

// ---------------------------------------------------------------------------
// File format
// ---------------------------------------------------------------------------

export const EXPORT_FORMAT = 'bass-station-academy/presets';
export const EXPORT_VERSION = 1;

export interface PresetFile {
  format: typeof EXPORT_FORMAT;
  version: number;
  exportedAt: string;
  note: string;
  presets: Preset[];
}

export function toExportFile(presets: readonly Preset[]): PresetFile {
  return {
    format: EXPORT_FORMAT,
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    note: 'Bass Station Academy presets. This is not a Novation SysEx patch and cannot be sent to the synth as a patch file.',
    presets: presets.map((p) => ({ ...p, values: { ...p.values } })),
  };
}

export interface ImportResult {
  presets: Preset[];
  errors: string[];
  rejectedParameters: number;
}

export function parseImportFile(text: string): ImportResult {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { presets: [], errors: ['The file is not valid JSON.'], rejectedParameters: 0 };
  }
  const o = data as Record<string, unknown> | null;
  if (!o || o.format !== EXPORT_FORMAT || !Array.isArray(o.presets)) {
    return {
      presets: [],
      errors: ['This is not a Bass Station Academy preset file.'],
      rejectedParameters: 0,
    };
  }
  if (typeof o.version !== 'number' || o.version > EXPORT_VERSION) {
    return {
      presets: [],
      errors: [`Unsupported file version ${String(o.version)}.`],
      rejectedParameters: 0,
    };
  }
  const presets: Preset[] = [];
  const errors: string[] = [];
  let rejectedParameters = 0;
  for (const item of o.presets) {
    const r = parsePreset(item); // imported presets always get new ids
    if (r.preset) presets.push(r.preset);
    else errors.push(r.error ?? 'Invalid preset.');
    rejectedParameters += r.rejected.length;
  }
  return { presets, errors, rejectedParameters };
}

// ---------------------------------------------------------------------------
// Comparison
// ---------------------------------------------------------------------------

export interface Difference {
  id: string;
  name: string;
  section: SectionId;
  a: string;
  b: string;
}

/** Patch parameters whose values differ between two value maps (missing = Init value). */
export function comparePresets(
  a: Readonly<Record<string, ParameterValue>>,
  b: Readonly<Record<string, ParameterValue>>,
): Difference[] {
  const init = defaultValues();
  const out: Difference[] = [];
  for (const id of PATCH_PARAMETER_IDS) {
    const def = findParameter(id);
    if (!def) continue;
    const va = a[id] ?? init[id];
    const vb = b[id] ?? init[id];
    if (va === undefined || vb === undefined || va === vb) continue;
    out.push({
      id,
      name: def.name,
      section: def.section,
      a: formatValue(def, va),
      b: formatValue(def, vb),
    });
  }
  return out;
}
