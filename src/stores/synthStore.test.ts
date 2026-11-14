import { defaultValues } from '@/engine/parameters/registry';
import { useSynthStore } from './synthStore';

beforeEach(() => useSynthStore.getState().resetToInit());

describe('synth store', () => {
  it('starts from the Init Patch', () => {
    expect(useSynthStore.getState().values).toEqual(defaultValues());
  });

  it('normalizes values and records the change origin', () => {
    const { setValue } = useSynthStore.getState();
    expect(setValue('filter.resonance', 200, 'midi')).toBe(true);
    const s = useSynthStore.getState();
    expect(s.values['filter.resonance']).toBe(127);
    expect(s.lastChange).toEqual({ id: 'filter.resonance', origin: 'midi' });
  });

  it('rejects unknown parameters and invalid values without changing state', () => {
    const before = useSynthStore.getState().values;
    expect(useSynthStore.getState().setValue('nope.nope', 1)).toBe(false);
    expect(useSynthStore.getState().setValue('osc1.waveform', 'noise')).toBe(false);
    expect(useSynthStore.getState().values).toBe(before);
  });

  it('only selects known parameters', () => {
    useSynthStore.getState().select('filter.frequency');
    expect(useSynthStore.getState().selectedId).toBe('filter.frequency');
    useSynthStore.getState().select('invalid.id');
    expect(useSynthStore.getState().selectedId).toBeNull();
  });
});
