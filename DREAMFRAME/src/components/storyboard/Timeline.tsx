
import React, { useState, useRef, useEffect } from "react";
import { Scene, SceneContainer } from "../../types/storyboardTypes";
import { useStoryboard } from "../../contexts/StoryboardContext";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import { AudioWaveform, Play, Pause, Volume2, VolumeX, ZoomIn, ZoomOut, Upload, Music, Trash2, Copy, Move, Edit, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import ProjectSceneTimeline from "./ProjectSceneTimeline";
import { Input } from "@/components/ui/input";
import { 
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator
} from "@/components/ui/context-menu";

interface TimelineProps {
  story: SceneContainer;
  scenes: Scene[];
  activeSceneId: string | null;
  onSceneClick: (scene: Scene) => void;
  onSceneTrackClick: (scene: SceneContainer) => void;
  currentTime?: number;
  isPlaying?: boolean;
  onTimeChange?: (time: number) => void;
  onPlayPauseChange?: () => void;
  onStop?: () => void;
}

const Timeline: React.FC<TimelineProps> = ({ 
  story, 
  scenes, 
  activeSceneId,
  onSceneClick,
  onSceneTrackClick,
  currentTime: externalCurrentTime,
  isPlaying: externalIsPlaying,
  onTimeChange,
  onPlayPauseChange,
  onStop
}) => {
  const { activeProject, dispatch, setActiveScene } = useStoryboard();
  const [internalIsPlaying, setInternalIsPlaying] = useState(false);
  const [internalCurrentTime, setInternalCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100); // 100% is default zoom
  const [volume, setVolume] = useState(50); // 50% default volume
  const [draggingScene, setDraggingScene] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [editingSceneId, setEditingSceneId] = useState<string | null>(null);
  const [editedSceneName, setEditedSceneName] = useState("");
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  
  const isPlaying = externalIsPlaying !== undefined ? externalIsPlaying : internalIsPlaying;
  const currentTime = externalCurrentTime !== undefined ? externalCurrentTime : internalCurrentTime;
  
  const totalDuration = story.totalDuration || 
    scenes.reduce((total, scene) => total + scene.durationInSeconds, 0);
  
  const scenesWithOffsets = scenes.map((scene, index) => {
    const startTimeOffset = scenes
      .slice(0, index)
      .reduce((total, s) => total + s.durationInSeconds, 0);
    
    return {
      ...scene,
      startTimeOffset
    };
  });
  
  const togglePlayback = () => {
    if (onPlayPauseChange) {
      onPlayPauseChange();
    } else {
      const newPlayingState = !isPlaying;
      setInternalIsPlaying(newPlayingState);
      
      if (newPlayingState) {
        if (intervalId) clearInterval(intervalId);
        
        const newIntervalId = setInterval(() => {
          setInternalCurrentTime(prev => {
            const newTime = prev + 0.1;
            if (newTime >= totalDuration) {
              setInternalIsPlaying(false);
              clearInterval(newIntervalId);
              setIntervalId(null);
              return 0;
            }
            return newTime;
          });
        }, 100);
        
        setIntervalId(newIntervalId);
      } else if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    }
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.error("Audio playback error:", err));
      }
    }
  };

  const handleStop = () => {
    if (onStop) {
      onStop();
    } else {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      setInternalIsPlaying(false);
      setInternalCurrentTime(0);
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };
  
  const handleResizeStart = (sceneId: string) => {
    setIsDragging(sceneId);
  };
  
  const handleResizeEnd = () => {
    setIsDragging(null);
  };
  
  const handleResize = (sceneId: string, newWidth: number) => {
    if (!activeProject || !story) return;
    
    const timelineWidth = timelineRef.current?.clientWidth || 1;
    const pixelsPerSecond = (timelineWidth / totalDuration) * (zoomLevel / 100);
    
    const newDuration = Math.max(1, Math.round(newWidth / pixelsPerSecond));
    
    dispatch({
      type: "ADJUST_SCENE_DURATIONS",
      payload: {
        projectId: activeProject.id,
        storyId: story.id,
        changedSceneId: sceneId,
        newDuration
      }
    });
  };
  
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);
  
  useEffect(() => {
    if (isPlaying && externalCurrentTime === undefined && !intervalId) {
      const newIntervalId = setInterval(() => {
        setInternalCurrentTime(prev => {
          const newTime = prev + 0.1;
          if (newTime >= totalDuration) {
            setInternalIsPlaying(false);
            clearInterval(newIntervalId);
            setIntervalId(null);
            return 0;
          }
          return newTime;
        });
      }, 100);
      
      setIntervalId(newIntervalId);
    } else if (!isPlaying && intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying, externalCurrentTime, totalDuration, intervalId]);

  useEffect(() => {
    if (audioRef.current && Math.abs(audioRef.current.currentTime - currentTime) > 0.5) {
      audioRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error("Audio playback error:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    // Focus on input when in edit mode
    if (editingSceneId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingSceneId]);
  
  const getActiveSceneFromTime = (time: number) => {
    return scenesWithOffsets.find(scene => 
      time >= scene.startTimeOffset && 
      time < (scene.startTimeOffset + scene.durationInSeconds)
    );
  };
  
  const playheadPosition = () => {
    if (!timelineRef.current) return 0;
    const timelineWidth = timelineRef.current.clientWidth;
    return (currentTime / totalDuration) * timelineWidth;
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 20, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 20, 50));
  };

  const handleZoomChange = (value: number[]) => {
    setZoomLevel(value[0]);
  };

  const handleMediaUpload = (sceneId: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('data-scene-id', sceneId);
      fileInputRef.current.click();
    }
  };

  const handleAudioUpload = () => {
    if (audioInputRef.current) {
      audioInputRef.current.click();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const sceneId = fileInputRef.current?.getAttribute('data-scene-id') || '';
    
    if (!sceneId || !activeProject || !story) {
      toast.error("Could not identify the target scene");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const mediaUrl = event.target.result as string;
        const scene = scenes.find(s => s.id === sceneId);
        
        if (scene) {
          const fileType = file.type.split('/')[0];
          
          if (fileType === 'image') {
            dispatch({
              type: "UPDATE_SCENE",
              payload: {
                projectId: activeProject.id,
                storyId: story.id,
                scene: { ...scene, imageUrl: mediaUrl }
              }
            });
            toast.success("Image uploaded to scene");
          } else if (fileType === 'video') {
            dispatch({
              type: "UPDATE_SCENE",
              payload: {
                projectId: activeProject.id,
                storyId: story.id,
                scene: { ...scene, videoUrl: mediaUrl }
              }
            });
            toast.success("Video uploaded to scene");
          }
        }
      }
    };
    
    reader.readAsDataURL(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAudioFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    if (!activeProject || !story) {
      toast.error("Project or story not found");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const audioUrl = event.target.result as string;
        
        dispatch({
          type: "UPDATE_STORY",
          payload: {
            projectId: activeProject.id,
            story: { ...story, audioTrack: audioUrl }
          }
        });
        
        toast.success("Audio track added to timeline");
      }
    };
    
    reader.readAsDataURL(file);
    
    if (audioInputRef.current) {
      audioInputRef.current.value = '';
    }
  };

  const handleDeleteScene = (sceneId: string) => {
    if (!activeProject || !story) return;
    
    dispatch({
      type: "DELETE_SCENE",
      payload: {
        projectId: activeProject.id,
        storyId: story.id,
        sceneId
      }
    });
    
    toast.success("Scene removed");
  };

  const handleCopyScene = (scene: Scene) => {
    if (!activeProject || !story) return;
    
    dispatch({
      type: "ADD_SCENE",
      payload: {
        projectId: activeProject.id,
        storyId: story.id,
        description: `Copy of ${scene.description}`,
        prompt: scene.prompt,
        durationInSeconds: scene.durationInSeconds,
        videoUrl: scene.videoUrl,
        audioUrl: scene.audioUrl
      }
    });
    
    toast.success("Scene copied");
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const clickPercentage = clickPosition / rect.width;
    const newTime = totalDuration * clickPercentage;
    
    if (onTimeChange) {
      onTimeChange(newTime);
    } else {
      setInternalCurrentTime(newTime);
    }
    
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, sceneId: string) => {
    e.dataTransfer.setData("text/plain", sceneId);
    setDraggingScene(sceneId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    
    const sceneId = e.dataTransfer.getData("text/plain");
    if (!sceneId || !activeProject || !story) return;
    
    const sourceIndex = scenes.findIndex(s => s.id === sceneId);
    if (sourceIndex === -1) return;
    
    const newScenes = [...scenes];
    const [movedScene] = newScenes.splice(sourceIndex, 1);
    newScenes.splice(dropIndex, 0, movedScene);
    
    dispatch({
      type: "REORDER_SCENES",
      payload: {
        projectId: activeProject.id,
        storyId: story.id,
        sceneIds: newScenes.map(s => s.id)
      }
    });
    
    setDraggingScene(null);
    setDragOverIndex(null);
    
    toast.success("Scene order updated");
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    setDraggingScene(null);
    setDragOverIndex(null);
  };

  const handleRemoveSceneImage = (sceneId: string) => {
    if (!activeProject || !story) return;
    
    const scene = scenes.find(s => s.id === sceneId);
    
    if (scene) {
      dispatch({
        type: "UPDATE_SCENE",
        payload: {
          projectId: activeProject.id,
          storyId: story.id,
          scene: { ...scene, imageUrl: null, videoUrl: null }
        }
      });
      
      toast.success("Image removed from scene");
    }
  };

  const handleRenameScene = (sceneId: string) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (scene) {
      setEditingSceneId(sceneId);
      setEditedSceneName(scene.description || "");
    }
  };

  const handleSceneNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedSceneName(e.target.value);
  };

  const saveSceneName = () => {
    if (!editingSceneId || !activeProject || !story) {
      setEditingSceneId(null);
      return;
    }

    const scene = scenes.find(s => s.id === editingSceneId);
    if (scene) {
      dispatch({
        type: "UPDATE_SCENE",
        payload: {
          projectId: activeProject.id,
          storyId: story.id,
          scene: { ...scene, description: editedSceneName }
        }
      });
      toast.success("Shot renamed");
    }
    setEditingSceneId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveSceneName();
    } else if (e.key === 'Escape') {
      setEditingSceneId(null);
    }
  };

  return (
    <div className="bg-runway-glass border border-runway-glass-border rounded-md p-2 mb-2">
      <div className="mb-4">
        <div className="flex items-center mb-1">
          <span className="text-xs font-medium text-gray-400 ml-1">Timeline Ruler</span>
        </div>
        
        <div 
          className="h-5 flex border-b border-runway-glass-border mb-2"
          onClick={handleTimelineClick}>
          {Array.from({ length: Math.ceil(totalDuration) + 1 }).map((_, i) => (
            <div 
              key={i} 
              className="flex-shrink-0 border-r border-runway-glass-border text-xs text-gray-500 relative"
              style={{ width: `${(100 / totalDuration) * (zoomLevel / 100)}%` }}
            >
              <span className="absolute left-0 top-0 -translate-x-1/2">{i}</span>
            </div>
          ))}
        </div>
        
        <div className="flex items-center mb-1">
          <span className="text-xs font-medium text-gray-400 ml-1">Scenes Track</span>
        </div>
        
        <div className="mb-4">
          {activeProject && (
            <ProjectSceneTimeline 
              project={activeProject}
              activeSceneId={story?.id}
              onSceneSelect={setActiveScene}
              onSceneTrackClick={onSceneTrackClick}
              showInTimeline={true}
            />
          )}
        </div>
        
        <div className="flex items-center mb-1">
          <span className="text-xs font-medium text-gray-400 ml-1">Shots Track</span>
        </div>
        
        <div 
          ref={timelineRef} 
          className="relative h-20"
          onClick={handleTimelineClick}
        >
          <ResizablePanelGroup 
            direction="horizontal" 
            className="h-full"
            style={{ width: `${zoomLevel}%` }}
          >
            {scenesWithOffsets.map((scene, index) => (
              <React.Fragment key={scene.id}>
                <ContextMenu>
                  <ContextMenuTrigger>
                    <div className={cn(
                      "h-full p-1 transition-colors",
                      activeSceneId === scene.id ? "bg-blue-900/30" : "bg-runway-input",
                      isDragging === scene.id ? "border border-blue-500" : "border border-runway-glass-border",
                      draggingScene === scene.id ? "opacity-50" : "opacity-100",
                      dragOverIndex === index ? "border-2 border-blue-500" : ""
                    )}
                    onClick={() => onSceneClick(scene)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, scene.id)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    >
                      <ResizablePanel 
                        defaultSize={Math.max(5, (scene.durationInSeconds / totalDuration) * 100)}
                        minSize={5}
                        onResize={(size) => handleResize(scene.id, (size / 100) * (timelineRef.current?.clientWidth || 0))}
                      >
                        <div className="h-full relative overflow-hidden rounded-sm group">
                          {scene.imageUrl ? (
                            <img 
                              src={scene.imageUrl} 
                              alt={scene.description} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-runway-card">
                              <span className="text-xs text-gray-400">No image</span>
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs px-1 py-0.5 truncate">
                            {editingSceneId === scene.id ? (
                              <Input
                                ref={editInputRef}
                                value={editedSceneName}
                                onChange={handleSceneNameChange}
                                onBlur={saveSceneName}
                                onKeyDown={handleKeyDown}
                                className="h-5 py-0 text-xs"
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                              />
                            ) : (
                              scene.description || `Shot ${index + 1}`
                            )}
                          </div>

                          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-full bg-black/50 hover:bg-black/80"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMediaUpload(scene.id);
                              }}
                              title="Upload media to this shot"
                            >
                              <Upload className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-full bg-black/50 hover:bg-black/80 cursor-move"
                              title="Drag to reorder"
                            >
                              <Move className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </ResizablePanel>
                    </div>
                  </ContextMenuTrigger>
                  
                  <ContextMenuContent className="w-48 bg-runway-glass backdrop-blur-md border-runway-glass-border">
                    <ContextMenuItem 
                      className="flex items-center cursor-pointer"
                      onClick={() => handleRenameScene(scene.id)}
                    >
                      <Edit className="h-4 w-4 mr-2" /> Rename Shot
                    </ContextMenuItem>
                    <ContextMenuItem 
                      className="flex items-center cursor-pointer"
                      onClick={() => handleCopyScene(scene)}
                    >
                      <Copy className="h-4 w-4 mr-2" /> Copy Shot
                    </ContextMenuItem>
                    <ContextMenuItem 
                      className="flex items-center cursor-pointer"
                      onClick={() => handleMediaUpload(scene.id)}
                    >
                      <Upload className="h-4 w-4 mr-2" /> Replace Media
                    </ContextMenuItem>
                    {scene.imageUrl && (
                      <ContextMenuItem 
                        className="flex items-center cursor-pointer text-amber-500"
                        onClick={() => handleRemoveSceneImage(scene.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Remove Image
                      </ContextMenuItem>
                    )}
                    <ContextMenuSeparator />
                    <ContextMenuItem 
                      className="flex items-center cursor-pointer text-red-500 focus:text-red-500"
                      onClick={() => handleDeleteScene(scene.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Remove Shot
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
                
                {index < scenes.length - 1 && (
                  <ResizableHandle 
                    withHandle 
                    className="z-10 transition-colors"
                    onDragStart={() => handleResizeStart(scene.id)}
                    onDragEnd={handleResizeEnd}
                  />
                )}
              </React.Fragment>
            ))}
          </ResizablePanelGroup>
          
          <div 
            className="absolute top-0 bottom-0 w-px bg-red-500 z-20 pointer-events-none"
            style={{ left: `${playheadPosition()}px` }}
          />
        </div>
        
        <div className="mt-2 h-20 border border-runway-glass-border bg-runway-glass rounded-sm">
          {story.audioTrack ? (
            <div className="h-full flex items-center justify-center relative">
              <AudioWaveform className="text-blue-500 opacity-50 w-full h-10" />
              <audio 
                ref={audioRef} 
                src={story.audioTrack} 
                className="hidden"
                loop={false}
                muted={isMuted}
              />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <span className="text-sm text-gray-400">No audio track</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center mt-4 border-t border-runway-glass-border pt-4">
        <div className="flex space-x-2 mr-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-runway-input"
            onClick={togglePlayback}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-runway-input"
            onClick={handleStop}
          >
            <Square className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-runway-input"
            onClick={toggleMute}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="text-sm font-mono mr-4">
          {formatTime(currentTime)} / {formatTime(totalDuration)}
        </div>

        <div className="flex items-center space-x-2 ml-2">
          <Volume2 className="h-4 w-4 text-gray-400" />
          <Slider
            value={[volume]}
            min={0}
            max={100}
            step={1}
            className="w-24"
            onValueChange={handleVolumeChange}
          />
          <span className="text-xs text-gray-400">{volume}%</span>
        </div>

        <div className="flex items-center space-x-2 ml-auto">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-runway-input"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <div className="w-32">
            <Slider
              value={[zoomLevel]}
              min={50}
              max={200}
              step={5}
              onValueChange={handleZoomChange}
            />
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-runway-input"
            onClick={handleZoomIn}
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          <span className="text-xs text-gray-400 w-12 text-right">{zoomLevel}%</span>
        </div>
      </div>

      <input 
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*,video/*"
        onChange={handleFileSelect}
      />

      <input 
        type="file"
        ref={audioInputRef}
        className="hidden"
        accept="audio/*"
        onChange={handleAudioFileSelect}
      />
    </div>
  );
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default Timeline;
