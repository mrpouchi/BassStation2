import { PARAMETERS } from '@/data/synthesizer/parameters';
import { normalizeValue } from '@/engine/parameters/registry';
import type { MidiMapping, ParameterDefinition, ParameterValue } from '@/engine/parameters/types';

/**
 * Converts parameter values to and from MIDI controller values.
 *
 * The manual documents controller NUMBERS but rarely the VALUE encoding.
 * Every codec states its basis: 'documented' when the manual gives the values
 * (e.g. Osc Range 63–66), otherwise 'inferred' (a conventional guess that must
 * be confirmed on hardware before it is trusted).
 */
export type CodecBasis = 'documented' | 'inferred';

export interface Codec {
  /** Resolution of the transmitted value: 7-bit (0–127) or 8-bit across a CC pair (0–255). */
  readonly bits: 7 | 8;
  readonly basis: CodecBasis;
  readonly description: string;
  encode(value: ParameterValue): number;
  decode(raw: number): ParameterValue | undefined;
}

const clampInt = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, Math.round(v)));

/** Documented explicit value tables (manual p. 71). */
const DOCUMENTED_ENUM_VALUES: Record<string, Record<string, number>> = {
  'osc1.range': { '16': 63, '8': 64, '4': 65, '2': 66 },
  'osc2.range': { '16': 63, '8': 64, '4': 65, '2': 66 },
};

/**
 * Inferred explicit value tables, used where a plain option index is known to be wrong.
 * - Sub Osc Octave: the manual lists the values in the order "-2, -1" (p. 71).
 * - Envelope triggering: a user's hardware showed Single and Multi swapped under
 *   the option-index guess; this order (Multi, Single, Autoglide) follows that report
 *   and is still unconfirmed. The manual only says "1, 2, 3" without naming them.
 * Values the codec does not know can be taught per device on the Hardware page.
 */
const INFERRED_ENUM_VALUES: Record<string, { table: Record<string, number>; note: string }> = {
  'sub.octave': { table: { '-2': 0, '-1': 1 }, note: 'Order as listed in the manual (-2, -1).' },
  'ampEnv.triggering': {
    table: { multi: 0, single: 1, autoglide: 2 },
    note: 'Order from a hardware report, not from the manual.',
  },
  'modEnv.triggering': {
    table: { multi: 0, single: 1, autoglide: 2 },
    note: 'Order from a hardware report, not from the manual.',
  },
};

export function codecFor(def: ParameterDefinition): Codec | null {
  const m = def.midi.mapping;
  if (!m || (m.type !== 'cc' && m.type !== 'nrpn')) return null;
  const pair = m.type === 'cc' && m.lsbCc !== undefined;
  const bits: 7 | 8 = pair ? 8 : 7;
  const full = bits === 8 ? 255 : 127;

  switch (def.kind) {
    case 'toggle': {
      const on = m.type === 'nrpn' ? 1 : 127;
      return {
        bits,
        basis: 'inferred',
        description: `Off = 0, On = ${on}. Values ≥ ${m.type === 'nrpn' ? 1 : 64} are read as On.`,
        encode: (v) => (v === true ? on : 0),
        decode: (raw) => raw >= (m.type === 'nrpn' ? 1 : 64),
      };
    }
    case 'enum': {
      const table = DOCUMENTED_ENUM_VALUES[def.id];
      if (table) {
        return {
          bits,
          basis: 'documented',
          description: def.options.map((o) => `${o.label} = ${table[o.value]}`).join(', '),
          encode: (v) => table[String(v)] ?? 64,
          decode: (raw) => def.options.find((o) => table[o.value] === raw)?.value,
        };
      }
      const inferred = INFERRED_ENUM_VALUES[def.id];
      if (inferred) {
        const t = inferred.table;
        return {
          bits,
          basis: 'inferred',
          description: `${def.options.map((o) => `${o.label} = ${t[o.value]}`).join(', ')}. ${inferred.note}`,
          encode: (v) => t[String(v)] ?? 0,
          decode: (raw) => def.options.find((o) => t[o.value] === raw)?.value,
        };
      }
      return {
        bits,
        basis: 'inferred',
        description: `Option index 0–${def.options.length - 1} (${def.options.map((o) => o.label).join(', ')}).`,
        encode: (v) =>
          Math.max(
            0,
            def.options.findIndex((o) => o.value === v),
          ),
        decode: (raw) => def.options[raw]?.value,
      };
    }
    case 'continuous': {
      const integer = def.step >= 1;
      const span = def.max - def.min;
      // Direct: integer range that already fits the controller (e.g. 0–127, 1–32, 0–255 on a pair).
      if (integer && !def.bipolar && def.min >= 0 && def.max <= full) {
        const documented =
          def.min === 0 &&
          (def.max === 127 || def.max === 255) &&
          def.midi.documentedRange !== undefined;
        return {
          bits,
          basis: documented ? 'documented' : 'inferred',
          description: `Value sent as-is (${def.min}–${def.max}).`,
          encode: (v) => clampInt(Number(v), 0, full),
          decode: (raw) => normalizeValue(def, raw),
        };
      }
      // Bipolar integer range centred on 64 (7-bit) or 128 (8-bit).
      const centre = bits === 8 ? 128 : 64;
      if (integer && def.bipolar && def.min === -def.max && def.max < centre) {
        return {
          bits,
          basis: 'inferred',
          description: `Centre ${centre} = 0, offset by the value (${centre + def.min}–${centre + def.max}).`,
          encode: (v) => clampInt(Number(v) + centre, 0, full),
          decode: (raw) => normalizeValue(def, raw - centre),
        };
      }
      // Fallback: linear scaling of the whole range onto the controller range.
      return {
        bits,
        basis: 'inferred',
        description: `Linear scaling of ${def.min}…${def.max} onto 0–${full}.`,
        encode: (v) => clampInt(((Number(v) - def.min) / span) * full, 0, full),
        decode: (raw) => normalizeValue(def, def.min + (raw / full) * span),
      };
    }
  }
}

