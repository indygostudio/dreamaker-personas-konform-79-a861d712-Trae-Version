
import React from "react";
import { ChevronUp, ChevronDown, Play, Pause, Plus, Music, Volume2, Circle, CircleDot, Film } from "lucide-react";
import { Scene, SceneContainer } from "../../types/storyboardTypes";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import ProjectSceneTimeline from "./ProjectSceneTimeline";

interface TimelineSectionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  story: SceneContainer;
  scenes: Scene[];
  activeSceneId: string | undefined;
  onSceneClick: (scene: Scene) => void;
  onSceneTrackClick?: (scene: SceneContainer) => void;
  currentTime: number;
  isPlaying: boolean;
  onTimeChange: (time: number) => void;
  onPlayPauseChange: () => void;
  onAddScene: () => void;
  onAutoCreateScenes: () => void;
  onAddAudio: () => void;
  isCreatingScenes: boolean;
  onStoryAudioDrop: (e: React.DragEvent) => void;
  onAddNewScene?: () => void;
}

const TimelineSection: React.FC<TimelineSectionProps> = ({
  open,
  onOpenChange,
  story,
  scenes,
  activeSceneId,
  onSceneClick,
  onSceneTrackClick,
  currentTime,
  isPlaying,
  onTimeChange,
  onPlayPauseChange,
  onAddScene,
  onAutoCreateScenes,
  onAddAudio,
  isCreatingScenes,
  onStoryAudioDrop,
  onAddNewScene
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <Collapsible 
      open={open} 
      onOpenChange={onOpenChange}
      className="overflow-hidden"
    >
      <CollapsibleTrigger className="flex w-full justify-between items-center p-3 bg-runway-input hover:bg-runway-card rounded-md">
        <h3 className="text-md font-medium">Timeline</h3>
        <div className="flex items-center gap-2">
          {open ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="w-full mt-4">
        <div 
          className="bg-runway-glass border border-runway-glass-border rounded-md p-2 space-y-2"
          onDragOver={(e) => e.preventDefault()}
          onDrop={onStoryAudioDrop}
        >
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onAddScene}
                className="bg-runway-input border-dashed border-gray-600 flex items-center gap-2 hover:bg-runway-card"
              >
                <Plus className="h-3 w-3" /> Add Shot
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onAddNewScene}
                className="bg-runway-input border-dashed border-gray-600 flex items-center gap-2 hover:bg-runway-card"
              >
                <Film className="h-3 w-3" /> Add Scene
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onAutoCreateScenes}
                disabled={isCreatingScenes}
                className="bg-runway-input border-dashed border-gray-600 flex items-center gap-2 hover:bg-runway-card"
              >
                {isCreatingScenes ? "Creating Shots..." : "Auto Create Shots"}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onAddAudio}
                className="bg-runway-input border-dashed border-gray-600 flex items-center gap-2 hover:bg-runway-card"
              >
                <Music className="h-3 w-3" /> Add Audio
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full bg-runway-input"
                onClick={onPlayPauseChange}
              >
                {isPlaying ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5" />
                )}
              </Button>
              
              <div className="text-xs font-mono text-gray-400">
                {formatTime(currentTime)} / {formatTime(story.scenes.reduce((total, scene) => total + scene.durationInSeconds, 0))}
              </div>
            </div>
          </div>
          
          {/* Main Timeline */}
          <div className="space-y-2">
            {/* Scene Audio Track */}
            <div 
              className={`flex items-center h-10 bg-runway-input rounded cursor-pointer hover:bg-runway-card transition-colors ${!activeSceneId ? 'border-2 border-runway-blue' : 'border border-runway-glass-border'}`}
              onClick={() => onSceneTrackClick && onSceneTrackClick(story)}
            >
              <div className="w-24 px-3 py-1 border-r border-runway-glass-border">
                <div className="text-xs font-medium truncate">Scene Audio</div>
              </div>
              <div className="flex-1 relative px-3 py-1">
                {story.audioTrack ? (
                  <div className="absolute inset-y-0 left-0 right-0 bg-runway-blue/30 rounded-r flex items-center px-3">
                    <Volume2 className="h-3 w-3 mr-1" />
                    <span className="text-xs">Audio Track</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="text-xs text-gray-400">No audio</span>
                  </div>
                )}
                
                {/* Playhead indicator */}
                {isPlaying && (
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-white" 
                    style={{ 
                      left: `${Math.min(100, (currentTime / Math.max(1, story.scenes.reduce((total, scene) => total + scene.durationInSeconds, 0))) * 100)}%`,
                      transition: 'left 0.1s linear'
                    }}
                  />
                )}
              </div>
            </div>
            
            {/* Scene Clips in Timeline */}
            <div>
              <div className="text-xs text-gray-400 mb-1">Scenes</div>
              {story.id && (
                <ProjectSceneTimeline 
                  project={{ id: "timeline", name: "Timeline View", stories: [story] }}
                  activeSceneId={activeSceneId || undefined}
                  onSceneSelect={(scene) => scene && onSceneClick(scene.scenes[0])}
                  showInTimeline={true}
                />
              )}
            </div>
            
            {/* Shots Timeline */}
            <div>
              <div className="text-xs text-gray-400 mb-1">Shots</div>
              <RadioGroup
                value={activeSceneId || ""}
                onValueChange={(value) => {
                  const scene = scenes.find(s => s.id === value);
                  if (scene) {
                    onSceneClick(scene);
                  }
                }}
                className="flex gap-2 overflow-x-auto p-1 pb-2 bg-runway-card rounded-sm"
              >
                {scenes.map((scene, index) => (
                  <div key={scene.id} className="min-w-32 flex-shrink-0">
                    <RadioGroupItem
                      value={scene.id}
                      id={`shot-${scene.id}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`shot-${scene.id}`}
                      className={`flex flex-col h-20 cursor-pointer rounded border ${
                        scene.id === activeSceneId
                          ? 'border-2 border-runway-blue bg-runway-card/50'
                          : 'border-runway-glass-border bg-runway-glass'
                      } hover:bg-runway-card/30 transition-all overflow-hidden`}
                    >
                      <div className="flex items-center p-2 bg-runway-input">
                        <div className="mr-2">
                          {scene.id === activeSceneId ? (
                            <CircleDot className="h-3 w-3 text-runway-blue" />
                          ) : (
                            <Circle className="h-3 w-3 text-gray-400" />
                          )}
                        </div>
                        <span className="text-xs font-medium truncate">
                          Shot {index + 1}
                        </span>
                      </div>
                      
                      <div className="flex-1 flex items-center justify-center overflow-hidden bg-black/30">
                        {scene.imageUrl ? (
                          <img
                            src={scene.imageUrl}
                            alt={scene.description}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-gray-400">No image</span>
                        )}
                      </div>
                      
                      <div className="p-1 text-center bg-runway-input text-xs text-gray-400">
                        {formatTime(scene.durationInSeconds)}
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default TimelineSection;
