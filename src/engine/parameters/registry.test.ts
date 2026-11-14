import { CURRICULUM } from '@/data/lessons/curriculum';
import { findConcept } from '@/data/synthesizer/concepts';
import { CONTROLS } from '@/data/synthesizer/controls';
import { ON_KEY_LAYOUT } from '@/data/synthesizer/onKeyLayout';
import { PARAMETERS } from '@/data/synthesizer/parameters';
import { SECTIONS } from '@/data/synthesizer/sections';
import type { ControlTarget } from './types';
import {
  allControlTargets,
  defaultValues,
  findParameter,
  formatValue,
  getParameter,
  normalizeValue,
  parametersOnKey,
  resolveControlTarget,
  sanitizeValues,
} from './registry';

describe('parameter registry integrity', () => {
  it('has unique, well-formed ids', () => {
    const ids = PARAMETERS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z][A-Za-z0-9]*\.[a-z][A-Za-z0-9]*$/);
  });

  it('uses known sections', () => {
    const known = new Set(SECTIONS.map((s) => s.id));
    for (const p of PARAMETERS) expect(known.has(p.section), p.id).toBe(true);
  });

  it('has valid ranges and defaults', () => {
    for (const p of PARAMETERS) {
      if (p.kind === 'continuous') {
        expect(p.min, p.id).toBeLessThan(p.max);
        expect(p.step, p.id).toBeGreaterThan(0);
        expect(normalizeValue(p, p.defaultValue), p.id).toBe(p.defaultValue);
      } else if (p.kind === 'enum') {
        const values = p.options.map((o) => o.value);
        expect(new Set(values).size, p.id).toBe(values.length);
        expect(values, p.id).toContain(p.defaultValue);
      }
    }
  });

  it('only references existing parameters and concepts', () => {
    for (const p of PARAMETERS) {
      for (const r of p.related) expect(findParameter(r), `${p.id} → ${r}`).toBeDefined();
      for (const c of p.concepts) expect(findConcept(c), `${p.id} → concept ${c}`).toBeDefined();
    }
  });

  it('never claims hardware-verified MIDI without a test session', () => {
    for (const p of PARAMETERS) {
      if (p.midi.mapping === null) expect(p.midi.verification, p.id).toBe('not-supported');
      else expect(p.midi.verification, p.id).toBe('requires-testing');
    }
  });

  it('has no conflicting CC numbers', () => {
    const seen = new Map<number, string>();
    for (const p of PARAMETERS) {
      const m = p.midi.mapping;
      if (m?.type !== 'cc') continue;
      for (const n of [m.cc, m.lsbCc].filter((x): x is number => x !== undefined)) {
        expect(seen.get(n), `CC ${n} used by ${seen.get(n)} and ${p.id}`).toBeUndefined();
        seen.set(n, p.id);
      }
    }
  });

  it('has no conflicting NRPNs except the documented LFO speed/sync ambiguity', () => {
    const seen = new Map<string, string[]>();
    for (const p of PARAMETERS) {
      const m = p.midi.mapping;
      if (m?.type !== 'nrpn') continue;
      const key = `${m.msb}:${m.lsb}`;
      seen.set(key, [...(seen.get(key) ?? []), p.id]);
    }
    const duplicates = [...seen.values()].filter((ids) => ids.length > 1);
    expect(duplicates).toEqual([
      ['lfo1.speedSync', 'lfo1.syncValue'],
      ['lfo2.speedSync', 'lfo2.syncValue'],
    ]);
  });

  it('matches Init Patch values from the manual (pp. 68–70)', () => {
    const d = defaultValues();
    expect(d).toMatchObject({
      'master.volume': 100,
      'osc1.waveform': 'sawtooth',
      'osc1.range': '8',
      'osc1.pwManual': 50,
      'sub.octave': '-1',
      'sub.wave': 'sine',
      'mixer.osc1': 255,
      'mixer.osc2': 0,
      'filter.type': 'classic',
      'filter.slope': '24',
      'filter.shape': 'lp',
      'filter.frequency': 255,
      'lfo1.speed': 75,
      'lfo2.speed': 52,
      'lfo1.waveform': 'triangle',
      'lfo1.keySync': false,
      'lfo2.keySync': true,
      'ampEnv.sustain': 127,
      'ampEnv.triggering': 'multi',
      'arp.rhythm': 32,
      'arp.mode': 'up',
      'arp.octaves': 1,
      'arp.swing': 50,
      'arp.seqRetrig': true,
      'modWheel.lfo1ToOscPitch': 10,
      'aftertouch.filterFreq': 10,
      'voice.bendRange': 12,
      'global.midiChannel': 1,
      'global.local': true,
    });
  });
});

