import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useRoutes } from 'react-router-dom';
import { routes } from '@/app/router';
import { importSong, loadSongs } from '@/services/songRepository';
import { useSongStore } from '@/stores/songStore';
import { conductor, name, smf, track } from '@/test/smf';

function AppRoutes() {
  return useRoutes(routes);
}
const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );

const tune = () =>
  smf([
    conductor(120),
    track([
      [0, ...name('Piano')],
      [0, 0x90, 64, 90],
      [960, 0x80, 64, 0],
    ]),
    track([
      [0, ...name('Bass')],
      [0, 0x91, 40, 100],
      [480, 0x81, 40, 0],
      [0, 0x91, 43, 100],
      [480, 0x81, 43, 0],
    ]),
  ]);

beforeEach(() => useSongStore.getState().setAll([]));

describe('Play Along', () => {
  it('imports a MIDI file, keeps it in IndexedDB and shows its bass line', async () => {
    const user = userEvent.setup();
    renderAt('/play-along');
    expect(screen.getByText('No songs yet')).toBeInTheDocument();

    const file = new File([tune()], 'My Tune.mid', { type: 'audio/midi' });
    await user.upload(screen.getByLabelText('Import MIDI files'), file);

    expect(await screen.findByRole('heading', { name: 'My Tune' })).toBeInTheDocument();
    expect(screen.getByText(/2 notes in “Bass”/)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Piano roll/ })).toBeInTheDocument();
    expect(screen.getByText(/No synth connected/)).toBeInTheDocument();

    useSongStore.getState().setAll([]);
    await loadSongs();
    expect(useSongStore.getState().songs.map((s) => s.song.title)).toContain('My Tune');
  });

  it('rejects files that are not valid MIDI', async () => {
    const result = await importSong('broken.mid', new TextEncoder().encode('nope').buffer);
    expect(result.ok).toBe(false);
    expect(useSongStore.getState().songs).toEqual([]);
  });

  it('switches to "You play" and shows the score card', async () => {
    const user = userEvent.setup();
    await importSong('My Tune.mid', tune().buffer as ArrayBuffer);
    renderAt('/play-along');
    await user.click(screen.getByRole('radio', { name: 'You play' }));
    expect(screen.getByRole('heading', { name: 'Your take' })).toBeInTheDocument();
    expect(screen.getByText(/Connect your synth to be graded/)).toBeInTheDocument();
  });
});