// ---------------------------------------------------------------------------
// Message building
// ---------------------------------------------------------------------------

export type MidiBytes = readonly number[];

/**
 * 8-bit pair split (inferred): the coarse CC carries the top 7 bits, the fine
 * CC carries the lowest bit in its MSB (value << 6).
 */
export function splitPair(v: number): [msb: number, lsb: number] {
  const x = clampInt(v, 0, 255);
  return [x >> 1, (x & 1) << 6];
}

export function joinPair(msb: number, lsb: number): number {
  return ((msb & 0x7f) << 1) | ((lsb & 0x40) >> 6);
}

/** Channel is 1–16. Returns the raw MIDI messages to send for a parameter value. */
export function encodeMessages(
  def: ParameterDefinition,
  value: ParameterValue,
  channel: number,
): MidiBytes[] {
  const codec = codecFor(def);
  const m = def.midi.mapping;
  if (!codec || !m) return [];
  const status = 0xb0 | ((channel - 1) & 0x0f);
  const raw = codec.encode(value);
  if (m.type === 'cc') {
    if (m.lsbCc !== undefined) {
      const [msb, lsb] = splitPair(raw);
      return [
        [status, m.cc, msb],
        [status, m.lsbCc, lsb],
      ];
    }
    return [[status, m.cc, clampInt(raw, 0, 127)]];
  }
  if (m.type === 'nrpn') {
    return [
      [status, 99, m.msb & 0x7f],
      [status, 98, m.lsb & 0x7f],
      [status, 6, clampInt(raw, 0, 127)],
    ];
  }
  return [];
}

// ---------------------------------------------------------------------------
// Lookup tables for incoming messages
// ---------------------------------------------------------------------------

export interface CcRoute {
  def: ParameterDefinition;
  role: 'single' | 'msb' | 'lsb';
}

function buildCcIndex(): Map<number, CcRoute> {
  const map = new Map<number, CcRoute>();
  for (const def of PARAMETERS) {
    const m: MidiMapping | null = def.midi.mapping;
    if (m?.type !== 'cc' || def.scope === 'performance') continue;
    if (m.lsbCc === undefined) map.set(m.cc, { def, role: 'single' });
    else {
      map.set(m.cc, { def, role: 'msb' });
      map.set(m.lsbCc, { def, role: 'lsb' });
    }
  }
  return map;
}

function buildNrpnIndex(): Map<string, ParameterDefinition> {
  const map = new Map<string, ParameterDefinition>();
  for (const def of PARAMETERS) {
    const m = def.midi.mapping;
    // Ambiguous duplicates (LFO speed/sync vs sync value) resolve to the first registered.
    if (m?.type === 'nrpn' && !map.has(`${m.msb}:${m.lsb}`)) map.set(`${m.msb}:${m.lsb}`, def);
  }
  return map;
}

export const CC_INDEX: ReadonlyMap<number, CcRoute> = buildCcIndex();
export const NRPN_INDEX: ReadonlyMap<string, ParameterDefinition> = buildNrpnIndex();
