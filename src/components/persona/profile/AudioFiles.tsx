import { FileMusic, Music } from "lucide-react";
import { VoiceSample } from "../media/VoiceSample";
import { BackgroundMusic } from "../media/BackgroundMusic";
import { useEffect, useState } from "react";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import type { Track } from "@/types/track";
import { AudioSectionAdapter } from "./AudioSectionAdapter";

interface AudioFilesProps {
  persona: {
    id: string;
    voice_sample_url?: string;
    background_music_url?: string;
  };
  onVoiceSampleUpdate: (url: string) => void;
  onBackgroundMusicUpdate: (url: string) => void;
}

export const AudioFiles = ({
  persona,
  onVoiceSampleUpdate,
  onBackgroundMusicUpdate,
}: AudioFilesProps) => {
  // The useAudioPlayer hook is now used directly in child components
  // No need for custom event listeners anymore
  return (
    <section className="bg-black/40 backdrop-blur-sm p-6 rounded-xl mt-8">
      <h2 className="text-2xl font-bold text-white mb-6">Audio Files</h2>
      <div className="space-y-4">
        {/* Voice Sample File */}
        <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-lg border border-[#353F51] hover:bg-[#2A2A2A] transition-colors group">
          <div className="flex items-center gap-3">
            <FileMusic className="w-5 h-5 text-[#00D1FF]" />
            <div className="flex flex-col">
              <span className="text-white">Voice Sample</span>
              {persona.voice_sample_url ? (
                <span className="text-sm text-gray-400">Uploaded</span>
              ) : (
                <span className="text-sm text-gray-400">No file uploaded</span>
              )}
            </div>
          </div>
          <VoiceSample
            personaId={persona.id}
            voiceSampleUrl={persona.voice_sample_url}
            onUpdate={onVoiceSampleUpdate}
          />
        </div>

        {/* Background Music File */}
        <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-lg border border-[#353F51] hover:bg-[#2A2A2A] transition-colors group">
          <div className="flex items-center gap-3">
            <Music className="w-5 h-5 text-[#00D1FF]" />
            <div className="flex flex-col">
              <span className="text-white">Background Music</span>
              {persona.background_music_url ? (
                <span className="text-sm text-gray-400">Uploaded</span>
              ) : (
                <span className="text-sm text-gray-400">No file uploaded</span>
              )}
            </div>
          </div>
          <BackgroundMusic
            personaId={persona.id}
            backgroundMusicUrl={persona.background_music_url}
            onUpdate={onBackgroundMusicUpdate}
          />
        </div>
      </div>
    </section>
  );
};