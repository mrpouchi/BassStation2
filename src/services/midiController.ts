import { MidiDeviceManager, isBassStation, type PortInfo } from '@/engine/midi/MidiDeviceManager';
import { MidiInputHandler } from '@/engine/midi/MidiInputHandler';
import { MidiOutputHandler } from '@/engine/midi/MidiOutputHandler';
import { codecFor } from '@/engine/midi/MidiParameterMapper';
import { detectWebMidiSupport } from '@/engine/midi/support';
import { findParameter } from '@/engine/parameters/registry';
import { PARAMETERS } from '@/data/synthesizer/parameters';
import { useHardwareUiStore } from '@/stores/hardwareUiStore';
import { useMidiStore } from '@/stores/midiStore';
import { useSynthStore } from '@/stores/synthStore';

/**
 * Orchestrates the MIDI modules and the app stores:
 * device detection, port selection, input → store (origin 'midi'),
 * store → output (only UI-originated changes, so incoming MIDI is never echoed),
 * disconnection/reconnection, and the compatibility test.
 */
export class MidiController {
  private manager: MidiDeviceManager;
  private input: MidiInputHandler;
  private output: MidiOutputHandler;
  private attachedInput: MIDIInput | null = null;
  private unsubscribers: (() => void)[] = [];

  constructor(nav?: Pick<Navigator, 'requestMIDIAccess'>, secure?: boolean) {
    this.manager = new MidiDeviceManager(nav);
    const channel = this.channel();
    this.input = new MidiInputHandler(channel);
    this.output = new MidiOutputHandler({ send: (b) => this.rawSend(b) }, channel);
    const support = detectWebMidiSupport(nav, secure);
    if (support !== 'available') {
      useMidiStore
        .getState()
        .set({ status: support === 'unsupported' ? 'unsupported' : 'insecure' });
    }
  }

  private channel(): number {
    const v = useSynthStore.getState().values['global.midiChannel'];
    return typeof v === 'number' ? v : 1;
  }

  async connect(): Promise<void> {
    const store = useMidiStore.getState();
    if (store.status === 'unsupported' || store.status === 'insecure') return;
    store.set({ status: 'requesting', error: null });
    try {
      await this.manager.requestAccess();
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      const denied =
        e instanceof Error && (e.name === 'SecurityError' || e.name === 'NotAllowedError');
      store.set({ status: denied ? 'denied' : 'error', error: message });
      return;
    }
    store.set({ status: 'ready' });
    this.unsubscribers.push(this.manager.onChange(() => this.refresh()));
    this.unsubscribers.push(this.subscribeStore());
    this.refresh();
  }

  /** Re-read ports, auto-select the Bass Station II, and (re)attach the input. */
  refresh(): void {
    const s = useMidiStore.getState();
    const inputs = this.manager.inputs();
    const outputs = this.manager.outputs();
    const pick = (ports: PortInfo[], currentId: string | null, preferredName: string | null) => {
      const live = ports.filter((p) => p.state === 'connected');
      return (
        live.find((p) => p.id === currentId) ??
        live.find((p) => preferredName !== null && p.name === preferredName) ??
        live.find((p) => isBassStation(p.name)) ??
        null
      );
    };
    const inPort = pick(inputs, s.inputId, s.preferredInputName);
    const outPort = pick(outputs, s.outputId, s.preferredOutputName);
    s.set({
      inputs,
      outputs,
      // Keep a disappeared selection so the UI can show "disconnected" and reattach later.
      inputId: inPort?.id ?? s.inputId,
      outputId: outPort?.id ?? s.outputId,
      ...(inPort && { preferredInputName: inPort.name }),
      ...(outPort && { preferredOutputName: outPort.name }),
    });
    this.attachInput(inPort?.id ?? null);
  }

  selectInput(id: string | null): void {
    const port = this.manager.inputs().find((p) => p.id === id);
    useMidiStore.getState().set({ inputId: id, preferredInputName: port?.name ?? null });
    this.attachInput(id);
  }

  selectOutput(id: string | null): void {
    const port = this.manager.outputs().find((p) => p.id === id);
    useMidiStore.getState().set({ outputId: id, preferredOutputName: port?.name ?? null });
  }

  private attachInput(id: string | null): void {
    const next = id ? (this.manager.input(id) ?? null) : null;
    if (next === this.attachedInput) return;
    if (this.attachedInput) this.attachedInput.onmidimessage = null;
    this.attachedInput = next;
    if (next) next.onmidimessage = (e: MIDIMessageEvent) => e.data && this.receive(e.data);
  }

  /** Entry point for incoming bytes (public for tests). */
  receive(data: ArrayLike<number>): void {
    const midi = useMidiStore.getState();
    this.input.setChannel(this.channel());
    const events = this.input.handle(data);
    if (data[0] !== 0xf8) {
      const first = events[0];
      midi.addLog({
        at: Date.now(),
        dir: 'in',
        bytes: Array.from(data),
        label:
          first?.kind === 'parameter'
            ? (findParameter(first.id)?.name ?? first.id)
            : (first?.kind ?? 'unmapped'),
      });
    }
    for (const ev of events) {
      if (ev.kind === 'parameter') {
        if (midi.listeningFor === ev.id) {
          midi.recordVerification(ev.id, { input: 'pass' });
          midi.set({ listeningFor: null });
        }
        if (midi.receive) useSynthStore.getState().setValue(ev.id, ev.value, 'midi');
      } else if (ev.kind === 'note' && ev.on && midi.receive) {
        useHardwareUiStore.getState().pressKey(-1, ev.note);
      } else if (ev.kind === 'program' && midi.receive) {
        useSynthStore.getState().setValue('master.patch', ev.program, 'midi');
      }
    }
  }

  private rawSend(bytes: readonly number[]): void {
    const s = useMidiStore.getState();
    const out = s.outputId ? this.manager.output(s.outputId) : undefined;
    if (!out || out.state !== 'connected') return;
    out.send(bytes as number[]);
    s.addLog({ at: Date.now(), dir: 'out', bytes: [...bytes], label: '' });
  }

  private subscribeStore(): () => void {
    return useSynthStore.subscribe((state, prev) => {
      if (state.values === prev.values) return;
      const change = state.lastChange;
      if (!change || change.origin === 'midi' || change.origin === 'system') return;
      if (!useMidiStore.getState().send) return;
      this.output.setChannel(this.channel());
      if (change.id === '*') return; // bulk loads are sent explicitly via sendPatch()
      this.output.queue(change.id, state.values[change.id] ?? 0);
    });
  }

  /** Send every patch parameter with a sendable mapping. Returns the number of parameters sent. */
  sendPatch(): number {
    const values = useSynthStore.getState().values;
    this.output.setChannel(this.channel());
    let n = 0;
    for (const def of PARAMETERS) {
      if (def.scope !== 'patch' || !codecFor(def)) continue;
      const v = values[def.id];
      if (v !== undefined && this.output.sendNow(def.id, v) > 0) n++;
    }
    return n;
  }

  /** Compatibility test: send a parameter's current value now. */
  testOutput(id: string): boolean {
    const v = useSynthStore.getState().values[id];
    if (v === undefined) return false;
    this.output.setChannel(this.channel());
    return this.output.sendNow(id, v) > 0;
  }

  dispose(): void {
    this.unsubscribers.forEach((u) => u());
    this.unsubscribers = [];
    this.attachInput(null);
  }
}

let instance: MidiController | null = null;

export function getMidiController(): MidiController {
  instance ??= new MidiController();
  return instance;
}

/** Test helper. */
export function setMidiControllerForTests(c: MidiController | null): void {
  instance = c;
}
