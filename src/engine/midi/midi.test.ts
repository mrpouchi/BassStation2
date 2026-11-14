import { getParameter } from '@/engine/parameters/registry';
import { MidiInputHandler } from './MidiInputHandler';
import { MidiOutputHandler } from './MidiOutputHandler';
import { codecFor, encodeMessages, joinPair, splitPair } from './MidiParameterMapper';
import { isBassStation } from './MidiDeviceManager';
import { effectiveVerification } from './verification';

describe('MidiParameterMapper', () => {
  it('uses the documented Osc Range values (p. 71)', () => {
    const codec = codecFor(getParameter('osc1.range'));
    expect(codec?.basis).toBe('documented');
    expect(codec?.encode('16')).toBe(63);
    expect(codec?.encode('2')).toBe(66);
    expect(codec?.decode(64)).toBe('8');
  });

  it('orders Sub Osc Octave as the manual lists it (-2, -1)', () => {
    const codec = codecFor(getParameter('sub.octave'));
    expect(codec?.decode(0)).toBe('-2');
    expect(codec?.decode(1)).toBe('-1');
    expect(codec?.encode('-1')).toBe(1);
  });

  it('reads envelope triggering as Multi, Single, Autoglide (inferred from hardware report)', () => {
    for (const id of ['ampEnv.triggering', 'modEnv.triggering']) {
      const codec = codecFor(getParameter(id));
      expect(codec?.basis).toBe('inferred');
      expect([0, 1, 2].map((r) => codec?.decode(r))).toEqual(['multi', 'single', 'autoglide']);
    }
  });

  it('round-trips every mapped parameter through its codec', () => {
    for (const id of [
      'filter.resonance',
      'filter.frequency',
      'filter.modEnvDepth',
      'osc1.coarse',
      'osc1.fine',
      'arp.rhythm',
      'voice.oscSync',
      'filter.shape',
      'filter.tracking',
      'osc1.pwLfo2',
    ]) {
      const def = getParameter(id);
      const codec = codecFor(def);
      expect(codec, id).not.toBeNull();
      const sample =
        def.kind === 'continuous'
          ? def.max
          : def.kind === 'enum'
            ? (def.options[1]?.value ?? def.defaultValue)
            : true;
      expect(codec?.decode(codec.encode(sample)), id).toEqual(sample);
    }
  });

  it('marks undocumented encodings as inferred', () => {
    expect(codecFor(getParameter('filter.modEnvDepth'))?.basis).toBe('inferred');
    expect(codecFor(getParameter('filter.resonance'))?.basis).toBe('documented');
  });

  it('splits and joins 8-bit CC pairs', () => {
    for (const v of [0, 1, 128, 254, 255]) {
      const [msb, lsb] = splitPair(v);
      expect(joinPair(msb, lsb)).toBe(v);
    }
  });

  it('builds CC, CC-pair and NRPN messages on the right channel', () => {
    expect(encodeMessages(getParameter('filter.resonance'), 100, 1)).toEqual([[0xb0, 82, 100]]);
    expect(encodeMessages(getParameter('filter.frequency'), 255, 2)).toEqual([
      [0xb1, 16, 127],
      [0xb1, 48, 64],
    ]);
    expect(encodeMessages(getParameter('voice.paraphonic'), true, 1)).toEqual([
      [0xb0, 99, 0],
      [0xb0, 98, 107],
      [0xb0, 6, 1],
    ]);
    expect(encodeMessages(getParameter('panel.oscSelect'), 'osc2', 1)).toEqual([]);
  });
});

describe('MidiInputHandler', () => {
  it('maps CCs, CC pairs and NRPNs to parameters', () => {
    const h = new MidiInputHandler(1);
    expect(h.handle([0xb0, 82, 90])).toEqual([
      { kind: 'parameter', id: 'filter.resonance', value: 90, raw: 90 },
    ]);
    expect(h.handle([0xb0, 16, 127])).toEqual([
      { kind: 'parameter', id: 'filter.frequency', value: 254, raw: 254 },
    ]);
    expect(h.handle([0xb0, 48, 64])).toEqual([
      { kind: 'parameter', id: 'filter.frequency', value: 255, raw: 255 },
    ]);
    expect(h.handle([0xb0, 99, 0])).toEqual([]);
    expect(h.handle([0xb0, 98, 107])).toEqual([]);
    expect(h.handle([0xb0, 6, 1])).toEqual([
      { kind: 'parameter', id: 'voice.paraphonic', value: true, raw: 1 },
    ]);
  });

  it('reports switch values no codec knows, so the user can teach them', () => {
    const h = new MidiInputHandler(1);
    expect(h.handle([0xb0, 81, 62])).toEqual([{ kind: 'undecoded', id: 'sub.octave', raw: 62 }]);
    expect(h.handle([0xb0, 81, 1])).toEqual([
      { kind: 'parameter', id: 'sub.octave', value: '-1', raw: 1 },
    ]);
  });

  it('ignores other channels and reads notes, bends and program changes', () => {
    const h = new MidiInputHandler(1);
    expect(h.handle([0xb1, 82, 90])).toEqual([]);
    expect(h.handle([0x90, 60, 100])).toEqual([
      { kind: 'note', on: true, note: 60, velocity: 100 },
    ]);
    expect(h.handle([0xe0, 0, 64])).toEqual([
      { kind: 'parameter', id: 'performance.pitchWheel', value: 0 },
    ]);
    expect(h.handle([0xc0, 12])).toEqual([{ kind: 'program', program: 12 }]);
  });
});

describe('MidiOutputHandler', () => {
  it('coalesces rapid changes and sends only the final value', () => {
    const sent: number[][] = [];
    let flush: () => void = () => {};
    const out = new MidiOutputHandler({ send: (b) => sent.push([...b]) }, 1, (fn) => (flush = fn));
    out.queue('filter.resonance', 10);
    out.queue('filter.resonance', 50);
    out.queue('filter.resonance', 90);
    expect(sent).toEqual([]);
    flush();
    expect(sent).toEqual([[0xb0, 82, 90]]);
    expect(out.queue('panel.oscSelect', 'osc2')).toBe(false);
  });
});

describe('device helpers', () => {
  it('recognises Bass Station II port names', () => {
    expect(isBassStation('Bass Station II')).toBe(true);
    expect(isBassStation('Bass Station II MIDI 1')).toBe(true);
    expect(isBassStation('IAC Driver Bus 1')).toBe(false);
  });

  it('combines registry and local verification', () => {
    const def = getParameter('filter.resonance');
    expect(effectiveVerification(def, undefined)).toEqual({
      status: 'requires-testing',
      local: false,
    });
    expect(effectiveVerification(def, { input: 'pass', at: 1 })).toEqual({
      status: 'input-verified',
      local: true,
    });
    expect(effectiveVerification(def, { input: 'pass', output: 'pass', at: 1 }).status).toBe(
      'both-verified',
    );
    expect(effectiveVerification(getParameter('panel.oscSelect'), undefined).status).toBe(
      'not-supported',
    );
  });
});
