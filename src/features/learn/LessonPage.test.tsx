import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useRoutes } from 'react-router-dom';
import { routes } from '@/app/router';
import { parseProgress, serializeProgress, useProgressStore } from '@/stores/progressStore';
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
  useProgressStore.getState().reset();
});

describe('lesson player', () => {
  it('validates a "set" exercise against live state and records completion', async () => {
    const user = userEvent.setup();
    renderAt('/learn/filters/resonance');
    expect(screen.getByRole('heading', { level: 1, name: 'Resonance' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Check' }));
    expect(screen.getByRole('status', { name: 'Exercise feedback' })).toHaveTextContent(
      '0 of 2 targets met',
    );
    expect(useProgressStore.getState().lessons['filters/resonance']).toBeUndefined();

    useSynthStore.getState().setValue('filter.resonance', 100);
    useSynthStore.getState().setValue('filter.frequency', 150);
    await user.click(screen.getByRole('button', { name: 'Check' }));
    expect(screen.getByRole('status', { name: 'Exercise feedback' })).toHaveTextContent(
      'Every target is met',
    );
    expect(useProgressStore.getState().lessons['filters/resonance']).toBeDefined();
  });

  it('gives per-option feedback on multiple choice', async () => {
    const user = userEvent.setup();
    renderAt('/learn/sound-fundamentals/frequency');
    const group = screen.getByRole('radiogroup', { name: /A3 at 8′ is 440 Hz/ });
    await user.click(within(group).getByRole('radio', { name: '660 Hz' }));
    await user.click(screen.getByRole('button', { name: 'Check' }));
    expect(screen.getByRole('status', { name: 'Exercise feedback' })).toHaveTextContent(
      'perfect fifth',
    );
    await user.click(within(group).getByRole('radio', { name: '880 Hz' }));
    await user.click(screen.getByRole('button', { name: 'Check' }));
    expect(screen.getByRole('status', { name: 'Exercise feedback' })).toHaveTextContent('Correct');
  });

  it('demonstration does not change the live state', () => {
    renderAt('/learn/oscillators/pulse');
    expect(useSynthStore.getState().values['osc1.waveform']).toBe('sawtooth');
  });

  it('loads a lesson starting point on request', async () => {
    const user = userEvent.setup();
    renderAt('/learn/oscillators/pulse');
    await user.click(screen.getByRole('button', { name: 'Load lesson starting point' }));
    expect(useSynthStore.getState().values['osc1.waveform']).toBe('pulse');
  });

  it('shows an honest error for unknown lessons', () => {
    renderAt('/learn/nope/nothing');
    expect(screen.getByText('Lesson not found')).toBeInTheDocument();
  });
});

describe('progress persistence format', () => {
  it('round-trips and rejects invalid entries', () => {
    useProgressStore.getState().completeLesson('filters/cutoff');
    useProgressStore.getState().recordChallenge('c1', false);
    const raw = serializeProgress(useProgressStore.getState());
    const parsed = parseProgress(JSON.parse(JSON.stringify(raw)));
    expect(parsed?.lessons['filters/cutoff']).toBeDefined();
    expect(parsed?.challenges.c1?.attempts).toBe(1);
    expect(parseProgress({ format: 2 })).toBeNull();
    expect(
      parseProgress({
        format: 1,
        lessons: { x: { completedAt: 'no' } },
        activity: [{ kind: 'bad' }],
      }),
    ).toEqual({
      lessons: {},
      challenges: {},
      activity: [],
      lastLesson: null,
    });
  });
});
