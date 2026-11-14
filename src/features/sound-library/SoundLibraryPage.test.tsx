import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useRoutes } from 'react-router-dom';
import { routes } from '@/app/router';
import { loadPresets } from '@/services/presetRepository';
import { usePresetStore } from '@/stores/presetStore';
import { useSynthStore } from '@/stores/synthStore';

function AppRoutes() {
  return useRoutes(routes);
}
const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );

beforeEach(() => {
  useSynthStore.getState().resetToInit();
  usePresetStore.getState().setAll([]);
});

describe('Sound Library', () => {
  it('saves the current sound, persists it, and loads it back', async () => {
    const user = userEvent.setup();
    useSynthStore.getState().setValue('filter.resonance', 88);
    renderAt('/library');
    await user.click(screen.getByRole('button', { name: 'Save current sound' }));
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'My Squelch');
    await user.click(screen.getByRole('button', { name: 'Save preset' }));
    expect(await screen.findByText('Saved “My Squelch”.')).toBeInTheDocument();

    // Persisted to IndexedDB:
    usePresetStore.getState().setAll([]);
    await loadPresets();
    expect(usePresetStore.getState().presets.map((p) => p.name)).toContain('My Squelch');

    useSynthStore.getState().setValue('filter.resonance', 0);
    await user.click(screen.getByRole('button', { name: 'Load' }));
    expect(useSynthStore.getState().values['filter.resonance']).toBe(88);
    expect(useSynthStore.getState().lastChange?.origin).toBe('preset');
  });

  it('loads an example and compares it with the current settings', async () => {
    const user = userEvent.setup();
    renderAt('/library');
    await user.click(screen.getByRole('button', { name: /Squelch Line/ }));
    const compare = screen.getByRole('heading', { name: 'Compare' }).closest('section')!;
    expect(within(compare).getByText('Filter Type')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Load' }));
    expect(useSynthStore.getState().values['filter.type']).toBe('acid');
    expect(within(compare).getByText('The two sounds are identical.')).toBeInTheDocument();
  });

  it('imports a preset file and reports ignored values', async () => {
    const user = userEvent.setup();
    renderAt('/library');
    const file = new File(
      [
        JSON.stringify({
          format: 'bass-station-academy/presets',
          version: 1,
          presets: [{ name: 'Imported', values: { 'filter.resonance': 20, 'nope.x': 1 } }],
        }),
      ],
      'p.json',
      { type: 'application/json' },
    );
    await user.upload(screen.getByLabelText('Import presets file'), file);
    expect(await screen.findByText(/Imported 1 preset\. 1 unknown or invalid/)).toBeInTheDocument();
    expect(usePresetStore.getState().presets[0]?.name).toBe('Imported');
  });
});
