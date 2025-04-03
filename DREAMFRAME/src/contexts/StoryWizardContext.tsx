
import React, { createContext, useContext, useState } from "react";
import { useStoryboard } from "./StoryboardContext";
import { generateScenesFromStory } from "../utils/storyUtils";
import { generatePromptForScene } from "../utils/promptUtils";
import { toast } from "sonner";

// Define types for wizard data
export interface Character {
  id: string;
  name: string;
  description: string;
  imageUrl?: string | null;
}

export interface SceneShotInfo {
  id: string;
  description: string;
  duration: number;
  prompt?: string;
}

export interface StoryWizardData {
  // Step 1: Concept
  title: string;
  concept: string;
  genre: string[];
  format: string;
  customFormat?: string;
  tone: string;
  speechStyle: string[];
  specialRequests?: string;
  
  // Step 2: Storyline
  storyline: string;
  alternativeStorylines: Array<{
    id: string;
    title: string;
    description: string;
    tags: string[];
  }>;
  selectedStorylineId: string | null;
  
  // Step 3: Settings & Cast
  projectName: string;
  aspectRatio: "16:9" | "1:1" | "9:16";
  videoStyle: string;
  styleReference?: string | null;
  cinematicInspiration?: string;
  characters: Character[];
  
  // Step 4: Breakdown
  scenes: SceneShotInfo[];
  synopsis: string;
}

interface StoryWizardContextType {
  wizardData: StoryWizardData;
  updateWizardData: (updates: Partial<StoryWizardData>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  resetWizard: () => void;
  loadIntoEditor: () => Promise<boolean>;
  isLoading: boolean;
  generateScenesFromStoryline: () => void;
}

// Default wizard data
const defaultWizardData: StoryWizardData = {
  // Step 1: Concept
  title: "",
  concept: "",
  genre: [],
  format: "Custom",
  customFormat: "",
  tone: "",
  speechStyle: [],
  specialRequests: "",
  
  // Step 2: Storyline
  storyline: "",
  alternativeStorylines: [],
  selectedStorylineId: null,
  
  // Step 3: Settings & Cast
  projectName: "",
  aspectRatio: "16:9",
  videoStyle: "Cinematic",
  styleReference: null,
  cinematicInspiration: "",
  characters: [],
  
  // Step 4: Breakdown
  scenes: [],
  synopsis: "",
};

// Create context with default values
const StoryWizardContext = createContext<StoryWizardContextType>({
  wizardData: defaultWizardData,
  updateWizardData: () => {},
  currentStep: 1,
  setCurrentStep: () => {},
  resetWizard: () => {},
  loadIntoEditor: async () => false,
  isLoading: false,
  generateScenesFromStoryline: () => {},
});

// Hook to use the context
export const useStoryWizard = () => useContext(StoryWizardContext);

interface StoryWizardProviderProps {
  children: React.ReactNode;
  onNavigate?: (path: string) => void;
}

// Provider component
export const StoryWizardProvider: React.FC<StoryWizardProviderProps> = ({ 
  children,
  onNavigate 
}) => {
  const [wizardData, setWizardData] = useState<StoryWizardData>(defaultWizardData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const { dispatch } = useStoryboard();
  
  // Update wizard data with partial updates
  const updateWizardData = (updates: Partial<StoryWizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }));
  };
  
  // Reset wizard to default state
  const resetWizard = () => {
    setWizardData(defaultWizardData);
    setCurrentStep(1);
  };
  
  // Generate scenes based on storyline
  const generateScenesFromStoryline = () => {
    if (!wizardData.storyline) {
      toast.error("Please enter a storyline first");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Generate scenes (3-5 minute duration)
      const totalDurationInMinutes = 3;
      const generatedScenes = generateScenesFromStory(
        wizardData.storyline,
        totalDurationInMinutes
      );
      
      // Generate prompts for each scene
      const scenesWithPrompts: SceneShotInfo[] = generatedScenes.map(scene => ({
        id: crypto.randomUUID(),
        description: scene.description,
        duration: scene.durationInSeconds,
        prompt: generatePromptForScene(scene.description)
      }));
      
      // Update wizard data with generated scenes
      updateWizardData({
        scenes: scenesWithPrompts,
        synopsis: wizardData.storyline.split('.').slice(0, 3).join('.') + '.'
      });
      
      toast.success(`Generated ${scenesWithPrompts.length} scenes`);
    } catch (error) {
      console.error("Error generating scenes:", error);
      toast.error("Failed to generate scenes");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load all wizard data into the editor
  const loadIntoEditor = async (): Promise<boolean> => {
    if (!wizardData.title || !wizardData.storyline) {
      toast.error("Please complete at least the concept and storyline steps");
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Create a new project
      const projectIdResult = dispatch({
        type: "ADD_PROJECT",
        payload: { name: wizardData.projectName || wizardData.title }
      });
      
      // Check if we received a valid string ID
      const projectId = typeof projectIdResult === 'string' ? projectIdResult : null;
      
      if (!projectId) {
        throw new Error("Failed to create project");
      }
      
      // Create a new story in the project
      const storyIdResult = dispatch({
        type: "ADD_STORY",
        payload: {
          projectId,
          title: wizardData.title,
          description: wizardData.synopsis || wizardData.storyline
        }
      });
      
      // Check if we received a valid string ID
      const storyId = typeof storyIdResult === 'string' ? storyIdResult : null;
      
      if (!storyId) {
        throw new Error("Failed to create story");
      }
      
      // Add all scenes to the story
      for (const scene of wizardData.scenes) {
        dispatch({
          type: "ADD_SCENE",
          payload: {
            projectId,
            storyId,
            description: scene.description,
            prompt: scene.prompt,
            durationInSeconds: scene.duration
          }
        });
        
        // Small delay to ensure proper ordering
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      toast.success("Successfully loaded story into editor!");
      
      // Use the onNavigate callback if provided
      if (onNavigate) {
        onNavigate("/storyboard");
      }
      
      return true;
    } catch (error) {
      console.error("Error loading into editor:", error);
      toast.error("Failed to load into editor");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <StoryWizardContext.Provider
      value={{
        wizardData,
        updateWizardData,
        currentStep,
        setCurrentStep,
        resetWizard,
        loadIntoEditor,
        isLoading,
        generateScenesFromStoryline
      }}
    >
      {children}
    </StoryWizardContext.Provider>
  );
};
