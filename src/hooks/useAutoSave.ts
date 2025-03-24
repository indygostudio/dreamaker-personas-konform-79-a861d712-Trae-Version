import { useEffect, useRef } from 'react';
import { useKonformProject } from './useKonformProject';
import { useProjectSettingsStore } from '@/components/konform/store/projectSettingsStore';

export const useAutoSave = () => {
  const { currentProject, saveProject } = useKonformProject();
  const { autoSaveEnabled, autoSaveInterval } = useProjectSettingsStore();
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timer when dependencies change
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }

    // Only set up auto-save if enabled and we have a current project
    if (autoSaveEnabled && currentProject) {
      const intervalMs = autoSaveInterval * 60 * 1000; // Convert minutes to milliseconds
      
      autoSaveTimerRef.current = setInterval(() => {
        // Only save if we have a current project
        if (currentProject) {
          saveProject.mutate({
            // Keep existing state
            mixer_state: currentProject.mixer_state,
            editor_state: currentProject.editor_state,
            lyrics_state: currentProject.lyrics_state
          });
        }
      }, intervalMs);
    }

    // Clean up on unmount
    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [autoSaveEnabled, autoSaveInterval, currentProject, saveProject]);

  return {
    isAutoSaveEnabled: autoSaveEnabled,
    autoSaveInterval
  };
};