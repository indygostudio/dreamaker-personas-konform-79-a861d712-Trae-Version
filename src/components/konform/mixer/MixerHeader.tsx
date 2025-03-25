import { Button } from "@/components/ui/button";
import { RefreshCw, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { MixerPresetButton } from "./MixerPresetButton";

interface MixerHeaderProps {
  currentMixer: any;
  mixerPersonas: any[];
  onMixerChange: (mixerId: string) => void;
  currentMixerState?: any;
  onLoadPreset?: (mixerState: any) => void;
}

export const MixerHeader = ({ 
  currentMixer, 
  mixerPersonas, 
  onMixerChange,
  currentMixerState = {},
  onLoadPreset = () => {}
}: MixerHeaderProps) => {
  const navigate = useNavigate();

  const navigateToMixerPersonas = () => {
    navigate('/dreamaker', { 
      state: { 
        searchQuery: 'Mixer',
        sortBy: 'artist_category'
      }
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
          <div className="w-2 h-2 bg-konform-neon-blue rounded-full mr-2 animate-neon-pulse" />
          Project Mixer
        </h2>
        <p className="text-konform-neon-blue/80 flex items-center gap-2">
          <span className="inline-block w-16 h-1 bg-gradient-to-r from-konform-neon-blue to-konform-neon-orange rounded-full" />
          Mix and arrange your tracks
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <MixerPresetButton 
          currentMixerState={currentMixerState}
          onLoadPreset={onLoadPreset}
        />
        {currentMixer ? (
          <div 
            className="flex items-center gap-3 p-3 bg-[#00FF00]/5 rounded-lg border border-[#00FF00]/20 cursor-pointer hover:bg-[#00FF00]/10 transition-colors"
            onClick={navigateToMixerPersonas}
          >
            <Avatar className="w-10 h-10 border-2 border-[#00FF00]/20">
              <AvatarImage src={currentMixer.avatar_url} alt={currentMixer.name} />
              <AvatarFallback className="bg-[#1A1A1A] text-[#00FF00]">
                {currentMixer.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-white font-medium">{currentMixer.name}</div>
              <div className="text-sm text-[#00FF00]/60">Current Mixer</div>
            </div>
          </div>
        ) : (
          <div 
            className="flex items-center gap-3 p-3 bg-[#00FF00]/5 rounded-lg border border-[#00FF00]/20 cursor-pointer hover:bg-[#00FF00]/10 transition-colors"
            onClick={navigateToMixerPersonas}
          >
            <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border-2 border-[#00FF00]/20 flex items-center justify-center">
              <UserRound className="w-6 h-6 text-[#00FF00]/60" />
            </div>
            <div>
              <div className="text-white font-medium">No Mixer Selected</div>
              <div className="text-sm text-[#00FF00]/60">Select a mixer</div>
            </div>
          </div>
        )}
        
        <Button 
          variant="outline" 
          className="border-[#00FF00]/20 hover:border-[#00FF00]/40 hover:bg-[#00FF00]/5"
          onClick={() => {
            if (mixerPersonas && mixerPersonas.length > 0) {
              const currentIndex = mixerPersonas.findIndex(p => p.id === currentMixer?.id);
              const nextIndex = (currentIndex + 1) % mixerPersonas.length;
              onMixerChange(mixerPersonas[nextIndex].id);
            }
          }}
        >
          <RefreshCw className="w-4 h-4 mr-2 text-[#00FF00]" />
          <span className="text-[#00FF00]">Swap Mixer</span>
        </Button>
      </div>
    </div>
  );
};