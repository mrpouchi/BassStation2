import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useRoutes } from 'react-router-dom';
import { routes } from '@/app/router';
import { useHardwareUiStore } from '@/stores/hardwareUiStore';
import { useProgressStore } from '@/stores/progressStore';
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
const feedback = () => screen.getByRole('status', { name: 'Exercise feedback' });

beforeEach(() => {
  useSynthStore.getState().resetToInit();
  useSynthStore.getState().select(null);
  useProgressStore.getState().reset();
  useHardwareUiStore.setState({ functionActive: false, onKey: null });
});

describe('challenges', () => {
  it('identification: clicking the right panel control solves it', async () => {
    const user = userEvent.setup();
    renderAt('/challenges/find-cutoff');
    await user.click(screen.getByRole('button', { name: 'Check' }));
    expect(feedback()).toHaveTextContent('Click a control');
    screen.getByRole('slider', { name: 'Resonance — Resonance' }).focus();
    await user.click(screen.getByRole('button', { name: 'Check' }));
    expect(feedback()).toHaveTextContent('not the one');
    screen.getByRole('slider', { name: 'Frequency — Frequency' }).focus();
    await user.click(screen.getByRole('button', { name: 'Check' }));
    expect(feedback()).toHaveTextContent('Correct');
    expect(useProgressStore.getState().challenges['find-cutoff']?.attempts).toBe(3);
    expect(screen.getByText(/most expressive move/)).toBeInTheDocument();
  });

  it('troubleshooting: loads the broken patch and hides targets until checked', async () => {
    const user = userEvent.setup();
    renderAt('/challenges/no-sound');
    await user.click(screen.getByRole('button', { name: 'Load the challenge patch' }));
    expect(useSynthStore.getState().values['mixer.osc1']).toBe(0);
    expect(screen.queryByRole('list', { name: 'Targets' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Check' }));
    expect(screen.getByText(/Look at the Mixer/)).toBeInTheDocument();
    useSynthStore.getState().setValue('mixer.osc1', 200);
    await user.click(screen.getByRole('button', { name: 'Check' }));
    expect(feedback()).toHaveTextContent('Every target is met');
  });

  it('lists challenges and their status', async () => {
    useProgressStore.getState().recordChallenge('why-saw', true);
    renderAt('/challenges');
    expect(screen.getByText('1 of 18 solved')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Troubleshooting' })).toBeInTheDocument();
  });
});
