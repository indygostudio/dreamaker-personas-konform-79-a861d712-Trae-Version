import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Camera, 
  Save, 
  Clock, 
  Trash2, 
  CheckCircle2,
  Plus
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Channel } from "@/types/konform";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface Snapshot {
  id: string;
  name: string;
  timestamp: number;
  channelStates: Partial<Channel>[];
}

interface MixerSnapshotsProps {
  currentChannels: Channel[];
  onRecallSnapshot: (channelStates: Partial<Channel>[]) => void;
}

export const MixerSnapshots = ({ 
  currentChannels, 
  onRecallSnapshot 
}: MixerSnapshotsProps) => {
  const [snapshots, setSnapshots] = useState<Snapshot[]>(() => {
    const saved = localStorage.getItem('mixer-snapshots');
    return saved ? JSON.parse(saved) : [];
  });
  const [newSnapshotName, setNewSnapshotName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSnapshotId, setSelectedSnapshotId] = useState<string | null>(null);

  const saveSnapshot = () => {
    if (!newSnapshotName.trim()) return;
    
    const newSnapshot: Snapshot = {
      id: `snapshot-${Date.now()}`,
      name: newSnapshotName,
      timestamp: Date.now(),
      channelStates: currentChannels.map(channel => ({
        id: channel.id,
        volume: channel.volume,
        pan: channel.pan,
        isMuted: channel.isMuted,
        isSolo: channel.isSolo,
        automationMode: channel.automationMode,
        isPrefaderMetering: channel.isPrefaderMetering,
        meterMode: channel.meterMode,
        sends: channel.sends,
        groupId: channel.groupId
      }))
    };
    
    const updatedSnapshots = [...snapshots, newSnapshot];
    setSnapshots(updatedSnapshots);
    localStorage.setItem('mixer-snapshots', JSON.stringify(updatedSnapshots));
    setNewSnapshotName("");
    setIsDialogOpen(false);
  };

  const recallSnapshot = (snapshot: Snapshot) => {
    onRecallSnapshot(snapshot.channelStates);
    setSelectedSnapshotId(snapshot.id);
    
    // Clear the selection after showing confirmation
    setTimeout(() => {
      setSelectedSnapshotId(null);
    }, 1500);
  };

  const deleteSnapshot = (id: string) => {
    const updatedSnapshots = snapshots.filter(s => s.id !== id);
    setSnapshots(updatedSnapshots);
    localStorage.setItem('mixer-snapshots', JSON.stringify(updatedSnapshots));
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="border border-konform-neon-blue/20 rounded-lg bg-black/30 p-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-konform-neon-blue">Mixer Snapshots</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-konform-neon-blue/10 border-konform-neon-blue/30 hover:bg-konform-neon-blue/20"
            >
              <Camera className="h-4 w-4 mr-2" />
              New Snapshot
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1A1F2C] border border-konform-neon-blue/30">
            <DialogHeader>
              <DialogTitle>Create Mixer Snapshot</DialogTitle>
              <DialogDescription>
                Save the current state of all mixer settings for later recall.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                value={newSnapshotName}
                onChange={(e) => setNewSnapshotName(e.target.value)}
                placeholder="Snapshot Name"
                className="bg-black/20 border-konform-neon-blue/30"
              />
            </div>
            <DialogFooter>
              <Button onClick={() => setIsDialogOpen(false)} variant="outline">
                Cancel
              </Button>
              <Button 
                onClick={saveSnapshot}
                disabled={!newSnapshotName.trim()}
                className="bg-konform-neon-blue hover:bg-konform-neon-blue/80"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Snapshot
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <ScrollArea className="h-[240px] pr-4">
        {snapshots.length === 0 ? (
          <div className="text-center py-6 text-gray-400 text-sm">
            <Plus className="h-8 w-8 mx-auto mb-2 opacity-20" />
            <p>No snapshots saved yet</p>
            <p className="text-xs mt-1">Create a snapshot to save the current mixer state</p>
          </div>
        ) : (
          <div className="space-y-2">
            {snapshots.map((snapshot) => (
              <div 
                key={snapshot.id} 
                className={`flex items-center justify-between p-2 rounded bg-black/40 border ${
                  selectedSnapshotId === snapshot.id 
                    ? 'border-green-500' 
                    : 'border-konform-neon-blue/10'
                } hover:border-konform-neon-blue/30 transition-colors`}
              >
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{snapshot.name}</span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTimestamp(snapshot.timestamp)}
                  </span>
                </div>
                <div className="flex gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => recallSnapshot(snapshot)}
                        >
                          {selectedSnapshotId === snapshot.id ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <Camera className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Recall Snapshot</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-red-500/70 hover:text-red-500"
                          onClick={() => deleteSnapshot(snapshot.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete Snapshot</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}; 