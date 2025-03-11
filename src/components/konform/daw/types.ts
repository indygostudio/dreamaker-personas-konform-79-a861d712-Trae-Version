
import type { Persona } from "@/types/persona";

export interface DAWViewProps {
  selectedPersona: Persona | null;
  onPersonaSelect: (persona: Persona) => void;
  onPersonaDeselect: () => void;
  onPersonaUpdate: (persona: Persona, state: Partial<PersonaState>) => Promise<void>;
}

export interface DAWState {
  isLoading: boolean;
  isPlaying: boolean;
  isRecording: boolean;
  isRendering: boolean;
  isExporting: boolean;
  isImporting: boolean;
  isSaving: boolean;
  isCreating: boolean;
}

export interface TimelineRegion {
  id: string;
  startTime: number;
  duration: number;
  name: string;
  color: string;
}

export interface Track {
  id: number;
  name: string;
  mode: 'ai-audio' | 'ai-midi' | 'real-audio';
  volume: number;
  isMuted: boolean;
  clips: TimelineRegion[];
}

export interface PersonaState {
  id: string;
  persona_id: string;
  volume: number;
  is_muted: boolean;
  track_mode: 'ai-audio' | 'ai-midi' | 'real-audio';
}
