
import { create } from 'zustand';

interface ZoomState {
  zoomLevel: number;
  setZoomLevel: (level: number) => void;
}

export const useZoomStore = create<ZoomState>()((set) => ({
  zoomLevel: 100,
  setZoomLevel: (level) => set({ zoomLevel: level }),
}));
