
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, PlayCircle, PauseCircle } from "lucide-react";
import { Persona } from '@/types/persona';

interface MusicSectionProps {
  persona: Persona;
  selectedModel?: string;
}

export function MusicSection({ persona, selectedModel = 'default' }: MusicSectionProps) {
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrack, setSelectedTrack] = useState<any | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    loadTracks();
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, [persona.id]);

  useEffect(() => {
    if (selectedTrack?.output_url && !audio) {
      const newAudio = new Audio(selectedTrack.output_url);
      newAudio.addEventListener('ended', () => setIsPlaying(false));
      setAudio(newAudio);
    } else if (selectedTrack?.output_url && audio) {
      audio.src = selectedTrack.output_url;
      audio.load();
    }
  }, [selectedTrack]);

  const loadTracks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ai_music_generations')
        .select('*')
        .eq('generation_type', 'music')
        .eq('user_id', persona.user_id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setTracks(data || []);
      if (data && data.length > 0) {
        setSelectedTrack(data[0]);
      }
    } catch (error) {
      console.error('Error loading tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        {selectedTrack ? (
          <div className="bg-black/30 rounded-xl overflow-hidden">
            <div className="aspect-video bg-black/50 flex items-center justify-center p-8">
              <div className="text-center">
                <button 
                  className="w-16 h-16 mx-auto mb-4"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? (
                    <PauseCircle className="w-16 h-16 text-dreamaker-purple" />
                  ) : (
                    <PlayCircle className="w-16 h-16 text-dreamaker-purple" />
                  )}
                </button>
                <div className="mt-4">
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div className="bg-dreamaker-purple h-1.5 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold text-white">{selectedTrack.prompt || 'Untitled Track'}</h3>
              <p className="text-gray-400 mt-2">
                Generated on {new Date(selectedTrack.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-black/30 rounded-xl h-full flex flex-col items-center justify-center p-8 text-center">
            <p className="text-gray-400 mb-4">
              {loading ? 'Loading music...' : 'No music available'}
            </p>
            {!loading && (
              <Button variant="outline" className="mt-2" onClick={() => {}}>
                Generate New Track
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Card className="bg-black/20 border-dreamaker-purple/20">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">Recent Tracks</h3>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-dreamaker-purple" />
              </div>
            ) : tracks.length > 0 ? (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {tracks.map((track) => (
                  <div 
                    key={track.id}
                    className={`
                      flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors
                      ${selectedTrack?.id === track.id ? 'bg-dreamaker-purple/20' : 'bg-black/20 hover:bg-black/30'}
                    `}
                    onClick={() => {
                      if (isPlaying && audio) {
                        audio.pause();
                        setIsPlaying(false);
                      }
                      setSelectedTrack(track);
                    }}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-black/40 flex items-center justify-center">
                      {selectedTrack?.id === track.id && isPlaying ? (
                        <PauseCircle className="w-6 h-6 text-dreamaker-purple" />
                      ) : (
                        <PlayCircle className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-white">
                        {track.prompt || 'Untitled Track'}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {new Date(track.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No tracks available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Button 
          className="w-full" 
          variant="default"
          onClick={() => {}}
        >
          Generate New Track
        </Button>
      </div>
    </div>
  );
}
