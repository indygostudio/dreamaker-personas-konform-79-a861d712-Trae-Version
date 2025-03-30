
import { Button } from "@/components/ui/button";
import { Edit, ChevronDown, ChevronRight } from "lucide-react";
import { Track } from "@/types/track";
import { Playlist } from "@/types/playlist";
import { AudioUploadSection } from "@/components/artist-profile/form/AudioUploadSection";
import { TrackList } from "./TrackList";
import { useAudioPlayer } from "@/hooks/use-audio-player";

interface PlaylistItemProps {
  playlist: Playlist;
  tracks: Track[];
  expanded: boolean;
  currentTrack: Track | null;
  isPlaying: boolean;
  userId: string;
  onToggleExpand: () => void;
  onEditPlaylist: (playlistId: string) => void;
  onTrackPlay: (track: Track) => void;
  onTrackDelete: (trackId: string) => void;
  onTrackArtworkEdit: (track: Track) => void;
  onAudioUploadSuccess: (url: string, playlistId: string) => void;
  onTrackDragEnd: (event: any, playlistId: string) => void;
}

export const PlaylistItem = ({
  playlist,
  tracks,
  expanded,
  currentTrack,
  isPlaying,
  userId,
  onToggleExpand,
  onEditPlaylist,
  onTrackPlay,
  onTrackDelete,
  onTrackArtworkEdit,
  onAudioUploadSuccess,
  onTrackDragEnd,
}: PlaylistItemProps) => {
  // Get the audio player hook to control the unified music player
  const { handlePlayTrack, initializeTracks } = useAudioPlayer();
  return (
    <div className="w-full">
      <div 
        className="p-4 rounded-lg mb-4 cursor-pointer flex items-center justify-between border-2 border-dreamaker-purple rounded-lg bg-[#0d2624]/40"
        onDoubleClick={onToggleExpand}
        id={playlist.id}
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-800 rounded overflow-hidden">
            <img 
              src={playlist.album_artwork_url || '/placeholder.svg'} 
              alt={playlist.name} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <h3 className="font-bold text-white text-left">
              {playlist.name}
              {playlist.is_default && <span className="ml-2 text-xs bg-dreamaker-purple/80 px-2 py-0.5 rounded-full">Default</span>}
            </h3>
            <p className="text-gray-400 text-sm text-left">{playlist.album_title}</p>
            <p className="text-gray-500 text-xs mt-1 text-left">
              {tracks.length} tracks
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEditPlaylist(playlist.id);
            }}
            className="text-white hover:text-dreamaker-purple"
          >
            <Edit className="h-4 w-4" />
          </Button>
          {expanded ? (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="space-y-4 mb-6">
          <div className="flex justify-end mb-2">
            <AudioUploadSection 
              audioUrl="" 
              profileId={playlist.id} 
              userId={userId} 
              onSuccess={(url) => onAudioUploadSuccess(url, playlist.id)}
              buttonVariant="outline"
              buttonSize="sm"
              buttonClassName="bg-black/40 border-gray-700 text-white"
            />
          </div>
          
          <TrackList 
            tracks={tracks}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onTrackPlay={onTrackPlay}
            onTrackDelete={onTrackDelete}
            onTrackArtworkEdit={onTrackArtworkEdit}
            onDragEnd={(event) => onTrackDragEnd(event, playlist.id)}
          />
        </div>
      )}
    </div>
  );
};
