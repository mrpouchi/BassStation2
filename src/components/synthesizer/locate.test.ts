import { CONTROLS } from '@/data/synthesizer/controls';
import { PARAMETERS } from '@/data/synthesizer/parameters';
import { locateParameter } from './locate';
import { CONTROL_POSITIONS } from './panelMap';

const ids = (points: { controlId: string }[]) => points.map((p) => p.controlId);

describe('locateParameter', () => {
  it('has a panel position for every physical control', () => {
    expect(CONTROLS.map((c) => c.id).filter((id) => !CONTROL_POSITIONS[id])).toEqual([]);
  });

  it('finds shared controls and the switch to set first', () => {
    const loc = locateParameter('osc2.coarse');
    expect(ids(loc.controls)).toEqual(['osc.coarse']);
    expect(ids(loc.selectors)).toEqual(['osc.select']);
    expect(loc.steps[0]).toBe('Set Osc Select to Osc 2.');

    const sustain = locateParameter('modEnv.sustain');
    expect(ids(sustain.controls)).toEqual(['env.sustain']);
    expect(ids(sustain.selectors)).toEqual(['env.select']);
  });

  it('points to the big knob for the filter cutoff, with nothing to set first', () => {
    const loc = locateParameter('filter.frequency');
    expect(ids(loc.controls)).toEqual(['filter.frequency']);
    expect(loc.selectors).toEqual([]);
    expect(loc.needsFunction).toBe(false);
  });

  it('shows Function + key for On-Key functions and Function + knob for extended tuning', () => {
    const onKey = PARAMETERS.find((p) => p.access.kind === 'on-key')!;
    const loc = locateParameter(onKey.id);
    expect(loc.needsFunction).toBe(true);
    expect(loc.key).not.toBeNull();

    const sub = locateParameter('sub.coarse');
    expect(sub.needsFunction).toBe(true);
    expect(ids(sub.controls)).toEqual(['osc.coarse']);
  });

  it('explains every parameter in at least one step', () => {
    expect(PARAMETERS.filter((p) => locateParameter(p.id).steps.length === 0)).toEqual([]);
  });
});
