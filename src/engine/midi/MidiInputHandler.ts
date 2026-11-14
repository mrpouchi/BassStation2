import { findParameter } from '@/engine/parameters/registry';
import type { ParameterValue } from '@/engine/parameters/types';
import { CC_INDEX, codecFor, joinPair, NRPN_INDEX } from './MidiParameterMapper';

export type MidiInputEvent =
  | { kind: 'parameter'; id: string; value: ParameterValue; raw?: number }
  /** A mapped parameter whose raw value the codec could not decode (e.g. an unknown switch value). */
  | { kind: 'undecoded'; id: string; raw: number }
  | { kind: 'note'; on: boolean; note: number; velocity: number }
  | { kind: 'program'; program: number }
  | { kind: 'clock' };

/**
 * Stateful parser for messages from the Bass Station II. Handles CC pairs
 * (coarse then fine), NRPN sequences (99, 98, 6) and maps them to parameters.
 * Performance controls (wheels, aftertouch, sustain) map to their parameters too.
 */
export class MidiInputHandler {
  private nrpnMsb: number | null = null;
  private nrpnLsb: number | null = null;
  private pairMsb = new Map<string, number>();

  constructor(private channel: number) {}

  setChannel(channel: number): void {
    this.channel = channel;
  }

  handle(data: ArrayLike<number>): MidiInputEvent[] {
    const status = data[0];
    if (status === undefined) return [];
    if (status === 0xf8) return [{ kind: 'clock' }];
    if (status >= 0xf0) return [];
    const type = status & 0xf0;
    const ch = (status & 0x0f) + 1;
    if (ch !== this.channel) return [];
    const d1 = data[1] ?? 0;
    const d2 = data[2] ?? 0;

    switch (type) {
      case 0x90:
        return [{ kind: 'note', on: d2 > 0, note: d1, velocity: d2 }];
      case 0x80:
        return [{ kind: 'note', on: false, note: d1, velocity: d2 }];
      case 0xc0:
        return [{ kind: 'program', program: d1 }];
      case 0xe0: {
        const bend = ((d2 << 7) | d1) - 8192;
        return [
          {
            kind: 'parameter',
            id: 'performance.pitchWheel',
            value: Math.round((bend / 8192) * 100) / 100,
          },
        ];
      }
      case 0xd0:
        return [{ kind: 'parameter', id: 'performance.aftertouch', value: d1 }];
      case 0xb0:
        return this.handleCc(d1, d2);
      default:
        return [];
    }
  }

  private handleCc(cc: number, value: number): MidiInputEvent[] {
    // NRPN address and data entry.
    if (cc === 99) {
      this.nrpnMsb = value;
      return [];
    }
    if (cc === 98) {
      this.nrpnLsb = value;
      return [];
    }
    if (cc === 6 && this.nrpnMsb !== null && this.nrpnLsb !== null) {
      const def = NRPN_INDEX.get(`${this.nrpnMsb}:${this.nrpnLsb}`);
      if (!def) return [];
      return [decodedEvent(def.id, codecFor(def)?.decode(value), value)];
    }
    if (cc === 1) return [{ kind: 'parameter', id: 'performance.modWheel', value }];
    if (cc === 64) return [{ kind: 'parameter', id: 'performance.sustain', value }];

    const route = CC_INDEX.get(cc);
    if (!route) return [];
    const codec = codecFor(route.def);
    if (!codec) return [];
    let raw: number;
    if (route.role === 'single') raw = value;
    else if (route.role === 'msb') {
      this.pairMsb.set(route.def.id, value);
      raw = joinPair(value, 0);
    } else {
      const msb = this.pairMsb.get(route.def.id);
      if (msb === undefined) return [];
      raw = joinPair(msb, value);
    }
    if (!findParameter(route.def.id)) return [];
    return [decodedEvent(route.def.id, codec.decode(raw), raw)];
  }
}

function decodedEvent(id: string, value: ParameterValue | undefined, raw: number): MidiInputEvent {
  return value === undefined
    ? { kind: 'undecoded', id, raw }
    : { kind: 'parameter', id, value, raw };
}
