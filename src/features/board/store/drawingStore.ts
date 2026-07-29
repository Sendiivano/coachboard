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
  replaceAll: (elements: DrawingElement[]) => void;
}

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
  replaceAll: (elements) => set({ elements }),
}));