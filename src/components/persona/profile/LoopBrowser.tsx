
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Activity, Play, Pause, Music2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Loop {
  id: string;
  title: string;
  audio_url: string;
  tempo?: number;
  musical_key?: string;
  meter?: string;
  sample_name?: string;
  token_cost?: number;
  created_at: string;
}

interface LoopBrowserProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  loops: Loop[];
  isLoading: boolean;
  onAddToPlaylist: (loop: Loop) => Promise<void>;
}

export const LoopBrowser = ({
  isOpen,
  onOpenChange,
  loops,
  isLoading,
  onAddToPlaylist
}: LoopBrowserProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [playingLoopId, setPlayingLoopId] = useState<string | null>(null);
  const [audioElements, setAudioElements] = useState<Record<string, HTMLAudioElement>>({});

  const filteredLoops = loops.filter(loop => 
    loop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (loop.sample_name && loop.sample_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (loop.musical_key && loop.musical_key.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handlePlay = (loopId: string, audioUrl: string) => {
    // Stop any currently playing audio
    if (playingLoopId && audioElements[playingLoopId]) {
      audioElements[playingLoopId].pause();
      audioElements[playingLoopId].currentTime = 0;
    }
    
    // If clicked on the currently playing loop, just stop it
    if (playingLoopId === loopId) {
      setPlayingLoopId(null);
      return;
    }
    
    // Create or get audio element
    let audioElement = audioElements[loopId];
    if (!audioElement) {
      audioElement = new Audio(audioUrl);
      audioElement.addEventListener('ended', () => {
        setPlayingLoopId(null);
      });
      setAudioElements(prev => ({ ...prev, [loopId]: audioElement }));
    }
    
    // Play the audio
    audioElement.play();
    setPlayingLoopId(loopId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(isOpen) => {
      // Stop any playing audio when closing
      if (!isOpen && playingLoopId && audioElements[playingLoopId]) {
        audioElements[playingLoopId].pause();
        audioElements[playingLoopId].currentTime = 0;
        setPlayingLoopId(null);
      }
      onOpenChange(isOpen);
    }}>
      <DialogContent className="bg-gray-900 border-dreamaker-purple/30 text-white max-w-4xl mx-auto h-[80vh] max-h-[800px]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Activity className="h-5 w-5 text-dreamaker-purple" />
            Loop Browser
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, key, or sample name..."
            className="pl-10 bg-gray-800 border-gray-700 text-white"
          />
        </div>
        
        <div className="overflow-y-auto flex-1 h-[calc(100%-8rem)]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="h-8 w-8 border-4 border-dreamaker-purple border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredLoops.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Music2 className="h-16 w-16 mb-4 text-gray-500" />
              <p className="text-lg">No loops found</p>
              <p className="text-sm">Try a different search or add new loops</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredLoops.map(loop => (
                <div key={loop.id} className="bg-black/40 rounded-lg p-3 flex justify-between items-center">
                  <div className="flex-1 mr-2">
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full bg-dreamaker-purple/20 hover:bg-dreamaker-purple/40 text-white"
                        onClick={() => handlePlay(loop.id, loop.audio_url)}
                      >
                        {playingLoopId === loop.id ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <div>
                        <p className="font-medium text-white">{loop.title}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {loop.tempo && (
                            <Badge variant="outline" className="text-xs bg-amber-950/30 text-amber-400 border-amber-500/30">
                              {loop.tempo} BPM
                            </Badge>
                          )}
                          {loop.musical_key && (
                            <Badge variant="outline" className="text-xs bg-blue-950/30 text-blue-400 border-blue-500/30">
                              {loop.musical_key}
                            </Badge>
                          )}
                          {loop.meter && (
                            <Badge variant="outline" className="text-xs bg-purple-950/30 text-purple-400 border-purple-500/30">
                              {loop.meter}
                            </Badge>
                          )}
                          {loop.token_cost !== undefined && loop.token_cost > 0 && (
                            <Badge variant="outline" className="text-xs bg-green-950/30 text-green-400 border-green-500/30">
                              {loop.token_cost} Tokens
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-dreamaker-purple/30 text-dreamaker-purple hover:bg-dreamaker-purple/20"
                    onClick={() => onAddToPlaylist(loop)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
