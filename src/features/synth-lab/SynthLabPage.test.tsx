import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useRoutes } from 'react-router-dom';
import { routes } from '@/app/router';
import { useSynthStore } from '@/stores/synthStore';

function AppRoutes() {
  return useRoutes(routes);
}

/** MemoryRouter + useRoutes avoids the jsdom/undici AbortSignal clash of data routers. */
function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  useSynthStore.getState().resetToInit();
  useSynthStore.getState().select(null);
});

describe('Synth Lab reference', () => {
  it('opens a parameter in the inspector and edits the shared state', async () => {
    const user = userEvent.setup();
    renderAt('/synth-lab');

    await user.click(screen.getByRole('button', { name: /^Resonance/ }));
    const inspector = screen.getByRole('complementary', { name: 'Parameter inspector' });
    expect(within(inspector).getByRole('heading', { name: 'Resonance' })).toBeInTheDocument();
    expect(within(inspector).getByText('CC 82')).toBeInTheDocument();
    expect(within(inspector).getByText('Documented, untested')).toBeInTheDocument();

    const slider = within(inspector).getByRole('slider', { name: 'Resonance' });
    // jsdom does not move range inputs on arrow keys, so dispatch the change directly.
    fireEvent.change(slider, { target: { value: '90' } });
    expect(useSynthStore.getState().values['filter.resonance']).toBe(90);
    expect(within(inspector).getByText('90', { selector: 'output' })).toBeInTheDocument();
  });

  it('shows live routing of shared panel controls', async () => {
    renderAt('/synth-lab?view=controls');
    const coarseRow = screen.getByRole('button', { name: /Coarse.*Osc 1 Coarse/ });
    expect(coarseRow).toBeInTheDocument();

    useSynthStore.getState().setValue('panel.oscSelect', 'osc2');
    expect(await screen.findByRole('button', { name: /Coarse.*Osc 2 Coarse/ })).toBeInTheDocument();
  });

  it('lists On-Key functions including multi-press functions', () => {
    renderAt('/synth-lab?view=on-key');
    expect(screen.getByRole('button', { name: /^Pitch Bend Range/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /2× Oscillator Error/ })).toBeInTheDocument();
  });
});

describe('navigation', () => {
  it('renders every main section', async () => {
    const user = userEvent.setup();
    renderAt('/');
    expect(
      screen.getByRole('heading', { name: 'Welcome to Bass Station Academy' }),
    ).toBeInTheDocument();
    const nav = screen.getByRole('navigation', { name: 'Main' });
    for (const [link, heading] of [
      ['Learn', 'Curriculum'],
      ['Challenges', 'Practice by doing'],
      ['Sound Library', 'Your presets'],
      ['Synth Lab', 'Bass Station II reference'],
    ] as const) {
      await user.click(within(nav).getByRole('link', { name: link }));
      expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
    }
  });
});
