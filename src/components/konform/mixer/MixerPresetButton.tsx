import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { MixerPresetMenu } from './MixerPresetMenu';

interface MixerPresetButtonProps {
  currentMixerState: any;
  onLoadPreset: (mixerState: any) => void;
}

export const MixerPresetButton = ({ currentMixerState, onLoadPreset }: MixerPresetButtonProps) => {
  const [showPresetMenu, setShowPresetMenu] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="border-[#00FF00]/20 hover:border-[#00FF00]/40 hover:bg-[#00FF00]/5 flex items-center gap-1"
        onClick={() => setShowPresetMenu(!showPresetMenu)}
        ref={buttonRef}
      >
        <span className="text-[#00FF00]">Presets</span>
        <ChevronDown className="h-4 w-4 text-[#00FF00]" />
      </Button>

      {showPresetMenu && (
        <div className="absolute right-0 top-full mt-1 z-50">
          <MixerPresetMenu 
            onClose={() => setShowPresetMenu(false)}
            currentMixerState={currentMixerState}
            onLoadPreset={onLoadPreset}
          />
        </div>
      )}
    </div>
  );
};