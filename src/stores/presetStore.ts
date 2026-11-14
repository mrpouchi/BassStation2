import { create } from 'zustand';
import type { Preset } from '@/engine/presets/presets';

interface PresetState {
  presets: Preset[];
  loaded: boolean;
  setAll: (presets: Preset[]) => void;
  upsert: (preset: Preset) => void;
  remove: (id: string) => void;
}

/** In-memory mirror of saved presets; persistence is handled by presetRepository. */
export const usePresetStore = create<PresetState>()((set) => ({
  presets: [],
  loaded: false,
  setAll: (presets) => set({ presets, loaded: true }),
  upsert: (preset) =>
    set((s) => {
      const i = s.presets.findIndex((p) => p.id === preset.id);
      const presets = [...s.presets];
      if (i >= 0) presets[i] = preset;
      else presets.unshift(preset);
      return { presets };
    }),
  remove: (id) => set((s) => ({ presets: s.presets.filter((p) => p.id !== id) })),
}));
