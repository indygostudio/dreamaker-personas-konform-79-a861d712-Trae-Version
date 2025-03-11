import { Button } from "@/components/ui/button";
import { 
  Disc, 
  AudioLines, 
  Settings2, 
  Volume1,
  VolumeX,
  Wand2 
} from "lucide-react";

interface ChannelControlsProps {
  isMuted: boolean;
  isSolo: boolean;
  isRecording: boolean;
  isAutomationEnabled: boolean;
  onMuteToggle: () => void;
  onSoloToggle: () => void;
  onRecordToggle: () => void;
  onAutomationToggle: () => void;
  onGenerate: () => void;
}

export const ChannelControls = ({
  isMuted,
  isSolo,
  isRecording,
  isAutomationEnabled,
  onMuteToggle,
  onSoloToggle,
  onRecordToggle,
  onAutomationToggle,
  onGenerate
}: ChannelControlsProps) => {
  return (
    <div className="flex justify-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className={`${isMuted ? 'text-red-500' : 'text-gray-400'} hover:text-konform-neon-orange`}
        onClick={onMuteToggle}
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume1 className="h-4 w-4" />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`${isSolo ? 'text-konform-neon-orange' : 'text-gray-400'} hover:text-konform-neon-orange`}
        onClick={onSoloToggle}
      >
        <Disc className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`${isRecording ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
        onClick={onRecordToggle}
      >
        <AudioLines className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`${isAutomationEnabled ? 'text-konform-neon-blue' : 'text-gray-400'} hover:text-konform-neon-blue`}
        onClick={onAutomationToggle}
      >
        <Settings2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="text-konform-neon-orange hover:text-konform-neon-blue"
        onClick={onGenerate}
      >
        <Wand2 className="h-4 w-4" />
      </Button>
    </div>
  );
};