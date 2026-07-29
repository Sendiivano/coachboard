import { create } from 'zustand';
import { useFormationStore } from './formationStore';
import { useOppositionStore, type OppositionMarker } from './oppositionStore';
import { useDrawingStore } from './drawingStore';
import type { PitchPosition } from '../utils/formationLayout';
import type { DrawingElement } from '../types/drawing.types';

export interface BoardSnapshot {
  formationPositions: Record<string, PitchPosition>;
  oppositionMarkers: OppositionMarker[];
  drawingElements: DrawingElement[];
}

const MAX_HISTORY = 20;

function captureSnapshot(): BoardSnapshot {
  return {
    formationPositions: useFormationStore.getState().positions,
    oppositionMarkers: useOppositionStore.getState().markers,
    drawingElements: useDrawingStore.getState().elements,
  };
}

function applySnapshot(snapshot: BoardSnapshot) {
  useFormationStore.getState().replaceAll(snapshot.formationPositions);
  useOppositionStore.getState().replaceAll(snapshot.oppositionMarkers);
  useDrawingStore.getState().replaceAll(snapshot.drawingElements);
}

interface HistoryState {
  past: BoardSnapshot[];
  future: BoardSnapshot[];
  canUndo: boolean;
  canRedo: boolean;
  recordSnapshot: () => void;
  undo: () => void;
  redo: () => void;
}

// Cross-store undo/redo. Captures formation + opposition + drawing state
// together as one snapshot per action. Deliberately excludes boardStore —
// zoom/pan is camera state, not board content; undo shouldn't move your view.
export const useHistoryStore = create<HistoryState>((set, get) => ({
  past: [],
  future: [],
  canUndo: false,
  canRedo: false,

  // Call BEFORE mutating any board store — captures the pre-action state.
  recordSnapshot: () => {
    const snapshot = captureSnapshot();
    set((state) => {
      const past = [...state.past, snapshot].slice(-MAX_HISTORY);
      return { past, future: [], canUndo: true, canRedo: false };
    });
  },

  undo: () => {
    const { past, future } = get();
    const previous = past[past.length - 1];
    if (!previous) return;

    const current = captureSnapshot();
    const nextPast = past.slice(0, -1);
    const nextFuture = [...future, current];

    applySnapshot(previous);
    set({ past: nextPast, future: nextFuture, canUndo: nextPast.length > 0, canRedo: true });
  },

  redo: () => {
    const { past, future } = get();
    const next = future[future.length - 1];
    if (!next) return;

    const current = captureSnapshot();
    const nextFuture = future.slice(0, -1);
    const nextPast = [...past, current];

    applySnapshot(next);
    set({ past: nextPast, future: nextFuture, canUndo: true, canRedo: nextFuture.length > 0 });
  },
}));