import { create } from 'zustand';

interface NavbarState {
  navbarVisible: boolean;
  setNavbarVisible: (visible: boolean) => void;
}

export const useNavbarStore = create<NavbarState>((set) => ({
  navbarVisible: true,
  setNavbarVisible: (visible) => set({ navbarVisible: visible }),
}));