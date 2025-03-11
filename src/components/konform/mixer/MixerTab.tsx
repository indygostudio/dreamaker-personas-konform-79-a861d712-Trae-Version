import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TrackItem } from "../daw/Track";
import { MasterVolume } from "./MasterVolume";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Track } from "../daw/Track";

export const MixerTab = () => {
  const [tracks, setTracks] = useState<Track[]>([
    {
      id: 1,
      name: 'Track 1',
      volume: 75,
      isMuted: false,
      mode: 'ai-audio',
      clips: [],
    },
    {
      id: 2,
      name: 'Track 2',
      volume: 70,
      isMuted: false,
      mode: 'ai-audio',
      clips: [],
    },
    {
      id: 3,
      name: 'Track 3',
      volume: 65,
      isMuted: false,
      mode: 'ai-audio',
      clips: [],
    },
    {
      id: 4,
      name: 'Track 4',
      volume: 80,
      isMuted: false,
      mode: 'ai-audio',
      clips: [],
    },
  ]);

  const [masterVolume, setMasterVolume] = useState(80);

  const handleAddTrack = () => {
    const newTrack: Track = {
      id: Math.max(...tracks.map(t => t.id)) + 1,
      name: `Track ${tracks.length + 1}`,
      volume: 75,
      isMuted: false,
      mode: 'ai-audio',
      clips: [],
    };
    setTracks([...tracks, newTrack]);
  };

  return (
    <div className="flex flex-col h-full bg-[#131415]">
      <div className="p-6 h-[calc(100vh-8rem)]">
        <ScrollArea className="h-full">
          <div className="flex items-stretch space-x-2 min-h-[500px]">
            {tracks.map((track) => (
              <div key={track.id} className="flex-shrink-0 w-24">
                <TrackItem
                  track={track}
                  onDelete={(id) => setTracks(tracks.filter(t => t.id !== id))}
                  onDuplicate={(id) => {
                    const trackToDuplicate = tracks.find(t => t.id === id);
                    if (trackToDuplicate) {
                      const newTrack = {
                        ...trackToDuplicate,
                        id: Math.max(...tracks.map(t => t.id)) + 1,
                        name: `${trackToDuplicate.name} (Copy)`
                      };
                      setTracks([...tracks, newTrack]);
                    }
                  }}
                  onModeChange={(id, mode) => {
                    setTracks(tracks.map(t =>
                      t.id === id ? { ...t, mode } : t
                    ));
                  }}
                  onMuteToggle={(id) => {
                    setTracks(tracks.map(t =>
                      t.id === id ? { ...t, isMuted: !t.isMuted } : t
                    ));
                  }}
                />
              </div>
            ))}
            <div className="flex-shrink-0 w-24 flex items-center justify-center">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleAddTrack}
                className="w-12 h-12 rounded-full bg-black/60 border border-konform-neon-blue/30 hover:border-konform-neon-blue text-konform-neon-blue hover:text-konform-neon-orange transition-colors"
              >
                <Plus className="w-6 h-6" />
              </Button>
            </div>
            <div className="flex-shrink-0 w-32">
              <MasterVolume 
                volume={masterVolume}
                onVolumeChange={setMasterVolume}
              />
            </div>
          </div>
          <ScrollBar orientation="horizontal" className="bg-konform-neon-blue/20" />
        </ScrollArea>
      </div>
      <div className="h-16 border-t border-konform-neon-blue/20 bg-black/60 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 h-full">
          <div className="flex items-center space-x-4">
            {/* Transport controls */}
          </div>
          <div className="flex items-center space-x-4 text-konform-neon-blue">
            <span>120 BPM</span>
            <span>4/4</span>
            <span>C Maj</span>
          </div>
        </div>
      </div>
    </div>
  );
};