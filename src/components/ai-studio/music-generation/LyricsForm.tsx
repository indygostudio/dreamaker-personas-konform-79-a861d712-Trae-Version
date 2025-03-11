import React, { useState } from 'react';
import { Persona } from '@/types/persona';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, FileText } from "lucide-react";
import { piapiService } from '@/services/piapiService';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { MusicModel } from '@/services/piapi/types';

export interface LyricsFormProps {
  persona?: Persona;
}

export function LyricsForm({ persona }: LyricsFormProps) {
  const [prompt, setPrompt] = useState('');
  const [genre, setGenre] = useState('');
  const [style, setStyle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLyrics, setGeneratedLyrics] = useState('');

  const genres = [
    "Pop", "Rock", "Hip Hop", "R&B", "Country", 
    "Electronic", "Jazz", "Blues", "Folk", "Metal",
    "Punk", "Classical", "Reggae", "Soul", "Funk"
  ];

  const styles = [
    "Upbeat", "Melancholic", "Romantic", "Angry", "Inspirational",
    "Nostalgic", "Dreamy", "Energetic", "Calm", "Dramatic"
  ];

  const handleGenerateLyrics = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    try {
      // Using model type that's now compatible with our extended type
      const result = await piapiService.generateLyrics({
        model: "gpt4-lyricist" as MusicModel,
        prompt,
        genre: genre || undefined,
        style: style || undefined,
      });
      
      if (result.status === 'complete' && result.text) {
        setGeneratedLyrics(result.text);
        toast.success('Lyrics generated successfully');
        
        // Save to persona's history if available
        if (persona?.id) {
          try {
            // Use correct table name and field names
            const { error } = await supabase.from('activities').insert({
              activity_type: 'lyrics',
              entity_id: crypto.randomUUID(),
              entity_type: 'lyrics',
              user_id: persona.user_id || '',
              data: {
                content: result.text,
                genre: genre || null,
                style: style || null,
                prompt: prompt
              }
            });
            
            if (error) {
              console.error('Error saving to history:', error);
            }
          } catch (err) {
            console.error('Error saving lyrics to history:', err);
          }
        }
      } else {
        toast.error('Failed to generate lyrics');
      }
    } catch (error) {
      console.error('Error generating lyrics:', error);
      toast.error('Failed to generate lyrics');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Prompt</label>
          <Textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="bg-black/20 border-dreamaker-purple/30 min-h-[150px]"
            placeholder="Describe the lyrics you want to generate. For example: 'Write lyrics about finding hope in difficult times'"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Genre (Optional)</label>
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger className="bg-black/20 border-dreamaker-purple/30">
                <SelectValue placeholder="Select a genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Genre</SelectItem>
                {genres.map(g => (
                  <SelectItem key={g} value={g.toLowerCase()}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Style (Optional)</label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger className="bg-black/20 border-dreamaker-purple/30">
                <SelectValue placeholder="Select a style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Style</SelectItem>
                {styles.map(s => (
                  <SelectItem key={s} value={s.toLowerCase()}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          className="w-full" 
          onClick={handleGenerateLyrics}
          disabled={isGenerating || !prompt.trim()}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Lyrics
            </>
          )}
        </Button>
      </div>

      <div className="space-y-4">
        {generatedLyrics ? (
          <div className="bg-black/30 rounded-lg overflow-hidden border border-dreamaker-purple/20 p-6 h-[500px] overflow-y-auto">
            <pre className="text-gray-200 whitespace-pre-wrap font-sans">{generatedLyrics}</pre>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-black/20 rounded-lg border border-dashed border-dreamaker-purple/30 p-8">
            <FileText className="h-16 w-16 text-dreamaker-purple/40 mb-4" />
            <p className="text-gray-400 text-center">
              Generated lyrics will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