describe('control inventory', () => {
  it('has unique ids', () => {
    const ids = CONTROLS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('covers every hardware overview callout 1–49', () => {
    const callouts = new Set(CONTROLS.map((c) => c.callout).filter((n) => n !== undefined));
    for (let n = 1; n <= 49; n++) expect(callouts.has(n), `callout ${n}`).toBe(true);
  });

  it('routes only to existing parameters, covering every selector option', () => {
    const check = (t: ControlTarget | null, controlId: string) => {
      if (t === null || 'action' in t || 'param' in t || 'params' in t) return;
      const selector = getParameter(t.via);
      expect(selector.kind, `${controlId}: ${t.via}`).toBe('enum');
      if (selector.kind === 'enum') {
        expect(Object.keys(t.routes).sort(), controlId).toEqual(
          selector.options.map((o) => o.value).sort(),
        );
      }
      Object.values(t.routes).forEach((r) => check(r, controlId));
    };
    for (const c of CONTROLS) {
      for (const id of allControlTargets(c.target))
        expect(findParameter(id), `${c.id} → ${id}`).toBeDefined();
      check(c.target, c.id);
    }
  });

  it('gives every function-modifier parameter a Function target on its control', () => {
    for (const p of PARAMETERS) {
      if (p.access.kind !== 'function-modifier') continue;
      const controlId = p.access.controlId;
      const control = CONTROLS.find((c) => c.id === controlId);
      expect(control?.functionTarget && allControlTargets(control.functionTarget), p.id).toContain(
        p.id,
      );
    }
  });

  it('makes every panel parameter reachable from a physical control', () => {
    const reachable = new Set(CONTROLS.flatMap((c) => allControlTargets(c.target)));
    const panel = PARAMETERS.filter((p) => p.access.kind === 'panel');
    const unreachable = panel.filter((p) => !reachable.has(p.id)).map((p) => p.id);
    // Patch number is changed by the Patch/Value buttons (actions); aftertouch and
    // sustain are physical inputs without a panel control of their own.
    expect(unreachable.sort()).toEqual([
      'master.patch',
      'performance.aftertouch',
      'performance.octave',
      'performance.sustain',
    ]);
  });
});

describe('On-Key functions', () => {
  it('lays out all 25 keys once', () => {
    expect(ON_KEY_LAYOUT).toHaveLength(25);
    expect(new Set(ON_KEY_LAYOUT.map((k) => k.key)).size).toBe(25);
  });

  it('gives every key at least one parameter or action, without press-count clashes', () => {
    for (const entry of ON_KEY_LAYOUT) {
      const params = parametersOnKey(entry.key);
      expect(params.length > 0 || entry.action !== undefined, entry.key).toBe(true);
      const presses = params.map((p) => (p.access.kind === 'on-key' ? p.access.presses : 0));
      expect(new Set(presses).size, entry.key).toBe(presses.length);
    }
  });
});

describe('curriculum', () => {
  it('references existing parameters only', () => {
    for (const lesson of CURRICULUM.flatMap((c) => c.lessons)) {
      for (const id of lesson.parameters)
        expect(findParameter(id), `${lesson.id} → ${id}`).toBeDefined();
    }
  });
});

describe('value handling', () => {
  it('clamps and snaps continuous values', () => {
    const coarse = getParameter('osc1.coarse');
    expect(normalizeValue(coarse, 99)).toBe(12);
    expect(normalizeValue(coarse, 3.14159)).toBe(3.1);
    expect(normalizeValue(coarse, Number.NaN)).toBeUndefined();
    expect(normalizeValue(coarse, '3')).toBeUndefined();
  });

  it('validates enums and toggles', () => {
    expect(normalizeValue(getParameter('osc1.waveform'), 'pulse')).toBe('pulse');
    expect(normalizeValue(getParameter('osc1.waveform'), 'wavetable')).toBeUndefined();
    expect(normalizeValue(getParameter('voice.oscSync'), 1)).toBeUndefined();
  });

  it('sanitizes untrusted value maps', () => {
    const { values, rejected } = sanitizeValues({
      'filter.frequency': 300,
      'bogus.param': 1,
      'osc1.waveform': 'x',
    });
    expect(values['filter.frequency']).toBe(255);
    expect(values['osc1.waveform']).toBe('sawtooth');
    expect(rejected.sort()).toEqual(['bogus.param', 'osc1.waveform']);
    expect(sanitizeValues(null).rejected).toEqual(['<root>']);
  });

  it('formats values for display', () => {
    expect(formatValue(getParameter('osc2.coarse'), 7)).toBe('+7.0 st');
    expect(formatValue(getParameter('osc2.coarse'), -7)).toBe('−7.0 st');
    expect(formatValue(getParameter('osc1.range'), '16')).toBe("16'");
    expect(formatValue(getParameter('portamento.glideTime'), 0)).toBe('Off');
    expect(formatValue(getParameter('ampEnv.retrigger'), true)).toBe('r-1');
    expect(formatValue(getParameter('voice.oscSync'), false)).toBe('Off');
  });
});

describe('control routing', () => {
  const base = defaultValues();
  const control = (id: string) => {
    const c = CONTROLS.find((x) => x.id === id);
    if (!c) throw new Error(`missing control ${id}`);
    return c.target;
  };

  it('follows the Osc Select switch', () => {
    expect(resolveControlTarget(control('osc.coarse'), base)).toEqual(['osc1.coarse']);
    expect(
      resolveControlTarget(control('osc.coarse'), { ...base, 'panel.oscSelect': 'osc2' }),
    ).toEqual(['osc2.coarse']);
  });

  it('follows Osc Select and PW source together', () => {
    const v = { ...base, 'panel.oscSelect': 'osc2', 'panel.pwSource': 'lfo2' };
    expect(resolveControlTarget(control('osc.pulseWidth'), v)).toEqual(['osc2.pwLfo2']);
  });

  it('edits both envelopes with Env Select on Amp+Mod', () => {
    expect(
      resolveControlTarget(control('env.attack'), { ...base, 'panel.envSelect': 'both' }),
    ).toEqual(['ampEnv.attack', 'modEnv.attack']);
  });

  it('routes the LFO knob through Delay/Speed and Speed/Sync', () => {
    expect(resolveControlTarget(control('lfo1.knob'), base)).toEqual(['lfo1.speed']);
    expect(
      resolveControlTarget(control('lfo1.knob'), { ...base, 'lfo1.speedSync': 'sync' }),
    ).toEqual(['lfo1.syncValue']);
    expect(
      resolveControlTarget(control('lfo1.knob'), { ...base, 'panel.lfoDelaySpeed': 'delay' }),
    ).toEqual(['lfo1.delay']);
  });

  it('turns Arp Octaves into SEQ in Record/Play', () => {
    expect(resolveControlTarget(control('arp.octaves'), base)).toEqual(['arp.octaves']);
    expect(resolveControlTarget(control('arp.octaves'), { ...base, 'arp.mode': 'play' })).toEqual([
      'arp.sequence',
    ]);
  });
});
