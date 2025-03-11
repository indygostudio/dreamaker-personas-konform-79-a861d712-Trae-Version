import { Slider } from "@/components/ui/slider";
import { Volume2 } from "lucide-react";

interface MasterVolumeProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export const MasterVolume = ({ volume, onVolumeChange }: MasterVolumeProps) => {
  return (
    <div className="relative group h-full w-32 flex-shrink-0">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-konform-neon-blue to-konform-neon-orange opacity-30 blur group-hover:opacity-50 transition-opacity rounded-lg" />
      <div className="relative h-full bg-black/40 backdrop-blur-xl rounded-lg border border-konform-neon-blue/30 p-4 flex flex-col">
        <div className="text-center mb-4">
          <span className="text-sm font-medium text-konform-neon-blue">Master</span>
        </div>
        
        <div className="flex-1 flex flex-col">
          {/* Master Fader */}
          <div className="flex-1 w-4 mx-auto">
            <Slider
              orientation="vertical"
              value={[volume]}
              onValueChange={([value]) => onVolumeChange(value)}
              max={100}
              step={1}
              className="h-full [&_[role=slider]]:h-4 [&_[role=slider]]:w-full [&_[role=slider]]:bg-konform-neon-orange"
            />
          </div>

          {/* Master Meter */}
          <div className="mt-4 h-32 w-full bg-black/60 rounded-lg overflow-hidden border border-konform-neon-blue/30">
            <div 
              className="w-full bg-gradient-to-t from-konform-neon-blue to-konform-neon-orange transition-all duration-150"
              style={{ height: `${volume}%` }}
            />
          </div>

          <div className="mt-4 pt-4 border-t border-konform-neon-blue/10">
            <Volume2 className="w-4 h-4 text-konform-neon-orange/70 mx-auto" />
            <div className="flex gap-0.5 mt-2 justify-center">
              {Array.from({ length: 8 }).map((_, i) => (
                <div 
                  key={i}
                  className="w-1 bg-gradient-to-t from-konform-neon-blue to-konform-neon-orange rounded-sm animate-neon-pulse"
                  style={{
                    height: `${Math.random() * 16 + 4}px`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};