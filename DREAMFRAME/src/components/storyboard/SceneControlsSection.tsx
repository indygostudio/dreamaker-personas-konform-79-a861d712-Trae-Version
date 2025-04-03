
import React from "react";
import { ChevronUp, ChevronDown, ImageIcon, Plus } from "lucide-react";
import { Scene, SceneContainer } from "../../types/storyboardTypes";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import SceneControls from "./SceneControls";
import SceneControlPanel from "./controls/SceneControlPanel";

interface SceneControlsSectionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeScene: Scene | null;
  activeStory: SceneContainer | null;
  description: string;
  prompt: string;
  sceneTitle: string;
  sceneDescription: string;
  duration: number;
  isGeneratingImage: boolean;
  selectedServiceName: string;
  isCreatingShots: boolean;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onPromptChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSceneTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSceneDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onDurationChange: (value: number[]) => void;
  onImageGeneration: () => void;
  onVideoGenerated: (videoUrl: string) => void;
  onAddScene: () => void;
  onAutoCreateShots: () => void;
  activeControlMode: 'scene' | 'shot';
}

const SceneControlsSection: React.FC<SceneControlsSectionProps> = ({
  open,
  onOpenChange,
  activeScene,
  activeStory,
  description,
  prompt,
  sceneTitle,
  sceneDescription,
  duration,
  isGeneratingImage,
  selectedServiceName,
  isCreatingShots,
  onDescriptionChange,
  onPromptChange,
  onSceneTitleChange,
  onSceneDescriptionChange,
  onDurationChange,
  onImageGeneration,
  onVideoGenerated,
  onAddScene,
  onAutoCreateShots,
  activeControlMode
}) => {
  return (
    <Collapsible 
      open={open} 
      onOpenChange={onOpenChange}
      className="md:col-span-3 bg-runway-glass border border-runway-glass-border rounded-md overflow-hidden"
    >
      <CollapsibleTrigger className="flex w-full justify-between items-center p-3 bg-runway-input hover:bg-runway-card">
        <h3 className="text-md font-medium">
          {activeControlMode === 'scene' ? 'Scene Controls' : 'Shot Controls'}
        </h3>
        <div className="flex items-center gap-2">
          {open ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-6">
          {activeControlMode === 'scene' ? (
            activeStory ? (
              <SceneControlPanel
                scene={activeStory}
                title={sceneTitle}
                description={sceneDescription}
                onTitleChange={onSceneTitleChange}
                onDescriptionChange={onSceneDescriptionChange}
                onAddShot={onAddScene}
                onAutoCreateShots={onAutoCreateShots}
                isCreatingShots={isCreatingShots}
              />
            ) : (
              <div className="text-center py-20">
                <ImageIcon className="h-16 w-16 mx-auto mb-4 text-gray-500" />
                <h3 className="text-xl font-medium mb-2">No Scene Selected</h3>
                <p className="text-gray-400 mb-4">
                  Select a scene from the timeline
                </p>
              </div>
            )
          ) : (
            !activeScene ? (
              <div className="text-center py-20">
                <ImageIcon className="h-16 w-16 mx-auto mb-4 text-gray-500" />
                <h3 className="text-xl font-medium mb-2">No Shot Selected</h3>
                <p className="text-gray-400 mb-4">
                  Select a shot from the timeline or create a new one
                </p>
                <Button 
                  variant="runway" 
                  onClick={onAddScene}
                  className="mx-auto"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Shot
                </Button>
              </div>
            ) : (
              <SceneControls
                scene={activeScene}
                description={description}
                prompt={prompt}
                duration={duration}
                isGeneratingImage={isGeneratingImage}
                selectedServiceName={selectedServiceName}
                onDescriptionChange={onDescriptionChange}
                onPromptChange={onPromptChange}
                onDurationChange={onDurationChange}
                onImageGeneration={onImageGeneration}
                onVideoGenerated={onVideoGenerated}
              />
            )
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SceneControlsSection;
