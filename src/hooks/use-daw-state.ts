import { create } from "zustand";
import type { DAWState } from "@/components/konform/daw/types";

interface DAWStore extends DAWState {
  setLoading: (isLoading: boolean) => void;
  setPlaying: (isPlaying: boolean) => void;
  setRecording: (isRecording: boolean) => void;
  setRendering: (isRendering: boolean) => void;
  setExporting: (isExporting: boolean) => void;
  setImporting: (isImporting: boolean) => void;
  setSaving: (isSaving: boolean) => void;
  setCreating: (isCreating: boolean) => void;
}

export const useDAWState = create<DAWStore>((set) => ({
  isLoading: false,
  isPlaying: false,
  isRecording: false,
  isRendering: false,
  isExporting: false,
  isImporting: false,
  isSaving: false,
  isCreating: false,
  setLoading: (isLoading) => set({ isLoading }),
  setPlaying: (isPlaying) => set({ isPlaying }),
  setRecording: (isRecording) => set({ isRecording }),
  setRendering: (isRendering) => set({ isRendering }),
  setExporting: (isExporting) => set({ isExporting }),
  setImporting: (isImporting) => set({ isImporting }),
  setSaving: (isSaving) => set({ isSaving }),
  setCreating: (isCreating) => set({ isCreating })
}));