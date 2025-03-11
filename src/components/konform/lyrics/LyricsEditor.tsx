
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Save, Download, Copy, Trash2, Edit, Wand2, Music } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { AILyricsGenerator } from "@/components/artist-profile/AILyricsGenerator";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface LyricsEditorProps {
  lyrics: {
    id?: string;
    content: string;
    title?: string;
    prompt?: string;
    created_at?: string;
  };
  onUpdateLyrics?: (updatedLyrics: any) => void;
}

export const LyricsEditor = ({ lyrics, onUpdateLyrics }: LyricsEditorProps) => {
  const [content, setContent] = useState(lyrics.content || "");
  const [title, setTitle] = useState(lyrics.title || "Untitled");
  const [isEditing, setIsEditing] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [activeTab, setActiveTab] = useState("view");
  const { toast } = useToast();

  // Update local state when lyrics prop changes
  useEffect(() => {
    setContent(lyrics.content || "");
    setTitle(lyrics.title || "Untitled");
  }, [lyrics]);

  const handleSave = async () => {
    try {
      if (!lyrics.id) {
        toast({
          title: "Error",
          description: "Cannot save: No lyrics ID found",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('lyrics_generations')
        .update({
          content: content,
          title: title,
          updated_at: new Date().toISOString()
        })
        .eq('id', lyrics.id);

      if (error) throw error;

      if (onUpdateLyrics) {
        onUpdateLyrics({
          ...lyrics,
          content,
          title
        });
      }

      toast({
        title: "Lyrics saved",
        description: "Your changes have been saved successfully",
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error saving lyrics:', error);
      toast({
        title: "Error saving lyrics",
        description: error.message || "There was an error saving your changes",
        variant: "destructive",
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Lyrics have been copied to your clipboard",
    });
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${title.replace(/\s+/g, '-').toLowerCase()}_lyrics.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleAIAssist = () => {
    setShowAIGenerator(true);
  };

  const handleLyricsGenerated = (newLyrics: string) => {
    setContent(newLyrics);
    setShowAIGenerator(false);
    
    // If in view mode, switch to edit mode
    if (activeTab === "view") {
      setActiveTab("edit");
      setIsEditing(true);
    }
  };

  const getSyllableCount = (line: string): number => {
    line = line.toLowerCase();
    if (!line) return 0;
    
    // Count syllables with a basic algorithm
    line = line.replace(/[^\w\s']|_/g, '')
              .replace(/\s+/g, ' ')
              .trim();
    
    // Count vowel groups as syllables
    const syllablePattern = /[aeiouy]{1,2}/gi;
    const matches = line.match(syllablePattern);
    
    return matches ? matches.length : 0;
  };

  const syllableAnalysis = () => {
    if (!content) return [];
    
    const lines = content.split('\n').filter(line => line.trim() !== '');
    return lines.map((line, index) => ({
      line,
      syllables: getSyllableCount(line),
      index
    }));
  };

  const analysis = syllableAnalysis();

  return (
    <>
      <Card className="bg-black/20 border-none">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">
            {isEditing ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xl font-bold bg-black/30 border-gray-700"
              />
            ) : (
              <span className="flex items-center">
                <Music className="h-5 w-5 mr-2 text-konform-neon-blue" />
                {title}
              </span>
            )}
          </CardTitle>
          
          <div className="flex gap-2">
            {lyrics.id && (
              <Badge variant="outline" className="text-gray-400">
                {new Date(lyrics.created_at!).toLocaleDateString()}
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="view" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 bg-black/30 mb-4">
              <TabsTrigger value="view" className="data-[state=active]:bg-konform-neon-blue/20 data-[state=active]:text-konform-neon-blue">
                View
              </TabsTrigger>
              <TabsTrigger value="edit" onClick={() => setIsEditing(true)} className="data-[state=active]:bg-konform-neon-blue/20 data-[state=active]:text-konform-neon-blue">
                Edit
              </TabsTrigger>
              <TabsTrigger value="analysis" className="data-[state=active]:bg-konform-neon-blue/20 data-[state=active]:text-konform-neon-blue">
                Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="view" className="space-y-4 mt-4">
              <div className="whitespace-pre-wrap p-4 bg-black/30 rounded-md min-h-[300px] max-h-[50vh] overflow-y-auto text-white">
                {content}
              </div>
            </TabsContent>

            <TabsContent value="edit" className="space-y-4 mt-4">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[300px] max-h-[50vh] bg-black/30 border-gray-700 text-white"
              />
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4 mt-4">
              <div className="bg-black/30 p-4 rounded-md min-h-[300px] max-h-[50vh] overflow-y-auto">
                <h3 className="text-lg font-medium mb-3 text-konform-neon-blue">Syllable Analysis</h3>
                <div className="space-y-2">
                  {analysis.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <div className="truncate max-w-[80%]">{item.line}</div>
                      <Badge variant="outline" className="bg-konform-neon-blue/10 text-konform-neon-blue">
                        {item.syllables} syllables
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between py-6 px-6 border-t border-gray-800">
          <div className="flex gap-2">
            {activeTab === "edit" ? (
              <Button variant="default" onClick={handleSave} className="bg-konform-neon-blue hover:bg-konform-neon-blue/90">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            ) : (
              <Button variant="outline" onClick={() => { setActiveTab("edit"); setIsEditing(true); }}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            <Button variant="outline" onClick={handleAIAssist}>
              <Wand2 className="h-4 w-4 mr-2" />
              AI Assist
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCopy}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* AI Lyrics Generator Dialog */}
      <Dialog open={showAIGenerator} onOpenChange={setShowAIGenerator}>
        <DialogContent className="max-w-3xl bg-black/80 border-dreamaker-purple/20 p-6">
          <AILyricsGenerator 
            onLyricsGenerated={handleLyricsGenerated}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
