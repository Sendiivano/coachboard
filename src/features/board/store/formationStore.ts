import { create } from 'zustand';
import type { PitchPosition } from '../utils/formationLayout';

interface FormationState {
  positions: Record<string, PitchPosition>;
  setPosition: (playerId: string, position: PitchPosition) => void;
  setInitialPositions: (positions: Record<string, PitchPosition>) => void;
  removePosition: (playerId: string) => void;
  replaceAll: (positions: Record<string, PitchPosition>) => void;
}

export const useFormationStore = create<FormationState>((set) => ({
  positions: {},
  setPosition: (playerId, position) =>
    set((state) => ({ positions: { ...state.positions, [playerId]: position } })),
  setInitialPositions: (positions) =>
    set((state) => ({ positions: { ...positions, ...state.positions } })),
  removePosition: (playerId) =>
    set((state) => {
      const next = { ...state.positions };
      delete next[playerId];
      return { positions: next };
    }),
  // Full replace used only by undo/redo to restore an exact prior snapshot.
  replaceAll: (positions) => set({ positions }),
}));