import { create } from 'zustand';

interface HeaderState {
  projectHeaderCollapsed: boolean;
  drumPadHeaderCollapsed: boolean;
  mixerHeaderCollapsed: boolean;
  effectsHeaderCollapsed: boolean;
  keypadHeaderCollapsed: boolean;
  filesHeaderCollapsed: boolean;
  lyricsHeaderCollapsed: boolean;
  konformHeaderCollapsed: boolean;  // Added this
  setProjectHeaderCollapsed: (collapsed: boolean) => void;
  setDrumPadHeaderCollapsed: (collapsed: boolean) => void;
  setMixerHeaderCollapsed: (collapsed: boolean) => void;
  setEffectsHeaderCollapsed: (collapsed: boolean) => void;
  setKeypadHeaderCollapsed: (collapsed: boolean) => void;
  setFilesHeaderCollapsed: (collapsed: boolean) => void;
  setLyricsHeaderCollapsed: (collapsed: boolean) => void;
  setKonformHeaderCollapsed: (collapsed: boolean) => void;  // Added this
}

export const useHeaderStore = create<HeaderState>((set) => ({
  projectHeaderCollapsed: true,
  drumPadHeaderCollapsed: true,
  mixerHeaderCollapsed: true,
  effectsHeaderCollapsed: true,
  keypadHeaderCollapsed: true,
  filesHeaderCollapsed: true,
  lyricsHeaderCollapsed: true,
  konformHeaderCollapsed: true,  // Added this
  setProjectHeaderCollapsed: (collapsed) => set({ projectHeaderCollapsed: collapsed }),
  setDrumPadHeaderCollapsed: (collapsed) => set({ drumPadHeaderCollapsed: collapsed }),
  setMixerHeaderCollapsed: (collapsed) => set({ mixerHeaderCollapsed: collapsed }),
  setEffectsHeaderCollapsed: (collapsed) => set({ effectsHeaderCollapsed: collapsed }),
  setKeypadHeaderCollapsed: (collapsed) => set({ keypadHeaderCollapsed: collapsed }),
  setFilesHeaderCollapsed: (collapsed) => set({ filesHeaderCollapsed: collapsed }),
  setLyricsHeaderCollapsed: (collapsed) => set({ lyricsHeaderCollapsed: collapsed }),
  setKonformHeaderCollapsed: (collapsed) => set({ konformHeaderCollapsed: collapsed })  // Added this
}));