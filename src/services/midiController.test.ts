import { useMidiStore } from '@/stores/midiStore';
import { useSynthStore } from '@/stores/synthStore';
import { MidiController } from './midiController';

/** Minimal fake of the Web MIDI API. */
class FakePort {
  onmidimessage: ((e: { data: Uint8Array }) => void) | null = null;
  sent: number[][] = [];
  constructor(
    public id: string,
    public name: string,
    public state: 'connected' | 'disconnected' = 'connected',
    public manufacturer = 'Novation',
  ) {}
  send(data: number[]) {
    this.sent.push([...data]);
  }
  emit(data: number[]) {
    this.onmidimessage?.({ data: new Uint8Array(data) });
  }
}

function setup() {
  const input = new FakePort('in-1', 'Bass Station II');
  const output = new FakePort('out-1', 'Bass Station II');
  const other = new FakePort('in-2', 'IAC Driver Bus 1');
  const access = {
    inputs: new Map<string, FakePort>([
      ['in-2', other],
      ['in-1', input],
    ]),
    outputs: new Map<string, FakePort>([['out-1', output]]),
    onstatechange: null as ((e: Event) => void) | null,
  };
  const nav = { requestMIDIAccess: () => Promise.resolve(access) } as unknown as Navigator;
  const controller = new MidiController(nav, true);
  return { controller, input, output, access };
}

beforeEach(() => {
  useSynthStore.getState().resetToInit();
  useMidiStore.setState({
    status: 'idle',
    inputId: null,
    outputId: null,
    preferredInputName: null,
    preferredOutputName: null,
    receive: true,
    send: false,
    log: [],
    verification: {},
    listeningFor: null,
  });
});

describe('MidiController', () => {
  it('auto-selects the Bass Station II and applies incoming changes', async () => {
    const { controller, input } = setup();
    await controller.connect();
    expect(useMidiStore.getState().status).toBe('ready');
    expect(useMidiStore.getState().inputId).toBe('in-1');
    input.emit([0xb0, 82, 77]);
    expect(useSynthStore.getState().values['filter.resonance']).toBe(77);
    expect(useSynthStore.getState().lastChange?.origin).toBe('midi');
    controller.dispose();
  });

  it('never echoes incoming MIDI back, and only sends when enabled', async () => {
    const { controller, input, output } = setup();
    await controller.connect();
    input.emit([0xb0, 82, 77]);
    useSynthStore.getState().setValue('filter.resonance', 10, 'ui');
    await new Promise((r) => setTimeout(r, 30));
    expect(output.sent).toEqual([]); // sending disabled by default

    useMidiStore.getState().set({ send: true });
    input.emit([0xb0, 82, 60]);
    await new Promise((r) => setTimeout(r, 30));
    expect(output.sent).toEqual([]); // MIDI-originated change not echoed

    useSynthStore.getState().setValue('filter.resonance', 99, 'ui');
    await new Promise((r) => setTimeout(r, 30));
    expect(output.sent).toEqual([[0xb0, 82, 99]]);
    controller.dispose();
  });

  it('records an input verification while listening', async () => {
    const { controller, input } = setup();
    await controller.connect();
    useMidiStore.getState().set({ listeningFor: 'filter.resonance' });
    input.emit([0xb0, 82, 10]);
    expect(useMidiStore.getState().verification['filter.resonance']?.input).toBe('pass');
    expect(useMidiStore.getState().listeningFor).toBeNull();
    controller.dispose();
  });

  it('handles disconnection and reconnection', async () => {
    const { controller, input, access } = setup();
    await controller.connect();
    input.state = 'disconnected';
    access.onstatechange?.(new Event('statechange'));
    expect(useMidiStore.getState().inputs.find((p) => p.id === 'in-1')?.state).toBe('disconnected');
    expect(useMidiStore.getState().inputId).toBe('in-1'); // remembered for reconnection

    input.state = 'connected';
    access.onstatechange?.(new Event('statechange'));
    input.emit([0xb0, 82, 33]);
    expect(useSynthStore.getState().values['filter.resonance']).toBe(33);
    controller.dispose();
  });

  it('reports denied permission', async () => {
    const err = Object.assign(new Error('denied'), { name: 'SecurityError' });
    const nav = { requestMIDIAccess: () => Promise.reject(err) } as unknown as Navigator;
    const controller = new MidiController(nav, true);
    await controller.connect();
    expect(useMidiStore.getState().status).toBe('denied');
  });

  it('reports unsupported browsers without throwing', async () => {
    const controller = new MidiController({} as Navigator, true);
    await controller.connect();
    expect(useMidiStore.getState().status).toBe('unsupported');
  });
});
