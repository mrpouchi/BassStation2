import { create } from 'zustand';
import type { OnKeyName } from '@/engine/parameters/types';

/**
 * Transient UI state of the virtual panel (not saved in patches):
 * Function/On-Key mode, Transpose mode, last touched parameter for the LED
 * display, and the most recently played key for the visualisers.
 */
interface HardwareUiState {
  functionActive: boolean;
  onKey: { key: OnKeyName; presses: number } | null;
  transposeArmed: boolean;
  touched: { id: string; at: number } | null;
  /** MIDI note of the most recently played virtual key. */
  playedNote: number | null;
  heldKey: number | null;
  /** performance.now() of the last key press, so repeated notes are distinguishable. */
  playedAt: number;

  toggleFunction: () => void;
  exitFunction: () => void;
  selectOnKey: (key: OnKeyName, availablePresses: number) => number;
  toggleTranspose: () => void;
  touch: (id: string) => void;
  pressKey: (keyIndex: number, midi: number) => void;
  releaseKey: () => void;
}

export const useHardwareUiStore = create<HardwareUiState>()((set, get) => ({
  functionActive: false,
  onKey: null,
  transposeArmed: false,
  touched: null,
  playedNote: null,
  heldKey: null,
  playedAt: 0,

  toggleFunction: () =>
    set((s) => ({ functionActive: !s.functionActive, onKey: null, transposeArmed: false })),
  exitFunction: () => set({ functionActive: false, onKey: null }),

  /** Repeated presses of the same key cycle through its extended functions (p. 56). */
  selectOnKey: (key, availablePresses) => {
    const current = get().onKey;
    const presses =
      current?.key === key && availablePresses > 0 ? (current.presses % availablePresses) + 1 : 1;
    set({ onKey: { key, presses } });
    return presses;
  },

  toggleTranspose: () =>
    set((s) => ({ transposeArmed: !s.transposeArmed, functionActive: false, onKey: null })),
  touch: (id) => set({ touched: { id, at: Date.now() } }),
  pressKey: (keyIndex, midi) =>
    set({ heldKey: keyIndex, playedNote: midi, playedAt: performance.now() }),
  releaseKey: () => set({ heldKey: null }),
}));
