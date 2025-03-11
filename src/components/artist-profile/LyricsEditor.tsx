
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LyricsEditorProps {
  trackId: string;
  initialLyrics?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onLyricsSaved?: () => void;
  trackAudioUrl?: string;
}

export const LyricsEditor = ({
  trackId,
  initialLyrics = "",
  isOpen,
  onOpenChange,
  onLyricsSaved,
  trackAudioUrl
}: LyricsEditorProps) => {
  const [lyrics, setLyrics] = useState(initialLyrics);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Reset lyrics when dialog opens with new track
  useEffect(() => {
    if (isOpen) {
      setLyrics(initialLyrics);
    }
  }, [isOpen, trackId, initialLyrics]);

  const handleSaveLyrics = async () => {
    if (!trackId) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('track_lyrics')
        .upsert({ 
          track_id: trackId,
          content: lyrics 
        });
      
      if (error) throw error;
      
      toast.success("Lyrics saved successfully");
      onLyricsSaved && onLyricsSaved();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error saving lyrics:', error);
      toast.error("Failed to save lyrics");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateLyrics = async () => {
    if (!trackId || !trackAudioUrl) return;
    
    setIsGenerating(true);
    
    try {
      // Call an AI service to generate lyrics
      // This is a placeholder - would need to connect to a real service
      const generatedLyrics = await fetchGeneratedLyrics(trackAudioUrl);
      setLyrics(generatedLyrics);
      toast.success("Lyrics generated");
    } catch (error) {
      console.error("Error generating lyrics:", error);
      toast.error("Failed to generate lyrics");
    } finally {
      setIsGenerating(false);
    }
  };

  // Mockup function - would connect to an actual AI lyrics generation service
  const fetchGeneratedLyrics = async (audioUrl: string): Promise<string> => {
    // Simulating AI generation with a timeout
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("This is where AI-generated lyrics would appear.\n\nVerse 1:\nWords inspired by the melody\nFlowing through the rhythm and harmony\n\nChorus:\nThis is just a placeholder\nFor the real lyrics generator");
      }, 2000);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-[#1A1F2C] border-dreamaker-purple/30">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Lyrics</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-2">
          <Textarea
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            placeholder="Enter lyrics here..."
            className="h-[300px] bg-gray-800 border-dreamaker-purple/30 text-white"
          />
        </div>
        
        <div className="flex justify-between mt-4">
          <Button 
            variant="outline" 
            onClick={handleGenerateLyrics}
            disabled={isGenerating || !trackAudioUrl || isLoading}
            className="bg-transparent border border-dreamaker-purple/50"
          >
            {isGenerating ? "Generating..." : "Generate with AI"}
          </Button>
          
          <div className="space-x-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="bg-transparent"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveLyrics}
              disabled={isLoading}
              className="bg-dreamaker-purple hover:bg-dreamaker-purple/90"
            >
              {isLoading ? "Saving..." : "Save Lyrics"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
