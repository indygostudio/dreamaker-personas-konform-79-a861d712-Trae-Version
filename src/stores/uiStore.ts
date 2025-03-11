
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FilterSettings {
  sortBy: string;
  searchQuery: string;
  selectedType: string;
  selectedGenre: string;
}

interface CollapsedSections {
  recentCollaborations: boolean;
  header: boolean;
  about: boolean;
  musicSection: boolean;
  videoSection: boolean;
}

interface WindowState {
  zoomLevel: number;
  filterSettings: FilterSettings;
  collapsedSections: CollapsedSections;
  scrollPositions: Record<string, number>;
}

// Default values
const DEFAULT_FILTER_SETTINGS: FilterSettings = {
  sortBy: "newest",
  searchQuery: "",
  selectedType: "all",
  selectedGenre: "all",
};

const DEFAULT_COLLAPSED_SECTIONS: CollapsedSections = {
  recentCollaborations: false,
  header: false,
  about: false,
  musicSection: false,
  videoSection: false,
};

interface UIState {
  scrollPositions: Record<string, number>;
  isHeaderExpanded: boolean;
  defaultZoomLevel: number;
  defaultFilterSettings: FilterSettings;
  defaultCollapsedSections: CollapsedSections;
  defaultWindowState: WindowState;
  
  setScrollPosition: (key: string, position: number) => void;
  setIsHeaderExpanded: (expanded: boolean) => void;
  setHeaderExpanded: (expanded: boolean) => void;
  
  setDefaultStates: (
    zoomLevel: number, 
    filterSettings: Partial<FilterSettings>,
    collapsedSections: Partial<CollapsedSections>
  ) => void;
  
  setDefaultWindowState: (windowState: WindowState) => void;
  getDefaultStates: () => WindowState;
  setZoomLevel: (zoomLevel: number) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      scrollPositions: {},
      // Changed default to true for expanded header
      isHeaderExpanded: true,
      defaultZoomLevel: 60,
      defaultFilterSettings: DEFAULT_FILTER_SETTINGS,
      defaultCollapsedSections: DEFAULT_COLLAPSED_SECTIONS,
      defaultWindowState: {
        zoomLevel: 60,
        filterSettings: DEFAULT_FILTER_SETTINGS,
        collapsedSections: DEFAULT_COLLAPSED_SECTIONS,
        scrollPositions: {}
      },
      
      setScrollPosition: (key: string, position: number) =>
        set((state) => ({
          scrollPositions: {
            ...state.scrollPositions,
            [key]: position,
          },
        })),
        
      setIsHeaderExpanded: (expanded: boolean) =>
        set({ isHeaderExpanded: expanded }),
        
      setHeaderExpanded: (expanded: boolean) =>
        set({ isHeaderExpanded: expanded }),
        
      setDefaultStates: (zoomLevel, filterSettings, collapsedSections) =>
        set((state) => {
          // Save current scroll positions as well
          const newWindowState = {
            zoomLevel: zoomLevel,
            filterSettings: {
              ...DEFAULT_FILTER_SETTINGS,
              ...filterSettings
            },
            collapsedSections: {
              ...DEFAULT_COLLAPSED_SECTIONS,
              ...collapsedSections
            },
            scrollPositions: {...state.scrollPositions}
          };
          
          return {
            defaultZoomLevel: zoomLevel, 
            defaultFilterSettings: {
              ...DEFAULT_FILTER_SETTINGS,
              ...filterSettings
            },
            defaultCollapsedSections: {
              ...DEFAULT_COLLAPSED_SECTIONS,
              ...collapsedSections
            },
            defaultWindowState: newWindowState
          };
        }),
        
      setDefaultWindowState: (windowState: WindowState) =>
        set({ 
          defaultWindowState: windowState,
          defaultZoomLevel: windowState.zoomLevel,
          defaultFilterSettings: windowState.filterSettings,
          defaultCollapsedSections: windowState.collapsedSections
        }),
        
      getDefaultStates: () => {
        return get().defaultWindowState;
      },
      
      setZoomLevel: (zoomLevel: number) =>
        set({ defaultZoomLevel: zoomLevel }),
    }),
    {
      name: 'ui-storage',
    }
  )
);
