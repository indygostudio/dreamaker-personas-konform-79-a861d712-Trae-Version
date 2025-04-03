
import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Scene, SceneContainer } from "../../types/storyboardTypes";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import VideoPreview from "./VideoPreview";

interface PreviewSectionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionSize: number;
  onSizeChange: (size: number) => void;
  story: SceneContainer;
  scenes: Scene[];
  masterVolume: number;
  setMasterVolume: (volume: number) => void;
  currentTime: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
}

const PreviewSection: React.FC<PreviewSectionProps> = ({
  open,
  onOpenChange,
  sectionSize,
  onSizeChange,
  story,
  scenes,
  masterVolume,
  setMasterVolume,
  currentTime,
  isPlaying,
  onPlayPause,
  onSeek
}) => {
  const handleStop = () => {
    onSeek(0);
    if (isPlaying) {
      onPlayPause();
    }
  };
  
  return (
    <Collapsible 
      open={open} 
      onOpenChange={onOpenChange}
      className="overflow-hidden"
    >
      <CollapsibleTrigger className="flex w-full justify-between items-center p-3 bg-runway-input hover:bg-runway-card rounded-md">
        <h3 className="text-md font-medium">Preview</h3>
        <div className="flex items-center gap-2">
          {open ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="w-full mt-4">
        <div className="md:grid md:grid-cols-3 gap-4">
          <div className="md:col-span-3 lg:col-span-1">
            <VideoPreview 
              story={story}
              scenes={scenes}
              volume={masterVolume}
              onVolumeChange={setMasterVolume}
              currentTime={currentTime}
              isPlaying={isPlaying}
              onPlayPause={onPlayPause}
              onSeek={onSeek}
              onStop={handleStop}
            />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default PreviewSection;
