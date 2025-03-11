
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { MjVideoPlayer } from '../../artist-profile/MjVideoPlayer';

interface GenerationResultProps {
  selectedTab: string;
  generatedAudioUrl: string;
  generatedLyrics: string;
  title: string;
}

export const GenerationResult = ({
  selectedTab,
  generatedAudioUrl,
  generatedLyrics,
  title
}: GenerationResultProps) => {
  // Clean up audio when unmounting or changing tabs
  useEffect(() => {
    return () => {
      // Create a new audio element to stop any playing audio
      const audio = document.querySelector('audio');
      if (audio) {
        audio.pause();
      }
    };
  }, [selectedTab]);

  if (!generatedAudioUrl && !generatedLyrics) return null;

  const handleCopyLyrics = () => {
    navigator.clipboard.writeText(generatedLyrics);
    toast.success("Lyrics copied to clipboard");
  };

  const handleDownloadAudio = () => {
    if (!generatedAudioUrl) return;
    
    const a = document.createElement('a');
    a.href = generatedAudioUrl;
    a.download = `${title || 'generated-music'}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Download started");
  };

  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        {selectedTab === 'lyrics' ? (
          <>
            <h3 className="text-lg font-semibold mb-2">Generated Lyrics</h3>
            <div className="bg-black/20 p-4 rounded-md whitespace-pre-line min-h-[200px] max-h-[400px] overflow-y-auto">
              {generatedLyrics}
            </div>
            <div className="flex justify-end mt-4">
              <Button 
                variant="outline" 
                onClick={handleCopyLyrics}
                className="border-konform-neon-blue/50 hover:bg-konform-neon-blue/10 text-konform-neon-blue"
              >
                Copy Lyrics
              </Button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-2">Generated Music</h3>
            <div className="bg-black/20 p-4 rounded-md">
              <MjVideoPlayer url={generatedAudioUrl} className="w-full" />
            </div>
            <div className="flex justify-end mt-4">
              <Button 
                variant="outline" 
                onClick={handleDownloadAudio}
                className="border-konform-neon-blue/50 hover:bg-konform-neon-blue/10 text-konform-neon-blue"
              >
                Download
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
