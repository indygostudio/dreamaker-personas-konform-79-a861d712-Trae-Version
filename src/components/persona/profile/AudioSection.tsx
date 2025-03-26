
import { useEffect, useState } from "react";
import { PlaylistCreator } from "@/components/artist-profile/PlaylistCreator";
import { MusicPlayer } from "@/components/artist-profile/MusicPlayer";
import { useUser } from "@/hooks/useUser";
import { PlaylistSelector } from "./PlaylistSelector";
import { TrackList } from "./TrackList";
import { useAudioSection } from "./hooks/useAudioSection";
import { Button } from "@/components/ui/button";
import { Activity, Plus, Music } from "lucide-react";
import { AddAudioDialog } from "./AddAudioDialog";
import { LoopDetailsDialog } from "./LoopDetailsDialog";
import { LoopBrowser } from "./LoopBrowser";

interface AudioSectionProps {
  persona: any;
  selectedModel: string;
  isActive?: boolean;
}

export const AudioSection = ({ persona, selectedModel, isActive = true }: AudioSectionProps) => {
  const { user } = useUser();
  const {
    id,
    playlists,
    isLoadingPlaylists,
    refetchPlaylists,
    tracks,
    isLoadingTracks,
    refetchTracks,
    currentTrack,
    setCurrentTrack,
    isPlaying,
    setIsPlaying,
    selectedPlaylistId,
    setSelectedPlaylistId,
    handlePlayTrack,
    handlePlayPause,
    isAddAudioDialogOpen,
    setIsAddAudioDialogOpen,
    isLoopDialogOpen,
    setIsLoopDialogOpen,
    handleUploadAudio,
    isUploading,
    audioFileForLoop,
    setAudioFileForLoop,
    loops,
    isLoadingLoops,
    addLoopToPlaylist
  } = useAudioSection();

  const [isLoopBrowserOpen, setIsLoopBrowserOpen] = useState(false);

  const isOwner = user?.id === persona.user_id;

  // Only pause audio when the component is unmounted, not just inactive
  // This allows audio to continue playing when switching tabs
  useEffect(() => {
    // Cleanup function will only run when component unmounts
    return () => {
      if (isPlaying) {
        setIsPlaying(false);
      }
    };
  }, [isPlaying, setIsPlaying]);

  const handleAudioFileSelect = (file: File, isLoop: boolean) => {
    if (isLoop) {
      setAudioFileForLoop(file);
      setIsAddAudioDialogOpen(false);
      setIsLoopDialogOpen(true);
    } else {
      handleUploadAudio(file, false);
    }
  };

  if (isLoadingPlaylists) {
    return <div className="text-center py-8 text-gray-400">Loading playlists...</div>;
  }

  if ((!playlists || playlists.length === 0) && isOwner) {
    return (
      <div className="grid grid-cols-1">
        <PlaylistCreator 
          personaId={id!} 
          onPlaylistCreated={() => {
            refetchPlaylists();
          }} 
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="flex justify-between items-center">
        {playlists && playlists.length > 0 && (
          <PlaylistSelector
            playlists={playlists}
            selectedPlaylistId={selectedPlaylistId}
            setSelectedPlaylistId={setSelectedPlaylistId}
            isOwner={isOwner}
            refetchPlaylists={refetchPlaylists}
            setCurrentTrack={setCurrentTrack}
            setIsPlaying={setIsPlaying}
          />
        )}
        
        {isOwner && selectedPlaylistId && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLoopBrowserOpen(true)}
              className="bg-amber-950/20 border-amber-500/30 text-amber-400 hover:bg-amber-950/30"
            >
              <Activity className="h-4 w-4 mr-2" />
              Browse Loops
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddAudioDialogOpen(true)}
              className="bg-purple-950/20 border-purple-500/30 text-purple-400 hover:bg-purple-950/30"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Audio
            </Button>
          </div>
        )}
      </div>

      <TrackList
        tracks={tracks || []}
        isLoading={isLoadingTracks}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        handlePlayTrack={handlePlayTrack}
        selectedPlaylistId={selectedPlaylistId}
        isOwner={isOwner}
        refetchTracks={refetchTracks}
      />

      {isOwner && (
        <PlaylistCreator 
          personaId={id!} 
          onPlaylistCreated={() => {
            refetchPlaylists();
            refetchTracks();
          }} 
        />
      )}

      {currentTrack && (
        <MusicPlayer 
          audioUrl={currentTrack.audio_url} 
          isPlaying={isPlaying && isActive}
          onPlayPause={handlePlayPause}
          trackTitle={currentTrack.title}
          artistName={currentTrack.artist || persona.name}
        />
      )}
      
      <AddAudioDialog
        isOpen={isAddAudioDialogOpen}
        onOpenChange={setIsAddAudioDialogOpen}
        onUpload={handleAudioFileSelect}
        onLoopDialog={() => setIsLoopDialogOpen(true)}
        isUploading={isUploading}
      />
      
      <LoopDetailsDialog
        isOpen={isLoopDialogOpen}
        onOpenChange={setIsLoopDialogOpen}
        onUpload={handleUploadAudio}
        file={audioFileForLoop}
        isUploading={isUploading}
      />
      
      <LoopBrowser
        isOpen={isLoopBrowserOpen}
        onOpenChange={setIsLoopBrowserOpen}
        loops={loops || []}
        isLoading={isLoadingLoops}
        onAddToPlaylist={addLoopToPlaylist}
      />
    </div>
  );
};
