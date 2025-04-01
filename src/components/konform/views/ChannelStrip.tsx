import { Channel } from './MixbaseView';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface ChannelStripProps {
  channel: Channel;
  onVolumeChange: (value: number) => void;
  onPanChange: (value: number) => void;
  onMute: () => void;
  onSolo: () => void;
}

export const ChannelStrip = ({
  channel,
  onVolumeChange,
  onPanChange,
  onMute,
  onSolo
}: ChannelStripProps) => {
  return (
    <div className="flex flex-col w-24 bg-black/20 rounded-lg p-2 gap-2">
      <div className="text-sm text-white truncate">{channel.name}</div>
      
      <div className="flex-1 flex flex-col gap-2">
        {/* Volume Slider */}
        <div className="h-32 flex items-center justify-center">
          <Slider
            orientation="vertical"
            value={[channel.volume]}
            onValueChange={([value]) => onVolumeChange(value)}
            min={0}
            max={100}
            step={1}
            className="h-full"
          />
        </div>

        {/* Pan Slider */}
        <Slider
          value={[channel.pan]}
          onValueChange={([value]) => onPanChange(value)}
          min={-50}
          max={50}
          step={1}
          className="w-full"
        />

        {/* Mute/Solo Buttons */}
        <div className="flex justify-center gap-2">
          <Button
            size="sm"
            variant={channel.isMuted ? "destructive" : "outline"}
            onClick={onMute}
            className="w-8 h-8 p-0"
          >
            M
          </Button>
          <Button
            size="sm"
            variant={channel.isSolo ? "secondary" : "outline"}
            onClick={onSolo}
            className="w-8 h-8 p-0"
          >
            S
          </Button>
        </div>
      </div>
    </div>
  );
};