import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, Clock, X, ArrowRight, PlusCircle } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';

interface MixerSnapshotsProps {
  currentChannels: any[];
  onRecallSnapshot: (channelStates: any[]) => void;
  isCompact?: boolean;
}

export const MixerSnapshots = ({ 
  currentChannels, 
  onRecallSnapshot,
  isCompact = false
}: MixerSnapshotsProps) => {
  const [snapshots, setSnapshots] = useState<Array<{
    id: string;
    name: string;
    date: Date;
    channels: any[];
  }>>(() => {
    try {
      const saved = localStorage.getItem('konform-mixer-snapshots');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert string dates back to Date objects
        return parsed.map((snapshot: any) => ({
          ...snapshot,
          date: new Date(snapshot.date)
        }));
      }
    } catch (error) {
      console.error('Error loading snapshots:', error);
    }
    return [];
  });
  
  const [snapshotName, setSnapshotName] = useState('');
  
  // Save snapshots to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('konform-mixer-snapshots', JSON.stringify(snapshots));
  }, [snapshots]);
  
  const handleCreateSnapshot = () => {
    const name = snapshotName.trim() || `Snapshot ${snapshots.length + 1}`;
    const newSnapshot = {
      id: `snapshot-${Date.now()}`,
      name,
      date: new Date(),
      channels: currentChannels.map(channel => ({
        id: channel.id,
        volume: channel.volume,
        pan: channel.pan,
        isMuted: channel.isMuted,
        isSolo: channel.isSolo
      }))
    };
    
    setSnapshots(prev => [...prev, newSnapshot]);
    setSnapshotName('');
    
    toast({
      title: "Snapshot Created",
      description: `"${name}" snapshot has been saved.`
    });
  };
  
  const handleDeleteSnapshot = (id: string) => {
    setSnapshots(prev => prev.filter(snapshot => snapshot.id !== id));
  };
  
  const handleRecallSnapshot = (snapshot: any) => {
    onRecallSnapshot(snapshot.channels);
  };
  
  // Compact rendering for sidebar
  if (isCompact) {
    return (
      <div className="flex flex-col gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-8 h-8 p-0 bg-konform-neon-orange/30 border border-konform-neon-orange hover:bg-konform-neon-orange/50"
                onClick={handleCreateSnapshot}
              >
                <PlusCircle className="h-4 w-4 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-black border border-konform-neon-orange/50">
              <p>Create New Snapshot</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {snapshots.map((snapshot, index) => (
          <TooltipProvider key={snapshot.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`w-8 h-8 p-0 border border-konform-neon-blue hover:bg-konform-neon-blue/30 ${index % 2 === 0 ? 'bg-black/70' : 'bg-black/40'}`}
                  onClick={() => handleRecallSnapshot(snapshot)}
                >
                  <Camera className="h-4 w-4 text-white" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-black border border-konform-neon-blue/50">
                <p className="font-bold">{snapshot.name}</p>
                <p className="text-xs text-gray-400">{snapshot.date.toLocaleString()}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    );
  }
  
  return (
    <div className="w-full bg-black/60 rounded-md p-2 border border-konform-neon-blue/30">
      <div className="flex items-center space-x-2 mb-2">
        <Input
          value={snapshotName}
          onChange={(e) => setSnapshotName(e.target.value)}
          placeholder="Snapshot name"
          className="h-8 text-xs bg-black border-konform-neon-blue/30 focus:border-konform-neon-blue"
        />
        <Button 
          size="sm" 
          className="bg-konform-neon-orange/30 border border-konform-neon-orange hover:bg-konform-neon-orange/50 h-8 text-white"
          onClick={handleCreateSnapshot}
        >
          <Camera className="h-4 w-4 mr-2" />
          Capture
        </Button>
      </div>
      
      <ScrollArea className="max-h-[150px]">
        <div className="space-y-1.5">
          {snapshots.length === 0 ? (
            <div className="text-xs text-gray-500 text-center py-2">
              No snapshots saved
            </div>
          ) : (
            snapshots.map((snapshot) => (
              <div 
                key={snapshot.id} 
                className="flex items-center justify-between bg-black/70 p-2 rounded-sm border border-konform-neon-blue/20 hover:border-konform-neon-blue/50 transition-colors mb-1"
              >
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-red-500/20"
                    onClick={() => handleDeleteSnapshot(snapshot.id)}
                  >
                    <X className="h-3 w-3 text-red-400 hover:text-red-500" />
                  </Button>
                  <div>
                    <div className="text-xs font-bold text-white">{snapshot.name}</div>
                    <div className="text-[10px] text-gray-400 flex items-center">
                      <Clock className="h-2.5 w-2.5 mr-1" />
                      {snapshot.date.toLocaleTimeString()} {snapshot.date.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 w-6 p-0 border border-konform-neon-orange hover:bg-konform-neon-orange/20"
                  onClick={() => handleRecallSnapshot(snapshot)}
                >
                  <ArrowRight className="h-3.5 w-3.5 text-konform-neon-orange" />
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}; 