import React, { createContext, useContext, useState, useReducer, useEffect } from "react";
import { Scene, SceneContainer, StoryProject } from "../types/storyboard";
import { toast } from "sonner";
import { storyboardReducer, StoryboardAction } from "../reducers/storyboardReducer";
import { loadFromLocalStorage, saveToLocalStorage } from "../utils/storageUtils";

// Define context type
interface StoryboardContextType {
  projects: StoryProject[];
  activeProject: StoryProject | null;
  activeScene: SceneContainer | null;
  activeShot: Scene | null;
  dispatch: React.Dispatch<StoryboardAction> & ((action: StoryboardAction) => string | void);
  setActiveScene: (scene: SceneContainer | null) => void;
  setActiveShot: (shot: Scene | null) => void;
  getActiveSceneShots: () => Scene[];
  exportProjects: () => void;
  importProjects: (jsonData: string) => void;
  setActiveProject: (project: StoryProject) => void;
}

// Create context with a default value
const StoryboardContext = createContext<StoryboardContextType>({
  projects: [],
  activeProject: null,
  activeScene: null,
  activeShot: null,
  dispatch: () => {},
  setActiveScene: () => {},
  setActiveShot: () => {},
  getActiveSceneShots: () => [],
  exportProjects: () => {},
  importProjects: () => {},
  setActiveProject: () => {}
});

// Helper function to ensure Date objects are properly restored from JSON
const parseProjectData = (projects: StoryProject[]): StoryProject[] => {
  if (!projects) return [];
  
  return projects.map(project => ({
    ...project,
    stories: project.stories.map(story => ({
      ...story,
      createdAt: new Date(story.createdAt),
      updatedAt: new Date(story.updatedAt),
      scenes: story.scenes || []
    }))
  }));
};

// Hook to use the context
export const useStoryboard = () => useContext(StoryboardContext);

interface StoryboardProviderProps {
  children: React.ReactNode;
}

