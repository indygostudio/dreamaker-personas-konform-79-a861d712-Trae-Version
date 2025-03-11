import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Persona } from "@/pages/Personas";
import { Loader2, Save, Wand2, History, Undo, Redo } from "lucide-react";
import { cn } from "@/lib/utils";

interface LyricsSectionProps {
  persona: Persona;
  selectedModel: string;
}

export const LyricsSection = ({ persona, selectedModel }: LyricsSectionProps) => {
  const [topic, setTopic] = useState("");
  const [generatedLyrics, setGeneratedLyrics] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const { toast } = useToast();

  const addToHistory = (text: string) => {
    const newHistory = [...history.slice(0, historyIndex + 1), text];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleLyricsChange = (text: string) => {
    setGeneratedLyrics(text);
    addToHistory(text);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setGeneratedLyrics(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setGeneratedLyrics(history[historyIndex + 1]);
    }
  };

  const generateLyrics = async () => {
    if (!topic) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic for the lyrics",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-lyrics', {
        body: { persona, topic, model: selectedModel },
      });

      if (error) throw error;
      handleLyricsChange(data.lyrics);
      
      toast({
        title: "Lyrics Generated",
        description: "Your lyrics have been generated successfully!",
      });
    } catch (error) {
      console.error('Error generating lyrics:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate lyrics. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveLyrics = async () => {
    try {
      const { error } = await supabase
        .from('lyrics')
        .insert({
          content: generatedLyrics,
          title: `${topic} - Generated Lyrics`,
          persona_id: persona.id,
          user_id: persona.user_id,
        });

      if (error) throw error;

      toast({
        title: "Lyrics Saved",
        description: "Your lyrics have been saved successfully!",
      });
    } catch (error) {
      console.error('Error saving lyrics:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save lyrics. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="bg-black rounded-lg p-8 transition-all duration-300 hover:shadow-lg hover:shadow-dreamaker-purple/20">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-white mb-6">AI Lyric Writer</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Topic or Theme
              </label>
              <div className="flex gap-4">
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter a topic (e.g., love, heartbreak, summer)"
                  className="flex-1 bg-black/40 border-dreamaker-purple focus:border-dreamaker-purple-light transition-colors"
                />
                <Button
                  onClick={generateLyrics}
                  disabled={isGenerating}
                  className={cn(
                    "bg-dreamaker-purple hover:bg-dreamaker-purple-light transition-all duration-300",
                    "flex items-center gap-2"
                  )}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" />
                      <span>Generate</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {generatedLyrics && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-200">
                    Smart Editor
                  </label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={undo}
                      disabled={historyIndex <= 0}
                      className="hover:bg-dreamaker-purple/20"
                    >
                      <Undo className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={redo}
                      disabled={historyIndex >= history.length - 1}
                      className="hover:bg-dreamaker-purple/20"
                    >
                      <Redo className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={generatedLyrics}
                  onChange={(e) => handleLyricsChange(e.target.value)}
                  className="h-96 font-mono bg-black/40 border-dreamaker-purple focus:border-dreamaker-purple-light transition-colors resize-none"
                />
                <Button
                  onClick={saveLyrics}
                  className="w-full bg-dreamaker-purple hover:bg-dreamaker-purple-light transition-all duration-300 group"
                >
                  <Save className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                  Save to Library
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};