import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Loader2, FileText, Sparkles } from "lucide-react";
import { piapiService } from '@/services/piapiService';
import { Persona } from '@/types/persona';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

interface TextGenerationTabProps {
  persona?: Persona;
}

export function TextGenerationTab({ persona }: TextGenerationTabProps) {
  const [prompt, setPrompt] = useState('');
  const [maxTokens, setMaxTokens] = useState(500);
  const [temperature, setTemperature] = useState(0.7);
  const [selectedModel, setSelectedModel] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState('');

  const { data: models, isLoading: isLoadingModels } = useQuery({
    queryKey: ['text-models'],
    queryFn: async () => {
      const allModels = await piapiService.getModels();
      return allModels.filter(model => model.type === 'text');
    }
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    if (!selectedModel) {
      toast.error('Please select a model');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await piapiService.generateText({
        model: selectedModel,
        prompt,
        max_tokens: maxTokens,
        temperature
      });
      
      if (result.status === 'complete' && result.text) {
        setGeneratedText(result.text);
        toast.success('Text generated successfully');
      } else if (result.status === 'processing') {
        toast.info('Text is being generated. Check history for results.');
      } else {
        toast.error('Failed to generate text');
      }
    } catch (error) {
      console.error('Error generating text:', error);
      toast.error('Failed to generate text');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Model</label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="bg-black/20 border-dreamaker-purple/30">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingModels ? (
                  <div className="flex items-center justify-center p-2">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading models...
                  </div>
                ) : models?.map(model => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Prompt</label>
            <Textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="bg-black/20 border-dreamaker-purple/30 min-h-[200px]"
              placeholder="Enter your prompt here..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Max Tokens: {maxTokens}</label>
            <Slider 
              value={[maxTokens]} 
              onValueChange={(values) => setMaxTokens(values[0])}
              min={100}
              max={2000}
              step={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Temperature: {temperature.toFixed(1)}</label>
            <Slider 
              value={[temperature * 10]} 
              onValueChange={(values) => setTemperature(values[0] / 10)}
              min={1}
              max={20}
              step={1}
            />
            <p className="text-xs text-gray-400 mt-1">
              Lower values (0.1-0.5) are more focused and deterministic. Higher values (0.7-1.0) are more creative.
            </p>
          </div>

          <Button 
            className="w-full" 
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim() || !selectedModel}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          {generatedText ? (
            <div className="bg-black/30 rounded-lg overflow-hidden border border-dreamaker-purple/20 p-6 h-[600px] overflow-y-auto">
              <pre className="text-gray-200 whitespace-pre-wrap">{generatedText}</pre>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-black/20 rounded-lg border border-dashed border-dreamaker-purple/30 p-8">
              <FileText className="h-16 w-16 text-dreamaker-purple/40 mb-4" />
              <p className="text-gray-400 text-center">
                Generated text will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