// Provider component
export const StoryboardProvider: React.FC<StoryboardProviderProps> = ({ children }) => {
  // Load data from localStorage with a fallback to empty array
  let initialProjects: StoryProject[] = [];
  try {
    const savedData = localStorage.getItem('storyboard_projects');
    if (savedData) {
      initialProjects = parseProjectData(JSON.parse(savedData));
    }
  } catch (error) {
    console.error('Error loading storyboard projects:', error);
  }
  
  const [projects, dispatch] = useReducer(
    storyboardReducer, 
    initialProjects
  );
  
  const [activeProjectId, setActiveProjectId] = useState<string | null>(
    localStorage.getItem('storyboard_active_project_id') || null
  );
  
  const [activeSceneId, setActiveSceneId] = useState<string | null>(
    localStorage.getItem('storyboard_active_scene_id') || null
  );
  
  const [activeShotId, setActiveShotId] = useState<string | null>(
    localStorage.getItem('storyboard_active_shot_id') || null
  );
  
  // Find the active project based on activeProjectId
  const activeProject = activeProjectId 
    ? projects.find(p => p.id === activeProjectId) || null
    : null;
  
  // Find the active scene based on activeSceneId
  const activeScene = activeSceneId && activeProject
    ? activeProject.stories.find(s => s.id === activeSceneId) || null
    : null;
  
  // Find the active shot based on activeShotId
  const activeShot = activeShotId && activeScene
    ? activeScene.scenes.find(s => s.id === activeShotId) || null
    : null;
  
  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('storyboard_projects', JSON.stringify(projects));
    } catch (error) {
      console.error('Error saving projects to localStorage:', error);
    }
  }, [projects]);
  
  useEffect(() => {
    if (activeProjectId) {
      localStorage.setItem('storyboard_active_project_id', activeProjectId);
    } else {
      localStorage.removeItem('storyboard_active_project_id');
    }
  }, [activeProjectId]);
  
  useEffect(() => {
    if (activeSceneId) {
      localStorage.setItem('storyboard_active_scene_id', activeSceneId);
    } else {
      localStorage.removeItem('storyboard_active_scene_id');
    }
  }, [activeSceneId]);
  
  useEffect(() => {
    if (activeShotId) {
      localStorage.setItem('storyboard_active_shot_id', activeShotId);
    } else {
      localStorage.removeItem('storyboard_active_shot_id');
    }
  }, [activeShotId]);
  
  // Export projects function
  const exportProjects = () => {
    const dataStr = JSON.stringify(projects);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `storyboard_projects_${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
    
    toast.success("Projects exported successfully!");
  };
  
  // Import projects function
  const importProjects = (jsonData: string) => {
    try {
      const importedProjects = JSON.parse(jsonData) as StoryProject[];
      
      if (!Array.isArray(importedProjects)) {
        throw new Error("Invalid project data format");
      }
      
      // Convert date strings to Date objects
      const parsedProjects = parseProjectData(importedProjects);
      
      dispatch({
        type: "IMPORT_PROJECTS",
        payload: parsedProjects
      });
      
      toast.success("Projects imported successfully!");
    } catch (error) {
      toast.error("Failed to import projects: Invalid JSON format");
      console.error("Import error:", error);
    }
  };
  
  // Set active project
  const setActiveProject = (project: StoryProject) => {
    setActiveProjectId(project.id);
    setActiveSceneId(null);
    setActiveShotId(null);
  };
  
  // Custom dispatch function that also updates active entities and returns IDs when needed
  const dispatchWithUpdates = (action: StoryboardAction) => {
    // Handle setting active project directly through setState
    if (action.type === "SET_ACTIVE_PROJECT") {
      setActiveProjectId(action.payload);
      setActiveSceneId(null);
      setActiveShotId(null);
      return;
    }
    
    // For ADD_PROJECT, we need to process the result
    if (action.type === "ADD_PROJECT") {
      // Generate a new project ID
      const newProjectId = action.payload.id || crypto.randomUUID();
      
      // Dispatch the action with the new ID
      dispatch({
        type: "ADD_PROJECT",
        payload: {
          name: action.payload.name,
          id: newProjectId
        }
      });
      
      // Set this as the active project
      setActiveProjectId(newProjectId);
      setActiveSceneId(null);
      setActiveShotId(null);
      
      // Return the new project ID
      return newProjectId;
    }
    
    if (action.type === "DELETE_PROJECT") {
      dispatch(action);
      
      if (activeProjectId === action.payload) {
        setActiveProjectId(null);
        setActiveSceneId(null);
        setActiveShotId(null);
      }
      return;
    }
    
    if (action.type === "ADD_STORY") {
      const newStoryId = action.payload.id || crypto.randomUUID();
      
      dispatch({
        type: "ADD_STORY",
        payload: {
          ...action.payload,
          id: newStoryId
        }
      });
      
      return newStoryId;
    }
    
    if (action.type === "DELETE_STORY") {
      dispatch(action);
      
      if (activeSceneId === action.payload.storyId) {
        setActiveSceneId(null);
        setActiveShotId(null);
      }
      return;
    }
    
    if (action.type === "ADD_SCENE") {
      const newSceneId = action.payload.id || crypto.randomUUID();
      
      dispatch({
        type: "ADD_SCENE",
        payload: {
          ...action.payload,
          id: newSceneId
        }
      });
      
      return newSceneId;
    }
    
    if (action.type === "DELETE_SCENE") {
      dispatch(action);
      
      if (activeShotId === action.payload.sceneId) {
        setActiveShotId(null);
      }
      return;
    }
    
    // Default case: just dispatch the action
    dispatch(action);
  };
  
  // Set active scene
  const setActiveScene = (scene: SceneContainer | null) => {
    setActiveSceneId(scene?.id || null);
    setActiveShotId(null);
  };
  
  // Set active shot
  const setActiveShot = (shot: Scene | null) => {
    setActiveShotId(shot?.id || null);
  };
  
  // Get shots for the active scene
  const getActiveSceneShots = (): Scene[] => {
    if (!activeScene) return [];
    return activeScene.scenes;
  };
  
  return (
    <StoryboardContext.Provider
      value={{
        projects,
        activeProject,
        activeScene,
        activeShot,
        dispatch: dispatchWithUpdates,
        setActiveScene,
        setActiveShot,
        getActiveSceneShots,
        exportProjects,
        importProjects,
        setActiveProject
      }}
    >
      {children}
    </StoryboardContext.Provider>
  );
};