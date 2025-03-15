import { create } from 'zustand';

interface BannerSectionsState {
  collaboratorsCollapsed: boolean;
  percentageSplitsCollapsed: boolean;
  setCollaboratorsCollapsed: (collapsed: boolean) => void;
  setPercentageSplitsCollapsed: (collapsed: boolean) => void;
}

export const useBannerSectionsStore = create<BannerSectionsState>((set) => ({
  collaboratorsCollapsed: false,
  percentageSplitsCollapsed: false,
  setCollaboratorsCollapsed: (collapsed) => set({ collaboratorsCollapsed: collapsed }),
  setPercentageSplitsCollapsed: (collapsed) => set({ percentageSplitsCollapsed: collapsed }),
}));