import React, { useState, useEffect, useRef } from "react";
import { useStoryboard } from "../../contexts/StoryboardContext";
import { useAIService } from "../../contexts/AIServiceContext";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Scene } from "../../types/storyboardTypes";
import { generateImageFromPrompt } from "../../services/imageGenerationService";
import { v4 as uuidv4 } from "uuid";
import { PromptVariation } from "../../types/promptTypes";
import { generateScenesFromStory } from "../../utils/storyUtils";
import { generatePromptForScene } from "../../utils/promptUtils";
import { useNavigate } from "react-router-dom";
import PreviewSection from "./PreviewSection";
import TimelineSection from "./TimelineSection";
import SceneControlsSection from "./SceneControlsSection";
import MediaGallerySection from "./MediaGallerySection";

interface ShotEditorProps {
  onPromptsGenerated?: (prompts: PromptVariation[], basePrompt: string) => void;
  basePrompt?: string;
  promptVariations?: PromptVariation[];
}

const ShotEditor = ({ onPromptsGenerated, basePrompt = "", promptVariations = [] }: ShotEditorProps) => {
  const { 
    activeProject, 
    activeScene, 
    activeShot, 
    setActiveShot, 
    setActiveScene,
    dispatch 
  } = useStoryboard();
  const { selectedService } = useAIService();
  const navigate = useNavigate();
  
  const [shots, setShots] = useState<Scene[]>([]);
  const [prompt, setPrompt] = useState("");
  const [description, setDescription] = useState("");
  const [sceneTitle, setSceneTitle] = useState("");
  const [sceneDescription, setSceneDescription] = useState("");
  const [duration, setDuration] = useState(10);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [globalDuration, setGlobalDuration] = useState(0);
  const [masterVolume, setMasterVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCreatingShots, setIsCreatingShots] = useState(false);
  const [activeControlMode, setActiveControlMode] = useState<'scene' | 'shot'>('scene');
  
  const [previewSectionOpen, setPreviewSectionOpen] = useState(false);
  const [previewSectionSize, setPreviewSectionSize] = useState(60);
  const [timelineSectionOpen, setTimelineSectionOpen] = useState(true);
  const [sceneControlsOpen, setSceneControlsOpen] = useState(true);
  const [mediaGalleryOpen, setMediaGalleryOpen] = useState(true);
  
  const shotListRef = useRef<HTMLDivElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (activeScene) {
      setShots(activeScene.scenes);
      setSceneTitle(activeScene.title);
      setSceneDescription(activeScene.description);
      setGlobalDuration(activeScene.totalDuration || 
        activeScene.scenes.reduce((total, scene) => total + scene.durationInSeconds, 0));
    }
  }, [activeScene]);
  
  useEffect(() => {
    if (activeShot) {
      setPrompt(activeShot.prompt || "");
      setDescription(activeShot.description || "");
      setDuration(activeShot.durationInSeconds || 10);
      setActiveControlMode('shot');
    } else if (activeScene) {
      setActiveControlMode('scene');
    } else {
      setPrompt("");
      setDescription("");
      setDuration(10);
    }
  }, [activeShot, activeScene]);
  
  const handleAddShot = () => {
    if (!activeProject || !activeScene) return;
    
    dispatch({
      type: "ADD_SCENE",
      payload: {
        projectId: activeProject.id,
        storyId: activeScene.id,
        description: "New shot"
      }
    });
    
    setTimeout(() => {
      if (shotListRef.current) {
        shotListRef.current.scrollTop = shotListRef.current.scrollHeight;
      }
    }, 100);
  };

  const handleAddAudio = () => {
    if (audioInputRef.current) {
      audioInputRef.current.click();
    }
  };

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !activeProject || !activeScene) return;
    
    const file = files[0];
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result && activeScene) {
        const audioUrl = event.target.result as string;
        
        dispatch({
          type: "UPDATE_STORY",
          payload: {
            projectId: activeProject.id,
            story: { ...activeScene, audioTrack: audioUrl }
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
  
  const handleShotClick = (shot: Scene) => {
    setActiveShot(shot);
    setActiveControlMode('shot');
  };

  const handleSceneTrackClick = () => {
    setActiveShot(null);
    setActiveControlMode('scene');
  };
  
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    if (activeShot && activeProject && activeScene) {
      dispatch({
        type: "UPDATE_SCENE",
        payload: {
          projectId: activeProject.id,
          storyId: activeScene.id,
          scene: { ...activeShot, prompt: e.target.value }
        }
      });
      setActiveShot({ ...activeShot, prompt: e.target.value });
    }
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    if (activeShot && activeProject && activeScene) {
      dispatch({
        type: "UPDATE_SCENE",
        payload: {
          projectId: activeProject.id,
          storyId: activeScene.id,
          scene: { ...activeShot, description: e.target.value }
        }
      });
      setActiveShot({ ...activeShot, description: e.target.value });
    }
  };

  const handleSceneTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSceneTitle(e.target.value);
    if (activeProject && activeScene) {
      const updatedScene = {
        ...activeScene,
        title: e.target.value
      };
      
      dispatch({
        type: "UPDATE_STORY",
        payload: {
          projectId: activeProject.id,
          story: updatedScene
        }
      });
    }
  };

  const handleSceneDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSceneDescription(e.target.value);
    if (activeProject && activeScene) {
      const updatedScene = {
        ...activeScene,
        description: e.target.value
      };
      
      dispatch({
        type: "UPDATE_STORY",
        payload: {
          projectId: activeProject.id,
          story: updatedScene
        }
      });
    }
  };
  
  const handleDurationChange = (value: number[]) => {
    const newDuration = value[0];
    setDuration(newDuration);
    if (activeShot && activeProject && activeScene) {
      dispatch({
        type: "UPDATE_SCENE",
        payload: {
          projectId: activeProject.id,
          storyId: activeScene.id,
          scene: { ...activeShot, durationInSeconds: newDuration }
        }
      });
      setActiveShot({ ...activeShot, durationInSeconds: newDuration });
    }
  };

  const handleGlobalDurationChange = (value: number[]) => {
    const newDuration = value[0];
    setGlobalDuration(newDuration);
    
    if (activeProject && activeScene && shots.length > 0) {
      const updatedStory = {
        ...activeScene,
        totalDuration: newDuration
      };
      
      dispatch({
        type: "UPDATE_STORY",
        payload: {
          projectId: activeProject.id,
          story: updatedStory
        }
      });
      
      const shotsCount = shots.length;
      const durationPerShot = Math.floor(newDuration / shotsCount);
      const remainder = newDuration % shotsCount;
      
      const updatedShots = shots.map((shot, index) => {
        const shotDuration = index === 0 
          ? durationPerShot + remainder 
          : durationPerShot;
          
        return {
          ...shot,
          durationInSeconds: shotDuration
        };
      });
      
      updatedShots.forEach(shot => {
        dispatch({
          type: "UPDATE_SCENE",
          payload: {
            projectId: activeProject.id,
            storyId: activeScene.id,
            scene: shot
          }
        });
      });
      
      if (activeShot) {
        const updatedActiveShot = updatedShots.find(shot => shot.id === activeShot.id);
        if (updatedActiveShot) {
          setActiveShot(updatedActiveShot);
          setDuration(updatedActiveShot.durationInSeconds);
        }
      }
    }
  };
  
  const handleImageGeneration = async () => {
    if (!activeShot || !activeProject || !activeScene) return;
    
    if (!prompt.trim()) {
      toast.error("Please enter a prompt for image generation");
      return;
    }
    
    setIsGeneratingImage(true);
    
    try {
      const imageUrl = await generateImageFromPrompt(prompt, selectedService.id);
      
      if (activeShot && activeShot.videoUrl) {
        dispatch({
          type: "UPDATE_SCENE",
          payload: {
            projectId: activeProject.id,
            storyId: activeScene.id,
            scene: { ...activeShot, imageUrl: imageUrl, videoUrl: null }
          }
        });
      } else {
        dispatch({
          type: "UPDATE_SCENE",
          payload: {
            projectId: activeProject.id,
            storyId: activeScene.id,
            scene: { ...activeShot, imageUrl }
          }
        });
      }
      
      setActiveShot({ ...activeShot, imageUrl });
      toast.success("Image generated successfully!");
    } catch (error) {
      console.error("Failed to generate image:", error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setIsGeneratingImage(false);
    }
  };
  
  const handleVideoGenerated = (videoUrl: string) => {
    if (activeShot && activeProject && activeScene) {
      dispatch({
        type: "UPDATE_SCENE",
        payload: {
          projectId: activeProject.id,
          storyId: activeScene.id,
          scene: { ...activeShot, videoUrl }
        }
      });
      
      setActiveShot({ ...activeShot, videoUrl });
    }
  };
  
  const handleBackToPrevious = () => {
    navigate(-1);
  };
  
  const handleShotAreaDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      
      if (data.type === 'gallery-media' && activeShot && activeProject && activeScene) {
        if (data.mediaType === 'image') {
          dispatch({
            type: "UPDATE_SCENE",
            payload: {
              projectId: activeProject.id,
              storyId: activeScene.id,
              scene: { ...activeShot, imageUrl: data.mediaUrl }
            }
          });
          setActiveShot({ ...activeShot, imageUrl: data.mediaUrl });
          toast.success("Image added to shot");
        } else if (data.mediaType === 'video') {
          dispatch({
            type: "UPDATE_SCENE",
            payload: {
              projectId: activeProject.id,
              storyId: activeScene.id,
              scene: { ...activeShot, videoUrl: data.mediaUrl }
            }
          });
          setActiveShot({ ...activeShot, videoUrl: data.mediaUrl });
          toast.success("Video added to shot");
        } else if (data.mediaType === 'audio') {
          dispatch({
            type: "UPDATE_SCENE",
            payload: {
              projectId: activeProject.id,
              storyId: activeScene.id,
              scene: { ...activeShot, audioUrl: data.mediaUrl }
            }
          });
          setActiveShot({ ...activeShot, audioUrl: data.mediaUrl });
          toast.success("Audio added to shot");
        }
      }
    } catch (error) {
      console.error("Error handling drop:", error);
    }
  };
  
  const handleSceneAudioDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      
      if (data.type === 'gallery-media' && 
          data.mediaType === 'audio' && 
          activeProject && 
          activeScene) {
        
        const updatedScene = {
          ...activeScene,
          audioTrack: data.mediaUrl
        };
        
        dispatch({
          type: "UPDATE_STORY",
          payload: {
            projectId: activeProject.id,
            story: updatedScene
          }
        });
        
        toast.success("Audio track added to scene");
      }
    } catch (error) {
      console.error("Error handling audio drop:", error);
    }
  };

  const handlePlayPauseChange = () => {
    const newPlayingState = !isPlaying;
    setIsPlaying(newPlayingState);
    
    if (newPlayingState) {
      const intervalId = setInterval(() => {
        setCurrentTime(prevTime => {
          if (prevTime >= globalDuration) {
            setIsPlaying(false);
            clearInterval(intervalId);
            return 0;
          }
          return prevTime + 0.1;
        });
      }, 100);
      
      return () => clearInterval(intervalId);
    }
  };
  
  const handleTimeChange = (time: number) => {
    setCurrentTime(time);
  };
  
  const handleStop = () => {
    setCurrentTime(0);
    if (isPlaying) {
      setIsPlaying(false);
    }
  };
  
  const handleAutoCreateShots = async () => {
    if (!activeProject || !activeScene) return;
    
    if (!activeScene.description.trim()) {
      toast.error("Scene needs a description before generating shots");
      return;
    }
    
    if (activeScene.scenes.length > 0) {
      if (!window.confirm("This will replace all existing shots. Are you sure you want to continue?")) {
        return;
      }
      
      activeScene.scenes.forEach(shot => {
        dispatch({
          type: "DELETE_SCENE",
          payload: {
            projectId: activeProject.id,
            storyId: activeScene.id,
            sceneId: shot.id
          }
        });
      });
    }
    
    setIsCreatingShots(true);
    
    try {
      const totalDurationInMinutes = 1;
      
      const generatedShots = generateScenesFromStory(
        activeScene.description,
        totalDurationInMinutes
      );
      
      for (const shotInfo of generatedShots) {
        const generatedPrompt = generatePromptForScene(shotInfo.description);
        
        dispatch({
          type: "ADD_SCENE",
          payload: {
            projectId: activeProject.id,
            storyId: activeScene.id,
            description: shotInfo.description,
            durationInSeconds: shotInfo.durationInSeconds,
            prompt: generatedPrompt
          }
        });
        
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      toast.success(`Generated ${generatedShots.length} shots successfully!`);
    } catch (error) {
      console.error("Error generating shots:", error);
      toast.error("Failed to generate shots. Please try again.");
    } finally {
      setIsCreatingShots(false);
    }
  };

  const handleAddNewScene = () => {
    if (!activeProject) return;
    
    const newSceneId = dispatch({
      type: "ADD_STORY",
      payload: {
        projectId: activeProject.id,
        title: "New Scene",
        description: ""
      }
    }) as string;
    
    toast.success("New scene added successfully!");
  };

  if (!activeProject || !activeScene) return null;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-400 hover:text-white"
          onClick={handleBackToPrevious}
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <h2 className="text-xl font-medium text-white">{activeScene.title}</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Total Duration:</span>
          <div className="flex items-center gap-2 w-52">
            <Slider
              value={[globalDuration]}
              min={1}
              max={300} 
              step={1}
              onValueChange={handleGlobalDurationChange}
              className="flex-1"
            />
            <div className="w-14 text-center font-mono bg-runway-input rounded py-1 text-sm">
              {globalDuration}s
            </div>
          </div>
        </div>
      </div>
      
      <PreviewSection
        open={previewSectionOpen}
        onOpenChange={setPreviewSectionOpen}
        sectionSize={previewSectionSize}
        onSizeChange={setPreviewSectionSize}
        story={activeScene}
        scenes={shots}
        masterVolume={masterVolume}
        setMasterVolume={setMasterVolume}
        currentTime={currentTime}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPauseChange}
        onSeek={handleTimeChange}
      />
      
      <TimelineSection
        open={timelineSectionOpen}
        onOpenChange={setTimelineSectionOpen}
        story={activeScene}
        scenes={shots}
        activeSceneId={activeShot?.id || null}
        onSceneClick={handleShotClick}
        onSceneTrackClick={handleSceneTrackClick}
        currentTime={currentTime}
        isPlaying={isPlaying}
        onTimeChange={handleTimeChange}
        onPlayPauseChange={handlePlayPauseChange}
        onAddScene={handleAddShot}
        onAutoCreateScenes={handleAutoCreateShots}
        onAddAudio={handleAddAudio}
        isCreatingScenes={isCreatingShots}
        onStoryAudioDrop={handleSceneAudioDrop}
        onAddNewScene={handleAddNewScene}
      />
      
      <div 
        className="grid grid-cols-1 md:grid-cols-5 gap-6"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleShotAreaDrop}
      >
        <SceneControlsSection
          open={sceneControlsOpen}
          onOpenChange={setSceneControlsOpen}
          activeScene={activeShot}
          activeStory={activeScene}
          description={description}
          prompt={prompt}
          sceneTitle={sceneTitle}
          sceneDescription={sceneDescription}
          duration={duration}
          isGeneratingImage={isGeneratingImage}
          selectedServiceName={selectedService.name}
          isCreatingShots={isCreatingShots}
          onDescriptionChange={handleDescriptionChange}
          onPromptChange={handlePromptChange}
          onSceneTitleChange={handleSceneTitleChange}
          onSceneDescriptionChange={handleSceneDescriptionChange}
          onDurationChange={handleDurationChange}
          onImageGeneration={handleImageGeneration}
          onVideoGenerated={handleVideoGenerated}
          onAddScene={handleAddShot}
          onAutoCreateShots={handleAutoCreateShots}
          activeControlMode={activeControlMode}
        />
        
        <MediaGallerySection
          open={mediaGalleryOpen}
          onOpenChange={setMediaGalleryOpen}
        />
      </div>
      
      <input
        type="file"
        accept="audio/*"
        ref={audioInputRef}
        className="hidden"
        onChange={handleAudioFileChange}
      />
    </div>
  );
};

export default ShotEditor;
