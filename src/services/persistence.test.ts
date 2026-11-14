import { usePreferencesStore } from '@/stores/preferencesStore';
import { usePersistenceStore } from '@/stores/persistenceStore';
import { useSynthStore } from '@/stores/synthStore';
import { initPersistence } from './persistence';
import { readKey, writeKey } from './storage/db';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe('persistence', () => {
  it('restores valid saved state, drops invalid entries, and saves changes', async () => {
    await writeKey('preferences', 'theme', 'dark');
    await writeKey('session', 'panel', {
      format: 1,
      values: { 'filter.frequency': 42, 'osc1.waveform': 'not-a-wave' },
    });

    await initPersistence();

    expect(usePersistenceStore.getState().status).toBe('ready');
    expect(usePreferencesStore.getState().theme).toBe('dark');
    expect(useSynthStore.getState().values['filter.frequency']).toBe(42);
    expect(useSynthStore.getState().values['osc1.waveform']).toBe('sawtooth');

    useSynthStore.getState().setValue('filter.resonance', 64);
    usePreferencesStore.getState().setTheme('light');
    await wait(500);

    expect(await readKey('preferences', 'theme')).toBe('light');
    const saved = (await readKey('session', 'panel')) as { values: Record<string, unknown> };
    expect(saved.values['filter.resonance']).toBe(64);
  });
});
