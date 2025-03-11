
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LyricsForm } from "./LyricsForm";
import { LyricsHistory } from "./LyricsHistory";
import { LyricsEditor } from "./LyricsEditor";
import { supabase } from "@/integrations/supabase/client";
import { LyricsGeneration } from "./LyricsGeneration";
import { GeneratedLyrics, ClaudeModel } from "./types";

export const LyricsView = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [selectedModel, setSelectedModel] = useState<ClaudeModel>('claude-3-opus-20240229');
  const [generatedLyrics, setGeneratedLyrics] = useState<GeneratedLyrics | null>(null);
  const [lyricsHistory, setLyricsHistory] = useState<GeneratedLyrics[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  useEffect(() => {
    // Load lyrics history from the database
    const fetchLyricsHistory = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return;

      const { data, error } = await supabase
        .from('lyrics_generations')
        .select('id, title, prompt, content, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching lyrics history:', error);
        return;
      }

      if (data) {
        // Convert to the GeneratedLyrics format and ensure required properties
        const formattedData: GeneratedLyrics[] = data.map(item => ({
          id: item.id, // This is now required
          content: item.content,
          title: item.title,
          prompt: item.prompt,
          created_at: item.created_at,
          text: item.content // Add text field matching content
        }));
        setLyricsHistory(formattedData);
      }
    };

    fetchLyricsHistory();
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleGenerateLyrics = async (prompt: string, options?: any) => {
    setIsGenerating(true);
    try {
      // Implementation would go here
      // This is a placeholder for the functionality
      const result = { text: "Generated lyrics would appear here", status: "complete" };
      
      if (result.status === "complete") {
        const newLyrics: GeneratedLyrics = {
          id: crypto.randomUUID(), // Ensured this is provided
          title: options?.title || `Lyrics - ${new Date().toLocaleString()}`,
          content: result.text,
          prompt,
          created_at: new Date().toISOString(),
          text: result.text // Add text field matching content
        };
        
        setGeneratedLyrics(newLyrics);
        setLyricsHistory(prev => [newLyrics, ...prev]);
        setActiveTab("edit");
      }
    } catch (error) {
      console.error("Error generating lyrics:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectLyrics = (lyrics: GeneratedLyrics) => {
    setGeneratedLyrics(lyrics);
    setActiveTab("edit");
  };

  return (
    <div className="min-h-[calc(100vh-180px)]">
      <Card className="bg-black/40 rounded-lg p-6">
        <Tabs defaultValue="create" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3 bg-black/50 mb-6">
            <TabsTrigger value="create" className="data-[state=active]:bg-konform-neon-blue/20 data-[state=active]:text-konform-neon-blue rounded-md">
              Create
            </TabsTrigger>
            <TabsTrigger value="edit" className="data-[state=active]:bg-konform-neon-blue/20 data-[state=active]:text-konform-neon-blue rounded-md">
              Edit
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-konform-neon-blue/20 data-[state=active]:text-konform-neon-blue rounded-md">
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4">
            <LyricsGeneration projectId="current-project" />
          </TabsContent>

          <TabsContent value="edit" className="space-y-4">
            {generatedLyrics ? (
              <LyricsEditor 
                lyrics={generatedLyrics} 
                onUpdateLyrics={setGeneratedLyrics} 
              />
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p>No lyrics selected. Generate new lyrics or select from history.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <LyricsHistory 
              history={lyricsHistory} 
              onSelectLyrics={handleSelectLyrics} 
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default LyricsView;
