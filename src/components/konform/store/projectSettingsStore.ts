import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProjectSettingsState {
  autoSaveEnabled: boolean;
  autoSaveInterval: number; // in minutes
  setAutoSaveEnabled: (enabled: boolean) => void;
  setAutoSaveInterval: (interval: number) => void;
}

export const useProjectSettingsStore = create<ProjectSettingsState>(
  persist(
    (set) => ({
      autoSaveEnabled: true,
      autoSaveInterval: 5, // default to 5 minutes
      setAutoSaveEnabled: (enabled) => set({ autoSaveEnabled: enabled }),
      setAutoSaveInterval: (interval) => set({ autoSaveInterval: interval }),
    }),
    {
      name: 'konform-project-settings',
    }
  )
);