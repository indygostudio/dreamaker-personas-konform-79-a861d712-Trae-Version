import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Disc } from "lucide-react";

interface MixerChannelProps {
  track: {
    id: string;
    name: string;
    volume: number;
    pan: number;
    isMuted: boolean;
    isSolo: boolean;
  };
  onVolumeChange: (volume: number) => void;
  onPanChange: (pan: number) => void;
  onMuteToggle: () => void;
  onSoloToggle: () => void;
}

export const MixerChannel = ({
  track,
  onVolumeChange,
  onPanChange,
  onMuteToggle,
  onSoloToggle
}: MixerChannelProps) => {
  return (
    <Card className="p-4 bg-black/60 border-dreamaker-purple/20">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-white mb-2">{track.name}</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Slider
                value={[track.volume]}
                onValueChange={([value]) => onVolumeChange(value)}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className={track.isMuted ? 'text-red-500' : 'text-gray-400'}
                onClick={onMuteToggle}
              >
                {track.isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={track.isSolo ? 'text-konform-neon-orange' : 'text-gray-400'}
                onClick={onSoloToggle}
              >
                <Disc className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mt-2">
            <Slider
              value={[track.pan]}
              onValueChange={([value]) => onPanChange(value)}
              min={-100}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>L</span>
              <span>Pan</span>
              <span>R</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};