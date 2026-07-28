import { create } from 'zustand';

interface BoardState {
  scale: number;
  position: { x: number; y: number };
  setScale: (scale: number) => void;
  setPosition: (position: { x: number; y: number }) => void;
  resetView: () => void;
}

const DEFAULT_SCALE = 1;
const DEFAULT_POSITION = { x: 0, y: 0 };

// Holds only ephemeral canvas view state (zoom/pan) — never persisted,
// never touches Supabase. Shared between the canvas and the future toolbar.
export const useBoardStore = create<BoardState>((set) => ({
  scale: DEFAULT_SCALE,
  position: DEFAULT_POSITION,
  setScale: (scale) => set({ scale }),
  setPosition: (position) => set({ position }),
  resetView: () => set({ scale: DEFAULT_SCALE, position: DEFAULT_POSITION }),
}));