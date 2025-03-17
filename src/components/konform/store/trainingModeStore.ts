import { create } from 'zustand';

interface TrainingModeState {
  isTrainingEnabled: boolean;
  setTrainingEnabled: (enabled: boolean) => void;
}

export const useTrainingModeStore = create<TrainingModeState>((set) => ({
  isTrainingEnabled: false,
  setTrainingEnabled: (enabled) => set({ isTrainingEnabled: enabled }),
}));