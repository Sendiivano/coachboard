import { create } from 'zustand';
import type { PitchPosition } from '../utils/formationLayout';

interface FormationState {
  positions: Record<string, PitchPosition>;
  setPosition: (playerId: string, position: PitchPosition) => void;
  setInitialPositions: (positions: Record<string, PitchPosition>) => void;
  removePosition: (playerId: string) => void;
}

// Holds in-memory (not yet persisted) player positions for the current session.
// Keyed by player_id — deliberately separate from the players table, since a
// player's roster identity is independent of where they sit in any given formation.
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
}));