
import { Button } from "@/components/ui/button";
import { Loader2, Volume2, Trash2 } from 'lucide-react';

interface Voice {
  voice_id: string;
  name: string;
  description?: string;
  samples?: string[];
}

interface VoiceListProps {
  voices: Voice[];
  isLoading: boolean;
  selectedVoiceId?: string;
  onVoiceSelect: (voice: Voice) => void;
  onVoiceDelete: (voiceId: string) => void;
  isDeletingVoice: boolean;
}

export const VoiceList = ({
  voices,
  isLoading,
  selectedVoiceId,
  onVoiceSelect,
  onVoiceDelete,
  isDeletingVoice
}: VoiceListProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!voices?.length) {
    return <p className="text-center text-gray-400 py-8">No voices found</p>;
  }

  return (
    <div className="space-y-4">
      {voices.map((voice) => (
        <div 
          key={voice.voice_id} 
          className={`flex items-center justify-between bg-black/20 p-4 rounded-lg cursor-pointer transition-all
            ${selectedVoiceId === voice.voice_id ? 'border-2 border-dreamaker-purple' : ''}
          `}
          onClick={() => onVoiceSelect(voice)}
        >
          <div>
            <h4 className="font-medium text-white">{voice.name}</h4>
            {voice.description && (
              <p className="text-sm text-gray-400">{voice.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (voice.samples?.[0]) {
                  const audio = new Audio(voice.samples[0]);
                  audio.play();
                }
              }}
            >
              <Volume2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onVoiceDelete(voice.voice_id);
              }}
              disabled={isDeletingVoice}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
