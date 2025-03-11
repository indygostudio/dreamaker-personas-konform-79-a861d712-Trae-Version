
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Play, Pause } from 'lucide-react';

interface TextToSpeechProps {
  text: string;
  onTextChange: (text: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  isPlaying: boolean;
  isDisabled: boolean;
}

export const TextToSpeech = ({
  text,
  onTextChange,
  onGenerate,
  isGenerating,
  isPlaying,
  isDisabled
}: TextToSpeechProps) => {
  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Enter text to convert to speech..."
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        className="bg-black/20"
      />
      
      <Button
        onClick={onGenerate}
        disabled={isDisabled || isGenerating}
        className="w-full"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : isPlaying ? (
          <>
            <Pause className="w-4 h-4 mr-2" />
            Playing
          </>
        ) : (
          <>
            <Play className="w-4 h-4 mr-2" />
            Generate Speech
          </>
        )}
      </Button>
    </div>
  );
};
