import { create } from 'zustand';

interface BannerSectionsState {
  collaboratorsCollapsed: boolean;
  percentageSplitsCollapsed: boolean;
  audioSystemDemoCollapsed: boolean;
  setCollaboratorsCollapsed: (collapsed: boolean) => void;
  setPercentageSplitsCollapsed: (collapsed: boolean) => void;
  setAudioSystemDemoCollapsed: (collapsed: boolean) => void;
}

export const useBannerSectionsStore = create<BannerSectionsState>((set) => ({
  collaboratorsCollapsed: false,
  percentageSplitsCollapsed: false,
  audioSystemDemoCollapsed: false,
  setCollaboratorsCollapsed: (collapsed) => set({ collaboratorsCollapsed: collapsed }),
  setPercentageSplitsCollapsed: (collapsed) => set({ percentageSplitsCollapsed: collapsed }),
  setAudioSystemDemoCollapsed: (collapsed) => set({ audioSystemDemoCollapsed: collapsed }),
}));