import { create } from 'zustand';

interface CurrentFormationState {
  currentFormationId: string | null;
  currentFormationName: string | null;
  setCurrentFormation: (id: string, name: string) => void;
  clearCurrentFormation: () => void;
}

// Tracks which saved formation (if any) is currently loaded on the board,
// so "Update current" knows what row to overwrite vs "Save as new" inserting fresh.
export const useCurrentFormationStore = create<CurrentFormationState>((set) => ({
  currentFormationId: null,
  currentFormationName: null,
  setCurrentFormation: (id, name) => set({ currentFormationId: id, currentFormationName: name }),
  clearCurrentFormation: () => set({ currentFormationId: null, currentFormationName: null }),
}));