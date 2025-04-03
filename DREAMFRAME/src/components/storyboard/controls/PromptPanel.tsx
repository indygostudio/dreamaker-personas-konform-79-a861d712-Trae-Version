
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand, Loader2 } from "lucide-react";
import RunwayPromptBuilder from "../RunwayPromptBuilder";

interface PromptPanelProps {
  prompt: string;
  onPromptChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onImageGeneration: () => void;
  isGeneratingImage: boolean;
  selectedServiceName: string;
  isRunwaySelected: boolean;
}

const PromptPanel: React.FC<PromptPanelProps> = ({
  prompt,
  onPromptChange,
  onImageGeneration,
  isGeneratingImage,
  selectedServiceName,
  isRunwaySelected,
}) => {
  const handlePromptGenerated = (generatedPrompt: string) => {
    // Create a synthetic event to pass to the parent's onPromptChange
    const event = {
      target: { value: generatedPrompt }
    } as React.ChangeEvent<HTMLTextAreaElement>;
    
    onPromptChange(event);
  };

  return (
    <div className="space-y-4">
      {isRunwaySelected ? (
        <Tabs defaultValue="builder" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-runway-input">
            <TabsTrigger value="builder" className="data-[state=active]:bg-runway-blue data-[state=active]:text-white">
              Structured Builder
            </TabsTrigger>
            <TabsTrigger value="raw" className="data-[state=active]:bg-runway-blue data-[state=active]:text-white">
              Raw Prompt
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="builder" className="space-y-4">
            <RunwayPromptBuilder 
              basePrompt={prompt}
              onBasePromptChange={onPromptChange}
              onPromptGenerated={handlePromptGenerated}
            />
          </TabsContent>
          
          <TabsContent value="raw" className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Raw Prompt Text
              </label>
              <Textarea
                value={prompt}
                onChange={onPromptChange}
                placeholder="Describe the image you want to generate..."
                className="bg-runway-input border-runway-glass-border resize-none"
                rows={6}
              />
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Image Generation Prompt
          </label>
          <Textarea
            value={prompt}
            onChange={onPromptChange}
            placeholder="Describe the image you want to generate..."
            className="bg-runway-input border-runway-glass-border resize-none"
            rows={6}
          />
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-400">
          Using <span className="text-blue-400">{selectedServiceName}</span>
        </div>
        <Button
          variant="runway"
          disabled={isGeneratingImage || !prompt.trim()}
          onClick={onImageGeneration}
        >
          {isGeneratingImage ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand className="h-4 w-4 mr-2" />
              Generate Image
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PromptPanel;
