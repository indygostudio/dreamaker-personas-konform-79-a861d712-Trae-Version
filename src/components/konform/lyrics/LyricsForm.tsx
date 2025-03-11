import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Sparkles } from "lucide-react";
import { ClaudeModel } from "./types";

interface LyricsFormProps {
  onSubmit: (prompt: string, options?: any) => Promise<void>;
  isGenerating: boolean;
  selectedModel: ClaudeModel;
}

export const LyricsForm = ({ onSubmit, isGenerating, selectedModel }: LyricsFormProps) => {
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [style, setStyle] = useState('modern');
  const [topics, setTopics] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const topicsArray = topics
      ? topics.split(',').map(topic => topic.trim()).filter(Boolean)
      : [];
    
    onSubmit(prompt, {
      title,
      genre,
      style,
      topics: topicsArray
    });
  };

  return (
    <Card className="bg-black/40 rounded-lg p-6">
      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title (Optional)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter song title"
              className="bg-black/30 border-gray-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="prompt">Lyrics Description</Label>
            <Textarea
              id="prompt"
              placeholder="Describe what you want your lyrics to be about..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
              className="min-h-[120px] bg-black/30 border-gray-700"
            />
            <p className="text-sm text-gray-400">
              Describe the theme, emotion, narrative, or any specific elements you want in your lyrics.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="style">Style</Label>
            <RadioGroup 
              id="style" 
              value={style} 
              onValueChange={setStyle} 
              className="grid grid-cols-2 gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="modern" id="modern" />
                <Label htmlFor="modern">Modern</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="classic" id="classic" />
                <Label htmlFor="classic">Classic</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="poetic" id="poetic" />
                <Label htmlFor="poetic">Poetic</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="experimental" id="experimental" />
                <Label htmlFor="experimental">Experimental</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="genre">Genre (Optional)</Label>
            <Input
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="e.g., Rock, Pop, Hip-Hop, Country"
              className="bg-black/30 border-gray-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="topics">Topics (Optional)</Label>
            <Input
              id="topics"
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              placeholder="e.g., love, loss, hope (comma separated)"
              className="bg-black/30 border-gray-700"
            />
            <p className="text-sm text-gray-400">
              Enter topics as comma-separated values
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="model">AI Model</Label>
            <Select 
              value={selectedModel} 
              onValueChange={(value: ClaudeModel) => {
                // This is just for UI display, the actual state is managed in parent component
              }}
              disabled
            >
              <SelectTrigger className="bg-black/30 border-gray-700">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent className="bg-black border-gray-700">
                <SelectItem value="claude-3-opus-20240229">Claude 3 Opus</SelectItem>
                <SelectItem value="claude-3-sonnet-20240229">Claude 3 Sonnet</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-400">
              {selectedModel === 'claude-3-opus-20240229' 
                ? "Claude 3 Opus - Advanced AI specialized in creative writing" 
                : "Claude 3 Sonnet - Balanced AI for efficient generation"}
            </p>
          </div>
          
          <Button 
            type="submit"
            className="w-full bg-konform-neon-blue hover:bg-konform-neon-blue/90"
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating ? (
              <>
                <FileText className="mr-2 h-4 w-4 animate-spin" />
                Generating Lyrics...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Lyrics
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
