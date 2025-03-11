import { create } from 'zustand';

export type ViewMode = 'large' | 'normal' | 'compact';

interface ViewModeState {
  mixerViewMode: ViewMode;
  setMixerViewMode: (mode: ViewMode) => void;
}

export const useViewModeStore = create<ViewModeState>((set) => ({
  mixerViewMode: 'normal',
  setMixerViewMode: (mode) => set({ mixerViewMode: mode }),
}));