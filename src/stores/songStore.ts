import { create } from 'zustand';
import type { Song } from '@/engine/songs/midiFile';

export interface StoredSong {
  readonly id: string;
  readonly fileName: string;
  readonly addedAt: number;
  readonly size: number;
  readonly song: Song;
}

interface SongState {
  songs: StoredSong[];
  loaded: boolean;
  setAll: (songs: StoredSong[]) => void;
  add: (song: StoredSong) => void;
  remove: (id: string) => void;
}

/** In-memory list of imported MIDI files; persistence is handled by songRepository. */
export const useSongStore = create<SongState>()((set) => ({
  songs: [],
  loaded: false,
  setAll: (songs) => set({ songs, loaded: true }),
  add: (song) => set((s) => ({ songs: [...s.songs.filter((x) => x.id !== song.id), song] })),
  remove: (id) => set((s) => ({ songs: s.songs.filter((x) => x.id !== id) })),
}));
