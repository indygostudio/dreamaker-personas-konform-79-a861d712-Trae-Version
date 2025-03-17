import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface PresetDisplayProps {
  presetName: string;
  patchNumber: number;
  onSelectPreset: (preset: { name: string; patchNumber: number }) => void;
}

interface DrumKit {
  name: string;
  patchNumber: number;
}

// Mock data for demonstration
const DRUM_KITS: DrumKit[] = [
  { name: 'TR-808', patchNumber: 1 },
  { name: 'TR-909', patchNumber: 2 },
  { name: 'Acoustic Kit', patchNumber: 3 },
  { name: 'Electronic Kit', patchNumber: 4 },
  { name: 'Hip Hop Kit', patchNumber: 5 },
];

export const PresetDisplay = ({ presetName, patchNumber, onSelectPreset }: PresetDisplayProps) => {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  return (
    <div className="w-full max-w-[1800px] mx-auto mb-6">
      <div 
        className="bg-black/60 backdrop-blur-md border border-konform-neon-blue/30 rounded-lg p-4 flex items-center justify-between cursor-pointer hover:border-konform-neon-blue/50 transition-all duration-300"
        onClick={() => setIsLibraryOpen(true)}
      >
        <div className="flex items-center space-x-4">
          <div className="text-konform-neon-blue font-mono">
            #{String(patchNumber).padStart(3, '0')}
          </div>
          <div className="text-white font-medium">
            {presetName || 'Select Preset'}
          </div>
        </div>
        <div className="text-konform-neon-blue/60 text-sm">
          Click to browse library
        </div>
      </div>

      <Dialog open={isLibraryOpen} onOpenChange={setIsLibraryOpen}>
        <DialogContent className="bg-[#1A1A1A] border-konform-neon-blue/30">
          <DialogHeader>
            <DialogTitle className="text-white">Drum Kit Library</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-2">
              {DRUM_KITS.map((kit) => (
                <Button
                  key={kit.patchNumber}
                  variant="ghost"
                  className="w-full justify-between hover:bg-konform-neon-blue/10 text-white"
                  onClick={() => {
                    onSelectPreset(kit);
                    setIsLibraryOpen(false);
                  }}
                >
                  <span>{kit.name}</span>
                  <span className="text-konform-neon-blue font-mono">#{String(kit.patchNumber).padStart(3, '0')}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};