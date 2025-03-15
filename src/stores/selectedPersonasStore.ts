
import { create } from 'zustand';
import { PersonaType } from '@/types/persona';

interface SelectedPersona {
  avatarUrl?: string;
  name: string;
  id?: string;
  type: PersonaType;
  avatar_url?: string; // Added for compatibility with Collaborators component
}

interface SelectedPersonasState {
  selectedPersonas: SelectedPersona[];
  showDropContainer: boolean;
  wormholeAnimations: Set<string>;
  addPersona: (persona: SelectedPersona) => void;
  removePersona: (personaName: string) => void;
  clearSelection: () => void;
  setShowDropContainer: (show: boolean) => void;
  addWormholeAnimation: (personaName: string) => void;
  removeWormholeAnimation: (personaName: string) => void;
  clearWormholeAnimations: () => void;
}

export const useSelectedPersonasStore = create<SelectedPersonasState>((set) => ({
  selectedPersonas: [],
  showDropContainer: false,
  wormholeAnimations: new Set(),
  addPersona: (persona) =>
    set((state) => {
      // Ensure we're not adding duplicates
      if (state.selectedPersonas.some(p => p.name === persona.name)) {
        return state;
      }

      // Add avatar_url property if not present (for compatibility with different components)
      const enhancedPersona = {
        ...persona,
        avatar_url: persona.avatar_url || persona.avatarUrl
      };

      const wormholeAnimations = new Set(state.wormholeAnimations);
      wormholeAnimations.add(persona.name);
      return {
        selectedPersonas: [...state.selectedPersonas, enhancedPersona],
        showDropContainer: true,
        wormholeAnimations,
      };
    }),
  removePersona: (personaName) =>
    set((state) => {
      // Keep the persona in wormholeAnimations to show the release animation
      // Similar to how clearSelection works but for a single persona
      const wormholeAnimations = new Set(state.wormholeAnimations);
      wormholeAnimations.add(personaName);
      
      // After a delay, we'll remove the animation
      setTimeout(() => {
        set(state => {
          const animations = new Set(state.wormholeAnimations);
          animations.delete(personaName);
          return { wormholeAnimations: animations };
        });
      }, 2000); // 2 second animation duration
      
      return {
        selectedPersonas: state.selectedPersonas.filter((p) => p.name !== personaName),
        showDropContainer: state.selectedPersonas.length <= 1 ? false : true,
        wormholeAnimations
      };
    }),
  clearSelection: () =>
    set({
      selectedPersonas: [],
      showDropContainer: false,
      wormholeAnimations: new Set(),
    }),
  setShowDropContainer: (show) =>
    set((state) => ({
      showDropContainer: show,
      wormholeAnimations: show ? state.wormholeAnimations : new Set(),
    })),
  addWormholeAnimation: (personaName) =>
    set((state) => {
      const wormholeAnimations = new Set(state.wormholeAnimations);
      wormholeAnimations.add(personaName);
      return { wormholeAnimations };
    }),
  removeWormholeAnimation: (personaName) =>
    set((state) => {
      const wormholeAnimations = new Set(state.wormholeAnimations);
      wormholeAnimations.delete(personaName);
      return { wormholeAnimations };
    }),
  clearWormholeAnimations: () =>
    set({
      wormholeAnimations: new Set(),
    }),
}));
