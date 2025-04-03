
import React, { useState } from "react";
import { StoryProject, SceneContainer, Scene } from "../../types/storyboardTypes";
import { useStoryboard } from "../../contexts/StoryboardContext";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { MoveHorizontal, Video, ChevronRight, RadioIcon, CircleDot } from "lucide-react";
import { toast } from "sonner";
import { 
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator
} from "@/components/ui/context-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ProjectSceneTimelineProps {
  project: StoryProject;
  activeSceneId: string | undefined;
  onSceneSelect: (scene: SceneContainer) => void;
  onSceneTrackClick?: (scene: SceneContainer) => void;
  showInTimeline?: boolean;
}

const ProjectSceneTimeline: React.FC<ProjectSceneTimelineProps> = ({
  project,
  activeSceneId,
  onSceneSelect,
  onSceneTrackClick,
  showInTimeline = false
}) => {
  const { dispatch } = useStoryboard();
  const [isDragging, setIsDragging] = useState(false);
  const [draggedScene, setDraggedScene] = useState<string | null>(null);
  
  const handleDragStart = (e: React.DragEvent, sceneId: string) => {
    setIsDragging(true);
    setDraggedScene(sceneId);
    e.dataTransfer.setData("text/plain", sceneId);
    e.dataTransfer.effectAllowed = "move";
  };
  
  const handleDragOver = (e: React.DragEvent, sceneId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  
  const handleDrop = (e: React.DragEvent, targetSceneId: string) => {
    e.preventDefault();
    setIsDragging(false);
    
    const sourceSceneId = e.dataTransfer.getData("text/plain");
    
    if (sourceSceneId === targetSceneId) return;
    
    // Reorder scenes
    const scenes = [...project.stories];
    const sourceIndex = scenes.findIndex(scene => scene.id === sourceSceneId);
    const targetIndex = scenes.findIndex(scene => scene.id === targetSceneId);
    
    if (sourceIndex !== -1 && targetIndex !== -1) {
      const [movedScene] = scenes.splice(sourceIndex, 1);
      scenes.splice(targetIndex, 0, movedScene);
      
      // Update project with new scene order
      dispatch({
        type: "REORDER_STORIES",
        payload: {
          projectId: project.id,
          storyIds: scenes.map(s => s.id)
        }
      });
      
      toast.success("Scene order updated");
    }
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedScene(null);
  };

  const handleDeleteScene = (sceneId: string) => {
    dispatch({
      type: "DELETE_STORY",
      payload: {
        projectId: project.id,
        storyId: sceneId
      }
    });
    
    toast.success("Scene deleted");
  };

  const handleDuplicateScene = (scene: SceneContainer) => {
    // Generate a new ID for the duplicated story
    const newStoryId = crypto.randomUUID();
    
    // Add the new story with the generated ID
    dispatch({
      type: "ADD_STORY",
      payload: {
        projectId: project.id,
        title: `Copy of ${scene.title}`,
        description: scene.description,
        id: newStoryId
      }
    });
    
    if (scene.scenes.length > 0) {
      // Copy all shots from the original scene
      scene.scenes.forEach(shot => {
        dispatch({
          type: "ADD_SCENE",
          payload: {
            projectId: project.id,
            storyId: newStoryId,
            description: shot.description,
            prompt: shot.prompt,
            durationInSeconds: shot.durationInSeconds,
            imageUrl: shot.imageUrl,
            videoUrl: shot.videoUrl,
            audioUrl: shot.audioUrl
          }
        });
      });
      
      toast.success("Scene duplicated with all shots");
    }
  };
  
  // Radio-style toggle handling
  const handleSceneToggle = (sceneId: string) => {
    const scene = project.stories.find(s => s.id === sceneId);
    if (scene) {
      onSceneSelect(scene);
    }
  };
  
  return (
    <ScrollArea className={`${showInTimeline ? 'h-24' : 'h-32'} w-full bg-runway-card rounded-sm`}>
      <div className="flex space-x-2 p-1">
        <ToggleGroup 
          type="single" 
          value={activeSceneId} 
          onValueChange={(value) => {
            if (value) handleSceneToggle(value);
          }}
          className="flex gap-2"
        >
          {project.stories.map((scene) => (
            <ContextMenu key={scene.id}>
              <ContextMenuTrigger>
                <ToggleGroupItem 
                  value={scene.id}
                  className={`min-w-32 ${showInTimeline ? 'h-16' : 'h-24'} p-0 rounded-none border-0 data-[state=on]:bg-transparent`}
                >
                  <Card 
                    className={`w-full h-full flex flex-col cursor-pointer transition-all ${
                      scene.id === activeSceneId 
                        ? 'border-2 border-runway-blue' 
                        : 'border border-runway-glass-border'
                    } ${
                      isDragging && draggedScene === scene.id
                        ? 'opacity-50'
                        : 'opacity-100'
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, scene.id)}
                    onDragOver={(e) => handleDragOver(e, scene.id)}
                    onDrop={(e) => handleDrop(e, scene.id)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="flex items-center justify-between p-2 bg-runway-input rounded-t">
                      <span className="text-xs font-medium truncate flex-1">{scene.title}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 hover:bg-runway-card"
                      >
                        <MoveHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="flex-1 flex items-center justify-center bg-runway-glass p-2 text-center relative">
                      {scene.id === activeSceneId && (
                        <div className="absolute left-2 top-2">
                          <CircleDot className="h-3 w-3 text-runway-blue" />
                        </div>
                      )}
                      
                      {showInTimeline ? (
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Video className="h-3 w-3" />
                          <span>{scene.scenes.length}</span>
                          <ChevronRight className="h-3 w-3" />
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">{scene.scenes.length} shots</span>
                      )}
                    </div>
                    
                    <div className="p-1 bg-runway-input text-xs text-gray-400 rounded-b">
                      {formatDuration(scene.scenes.reduce((total, shot) => total + shot.durationInSeconds, 0))}
                    </div>
                  </Card>
                </ToggleGroupItem>
              </ContextMenuTrigger>
              
              <ContextMenuContent className="w-48 bg-runway-glass backdrop-blur-md border-runway-glass-border">
                <ContextMenuItem 
                  onClick={() => handleDuplicateScene(scene)}
                  className="cursor-pointer"
                >
                  Duplicate Scene
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem 
                  onClick={() => handleDeleteScene(scene.id)}
                  className="text-red-500 focus:text-red-500 cursor-pointer"
                >
                  Delete Scene
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </ToggleGroup>
      </div>
    </ScrollArea>
  );
};

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default ProjectSceneTimeline;
