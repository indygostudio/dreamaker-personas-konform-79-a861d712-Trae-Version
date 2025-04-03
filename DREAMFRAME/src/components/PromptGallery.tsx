
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check } from "lucide-react";
import { PromptVariation } from "../types/promptTypes";
import { toast } from "sonner";

interface PromptGalleryProps {
  promptVariations: PromptVariation[];
  basePrompt: string;
}

export const PromptGallery = ({ promptVariations, basePrompt }: PromptGalleryProps) => {
  const [copiedIds, setCopiedIds] = useState<string[]>([]);
  
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIds([...copiedIds, id]);
    toast.success("Prompt copied to clipboard!");
    
    setTimeout(() => {
      setCopiedIds(copiedIds.filter(copiedId => copiedId !== id));
    }, 2000);
  };

  // Group prompts by category
  const groupedPrompts = promptVariations.reduce<Record<string, PromptVariation[]>>((acc, prompt) => {
    if (!acc[prompt.category]) {
      acc[prompt.category] = [];
    }
    acc[prompt.category].push(prompt);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Generated Prompts</h2>
      
      <div className="bg-slate-900/40 p-4 rounded-lg mb-6">
        <h3 className="text-sm font-medium text-gray-400 mb-2">Base Prompt</h3>
        <p className="text-gray-200">{basePrompt}</p>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full bg-slate-800 mb-4">
          <TabsTrigger value="all" className="flex-1">All Variations</TabsTrigger>
          {Object.keys(groupedPrompts).map(category => (
            <TabsTrigger key={category} value={category} className="flex-1">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {promptVariations.map((prompt) => (
                <PromptCard 
                  key={prompt.id}
                  prompt={prompt}
                  isCopied={copiedIds.includes(prompt.id)}
                  onCopy={handleCopy}
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        {Object.entries(groupedPrompts).map(([category, categoryPrompts]) => (
          <TabsContent key={category} value={category}>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {categoryPrompts.map((prompt) => (
                  <PromptCard 
                    key={prompt.id}
                    prompt={prompt}
                    isCopied={copiedIds.includes(prompt.id)}
                    onCopy={handleCopy}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

interface PromptCardProps {
  prompt: PromptVariation;
  isCopied: boolean;
  onCopy: (text: string, id: string) => void;
}

const PromptCard = ({ prompt, isCopied, onCopy }: PromptCardProps) => {
  return (
    <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-4 shadow-md">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="inline-block bg-purple-700/60 text-xs rounded px-2 py-1 mb-2">
            {prompt.category}
          </span>
          {prompt.tags.map(tag => (
            <span 
              key={tag} 
              className="inline-block bg-slate-700 text-xs rounded px-2 py-1 ml-2 mb-2 text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-slate-700"
          onClick={() => onCopy(prompt.text, prompt.id)}
        >
          {isCopied ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <p className="text-gray-200">{prompt.text}</p>
    </div>
  );
};
