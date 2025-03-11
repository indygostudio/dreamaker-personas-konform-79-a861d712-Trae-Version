import { useState, useEffect } from "react";
import { piapiService } from "@/services/piapiService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sparkles, Loader2, Save, Copy, FileType } from "lucide-react";
import { LyricsForm } from "./LyricsForm";
import { GeneratedLyrics, ClaudeModel } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { useSelectedPersonasStore } from "@/stores/selectedPersonasStore";
import { MusicModel } from "@/services/piapi/types";

interface LyricsGenerationProps {
  projectId?: string;
}

export const LyricsGeneration = ({ projectId }: LyricsGenerationProps) => {
  const [selectedModel, setSelectedModel] = useState<ClaudeModel>("claude-3-opus-20240229");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLyrics, setGeneratedLyrics] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [showWormhole, setShowWormhole] = useState(false);
  const { wormholeAnimations, addWormholeAnimation } = useSelectedPersonasStore();

  const generateLyrics = async (prompt: string, options?: any) => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    setGeneratedLyrics("");

    try {
      const modelToUse = selectedModel === "claude-3-opus-20240229" ? 
        "gpt4-lyricist" as MusicModel : 
        "gpt4-lyricist" as MusicModel;
        
      const result = await piapiService.generateLyrics({
        model: modelToUse,
        prompt,
        genre: options?.genre,
        style: options?.style,
      });

      if (result.status === "complete" && result.text) {
        setGeneratedLyrics(result.text);
        toast.success("Lyrics generated successfully");
      } else {
        toast.error("Failed to generate lyrics");
      }
    } catch (error) {
      console.error("Error generating lyrics:", error);
      toast.error("An error occurred while generating lyrics");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveLyrics = async () => {
    if (!generatedLyrics) {
      toast.error("No lyrics to save");
      return;
    }

    setIsSaving(true);
    setShowWormhole(true);

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.error("You must be logged in to save lyrics");
        return;
      }

      const { data, error } = await supabase
        .from("lyrics_generations")
        .insert({
          content: generatedLyrics,
          title: "New Lyrics",
          prompt: "Lyrics generation",
          user_id: session.session.user.id,
          ...(projectId ? { project_id: projectId } : {})
        });

      if (error) {
        throw error;
      }

      toast.success("Lyrics saved successfully");
    } catch (error) {
      console.error("Error saving lyrics:", error);
      toast.error("Failed to save lyrics");
    } finally {
      setIsSaving(false);
      setTimeout(() => {
        setShowWormhole(false);
      }, 2000);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLyrics);
    toast.success("Lyrics copied to clipboard");
  };

  return (
    <div className="space-y-6 relative">
      {showWormhole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <img 
            src="/Videos/Wormhole.gif" 
            alt="Wormhole Animation" 
            className="w-full h-full object-cover absolute inset-0" 
          />
          <div className="bg-black/50 absolute inset-0"></div>
          <div className="z-10 text-white text-2xl font-bold">
            Adding to Project...
          </div>
        </div>
      )}
      
      <Tabs defaultValue="generate">
        <TabsList className="grid grid-cols-2 w-full mb-6 bg-black/30">
          <TabsTrigger
            value="generate"
            className="data-[state=active]:bg-konform-neon-blue/20 data-[state=active]:text-konform-neon-blue rounded-md"
          >
            Generate Lyrics
          </TabsTrigger>
          <TabsTrigger
            value="result"
            className="data-[state=active]:bg-konform-neon-blue/20 data-[state=active]:text-konform-neon-blue rounded-md"
            disabled={!generatedLyrics}
          >
            Generated Lyrics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate">
          <LyricsForm
            onSubmit={generateLyrics}
            isGenerating={isGenerating}
            selectedModel={selectedModel}
          />
        </TabsContent>

        <TabsContent value="result">
          {generatedLyrics ? (
            <Card className="bg-black/40 rounded-lg overflow-hidden">
              <CardContent className="p-6">
                <div className="bg-black/30 p-4 rounded-lg max-h-[60vh] overflow-y-auto mb-4">
                  <pre className="whitespace-pre-wrap font-sans text-gray-200">
                    {generatedLyrics}
                  </pre>
                </div>

                <div className="flex space-x-2 justify-end">
                  <Button variant="outline" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    onClick={saveLyrics}
                    disabled={isSaving}
                    className="bg-konform-neon-blue hover:bg-konform-neon-blue/90"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Lyrics
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <FileType className="h-12 w-12 mx-auto mb-4 text-gray-500" />
              <p>No lyrics generated yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
