import { findParameter } from '@/engine/parameters/registry';
import type { ParameterValue } from '@/engine/parameters/types';
import { encodeMessages, type MidiBytes } from './MidiParameterMapper';

export interface MidiSender {
  send(data: MidiBytes): void;
}

/**
 * Sends parameter changes to the hardware. Changes are coalesced per parameter
 * and flushed once per animation frame, so dragging a knob sends at most
 * ~60 updates per second for that parameter, always ending on the final value.
 */
export class MidiOutputHandler {
  private pending = new Map<string, ParameterValue>();
  private scheduled = false;

  constructor(
    private sender: MidiSender,
    private channel: number,
    private schedule: (fn: () => void) => void = (fn) =>
      typeof requestAnimationFrame === 'function'
        ? requestAnimationFrame(() => fn())
        : setTimeout(fn, 16),
  ) {}

  setChannel(channel: number): void {
    this.channel = channel;
  }

  setSender(sender: MidiSender): void {
    this.sender = sender;
  }

  /** Queue a parameter value. Returns false if the parameter has no sendable mapping. */
  queue(id: string, value: ParameterValue): boolean {
    const def = findParameter(id);
    if (!def || encodeMessages(def, value, this.channel).length === 0) return false;
    this.pending.set(id, value);
    if (!this.scheduled) {
      this.scheduled = true;
      this.schedule(() => this.flush());
    }
    return true;
  }

  flush(): void {
    this.scheduled = false;
    const items = [...this.pending];
    this.pending.clear();
    for (const [id, value] of items) {
      const def = findParameter(id);
      if (!def) continue;
      for (const msg of encodeMessages(def, value, this.channel)) this.sender.send(msg);
    }
  }

  /** Immediately send one parameter (used by the compatibility test). */
  sendNow(id: string, value: ParameterValue): number {
    const def = findParameter(id);
    if (!def) return 0;
    const msgs = encodeMessages(def, value, this.channel);
    for (const msg of msgs) this.sender.send(msg);
    return msgs.length;
  }
}
