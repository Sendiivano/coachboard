import { create } from 'zustand';
import type { DrawingElement, DrawingTool } from '../types/drawing.types';

interface DrawingState {
  selectedTool: DrawingTool;
  elements: DrawingElement[];
  setSelectedTool: (tool: DrawingTool) => void;
  addElement: (element: DrawingElement) => void;
  updateElement: (id: string, updates: Partial<DrawingElement>) => void;
  removeElement: (id: string) => void;
  clearAll: () => void;
}

// Single store for all drawing annotations (arrows, cones, footballs, text).
// One flat array keyed by id — avoids duplicating render/select/delete logic
// across four separate per-shape stores.
export const useDrawingStore = create<DrawingState>((set) => ({
  selectedTool: 'select',
  elements: [],
  setSelectedTool: (tool) => set({ selectedTool: tool }),
  addElement: (element) => set((state) => ({ elements: [...state.elements, element] })),
  updateElement: (id, updates) =>
    set((state) => ({
      elements: state.elements.map((el) => (el.id === id ? ({ ...el, ...updates } as DrawingElement) : el)),
    })),
  removeElement: (id) => set((state) => ({ elements: state.elements.filter((el) => el.id !== id) })),
  clearAll: () => set({ elements: [] }),
}));