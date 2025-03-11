
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Play, UploadCloud } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { MusicPlayer } from './MusicPlayer';
import { transformTrackData } from '@/lib/utils/trackTransform';
import { Track } from '@/types/track';
import { TrackItem } from './TrackItem';
import { Persona } from '@/types/persona';
import { piapiService } from '@/services/piapiService';
import { useQuery } from '@tanstack/react-query';

interface MusicSectionProps {
  artistId?: string;
  limit?: number;
  showAll?: boolean;
  persona?: Persona;
  selectedModel?: string;
}

export const MusicSection = ({ 
  artistId, 
  limit = 5, 
  showAll = false,
  persona,
  selectedModel
}: MusicSectionProps) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isLooping, setIsLooping] = useState(false);

  // Fetch tracks based on artistId or persona.id
  useEffect(() => {
    const fetchTracks = async () => {
      if (!artistId && !persona?.id) return;
      
      setIsLoading(true);
      try {
        let fetchedData: Record<string, any>[] = [];
        let fetchedError: any = null;
        
        if (artistId) {
          const { data, error } = await supabase
            .from('tracks')
            .select('*')
            .eq('user_id', artistId)
            .is('is_public', true)
            .order('created_at', { ascending: false })
            .limit(showAll ? 100 : limit);
            
          fetchedData = data || [];
          fetchedError = error;
        } else if (persona?.id) {
          const { data, error } = await supabase
            .from('tracks')
            .select('*')
            .eq('persona_id', persona.id)
            .is('is_public', true)
            .order('created_at', { ascending: false })
            .limit(showAll ? 100 : limit);
            
          fetchedData = data || [];
          fetchedError = error;
        }

        if (fetchedError) throw fetchedError;

        const parsedTracks = fetchedData.map((track) => transformTrackData(track));
        setTracks(parsedTracks);
      } catch (error) {
        console.error('Error fetching tracks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTracks();
  }, [artistId, persona?.id, limit, showAll]);

  // Set initial track when tracks are loaded and no current track is set
  useEffect(() => {
    if (tracks.length > 0 && !currentTrack) {
      setCurrentTrack(tracks[0]);
    }
  }, [tracks, currentTrack]);

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handlePlayAll = () => {
    if (tracks.length > 0 && currentTrack) {
      setIsPlaying(true);
    } else if (tracks.length > 0) {
      setCurrentTrack(tracks[0]);
      setIsPlaying(true);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Music</h2>
        <div className="flex space-x-2">
          <Button 
            onClick={handlePlayAll} 
            variant="outline" 
            size="sm"
            disabled={tracks.length === 0}
          >
            <Play className="mr-2 h-4 w-4" />
            Play All
          </Button>
          <Button variant="outline" size="sm">
            <UploadCloud className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="rounded-md bg-black/20 h-16 animate-pulse" />
          ))}
        </div>
      ) : tracks.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-black/20 rounded-lg">
          No tracks available
        </div>
      ) : (
        <div className="space-y-2">
          {tracks.map((track) => (
            <TrackItem
              key={track.id}
              id={track.id}
              track={track}
              currentTrack={currentTrack}
              isPlaying={isPlaying && currentTrack?.id === track.id}
              onTrackPlay={handleTrackSelect}
              onPlay={() => handleTrackSelect(track)}
            />
          ))}
        </div>
      )}

      {currentTrack && (
        <MusicPlayer
          audioUrl={currentTrack.audio_url}
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
        />
      )}
    </div>
  );
};
