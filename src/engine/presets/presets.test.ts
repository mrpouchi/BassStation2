import { EXAMPLE_PRESETS } from '@/data/presets/examples';
import { defaultValues, getParameter, normalizeValue } from '@/engine/parameters/registry';
import {
  comparePresets,
  parseImportFile,
  parsePreset,
  patchValues,
  toExportFile,
  valuesForLoad,
} from './presets';

describe('preset model', () => {
  it('keeps only patch-scope parameters', () => {
    const v = patchValues({ ...defaultValues(), 'filter.resonance': 50 });
    expect(v['filter.resonance']).toBe(50);
    expect(v['panel.oscSelect']).toBeUndefined();
    expect(v['global.midiChannel']).toBeUndefined();
    expect(v['performance.modWheel']).toBeUndefined();
  });

  it('validates untrusted presets and reports rejected values', () => {
    const r = parsePreset({
      name: '  Test  ',
      category: 'nonsense',
      tags: ['A', 'a', 3],
      values: {
        'filter.resonance': 500,
        'osc1.waveform': 'wavetable',
        'global.midiChannel': 3,
        'bogus.x': 1,
      },
    });
    expect(r.preset?.name).toBe('Test');
    expect(r.preset?.category).toBe('other');
    expect(r.preset?.tags).toEqual(['a']);
    expect(r.preset?.values).toEqual({ 'filter.resonance': 127 });
    expect(r.rejected.sort()).toEqual(['bogus.x', 'global.midiChannel', 'osc1.waveform']);
    expect(parsePreset({ values: {} }).error).toMatch(/no name/);
    expect(parsePreset('x').preset).toBeNull();
  });

  it('round-trips through the export file format with fresh ids', () => {
    const file = toExportFile([EXAMPLE_PRESETS[0]!]);
    const result = parseImportFile(JSON.stringify(file));
    expect(result.errors).toEqual([]);
    expect(result.presets).toHaveLength(1);
    expect(result.presets[0]?.values).toEqual(EXAMPLE_PRESETS[0]?.values);
    expect(result.presets[0]?.id).not.toBe(EXAMPLE_PRESETS[0]?.id);
  });

  it('rejects foreign or broken files', () => {
    expect(parseImportFile('{').errors[0]).toMatch(/valid JSON/);
    expect(parseImportFile('{"format":"other","presets":[]}').errors[0]).toMatch(
      /not a Bass Station Academy/,
    );
    expect(
      parseImportFile(
        JSON.stringify({ format: 'bass-station-academy/presets', version: 99, presets: [] }),
      ).errors[0],
    ).toMatch(/Unsupported/);
  });

  it('loads a preset over the current state, keeping global settings', () => {
    const current = {
      ...defaultValues(),
      'global.midiChannel': 5,
      'filter.resonance': 99,
      'panel.oscSelect': 'osc2',
    };
    const loaded = valuesForLoad(current, { values: { 'filter.frequency': 10 } });
    expect(loaded['global.midiChannel']).toBe(5);
    expect(loaded['panel.oscSelect']).toBe('osc2');
    expect(loaded['filter.frequency']).toBe(10);
    expect(loaded['filter.resonance']).toBe(0); // missing patch values reset to Init
  });

  it('lists differences between two sounds', () => {
    const d = comparePresets({ 'filter.resonance': 10 }, { 'osc1.waveform': 'pulse' });
    expect(d.map((x) => x.id).sort()).toEqual(['filter.resonance', 'osc1.waveform']);
    expect(d.find((x) => x.id === 'osc1.waveform')).toMatchObject({ a: 'Sawtooth', b: 'Pulse' });
  });

  it('ships valid example presets', () => {
    for (const p of EXAMPLE_PRESETS) {
      for (const [id, v] of Object.entries(p.values)) {
        expect(getParameter(id).scope, `${p.id} ${id}`).toBe('patch');
        expect(normalizeValue(getParameter(id), v), `${p.id} ${id}`).toBe(v);
      }
    }
  });
});
