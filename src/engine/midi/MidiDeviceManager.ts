/**
 * Thin wrapper around the Web MIDI API: requests access, lists ports, and
 * reports connection changes. Kept free of app state so it can be replaced by
 * a native implementation in a future desktop app.
 */
export interface PortInfo {
  id: string;
  name: string;
  manufacturer: string;
  state: 'connected' | 'disconnected';
}

export interface MidiAccessLike {
  inputs: Map<string, MIDIInput> | MIDIInputMap;
  outputs: Map<string, MIDIOutput> | MIDIOutputMap;
  onstatechange: ((e: Event) => void) | null;
}

/** True when a port name looks like a Bass Station II. */
export function isBassStation(name: string): boolean {
  return /bass\s*station\s*ii/i.test(name);
}

export class MidiDeviceManager {
  private access: MidiAccessLike | null = null;
  private listeners = new Set<() => void>();

  constructor(
    private nav: Pick<Navigator, 'requestMIDIAccess'> | undefined = typeof navigator === 'undefined'
      ? undefined
      : navigator,
  ) {}

  get ready(): boolean {
    return this.access !== null;
  }

  async requestAccess(): Promise<void> {
    if (!this.nav || typeof this.nav.requestMIDIAccess !== 'function') {
      throw new Error('Web MIDI is not supported in this browser.');
    }
    const access = (await this.nav.requestMIDIAccess({
      sysex: false,
    })) as unknown as MidiAccessLike;
    this.access = access;
    access.onstatechange = () => this.listeners.forEach((l) => l());
  }

  onChange(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  inputs(): PortInfo[] {
    return this.access ? [...this.access.inputs.values()].map(info) : [];
  }

  outputs(): PortInfo[] {
    return this.access ? [...this.access.outputs.values()].map(info) : [];
  }

  input(id: string): MIDIInput | undefined {
    return this.access?.inputs.get(id);
  }

  output(id: string): MIDIOutput | undefined {
    return this.access?.outputs.get(id);
  }
}

function info(p: MIDIPort): PortInfo {
  return {
    id: p.id,
    name: p.name ?? 'Unnamed port',
    manufacturer: p.manufacturer ?? '',
    state: p.state === 'connected' ? 'connected' : 'disconnected',
  };
}
