import { create } from 'zustand';

export type PersistenceStatus = 'loading' | 'ready' | 'unavailable';

interface PersistenceState {
  status: PersistenceStatus;
  error: string | null;
  setStatus: (status: PersistenceStatus, error?: string | null) => void;
}

export const usePersistenceStore = create<PersistenceState>()((set) => ({
  status: 'loading',
  error: null,
  setStatus: (status, error = null) => set({ status, error }),
}));
