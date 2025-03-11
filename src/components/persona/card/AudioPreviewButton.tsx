
import { PlayCircle, PauseCircle } from "lucide-react";
import { useAudioPreview } from "./hooks/useAudioPreview";
import { useRef } from "react";
import { MusicPlayer } from "@/components/artist-profile/MusicPlayer";

interface AudioPreviewButtonProps {
  audioUrl?: string;
  personaName?: string;
}

export const AudioPreviewButton = ({ audioUrl, personaName = "Audio Preview" }: AudioPreviewButtonProps) => {
  const { 
    isPlaying, 
    handleAudioToggle, 
    showMusicPlayer, 
    handleTransportClose,
    audioUrl: currentAudioUrl
  } = useAudioPreview(audioUrl, { personaName });
  
  const buttonRef = useRef<HTMLButtonElement>(null);

  // If there's no audio URL, don't render the button
  if (!audioUrl) return null;

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleAudioToggle}
        className="absolute bottom-4 right-4 text-white hover:text-dreamaker-purple transition-colors bg-black/40 hover:bg-black/60 rounded-full p-2 z-10"
        aria-label={isPlaying ? "Pause audio preview" : "Play audio preview"}
      >
        {isPlaying ? (
          <PauseCircle className="h-8 w-8" />
        ) : (
          <PlayCircle className="h-8 w-8" />
        )}
      </button>
      
      {/* Music player transport that appears when audio is playing */}
      {showMusicPlayer && currentAudioUrl && (
        <MusicPlayer
          audioUrl={currentAudioUrl}
          isPlaying={isPlaying}
          onPlayPause={handleAudioToggle}
          trackTitle={`${personaName} Preview`}
          artistName={personaName}
          onTransportClose={handleTransportClose}
        />
      )}
    </>
  );
};
