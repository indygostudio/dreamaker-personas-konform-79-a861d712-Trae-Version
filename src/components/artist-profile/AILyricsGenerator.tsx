import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { piapiService } from '@/services/piapiService';
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";
import { MusicModel } from '@/services/piapi/types';

interface AILyricsGeneratorProps {
  projectId?: string;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  onLyricsGenerated?: (lyrics: string) => void;
}

export const AILyricsGenerator: React.FC<AILyricsGeneratorProps> = ({ projectId, isOpen, onOpenChange, onLyricsGenerated }) => {
  const { toast } = useToast();
  const { user } = useUser();
  const [prompt, setPrompt] = useState('');
  const [generatedLyrics, setGeneratedLyrics] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [title, setTitle] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState('');
  const [selectedTopics, setSelectedTopics] = useState('');

  // Load existing lyrics from local storage
  const [allLyrics, setAllLyrics] = useState<any[]>(() => {
    const storedLyrics = localStorage.getItem('lyrics');
    return storedLyrics ? JSON.parse(storedLyrics) : [];
  });

  // Save lyrics to local storage whenever allLyrics changes
  React.useEffect(() => {
    localStorage.setItem('lyrics', JSON.stringify(allLyrics));
  }, [allLyrics]);

  const handleGenerateLyrics = async () => {
    if (!prompt.trim()) {
      toast({
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setGeneratedLyrics("");

    try {
      const result = await piapiService.generateLyrics({
        model: "gpt4-lyricist" as MusicModel,
        prompt: prompt,
        genre: selectedGenre || undefined,
        style: selectedStyle || undefined,
      });

      if (result.status === 'complete' && result.text) {
        setGeneratedLyrics(result.text);
        toast({
          description: "Your lyrics have been generated successfully",
        });
        if (onLyricsGenerated) {
          onLyricsGenerated(result.text);
        }
      } else {
        toast({
          description: "Failed to generate lyrics. Please try again with a different prompt",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating lyrics:", error);
      toast({
        description: "Failed to generate lyrics. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      if (onOpenChange) {
        onOpenChange(false);
      }
    }
  };

  return (
    <div className="bg-black/20 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">AI Lyrics Generator</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My Awesome Song"
            className="bg-black/30 border-gray-700"
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-1">Prompt</label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A song about lost love in the style of 80s rock"
            className="bg-black/30 border-gray-700 min-h-[100px]"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Genre</label>
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="bg-black/30 border-gray-700">
                <SelectValue placeholder="Select Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Rock">Rock</SelectItem>
                <SelectItem value="Pop">Pop</SelectItem>
                <SelectItem value="Hip Hop">Hip Hop</SelectItem>
                <SelectItem value="Country">Country</SelectItem>
                <SelectItem value="Electronic">Electronic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Style</label>
            <Select value={selectedStyle} onValueChange={setSelectedStyle}>
              <SelectTrigger className="bg-black/30 border-gray-700">
                <SelectValue placeholder="Select Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ballad">Ballad</SelectItem>
                <SelectItem value="Upbeat">Upbeat</SelectItem>
                <SelectItem value="Acoustic">Acoustic</SelectItem>
                <SelectItem value="Dance">Dance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Emotions</label>
            <Select value={selectedEmotions} onValueChange={setSelectedEmotions}>
              <SelectTrigger className="bg-black/30 border-gray-700">
                <SelectValue placeholder="Select Emotion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Happy">Happy</SelectItem>
                <SelectItem value="Sad">Sad</SelectItem>
                <SelectItem value="Angry">Angry</SelectItem>
                <SelectItem value="Hopeful">Hopeful</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Topics</label>
            <Select value={selectedTopics} onValueChange={setSelectedTopics}>
              <SelectTrigger className="bg-black/30 border-gray-700">
                <SelectValue placeholder="Select Topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Love">Love</SelectItem>
                <SelectItem value="Life">Life</SelectItem>
                <SelectItem value="Dreams">Dreams</SelectItem>
                <SelectItem value="Nature">Nature</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button
          onClick={handleGenerateLyrics}
          disabled={isLoading || !prompt}
          className="w-full bg-gradient-to-r from-dreamaker-purple to-dreamaker-purple/70 hover:from-dreamaker-purple/90 hover:to-dreamaker-purple/60"
        >
          {isLoading ? (
            <span>Generating...</span>
          ) : (
            <>
              <FileText className="h-4 w-4 mr-2" />
              Generate Lyrics
            </>
          )}
        </Button>
        
        {generatedLyrics && (
          <div className="mt-4">
            <h4 className="text-lg font-medium mb-2">Generated Lyrics:</h4>
            <div className="bg-black/30 rounded-lg p-4 text-gray-300 whitespace-pre-line">
              {generatedLyrics}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
