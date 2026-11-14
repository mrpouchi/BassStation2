import { create } from 'zustand';
import type { PortInfo } from '@/engine/midi/MidiDeviceManager';

export type MidiStatus =
  | 'unsupported'
  | 'insecure'
  | 'idle'
  | 'requesting'
  | 'ready'
  | 'denied'
  | 'error';

export interface MidiLogEntry {
  at: number;
  dir: 'in' | 'out';
  bytes: number[];
  label: string;
}

/** A result recorded by the user's own compatibility test on their device. */
export interface LocalVerification {
  input?: 'pass';
  output?: 'pass' | 'fail';
  at: number;
}

interface MidiState {
  status: MidiStatus;
  error: string | null;
  inputs: PortInfo[];
  outputs: PortInfo[];
  inputId: string | null;
  outputId: string | null;
  /** Remembered port names, used to reconnect automatically. */
  preferredInputName: string | null;
  preferredOutputName: string | null;
  receive: boolean;
  send: boolean;
  log: MidiLogEntry[];
  verification: Record<string, LocalVerification>;
  /** Parameter currently armed for an input test. */
  listeningFor: string | null;
  set: (patch: Partial<Omit<MidiState, 'set' | 'addLog' | 'recordVerification'>>) => void;
  addLog: (entry: MidiLogEntry) => void;
  recordVerification: (id: string, patch: Omit<LocalVerification, 'at'>) => void;
}

const MAX_LOG = 60;

export const useMidiStore = create<MidiState>()((set) => ({
  status: 'idle',
  error: null,
  inputs: [],
  outputs: [],
  inputId: null,
  outputId: null,
  preferredInputName: null,
  preferredOutputName: null,
  receive: true,
  send: false,
  log: [],
  verification: {},
  listeningFor: null,
  set: (patch) => set(patch),
  addLog: (entry) => set((s) => ({ log: [entry, ...s.log].slice(0, MAX_LOG) })),
  recordVerification: (id, patch) =>
    set((s) => ({
      verification: {
        ...s.verification,
        [id]: { ...s.verification[id], ...patch, at: Date.now() },
      },
    })),
}));

/** Whether the selected input port is currently present and connected. */
export function selectInputConnected(s: Pick<MidiState, 'inputs' | 'inputId'>): boolean {
  return s.inputs.some((p) => p.id === s.inputId && p.state === 'connected');
}

export function selectOutputConnected(s: Pick<MidiState, 'outputs' | 'outputId'>): boolean {
  return s.outputs.some((p) => p.id === s.outputId && p.state === 'connected');
}

export interface StoredMidiSettings {
  format: 1;
  receive: boolean;
  send: boolean;
  preferredInputName: string | null;
  preferredOutputName: string | null;
  verification: Record<string, LocalVerification>;
}

export function parseMidiSettings(v: unknown): StoredMidiSettings | null {
  if (typeof v !== 'object' || v === null) return null;
  const o = v as Record<string, unknown>;
  if (o.format !== 1) return null;
  const verification: Record<string, LocalVerification> = {};
  if (typeof o.verification === 'object' && o.verification !== null) {
    for (const [k, r] of Object.entries(o.verification as Record<string, unknown>)) {
      if (typeof r !== 'object' || r === null) continue;
      const rr = r as Record<string, unknown>;
      if (typeof rr.at !== 'number') continue;
      verification[k] = {
        at: rr.at,
        ...(rr.input === 'pass' && { input: 'pass' as const }),
        ...((rr.output === 'pass' || rr.output === 'fail') && { output: rr.output }),
      };
    }
  }
  return {
    format: 1,
    receive: o.receive !== false,
    send: o.send === true,
    preferredInputName: typeof o.preferredInputName === 'string' ? o.preferredInputName : null,
    preferredOutputName: typeof o.preferredOutputName === 'string' ? o.preferredOutputName : null,
    verification,
  };
}
