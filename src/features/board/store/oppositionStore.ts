import { create } from 'zustand';

export interface OppositionMarker {
  id: string;
  x: number;
  y: number;
  label: string;
}

interface OppositionState {
  isVisible: boolean;
  markers: OppositionMarker[];
  toggleVisible: () => void;
  addMarker: () => void;
  setMarkerPosition: (id: string, x: number, y: number) => void;
  removeMarker: (id: string) => void;
  replaceAll: (markers: OppositionMarker[]) => void;
}

export const useOppositionStore = create<OppositionState>((set) => ({
  isVisible: false,
  markers: [],
  toggleVisible: () => set((state) => ({ isVisible: !state.isVisible })),
  addMarker: () =>
    set((state) => ({
      markers: [
        ...state.markers,
        { id: crypto.randomUUID(), x: 450, y: 300, label: String(state.markers.length + 1) },
      ],
    })),
  setMarkerPosition: (id, x, y) =>
    set((state) => ({
      markers: state.markers.map((marker) => (marker.id === id ? { ...marker, x, y } : marker)),
    })),
  removeMarker: (id) =>
    set((state) => ({ markers: state.markers.filter((marker) => marker.id !== id) })),
  replaceAll: (markers) => set({ markers }),
}));