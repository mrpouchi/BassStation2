import { parseMidiSettings, useMidiStore } from '@/stores/midiStore';
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
    learnedValues: {},
    unknownValues: [],
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

  describe('following panel switches that send no MIDI', () => {
    const values = () => useSynthStore.getState().values;

    it('moves Noise/Ring/Ext to the source whose level arrives', async () => {
      const { controller, input } = setup();
      await controller.connect();
      expect(values()['panel.mixerSource']).toBe('noise');
      input.emit([0xb0, 24, 40]); // Ring Mod level (coarse)
      expect(values()['panel.mixerSource']).toBe('ring');
      input.emit([0xb0, 25, 40]); // External level
      expect(values()['panel.mixerSource']).toBe('ext');
    });

    it('selects Osc 2 when an Osc 2 parameter arrives, and the PW source with it', async () => {
      const { controller, input } = setup();
      await controller.connect();
      input.emit([0xb0, 30, 70]); // Osc 2 coarse
      expect(values()['panel.oscSelect']).toBe('osc2');
      input.emit([0xb0, 72, 80]); // Osc 1 Mod Env PW amount
      expect(values()['panel.oscSelect']).toBe('osc1');
      expect(values()['panel.pwSource']).toBe('mod-env');
    });

    it('follows Env Select, including Amp+Mod when both envelopes move together', async () => {
      const { controller, input } = setup();
      await controller.connect();
      input.emit([0xb0, 102, 50]); // Mod Env attack
      expect(values()['panel.envSelect']).toBe('mod');
      input.emit([0xb0, 90, 60]); // Amp Env attack right after: both faders moved
      expect(values()['panel.envSelect']).toBe('both');
    });

    it('does not move switches when receiving is off', async () => {
      const { controller, input } = setup();
      await controller.connect();
      useMidiStore.setState({ receive: false });
      input.emit([0xb0, 24, 40]);
      expect(values()['panel.mixerSource']).toBe('noise');
    });
  });

  it('selects the parameter moved on the synth, but not performance inputs', async () => {
    const { controller, input } = setup();
    await controller.connect();
    input.emit([0xb0, 82, 70]); // Resonance
    expect(useSynthStore.getState().selectedId).toBe('filter.resonance');
    input.emit([0xb0, 1, 90]); // Mod wheel
    expect(useSynthStore.getState().selectedId).toBe('filter.resonance');
    expect(useSynthStore.getState().values['performance.modWheel']).toBe(90);
  });

  it('asks about unknown switch values and then uses what the user taught', async () => {
    const { controller, input } = setup();
    await controller.connect();
    input.emit([0xb0, 81, 62]);
    expect(useMidiStore.getState().unknownValues).toMatchObject([{ id: 'sub.octave', raw: 62 }]);
    useMidiStore.getState().learnValue('sub.octave', 62, '-2');
    expect(useMidiStore.getState().unknownValues).toEqual([]);
    input.emit([0xb0, 81, 62]);
    expect(useSynthStore.getState().values['sub.octave']).toBe('-2');
  });
});

describe('parseMidiSettings', () => {
  it('keeps valid taught values and drops malformed ones', () => {
    const parsed = parseMidiSettings({
      format: 1,
      learnedValues: { 'sub.octave': { '62': '-2', '999': '-1', x: '-1', '63': 5 }, bad: null },
    });
    expect(parsed?.learnedValues).toEqual({ 'sub.octave': { 62: '-2' } });
  });
});
